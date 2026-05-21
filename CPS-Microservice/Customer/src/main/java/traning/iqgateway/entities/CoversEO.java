package traning.iqgateway.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "covers")
public class CoversEO {

	@Id
	private Integer id;

	private String coverName;

	private Integer coverAmount;

	private Integer coverPremium;

	private List<String> addon;

}
