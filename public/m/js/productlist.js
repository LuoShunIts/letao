var letao;
$(function () {
    // 创建一个对象
    letao = new Letao();
    // 通过对象的原型的方法调用
    letao.initPullRefresh();
    letao.searchProductList();
    letao.sortProductList();

    // 跳转过来时执行搜索带过来的搜索值]
    search = getQueryString('search');
    letao.getProductList({
        proName: search
    },function(backData){
        var html = template('productListTmp',backData);
        $('.search-content .mui-row').html(html);
    })
})


// 创建构造函数
function Letao() {

}

// 定义全局变量 
var search;
var page = 1;
// 给构造函数原型添加方法
Letao.prototype = {
    initPullRefresh: function () {
        mui.init({
            pullRefresh: {
                container: ".mui-scroll-wrapper", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
                down: {
                    callback: function () {
                        setTimeout(function () {
                            // 下拉刷新后刷新当前的搜索内容
                            letao.getProductList({
                                proName: search
                            }, function (backData) {
                                var html = template('productListTmp', backData);
                                $('.search-content .mui-row').html(html);
                                // 停止下拉刷新
                                mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                                // 重置上拉获取更多商品
                                mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
                                // 重置后让页码初始化  
                                page = 1;
                            })
                        }, 1000);
                    }
                },
                up: {
                    callback: function () {
                        setTimeout(function () {
                            // 上拉时获取更多商品数据并渲染出来
                            letao.getProductList({
                                proName: search,
                                page: ++page
                            }, function (backData) {
                                // console.log(backData);
                                var html = template('productListTmp', backData);
                                $('.search-content .mui-row').append(html);
                                if (backData.data.length > 0) {
                                    // 停止加载 可以继续上拉加载 不传参数
                                    mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
                                } else {
                                    // 停止加载 并提示没有数据了 不能继续上拉
                                    mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                                }
                            })
                        }, 1000);
                    }
                }
            }
        });
    },
    // 搜索商品
    searchProductList: function () {
        $('.search-btn').on('tap', function () {
            search = $('.search-value').val();
            // console.log(search); 
            // 调用获取商品数据的函数 并传值
            letao.getProductList({
                proName: search
            }, function (backData) {
                // console.log(backData);
                var html = template('productListTmp', backData);
                $('.search-content .mui-row').html(html);
            })
        })
    },
    // 搜索的商品排序
    sortProductList: function () {
        $('#nav .mui-row').on('tap', 'a', function () {
            // console.log(this);
            var sortType = $(this).data('sort-type');
            // console.log(sortType);
            var sort = $(this).data('sort');
            console.log(sort);
            if (sort == 1) {
                sort = 2;
            } else if (sort == 2) {
                sort = 1;
            }

            $(this).attr('data-sort', sort);
            if (sortType == 'price') {
                letao.getProductList({
                    price: sort,
                    proName: search
                }, function (backData) {
                    var html = template('productListTmp', backData);
                    $('.search-content .mui-row').html(html);
                })
            } else if (sortType == 'num') {
                letao.getProductList({
                    num: sort,
                    proName: search
                }, function (backData) {
                    var html = template('productListTmp', backData);
                    $('.search-content .mui-row').html(html);
                })
            }
        })
    },
    // 获取商品数据
    getProductList: function (obj, callback) {
        $.ajax({
            url: '/product/queryProduct',
            data: {
                proName: obj.proName,
                price: obj.price || 1,
                num: obj.num || 1,
                page: obj.page || 1,
                pageSize: obj.pageSize || 2
            },
            success: function (backData) {
                // 将搜索的值放在搜索框中
                $('.search-form .search-value').val(search);
                // 判断是否有传回调函数
                if (callback) {
                    callback(backData);
                }
            }
        })
    }
}

// 获取跳过来的搜索数据  正则截取字符串 百度
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    } else {
        return null;
    }
}