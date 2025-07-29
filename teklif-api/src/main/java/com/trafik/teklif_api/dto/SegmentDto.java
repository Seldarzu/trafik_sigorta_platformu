package com.trafik.teklif_api.dto;

public record SegmentDto(
    String segment,
    long count,
    double value,
    String color
) {}
