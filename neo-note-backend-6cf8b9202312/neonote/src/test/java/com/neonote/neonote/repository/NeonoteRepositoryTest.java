package com.neonote.neonote.repository;

import com.neonote.neonote.entities.Block;
import com.neonote.neonote.entities.Collection;
import com.neonote.neonote.entities.Note;
import com.neonote.neonote.repositories.CollectionRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

//Coded by Barrett Bujack
@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)

public class NeonoteRepositoryTest {
    @Autowired
    private CollectionRepository collectionRepository;

    //Coded by Barrett Bujack
    @Test
    public void CollectionRepository_SaveAll_ReturnSavedCollection() {
        //Arrange Creating data structures that we operate on
        //Creating all needed UUID's so we can test them
        UUID collectionUuid = UUID.fromString("f8c3de3d-1fea-4d7c-a8b0-29f63c4c3454");
        UUID noteUuid = UUID.fromString("550e8400-e29b-41d4-a716-446655440000");
        UUID blockUuid = UUID.fromString("f47ac10b-58cc-4372-a567-0e02b2c3d479");

        //Creating a block and adding it to a list so i can create a note
        Block block = Block.builder().id(blockUuid).type("text").index(0).content("This is my text").build();
        List<Block> blocks = new ArrayList<>();
        blocks.add(block);

        //Note needs a last update time so i chose an easily recognizable time
        Instant time = Instant.parse("1970-01-01T00:00:00Z");

        //Creating a note so i can add it to collection
        Note note = Note.builder().id(noteUuid).title("My Note").blocks(blocks).isFavourite(false).lastUpdatedAt(time).build();
        List<Note> notes = new ArrayList<>();
        notes.add(note);

        //Creating the collection i can test it
        Collection collection = Collection.builder().id(collectionUuid).userId("Thomas").notes(notes).build();

        //Act upon the created data structures to test the function
        Collection savedCollection = collectionRepository.save(collection);

        //Assert that it needs to meet these requirements in order for it to pass the test
        Assertions.assertThat(savedCollection).isNotNull();
        Assertions.assertThat(savedCollection.getUserId()).isEqualTo("Thomas");//Confirming that data was input correctly

    }

    @Test
    public void CollectionRepository_GetAll_ReturnMoreThenOneCollection() {

        //Arrange Creating data structures that we operate on
        //Making 2 collections so test that we gather all of them
        UUID collectionUuid = UUID.fromString("f8c3de3d-1fea-4d7c-a8b0-29f63c4c3454");
        UUID noteUuid = UUID.fromString("550e8400-e29b-41d4-a716-446655440000");
        UUID blockUuid = UUID.fromString("f47ac10b-58cc-4372-a567-0e02b2c3d479");

        Block block = Block.builder().id(blockUuid).type("text").index(0).content("This is my text").build();
        List<Block> blocks = new ArrayList<>();
        blocks.add(block);

        Instant time = Instant.parse("1970-01-01T00:00:00Z");

        Note note = Note.builder().id(noteUuid).title("My Note").blocks(blocks).isFavourite(false).lastUpdatedAt(time).build();
        List<Note> notes = new ArrayList<>();
        notes.add(note);

        Collection collection = Collection.builder().id(collectionUuid).userId("Thomas").notes(notes).build();

        UUID collectionUuid2 = UUID.fromString("55c3de3d-1fea-4d7c-a8b0-29f63c4c3454");
        UUID noteUuid2 = UUID.fromString("660e8400-e29b-41d4-a716-446655440000");
        UUID blockUuid2 = UUID.fromString("447ac10b-58cc-4372-a567-0e02b2c3d479");

        Block block2 = Block.builder().id(blockUuid2).type("text2").index(0).content("This is my text2").build();
        List<Block> blocks2 = new ArrayList<>();
        blocks.add(block2);

        Instant time2 = Instant.parse("1972-01-01T00:00:00Z");

        Note note2 = Note.builder().id(noteUuid2).title("My Note2").blocks(blocks2).isFavourite(false).lastUpdatedAt(time2).build();
        List<Note> notes2 = new ArrayList<>();
        notes.add(note2);

        Collection collection2 = Collection.builder().id(collectionUuid2).userId("Thomas2").notes(notes2).build();

        collectionRepository.save(collection);
        collectionRepository.save(collection2);

        //Act upon the created data structures to test the function
        List<Collection> collectionList = collectionRepository.findAll();

        //Assert that it needs to meet these requirements in order for it to pass the test
        Assertions.assertThat(collectionList).isNotNull();
        Assertions.assertThat(collectionList).hasSize(2);//Making sure that it has the expected number of collections
    }

    @Test
    public void CollectionRepository_FindById_ReturnsCollection() {

        //Arrange Creating data structures that we operate on
        UUID collectionUuid = UUID.fromString("69c3de3d-1fea-4d7c-a8b0-29f63c4c3454");
        UUID noteUuid = UUID.fromString("550e8400-e29b-41d4-a716-446655440000");
        UUID blockUuid = UUID.fromString("f47ac10b-58cc-4372-a567-0e02b2c3d479");

        Block block = Block.builder().id(blockUuid).type("text").index(0).content("This is my text").build();
        List<Block> blocks = new ArrayList<>();
        blocks.add(block);

        Instant time = Instant.parse("1970-01-01T00:00:00Z");

        Note note = Note.builder().id(noteUuid).title("My Note").blocks(blocks).isFavourite(false).lastUpdatedAt(time).build();
        List<Note> notes = new ArrayList<>();
        notes.add(note);

        Collection collection = Collection.builder().id(collectionUuid).userId("Thomas").notes(notes).build();

        collectionRepository.save(collection);

        //Act upon the created data structures to test the function
        Collection collectionIdTest = collectionRepository.findByUserId("Thomas");

        List<Collection> collectionList = collectionRepository.findAll();

        //Assert that it needs to meet these requirements in order for it to pass the test
        Assertions.assertThat(collectionIdTest.getId()).isNotNull();
        Assertions.assertThat(collectionList).hasSize(1);//Making sure we can find a certain collection by an ID

        //Example of a more strict test. However it is not needed
        //Assertions.assertThat(collectionIdTest.getId()).isEqualByComparingTo(collection.getId());

    }

}
