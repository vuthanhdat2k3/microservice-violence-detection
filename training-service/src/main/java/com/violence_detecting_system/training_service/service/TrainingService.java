package com.violence_detecting_system.training_service.service;

import com.violence_detecting_system.training_service.model.TrainingJob;
import com.violence_detecting_system.training_service.model.TrainingRequest;
import com.violence_detecting_system.training_service.model.TrainingResponse;
import com.violence_detecting_system.training_service.repository.TrainingJobRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
public class TrainingService {
    private static final Logger logger = LoggerFactory.getLogger(TrainingService.class);

    @Autowired
    private TrainingJobRepository jobRepository;

    @Autowired
    private ModelStorageService modelStorageService;

    @Autowired
    private PythonApiClient pythonApiClient;

    public TrainingResponse submitTrainingJob(TrainingRequest request) {
        // Validate request
        if (request.getModelName() == null || request.getModelType() == null || request.getDatasetPath() == null) {
            TrainingResponse response = new TrainingResponse();
            response.setStatus("FAILED");
            response.setMessage("Missing required parameters: modelName, modelType, or datasetPath");
            return response;
        }

        // Create a new training job
        TrainingJob job = new TrainingJob();
        job.setId(UUID.randomUUID().toString());
        job.setModelName(request.getModelName());
        job.setModelType(request.getModelType());
        job.setStatus("QUEUED");
        job.setCreatedAt(LocalDateTime.now());
        job.setProgress(0.0);

        // Save the job
        jobRepository.save(job);

        // Start the training process asynchronously
        startTraining(job.getId(), request);

        // Return response with job ID
        TrainingResponse response = new TrainingResponse();
        response.setJobId(job.getId());
        response.setStatus("QUEUED");
        response.setMessage("Training job submitted successfully");
        return response;
    }

    @Async
    public CompletableFuture<Void> startTraining(String jobId, TrainingRequest request) {
        TrainingJob job = jobRepository.findById(jobId).orElse(null);
        if (job == null) {
            logger.error("Job not found: {}", jobId);
            return CompletableFuture.completedFuture(null);
        }

        try {
            // Update job status
            job.setStatus("RUNNING");
            job.setStartedAt(LocalDateTime.now());
            jobRepository.save(job);

            // Determine if we should use the Python API based on model type
            if ("VIOLENCE_DETECTION".equals(request.getModelType())) {
                // Use Python API for violence detection model training
                trainViolenceDetectionModelWithPythonApi(job, request);
            } else if ("PERSON_DETECTION".equals(request.getModelType())) {
                // Use Python API for person detection if available, otherwise use built-in method
                boolean usePythonApi = true; // Set to true to use Python API, false to use built-in

                if (usePythonApi) {
                    trainPersonDetectionModelWithPythonApi(job, request);
                } else {
                    trainPersonDetectionModel(job, request);
                }
            } else {
                throw new IllegalArgumentException("Unsupported model type: " + request.getModelType());
            }

            // Update job status to completed
            job.setStatus("COMPLETED");
            job.setCompletedAt(LocalDateTime.now());
            job.setProgress(100.0);
            jobRepository.save(job);

        } catch (Exception e) {
            logger.error("Training failed for job {}: {}", jobId, e.getMessage(), e);

            // Update job status to failed
            job.setStatus("FAILED");
            job.setCompletedAt(LocalDateTime.now());
            job.setErrorMessage(e.getMessage());
            jobRepository.save(job);
        }

        return CompletableFuture.completedFuture(null);
    }

    private void trainPersonDetectionModel(TrainingJob job, TrainingRequest request) {
        // Simulate training progress updates
        for (int i = 1; i <= 10; i++) {
            try {
                Thread.sleep(1000); // Simulate work
                job.setProgress(i * 10.0);
                jobRepository.save(job);
                logger.info("Training progress for job {}: {}%", job.getId(), job.getProgress());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Training interrupted", e);
            }
        }

        // Generate a model ID and save the model
        String modelId = UUID.randomUUID().toString();
        job.setModelId(modelId);
        job.setAccuracy(0.85); // Simulated accuracy

        // In a real implementation, you would save the actual model file
        modelStorageService.saveModel(modelId, "person_detection_model", job.getModelName());
    }

