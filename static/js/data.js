//data html

var nav = document.getElementById("nav_list");
var navlist = nav.children;
var con = document.getElementById("content");
var conlist = con.children;

var data_opt1 = document.getElementById("data_opt1");
var data_optlist1 = data_opt1.children;
var lis1 = document.getElementById("data_opt_lis1");
var conli1 = data_opt_lis1.children;

var data_opt2 = document.getElementById("data_opt2");
var data_optlist2 = data_opt2.children;
var lis2 = document.getElementById("data_opt_lis2");
var conli2 = data_opt_lis2.children;

var fromyearType = null;
var frommonthType= null;
var fromdayType= null;
var fromHourType = null;
var fromMinuteType = null;
var fromSecondType = null;
var toyearType = null;
var tomonthType = null;
var todayType = null;
var toHourType = null;
var toMinuteType = null;
var toSecondType = null;
//againest time or sensor
var againestopt = "time";

var fromyearLocation = null;
var frommonthLocation= null;
var fromdayLocation= null;
var fromHourLocation = null;
var fromMinuteLocation = null;
var fromSecondLocation = null;
var toyearLocation = null;
var tomonthLocation = null;
var todayLocation = null;
var toHourLocation = null;
var toMinuteLocation = null;
var toSecondLocation = null;
var sectionTip = [];
var sensorList = new Array();

var sensorType = null;
var sensorName = null;
var sensorComponent = null;
var sensorContent = null;



var typeTime = null;
var plotOption = null;
var currentFigure = null;

//Sensor Type or Sensor Location
var anotherSensorOption = null;
var anotherSensorType = null;
var anotherSensorName = null;
var anotherSensorComponent = null;
var anotherSensorContent = null;

var anotherSensorPlotOption = null;
var anotherSensorCurrentFigure = null;

var navIndex = 0;
//文件下载路径
var downloadurl = null;
//存放图表中的所有的数据，为二维数组，index表示是第index个chart的数据
var dataArray       = Array();
var againstArray    = Array();

var SENSORTYPE = Array(
	"GNSSData",
	"Anemometer",
	"MetStation",
	"ACC"
);
var SENSORID = Array(
	"GNSSID",
	"aneID",
	"MetID",
	"ACC"
);
var DATATYPE = Array();
DATATYPE["Mean"] = 0;
DATATYPE["Min"] = 1;
DATATYPE["Max"] = 2;
DATATYPE["Std"] = 3;
DATATYPE["Raw"] = null;
var ANASENSORTYPE= Array();
ANASENSORTYPE["GNSS"] = 0;
ANASENSORTYPE["Anemometer"] = 1;
ANASENSORTYPE["Met Station"] = 2;
ANASENSORTYPE["Acceleromter"] = 3;

var Figure2Chart = Array();
Figure2Chart['conv2chart'] = 1000;
var figureCnt = 0;

var currentCnt = 100;

//0:continue,1:day,2:specific,3:weekly,4:monthly,5:yearly
var offsetOfAppend = 0;

var OFFSETARRAY = Array();
OFFSETARRAY[1] = 10;
OFFSETARRAY[2] = 10;
OFFSETARRAY[3] = 10;
OFFSETARRAY[4] = 7;
OFFSETARRAY[5] = 4;

var OFFSETOCP = Array();
OFFSETOCP[1] = "2018-01-01";
OFFSETOCP[2] = "2018-01-01";
OFFSETOCP[3] = "2018-06-";
OFFSETOCP[4] = "2018-01";
OFFSETOCP[5] = "2018";


var sun = 17;

var specificday = null;



var targetfigure ;

var againest1 = false;
var againest2 = false;
// window.setInterval("CollectGarbage();", 10000);

