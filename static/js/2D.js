/*2D html*/
// The data table slide
window.onload = function() {
	var mySwiper = new Swiper('.swiper-container', {
		effect: 'flip',
		flipEffect: {
			slideShadows: true,
			limitRotation: true,
		},
		observer: true, //修改swiper自己或子元素时，自动初始化swiper
		observeParents: true, //修改swiper的父元素时，自动初始化swiper

		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		on: {
			slideChange: function() {
				if(this.isEnd) {
					this.navigation.$nextEl.css('display', 'none');
				} else {
					this.navigation.$nextEl.css('display', 'block');
				}
			},
		},
	})
}
//全局用户信息
$(function() {
	var data = window.localStorage.getItem("result");
	var dataObj = JSON.parse(data);
	console.log(dataObj);
    if (dataObj == null){
        alert("Login author is out of date, please login again");
        window.location.href = "index.html";
    }
	var my_name = "<p>Hello," + dataObj.user.name + "</p>";
	$('.me_name').append(my_name);
})

function swiperRefuntion() {
	var mySwiper = new Swiper('.swiper-container', {
		effect: 'flip',
		flipEffect: {
			slideShadows: true,
			limitRotation: true,
		},
		observer: true, //修改swiper自己或子元素时，自动初始化swiper
		observeParents: true, //修改swiper的父元素时，自动初始化swiper

		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		on: {
			slideChange: function() {
				if(this.isEnd) {
					this.navigation.$nextEl.css('display', 'none');
				} else {
					this.navigation.$nextEl.css('display', 'block');
				}
			},
		},
	})
}
//sensorType:图表的传感器类型，四种：GNSSData，Anemometer，MetStation，ACC（暂时没有接口）
var SENSORTYPE = Array(
	"GNSSData",
	"Anemometer",
	"MetStation",
	"ACC"
);
//后台接口需要的传感器listXXXID
var SENSORLISTID = Array(
	"listGNSSID",
	"listAneID",
	"listMetID",
	"listAccID"
);
var LINECHARTPREFIX = "linechart_";
var BUBBLECHARTPREFIX = "bubblechart_";

var chartArray = Array();
var maxYArray = Array();
var minYArray = Array();

var GNSSMAXY = 20;
var GNSSMINY = -60;

var ANEMAXY = 40;
var ANEMINY = -20;

var METMAXY = 1200;
var METMINY = 0;

var addsensorID = null;
var addsensorType = null;
var addsensorlist = new Array();
var checkboxlist = new Array();

$(function() {

	$(".botton_nav").mouseover(function() {
		$(this).stop().animate({
			width: "510px"
		}).mouseout(function() {
			$(this).stop().animate({
				width: "46px"
			});
		});
	});

	$("#select_exit").click(
		function () {
            $("#select_tab").hide();
    })

	$("#addBtn").click(
		function() {
			$("#select_tab").show();
		});
	$(".table_bot_btn").click(function() {
		console.log("checkboxlist:"+checkboxlist);
		$.each(checkboxlist, function (key,value) {
			$("#"+value).attr("checked",false);
            $("#"+value).attr("disabled",true);
        })
		$("#select_tab").hide();
		console.log("addsensorlist:" + addsensorlist);
		$.each(addsensorlist, function(key, value) {
			if(value != undefined) {
				console.log("key:" + key);
				console.log("value:" + value);
				var elementid = LINECHARTPREFIX + value[1];
				combineLineChart(value[1], value[0], elementid);
				swiperRefuntion();
				if(value[0] == 0) {
					lineChart(value[0], value[1], elementid);
					bubbleChart(value[0], value[1], 0, elementid + 'bub1');
					bubbleChart(value[0], value[1], 1, elementid + 'bub2');
					bubbleChart(value[0], value[1], 2, elementid + 'bub3');
				} else if(value[0] == 1) {
					lineChart(value[0], value[1], elementid);
					bubbleChart(value[0], value[1], 0, elementid + 'bub1');
				} else if(value[0] == 2) {
					// lineChartMet(value[0], value[1], elementid);
					metChart(value[0], value[1], elementid, 0);
					metChart(value[0], value[1], elementid, 1);
					metChart(value[0], value[1], elementid, 2);
					getMetData(value[0], value[1], elementid);
				}
			}
		});
		addsensorlist = Array();
	});
})

