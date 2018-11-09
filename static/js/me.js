// me .html

$(function () {
	var token = window.localStorage.getItem("Geo_Token");
	var nav = document.getElementById("nav_list");
	var navlist = nav.children;
	var con = document.getElementById("content");
	var conlist = con.children;
	for (var i = 0; i < navlist.length; i++) {
		navlist[i].index = i;
		navlist[i].onclick = function () {
			for (var m = 0; m < conlist.length; m++) {
				// navlist[m].className = "";
				conlist[m].style.display = "none";
			}
			conlist[this.index].style.display = "block";
		}
	}
	var token = window.localStorage.getItem("Geo_Token");
	//全局用户信息
	var data = window.localStorage.getItem("result");
	var dataObj = JSON.parse(data);
	console.log(dataObj);
	if (dataObj != null) {

		var my_name = "<p>Hello," + dataObj.user.name + "</p>";
		$('.me_name').append(my_name);
		if ((dataObj.user.role == 0)) {
			$("#reviewid").css("display", "block");
			$("#deleteid").css("display", "block");
		} else {
			$("#reviewid").css("display", "none");
			$("#deleteid").css("display", "none");
		}
	} else {
        alert("Login author is out of date, please login again");
        window.location.href = "index.html";
	}
	var org = dataObj.user.organization;
	var form_list =
		"<span>USER NAME</span><input type='text' disabled='disabled' id='uname' value=" + dataObj.user.name + ">" +
		"<span>ORGANIZATION</span><input type='text' disabled='disabled' id='add' value=" + org.toString() + ">" +
		"<span>E-MAIL</span><input type='text' disabled='disabled' id='email' value=" + dataObj.user.userID + ">" +
		"<span>TELEPHONE</span><input type='text' disabled='disabled' id='phone' value=" + dataObj.user.contactphone + ">";
	$('.form').append(form_list);
	$("#add").attr("value", org);
	// 获取用户ID
	var Uid =
		"<label class='col-xs-3 control-label'>UserID :</label>" +
		"<div class='col-xs-8'>" +
		"<input type='text' name='UserID' disabled='disabled' class='form-control input-sm' id='UserID' value=" + dataObj.user.userID + ">" +
		"</div>"
	$('#userID').append(Uid);
	/**
	 * 更新用户信息
	 * 用户信息表单验证
	 * */
	$('#info_form').bootstrapValidator({
		message: 'This value is not valid',
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},

		fields: {
			name: {
				validators: {
					notEmpty: {
						message: 'Information cannot be empty'
					}
				}
			},
			phone: {
				validators: {
					notEmpty: {
						message: 'Information cannot be empty'
					}
				}
			}
		}
	})

	$("#sub_btn").click(function () {
        var bootstrapValidator = $("#info_form").data('bootstrapValidator');
        bootstrapValidator.validate();
        if (!bootstrapValidator.isValid()) {
            console.log("bootstrapValidator.isValid");
            alert("Please finish your input!");
            return;
        }
		var token = window.localStorage.getItem("Geo_Token");
		var bridgeName = "Forth Road Bridge";
		var userID = dataObj.user.userID;
		var name = $("#Name").val();
		var contactnumber = $("#Contactnumber").val();

		var json = {
			"bridgeName": bridgeName,
			"userID": userID,
			"name": name,
			"contactnumber": contactnumber,
		};
		console.log(json);
		$.ajax({
			type: "POST",
			url: "http://128.243.138.25:1212/apix/Login/UpdateUserInfo",
			data: JSON.stringify(json),
			contentType: "application/json",
			async: false,
			beforeSend: function (XHR) {
				//发送ajax请求之前向http的head里面加入验证信息
				XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
			},
			success: function (result) {
				if ((name == "") || (contactnumber == "")) {
					return;
				} else {

                    var data = window.localStorage.getItem("result");
                    var dataObj = JSON.parse(data);
                    dataObj.user.name = name;
                    dataObj.user.contactphone = contactnumber;
                    var strData = JSON.stringify(dataObj);
                    window.localStorage.setItem("result", strData);
                    layer.msg("Information update success.");
					setTimeout(function () {
						window.location.href = "me.html";
					}, 1000);
				}
			},
			error: function (request) {
				// alert("Fail to update user information.");
				// console.log(request);
			}
		});

	});
	/**
	 * 更新用户密码
	 * 密码验证
	 * */
	$('#pwd_form').bootstrapValidator({
		message: 'This value is not valid',
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},

		fields: {
			password: {
				validators: {
					notEmpty: {
						message: 'Please fill in the password'
					},
					identical: {
						field: 'verifypassword',
						message: 'Please repeat the password'
					},
					stringLength: {
						min: 3,
						message: 'Password no less than 3 bits'
					}
				}
			},
			Confirm: {
				validators: {
					notEmpty: {
						message: 'Please fill in the verify password'
					},
					identical: {
						field: 'password',
						message: 'Inconsistent password'
					},
					stringLength: {
						min: 3,
						message: 'password no less than 3 bits'
					}
				}
			}
		}
	})

	$("#pwd_btn").click(function () {
		var bootstrapValidator = $("#pwd_form").data('bootstrapValidator');
		bootstrapValidator.validate();
		if (!bootstrapValidator.isValid()) {
			console.log("bootstrapValidator.isValid");
			alert("Please finish your input!");
			return;
		}
        var token = window.localStorage.getItem("Geo_Token");
        var bridgeName = "Forth Road Bridge";
        var userID = dataObj.user.userID;
        var pass_1 = $("#Pwd1").val();
        var encr_pass1 = hex_sha256(pass_1);
        var pass_2 = $("#Pwd2").val();
        var encr_pass2 = hex_sha256(pass_2);

        var json = {
            "bridgeName": bridgeName,
            "userID": userID,
            "oldPassword": encr_pass1,
            "newPassword": encr_pass2,
        };
        console.log(json);
        $.ajax({
            type: "POST",
            url: "http://128.243.138.25:1212/apix/Login/ChangePassword",
            data: JSON.stringify(json),
            async: false,
            contentType: "application/json",
            beforeSend: function (XHR) {
                //发送ajax请求之前向http的head里面加入验证信息
                XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
            },
            success: function (result) {
            	console.log(JSON.stringify(result));
            	// var data = JSON.stringify(result);
            	if (result.ResultInfo.ReturnMark == true){
                    layer.msg("Password update success.");
                    setTimeout(function () {
                        window.location.href = "me.html";
                    }, 1000);
				} else {
            		alert(result.ResultInfo.ReturnTip);
				}
                // if ((pass_1== "") || (pass_2== "")) {
                //     return;
                // } else {
                // }
            },
            error: function (request) {
                // alert("Fail to update password.");
                // console.log(request);
            }
        });
    })

		//隔行换色
		$("tr:odd").addClass("tr_odd");
		$("tr:even").addClass("tr_even");
		getCandidates();
		getUsers();

		function getCandidates() {
			var bridgeName = "Forth Road Bridge";
			var json = {
				"bridgeName": bridgeName,
				"userMark": 2
			};
			$.ajax({
				type: "GET",
				url: "http://128.243.138.25:1212/apix/Login/GetUserInfo",
				data: json,
				contentType: 'application/json',
				async: true,
				success: function (result) {
					var item_num = 0;

					if (result.ResultInfo.ReturnMark != false) {
						$.each(result.listData, function (i, item) {
							var currentitem = "<tr>" +
								"<td>" + item.name + "</td>" +
								"<td>" + item.userID + "</td>" +
								"<td>" + item.organization + "</td>" +
								"<td>" +
								"<button class='td_btn1' id='useryes" + item_num + "'>YES</button>" +
								"<button class='td_btn2' id='userno" + item_num + "'>NO</button>" +
								"</td>" +
								"</tr>";
                            $("#approvelist").append(currentitem);
							$("#useryes" + item_num).on("click", null, function () {
								console.log("useryes:" + item.userID);
								activeUser(item.userID, true);
								$(this).parent().parent().remove();
							});
							$("#userno" + item_num).on("click", null, function () {
								console.log("userno:" + item.userID);
								activeUser(item.userID, false);
								$(this).parent().parent().remove();
							});
							item_num++;
						});
					}

				},
				error: function (request) {
					// alert("Failed");
				}
			});

		}

		function activeUser(userID, IsApproved) {
			var bridgeName = "Forth Road Bridge"
			var json = {
				"bridgeName": bridgeName,
				"userID": userID,
				"IsApproved": IsApproved
			};
			$.ajax({
				type: "POST",
				url: "http://128.243.138.25:1212/apix/Login/Approve",
				// url: "http://128.243.138.25:1212/apix/UserInfo/UserInfo",
				//data: json,//for json格式数据
				data: JSON.stringify(json),
				contentType: 'application/json',
				async: true,
				beforeSend: function (XHR) {
					//发送ajax请求之前向http的head里面加入验证信息
					XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
				},
				success: function (result) {
					// console.log("result:"+JSON.stringify(result));
				},
				error: function (request) {
					alert("Approve failed.");
				}
			});

		}



	function getUsers() {
		var bridgeName = "Forth Road Bridge"
		var json = {
			"bridgeName": bridgeName,
			"userMark": 0
		};
		$.ajax({
            type: "GET",
            url: "http://128.243.138.25:1212/apix/Login/GetUserInfo",
            data: json,
            contentType: 'application/json',
            async: true,
            success: function (result) {
                var item_num = 0;
                $.each(result.listData, function (i, item) {
                    var currentitem = "<tr>" +
                        "<td>" + item.name + "</td>" +
                        "<td>" + item.userID + "</td>" +
                        "<td>" + item.organization + "</td>" +
                        "<td>" +
                        "<button class='td_btn1' id='userdelete" + item_num + "'>Delete</button>" +
                        "</td>" +
                        "</tr>";

                    $("#userlist").append(currentitem);
                    $("#userdelete" + item_num).on("click", null, function () {
                        console.log("userdelete:" + item.userID);
                        var confirm = 0;
                        var ele2rm = $(this).parent().parent();

                        // deleteUser(item.userID);
                        layer.confirm('Confirm To Delete?', {
                            title: '',
                            btn: ['Yes', 'No'] //按钮
                        }, function (index) {
                            deleteUser(item.userID);
                            ele2rm.remove();
                            layer.close(index);
                            // window.location.href="index.html";
                        }, function () {
                        });
                    });
                    item_num++;
                });

            }
        });
	}

		function deleteUser(userID) {
			var bridgeName = "Forth Road Bridge"
			var json = {
				"bridgeName": bridgeName,
				"userID": userID,
			};
			$.ajax({
				type: "POST",
				url: "http://128.243.138.25:1212/apix/Login/DeleteUser",
				//data: json,//for json格式数据
				data: JSON.stringify(json),
				contentType: 'application/json',
				async: true,
				beforeSend: function (XHR) {
					//发送ajax请求之前向http的head里面加入验证信息
					XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
				},
				success: function (result) {
					// console.log("result:"+JSON.stringify(result));
				},
				error: function (request) {
					alert("Failed");
				}
			});

		}

		$("#logoutid").click(function () {
			layer.confirm('Confirm To Logout?', {
				title: '',
				btn: ['Yes', 'No'] //按钮
			}, function () {
				window.location.href = "index.html";
			}, function () { });
		});

	})
