package com.trafik.teklif_api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trafik.teklif_api.TestSecurityConfig;
import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.service.VehicleService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(VehicleController.class)
@Import(TestSecurityConfig.class)
class VehicleControllerTest {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper om;

    @MockBean VehicleService vehicleService;

    private VehicleResponse sample() {
        return new VehicleResponse(
                UUID.fromString("11111111-1111-1111-1111-111111111111"),
                "34ABC123", "Ford", "Focus", 2020, "1.5",
                "GASOLINE", "PERSONAL", "34"
        );
    }

    @Test @WithMockUser
    void getById_ok() throws Exception {
        Mockito.when(vehicleService.getById(any(UUID.class))).thenReturn(sample());

        mvc.perform(get("/api/vehicles/{id}", sample().id()))
           .andExpect(status().isOk())
           .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
           .andExpect(jsonPath("$.plateNumber").value("34ABC123"));
    }

    @Test @WithMockUser
    void list_ok() throws Exception {
        Mockito.when(vehicleService.getAll()).thenReturn(List.of(sample()));

        mvc.perform(get("/api/vehicles"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].brand").value("Ford"));
    }

    @Test @WithMockUser
    void create_ok() throws Exception {
        var req = new CreateVehicleRequest("34ABC123","Ford","Focus",2020,"1.5","GASOLINE","PERSONAL","34");
        Mockito.when(vehicleService.create(any(CreateVehicleRequest.class))).thenReturn(sample());

        mvc.perform(post("/api/vehicles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(req)))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.id").exists());
    }

    @Test @WithMockUser
    void update_ok() throws Exception {
        var req = new UpdateVehicleRequest("34ABC123","Ford","Fiesta",2021,"1.0","GASOLINE","PERSONAL","34");
        var updated = new VehicleResponse(sample().id(), "34ABC123","Ford","Fiesta",2021,"1.0","GASOLINE","PERSONAL","34");
        Mockito.when(vehicleService.update(any(UUID.class), any(UpdateVehicleRequest.class))).thenReturn(updated);

        mvc.perform(put("/api/vehicles/{id}", sample().id())
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(req)))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.model").value("Fiesta"));
    }

    @Test @WithMockUser
    void delete_ok() throws Exception {
        mvc.perform(delete("/api/vehicles/{id}", sample().id()))
           .andExpect(status().isNoContent());
        Mockito.verify(vehicleService).delete(sample().id());
    }

    // *** BURASI DÜZELTİLDİ ***
    @Test @WithMockUser
    void validatePlate_ok() throws Exception {
        PlateValidationResponse resp = Mockito.mock(PlateValidationResponse.class);
        Mockito.when(vehicleService.validatePlate("34ABC123")).thenReturn(resp);

        mvc.perform(get("/api/vehicles/validate-plate").param("plate","34ABC123"))
           .andExpect(status().isOk());
    }

    @Test @WithMockUser
    void modelsByBrand_ok() throws Exception {
        Mockito.when(vehicleService.getModelsByBrand("Ford"))
               .thenReturn(List.of(new VehicleModelResponse(UUID.randomUUID(),"Focus"),
                                   new VehicleModelResponse(UUID.randomUUID(),"Fiesta")));

        mvc.perform(get("/api/vehicles/models/{brand}","Ford"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[1].name").value("Fiesta"));
    }

    @Test @WithMockUser
    void brands_ok() throws Exception {
        Mockito.when(vehicleService.getBrands())
               .thenReturn(List.of(new VehicleBrandResponse(UUID.randomUUID(),"Ford"),
                                   new VehicleBrandResponse(UUID.randomUUID(),"Renault")));

        mvc.perform(get("/api/vehicles/brands"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].name").value("Ford"));
    }
}
