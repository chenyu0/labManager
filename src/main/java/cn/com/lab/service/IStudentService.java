package cn.com.lab.service;

import cn.com.lab.model.Student;

import java.util.List;

public interface IStudentService {
    int deleteByPrimaryKey(String stu_id);

    int insert(Student record);

    int insertSelective(Student record);

    Student selectByPrimaryKey(String stu_id);

    int updateByPrimaryKeySelective(Student record);

    int updateByPrimaryKey(Student record);
    List<Student> selectAll();
}
