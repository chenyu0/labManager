package cn.com.lab.model;

public class Teacher {
    private String teacher_id;

    private String t_name;

    private String t_role;

    public String getTeacher_id() {
        return teacher_id;
    }

    public void setTeacher_id(String teacher_id) {
        this.teacher_id = teacher_id == null ? null : teacher_id.trim();
    }

    public String getT_name() {
        return t_name;
    }

    public void setT_name(String t_name) {
        this.t_name = t_name == null ? null : t_name.trim();
    }

    public String getT_role() {
        return t_role;
    }

    public void setT_role(String t_role) {
        this.t_role = t_role == null ? null : t_role.trim();
    }
}