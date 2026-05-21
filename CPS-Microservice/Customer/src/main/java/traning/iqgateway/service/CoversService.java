package traning.iqgateway.service;

import java.util.List;

import traning.iqgateway.entities.CoversEO;

public interface CoversService {

    List<CoversEO> getAllCovers();

    List<CoversEO> getCoversByCustomerId(Integer customerId);
}
