package com.examly.springapp.service;

import com.examly.springapp.model.AuditLog;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository repo) {
        this.auditLogRepository = repo;
    }

    public void logAction(User user, String ipAddress, String module, String operation, String details) {
        AuditLog log = new AuditLog(user, ipAddress, LocalDateTime.now(), module, operation, details);
        auditLogRepository.save(log);
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }
}
