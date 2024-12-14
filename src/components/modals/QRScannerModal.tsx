import React, { FC, useEffect, useMemo, useState } from 'react';
import { View, Modal, TouchableOpacity, ActivityIndicator, Animated, Image } from 'react-native';
import { Camera, useCameraDevice, CodeScanner } from 'react-native-vision-camera';
import { modalStyles } from '../../styles/modalStyles';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '../global/Icon';
import CustomText from '../global/CustomText';
import { useTcp } from '../../service/TCPProvider';
import { navigate } from '../../utils/NavigationUtil';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

const QRScannerModal: FC<ModalProps> = ({ visible, onClose }) => {
  const {connectToServer, isConnected}=useTcp()
  const [loading, setLoading] = useState(true);
  const [codeFound, setCodeFound] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const device = useCameraDevice('back');
  
  // Request camera permission
  useEffect(() => {
    const checkPermission = async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      setHasPermission(cameraPermission === 'granted');
    };
    checkPermission();

    if (visible) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 400);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleScan = (data: string) => {
    const [connectionData, deviceName] = data.replace('tcp://', '').split('|');
    const [host, port] = connectionData?.split(':');
    // Connect to server or handle scanned data here
    console.log(`Host: ${host}, Port: ${port}, Device: ${deviceName}`);

    connectToServer(host, parseInt(port, 10), deviceName);





  };

  const codeScanner = useMemo<CodeScanner>(
    () => ({
      codeTypes: ['qr', 'codabar'],
      onCodeScanned: (codes) => {
        if (codeFound) return;
        if (codes?.length > 0) {
          const scannedData = codes[0].value || '';
          console.log(`Scanned data: ${scannedData}`);
          setCodeFound(true);
          handleScan(scannedData);
        }
      },
    }),
    [codeFound]
  );


useEffect(()=>{
  if(isConnected){
    onClose()
    navigate('ConnectionScreen')
    
  }
},[isConnected])


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
          {loading ? (
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
          ) : !hasPermission ? (
            <View style={modalStyles.skeleton}>
              <Image
                source={require('../../assets/images/no_camera.png')}
                style={modalStyles.noCameraImage}
              />
            </View>
          ) : device ? (
            <View style={modalStyles.skeleton}>
              <Camera
                style={modalStyles.camera}
                isActive={visible}
                device={device}
                codeScanner={codeScanner}
              />
            </View>
          ) : (
            <ActivityIndicator size="large" color="#000" />
          )}
        </View>

        <View style={modalStyles.info}>
          <CustomText style={modalStyles.infoText1}>
            Ensure You are on the same WiFi network.
          </CustomText>
          <CustomText style={modalStyles.infoText2}>
            Ask the receiver to show a QR code to connect so that you can transfer files.
          </CustomText>
        </View>

        <ActivityIndicator size="small" color="#000" style={{ alignSelf: 'center' }} />

        <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
          <Icon name="close" iconFamily="MaterialCommunityIcons" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default QRScannerModal;
