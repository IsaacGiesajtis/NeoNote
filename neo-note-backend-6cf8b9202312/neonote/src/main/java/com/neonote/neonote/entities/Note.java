package com.neonote.neonote.entities;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "notes")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "note_title")
    private String title;

    @Builder.Default
    @Column(name = "favourite")
    private Boolean isFavourite = false;

    @Builder.Default
    @OneToMany(mappedBy = "note", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Block> blocks = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "collection_id", referencedColumnName = "id")
    @JsonIgnore
    private Collection collection;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Instant lastUpdatedAt; // used for ordering on main page

    public Note(Collection collection) {
        this.collection = collection;
        collection.addNote(this);
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<Block> getBlocks() {
        return blocks;
    }

    public void addBlock(Block block) {
        blocks.add(block);
        block.setNote(this);
    }

    public void setBlocks(List<Block> blocks) {
        this.blocks = blocks;
    }

    public Boolean getIsFavourite() { return isFavourite; }

    public void setIsFavourite(Boolean isFavourite) {
        this.isFavourite = isFavourite;
    }

    public Collection getCollection() {
        return collection;
    }

    public void setCollection(Collection collection) {
        this.collection = collection;
    }

    public Instant getLastUpdatedAt() {
        return lastUpdatedAt;
    }

    public void setLastUpdatedAt(Instant instant) {
        this.lastUpdatedAt = instant;
    }
}

