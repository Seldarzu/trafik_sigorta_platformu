package com.trafik.teklif_api._base;

import jakarta.validation.Validation;
import jakarta.validation.Validator;

public abstract class ValidationTestBase {
  protected final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
}
