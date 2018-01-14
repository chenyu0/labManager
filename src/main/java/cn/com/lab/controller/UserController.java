package cn.com.lab.controller;

import cn.com.lab.global.StaticSetting;
import cn.com.lab.model.UserLoginInfo;
import cn.com.lab.service.IUserService;
import cn.com.lab.utils.common.CookieUtils;
import cn.com.lab.utils.common.JsonUtils;
import cn.com.lab.utils.common.VerifyCodeUtils;
import com.alibaba.fastjson.JSONObject;
import org.apache.log4j.Logger;
import org.springframework.context.annotation.Scope;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.UUID;

@RestController
@Scope("prototype")
public class UserController {
    private Logger logger = org.apache.log4j.Logger.getLogger(UserController.class);

    @Resource
    private IUserService userService;

    @RequestMapping(value = "/checkLogin", method = RequestMethod.POST)
    public void login(HttpServletRequest request, HttpServletResponse response) {
        JSONObject jsonObject = new JSONObject();
        response.setContentType("text/xml;charset=utf-8");
        String codeNow = (String) request.getSession().getAttribute("rightCode");
        request.getSession().setAttribute("rightCode", ""); //用过的验证码置空
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String codeInput = request.getParameter("yzcode").toUpperCase();
        if (!codeInput.equals(codeNow)) {
            logger.debug("验证码错误！");
            jsonObject.put("error", "验证码错误!");
            JsonUtils.outJson(response, jsonObject.toString());
        } else {
            UserLoginInfo userT = new UserLoginInfo();
            userT.setUsername(username);
            userT.setPassword(password);
            UserLoginInfo user = userService.checkLogin(userT);
            if (user != null) {
                String cookie = UUID.randomUUID().toString().replaceAll("-", "");
                user.setCookie(cookie);
                userService.updateByPrimaryKey(user);
                jsonObject.put("cookie", user.getCookie());
                jsonObject.put("username", user.getUsername());
                jsonObject.put("password", user.getPassword());
                request.getSession().setAttribute("user", jsonObject);
                CookieUtils.addCookie(response, cookie);
                logger.debug("登陆成功！" + user.getUsername());
                jsonObject.put("success", "1");
                JsonUtils.outJson(response, jsonObject.toString());
            } else {
                logger.debug("账号密码错误！");
                jsonObject.put("error", "账号密码错误!");
                JsonUtils.outJson(response, jsonObject.toString());
            }
        }

    }

    @RequestMapping(value = "/isLogined", method = RequestMethod.GET)
    public void isLogined(HttpServletRequest request, HttpServletResponse response) {

        JSONObject jsonObject = new JSONObject();
        response.setContentType("text/xml;charset=utf-8");

        String cookie = CookieUtils.showCookieVal(request);
        JSONObject user = (JSONObject) request.getSession().getAttribute("user");
        if (cookie != null && user != null && user.get("cookie").equals(cookie)) {
            logger.debug("用户已登录");
            jsonObject.put("isLogined", "true");
            jsonObject.put("user", user.get("username"));
            JsonUtils.outJson(response, jsonObject.toString());
        } else {
            logger.debug("用户未登录");
            jsonObject.put("isLogined", "false");
            jsonObject.put("info", "你还未进行登录！");
            JsonUtils.outJson(response, jsonObject.toString());
        }
    }
}

