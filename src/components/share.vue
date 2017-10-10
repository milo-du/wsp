<template>
    <div class="container">
       <dl class="topic_share_card_text">
            <dt>如何玩转邀请卡</dt>
            <dd>1.公开话题/加密话题邀请好友来看直播,榜上有名;</dd>
            <dd>2.长按保存图片或点击右上角"..."发送给好友即可邀请;</dd>
            <dd>3.点击"更换邀请卡主题",切换邀请卡主题样式。</dd>
        </dl>
    </div>
</template>
<script>
export default {
    name: 'share',
    components: {

    },
    data() {
        return {
        }
    },
    created() {
        document.title = '邀请';
        this.loadData();
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

        }, 
        handleOpenRedpack:function(redPacketId){            
            this.request({                
                url: 'redPacket/redPacketReceivePage',
                withToken: true,
                data: {
                    redPacketId: redPacketId
                }
            }).then(function(res) {
                    res = res.data;
                    if (res.ret == 0) {
                       if(res.data.isExpired==1){
                         this.showToast('红包已超过24小时,不能查看！');
                       }else{
                           if(res.data.isReceived==1){
                              this.handleShowReciveRedpacketList(redPacketId);
                           }
                           else{
                             this.isSendEnd = res.data.isSendEnd;
                             this.showOpenRedPackBox = true;     
                             this.redPackInfo = res.data.redPackInfo;
                           }
                       }
                    }
                    else{
                        this.showToast(res.msg);
                    }
                }.bind(this),
                function(err) {
                    this.showToast('服务器错误');
                }.bind(this))            
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
             var userInfo = {
                uid:this.getParam('uid'),
                token:this.getParam('token')
             }
             // var userInfo = window.localStorage.getItem('USER_INFO') || {uid:4,token:'6b66a23682144c04dd60d02ed87645db'};
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
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '../../static/less/share.less';
</style>
