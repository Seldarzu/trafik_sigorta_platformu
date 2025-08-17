package com.trafik.teklif_api.validation;

import com.trafik.teklif_api.dto.CustomerRequest;
import com.trafik.teklif_api.entity.CustomerValue;
import com.trafik.teklif_api.entity.RiskProfile;
import com.trafik.teklif_api.entity.Status;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

class DtoValidationTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void customerRequest_should_fail_when_fields_invalid_or_missing() {
        // Geçersiz/verilmeyen alanlar:
        // - tcNumber: 11 haneli değil
        // - firstName/lastName: blank
        // - birthDate: gelecek tarih (Past ihlali)
        // - phone: pattern dışı
        // - email: geçersiz format
        // - status/riskProfile/customerValue: null (NotNull ihlali)
        CustomerRequest dto = new CustomerRequest(
                "123",              // tcNumber (yanlış, 11 hane değil)
                "",                 // firstName (blank)
                "   ",              // lastName (blank)
                LocalDate.now().plusDays(1), // birthDate (gelecek → @Past ihlali)
                "abc",              // phone (regex dışı)
                "not-an-email",     // email (geçersiz)
                null,               // address (opsiyonel)
                null,               // city (opsiyonel)
                null,               // status (NotNull ihlali)
                null,               // riskProfile (NotNull ihlali)
                null,               // customerValue (NotNull ihlali)
                null                // notes (opsiyonel)
        );

        var violations = validator.validate(dto);
        assertThat(violations).isNotEmpty();

        // İstediğimiz alanların ihlal ürettiğini doğrulayalım
        assertThat(violations)
                .anySatisfy(v -> assertThat(v.getPropertyPath().toString()).isEqualTo("tcNumber"))
                .anySatisfy(v -> assertThat(v.getPropertyPath().toString()).isEqualTo("firstName"))
                .anySatisfy(v -> assertThat(v.getPropertyPath().toString()).isEqualTo("lastName"))
                .anySatisfy(v -> assertThat(v.getPropertyPath().toString()).isEqualTo("birthDate"))
                .anySatisfy(v -> assertThat(v.getPropertyPath().toString()).isEqualTo("phone"))
                .anySatisfy(v -> assertThat(v.getPropertyPath().toString()).isEqualTo("email"))
                .anySatisfy(v -> assertThat(v.getPropertyPath().toString()).isEqualTo("status"))
                .anySatisfy(v -> assertThat(v.getPropertyPath().toString()).isEqualTo("riskProfile"))
                .anySatisfy(v -> assertThat(v.getPropertyPath().toString()).isEqualTo("customerValue"));
    }

    @Test
    void customerRequest_should_pass_when_all_fields_valid() {
        // Enumlar gerçekten enum ise aşağıdaki çağrı çalışır.
        // (Projendeki enum adları farklıysa yine de ilk elemanı almak güvenli bir tekniktir.)
        Status status = Status.values()[0];
        RiskProfile risk = RiskProfile.values()[0];
        CustomerValue value = CustomerValue.values()[0];

        CustomerRequest dto = new CustomerRequest(
                "12345678901",      // tcNumber (11 hane)
                "Ali",              // firstName
                "Yılmaz",           // lastName
                LocalDate.of(1995, 5, 1), // birthDate (geçmiş)
                "+905551112233",    // phone (regex uyumlu)
                "ali@example.com",  // email
                "İstiklal Cd. No:1",
                "İstanbul",
                status,
                risk,
                value,
                "Notlar"
        );

        var violations = validator.validate(dto);
        assertThat(violations).isEmpty();
    }
}
