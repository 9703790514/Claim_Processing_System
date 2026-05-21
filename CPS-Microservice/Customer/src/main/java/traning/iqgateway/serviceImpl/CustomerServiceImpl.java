package traning.iqgateway.serviceImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import traning.iqgateway.entities.CustomerEO;
import traning.iqgateway.repository.CustomerRepository;
import traning.iqgateway.service.CustomerService;

@Service
public class CustomerServiceImpl implements CustomerService {

	@Autowired
	private CustomerRepository customerRepository;

	@Override
	public CustomerEO createCustomer(CustomerEO customer) {
		Integer maxId = customerRepository.findTopByOrderByIdDesc().map(CustomerEO::getId).orElse(0);
		customer.setId(maxId + 1);

		if (customer.getId() == null) {
			throw new IllegalStateException("ID is null! Cannot save.");
		}

		return customerRepository.save(customer);
	}

	@Override
	public Optional<CustomerEO> getCustomerById(Integer id) {
		return customerRepository.findById(id);
	}

	@Override
	public List<CustomerEO> getAllCustomers() {
		return customerRepository.findAll();
	}

	@Override
	public CustomerEO updateCustomer(Integer id, CustomerEO customer) {
		return customerRepository.findById(id).map(existingCustomer -> {
			// Update fields
			existingCustomer.setCustomerName(customer.getCustomerName());
			existingCustomer.setCustomerAddress(customer.getCustomerAddress());
			existingCustomer.setCustomerAadhaar(customer.getCustomerAadhaar());
			existingCustomer.setCustomerEmail(customer.getCustomerEmail());
			existingCustomer.setCustomerPassword(customer.getCustomerPassword());
			existingCustomer.setCustomerDob(customer.getCustomerDob());
			existingCustomer.setCustomerPhone(customer.getCustomerPhone());
			existingCustomer.setNomineeName(customer.getNomineeName());
			existingCustomer.setNomineeDob(customer.getNomineeDob());
			existingCustomer.setNomineeRelation(customer.getNomineeRelation());
			existingCustomer.setPolicies(customer.getPolicies());
			return customerRepository.save(existingCustomer);
		}).orElseThrow(() -> new RuntimeException("Customer not found with id " + id));
	}

	@Override
	public void deleteCustomer(Integer id) {
		customerRepository.deleteById(id);
	}
	
	@Override
	public List<CustomerEO> findByEmailAndPassword(String email, String password) {
	    return customerRepository.findByCustomerEmailAndCustomerPassword(email, password);
	}

}