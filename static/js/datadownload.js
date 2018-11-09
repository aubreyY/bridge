//datadownload html

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

//time1

var fromyear = null;
var frommonth= null;
var fromday= null;
var toyear = null;
var tomonth = null;
var today = null;
var yeartime = null;
var monthtime = null;
lay('#version').html('-v' + laydate.v);

laydate.render({
    elem: '#time1',
    lang: 'en',
    done: function (value, date) {
        fromyear    = date.year;
        frommonth   = date.month;
        fromday     = date.date;
        // console.log(date);
    }
});
lay('#version').html('-v' + laydate.v);

//time2
laydate.render({
    elem: '#time2',
    lang: 'en',
    done: function (value, date) {
        toyear    = date.year;
        tomonth   = date.month;
        today     = date.date;
        // console.log(date);
    }
});

var nav = document.getElementById("nav_list");
var navlist = nav.children;
var con = document.getElementById("content");
var conlist = con.children;

var navIndex = 0;
var typeIndex = 4;
var initDoubleflag = false;

for(var i = 0; i < navlist.length; i++) {

    console.log("i:"+i);
	navlist[i].index = i;
	navlist[i].onclick = function() {
		for(var m = 0; m < conlist.length; m++) {
			navlist[m].className = "";
			conlist[m].style.display = "none";

			console.log("m:"+m);
            console.log("i in m:"+i);
		}
		this.className = "active";
		conlist[this.index].style.display = "block";
        navIndex = this.index;
        console.log("navIndex:"+navIndex);
        getSensorIDByType(3);
        if(navIndex==1){
            initDoubleflag = true;
		}else{

            initDoubleflag = false;
		}
        getSensorDataItem("Accelerometer");

	}
}
//传感器类型
document.getElementById("type1_id").options.length=0;
document.getElementById("type2_id").options.length=0;
document.getElementById("type3_id").options.length=0;
document.getElementById("type4_id").options.length=0;
document.getElementById("id1_id").options.length=0;
document.getElementById("id2_id").options.length=0;
document.getElementById("id3_id").options.length=0;
document.getElementById("id4_id").options.length=0;
document.getElementById("data1_id").options.length=0;
document.getElementById("data2_id").options.length=0;
document.getElementById("data3_id").options.length=0;
document.getElementById("data4_id").options.length=0;
var str="";
var token = window.localStorage.getItem("Geo_Token");
var json = {
    "bridgeName": "Forth Road Bridge"
};

$.ajax({
    type: "GET",
    url: "http://128.243.138.25:1212/apix/DataType/GetDataType",
    data: json,
    async: true,
    beforeSend: function(XHR) {
        //发送ajax请求之前向http的head里面加入验证信息
        XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
    },
    success: function(data) {
        // console.log(data);
        for (var i = 0;i< data["listSenTypes"].length;i++) {
            // console.log(data["listSenTypes"][i]);
            str+="<option value='"+i+"'>"+data["listSenTypes"][i]+"</option>";
            // str+="<option value='"+i+"'>"+i+"</option>";
		}
        if(str!=null){
            $("#type1_id").html(str);
            $("#type2_id").html(str);
            $("#type3_id").html(str);
            $("#type4_id").html(str);
        }

    },
    error: function(request) {
        // alert("请求失败");
        //			console.log(request);
    }
});

getSensorIDByType(3);
getSensorDataItem("Accelerometer");

var $select1 = $("#type1_id");
$select1.on("change",function(){
   // console.log( $("option:selected",this).val());
   var currentSelect = $("option:selected",this).val();
    typeIndex = 1;
    initDoubleflag = false;

    var typeInt;
    var typeStr;
    console.log('test:'+currentSelect);
    switch (parseInt(currentSelect)){
        case 0:
            typeInt = 3;
            typeStr = "Accelerometer";
            break;
        case 1:
            typeInt = 1;
            typeStr = "Anemometer";
            console.log('typeInt:'+typeInt);
            console.log('typeStr:'+typeStr);
            break;
        case 2:
            typeInt = 2;
            typeStr = "MetStation";
            break;
        case 3:
            typeInt = 0;
            typeStr = "GNSS";
            break;
        default:
            console.log('def typeInt:'+typeInt);
            console.log('def typeStr:'+typeStr);
            break;
    }
    getSensorIDByType(typeInt);
    getSensorDataItem(typeStr);
});

$("#type2_id").on("change",function(){
    // console.log( $("option:selected",this).val());
    var currentSelect = $("option:selected",this).val();
    typeIndex = 2;
    initDoubleflag = false;
    var typeInt;
    var typeStr;
    console.log('test:'+currentSelect);
    switch (parseInt(currentSelect)){
        case 0:
            typeInt = 3;
            typeStr = "Accelerometer";
            break;
        case 1:
            typeInt = 1;
            typeStr = "Anemometer";
            console.log('typeInt:'+typeInt);
            console.log('typeStr:'+typeStr);
            break;
        case 2:
            typeInt = 2;
            typeStr = "MetStation";
            break;
        case 3:
            typeInt = 0;
            typeStr = "GNSS";
            break;
        default:
            console.log('def typeInt:'+typeInt);
            console.log('def typeStr:'+typeStr);
            break;
    }
    getSensorIDByType(typeInt);
    getSensorDataItem(typeStr);
});

