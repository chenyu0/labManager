package cn.com.lab.filter;

import cn.com.lab.utils.common.CookieUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import com.alibaba.fastjson.JSONObject;
import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.StringTokenizer;

public class UrlFilter implements Filter{
    protected String loginPage = null;
    protected String ignoreURL = null;
    protected String KEY_USERNAME = null;
    protected ArrayList alIgnoreURL = new ArrayList();
    protected static Log log;
    protected FilterConfig filterConfig = null;
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        this.filterConfig = filterConfig;
        this.loginPage = filterConfig.getInitParameter("loginPage");
        this.ignoreURL = filterConfig.getInitParameter("ignoreURL");
        this.KEY_USERNAME = filterConfig.getInitParameter("KEY_USERNAME");
        StringTokenizer tokenizer = new StringTokenizer(this.ignoreURL,",");
        while (tokenizer.hasMoreElements()){
            String s = (String)tokenizer.nextElement();
            this.alIgnoreURL.add(s);
        }
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) resp;
        HttpSession session = request.getSession();
        String url = request.getRequestURI().toString();
        if(this.KEY_USERNAME == null){
            this.KEY_USERNAME = "user";
        }
        if ((session == null || session.getAttribute(this.KEY_USERNAME)==null)
                &&!this.isIgnoreURL(url)){
            log.error("来自IP："+request.getRemoteAddr()+"用户访问页面"+url
                    +"时没有登录！"+session.getId());
            if(url.indexOf(".html")!=-1){
                ((HttpServletResponse)resp).sendRedirect(loginPage);
                return;
            }

            //this.filterConfig.getServletContext().getRequestDispatcher(this.loginPage).forward(req,resp);
        }else{
            if(!this.isIgnoreURL(url))
                CookieUtils.addCookie(response, (String) ((JSONObject)session.getAttribute(this.KEY_USERNAME)).get("cookie"));
        }
        chain.doFilter(req, resp);
    }

    @Override
    public void destroy() {
        this.loginPage = null;
    }
    public boolean isIgnoreURL(String url) {
        for (int i = 0; i < this.alIgnoreURL.size(); ++i) {
            if (url.indexOf((String) this.alIgnoreURL.get(i)) != -1) {
                return true;
            }
        }
        return false;
    }
    static {
        log = LogFactory.getLog(UrlFilter.class);
    }
}
