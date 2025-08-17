package com.trafik.teklif_api._fixtures;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public class Common {
  public static UUID uuid() { return UUID.randomUUID(); }
  public static LocalDate today() { return LocalDate.now(); }
  public static OffsetDateTime now() { return OffsetDateTime.now(); }
}
