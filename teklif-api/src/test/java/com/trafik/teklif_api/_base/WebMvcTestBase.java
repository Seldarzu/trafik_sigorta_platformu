package com.trafik.teklif_api._base;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

// NOT: Her controller testinde @WebMvcTest(Controller.class) ile spesifikleyeceğiz.
public abstract class WebMvcTestBase {
  @Autowired protected MockMvc mvc;
}
