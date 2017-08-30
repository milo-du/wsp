<template>
    <div class="container">
        <swiper :options="swiperOption">
            <swiper-slide v-for="slide in swiperSlides">
                <img :src="slide"></swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <div class="video-box">
            <video ref="player" @click.prevent="play" v-on:playing="onPlaying" v-on:pause="onPause" v-on:waiting="onWaiting" v-on:timeupdate="onTimeupdate" :poster="poster" :src="remoteUrl" class="show-audio" loop="true" width="100%" preload="auto" type="video/mp4" playsinline="true" webkit-playsinline="true" x-webkit-airplay="true" x5-video-player-type="h5" x5-video-player-fullscreen="true" :style="{width:video.width,height:video.height+'px'}"></video>
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
            remoteUrl:'http://res.heyhou.com/mp4/2017/08/30/783905f1fe7de28a542898ba7ebc79da.mp4',
            swiperOption: {
                autoplay: 3500,
                setWrapperSize: true,
                pagination: '.swiper-pagination',
                paginationClickable: true,
                mousewheelControl: true,
                observeParents: true,
            },
            swiperSlides: ['http://res.heyhou.com/image/2017/07/09/edfee97952303f86774131d1cecf73b1.jpg?imageView2/1/w/375/h/180', 'http://res.heyhou.com/image/2017/07/28/18a4309efed43ce8451994f3f667a241.jpg?imageView2/1/w/375/h/180'],
            video: {
                width: 360,
                height: 640
            }
        }
    },
    created() {
        document.title = '首页';        
        this.video.height = window.innerWidth * this.video.height / this.video.width;
    },
    methods: {
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
