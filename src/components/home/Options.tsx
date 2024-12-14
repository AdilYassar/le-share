import { View, Text, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import { optionStyles } from '../../styles/optionsStyles';
import Icon from '../global/Icon';
import CustomText from '../global/CustomText';
import { useTcp } from '../../service/TCPProvider';
import { navigate } from '../../utils/NavigationUtil';
import { pickDocument, pickImage } from '../../utils/libraryHelpers';

const Options:FC<{
    isHome?:boolean,
    onMediaPickedUp?:(media:any) => void;
    onFilePickedUp?:(file:any) => void;
}> = ({isHome,onFilePickedUp,onMediaPickedUp}) => {

  const {isConnected}=useTcp()

    const handleUniversalPicker = async(type:string)=>{
      if(isHome){
        if(isConnected){
          navigate('ConnectionScreen')
        }else{
          navigate('SendScreen')
        }
        return 
      }

      if(type==='images' && onMediaPickedUp){
        pickImage(onMediaPickedUp)
      }
      if(type==='document' && onFilePickedUp){
        pickDocument(onFilePickedUp)
      }
       
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