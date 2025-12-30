package com.server.backend.models.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.mongodb.lang.NonNull;
import com.mongodb.lang.Nullable;
import com.server.backend.models.enums.ProviderEnum;
import com.server.backend.models.enums.RoleEnum;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Document(collection = "users")
@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class User {
    @Id
    private String id;
    @NonNull
    @Field("username")
    private String username;
    @NonNull
    @Field("email")
    @Indexed(unique = true)
    private String email;
    @Nullable
    @Field("password")
    private String password;
    @NonNull
    @Field("provider")
    private ProviderEnum provider; // Local, Google, etc.
    @NonNull
    @Field("role")
    private RoleEnum role; // Admin, User
}
