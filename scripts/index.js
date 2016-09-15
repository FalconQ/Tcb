/**
 * Created by My on 2016/9/6.
 */
$(function () {
    var pageCount = 1,//暂存获取的总页码数，初始值为0
        curPage = 1,//暂存当前页码数，初始值为1
        index = 0; //轮播图下标
    /**鼠标移入，二级菜单显示,移入菜单内不隐藏*/
    $(".banner-list").find("li").on({"mouseover":function () {
            $(".panel").children("div").eq($(this).index()).show().siblings("div").hide();
            $(this).find(".triangle").show().end().siblings("li").find(".triangle").hide();
            $(".panel").children("div").eq($(this).index()).on("mouseover",function () {
                $(this).show();
            });
        },
        "mouseout":function () {
            $(".panel").children("div").eq($(this).index()).hide();
            $(this).find(".triangle").hide();
            $(".panel").children("div").eq($(this).index()).on("mouseout",function () {
                $(this).hide();
            })
        }
    });
    /**banner轮播*/
    $(".circle li").eq(0).css({background:"#333"});
    var timer = setInterval(loops,2000);
    function loops(){
        index++;
        if(index == 4) index = 0;
        $(".banner-top .wrap1").animate({
            "left": index*(-1200) + "px"
        },1000);
        $(".circle li").css({background:"#ccc"}).eq(index).css({background:"#333"})
    }
    $(".wrap1").on("mouseover",function(){
        clearInterval(timer);
    }).on("mouseout",function(){
        timer = setInterval(loops,2000);
    });
    $(".circle li").on("click",function(){
        $(".banner-top .wrap1").stop().animate({
            "left": $(this).index()*(-1200) + "px"
        },1000);
        index = $(this).index();
        $(".circle li").css({background:"none"}).eq($(this).index()).css({background:"#333"})
    });
    /**
     * 封装请求方式并调用callback进行数据处理
     * @param type 请求方式
     * @param url 请求路径
     * @param param 请求参数
     * @param dataType 返回数据类型
     * @param callback 回调函数
     * @param currentPage 当前页码
     * @return
     */
    function jsonAjax(type, url, param, dataType, callback, currentPage) {
        $.ajax({
            type: type,
            url: url,
            data: param,
            dataType: dataType,
            success: function (data) {
                callback(data,currentPage);
            },
            error: function (textStatus) {
                console.log(textStatus);
            }
        });
    }
    /**页面数据请求*/
    jsonAjax("get","scripts/buyPhonepinpai.json",null,"json",buyPhonePinPai);
    jsonAjax("get","scripts/salePhonepinpai.json",null,"json",salePhonePinPai);
    jsonAjax("get","scripts/doGetPcFaultList.json",null,"json",pcFaultList);
    jsonAjax("get","scripts/getFaultGroup.json",null,"json",PhoneFaultGroup);
    jsonAjax("get","scripts/getCityCode.json",null,"json",getCityCode);
    jsonAjax("get","scripts/hotPhone.json",{"num":5},"json",hotPhoneData);
    jsonAjax("get","scripts/hotSale.json",{"num":5},"json",hotSaleData);
    jsonAjax("get","scripts/shop_top7.json",{"num":7},"json",top7Data);
    jsonAjax("get","scripts/shop0.json",{"city_id":"bei_jing", "service_id":"", "type_id":"", "online":"off", "cuxiao":"off", "is_bzj":0, "tag":"", "pagesize":5, "pn":0, "lng":"", "lat":""},"json",shopData);
    jsonAjax("get","http://bang.360.cn/aj/get_area/",{"citycode" : "bei_jing"},"jsonp",getCounty);
    /**
     * @param param请求参数，参数对象或者字符串拼接
     * */
    function autoAjax(url,param,currentPage) {
        jsonAjax("get",url,param,"json",shopData,currentPage);

    }
    /**热门回收模块回调函数*/
    function hotPhoneData(data){
        var data = data.result;
        for(var i in data){
            var $li = $("<li><a href='##'><div><img/><p></p></div></a></li>");
            $li.find("img").attr("src",data[i].img_url);
            $li.find("p").text(data[i].model_alis).addClass("pro_name");
            $(".hotPhone").find("ul").append($li);
        }
    }
    /**热卖手机模块回调函数*/
    function hotSaleData(data){
        var data = data.result;
        for(var i in data){
            var $li = $("<li><a href='##'><div><img/><p></p><p></p></div></a></li>");
            $li.find("img").attr("src",data[i].thum_img.big).addClass("pro_img");
            $li.find("p:eq(0)").text(data[i].model_name).addClass("pro_name");
            $li.find("p:eq(1)").text("￥"+ data[i].price).addClass("pro_price");
            $(".second_hand").find("ul").append($li);
        }
    }
    /**商铺列表模块回调函数*/
    function shopData(data,currentPage) {
        map.clearMap();
        pageControl(data.page_count,currentPage);
        var dataTemp = data.shop_data;
        $(".shopList_list_1").empty();
        for(var i in dataTemp){
            var $li = $('<li class="shopList_list_2"><img/><div class = "description1"><p><a class="one"></a><span>&nbsp;&nbsp;&nbsp;&nbsp;店铺等级:</span><span></span></p><p class="two"></p><p class="three"></p></div><div class="description2"><ul><li>先行赔付</li><li>同城帮认证</li><li class="four"></li></ul></div><div class="to_shop"><a>进入店铺</a></div></li>');
            $li.find("img").attr("src", dataTemp[i].shop_ico);
            $li.find(".one").text(dataTemp[i].shop_name).attr("href", dataTemp[i].shop_addr);
            $li.find(".two").text("主营：" + dataTemp[i].main);
            $li.find(".three").text("地址：" + dataTemp[i].addr_detail);
            $li.find(".four").text("人气："+ dataTemp[i].shop_visit + "次浏览");
            $li.find(".to_shop a").attr("href", dataTemp[i].shop_addr);
            $(".shopList_list_1").append($li);
            mapMarker(dataTemp[i])
        }
    }
    /**商铺好评模块回调函数*/
    function top7Data(data) {
        var data = data.shop_data;
        $("div.first").each(function (i) {
            var $content = $("<a><img/></a><a class='a'></a><p></p>");
            $(this).append($content);
            $(this).find("a").attr("href",data[i].shop_addr);
            $(this).find("img").attr("src",data[i].shop_ico);
            $(this).find(".a").text(data[i].shop_name);
            $(this).find("p").text(data[i].shop_visit+"条评论");
        })
    }
    /**bannerList二级菜单动态处理方法--买二手手机*/
    function buyPhonePinPai(data) {
        var data = data.result;
        for(var i in data){
            var $li = $("<li><a href='##'></a></li>");
            $li.find("a").text(data[i]);
            $("#panel04").find("ul").append($li);
        }
    }
    /**bannerList二级菜单动态处理方法--卖手机*/
    function salePhonePinPai(data) {
        var data = data.result;
        for(var i in data){
            var $li = $("<li><a href='##'></a></li>");
            $li.find("a").text(data[i].name);
            $("#panel03").find("ul").append($li);
        }
    }
    /**bannerList二级菜单动态处理方法--修电脑*/
    function pcFaultList(data) {
        var data = data.result;
        for(var i in data){
            if(i == "hot"){
                for(var n in data[i]){
                    var $a = $("<a href='##'></a>");
                    $a.text(data[i][n].name);
                    $(".hot").append($a);
                }
            }else if(i == "other"){
                for(var n in data[i]){
                    var $a = $("<a href='##'></a>");
                    $a.text(data[i][n].name);
                    $(".other").append($a);
                }
            }
        }
    }
    /**bannerList二级菜单动态处理方法--修手机/Pad*/
    function PhoneFaultGroup(data) {
        var data = data.result;
        for(var i in data){
            var $dt = $("<dt><span></span>&gt</dt><dd></dd>");
            $dt.find("span").text(data[i].name);
            $(".panel01").find("dl").append($dt);
            for(var n in data[i].list){
                var $a = $("<a href='##'></a>");
                $a.text(data[i].list[n].name);
                $(".panel01").find("dd").eq(i).append($a);
            }
        }
    }
    /**选择城市数据处理*/
    function getCityCode(data) {
        var data = data.result;
        for(var i in data){
            if(i == "hotcity"){
                for(var n in data[i]){
                    var $a = $("<a href='##'></a>");
                    $a.text(data[i][n].name);
                    $a.data("code",data[i][n].code);//绑定code，联动查询使用
                    $(".hotcity").append($a);
                }
            }else if(i == "citylist"){
                for(var n in data[i]){
                    $a = $("<a href='##'></a>");
                    $p = $("<p></p>");
                    $a.text(n);
                    $(".tabBar").append($a);
                    // $(".citylist").append($p);
                    $p.appendTo($(".citylist")).addClass(n);
                    for(var m in data[i][n]){
                        var $a = $("<a href='##'></a>");
                        $a.text(data[i][n][m].name);
                        $a.data("code",data[i][n][m].code);//绑定code，联动查询使用
                        $(".citylist").find("p[class="+n+"]").append($a);
                    }
                }
            }
        }
    }
    /**拼音tab选择事件*/
    $(".tabBar").delegate("a","click",function (e) {
        e.stopPropagation();
        $(this).addClass("current").siblings("a").removeAttr("class");
        $(".citylist").find("p").eq($(this).index()).show().siblings("p").hide()
    });
    /**选择区县回调函数，用于jsonp回调*/
    function getCounty(data) {
        var data = data.result
        $(".countylist").html("<a href='##'>全部区县</a>");
        for(var i in data){
            var $a = $("<a href='###'></a>");
            $a.text(data[i]);
            $(".countylist").append($a);
        }
    }
    /**获取区县数据,发送jsonp请求*/
    $(".changeCity_win").not(".tabBar").delegate("a","click",function (e) {
        e.stopPropagation();
        /**该方式需要把回调函数设置为全局函数*/
        // var $script = $("<script></script>");
        // $script.attr("src","http://bang.360.cn/aj/get_area/?citycode="+$(this).data("code")+"&callback=getCounty");
        // $("head").append($script);
        jsonAjax("get","http://bang.360.cn/aj/get_area/",{"citycode" : $(this).data("code")},"jsonp",getCounty);
        $(".changeCity").children("span").text($(this).text());
        $(".changeCity_win").hide();
    });
    /**区县选择事件委托*/
    $(".countylist").delegate("a","click",function (e) {
        e.stopPropagation();
        $(".changeCounty").children("span").text($(this).text());
        $(".changeCounty_win").hide();
    });
    /**关闭map窗口*/
    $(".close").on("click",function () {
        $(".protective").hide()
    });
    /**打开map窗口*/
    $(".map_Btn").on("click",function () {
        /**根据实际高度，设置遮照高度*/
        $(".protective").show().css("height",$(document).height());
    });
    /**初始化地图*/
    var map = new AMap.Map('map_view', {
        resizeEnable: true,
        zoom:11
        // center: [116.397428, 39.90923]
    });
    /**输入时自动提示*/
    var auto = new AMap.Autocomplete({input: "tipinput"});
    /**绑定提示信息选中事件*/
    AMap.event.addListener(auto,"select",select);
    function select(e) {
        autoAjax("scripts/shop9.json",{
            lng: e.poi.location.lng,
            lat: e.poi.location.lat
        },7);
    }
    /**输入框地理信息解析*/
    function geocoder(addr) {
        var geocoder = new AMap.Geocoder({
            city: "010", //城市，默认：全国
            radius: 1000 //范围，默认：500
        });
        /**地理编码,返回地理编码结果*/
        geocoder.getLocation(addr, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                autoAjax("scripts/shop8.json",{
                    lng: result.geocodes[0].location.getLng(),
                    lat: result.geocodes[0].location.getLat()
                });
            }
        });
    }
    /**搜索按钮事件绑定*/
    $("#souBtn").on("click",function () {
        geocoder($("#tipinput").val());
    });
    /**处理默认边框显示为题*/
    $(".amap-sug-result").hide();
    /**地图标记方法*/
    function mapMarker(data) {
        var marker = new AMap.Marker({
            map:map,
            position:[data.map_longitude,data.map_latitude]
        });
        return marker;
    }
    /**回顶部隐藏处理*/
    $(window).scroll(function(){
        if($(document).scrollTop()>0){
            $(".returnTop").show();
        }else{
            $(".returnTop").hide();
        }
    });
    /**回到顶部颜色变换*/
    $(".returnTop").find("a").on("mouseover",function () {
        $(this).css("margin-top", "-75px");
    }).on("mouseout",function () {
        $(this).css("margin-top", "0px");

    });
    /**城市选择、区县选择弹出框打开和关闭处理*/
    $(".change_wrap").delegate("div","click",function () {
        switch($(this).attr("class")){
            case "changeCity" :
                $(this).find(".changeCity_win").show();
                $(this).siblings("div").find(".changeCounty_win").hide();
                break;
            case "changeCounty" :
                $(this).find(".changeCounty_win").show();
                $(this).siblings("div").find(".changeCity_win").hide();
                break;
            default:
                break;
        }
    });
    /**批量处理关闭城市区县选择弹出框*/
    $(".close_panel").on("click",function (e) {
        e.stopPropagation();
        $(this).closest(".close_common").hide();
    });
    /**翻页控件生成方法*/
    function pageControl(pageNum, currentPage) {
        var currentPage = parseInt(currentPage) || 1,
            temp = currentPage <=5 ? 1 : currentPage - 4,
            $barFarme = $("<a href='###' class='page_1'>首页</a><a href='###' class='page_1'>上一页</a><a href='###' class='page_1'>下一页</a><a href='###' class='page_1'>尾页</a>"),
            str = "";
        /**判断总页数是否大于99，如果大于99，取99，如果小于99，则取总页数*/
        pageCount = Math.ceil(pageNum/5) >99 ? 99 :Math.ceil(pageNum/5);
        for(var n=1; temp <= pageCount && n<=10;n++){
            str += "<a href='##' index="+temp+">"+ temp + "</a>";
            temp++;
        }
        $(".pages").html($barFarme);
        $(".pages").find("a:eq(1)").after(str);
        /**首页按钮显示条件判断*/
        currentPage < 6 ? $(".page_1").eq(0).hide():$(".page_1").eq(0).show();
        /**上一页按钮显示条件判断*/
        currentPage == 1 ? $(".page_1").eq(1).hide():$(".page_1").eq(1).show();
        /**下一页和尾页按钮显示条件判断*/
        currentPage == pageCount ? $(".page_1").eq(3).hide().end().eq(2).hide():$(".page_1").eq(3).show().end().eq(2).show();
        /**尾页按钮显示条件判断*/
        currentPage + 5 >= pageCount? $(".page_1").eq(3).hide() : $(".page_1").eq(3).show();
        /**当前页码页码高亮显示*/
        $(".pages").find("a[index="+currentPage+"]").addClass("currentPage");
    }
    /**翻页数据更新方法
     * 请求对应的页数的json文件，模拟数据更新
     */
    $(".pages").delegate("a","click",function () {
        switch ($(this).text()){
            case "首页" :
                autoAjax("scripts/shop"+ (1-1)+".json",{
                    pn:0
                },1);
                curPage = 1;
                break;
            case "上一页" :
                --curPage;
                autoAjax("scripts/shop"+ (curPage-1)+".json",{
                    pn:$(this).text()
                },curPage);
                break;
            case "下一页" :
                ++curPage;
                autoAjax("scripts/shop"+ (curPage-1)+".json",{
                    pn:$(this).text()
                },curPage);
                break;
            case "尾页" :
                autoAjax("scripts/shop5.json",{
                    pn:pageCount
                },pageCount);
                curPage = 10;
                break;
            default:
                autoAjax("scripts/shop"+ ($(this).text()-1)+".json",{
                    pn:$(this).text()
                },$(this).text());
                curPage = parseInt($(this).text());
                break;
        }
    });
});
