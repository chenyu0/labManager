package cn.com.lab.service;

import cn.com.lab.model.User;
import cn.com.lab.model.UserLoginInfo;

import java.util.List;

public interface IUserService {

    int deleteByPrimaryKey(String username);


    int insert(UserLoginInfo record);


    UserLoginInfo selectByPrimaryKey(String username);


    List<UserLoginInfo> selectAll();


    int updateByPrimaryKey(UserLoginInfo record);


    UserLoginInfo checkLogin(UserLoginInfo record);

}
