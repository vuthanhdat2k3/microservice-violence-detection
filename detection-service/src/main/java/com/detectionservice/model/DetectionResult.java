package com.detectionservice.model;

public class DetectionResult {
    private boolean isViolent;
    private String description;
    private double confidence;

    public DetectionResult(boolean isViolent, String description, double confidence) {
        this.isViolent = isViolent;
        this.description = description;
        this.confidence = confidence;
    }

    public DetectionResult() {
    }

    public boolean isViolent() {
        return isViolent;
    }

    public void setViolent(boolean violent) {
        isViolent = violent;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }
}