//全局用户信息
$(function() {
	var data = window.localStorage.getItem("result");
	var dataObj = JSON.parse(data);
	console.log("userInfo"+JSON.stringify(dataObj));
    if (dataObj == null){
        alert("Login author is out of date, please login again");
        window.location.href = "index.html";
    }

	var my_name = "<p>Hello,"+dataObj.user.name+"</p>";
    if (dataObj.user.role == 3){
        $("#downloadid").attr("disabled", true);
    }else {
        $("#downloadid").attr("disabled", false);
    }
    $('.me_name').append(my_name);

//图表数量
var chartCnt = 0;
//图表数组
var chartArray = Array();
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
//根据传感器名判断传感器类型
function sensorID2Type(sensorID){
    if (sensorID.indexOf("SHM")!=-1){
        return 0;
    }else if (sensorID.indexOf("ANE")!=-1){
        return 1;
    } else if (sensorID.indexOf("MET")!=-1){
        return 2;
    } else if (sensorID.indexOf("ACC")!=-1){
        return -1;
    } else {
        return -1;
    }
}
//OK按钮的点击事件
$("#test").click(
  function () {
      var startTime;
      var endTime;
      if ((dataObj.user.role == 3)){
          alert("Public user cannot get history data.");
          return;
      }

      // $("#loadgif").css("display","block");
      // sleep(1000);
      //为Sensor Type选项时
      if (navIndex ==0)
      {
          //传感器名称
          sensorName = $("#sensor_name_id").find("option:selected").text();
          // console.log("sensorName :"+sensorName );
          //传感器类型
          var type = $("#type_sensor_id").find("option:selected").val();
          var typeInt;
          var typeStr;
          //console.log('test:'+type);
          switch (parseInt(type)){
              case 0:
                  typeInt = 3;
                  typeStr = "Accelerometer";
                  break;
              case 1:
                  typeInt = 1;
                  typeStr = "Anemometer";
                  //console.log('typeInt:'+typeInt);
                  //console.log('typeStr:'+typeStr);
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
                  break;
          }
          sensorType = typeInt;
          // console.log("sensorType :"+sensorType);
          sensorContent = $("#sensor_type_content_id").find("option:selected").val();
          // console.log("sensorContent:"+sensorContent);
          sensorComponent = $("#type_components").find("option:selected").val();
          // console.log(" sensorComponent:"+ sensorComponent);

          //新窗口还是老窗口的判断
          plotOption = $("#Ploat_Option_type_id").find("option:selected").val();
          targetfigure = $("#current_figures_type_id").find("option:selected").val();
      }else{
          sensorName = $("#location_sensor_name_id").find("option:selected").text();
          // console.log("sensorName :"+sensorName );
          var type = sensorID2Type(sensorName);
          //console.log('test:'+type);
          sensorType = parseInt(type);
          // console.log("sensorType :"+sensorType);
          sensorContent = $("#content_other_sensor_id").find("option:selected").val();
          // console.log("sensorContent:"+sensorContent);
          sensorComponent = $("#location_components").find("option:selected").val();
          // console.log(" sensorComponent:"+ sensorComponent);
          plotOption = $("#Ploat_Option_location_id").find("option:selected").val();
          targetfigure = $("#current_figures_location_id").find("option:selected").val();
      }



      var sensorID0     = sensorName;
      var sensorType0   = sensorType;
      var dataType0     = DATATYPE[sensorContent];
      var component0    = sensorComponent;
      var chartID       = null;
      // var timeType0     = typeTime;
      var sensorID1     = null;
      var sensorType1   = null;
      var dataType1     = null;
      var component1    = null;

      //console.log("sensorID0:"+sensorID0);
      //console.log("sensorType0:"+sensorType0);
      //console.log("dataType0:"+dataType0);
      //console.log("component:"+component0);

      //console.log("sensorTypeOrLocation:"+sensorTypeOrLocation);

      if (sensorTypeOrLocation){
          startTime = new Date(fromyearType,frommonthType-1,fromdayType,
              fromHourType,fromMinuteType, fromSecondType);
          endTime   = new Date(toyearType, tomonthType-1, todayType,
              toHourType, toMinuteType, toSecondType);
          offsetOfAppend = $("#time_type_sensor_type_id").val();
      } else{
          startTime = new Date(fromyearLocation,frommonthLocation-1,fromdayLocation,
              fromHourLocation,fromMinuteLocation, fromSecondLocation);
          endTime   = new Date(toyearLocation, tomonthLocation-1, todayLocation,
              toHourLocation, toMinuteLocation, toSecondLocation);
          offsetOfAppend = $("#time_type_location_id").val();
      }
      // console.log("offsetOfAppend: " + offsetOfAppend);
      var caseofselect = 0;
      startTime = startTime.toISOString();
      endTime   = endTime.toISOString();

      if (againestopt == "sensor"){
          //console.log("anotherSensorPlotOption:"+anotherSensorPlotOption );
          if (anotherSensorPlotOption == "NewFigure" ){
              chartID = chartCnt;
              dataArray[chartID] = Array();
              chartCnt++;
          }else {
              chartID = parseInt(anotherSensorCurrentFigure);
              dataArray[chartID] = Array();
          }
          //console.log("chartID:"+chartID);
          //添加元素
          var charEle = "<div id='wrap"+chartID+"'>" +
              "<div class='chart_exit' id='close"+ chartID+"' ><img src='static/img/chart_exit.png' /></div>" +
              "<div id='container"+chartID+"'></div>" +
              "</div>";
          $('.data_table').append(charEle);
          $("#close"+chartID).live("click",function () {
              chartArray[chartID].destroy();
              $('#wrap'+chartID).remove();
              $("#other_sensor_current_figure_type_id option[value="+chartID+"]").remove();
              $("#current_figures_type_id option[value="+chartID+"]").remove();
              $("#other_sensor_current_figure_location_id").append(figure);
              $("#current_figures_location_id").append(figure);
          });
          if (navIndex ==0 ){
              anotherSensorOption = $("#other_sensor_type_option_id").find("option:selected").val();
          } else {
              anotherSensorOption = $("#other_sensor_location_option_id").find("option:selected").val();
          }
          if ( (navIndex ==0) && (anotherSensorOption == "Sensor Type" )){
              caseofselect = 0;
              sensorID1     = $("#sensor_name_type_id").find("option:selected").val();
              sensorType1   = $("#sensor_type_or_location_type_id option:selected").text();
              sensorType1 = ANASENSORTYPE[sensorType1];
              // console.log("sensorID case0:"+ sensorID1);
              // console.log("sensorType case1:"+ sensorType1);
              anotherSensorContent = $("#content_location_id").find("option:selected").val();
              dataType1      = DATATYPE[anotherSensorContent];
              anotherSensorComponent = $("#other_sensor_component_type_id").find("option:selected").val();
              component1    = anotherSensorComponent;
              anotherSensorPlotOption = $("#Plot_Option_type_id").find("option:selected").val();
              targetfigure = $("#other_sensor_current_figure_type_id").find("option:selected").val();
          } else if ((navIndex ==0) && (anotherSensorOption == "Sensor Location" )) {
              caseofselect = 0;
              sensorID1     = $("#sensor_name_type_id").find("option:selected").val();
              var type = sensorID2Type(sensorID1);
              // console.log("sensorID case1:"+ sensorID1);
              // console.log("sensorType case1:"+ type);
              sensorType1   = type;
              anotherSensorContent = $("#content_location_id").find("option:selected").val();
              dataType1      = DATATYPE[anotherSensorContent];
              anotherSensorComponent = $("#other_sensor_component_type_id").find("option:selected").val();
              component1    = anotherSensorComponent;
              anotherSensorPlotOption = $("#Plot_Option_type_id").find("option:selected").val();
              targetfigure = $("#other_sensor_current_figure_type_id").find("option:selected").val();
          } else if ((navIndex ==1) && (anotherSensorOption == "Sensor Location" )) {
              caseofselect = 0;
              sensorID1     = $("#sensor_name_location_id").find("option:selected").val();
              var type = sensorID2Type(sensorID1);
              sensorType1   = type;
              // console.log("sensorID case1:"+ sensorID1);
              // console.log("sensorType case1:"+ type);
              anotherSensorContent = $("#other_sensor_contents_id").find("option:selected").val();
              dataType1      = DATATYPE[anotherSensorContent];
              anotherSensorComponent = $("#other_sensor_component_location_id").find("option:selected").val();
              component1    = anotherSensorComponent;
              anotherSensorPlotOption = $("#Plot_Option_location_id").find("option:selected").val();
              targetfigure = $("#other_sensor_current_figure_location_id").find("option:selected").val();
          } else if ((navIndex ==1) && (anotherSensorOption == "Sensor Type" )) {
              caseofselect = 0;
              sensorID1     = $("#sensor_name_location_id").find("option:selected").val();
              sensorType1   = $("#sensor_type_or_location_location_id option:selected").text();
              sensorType1 = ANASENSORTYPE[sensorType1];
              // console.log("sensorID case0:"+ sensorID1);
              // console.log("sensorType case1:"+ sensorType1);
              anotherSensorContent = $("#other_sensor_contents_id").find("option:selected").val();
              dataType1      = DATATYPE[anotherSensorContent];
              anotherSensorComponent = $("#other_sensor_component_location_id").find("option:selected").val();
              component1    = anotherSensorComponent;
              anotherSensorPlotOption = $("#Plot_Option_location_id").find("option:selected").val();
              targetfigure = $("#other_sensor_current_figure_location_id").find("option:selected").val();
          }


          //console.log("dataArray:"+dataArray[chartID]);

          if (anotherSensorPlotOption == "NewFigure" ){
              //console.log("NewFigure");
              var figure = "<option id='figure"+figureCnt+"' value='"+figureCnt+"'>figure"+figureCnt+"</option>";
              var comp;
              switch (sensorType0){
                  case 0:
                      if (component0 == 0){
                          comp = "X";
                      }else if (component0 == 1){
                          comp = "Y";
                      } else if (component0 == 2){
                          comp = "Z";
                      }
                      break;
                  case 1:
                      if (component0 == 0){
                          comp = "Horizon";
                      }else if (component0 == 1){
                          comp = "Vertical";
                      }
                      break;
                  case 2:
                      if (component0 == 0){
                          comp = "Pressure";
                      }else if (component0 == 1){
                          comp = "Humidity";
                      } else if (component0 == 2){
                          comp = "Temperature";
                      }
                      break;
                  case 3:
                      break;
                  default:
                      break;
              }
              var comp1;
              switch (sensorType1){
                  case 0:
                      if (component1 == 0){
                          comp1 = "X";
                      }else if (component1 == 1){
                          comp1 = "Y";
                      } else if (component1 == 2){
                          comp1 = "Z";
                      }
                      break;
                  case 1:
                      if (component1 == 0){
                          comp1 = "Horizon";
                      }else if (component1 == 1){
                          comp1 = "Vertical";
                      }
                      break;
                  case 2:
                      if (component1 == 0){
                          comp1 = "Pressure";
                      }else if (component1 == 1){
                          comp1 = "Humidity";
                      } else if (component1 == 2){
                          comp1 = "Temperature";
                      }
                      break;
                  case 3:
                      break;
                  default:
                      break;
              }
              var currentcomp = sensorID0+"-"+comp+" VS "+sensorID1+"-"+comp1;
              newHisChart(chartID, sensorType0, sensorID0+" vs "+sensorID1, startTime, endTime, currentcomp, dataType0,"scatter", "Figure."+figureCnt);
              datagenerate(chartID,sensorType0, sensorID0, startTime, endTime, component0, dataType0, 1);
              datagenerate(chartID,sensorType1, sensorID1, startTime, endTime, component1, dataType1, 2);
              // chartArray[chartID].series[0].setData(dataArray[chartID]);
              $("#other_sensor_current_figure_type_id").append(figure);
              $("#current_figures_type_id").append(figure);
              $("#other_sensor_current_figure_location_id").append(figure);
              $("#current_figures_location_id").append(figure);
              figureCnt++;
          }else {
              datagenerate(chartID,sensorType0, sensorID0, startTime, endTime, component0, dataType0, 1);
              datagenerate(chartID,sensorType1, sensorID1, startTime, endTime, component1, dataType1, 2);
              $("#loadgif").hide();
          }
      }else {
          if (plotOption == "NewFigure" ){
              chartID = chartCnt;
              dataArray[chartID] = Array();
              var charEle = "<div id='wrap"+chartID+"'>" +
                  "<div class='chart_exit' id='close"+ chartID+"' ><img src='static/img/chart_exit.png' /></div>" +
                  "<div id='container"+chartID+"'></div>" +
                  "</div>";
              $('.data_table').append(charEle);

              $("#close"+chartID).live("click",function () {
                  chartArray[chartID].destroy();
                  $('#wrap'+chartID).remove();
                  $("#other_sensor_current_figure_type_id option[value="+chartID+"]").remove();
                  $("#current_figures_type_id option[value="+chartID+"]").remove();
                  $("#other_sensor_current_figure_location_id").append(figure);
                  $("#current_figures_location_id").append(figure);
              });
              var figure = "<option id='figure"+figureCnt+"' value='"+figureCnt+"'>figure"+figureCnt+"</option>";
              var comp;
              switch (sensorType0){
                  case 0:
                      if (component0 == 0){
                          comp = "X";
                      }else if (component0 == 1){
                          comp = "Y";
                      } else if (component0 == 2){
                          comp = "Z";
                      }
                      break;
                  case 1:
                      if (component0 == 0){
                          comp = "Horizon";
                      }else if (component0 == 1){
                          comp = "Vertical";
                      }
                      break;
                  case 2:
                      if (component0 == 0){
                          comp = "Pressure";
                      }else if (component0 == 1){
                          comp = "Humidity";
                      } else if (component0 == 2){
                          comp = "Temperature";
                      }
                      break;
                  case 3:
                      break;
                  default:
                      break;
              }
              var currentcomp = sensorID0 + "-" +comp;
              console.log("offsetOfAppend :"+offsetOfAppend);
              if (offsetOfAppend == 0) {
                  newHisChart(chartID, sensorType0, sensorID0, startTime, endTime, currentcomp, dataType0,"line", "Figure."+figureCnt);
              }else {
                  newHisChart(chartID, sensorType0, sensorID0, startTime, endTime, currentcomp, dataType0,"scatter", "Figure."+figureCnt);
              }
              datagenerate(chartID, sensorType0, sensorID0, startTime, endTime, component0, dataType0, 0);
              $("#other_sensor_current_figure_type_id").append(figure);
              $("#current_figures_type_id").append(figure);
              $("#other_sensor_current_figure_location_id").append(figure);
              $("#current_figures_location_id").append(figure);
              figureCnt++;
              chartCnt++;
          }else {
              dataArray[chartID+currentCnt] = Array();
              datagenerate(chartID+currentCnt, sensorType0, sensorID0, startTime, endTime, component0, dataType0, 0);
              currentCnt++;
              chartCnt = chartID+currentCnt-100+1;
          }
      }
  }
);
function mergeArray(srcArray1, srcArray2, desArray, destIndex) {
    $.each(srcArray1, function (key1, value1) {
        if (srcArray2.hasOwnProperty(key1)) {
            dataArray[destIndex].push([value1, srcArray2[key1]]);
        }
    } )
}

//sensorType:图表的传感器类型，四种：0:GNSSData，1:Anemometer，2:MetStation，3:ACC（暂时没有接口）
//sensorID:传感器的ID标识
//components:是那两个变量去拼这个点图：0：x/水平，1：y/竖直，2：z
//dataType: 0,mean, 1 min,2 max, 3 std
//starttime, endtime 开始结束时间
//against:0:时间，1：传感器 被against, 2:传感器 against
function datagenerate(chartID, sensorType, sensorID, starttime, endtime, component, datatype, against) {
    // console.log("sensorType:"+sensorType);
    // console.log("datatype:"+datatype);
    var token = window.localStorage.getItem("Geo_Token");
    var json = {
		"bridgename": "Forth Road Bridge",
		"dtStart": starttime,
		"dtEnd": endtime,
		// "GNSSID": sensorID,
		// "direction": component,
		// "isDownLoad": false
	};
    if ($("#downloadid").attr('checked')){
        json["isDownload"] = true;
    }else {
        json["isDownload"] = false;
    }
    if (datatype != null){
        json["dataType"] = datatype; //,这个没有，表示是原始数据
        json["direction"] = component; //,这个没有，表示是原始数据
        if (sensorType == 2){
            json["dataType2"] = datatype; //,这个没有，表示是原始数据
        }
    }else {
        if (sensorType != 1){
            json["direction"] = component; //,这个没有，表示是原始数据
        } else {
            json["isWindSpeed"] = true; //,这个没有，表示是原始数据
            if (component == 0){
                json["isHorizon"] = true; //,这个没有，表示是原始数据
            } else {
                json["isHorizon"] = false; //,这个没有，表示是原始数据
            }
        }
    }
    $("#loadgif").show();
    // event.preventDefault();

    console.log("json:"+JSON.stringify(json));
    sensorType = sensorID2Type(sensorID);
    var comp;
    switch (sensorType){
        case 0:
            if (component == 0){
                comp = "X";
            }else if (component == 1){
                comp = "Y";
            } else if (component == 2){
                comp = "Z";
            }
            break;
        case 1:
            break;
        case 2:
            if (component == 0){
                comp = "Pressure";
            }else if (component == 1){
                comp = "Humidity";
            } else if (component == 2){
                comp = "Temperature";
            }
            break;
        case 3:
            if (component == 0){
                comp = "Horizon";
            }else if (component == 1){
                comp = "Vertical";
            }
            break;
        default:
            break;
    }
    json[SENSORID[sensorType]] = sensorID;
    $.ajax({
        type: "GET",
        url: "http://128.243.138.25:1212/apix/HisQuery/His"+SENSORTYPE[sensorType],
        data: json,
        dataType: "json",
        async: true,
        beforeSend: function(XHR) {
            //发送ajax请求之前向http的head里面加入验证信息
            XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
        },
        success: function(point) {
            //console.log("point:"+JSON.stringify(point));
            if (point.ResultInfo.ReturnMark != true) {
                alert("no data");
                dataArray[chartID] = null;
                $("#wrap"+chartID).remove();
                return;
            }
            console.log("point:"+JSON.stringify(point));
            if (point.hasOwnProperty("zipPath")){
                downloadurl = point.zipPath;
            }
            // console.log("data length:"+point.listData.length);
            // console.log("offsetOfAppend : "+offsetOfAppend);

            if(offsetOfAppend == 2){
                specificday = $("#day_select_id").val();
                // console.log("specificday: "+specificday);
            }
            var timeval = null;
            console.log("length:"+point.listData.length);
            for(i = 0; i < point.listData.length; i += 1) {
                var value_x = point.listData[i].dataTime;
                var value_y = point.listData[i].dataVale;
                if (against == 0){
                    if( (offsetOfAppend ==1) || (offsetOfAppend ==4) || (offsetOfAppend ==5) ){
                        value_x = value_x.slice(OFFSETARRAY[offsetOfAppend]);
                        timeval= OFFSETOCP[offsetOfAppend]+value_x;
                    }else if(offsetOfAppend ==3){
                        var temptime = new Date(value_x);
                        var weekday = sun + temptime.getDay();
                        value_x = value_x.slice(OFFSETARRAY[offsetOfAppend]);
                        timeval = OFFSETOCP[offsetOfAppend]+weekday+value_x;
                    }else if(offsetOfAppend ==2){
                        var temptime = new Date(value_x);
                        if(temptime.getDay() == specificday){
                            value_x = value_x.slice(OFFSETARRAY[offsetOfAppend]);
                            timeval = OFFSETOCP[offsetOfAppend]+value_x;
                        }
                    }else {
                        timeval = value_x;
                    }
                    dataArray[chartID][i] = Array();
                    dataArray[chartID][i][0] = Date.parse(timeval);
                    dataArray[chartID][i][1] = value_y;
                }else if (against == 1){
                    if (!Array.isArray(dataArray[chartID][i])){
                        dataArray[chartID][i] = Array();
                    }
                    dataArray[chartID][i][0] = value_y;
                    // console.log("against 1:"+value_y);
                }else if (against == 2){
                    if (!Array.isArray(dataArray[chartID][i])){
                        dataArray[chartID][i] = Array();
                    }
                    dataArray[chartID][i][1] = value_y;
                    // console.log("against 2:"+value_y);
                }else {
                    alert("parameter error");
                }
            }
            console.log("dataArray:"+dataArray[chartID]);
            // console.log("plotOption:"+plotOption);
            if (against == 0) {
                if (plotOption == "NewFigure" ) {
                    $("#loadgif").hide();
                    chartArray[chartID].series[0].setData(dataArray[chartID]);
                    console.log("memory free");
                    // dataArray[chartID] = null;
                    delete dataArray[chartID];
                    if (downloadurl != null) {
                        var newWindow = window.open();
                        newWindow.location.href = downloadurl;
                    }
                }else {
                    var targetchart = parseInt(targetfigure);
                    curHisChart(chartID, targetchart, sensorID, comp);
                    $("#loadgif").hide();
                }
            }else if (against == 1){
                againest1 = true;
                if ((againest1 == true)&&(againest2 == true)){
                    if (plotOption == "NewFigure" ) {
                        // console.log("dataArray[chartID]:" + dataArray[chartID]);
                        chartArray[chartID].series[0].setData(dataArray[chartID]);
                        // dataArray[chartID] = null;
                        // delete dataArray[chartID];
                        // CollectGarbage();
                        // console.log("memory free");
                    }else {
                        var targetchart = parseInt(targetfigure);
                        curHisChart(chartID, targetchart, sensorID, comp);
                    }
                    if (downloadurl != null) {
                        var newWindow = window.open();
                        newWindow.location.href = downloadurl;
                    }
                    $("#loadgif").hide();
                    againest1 = false;
                    againest2 = false;
                }
            } else if (against == 2){
                againest2 = true;
                if ((againest1 == true)&&(againest2 == true)){
                    if (plotOption == "NewFigure" ) {
                        // console.log("dataArray[chartID]:" + dataArray[chartID]);
                        chartArray[chartID].series[0].setData(dataArray[chartID]);
                        // dataArray[chartID] = null;
                        delete dataArray[chartID];
                        // console.log("memory free");
                    }else {
                        var targetchart = parseInt(targetfigure);
                        curHisChart(chartID, targetchart);
                    }
                    if (downloadurl != null) {
                        var newWindow = window.open();
                        newWindow.location.href = downloadurl;
                    }
                    $("#loadgif").hide();
                    againest1 = false;
                    againest2 = false;
                }
            }
            // console.log("chartID:"+chartID+"dataArray:"+dataArray[chartID]);
        },
        error: function(point) {
            alert("no data");
            dataArray[chartID] = null;
            $("#wrap"+chartID).remove();
            $("#loadgif").hide();
            //console.log("请求失败！");
        },

    })
}
//历史数据
//sensortype:
// GNSS= 0;
// Anemometer= 1;
// Met Station= 2;
// Acceleromter= 3;
function newHisChart(chartID, sensorType, sensorID, starttime, endtime, component, datatype, chartType, figure){
    var $test = $("#test");


    // var xMin =Date.parse(dataArray[chartID][0][0]);
    // var start = dataArray[chartID][0][0];
    // var xMax =Date.parse(dataArray[chartID][dataArray[chartID].length - 1][0]);


    var xAxisJson = null;
    var markerEnable = false;

    if (againestopt == "sensor"){
        markerEnable = true;
        xAxisJson = {
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
        };
    }else {
        markerEnable = true;
        var timeformat = null;
        // console.log("offsetOfAppend: "+offsetOfAppend );
        if(offsetOfAppend == 0){
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
        } else if(offsetOfAppend == 1){
            timeformat = {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%H:%M',
                week: '%d',
                month: '%Y-%m',
                year: '%Y'
            };
        }else if(offsetOfAppend == 2){
            timeformat = {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%H:%M',
                week: '%m-%d',
                month: '%Y-%m',
                year: '%Y'
            };
        }else if(offsetOfAppend == 3){
            timeformat = {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%w',
                week: '%m-%d',
                month: '%Y-%m',
                year: '%Y'
            };
        }else if(offsetOfAppend == 4){
            timeformat = {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%d',
                week: '%m-%d',
                month: '%Y-%m',
                year: '%Y'
            };
        }else if(offsetOfAppend == 5){
            timeformat = {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%m-%d',
                week: '%m-%d',
                month: '%m',
                year: '%Y'
            };
        }
        xAxisJson = {
            type: 'datetime',
            dateTimeLabelFormats:timeformat
        };
    }

    // if (chartType == "line")

    console.log("chartType:"+chartType);

	//container_1
	chartArray[chartID] = Highcharts.chart('container'+chartID, {
		chart: {
			type: chartType,
			marginRight: 10,
            zoomType: "x",
            height:400
		},
		title: {
			text: 'HISTORICAL DATA'
		},
		subtitle: {
			text: figure+' SENSORID: '+component+'. SENSOR SUPPLIER: UBIPOS UK LTD, NOTTINGHAM, UK'
		},
		yAxis: {
			title: null
		},
		xAxis: xAxisJson,
        boost: {
            useGPUTranslations: true
        },
		// credits: {
		// 	enabled: false
		// },
		// exporting: {
		// 	enabled: false
		// },
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
			name: component,
            color: 'rgba(223, 83, 83, .5)',
            turboThreshold: 100000,
            // lineWidth: 0.5
            // data: dataArray[chartID]
		}]
	});
	console.log("chartarray:"+chartID);

}

