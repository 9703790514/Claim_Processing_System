package traning.iqgateway.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "claims")
public class ClaimsEO {

	@Id
	private Integer id;

	private Integer customerId;

	private Integer hospitalId;

	private Integer docId;

	private Integer expectedAmount;

	private Integer approvedAmount;

	private String submittedDate;

	private Instant lastUpdatedDate;

	private String status;

	private String feedback;

	private Integer document;

	private List<Integer> medicalValid;

	private Integer givenPolicyId;

}
