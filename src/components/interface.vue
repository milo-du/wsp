<template>      
</template>
<script>
export default {
    name: 'share',
    components: {

    },
    data() {
        return {
            toastTxt:'',
            qrImg:''
        }
    },
    created() {
        document.title = '邀请';
        parent.parent.fMain(decodeURIComponent(this.getParam('src')));
    },
    watch:{

    },
    methods: {
        showToast: function(txt) {
            this.toastTxt = txt;
            if (this.toastTid != null) {
                clearTimeout(this.toastTid);
            }
            this.toastTid = setTimeout(() => {
                this.toastTxt = '';
                clearTimeout(this.toastTid);
            }, 2000);
        },
        reload:function(){
            window.location.reload();
        },
        loadData:function(){
            this.request({                
                url: 'video/inviteInfo',                
                data: {
                    videoId: this.getParam('id'),
                    fromUserId:this.getParam('fromUserId')
                }
            }).then(function(res) {
                    res = res.data;
                    if (res.ret == 0) {
                        var userInfo = this.getUserInfo();
                        var videoInfo = res.data.videoInfo;                        
                        this.qrImg = `${CONFIG.DOMAIN.API}/tool/qrCode?uid=${userInfo.uid}&token=${userInfo.token}&data=${res.data.qrCodeUrl}`;
                          
                        this.bindWeixinShare({
                          title: videoInfo.shareTitle,
                          desc: videoInfo.shareContent,
                          link:res.data.qrCodeUrl,
                          imgUrl: videoInfo.shareIcon
                        });                        
                    }
                    else{
                        this.showToast(res.msg);
                    }
                }.bind(this),
                function(err) {
                    this.showToast('服务器错误');
                }.bind(this))           
        },
        bindWeixinShare: function(opts) {
          wx.ready(function() {
             var list = [
                 'onMenuShareTimeline',
                 'onMenuShareAppMessage',
                 'onMenuShareQQ',
                 'onMenuShareWeibo',
                 'onMenuShareQZone'
             ];
             for (var i = 0, len = list.length; i < len; i++) {
                wx[list[i]]({
                    title: opts.title,
                    desc: opts.desc,
                    link: opts.link,
                    imgUrl: opts.imgUrl,
                    type: 'link'
                });
              }
            });
           this.initWeixinConfig();
        }, 
        initWeixinConfig:function(){
            this.request({                
                url: 'video/getJsApi',
                data: {
                    jsApiUrl: encodeURIComponent(location.href.split('#')[0])                    
                }
            }).then(function(res) {
                    res = res.data;
                    if (res.ret == 0) {
                      weixinUtils.wxInit(res.data.jsSign);
                    }                 
                }.bind(this),
                function(err) {
                    this.showToast('服务器错误');
                }.bind(this))             
        },       
        showToast: function(txt) {
            this.toastTxt = txt;
            if (this.toastTid != null) {
                clearTimeout(this.toastTid);
            }
            this.toastTid = setTimeout(() => {
                this.toastTxt = '';
            }, 2000);
        },        
        ajax: function(options) {
            options = options || {};
            var url = String(options.url).indexOf('http') === 0 ? options.url : CONFIG.DOMAIN.API + options.url;
            options.url = url;
            options.type = (options.type || "GET").toUpperCase();
            options.dataType = options.dataType || "json";
            var params = formatParams(options.data);

            //创建 - 非IE6 - 第一步
            if (window.XMLHttpRequest) {
                var xhr = new XMLHttpRequest();
            } else { //IE6及其以下版本浏览器
                var xhr = new ActiveXObject('Microsoft.XMLHTTP');
            }
            //连接 和 发送 - 第二步
            if (options.type == "GET") {
                xhr.open("GET", options.url + "?" + params, options.async);
                xhr.send(null);
            } else if (options.type == "POST") {
                xhr.open("POST", options.url, options.async);
                //设置表单提交时的内容类型
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send(params);
            }

            //接收 - 第三步
            if (options.async === true) {
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        callback();
                    }
                }
            }
            if (options.async === false) {
                callback();
            }

            function callback() {
                var status = xhr.status;
                if (status >= 200 && status < 300) {
                    options.success && options.success(xhr.responseText, xhr.responseXML);
                } else {
                    options.fail && options.fail(status);
                }
            }
            //格式化参数
            function formatParams(data) {
                var arr = [];
                for (var name in data) {
                    arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
                }
                arr.push(("v=" + Math.random()).replace(".", ""));
                return arr.join("&");
            }
        },
        getParam:function(n, t){
           var i = new RegExp('(?:^|\\?|#|&)' + n + '=([^&#]*)(?:$|&|#)', 'i'),
              o = i.exec(t || location.href);
           return o ? decodeURIComponent(o[1]) : '';            
        },
        getUserInfo:function(){             
             var userInfo = window.localStorage.getItem('USER_INFO') || {};
             userInfo = JSON.parse(userInfo);             
             return userInfo;
        },
        jumpLogin:function(){
            location.href = CONFIG.DOMAIN.API +'/home/publicity/'+this.videoId;
        },
        request: function(options) {
            options.data = options.data || {};
            var url = options.url;
            if (!options.data.uid || !options.data.token) {
                var userInfo = this.getUserInfo();
                if (userInfo && userInfo.uid && userInfo.token) {
                    options.data.userId = userInfo.uid;
                    options.data.token = userInfo.token;
                }
            }

            if (options.type == 'post') {
                options.emulateJSON = true;                
                return this.$http.post(url, options.data, options).then(function(res) {
                  if (res.body.ret == 1000) {
                    this.jumpLogin();
                  } else {
                    return res;
                  }
                }.bind(this));
            } else {              
                return this.$http.get(url, {
                    params: options.data
                }).then(function(res) {
                   if (res.body.ret == 1000) {
                      this.jumpLogin();
                   } else {
                       return res;
                  }
                }.bind(this));
            }
        }
    }
}
</script>