function curHisChart(chartID, targetchartID, sensorID, comp){
    chartArray[targetchartID].addSeries({
        name:sensorID+"-"+comp,
        data:dataArray[chartID]
    });
}

//date1
lay('#version').html('-v' + laydate.v);

laydate.render({
    elem: '#date1',
    lang: 'en',
    done: function (value,date) {
        fromyearType    = date.year;
        frommonthType   = date.month;
        fromdayType     = date.date;
        //console.log(date.year+"-"+date.month+"-"+date.date);
        //console.log(fromyearType+"-"+frommonthType+"-"+fromdayType);
        //console.log("fromdate:"+JSON.stringify(date));
        //console.log("fromvalue"+value);
    }
});
//time1
laydate.render({
    elem: '#time1',
    lang: 'en',
    type: 'time',
	done:function (value,date) {
    	fromHourType = date.hours;
        fromMinuteType = date.minutes;
        fromSecondType = date.seconds;
        //console.log(fromHourType+"-"+fromMinuteType+"-"+fromSecondType);
        //console.log("fromtime:"+JSON.stringify(date));
    }
});
lay('#version').html('-v' + laydate.v);

//date2
laydate.render({
    elem: '#date2',
    lang: 'en',
    done: function (value,date) {
        toyearType    = date.year;
        tomonthType   = date.month;
        todayType     = date.date;
        //console.log(toyearType+"-"+tomonthType+"-"+todayType);
        //console.log("todate:"+JSON.stringify(date));
    }
});
//time2
laydate.render({
    elem: '#time2',
    lang: 'en',
    type: 'time',
	done: function (value,date) {
        toHourType = date.hours;
        toMinuteType = date.minutes;
        toSecondType = date.seconds;
        //console.log(toHourType+"-"+toMinuteType+"-"+toSecondType);
        //console.log("totime:"+JSON.stringify(date));
    }
});
//two_date1
lay('#version').html('-v' + laydate.v);

