package com.neonote.neonote.config;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;

// Coded by Thomas Dickson
@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void init() throws IOException {
        // configure firebase service account
        FileInputStream serviceAccount = new FileInputStream("neo-note-firebase-adminsdk-s7moi-3ec7900080.json");

        // set options for firebase object
        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setStorageBucket("neo-note.appspot.com")
                .build();

        // initialize firebase app with given options
        FirebaseApp.initializeApp(options);
    }
}