//sensorType:图表的传感器类型，四种：0:GNSSData，1:Anemometer，2:MetStation，3:ACC（暂时没有接口）
//sensorID:传感器的ID标识
//elementID:对应的html元素名称
function lineChart(sensorType, sensorID, elementID) {
	console.log("sensorType:" + sensorType);
	console.log("sensorID:" + sensorID);
	console.log("elementID:" + elementID);
	var seriesarr = Array();
	var titlejson = null;
	switch(parseInt(sensorType)) {
		case 0:
			var jsonX = {};
			var jsonY = {};
			var jsonZ = {};
			jsonX["name"] = 'Data X Axis';
			jsonY["name"] = 'Data Y Axis';
			jsonZ["name"] = 'Data Z Axis';
			seriesarr.push(jsonX);
			seriesarr.push(jsonY);
			seriesarr.push(jsonZ);
			titlejson = {
				text: "cm",
				y:-80,
                style:{
                    color:"#ffffff",
                    fontSize: "16px"
                }
			};
			break;
		case 1:
			var jsonSpeed = {};
			var jsonWspeed = {};
			var jsonWdir = {};
			jsonSpeed["name"] = 'Data Speed Axis';
			jsonWspeed["name"] = 'Data Wspeed Axis';
			jsonWdir["name"] = 'Wind Direction';
			jsonWdir["type"] = 'windbarb';
			jsonWdir["color"] = "#ffffff";
			seriesarr.push(jsonSpeed);
			seriesarr.push(jsonWspeed);
			seriesarr.push(jsonWdir);
			titlejson = {
				text: "MPH",
				y:-50,
                style:{
                    color:"#ffffff",
                    fontSize: "16px"
                }
			};
			break;
		case 2:
			var jsonPressure = {};
			var jsonTemp = {};
			var jsonHumi = {};
			jsonPressure["name"] = 'Data Pressure Axis';
			jsonTemp["name"] = 'Data Temp Axis';
			jsonHumi["name"] = 'Data Humidity Axis';
			seriesarr.push(jsonPressure);
			seriesarr.push(jsonTemp);
			seriesarr.push(jsonHumi);
			break;
		default:
			alert("unsupport sensor type");
			break;
	}
	//修改查询时间
	function dateAdd(date, interval, units) {
		var ret = new Date(date); //don't change original date
		var checkRollover = function() {
			if(ret.getDate() != date.getDate()) ret.setDate(0);
		};
		switch(interval.toLowerCase()) {
			case 'year':
				ret.setFullYear(ret.getFullYear() + units);
				checkRollover();
				break;
			case 'quarter':
				ret.setMonth(ret.getMonth() + 3 * units);
				checkRollover();
				break;
			case 'month':
				ret.setMonth(ret.getMonth() + units);
				checkRollover();
				break;
			case 'week':
				ret.setDate(ret.getDate() + 7 * units);
				break;
			case 'day':
				ret.setDate(ret.getDate() + units);
				break;
			case 'hour':
				ret.setTime(ret.getTime() + units * 3600000);
				break;
			case 'minute':
				ret.setTime(ret.getTime() + units * 60000);
				break;
			case 'second':
				ret.setTime(ret.getTime() + units * 1000);
				break;
			default:
				ret = undefined;
				break;
		}
		return ret;
	};

	function test() {

	}
	//保存token
	var token = window.localStorage.getItem("Geo_Token");
	var sensorList = new Array();
	sensorList[0] = sensorID;

	//封装查询时间
	function timeCk() {
		var RTLastQueryTime = new Date(); //最近的查询时间
		var dt = dateAdd(RTLastQueryTime, "second", -30); //减去一个30秒
		var dt1 = new Date(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate(), dt.getUTCHours(), dt.getUTCMinutes(), dt.getUTCSeconds(), dt.getUTCMilliseconds());
		var CSharpDate = dt1.toISOString();
		return CSharpDate;
	}

	var listID = SENSORLISTID[sensorType];
	var json = {
		"bridgename": "Forth Road Bridge",
		// listID: sensorList,
		"timeSpan": 1,
		"queryTime": timeCk()
	};
	var urlstr = "http://128.243.138.25:1212/apix/RTModule/RT" + SENSORTYPE[sensorType] + "?stime=" + new Date().getTime();

	json[listID] = sensorList;
	//console.log("json---"+sensorID+"---"+json[listID]);
	//console.log("sensortype---"+sensorID+"---"+SENSORTYPE[sensorType]);
	//console.log("urlstr---"+sensorID+"---"+urlstr);

	//图表
	function activeLastPointToolip(chart) {
		//		var points = chart.series[0].points;
		//		chart.tooltip.refresh(points[points.length - 1]);
	}
	var bool = true;
	var count = 0;

	chartArray[elementID] = new Highcharts.Chart({
		chart: {
			renderTo: elementID,
			backgroundColor: '#4A4A4A',
			type: 'line',
			marginRight: 20,
			animation: Highcharts.svg,
			events: {
				load: function() {
					var series1 = this.series[0],
						series2 = this.series[1],
						series3 = this.series[2],
						chart = this;

					setInterval(function() {

						json.queryTime = timeCk();

						if(!bool) {
							return;
						}

						$.ajaxSetup({
							cache: false
						})
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
								if(point.ResultInfo.ReturnMark != true) {
									alert("no data");
									console.log("elementID:"+elementID);
									$("#contain"+elementID).remove();
                                    // var chartele = document.getElementById(elementID);
                                    // chartele.remove();
									return;
								}
								bool = true;
								var x;
								var value_x;
								var value_y;
								var value_z;
								switch(parseInt(sensorType)) {
									case 0:
										$.each(point.listData, function(key, value) {
											x = point.listData[key].time;
											x = x.substr(0, 19);
											// console.log("time:"+x);
											value_x = point.listData[key].defor_x;
											value_y = point.listData[key].defor_y;
											value_z = point.listData[key].defor_z;
											series1.addPoint([x, value_x], false, series1.points.length > 600);
											series2.addPoint([x, value_y], false, series2.points.length > 600);
											series3.addPoint([x, value_z], false, series3.points.length > 600);
										});

										$("#time" + elementID).attr("value", x.slice(11));
										break;
									case 1:
										console.log("point of wind:" + JSON.stringify(point));
										// $.each(point.listData, function(key, value) {
											x = point.listData[0].time;
											value_x = point.listData[0].speed;
											value_y = point.listData[0].wspeed;
											value_z = point.listData[0].direction;
											series1.addPoint([Date.parse(x) + 3600000, value_x], false, series1.points.length > 60);
											series2.addPoint([Date.parse(x) + 3600000, value_y], false, series2.points.length > 60);
										// });

										if((count%2) == 0){
                                            series3.addPoint([Date.parse(x) + 3600000, value_x, value_z], true, series3.points.length > 30);
										}
										$("#time" + elementID).attr("value", x.slice(11));
										break;
									case 2:
										$.each(point.listData, function(key, value) {
											x = point.listData[key].time;
											value_x = point.listData[key].pressure;
											value_y = point.listData[key].temp;
											value_z = point.listData[key].humidity;
											series1.addPoint([x, value_x], false, series1.points.length > 600);
											series2.addPoint([x, value_y], false, series2.points.length > 600);
											series3.addPoint([x, value_z], false, series3.points.length > 600);
										});
										break;
									default:
										alert("unsupport sensor Type");
										break;
								}
                                chartArray[elementID].redraw();
								// activeLastPointToolip(chart);
							},
							error: function(point) {
								console.log("network request fail！");
							},
						})

						bool = false;
						count++;

					}, 1000);
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
			dateTimeLabelFormats: {
                millisecond: '%H:%M:%S',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%e. %b',
                week: '%e. %b',
                month: '%b \'%y',
                year: '%Y'
            },
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
			title: titlejson,
			gridLineWidth: 1,
			alternateGridColor: null,
			gridLineDashStyle: 'line',
			gridLineColor: '#434343'
		},
		tooltip: {
			backgroundColor: '#cdcdcd',
            valueDecimals: 2
			// formatter: function() {
			// 	return '<b>' + this.series.name + '</b><br/>' +
			// 		// Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
			// 		// Highcharts.numberFormat(this.x, 0);
			// }
		},
		plotOptions: {
			line: {
				lineWidth: 1,
				marker: {
					enabled: false
				},
				animation: false,
				// one hour
				pointStart: Date.parse(new Date()),
				pointInterval: 100,

			},
			series: {
				marker: {
					enabled: false
				},
				animation: false
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
		series: seriesarr

	});
	chartArray[elementID].animation = false;
	if(parseInt(sensorType) == 0) {
		chartArray[elementID].yAxis[0].options.startOnTick = true;
		chartArray[elementID].yAxis[0].options.endOnTick = true;
		// chartArray[elementID].yAxis[0].setExtremes(GNSSMINY, GNSSMAXY);
		minYArray[elementID] = null;
		maxYArray[elementID] = null;
	} else if(parseInt(sensorType) == 1) {
		chartArray[elementID].yAxis[0].options.startOnTick = true;
		chartArray[elementID].yAxis[0].options.endOnTick = true;
		chartArray[elementID].yAxis[0].setExtremes(-10, null);
		minYArray[elementID] = null;
		maxYArray[elementID] = null;
	} else if(parseInt(sensorType) == 2) {
		chartArray[elementID].yAxis[0].options.startOnTick = true;
		chartArray[elementID].yAxis[0].options.endOnTick = true;
		// chartArray[elementID].yAxis[0].setExtremes(METMINY, METMAXY);
		minYArray[elementID] = null;
		maxYArray[elementID] = null;
	}

}
//sensorType:图表的传感器类型，四种：0:GNSSData，1:Anemometer，2:MetStation，3:ACC（暂时没有接口）
//sensorID:传感器的ID标识
//elementID:对应的html元素名称
function lineChartMet(sensorType, sensorID, elementID) {
	console.log("sensorType:" + sensorType);
	console.log("sensorID:" + sensorID);
	console.log("elementID:" + elementID);
	var yAxis = [{ // 第一条Y轴
		labels: {
			format: '{value}\xB0C',
			style: {
				color: Highcharts.getOptions().colors[2]
			}
		},
		title: {
			text: 'Temperature',
			style: {
				color: Highcharts.getOptions().colors[2]
			}
		},
		opposite: true
	}, { // 第二条Y轴
		title: {
			text: 'Humidity',
			style: {
				color: Highcharts.getOptions().colors[0]
			}
		},
		labels: {
			format: '{value} cm',
			style: {
				color: Highcharts.getOptions().colors[0]
			}
		}
	}, { // 第三条Y轴
		gridLineWidth: 0,
		title: {
			text: 'Pressure',
			style: {
				color: Highcharts.getOptions().colors[1]
			}
		},
		labels: {
			format: '{value} mb',
			style: {
				color: Highcharts.getOptions().colors[1]
			}
		},
		opposite: true
	}];
	var jsonPressure = {};
	var jsonTemp = {};
	var jsonHumi = {};
	var series = [{
		name: 'Humidity',
		type: 'column',
		yAxis: 1,
		tooltip: {
			valueSuffix: ' %'
		}

	}, {
		name: 'Pressure',
		type: 'spline',
		yAxis: 2,
		marker: {
			enabled: false
		},
		dashStyle: 'shortdot',
		tooltip: {
			valueSuffix: ' mb'
		}
	}, {
		name: 'Temperature',
		type: 'spline',
		tooltip: {
			valueSuffix: '\xB0C'
		}
	}];
	var legend = {
		layout: 'vertical',
		align: 'left',
		x: 120,
		verticalAlign: 'top',
		y: 100,
		floating: true,
		backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
	};
	//修改查询时间
	function dateAdd(date, interval, units) {
		var ret = new Date(date); //don't change original date
		var checkRollover = function() {
			if(ret.getDate() != date.getDate()) ret.setDate(0);
		};
		switch(interval.toLowerCase()) {
			case 'year':
				ret.setFullYear(ret.getFullYear() + units);
				checkRollover();
				break;
			case 'quarter':
				ret.setMonth(ret.getMonth() + 3 * units);
				checkRollover();
				break;
			case 'month':
				ret.setMonth(ret.getMonth() + units);
				checkRollover();
				break;
			case 'week':
				ret.setDate(ret.getDate() + 7 * units);
				break;
			case 'day':
				ret.setDate(ret.getDate() + units);
				break;
			case 'hour':
				ret.setTime(ret.getTime() + units * 3600000);
				break;
			case 'minute':
				ret.setTime(ret.getTime() + units * 60000);
				break;
			case 'second':
				ret.setTime(ret.getTime() + units * 1000);
				break;
			default:
				ret = undefined;
				break;
		}
		return ret;
	};

	function test() {

	}
	//保存token
	var token = window.localStorage.getItem("Geo_Token");
	var sensorList = new Array();
	sensorList[0] = sensorID;

	//封装查询时间
	function timeCk() {
		var RTLastQueryTime = new Date(); //最近的查询时间
		var dt = dateAdd(RTLastQueryTime, "second", -30); //减去一个30秒
		var dt1 = new Date(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate(), dt.getUTCHours(), dt.getUTCMinutes(), dt.getUTCSeconds(), dt.getUTCMilliseconds());
		var CSharpDate = dt1.toISOString();
		return CSharpDate;
	}

	var listID = SENSORLISTID[sensorType];
	var json = {
		"bridgename": "Forth Road Bridge",
		// listID: sensorList,
		"timeSpan": 1,
		"queryTime": timeCk()
	};
	var urlstr = "http://128.243.138.25:1212/apix/RTModule/RT" + SENSORTYPE[sensorType] + "?stime=" + new Date().getTime();

	json[listID] = sensorList;
	//console.log("json---"+sensorID+"---"+json[listID]);
	//console.log("sensortype---"+sensorID+"---"+SENSORTYPE[sensorType]);
	//console.log("urlstr---"+sensorID+"---"+urlstr);

	//图表
	function activeLastPointToolip(chart) {
		//		var points = chart.series[0].points;
		//		chart.tooltip.refresh(points[points.length - 1]);
	}
	var bool = true;

	chartArray[elementID] = new Highcharts.Chart({
		chart: {
			renderTo: elementID,
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

					setInterval(function() {

						json.queryTime = timeCk();

						if(!bool) {
							return;
						}

						$.ajaxSetup({
							cache: false
						})
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
								console.log("MetPoint:" + JSON.stringify(point));
								if(point.ResultInfo.ReturnMark == true) {
									bool = true;
									var x;
									var value_x;
									var value_y;
									var value_z;
									// $.each(point.listData, function (key, value) {
									x = point.listData[0].time;
									value_x = point.listData[0].pressure;
									value_y = point.listData[0].temp;
									value_z = point.listData[0].humidity;
									series1.addPoint([Date.parse(x) + 3600000, value_z], true, series1.points.length > 60);
									series2.addPoint([Date.parse(x) + 3600000, value_x], true, series2.points.length > 60);
									series3.addPoint([Date.parse(x) + 3600000, value_y], true, series3.points.length > 60);

									// series1.addPoint([x, value_z], true, series1.points.length > 600);
									// series2.addPoint([x, value_x], true, series2.points.length > 600);
									// series3.addPoint([x, value_y], true, series3.points.length > 600);
									// });
								}

								// activeLastPointToolip(chart);
							},
							error: function(point) {
								console.log("request fail！");
							},
						})

						bool = false;

					}, 1000);
				}
			}
		},
		title: {
			text: null,
			align: 'low'
		},
		legend: legend,
		xAxis: {
			labels: {
				style: {
					color: '#cdcdcd'
				}
			},
			lineColor: '#cdcdcd',
			lineWidth: 0,
			type: 'datetime',
			dateTimeLabelFormats: {
				second: '%H:%M:%S'
			},
			tickPixelInterval: 90,
			title: {
				text: null
			},
			tickColor: '#434343',
			tickWidth: 1
		},
		yAxis: yAxis,
		// 	{
		// 	labels: {
		// 		style: {
		// 			color: '#cdcdcd'
		// 		}
		// 	},
		// 	lineColor: '#cdcdcd',
		// 	lineWidth: 0,
		// 	title: {
		// 		text: null
		// 	},
		// 	gridLineWidth: 1,
		// 	alternateGridColor: null,
		// 	gridLineDashStyle: 'line',
		// 	gridLineColor: '#434343'
		// },
		tooltip: {
			backgroundColor: '#cdcdcd',
			shared: true
		},
		plotOptions: {
			line: {
				lineWidth: 1,
				marker: {
					enabled: false
				},
				animation: false,
				// one hour
				pointStart: Date.parse(new Date()),
				pointInterval: 100,

			},
			series: {
				marker: {
					enabled: false
				},
				animation: false
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
		series: series

	});
	chartArray[elementID].animation = false;
	// chartArray[elementID].yAxis[0].options.startOnTick = true;
	// chartArray[elementID].yAxis[0].options.endOnTick = true;
	// chartArray[elementID].yAxis[0].setExtremes(METMINY,METMAXY);
	// minYArray[elementID] = METMINY;
	// maxYArray[elementID] = METMAXY;

}

