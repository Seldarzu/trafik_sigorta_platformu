package com.trafik.teklif_api.util;
public class PriceCalculator {
  public static double calculatePremium(double basePremium, int riskScore, double coverageAmount) {
    double riskMultiplier = 1.0 + (riskScore / 100.0) * 0.4;
    double coverageMultiplier = Math.max(1.0, coverageAmount / 100000.0);
    return basePremium * riskMultiplier * coverageMultiplier;
  }
}
