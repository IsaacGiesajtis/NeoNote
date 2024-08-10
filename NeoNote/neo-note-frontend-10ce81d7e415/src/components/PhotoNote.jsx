import React, { useState, useContext, useEffect, useRef } from "react"; 
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StatusBar,
  Alert,
  ScrollView,
  Image,
  SafeAreaView,
  Button
} from "react-native";
import { spacing, colors, useColorScheme } from "nativewind";
import { AntDesign } from "@expo/vector-icons";
import {
  FontVariant,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "./style";
import { Ionicons } from "@expo/vector-icons";
import NoteContext from "./NoteContext";
import { Audio } from "expo-av";
import * as ImagePicker from 'expo-image-picker';
import { Permissions } from 'expo';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';


const PhotoNote = () => {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [photo, setPhoto] = useState();
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");

      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
    //Request permission if granted we have camera and media access
  }, []);
  //Created by Barrett Bujack

  if (hasCameraPermission === null || hasMediaLibraryPermission === null) {
    return (
      <View style={styles.container}>
        {hasCameraPermission === null && (
          <>
            <Text style={{ textAlign: 'center' }}>We need your permission to use the camera</Text>
            <Button onPress={() => setHasCameraPermission(true)} title="Grant Camera Permission" />
          </>
        )}
        {hasMediaLibraryPermission === null && (
          <>
            <Text style={{ textAlign: 'center' }}>We need your permission to access the gallery</Text>
            <Button onPress={() => setHasMediaLibraryPermission(true)} title="Grant Gallery Permission" />
          </>
        )}
      </View>
    );
  }
  //Created by Barrett Bujack

  if (!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change this in settings.</Text>;
  }
  //Created by Barrett Bujack

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    }//Image taken in camera options
    const data = await cameraRef.current.takePictureAsync();
    console.log(data);

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };//Created by Barrett Bujack

  if (photo) {
    let savePic = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {//Save photo with by using the image uri
        setPhoto(undefined);//clears photo from memory
      });
    };
    return (
      <SafeAreaView>
        <Image style={{ width: '100%', height: '91%' }} source={{ uri: photo.uri }} />
        {hasMediaLibraryPermission ? <Button title="Save" onPress={savePic} /> : undefined}
        <Button title="Discard" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>//Sets photo taken to the screen where save or discard can be pressed
    );//Created by Isaac Giesajtis
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.takePhoto}>
        <Ionicons
          name="radio-button-on-outline"
          size={86}
          color="white"
          onPress={takePic}
        />
      </View>
      <View style={styles.exit}>
        <Ionicons
          name="caret-back-circle-outline"
          size={86}
          color="white"
          onPress={() => navigation.goBack()}
        />
      </View>
      {/* Buttons on the camera display */}
      {photo && (
        <View style={{ flex: 1 }}>
          <Image source={{ uri: photo.uri }} style={{ flex: 1 }} />
          <Button
            title="Save"
            onPress={async () => {
              if(hasMediaLibraryPermission) 
              {
                await MediaLibrary.saveToLibraryAsync(photo.uri);
              }//Save image
            }}
          />
          <Button
            title="Discard"
            onPress={() => setPhoto(null)}//Clear the photo state without saving
          />
        </View>
      )}
    </Camera>
    //Created by Isaac Giesajtis
  );
};

//PhotoNote frontend created by Barrett Bujack and Isaac Giesajtis

export default PhotoNote;
