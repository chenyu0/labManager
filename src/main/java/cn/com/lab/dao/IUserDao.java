package cn.com.lab.dao;

import cn.com.lab.model.User;

public interface IUserDao {
    User selectUser(long id);
}
