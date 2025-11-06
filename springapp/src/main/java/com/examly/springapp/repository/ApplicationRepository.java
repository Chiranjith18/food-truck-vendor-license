package com.examly.springapp.repository;

import com.examly.springapp.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    List<Application> findByUserId(Long userId);
    List<Application> findByAssignedReviewerId(Long reviewerId);
    List<Application> findByAssignedInspectorId(Long inspectorId);
}
