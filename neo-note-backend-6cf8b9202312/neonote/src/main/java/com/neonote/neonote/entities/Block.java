package com.neonote.neonote.entities;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "blocks")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PUBLIC)
public class Block {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name="note_id", referencedColumnName = "id")
    private Note note;

    @Column(name = "type", nullable = false)
    private String type; // image, video, voice memo, text

    @Column(name = "content", columnDefinition = "text")
    private String content; // text field OR content download URL

    @Column(name = "index")
    private int index; // index used to order blocks after swapping

    public Block(Note note, String content, String contentType, int index) {
        this.content = content;
        this.type = contentType;
        this.index = index;
        this.note = note;
    }
    public UUID getId() {
        return id;
    }

    public void setNote(Note note) {
        this.note = note;
    }

    public void setBlockId(UUID blockId) {
        this.id = blockId;
    }

    public String getContentType() {
        return type;
    }

    public void setContentType(String contentType) {
        this.type = contentType;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }
}
