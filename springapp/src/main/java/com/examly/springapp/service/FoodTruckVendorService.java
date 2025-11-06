package com.examly.springapp.service;

import com.examly.springapp.model.FoodTruckVendor;
import com.examly.springapp.exception.InvalidOperatingRegionException;
import com.examly.springapp.repository.FoodTruckVendorRepo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;

@Service
public class FoodTruckVendorService {

    private final FoodTruckVendorRepo repo;
    private final List<String> allowedRegions = Arrays.asList("Chennai", "Bangalore");

    public FoodTruckVendorService(FoodTruckVendorRepo repo) {
        this.repo = repo;
    }

    public FoodTruckVendor addVendor(FoodTruckVendor vendor) {
        validateOperatingRegion(vendor.getOperatingRegion());
        return repo.save(vendor);
    }

    public Page<FoodTruckVendor> getAllVendors(Pageable pageable) {
        return repo.findAll(pageable);
    }

    public void deleteVendor(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Vendor not found with id: " + id);
        }
        repo.deleteById(id);
    }

    public FoodTruckVendor updateVendor(Long id, FoodTruckVendor vendor) {
        FoodTruckVendor existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        validateOperatingRegion(vendor.getOperatingRegion());
        existing.setName(vendor.getName());
        existing.setCuisineSpecialties(vendor.getCuisineSpecialties());
        existing.setOperatingRegion(vendor.getOperatingRegion());
        existing.setMenuHighlights(vendor.getMenuHighlights());
        existing.setPhoneNumber(vendor.getPhoneNumber());
        return repo.save(existing);
    }

    private void validateOperatingRegion(String region) {
        if (!allowedRegions.contains(region)) {
            throw new InvalidOperatingRegionException(
                    "Invalid operating region. Must be either Chennai or Bangalore.");
        }
    }
}
