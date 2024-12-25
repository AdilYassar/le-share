import { View, SafeAreaView, TouchableOpacity, Image, Platform } from 'react-native'
import React, { FC, useEffect, useRef, useState } from 'react'
import { useTcp } from '../service/TCPProvider'
import { goBack, navigate } from '../utils/NavigationUtil'
import dgram from 'react-native-udp'
import LinearGradient from 'react-native-linear-gradient'
import { sendStyles } from '../styles/sendStyles'
import Icon from '../components/global/Icon'
import CustomText from '../components/global/CustomText'
import BreakerText from '../components/ui/BreakerText'
import LottieView from 'lottie-react-native'
import QRGenerateModal from '../components/modals/QRGenerateModal'
import DeviceInfo from 'react-native-device-info'
import { getBroadcastIPAddress, getLocalIPAddress } from '../utils/networkUtils'

const ReceiveScreen:FC = () => {
  const {startServer,server, isConnected} = useTcp();
  const [isScannerVisible, setIsScannerVisible] = useState(false);
 const [qrValue, setQrValue] = useState('')
 const intervalRef = useRef<NodeJS.Timeout | null>(null);
 
 const setUpServer=async()=>{
  const deviceName = await DeviceInfo.getDeviceName()
  const port = 4000;
  const ip = await getLocalIPAddress()
  if(!server){
   startServer(port)
  }
  setQrValue(`tcp://${ip}:${port} | ${deviceName}`)
  console.log('server info' ,`tcp://${ip}:${port} | ${deviceName}`)
}

const sendDiscoverySignal = async () => {
  const deviceName = await DeviceInfo.getDeviceName();
  const broadcastAddress = await getBroadcastIPAddress();
  const targetAddress = broadcastAddress || '255.255.255.255';
  const port = 57143;

  const client = dgram.createSocket({ type: 'udp4', reusePort: true });
  client.bind(() => {
    try {
      if (Platform.OS === 'android') {
        client.setBroadcast(true);
      }
      client.send(`${qrValue}`, 0, `${qrValue}`.length, port, targetAddress, (error) => {
        if (error) {
          console.error('Failed to send discovery signal:', error);
          client.close();
        } else {
          console.log(`${deviceName} sent discovery signal to ${targetAddress}:${port}`);
          client.close();
        }
      });
    } catch (error) {
      console.error('Failed to set broadcast:', error);
      client.close();
    }
  });

  client.on('error', (err) => {
    console.error('Socket error:', err);
    client.close();
  });
};

useEffect(() => {
  if(!qrValue) return
  sendDiscoverySignal();
  intervalRef.current = setInterval(sendDiscoverySignal, 2000)

  return () => {
    if(intervalRef.current){
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }
}, [qrValue])

  useEffect(() => {
    if(isConnected){
      if(intervalRef.current){
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      navigate('ConnectionScreen')
    }
  }, [isConnected])

  const handleGoBack = () => {
    if(intervalRef.current){
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  goBack()
  }

  useEffect(() => {
    setUpServer()
  }, [])

  return (
    <LinearGradient
    colors={['#bb9e93', '#bb9e', '#bb83']}
    style={sendStyles.container}
    start={{ x: 0, y: 1 }}
    end={{ x: 0, y: 0 }}
    >
    <SafeAreaView/>
   
    <View style={sendStyles.infoContainer}>
      <Icon name='blur-off' size={40} color='#000' iconFamily='MaterialIcons'   />
      <CustomText fontFamily='Okra-Bold' fontSize={16} style={{textAlign:'center',color:'#000'}}>
         Receiving from nearby devices
    </CustomText>
      <CustomText fontFamily='Okra-Bold' fontSize={12} style={{textAlign:'center',color:'#000'}}>
        Ensure your device is connected to the sender's hotspot
      </CustomText>
    <BreakerText text='or'/>
  <TouchableOpacity style={sendStyles.qrButton} onPress={()=>setIsScannerVisible(true)}>
    <Icon name='qrcode' size={16} color='#000' iconFamily='MaterialCommunityIcons' />
    <CustomText fontFamily='Okra-Bold' fontSize={12} style={{textAlign:'center',color:'#000'}}>
      Show QR Code
    </CustomText>
  </TouchableOpacity>
    </View>

    <View style={sendStyles.animationContainer}>
      <View style={sendStyles.lottieContainer}>
      <LottieView style={sendStyles.lottie}  source={require('../assets/animations/scan2.json')} autoPlay loop={true} hardwareAccelerationAndroid />
     
      </View>
      <Image source={require('../assets/images/adil.jpg')} style={sendStyles.profileImage} />
    </View>
      <TouchableOpacity onPress={handleGoBack} style={sendStyles.backButton}>
        <Icon name='arrow-back' size={20} color='#000' iconFamily='MaterialIcons' />
      </TouchableOpacity>
    {
      isScannerVisible && (
        <QRGenerateModal visible={isScannerVisible} onClose={()=>setIsScannerVisible(false)}  />
      )
    }
    </LinearGradient>
  )
}

export default ReceiveScreen