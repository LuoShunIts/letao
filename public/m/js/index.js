$(function () {
    // 创建一个对象
    var letao = new Letao();
    // 通过对象的原型的方法调用
    letao.initSlide();
    letao.initScroll();
})


// 创建构造函数
function Letao() {

}

// 给构造函数原型添加方法
Letao.prototype = {
    // 轮播图自动轮播
    initSlide: function () {
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    },
    // 内容滚动
    initScroll: function () {
        mui('.mui-scroll-wrapper').scroll({
            scrollY: true, //是否竖向滚动
            scrollX: false, //是否横向滚动
            startX: 0, //初始化时滚动至x
            startY: 0, //初始化时滚动至y
            indicators: false, //是否显示滚动条
            deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
            bounce: true //是否启用回弹
        });

    }
}