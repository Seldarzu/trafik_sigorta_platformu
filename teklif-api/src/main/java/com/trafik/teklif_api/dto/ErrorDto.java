package com.trafik.teklif_api.dto;
/*@ControllerAdvice içindeki exception handler’ların (EntityNotFoundException, MethodArgumentNotValidException vs.) 
JSON olarak döndürdüğü hata yapısını standartlaştırır. */
public class ErrorDto {

  private String code;
  private String message;

  public ErrorDto() { }
  public ErrorDto(String code, String message) {
    this.code = code;
    this.message = message;
  }

  // — Getter/Setter —
  public String getCode() { return code; }
  public void setCode(String code) { this.code = code; }

  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }
}
