<template>
    <div class="container">
        <swiper :options="swiperOption">
            <swiper-slide v-for="slide in swiperSlides" class="swiper-img-slide">
                <img :src="slide"></swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <div class="video-box">
            <img src="http://res.heyhou.com/image/2017/07/09/edfee97952303f86774131d1cecf73b1.jpg?imageView2/1/w/375/h/180" class="video-cover">    
            <a href="javascript:void(0)" class="btn-play">
                <img src="/static/img/play.png"></a>
            <a href="javascript:void(0)" class="videoicon btn-refresh"></a>
            <span class="onlineuser">
                <span class="videoicon seeuser"></span>
                <span class="p-views">5.85万</span>
            </span>
            <video ref="player" v-if="showPlayer" @click.prevent="play" v-on:playing="onPlaying" v-on:pause="onPause" v-on:waiting="onWaiting" v-on:timeupdate="onTimeupdate" :poster="poster" :src="remoteUrl" class="show-audio" loop="true" width="100%" preload="auto" type="video/mp4" playsinline="true" webkit-playsinline="true" x-webkit-airplay="true" x5-video-player-type="h5" x5-video-player-fullscreen="false"></video>
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
            <swiper :options="contentSwiperOption" ref="contentSwiper">
                <swiper-slide class="tab1" style="height:409px">  
                    <div class="chat-box">
                        ddd
                    </div>                  
                    <div class="fix-input-bar">
                        <ul class="op-box">
                            <li class="inputicon qqface"></li>
                            <li class="li-input thinborder">
                             <input class="speakInput flex" type="text" placeholder="来说点什么吧...">
                            </li>
                           <li class="inputicon iconmore"></li>
                           <li class="btnLiveTalk">发送</li>                        
                        </ul>
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
    </div>  
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
export default {
    name: 'home',
    components: {
      swiper,
      swiperSlide
    },
    data() {
        return {
            playing: false,
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
                pagination: '.swiper-pagination',
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
                pagination: '.swiper-pagination',
                paginationClickable: true,
                mousewheelControl: true,
                observeParents: true,
                onSlideChangeEnd: function(swiper) {
                    var activeIndex = swiper.activeIndex;                    
                    this.isActive = activeIndex;
                }.bind(this)
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
            isActive:0           
        }
    },
    created() {
        document.title = '首页';        
    },
    methods: {
        handleCloseFollowBox:function(){
          this.showFollowBox = false;  
        },
        changePage(idx) {
           console.log(idx);
        },
        handleClickNav:function(index){           
           if(index < 4 ){             
             this.$refs.contentSwiper.swiper.slideTo(index);
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
        loadList() {
            this.$http.get('article/get_list', {
                params: {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize
                }
            }).then(function(response) {
                return response.json();
            }).then(response => {
                if (response.res == 0) {
                    if (this.pageIndex == 1) {
                        this.pages = Math.ceil(response.count / this.pageSize);
                    }
                    this.list = response.data;
                } else {
                    this.$toast('加载失败，请稍候重试', {
                        horizontalPosition: 'center'
                    });
                }
            }, response => {

            });
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '../../static/less/home.less';
</style>
