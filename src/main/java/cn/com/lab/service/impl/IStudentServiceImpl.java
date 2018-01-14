package cn.com.lab.service.impl;

import cn.com.lab.dao.StudentMapper;
import cn.com.lab.model.Student;
import cn.com.lab.service.IStudentService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service("studengService")
public class IStudentServiceImpl implements IStudentService {
    @Resource
    private StudentMapper dao;

    @Override
    public int deleteByPrimaryKey(String stu_id) {
        return dao.deleteByPrimaryKey(stu_id);
    }

    @Override
    public int insert(Student record) {
        return dao.insert(record);
    }

    @Override
    public int insertSelective(Student record) {
        return dao.insertSelective(record);
    }

    @Override
    public Student selectByPrimaryKey(String stu_id) {
        return dao.selectByPrimaryKey(stu_id);
    }

    @Override
    public int updateByPrimaryKeySelective(Student record) {
        return dao.updateByPrimaryKeySelective(record);
    }

    @Override
    public int updateByPrimaryKey(Student record) {
        return dao.updateByPrimaryKey(record);
    }

    @Override
    public List<Student> selectAll() {
        return dao.selectAll();
    }
}
