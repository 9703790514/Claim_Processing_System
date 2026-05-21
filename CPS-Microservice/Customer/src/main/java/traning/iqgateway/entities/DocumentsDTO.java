package traning.iqgateway.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentsDTO {
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