//根据传感器名判断传感器类型
function sensorID2Type(sensorID) {
	if(sensorID.indexOf("SHM") != -1) {
		return 0;
	} else if(sensorID.indexOf("ANE") != -1) {
		return 1;
	} else if(sensorID.indexOf("MET") != -1) {
		return 2;
	} else if(sensorID.indexOf("ACC") != -1) {
		return -1;
	} else {
		return -1;
	}
}

function allowDrop(ev) {
	ev.preventDefault();
}

var srcdiv = null;

function drag(ev, divdom) {
	srcdiv = divdom;
	ev.dataTransfer.setData("text/html", divdom.innerHTML);
}

function drop(ev, divdom) {
	ev.preventDefault();
	if(srcdiv != divdom) {
		srcdiv.innerHTML = divdom.innerHTML;
		divdom.innerHTML = ev.dataTransfer.getData("text/html");
	}
} //根据元素id拼出线性图表的html元素
function subtimetrans() {
	var date = new Date(); //如果date为10位不需要乘1000
	var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
	var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
	var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
	return h + m + s;
}

function combineLineChart(sensorID, sensorType, elementID) {
	var linechart;
	switch(parseInt(sensorType)) {
		case 0:
			linechart = "<div class='data_02' id='contain" + elementID + "' ondrop='drop(event,this)' ondragover='allowDrop(event)' draggable='true' ondragstart='drag(event, this)'>" +
				"<div class='data_tit'><div class='data_tit_01'><div class='data_tit_round_2'></div>" +
				"<span class='t1'>" + SENSORTYPE[sensorType] + "</span>" +
				"<span class='t2'>" + sensorID + "</span>" +
				"<span class='t3'>LAST SAMPLE TIME:</span>" +
				// "<input id='time" + elementID + "' type='text' value='' style='width: 56px;height: 16px;float: left;'>" +
                "<input id='time" + elementID + "' type='text' value='' style='width: 60px;height: 16px;overflow-x:visible;overflow-y:visible;float: left;'>" +
                // "<label id='time" + elementID + "' type='text' value='' style='width: 56px;height: 16px;float: left;'>" +
				"<span class='t4'></span>" +
				"<span class='t4'>| SAMPLING RATE: 10Hz</span>" +
				"<span style='color: red;float: left;margin-left: 3%'>max:</span>" +
				// "<input id='ymax" + elementID + "' type='number' value='" + GNSSMAXY + "' style='width: 45px;height: 16px;float: left;'>" +
                "<input id='ymax" + elementID + "' type='number' value='' style='width: 45px;height: 16px;float: left;'>" +
				"<span style='color: #1ece6d;float: left;margin-left: 1%'>min:</span>" +
				"<input id='ymin" + elementID + "' type='number' value='' style='width: 45px;height: 16px;float: left;'>" +
                "<div class='chart_reset' id='reset" + elementID + "' ><img src='static/img/res.png' /></div>" +
				"<div class='chart_exit' id='close" + elementID + "' ><img src='static/img/del.png' /></div>" +
				// "<div class='chart_exit' id='reset" + elementID + "' ><img src='static/img/res.png' /></div>" +
				"</div>" +
				"</div>" +
				"<div class='swiper-container'><div class='swiper-wrapper'><div class='swiper-slide'>" +
				"<div class='slide_tit'>" +
				"</div>" +
				"<div class='slide_tit'></div>" +
				"<div class='slide_tit'></div>" +
				"<div class='cont_style' id='" + elementID + "'></div>" +
				"</div>" +
				"<div class='swiper-slide'>" +
				"<ul class='bubble_tab'>" +
				"<li><div id='" + elementID + "bub1'></div></li>" +
				"<li><div id='" + elementID + "bub2'></div></li>" +
				"<li><div id='" + elementID + "bub3'></div></li>" +
				"</ul>" +
				"</div>" +
				"</div>" +
				"<div class='swiper-button-prev' id='left_btn'><img src='static/img/h.png'></div>" +
				"<div class='swiper-button-next' id='right_btn'><img src='static/img/q.png'></div>" +
				"</div>" +
				"</div></div>";
			$("#close" + elementID).live("click", function() {
                $("#"+sensorID).attr("disabled",false);
				chartArray[elementID].destroy();
				var chartele = document.getElementById("contain" + elementID);
				chartele.remove();
			});
			$("#reset" + elementID).live("click", function() {
				chartArray[elementID].yAxis[0].setExtremes(null, null);
				$("#ymax" + elementID).attr("value", "");
				$("#ymin" + elementID).attr("value", "");
			});
			// $("#ymax"+elementID).value = ""+maxYArray[elementID];
			// $("#ymin"+elementID).value = ""+minYArray[elementID];
			$("#ymax" + elementID).live("input", function() {
				console.log("ymax:" + $("#ymax" + elementID).val());
				console.log("ymin:" + minYArray[elementID]);
				chartArray[elementID].yAxis[0].setExtremes(minYArray[elementID], $("#ymax" + elementID).val());
			});
			$("#ymin" + elementID).live("input", function() {
				console.log($("#ymin" + elementID).val());
				console.log("ymax:" + maxYArray[elementID]);
				chartArray[elementID].yAxis[0].setExtremes($("#ymin" + elementID).val(), maxYArray[elementID]);
			});
			break;
		case 1:
			linechart = "<div class='data_02' id='contain" + elementID + "' ondrop='drop(event,this)' onnnnndragover='allowDrop(event)' draggable='true' ondragstart='drag(event, this)'>" +
				"<div class='data_tit'><div class='data_tit_01'><div class='data_tit_round_2'></div>" +
				"<span class='t1'>" + SENSORTYPE[sensorType] + "</span>" +
				"<span class='t2'>" + sensorID + "</span>" +
				"<span class='t3'>LAST SAMPLE TIME:</span>" +
				"<input id='time" + elementID + "' type='text' value='' style='width: 60px;height: 16px;float: left;'>" +
				"<span class='t4'></span>" +
				"<span class='t4'>| SAMPLING RATE: 10Hz</span>" +
				"<span style='color: red;float: left;margin-left: 3%'>max:</span>" +
				"<input id='ymax" + elementID + "' type='number' value='' style='width: 45px;height: 16px;float: left;'>" +
				"<span style='color: #1ece6d;float: left;margin-left: 1%'>min:</span>" +
				"<input id='ymin" + elementID + "' type='number' value='' style='width: 45px;height: 16px;float: left;'>" +
                "<div class='chart_reset' id='reset" + elementID + "' ><img src='static/img/res.png' /></div>" +
				"<div class='chart_exit' id='close" + elementID + "' ><img src='static/img/del.png' /></div>" +
				"</div>" +
				"</div>" +
				"<div class='swiper-container'><div class='swiper-wrapper'><div class='swiper-slide'>" +
				"<div class='slide_tit'></div>" +
				"<div class='slide_tit'></div>" +
				"<div class='slide_tit'></div>" +
				"<div class='cont_style' id='" + elementID + "'></div>" +
				"</div>" +
				"<div class='swiper-slide'>" +
				"<ul class='bubble_tab'>" +
				"<li><div id='" + elementID + "bub1'></div></li>" +
				"</ul>" +
				"</div>" +
				"</div>" +
				"<div class='swiper-button-prev' id='left_btn'><img src='static/img/h.png'></div>" +
				"<div class='swiper-button-next' id='right_btn'><img src='static/img/q.png'></div>" +
				"</div></div>";
			$("#ymax" + elementID).live("input", function() {
				console.log("ymax:" + $("#ymax" + elementID).val());
				console.log("ymin:" + minYArray[elementID]);
				chartArray[elementID].yAxis[0].setExtremes(minYArray[elementID], $("#ymax" + elementID).val());
			});
			$("#ymin" + elementID).live("input", function() {
				console.log($("#ymin" + elementID).val());
				console.log("ymax:" + maxYArray[elementID]);
				chartArray[elementID].yAxis[0].setExtremes($("#ymin" + elementID).val(), maxYArray[elementID]);
			});
			$("#close" + elementID).live("click", function() {
                $("#"+sensorID).attr("disabled",false);
				chartArray[elementID].destroy();
				var chartele = document.getElementById("contain" + elementID);
				chartele.remove();
			});
			$("#reset" + elementID).live("click", function() {
				chartArray[elementID].yAxis[0].setExtremes(null, null);
                $("#ymax" + elementID).attr("value", "");
                $("#ymin" + elementID).attr("value", "");
			});
			break;
		case 2:
			linechart = "<div class='data_02' id='contain" + elementID + "' ondrop='drop(event,this)' onnnnndragover='allowDrop(event)' draggable='true' ondragstart='drag(event, this)'>" +
				"<div class='data_tit'><div class='data_tit_01'><div class='data_tit_round_2'></div>" +
				"<span class='t1'>" + SENSORTYPE[sensorType] + "</span>" +
				"<span class='t2'>" + sensorID + "</span>" +
				"<span class='t3'>LAST SAMPLE TIME:</span>" +
				"<input id='time" + elementID + "' type='text' value='' style='width: 56px;height: 16px;float: left;'>" +
				"<span class='t4'></span>" +
				"<span class='t4'>| SAMPLING RATE: 10Hz</span>" +
				"<div class='chart_exit' id='close" + elementID + "' ><img src='static/img/del.png' /></div>" +
				"</div>" +
				"</div>" +
				"<div class='swiper-container'><div class='swiper-wrapper'><div class='swiper-slide'>" +
				"<div class='slide_tit'></div>" +
				"<div class='slide_tit'></div>" +
				"<div class='slide_tit'></div>" +
				"<div class='contmet_style'>" +
				"<ul class='bubble_tab'>" +
				"<li><div id='" + elementID + "0'></div></li>" +
				"<li><div id='" + elementID + "1'></div></li>" +
				"<li><div id='" + elementID + "2'></div></li>" +
				"</ul>" +
				"</div>" +
				"</div>" +
				"</div>" +
				"</div></div>";
			$("#close" + elementID).live("click", function() {
                $("#"+sensorID).attr("disabled",false);
				chartArray[elementID + 0].destroy();
				chartArray[elementID + 1].destroy();
				chartArray[elementID + 2].destroy();
				var chartele = document.getElementById("contain" + elementID);
				chartele.remove();
			});
			break;
		default:
			return;
	}

	//console.log("linechart:"+linechart);
	$("#add_menu").before(linechart);
}
$(function() {
		// 	//返回默认需要显示传感器的ID
	var token = window.localStorage.getItem("Geo_Token");

	var json = {
		"bridgeName": "Forth Road Bridge",
	};
	$.ajax({
		type: "GET",
		url: "http://128.243.138.25:1212/apix/RTModule/GetSensorsInfo",
		data: json,
		async: false,
		beforeSend: function(XHR) {
			//发送ajax请求之前向http的head里面加入验证信息
			XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
		},
		success: function(data) {
			//				alert("request success");
			//				//console.log(data);

			var mark = 0;
			$.each(data, function(i, result) {
				//				//console.log(result);
				$.each(result, function(m, lists) {
					var item;
					//					//console.log(lists.sensorID);
					if(typeof(lists['sensorType']) != "undefined") {
						item = "<li class='sensoritem' id='sensoritem" + mark + "' ondrop='drop(event,this)' ondragover='allowDrop(event)' draggable='true' ondragstart='drag(event, this)'>" +
							"<input id = '" + lists['sensorID']+ "' value='" + mark + "' name = 'add' type='checkbox' /><span id='sensortype" + mark + "' class='n1'>" + lists['sensorType'] + "</span><span id='sensorid" + mark + "' class='n2'>" + lists['sensorID'] + "</span>" +
							"<span class='n3'>SENSOR SUPPLIER: UBIPOS UK LTD, NOTTINGHAM, UK</span></li>";

                        $("#"+lists['sensorID']).live('click', function () {
                            if ($(this).prop("checked") == true){
                                addsensorlist[$(this).val()] = [lists['sensorType'], lists['sensorID']];
                                checkboxlist[$(this).val()]	= lists['sensorID'];
							}else{
                                addsensorlist.splice($(this).val(), 1);
                                checkboxlist.splice($(this).val(), 1);
							}
							console.log("addsensorlist:" + addsensorlist);
						});
						mark = mark + 1;
					}
					$('.table').append(item);
				});
			});
			//点击排序
			$("#sort_id").bind('click', function() {
				var Otab = document.getElementById("tableid");
				var Oli = Otab.getElementsByTagName("li");

				var arr = [];
				//将Oli标签放入空的arr数组中
				for(var k = 0; k < Oli.length; k++) {
					arr[k] = Oli[k];
				}
				//reverse排序
				arr.reverse();
				//通过appendChild改变页面排序
				for(var n = 0; n < arr.length; n++) {
					Otab.appendChild(arr[n]);
				}
			})
		},
		error: function(request) {
			// alert("request fail");
			//			//console.log(request);
		}
	});
	var json = {
		"bridgeName": "Forth Road Bridge"
	};
	$.ajax({
		type: "GET",
		url: "http://128.243.138.25:1212/apix/RTModule/DefauShowSensor",
		data: json,
		async: true,
		beforeSend: function(XHR) {
			//发送ajax请求之前向http的head里面加入验证信息
			XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
		},
		success: function(data) {
			$.each(data, function(key, value) {
				//console.log(key+"---:"+value);
				if(key == "listSensor") {
					$.each(value, function(index, sensorID) {
						//console.log(index+"---default sensor:"+sensorID);
						var sensorType = sensorID2Type(sensorID);
						if(sensorType == -1) {
							alert("no sensor found");
							return;
						}
						var elementid = LINECHARTPREFIX + sensorID;
						console.log("elementid:" + elementid);
						combineLineChart(sensorID, sensorType, elementid);
						console.log("elementid:" + elementid);
						swiperRefuntion();
						//console.log("sensortype:"+sensorType);
						//console.log("sensorid:"+sensorID);
						//console.log("elementid:"+elementid);
                        $("#"+sensorID).attr("disabled",true);
						if(sensorType == 0) {
							lineChart(sensorType, sensorID, elementid);
							bubbleChart(sensorType, sensorID, 0, elementid + 'bub1');
							bubbleChart(sensorType, sensorID, 1, elementid + 'bub2');
							bubbleChart(sensorType, sensorID, 2, elementid + 'bub3');
						} else if(sensorType == 1) {
							lineChart(sensorType, sensorID, elementid);
							bubbleChart(sensorType, sensorID, 0, elementid + 'bub1');
						} else if(sensorType == 2) {
							// lineChartMet(sensorType, sensorID, elementid);

							metChart(sensorType, sensorID, elementid, 0);
							metChart(sensorType, sensorID, elementid, 1);
							metChart(sensorType, sensorID, elementid, 2);
							getMetData(sensorType, sensorID, elementid);
						}
					})
				}

			})
			// alert("server request success");
		},
		error: function(request) {
			// alert("server request failed");
		},
	});
})
// The Highcharts container_1
$(function() {
	var $test4 = $("#test4");
	// 	//根据桥的名称，传感器类型，得到每种类型的传感器，每个方向包含的哪些统计信息，暂时没有倾斜仪信息
	$test4.bind("click", function() {
		var token = window.localStorage.getItem("Geo_Token");
		var json = {
			"bridgeName": "Forth Road Bridge",
			"sensorType": 1,
			"mark": 300
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
				alert("request success");
				//console.log(data);
			},
			error: function(request) {
				// alert("request fail");
			},
		});
	})

});

