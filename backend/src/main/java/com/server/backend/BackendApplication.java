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
		System.out.println();
		SpringApplication.run(BackendApplication.class, args);

	}

	@Override
	public void run(String... args) throws Exception {
	}

}
