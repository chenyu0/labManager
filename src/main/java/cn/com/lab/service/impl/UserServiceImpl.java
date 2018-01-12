package cn.com.lab.service.impl;

import cn.com.lab.dao.IUserDao;
import cn.com.lab.model.User;
import cn.com.lab.model.UserLoginInfo;
import cn.com.lab.service.IUserService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service("userService")
public class UserServiceImpl implements IUserService {

    @Resource
    private IUserDao userDao;


    @Override
    public int deleteByPrimaryKey(String username) {
        return userDao.deleteByPrimaryKey(username);
    }

    @Override
    public int insert(UserLoginInfo record) {
        return userDao.insert(record);
    }

    @Override
    public UserLoginInfo selectByPrimaryKey(String username) {
        return userDao.selectByPrimaryKey(username);
    }

    @Override
    public List<UserLoginInfo> selectAll() {
        return userDao.selectAll();
    }

    @Override
    public int updateByPrimaryKey(UserLoginInfo record) {
        return userDao.updateByPrimaryKey(record);
    }

    @Override
    public UserLoginInfo checkLogin(UserLoginInfo record) {
        return userDao.checkLogin(record);
    }
}
