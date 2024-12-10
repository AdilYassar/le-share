import { View, Text, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import { optionStyles } from '../../styles/optionsStyles';
import Icon from '../global/Icon';
import CustomText from '../global/CustomText';

const Options:FC<{
    isHome?:boolean,
    onMediaPickedUp?:(media:any) => void;
    onFilePickedUp?:(file:any) => void;
}> = ({isHome,onFilePickedUp,onMediaPickedUp}) => {

    const handleUniversalPicker = async(type:string)=>{

    }
  return (
    <View style={optionStyles.container}>
      <TouchableOpacity style={optionStyles.subContainer} onPress={()=>handleUniversalPicker('images')}>
        <Icon  name='image-multiple' iconFamily='MaterialCommunityIcons' color='#000'  size={20} />
      <CustomText fontSize={12} fontFamily={'Okra-Bold'} style={{marginTop:4, textAlign:'center'}}>Photos</CustomText>
      </TouchableOpacity>
      <TouchableOpacity style={optionStyles.subContainer} onPress={()=>handleUniversalPicker('file')}>
        <Icon  name='radio' iconFamily='MaterialCommunityIcons' color='#000'  size={20} />
      <CustomText fontSize={12} fontFamily={'Okra-Bold'} style={{marginTop:4, textAlign:'center'}}>Audio</CustomText>
      </TouchableOpacity>
      <TouchableOpacity style={optionStyles.subContainer} onPress={()=>handleUniversalPicker('file')}>
        <Icon  name='folder' iconFamily='MaterialCommunityIcons' color='#000'  size={20} />
      <CustomText fontSize={12} fontFamily={'Okra-Bold'} style={{marginTop:4, textAlign:'center'}}>Files</CustomText>
      </TouchableOpacity>
      <TouchableOpacity style={optionStyles.subContainer} onPress={()=>handleUniversalPicker('file')}>
        <Icon  name='account' iconFamily='MaterialCommunityIcons' color='#000'  size={20} />
      <CustomText fontSize={12} fontFamily={'Okra-Bold'} style={{marginTop:4, textAlign:'center'}}>Contacts</CustomText>
      </TouchableOpacity>
    </View>
  )
}

export default Options