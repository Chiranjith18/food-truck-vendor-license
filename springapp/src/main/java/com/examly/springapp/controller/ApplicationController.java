package com.examly.springapp.controller;

import com.examly.springapp.model.Application;
import com.examly.springapp.model.ApplicationStatus;
import com.examly.springapp.model.Role;
import com.examly.springapp.model.User;
import com.examly.springapp.service.ApplicationService;
import com.examly.springapp.service.NotificationService;
import com.examly.springapp.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private NotificationService notificationService;

    private final ApplicationService applicationService;
    private final UserService userService;

    public ApplicationController(ApplicationService applicationService, UserService userService) {
        this.applicationService = applicationService;
        this.userService = userService;
    }

    @PostMapping("/submit")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<Application> submitApplication(@AuthenticationPrincipal UserDetails userDetails,
                                                         @RequestBody(required = false) Application application) {
        User user = userService.findByEmail(userDetails.getUsername());
        Application saved = applicationService.submitApplication(user.getId(), application == null ? new Application() : application);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Application>> getApplications(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername());
        Role role = user.getRole();
        Long userId = user.getId();
        List<Application> applications = applicationService.getApplicationsByUserRole(role, userId);
        return ResponseEntity.ok(applications);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Application> updateStatus(@PathVariable UUID id, @RequestParam ApplicationStatus status) {
        Application updated = applicationService.updateApplicationStatus(id, status);
        // Notify vendor about status change
        notificationService.notifyVendorApplicationStatus(updated.getUser().getId(), "Status changed to: " + status.name());

        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/assignReviewer")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Application> assignReviewer(@PathVariable UUID id, @RequestParam Long reviewerId) {
        Application updated = applicationService.assignReviewer(id, reviewerId);
        notificationService.notifyReviewerAssignment(reviewerId, id);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/assignInspector")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Application> assignInspector(@PathVariable UUID id, @RequestParam Long inspectorId) {
        Application updated = applicationService.assignInspector(id, inspectorId);
         notificationService.notifyInspectorAssignment(inspectorId, id);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/issueLicense")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Application> issueLicense(@PathVariable UUID id) {
        Application updated = applicationService.issueLicense(id);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/renew")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<Application> renewLicense(@PathVariable UUID id) {
        Application renewed = applicationService.renewApplication(id);
        return ResponseEntity.ok(renewed);
    }
}
