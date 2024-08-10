package com.neonote.neonote.repositories;

import com.neonote.neonote.entities.Block;
import com.neonote.neonote.entities.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BlockRepository extends JpaRepository<Block, String> {

    // override functions to use UUID
    Optional<Block> findById(UUID id);
    boolean existsById(UUID blockId);
    void deleteById(UUID blockId);
}
