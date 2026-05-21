package traning.iqgateway.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "hospitals")
public class HospitalsEO {

	@Id
	private Integer id;

	private String hospitalName;

	private String address;

	private String city;

	private String contact;

}
