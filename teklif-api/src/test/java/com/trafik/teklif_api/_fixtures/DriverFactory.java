package com.trafik.teklif_api._fixtures;

import com.trafik.teklif_api.entity.Driver;
import com.trafik.teklif_api.model.enums.Gender;
import com.trafik.teklif_api.model.enums.MaritalStatus;
import com.trafik.teklif_api.model.enums.Education;

import java.time.LocalDate;

public class DriverFactory {
    public static Driver sample() {
        Driver d = new Driver();
        d.setFirstName("Ali");
        d.setLastName("Yılmaz");
        d.setTcNumber("12345678901");
        d.setBirthDate(LocalDate.of(1995, 5, 1));
        d.setLicenseDate(LocalDate.of(2015, 1, 1));
        d.setGender(Gender.MALE);
        d.setMaritalStatus(MaritalStatus.SINGLE);
        // Education enumunda olan bir değer seç
        d.setEducation(Education.HIGH_SCHOOL);
        d.setHasAccidents(false);
        d.setHasViolations(false);
        return d;
    }
}
