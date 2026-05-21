package traning.iqgateway.service;

import java.util.List;
import java.util.Optional;

import traning.iqgateway.entities.CustomerEO;

public interface CustomerService {
	 
    CustomerEO createCustomer(CustomerEO customer);
 
    Optional<CustomerEO> getCustomerById(Integer id);
 
    List<CustomerEO> getAllCustomers();
 
    CustomerEO updateCustomer(Integer id, CustomerEO customer);
 
    void deleteCustomer(Integer id);

	List<CustomerEO> findByEmailAndPassword(String customer_email, String customer_password);
}