$("#type3_id").on("change",function(){
    // console.log( $("option:selected",this).val());
    var currentSelect = $("option:selected",this).val();
    typeIndex = 3;
    var typeInt;
    var typeStr;
    console.log('test:'+currentSelect);
    switch (parseInt(currentSelect)){
        case 0:
            typeInt = 3;
            typeStr = "Accelerometer";
            break;
        case 1:
            typeInt = 1;
            typeStr = "Anemometer";
            console.log('typeInt:'+typeInt);
            console.log('typeStr:'+typeStr);
            break;
        case 2:
            typeInt = 2;
            typeStr = "MetStation";
            break;
        case 3:
            typeInt = 0;
            typeStr = "GNSS";
            break;
        default:
            console.log('def typeInt:'+typeInt);
            console.log('def typeStr:'+typeStr);
            break;
    }
    getSensorIDByType(typeInt);
    getSensorDataItem(typeStr);
});
$("#type4_id").on("change",function(){
    // console.log( $("option:selected",this).val());
    var currentSelect = $("option:selected",this).val();
    typeIndex = 4;
    var typeInt;
    var typeStr;
    console.log('test:'+currentSelect);
    switch (parseInt(currentSelect)){
        case 0:
            typeInt = 3;
            typeStr = "Accelerometer";
            break;
        case 1:
            typeInt = 1;
            typeStr = "Anemometer";
            console.log('typeInt:'+typeInt);
            console.log('typeStr:'+typeStr);
            break;
        case 2:
            typeInt = 2;
            typeStr = "MetStation";
            break;
        case 3:
            typeInt = 0;
            typeStr = "GNSS";
            break;
        default:
            console.log('def typeInt:'+typeInt);
            console.log('def typeStr:'+typeStr);
            break;
    }
    getSensorIDByType(typeInt);
    getSensorDataItem(typeStr);
});



function getSensorIDByType(type){
    var strId="";
    var json = {
        "bridgeName": "Forth Road Bridge",
        "senType": type
    };
    $.ajax({
        type: "GET",
        url: "http://128.243.138.25:1212/apix/RTModule/GetSensorsInfo",
        data: json,
        async: true,
        beforeSend: function(XHR) {
            //发送ajax请求之前向http的head里面加入验证信息
            XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
        },
        success: function(data) {
            //				alert("请求成功");
            // console.log(data);

                $.each( data["listSensor"], function(m, lists) {
                    // console.log("test:"+lists);
                    // console.log(lists.sensorID);
                    strId+="<option>"+lists.sensorID+"</option>";
                });
                if(strId!=null){
                    switch (navIndex) {
                        case 0:
                            $("#id4_id").html(strId);
                            break;
                        case 1:
                        	if(typeIndex ==1){
                                $("#id1_id").html(strId);
							}
                            if(typeIndex ==2){
                                $("#id2_id").html(strId);
                            }
                            if (initDoubleflag){
                                $("#id1_id").html(strId);
                                $("#id2_id").html(strId);
							}
                            break;
                        case 2:
                            $("#id3_id").html(strId);
                            break;

                        default:
                            break;
                    }
                }
        },
        error: function(request) {
            // alert("请求失败");
        }
    });
}

function getSensorDataItem(type) {
    var strData="";
    var json = {
        "bridgeName": "Forth Road Bridge",
        "sensorType": type

    };
    $.ajax({
        type: "GET",
        url: "http://128.243.138.25:1212/apix/DataType/GetDataType",
        data: json,
        async: true,
        beforeSend: function(XHR) {
            //发送ajax请求之前向http的head里面加入验证信息
            XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
        },
        success: function(data) {
            //				alert("请求成功");
            // console.log(data);
            for (var i=0;i<data["listDirections"].length;i++){
                strData+="<option value='"+i+"'>"+data["listDirections"][i]+"</option>";
			}

            if(strData!=null){
                // console.log(strData);
                switch (navIndex) {
                    case 0:
                        $("#data4_id").html(strData);
                        break;
                    case 1:
                        if(typeIndex ==1){
                            $("#data1_id").html(strData);
                        }
                        if(typeIndex ==2){
                            $("#data2_id").html(strData);
                        }
                        if(initDoubleflag){
                            $("#data1_id").html(strData);
                            $("#data2_id").html(strData);
						}
                        break;
                    case 2:
                        $("#data3_id").html(strData);
                        break;

                    default:
                        break;
                }
                // $("#data1_id").html(strData);
                // $("#data2_id").html(strData);
                // $("#data3_id").html(strData);
                // $("#data4_id").html(strData);
            }
        },
        error: function(request) {
            // alert("请求失败");
            //			console.log(request);
        }
    });
}

