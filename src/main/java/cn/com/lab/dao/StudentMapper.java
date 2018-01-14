package cn.com.lab.dao;

import cn.com.lab.model.Student;

import java.util.List;

public interface StudentMapper {
    int deleteByPrimaryKey(String stu_id);

    int insert(Student record);

    int insertSelective(Student record);

    Student selectByPrimaryKey(String stu_id);

    int updateByPrimaryKeySelective(Student record);

    int updateByPrimaryKey(Student record);

    List<Student> selectAll();
}