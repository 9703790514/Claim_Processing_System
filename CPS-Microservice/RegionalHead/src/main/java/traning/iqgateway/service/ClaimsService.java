package traning.iqgateway.service;

import java.util.List;

import traning.iqgateway.entities.ClaimWithDocsDTO;
import traning.iqgateway.entities.ClaimsEO;

public interface ClaimsService {
	
    List<ClaimWithDocsDTO> getClaimsWithDocumentsByStatus(String status);


    ClaimsEO updateClaimStatus(Integer claimId, String newStatus);

}