package com.neonote.neonote.controllers;

import com.neonote.neonote.entities.Collection;
import com.neonote.neonote.services.CollectionService;
import com.neonote.neonote.services.FirebaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
//Coded by Thomas Dickson
@RestController
@RequestMapping("/users")
public class UserController {
    private final CollectionService collectionService;

    @Autowired
    public UserController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register() {
        try {
            // **note: user details are stored in firebase from frontend using Firebase Client SDK
            // get authenticated user from SecurityContext
            Authentication user = SecurityContextHolder.getContext().getAuthentication();

            // create a collection for that user
            Collection newCollection = collectionService.createCollection(user.getName());

            // return collection UUID
            return new ResponseEntity<>(newCollection.getId().toString(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
