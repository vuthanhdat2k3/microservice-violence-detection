package com.detectionservice.model;

public class DetectionRequest {
    private String videoUrl;
    private String modelId;
    private String detectionType; // "PERSON_DETECTION" or "VIOLENCE_DETECTION"
    private Double confidenceThreshold;
    private Boolean saveResults;

    // Getters and setters
    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getModelId() {
        return modelId;
    }

    public void setModelId(String modelId) {
        this.modelId = modelId;
    }

    public String getDetectionType() {
        return detectionType;
    }

    public void setDetectionType(String detectionType) {
        this.detectionType = detectionType;
    }

    public Double getConfidenceThreshold() {
        return confidenceThreshold;
    }

    public void setConfidenceThreshold(Double confidenceThreshold) {
        this.confidenceThreshold = confidenceThreshold;
    }

    public Boolean getSaveResults() {
        return saveResults;
    }

    public void setSaveResults(Boolean saveResults) {
        this.saveResults = saveResults;
    }
}

