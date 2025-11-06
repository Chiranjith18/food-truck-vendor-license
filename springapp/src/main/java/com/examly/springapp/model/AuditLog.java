package com.examly.springapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class AuditLog {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String ipAddress;
    private LocalDateTime timestamp;
    private String module;
    private String operation;

    @Column(length = 2000)
    private String details;

    public AuditLog() {}

    public AuditLog(User user, String ipAddress, LocalDateTime timestamp,
                    String module, String operation, String details) {
        this.user = user;
        this.ipAddress = ipAddress;
        this.timestamp = timestamp;
        this.module = module;
        this.operation = operation;
        this.details = details;
    }

    public UUID getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public String getModule() { return module; }
    public void setModule(String module) { this.module = module; }
    public String getOperation() { return operation; }
    public void setOperation(String operation) { this.operation = operation; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
