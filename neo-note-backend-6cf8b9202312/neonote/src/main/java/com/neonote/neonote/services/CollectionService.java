package com.neonote.neonote.services;

import com.neonote.neonote.entities.Block;
import com.neonote.neonote.entities.Collection;
import com.neonote.neonote.entities.Note;
import com.neonote.neonote.repositories.CollectionRepository;
import com.neonote.neonote.repositories.NoteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

//Coded by Thomas Dickson
@Service
public class CollectionService {
    private final CollectionRepository collectionRepository;

    @Autowired
    public CollectionService(CollectionRepository collectionRepository, NoteRepository noteRepository) {
        this.collectionRepository = collectionRepository;
    }

    public Collection createCollection(String userId) {
        // create new collection
        Collection collection = new Collection(userId);
        // save to db
        collectionRepository.save(collection);

        return collection;
    }

    public Collection findCollectionById(String collectionId) {
        // find collection by UUID
        return collectionRepository.findById(UUID.fromString(collectionId))
                .orElseThrow(() -> new EntityNotFoundException("Collection with ID " + collectionId + " not found."));
    }

    public Collection findCollectionByUser(String userId) {
        // find collection by user ID
        return collectionRepository.findByUserId(userId);
    }
}
