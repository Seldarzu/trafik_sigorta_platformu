package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.*;
import java.util.UUID;

public interface UserService {
    UserProfileResponse getProfile(UUID userId);
    UserProfileResponse updateProfile(UUID userId, UserProfileUpdateRequest req);
}
