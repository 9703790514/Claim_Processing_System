package traning.iqgateway.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import traning.iqgateway.entities.HospitalsEO;

@Repository
public interface HospitalRepository extends MongoRepository<HospitalsEO, Integer> {

    List<HospitalsEO> findByCityIgnoreCase(String city);
}
