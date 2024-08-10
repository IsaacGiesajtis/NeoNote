package com.neonote.neonote.controllers;

import com.google.firebase.auth.FirebaseAuthException;
import com.neonote.neonote.entities.Collection;
import com.neonote.neonote.controllers.models.CreateCollectionRequest;
import com.neonote.neonote.services.CollectionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.neonote.neonote.services.FirebaseService;
//Coded by Thomas Dickson
@RestController
@RequestMapping("/collections")
public class CollectionController {
    private final CollectionService collectionService;
    //Coded by Thomas Dickson
    @Autowired
    public CollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @PostMapping("")
    public ResponseEntity<String> createCollection(@RequestBody CreateCollectionRequest request) {
        try {
            // create a collection for given user
            collectionService.createCollection(request.getUserId());
            return new ResponseEntity<>("Collection created successfully.", HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
    //Coded by Jodie Soondra
    @GetMapping("/{collectionId}")
    public ResponseEntity<Collection> getCollectionById(@PathVariable String collectionId) {
        try {
            // find collection with given ID
            Collection collection = collectionService.findCollectionById(collectionId);
            return new ResponseEntity<>(collection, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    //Coded by Thomas Dickson
    @GetMapping("/user/{userId}")
    public ResponseEntity<Collection> getCollectionByUser(@PathVariable String userId) {
        try {
            Collection collection = collectionService.findCollectionByUser(userId);
            return new ResponseEntity<>(collection, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
