package com.neonote.neonote.config;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;

// Coded by Thomas Dickson
public class FirebaseAuthentication implements Authentication {

    private final String uid;
    private boolean isAuthenticated = true;

    public FirebaseAuthentication(String uid) {
        this.uid = uid;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // You can implement this method to return the user's roles or authorities if needed.
        // For Firebase-based authentication, this may not be applicable, as Firebase handles permissions separately.
        return null;
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getDetails() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return uid;
    }

    @Override
    public boolean isAuthenticated() {
        return isAuthenticated;
    }

    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        this.isAuthenticated = isAuthenticated;
    }

    @Override
    public String getName() {
        return uid;
    }
}