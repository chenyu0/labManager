package cn.com.lab.model;

public class Student {
    private String stu_id;

    private String stu_name;

    private String exp_id;

    private String phone;

    private String stu_desc;

    private String stu_email;

    public String getStu_id() {
        return stu_id;
    }

    public void setStu_id(String stu_id) {
        this.stu_id = stu_id == null ? null : stu_id.trim();
    }

    public String getStu_name() {
        return stu_name;
    }

    public void setStu_name(String stu_name) {
        this.stu_name = stu_name == null ? null : stu_name.trim();
    }

    public String getExp_id() {
        return exp_id;
    }

    public void setExp_id(String exp_id) {
        this.exp_id = exp_id == null ? null : exp_id.trim();
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone == null ? null : phone.trim();
    }

    public String getStu_desc() {
        return stu_desc;
    }

    public void setStu_desc(String stu_desc) {
        this.stu_desc = stu_desc == null ? null : stu_desc.trim();
    }

    public String getStu_email() {
        return stu_email;
    }

    public void setStu_email(String stu_email) {
        this.stu_email = stu_email == null ? null : stu_email.trim();
    }
}