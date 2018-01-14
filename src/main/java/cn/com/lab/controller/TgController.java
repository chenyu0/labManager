package cn.com.lab.controller;

import cn.com.lab.model.Student;
import cn.com.lab.model.TzGg;
import cn.com.lab.model.UserLoginInfo;
import cn.com.lab.service.ITgService;
import cn.com.lab.utils.common.CookieUtils;
import cn.com.lab.utils.common.JsonUtils;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.log4j.Logger;
import org.springframework.context.annotation.Scope;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * 通知公告的控制类
 */
@RestController
@Scope("prototype")
public class TgController {
    private Logger logger = org.apache.log4j.Logger.getLogger(UserController.class);
    @Resource
    private ITgService tgService;
    @RequestMapping(value = "/addTg", method = RequestMethod.POST)
    public void login(HttpServletRequest request, HttpServletResponse response) {
        JSONObject jsonObject = new JSONObject();
        response.setContentType("text/xml;charset=utf-8");
        String id = UUID.randomUUID().toString().replaceAll("-", "");
        String title = request.getParameter("title");
        String content = request.getParameter("content");
        JSONObject user = (JSONObject) request.getSession().getAttribute("user");
        String username = (String) user.get("username");
        Date date = new Date();
        TzGg tzGg = new TzGg();
        tzGg.setTg_content(content);
        tzGg.setTg_date(date);
        tzGg.setTg_id(id);
        tzGg.setTg_user(username);
        tzGg.setTg_name(title);
        try {
            tgService.insert(tzGg);
            jsonObject.put("success","true");
        }catch (Exception e){
            logger.error("插入公告失败！"+e.getMessage());
            e.printStackTrace();
            jsonObject.put("success","false");
        }finally {
            JsonUtils.outJson(response, jsonObject.toString());//getAllTg
        }
    }

    @RequestMapping(value = "/getAllTg", method = RequestMethod.GET)
    public void getAllStudent(HttpServletRequest request, HttpServletResponse response) {
        List<TzGg> tzGgs;
        JSONObject jsonObject = new JSONObject();
        response.setContentType("text/xml;charset=utf-8");
        try {
            tzGgs = tgService.getAllTg();
            JSONArray jsonArray = JsonUtils.getJSONArrayByList(tzGgs);
            jsonObject.put("tgs",jsonArray);
            jsonObject.put("success", "true");
        } catch (Exception e) {
            logger.error("查询所有公告信息失败！" + e.getMessage());
            e.printStackTrace();
            jsonObject.put("success", "false");
        } finally {
            JsonUtils.outJson(response, jsonObject.toString());
        }

    }
    @RequestMapping(value = "/deleteTg", method = RequestMethod.POST)
    public void deleteTg(HttpServletRequest request, HttpServletResponse response) {
        JSONObject jsonObject = new JSONObject();
        response.setContentType("text/xml;charset=utf-8");
        String id = request.getParameter("id");
        try {
            tgService.deleteByPrimaryKey(id);
            jsonObject.put("success", "true");
        } catch (Exception e) {
            logger.error("删除公告信息失败！" + e.getMessage());
            e.printStackTrace();
            jsonObject.put("success", "false");
        } finally {
            JsonUtils.outJson(response, jsonObject.toString());
        }

    }

}
