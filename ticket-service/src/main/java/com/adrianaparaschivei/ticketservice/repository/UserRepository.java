package com.adrianaparaschivei.ticketservice.repository;

import com.adrianaparaschivei.ticketservice.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {}
