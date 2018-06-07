
// 轮播图自动轮播
var gallery = mui('.mui-slider');
gallery.slider({
    interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
});
mui.init({  
    swipeBack:true //启用右滑关闭功能  
});