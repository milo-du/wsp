<template>
    <div class="container">
        <swiper :options="swiperOption">
            <swiper-slide v-for="slide in swiperSlides" class="swiper-img-slide">
                <img :src="slide"></swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <div class="video-box">
            <img :src="vedioInfo.img" class="video-cover" v-if="!showPlayer">   
            <a href="javascript:void(0)" class="btn-play" v-if="!showPlayer" @click.prevent="handleShowPlayer">
                <img src="/static/img/play.png"></a>
            <a href="javascript:void(0)" class="videoicon btn-refresh"></a>
            <span class="onlineuser">
                <span class="videoicon seeuser"></span>
                <span class="p-views">5.85万</span>
            </span>
            <video ref="player" v-if="showPlayer" @click.prevent="play" v-on:playing="onPlaying" v-on:pause="onPause" v-on:waiting="onWaiting" v-on:timeupdate="onTimeupdate" :poster="poster" :src="vedioInfo.vodUrl" class="show-audio" loop="true" width="100%" preload="auto" type="video/mp4" playsinline="true" webkit-playsinline="true" x-webkit-airplay="true" x5-video-player-type="h5" x5-video-player-fullscreen="false"></video>
        </div>
        <div class="tab-box">
            <ul class="nav">
                <li v-for="(item,index) in tabData.list">
                    <a href="javascript:void(0)" @click.prevent="handleClickNav(index)" class="on" v-if="item.key==tabData.index">{{item.value}}</a>
                    <a href="javascript:void(0)" @click.prevent="handleClickNav(index)" v-else>{{item.value}}</a>
                </li>
            </ul>
        </div>
        <div class="slide-content">
            <swiper :options="contentSwiperOption" ref="contentSwiper" v-bind:class="{ notransform: tabData.index==0 }">
                <swiper-slide class="tab1" style="height:409px" v-scroll="onScroll">
                    <div class="chat-box" @click.prevent="handleClickChatBox()">
                        <ul class="chat-msg-list">
                           <template v-for="item in commentList">
                            <li class="d-flex" v-if="item.type==2">
                                <div class="marry-chat-content clearfix d-flex">
                                    <img :src="item.userHeadImgUrl" class="userphoto" @error="imageLoadError">
                                    <div class="flex">
                                        <span class="nickname">{{item.userNickName}}</span>
                                        <div class="msg-content">
                                            <img :src="item.pic" class="chat-msg-img"></div>
                                    </div>
                                </div>
                            </li>     
                            <li class="d-flex" v-if="item.type==1">
                                <div class="marry-chat-content clearfix d-flex">
                                    <img :src="item.userHeadImgUrl" class="userphoto" @error="imageLoadError">
                                    <div class="flex">
                                        <span class="nickname">{{item.userNickName}}</span>
                                        <div class="msg-content" v-html="replaceContent(item.content)">
                                        </div>
                                    </div>
                                </div>
                            </li>                 
                            <li class="d-flex" v-if="item.type==3">
                                <div class="marry-chat-content clearfix d-flex">
                                    <img :src="item.userHeadImgUrl" class="userphoto" @error="imageLoadError">
                                    <div class="flex">
                                        <span class="nickname">{{item.userNickName}}</span>
                                        <div class="content-redpacket">
                                            <ul class="bz d-flex rpna-ul hongbao">
                                                <li class="rpna-pic">
                                                    <img src="/static/img/hongbao_ico.png"></li>
                                                <li class="flex">
                                                    <p class="rena-wish">恭喜发财,大吉大利！</p>
                                                    <p class="rena-get">
                                                        <span>领取红包</span>
                                                    </p>
                                                </li>
                                            </ul>
                                            <div class="white-top">直播间红包</div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li class="news-alert-time" v-if="item.type==10">
                                <span>09-13 17:26</span>
                            </li>
                            <li class="recive-redpacket">
                                <span><img class="icon-redpacket" src="/static/img/hongbao_ico.png" />
                                你领取了自己发的一个<em>4.9元红包</em></span>
                            </li>                                                                               
                           </template>
                        </ul>
                    </div>
                    <div class="fix-input-bar">
                        <ul class="op-box">
                            <li class="inputicon qqface" @click.prevent="handleShowQQFaceBox()"></li>
                            <li class="li-input thinborder">
                                <input class="speakInput flex" type="text" v-model="cmtInput" @keydown="handleChooseIcon('[删除]',$event)" placeholder="来说点什么吧..."></li>
                            <li class="inputicon iconmore" @click.prevent="handleShowMoreBox()" v-if="!showSendBtn"></li>
                            <li class="btnLiveTalk" @click.prevent="sendCmt()" v-if="showSendBtn">发送</li>
                        </ul>                        <div class="qq-face-box" v-if="showQQFaceBox">
                            <swiper :options="qqFaceSwiperOption" class="qq-face-swiper">
                                <swiper-slide v-for="(qqFaceSlide,index) in qqIconData" class="swiper-qq-face-slide">
                                    <template v-for="(qqIcon,childIndex) in qqFaceSlide">
                                        <span> <i class="qqface-img" v-if="qqIcon=='[删除]'" v-bind:data-code="qqIcon" style="background-position: left -4620px;" @click.prevent="handleChooseIcon(qqIcon)"></i> <i class="qqface-img" v-else v-bind:data-code="qqIcon" :style="{ backgroundPosition:'left '+(-(660*index+childIndex*33))+'px' }" @click.prevent="handleChooseIcon(qqIcon)"></i>
                                        </span>
                                    </template>
                                </swiper-slide>
                                <div class="swiper-pagination qqFace-swiper-pagination" slot="pagination"></div>
                            </swiper>
                        </div>
                        <div class="morebutton" v-if="showMoreBox">
                            <ul class="morebutton-wrap">
                                <li>
                                    <a href="javascript:void(0)" class="inputicon redpacket" @click.prevent="handleShowRedBagBox"></a>
                                    <p>红包</p>
                                </li>
                                <li>
                                    <a href="javascript:void(0)" class="inputicon photo"></a>
                                    <p>图片</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="toolmenu">
                        <div class="rel side-icon">
                            <!--优惠券-->                
                            <div class="animation-shake youhuiquan"></div>
                            <!--打赏对象-->                
                            <a class="icon-live-yaoqing" href="/live/ShowExclusiveInvitaCard?topicId=281894"></a>
                            <a class="shangzhubo onlybtn icon-live-shang"></a>
                            <div v-bind:class="{'zan-box': true, 'icon-live-zan':true, 'icon-zan-bigger': liked}">
                                <a class="zan-click" href="javascript:void(0);" @click.prevent="handleLike"><em class="zan"><i class="iconfont"></i></em>
                                </a>                                
                            </div>
                            <span class="number zan-num" id="userpraise">430</span>
                        </div>
                    </div>
                </swiper-slide>
                <swiper-slide class="tab2">
                    <h2>直播介绍</h2>
                    <div class="detail-intro">
                        <p>
                            1 根据网络投票，进行出场顺序。投票最少的，最先开始比赛。
                            <br>    
                            2 第一轮演唱，每位选手演唱一首完整的歌。
                            <br>    
                            3 大众评审对选手进行投票，每位选手代表1票，共30票。
                            <br>    
                            4 三位评委进行投票，每位评委代表30票。
                            <br>    
                            5 第一轮结束后，按得票排名，排名前十位进入十强。
                            <br>    
                            6 其中，得票前两位这，直接进入巅峰对决。
                            <br>    
                            7得票排名最后的十五位直接淘汰。
                            <br>    
                            8 剩下八位选手依次清唱1分钟，评委选出3人，进入终极5人巅峰对决。
                            <br>    
                            9 此刻网络投票通道关闭。进入巅峰对决
                            <br>    
                            10 巅峰对决5位选手演依次演唱终极曲目。
                            <br>    
                            11 根据5位选手的演唱，依次进行打分，分数依次进行对比。
                            <br>12 最终留在台上的3位，就是南昌站三强。</p>
                    </div>
                </swiper-slide>
                <swiper-slide class="tab3">
                    <ul class="tab3-title">
                        <li>
                            <a href="javascript:void(0)" @click.prevent="handleSwitchNav(0)" v-bind:class="{ on: isActive==0 }">邀请榜</a>
                        </li>
                        <li>
                            <a href="javascript:void(0)" @click.prevent="handleSwitchNav(1)" v-bind:class="{ on: isActive==1 }">打赏榜</a>
                        </li>
                    </ul>
                    <swiper :options="listSwiperOption" ref="listSwiper">
                        <swiper-slide class="list-tab1">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" class="table-banglist">
                                <tbody>
                                    <tr>
                                        <td style="width:0.45rem;" class="banglist-num">
                                            <img src="/static/img/list-1.png" class="banglist-tag"></td>
                                        <td style="width:0.6rem;">
                                            <img class="banglist-photo" src="http://wx.qlogo.cn/mmopen/7hINACNJlZjQmHibJCwAVwByFxpYMboynhNSUncRUvvBPxFsKBvCNwV28uMW5OG60daPTDy6jeYHgicibr5fWGNI7eibQHryy4s7/132"></td>
                                        <td width="40%">
                                            <span class="banglist-nickname">????诺</span>
                                        </td>
                                        <td align="right">
                                            <span class="banglist-money">
                                                邀请 <em>130</em>
                                                人
                                            </span>
                                        </td>
                                    </tr>        
                                </tbody>
                            </table>
                        </swiper-slide>
                        <swiper-slide class="list-tab2">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" class="table-banglist">
                                <tbody>
                                    <tr>
                                        <td style="width:0.45rem;" class="banglist-num">
                                            <img src="/static/img/list-1.png" class="banglist-tag"></td>
                                        <td style="width:0.6rem;">
                                            <img class="banglist-photo" src="http://wx.qlogo.cn/mmopen/7hINACNJlZjQmHibJCwAVwByFxpYMboynhNSUncRUvvBPxFsKBvCNwV28uMW5OG60daPTDy6jeYHgicibr5fWGNI7eibQHryy4s7/132"></td>
                                        <td width="40%">
                                            <span class="banglist-nickname">????诺</span>
                                        </td>
                                        <td align="right">
                                            <span class="banglist-money">
                                                <em>¥175.68</em>
                                            </span>
                                        </td>
                                    </tr>        
                                </tbody>
                            </table>                           
                        </swiper-slide>
                    </swiper>
                </swiper-slide>
                <swiper-slide class="tab4">
                    <p>
                        &nbsp; &nbsp; &nbsp; <b>江西微彩传媒有限公司</b>
                        是一家专业提供各行业视频直播的传媒公司。公司的直播平台基于微信端平台，看直播无需下载APP，无需充值就可以直接用微信零钱收发红包，在直播间粉丝可以评论、打赏红包及礼物，同时还有投票、抽奖等等功能。其中一些特定行业还有专属模板，这个平台就类似一家小型电视台。2017年将是直播大年，直播将会是文化公司，传媒公司，婚庆公司等等必备的一大武器。加入我们，让你企业形象声名远扬。合作咨询电话：18779291518王
                    </p>
                </swiper-slide>
            </swiper>
        </div>
        <div class="follow-box" v-if="showFollowBox">
            <div class="pop-mask" @click.prevent="handleCloseFollowBox"></div>
            <div class="popup" @click.prevent="handleCloseFollowBox">
                <div class="popup-head">
                    <h3 class="popup-title">
                        长按关注 <strong class="balanced" style="font-weight:bold">微彩南昌 现场直播</strong>
                        公众号
                    </h3>
                </div>
                <div class="popup-body">
                    <img src="https://gss0.bdstatic.com/94o3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=7bcb659c9745d688a302b5a29cf91a23/2934349b033b5bb571dc8c5133d3d539b600bc12.jpg">        
                    <p>关注后可收到直播最新动态哦</p>
                </div>
            </div>
        </div>
        <div class="sendredbagwin" v-if="showRedBagBox">
            <div class="redbagmask" @tap.prevent="handleCloseRedBagBox"></div>
            <div class="sendredbagwinmain layui-m-anim-scale">
                <div id="msg-tipbar"></div>
                <ul>
                    <li class="d-flex line vcenter">
                        <span>红包个数</span>
                        <input type="number" placeholder="填写红包个数,最多500个" max="500" class="flex inputbox" id="bagAmount" min="0">        
                        <span>个</span>
                    </li>
                    <li class="d-flex line vcenter">
                        <span class="totalmoney">
                            总金额 <i><img src="/static/img/redpacketping.png"></i>
                        </span>
                        <input type="number" placeholder="填写金额" class="flex inputbox" id="bagMoney" min="0">        
                        <span>元</span>
                    </li>
                    <li class="d-flex line vcenter" style="display:none;height:3.4rem;">
                        <span class="flex">发送时间</span>
                        <input class="weui-input" style="text-align:right; width:15rem;" type="datetime-local" id="redbagpresendtime" value="2017-09-14T17:20" min="2017-09-14T17:14"></li>

                    <li class="d-flex">
                        <a href="javascript:void(0);" class="btn-cancel flex">取消</a>
                        <div style="width:20px;"></div>
                        <input type="button" disabled="disabled" class="livebtn red flex" id="btnSendRedBag" value="塞钱进红包"></li>
                </ul>
            </div>
        </div>
        <div class="recive-redpacket-box">
            <div class="pop-mask" @click.prevent="handleCloseReciveRedpacketBox"></div>
            <div class="popup" @click.prevent="handleCloseReciveRedpacketBox">
               <img src="/static/img/defaultuser.jpg" class="user-photo">
               <div class="content-info">
                  <p class="nickname">sunc的红包<em>拼</em></p>
                  <p class="money">4.90元</p>
                  <div class="readpacket-title">一个红包共4.9元</div>
                  <ul class="user-list">
                      <li class="flex user-item">
                         <div class="user-item-photo">
                           <img src="/static/img/defaultuser.jpg">
                         </div>
                         <div class="user-info">
                             <span class="nick-name">suncz</span>
                             <span class="time">2017-08-14 22:19:12</span>
                         </div>
                         <div class="money-box">
                           <span class="money">4.90</span>
                         </div>
                      </li>
                  </ul>
               </div>               
            </div>
        </div>            
    </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import qqfaceJson from "../qqfaceJson.js";
