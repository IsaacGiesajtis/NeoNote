package com.neonote.neonote.repositories;

import com.neonote.neonote.entities.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface NoteRepository extends JpaRepository<Note, String> {
    // override functions to use UUID
    Optional<Note> findById(UUID id);
    void deleteById(UUID noteId);
    boolean existsById(UUID noteId);
}

