package com.server.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.server.backend.models.entities.User;
import com.server.backend.models.enums.UserEnum;
import com.server.backend.repositories.UserRepository;

@SpringBootApplication
public class BackendApplication implements CommandLineRunner {
	private final UserRepository userRepository;

	@Autowired
	public BackendApplication(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);

	}

	@Override
	public void run(String... args) throws Exception {
		if (userRepository.findAll().isEmpty()) {
			User admin = new User("admin", "hieudd2090@gmail.com", "admin", UserEnum.ADMIN);
			userRepository.save(admin);
		}
	}

}
