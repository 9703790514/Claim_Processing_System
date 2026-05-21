package traning.iqgateway.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "policies")
public class PoliciesEO {

	@Id
	private Integer id;

	private String policyName;

	private Integer sumAssured;

	private Integer premium;

	private String validity;

	private String exclusion;

}
