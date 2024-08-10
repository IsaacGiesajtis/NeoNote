package com.neonote.neonote.repositories;

import com.neonote.neonote.entities.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, String> {
    // override functions to use UUID
    Optional<Collection> findById(UUID collectionId);
    Collection findByUserId(String userId);
}
