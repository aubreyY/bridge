/** regisiter html*/

$(function() {
    // Swiper slider
    window.onload = function() {
            createCode();
            var mySwiper = new Swiper('.swiper-container', {
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                on: {
                    slideChange: function() {
                        if (this.isEnd) {
                            this.navigation.$nextEl.css('display', 'none');
                        } else {
                            this.navigation.$nextEl.css('display', 'block');
                        }
                    },
                },
            })
        }
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
            firstName: {
                validators: {
                    notEmpty: {
                        message: 'The first name is required and cannot be empty'
                    }
                }
            },
            lastName: {
                validators: {
                    notEmpty: {
                        message: 'The last name is required and cannot be empty'
                    }
                }
            },
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
            organisation: {
                validators: {
                    notEmpty: {
                        message: 'Please fill in a valid organization name'
                    }
                }
            },

            phone: {
                validators: {
                    notEmpty: {
                        message: 'Please fill in your mobile phone number'
                    },
                    stringLength: {
                        min: 11,
                        max: 11,
                        message: 'Invalid cell phone number'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'Please fill in the password'
                    },
                    identical: {
                        field: 'verifypassword',
                        message: 'Please repeat the password'
                    },
                    different: {
                        field: 'username',
                        message: 'The password cannot be the same as username'
                    },
                    stringLength: {
                        min: 3,
                        message: 'Password no less than 3 bits'
                    }
                }
            },
            verifypassword: {
                validators: {
                    notEmpty: {
                        message: 'Please fill in the verify password'
                    },
                    identical: {
                        field: 'password',
                        message: 'Inconsistent password'
                    },
                    different: {
                        field: 'username',
                        message: 'The verify password cannot be the same as username'
                    },
                    stringLength: {
                        min: 3,
                        message: 'password no less than 3 bits'
                    }
                }
            },
            VerificationCode: {
                validators: {
                    notEmpty: {
                        message: 'Please fill in the verification code'
                    },
                    stringLength: {
                        min: 4,
                        message: 'Verification code error'
                    }
                }
            }
        }
    })

    /*
     * 当点击了确定下单的按钮后调用此方法
     * 然后执行表单校验
     * */
    function onsubmitFn() {
        //表单提交前再进行一次验证
        var bootstrapValidator = $("#sub").data('bootstrapValidator');
        bootstrapValidator.validate();
        if (bootstrapValidator.isValid()) {
            console.log("bootstrapValidator.isValid");
            $("#form_test").submit();
        } else return;
    }
    /**
     * 图形验证码
     * */
    var code; /*定义一个验证码的全局变量*/
    function createCode() { /* 生成验证码的函数 */
        code = "";
        var codeLength = 4;
        var checkCode = document.getElementById("checkNode");
        checkCode.value = "";
        var selectChar = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
        for (var i = 0; i < codeLength; i++) {
            var charIndex = Math.floor(Math.random() * 61);
            code += selectChar[charIndex];
        }
        if (code.length != codeLength) {
            createCode();
        }
        checkCode.value = code;
    }
    // next img
    $(".next").bind('click', function() {
        createCode();
    })
    $(".sub_code").bind('click', function validate() {

            var inputCode = document.getElementById("VerificationCode").value.toUpperCase();
            var codeToUp = code.toUpperCase();
            if (inputCode != codeToUp) {
                alert("Validation code input error");
                createCode();
                return false;
            } else {
                alert("The input is correct, and the input verification code is:" + inputCode);
                return true;
            }
        })
        //	注册请求
    $("#sub").click(function() {
        $("#loadgif").show();
        var bootstrapValidator = $("#form_test").data('bootstrapValidator');
        bootstrapValidator.validate();
        if (!bootstrapValidator.isValid()) {
            console.log("bootstrapValidator in click");
            layer.msg("Please fix or finish your invalid input,thanks.");
            return;
        }
        $("#sub").val("Loading");
        var bridgename = "Forth Road Bridge";
        //		var userID = $("#firstName").val();
        //		var GUIDCode = $("#lastName").val();
        var firstName = $("#firstName").val();
        var lastName = $("#lastName").val();
        var email = $("#email").val();
        var organisation = $("#organisation").val();
        var phone = $("#phone").val();
        var password = $("#password").val();
        var encr_pass = hex_sha256(password);
        var role = 2;
        console.log("firstName:" + firstName);
        if ($("#test1").prop("checked")) {
            role = 3;
        } else if ($("#test2").prop("checked")) {
            role = 2;
        } else if ($("#test3").prop("checked")) {
            role = 1;
        }
        console.log("role:" + role);
        if ((firstName == "") || (lastName == "") || (email == "") || (organisation == "") || (phone == "") || (password == "") || (encr_pass == "")) {
            alert("Please finish your blank parts");
            return;
        }

        var json = {
            "bridgename": bridgename,
            "name": lastName,
            "email": email,
            "organization": organisation,
            "contactphone": phone,
            "password": encr_pass,
            "userMark": role
        };
        console.log(json);
        $.ajax({
            type: "POST",
            url: "http://128.243.138.25:1212/apix/Login/RegNewUser",
            async: true,
            data: JSON.stringify(json), //for json格式数据
            contentType: 'application/json',
            error: function(request) {
                $("#sub").val("SUBMIT");
                $("#loadgif").hide();
                alert("Registration failed");
            },
            success: function(result) {

                if (result.ResultInfo.ReturnMark == true) {
                    var tokenRole = eval(result);
                    window.localStorage.setItem("Geo_Token", tokenRole.token);
                    window.localStorage.setItem("Geo_User", tokenRole.userName);
                    window.localStorage.setItem("Geo_Role", tokenRole.role);
                    var token = window.localStorage.getItem("Geo_Token");
                    console.log(result);
                    window.location.href = "exit.html";
                } else {
                    alert(result.ResultInfo.ReturnTip);
                    $("#sub").val("SUBMIT");
                }
                $("#loadgif").hide();
            }

        });

    });

});