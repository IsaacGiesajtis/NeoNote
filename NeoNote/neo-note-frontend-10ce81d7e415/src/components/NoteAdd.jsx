import React, { useState, useContext, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StatusBar,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { useColorScheme } from "nativewind";
import { AntDesign } from "@expo/vector-icons";
import { Platform, Dimensions } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useBackHandler } from '@react-native-community/hooks';
import styles from "./style";
import { Ionicons } from "@expo/vector-icons";
import NoteContext from "./NoteContext";
import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";

// firebase
import { auth, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "@firebase/storage";

// api
import { createNote, deleteNote, getNote, updateNote } from "../api/note";
import {
  createBlock,
  updateBlock,
  deleteBlock as deleteBlockAPI,
} from "../api/block";
import axios from "axios";


const NoteAdd = () => {
  const [loading, setLoading] = useState(true);
  // api functionalities
  const [user, setUser] = useState(null);
  const [note, setNote] = useState(null);
  const [collection, setCollection] = useState(null);

  // other state variables
  const navigation = useNavigation();
  const windowHeight = Dimensions.get("window").height;
  const { notes, setNotes } = useContext(NoteContext);
  const [header, setHeader] = useState("");
  const [blocks, setBlocks] = useState([]);
  const route = useRoute();
  const [isEditing, setIsEditing] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [dropdown1, setDropdown1] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 160;
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [swipedBlockIndex, setSwipedBlockIndex] = useState(-1);
  const [recording, setRecording] = React.useState();
  const [displayRecording, setDisplayRecording] = useState(false);
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [countdown, SetCountdown] = useState(null);
  const [isVoiceToText, setIsVoiceToText] = useState(false);

  // Created by Ivan Thew
  // Modified by Thomas Dickson
  // Function to handle search bar text change
  const handleSearch = (text) => {
    setSearchQuery(text); 
  };

  useBackHandler(() => {
    saveNoteHandler({onSaveNote});
    return true; // Return true to prevent default back behavior
  });

  useEffect(() => {
    if (countdown != null) {
      const interval = setInterval(() => {
        SetCountdown(countdown - 1);
      }, 1000);
      if (countdown == 0 && recording == null) {
        clearInterval(interval);
        setRecording("temp"); //Setting recording to a temporary string to prevent another recording object from being started.
        startRecording();
      }
      return () => clearInterval(interval);
    }
  }, [countdown]);

  // Created by Ivan Thew
  // Modified by Barrett Bujack
  const startCountdown = () => {
    SetCountdown(3);
  };

  // Created by Ivan Thew
  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        //Create audio mode
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(recordingOptions);//Prepare recording object with preset recording options
        await recording.startAsync();
        setRecording(recording);//Set recording state to current recording object to prevent duplicate recording objects
      } else {
        setMessage(
          "Please grant permission to the app to access the microphone"
        );
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  // Created by Ivan Thew
  // Modified by Thomas Dickson
  async function stopRecording() {
    if (recording) {
      // Check if recording is defined
      setRecording(undefined);//Remove recording object from state
      await recording.stopAndUnloadAsync();
    }

    try {
      const file = recording.getURI(); // get uri of file

      const downloadURL = await fetch(file).then(async (response) => { // fetch file from url
        const blob = await response.blob(); // convert audio file to binary

        // save file as id + date.wav
        const storageRef = ref(storage, `${note.id}/${Date.now()}.wav`);

        // Upload the audio recording to Firebase Storage
        await uploadBytesResumable(storageRef, blob);

        // Get the download URL of the uploaded audio
        const downloadURL = await getDownloadURL(storageRef);
        console.log(
          "Audio recording uploaded to Firebase Storage:",
          downloadURL
        );
        return downloadURL;
      });

      let updatedRecordings = [...recordings]; 

      // get sound object from recording
      const { sound, status } = await recording.createNewLoadedSoundAsync();

      // add new recording to recordings array
      updatedRecordings.push({
        sound: sound,
        duration: getDurationFormatted(status.durationMillis),
        file: recording.getURI(),
      });

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      // if user requested voice to text
      if (isVoiceToText) {
        voiceToTextBlock(recording.getURI());
      } else {
        // set note recordings to include new one
        setRecordings(updatedRecordings);

        // create block with new recording data
        const block = {
          contentType: "audio",
          content: {
            download: downloadURL,
            sound: sound,
            duration: getDurationFormatted(status.durationMillis),
            file: recording.getURI(),
          }
        };
        // insert into array
        setBlocks([...blocks, block]);
      }
      setDisplayRecording(false);
    } catch (error) {
      console.error("Error creating audio recording:", error);
    }
  }
  
  // Created by Ivan Thew
  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  const onTouchStart = (e, id) => {
    setTouchEnd(null);
    setTouchStart(e.nativeEvent.touches[0].pageX);
    setSwipedBlockIndex(id); // keep track of block
    setShowDeleteButton(false); // hide delete button
  };

  // Created by Isaac Giesajtis
  const onTouchMove = (e, id) => {
    setTouchEnd(e.nativeEvent.touches[0].pageX);
    if (swipedBlockIndex === id) {//match swiped block to block id
      setShowDeleteButton(true);//display button on block
    } 
    else {
      setShowDeleteButton(false);//hide delete button if different block
    }
  };
  
  // Created by Ivan Thew
  const recordingOptions = {
    // android not currently in use, but parameters are required
    android: {
      extension: ".wav",
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000
    },
    ios: {
      extension: ".wav",
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
      sampleRate: 44100,
      numberOfChannels: 1,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };
  
  // Detects when user swipes left and deletes block by bringing up prompt
  // Created by Isaac Giesajtis
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;//Sets distance block needs to be swiped for delete alert to show up
    const isLeftSwipe = distance > minSwipeDistance;
    if (isLeftSwipe && swipedBlockIndex >= 0) {//if user swipes left and its on a block show user delete alert
      deleteBlock(swipedBlockIndex); // right now deletes block that is swiped.
    }
    setShowDeleteButton(false);
    setSwipedBlockIndex(-1);
  };
  
  // Create by Thomas Dickson
  // Loads existing note data or creates new note
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const user = auth.currentUser;
        const collection = route.params?.collection;

        if (!user) throw new Error("Error authenticating firebase user.");

        // set global user
        setUser(user);
        setCollection(collection);

        // get session token - force refresh false for speed
        const token = await user.getIdToken(false);

        if (route.params?.note) {
          
          const note = route.params?.note;
          // Sort note.blocks based on the index property
          const sortedBlocks = note.blocks.sort((a, b) => a.index - b.index);

          // pre-populate note data
          setHeader(note.title);
          setBlocks(sortedBlocks);
          setIsEditing(true);
          setIsFavourite(note.isFavourite);

          // call api to get note from backend
          const n = await getNote(note, token);
          setNote(n);

          setLoading(false);
        } else {
          // create a new note if not editing an existing one
          const note = await createNote(collection, token);
          setNote(note);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    // if user is logged in, call fetchNote
    const unsubscribe = auth.onAuthStateChanged(fetchNote);
    return () => unsubscribe();
  }, [route.params]);

  useEffect(() => {
    const triggerFunction = route.params?.triggerFunction;
    if (triggerFunction === "handleImageToText") {
      handleImageToText();
    }
  }, [route.params]); //for home screen

  // Trigger functions for home screen buttons created by Isaac Giesajtis
  useEffect(() => {
    const triggerFunction = route.params?.triggerFunction;
    if (triggerFunction === "startRecording") {
      startRecording(setDisplayRecording(true), setIsVoiceToText(true));//parse these booleans as true so recording start when user presses
      //button from home screen
    }
  }, [route.params]); //for home screen
  
  // Created by Thomas Dickson
  const onSaveNote = async () => {
    if(!loading) {
      setLoading(true);
      
      // if not title unmodified, set to Untitled
      note.title = header == "" ? "Untitled" : header;
      note.isFavourite = isFavourite;

      try {
        // get session token
        const token = await user.getIdToken(false);

        // create/update blocks in database
        await saveBlocks(note, blocks, token);
        // update note
        await updateNote(note, token);

        // if editing an existing note
        if (isEditing) {
          const updatedNotes = notes.map((n) =>
            n === route.params.note ? note : n
          );
          setNotes(updatedNotes);
          collection.notes = notes;
        } else {
          setNotes([note, ...notes]);
          collection.notes = notes;
        }
        
        setLoading(false);
        navigation.navigate("Home", {});
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Created by Thomas Dickson
  const saveBlocks = async (note, blocks, token) => {
    try {
      if (blocks.length > 0) {
        blocks.map(async (block, index) => {
          // if no ID assigned, create a new block
          if (!block.id) {
            // call API to create a new block
            const b = await createBlock(note, block.content,
                                        block.contentType,
                                        index, token);
            console.log(`Block ${b.id} created successfully at index: ${index}!`);
          }

          // if block exists and has been updated, call API to add block
          if (block.id && block.updated) {
            const b = await updateBlock(block, token);
            console.log("Block", b.id, "updated successfully!");
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Created by Isaac Giesajtis
  // Modified by Ivan Thew
  const newTextBlock = () => {
    const block = {
      contentType: "text",
      content: ""
    };
    setBlocks([...blocks, block]);
    setDropdown(false);
    setDisplayRecording(false);
  };

  // Created by Barrett Bujack
  // Modified by Isaac Giesajtis
  const voiceToTextBlock = async (uri) => {
    console.log(uri);
    try {
      const formData = new FormData();
      formData.append("wavFile", {
        uri: uri,
        type: "audio/wav",
        name: "audio.wav",
      });

      const response = await axios.post(
        "http://45.76.113.141:8000/transcribe/",//Post to API with post endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.transcription) {
        const block = {
          contentType: "text",
          content: response.data.transcription
        };//Puts response from API into text block
        setBlocks([...blocks, block]);
      }
      else if (response.data.transcription === undefined) {
        Alert.alert(
          "Voice to Text Error",
          "Voice Memo was sent but audio couldn't be processed",
          [
            {
              text: "Ok",
            },
          ]
        );
      }
      console.log("Transcription result:", response.data.transcription);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Server Error", error, [
        {
          text: "Ok",
        },
      ]);
    }
  };

  // Created by Ethan Dharma
  // Modified by Thomas Dickson
  const deleteBlock = (j) => {
    Alert.alert("Delete Block", "Are you sure you wanna delete this block?", [
      {
        text: "Cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          // get session token
          const token = await user.getIdToken(false);
          // call api to delete block
          await deleteBlockAPI(blocks[j], token);

          // delete block from state array
          const updatedBlocks = [...blocks];
          updatedBlocks.splice(j, 1);
          setBlocks(updatedBlocks);
        },
      },
    ]);
  };
  
  // Uses temp array to swap blocks
  // Created by Isaac Giesajtis
  // Modified by Thomas Dickson
  const swapBlockDown = (selectedBlock) => {
    if (selectedBlock >= 0 && selectedBlock < blocks.length - 1) {
      //-1 fixes bug where when clicked it creates more blocks 
      const updatedBlocks = [...blocks];
      const temp = updatedBlocks[selectedBlock];
      updatedBlocks[selectedBlock] = updatedBlocks[selectedBlock + 1];
      updatedBlocks[selectedBlock + 1] = temp;

      // set blocks as been updated and set the new indexes
      updatedBlocks[selectedBlock].updated = true
      updatedBlocks[selectedBlock].index = selectedBlock
      updatedBlocks[selectedBlock + 1].updated = true
      updatedBlocks[selectedBlock + 1].index = selectedBlock + 1

      setBlocks(updatedBlocks);
    }
  };
  
  // Created by Isaac Giesajtis
  // Modified by Thomas Dickson
  const swapBlockUp = (selectedBlock) => {
    if (selectedBlock > 0 && selectedBlock < blocks.length) {
      const updatedBlocks = [...blocks];
      const temp = updatedBlocks[selectedBlock];
      updatedBlocks[selectedBlock] = updatedBlocks[selectedBlock - 1];
      updatedBlocks[selectedBlock - 1] = temp;

      // set blocks as been updated and set the new indexes
      updatedBlocks[selectedBlock].updated = true
      updatedBlocks[selectedBlock].index = selectedBlock
      updatedBlocks[selectedBlock - 1].updated = true
      updatedBlocks[selectedBlock - 1].index = selectedBlock - 1
      setBlocks(updatedBlocks);
    }
  };

  //Used to display date info in note
  //Created by Isaac Giesajtis
  const date = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const onToggleFavourite = () => {
    setIsFavourite((prevIsFavourite) => !prevIsFavourite);
  };

  // Modified by Thomas Dickson
  const onDeleteNote = () => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setLoading(true)
          // get session token
          const token = await user.getIdToken(false);
          // call API to delete note
          await deleteNote(note, token);
          
          // delete from state array
          const updatedNotes = notes.filter(
            (note) => note !== route.params.note
          );
          setNotes(updatedNotes);
          setLoading(false)
          navigation.goBack();
        },
      },
    ]);
  };

  //Created Isaac Giesajtis
  const addImageToBlock = (uri) => {
    console.log("error handling for image logging uri:", uri);
    const imageBlock = {
      contentType: "image",
      content: uri
    };
    setBlocks([...blocks, imageBlock]);
  };
  
  // Created Isaac Giesajtis
  // Modified by Thomas Dickson
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.25,
      });//image picker options
      if (!result.canceled) {
        const imageUri = result.assets ? result.assets[0].uri : result.uri; //used to check array for ios and andriod to funciton properly
      
        const downloadURL = await fetch(imageUri).then(async (response) => { // fetch file from link
          const blob = await response.blob(); // convert audio file to binary

          // save the file as ID + date.jpg
          const storageRef = ref(storage, `${note.id}/${Date.now()}.jpg`);

          // Upload the audio recording to Firebase Storage
          await uploadBytesResumable(storageRef, blob);

          // Get the download URL of the uploaded audio
          const downloadURL = await getDownloadURL(storageRef);
          console.log("Image uploaded to Firebase Storage:", downloadURL);
          return downloadURL;
        });

        addImageToBlock(downloadURL);//add image to block
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  //Handlers created Isaac Giesajtis
  const deleteNoteHandler = ({ onDeleteNote }) => {
    // can't delete while note is still initialising
    if(!loading) {
      onDeleteNote(); //delete function
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); //haptics
    }
  };

  const favoriteNoteHandler = ({ onToggleFavourite }) => {
    onToggleFavourite();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); //haptics
  };

  const saveNoteHandler = ({ onSaveNote }) => {
    onSaveNote();
    Haptics.selectionAsync(); //haptics
  };
 
  // Created Isaac Giesajtis
  const handleImageToText = async () => {
    try {
      //image picker
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      });

      if (result.canceled) {
        return;
      }
      //checks if user cancled image picker
      const formData = new FormData();
      formData.append("file", {
        uri: result.uri,
        type: "image/jpeg",
        name: "image.jpg",
      });

      const responseText = await axios.post(
        "http://45.76.113.141:8000/ocr", //Post to API with OCR post as endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ); //sending image to backend

      if (responseText.data.text) {
        //console.log("OCR txt:", responseText.data.text); test code
        const block = {
          contentType: "text",
          content: responseText.data.text
        };//Puts response from API into text block
        setBlocks([...blocks, block]);
      } else {
        //console.error("No text extracted from the image"); //img sent but no read
        Alert.alert("Image sent", "Image was sent but no text was detected", [
          {
            text: "Ok",
          },
        ]);
      }
    } catch (error) {
      //console.error("Error with OCR code:", error); //ocr error with error code
      Alert.alert(
        "OCR Error",
        "Error with OCR code:",
        error[
          {
            text: "Ok",
          }
        ]
      );
    }
  };

  
  // Created by Thomas Dickson
  // search filter : render all if search query empty OR if content type is type AND block content contains search query
  const filteredBlocks = blocks.filter(
    (block) =>
      searchQuery == "" ||
      (block.contentType == "text" &&
        block.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <View className="p-5  h-full bg-slate-900" style={{ height: windowHeight }}>
      <ScrollView>
        <View>
          <StatusBar backgroundColor={"#0F172A"} barStyle="light-content" />

          <View
            className="mb-4 flex-row items-center"
            style={{ paddingTop: Platform.OS === "ios" ? 35 : 0 }}
          >
            <AntDesign
              name="arrowleft"
              size={24}
              color="white"
              title={isEditing ? "Update Note" : "Save Note"}
              onPress={() => saveNoteHandler({ onSaveNote })}//When user press back save note
            />
            <View
              style={styles.barNew}
              className="flex items-center flex-row justify-between "
            >
              <TouchableOpacity
                style={styles.verticalGap}
                onPress={() => favoriteNoteHandler({ onToggleFavourite })}
              >
                {/* Depending if note is favourited or not display filled in heart of heart outline */}
                {isFavourite ? (
                  <Ionicons
                    name="heart"
                    size={30}
                    color="#f47eff"
                    style={styles.buttonIcon}
                  />
                ) : (
                  <Ionicons
                    name="heart-outline"
                    size={30}
                    color="#f47eff"
                    style={styles.buttonIcon}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.verticalGap}
                onPress={() => {
                  setDropdown1(!dropdown1);
                }}
              >
                <Ionicons
                  name="search-outline"
                  size={30}
                  color="white"
                  style={styles.buttonIcon}
                />
              </TouchableOpacity>
              {/* When user clicks search-outline it brings up the search bar where the user can search through the text blocks */}
              {dropdown1 && (
                <View style={styles.searchBlocks}>
                  <TextInput
                    className="p-2 border rounded-xl text-gradients-100 bg-slate-700"
                    placeholder="Search blocks..."
                    placeholderTextColor="#cbccce"
                    style={styles.searchBarBlocks}
                    value={searchQuery}
                    onChangeText={handleSearch}
                  />
                </View>
              )}
              <TouchableOpacity
                style={styles.verticalGap}
                title="Delete Note"
                onPress={() => deleteNoteHandler({ onDeleteNote })}
              >
                <Ionicons
                  name="trash-outline"
                  size={30}
                  color="white"
                  style={styles.buttonIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* Note title at the top of note */}
          <TextInput
            style={styles.titleAdd}
            placeholder="New Title..."
            placeholderTextColor="white"
            value={header}
            onChangeText={setHeader}//On change of title it is updated to new title
          />
          {/* Displays the system date in note */}
          <Text style={styles.dateAdd}>
            {date.toLocaleDateString("en-IN", options)}
          </Text>
          {/* Render all blocks which fit search condition */}
          {filteredBlocks.map(
            (textBlock, id) => (
              <React.Fragment key={id}>
                {/* Is used for swipe to delete and tracks if user swipes left */}
                <View
                  style={styles.rowAligin}
                  onTouchStart={(e) => onTouchStart(e, id)}
                  onTouchMove={(e) => onTouchMove(e, id)}
                  onTouchEnd={onTouchEnd}
                >
                  {/* Swap block up */}
                  <View style={styles.swapBlock}>
                    <TouchableOpacity
                      style={styles}
                      onPress={() => swapBlockUp(id)}
                    >
                      <Ionicons
                        name="chevron-up-outline"
                        size={30}
                        color="#e229f4"
                        style={styles.buttonIcon}
                      />
                    </TouchableOpacity>
                  {/* User can delete block from circle */}
                    <TouchableOpacity
                      style={styles}
                      //onPress={() => pickImage(id)}
                      onPress={() => deleteBlock(id)}
                    >
                      <Ionicons
                        name="ellipse-outline"
                        size={30}
                        color="#e229f4"
                        style={styles.buttonIcon}
                      />
                    </TouchableOpacity>
                  {/* Swap block down */}
                    <TouchableOpacity
                      style={styles}
                      onPress={() => swapBlockDown(id)}
                    >
                      <Ionicons
                        name="chevron-down-outline"
                        size={30}
                        color="#e229f4"
                        style={styles.buttonIcon}
                      />
                    </TouchableOpacity>
                  </View>
                {/* Render the image block with its properties */}
                  {textBlock?.contentType === "image" && (
                    <Image
                      source={{ uri: textBlock.content }}
                      style={{ width: "100%", height: 345 }}
                    />
                  )}
                  {/* Render the text block with its properties */}
                  {textBlock?.contentType == "text" && (
                    <TextInput
                      key={id}//Block id
                      value={textBlock?.content || ""}
                      onChangeText={(text) => {
                        const newBlocks = [...blocks];
                        newBlocks[id].content = text;
                        newBlocks[id].updated = true;
                        setBlocks(newBlocks);
                      }}//When text is changed in block update the text
                      className="text-gradients-100"
                      placeholder="Start Typing To Get Started!"
                      multiline={true}
                      placeholderTextColor="white"
                      paddingTop={15}
                      paddingBottom={15}
                      paddingLeft={15}
                      width="87.5%"
                    />
                  )}
                  {/* Render the audio block with its properties */}
                  {textBlock?.contentType == "audio" && (
                    <View
                      style={styles.rowAligin}
                      className="bg-slate-500 rounded-lg mt-3 ml-2"
                      height="75%"
                      width="86%"
                    >
                      <Ionicons
                        name="play"
                        size={35}
                        color="#1E293B"
                        style={styles.playButton}
                        onPress={async () => {
                          console.log(textBlock?.content);

                          if (textBlock?.content?.sound)
                            textBlock?.content?.sound.replayAsync();
                          else {
                            const { sound } = await Audio.Sound.createAsync({
                              uri: textBlock?.content,
                            });
                            await sound.playAsync();
                          }
                        }}
                      />
                    </View>
                  )}
                  {/* When block is swiped show the delete icon on the right side of the block */}
                  {showDeleteButton && swipedBlockIndex === id && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      //onPress={() => deleteBlocksButton(id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={50}
                        color="white"
                        style={styles.deleteButtonIcon}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </React.Fragment>
            )
          )}

          <View
            style={styles.viewNew}
            className="flex items-center flex-row justify-between mb-3"
          >
            <TouchableOpacity
              style={styles.roundButtonNew}
              onPress={() => {
                setDropdown(!dropdown);
              }}
            >
              {/* Used for block type menu when it is active or not it is either a plus or minus */}
              {dropdown ? (
                <Ionicons
                  name="remove-outline"
                  size={20}
                  color="white"
                  style={styles.buttonIcon}
                />
              ) : (
                <Ionicons
                  name="add-outline"
                  size={20}
                  color="white"
                  style={styles.buttonIcon}
                />
              )}
            </TouchableOpacity>
            <Text style={styles.txtNew}>Add block</Text>
          </View>
          {/* Dropdown containing all the different blocks and functions the note can add or do */}
          {dropdown && (
            <View style={styles.greyBoxAddBlock}>
              <View style={styles.blockSelect}>
                <View style={styles.test}>
                  <View style={styles.dropdownbuttonIcon}>
                    <Ionicons
                      name="document-text-outline"
                      size={15}
                      color="white"
                      onPress={newTextBlock}
                    />
                  </View>
                  {/* Make new text block */}
                  <TouchableOpacity onPress={newTextBlock}>
                    <Text style={styles.dropDown}>Paragraph</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.test}>
                  <View style={styles.dropdownbuttonIcon}>
                    <Ionicons name="text-outline" size={15} color="white" />
                  </View>
                  {/* Start voice recording for voice to text and set is voice to text to true */}
                  <TouchableOpacity
                    onPress={() => {
                      setIsVoiceToText(true);
                      setDisplayRecording(true);
                      setDropdown(false);
                    }}
                  >
                    <Text style={styles.dropDown}>Voice to text</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.test}>
                  <View style={styles.dropdownbuttonIcon}>
                    <Ionicons name="image-outline" size={15} color="white" />
                  </View>
                  {/* Use pick image function so user can get image from user gallery */}
                  <TouchableOpacity onPress={pickImage} style={styles}>
                    <Text style={styles.dropDown}>Gallery</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.blockSelect}>
                <View style={styles.test}>
                  <View style={styles.dropdownbuttonIcon}>
                    <Ionicons
                      name="mic-outline"
                      size={15}
                      color="white"
                      onPress={() => {
                        setDisplayRecording(true);
                      }}
                    />
                  </View>
                  {/* Start voice recording set is voice to text to false so its saved on the note as a voice memo */}
                  <TouchableOpacity
                    onPress={() => {
                      setIsVoiceToText(false); //Setting voice to text state to false to prevent useEffect errors upon render.
                      setDisplayRecording(true);
                      setDropdown(false); //Close the dropdown when recording is starting.
                    }}
                  >
                    <Text style={styles.dropDown}>Voice Memo</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.test}>
                  <View style={styles.dropdownbuttonIcon}>
                    <Ionicons
                      name="camera-reverse-outline"
                      size={15}
                      color="white"
                    />
                  </View>
                  {/* Start handle image to text function */}
                  <TouchableOpacity onPress={() => handleImageToText()}>
                    <Text style={styles.dropDown}>Image to text</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.test}>
                  <View style={styles.dropdownbuttonIcon}>
                    <Ionicons name="camera-outline" size={15} color="white" />
                  </View>
                  {/* Go to photo.jsx so user can use camera while in NeoNote */}
                  <TouchableOpacity
                    onPress={() => navigation.navigate("PhotoNote")}
                  >
                    <Text style={styles.dropDown}>Camera</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      {displayRecording && (
        <View
          width="110%"
          height={200}
          style={styles.recordingBlock}
          backgroundColor="#949ba6"
        >
          <TouchableOpacity
            onPress={async () => {
              setRecording(undefined);
              if (recording) {
                await recording.stopAndUnloadAsync();
              }
              SetCountdown(null);
              setDisplayRecording(false);
            }}
          >
            <Ionicons
              name="close-circle"
              size={37}
              style={styles.closeredButton}
            />
          </TouchableOpacity>
          {countdown == 0 || countdown == null ? null : (
            <Text
              style={{
                fontSize: 100,
                fontWeight: "bold",
                color: "red",
                alignSelf: "center",
              }}
            >
              {countdown}
            </Text>
          )}
	  {/* Display record / stop recording according to state */}
          {recording ? (
            <TouchableOpacity
              style={styles.redButton}
              className="rounded-md"
              onPress={stopRecording}
            />
          ) : (
            <TouchableOpacity
              style={styles.redButton}
              onPress={startCountdown}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default NoteAdd;