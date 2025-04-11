package com.violence_detecting_system.training_service.controller;

import com.violence_detecting_system.training_service.model.TrainingJob;
import com.violence_detecting_system.training_service.model.TrainingRequest;
import com.violence_detecting_system.training_service.model.TrainingResponse;
import com.violence_detecting_system.training_service.service.TrainingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/training")
public class TrainingController {

    @Autowired
    private TrainingService trainingService;
    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Hello from Training Service");
    }

    @PostMapping("/submit")
    public ResponseEntity<TrainingResponse> submitTrainingJob(@RequestBody TrainingRequest request) {
        TrainingResponse response = trainingService.submitTrainingJob(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<TrainingJob> getJobStatus(@PathVariable String jobId) {
        TrainingJob job = trainingService.getJobStatus(jobId);
        if (job == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(job);
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<TrainingJob>> getAllJobs() {
        List<TrainingJob> jobs = trainingService.getAllJobs();
        return ResponseEntity.ok(jobs);
    }

    @DeleteMapping("/job/{jobId}")
    public ResponseEntity<Void> cancelJob(@PathVariable String jobId) {
        trainingService.cancelTrainingJob(jobId);
        return ResponseEntity.noContent().build();
    }
}
