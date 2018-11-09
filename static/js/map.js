//map html

var image0 = null;
var image1 = null;
var image2 = null;

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

	//返回所有Image的名称和路径
	var token = window.localStorage.getItem("Geo_Token");
	var json = {
		"bridgeName": "Forth Road Bridge"
	};
	$.ajax({
		type: "GET",
		url: "http://128.243.138.25:1212/apix/EOImage/GetEOImage",
		data: json,
		async: true,
		beforeSend: function(XHR) {
			//发送ajax请求之前向http的head里面加入验证信息
			XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
		},
		success: function(data) {
			console.log(data);
			image0 = data.imageURLs[0];
			image1 = data.imageURLs[1];
			image2 = data.imageURLs[2];
			$("#imagename1").text(data.imageNames[0]);
			$("#imagename2").text(data.imageNames[1]);
			$("#imagename3").text(data.imageNames[2]);
            $("#loadgif").show();
            $(".mapimage").attr({
                src:image0,
                // complete:$("#loadgif").hide()
                // finish:console.log("complete")
            });
            $(".mapimage").load(function () {
                $("#loadgif").hide();
            });
			console.log(data.imageURLs[0]);
			console.log(data.imageURLs[1]);
			console.log(data.imageURLs[2]);
		},
		error: function(request) {
			// alert("network request failed");
		}
	});

	$("#image1").click(function() {

        $("#loadgif").show();
		$(".mapimage").attr({
			src:image0,
		});
        $(".mapimage").load(function () {
            $("#loadgif").hide();
        });
	})
	$("#image2").click(function() {
        $("#loadgif").show();
	    $(".mapimage").attr({
			src:image1,
		});
        $(".mapimage").load(function () {
            $("#loadgif").hide();
        });
	})
	$("#image3").click(function() {
        $("#loadgif").show();
        $(".mapimage").attr({
            src:image2,
        });
        $(".mapimage").load(function () {
            $("#loadgif").hide();
        });
	})
})
/**图片放大镜效果**/
// 获取元素
var move = document.getElementById('move');
var show = document.getElementById('show');
var bigImg = document.getElementById('bigImg');
var list = document.getElementById('list');
var smallImg = document.getElementById('smallImg');

// 鼠标移入时元素显示
show.onmouseover = function() {
	move.style.display = 'block';
	bigShow.style.display = 'block';
}

// 鼠标移出元素隐藏
show.onmouseout = function() {
	move.style.display = 'none';
	bigShow.style.display = 'none';
}

// 设置show的鼠标移动事件
show.onmousemove = function(e) {

	// 计算move元素的left和top的值
	var newLeft = e.pageX - show.offsetLeft - move.offsetWidth / 2;
	var newTop = e.pageY - show.offsetTop - move.offsetHeight / 2;

	// 判定移动的最大值
	if(newLeft >= (show.offsetWidth - move.offsetWidth - 1)) {
		newLeft = show.offsetWidth - move.offsetWidth - 1;
	}
	if(newLeft <= 0) {
		newLeft = 0
	}

	if(newTop >= (show.offsetHeight - move.offsetHeight - 1)) {
		newTop = show.offsetHeight - move.offsetHeight - 1;
	}
	if(newTop <= 0) {
		newTop = 0;
	}

	// 赋值
	move.style.left = newLeft + 'px';
	move.style.top = newTop + 'px';
	var newBigLeft = bigImg.offsetWidth * newLeft / show.offsetWidth;
	var newBigTop = bigImg.offsetHeight * newTop / show.offsetHeight;

	// 赋值
	bigImg.style.left = -newBigLeft + 'px';
	bigImg.style.top = -newBigTop + 'px';
}
