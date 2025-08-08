// DriverService.java
package com.trafik.teklif_api.service;
import com.trafik.teklif_api.dto.*;

public interface DriverService {
    DriverResponse create(CreateDriverRequest req);
    TcValidationResponse validateTc(String tcNumber);
    LicenseInfoResponse licenseInfo(String tcNumber);
}