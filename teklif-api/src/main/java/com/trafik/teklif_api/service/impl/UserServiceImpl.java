package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.repository.UserRepository;
import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.entity.User;
import com.trafik.teklif_api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository repo;

    @Override
    public UserProfileResponse getProfile(Long userId) {
        User u = repo.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User "+userId+" bulunamadı"));
        return new UserProfileResponse(u.getId(), u.getFirstName(), u.getLastName(), u.getEmail());
    }

    @Override
    public UserProfileResponse updateProfile(Long userId, UserProfileUpdateRequest req) {
        User u = repo.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User "+userId+" bulunamadı"));
        u.setFirstName(req.firstName());
        u.setLastName(req.lastName());
        u.setEmail(req.email());
        u = repo.save(u);
        return new UserProfileResponse(u.getId(), u.getFirstName(), u.getLastName(), u.getEmail());
    }
}
