package traning.iqgateway.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import traning.iqgateway.entities.CustomerEO;

@Repository
public interface CustomerRepository extends MongoRepository<CustomerEO, Integer>{

	Optional<CustomerEO> findTopByOrderByIdDesc();

	List<CustomerEO> findByCustomerEmailAndCustomerPassword(String email, String password);
}