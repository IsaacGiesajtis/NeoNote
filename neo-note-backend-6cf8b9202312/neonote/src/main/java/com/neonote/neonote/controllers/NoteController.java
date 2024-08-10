package com.neonote.neonote.controllers;

import com.neonote.neonote.controllers.models.CreateBlockRequest;
import com.neonote.neonote.controllers.models.CreateNoteRequest;
import com.neonote.neonote.controllers.models.UpdateNoteRequest;
import com.neonote.neonote.entities.Block;
import com.neonote.neonote.entities.Collection;
import com.neonote.neonote.entities.Note;
import com.neonote.neonote.services.CollectionService;
import com.neonote.neonote.services.NoteService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
//Coded by Thomas Dickson
@RestController
@RequestMapping("/notes")
public class NoteController {
    private NoteService noteService;
    //Coded by Thomas Dickson
    @Autowired
    public NoteController(NoteService noteService, CollectionService collectionService) {
        this.noteService = noteService;
    }

    @PostMapping("")
    public ResponseEntity<Note> createNote(@RequestBody CreateNoteRequest request) {
        try {
            // create note within a given collection
            Note note = noteService.createNote(request.getCollection());
            return new ResponseEntity<>(note, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    //Coded by Jodie Soondra
    @GetMapping("/{noteId}")
    public ResponseEntity<Note> getNote(@PathVariable String noteId) {
        try {
            // get note with given ID
            Note note = noteService.findNoteById(noteId);
            return new ResponseEntity<>(note, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    //Coded by Thomas Dickson
    @PutMapping("/{noteId}")
    public ResponseEntity<Note> updateNote(@PathVariable String noteId, @RequestBody UpdateNoteRequest request) {
        try {
            // update note with given ID to include request parameters
            Note note = noteService.updateNote(noteId, request.getNote());
            return new ResponseEntity<>(note, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{noteId}")
    @Transactional
    public ResponseEntity<String> deleteNote(@PathVariable String noteId) {
        try {
            // delete note with given ID
            String message = noteService.deleteNote(noteId);
            return new ResponseEntity<>(message, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>("Failed to delete note" + e.getMessage(), HttpStatus.NOT_FOUND);
        } catch(Exception e){
            return new ResponseEntity<>("Failed to delete note" + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

