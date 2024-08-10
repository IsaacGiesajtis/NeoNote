package com.neonote.neonote.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.neonote.neonote.controllers.BlockController;
import com.neonote.neonote.entities.Block;
import com.neonote.neonote.entities.Note;
import com.neonote.neonote.services.BlockService;
import com.neonote.neonote.services.FirebaseService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

//Coded by Barrett Bujack
@WebMvcTest(controllers = BlockController.class)
//   V This bypasses security for the tests so we dont need tokens
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
public class NeonoteControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BlockService blockService;

    @MockBean
    private FirebaseService firebaseService;

    @Autowired
    private ObjectMapper objectMapper;

    //Coded by Barrett Bujack
    @Test
    public void BlockController_CreateBlock_ReturnCreated () throws Exception {
        //Arrange Creating data structures that we operate on
        UUID blockUuid = UUID.fromString("f47ac10b-58cc-4372-a567-0e02b2c3d479");
        UUID noteUuid = UUID.fromString("550e8400-e29b-41d4-a716-446655440000");

        Block block = Block.builder().id(blockUuid).type("text").index(0).content("This is my text").build();
        List<Block> blocks = new ArrayList<>();
        blocks.add(block);

        Instant time = Instant.parse("1970-01-01T00:00:00Z");

        Note note = Note.builder().id(noteUuid).title("My Note").blocks(blocks).isFavourite(false).lastUpdatedAt(time).build();

        Block usableBlock =  Block.builder().id(blockUuid).type("text").index(0).content("This is my text").note(note).build();

        //Act upon the created data structures to test the function
        given(blockService.createBlock(
                ArgumentMatchers.any(Note.class),
                ArgumentMatchers.any(String.class),
                ArgumentMatchers.any(String.class),
                ArgumentMatchers.anyInt()
        )).willAnswer((invocation -> {
            Note noteParam = invocation.getArgument(0);
            String contentParam = invocation.getArgument(1);
            String contentTypeParam = invocation.getArgument(2);
            int indexParam = invocation.getArgument(3);
            return Block.builder().id(blockUuid).type(contentTypeParam).index(indexParam).content(contentParam).note(noteParam).build();
        }));//Creating a block with the service

        firebaseService.verifyTokenAndGetUid("");//Satisfying fireBase service requirement
        ResultActions response = mockMvc.perform(post("/blocks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usableBlock)));//Sending the block to the controller as a json application

        //Assert that it needs to meet these requirements in order for it to pass the test
        response.andExpect(MockMvcResultMatchers.status().isCreated());//Making sure that the block is created

    }
}
