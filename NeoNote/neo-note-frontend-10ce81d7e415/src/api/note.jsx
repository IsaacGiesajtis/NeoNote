import axios from "axios";

const NOTE_ENDPOINT = 'http://45.76.113.141:8080/notes';

// All created by Thomas Dickson

// Function to create a note in backend
async function createNote(collection, token) {
  try {
    console.log("Creating note within collection:", collection.id)

    // Post to backend API
    const response = await axios.post(`${NOTE_ENDPOINT}`, {collection: collection}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;

  } catch (error) {
    console.error('Error creating note:', error.response.data);
    throw error;
  }
}

// Function to delete note from backend
async function deleteNote(note, token) {
  try {
    console.log("Deleting note:", note.id)

    // delete note with given ID from backend
    const response = await axios.delete(`${NOTE_ENDPOINT}/${note.id}`, {
      headers: {
          Authorization: `Bearer ${token}`
      }
    });

    return response.data;

  } catch (error) {
    console.log(error);
  }
}

// Function to get note from backend
async function getNote(note, token) {
  try {
    console.log("Getting note:", note.id);

    // get note with given ID from backend
    const response = await axios.get(`${NOTE_ENDPOINT}/${note.id}`, {
      headers: {
          Authorization: `Bearer ${token}`
      }
    });

    return response.data;

  } catch (error) {
    console.log(error);
  }
}

// Function to update note in backend
async function updateNote(note, token) {
  try {
    console.log("Updating note:", note.id);

    // update note with given ID in backend
    const response = await axios.put(`${NOTE_ENDPOINT}/${note.id}`, {note: note}, {
      headers: {
          Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export { createNote, deleteNote, getNote, updateNote};