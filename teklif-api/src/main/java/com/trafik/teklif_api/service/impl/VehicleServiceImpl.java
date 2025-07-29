package com.trafik.teklif_api.service.impl;

import com.trafik.teklif_api.repository.VehicleRepository;
import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.entity.Vehicle;
import com.trafik.teklif_api.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.beans.BeanUtils;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {
    private final VehicleRepository repo;

    @Override
    public VehicleResponse create(CreateVehicleRequest req) {
        Vehicle v = new Vehicle();
        BeanUtils.copyProperties(req, v);
        Vehicle saved = repo.save(v);
        return toDto(saved);
    }

    @Override
    public List<VehicleResponse> getAll() {
        return repo.findAll()
                   .stream()
                   .map(this::toDto)
                   .collect(Collectors.toList());
    }

    @Override
    public VehicleResponse getById(Long id) {
        return repo.findById(id)
            .map(this::toDto)
            .orElseThrow(() -> new EntityNotFoundException("Vehicle "+id+" bulunamadı"));
    }

    @Override
    public VehicleResponse update(Long id, UpdateVehicleRequest req) {
        Vehicle v = repo.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Vehicle "+id+" bulunamadı"));
        BeanUtils.copyProperties(req, v);
        Vehicle updated = repo.save(v);
        return toDto(updated);
    }

    @Override
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new EntityNotFoundException("Vehicle "+id+" bulunamadı");
        }
        repo.deleteById(id);
    }

    private VehicleResponse toDto(Vehicle v) {
        return new VehicleResponse(
            v.getId(),
            v.getPlateNumber(),
            v.getBrand(),
            v.getModel(),
            v.getYear()
        );
    }
}
