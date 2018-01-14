package cn.com.lab.model;

import java.util.Date;

public class TzGg {
    private String tg_id;

    private String tg_name;

    private String tg_user;

    private Date tg_date;

    private String tg_content;

    public String getTg_id() {
        return tg_id;
    }

    public void setTg_id(String tg_id) {
        this.tg_id = tg_id == null ? null : tg_id.trim();
    }

    public String getTg_name() {
        return tg_name;
    }

    public void setTg_name(String tg_name) {
        this.tg_name = tg_name == null ? null : tg_name.trim();
    }

    public String getTg_user() {
        return tg_user;
    }

    public void setTg_user(String tg_user) {
        this.tg_user = tg_user == null ? null : tg_user.trim();
    }

    public Date getTg_date() {
        return tg_date;
    }

    public void setTg_date(Date tg_date) {
        this.tg_date = tg_date;
    }

    public String getTg_content() {
        return tg_content;
    }

    public void setTg_content(String tg_content) {
        this.tg_content = tg_content == null ? null : tg_content.trim();
    }
}