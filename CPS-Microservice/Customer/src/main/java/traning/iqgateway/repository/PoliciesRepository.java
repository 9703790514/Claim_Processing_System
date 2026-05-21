package traning.iqgateway.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import traning.iqgateway.entities.PoliciesEO;

@Repository
public interface PoliciesRepository extends MongoRepository<PoliciesEO, Integer> {

}