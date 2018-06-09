$(function () {
    // 创建一个对象
    var letao = new Letao();
    // 通过对象letao的原型的方法调用
    letao.initScroll();

    // 通过letao原型的方法调用ajax获取左侧数据
    letao.getCategoryLeft();
    // 通过letao原型的方法调用ajax获取右侧数据
    letao.getCategoryRight()
})

var Letao = function () {

}

Letao.prototype = {
    // 内容滚动
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
    // 获取分类左侧数据
    getCategoryLeft: function() {
        $.ajax({
            url: "/category/queryTopCategory",
            success: function (backData){
                // console.log(backData);
                var result = template('categoryLeftId',backData);
                $('.category-left ul').html(result);
            }
        })
    },

    getCategoryRight: function(){
        getRightData(1);

        $(".category-left ul").on('click','li',function(e){
            // var id = this.dataSet['id']; 
            // console.log(id);
            // console.log(this);
            $(this).addClass('active').siblings().removeClass('active');
            var id = e.target.dataset['id'];
            getRightData(id);
        })
        function getRightData(id){
            $.ajax({
                url: "/category/querySecondCategory",
                type: "get",
                data: {
                    id: id
                },
                success: function(backData){
                    var result = template('categoryRightId',backData);
                    if (result) {
                        $('.category-right .mui-row').html(result);
                    }else {
                        $('.category-right .mui-row').html("<p>此页面没有数据</p>");
                    }
                }
            })
        }
    }
}