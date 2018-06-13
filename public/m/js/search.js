var letao;
$(function(){
    // 通过原型的方法调用函数
    letao = new Letao();

    letao.addRecord();
    letao.queryRecord();
    letao.clearRecord();
    letao.searchRecord();
    letao.deleteRecord();
})


// 创建一个构造函数
var Letao = function(){

}

// 给构造函数封装原型方法

Letao.prototype = {
    // 添加本地搜索记录
    addRecord: function(){
        $('.search-btn').click(function(){
            // 点击搜索时获取搜索框的内容
            var search = $('.search-value').val();

            $('.search-value').val('');
            // 判断输入的值是否为空
            if(!search.trim()){
                alert('请输入你要搜索的商品');
                return;
            }
            // 添加时 先获取本地的localStorage的  定义一个数组保存
            var arr = window.localStorage.getItem('searchData');
            // 定义一个值来保存每次添加的id
            var id = 0;
            // 判断当前的localStorage是否有值 
             if(arr && JSON.parse(arr).length > 0){
                // 有值的话就通过JSON.parse()的方法将搜索框的值从字符串转换成数组
                arr = JSON.parse(arr);
                // 获取id值  当前localStorage中的 数组的最后一个值的id 加 1
                id = arr[arr.length-1].id+1;
             }else {
                //  如果进来表示当前的localStorage没有值 就赋值一个空数组
                arr = [];
                id = 0;
             }
            //  判断搜索的内容是否存在 
            var flag = false;
            for(var i = 0; i < arr.length; i++){
                if(arr[i].search == search){
                    flag = true;
                }
            }
            // 把当前search框中的值添加给arr数组中
            if (flag == false){
                arr.push({
                    'search': search,
                    'id': id
                }) 
            }

            // 再把arr转换成一个字符串存入localStorage中
            arr = JSON.stringify(arr);
            window.localStorage.setItem('searchData',arr);
            letao.queryRecord();
            window.location.href = "productlist.html?search="+search+"";
        })
    },
    // 查询当前的localStorage值 并渲染页面
    queryRecord: function(){
        // 先获取当前的localStorage的值
        var arr = window.localStorage.getItem('searchData');
        // 判断是否有值
        if(arr && JSON.parse(arr).length > 0){
            // 如果有值就将值 转换成一个数组
            arr = JSON.parse(arr);
            
        }else {
            arr = [];
        }
        // 将数组进行反转排序
        arr = arr.reverse();
        // 再调用模板引擎渲染页面
        var html = template('searchRecordTmp',{'rows':arr});
        $('.search-record .content').html(html);
    },
    // 删除单个搜索记录
    deleteRecord: function(){
        $('.search-record .content').on('tap','a',function(){
            // console.log($(this).data('id'));
            var id = $(this).data('id');
            var arr = window.localStorage.getItem('searchData');
            if(arr && JSON.parse(arr).length > 0){
                arr = JSON.parse(arr);
            }else {
                arr = [];
            }
            // 遍历删除存储的数据
            for(var i = 0 ;i < arr.length;i++){
                if(arr[i].id == id){
                    // 数组删除
                    arr.splice(i,1);
                }
            }
            window.localStorage.setItem('searchData',JSON.stringify(arr));
            letao.queryRecord();
        })
    },
    // 清空搜索记录 
    clearRecord: function(){
        $('.search-record').on('click','.clear-record',function(){
            // window.localStorage.getItem('searchData');
            // 清空localStorage
            window.localStorage.removeItem('searchData');
            // 重新刷新页面
            letao.queryRecord();
        })
    },
    // 点击搜索记录进入搜索内容
    searchRecord: function(){
        $('.search-record .content li').on('tap','span',function(){
            var searchValue = $(this).html();
            // console.log(searchValue);
            window.location.href = "productlist.html?search="+searchValue+"";
        })
    }
}