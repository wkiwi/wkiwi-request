### wkiwi-request 封装request token权限判别


**使用方式：**

在 ``main.js`` 中引用base.js

```javascript
import {Base} from './common/js/base.js';
Vue.prototype.$base =  new Base();
全局挂载
```

一般用法

```js
    let _this = this;
    var allParams = {
        url: '/goods/list?page='+ _this.page,//地址为Config.restUrl拼接地址 
        setUpUrl: true, //不需要拼接请设置为false 
        type: 'get', //请求类型
        sCallback: function (data) {
            console.log(data)
        },
        eCallback: function () {
        }
    };
    console.log(_this.$base)
    _this.$base.request(allParams);
```


```

class Config{
    constructor(){

    }
}

// Config.restUrl = '本地API地址';
Config.restUrl ='线上API地址';
export {Config};

可切换本地地址活线上地址

```

```
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
                        method: 'POST',
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


    登陆方式自己选择此处为伪代码
```

一般情况下的请求应该可以满足的。
如各位有更好方案欢迎反馈。
