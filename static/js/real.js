//real html
var allData1 = new Array();
var allData2 = new Array();
var allData3 = new Array();
var allData4 = new Array();
var allData5 = new Array();
var allData6 = new Array();
var windData1 = new Array();
var windData2 = new Array();
var windData3 = new Array();
var windDataReal = new Array();

var chartall;
var chartwind;

var starttime;
var endtime;

var currentday;

var hisstarttime;
var hisendtime;

var lastRunningtime;
var nextRunningtime;

var started = false;

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

$(function() {
	var $test2 = $(".pau_btn");
    $test2.bind('click', function() {
        if ((dataObj.user.role != 0)&&(dataObj.user.role != 1)){
            alert("Only Administrator or Engineer can get real time warning.");
            return;
        }
        starttime = new Date(new Date(new Date().toLocaleDateString()));
        starttime.setHours(starttime.getHours()+1);
        endtime = new Date();
        endtime.setHours(endtime.getHours()+1);
        console.log("starttime:"+starttime);
        console.log("endtime:"+endtime);
        if (($("#monitor").text() == "Start to Monitor")){
            $("#monitor").html("Pause to Monitor");
            if (!started) {
                started = true;
			}else {
            	return;
			}
		} else {
            $("#monitor").html("Start to Monitor");
            return;
		}

        hisstarttime = new Date(2015,0,1,00,00,00);
        hisstarttime.setHours(hisstarttime.getHours()+1);
        hisendtime = new Date(2016,0,1,00,00,00);
        hisendtime.setHours(hisendtime.getHours()+1);
        // hisstarttime.setHours(hisstarttime.getHours()+1);
        // hisendtime.setHours(hisendtime.getHours()+1);

		if (chartwind!=null){
			chartwind.destroy();
            allData1 = new Array();
            allData2 = new Array();
            allData3 = new Array();
            allData4 = new Array();
            allData5 = new Array();
            allData6 = new Array();
            windData1 = new Array();
            windData2 = new Array();
            windData3 = new Array();
            windDataReal = new Array();
		}
		if (chartall != null){
			chartall.destroy();
            allData1 = new Array();
            allData2 = new Array();
            allData3 = new Array();
            allData4 = new Array();
            allData5 = new Array();
            allData6 = new Array();
            windData1 = new Array();
            windData2 = new Array();
            windData3 = new Array();
            windDataReal = new Array();
		}

        drawrealtimewarning();
        getData1();
        getData2();
        getData3();
        getData4();
        getData5();
        getData6();
        wind();
        windreal();
    });
});



