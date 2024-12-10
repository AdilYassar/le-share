import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { FC } from 'react'
import { modalStyles } from '../../styles/modalStyles';
import Icon from '../global/Icon';
import CustomText from '../global/CustomText';



interface ModalProps{
    visible:boolean;
    onClose:()=>void
}


const QRScannerModal:FC<ModalProps>= ({visible, onClose}) => {

  return (
    <Modal
    animationType='slide'
    visible={visible}
    presentationStyle='formSheet'
    onRequestClose={onClose}
    onDismiss={onClose}
    
    >
     <View style={modalStyles.modalContainer}>
        <View style = {modalStyles.qrContainer}> 
            
            
        </View>   
        <View style={modalStyles.info}>
            <CustomText style={modalStyles.infoText1}>
                Ensure You are on The same Wifi Network
            </CustomText>
            <CustomText style={modalStyles.infoText2}>
              Ask the Reciever to show a QR code to connect so that you can transfer files
            </CustomText>
            
            
            </View> 

            <ActivityIndicator size='small' color='#000' style={{alignSelf:'center'}}   />
        <TouchableOpacity style={modalStyles.closeButton} onPress={()=>onClose()}>
            <Icon name='close' iconFamily='MaterialCommunityIcons' size={24} color='#000' />
        </TouchableOpacity>
     </View>
    </Modal>
  )
}

export default QRScannerModal