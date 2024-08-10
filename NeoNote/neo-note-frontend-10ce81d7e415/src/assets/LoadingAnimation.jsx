import React from 'react';
import { Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native';

const LoadingAnimation = () => {

  return (
    <View style={{display: 'flex', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: '#0F172A'}}>
      <ActivityIndicator size='30%' color="#C026D3"/>
    </View>
    
  );
};

export default LoadingAnimation;