package com.violence_detecting_system.training_service.controller;

import com.violence_detecting_system.training_service.model.TrainingRequest;
import com.violence_detecting_system.training_service.service.TrainingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/train")
public class TrainingController {

    @Autowired
    private TrainingService trainingService;

    @PostMapping("/movement")
    public ResponseEntity<String> trainMovementModel(@RequestBody TrainingRequest request) {
        String result = trainingService.trainMovementModel(request);
        return ResponseEntity.ok(result);
    }
}