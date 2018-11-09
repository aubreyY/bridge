//event html
var fromyear = null;
var frommonth= null;
var fromday= null;
var toyear = null;
var tomonth = null;
var today = null;

var urls = new Array();
//menu_from
lay('#version').html('-v' + laydate.v);

laydate.render({
	elem: '#menu_from',
	lang: 'en',
    done: function (value,date) {
        fromyear = date.year;
        frommonth= date.month;
        fromday= date.date;
        console.log(date);
    }
});
//menu_to
lay('#version').html('-v' + laydate.v);
laydate.render({
	elem: '#menu_to',
	lang: 'en',
    done: function (value,date) {
        toyear = date.year;
        tomonth= date.month;
        today= date.date;
        console.log(date);
    }
});
$(function() {
	//table
	$("tr:odd").addClass("tr_odd");
	$("tr:even").addClass("tr_even");
    // getAllExtremeInfos();
})

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

var extremeData = Array();
extremeData[0] = new Array();
extremeData[1] = new Array();

$("#processid").bind("click", function () {

    if ((dataObj.user.role != 0)&&(dataObj.user.role != 1)){
        alert("Only Administrator or Engineer can get extreme event information .");
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
	getAllExtremeInfos(cFromTime, cToTime);
})

function getAllExtremeInfos(fromtime,totime) {
        var token = window.localStorage.getItem("Geo_Token");
        var strExtremeInfo = "";
        var json = {
            "bridgeName": "Forth Road Bridge",
			"fromTime": fromtime,
			"toTime":totime
        };
        $.ajax({
            type: "GET",
            url: "http://128.243.138.25:1212/apix/Extreme/GetExtreme",
            data: json,
            async: true,
            beforeSend: function(XHR) {
                //发送ajax请求之前向http的head里面加入验证信息
                XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
            },
            success: function(data) {
                // alert("请求成功！");
                console.log(data);
                if (data.listEvents.length == 0) {
                    alert("No data");
                    return;
                }
                $(".menu_num").empty();
                var eventID = 0;
                $.each(data["listEvents"],function (key,value) {

                	if (value.reportName == ""){
                        strExtremeInfo+="<tr class='tab_tr' id='event"+eventID+"' >"+
                            "<td class='tab_td'>"+value.time+"</td>"+
                            "<td class='tab_td'>"+value.name+"</td>"+
                            "<td class='tab_td'>"+value.resThreshold+"</td>"+
                            "<td class='tab_td'>"+value.reportName+"</td>"+
                            "</tr>";
					}else {
                        strExtremeInfo+="<tr class='tab_tr'>"+
                            "<td class='tab_td' id='event"+eventID+"' >"+value.time+"</td>"+
                            "<td class='tab_td' id='event"+eventID+"' >"+value.name+"</td>"+
                            "<td class='tab_td' id='event"+eventID+"' >"+value.resThreshold+"</td>"+
                            "<td class='tab_td' id='event"+eventID+"' >"+value.reportName+"</td>"+
                            "<td class='menu_img'><a href='"+value.reportURL+"' target='_blank'><img id='download' value='"+key+"'  src='static/img/down.png'/></a></td>"+
                            "</tr>";
					}

                    console.log("event"+eventID);
                    var elementID = "event"+eventID;
                    $("#event"+eventID).live('click',function () {
                        // console.log("time:");
                        console.log(value.time);
                        console.log(value.name);
                        getExtremeEventData(value.time, value.name);
                        // drawExtremeEvent("event_chart1",0);
                        // drawExtremeEvent("event_chart2",1);

                    });
                    // $(".event"+eventID).click(indata,drawCurrentEvent);

                    eventID = eventID + 1;

                    urls.push(value.reportURL);
                })
                $(".menu_num").append(strExtremeInfo);
            },
            error: function(request) {
                // alert("请求失败！");
            }
        });

}

function getExtremeEventData(time, name) {
    	//保存token
	var token = window.localStorage.getItem("Geo_Token");
	var json = {
		"bridgename": "Forth Road Bridge",
		"time":time,
		"name":name
	};

    $("#loadgif").show();
	// var urlstr = "http://128.243.138.25:1212/apix/Extreme/GetExtremeEvent?stime=" + new Date().getTime();
    var urlstr = "http://128.243.138.25:1212/apix/Extreme/GetExtremeEvent";

	$.ajax({
		type: "GET",
		url: urlstr,
		contentType: "application/json",
		data: json,
		traditional: true,
		dataType: "json",
		async: true,
		beforeSend: function(XHR) {
			//发送ajax请求之前向http的head里面加入验证信息
			XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
		},
		success: function(point) {
            // console.log("point:"+JSON.stringify(point));
			console.log("point:"+JSON.stringify(point.listAne));
            // console.log("point:"+JSON.stringify(point.listResponse));
			var resArray = new Array();
			var aneArray = new Array();
			var value_x, value_y;
			if (point.listResponse.length != 0) {
				for (var i = 0;i < point.listResponse.length; i++) {
					value_x = Date.parse(point.listResponse[i].dataTime);
					value_y = point.listResponse[i].dataVale;
					// resArray[i][0] = value_x;
    	            // resArray[i][1] = value_y;
					resArray[i] = new Array();
                    resArray[i][0] = value_x;
                    resArray[i][1] = value_y;
                    // resArray[i].push([value_x,value_y]);
				}
                // console.log("resArray:"+resArray);
                newEventChart("event_chart1", "Extreme Chart", "Deformation VS Time", "Deformation", "Meter", resArray);
			}
            if (point.listAne.length != 0) {
				for (var i = 0; i< point.listAne.length; i++) {
    	            value_x = Date.parse(point.listAne[i].dataTime);
    	            value_y = point.listAne[i].dataVale;
    	            aneArray[i] = new Array();
                    aneArray[i][0] = value_x;
                    aneArray[i][1] = value_y;
				}
                // console.log("aneArray:"+aneArray);
                newEventChart("event_chart2", "Extreme Chart", "Windspeed VS Time", "Windspeed", "MPH", aneArray);
			}
            $("#loadgif").hide();
			if ((point.listResponse.length == 0)&&(point.listAne.length == 0)) {
				alert("No Data");
			}
		},
		error: function(point) {
            $("#loadgif").hide();
            alert("No Data");
		},
	})
}


//极端事件数据
function newEventChart(elementID, title, subtitle, ytitle, unit, data){
    var $test = $("#test");

    var xAxisJson = null;
    var markerEnable = false;
    // if (chartType == "scatter"){
    // var xMin =data[0][0];
    var timeformat = null;
    timeformat = {
        millisecond: '%H:%M:%S.%L',
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%m-%d',
        week: '%m-%d',
        month: '%Y-%m',
        year: '%Y'
    };
    xAxisJson = {
         type: 'datetime',
         dateTimeLabelFormats:timeformat
    };

	//container_1
	Highcharts.chart(elementID, {
		chart: {
            type: "line",
			marginRight: 10,
            zoomType: "x"
		},
		title: {
			text: title
		},
		subtitle: {
			text: subtitle
		},
		yAxis: {
			title: {
					text: unit
				}
		},
		xAxis: xAxisJson,
        // boost: {
        //     useGPUTranslations: true
        // },
		tooltip: {
            valueDecimals: 2
		},
		plotOptions: {
            line: {
                lineWidth: 1,
                marker: {
                    enabled:markerEnable
                },
                animation: false,

            },
            series:{
                marker: {
                        enabled: markerEnable,
                        symbol:"triangle",
						radius: 2
					},
                animation: false
            }
		},
		series: [{
            color: 'rgba(223, 83, 83, .5)',
            turboThreshold: 1000000,
			data: data,
            lineWidth: 0.5
		}]
	});
}


function drawExtremeEvent(elementID, index) {
	console.log("element"+elementID);
    // console.log("time:"+time);
    console.log("name:"+name);

	var bool = true;

	new Highcharts.Chart({
		chart: {
			renderTo: "event_chart1",
			backgroundColor: '#2F2F2F',
			type: 'line',
			marginRight: 20,
			animation: Highcharts.svg,
			events: {
				load: function() {
					var series1 = this.series[0],
						series2 = this.series[1],
						series3 = this.series[2],
						chart = this;
				$.ajax({
					type: "GET",
					url: urlstr,
					contentType: "application/json",
					data: json,
					traditional: true,
					dataType: "json",
					async: true,
					beforeSend: function(XHR) {
						//发送ajax请求之前向http的head里面加入验证信息
						XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
					},
					success: function(point) {
						console.log("point:"+JSON.stringify(point));
						if (point.ResultInfo.ReturnMark != true) {
							alert("no data");
							return;
						}
					},
					error: function(point) {
						//console.log("request fail！");
					},
				})

				}
			}
		},
		title: {
			text: null,
			align: 'low'
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
		xAxis: {
			labels: {
				style: {
					color: '#cdcdcd'
				}
			},
			lineColor: '#cdcdcd',
			lineWidth: 0,
			type: 'datetime',
			tickPixelInterval: 90,
			title: {
				text: null
			},
			tickColor: '#434343',
			tickWidth: 1
		},
		yAxis: {
			labels: {
				style: {
					color: '#cdcdcd'
				}
			},
			lineColor: '#cdcdcd',
			lineWidth: 0,
			title: {
				text: null
			},
			gridLineWidth: 1,
			alternateGridColor: null,
			gridLineDashStyle: 'line',
			gridLineColor: '#434343'
		},
		tooltip: {
			backgroundColor: '#cdcdcd',
			formatter: function() {
				return '<b>' + this.series.name + '</b><br/>' +
					Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
					Highcharts.numberFormat(this.y, 2);
			}
		},
		plotOptions: {
			line: {
				lineWidth: 1,
				marker: {
					enabled: true
				},
				// one hour
				pointStart: Date.parse(new Date()),
				pointInterval: 60
			}
		},
		navigation: {
			menuItemStyle: {
				fontSize: '15px'
			}
		},
		credits: {
			enabled: false
		},
		exporting: {
			enabled: false
		},
		colors: ['#00A6FF', '#F3FD00', '#A01499'],
		series: extremeData[index]

	});

}
})
