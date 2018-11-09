//weather html

//全局用户信息
$(function() {
	var data = window.localStorage.getItem("result");
	var dataObj = JSON.parse(data);
    if (dataObj == null){
        alert("Login author is out of date, please login again");
        window.location.href = "index.html";
    }
	var my_name = "<p>Hello," + dataObj.user.name + "</p>";
	$('.me_name').append(my_name);
})

//天气预测
$(function() {
	var $test = $("#test");
	console.log($test);
	$test.bind('click', function() {
		var token = window.localStorage.getItem("Geo_Token");
		var windSpeed = new Array();
		windSpeed = [36.5, 48.2, 40.3];
		var windDirection = new Array();
		windDirection = [331, 220, 103];
		var temperature = new Array();
		temperature = [21, 33, 45];
		var json = {
			"bridgeName": "Forth Road Bridge",
			"windSpeed": windSpeed,
			"windDirection": windDirection,
			"temperature": temperature
		};
		$.ajax({
			type: "GET",
			url: "http://128.243.138.25:1212/apix/Forecast/Forecast",
			data: json,
			async: true,
			beforeSend: function(XHR) {
				//发送ajax请求之前向http的head里面加入验证信息
				XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
			},
			success: function(data) {
				// alert("请求成功");
				console.log(data);
			},
			error: function(request) {
				// alert("请求失败");
			}
		});
	})
})
//基本数据
var apiServer = 'https://query.yahooapis.com/v1/public/yql'; //使用公共的天气接口
var citiesId = [
	//WOEID 数据，来自于http://woeid.rosselliot.co.nz/lookup
	'19344', //Edinburgh
];
var citiesName = [
	'Edinburgh ',
];