function drawrealtimewarning() {

        console.log(JSON.stringify(windData1));
		chartwind = Highcharts.chart('container_1', {
			chart: {
				zoomType: 'xy'
			},
			title: {
				text: 'Wind Speed (MPH)'
			},
			xAxis: {
                title: {
                    text: 'Wind	 Speed(MHP)'
                },
				labels: {
					enabled: true
				}
			},
			yAxis: {
				title: {
					text: 'Deformation(meter)'
				}
			},
            boost: {
                useGPUTranslations: true
            },
			credits: {
				enabled: false
			},
			exporting: {
				enabled: false
			},
	        legend: {
				itemHoverStyle: {
					color: '#f00'
				},
				itemStyle: {
					color: '#cdcdcd',
					fontWeight: 'bold'
				}
			},
			tooltip: {
				backgroundColor: '#fff',
				formatter: function() {
					return '<b>' + this.series.name + '</b><br/>' +
						Highcharts.numberFormat(this.y, 2) + '(MPH)';
				}
			},
			series: [{
					name: 'Mean Value',
					type: 'line',
					color: "#4386D8",
					marker: {
						radius: 0.5
					},
					// data: windData1
				},
				{
					name: 'Mean+3*STD',
					type: 'line',
					color: "#FF0000",
					marker: {
						radius: 0.5
					},
					// data: windData2
				},
				{
					name: 'Mean-3*STD',
					type: 'line',
					color: "#FF0000",
					marker: {
						radius: 0.5
					},
					// data: windData3
				},
				{
					name: 'DataSeries3',
					type: 'scatter',
					color: "#0000D4",
					marker: {
						radius: 2
					},
					// data: []
				}
			]
		});

		chartall = Highcharts.chart('container_2', {
			chart: {
				zoomType: 'xy'
			},
			title: {
				text: 'SHM2-SHM3 Frequency'
			},
			xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S.%L',
                    day: '%H:%M'
                },
				labels: {
					enabled: true
				}
			},
			yAxis: {
				title: {
					text: '(Hz)'
				}
			},
            boost: {
                useGPUTranslations: true
            },
			credits: {
				enabled: false
			},
			exporting: {
				enabled: false
			},
            legend: {
				itemHoverStyle: {
					color: '#f00'
				},
				itemStyle: {
					color: '#cdcdcd',
					fontWeight: 'bold'
				}
			},
			tooltip: {
				backgroundColor: '#fff',
				formatter: function() {
					return '<b>' + this.series.name + '</b><br/>' +
						Highcharts.numberFormat(this.y, 2) + '(Hz)';
				}
			},
			series: [{
					name: 'RT-Y',
					type: 'scatter',
					color: "#ff0000",
                	zIndex:100,
					marker: {
						symbol:"square",
						radius: 2
					},
					// data: allData1
				},
				{
					name: 'RT-Z',
					type: 'scatter',
					color: "#ff0000",
                    zIndex:100,
					marker: {
                        symbol:"diamond",
						radius: 2
					},
					// data: allData2
				},
				{
					name: 'RT-R',
					type: 'scatter',
					color: "#FF0000",
                    zIndex:100,
					marker: {
                        symbol:"triangle",
						radius: 2
					},
					// data: allData3
				},
                {
                    name: 'HIS-Y',
                    type: 'scatter',
                    color: "#4386D8",
                    zIndex:10,
                    marker: {
                        radius: 2
                    },
                    // data: allData1
                },
                {
                    name: 'HIS-Z',
                    type: 'scatter',
                    color: "#FF9A2E",
                    zIndex:10,
                    marker: {
                        radius: 2
                    },
                    // data: allData2
                },
                {
                    name: 'HIS-R',
                    type: 'scatter',
                    color: '#D3D3D3',
                    zIndex:10,
                    marker: {
                        radius: 2
                    },
                    // data: allData3
                }
			]
		});
}

function getData1() {
	var token = window.localStorage.getItem("Geo_Token");
	var startTime = starttime;
	var endTime = endtime;
	var isDownLoad = false;
	var CSharpStartDate = startTime.toISOString();
	var CSharpEndDate = endTime.toISOString();
    currentday = CSharpStartDate.slice(0,10);
	var json = {
		"bridgename": "Forth Road Bridge",
		"dtStart": CSharpStartDate,
		"dtEnd": CSharpEndDate,
		"GNSSID": "SHM2-SHM3",
		"direction": 1,
		"dataType": 8,
		"isDownLoad": isDownLoad
	};
	console.log("Json:"+JSON.stringify(json));
	$.ajax({
		type: "GET",
		url: "http://128.243.138.25:1212/apix/HisQuery/HisGNSSData",
		data: json,
		dataType: "json",
		async: true,
		beforeSend: function(XHR) {
			//发送ajax请求之前向http的head里面加入验证信息
			XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
		},
		success: function(result) {
            // console.log("result1:"+JSON.stringify(result));
			var value_y;
            var value_x;
			$.each(result["listData"], function(key, value) {
				value_y = value.dataVale;
                value_x = value.dataTime;
				allData1.push([Date.parse(value.dataTime),value.dataVale]);
			});
            lastRunningtime = new Date(Date.parse(value_x));
            lastRunningtime = lastRunningtime.toString();
            lastRunningtime = lastRunningtime.slice(0,24);
            $("#lastid").attr("value", lastRunningtime);
            nextRunningtime = new Date(Date.parse(value_x)+600000);
            nextRunningtime = nextRunningtime.toString();
            nextRunningtime = nextRunningtime.slice(0,24);
            $("#nextid").attr("value", nextRunningtime);
            console.log("lastRunningtime:"+lastRunningtime);
			console.log("allData1:"+allData1);
			chartall.series[0].setData(allData1);
		},
		error: function(request) {

			// alert("Bad");
		}
	});
}

