<template>
    <div class="container">
        <swiper :options="swiperOption" v-if="false" ref="bannerSwiper">
            <swiper-slide v-for="slide in swiperSlides" class="swiper-img-slide">
                <img :src="slide"></swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <div class="video-box" ref="videoBox">
            <img :src="vedioInfo.img" class="video-cover" v-if="!showPlayer">
            <a href="javascript:void(0)" class=

            "btn-play" v-if="!showPlayer" @click.prevent="handleShowPlayer">
                <img src="/static/img/play.png"></a>
            <a href="javascript:void(0)" class="videoicon btn-refresh" @click.prevent="reload()"></a>
            <span class="onlineuser">
                <span class="videoicon seeuser"></span>
                <span class="p-views">{{vedioInfo.pvNum || 0}}</span>
            </span>
            <div class="video-zan-box">
                <div v-bind:class="{'zan-box': true, 'icon-live-zan':true, 'icon-zan-bigger': liked}">
                    <a class="zan-click" href="javascript:void(0);" @click.prevent="handleLike"> <em class="zan"><i class="iconfont"></i></em> 
                    </a>
                </div>
                <span class="number zan-num" id="userpraise">{{vedioInfo.praiseNum || 0}}</span>                
            </div>
            <video ref="player" v-if="showPlayer" controls="controls" @click.prevent="play" v-on:playing="onPlaying" v-on:pause="onPause" v-on:waiting="onWaiting" v-on:timeupdate="onTimeupdate" :poster="vedioInfo.img" :src="vedioInfo.vodUrl" class="show-audio" loop="true" width="100%" preload="auto" type="application/x-mpegURL" playsinline="true" webkit-playsinline="true" x-webkit-airplay="true" x5-video-player-type="h5" x5-video-player-fullscreen="true"></video>
        </div>
        <div class="tab-box" ref="tabBox">
            <ul class="nav">
                <li v-for="(item,index) in tabData.list">
                    <a href="javascript:void(0)" @click.prevent="handleClickNav(index)" class="on" v-if="item.key==tabData.index">{{item.value}}</a>
                    <a href="javascript:void(0)" @click.prevent="handleClickNav(index)" v-else>{{item.value}}</a>
                </li>
            </ul>
        </div>
        <div class="fix-input-bar" ref="fixInputBar" v-if="tabData.index==0">
            <ul class="op-box">
                <li class="inputicon qqface" @click.prevent="handleShowQQFaceBox()"></li>
                <li class="li-input thinborder">
                    <input class="speakInput flex" ref="chatInput" type="text" v-model="cmtInput" @keydown="handleChooseIcon('[删除]',$event)" placeholder="来说点什么吧..." @click="handleInputClick"></li>
                <li class="inputicon iconmore" @click.prevent="handleShowMoreBox()" v-if="!showSendBtn"></li>
                <li class="btnLiveTalk" @click.prevent="sendCmt" v-if="showSendBtn">发送</li>
            </ul>
            <div class="qq-face-box" v-if="showQQFaceBox">
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
                    <li id="pickfiles-container">
                        <a href="javascript:void(0)" class="inputicon photo" id="choose-img"></a>
                        <p>图片</p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="toolmenu" v-if="tabData.index==0">
            <div class="rel side-icon">
                <!--优惠券-->
                <div class="animation-shake youhuiquan"></div>
                <!--打赏对象-->
                <a class="icon-live-yaoqing" href="/share"></a>
                <a class="shangzhubo onlybtn icon-live-shang" @click.prevent="handleShowRewardRedpacket"></a>
            </div>
        </div>
        <div class="slide-content">
            <swiper :options="contentSwiperOption" ref="contentSwiper" v-bind:class="{ notransform: tabData.index==0 }">
                <swiper-slide class="tab1" ref="tab1" v-bind:style="{ height: scrollBoxHeight + 'px' }" v-scroll="onScroll">                    
                        <ul class="chat-msg-list"  @click.prevent="handleClickChatBox()">
                                <li class="d-flex" v-if="loadingChat">
                                    <img src="/static/img/loading-chat.gif" class="loading-gif">
                                </li>
                            <template v-for="item in commentList">
                                <li class="d-flex" v-if="item.type==2">
                                    <div class="marry-chat-content clearfix d-flex">
                                        <img :src="item.userHeadImgUrl" class="userphoto" @error="imageLoadError">
                                        <div class="flex">
                                            <span class="nickname">{{item.userNickName}}</span>
                                            <div class="msg-content">
                                                <img :src="item.pic" class="chat-msg-img" @click.prevent="handlePrivewImg(item.pic)"></div>
                                        </div>
                                    </div>
                                </li>
                                <li class="d-flex" v-if="item.type==1">
                                    <div class="marry-chat-content clearfix d-flex">
                                        <img :src="item.userHeadImgUrl" class="userphoto" @error="imageLoadError">
                                        <div class="flex">
                                            <span class="nickname">{{item.userNickName}}</span>
                                            <div class="msg-content" v-html="replaceContent(item.content)"></div>
                                        </div>
                                    </div>
                                </li>
                                <li class="d-flex" v-if="item.type==3">
                                    <div class="marry-chat-content clearfix d-flex">
                                        <img :src="item.userHeadImgUrl" class="userphoto" @error="imageLoadError">
                                        <div class="flex">
                                            <span class="nickname">{{item.userNickName}}</span>
                                            <div class="content-redpacket" @click.prevent="handleOpenRedpack(item.redPacketId)">
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
                                    <span>{{item.content}}</span>
                                </li>
                                <li class="recive-redpacket" v-if="item.type==4 && (userInfo.uid == item.redPacketUserId || userInfo.uid == item.userId)">
                                    <span>
                                        <img class="icon-redpacket" src="/static/img/hongbao_ico.png" />
                                        <template v-if="userInfo.uid == item.redPacketUserId">
                                          {{item.userNickName}}领取了您发的一个
                                        </template>
                                        <template v-else-if="userInfo.uid == item.userId">
                                            您领取了{{item.redPacketUserNickName}}发的一个
                                        </template>                                    
                                        <em @click.prevent="handleShowReciveRedpacketList(item.redPacketId)">红包</em>
                                    </span>
                                </li>
                            </template>
                        </ul>                    
                </swiper-slide>
                <swiper-slide class="tab2" v-bind:style="{ height: scrollBoxHeight2 + 'px' }">
                    <h2>直播介绍</h2>
                    <div class="detail-intro cooperation-html" v-html="vedioInfo.introduce">
                    </div>
                </swiper-slide>
                <swiper-slide class="tab3" v-bind:style="{ height: scrollBoxHeight2 + 'px' }">
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
                                    <tr v-for="(item,index) in inviteRankList">
                                        <td style="width:0.45rem;" class="banglist-num">
                                            <img v-bind:src="'/static/img/list-' + (index+1)+'.png'" class="banglist-tag" v-if="index<3">
                                            <span class="rolwnum" v-else>{{index+1}}</span>
                                        </td>
                                        <td style="width:0.6rem;">
                                            <img class="banglist-photo" :src="item.headImgUrl"></td>
                                        <td width="40%">
                                            <span class="banglist-nickname">{{item.nickname}}</span>
                                        </td>
                                        <td align="right">
                                            <span class="banglist-money">
                                                邀请
                                                <em>{{item.num}}</em>
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
                                    <tr v-for="(item,index) in rewardRankList">
                                        <td style="width:0.45rem;" class="banglist-num">
                                            <img v-bind:src="'/static/img/list-' + (index+1)+'.png'" class="banglist-tag" v-if="index<3">
                                            <span class="rolwnum" v-else>{{index+1}}</span>
                                        </td>
                                        <td style="width:0.6rem;">
                                            <img class="banglist-photo" :src="item.headImgUrl"></td>
                                        <td width="40%">
                                            <span class="banglist-nickname">{{item.nickname}}</span>
                                        </td>
                                        <td align="right">
                                            <span class="banglist-money">
                                                <em>¥{{item.money}}</em>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </swiper-slide>
                    </swiper>
                </swiper-slide>
                <swiper-slide class="tab4" v-bind:style="{ height: scrollBoxHeight2 + 'px' }">
                    <div v-html="cooperation" class="cooperation-html"></div>
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
            <div class="redbagmask" @click.prevent="handleHideSendRedPacketBox"></div>
            <div class="sendredbagwinmain layui-m-anim-scale">
                <div id="msg-tipbar" v-if="showSendRedBagErr.length>0">{{showSendRedBagErr}}</div>
                <ul>
                    <li class="d-flex line vcenter">
                        <span>红包个数</span>
                        <input type="tel" v-model="sendRedPacketData.num" placeholder="填写红包个数,最多500个" max="500" class="flex inputbox" id="bagAmount" min="0">
                        <span>个</span>
                    </li>
                    <li class="d-flex line vcenter">
                        <span class="flex">红包类型：{{sendRedPacketData.type==1?'普通红包':'人气红包'}}</span>
                        <a href="javascript:void(0)" class="change-redpack-type" @click.prevent="handleChangeRedpackType">切换</a>
                    </li>
                    <li class="d-flex line vcenter">
                        <span class="totalmoney">
                            总金额
                            <i v-if="sendRedPacketData.type!=1"><img src="/static/img/redpacketping.png"></i>
                        </span>
                        <input type="number" v-model="sendRedPacketData.money" placeholder="填写金额" class="flex inputbox" id="bagMoney" min="0">
                        <span>元</span>
                    </li>
                    <li class="d-flex">
                        <a href="javascript:void(0);" class="btn-cancel flex" @click.prevent="handleHideSendRedPacketBox">取消</a>
                        <div style="width:20px;"></div>
                        <input type="button" :disabled="sendRedPacketBtn" class="livebtn red flex" id="btnSendRedBag" value="塞钱进红包" @click.prevent="handleSendRedPacket"></li>
                </ul>
            </div>
        </div>
        <div class="recive-redpacket-box" v-if="showReciveRedpacketList">
            <div class="pop-mask" @click.prevent="handleHideReciveRedpacketList"></div>
            <div class="popup">
                <img :src="reciveRedpacketData.redPackInfo && reciveRedpacketData.redPackInfo.headImgUrl" @error="imageLoadError" class="user-photo">
                <a href="javascript:void(0)" class="close-redpack-btn" @click.prevent="handleHideReciveRedpacketList"></a>
                <div class="content-info">
                    <p class="nickname">
                        {{reciveRedpacketData.redPackInfo && reciveRedpacketData.redPackInfo.nickName}}的红包
                        <em v-if="reciveRedpacketData.redPackInfo && reciveRedpacketData.redPackInfo.type=='2'">拼</em>
                    </p>
                    <p class="money">{{reciveRedpacketData.userReceiveMoney}}元</p>
                    <div class="readpacket-title">{{reciveRedpacketData.displayWord}}</div>
                    <ul class="user-list">
                        <li class="flex user-item" v-for="item in reciveRedpacketData.redPacketLogList">
                            <div class="user-item-photo">
                                <img :src="item.receiverUserheadImgUrl" @error="imageLoadError"></div>
                            <div class="user-info">
                                <span class="nick-name">{{item.receiverUserNickName}}</span>
                                <span class="time">{{item.ReceiveTime}}</span>
                            </div>
                            <div class="money-box">
                                <span class="redpack-money">{{item.receiveMoney/100}}元</span>
                                <span class="best-tip" v-if="item.isBestLuck==1">
                                    <em>手气最佳</em>
                                    <img src="/static/img/best.png" class="best-img"></span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="reward-redpacket-box" v-if="showRewardRedpacketBox">
            <div class="pop-mask" @click.prevent="handleHideRewardRedpacket"></div>
            <div class="popup">
                <img src="/static/img/defaultuser.jpg" class="user-photo">
                <a href="javascript:void(0)" class="close-redpack-btn" @click.prevent="handleHideRewardRedpacket"></a>
                <div class="content-info">
                    <p class="nickname">小彩旗</p>
                    <p class="p2">爱赞赏的人，运气不会太差~</p>
                    <ul class="flex money-select-list">
                        <li class="item-select-money" @click.prevent="handleSubmitRewardOtherMoney(2)">
                            <em>2</em>
                            元
                        </li>
                        <li class="item-select-empty"></li>
                        <li class="item-select-money" @click.prevent="handleSubmitRewardOtherMoney(5)">
                            <em>5</em>
                            元
                        </li>
                        <li class="item-select-empty"></li>
                        <li class="item-select-money" @click.prevent="handleSubmitRewardOtherMoney(10)">
                            <em>10</em>
                            元
                        </li>
                    </ul>
                    <ul class="flex money-select-list">
                        <li class="item-select-money" @click.prevent="handleSubmitRewardOtherMoney(20)">
                            <em>20</em>
                            元
                        </li>
                        <li class="item-select-empty"></li>
                        <li class="item-select-money" @click.prevent="handleSubmitRewardOtherMoney(50)">
                            <em>50</em>
                            元
                        </li>
                        <li class="item-select-empty"></li>
                        <li class="item-select-money" @click.prevent="handleSubmitRewardOtherMoney(100)">
                            <em>100</em>
                            元
                        </li>
                    </ul>
                    <a href="javascript:void(0)" class="other-money-btn" @click.prevent="handleShowRewardOtherMoneyBox">其他金额</a>
                </div>
            </div>
        </div>
        <div class="reward-other-money-box" v-if="showRewardOtherMoneyBox">
            <div class="pop-mask" @click.prevent="handleHideRewardOtherMoneyBox"></div>
            <div class="popup">
                <p class="p-title">其他金额</p>
                <div class="flex input-box">
                    <span>金额(元)</span>
                    <input type="tel" placeholder="可填写2-100" v-model="rewardMoney"></div>
                <a href="javascript:void(0)" class="btn-sure" @click.prevent="handleSubmitRewardOtherMoney">确定</a>
            </div>
        </div>
        <div class="open-redpack-box" v-if="showOpenRedPackBox">
            <div class="pop-mask"></div>
            <div class="popup">
                <a href="javascript:void(0)" class="close-redpack-btn" @click.prevent="handleCloseOpenRedpacketBox"></a>
                <a href="javascript:void(0)" v-if="isSendEnd==0" class="open-redpack-btn" @click.prevent="handleOpenRedpacket">
                    <img src="/static/img/open.png"></a>
                <img :src="redPackInfo.headImgUrl" @error="imageLoadError" class="user-photo">
                <p class="p-title">{{redPackInfo.nickName}}</p>
                <template v-if="isSendEnd==0">
                    <p class="p-title2">发了一个红包，金额随机</p>
                    <p class="p-title3">恭喜发财，大吉大利！</p>
                </template>
                <template v-else>
                    <p class="p-title3">手慢了，红包派完了</p>
                </template>
                <a href="javascript:void(0)" class="btn-sure" @click.prevent="handleShowReciveRedpacketList()">看看大家的手气></a>
            </div>
        </div>
        <div class="load-box" v-if="showLoading">
            <div class="pop-mask"></div>
            <img src="/static/img/loading.gif" class="loadimg"></div>
        <div class="toast-box" v-if="toastTxt.length>0">
            <div class="pop-mask"></div>
            <span class="toast-text">{{toastTxt}}</span>
        </div>
    </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import weixinUtils from "../weixinUtils.js";
