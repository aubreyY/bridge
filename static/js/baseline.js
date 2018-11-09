//baseline html

var fromyear = null;
var frommonth = null;
var fromday = null;
var toyear = null;
var tomonth = null;
var today = null;

var windData1 = new Array();
var windData2 = new Array();
var windData3 = new Array();
var gminWindSpeed = null;
var gspeedInterval = null;
var gmaxWindSpeed = null;

//key parameter for thresold
var tname = null;
var ttime = null;
var tchart = null;

//menu_from
lay('#version').html('-v' + laydate.v);

laydate.render({
	elem: '#menu_from',
	lang: 'en',
	done: function(value, date) {
		fromyear = date.year;
		frommonth = date.month;
		fromday = date.date;
		console.log(date);
	}
});
//menu_to
lay('#version').html('-v' + laydate.v);

laydate.render({
	elem: '#menu_to',
	lang: 'en',
	done: function(value, date) {
		toyear = date.year;
		tomonth = date.month;
		today = date.date;
		console.log(date);
	}
});

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
	// getAllBaseline();
	$("tr:odd").addClass("tr_odd");
	$("tr:even").addClass("tr_even");

	$("#chart_exit").bind("click", function() {

	    if (tchart != null){
            tchart.destroy();
            tchart = null;
            windData1 = Array();
            windData2 = Array();
            windData3 = Array();
		}
		$("#chart_tab").hide(1000);

	});
})
$("#processid").bind("click", function () {
    if (dataObj.user.role != 0){
        alert("Only Administrator can get baseline threshold.");
        return;
    }
    console.log("fromY:"+fromyear);
    console.log("fromM:"+frommonth);
    console.log("fromD:"+fromday);
    var fromTime = new Date(fromyear,frommonth-1,fromday+1); //最近的查询时间
    var toTime = new Date(toyear,tomonth-1,today+1); //最近的查询时间
    console.log("from time:"+fromTime);
    console.log("to time:"+toTime);
    var cFromTime = fromTime.toISOString();
    var cToTime = toTime.toISOString();
	getAllBaseline(cFromTime, cToTime);
})

function getAllBaseline(fromtime, totime) {
	var token = window.localStorage.getItem("Geo_Token");
	var strBaseline = "";
	var json = {
		"bridgeName": "Forth Road Bridge",
        "fromTime": fromtime,
        "toTime":totime
	};
	// $(".menu_tab").empty();
	$.ajax({
		type: "GET",
		url: "http://128.243.138.25:1212/apix/Threshold/GetThresoldWind",
		data: json,
		async: true,
		beforeSend: function(XHR) {
			//发送ajax请求之前向http的head里面加入验证信息
			XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
		},
		success: function(data) {
			// alert("请求成功！");
			console.log(data);
			if (data.ResultInfo.ReturnMark == false){
				alert("No data");
				return;
			}
            $(".menu_tab").empty();
			$.each(data["listthresh_wind"], function(key, value) {
				strBaseline += "<tr class='tab_tr' id='chart"+key+"'>" +
					"<td class='tab_td'>" + value.name + "</td>" +
					"<td class='tab_td'>" + value.comments + "</td>" +
					"<td class='tab_td'>" + value.GeneratedTime + "</td>" +
					"<td class='tab_td'>" + value.minWindSpeed + "</td>" +
					"<td class='tab_td'>" + value.maxWindSpeed + "</td>" +
					"<td class='tab_td'>" + value.speedInterval + "</td>" +
					"<td class='tab_td'>" + value.responeMean + "</td>" +
					"<td class='tab_td'>" + value.responseSTD + "</td>" +
					"</tr>";
				$("#chart"+key).live('click',function () {
                    	$("#chart_tab").show(10);
                        getBaselineData(value.name, value.GeneratedTime );
                });
			})
			$(".menu_tab").append(strBaseline);

		},
		error: function(request) {
			// alert("请求失败！");
		}
	});
}

function getBaselineData(thresholdname, genTime) {
	var token = window.localStorage.getItem("Geo_Token");
	var strBaseline = "";
	var json = {
		"bridgeName": "Forth Road Bridge"
	};
	json["thresholdname"] = thresholdname;
	json["genTime"]	 = genTime;
	// $(".menu_tab").empty();
	$.ajax({
		type: "GET",
		url: "http://128.243.138.25:1212/apix/Threshold/GetThresoldWind",
		data: json,
		// async: true,
		beforeSend: function(XHR) {
			//发送ajax请求之前向http的head里面加入验证信息
			XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
		},
		success: function(data) {
			//console.log(JSON.stringify(data));

			//console.log(data);
			for(var i = 0; i < data.listMean.length; i++) {
				var value_y;
				value_y = data.listMean[i];
				windData1.push(value_y);
				//console.log(value_y);
				value_x2 = data.listMean[i] + 3 * data.listSTD[i];
				value_x3 = data.listMean[i] - 3 * data.listSTD[i];
				windData2.push(value_x2);
				windData3.push(value_x3);
			}
            drawWindThresord();
			// console.log(JSON.stringify(windData1));
		},
		error: function(request) {
			alert("request failed");
		}
	});
}

function drawWindThresord() {
    console.log(JSON.stringify(windData1));
	tchart = Highcharts.chart('chart_div', {
			chart: {
			    // type: 'line',
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

			credits: {
				enabled: false
			},
			exporting: {
				enabled: false
			},
			tooltip: {
				backgroundColor: '#ffffff',
				formatter: function() {
					return '<b>' + this.series.name + '</b><br/>' +
						Highcharts.numberFormat(this.y, 2);
				}
			},
			series: [{
					name: 'Mean Value',
					type: 'line',
					color: "#4386D8",
					marker: {
						radius: 0.5
					},
					data: windData1
				},
				{
					name: 'Mean+3*STD',
					type: 'line',
					color: "#FF0000",
					marker: {
						radius: 0.5
					},
					data: windData2
				},
				{
					name: 'Mean-3*STD',
					type: 'line',
					color: "#FF0000",
					marker: {
						radius: 0.5
					},
					data: windData3
				}
			]
		});
}

})
