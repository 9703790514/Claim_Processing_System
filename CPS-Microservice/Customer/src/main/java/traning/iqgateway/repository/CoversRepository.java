package traning.iqgateway.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import traning.iqgateway.entities.CoversEO;

@Repository
public interface CoversRepository extends MongoRepository<CoversEO, Integer> {
    
}