// The Highcharts container_4
//添加图表
$(function() {
	//修改查询时间

	function dateAdd(date, interval, units) {
		var ret = new Date(date); //don't change original date
		var checkRollover = function() {
			if(ret.getDate() != date.getDate()) ret.setDate(0);
		};
		switch(interval.toLowerCase()) {
			case 'year':
				ret.setFullYear(ret.getFullYear() + units);
				checkRollover();
				break;
			case 'quarter':
				ret.setMonth(ret.getMonth() + 3 * units);
				checkRollover();
				break;
			case 'month':
				ret.setMonth(ret.getMonth() + units);
				checkRollover();
				break;
			case 'week':
				ret.setDate(ret.getDate() + 7 * units);
				break;
			case 'day':
				ret.setDate(ret.getDate() + units);
				break;
			case 'hour':
				ret.setTime(ret.getTime() + units * 3600000);
				break;
			case 'minute':
				ret.setTime(ret.getTime() + units * 60000);
				break;
			case 'second':
				ret.setTime(ret.getTime() + units * 1000);
				break;
			default:
				ret = undefined;
				break;
		}
		return ret;
	};

	//保存token
	var token = window.localStorage.getItem("Geo_Token");
	var ShowGNSSName = new Array();
	//	ShowGNSSName[0] = "SHM2";
	ShowGNSSName[1] = "SHM3";

	//封装查询时间
	function timeCk() {
		var RTLastQueryTime = new Date(); //最近的查询时间
		var dt = dateAdd(RTLastQueryTime, "second", -30); //减去一个30秒
		var dt1 = new Date(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate(), dt.getUTCHours(), dt.getUTCMinutes(), dt.getUTCSeconds(), dt.getUTCMilliseconds());
		var CSharpDate = dt1.toISOString();
		return CSharpDate;
	}

	var json = {
		"bridgename": "Forth Road Bridge",
		"listGNSSID": ShowGNSSName,
		"timeSpan": 1,
		"queryTime": timeCk()
	};

	//图表
	function activeLastPointToolip(chart) {}
	var bool = true;

	var options = {
		chart: {
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
					//					activeLastPointToolip(chart);

					setInterval(function() {

						json.queryTime = timeCk();

						if(!bool) {
							return;
						}

						$.ajaxSetup({
							cache: false
						})
						$.ajax({
							type: "GET",
							url: "http://128.243.138.25:1212/apix/RTModule/RTGNSSData?stime=" + new Date().getTime(),
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
								if(point.ResultInfo.ReturnMark != true) {
									// alert("no data");
									return;
								}
								bool = true;
								var x = (new Date()).getTime();
								var value_x = point.listData[0].defor_x;
								var value_y = point.listData[0].defor_y;
								var value_z = point.listData[0].defor_z;
								var x1 = value_x;
								var y = value_y;
								var z = value_z;
								series1.addPoint([x, x1], true, series1.points.length > 60);
								series2.addPoint([x, y], true, series2.points.length > 60);
								series3.addPoint([x, z], true, series3.points.length > 60);
								activeLastPointToolip(chart);
							},
							error: function(point) {
								//console.log("request fail！");
							},
						})

						bool = false;

					}, 1000);

				}
			}
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
		series: [{
				name: 'Data X Axis',
				marker: {
					symbol: 'radis'
				},
				data: []
			},
			{
				name: 'Data Y Axis',
				data: []
			},
			{
				name: 'Data Z Axis',
				data: []
			}
		]
	}
})

