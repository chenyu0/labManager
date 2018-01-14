package cn.com.lab.utils.common;

import com.alibaba.fastjson.JSONArray;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

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

    /**
     * 根据List获取到对应的JSONArray
     * @param list
     * @return
     */
    public static JSONArray getJSONArrayByList(List<?> list){
        JSONArray jsonArray = new JSONArray();
        if (list==null ||list.isEmpty()) {
            return jsonArray;
        }

        for (Object object : list) {
            jsonArray.add(object);
        }
        return jsonArray;
    }
}
