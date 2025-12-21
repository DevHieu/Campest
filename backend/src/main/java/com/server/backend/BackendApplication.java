package com.server.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

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
		System.out.println("Running...");

	}

	@Override
	public void run(String... args) throws Exception {
	}

}
