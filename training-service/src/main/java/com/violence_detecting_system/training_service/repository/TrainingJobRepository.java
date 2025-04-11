package com.violence_detecting_system.training_service.repository;

import com.violence_detecting_system.training_service.model.TrainingJob;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class TrainingJobRepository {
    // In-memory storage for simplicity
    // In a real application, use a database like MongoDB or PostgreSQL
    private final Map<String, TrainingJob> jobs = new ConcurrentHashMap<>();

    public TrainingJob save(TrainingJob job) {
        jobs.put(job.getId(), job);
        return job;
    }

    public Optional<TrainingJob> findById(String id) {
        return Optional.ofNullable(jobs.get(id));
    }

    public List<TrainingJob> findAll() {
        return new ArrayList<>(jobs.values());
    }

    public void deleteById(String id) {
        jobs.remove(id);
    }
}