//The bubble_tab
//sensorType:图表的传感器类型，四种：0:GNSSData，1:Anemometer，2:MetStation，3:ACC（暂时没有接口）
//sensorID:传感器的ID标识
//components:是那两个变量去拼这个点图：0：xy，1：yz，2：xz
//elementID:对应的html元素名称
function bubbleChart(sensorType, sensorID, components, elementID) {
	$(function() {
		//修改查询时间
		function dateAdd(date, interval, units) {
			var ret = new Date(date); //don't change original date
			var checkRollover = function() {
				if(ret.getDate() != date.getDate()) ret.setDate(0);
			};
			switch(interval.toLowerCase()) {
				case 'year':
					ret.setFullYear(ret.getFullYear() + units);
					checkRollover();
					break;
				case 'quarter':
					ret.setMonth(ret.getMonth() + 3 * units);
					checkRollover();
					break;
				case 'month':
					ret.setMonth(ret.getMonth() + units);
					checkRollover();
					break;
				case 'week':
					ret.setDate(ret.getDate() + 7 * units);
					break;
				case 'day':
					ret.setDate(ret.getDate() + units);
					break;
				case 'hour':
					ret.setTime(ret.getTime() + units * 3600000);
					break;
				case 'minute':
					ret.setTime(ret.getTime() + units * 60000);
					break;
				case 'second':
					ret.setTime(ret.getTime() + units * 1000);
					break;
				default:
					ret = undefined;
					break;
			}
			return ret;
		};
		//保存token
		var token = window.localStorage.getItem("Geo_Token");
		var sensorName = new Array();
		sensorName[0] = sensorID;
		//	ShowGNSSName[1] = "SHM3";
		var chartname;
		var value_x;
		var value_y;
		switch(parseInt(sensorType)) {
			case 0:
				if(components == 0) {
					chartname = 'Data X vs Y';
				} else if(components == 1) {
					chartname = 'Data Y vs Z';
				} else if(components == 2) {
					chartname = 'Data X vs Z';
				} else {
					alert("illegal component");
					return;
				}
				break;
			case 1:
				chartname = 'Data Speed vs WSpeed';
				break;
			default:
				return;
		}
		//封装查询时间
		function timeCk() {
			var RTLastQueryTime = new Date(); //最近的查询时间
			var dt = dateAdd(RTLastQueryTime, "second", -30); //减去一个30秒
			var dt1 = new Date(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate(), dt.getUTCHours(), dt.getUTCMinutes(), dt.getUTCSeconds(), dt.getUTCMilliseconds());
			var CSharpDate = dt1.toISOString();
			return CSharpDate;
		}
		var temp = SENSORLISTID[sensorType];
		var json = {
			"bridgename": "Forth Road Bridge",
			"timeSpan": 1,
			"queryTime": timeCk()
		};
		json[temp] = sensorName;
		//console.log("json:"+json);
		var urlstr = "http://128.243.138.25:1212/apix/RTModule/RT" + SENSORTYPE[sensorType] + "?stime=" + new Date().getTime();

		//console.log("json-bubble--"+sensorID+"---"+json[temp]);
		//console.log("sensortype-bubble--"+sensorID+"---"+SENSORTYPE[sensorType]);
		//console.log("urlstr-bubble--"+sensorID+"---"+urlstr);

		//图表
		function activeLastPointToolip(chart) {
			var points = chart.series[0].points;
			chart.tooltip.refresh(points[points.length - 1]);
		}
		var bool = true;

		chartArray[elementID] = new Highcharts.Chart({
			chart: {
				renderTo: elementID,
				type: 'scatter',
				height: 335,
				events: {
					load: function() {
						var series = this.series[0],
							chart = this;

						// activeLastPointToolip(chart);

						setInterval(function() {

							json.queryTime = timeCk();

							if(!bool) {
								return;
							}

							$.ajaxSetup({
								cache: false
							})
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
									// //console.log("data: "+sensorID+"---"+JSON.stringify(point));
									if(point.ResultInfo.ReturnMark != true) {
										// alert("no data");
										return;
									}
									bool = true;
									var value_x;
									var value_y;
									switch(parseInt(sensorType)) {
										case 0:
											if(components == 0) {
												$.each(point.listData, function (key, value) {
                                                    value_x = point.listData[key].defor_x;
                                                    value_y = point.listData[key].defor_y;
                                                    series.addPoint([value_x, value_y], false, series.points.length > 600);
                                                })
											} else if(components == 1) {
                                                $.each(point.listData, function (key, value) {
                                                    value_x = point.listData[key].defor_y;
                                                    value_y = point.listData[key].defor_z;
                                                    series.addPoint([value_x, value_y], false, series.points.length > 600);
                                                })
											} else if(components == 2) {
                                                $.each(point.listData, function (key, value) {
                                                    value_x = point.listData[key].defor_x;
                                                    value_y = point.listData[key].defor_z;
                                                    series.addPoint([value_x, value_y], false, series.points.length > 600);
                                                })
											} else {
												alert("illegal component");
												return;
											}
											break;
										case 1:
											value_x = point.listData[0].speed;
											value_y = point.listData[0].wspeed;
                                            series.addPoint([value_y, value_x], false, series.points.length > 600);
											break;
										default:
											return;
									}
									// activeLastPointToolip(chart);
								},
								error: function(point) {
									//console.log("request fail！");
								},
							})

							chartArray[elementID].redraw();
							bool = false;

						}, 1000);

					}
				}
			},
			title: {
				text: 'GNSS SENSOR Nr. ' + sensorID
			},
			subtitle: {
				text: 'SENSOR SUPPLIER: UBIPOS UK LTD, NOTTINGHAM, UK'
			},
			xAxis: {
				// type: 'datetime',
				// tickPixelInterval: 90,
				// title: {
				// 	text: null
				// },
				title: null
			},
			yAxis: {
				title: null
			},
			credits: {
				enabled: false
			},
			exporting: {
				enabled: false
			},
			legend: {
				layout: 'vertical',
				align: 'left',
				verticalAlign: 'top',
				x: 150,
				y: 260,
				floating: true,
				backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
				borderWidth: 1
			},
			plotOptions: {
				scatter: {
					marker: {
						radius: 5,
						states: {
							hover: {
								lineColor: 'rgb(100,100,100)'
							}
						}
					},
					line: {
						// one hour
						pointStart: Date.parse(new Date()),
						pointInterval: 60
					},

				}
			},
			tooltip: {
				backgroundColor: '#cdcdcd',
				formatter: function() {
					return '<b>' + this.series.name + '</b><br/>' +
						Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
						Highcharts.numberFormat(this.y, 2);
				}
			},
			series: [{
				name: chartname,
				color: 'rgba(223, 83, 83, .5)',
				data: (function() {
					var data = [],
						j,
						i;
					console.log(data);
					$.ajax({
						type: "GET",
						// url: "http://128.243.138.25:1212/apix/RTModule/RTGNSSData?ran=+getRandomNum()",
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

							if(point.ResultInfo.ReturnMark != true) {
								// alert("no data");
								return;
							}
							bool = true;
							var value_x;
							var value_y;
							switch(parseInt(sensorType)) {
								case 0:
									if(components == 0) {
										value_x = point.listData[0].defor_x;
										value_y = point.listData[0].defor_y;
									} else if(components == 1) {
										value_x = point.listData[0].defor_y;
										value_y = point.listData[0].defor_z;
									} else if(components == 2) {
										value_x = point.listData[0].defor_x;
										value_y = point.listData[0].defor_z;
									} else {
										alert("illegal component");
										return;
									}
									break;
								case 1:
									if(point) {
										value_x = point.listData[0].speed;
										value_y = point.listData[0].wspeed;
									}
									break;
								default:
									return;
							}
							data.push({
								x: value_y,
								y: value_x
							});
						},
						error: function(point) {
							//console.log("request fail！");
						},

					})

					return data;
				}())
			}]
		});

	});
}

