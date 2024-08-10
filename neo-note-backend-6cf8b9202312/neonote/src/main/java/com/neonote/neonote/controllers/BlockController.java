package com.neonote.neonote.controllers;

import com.neonote.neonote.controllers.models.CreateBlockRequest;
import com.neonote.neonote.controllers.models.UpdateBlockRequest;
import com.neonote.neonote.controllers.models.UpdateNoteRequest;
import com.neonote.neonote.entities.Block;
import com.neonote.neonote.entities.Note;
import com.neonote.neonote.services.BlockService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
//Coded by Jodie Soondra
@RestController
@RequestMapping("/blocks")
public class BlockController {
    private final BlockService blockService;

    public BlockController(BlockService blockService) {
        this.blockService = blockService;
    }

    @PostMapping("")
    public ResponseEntity<Block> createBlock(@RequestBody CreateBlockRequest request) {
        try {
            // create a block with given request parameters
            Block block = blockService.createBlock(request.getNote(), request.getContent(), request.getContentType(), request.getIndex());
            return new ResponseEntity<>(block, HttpStatus.CREATED);
        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    //Coded by Thomas Dickson
    @PutMapping("/{blockId}")
    public ResponseEntity<Block> updateBlock(@PathVariable String blockId, @RequestBody UpdateBlockRequest request) {
        try {
            // update block with given ID to include request parameters
            Block block = blockService.updateBlock(blockId, request.getBlock());
            return new ResponseEntity<>(block, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    //Coded by Thomas Dickson
    @DeleteMapping("/{blockId}")
    @Transactional
    public ResponseEntity<String> deleteBlock(@PathVariable String blockId){
        try {
            // delete block with given ID
            String message = blockService.deleteBlock(blockId);
            return new ResponseEntity<>(message, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>("Failed to delete block" + e.getMessage(), HttpStatus.NOT_FOUND);
        } catch(Exception e){
            return new ResponseEntity<>("Failed to delete block" + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
