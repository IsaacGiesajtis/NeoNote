package com.neonote.neonote.services;

import com.google.firebase.cloud.StorageClient;
import com.neonote.neonote.entities.Block;
import com.neonote.neonote.entities.Collection;
import com.neonote.neonote.entities.Note;
import com.neonote.neonote.repositories.NoteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Dictionary;
import java.util.List;
import java.util.UUID;
//Coded by Thomas Dickson
@Service
public class NoteService {
    private final NoteRepository noteRepository;

    //Coded by Jodie Soondra
    @Autowired
    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    public Note createNote(Collection collection) {
        // create note
        Note note = new Note(collection);
        // save to db
        noteRepository.save(note);

        return note;
    }

    //Coded by Thomas Dickson
    public Note updateNote(String noteId, Note updatedNote) {
        // find note by id or throw error if not exists
        Note note = noteRepository.findById(UUID.fromString(noteId))
                                  .orElseThrow(() -> new EntityNotFoundException("Note " + noteId + " not found."));

        // set updated fields
        note.setTitle(updatedNote.getTitle());
        note.setIsFavourite(updatedNote.getIsFavourite());

        // save to db
        noteRepository.save(note);

        return note;
    }

    @Transactional
    public String deleteNote(String noteId) {
        // TODO: Fix exception handling
        try {
            // if note doesn't exist
            if(!noteRepository.existsById(UUID.fromString(noteId)))
                throw new EntityNotFoundException("Note " + noteId + " not found");

            // delete note by id
            noteRepository.deleteById(UUID.fromString(noteId));

            return "Note: " + noteId + " deleted";
        } catch(Exception e) {
            return "Failed to delete note: " + e.getMessage();
        }
    }

    public Note findNoteById(String noteId) {
        // find note by UUID
        return noteRepository.findById(UUID.fromString(noteId))
                             .orElseThrow(() -> new EntityNotFoundException("Note " + noteId + " not found."));
    }
}
