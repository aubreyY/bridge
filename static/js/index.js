//index js

//login
$(function() {
    /**注册提示信息
     * */
    $('#form_test').bootstrapValidator({
            message: 'This value is not valid',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },

            fields: {
                email: {
                    validators: {
                        notEmpty: {
                            message: 'Please fill in a valid email'
                        },
                        emailAddress: {
                            message: 'The email address format is wrong'
                        }
                    }
                },
                password: {
                    validators: {
                        notEmpty: {
                            message: 'Please fill in the password'
                        },
                        stringLength: {
                            min: 3,
                            message: 'Password no less than 3 bits'
                        }
                    }
                }
            }
        })
        //登录测试
    $("#sub1").click(function() {

        var bootstrapValidator = $("#form_test").data('bootstrapValidator');
        bootstrapValidator.validate();
        if (!bootstrapValidator.isValid()) {
            console.log("bootstrapValidator in click");
            layer.msg("Please finish your input,thanks.");
            return;
        }

        $("#sub1").val("Loading");
        var bridgeName = "Forth Road Bridge";
        var name = $("#email").val();
        var pass = $("#pwd").val();
        var encr_pass = hex_sha256(pass);

        var json = {
            "bridgeName": bridgeName,
            "UserName": name,
            "Password": encr_pass
        };
        $.ajax({
            type: "POST",
            url: "http://128.243.138.25:1212/apix/Login/Login",
            //data: json,//for json格式数据
            data: JSON.stringify(json),
            contentType: 'application/json',
            async: true,
            success: function(result) {
                if (result.ResultInfo.ReturnMark == true) {
                    var tokenRole = eval(result);
                    window.localStorage.setItem("Geo_Token", tokenRole.user.token);
                    var strData = JSON.stringify(result);
                    window.localStorage.setItem("result", strData);
                    window.location.href = "home.html";
                } else {
                    $("#sub1").val("LOGIN");
                    alert(result.ResultInfo.ReturnTip);
                }
            },
            error: function(request) {
                $("#sub1").val("LOGIN");
                alert("Bad Request");
            }
        });
    });

    /**
     * 忘记密码操作
     * */
    // 验证
    $('#Forgot_form').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        fields: {
            uID: {
                validators: {
                    notEmpty: {
                        message: 'The ID cannot be empty'
                    }
                }
            },
            org: {
                validators: {
                    notEmpty: {
                        message: 'The organization cannot be empty'
                    }
                }
            },
            phone: {
                validators: {
                    notEmpty: {
                        message: 'The contactNumber cannot be empty'
                    }
                }
            }
        }
    })
    $("#pwd_btn").click(function() {

        var bootstrapValidator = $("#Forgot_form").data('bootstrapValidator');
        bootstrapValidator.validate();
        if (!bootstrapValidator.isValid()) {
            console.log("bootstrapValidator in click");
            layer.msg("Please finish your input,thanks.");
            return;
        }

        var token = window.localStorage.getItem("Geo_Token");
        var bridgeName = "Forth Road Bridge";
        var userID = $("#uID").val();
        var organization = $("#Add").val();
        var contactNumber = $("#Phone").val();

        var json = {
            "bridgeName": bridgeName,
            "userID": userID,
            "organization": organization,
            "contactNumber": contactNumber
        };
        $.ajax({
            type: "GET",
            url: "http://128.243.138.25:1212/apix/Login/ForgotPassword",
            data: json,
            contentType: 'application/json',
            async: true,
            beforeSend: function(XHR) {
                //发送ajax请求之前向http的head里面加入验证信息
                XHR.setRequestHeader('Authorization', 'BasicAuth ' + token);
            },
            success: function(result) {
                if (result.ResultInfo.ReturnMark == true) {
                    alert("The password has been sent to the mailbox");
                } else {
                    alert(result.ResultInfo.ReturnTip);
                }
                console.log(result);
            },
            error: function(request) {
                alert(result.ResultInfo.ReturnTip);
            }
        });

    });
});