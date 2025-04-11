package com.detectionservice.service;

import com.detectionservice.model.DetectionRequest;
import com.detectionservice.model.DetectionResult;
import com.detectionservice.repository.DetectionResultRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
public class DetectionService {
    private static final Logger logger = LoggerFactory.getLogger(DetectionService.class);

    @Autowired
    private DetectionResultRepository resultRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ModelLoaderService modelLoaderService;

    @Autowired
    private PythonApiClient pythonApiClient;

    public DetectionResult detectObjects(DetectionRequest request) {
        // Validate request
        if (request.getVideoUrl() == null || request.getModelId() == null || request.getDetectionType() == null) {
            DetectionResult result = new DetectionResult();
            result.setId(UUID.randomUUID().toString());
            result.setStatus("FAILED");
            result.setErrorMessage("Missing required parameters: videoUrl, modelId, or detectionType");
            result.setTimestamp(LocalDateTime.now());
            return result;
        }

        // Create a new detection result
        DetectionResult result = new DetectionResult();
        result.setId(UUID.randomUUID().toString());
        result.setVideoUrl(request.getVideoUrl());
        result.setModelId(request.getModelId());
        result.setDetectionType(request.getDetectionType());
        result.setTimestamp(LocalDateTime.now());
        result.setStatus("PROCESSING");

        // Save the initial result
        resultRepository.save(result);

        // Start the detection process asynchronously
        startDetection(result.getId(), request);

        return result;
    }

    @Async
    public CompletableFuture<Void> startDetection(String resultId, DetectionRequest request) {
        DetectionResult result = resultRepository.findById(resultId).orElse(null);
        if (result == null) {
            logger.error("Detection result not found: {}", resultId);
            return CompletableFuture.completedFuture(null);
        }

        try {
            // Load the model
            byte[] modelData = modelLoaderService.loadModel(request.getModelId());
            if (modelData == null) {
                throw new RuntimeException("Model not found: " + request.getModelId());
            }

            // Perform the actual detection based on detection type
            if ("PERSON_DETECTION".equals(request.getDetectionType())) {
                detectPersons(result, request);
            } else if ("VIOLENCE_DETECTION".equals(request.getDetectionType())) {
                // Use Python API for violence detection
                detectViolenceWithPythonApi(result, request);
            } else {
                throw new IllegalArgumentException("Unsupported detection type: " + request.getDetectionType());
            }

            // Update result status to completed
            result.setStatus("COMPLETED");
            resultRepository.save(result);

        } catch (Exception e) {
            logger.error("Detection failed for result {}: {}", resultId, e.getMessage(), e);

            // Update result status to failed
            result.setStatus("FAILED");
            result.setErrorMessage(e.getMessage());
            resultRepository.save(result);
        }

        return CompletableFuture.completedFuture(null);
    }

    private void detectPersons(DetectionResult result, DetectionRequest request) {
        // Simulate video processing and person detection
        try {
            Thread.sleep(2000); // Simulate processing time

            // Generate simulated detection results
            Random random = new Random();
            List<DetectionResult.Detection> detections = new ArrayList<>();

            // Simulate 5-10 person detections
            int numDetections = 5 + random.nextInt(6);
            for (int i = 0; i < numDetections; i++) {
                DetectionResult.Detection detection = new DetectionResult.Detection();
                detection.setObjectType("person");
                detection.setConfidence(0.7 + random.nextDouble() * 0.3); // 0.7-1.0 confidence

                DetectionResult.BoundingBox box = new DetectionResult.BoundingBox();
                box.setX(random.nextDouble() * 0.8);
                box.setY(random.nextDouble() * 0.8);
                box.setWidth(0.1 + random.nextDouble() * 0.2);
                box.setHeight(0.2 + random.nextDouble() * 0.3);
                detection.setBoundingBox(box);

                detection.setTimestamp(random.nextDouble() * 60.0); // 0-60 seconds in the video

                detections.add(detection);
            }

            result.setDetections(detections);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Person detection interrupted", e);
        }
    }

    private void detectViolenceWithPythonApi(DetectionResult result, DetectionRequest request) {
        try {
            // Download the video from the URL if needed
            File videoFile = null;
            if (request.getVideoUrl().startsWith("http")) {
                // Download the video from URL
                URL url = new URL(request.getVideoUrl());
                Path tempFile = Files.createTempFile("video-", ".mp4");
                Files.copy(url.openStream(), tempFile, StandardCopyOption.REPLACE_EXISTING);
                videoFile = tempFile.toFile();
                videoFile.deleteOnExit();
            } else {
                // Assume it's a local file path
                videoFile = new File(request.getVideoUrl());
                if (!videoFile.exists()) {
                    throw new RuntimeException("Video file not found: " + request.getVideoUrl());
                }
            }

            // Call the Python API
            Map<String, Object> apiResult = pythonApiClient.detectViolenceFromFile(videoFile);

            // Process the API result
            boolean isFight = Boolean.parseBoolean(apiResult.getOrDefault("fight", "false").toString());
            String percentageStr = apiResult.getOrDefault("percentageoffight", "0").toString();
            double percentage = Double.parseDouble(percentageStr);

            // Create detection result
            List<DetectionResult.Detection> detections = new ArrayList<>();

            if (isFight) {
                DetectionResult.Detection detection = new DetectionResult.Detection();
                detection.setObjectType("violent_action");
                detection.setConfidence(percentage / 100.0); // Convert percentage to 0-1 range

                DetectionResult.BoundingBox box = new DetectionResult.BoundingBox();
                box.setX(0.1);
                box.setY(0.1);
                box.setWidth(0.8);
                box.setHeight(0.8);
                detection.setBoundingBox(box);

                detection.setTimestamp(0.0); // We don't know the exact timestamp

                detections.add(detection);
            }

            result.setDetections(detections);

            // Clean up the temporary file if we downloaded it
            if (request.getVideoUrl().startsWith("http") && videoFile != null) {
                videoFile.delete();
            }

        } catch (Exception e) {
            logger.error("Error in violence detection with Python API", e);
            throw new RuntimeException("Error in violence detection with Python API: " + e.getMessage(), e);
        }
    }

    public DetectionResult getDetectionResult(String resultId) {
        return resultRepository.findById(resultId).orElse(null);
    }

    public List<DetectionResult> getAllResults() {
        return resultRepository.findAll();
    }
}