var weatherCode = [
	'tornado', //0 龙卷风
	'tropical storm', //1 热带风暴
	'hurricane', //2 飓风
	'severe thunderstorms', //3 次剧烈雷雨
	'thunderstorms', //4 雷雨
	'mixed rain and snow', //5 雨夹雪
	'mixed rain and sleet', //6 雨夹雪
	'mixed snow and sleet', //7 雨夹雪
	'freezing drizzle', //8 毛毛雨
	'drizzle', //9 小雨
	'freezing rain', //10 冻雨
	'showers', //11 小阵雨
	'showers', //12 大阵雨
	'snow flurries', //13 小雪花
	'light snow showers', //14 小雪阵雨
	'blowing snow', //15 风雪天
	'snow', //16 雪
	'hail', //17 
	'sleet', //18 雨夹雪
	'dust', //19 灰尘
	'foggy', //20 雾
	'haze', //21 霾
	'smoky', //22 烟
	'blustery', //23 风暴
	'windy', //24 多风
	'cold', //25 冷
	'cloudy', //26 多云
	'mostly cloudy', //27 mostly cloudy (night)
	'mostly cloudy', //28 mostly cloudy (day)
	'partly cloudy', //29 多云转晴 (night)
	'partly cloudy', //30 partly cloudy (day)
	'sunny', //31 clear (night)
	'sunny', //32 晴
	'fair', //33 少云 (night)
	'fair', //34 少云 (day)
	'mixed rain and hail', //35 混合雨和冰雹
	'hot', //36 炎热
	'isolated thunderstorms', //37 零星雷暴
	'scattered thunderstorms', //38 零星雷阵雨
	'scattered thunderstorms', //39 零星雷阵雨
	'scattered showers', //40 零星阵雨
	'heavy snow', //41 大雪
	'scattered snow showers', //42 分散的阵雪
	'heavy snow', //43 大雪
	'partly cloudy', //44 部分多云
	'thundershowers', //45 雷阵雨
	'snow showers', //46 阵雪
	'isolated thundershowers', //47 零星雷阵雨
	'3200 not available', //48 无法获取
];
//默认生成伦敦天气窗口	
showWeatherInfo(0);
// 生成天气窗口
function showWeatherInfo(sequence) {
	var queryString = 'select * from weather.forecast where woeid=' + citiesId[sequence] + ' and u="c"';
	$.ajax({
		url: apiServer,
		data: {
			format: 'json',
			q: queryString,
		},
		success: function(data) {
			console.log(data.query.results);
			if(data.query.results.channel.item.condition.code === 3200) {
				data.query.results.channel.item.condition.code = 48;
			}
			if(data.query.results.channel.astronomy.sunrise == "0:0 am" || data.query.results.channel.astronomy.sunset == "0:0 am") {
				data.query.results.channel.astronomy.sunrise = "暂无数据";
				data.query.results.channel.astronomy.sunset = "暂无数据";
			}
			// 获取天气图片
			var weatherImgURL = 'static/weather_png/';
			switch(data.query.results.channel.item.condition.code) {
				case '0':
					weatherImgURL = weatherImgURL + 'Weather NA.png';
					break;
				case '1':
					weatherImgURL = weatherImgURL + 'Thunderstorms.png';
					break;
				case '2':
					weatherImgURL = weatherImgURL + 'Windy.png';
					break;
				case '3':
					weatherImgURL = weatherImgURL + 'Thunders.png';
					break;
				case '4':
					weatherImgURL = weatherImgURL + 'Thunderstorms.png';
					break;
				case '5':
					weatherImgURL = weatherImgURL + 'Icy Snow.png';
					break;
				case '6':
					weatherImgURL = weatherImgURL + 'Icy Snow.png';
					break;
				case '7':
					weatherImgURL = weatherImgURL + 'Icy Snow.png';
					break;
				case '8':
					weatherImgURL = weatherImgURL + 'Light Rain.png';
					break;
				case '9':
					weatherImgURL = weatherImgURL + 'Light Rain.png';
					break;
				case '10':
					weatherImgURL = weatherImgURL + 'Icy.png';
					break;
				case '11':
					weatherImgURL = weatherImgURL + 'Rain.png';
					break;
				case '12':
					weatherImgURL = weatherImgURL + 'Heavy Rain.png';
					break;
				case '13':
					weatherImgURL = weatherImgURL + 'Few Flurries.png';
					break;
				case '14':
					weatherImgURL = weatherImgURL + 'Wet Flurries.png';
					break;
				case '15':
					weatherImgURL = weatherImgURL + 'Windy Snow.png';
					break;
				case '16':
					weatherImgURL = weatherImgURL + 'Snow.png';
					break;
				case '17':
					weatherImgURL = weatherImgURL + 'Weather NA.png';
					break;
				case '18':
					weatherImgURL = weatherImgURL + 'Icy Snow.png';
					break;
				case '19':
					weatherImgURL = weatherImgURL + 'Dust.png';
					break;
				case '20':
					weatherImgURL = weatherImgURL + 'Fog.png';
					break;
				case '21':
					weatherImgURL = weatherImgURL + 'Haze.png';
					break;
				case '22':
					weatherImgURL = weatherImgURL + 'Smoke.png';
					break;
				case '23':
					weatherImgURL = weatherImgURL + 'Thunderstorms.png';
					break;
				case '24':
					weatherImgURL = weatherImgURL + 'Windy.png';
					break;
				case '25':
					weatherImgURL = weatherImgURL + 'Frigid.png';
					break;
				case '26':
					weatherImgURL = weatherImgURL + 'Cloudy.png';
					break;
				case '27':
					weatherImgURL = weatherImgURL + 'Cloudy Night.png';
					break;
				case '28':
					weatherImgURL = weatherImgURL + 'Cloudy.png';
					break;
				case '29':
					weatherImgURL = weatherImgURL + 'Night Few Clouds.png';
					break;
				case '30':
					weatherImgURL = weatherImgURL + 'Mostly Sunny.png';
					break;
				case '31':
					weatherImgURL = weatherImgURL + 'Moon.png';
					break;
				case '32':
					weatherImgURL = weatherImgURL + 'Sunny.png';
					break;
				case '33':
					weatherImgURL = weatherImgURL + 'Night Few Clouds.png';
					break;
				case '34':
					weatherImgURL = weatherImgURL + 'Sun.png';
					break;
				case '35':
					weatherImgURL = weatherImgURL + 'Icy Snow.png';
					break;
				case '36':
					weatherImgURL = weatherImgURL + 'Hot.png';
					break;
				case '37':
					weatherImgURL = weatherImgURL + 'Thunders.png';
					break;
				case '38':
					weatherImgURL = weatherImgURL + 'Thunderstorms.png';
					break;
				case '39':
					weatherImgURL = weatherImgURL + 'Thunderstorms.png';
					break;
				case '40':
					weatherImgURL = weatherImgURL + 'Rain.png';
					break;
				case ' 41':
					weatherImgURL = weatherImgURL + 'Snow.png';
					break;
				case '42':
					weatherImgURL = weatherImgURL + 'Few Flurries.png';
					break;
				case '43':
					weatherImgURL = weatherImgURL + 'Snow.png';
					break;
				case '44':
					weatherImgURL = weatherImgURL + 'Cloudy.png';
					break;
				case '45':
					weatherImgURL = weatherImgURL + 'Thunderstorms.png';
					break;
				case '46':
					weatherImgURL = weatherImgURL + 'Rain.png';
					break;
				case '47':
					weatherImgURL = weatherImgURL + 'Thunderstorms.png';
					break;
				case '48':
					weatherImgURL = weatherImgURL + 'Weather NA.png';
					break;
			}
			var weatherDiv =
				'<div class="weather" id="' + citiesId[sequence] + '">' +
				'<table cellspacing="0" cellpadding="0" border="0" class="nowWeatherTable">' +
				'<tr>' +
				'<td width="130px">' +
				'<div class="weather_date">' + data.query.results.channel.item.forecast[0].date + '</div>' +
				'<div class="weatherImg">' + '<img src="' + weatherImgURL + '" width="65px" height="65px">' + '</div>' +
				'</td>' +
				'<td>' +
				'<div class="nowWeather">' + weatherCode[data.query.results.channel.item.condition.code] + '</div>' +
				'<div class="cities_name">' + citiesName[sequence] + '      ' + data.query.results.channel.item.condition.temp + '℃   ' + '</div>' + '<br>' +
				// -----
				'<div class="weather_wind">' + 'wind:' + '      ' + data.query.results.channel.wind.direction + '</div>' +
				'<div class="weather_speed">' + 'speed:' + '      ' + data.query.results.channel.wind.speed + '</div>' + '<br>' +
				// ------
				'<div class="astronomy">' + 'sunrise：' + data.query.results.channel.astronomy.sunrise + '      ' + 'sunset：' + data.query.results.channel.astronomy.sunset + '</div>' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'<div class="futureWeather">' +
				'<table  cellspacing="0" cellpadding="0" border="0">' +
				'<tr>' +
				'<td>' + data.query.results.channel.item.forecast[1].date + '</td>' +
				'<td>' + data.query.results.channel.item.forecast[2].date + '</td>' +
				'<td>' + data.query.results.channel.item.forecast[3].date + '</td>' +
				'<td>' + data.query.results.channel.item.forecast[4].date + '</td>' +
				'<td>' + data.query.results.channel.item.forecast[5].date + '</td>' +
				'</tr>' +
				'<tr>' +
				'<td>' + data.query.results.channel.item.forecast[1].high + '℃   ' + '~' + data.query.results.channel.item.forecast[1].low + '℃   ' + '</td>' +
				'<td>' + data.query.results.channel.item.forecast[2].high + '℃   ' + '~' + data.query.results.channel.item.forecast[2].low + '℃   ' + '</td>' +
				'<td>' + data.query.results.channel.item.forecast[3].high + '℃   ' + '~' + data.query.results.channel.item.forecast[3].low + '℃   ' + '</td>' +
				'<td>' + data.query.results.channel.item.forecast[4].high + '℃   ' + '~' + data.query.results.channel.item.forecast[4].low + '℃   ' + '</td>' +
				'<td>' + data.query.results.channel.item.forecast[5].high + '℃   ' + '~' + data.query.results.channel.item.forecast[5].low + '℃   ' + '</td>' +
				'</tr>' +
				'<tr>' +
				'<td>' + weatherCode[data.query.results.channel.item.forecast[1].code] + '</td>' +
				'<td>' + weatherCode[data.query.results.channel.item.forecast[2].code] + '</td>' +
				'<td>' + weatherCode[data.query.results.channel.item.forecast[3].code] + '</td>' +
				'<td>' + weatherCode[data.query.results.channel.item.forecast[4].code] + '</td>' +
				'<td>' + weatherCode[data.query.results.channel.item.forecast[5].code] + '</td>' +
				'</tr>' +
				'</table>' +
				'</div>' +
				'</div>';

			$('#weatherInfo').empty();
			$('#weatherInfo').append(weatherDiv);
			$('.weather').fadeIn(800); //淡入效果
            drawWethercharts(data.query.results.channel.item.forecast);
		}
	});
}


