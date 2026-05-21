package traning.iqgateway.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "customers")
public class CustomerEO {

@Id
private Integer id;

private String customerName;

private String customerAddress;

private String customerAadhaar;

private String customerEmail;

private String customerPassword;

private LocalDate customerDob;

private String customerPhone;

private String nomineeName;

private LocalDate nomineeDob;

private String nomineeRelation;

private List<PolicyEntry> policies = new ArrayList<>();

}