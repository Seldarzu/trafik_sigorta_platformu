package com.trafik.teklif_api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trafik.teklif_api.TestSecurityConfig;
import com.trafik.teklif_api.dto.CreateDriverRequest;
import com.trafik.teklif_api.dto.DriverResponse;
import com.trafik.teklif_api.dto.UpdateDriverRequest;
import com.trafik.teklif_api.dto.TcValidationResponse;
import com.trafik.teklif_api.dto.LicenseInfoResponse;
import com.trafik.teklif_api.entity.Driver;
import com.trafik.teklif_api.repository.DriverRepository;
import com.trafik.teklif_api.service.DriverService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = DriverController.class)
@Import(TestSecurityConfig.class)
class DriverControllerTest {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper om;

    @MockBean DriverService driverService;     // validateTc, licenseInfo, create
    @MockBean DriverRepository driverRepository; // list/get/update/delete

    private Driver entity() {
        Driver d = new Driver();
        d.setId(UUID.fromString("22222222-2222-2222-2222-222222222222"));
        d.setFirstName("Ali");
        d.setLastName("Kaya");
        d.setTcNumber("11111111111");
        d.setBirthDate(LocalDate.of(1990,1,1));
        d.setLicenseDate(LocalDate.of(2010,1,1));
        return d;
    }

    @Test @WithMockUser
    void list_get_update_delete_ok() throws Exception {
        // LIST
        Mockito.when(driverRepository.findAll()).thenReturn(List.of(entity()));
        mvc.perform(get("/api/drivers"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].firstName").value("Ali"));

        // GET
        Mockito.when(driverRepository.findById(entity().getId())).thenReturn(Optional.of(entity()));
        mvc.perform(get("/api/drivers/{id}", entity().getId()))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.tcNumber").value("11111111111"));

        // UPDATE (repo.save döner)
        Mockito.when(driverRepository.save(any(Driver.class))).thenAnswer(inv -> inv.getArgument(0));
        Driver up = entity();
        up.setLastName("Yılmaz");
        mvc.perform(put("/api/drivers/{id}", entity().getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(up)))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.lastName").value("Yılmaz"));

        // DELETE
        mvc.perform(delete("/api/drivers/{id}", entity().getId()))
           .andExpect(status().isNoContent());
        Mockito.verify(driverRepository).deleteById(entity().getId());
    }

    @Test @WithMockUser
    void create_validate_license_ok() throws Exception {
        // CREATE (service.create)
        DriverResponse resp = new DriverResponse(
                entity().getId(), "Ali","Kaya","11111111111",
                LocalDate.of(1990,1,1), LocalDate.of(2010,1,1),
                null, null, null, null, false,0,false,0
        );
        Mockito.when(driverService.create(any(CreateDriverRequest.class))).thenReturn(resp);

        CreateDriverRequest req = new CreateDriverRequest(
                "Ali","Kaya","11111111111",
                LocalDate.of(1990,1,1), LocalDate.of(2010,1,1),
                null,null,null,null,false,0,false,0
        );
        mvc.perform(post("/api/drivers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(req)))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.id").value(entity().getId().toString()));

        // validate-tc
        TcValidationResponse tcResp = Mockito.mock(TcValidationResponse.class);
        Mockito.when(driverService.validateTc(eq("11111111111"))).thenReturn(tcResp);
        mvc.perform(post("/api/drivers/validate-tc")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"tcNumber\":\"11111111111\"}"))
           .andExpect(status().isOk());

        // license-info
        LicenseInfoResponse licResp = Mockito.mock(LicenseInfoResponse.class);
        Mockito.when(driverService.licenseInfo(eq("11111111111"))).thenReturn(licResp);
        mvc.perform(get("/api/drivers/license-info").param("tc","11111111111"))
           .andExpect(status().isOk());
    }
}
