import { Token } from './token.js';
import { Config } from './config.js';

class Base {
    constructor() {
        "use strict";
        this.baseRestUrl = Config.restUrl;
    }

    //http 请求类, 当noRefech为true时，不做未授权重试机制
    request(params, noRefetch) {
        var that = this,
            url=this.baseRestUrl + params.url;
        if(!params.type){
            params.type='get';
        }
        /*不需要再次组装地址*/
        if(params.setUpUrl==false){
            url = params.url;
        }
        uni.request({
            url: url,
            data: params.data,
            method:params.type,
            header: {
                'content-type': 'application/json',
                'token': uni.getStorageSync('token')
            },
            success: function (res) {
                // 判断以2（2xx)开头的状态码为正确
                var code = res.statusCode.toString();
                var startChar = code.charAt(0);
                if (startChar == '2') {
                    params.sCallback && params.sCallback(res.data);
                } else {
                    if (code == '401') {//无权限，token可能失效或者无效，需要重新获取
                        if (!noRefetch) {//初次请求失败才会进行第二次请求，防止进入死循环无限制请求
                            that._refetch(params);
                        }
                    }
                    that._processError(res);
                    params.eCallback && params.eCallback(res.data);
                }
            },
            fail: function (err) {
                //wx.hideNavigationBarLoading();
                that._processError(err);
                // params.eCallback && params.eCallback(err);
            }
        });
    }

    _processError(err){
			uni.showToast({
				title: err,
				icon: "none",
			})
    }

    _refetch(param) {//重新登陆获取最新token
        var token = new Token();
        token.getTokenFromServer((token) => {
            this.request(param, true);
        });
    }
};

export {Base};
