//datadownload html
//time1


var fromyear = null;
var frommonth= null;
var fromday= null;
var toyear = null;
var tomonth = null;
var today = null;
var yeartime = null;
var monthtime = null;

//全局用户信息
$(function() {
	var data = window.localStorage.getItem("result");
	var dataObj = JSON.parse(data);
    if (dataObj == null){
        alert("Login author is out of date, please login again");
        window.location.href = "index.html";
    }
	var my_name = "<p>Hello,"+dataObj.user.name+"</p>";
	$('.me_name').append(my_name);

lay('#version').html('-v' + laydate.v);

laydate.render({
    elem: '#fromtime',
    lang: 'en',
    done: function (value, date) {
        fromyear    = date.year;
        frommonth   = date.month;
        fromday     = date.date;
        console.log(fromyear+"-"+frommonth+"-"+fromday);
        console.log(date);
    }
    // ,type: 'year'
});
lay('#version').html('-v' + laydate.v);

//time2
laydate.render({
    elem: '#totime',
    lang: 'en',
    done: function (value, date) {
        toyear    = date.year;
        tomonth   = date.month;
        today     = date.date;
        console.log(date);
    }
    // ,type: 'month'
});
lay('#version').html('-v' + laydate.v);
//year and month
laydate.render({
    elem: '#reportmonth',
    type: 'month',
    lang: 'en',
    change: function (value, date) {
        yeartime = date.year;
        monthtime = date.month;
        console.log("yeartime:"+yeartime);
        console.log("monthtime:"+monthtime);
    }
});

$(function() {
    var fromtimediv   = document.getElementById("fromtimediv");
    var totimediv     = document.getElementById("totimediv");
    var monthlydiv    = document.getElementById("monthdiv");
    var $monthopt   = $("#monthlyid");
    var $anytimeopt = $("#anytimeid");
    var $download   = $("#download");

    //返回用户需要下载的文件，针对单个传感器
    $monthopt.bind('click', function () {
        console.log("monthopt");
        fromtimediv.style.display  = 'none';
        totimediv.style.display    = 'none';
        monthlydiv.style.display   = 'block';
   });

    $anytimeopt.bind('click', function () {
        console.log("anytimeopt");
        fromtimediv.style.display  = 'block';
        totimediv.style.display    = 'block';
        monthlydiv.style.display   = 'none';
    });

    $download.bind('click', function () {

        if (dataObj.user.role != 0){
            alert("Only Administrator can download report.");
            return;
        }

        if (document.getElementById("monthlyid").checked){
            if ((yeartime == null)||(monthtime == null)){
                alert("Please finish your date selection");
            }else{
                $("#loadgif").show();
                var token = window.localStorage.getItem("Geo_Token");
                var now = new Date();
                var year = yeartime;
                var month = monthtime;

                var json = {
                    "bridgeName": "Forth Road Bridge",
                    "year": year,
                    "month": month
                };
                $.ajax({
                    type: "GET",
                    data: json,
                    url: "http://128.243.138.25:1212/apix/Report/GenMonthlyReport",
                    responseType:'arraybuffer',
                    async: true,
                    beforeSend: function(XHR) {
                        //发送ajax请求之前向http的head里面加入验证信息
                        XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
                    },
                    success: function(data) {
                        // alert("请求成功！")
                        $("#loadgif").hide();
                        console.log(data);
                        if (data.reportPath != undefined) {
                            console.log(data.reportPath);
                            window.open(data.reportPath);
                        }else {
                            alert("No data");
                        }
                    },
                    error: function(request) {
                        $("#loadgif").hide();
                        alert("network request failed");
                        console.log(request);
                    }
                });
            }
        }else if (document.getElementById("anytimeid").checked){
            if ((today == null)||(fromday == null)){
                alert("Please finish your date selection");
            }else {
                $("#loadgif").show();
                var token       = window.localStorage.getItem("Geo_Token");
                var fromTime    = new Date(fromyear, frommonth-1, fromday+1);
                var toTime      = new Date(toyear, tomonth-1, today+1);
                var cFromTime   = fromTime.toISOString();
                var cToTime     = toTime.toISOString();
                console.log("from time:"+cFromTime);
                console.log("to time:"+cToTime);

                var json = {
                    "bridgeName": "Forth Road Bridge",
                    "fromTime": cFromTime,
                    "toTime": cToTime
                };
                $.ajax({
                    type: "GET",
                    data: json,
                    url: "http://128.243.138.25:1212/apix/Report/GenMonthlyReport",
                    responseType:'arraybuffer',
                    async: true,
                    beforeSend: function(XHR) {
                        //发送ajax请求之前向http的head里面加入验证信息
                        XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
                    },
                    success: function(data) {

                        $("#loadgif").hide();
                        window.open(data.reportPath);
                        console.log(data);
                    },
                    error: function(request) {
                        $("#loadgif").hide();
                        alert("network request failed");
                        console.log(request);
                    }
                });
            }
        }
    });


})
})
