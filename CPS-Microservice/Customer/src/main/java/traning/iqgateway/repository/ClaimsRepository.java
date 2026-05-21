package traning.iqgateway.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import traning.iqgateway.entities.ClaimsEO;

@Repository
public interface ClaimsRepository extends MongoRepository<ClaimsEO, Integer> {

}