package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.*;

public interface UserService {
    UserProfileResponse getProfile(Long userId);
    UserProfileResponse updateProfile(Long userId, UserProfileUpdateRequest req);
}
