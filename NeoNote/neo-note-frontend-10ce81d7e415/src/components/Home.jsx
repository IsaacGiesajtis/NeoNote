import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StatusBar,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Animated,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import SwitchSelector from "react-native-switch-selector";
import styles from "./style";
import NoteContext from "./NoteContext";
import * as Haptics from 'expo-haptics';

// firebase imports
import { auth } from "../../firebase";

// api
import { fetchCollection } from "../api/collection";
import { deleteNote as deleteNoteAPI } from "../api/note";
import LoadingAnimation from "../assets/LoadingAnimation";

const Home = () => {
  const [user, setUser] = useState(null);
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true)

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  const route = useRoute();
  const navigation = useNavigation();

  const [showFavourites, setShowFavourites] = useState(false); // State variable to toggle favorite notes display
  const { notes, setNotes } = useContext(NoteContext); // Use the useContext hook to access notes and setNotes
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownItems = ["Logout"];

  // Created by Thomas Dickson
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const user = auth.currentUser;

        if (user) {
          // if signed in
          setUser(user);

          // get session token
          const token = await user.getIdToken(false);

          // get collection for user
          const collection = await fetchCollection(user.uid, token);
          // update state with new data
          setNotes(collection.notes)
          setCollection(collection);
          
          // page no longer loading
          setLoading(false)
        } else {
          // not signed in
          navigation.navigate("Login");
          setLoading(false)
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    // when user has logged in, called fetchData, else detach auth state
    const unsubscribe = auth.onAuthStateChanged(fetchData);
    return () => unsubscribe();
  }, [route.params]) // refresh on each navigation

  // if the collection has not been rendered, show loading animation
  if(loading) return <LoadingAnimation/>

  // Function to handle search bar text change
  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const toggleShowFavourites = (value) => {
    setShowFavourites(value);
  };

  // when note is pressed, navigate to NoteAdd page
  const onNotePress = (note) => {
    navigation.navigate("NoteAdd", { note, collection });
  };

  // Created by Ivan Thew and Ethan Dharma
  const toggleFavourite = (index) => {
    // Create a copy of the notes array to avoid direct mutation
    const updatedNotes = [...notes];
    updatedNotes[index].isFavourite = !updatedNotes[index].isFavourite;

    // Update the state with the modified notes array
    setNotes(updatedNotes);
  };
  
  // created by Ethan Dharma
  const logout = () => {
    auth.signOut();
    navigation.navigate("Login");
  };
  
  const showDropdownMenu = () => {
    setDropdownVisible(true);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideDropdownMenu = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 0.8,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDropdownVisible(false);
    });
  };

  // created by Ethan Dharma
  const filteredNotes = showFavourites
    ? notes.filter(
        (note) =>
          note.isFavourite &&
          note.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes.filter((note) =>
        note.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  // option for switch selector
  const options = [
    { label: "All", value: false },
    { label: "Favourites", value: true },
  ];
  
  // Delete note created by Ethan Dharma
  // Modified by Isaac Giesajtis & Thomas Dickson
  const deleteNote = (note, index) => {
    Alert.alert(
      "Delete Note",
      `Are you sure you want to delete ${note.title}?`,
      [
        {
          text: "Cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            const token = await user.getIdToken(false); // get a session token
            deleteNoteAPI(notes[index], token); // call API to delete given note, run synchronously to update frontend instantly

            const updatedNotes = [...notes];
            updatedNotes.splice(index, 1); //Remove note from array
            setNotes(updatedNotes); //Update the notes
          },
        },
      ]
    );
  };

  // Handlers created by Isaac Giesajtis to add haptics to existing functions 
  const deleteNoteHandler = ({ note, index, deleteNote }) => {
    deleteNote(note, index); //delete function
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); //haptics
  };

  const favoriteNoteHandler = ({ index, toggleFavourite }) => {
    toggleFavourite(index);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); //haptics
  };

  const showFavouritesHandler = ({ value, toggleShowFavourites }) => {
    toggleShowFavourites(value);
    Haptics.selectionAsync(); //haptics
  };
  
  return (
    <TouchableWithoutFeedback onPress={hideDropdownMenu}>
      <View className="p-5  h-full bg-slate-900">
        {dropdownVisible && (
          <Animated.View
            style={[styles.dropdownMenu, { opacity, transform: [{ scale }] }]}
          >
            {dropdownItems.map((item, index) =>
              item === "Logout" ? (
                <TouchableOpacity key={index} onPress={logout}>
                  <View style={styles.dropdownItem}>
                    <Ionicons name="log-out" size={20} color="#ff1717" />
                    <Text className="text-white">{item}</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity key={index}>
                  <View style={styles.dropdownItem}>
                    <Text className="text-white">{item}</Text>
                  </View>
                </TouchableOpacity>
              )
            )}
          </Animated.View>
        )}

        <ScrollView>
          <StatusBar backgroundColor={"#0F172A"} barStyle="light-content" />
          <View
            className="mb-4 flex-row items-center justify-between"
            style={{ paddingTop: Platform.OS === "ios" ? 35 : 0 }}
          >
            <Text className="text-3xl font-inter font-extrabold text-gradients-100">
              My Notes
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (dropdownVisible) {
                  hideDropdownMenu();
                } else {
                  showDropdownMenu();
                }
              }}
            >
              <Ionicons name="person-circle-outline" size={40} color="gray" />
            </TouchableOpacity>
          </View>

          {/* Search bar in the homepage */}
          <View className="mt-4 mb-4" paddingBottom={15}>
            <TextInput
              className="p-2 border rounded-xl text-gradients-100 bg-slate-700"
              placeholder="Search Notes"
              placeholderTextColor="#cbccce"
              style={styles.searchBar}
              value={searchQuery}
              onChangeText={handleSearch} // Does our searches whenever characters are changed
              onPressIn={() => hideDropdownMenu()}
            />
          </View>
          
          {/* Allows us to swap between All notes or our Favourited notes */}
          <View className="flex-row items-center justify-center mb-2 p2">
            <SwitchSelector
              options={options} // Options array declared earlier
              initial={0}
              fontSize={17}
              backgroundColor="#334155"
              selectedColor="black"
              buttonColor="white"
              textColor="gray"
              animationDuration={280}
              onPress={(value) => {
                showFavouritesHandler({ value, toggleShowFavourites });// Toggle between all notes or favourite
                hideDropdownMenu();
              }}
              style={{ width: 280 }}
            />
          </View>

          <View style={styles.boxWrap}>
            {/* Render all notes on home page that fit filter condition */}
            {filteredNotes.map((note, index) => (
              <TouchableOpacity
                style={styles.noteHome}
                key={index}
                // On press we go into note
                onPress={() => {
                  onNotePress(note);
                  setDropdownVisible(false);
                }}
                // On long press we delete note along with haptic feedback
                onLongPress={() => {
                  deleteNoteHandler({ note, index, deleteNote });
                  hideDropdownMenu();
                }}
              >
                <View>
                  <View style={styles.rowAligin}>
                    <Text style={styles.homepageTitle}>
                      {note.title.substring(0, 12)} {/* Note heading can only be 12 characters long */}
                    </Text>
                    <TouchableOpacity
                      style={styles.heartHome}
                      onPress={() =>
                        favoriteNoteHandler({ index, toggleFavourite })
                      }
                      key={index}
                    >
                      {/* Display different heart or heart outline depending on whether the note is favourited or not */}
                      {note.isFavourite ? (
                        <Ionicons
                          name="heart"
                          size={25}
                          color="#f47eff"
                          style={styles.buttonIconHome}
                        />
                      ) : (
                        <Ionicons
                          name="heart-outline"
                          size={25}
                          color="#f47eff"
                          style={styles.buttonIconHome}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={styles.noteBoxTxt}
                    className="text-gradients-100"
                  >
                    {/* Render the first block in each note in note preview (must sort to find first block)
                        Block content on homescreen can only be 71 characters long */}
                    {note.blocks.length > 0 && note.blocks.sort((a, b) => a.index - b.index)[0].contentType == "text"
                      ? note.blocks.sort((a, b) => a.index - b.index)[0].content.substring(0, 71)
                      : ""}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {/* Display "No notes" text if there are no notes */}
        {notes.length === 0 && (
          <View style={styles.noNotes}>
            <Text style={styles.noNotes}>You have no notes.</Text>
          </View>
        )}

      <View
        style={styles.backForAdd}
        className="flex items-center flex-row justify-between"
      >
        
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => {navigation.navigate("NoteAdd", { collection }); hideDropdownMenu();}} // navigate to NoteAdd and pass collection
        >
          <Ionicons
            name="add-outline"
            size={32}
            color="white"
            style={styles.buttonIcon}
          />
        </TouchableOpacity>

          <TouchableOpacity
            style={styles.roundButton}
            onPress={() => {
              navigation.navigate("NoteAdd", {
                collection, triggerFunction: "startRecording",// When navigating to NodeAdd trigger
                // function is setup and if the triggerfunctions here matches it activates boolean and makes Voice to text happen instantly
                // Created by Isaac Giesajtis
              });
            }}
          >
            <Ionicons
              name="mic-outline"
              size={32}
              color="white"
              style={styles.buttonIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.roundButton}
            onPress={() => {
              navigation.navigate("NoteAdd", {
                collection, triggerFunction: "handleImageToText",//Trigger function which opens user gallery then does image to text
              });
            }}
          >
            <Ionicons
              name="camera-outline"
              size={32}
              color="white"
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Home;
