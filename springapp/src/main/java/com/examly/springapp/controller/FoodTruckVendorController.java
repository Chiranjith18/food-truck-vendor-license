package com.examly.springapp.controller;

import com.examly.springapp.model.FoodTruckVendor;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.FoodTruckVendorRepo;
import com.examly.springapp.service.FoodTruckVendorService;
import com.examly.springapp.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class FoodTruckVendorController {

    private final FoodTruckVendorService service;
    private final UserService userService;
    private final FoodTruckVendorRepo foodTruckVendorRepo;

    public FoodTruckVendorController(FoodTruckVendorService service, UserService userService, FoodTruckVendorRepo foodTruckVendorRepo) {
        this.service = service;
        this.userService = userService;
        this.foodTruckVendorRepo = foodTruckVendorRepo;
    }

    @PostMapping("/api/vendors")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<FoodTruckVendor> addVendor(@AuthenticationPrincipal UserDetails userDetails,
                                                     @RequestBody FoodTruckVendor vendor) {
        User user = userService.findByEmail(userDetails.getUsername());
        vendor.setUser(user);
        return new ResponseEntity<>(service.addVendor(vendor), HttpStatus.CREATED);
    }

    @GetMapping("/api/vendors/all")
@PreAuthorize("hasAnyRole('ADMIN','REVIEWER','INSPECTOR','SUPER_ADMIN')")
public ResponseEntity<List<FoodTruckVendor>> getAllVendorsPlain() {
    List<FoodTruckVendor> vendors = foodTruckVendorRepo.findAll();
    return ResponseEntity.ok(vendors);
}


    @PutMapping("/api/vendors/{id}")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<FoodTruckVendor> updateVendor(@PathVariable Long id,
                                                        @RequestBody FoodTruckVendor vendor,
                                                        @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername());
        vendor.setUser(user);
        return ResponseEntity.ok(service.updateVendor(id, vendor));
    }

    @GetMapping("/api/vendors/me")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<FoodTruckVendor> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername());
        FoodTruckVendor vendor = foodTruckVendorRepo.findByUserId(user.getId());
        if (vendor != null) return ResponseEntity.ok(vendor);
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/api/vendors")
    @PreAuthorize("hasAnyRole('ADMIN','REVIEWER','INSPECTOR','SUPER_ADMIN')")
    public ResponseEntity<Page<FoodTruckVendor>> getAllVendors(@RequestParam(defaultValue = "0") int page,
                                                               @RequestParam(defaultValue = "10") int size,
                                                               @RequestParam(defaultValue = "name") String sortBy,
                                                               @RequestParam(defaultValue = "asc") String direction) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        return ResponseEntity.ok(service.getAllVendors(pageable));
    }
    //hasRole
    @DeleteMapping("/api/vendors/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<Void> deleteVendor(@PathVariable Long id) {
        service.deleteVendor(id);
        return ResponseEntity.noContent().build();
    }
}
