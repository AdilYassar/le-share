import { View, Text, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import CustomText from '../global/CustomText';

const BreakerText:FC<{text:string}> = ({text}) => {
  return (
    <View style={styles.breakerContainer}>
        <View style={styles.horizontalLine} />
            <CustomText fontSize={12} fontFamily='Okra-Regular' style={[styles.BreakerText,{color:'#000'}]}>
                {text}
            </CustomText>
        <View style={styles.horizontalLine}  />
    </View>
  )
}
const styles = StyleSheet.create({
    breakerContainer: {
       flexDirection: 'row',
         justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 20,
            marginHorizontal: 10,
            width: '80%',
    },
    horizontalLine: {  
        flex: 1,  
        height: 1,  
        backgroundColor: 'black',  
        marginHorizontal: 10,
    },
    BreakerText:{
      
        marginHorizontal: 10,
        color: 'black',
        opacity: 0.8,
        textAlign:'center'
    }
});

export default BreakerText