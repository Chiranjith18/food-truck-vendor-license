package com.examly.springapp.service;

import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Application;
import com.examly.springapp.model.Document;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.ApplicationRepository;
import com.examly.springapp.repository.DocumentRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public DocumentService(DocumentRepository documentRepository,
                           ApplicationRepository applicationRepository,
                           UserRepository userRepository) {
        this.documentRepository = documentRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    public Document uploadDocument(UUID applicationId, Long userId, MultipartFile file) throws IOException {
        if (file.isEmpty()) throw new RuntimeException("File cannot be empty");

        String fileType = file.getContentType();
        if (!(fileType.equals("application/pdf") || fileType.startsWith("image/"))) {
            throw new RuntimeException("Only PDF or Image files allowed");
        }
        if (file.getSize() > 5_000_000) {
            throw new RuntimeException("File too large, max 5MB");
        }

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        File storageDir = new File("uploads");
        if (!storageDir.exists()) storageDir.mkdirs();
        File dest = new File(storageDir, file.getOriginalFilename());
        file.transferTo(dest);

        Document doc = new Document();
        doc.setApplication(application);
        doc.setUploadedBy(user);
        doc.setFilename(file.getOriginalFilename());
        doc.setFileType(fileType);
        doc.setFileSize(file.getSize());
        doc.setUploadTimestamp(LocalDateTime.now());
        doc.setVirusScanned(true); // stub
        doc.setStorageType("FileSystem");

        return documentRepository.save(doc);
    }

    public List<Document> getDocumentsByApplication(UUID applicationId) {
        return documentRepository.findByApplicationId(applicationId);
    }
}
