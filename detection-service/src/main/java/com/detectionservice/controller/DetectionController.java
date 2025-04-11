package com.detectionservice.controller;

import com.detectionservice.model.DetectionRequest;
import com.detectionservice.model.DetectionResult;
import com.detectionservice.service.DetectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detection")
public class DetectionController {

    @Autowired
    private DetectionService detectionService;

    @PostMapping("/detect")
    public ResponseEntity<DetectionResult> detectObjects(@RequestBody DetectionRequest request) {
        DetectionResult result = detectionService.detectObjects(request);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(result);
    }

    @GetMapping("/result/{resultId}")
    public ResponseEntity<DetectionResult> getDetectionResult(@PathVariable String resultId) {
        DetectionResult result = detectionService.getDetectionResult(resultId);
        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/results")
    public ResponseEntity<List<DetectionResult>> getAllResults() {
        List<DetectionResult> results = detectionService.getAllResults();
        return ResponseEntity.ok(results);
    }
}
