package com.detectionservice.controller;

import com.detectionservice.model.DetectionRequest;
import com.detectionservice.model.DetectionResult;
import com.detectionservice.service.DetectionService;
import com.detectionservice.service.PythonApiClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/detection/violence")
public class ViolenceDetectionController {

    @Autowired
    private PythonApiClient pythonApiClient;

    @Autowired
    private DetectionService detectionService;

    @PostMapping(value = "/detect", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> detectViolence(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Map<String, Object> result = pythonApiClient.detectViolence(file);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/detect-url")
    public ResponseEntity<DetectionResult> detectViolenceFromUrl(@RequestBody DetectionRequest request) {
        // Set the detection type to VIOLENCE_DETECTION
        request.setDetectionType("VIOLENCE_DETECTION");

        // If no model ID is provided, use a default one
        if (request.getModelId() == null) {
            request.setModelId("default-violence-model");
        }

        DetectionResult result = detectionService.detectObjects(request);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(result);
    }

    @GetMapping("/result/{resultId}")
    public ResponseEntity<DetectionResult> getViolenceDetectionResult(@PathVariable String resultId) {
        DetectionResult result = detectionService.getDetectionResult(resultId);
        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }
}

