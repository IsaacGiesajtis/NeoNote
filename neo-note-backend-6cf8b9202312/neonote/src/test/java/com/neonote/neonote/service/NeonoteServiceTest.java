package com.neonote.neonote.service;

import com.neonote.neonote.entities.Block;
import com.neonote.neonote.entities.Note;
import com.neonote.neonote.repositories.BlockRepository;
import com.neonote.neonote.services.BlockService;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.eq;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
//Coded by Barrett Bujack
@ExtendWith(MockitoExtension.class)
public class NeonoteServiceTest {
    @Mock
    private BlockRepository blockRepository;

    @InjectMocks
    private BlockService blockService;

    //Coded by Barrett Bujack
    @Test
    public void BlockService_CreateBlock_ReturnsBlockData () {
        //Arrange Creating data structures that we operate on
        UUID blockUuid = UUID.fromString("f47ac10b-58cc-4372-a567-0e02b2c3d479");
        UUID noteUuid = UUID.fromString("550e8400-e29b-41d4-a716-446655440000");
        Block block = Block.builder().id(blockUuid).type("text").index(0).content("This is my text").build();

        List<Block> blocks = new ArrayList<>();
        blocks.add(block);

        Instant time = Instant.parse("1970-01-01T00:00:00Z");

        Note note = Note.builder().id(noteUuid).title("My Note").blocks(blocks).isFavourite(false).lastUpdatedAt(time).build();

        //Act upon the created data structures to test the function
        when(blockRepository.save(Mockito.any(Block.class))).thenReturn(block);

        Block blockTest = blockService.createBlock(note, "This is my text", "text", 0);

        //Assert that it needs to meet these requirements in order for it to pass the test
        Assertions.assertThat(blockTest).isNotNull();

    }

    @Test
    public void BlockService_UpdateBlock_ReturnsUpdatedBlock () {
        //Arrange Creating data structures that we operate on
        UUID blockUuid = UUID.fromString("f47ac10b-58cc-4372-a567-0e02b2c3d479");
        Block block = Block.builder().id(blockUuid).type("text").index(0).content("This is my text").build();

        //Act upon the created data structures to test the function
        when(blockRepository.findById(blockUuid)).thenReturn(Optional.ofNullable(block));
        when(blockRepository.save(Mockito.any(Block.class))).thenReturn(block);

        //Have to pre assert it, so it knows that the block is actually created properly
        assert block != null;
        Block savedBlock = blockService.updateBlock(String.valueOf(blockUuid), block);

        //Assert that it needs to meet these requirements in order for it to pass the test
        Assertions.assertThat(savedBlock).isNotNull();
        Assertions.assertThat(savedBlock.getId()).isEqualByComparingTo(block.getId()); //Making sure block is saved correctly
        Assertions.assertThat(savedBlock.getContent()).isEqualTo(block.getContent()); //Checking that the content updates correctly

    }

    @Test
    public void BlockService_DeleteBlock_ReturnIDandDeleted () {
        //Arrange Creating data structures that we operate on
        UUID blockUuid = UUID.fromString("f47ac10b-58cc-4372-a567-0e02b2c3d479");
        Block block = Block.builder().id(blockUuid).type("text").index(0).content("This is my text").build();

        //Act upon the created data structures to test the function
        when(blockRepository.existsById("f47ac10b-58cc-4372-a567-0e02b2c3d479")).thenReturn(true);//Making sure it exists and can be acted upon
        when(blockRepository.save(Mockito.any(Block.class))).thenReturn(block);//Saving the block
        blockService.deleteBlock(String.valueOf(blockUuid));//Deleting the block

        //Assert that it needs to meet these requirements in order for it to pass the test
        verify(blockRepository).existsById(eq(blockUuid));//Making sure the block was correctly deleted
    }

}
