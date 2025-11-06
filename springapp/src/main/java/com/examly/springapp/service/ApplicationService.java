package com.examly.springapp.service;

import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.*;
import com.examly.springapp.repository.ApplicationRepository;
import com.examly.springapp.repository.FoodTruckVendorRepo;
import com.examly.springapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final FoodTruckVendorRepo vendorRepo;
   

    public ApplicationService(ApplicationRepository applicationRepository, UserRepository userRepository,  FoodTruckVendorRepo vendorRepo) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.vendorRepo = vendorRepo;
    }

    public Application submitApplication(Long userId, Application application) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (vendorRepo.findByUserId(userId) == null) {
            throw new RuntimeException("Vendor must complete FoodTruckVendor profile before submitting application.");
        }
        application.setUser(user);
        application.setStatus(ApplicationStatus.SUBMITTED);
        application.setSubmissionDate(LocalDateTime.now());
        Application saved = applicationRepository.save(application);
        return saved;
    }

  public Application updateApplicationStatus(UUID applicationId, ApplicationStatus status) {
    Application application = applicationRepository.findById(applicationId).orElseThrow(() -> new ResourceNotFoundException("Application not found"));

    // Only admin can set these final statuses and only in correct states
    if (status == ApplicationStatus.APPROVED) {
        if (application.getStatus() == ApplicationStatus.INSPECTIONAPPROVED) {
            application.setStatus(ApplicationStatus.APPROVED);
        } else {
            throw new RuntimeException("Cannot approve; review/inspection not passed");
        }
    } 
    else if (status == ApplicationStatus.REJECTED) {
        if (application.getStatus() == ApplicationStatus.REVIEW_REJECTED
         || application.getStatus() == ApplicationStatus.INSPECTIONREJECTED) {
            application.setStatus(ApplicationStatus.REJECTED);
        } else {
            throw new RuntimeException("Cannot reject; must be rejected in review or inspection");
        }
    } else {
        throw new RuntimeException("Invalid status transition by admin");
    }

    Application saved = applicationRepository.save(application);
    
    return saved;
}


    

    public List<Application> getApplicationsByUserRole(Role role, Long userId) {
        if (role == Role.VENDOR) {
            return applicationRepository.findByUserId(userId);
        } else if (role == Role.REVIEWER) {
            return applicationRepository.findByAssignedReviewerId(userId);
        } else if (role == Role.INSPECTOR) {
            return applicationRepository.findByAssignedInspectorId(userId);
        } else if (role == Role.ADMIN) {
            return applicationRepository.findAll();
        }
        throw new RuntimeException("Role not supported");
    }

    public Application assignReviewer(UUID applicationId, Long reviewerId) {
    Application application = applicationRepository.findById(applicationId)
        .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
    User reviewer = userRepository.findById(reviewerId)
        .orElseThrow(() -> new ResourceNotFoundException("Reviewer not found"));
    if (reviewer.getRole() != Role.REVIEWER) {
        throw new RuntimeException("User is not a reviewer");
    }
    application.setAssignedReviewer(reviewer);
    application.setStatus(ApplicationStatus.INREVIEW);
    Application saved = applicationRepository.save(application);
    
    return saved;
}


   public Application assignInspector(UUID applicationId, Long inspectorId) {
    Application application = applicationRepository.findById(applicationId)
        .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
    if (application.getStatus() != ApplicationStatus.REVIEW_APPROVED) {
        throw new RuntimeException("Cannot assign inspector unless review is approved");
    }
    User inspector = userRepository.findById(inspectorId)
        .orElseThrow(() -> new ResourceNotFoundException("Inspector not found"));
    if (inspector.getRole() != Role.INSPECTOR) {
        throw new RuntimeException("User is not an inspector");
    }
    application.setAssignedInspector(inspector);
    application.setStatus(ApplicationStatus.INSPECTIONSCHEDULED);
    Application saved = applicationRepository.save(application);
   
    return saved;
}


    public Application issueLicense(UUID applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (application.getStatus() != ApplicationStatus.APPROVED) {
            throw new RuntimeException("License can only be issued for approved applications");
        }

        application.setLicenseNumber("LIC-" + UUID.randomUUID().toString().substring(0, 8));
        application.setLicenseExpiryDate(LocalDateTime.now().plusYears(1));
        application.setStatus(ApplicationStatus.LICENSE_ISSUED);

     

        return applicationRepository.save(application);
    }

    public Application renewApplication(UUID applicationId) {
        Application oldApp = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (oldApp.getStatus() != ApplicationStatus.LICENSE_ISSUED) {
            throw new RuntimeException("Only issued licenses can be renewed");
        }

        Application renewal = new Application();
        renewal.setUser(oldApp.getUser());
        renewal.setStatus(ApplicationStatus.RENEWAL_REQUESTED);
        renewal.setSubmissionDate(LocalDateTime.now());

        return applicationRepository.save(renewal);
    }
}