function getData2() {
	var token = window.localStorage.getItem("Geo_Token");
    var startTime = starttime;
    var endTime = endtime;
	var isDownLoad = false;
	var CSharpStartDate = startTime.toISOString();
	var CSharpEndDate = endTime.toISOString();

	var json = {
		"bridgename": "Forth Road Bridge",
		"dtStart": CSharpStartDate,
		"dtEnd": CSharpEndDate,
		"GNSSID": "SHM2-SHM3",
		"direction": 2,
		"dataType": 8,
		"isDownLoad": isDownLoad
	};
	$.ajax({
		type: "GET",
		url: "http://128.243.138.25:1212/apix/HisQuery/HisGNSSData",
		data: json,
		dataType: "json",
		async: true,
		beforeSend: function(XHR) {
			//发送ajax请求之前向http的head里面加入验证信息
			XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
		},
		success: function(result) {
            // console.log("result2:"+JSON.stringify(result));
			var value_z;
			$.each(result["listData"], function(key, value) {
				value_z = value.dataVale;
                allData2.push([Date.parse(value.dataTime),value.dataVale]);
			});
            // console.log("allData2:"+allData2);
            chartall.series[1].setData(allData2);
		},
		error: function(request) {

			// alert("Bad");
		}
	});
}

function getData3() {
	var token = window.localStorage.getItem("Geo_Token");
    var startTime = starttime;
    var endTime = endtime;
	var isDownLoad = false;
	var CSharpStartDate = startTime.toISOString();
	var CSharpEndDate = endTime.toISOString();

	var json = {
		"bridgename": "Forth Road Bridge",
		"dtStart": CSharpStartDate,
		"dtEnd": CSharpEndDate,
		"GNSSID": "SHM2-SHM3",
		"direction": 3,
		"dataType": 8,
		"isDownLoad": isDownLoad
	};
	$.ajax({
		type: "GET",
		url: "http://128.243.138.25:1212/apix/HisQuery/HisGNSSData",
		data: json,
		dataType: "json",
		async: true,
		beforeSend: function(XHR) {
			//发送ajax请求之前向http的head里面加入验证信息
			XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
		},
		success: function(result) {
            // console.log("result3:"+JSON.stringify(result));
			var value_r;
			$.each(result["listData"], function(key, value) {
				value_r = value.dataVale;
                allData3.push([Date.parse(value.dataTime), value.dataVale]);
			});
            // console.log("allData3:"+allData3);
            chartall.series[2].setData(allData3);

		},
		error: function(request) {

			// alert("Bad");
		}
	});
}
function getData4() {
    var token = window.localStorage.getItem("Geo_Token");
    var startTime = hisstarttime;
    var endTime = hisendtime;
    var isDownLoad = false;
    var CSharpStartDate = startTime.toISOString();
    var CSharpEndDate = endTime.toISOString();

    var json = {
        "bridgename": "Forth Road Bridge",
        "dtStart": CSharpStartDate,
        "dtEnd": CSharpEndDate,
        "GNSSID": "SHM2-SHM3",
        "direction": 1,
        "dataType": 8,
        "isDownLoad": isDownLoad
    };
    $.ajax({
        type: "GET",
        url: "http://128.243.138.25:1212/apix/HisQuery/HisGNSSData",
        data: json,
        dataType: "json",
        async: true,
        beforeSend: function(XHR) {
            //发送ajax请求之前向http的head里面加入验证信息
            XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
        },
        success: function(result) {
            // console.log("result4:"+JSON.stringify(result));
            var value_r;
            $.each(result["listData"], function(key, value) {
                var value_time = value.dataTime;
                // console.log("valuetime before sliced"+value_time);
                value_time = value_time.slice(10);
                // console.log("valuetime sliced"+value_time);
                value_time = currentday+value_time;
                // console.log("valuetime combined"+value_time);
                allData4.push([Date.parse(value_time)+3600000, value.dataVale]);
            });
            // console.log("allData3:"+allData3);
            chartall.series[3].setData(allData4);

        },
        error: function(request) {

            // alert("Bad");
        }
    });
}
function getData5() {
    var token = window.localStorage.getItem("Geo_Token");
    var startTime = hisstarttime;
    var endTime = hisendtime;
    var isDownLoad = false;
    var CSharpStartDate = startTime.toISOString();
    var CSharpEndDate = endTime.toISOString();

    var json = {
        "bridgename": "Forth Road Bridge",
        "dtStart": CSharpStartDate,
        "dtEnd": CSharpEndDate,
        "GNSSID": "SHM2-SHM3",
        "direction": 2,
        "dataType": 8,
        "isDownLoad": isDownLoad
    };
    $.ajax({
        type: "GET",
        url: "http://128.243.138.25:1212/apix/HisQuery/HisGNSSData",
        data: json,
        dataType: "json",
        async: true,
        beforeSend: function(XHR) {
            //发送ajax请求之前向http的head里面加入验证信息
            XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
        },
        success: function(result) {
            // console.log("result3:"+JSON.stringify(result["listData"]));
            $.each(result["listData"], function(key, value) {
                var value_time = value.dataTime;
                // console.log("valuetime before sliced"+value_time);
                value_time = value_time.slice(10);
                // console.log("valuetime sliced"+value_time);
                value_time = currentday+value_time;
                // console.log("valuetime combined"+value_time);

                // console.log("value_time:"+value_time);
                allData5.push([Date.parse(value_time)+3600000, value.dataVale]);
            });
            // console.log("allData3:"+allData3);
            chartall.series[4].setData(allData5);

        },
        error: function(request) {

            // alert("Bad");
        }
    });
}
function getData6() {
    var token = window.localStorage.getItem("Geo_Token");
    var startTime = hisstarttime;
    var endTime = hisendtime;
    var isDownLoad = false;
    var CSharpStartDate = startTime.toISOString();
    var CSharpEndDate = endTime.toISOString();

    var json = {
        "bridgename": "Forth Road Bridge",
        "dtStart": CSharpStartDate,
        "dtEnd": CSharpEndDate,
        "GNSSID": "SHM2-SHM3",
        "direction": 3,
        "dataType": 8,
        "isDownLoad": isDownLoad
    };
    console.log("Json:"+JSON.stringify(json));
    $.ajax({
        type: "GET",
        url: "http://128.243.138.25:1212/apix/HisQuery/HisGNSSData",
        data: json,
        dataType: "json",
        async: true,
        beforeSend: function(XHR) {
            //发送ajax请求之前向http的head里面加入验证信息
            XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
        },
        success: function(result) {
            // console.log("result3:"+JSON.stringify(result["listData"]));
            var value_r;
            $.each(result["listData"], function(key, value) {
                var value_time = value.dataTime;
                // console.log("valuetime before sliced"+value_time);
                value_time = value_time.slice(10);
                // console.log("valuetime sliced"+value_time);
                value_time = currentday+value_time;
                // console.log("valuetime combined"+value_time);

                // console.log("value_time:"+value_time);
                allData6.push([Date.parse(value_time)+3600000, value.dataVale]);
            });
            // console.log("allData6:"+allData6);
            chartall.series[5].setData(allData6);
        },
        error: function(request) {
        }
    });
}


