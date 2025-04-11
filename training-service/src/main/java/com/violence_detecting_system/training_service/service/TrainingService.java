package com.violence_detecting_system.training_service.service;

import com.violence_detecting_system.training_service.model.TrainingRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TrainingService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String PYTHON_API_URL = "http://localhost:5000/train"; // URL của Python API

    public String trainMovementModel(TrainingRequest request) {
        // Gọi Python API để huấn luyện mô hình
        String response = restTemplate.postForObject(PYTHON_API_URL, request, String.class);
        return response != null ? response : "Training started";
    }
}
