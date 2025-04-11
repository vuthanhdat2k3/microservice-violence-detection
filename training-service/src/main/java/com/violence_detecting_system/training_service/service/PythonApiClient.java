package com.violence_detecting_system.training_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

@Service
public class PythonApiClient {
    private static final Logger logger = LoggerFactory.getLogger(PythonApiClient.class);

    @Value("${python.api.url:http://python-api:5000}")
    private String pythonApiUrl;

    private final RestTemplate restTemplate;

    public PythonApiClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Send a training request to the Python API
     *
     * @param datasetPath Path to the dataset
     * @param modelName Name for the model
     * @param modelType Type of model to train (PERSON_DETECTION or VIOLENCE_DETECTION)
     * @param epochs Number of training epochs
     * @param learningRate Learning rate for training
     * @return Map containing the training job information
     */
    public Map<String, Object> submitTrainingJob(String datasetPath, String modelName, String modelType,
                                                 Integer epochs, Double learningRate) {
        try {
            // Prepare headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Prepare the request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("datasetPath", datasetPath);
            requestBody.put("modelName", modelName);
            requestBody.put("modelType", modelType);
            requestBody.put("epochs", epochs);
            requestBody.put("learningRate", learningRate);

            // Create the request entity
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            // Send the request
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    pythonApiUrl + "/api/training/submit",
                    requestEntity,
                    Map.class
            );

            // Return the response
            @SuppressWarnings("unchecked")
            Map<String, Object> result = response.getBody();
            return result != null ? result : new HashMap<>();

        } catch (Exception e) {
            logger.error("Error calling Python API for training", e);
            throw new RuntimeException("Error calling Python API for training", e);
        }
    }

    /**
     * Upload a dataset to the Python API for training
     *
     * @param datasetFile The dataset file (zip or tar.gz)
     * @param modelName Name for the model
     * @param modelType Type of model to train
     * @param epochs Number of training epochs
     * @param learningRate Learning rate for training
     * @return Map containing the training job information
     */
    public Map<String, Object> uploadDatasetAndTrain(File datasetFile, String modelName, String modelType,
                                                     Integer epochs, Double learningRate) {
        try {
            // Prepare headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // Prepare the parts
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            FileSystemResource fileResource = new FileSystemResource(datasetFile);
            body.add("dataset", fileResource);
            body.add("modelName", modelName);
            body.add("modelType", modelType);
            if (epochs != null) body.add("epochs", epochs.toString());
            if (learningRate != null) body.add("learningRate", learningRate.toString());

            // Create the request entity
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // Send the request
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    pythonApiUrl + "/api/training/upload",
                    requestEntity,
                    Map.class
            );

            // Return the response
            @SuppressWarnings("unchecked")
            Map<String, Object> result = response.getBody();
            return result != null ? result : new HashMap<>();

        } catch (Exception e) {
            logger.error("Error calling Python API for dataset upload and training", e);
            throw new RuntimeException("Error calling Python API for dataset upload and training", e);
        }
    }

    /**
     * Get the status of a training job
     *
     * @param jobId The ID of the training job
     * @return Map containing the job status information
     */
    public Map<String, Object> getTrainingJobStatus(String jobId) {
        try {
            // Send the request
            ResponseEntity<Map> response = restTemplate.getForEntity(
                    pythonApiUrl + "/api/training/job/" + jobId,
                    Map.class
            );

            // Return the response
            @SuppressWarnings("unchecked")
            Map<String, Object> result = response.getBody();
            return result != null ? result : new HashMap<>();

        } catch (Exception e) {
            logger.error("Error calling Python API for job status", e);
            throw new RuntimeException("Error calling Python API for job status", e);
        }
    }

    /**
     * Create a temporary file from a byte array
     *
     * @param data The byte array data
     * @param prefix The file prefix
     * @param suffix The file suffix
     * @return The temporary file
     * @throws IOException If an I/O error occurs
     */
    public File createTempFile(byte[] data, String prefix, String suffix) throws IOException {
        Path tempFile = Files.createTempFile(prefix, suffix);
        Files.write(tempFile, data);
        File file = tempFile.toFile();
        file.deleteOnExit(); // Ensure the file is deleted when the JVM exits
        return file;
    }
}

