package com.detectionservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ModelLoaderService {
    private static final Logger logger = LoggerFactory.getLogger(ModelLoaderService.class);

    @Value("${model.cache.path:/tmp/model-cache}")
    private String modelCachePath;

    @Value("${training.service.url:http://training-service:8081}")
    private String trainingServiceUrl;

    @Autowired
    private RestTemplate restTemplate;

    // In-memory cache for loaded models
    private final Map<String, byte[]> modelCache = new ConcurrentHashMap<>();

    public byte[] loadModel(String modelId) {
        // Check if the model is already in memory cache
        if (modelCache.containsKey(modelId)) {
            logger.debug("Model found in memory cache: {}", modelId);
            return modelCache.get(modelId);
        }

        // Check if the model is in the file cache
        try {
            Path modelPath = Paths.get(modelCachePath, modelId + ".json");
            if (Files.exists(modelPath)) {
                logger.debug("Model found in file cache: {}", modelId);
                byte[] modelData = Files.readAllBytes(modelPath);
                modelCache.put(modelId, modelData); // Update memory cache
                return modelData;
            }
        } catch (IOException e) {
            logger.warn("Failed to read model from file cache: {}", e.getMessage());
        }

        // Fetch the model from the training service
        try {
            logger.debug("Fetching model from training service: {}", modelId);
            ResponseEntity<byte[]> response = restTemplate.getForEntity(
                    trainingServiceUrl + "/api/models/" + modelId,
                    byte[].class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                byte[] modelData = response.getBody();

                // Save to file cache
                try {
                    Path cacheDir = Paths.get(modelCachePath);
                    if (!Files.exists(cacheDir)) {
                        Files.createDirectories(cacheDir);
                    }

                    Path modelPath = cacheDir.resolve(modelId + ".json");
                    Files.write(modelPath, modelData);
                    logger.debug("Model saved to file cache: {}", modelPath);
                } catch (IOException e) {
                    logger.warn("Failed to save model to file cache: {}", e.getMessage());
                }

                // Update memory cache
                modelCache.put(modelId, modelData);
                return modelData;
            } else {
                logger.error("Failed to fetch model from training service: {}", response.getStatusCode());
                return null;
            }
        } catch (Exception e) {
            logger.error("Error fetching model from training service: {}", e.getMessage(), e);
            return null;
        }
    }

    public void invalidateCache(String modelId) {
        modelCache.remove(modelId);

        try {
            Path modelPath = Paths.get(modelCachePath, modelId + ".json");
            if (Files.exists(modelPath)) {
                Files.delete(modelPath);
                logger.debug("Model removed from file cache: {}", modelId);
            }
        } catch (IOException e) {
            logger.warn("Failed to delete model from file cache: {}", e.getMessage());
        }
    }
}
