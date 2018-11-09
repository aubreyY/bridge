/** home html*/

// The video
var Obox = document.getElementById("box");

var vid = document.getElementsByName("video");

var vid = document.getElementsByTagName("video")[0];

vid.addEventListener("ended", function() {
	vid.style.display = "none";
	Obox.style.display = "block";
})
//全局用户信息
$(function() {
	var data = window.localStorage.getItem("result");
	var dataObj = JSON.parse(data);
	console.log(dataObj);
	var my_name = "<p>Hello,"+dataObj.user.name+"</p>";
	$('.me_name').append(my_name);
})