laydate.render({
    elem: '#two_date1',
    lang: 'en',
    done: function (value,date) {
        fromyearLocation    = date.year;
        frommonthLocation   = date.month;
        fromdayLocation     = date.date;
        //console.log(JSON.stringify(date));
    }
});
//two_time1
laydate.render({
    elem: '#two_time1',
    lang: 'en',
    type: 'time',
    done:function (value,date) {
        fromHourLocation = date.hours;
        fromMinuteLocation = date.minutes;
        fromSecondLocation = date.seconds;
        //console.log(JSON.stringify(date));
    }
});
lay('#version').html('-v' + laydate.v);

//two_date2
laydate.render({
    elem: '#two_date2',
    lang: 'en',
    done: function (value,date) {
        toyearLocation   = date.year;
        tomonthLocation   = date.month;
        todayLocation    = date.date;
        //console.log(JSON.stringify(date));
    }
});
//two_time2
laydate.render({
    elem: '#two_time2',
    lang: 'en',
    type: 'time',
    done: function (value,date) {
        toHourLocation = date.hours;
        toMinuteLocation = date.minutes;
        toSecondLocation = date.seconds;
        //console.log(JSON.stringify(date));
    }
});

var sensorTypeOrLocation = true;
document.getElementById("type_sensor_id").options.length=0;
document.getElementById("sensor_name_id").options.length=0;
document.getElementById("type_components").options.length=0;

