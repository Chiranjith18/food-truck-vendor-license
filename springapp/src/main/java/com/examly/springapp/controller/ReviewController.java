package com.examly.springapp.controller;

import com.examly.springapp.model.Review;
import com.examly.springapp.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviewer/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/{applicationId}/add")
    public ResponseEntity<Review> addReview(@PathVariable UUID applicationId,
                                            @RequestParam Long reviewerId,
                                            @RequestBody Review review) {
        Review createdReview = reviewService.addReview(applicationId, reviewerId, review);
        return ResponseEntity.ok(createdReview);
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<List<Review>> getReviewsByApplication(@PathVariable UUID applicationId) {
        List<Review> reviews = reviewService.getReviewsByApplication(applicationId);
        return ResponseEntity.ok(reviews);
    }
}