//获取当前时间的前10分钟
var getSpeicalTime = function() {
	var now = new Date;
	now.setMinutes(now.getMinutes() - 16);
	var cNow = now.toISOString();
	return cNow;
}
var when = getSpeicalTime();
//每10分钟获取一次
setInterval(function warning1() {
	var token = window.localStorage.getItem("Geo_Token");
	var fromTime = when; //10分钟前的查询时间
	var toTime = new Date(); //当前结束的查询时间
    toTime.setMinutes(toTime.getMinutes() - 6);
	var cToTime = toTime.toISOString();

	var json = {
		"bridgeName": "Forth Road Bridge",
		"ANEID": "ANE3",
		"GNSSName": "SHM2-SHM3",
		"direction": 1,
		"fromTime": fromTime,
		"toTime": cToTime
	};
	console.log("json:"+JSON.stringify(json));
	$.ajax({
		type: "GET",
		url: "http://128.243.138.25:1212/apix/RTWarning/GetRTWarning",
		data: json,
		async: true,
		beforeSend: function(XHR) {
			//发送ajax请求之前向http的head里面加入验证信息
			XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
		},
		success: function(data) {
			console.log(data);
		},
		error: function(request) {
			console.log("请求失败！");
		}
	});
}, 1000000);
function wind() {
    var token = window.localStorage.getItem("Geo_Token");
    var thresholdname = "ANE3_SHM2-SHM3";
    var genTime = new Date(2018, 01, 01, 10, 05, 09); //最近的查询时间
    // var genTime = new Date();
    // console.log("genTime:"+genTime);
    // genTime.setDate(genTime.getDay());
    // console.log("genTime:"+genTime);

    var json = {
        "bridgeName": "Forth Road Bridge",
        "thresholdname": thresholdname,
        "genTime": genTime.toISOString()
    };
    $.ajax({
        type: "GET",
        url: "http://128.243.138.25:1212/apix/Threshold/GetThresoldWind",
        data: json,
        async: true,
        beforeSend: function (XHR) {
            //发送ajax请求之前向http的head里面加入验证信息
            XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
        },
        success: function (data) {
            // console.log("wind:" + JSON.stringify(data));
            var value_x = data.minWindSpeed*2.237;
            var interval = data.speedInterval*2.237;
            for (var i = 0; i < data.listMean.length; i++) {
                var value_y;
                value_y = data.listMean[i];
                windData1.push([value_x,value_y]);
                // console.log(value_y);
                value_x2 = data.listMean[i] + 3 * data.listSTD[i];
                value_x3 = data.listMean[i] - 3 * data.listSTD[i];
                windData2.push([value_x,value_x2]);
                windData3.push([value_x,value_x3]);
                value_x = value_x + interval;
            }
            chartwind.series[0].setData(windData1);
            chartwind.series[1].setData(windData2);
            chartwind.series[2].setData(windData3);
        },
        error: function (request) {
            // alert("Bad");
        }
    });
}

