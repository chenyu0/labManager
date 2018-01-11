package cn.com.lab.dao;

import cn.com.lab.model.ExperEq;

public interface ExperEqMapper {
    int deleteByPrimaryKey(String eq_id);

    int insert(ExperEq record);

    int insertSelective(ExperEq record);

    ExperEq selectByPrimaryKey(String eq_id);

    int updateByPrimaryKeySelective(ExperEq record);

    int updateByPrimaryKey(ExperEq record);
}