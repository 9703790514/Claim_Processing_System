package traning.iqgateway.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import traning.iqgateway.entities.ClaimWithDocsDTO;
import traning.iqgateway.entities.ClaimsEO;
import traning.iqgateway.service.ClaimsService;

@RestController
@RequestMapping("/head")
public class RegionalHeadController {

    @Autowired
    private ClaimsService claimsService;

    // 1) Fetch claims with status "Forwarded" and their documents
    @GetMapping("/forwarded")
    public ResponseEntity<List<ClaimWithDocsDTO>> getForwardedClaimsWithDocs() {
        List<ClaimWithDocsDTO> claimsWithDocs = claimsService.getClaimsWithDocumentsByStatus("Forwarded");
        if(claimsWithDocs.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(claimsWithDocs);
    }

    // 2) Update Claims status
    @PatchMapping("/{claimId}/status")
    public ResponseEntity<ClaimsEO> updateClaimStatus(
            @PathVariable Integer claimId, 
            @RequestParam String status) {
        try {
            ClaimsEO updatedClaim = claimsService.updateClaimStatus(claimId, status);
            return ResponseEntity.ok(updatedClaim);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
