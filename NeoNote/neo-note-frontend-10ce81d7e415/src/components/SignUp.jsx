import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Button,
  FlatList,
  Text,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { spacing, colors, useColorScheme } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { FontVariant } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SwitchSelector from "react-native-switch-selector";
import styles from "./style";
import NoteContext from "./NoteContext";

import axios from "axios";

// firebase imports 
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";

// Sign up UI Design by Barrett Bujack (No code implementation)
const SignUp = () => {
  const REGISTER_ENDPOINT = 'http://45.76.113.141:8080/users/register';
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Created by Thomas Dickson
  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      // Register with Firebase Client SDK
      await createUserWithEmailAndPassword(auth, email, password);

      const user = auth.currentUser;
      
      // Retrieve token after authentication
      var token = await user.getIdToken(/* forceRefresh */ true);
      
      // set request headers
      const headers = {
        Authorization: `Bearer ${token}`
      };

      // Post Spring Boot API to create a collection for user
      await axios.post(REGISTER_ENDPOINT, null, {headers: headers});
      
      // Navigate to home page
      navigation.navigate("Home");
    
    // Console log password error and also show the user with an alert that they're password is invalid
    } catch (error) {
      console.log(error);
      Alert.alert("Password Invalid", error.message, [
        {
          text: "Ok"
        }
      ]);
    }
  }

  return (
    <View className="p-5  h-full bg-slate-900">
        <View
          style={{ paddingTop: Platform.OS === "ios" ? 110 : 75 }}
        >
          <StatusBar backgroundColor={"#0F172A"} barStyle="light-content" />
          <Text style={styles.Login}>
            Sign Up
          </Text>
        </View>
        <View className="mt-4 mb-4" paddingBottom={15}>
          <TextInput
            className="p-2 border rounded-xl text-gradients-100 bg-slate-700"
            placeholder="Email"
            placeholderTextColor="#cbccce"
            style={styles.searchBar}
            onChangeText={text => setEmail(text)}//Done by Thomas Dickson
            //onChangeText={handleSearch}
          />
        </View>
        <View className="mt-4 mb-4" paddingBottom={15}>
          <TextInput
            className="p-2 border rounded-xl text-gradients-100 bg-slate-700"
            placeholder="Password"
            type = "password"
            secureTextEntry={true}//makes blur work
            placeholderTextColor="#cbccce"
            style={styles.searchBar}
            onChangeText={text => setPassword(text)}//Done by Thomas Dickson
            //onChangeText={handleSearch}
          />
        </View>
        <View className="mt-4 mb-4" >
          <TextInput
            className="p-2 border rounded-xl text-gradients-100 bg-slate-700"
            placeholder="Confirm Password"
            secureTextEntry={true}//makes password blur work
            type="password"
            placeholderTextColor="#cbccce"
            style={styles.searchBar}
            //onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={onSubmit}>
          <Text style={styles.loginbuttonTxt}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.neAcButton}  onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginbuttonTxt}>Existing User</Text>
        </TouchableOpacity>
    
    </View>

    //
  );
};

//Frontend created and styled by Isaac Giesajtis

export default SignUp;
