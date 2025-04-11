package com.detectionservice.service;

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
import org.springframework.web.multipart.MultipartFile;

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
     * Send a video file to the Python API for violence detection
     *
     * @param videoFile The video file to analyze
     * @return Map containing the detection results
     */
    public Map<String, Object> detectViolence(MultipartFile videoFile) {
        try {
            // Prepare headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // Prepare the parts
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            ByteArrayResource fileResource = new ByteArrayResource(videoFile.getBytes()) {
                @Override
                public String getFilename() {
                    return videoFile.getOriginalFilename();
                }
            };
            body.add("file", fileResource);

            // Create the request entity
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // Send the request
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    pythonApiUrl + "/api/predict",
                    requestEntity,
                    Map.class
            );

            // Return the response
            @SuppressWarnings("unchecked")
            Map<String, Object> result = response.getBody();
            return result != null ? result : new HashMap<>();

        } catch (IOException e) {
            logger.error("Error reading video file", e);
            throw new RuntimeException("Error processing video file", e);
        } catch (Exception e) {
            logger.error("Error calling Python API", e);
            throw new RuntimeException("Error calling Python API", e);
        }
    }

    /**
     * Send a video URL to the Python API for violence detection
     *
     * @param videoUrl The URL of the video to analyze
     * @return Map containing the detection results
     */
    public Map<String, Object> detectViolenceFromUrl(String videoUrl) {
        try {
            // Prepare headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Prepare the request body
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("videoUrl", videoUrl);

            // Create the request entity
            HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

            // Send the request
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    pythonApiUrl + "/api/predict_url",
                    requestEntity,
                    Map.class
            );

            // Return the response
            @SuppressWarnings("unchecked")
            Map<String, Object> result = response.getBody();
            return result != null ? result : new HashMap<>();

        } catch (Exception e) {
            logger.error("Error calling Python API for URL detection", e);
            throw new RuntimeException("Error calling Python API for URL detection", e);
        }
    }

    /**
     * Send a local video file to the Python API for violence detection
     *
     * @param videoFile The local file to analyze
     * @return Map containing the detection results
     */
    public Map<String, Object> detectViolenceFromFile(File videoFile) {
        try {
            // Prepare headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // Prepare the parts
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            FileSystemResource fileResource = new FileSystemResource(videoFile);
            body.add("file", fileResource);

            // Create the request entity
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // Send the request
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    pythonApiUrl + "/api/predict",
                    requestEntity,
                    Map.class
            );

            // Return the response
            @SuppressWarnings("unchecked")
            Map<String, Object> result = response.getBody();
            return result != null ? result : new HashMap<>();

        } catch (Exception e) {
            logger.error("Error calling Python API with file", e);
            throw new RuntimeException("Error calling Python API with file", e);
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
