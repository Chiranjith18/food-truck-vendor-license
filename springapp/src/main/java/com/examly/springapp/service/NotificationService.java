package com.examly.springapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void notifyVendorApplicationStatus(Long vendorId, String message) {
        String destination = "/queue/application-status-" + vendorId;
        NotificationPayload payload = new NotificationPayload(message, "INFO");
        messagingTemplate.convertAndSend(destination, payload);
    }

    public void notifyReviewerAssignment(Long reviewerId, UUID applicationId) {
        String destination = "/queue/application-assignment-" + reviewerId;
        NotificationPayload payload = new NotificationPayload("A new application #" + applicationId + " has been assigned to you.", "SUCCESS");
        messagingTemplate.convertAndSend(destination, payload);
    }

    public void notifyInspectorAssignment(Long inspectorId, UUID applicationId) {
        String destination = "/queue/application-assignment-" + inspectorId;
        NotificationPayload payload = new NotificationPayload("A new application #" + applicationId + " has been assigned to you.", "SUCCESS");
        messagingTemplate.convertAndSend(destination, payload);
    }

    private static class NotificationPayload {
        private String message;
        private String type;

        public NotificationPayload(String message, String type) {
            this.message = message;
            this.type = type;
        }

        public String getMessage() { return message; }
        public String getType() { return type; }
    }
}
