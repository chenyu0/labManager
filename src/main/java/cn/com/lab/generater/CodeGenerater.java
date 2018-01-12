package cn.com.lab.generater;

import cn.com.lab.utils.common.VerifyCodeUtils;
import org.apache.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;

public class CodeGenerater extends HttpServlet {

    private Logger logger = Logger.getLogger(CodeGenerater.class);
    @Override
    protected void service(HttpServletRequest arg0, HttpServletResponse arg1)
            throws ServletException, IOException {
        // TODO Auto-generated method stub
        arg1.setContentType("text/html;charset=utf-8");
        arg1.setDateHeader("expires", -1);// 值为-1时表示不缓存
        // 保证浏览器兼容性提高缓存成功性
        arg1.setHeader("Cache-Control", "no-cache");
        arg1.setHeader("Pragma", "no-cache");
        OutputStream os = arg1.getOutputStream();
        String rightCode = VerifyCodeUtils.generateVerifyCode(5);
        if(logger.isDebugEnabled()){
            logger.debug("本次验证码为："+rightCode);
        }
        arg0.getSession().setAttribute("rightCode", rightCode);
        VerifyCodeUtils.outputImage(146, 35, os, rightCode);
        try {
            if (os != null) {
                os.flush();
                os.close();
                os = null;
            }
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
        }
        arg1.flushBuffer();
    }
}