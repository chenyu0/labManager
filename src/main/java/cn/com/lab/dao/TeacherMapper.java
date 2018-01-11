package cn.com.lab.dao;

import cn.com.lab.model.Teacher;

public interface TeacherMapper {
    int deleteByPrimaryKey(String teacher_id);

    int insert(Teacher record);

    int insertSelective(Teacher record);

    Teacher selectByPrimaryKey(String teacher_id);

    int updateByPrimaryKeySelective(Teacher record);

    int updateByPrimaryKey(Teacher record);
}