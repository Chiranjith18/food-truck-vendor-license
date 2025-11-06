package com.examly.springapp.controller;

import com.examly.springapp.model.Inspection;
import com.examly.springapp.service.InspectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/inspector/inspections")
public class InspectionController {

    private final InspectionService inspectionService;

    public InspectionController(InspectionService inspectionService) {
        this.inspectionService = inspectionService;
    }

    @PostMapping("/{applicationId}/add")
    public ResponseEntity<Inspection> addInspection(@PathVariable UUID applicationId,
                                                    @RequestParam Long inspectorId,
                                                    @RequestBody Inspection inspection) {
        Inspection createdInspection = inspectionService.addInspection(applicationId, inspectorId, inspection);
        return ResponseEntity.ok(createdInspection);
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<List<Inspection>> getInspectionsByApplication(@PathVariable UUID applicationId) {
        List<Inspection> inspections = inspectionService.getInspectionsByApplication(applicationId);
        return ResponseEntity.ok(inspections);
    }
}
