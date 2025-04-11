package com.detectionservice.controller;

import com.detectionservice.model.DetectionResult;
import com.detectionservice.service.DetectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/detect")
public class DetectionController {

    @Autowired
    private DetectionService detectionService;

    @PostMapping("/video")
    public ResponseEntity<DetectionResult> detectFromVideo(@RequestParam("file") MultipartFile video) {
        DetectionResult result = detectionService.detectViolence(video);
        return ResponseEntity.ok(result);
    }
}