package com.trafik.teklif_api.dto;
//Client’tan gelen JSON içinde zorunlu ve desen kurallarını (@NotBlank, @Pattern, @Size) tanımlar.

//Eksik veya hatalı geldiğinde Spring otomatik 400 Bad Request üretir.
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class CreateCustomerRequest {
  
  @NotBlank(message = "TC Kimlik Numarası boş olamaz")
  @Pattern(regexp = "\\d{11}", message = "TC Kimlik 11 haneli rakam olmalı")
  private String tcNo;

  @NotBlank(message = "İsim boş olamaz")
  @Size(max = 100, message = "İsim en fazla 100 karakter olabilir")
  private String name;

  // Opsiyonel doğum tarihi; yoksa null gelebilir
  private LocalDate birthDate;

  @Pattern(regexp = "\\+?\\d{10,15}", message = "Telefon numarası 10-15 hane arasında olmalı")
  private String phone;

  // — Getter/Setter’lar —
  public String getTcNo() { return tcNo; }
  public void setTcNo(String tcNo) { this.tcNo = tcNo; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public LocalDate getBirthDate() { return birthDate; }
  public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }

  public String getPhone() { return phone; }
  public void setPhone(String phone) { this.phone = phone; }
}
