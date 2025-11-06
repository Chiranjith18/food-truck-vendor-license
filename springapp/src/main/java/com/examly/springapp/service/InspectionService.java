package com.examly.springapp.service;

import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.*;
import com.examly.springapp.repository.ApplicationRepository;
import com.examly.springapp.repository.InspectionRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class InspectionService {

    private final InspectionRepository inspectionRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
   

    public InspectionService(InspectionRepository inspectionRepository, ApplicationRepository applicationRepository,
                             UserRepository userRepository) {
        this.inspectionRepository = inspectionRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    public Inspection addInspection(UUID applicationId, Long inspectorId, Inspection inspection) {
    Application app = applicationRepository.findById(applicationId)
        .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
    if (app.getStatus() != ApplicationStatus.INSPECTIONSCHEDULED) {
        throw new RuntimeException("Inspection can only be performed when scheduled");
    }
    User inspector = userRepository.findById(inspectorId)
        .orElseThrow(() -> new ResourceNotFoundException("Inspector not found"));
    if (inspector.getRole() != Role.INSPECTOR) {
        throw new RuntimeException("User is not an inspector");
    }
    inspection.setApplication(app);
    inspection.setInspector(inspector);
    inspection.setInspectionDate(LocalDateTime.now());
    // Set application status based on inspection result
    switch(inspection.getResult()) {
        case PASSED:
            app.setStatus(ApplicationStatus.INSPECTIONAPPROVED);
            break;
        case FAILED:
            app.setStatus(ApplicationStatus.INSPECTIONREJECTED);
            break;
        default:
            throw new RuntimeException("Invalid inspection result for application status flow");
    }
    applicationRepository.save(app);
    return inspectionRepository.save(inspection);
}


    public List<Inspection> getInspectionsByApplication(UUID applicationId) {
        return inspectionRepository.findByApplicationId(applicationId);
    }
}
