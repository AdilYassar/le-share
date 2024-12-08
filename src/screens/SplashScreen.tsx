/* eslint-disable @typescript-eslint/no-unused-vars */
import { View, Text, Image, StyleSheet } from 'react-native';
import React, { FC, useEffect } from 'react';
import { navigate, replace } from '../utils/NavigationUtil';
import { commonStyles } from '../styles/commonStyles';
import { screenWidth } from '../utils/Constants';


const SplashScreen:FC = () => {

    const navigateToHome = () => {
        console.log('Navigating to Home screen...');
        navigate('HomeScreen');
      };
      
    useEffect(()=>{
        const timeoutId = setTimeout(navigateToHome,2000);
        return ()=>clearTimeout(timeoutId);
    },[]);
  return (
    <View style={commonStyles.container}>
     <Image
     style= {styles.img}
     source={require('../assets/images/2.png')}/>
    </View>
  );
};


const styles = StyleSheet.create({
    img: {
        width: screenWidth * 0.7,
        height: screenWidth * 0.7,
        resizeMode: 'contain',
    },
});

export default SplashScreen;
