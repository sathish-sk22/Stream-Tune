package com.sathish.spotify.repository;

import com.sathish.spotify.Document.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User,String> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

}
