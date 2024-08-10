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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Image } from 'react-native';
import Logo from '../Logo/NN_Logo.png';

const Login = () => {
  const navigation = useNavigation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit= async (e) => {
    e.preventDefault();
    
    try {
      // Login with Firebase Client SDK
      await signInWithEmailAndPassword(auth, email, password);

      // Navigate to Home page
      navigation.navigate("Home")
    } catch (error) {
      console.log(error)
      Alert.alert("Password Invalid", error.message, [
        {
          text: "Ok"
        }
      ]);
    }
  }
  //Backend connections done by Thomas Dickson

  return (
    <View className="p-5  h-full bg-slate-900">
        <View
          style={{ paddingTop: Platform.OS === "ios" ? 135 : 100 }}
        >
          <StatusBar backgroundColor={"#0F172A"} barStyle="light-content" />
          <View style={styles.LoginImg}>
            <Image
              //style={styles.LoginImg}
              source={require('../Logo/NN_Logo.png')}
            />
          </View>           
        </View>
        <View className="mt-4 mb-4" paddingBottom={15}>
          <TextInput
            className="p-2 border rounded-xl text-gradients-100 bg-slate-700"
            placeholder="Email"
            placeholderTextColor="#cbccce"
            style={styles.searchBar}
            onChangeText={text => setEmail(text)}
          />
        </View>
        <View className="mt-4 mb-4" >
          <TextInput
            className="p-2 border rounded-xl text-gradients-100 bg-slate-700"
            placeholder="Password"
            type="password"
            secureTextEntry={true}//makes blur work
            placeholderTextColor="#cbccce"
            style={styles.searchBar}
            onChangeText={text => setPassword(text)}
          />
        </View>
        <TouchableOpacity style={styles.loginButton}  onPress={onSubmit}>
          <Text style={styles.loginbuttonTxt}>Login</Text> 
        </TouchableOpacity>
        <TouchableOpacity style={styles.neAcButton}  onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.loginbuttonTxt}>New Account</Text>
        </TouchableOpacity>
        <Text  style={styles.loginTxtPurp} paddingTop={45}>
         Forgot your password?
        </Text>
    </View>
  );
};

//Login frontend created and styled by Isaac Giesajtis

export default Login;