function drawWethercharts(forcast) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'spline',
            events: {
                load: function() {
                    var series1 = this.series[0],
                        series2 = this.series[1],
                        chart = this;
                    var token = window.localStorage.getItem("Geo_Token");
                    var windSpeed = new Array();
                    windSpeed = [6.5, 8.2, 4.3, 3, 2];
                    var windDirection = new Array();
                    windDirection = [331, 220, 103, 21, 43];
                    var temperature = new Array();
                    temperature = [21, 23, 25,22,25];
                    var json = {
                        "bridgeName": "Forth Road Bridge",
                        "windSpeed": windSpeed,
                        "windDirection": windDirection,
                        "temperature": temperature
                    };
                    $.ajax({
                        type: "GET",
                        url: "http://128.243.138.25:1212/apix/Forecast/Forecast",
                        data: json,
                        async: true,
                        beforeSend: function(XHR) {
                            //发送ajax请求之前向http的head里面加入验证信息
                            XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
                        },
                        success: function(data) {
                            // alert("请求成功");
                            console.log(JSON.stringify(data));
                            $.each(data.yResForecast, function(key,val) {
                                series1.addPoint(val, true);
                            });
                            $.each(data.zResForecast, function(key,val) {
                                series2.addPoint(val, true);
                            });
                        },
                        error: function(request) {
                            // alert("请求失败");
                        }
                    });
                }
            }
        },
        title: {
            text: 'Wind Speed'
        },
        subtitle: {
            text: null
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        yAxis: {
            title: {
                text: 'Deformation(m)'
            }
        },
		xAxis: {
            categories: [ forcast[1].date,forcast[2].date,forcast[3].date,forcast[4].date,forcast[5].date]
		},
        series: [{
            name: 'Y',
            data: []
        }, {
            name: 'Z',
            data: []
        }]
    });
}