var token = window.localStorage.getItem("Geo_Token");

getSensorTpye(0);
getSensorIDByType(3,0);
getSensorDataItemByType("Accelerometer",0);
initSensorLocationData(0);



for(var i = 0; i < navlist.length; i++) {
	navlist[i].index = i;
	navlist[i].onclick = function() {
		for(var m = 0; m < conlist.length; m++) {
			navlist[m].className = "";
			conlist[m].style.display = "none";
			//			//console.log(m);
		}
		this.className = "active";
		navIndex = this.index;
		conlist[this.index].style.display = "block";
		switch (this.index){
			case 0:
				//初始化 sensorType
                sensorTypeOrLocation = true;
                getSensorTpye(0);
                getSensorIDByType(3,0);
                getSensorDataItemByType("Accelerometer",0);
				break;
			case 1:
                sensorTypeOrLocation = false;
                initSensorLocationData(0);
                setSensorNameFormSensorListByLocation(sectionTip[0],sensorList,0);
                var initId = getFristSensorIDByLocation(sectionTip[0],sensorList);

                var type = getTpyeFromLoctionBySensorName(initId,sensorList);

                getSensorDataItemByLocation(type,0);

				break;
			default:
                sensorTypeOrLocation = true;
				break;

		}
	}
}

for(var i = 0; i < data_optlist1.length; i++) {
	data_optlist1[i].index = i;
	data_optlist1[i].onclick = function() {
		for(var m = 0; m < conli1.length; m++) {
			//			data_optlist[m].className = "";
			conli1[m].style.display = "none";
			//			//console.log(m);
		}
		//		this.className = "active";
		conli1[this.index].style.display = "block";

        switch (this.index){
            case 0:
                break;
            case 1:
                getSensorTpyeToAnother();
                getSensorIDByTypeToAntherSensor(3);
                getSensorDataItemByTypeToAnthorSensor("Accelerometer");
                anotherSensorOption="Sensor Type";
                break;
            default:
                break;

        }
	}
}
$("#r1").click(function () {
    againestopt = "time";
    //console.log("againestopt "+againestopt );
});
$("#r2").click(function () {
    againestopt = "sensor";
    //console.log("againestopt "+againestopt );
});
$("#r3").click(function () {
    againestopt = "time";
    //console.log("againestopt "+againestopt );
});
$("#r4").click(function () {
    againestopt = "sensor";
    //console.log("againestopt "+againestopt );
});
//against time or against another sensor
for(var i = 0; i < data_optlist2.length; i++) {
	data_optlist2[i].index = i;
	data_optlist2[i].onclick = function() {
		for(var m = 0; m < conli2.length; m++) {
			//			data_optlist[m].className = "";
			conli2[m].style.display = "none";
			//			//console.log(m);
		}
		//		this.className = "active";
		conli2[this.index].style.display = "block";

		//console.log("index:"+this.index);

        switch (this.index){
            case 0:
                againestopt = "time";
                //console.log("againestopt "+againestopt );
                break;
            case 1:
                againestopt = "sensor";
                //console.log("againestopt "+againestopt );
            	getSensorTpye(2);
            	getSensorIDByType(3,2);
            	getSensorDataItemByType("Accelerometer",2);
                anotherSensorOption="Sensor Type";
                break;
            default:
                break;

        }
	}
}