import qqfaceJson from "../qqfaceJson.js";
export default {
    name: 'home',
    components: {
      swiper,
      swiperSlide
    },
    data() {
        return {
            toastTid:null,
            toastTxt:'',
            showOpenRedPackBox:false,
            showLoading:false,
            scrollBoxHeight:0,
            scrollBoxHeight2:0,
            cooperation:'',
            heartStyle:{
                opacity: "1",
                transform: "translate3d(0px, 0px, 0px)"
            },
            liked: false,            
            showQQFaceBox:false,
            showMoreBox:false,
            showSendBtn:false,
            showRedBagBox:false,            
            cmtInput:'',
            contentSwiperIndex:0,
            playing: false,
            vedioInfo:{},                        
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
            videoId:this.getParam('videoId'),
            commentList:[],
            sendRedPacketData:{                
                type:1,
                num:'',
                money:'',
                codeWord:''
            },
            rewardRankList:[],
            inviteRankList:[],
            sendRedPacketBtn:true,
            showSendRedBagErr:'',
            isSendEnd:1,
            redPackInfo:{},
            showRewardRedpacketBox:false,
            showRewardOtherMoneyBox:false,
            rewardMoney:'',
            showReciveRedpacketList:false,
            reciveRedpacketData:{},
            loadingChat:true,
            userInfo:{}
        }
    },
    created() {
        document.title = '首页';
        this.loadData();
        this.resetChatBox();        
        window.addEventListener('resize', function() {     
          this.resetChatBox();
        }.bind(this), false);
        setInterval(()=>{
            this.loadComment('new');
        },3000);        
    },
    watch:{
        'cmtInput': function(c, o) {
            if (c.length != 0) {
                this.showSendBtn = true;
            } else {
                this.showSendBtn = false;
            }
        },
        'showMoreBox':function(c){
            if (c) {
                this.$nextTick(function() {
                    this.initUploader("choose-img");
                });
            }
        },
        'sendRedPacketData.num':function(c){
             if(c.length>0 && this.sendRedPacketData.money.length>0)
             {
                this.sendRedPacketBtn = false;
             }
             else{
                this.sendRedPacketBtn = true;
             }
        },
        'sendRedPacketData.money':function(c){
             if(c.length>0 && this.sendRedPacketData.num.length>0)
             {
                this.sendRedPacketBtn = false;
             }
             else{
                this.sendRedPacketBtn = true;
             }
        },
        'rewardMoney':function(c){         
            if(Number(c)>100 )
            {
                this.rewardMoney = 100;
            }            
        }
    },
    methods: {
        handlePrivewImg:function(img){ 
           wx.previewImage({
             current: img, // 当前显示图片的http链接
             urls: [img] // 需要预览的图片http链接列表
           });
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
        resetChatBox:function(){
            this.$nextTick(function() {               
               var bannerHeight = this.$refs.bannerSwiper && this.$refs.bannerSwiper.offsetHeight || 0,
                   fixInputBarHeight = this.$refs.fixInputBar && this.$refs.fixInputBar.offsetHeight || 0,
                   tabBoxHeight = this.$refs.tabBox.offsetHeight,
                   videoBoxHeight = this.$refs.videoBox.offsetHeight,
                   h = bannerHeight + fixInputBarHeight + tabBoxHeight + videoBoxHeight,
                   clientHeight = window.screen.height,
                   chatBoxHeight = clientHeight - h;
               this.scrollBoxHeight2 = this.scrollBoxHeight = chatBoxHeight;
          });
        },
        reload:function(){
            window.location.reload();
        },
        handleInputClick:function(){            
           setTimeout(function(){
             this.$refs.chatInput.scrollIntoViewIfNeeded();             
           }.bind(this),200);
        },
        handleShowReciveRedpacketList:function(redPacketId){
            var redPacketId = redPacketId || this.redPackInfo.id;            
            this.showOpenRedPackBox = false;
            console.log(redPacketId);
            this.request({                   
                url: 'redPacket/redPacketDetail',
                withToken: true,
                data: {
                    redPacketId:redPacketId
                }
            }).then(function(res) {
                    res = res.data;
                    if (res.ret == 0) {
                       this.reciveRedpacketData = res.data;                       
                    }
                    else{
                        this.showToast(res.msg);
                    }
                }.bind(this),
                function(err) {
                    this.showToast('服务器错误');
                }.bind(this))             
            this.showReciveRedpacketList = true;
        },
        handleHideReciveRedpacketList:function(){
            this.showReciveRedpacketList = false;
            this.reciveRedpacketData={};
        },        
        handleShowRewardOtherMoneyBox:function(){
            this.showRewardOtherMoneyBox = true;
        },
        handleHideRewardOtherMoneyBox:function(){
           this.showRewardOtherMoneyBox = false;
        },        
        handleShowRewardRedpacket:function(){
            this.showRewardRedpacketBox = true;
        },
        handleHideRewardRedpacket:function(){
            this.showRewardRedpacketBox = false;
        },        
        handleOpenRedpacket:function(){
            this.request({   
                type:'post',
                url: 'redPacket/grabRedPacket',
                withToken: true,
                data: {
                    redPacketId:this.redPackInfo.id
                }
            }).then(function(res) {
                    res = res.data;
                    if (res.ret == 0) {
                        this.loadComment('new');
                        this.handleShowReciveRedpacketList();
                    }
                    else{
                        this.showToast(res.msg);
                    }
                }.bind(this),
                function(err) {
                    this.showToast('服务器错误');
                }.bind(this))             
        },
        handleCloseOpenRedpacketBox:function(){
            this.showOpenRedPackBox = false;
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
        handleHideSendRedPacketBox:function(){
            this.showRedBagBox = false;
        },
        closeAllPop:function(){
          this.showRedBagBox = false;  
          this.showMoreBox = false;
          this.showRewardRedpacketBox = false;
          this.showRewardOtherMoneyBox = false;
        },
        handleWeixinPay:function(redpacketId){
            this.request({
                type: 'post',
                url: 'pay/wxHtml',
                withToken: true,
                data: {
                    redPacketId:redpacketId
                }
            }).then(function(res) {
                    res = res.data;
                    if (res.ret == 0) {         
                      this.weixinPay({
                        info:res.data,
                        success:function(){
                           this.loadComment('new');
                        }.bind(this),
                        error:function(err){
                           this.showToast(JSON.stringify(err));
                        }.bind(this)
                      });                      
                    }
                    else{
                        this.showToast(res.msg);                        
                    }
                }.bind(this),
                function(err) {
                    this.showToast('服务器错误');
                }.bind(this));
        },
        weixinPay:function(options){
          var info = options.info;
          wx.chooseWXPay({
              timestamp: String(info.timeStamp),
              nonceStr: String(info.nonceStr),
              package: String(info.package),
              signType: 'MD5',
              paySign: String(info.paySign),
              success: options.success,
              fail: options.error
          });            
        },      
        handleSendRedPacket:function(){
            this.sendRedPacketData.videoId=this.videoId;
            this.sendRedPacketData.money = this.sendRedPacketData.money * 100;
            this.request({
                type: 'post',
                url: 'redPacket/sendRedPacket',
                withToken: true,
                data: this.sendRedPacketData
            }).then(function(res) {
                    res = res.data;
                    if (res.ret == 0) {
                      var redpacketId = res.data.redpacketId;
                      this.sendRedPacketData.money  = '';
                      this.sendRedPacketData.num  = '';
                      this.handleWeixinPay(redpacketId);
                    }
                    else{
                        this.showSendRedBagErr(res.msg);
                    }
                }.bind(this),
                function(err) {
                    this.showToast('服务器错误');
                }.bind(this));        
        },
        handleChangeRedpackType:function(){
            this.sendRedPacketData.type = this.sendRedPacketData.type==1?2:1;
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
             this.userInfo = userInfo;
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
        },
        initUploader:function(elementID){
            Qiniu.uploader({
                runtimes: 'html5,flash,html4', // 上传模式，依次退化
                browse_button: elementID, // 上传选择的点选按钮，必需
                // 在初始化时，uptoken，uptoken_url，uptoken_func三个参数中必须有一个被设置
                // 切如果提供了多个，其优先级为uptoken > uptoken_url > uptoken_func
                // 其中uptoken是直接提供上传凭证，uptoken_url是提供了获取上传凭证的地址，如果需要定制获取uptoken的过程则可以设置uptoken_func
                //uptoken: token, // uptoken是上传凭证，由其他程序生成
                // uptoken_url: '/uptoken',      // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
                uptoken_func: function(file) { // 在需要获取uptoken时，该方法会被调用                                             
                    var token = ''; 
                    var userInfo = this.getUserInfo();
                    this.ajax({
                        type: 'get',
                        url: 'tool/getQiniuToken',
                        data: {                            
                            userId:userInfo.uid,
                            token: userInfo.token
                        },
                        async: false,
                        success: function(res) {
                            res = JSON.parse(res);
                            token = res.data.token;                            
                        },
                        fail: function(err) {
                            console.log(err);
                        }
                    });
                    return token;
                }.bind(this),                         
                get_new_uptoken: true, // 设置上传文件的时候是否每次都重新获取新的uptoken
                // downtoken_url: '/downtoken',
                // Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
                //unique_names: false, // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
                save_key: true, // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
                domain: '<Your bucket domain>', // bucket域名，下载资源时用到，必需
                container: 'pickfiles-container', // 上传区域DOM ID，默认是browser_button的父元素
                max_file_size: '100mb', // 最大文件体积限制
                //flash_swf_url: '/static/bower_components/plupload/js/Moxie.swf', //引入flash，相对路径
                max_retries: 0, // 上传失败最大重试次数
                dragdrop: false, // 开启可拖曳上传
                drop_element: 'pickfiles-container', // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                // chunk_size: '4mb',                 // 分块上传时，每块的体积
                auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                multi_selection: false,
                init: {
                    'FilesAdded': function(up, files) {
                        plupload.each(files, function(file) {
                            // 文件添加进队列后，处理相关的事情
                        });
                    },
                    'BeforeUpload': function(up, file) {
                        var btn = up.getOption('browse_button')[0];
                        btn.disabled = true;
                    },
                    'UploadProgress': function(up, file) {
                        var btn = up.getOption('browse_button')[0];                        
                    },
                    'FileUploaded': function(up, file, info) {                        
                        var result = JSON.parse(info.response);                        
                        var imgUrl ='http://resource.mzlicai.cn/'+result.key;
                        this.postCmt('',imgUrl);
                    }.bind(this),
                    'Error': function(up, err, errTip) {
                        var result = JSON.parse(err.response);                                                
                    },
                    'UploadComplete': function() {
                        //队列文件处理完毕后，处理相关的事情
                    },
                    'Key': function(up, file) {
                        // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                        // 该配置必须要在unique_names: false，save_key: false时才生效                        
                        var key = undefined;
                        // do something with key here
                        return key;
                    }
                }
            });           
        },
        replaceContent: function (content) {
           if (!content) return '';
           var imgList = qqfaceJson.imgList,
             newContent = content;
           for (var i = 0; i < imgList.length; i++) {
            newContent = newContent.replace(new RegExp(imgList[i].key,"g"),"<img src='"+imgList[i].value+"' class='qq-face-gif' />");
          }
          return newContent;
        },
        imageLoadError: function(e) {
           e.target.src = '/static/img/defaultuser.jpg';
        },
        handleShowPlayer:function(){            
            if (!this.showPlayer) {
                    this.showPlayer = true;
                    var that = this;
                    this.$nextTick(function() {
                        that.play();
                    });
                } else {
                    this.play();
            }            
        },      
        handleLike: function() {
            this.request({
                type: 'post',
                url: 'video/like',
                withToken: true,
                data: {
                    videoId: this.videoId
                }
            }).then(function(res) {
                    res = res.data;
                    if (res.ret == 0) {
                        this.vedioInfo.praiseNum = res.data.praiseNum;
                        this.liked = true;
                        setTimeout(function() {
                            this.liked = false;
                        }.bind(this), 200);
                    }
                    else{
                        this.showToast(res.msg);
                    }
                }.bind(this),
                function(err) {
                    this.showToast('服务器错误');
                }.bind(this))
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
        postCmt:function(content,pic){
            this.request({
                type:'post',
                url: 'commentNew/add',
                withToken: true,
                data: {
                    videoId: this.videoId,
                    content: content,
                    pic:pic
                }
            }).then(function(res) {
                    res = res.data;
                    if (res.ret == 0) {
                        this.cmtInput='';
                        this.handleClickChatBox();
                        this.loadComment('new');
                    }
                    else{
                        this.showToast(res.msg);
                    }                    
                }.bind(this),
                function(err) {
                    this.showToast(err);
                }.bind(this))             
        },
        handleSubmitRewardOtherMoney:function(money){
            var money = money || this.rewardMoney;            
            if(String(money).length>0)
            {
                this.postRedPacket(money);
            }
           else{
               this.showToast('请输入打赏金额');
            }
        },
        postRedPacket:function(money){
            this.request({
                type:'post',
                url: 'redPacket/sendRedPacketToPlatform',
                withToken: true,
                data: {
                    videoId: this.videoId,
                    money:parseFloat(money || this.rewardMoney) * 100
                }
            }).then(function(res) {
                    res = res.data;
                    if (res.ret == 0) {                        
                        this.showToast('打赏成功');
                        this.closeAllPop();
                    }
                    else{
                        this.showToast(res.msg);
                    }                    
                }.bind(this),
                function(err) {
                    this.showToast(err);
                }.bind(this))             
        },        
        sendCmt:function(){            
           this.postCmt(this.cmtInput,'');
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
            this.loadComment('firstLoad');
            this.loadRewardRank();
            this.loadInviteRank();
        },
        loadRewardRank:function(){
            this.request({
                url: 'redPacket/getRewardRank',
                withToken: true,
                data: {
                    videoId: this.videoId
                }
            }).then(function(res) {
                    res = res.data;
                    if (res.ret == 0) {
                        this.rewardRankList = res.userRankList;                        
                    }
                    else{
                        this.showToast(res.msg);
                    }                    
                }.bind(this),
                function(err) {
                    this.showToast('服务器错误');
                }.bind(this))
        },
        loadInviteRank:function(){
            this.request({
                url: 'video/getInviteRank',
                withToken: true,
                data: {
                     videoId: this.videoId                  
                }
            }).then(function(res) {
                    res = res.data;
                    if (res.ret == 0) {
                        this.inviteRankList = res.userRankList;
                    }
                    else{
                        this.showToast(res.msg);
                    }                    
                },
                function(err) {
                    this.showToast('服务器错误');
                })
        },
        loadVideo() {
            this.request({
                url: 'video/detail',
                withToken: true,
                data: {
                    videoId: this.videoId
                }
            }).then(function(res) {
                    res = res.data;
                    if (res.ret == 0) {
                        this.vedioInfo = res.data.vedioInfo;
                        this.cooperation = res.data.cooperation;
                        weixinUtils.wxInit(res.data.jsSign);
                    }
                    else{
                        this.showToast(res.msg);
                    }                    
                },
                function(err) {
                    this.showToast('服务器错误');
                })
        },
        loadComment(type) {       
            var formData = {
                videoId: this.videoId
            };
            var timeReferenceArr = this.commentList.filter(function(item) {
                return item.type == 10
            });
            var commentList = this.commentList.filter(function(item) {
                return item.type != 10
            });
            switch (type) {
                case 'firstLoad':
                    {
                        formData.type = 'new';
                        formData.commentId = 0;
                    }
                    break;
                case 'new':
                    {
                        formData.type = 'new';
                        formData.commentId = commentList[commentList.length - 1].id;
                        formData.timeReferencePointLine = timeReferenceArr[timeReferenceArr.length - 1].timeReferencePointLine;
                    }
                    break;
                case 'old':
                    {
                        formData.type = 'old';
                        formData.commentId = commentList[0].id;                        
                        formData.timeReferencePointLine = timeReferenceArr[0].timeReferencePointLine;
                    }
                    break;
            }            
            this.request({
                url: 'commentNew/commentList',
                withToken: true,
                data: formData
            }).then(function(res) {                    
                    res = res.data;
                    res.data = res.data.reverse();
                    if (res.ret == 0) {
                        switch (type) {
                            case 'firstLoad':
                                {
                                    this.commentList = res.data;
                                    this.loadingChat = false;
                                    setTimeout(function(){
                                      this.$nextTick(function(){                                        
                                        this.$refs.tab1.$el.scrollTop = this.$refs.tab1.$el.scrollHeight;
                                      });           
                                    }.bind(this),200);                                    
                                }
                                break;
                            case 'new':
                                {
                                  if(res.data.length>0)
                                  {
                                    this.commentList = this.commentList.concat(res.data);
                                    this.$nextTick(function(){
                                       this.$refs.tab1.$el.scrollTop = this.$refs.tab1.$el.scrollHeight;
                                    });              
                                    this.closeAllPop();                                  
                                  }
                                }
                                break;
                            case 'old':
                                {
                                    this.commentList = res.data.concat(this.commentList);
                                    this.loadingChat = false;
                                }
                                break;
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
        onScroll:function(e, position){
            if(position.scrollTop==0){
                this.loadingChat = true;
                setTimeout(()=>{
                   this.loadComment('old');
                },500);                
            }
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '../../static/less/home.less';
</style>
