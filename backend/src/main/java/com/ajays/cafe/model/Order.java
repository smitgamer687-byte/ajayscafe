package com.ajays.cafe.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String customerName;
    
    @Column(nullable = false)
    private String phoneNumber;
    
    @Column(nullable = false)
    private Double total;
    
    @Column(nullable = false)
    private String status = "pending"; // pending, preparing, ready, completed, rejected
    
    @Column(nullable = false)
    private LocalDateTime orderDate;
    
    @Column(length = 1000)
    private String foodItems;
    
    @Column(length = 500)
    private String quantity;
    
    @PrePersist
    protected void onCreate() {
        orderDate = LocalDateTime.now();
    }
}