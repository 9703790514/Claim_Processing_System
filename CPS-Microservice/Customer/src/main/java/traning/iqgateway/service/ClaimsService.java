package traning.iqgateway.service;

import java.util.List;

import traning.iqgateway.entities.ClaimsEO;

public interface ClaimsService {

	List<ClaimsEO> getClaimsByCustomerId(Integer customerId);

	ClaimsEO addClaim(ClaimsEO claim);

	ClaimsEO updateClaim(Integer claimId, ClaimsEO claimUpdate);

	void deleteClaim(Integer claimId);
}