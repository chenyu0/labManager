package cn.com.lab.service.impl;

import cn.com.lab.dao.TzGgMapper;
import cn.com.lab.model.TzGg;
import cn.com.lab.service.ITgService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service("tgService")
public class ITgServiceImpl implements ITgService {

    @Resource
    private TzGgMapper tgDao;
    @Override
    public int deleteByPrimaryKey(String tg_id) {
        return tgDao.deleteByPrimaryKey(tg_id);
    }

    @Override
    public int insert(TzGg record) {
        return tgDao.insert(record);
    }

    @Override
    public int insertSelective(TzGg record) {
        return tgDao.insertSelective(record);
    }

    @Override
    public TzGg selectByPrimaryKey(String tg_id) {
        return tgDao.selectByPrimaryKey(tg_id);
    }

    @Override
    public int updateByPrimaryKeySelective(TzGg record) {
        return tgDao.updateByPrimaryKeySelective(record);
    }

    @Override
    public int updateByPrimaryKey(TzGg record) {
        return tgDao.updateByPrimaryKey(record);
    }

    @Override
    public List<TzGg> getAllTg() {
        return tgDao.getAllTg();
    }
}
