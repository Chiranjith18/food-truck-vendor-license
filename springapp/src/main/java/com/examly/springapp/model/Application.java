package com.examly.springapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class Application {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    private LocalDateTime submissionDate;

    @ManyToOne
    @JoinColumn(name = "assigned_reviewer_id")
    private User assignedReviewer;

    @ManyToOne
    @JoinColumn(name = "assigned_inspector_id")
    private User assignedInspector;

    private String rejectionComments;
    private String licenseNumber;
    private LocalDateTime licenseExpiryDate;

    public Application() {}

    public Application(User user, ApplicationStatus status, LocalDateTime submissionDate) {
        this.user = user;
        this.status = status;
        this.submissionDate = submissionDate;
    }

    public UUID getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public LocalDateTime getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(LocalDateTime submissionDate) { this.submissionDate = submissionDate; }
    public User getAssignedReviewer() { return assignedReviewer; }
    public void setAssignedReviewer(User assignedReviewer) { this.assignedReviewer = assignedReviewer; }
    public User getAssignedInspector() { return assignedInspector; }
    public void setAssignedInspector(User assignedInspector) { this.assignedInspector = assignedInspector; }
    public String getRejectionComments() { return rejectionComments; }
    public void setRejectionComments(String rejectionComments) { this.rejectionComments = rejectionComments; }
    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
    public LocalDateTime getLicenseExpiryDate() { return licenseExpiryDate; }
    public void setLicenseExpiryDate(LocalDateTime licenseExpiryDate) { this.licenseExpiryDate = licenseExpiryDate; }
}
