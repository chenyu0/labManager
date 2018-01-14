package cn.com.lab.controller;

import cn.com.lab.model.Student;
import cn.com.lab.service.IStudentService;
import cn.com.lab.service.ITgService;
import cn.com.lab.utils.common.JsonUtils;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.log4j.Logger;
import org.springframework.context.annotation.Scope;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.json.JsonArray;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * 学生信息的控制类
 */
@RestController
@Scope("prototype")
public class StudentController {
    private Logger logger = org.apache.log4j.Logger.getLogger(UserController.class);
    @Resource
    private IStudentService service;

    @RequestMapping(value = "/addStudent", method = RequestMethod.POST)
    public void addStudent(HttpServletRequest request, HttpServletResponse response) {
        JSONObject jsonObject = new JSONObject();
        response.setContentType("text/xml;charset=utf-8");
        String id = UUID.randomUUID().toString().replaceAll("-", "");
        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String phone = request.getParameter("phone");
        String intro = request.getParameter("intro");
        Student student = new Student();
        student.setPhone(phone);
        student.setStu_desc(intro);
        student.setStu_email(email);
        student.setStu_id(id);
        student.setStu_name(name);
        try {
            service.insert(student);
            jsonObject.put("success", "true");
        } catch (Exception e) {
            logger.error("学生信息录入失败！" + e.getMessage());
            e.printStackTrace();
            jsonObject.put("success", "false");
        } finally {
            JsonUtils.outJson(response, jsonObject.toString());
        }
    }

    @RequestMapping(value = "/getAllStudent", method = RequestMethod.GET)
    public void getAllStudent(HttpServletRequest request, HttpServletResponse response) {
        List<Student> students;
        JSONObject jsonObject = new JSONObject();
        response.setContentType("text/xml;charset=utf-8");
        try {
            students = service.selectAll();
            JSONArray jsonArray = JsonUtils.getJSONArrayByList(students);
            jsonObject.put("students", jsonArray);
            jsonObject.put("success", "true");
        } catch (Exception e) {
            logger.error("查询所有学生信息失败！" + e.getMessage());
            e.printStackTrace();
            jsonObject.put("success", "false");
        } finally {
            JsonUtils.outJson(response, jsonObject.toString());
        }

    }

    @RequestMapping(value = "/deleteStudent", method = RequestMethod.POST)
    public void deleteStudent(HttpServletRequest request, HttpServletResponse response) {
        JSONObject jsonObject = new JSONObject();
        response.setContentType("text/xml;charset=utf-8");
        String id = request.getParameter("id");
        try {
            service.deleteByPrimaryKey(id);
            jsonObject.put("success", "true");
        } catch (Exception e) {
            logger.error("删除学生信息失败！" + e.getMessage());
            e.printStackTrace();
            jsonObject.put("success", "false");
        } finally {
            JsonUtils.outJson(response, jsonObject.toString());
        }

    }

    @RequestMapping(value = "/selectSingleStudent", method = RequestMethod.POST)
    public void selectSingleStudent(HttpServletRequest request, HttpServletResponse response) {
        JSONObject jsonObject = new JSONObject();
        response.setContentType("text/xml;charset=utf-8");
        String id = request.getParameter("id");
        try {
            Student student = service.selectByPrimaryKey(id);
            jsonObject.put("name", student.getStu_name());
            jsonObject.put("email", student.getStu_email());
            jsonObject.put("phone", student.getPhone());
            jsonObject.put("desc", student.getStu_desc());
            jsonObject.put("success", "true");
        } catch (Exception e) {
            logger.error("删除学生信息失败！" + e.getMessage());
            e.printStackTrace();
            jsonObject.put("success", "false");
        } finally {
            JsonUtils.outJson(response, jsonObject.toString());
        }

    }

    @RequestMapping(value = "/updateStudent", method = RequestMethod.POST)
    public void updateStudent(HttpServletRequest request, HttpServletResponse response) {
        JSONObject jsonObject = new JSONObject();
        response.setContentType("text/xml;charset=utf-8");
        String id = request.getParameter("id");
        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String phone = request.getParameter("phone");
        String intro = request.getParameter("intro");
        Student student = new Student();
        student.setPhone(phone);
        student.setStu_desc(intro);
        student.setStu_email(email);
        student.setStu_id(id);
        student.setStu_name(name);
        try {
            service.updateByPrimaryKey(student);
            jsonObject.put("success", "true");
        } catch (Exception e) {
            logger.error("更新学生信息失败！" + e.getMessage());
            e.printStackTrace();
            jsonObject.put("success", "false");
        } finally {
            JsonUtils.outJson(response, jsonObject.toString());
        }

    }

}