export default {
    name: 'home',
    components: {
      swiper,
      swiperSlide
    },
    data() {
        return {
            heartStyle:{
                opacity: "1",
                transform: "translate3d(0px, 0px, 0px)"
            },
            liked: false,
            testHtml:"[微笑]aaaa[撇嘴]bbb",
            showQQFaceBox:false,
            showMoreBox:false,
            showSendBtn:false,
            showRedBagBox:false,            
            cmtInput:'',
            contentSwiperIndex:0,
            playing: false,
            vedioInfo:{},
            poster: 'http://res.heyhou.com/image/2017/07/09/edfee97952303f86774131d1cecf73b1.jpg?imageView2/1/w/375/h/180',
            remoteUrl: 'http://res.heyhou.com/mp4/2017/08/30/783905f1fe7de28a542898ba7ebc79da.mp4',
            swiperOption: {
                autoplay: 3500,
                setWrapperSize: true,
                pagination: '.swiper-pagination',
                paginationClickable: true,
                mousewheelControl: true,
                observeParents: true
            },
            contentSwiperOption: {
                setWrapperSize: true,                
                paginationClickable: true,
                mousewheelControl: true,
                observeParents: true,
                onSlideChangeEnd: function(swiper) {
                    var activeIndex = swiper.activeIndex;
                    this.tabData.index = activeIndex;                
                }.bind(this)
            },
            listSwiperOption: {
                setWrapperSize: true,                
                paginationClickable: true,
                mousewheelControl: true,
                observeParents: true,
                onSlideChangeEnd: function(swiper) {
                    var activeIndex = swiper.activeIndex;                    
                    this.isActive = activeIndex;
                }.bind(this)
            },
            qqFaceSwiperOption:{
                setWrapperSize: true,                
                paginationClickable: false,
                pagination: '.swiper-pagination',
                mousewheelControl: true,
                observeParents: true                      
            },     
            showPlayer: false,
            swiperSlides: ['http://res.heyhou.com/image/2017/07/09/edfee97952303f86774131d1cecf73b1.jpg?imageView2/1/w/375/h/180', 'http://res.heyhou.com/image/2017/07/28/18a4309efed43ce8451994f3f667a241.jpg?imageView2/1/w/375/h/180'],
            video: {
                width: 360,
                height: 640
            },
            tabData: {
                list: [{
                    key: 0,
                    value: '互动'
                }, {
                    key: 1,
                    value: '介绍'
                }, {
                    key: 2,
                    value: '榜单'
                },{
                    key: 3,
                    value: '合作'
                }, {
                    key: 4,
                    value: '关注'
                }],
                index:0
            },
            showFollowBox:false,
            isActive:0,
            qqIconData:qqfaceJson.data,
            videoId:18,
            commentList:[]
        }
    },
    created() {
        document.title = '首页';
        this.loadData();
    },
    watch:{
        'cmtInput': function(c, o) {
            if (c.length != 0) {
                this.showSendBtn = true;
            } else {
                this.showSendBtn = false;
            }
        }
    },
    methods: {
        replaceContent: function (content) {
           if (!content) return '';
           var imgList = qqfaceJson.imgList,
             newContent = content;
           for (var i = 0; i < imgList.length; i++) {
            newContent = newContent.replace(imgList[i].key,"<img src='"+imgList[i].value+"' class='qq-face-gif' />");
          }            
          return newContent;
        },
        imageLoadError: function(e) {
           e.target.src = '/static/img/defaultuser.jpg';
        },
        handleShowPlayer:function(){
            this.showPlayer = true;
        },
        handleLike:function(){
           this.liked=true; 
           setTimeout(function(){
               this.liked=false;
           }.bind(this),200);
        },
        handleCloseReciveRedpacketBox:function(){

        },
        handleCloseRedBagBox:function(){
            this.showRedBagBox = false;
        },
        handleShowRedBagBox:function(){
            this.showRedBagBox = true;
        },        
        handleShowQQFaceBox:function(){
            this.showMoreBox = false;
            this.showQQFaceBox = this.showQQFaceBox ? false : true;
        },
        handleClickChatBox:function(){
            this.showMoreBox = false;
            this.showQQFaceBox = false;
        },
        handleShowMoreBox: function() {
            this.showQQFaceBox = false;
            this.showMoreBox = this.showMoreBox ? false : true;
        },
        sendCmt:function(){
           
        },
        handleChooseIcon: function(iconCode, event) {
            if (event) {
                if (event.keyCode != 8) {
                    return;
                } else {
                    event.preventDefault();
                }
            }
            var cmtInput = this.cmtInput;
            if (iconCode != '[删除]') {
                cmtInput += iconCode;
            } else {
                var lastChar = cmtInput.substr(cmtInput.length - 1, 1);
                if (lastChar == ']') {
                    cmtInput = cmtInput.substr(0, cmtInput.lastIndexOf('['));
                } else {
                    cmtInput = cmtInput.substr(0, cmtInput.length - 1);
                }
            }
            this.cmtInput = cmtInput;
        },
        handleCloseFollowBox:function(){
          this.showFollowBox = false;
        },   
        handleClickNav:function(index){ 
           if(index < 4 ){             
             this.$refs.contentSwiper.swiper.slideTo(index);
             this.tabData.index = index;
           }else{
              this.showFollowBox = true;
           }                 
        },
        handleSwitchNav:function(index){
           this.isActive = index;
           this.$refs.listSwiper.swiper.slideTo(index);
        },
        play: function() {
            if (this.$refs.player.paused) {
                this.$refs.player.play();
                this.playing = true;
            } else {
                this.playing = false;
                this.$refs.player.pause();
            }
            document.getElementsByTagName("body")[0].className = "noscroll";
        },
        onDoPlay: function() {
            if (!this.videoShow) {
                this.videoShow = true;
                var that = this;
                this.$nextTick(function() {
                    that.play();
                });
            } else {
                this.play();
            }
        },
        onPlaying: function() {
            this.playing = true;
            this.loading = false;
        },
        onPause: function() {
            this.playing = false;
            this.videoShow = false;
            document.getElementsByTagName("body")[0].className = "";
        },
        onWaiting: function() {
            this.loading = true;
        },
        onTimeupdate: function() {
            if (this.$refs.player.currentTime > 0 && this.maskShow) {
                this.maskShow = false;
            }
        },
        loadData(){
            this.loadVideo();
            this.loadComment();
        },
        loadVideo() {
            this.$http.get('video/detail', {
                params: {
                    videoId: this.videoId                  
                }
            }).then(function(response) {
                return response.json();
            }).then(response => {                
                if (response.ret == 0) {                    
                  this.vedioInfo = response.data.vedioInfo;
                } else {
                  
                }
            }, response => {

            });
        },
        loadComment(){
            this.$http.get('commentNew/commentList', {
                params: {
                    videoId: this.videoId,
                    type:'new',
                    commentId:0
                }
            }).then(function(response) {
                return response.json();
            }).then(response => {                
                if (response.ret == 0) {
                  this.commentList=response.data;
                } else {
                  
                }
            }, response => {

            });                        
        },
        onScroll:function(e, position){
          console.log(position);
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '../../static/less/home.less';
</style>