lay('#version').html('-v' + laydate.v);
laydate.render({
    elem: '#time1' //指定元素
    ,done: function (value, date) {
        fromyear    = date.year;
        frommonth   = date.month;
        fromday     = date.date;
        //console.log(date);
    }
});
lay('#version').html('-v' + laydate.v);

//time2
laydate.render({
    elem: '#time2' //指定元素
    ,done: function (value, date) {
        toyear    = date.year;
        tomonth   = date.month;
        today     = date.date;
        //console.log(date);
    }
});

//sensor type
$("#type_sensor_id").on("change",function () {
	var type = $("option:selected",this).val();
	var typeInt;
	var typeStr;
	//console.log('test:'+type);
	switch (parseInt(type)){
		case 0:
             typeInt = 3;
             typeStr = "Accelerometer";
			break;
        case 1:
            typeInt = 1;
            typeStr = "Anemometer";
            //console.log('typeInt:'+typeInt);
            //console.log('typeStr:'+typeStr);
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
            //console.log('def typeInt:'+typeInt);
            //console.log('def typeStr:'+typeStr);
			break;
	}
    //console.log('typeInt:'+typeInt);
    //console.log('typeStr:'+typeStr);
    sensorType = typeInt;
	getSensorIDByType(typeInt,0);
    getSensorDataItemByType(typeStr,0);
});
$("#sensor_name_id").on("change",function () {
    sensorName = $("option:selected", this).val();
    //console.log('test:'+sensorName);
});

$("#type_components").on("change",function () {
    sensorComponent = $("option:selected", this).val();
    //console.log('test:'+sensorComponent);
});

$("#sensor_type_content_id").on("change",function () {
    sensorContent = $("option:selected", this).val();
    if (sensorContent == "Raw" ){
        $("#r2").attr("disabled", true);
    }else {
        $("#r2").attr("disabled", false);
    }
    //console.log('test:'+sensorContent);
});

//sensor location
$("#location_sensor_name_id").on("change",function () {
    sensorName = $("option:selected", this).val();
    //console.log('test:'+sensorName);
});

$("#location_components").on("change",function () {
    sensorComponent = $("option:selected", this).val();
    //console.log('test:'+sensorComponent);
});

$("#content_other_sensor_id").on("change",function () {
    sensorContent = $("option:selected", this).val();
    //console.log('test:'+sensorContent);
});
$("#location_sensor_id").on("change",function () {
	var local = $("option:selected",this).val();
	//console.log(local);
	setSensorNameFormSensorListByLocation(local,sensorList,0);
    //init  frist sensorName and  commponent
    var initId = getFristSensorIDByLocation(local,sensorList);
    var type = getTpyeFromLoctionBySensorName(initId,sensorList);
    getSensorDataItemByLocation(type,0);

});
$("#location_sensor_name_id").on("change",function () {
    var name = $("option:selected",this).val();
    //console.log(name);
    setSensorComponentFormSensorListBySensorName(name,sensorList,0);

});

// time tpye onetime_type_location_id
$("#time_type_sensor_type_id").on("change",function () {
    typeTime = $("option:selected",this).text();
    console.log("typeTime"+typeTime);
    if (typeTime == "Stack of specific data"){
        $("#day_select_div").css('display', 'block');
    }else {
        $("#day_select_div").css('display', 'none');
    }
    //console.log(typeTime);
});

//Ploat Option/Location one
$("#Ploat_Option_type_id").on("change",function () {
    plotOption = $("option:selected",this).val();
    //console.log(plotOption);
});
//current_figures_type_id one
$("#current_figures_type_id").on("change",function () {
    currentFigure = $("option:selected",this).val();
    //console.log(currentFigure);
});

// Another Sensor  one
//Sensor Type/Location one
$("#other_sensor_type_option_id").on("change",function () {
    anotherSensorOption = $("option:selected",this).val();
    //console.log(anotherSensorOption);
    if("Sensor Type"==anotherSensorOption){
        getSensorTpyeToAnother();
        getSensorIDByTypeToAntherSensor(3);
        getSensorDataItemByTypeToAnthorSensor("Accelerometer");
	}else if("Sensor Location"==anotherSensorOption){

        initSensorLocationData(2);
        setSensorNameFormSensorListByLocation(sectionTip[0],sensorList,2);
        var initId = getFristSensorIDByLocation(sectionTip[0],sensorList);

        var type = getTpyeFromLoctionBySensorName(initId,sensorList);

        getSensorDataItemByLocation(type,2);

	}
});
//Sensor Type one
$("#sensor_type_or_location_type_id").on("change",function () {
    anotherSensorType = $("option:selected",this).val();
    if("Sensor Type"==anotherSensorOption){
        var typeInt;
        var typeStr;
        //console.log('test:'+anotherSensorType);
        switch (parseInt(anotherSensorType)){
            case 0:
                typeInt = 3;
                typeStr = "Accelerometer";
                break;
            case 1:
                typeInt = 1;
                typeStr = "Anemometer";
                //console.log('typeInt:'+typeInt);
                //console.log('typeStr:'+typeStr);
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
                //console.log('def typeInt:'+typeInt);
                //console.log('def typeStr:'+typeStr);
                break;
        }

        getSensorIDByTypeToAntherSensor(typeInt);
        getSensorDataItemByTypeToAnthorSensor(typeStr);
	}else if("Sensor Location"==anotherSensorOption){

        //console.log(anotherSensorType);
        setSensorNameFormSensorListByLocation(anotherSensorType,sensorList,2);
        //init  frist sensorName and  commponent
        var initId = getFristSensorIDByLocation(anotherSensorType,sensorList);
        var type = getTpyeFromLoctionBySensorName(initId,sensorList);
        getSensorDataItemByLocation(type,2);
	}

});

//Sensor Name one
$("#sensor_name_type_id").on("change",function () {
    anotherSensorName = $("option:selected",this).val();
    //console.log(anotherSensorName);
    if("Sensor Type"==anotherSensorOption){

    }else if("Sensor Location"==anotherSensorOption){
        setSensorComponentFormSensorListBySensorName(anotherSensorName,sensorList,2);
	}
});

//Components one
$("#other_sensor_component_type_id").on("change",function () {
    anotherSensorComponent = $("option:selected",this).val();
    //console.log(anotherSensorComponent);
});


