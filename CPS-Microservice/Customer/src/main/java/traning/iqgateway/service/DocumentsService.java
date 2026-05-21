package traning.iqgateway.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import traning.iqgateway.entities.DocumentsDTO;

@Service
public class DocumentsService {

	private final RestTemplate restTemplate;

	// Eureka logical service ID for Documents microservice; ensure same as your
	// registered service name
	private static final String DOCUMENTS_SERVICE_URL = "http://DOCUMENTS-SERVICE/documents";

	@Autowired
	public DocumentsService(RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
	}

	public DocumentsDTO uploadDocuments(DocumentsDTO documentsDTO) {
		// POST to Documents microservice '/documents' or appropriate endpoint
		String url = DOCUMENTS_SERVICE_URL + "/upload";

		return restTemplate.postForObject(url, documentsDTO, DocumentsDTO.class);
	}
}
