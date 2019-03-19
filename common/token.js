import { Config } from './config.js';

class Token {
    constructor() {
        this.verifyUrl = Config.restUrl + 'token/verify';  //校验Token是否有效
        this.tokenUrl = Config.restUrl + 'token/user';     //生成你的Token
    }

    verify() {
        var token = uni.getStorageSync('token');
        if (!token) {
            this.getTokenFromServer();
        }
        else {
            this._veirfyFromServer(token);
        } 
    }

    _veirfyFromServer(token) {
        var that = this;
        uni.request({
            url: that.verifyUrl,
            method: 'POST',
            data: {
                token: token
            },
            success: function (res) {
                var valid = res.data.isValid;
                if(!valid){
                    that.getTokenFromServer();
                }else{
									uni.setStorageSync('userinfo', res.data.userinfo);
								}
            }
        })
    }

    getTokenFromServer(callBack) {//重新登陆获取token
        var that  = this;
				if(true){/*小程序登陆*/
					uni.login({
							success: function (res) {
									uni.request({
											url: that.tokenUrl,
											method:'POST',
											data:{
													code:res.code
											},
											success:function(res){
													uni.setStorageSync('token', res.data.token);
													callBack&&callBack(res.data.token);
											}
									})
							}
					})
				}else{//账号密码登陆或者第三方QQ微信openid登陆
					try {   //初次登陆时就在本地存储登陆方式以及登陆凭证
								let phone_number = uni.getStorageSync('phone_number').trim();
								let pass_word = uni.getStorageSync('pass_word').trim();
								let openid = uni.getStorageSync('openid').trim();
								uni.request({
										url: config.restUrl +'login/phone',
										data: {
											"phone_number": phone_number,
											"pass_word": pass_word,
											"openid": openid
										},
										method:	'POST',
										header: {
											'content-type': 'application/json'
										},
										success: (res) => {//登陆成功重新缓存本地token
											uni.setStorageSync('token', res.data.token);
											callBack&&callBack(res.data.token);
										},
								})
							} catch (e) {
						console.log(e)
					}
				}
    }
}

export {Token};