//Contents one
$("#content_location_id").on("change",function () {
    anotherSensorContent = $("option:selected",this).val();
    //console.log(anotherSensorContent);
});
//Plot Option/Location one
$("#Plot_Option_type_id").on("change",function () {
    anotherSensorPlotOption = $("option:selected",this).val();
    //console.log("type:"+anotherSensorPlotOption);
});

//Current figure one
$("#other_sensor_current_figure_type_id").on("change",function () {
    anotherSensorCurrentFigure = $("option:selected",this).val();
    //console.log(anotherSensorCurrentFigure);
});

// time tpye two
$("#time_type_location_id").on("change",function () {
    typeTime = $("option:selected",this).val();
    //console.log(typeTime);
});

//Ploat Option/Location two
$("#Ploat_Option_location_id").on("change",function () {
        plotOption = $("option:selected",this).val();
    //console.log(plotOption);
});
//current_figures_type_id two
$("#current_figures_location_id").on("change",function () {
    currentFigure = $("option:selected",this).val();
    //console.log(currentFigure);
});

// Another Sensor  two
//Sensor Type/Location two
$("#other_sensor_location_option_id").on("change",function () {
    anotherSensorOption = $("option:selected",this).val();
    //console.log(anotherSensorOption);
    if("Sensor Type"==anotherSensorOption){
        getSensorTpye(2);
        getSensorIDByType(3,2);
        getSensorDataItemByType("Accelerometer",2);
    }else if("Sensor Location"==anotherSensorOption){

        initSensorLocationData(1);
        setSensorNameFormSensorListByLocation(sectionTip[0],sensorList,1);
        var initId = getFristSensorIDByLocation(sectionTip[0],sensorList);

        var type = getTpyeFromLoctionBySensorName(initId,sensorList);

        getSensorDataItemByLocation(type,1);

    }
});
//Sensor Type two
$("#sensor_type_or_location_location_id").on("change",function () {
    anotherSensorType = $("option:selected",this).val();
    if("Sensor Type"==anotherSensorOption){
        var typeInt;
        var typeStr;
        //console.log('test:'+anotherSensorType);
        switch (parseInt(anotherSensorType)){
            case 0:
                typeInt = 3;
                typeStr = "Accelerometer";
                break;
            case 1:
                typeInt = 1;
                typeStr = "Anemometer";
                //console.log('typeInt:'+typeInt);
                //console.log('typeStr:'+typeStr);
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
                //console.log('def typeInt:'+typeInt);
                //console.log('def typeStr:'+typeStr);
                break;
        }

        getSensorIDByType(typeInt,2);
        getSensorDataItemByType(typeStr,2);
    }else if("Sensor Location"==anotherSensorOption){

        //console.log(anotherSensorType);
        setSensorNameFormSensorListByLocation(anotherSensorType,sensorList,1);
        //init  frist sensorName and  commponent
        var initId = getFristSensorIDByLocation(anotherSensorType,sensorList);
        var type = getTpyeFromLoctionBySensorName(initId,sensorList);
        getSensorDataItemByLocation(type,1);
    }

});

//Sensor Name two
$("#sensor_name_location_id").on("change",function () {
    anotherSensorName = $("option:selected",this).val();
    //console.log(anotherSensorName);
    if("Sensor Type"==anotherSensorOption){

    }else if("Sensor Location"==anotherSensorOption){
        setSensorComponentFormSensorListBySensorName(anotherSensorName,sensorList,1);
    }
});

//Components two
$("#other_sensor_component_location_id").on("change",function () {
    anotherSensorComponent = $("option:selected",this).val();
    //console.log(anotherSensorComponent);
});


//Contents two
$("#other_sensor_contents_id").on("change",function () {
    anotherSensorContent = $("option:selected",this).val();
    //console.log(anotherSensorContent);
});
//Plot Option/Location two
$("#Plot_Option_location_id").on("change",function () {
    anotherSensorPlotOption = $("option:selected",this).val();
    //console.log("loc:"+anotherSensorPlotOption);
});

//Current figure two
$("#other_sensor_current_figure_location_id").on("change",function () {
    anotherSensorCurrentFigure = $("option:selected",this).val();
    //console.log(anotherSensorCurrentFigure);
});
function initSensorLocationData(selectIndex) {
	var strLocation = null;
	switch (selectIndex){
		case 0:
            $("#location_sensor_id").empty();
			break;
        case 1:
            $("#sensor_type_or_location_location_id").empty();

            break;
        case 2:
            $("#sensor_type_or_location_type_id").empty();

            break;
		default:
			break;
	}
    var json = {
        "bridgeName": "Forth Road Bridge"
    };
	var tip = [];
	var tipMap = new Array();
    //console.log(json);

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
            //console.log("initSensorLocationData:");
            //console.log(data);
            sensorList = data["listSensor"];
            //console.log(sensorList);
            $.each(data,function (i,values) {
                $.each(values,function (key,value) {
                    tip[key] = value.sectionTip;
                })

            })
            sectionTip = unique(tip);
			//console.log(sectionTip);
			$.each(sectionTip,function (i,value) {
                strLocation+="<option>"+value+"</option>";
            })

            if(strLocation!=null){
                // //console.log(strData);

                switch (selectIndex){
                    case 0:
                        $("#location_sensor_id").html(strLocation);
                        break;
                    case 1:

                        $("#sensor_type_or_location_location_id").html(strLocation);
                        break;
                    case 2:
                        $("#sensor_type_or_location_type_id").html(strLocation);
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

function setSensorNameFormSensorListByLocation(location,lists,selectIndex) {
	var sensorNames = [];
    var strId="";
    switch (selectIndex){
        case 0:
            $("#location_sensor_name_id").empty();
            break;
        case 1:
            $("#sensor_name_location_id").empty();
            break;
        case 2:
            $("#sensor_name_type_id").empty();
            break;
        default:
            break;
    }

	$.each(lists,function (key,values) {
		if(location==values.sectionTip){
            sensorNames.push(values.sensorID);

            strId+="<option>"+values.sensorID+"</option>";

		}
    })
    if(strId!=null){
        // //console.log(strId);

        switch (selectIndex){
            case 0:
                $("#location_sensor_name_id").html(strId);
                break;
            case 1:
                $("#sensor_name_location_id").html(strId);
                break;
            case 2:
                $("#sensor_name_type_id").html(strId);
                break;
            default:
                break;
        }

    }
return sensorNames;
}

function setSensorComponentFormSensorListBySensorName(sensorName,lists,selectIndex) {
    var sensorComponent = [];
    var type = null;
    var typeStr = null;
    $.each(lists,function (key,values) {
        if(sensorName==values.sensorID){
            type = values.sensorType;
            return false;
        }
    })

    switch (parseInt(type)){
        case 0:
            typeStr = "Accelerometer";
            break;
        case 1:
            typeStr = "Anemometer";
            //console.log('typeStr:'+typeStr);
            break;
        case 2:
            typeStr = "MetStation";
            break;
        case 3:
            typeStr = "GNSS";
            break;
        default:
            //console.log('def typeStr:'+typeStr);
            break;
    }
    getSensorDataItemByLocation(typeStr,selectIndex);
}
function getFristSensorIDByLocation(local,lists){

    var sensorId = null;
    $.each(lists,function (key,values) {
        if(local==values.sectionTip){
            sensorId = values.sensorID;
            return false;
        }
    })
	return sensorId;

}
function getTpyeFromLoctionBySensorName(name,lists) {

    var type = null;
    var typeStr = null;
    $.each(lists,function (key,values) {
        if(name==values.sensorID){
            type = values.sensorType;
            return false;
        }
    })

    switch (parseInt(type)){
        case 0:
            typeStr = "Accelerometer";
            break;
        case 1:
            typeStr = "Anemometer";
            //console.log('typeStr:'+typeStr);
            break;
        case 2:
            typeStr = "MetStation";
            break;
        case 3:
            typeStr = "GNSS";
            break;
        default:
            //console.log('def typeStr:'+typeStr);
            break;
    }
	return typeStr;
}
function getSensorTpye(selectIndex){
    //传感器类型

    var str="";
    var token = window.localStorage.getItem("Geo_Token");
    var json = {
        "bridgeName": "Forth Road Bridge"
    };

    switch (selectIndex){
        case 0:
            $("#type_sensor_id").empty();
            break;
        case 1:
            $("#sensor_type_or_location_type_id").empty();
            break;
        case 2:
            $("#sensor_type_or_location_location_id").empty();
            break;
        default:
            break;
    }

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
            // //console.log(data);
            for (var i = 0;i< data["listSenTypes"].length;i++) {
                str+="<option value='"+i+"'>"+data["listSenTypes"][i]+"</option>";
            }
            if(str!=null){
                // //console.log(str);

                switch (selectIndex){
                    case 0:
                        $("#type_sensor_id").html(str);
                        break;
                    case 1:
                        $("#sensor_type_or_location_type_id").html(str);
                        break;
                    case 2:
                        $("#sensor_type_or_location_location_id").html(str);
                        break;
                    default:
                        break;
                }

            }

        },
        error: function(request) {
            // alert("请求失败");
            //			//console.log(request);
        }
    });
}

