import axios from 'axios';

const COLLECTION_ENDPOINT = 'http://45.76.113.141:8080/collections';

// All created by Thomas Dickson

// Function to fetch collection from backend
async function fetchCollection(uid, token) {
  try {
    console.log("Fetching collection for uid:", uid);

    // get collection from backend with user ID
    const response = await axios.get(`${COLLECTION_ENDPOINT}/user/${uid}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;

  } catch (error) {
    console.error('Error fetching collection:', error);
    throw error;
  }
}

export { fetchCollection };