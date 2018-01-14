$(document).ready(function () {
    lab.init();
});
lab = {
    init: function () {
        lab.setUserName();
        lab.openWin("main");
    },
    setUserName: function () {
        $.ajax({
            url: '/isLogined',
            data: {},
            type: "get",
            dataType: "json",
            success: function (data) {
                if ("true" == data.isLogined) {
                    if ("" != data.user) {
                        $("#user_title")[0].innerHTML = data.user;
                    }
                } else {
                    alert(data.info);
                }
            },
            error: function (error) {
            }
        });
    },
    openWin:function (param) {
        $("#content")[0].innerHTML="";
        if("tg" == param){
            $("#content").load('tg-add.html');
        }
        if("main" == param){
            $("#content").load('main-content.html');
        }
        if("stu" == param){
            $("#content").load('stu-add.html',function () {
                $("#stu_commit").attr("onclick","lab.commitStuInfo()");
            });
        }
        if("m_stu" == param){
            $("#content").load('stu-manager.html',function () {
                manager.initStudent();
            });

        }
        if ("m_tg" == param){
            $("#content").load('tg-manager.html',function () {
                manager.initTg();
            });

        }
        if("pic" == param){
            $("#content").load('table-images-list.html');
        }
        if("msg" == param){
            $("#content").load('form-news.html');
        }
        if("word" == param){
            $("#content").load('form-news-list.html');
        }
        if("chart" == param){
            $("#content").load('chart.html');
        }
    },
    commitTg:function () {
        var tgTitle = $("#tg-title").val();
        var tgContent = $("#tg-intro").val();
        if(tgTitle && tgContent){
            $.ajax({
                url:'/addTg',
                data: {
                    "title":tgTitle,
                    "content":tgContent
                },
                type: "post",
                dataType: "json",
                success:function (data) {
                    if("true" == data.success){
                        alert("保存成功");
                    }else{
                        alert("保存失败");
                    }
                },
                error:function (data) {
                }
            });
        }else if (!tgTitle){
            alert("标题不能为空");
        }else if(!tgContent){
            alert("内容不能为空");
        }
    },
    commitStuInfo:function () {
        var name = $("#stu-name").val();
        var email = $("#stu-email").val();
        var phone = $("#stu-phone").val();
        var intro = $("#stu-intro").val();
        if(name && email && phone && intro) {
            $.ajax({
                url: '/addStudent',
                data: {
                    "name": name,
                    "email": email,
                    "phone":phone,
                    "intro":intro
                },
                type: "post",
                dataType: "json",
                success: function (data) {
                    if ("true" == data.success) {
                        alert("保存成功");
                    } else {
                        alert("保存失败");
                    }
                },
                error: function (data) {

                }
            });
        }
    }
};