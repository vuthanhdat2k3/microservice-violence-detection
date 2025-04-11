package com.violence_detecting_system.training_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ModelStorageService {
    private static final Logger logger = LoggerFactory.getLogger(ModelStorageService.class);

    @Value("${model.storage.path:/tmp/models}")
    private String modelStoragePath;

    public void saveModel(String modelId, String modelType, String modelName) {
        try {
            // Create the model directory if it doesn't exist
            Path modelDir = Paths.get(modelStoragePath);
            if (!Files.exists(modelDir)) {
                Files.createDirectories(modelDir);
            }

            // Create a model metadata file (in a real implementation, you'd save the actual model)
            Path modelPath = modelDir.resolve(modelId + ".json");
            String metadata = String.format(
                    "{\n" +
                            "  \"id\": \"%s\",\n" +
                            "  \"type\": \"%s\",\n" +
                            "  \"name\": \"%s\",\n" +
                            "  \"createdAt\": \"%s\"\n" +
                            "}",
                    modelId, modelType, modelName, java.time.LocalDateTime.now()
            );

            Files.write(modelPath, metadata.getBytes());
            logger.info("Model saved: {}", modelPath);

        } catch (IOException e) {
            logger.error("Failed to save model: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save model", e);
        }
    }

    public byte[] loadModel(String modelId) {
        try {
            Path modelPath = Paths.get(modelStoragePath, modelId + ".json");
            if (!Files.exists(modelPath)) {
                logger.error("Model not found: {}", modelId);
                return null;
            }

            return Files.readAllBytes(modelPath);

        } catch (IOException e) {
            logger.error("Failed to load model: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to load model", e);
        }
    }

    public boolean deleteModel(String modelId) {
        try {
            Path modelPath = Paths.get(modelStoragePath, modelId + ".json");
            if (!Files.exists(modelPath)) {
                logger.warn("Model not found for deletion: {}", modelId);
                return false;
            }

            Files.delete(modelPath);
            logger.info("Model deleted: {}", modelId);
            return true;

        } catch (IOException e) {
            logger.error("Failed to delete model: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete model", e);
        }
    }

    public File getModelFile(String modelId) {
        Path modelPath = Paths.get(modelStoragePath, modelId + ".json");
        if (!Files.exists(modelPath)) {
            logger.error("Model file not found: {}", modelId);
            return null;
        }
        return modelPath.toFile();
    }
}
