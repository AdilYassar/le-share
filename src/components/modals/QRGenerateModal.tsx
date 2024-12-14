import React, { FC, useEffect, useState } from 'react';
import { View, Modal, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { modalStyles } from '../../styles/modalStyles';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '../global/Icon';
import CustomText from '../global/CustomText';
import QRCode from 'react-native-qrcode-svg';
import { multiColor } from '../../utils/Constants';
import DeviceInfo from 'react-native-device-info';
import { useTcp } from '../../service/TCPProvider';
import { navigate } from '../../utils/NavigationUtil';
import { getLocalIPAddress } from '../../utils/networkUtils';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

const QRGenerateModal: FC<ModalProps> = ({ visible, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [qrValue, setQRValue] = useState('adil');
  const {isConnected,startServer,server} = useTcp();


  const setUpServer=async()=>{
    const deviceName = await DeviceInfo.getDeviceName()
    const port = 4000;
    const ip = await getLocalIPAddress()
    if(server){
    
     
      setQRValue(`tcp://${ip}:${port} | ${deviceName}`)

      setLoading(false)
      return
    }
    startServer(port)
    setQRValue(`tcp://${ip}:${port} | ${deviceName}`)
    console.log('QRGenerateModal :setUpServer',`tcp://${ip}:${port} | ${deviceName}`) 
    setLoading(false)
  }
  // Simulate QR code generation when the modal is visible
  useEffect(() => {
    if(visible){
        setLoading(true)
        setUpServer();
    }
  }, [visible]);

  useEffect(() => { 
    console.log('TCPProvider :isConnected',isConnected)
    if(isConnected){
      onClose();
      navigate('ConnectionScreen');
    }
  }, [isConnected]);


  return (
    <Modal
      animationType="slide"
      visible={visible}
      presentationStyle="formSheet"
      onRequestClose={onClose}
      onDismiss={onClose}
    >
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.qrContainer}>
          {loading || !qrValue ? (
            <View style={modalStyles.skeleton}>
              <Animated.View>
                <LinearGradient
                  colors={['#f3f3f3', '#fff', '#f3f3f3']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={modalStyles.shimmerGradient}
                />
              </Animated.View>
            </View>
          ) : (
            <QRCode
              value={qrValue}
              size={250}
              logoSize={60}
              logoBackgroundColor="#fff"
              logoMargin={2}
              logoBorderRadius={10}
              logo={require('../../assets/images/adil.jpg')}
              linearGradient={multiColor}
              enableLinearGradient
            />
          )}
        </View>

        <View style={modalStyles.info}>
          <CustomText style={modalStyles.infoText1}>
            Ensure you are on the same WiFi network.
          </CustomText>
          <CustomText style={modalStyles.infoText2}>
            Ask the sender to scan this QR code to connect and transfer files.
          </CustomText>
        </View>

        {loading && <ActivityIndicator size="small" color="#000" style={{ alignSelf: 'center' }} />}

        <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
          <Icon name="close" iconFamily="MaterialCommunityIcons" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default QRGenerateModal;
