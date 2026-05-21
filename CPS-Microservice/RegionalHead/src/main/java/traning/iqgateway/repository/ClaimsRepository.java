package traning.iqgateway.repository;


import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import traning.iqgateway.entities.ClaimsEO;

@Repository
public interface ClaimsRepository extends MongoRepository<ClaimsEO, Integer> {
	List<ClaimsEO> findByStatus(String status);

}