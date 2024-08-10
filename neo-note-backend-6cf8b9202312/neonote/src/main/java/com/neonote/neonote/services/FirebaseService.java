package com.neonote.neonote.services;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.stereotype.Service;
//Coded by Thomas Dickson
@Service
public class FirebaseService {
    public String verifyTokenAndGetUid(String idToken) throws FirebaseAuthException {
        // decode token
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
        // get user ID from decoded token
        return decodedToken.getUid();
    }
}
