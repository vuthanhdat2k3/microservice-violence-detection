package com.detectionservice.service;

import com.detectionservice.model.DetectionResult;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class DetectionService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String PYTHON_API_URL = "http://localhost:5000/api/predict"; // Sửa URL endpoint

    public DetectionResult detectViolence(MultipartFile video) {
        try {
            // Tạo headers với Content-Type là multipart/form-data
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // Đóng gói video file vào MultiValueMap
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(video.getBytes()) {
                @Override
                public String getFilename() {
                    return video.getOriginalFilename();
                }
            });

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // Gửi request và nhận response
            ResponseEntity<PythonApiResponse> response = restTemplate.postForEntity(
                    PYTHON_API_URL,
                    requestEntity,
                    PythonApiResponse.class
            );

            if (response.getBody() != null) {
                PythonApiResponse apiResponse = response.getBody();
                // Chuyển đổi từ response của Python API sang DetectionResult
                DetectionResult result = new DetectionResult();
                result.setViolent(apiResponse.isFight());
                result.setConfidence(Double.parseDouble(apiResponse.getPrecentegeoffight()) / 100.0); // Chuyển % sang decimal
                result.setDescription("Violence detection - Processing time: " + apiResponse.getProcessingTime() + "ms");
                return result;
            }
            return new DetectionResult();

        } catch (IOException e) {
            e.printStackTrace();
            return new DetectionResult(); // Trả về object rỗng nếu có lỗi
        }
    }

    // Inner class để map response từ Python API
    private static class PythonApiResponse {
        private boolean fight;
        private String precentegeoffight; // Chuỗi có "%"
        private String processing_time;

        public boolean isFight() {
            return fight;
        }

        public void setFight(boolean fight) {
            this.fight = fight;
        }

        public String getPrecentegeoffight() {
            return precentegeoffight;
        }

        public void setPrecentegeoffight(String precentegeoffight) {
            this.precentegeoffight = precentegeoffight;
        }

        public String getProcessingTime() {
            return processing_time;
        }

        public void setProcessing_time(String processing_time) {
            this.processing_time = processing_time;
        }
    }
}