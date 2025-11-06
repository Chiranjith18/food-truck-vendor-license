package com.examly.springapp.service;

import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.*;
import com.examly.springapp.repository.ApplicationRepository;
import com.examly.springapp.repository.ReviewRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
   

    public ReviewService(ReviewRepository reviewRepository, ApplicationRepository applicationRepository,
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
      
    }

    public Review addReview(UUID applicationId, Long reviewerId, Review review) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer not found"));

        if (reviewer.getRole() != Role.REVIEWER) {
            throw new IllegalArgumentException("User is not a reviewer");
        }

        review.setApplication(app);
        review.setReviewer(reviewer);
        review.setReviewDate(LocalDateTime.now());

        if (review.getStatus() == ReviewStatus.REVIEW_REJECTED && (review.getComments() == null || review.getComments().isBlank())) {
            throw new RuntimeException("Comments required when rejecting an application");
        }

       // Inside addReview method for ReviewService.java
switch(review.getStatus()) {
    case REVIEW_APPROVED:
        app.setStatus(ApplicationStatus.REVIEW_APPROVED);
        break;
    case REVIEW_REJECTED:
        app.setStatus(ApplicationStatus.REVIEW_REJECTED);
        app.setRejectionComments(review.getComments());
        break;
}
applicationRepository.save(app);



        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByApplication(UUID applicationId) {
        return reviewRepository.findByApplicationId(applicationId);
    }
}
