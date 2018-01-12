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

        var Reg = new RegExp(/^.{4,16}$/);
        if (login.password == "") {
            $("#errorMm").html("密码不能为空！");
            return;
        } else if (!Reg.test(login.password)) {
            $("#errorMm").html("密码长度在4-16位之间！");
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

            var url = "/checkLogin";
            $.ajax({
                url: url,
                data: {
                    "username": login.username,
                    "password": login.password,
                    "yzcode": login.yzcode
                },
                type: "post",
                acync:false,
                dataType: "json",
                beforeSend: function () {
                    login.transBtnStyle("0");
                },
                success: function (data) {
                    if (data.error != undefined && data.error != "") {
                        login.transBtnStyle("1");
                        alert(data.error);
                        login.change();
                    } else if (data.success == "1") {
                        location.href = "/pages/main/main.html";
                    }
                },
                error: function (error) {
                    login.transBtnStyle("1");
                    alert("登录出错");
                    login.change();
                }
            });

        }
    },
    transBtnStyle:function (ofType) {
        debugger;
      if("0" === ofType){
          $("#btn_Login").attr("onclick","");
          $("#btn_Login").css("background","#888888");
          $("#btn_Login")[0].innerHTML="正在登录中,请稍后...";
      }else{
          $("#btn_Login").attr("onclick","login.checkLogin()");
          $("#btn_Login").css("background","#2e558e");
          $("#btn_Login")[0].innerHTML="登录";
      }
    },
    change: function () {
        $("#yzImg").attr("src", "/codeGenerater?codeInfo=" + Math.random());
    }
}
$(document).ready(function () {

});
