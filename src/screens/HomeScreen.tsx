import { ScrollView, StatusBar, View } from 'react-native'
import React, { FC } from 'react'
import { commonStyles } from '../styles/commonStyles'
import HomeHeader from '../components/home/HomeHeader'
import SendRecieveButton from '../components/home/SendRecieveButton'
import Options from '../components/home/Options'
import Misc from '../components/home/Misc'
import AbsoluteQRBottom from '../components/home/AbsoluteQRBottom'
import News from '../components/home/News'
import CustomText from '../components/global/CustomText'


const HomeScreen:FC = () => {
  return (
    <View style={commonStyles.baseContainer}>
     
      
     
    
     <ScrollView contentContainerStyle={{padding:5, marginBottom:35}} showsVerticalScrollIndicator={false} >
      <>
      <HomeHeader />
      </>
       <SendRecieveButton />
        <Options isHome />
        <CustomText fontSize={22} style={{color:'#bb9e9e',marginTop:25, marginBottom:5}}>Latest News</CustomText>
        <News  />
        <Misc />
      
     </ScrollView>


     <AbsoluteQRBottom />
    </View>
  )
}

export default HomeScreen