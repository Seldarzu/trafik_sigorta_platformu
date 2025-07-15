// src/main/java/com/trafik/teklif_api/controller/QuoteController.java
package com.trafik.teklif_api.controller;

import com.trafik.teklif_api.dto.*;
import com.trafik.teklif_api.service.QuoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quotes")
public class QuoteController {
  private final QuoteService svc;
  public QuoteController(QuoteService svc) { this.svc = svc; }

  @PostMapping
  public ResponseEntity<QuoteResponse> create(@RequestBody CreateQuoteRequest req) {
    var resp = svc.createQuote(req);
    return ResponseEntity.status(HttpStatus.CREATED).body(resp);
  }

  @GetMapping
  public List<QuoteResponse> list() {
    return svc.listAll();
  }
}
