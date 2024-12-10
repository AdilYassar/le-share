import { ScrollView, View } from 'react-native'
import React, { FC } from 'react'
import { commonStyles } from '../styles/commonStyles'
import HomeHeader from '../components/home/HomeHeader'
import SendRecieveButton from '../components/home/SendRecieveButton'
import Options from '../components/home/Options'
import Misc from '../components/home/Misc'
import AbsoluteQRBottom from '../components/home/AbsoluteQRBottom'


const HomeScreen:FC = () => {
  return (
    <View style={commonStyles.baseContainer}>
     <HomeHeader />
     <ScrollView contentContainerStyle={{padding:15, paddingBottom:100}} showsVerticalScrollIndicator={false} >
       <SendRecieveButton />
        <Options isHome />
        <Misc />
     </ScrollView>


     <AbsoluteQRBottom />
    </View>
  )
}

export default HomeScreen