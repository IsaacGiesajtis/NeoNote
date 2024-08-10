import React from 'react';
import 'react-native-gesture-handler';
import NoteAdd from './src/components/NoteAdd';
import Home from './src/components/Home';
import Login from './src/components/Login';
import SignUp from './src/components/SignUp';
import PhotoNote from './src/components/PhotoNote';
import { NoteProvider } from './src/components/NoteContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox } from 'react-native';


const Stack = createStackNavigator();

const App = () => {
  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message

  return(
    <NoteProvider>
      <NavigationContainer theme={{colors: {background: '#0F172A'}}}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          
        <Stack.Screen
          component={Login}
          name='Login'
          />

          <Stack.Screen
          component={SignUp}
          name='SignUp'
          />

          <Stack.Screen
          component={Home}
          name='Home'
          />

          <Stack.Screen
          component={NoteAdd}
          name='NoteAdd'
          />

          <Stack.Screen
          component={PhotoNote}
          name="PhotoNote"
          />

        </Stack.Navigator>
      </NavigationContainer>
    </NoteProvider>
  );
  
};
//Stack Screen and stack navigator allows us to swipe left to go back to the previous page
//Created Ethan Dharma
//Modified by Ivan Thew and Isaac Giesajtis 
export default App;
