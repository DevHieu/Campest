package com.server.backend.security.oauth2;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.server.backend.models.entities.User;
import com.server.backend.models.enums.ProviderEnum;
import com.server.backend.repositories.UserRepository;
import com.server.backend.services.JwtService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

  @Value("${FRONTEND_URL}")
  private String frontend_url;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private JwtService jwtService;

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
      Authentication authentication) throws IOException, ServletException {
    // TODO Auto-generated method stub
    OAuth2User user = (OAuth2User) authentication.getPrincipal();

    String email = user.getAttribute("email");

    User existedUser = userRepository.findByEmail(email);

    if (existedUser != null) {

      existedUser.setProvider(ProviderEnum.GOOGLE);
      userRepository.save(existedUser);

      String token = jwtService.generateToken(email);
      response.sendRedirect(frontend_url + "/oauth2/redirect?token=" + token);
    } else {
      User newUser = new User();
      newUser.setEmail(email);
      newUser.setUsername(user.getAttribute("name"));
      newUser.setProvider(ProviderEnum.GOOGLE);
      userRepository.save(newUser);

      String token = jwtService.generateToken(email);
      response.sendRedirect(frontend_url + "/oauth2/redirect?token=" + token);
    }
  }

}
