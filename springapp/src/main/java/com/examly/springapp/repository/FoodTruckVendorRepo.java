package com.examly.springapp.repository;

import com.examly.springapp.model.FoodTruckVendor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodTruckVendorRepo extends JpaRepository<FoodTruckVendor, Long> {
    FoodTruckVendor findByUserId(Long userId);
}
