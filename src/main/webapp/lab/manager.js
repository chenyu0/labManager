manager = {
    initStudent: function () {
        ("#stu_list")[0].innerHTML = "";
        $.ajax({
            url: '/getAllStudent',
            data: {},
            type: "get",
            dataType: "json",
            mask: "正在加载...",
            success: function (data) {
                if ("true" == data.success) {
                    var students = data.students;
                    var htmlStr = manager.draw2Html(students);
                    $("#stu_list").append(htmlStr);
                }
            },
            error: function (error) {
            }
        });
    },
    initTg: function () {
        $.ajax({
            url: '/getAllTg',
            data: {},
            type: "get",
            dataType: "json",
            mask: "正在加载...",
            success: function (data) {
                $("#tg_list")[0].innerHTML = "";
                if ("true" == data.success) {
                    var tgs = data.tgs;
                    var htmlStr = manager.drawTg2Html(tgs);
                    $("#tg_list").append(htmlStr);
                }
            },
            error: function (error) {
            }
        });
    },
    draw2Html: function (data) {
        var htmlStr = "";
        for (var i = 0; i < data.length; i++) {
            htmlStr += "<tr style='text-align: center;'>" +
                "          <td>" + data[i].stu_name + "</td>" +
                "          <td>" + data[i].phone + "</td>" +
                "          <td class=\"am-hide-sm-only\">" + data[i].stu_email + "</td>" +
                "          <td class=\"am-hide-sm-only\">" + data[i].stu_desc + "</td>" +
                "          <td><div class=\"am-btn-toolbar\">" +
                "                   <div class=\"am-btn-group am-btn-group-xs\">" +
                "                        <button onclick='manager.selectStudentById(\"" + data[i].stu_id + "\")' class=\"am-btn am-btn-default am-btn-xs am-text-secondary\"><span" +
                "                                class=\"am-icon-pencil-square-o\"></span> 编辑" +
                "                        </button>" +
                "                         <button onclick=\"manager.deleteStu(\'" + data[i].stu_id + "\')\" class=\"am-btn am-btn-default am-btn-xs am-text-danger am-hide-sm-only\">" +
                "                                 <span class=\"am-icon-trash-o\"></span> 删除" +
                "                         </button>" +
                "                   </div>\n" +
                "              </div>\n" +
                "          </td>\n" +
                "      </tr>";
        }
        return htmlStr;
    },
    drawTg2Html: function (data) {
        var htmlStr = "";
        for (var i = 0; i < data.length; i++) {
            var date = new Date(data[i].tg_date);
            var dateStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            htmlStr += "<tr style='text-align: center;'>" +
                "          <td>" + data[i].tg_name + "</td>" +
                "          <td>" + dateStr + "</td>" +
                "          <td class=\"am-hide-sm-only\">" + data[i].tg_content + "</td>" +
                "          <td><div class=\"am-btn-toolbar\">" +
                "                   <div class=\"am-btn-group am-btn-group-xs\">" +
                "                        <button onclick='manager.selectTgById(\"" + data[i].tg_id + "\")' class=\"am-btn am-btn-default am-btn-xs am-text-secondary\"><span" +
                "                                class=\"am-icon-pencil-square-o\"></span> 编辑" +
                "                        </button>" +
                "                         <button onclick=\"manager.deleteTg(\'" + data[i].tg_id + "\')\" class=\"am-btn am-btn-default am-btn-xs am-text-danger am-hide-sm-only\">" +
                "                                 <span class=\"am-icon-trash-o\"></span> 删除" +
                "                         </button>" +
                "                   </div>" +
                "              </div>" +
                "          </td>" +
                "      </tr>";
        }
        return htmlStr;
    },
    updateStu: function (id) {
        $.ajax({
            url: '/updateStudent',
            data: {
                "id": id
            },
            type: "post",
            dataType: "json",
            success: function (data) {
                if ("true" == data.success) {
                    alert("更新成功", function () {
                        lab.openWin("m_stu");
                    });
                } else {
                    alert("更新失败");
                }
            },
            error: function (error) {
            }
        });
    },
    selectStudentById: function (id) {
        $.ajax({
            url: '/selectSingleStudent',
            data: {
                "id": id
            },
            async: false,
            type: "post",
            dataType: "json",
            success: function (data) {
                if ("true" == data.success) {
                    lab.openWin("stu");
                    $("#stu-email").val(data.name);
                    $("#stu-email").val(data.email);
                    $("#stu-phone").val(data.phone);
                    $("#stu-intro").val(data.desc);
                    $("#stu_commit").attr("onclick", "manager.updateStu(" + id + ")");
                } else {
                }
            },
            error: function (error) {
            }
        });
    },
    deleteStu: function (id) {
        if (confirm("确认删除吗？")) {
            $.ajax({
                url: '/deleteStudent',
                data: {
                    "id": id
                },
                type: "post",
                dataType: "json",
                async: false,
                mask: "正在删除...",
                success: function (data) {
                    if ("true" == data.success) {
                        alert("删除成功");
                        lab.openWin("m_stu");
                    } else {
                        alert("删除失败");
                    }
                },
                error: function (error) {
                }
            });
        }
    },
    selectTgById: function (id) {

    },
    deleteTg: function (id) {
        if (confirm("确认删除吗？")) {
            $.ajax({
                url: '/deleteTg',
                data: {
                    "id": id
                },
                type: "post",
                dataType: "json",
                async: false,
                mask: "正在删除...",
                success: function (data) {
                    if ("true" == data.success) {
                        alert("删除成功");
                        lab.openWin("m_tg");
                    } else {
                        alert("删除失败");
                    }
                },
                error: function (error) {
                }
            });
        }
    }
};