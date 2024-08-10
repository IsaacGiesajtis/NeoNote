package com.neonote.neonote.controllers.models;

import com.neonote.neonote.entities.Note;

import java.util.UUID;

// JSON request parameters for creating blocks
//Coded by Jodie Soondra
public class CreateBlockRequest {

    private Note note;
    private String content;
    private String contentType;

    private int index;

    //Coded by Dickson
    public Note getNote() { return note; }
    public String getContent() { return content; }

    public String getContentType() { return contentType; }

    public int getIndex() { return index; }
}