function windreal() {
    var token = window.localStorage.getItem("Geo_Token");
    var thresholdname = "ANE3_SHM2-SHM3";
    // var genTime = new Date();
    // console.log("genTime:"+genTime);
    // genTime.setDate(genTime.getDay());
    // console.log("genTime:"+genTime);
    var fromTime = starttime.toISOString();
    var toTime = endtime.toISOString();

    var json = {
        "bridgeName": "Forth Road Bridge",
        "ANEID": "ANE3",
        "GNSSName": "SHM2-SHM3",
        "direction":1,
        "fromTime":fromTime,
        "toTime":toTime
    };
    $.ajax({
        type: "GET",
        url: "http://128.243.138.25:1212/apix/RTWarning/GetRTWarning",
        data: json,
        async: true,
        beforeSend: function(XHR) {
            //发送ajax请求之前向http的head里面加入验证信息
            XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
        },
        success: function(data) {
            console.log("windreal:" + JSON.stringify(data));
            // console.log("winddataLength:" + data.listAneLoading.length);
            for(var i = 0; i < data.listAneLoading.length; i++) {

                windDataReal.push([data.listAneLoading[i], data.listRespons[i]]);
            }
            // console.log("winddata:"+windDataReal);
            chartwind.series[3].setData(windDataReal);
        },
        error: function(request) {
            // alert("Bad");
        }
    });
}
})
