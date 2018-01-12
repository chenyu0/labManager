var login = {
    username: null,
    password: null,
    yzcode: null,
    checkZh: function () {
        login.username = $("#username").val();
        var Reg = new RegExp(/^[a-zA-Z0-9_-]{4,20}$/);
        if (login.username == "") {
            $("#errorZh").html("账号不能为空！");
            return;
        } else if (!Reg.test(login.username)) {
            $("#errorZh").html("账号输入有误，只允许字母数字下划线，且长度在4-20位！");
            return;
        } else {
            $("#errorZh").html("");
            return true;
        }
    },
    checkMm: function () {
        login.password = $("#password").val();

        var Reg = new RegExp(/^.{8,16}$/)
        if (login.password == "") {
            $("#errorMm").html("密码不能为空！");
            return;
        } else if (!Reg.test(login.password)) {
            $("#errorMm").html("密码长度在8-16位之间！");
            return;
        } else {
            $("#errorMm").html("");
            return true;
        }
    },
    checkYzm: function () {
        login.yzcode = $("#yzcode").val();

        if (login.yzcode == "") {
            $("#errorYzm").html("验证码不能为空！");
            return;
        } else {
            $("#errorYzm").html("");
            return true;
        }
    },
    checkLogin: function () {
        if (login.checkZh() && login.checkMm() && login.checkYzm()) {

            var url = "/qhSqhdWeb/checkLogin";
            $.ajax({
                url: url,
                data: {
                    "username": login.username,
                    "password": login.password,
                    "yzcode": login.yzcode
                },
                type: "post",
                dataType: "json",
                beforeSend: function () {
                    $("#con_right").mask('正在登陆中，请稍后。。。');
                },
                success: function (data) {
                    $("#con_right").unmask();
                    if (data.error != undefined && data.error != "") {
                        alert(data.error);
                        login.change();
                    } else if (data.success == "1") {
                        location.href = "../../pages/main.html";
                    }
                },
                error: function (error) {
                    $("#con_right").unmask();
                    var error = JSON.parse(error.responseText);
                    alert(error.error);
                    login.change();
                }
            });
        }
    },
    change: function () {
        $("#yzImg").attr("src", "/codeGenerater?codeInfo=" + Math.random());
    }
}
$(document).ready(function () {

});

/*
function setCenter(){
    var windowH = $(window).height();
    var windowW = $(window).width();
    var actualH = (windowH-465)/2+"px";
    var actualW = (windowW-450)/2+"px";
    $(".content").css("top",actualH);
    $(".content").css("left",actualW);
}*/