$(function() {
	var $test1 = $("#test1");
	var $test2 = $("#test2");

    //返回用户需要下载的文件，针对单个传感器
	$test1.bind('click', function() {
        if ((dataObj.user.role != 0)&&(dataObj.user.role != 2)){
            alert("Only Administrator or Researcher can download data.");
            return;
        }
        if ((fromyear == null)||(frommonth == null)||(fromday == null)||(toyear == null)||(tomonth == null)||(today == null)) {
            alert("Please finish your date selection");
            return;
        }
		var token = window.localStorage.getItem("Geo_Token");
		var fromTime = new Date(fromyear,frommonth-1,fromday+1); //最近的查询时间
		var toTime = new Date(toyear,tomonth-1,today+1); //最近的查询时间
        // var fromTime = new Date(); //最近的查询时间
        // var toTime = new Date(); //最近的查询时间
		var cFromTime = fromTime.toISOString();
		var cToTime = toTime.toISOString();
		console.log(fromTime);
        console.log(toTime);
        console.log(cFromTime);
        console.log(cToTime);

		var isAverage = true;

		var sensorID1 = "undefined";
		var sensorType1 = 0;
        var sensorID2 = "undefined";
        var sensorType2 = 0;

        var dataMark1=0;
        var dataMark2=0;

        var json;

        switch (navIndex) {
            case 0:
                sensorID1 = $('#id4_id option:selected') .val();
                sensorType1 = $('#type4_id option:selected') .val();
                dataMark1 = $('#data4_id option:selected') .val();
                break;
            case 1:
            	sensorID1 = $('#id1_id option:selected') .val();
            	sensorType1 = $('#type1_id option:selected') .val();
            	dataMark1 = $('#data1_id option:selected') .val();
                sensorID2 = $('#id2_id option:selected') .val();
                sensorType2 = $('#type2_id option:selected') .val();
                dataMark2 = $('#data2_id option:selected') .val();
                break;
            case 2:
                sensorID1 = $('#id3_id option:selected') .val();
                sensorType1 = $('#type3_id option:selected') .val();
                dataMark1 = $('#data3_id option:selected') .val();
                break;

            default:
                break;
        }

        if(navIndex==1){
            json = {
                "bridgeName": "Forth Road Bridge",
                "sensorType_1": sensorType1,
				"sensorID_1": sensorID1,
				"dataMark_1": dataMark1,
				"sensorType_2": sensorType2,
				"sensorID_2": sensorID2,
				"dataMark_2":dataMark2,
				"fromTime": cFromTime,
				"toTime": cToTime
            };
		}else {
            json = {
                "bridgeName": "Forth Road Bridge",
                "sensorType": sensorType1,
                "sensorID": sensorID1,
                "fromTime": cFromTime,
                "toTime": cToTime,
                "isAverage": isAverage,
                "dataMark": dataMark1
            };
		}
		// console.log(json);
		$.ajax({
			type: "GET",
			url: "http://128.243.138.25:1212/apix/DataDownload/DataDown",
			data: json,
			async: true,
			beforeSend: function(XHR) {
				//发送ajax请求之前向http的head里面加入验证信息
				XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
			},
			success: function(data) {
//				elert("请求成功");
				console.log(JSON.stringify(data));
				if (data.datafile != ""){
                    var newWindow = window.open();
                    newWindow.location.href = data.datafile;
                } else {
				    alert(data.ResultInfo.ReturnTip);
                }
			},
			error: function(requset) {
//				alert("请求失败");
			}
		});
	})
})
// 	//合并两个传感器数据 时间对齐，为10分钟均值
// 	$test2.bind('click', function() {
// 		var token = window.localStorage.getItem("Geo_Token");
// 		var fromTime = new Date(); //最近的查询时间
// 		var toTime = new Date(); //最近的查询时间
// 		var cFromTime = fromTime.toISOString();
// 		var cToTime = toTime.toISOString();
// 		var isAverage = true;
// 		var dataMark = 0;
//
// 		var json = {
// 			"bridgeName": "Forth Road Bridge",
// 			"sensorType_1": 0,
// 			"sensorID_1": "SHM2",
// 			"dataMark_1": 1,
// 			"sensorType_2": 1,
// 			"sensorID_2": "ANE1",
// 			"dataMark_2": 0,
// 			"fromTime": cFromTime,
// 			"toTime": cToTime
// 		};
// 		$.ajax({
// 			type: "GET",
// 			url: "http://128.243.138.25:1212/apix/DataDownload/DataDown",
// 			data: json,
// 			async: true,
// 			beforeSend: function(XHR) {
// 				//发送ajax请求之前向http的head里面加入验证信息
// 				XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
// 			},
// 			success: function(data) {
// //				alert("请求成功");
// // 				console.log(data);
// 			},
// 			error: function(request) {
// //				alert("请求失败");
// 				console.log(request);
// 			}
// 		});
// 	})
})