function getMetData(sensorType, sensorID, elementID) {
	//保存token
	var token = window.localStorage.getItem("Geo_Token");
	var sensorName = new Array();
	sensorName[0] = sensorID;
	//修改查询时间
	function dateAdd(date, interval, units) {
		var ret = new Date(date); //don't change original date
		var checkRollover = function() {
			if(ret.getDate() != date.getDate()) ret.setDate(0);
		};
		switch(interval.toLowerCase()) {
			case 'year':
				ret.setFullYear(ret.getFullYear() + units);
				checkRollover();
				break;
			case 'quarter':
				ret.setMonth(ret.getMonth() + 3 * units);
				checkRollover();
				break;
			case 'month':
				ret.setMonth(ret.getMonth() + units);
				checkRollover();
				break;
			case 'week':
				ret.setDate(ret.getDate() + 7 * units);
				break;
			case 'day':
				ret.setDate(ret.getDate() + units);
				break;
			case 'hour':
				ret.setTime(ret.getTime() + units * 3600000);
				break;
			case 'minute':
				ret.setTime(ret.getTime() + units * 60000);
				break;
			case 'second':
				ret.setTime(ret.getTime() + units * 1000);
				break;
			default:
				ret = undefined;
				break;
		}
		return ret;
	};
	//	ShowGNSSName[1] = "SHM3";
	//封装查询时间
	function timeCk() {
		var RTLastQueryTime = new Date(); //最近的查询时间
		var dt = dateAdd(RTLastQueryTime, "second", -30); //减去一个30秒
		var dt1 = new Date(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate(), dt.getUTCHours(), dt.getUTCMinutes(), dt.getUTCSeconds(), dt.getUTCMilliseconds());
		var CSharpDate = dt1.toISOString();
		return CSharpDate;
	}
	var temp = SENSORLISTID[sensorType];
	var json = {
		"bridgename": "Forth Road Bridge",
		"timeSpan": 1,
		"queryTime": timeCk()
	};
	json[temp] = sensorName;
	//console.log("json:"+json);
	var urlstr = "http://128.243.138.25:1212/apix/RTModule/RT" + SENSORTYPE[sensorType] + "?stime=" + new Date().getTime();
	setInterval(function() {
		json.queryTime = timeCk();
		$.ajaxSetup({
			cache: false
		})
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
				console.log("data: " + sensorID + "---" + JSON.stringify(point));
				if(point.ResultInfo.ReturnMark != true) {
					// alert("no data");
					return;
				}

				var value_x;
				var value_y;
				var value_z;
				var x;
				x = point.listData[0].time;
				value_x = point.listData[0].pressure;
				value_z = point.listData[0].temp;
				value_y = point.listData[0].humidity;
				console.log("chartArray: " + JSON.stringify(chartArray));
				console.log("draw elementID:" + elementID + "0");
				console.log("x:" + value_x + " y:" + value_y + " z:" + value_z);
				chartArray[elementID + "0"].series[0].setData([value_x]);
				chartArray[elementID + "1"].series[0].setData([value_y]);
				chartArray[elementID + "2"].series[0].setData([value_z]);
				$("#time" + elementID).attr("value", x.slice(11));
			},
			error: function(point) {
				//console.log("request fail！");
			},
		})
	}, 1000);
}

