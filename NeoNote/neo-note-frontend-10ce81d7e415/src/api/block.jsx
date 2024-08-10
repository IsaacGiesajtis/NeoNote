import axios from 'axios';

const BLOCK_ENDPOINT = 'http://45.76.113.141:8080/blocks';

// All created by Thomas Dickson

// Function to create a block in backend
async function createBlock(note, content, contentType, index, token) {
  try {
    console.log("Creating block within note:", note.id);

    // if content type, need to extract download URL from content
    if (contentType == "audio")
      content = content.download;

    // post to backend API
    const response = await axios.post(`${BLOCK_ENDPOINT}`, {note: note, 
                                                            content: content, 
                                                            contentType: contentType,
                                                            index: index}, 
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;

  } catch (error) {
    console.error('Error creating block:', error);
    throw error;
  }
}

// Function to delete a block in backend
async function deleteBlock(block, token) {
  try {
    console.log("Deleting block:", block.id);

    // delete block with given ID in backend
    const response = await axios.delete(`${BLOCK_ENDPOINT}/${block.id}`, 
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting block:', error);
    throw error;
  }
}

// Function to update block in backend
async function updateBlock(block, token) {
  try {
    console.log("Updating block:", block.id);

    // update block with given ID in backend
    const response = await axios.put(`${BLOCK_ENDPOINT}/${block.id}`, {block: block}, {
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


export { createBlock, updateBlock, deleteBlock };