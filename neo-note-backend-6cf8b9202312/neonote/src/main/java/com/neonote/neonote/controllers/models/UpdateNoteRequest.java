package com.neonote.neonote.controllers.models;

import com.neonote.neonote.entities.Note;

// JSON request parameters for updating a note
//Coded by Thomas Dickson
public class UpdateNoteRequest {
    private Note note;

    public Note getNote() {
        return note;
    }
}
