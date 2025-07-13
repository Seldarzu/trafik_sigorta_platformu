package com.trafik.teklif_api.dto;
//Entity’deki tüm alanları değil, yalnızca API client’ının görmesi gereken id, tcNo, name, phone alanlarını aktarır.
public class CustomerResponse {
  
  private Long id;
  private String tcNo;
  private String name;
  private String phone;

  // — Getter/Setter’lar —
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getTcNo() { return tcNo; }
  public void setTcNo(String tcNo) { this.tcNo = tcNo; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getPhone() { return phone; }
  public void setPhone(String phone) { this.phone = phone; }
}
