package traning.iqgateway.service;

import java.util.List;

import traning.iqgateway.entities.PoliciesEO;

public interface PoliciesService {
	List<PoliciesEO> getAllPolicies();

	List<PoliciesEO> getPoliciesByCustomerId(Integer customerId);
}
