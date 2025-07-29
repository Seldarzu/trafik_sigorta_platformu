package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;

    @GetMapping("/{id}")
    public UserProfileResponse get(@PathVariable("id") Long id) {
        return service.getProfile(id);
    }

    @PutMapping("/{id}")
    public UserProfileResponse update(
      @PathVariable("id") Long id,
      @Valid @RequestBody UserProfileUpdateRequest req
    ) {
        return service.updateProfile(id, req);
    }
}
