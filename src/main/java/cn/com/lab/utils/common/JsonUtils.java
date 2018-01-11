package cn.com.lab.utils.common;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JsonUtils {

    /**
     * 输出json到HTML
     * @param response
     * @param jsonString 要输出的字符串
     */
    public static  void outJson(HttpServletResponse response, String jsonString) {
        response.setContentType("<span style=\"color: rgb(73, 73, 73); font-family: simsun; font-size: 14px; line-height: 21px; background-color: rgb(252, 211, 221);\">text/plain;</span>");
        response.setCharacterEncoding("utf-8");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Cache-Control", "no-cache, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        try {
            response.getWriter().println(jsonString);
            response.getWriter().flush();
            response.getWriter().close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
