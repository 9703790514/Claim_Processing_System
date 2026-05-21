package traning.iqgateway.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import traning.iqgateway.entities.HospitalsEO;
import traning.iqgateway.repository.HospitalRepository;
import traning.iqgateway.service.HospitalService;

@Service
public class HospitalServiceImpl implements HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;

    @Override
    public List<HospitalsEO> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    @Override
    public List<HospitalsEO> getHospitalsByCity(String city) {
        return hospitalRepository.findByCityIgnoreCase(city);
    }
}
