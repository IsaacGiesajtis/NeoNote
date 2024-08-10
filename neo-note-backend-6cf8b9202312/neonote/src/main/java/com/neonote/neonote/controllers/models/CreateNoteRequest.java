package com.neonote.neonote.controllers.models;

import com.neonote.neonote.entities.Collection;
//Coded by Thomas Dickson
import java.util.UUID;

// JSON request parameters for creating a note
// Coded by Thomas Dickson
public class CreateNoteRequest {
    private Collection collection;
    public Collection getCollection() {
        return collection;
    }
}
