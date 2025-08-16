package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.entity.Driver;
import com.trafik.teklif_api.repository.DriverRepository;
import com.trafik.teklif_api.service.DriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {

  private final DriverService service;
  private final DriverRepository repo;

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public DriverResponse create(@Valid @RequestBody CreateDriverRequest req) {
    return service.create(req);
  }

  @PostMapping("/validate-tc")
  public TcValidationResponse validateTc(@RequestBody TcValidationRequest req) {
    return service.validateTc(req.tcNumber());
  }

  @GetMapping("/license-info")
  public LicenseInfoResponse licenseInfo(@RequestParam String tc) {
    return service.licenseInfo(tc);
  }

  @GetMapping
  public List<Driver> list() {
    return repo.findAll();
  }

  @GetMapping("/{id}")
  public Driver get(@PathVariable UUID id) {
    return repo.findById(id).orElseThrow();
  }

  @PutMapping("/{id}")
  public Driver update(@PathVariable UUID id, @Valid @RequestBody Driver d) {
    d.setId(id);
    return repo.save(d);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable UUID id) {
    repo.deleteById(id);
  }
}
