var letao;
$(function () {
    // 通过letao构造函数原型调用方法
    letao = new Letao();
    var id = getQueryString('productid');
    letao.selectSize();
    letao.getProductData(id);
    letao.initScroll();
    letao.addCart();
})


// 创建构造函数
var Letao = function () {

}

// 给构造函数添加原型方法
Letao.prototype = {
    // 初始化轮播图
    initSlider: function () {
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    },
    // 区域滚动
    initScroll: function () {
        mui('.mui-scroll-wrapper').scroll({
            scrollY: true, //是否竖向滚动
            scrollX: false, //是否横向滚动
            startX: 0, //初始化时滚动至x
            startY: 0, //初始化时滚动至y
            indicators: true, //是否显示滚动条
            deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
            bounce: true //是否启用回弹
        });

    },
    // 选择尺码
    selectSize: function () {
        $('.product').on('tap', '.product-size i', function () {
            $(this).addClass('active').siblings().removeClass('active');
        })
    },
    // 根据传过来的值渲染页面
    getProductData: function (id) {
        $.ajax({
            url: '/product/queryProductDetail',
            data: {
                id: id
            },
            success: function (backData) {
                // console.log(backData);
                /* 先将轮播图图片渲染到页面上 */
                var silderImage = template('productSliderTmp', backData);
                $('.mui-slider').html(silderImage);
                // 再初始化轮播图
                letao.initSlider();

                // 将商品尺码渲染到页面
                // 获取最小值和最大值 转换成数值类型
                var start = +backData.size.split('-')[0];
                var end = +backData.size.split('-')[1];
                // 声明一个数组来保存
                var arr = [];
                for (var i = start; i <= end; i++) {
                    // 循环添加进数组中
                    arr.push(i);
                }
                // 重新改变商品中的尺码
                backData.size = arr;
                var productData = template('productDataTmp', backData);
                $('.product').html(productData);
                // 手动初始化数字输入框
                mui('.mui-numbox').numbox();
                
            }
        })
    },
    // 添加到购物车
    addCart: function(){
        $('.btn-options .btn-addCart').on('tap',function(){
            var size = $('.product-size i.active').data('size');
            var num = mui('.mui-numbox').numbox().getValue();
            // console.log(num);
            // 判断是否有选择尺码
            if(!size){
                // 如果没有就弹出提示框 并返回
                mui.toast('请选择尺码',{ duration:'short', type:'div' });
                return;
            }
            if(num == 0){
                mui.toast('请输入数量',{ duration:'short', type:'div' });
                return;
            }

            // 如果来到这里表示已经选择好了 提示是跳转至加入购物车
            mui.confirm('已添加到购物车,是否去查看','温馨提示',['是','否'],function(e){
                if(e.index == 0){
                    mui.alert('正在进入购物车!','温馨提示','确定')
                }else if(e.index == 1){
                    mui.alert('继续购买','温馨提示','确定')
                }
            })
        })
    }


}


// 获取传过来的值
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    var q = window.location.pathname.substr(1).match(reg_rewrite);
    if (r != null) {
        return unescape(r[2]);
    } else if (q != null) {
        return unescape(q[2]);
    } else {
        return null;
    }
}