package com.examly.springapp.controller;

import com.examly.springapp.model.Document;
import com.examly.springapp.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/{applicationId}/upload")
    public ResponseEntity<Document> uploadDocument(@PathVariable UUID applicationId,
                                                   @RequestParam Long userId,
                                                   @RequestParam("file") MultipartFile file) throws IOException {
        Document uploaded = documentService.uploadDocument(applicationId, userId, file);
        return ResponseEntity.ok(uploaded);
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<List<Document>> getDocumentsByApplication(@PathVariable UUID applicationId) {
        List<Document> documents = documentService.getDocumentsByApplication(applicationId);
        return ResponseEntity.ok(documents);
    }
}
