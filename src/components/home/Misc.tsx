import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import CustomText from '../global/CustomText'
import { commonStyles } from '../../styles/commonStyles'

const Misc = () => {
  return (
    <View style={styles.container}>
      <CustomText fontSize={13} fontFamily='Okra-Bold' style={{color:'#fff'}}>Explore</CustomText>
        <Image source={require("../../assets/icons/wild_robot.jpg")} style={styles.adbanner} />
    <View style={commonStyles.flexRowBetween}>
        <CustomText fontFamily='Okra-Bold' fontSize={32} style={[{color:'#fff'},styles.text]}> #1 My First File Sharing App</CustomText>
        <Image source={require("../../assets/images/2.png")} style={styles.image} />
    </View>
   
   <CustomText fontFamily='Okra-Bold' style={[{color:'#fff', marginTop:15},styles.text]}>
    Made By Adil Yassar 
   </CustomText>
    </View>
  )
}
const styles = StyleSheet.create({
    container:{
        paddingVertical:20
    },
    adbanner:{
        width:'100%',
        height:120,
        resizeMode:'cover',
        borderRadius:10,
        marginVertical:25
    },
    text:{
        opacity:0.5,
        width:'60%',
    },
    image:{
        resizeMode:'contain',
        height:120,
        width:'35%'

    }
})
export default Misc