function getSensorTpyeToAnother(){
    //传感器类型

    var str="";
    var token = window.localStorage.getItem("Geo_Token");
    $("#sensor_type_or_location_type_id").empty();
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
            // //console.log(data);
            for (var i = 0;i< data["listSenTypes"].length;i++) {
                str+="<option value='"+i+"'>"+data["listSenTypes"][i]+"</option>";
            }
            if(str!=null){
                // //console.log(str);
                $("#sensor_type_or_location_type_id").html(str);
            }

        },
        error: function(request) {
            // alert("请求失败");
            //			//console.log(request);
        }
    });
}

function getSensorIDByType(type,selectIndex){
    var strId="";
    var json = {
        "bridgeName": "Forth Road Bridge",
        "senType": type
    };

    switch (selectIndex){
        case 0:
            $("#sensor_name_id").empty();
            break;
        case 1:
            $("#sensor_name_type_id").empty();
            break;
        case 2:
            $("#sensor_name_location_id").empty();
            break;
        default:
            break;
    }
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
                $.each( data["listSensor"], function(m, lists) {
                    //console.log("test:"+lists);
                    //console.log(lists.sensorID);
                    strId+="<option>"+lists.sensorID+"</option>";
                });
                //console.log("test:" +strId);
                if(strId!=null){
                    switch (selectIndex){
                        case 0:
                            $("#sensor_name_id").html(strId);
                            break;
                        case 1:
                            $("#sensor_name_type_id").html(strId);
                            break;
                        case 2:
                            $("#sensor_name_location_id").html(strId);
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

function getSensorIDByTypeToAntherSensor(type){
    var strId="";
    $("#sensor_name_type_id").empty();
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
                $.each(data["listSensor"], function(m, lists) {
                    // //console.log(lists.sensorID);
                    strId+="<option>"+lists.sensorID+"</option>";
                });
                if(strId!=null){
                    // //console.log(strId);
                    $("#sensor_name_type_id").html(strId);

                }
        },
        error: function(request) {
            // alert("请求失败");
        }
    });
}

function getSensorDataItemByType(type,selectIndex) {
    var strData="";
    var json = {
        "bridgeName": "Forth Road Bridge",
        "sensorType": type
    };
    switch (selectIndex){
        case 0:
            $("#type_components").empty();
            break;
        case 1:
            $("#other_sensor_component_type_id").empty();
            break;
        case 2:
            $("#other_sensor_component_location_id").empty();
            break;
        default:
            break;
    }
    //console.log(json);
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
            // //console.log(data);
            for (var i=0;i<data["listDirections"].length;i++){
                strData+="<option value='"+i+"'>"+data["listDirections"][i]+"</option>";
            }

            if(strData!=null){
                // //console.log(strData);
                switch (selectIndex){
                    case 0:
                        $("#type_components").html(strData);
                        break;
                    case 1:
                        $("#other_sensor_component_type_id").html(strData);
                        break;
                    case 2:
                        $("#other_sensor_component_location_id").html(strData);
                        break;
                    default:
                        break;
                }
            }
        },
        error: function(request) {
            // alert("request failed");
            //			//console.log(request);
        }
    });
}

function getSensorDataItemByTypeToAnthorSensor(type) {
    var strData="";
    $("#sensor_name_type_id").empty();
    var json = {
        "bridgeName": "Forth Road Bridge",
        "sensorType": type
    };
    //console.log(json);
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
            // //console.log(data);
            for (var i=0;i<data["listDirections"].length;i++){
                strData+="<option value='"+i+"'>"+data["listDirections"][i]+"</option>";
            }

            if(strData!=null){
                // //console.log(strData);
                $("#other_sensor_component_type_id").html(strData);
            }
        },
        error: function(request) {
            // alert("请求失败");
            //			//console.log(request);
        }
    });
}

function getSensorDataItemByLocation(type,selectIndex) {
    var strData="";
    var json = {
        "bridgeName": "Forth Road Bridge",
        "sensorType": type
    };

    switch (selectIndex){
        case 0:
            $("#location_components").empty();
            break;
        case 1:
            $("#other_sensor_component_location_id").empty();
            break;
        case 2:
            $("#other_sensor_component_type_id").empty();
            break;
        default:
            break;
    }
    //console.log(json);
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
            // //console.log(data);
            for (var i=0;i<data["listDirections"].length;i++){
                strData+="<option value='"+i+"'>"+data["listDirections"][i]+"</option>";
            }

            if(strData!=null){
                // //console.log(strData);

                switch (selectIndex){
                    case 0:
                        $("#location_components").html(strData);
                        break;
                    case 1:
                        $("#other_sensor_component_location_id").html(strData);
                        break;
                    case 2:
                        $("#other_sensor_component_type_id").html(strData);
                        break;
                    default:
                        break;
                }
            }
        },
        error: function(request) {
            // alert("请求失败");
            //			//console.log(request);
        }
    });
}

function unique(arr){
    var res = [];
    for(var i=0; i<arr.length; i++){
        if(res.indexOf(arr[i]) == -1){
            res.push(arr[i]);
        }
    }
    return res;
}
})
