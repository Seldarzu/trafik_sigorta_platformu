package com.trafik.teklif_api.util;
import com.trafik.teklif_api.entity.Driver; import com.trafik.teklif_api.entity.Vehicle;
import java.time.LocalDate; import java.time.Period;
public class RiskCalculator {
  public static int calculate(Driver d, Vehicle v) {
    int base = 50;
    int age = Period.between(d.getBirthDate(), LocalDate.now()).getYears();
    int ageFactor = age < 25 ? 10 : (age > 60 ? 8 : 0);
    int expYears = Period.between(d.getLicenseDate(), LocalDate.now()).getYears();
    int expFactor = expYears < 2 ? 8 : (expYears < 5 ? 4 : 0);
    int acc = (d.isHasAccidents() ? Math.max(1, d.getAccidentCount()) : 0) * 5;
    int vio = (d.isHasViolations() ? Math.max(1, d.getViolationCount()) : 0) * 3;
    int vehicleAge = Math.max(0, LocalDate.now().getYear() - v.getYear());
    int vehicleFactor = Math.min(12, vehicleAge);
    int engineFactor = 0;
    try { String digits = v.getEngineSize().replaceAll("[^0-9]",""); int cc = digits.isBlank()?0:Integer.parseInt(digits);
      engineFactor = cc > 2000 ? 5 : (cc > 1600 ? 3 : 0);
    } catch (Exception ignored) {}
    int cityFactor = "34".equals(v.getCityCode()) || "06".equals(v.getCityCode()) ? 4 : 0;
    int total = base + ageFactor + expFactor + acc + vio + vehicleFactor + engineFactor + cityFactor;
    return Math.min(100, Math.max(0, total));
  }
}
