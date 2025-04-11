package com.detectionservice.repository;

import com.detectionservice.model.DetectionResult;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class DetectionResultRepository {
    // In-memory storage for simplicity
    // In a real application, use a database like MongoDB or PostgreSQL
    private final Map<String, DetectionResult> results = new ConcurrentHashMap<>();

    public DetectionResult save(DetectionResult result) {
        results.put(result.getId(), result);
        return result;
    }

    public Optional<DetectionResult> findById(String id) {
        return Optional.ofNullable(results.get(id));
    }

    public List<DetectionResult> findAll() {
        return new ArrayList<>(results.values());
    }

    public void deleteById(String id) {
        results.remove(id);
    }
}
