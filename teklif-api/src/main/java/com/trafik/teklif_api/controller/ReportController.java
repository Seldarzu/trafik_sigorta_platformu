package com.trafik.teklif_api.controller;
import org.springframework.http.*; import org.springframework.web.bind.annotation.*;
import java.nio.charset.StandardCharsets;

@RestController @RequestMapping("/api/reports")
public class ReportController {
  @PostMapping("/generate") public String generate(){ return "report_generated_id"; }
  @GetMapping("/{reportId}") public String get(@PathVariable String reportId){ return "{ \"id\": \"" + reportId + "\", \"status\": \"ready\" }"; }
  @GetMapping("/{reportId}/download") public ResponseEntity<byte[]> download(@PathVariable String reportId){
    byte[] pdf = "%PDF-1.4\n% demo report".getBytes(StandardCharsets.UTF_8);
    return ResponseEntity.ok()
      .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report-" + reportId + ".pdf")
      .contentType(MediaType.APPLICATION_PDF).body(pdf);
  }
}