    private void trainPersonDetectionModelWithPythonApi(TrainingJob job, TrainingRequest request) {
        try {
            // Call Python API to submit training job
            Map<String, Object> apiResult = pythonApiClient.submitTrainingJob(
                    request.getDatasetPath(),
                    request.getModelName(),
                    "PERSON_DETECTION",
                    request.getEpochs(),
                    request.getLearningRate()
            );

            // Get the Python API job ID
            String pythonJobId = (String) apiResult.get("jobId");
            if (pythonJobId == null) {
                throw new RuntimeException("Failed to get job ID from Python API");
            }

            // Update our job with the Python job ID for reference
            job.setModelId(pythonJobId);
            jobRepository.save(job);

            // Poll for job status until completion
            boolean completed = false;
            int maxAttempts = 60; // Maximum number of polling attempts
            int attempt = 0;

            while (!completed && attempt < maxAttempts) {
                // Wait before polling
                Thread.sleep(5000); // 5 seconds

                // Get job status from Python API
                Map<String, Object> statusResult = pythonApiClient.getTrainingJobStatus(pythonJobId);
                String status = (String) statusResult.get("status");

                // Update progress
                if (statusResult.containsKey("progress")) {
                    Double progress = Double.parseDouble(statusResult.get("progress").toString());
                    job.setProgress(progress);
                    jobRepository.save(job);
                }

                // Check if job is completed or failed
                if ("COMPLETED".equals(status)) {
                    completed = true;

                    // Update job with model information
                    if (statusResult.containsKey("modelId")) {
                        job.setModelId((String) statusResult.get("modelId"));
                    }

                    if (statusResult.containsKey("accuracy")) {
                        job.setAccuracy(Double.parseDouble(statusResult.get("accuracy").toString()));
                    }

                    // Save the model information
                    modelStorageService.saveModel(job.getModelId(), "person_detection_model", job.getModelName());

                } else if ("FAILED".equals(status)) {
                    String errorMessage = (String) statusResult.getOrDefault("errorMessage", "Unknown error");
                    throw new RuntimeException("Python API training failed: " + errorMessage);
                }

                attempt++;
            }

            if (!completed) {
                throw new RuntimeException("Training job timed out");
            }

        } catch (Exception e) {
            logger.error("Error in person detection training with Python API", e);
            throw new RuntimeException("Error in person detection training with Python API: " + e.getMessage(), e);
        }
    }

    private void trainViolenceDetectionModelWithPythonApi(TrainingJob job, TrainingRequest request) {
        try {
            // Call Python API to submit training job
            Map<String, Object> apiResult = pythonApiClient.submitTrainingJob(
                    request.getDatasetPath(),
                    request.getModelName(),
                    "VIOLENCE_DETECTION",
                    request.getEpochs(),
                    request.getLearningRate()
            );

            // Get the Python API job ID
            String pythonJobId = (String) apiResult.get("jobId");
            if (pythonJobId == null) {
                throw new RuntimeException("Failed to get job ID from Python API");
            }

            // Update our job with the Python job ID for reference
            job.setModelId(pythonJobId);
            jobRepository.save(job);

            // Poll for job status until completion
            boolean completed = false;
            int maxAttempts = 60; // Maximum number of polling attempts
            int attempt = 0;

            while (!completed && attempt < maxAttempts) {
                // Wait before polling
                Thread.sleep(5000); // 5 seconds

                // Get job status from Python API
                Map<String, Object> statusResult = pythonApiClient.getTrainingJobStatus(pythonJobId);
                String status = (String) statusResult.get("status");

                // Update progress
                if (statusResult.containsKey("progress")) {
                    Double progress = Double.parseDouble(statusResult.get("progress").toString());
                    job.setProgress(progress);
                    jobRepository.save(job);
                }

                // Check if job is completed or failed
                if ("COMPLETED".equals(status)) {
                    completed = true;

                    // Update job with model information
                    if (statusResult.containsKey("modelId")) {
                        job.setModelId((String) statusResult.get("modelId"));
                    }

                    if (statusResult.containsKey("accuracy")) {
                        job.setAccuracy(Double.parseDouble(statusResult.get("accuracy").toString()));
                    }

                    // Save the model information
                    modelStorageService.saveModel(job.getModelId(), "violence_detection_model", job.getModelName());

                } else if ("FAILED".equals(status)) {
                    String errorMessage = (String) statusResult.getOrDefault("errorMessage", "Unknown error");
                    throw new RuntimeException("Python API training failed: " + errorMessage);
                }

                attempt++;
            }

            if (!completed) {
                throw new RuntimeException("Training job timed out");
            }

        } catch (Exception e) {
            logger.error("Error in violence detection training with Python API", e);
            throw new RuntimeException("Error in violence detection training with Python API: " + e.getMessage(), e);
        }
    }

    public TrainingJob getJobStatus(String jobId) {
        return jobRepository.findById(jobId).orElse(null);
    }

    public List<TrainingJob> getAllJobs() {
        return jobRepository.findAll();
    }

    public void cancelTrainingJob(String jobId) {
        TrainingJob job = jobRepository.findById(jobId).orElse(null);
        if (job != null && ("QUEUED".equals(job.getStatus()) || "RUNNING".equals(job.getStatus()))) {
            job.setStatus("CANCELLED");
            job.setCompletedAt(LocalDateTime.now());
            jobRepository.save(job);
        }
    }
}
