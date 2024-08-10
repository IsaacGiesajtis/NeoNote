package com.neonote.neonote.services;

import com.neonote.neonote.entities.Block;
import com.neonote.neonote.entities.Note;
import com.neonote.neonote.repositories.BlockRepository;
import com.neonote.neonote.repositories.NoteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
//Coded by Thomas Dickson
@Service
public class BlockService {

    private final BlockRepository blockRepository;
    @Value("${BUCKET_URL}")
    private String bucketUrl;

    public BlockService(BlockRepository blockRepository, NoteRepository noteRepository) {
        this.blockRepository = blockRepository;
    }

    public Block createBlock(Note note, String content, String contentType, int index) {
        // create new block
        Block block = new Block(note, content, contentType, index);
        // add block to note
        note.addBlock(block);
        // save to db
        blockRepository.save(block);

        return block;
    }

    public Block updateBlock(String blockId, Block updatedBlock) {
        // find block with ID or else throw not found
        Block block = blockRepository.findById(UUID.fromString(blockId))
                .orElseThrow(() -> new EntityNotFoundException("Block " + blockId + " not found."));

        // add updated fields
        block.setContent(updatedBlock.getContent());
        block.setIndex(updatedBlock.getIndex());
        // save to db
        blockRepository.save(block);

        return block;
    }

    //Coded by Jodie Soondra
    @Transactional
    public String deleteBlock(String blockId) {
        try{
            if(!blockRepository.existsById(UUID.fromString(blockId)))
                throw new EntityNotFoundException("Block " + blockId + " not found");

            blockRepository.deleteById(UUID.fromString(blockId));
            return "Block " + blockId + " deleted.";
        } catch(Exception e) {
            return "Failed to delete block: " + e.getMessage();
        }
    }
}
