import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { FC } from 'react'
import { screenHeight } from '../../utils/Constants'
import { navigate } from '../../utils/NavigationUtil'

const SendRecieveButton:FC = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={()=>navigate('SendScreen')}>
        <Image source={require("../../assets/icons/11.png")} style={styles.img} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={()=>navigate('ReceiveScreen')}>
        <Image source={require("../../assets/icons/12.png")} style={styles.img} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        marginTop:screenHeight * 0.04,
        flexDirection:'row',
        justifyContent:'space-evenly'
    },
    img:{
        width:'100%',
        height:'100%',
        resizeMode:'cover'
    },
    button:{
        width:140,
        height:100,
        borderRadius:10,
        overflow:'hidden'
    }
})

export default SendRecieveButton