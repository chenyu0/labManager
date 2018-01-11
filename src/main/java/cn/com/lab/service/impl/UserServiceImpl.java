package cn.com.lab.service.impl;

import cn.com.lab.dao.IUserDao;
import cn.com.lab.model.User;
import cn.com.lab.service.IUserService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service("userService")
public class UserServiceImpl implements IUserService {

    @Resource
    private IUserDao userDao;

    public User selectUser(long userId) {
        return this.userDao.selectUser(userId);
    }

}
