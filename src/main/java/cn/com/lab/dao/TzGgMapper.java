package cn.com.lab.dao;

import cn.com.lab.model.TzGg;

import java.util.List;

public interface TzGgMapper {
    int deleteByPrimaryKey(String tg_id);

    int insert(TzGg record);

    int insertSelective(TzGg record);

    TzGg selectByPrimaryKey(String tg_id);

    int updateByPrimaryKeySelective(TzGg record);

    int updateByPrimaryKey(TzGg record);

    List<TzGg> getAllTg();
}