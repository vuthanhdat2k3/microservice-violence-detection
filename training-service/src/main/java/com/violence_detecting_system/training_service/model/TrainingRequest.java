package com.violence_detecting_system.training_service.model;


import lombok.Data;

public class TrainingRequest {
    private String videoUrl; // URL của video để huấn luyện
    private String modelType; // Loại mô hình (movement)

    public TrainingRequest(String videoUrl, String modelType) {
        this.videoUrl = videoUrl;
        this.modelType = modelType;
    }

    public TrainingRequest() {
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getModelType() {
        return modelType;
    }

    public void setModelType(String modelType) {
        this.modelType = modelType;
    }
}