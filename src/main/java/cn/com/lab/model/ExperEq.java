package cn.com.lab.model;

public class ExperEq {
    private String eq_id;

    private String eq_name;

    private Integer eq_num;

    private String eq_des;

    public String getEq_id() {
        return eq_id;
    }

    public void setEq_id(String eq_id) {
        this.eq_id = eq_id == null ? null : eq_id.trim();
    }

    public String getEq_name() {
        return eq_name;
    }

    public void setEq_name(String eq_name) {
        this.eq_name = eq_name == null ? null : eq_name.trim();
    }

    public Integer getEq_num() {
        return eq_num;
    }

    public void setEq_num(Integer eq_num) {
        this.eq_num = eq_num;
    }

    public String getEq_des() {
        return eq_des;
    }

    public void setEq_des(String eq_des) {
        this.eq_des = eq_des == null ? null : eq_des.trim();
    }
}