function metChart(sensorType, sensorID, elementID, components) {
	$(function() {
		var chartname;
		var datacolor;
		var demonsion;
		var max;
		if(components == 0) {
			chartname = 'Pressure';
			datacolor = "#01A6FF";
			demonsion = "Pa";
			max = 2000;
		} else if(components == 1) {
			chartname = 'Humidity';
            datacolor = "#FF8901";
            demonsion = "%";
            max = 100;
		} else if(components == 2) {
			chartname = 'Temperature';
            datacolor = "#FF00F6";
            max = 100;
            demonsion = "℃";
		}


		console.log("renderTo: " + elementID);
		console.log("renderTo: " + components);
        var chart = {
            type: 'solidgauge',
            backgroundColor: '#4A4A4A',
			height: 260

    	};
        var title = {
			text: chartname,
            style:{
                color:"#FFFFFF"
            }
		};

        var pane = {
            center: ['50%', '85%'],
            size: '100%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: "#D9DADC",
                // backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        };

        var tooltip = {
            enabled: false
        };

        // the value axis
        var yAxis = {
            stops: [
                [0, datacolor]
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            title: {
                y: -70
            },
            labels: {
                y: 16
            },
            min: 0,
            max: max
        };

        var plotOptions = {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        };

        var credits = {
            enabled: false
        };

        var series = [{
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                datacolor + '">{y}</span>' +
                '<span style="font-size:12px;color:'+datacolor+'">'+demonsion+'</span></div>'
            },
			data:[0],
            tooltip: {
                valueSuffix: demonsion
            }
        }];
        var exporting = {
            enabled: false
        };

        var json = {};
        json.chart = chart;
        json.title = title;
        json.pane = pane;
        json.tooltip = tooltip;
        json.yAxis = yAxis;
        json.credits = credits;
        json.series = series;
        json.exporting = exporting;
        json.plotOptions = plotOptions;
        console.log("elementid:"+elementID);
        console.log("components:"+components);
        var chartrenderto = elementID + components;
        console.log("chartrenderto: "+chartrenderto);
        $('#'+chartrenderto).highcharts(json);
        chartArray[chartrenderto] = $('#'+chartrenderto).highcharts();
        // Bring life to the dials
     //    var chartFunction = function() {
     //        // Speed
     //        var chart = $('#'+chartrenderto).highcharts();
     //        var point;
     //        var newVal;
     //        var inc;
    //
     //        if (chart) {
     //            point = chart.series[0].points[0];
     //            inc = Math.round((Math.random() - 0.5) * 100);
     //            newVal = point.y + inc;
    //
     //            if (newVal < 0 || newVal > 200) {
     //                newVal = point.y - inc;
     //            }
     //            point.update(newVal);
     //        }
     //    }
     //        setInterval(chartFunction, 2000);
	});
}