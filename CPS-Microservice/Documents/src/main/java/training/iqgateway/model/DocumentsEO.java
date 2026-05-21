package training.iqgateway.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "documents")
public class DocumentsEO {

	@Id
	private Integer id;

	private Integer claim_id;

	private String blood_test;

	private String admission_note;

	private String prescription;

	private String xray_report;

	private String insurance_form;

	private String discharge_summary;

	private String other;

	private String last_updated;

	private Integer verified_by;

}
