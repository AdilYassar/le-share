import { View, Animated, Easing, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { useTcp } from '../service/TCPProvider'
import { goBack, navigate } from '../utils/NavigationUtil'
import dgram from 'react-native-udp'
import LinearGradient from 'react-native-linear-gradient'
import { sendStyles } from '../styles/sendStyles'
import Icon from '../components/global/Icon'
import CustomText from '../components/global/CustomText'
import BreakerText from '../components/ui/BreakerText'
// import lottie from 'lottie-react-native'
import LottieView from 'lottie-react-native'
import { screenHeight, screenWidth } from '../utils/Constants'
import QRScannerModal from '../components/modals/QRScannerModal'


const deviceName = ['Oppo',  'Tecno 19', 'Samsung S21', 'iPhone 12', 'Huawei Y9a', 'Itel P36',  'Sony Xperia 1'];



const SendScreen:FC = () => {
  const {connectToServer, isConnected} = useTcp();
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [nearbyDevices, setNearbyDevices] = useState<any[]>([]);
  const handleScan = (data:any)=>{
    const [connectionData, deviceName] = data.replace('tcp://', '').split('|');
    const [host, port] = connectionData?.split(':');
    console.log(`Host: ${host}, Port: ${port}, Device: ${deviceName}`);
    connectToServer(host, parseInt(port, 10), deviceName);
  }


  useEffect(() => {
    if(isConnected){
      navigate('ConnectionScreen')
    }

  }, [isConnected])

  const handleGoBack = () => {
  goBack()
  }


  const listenForDevices = async () => {
    const server = dgram.createSocket({ type: 'udp4', reusePort: true });
    const port = 57143;
    server.bind(port, () => {
      console.log('Server is listening for nearby devices');
    });
    server.on('message', (msg) => {
      const [, otherDevices] = msg.toString()?.replace('tcp://', '').split('|');
      console.log(`Device found: ${otherDevices}`);
      setNearbyDevices((prevDevices) => {
        const deviceExists = prevDevices?.some((device) => device.name === otherDevices);
        if (!deviceExists) {
          const newDevice = {
            id: `${Date.now()}_${Math.random()}`,
            name: otherDevices,
            image: require('../assets/icons/device.jpeg'),
            fullAddress: msg?.toString(),
            position: getRandomPosition(50, prevDevices.map((device) => device.position), 50),
            scale: new Animated.Value(0),
          };
          Animated.timing(newDevice.scale, {
            toValue: 1,
            duration: 1500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }).start();
          return [...prevDevices, newDevice];
        }
        return prevDevices;
      });
    });
    
  }
  useEffect(() => {
    let UdpServer:any;
    const setupUdpServer = async () => {
      UdpServer = await listenForDevices();
    }
    setupUdpServer();
    return () => {
     if(UdpServer){
       UdpServer.close();
       console.log('Server closed');
     }
     setNearbyDevices([]);
 
    

    }
  }, [])


const getRandomPosition = (radius: number, existingPositions: { x: number, y: number }[], minDistance: number) => {
  let position: any;
  let isOverlapping;
  do {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * (radius - minDistance) + minDistance;
    const x = distance * Math.cos(angle);
    const y = distance * Math.sin(angle);
    position = { x, y };

    isOverlapping = existingPositions.some((existingPosition) => {
      const dx = existingPosition.x - position.x;
      const dy = existingPosition.y - position.y;
      return Math.sqrt(dx * dx + dy * dy) < minDistance;
    });
  } while (isOverlapping);
  return position;
}


useEffect(() => {
  const timer = setInterval(() => {
      if(nearbyDevices.length < deviceName.length){
        const newDevice = {
          id: `${Date.now()}_${Math.random()}`,
          name: deviceName[nearbyDevices.length % deviceName.length],
          image: require('../assets/icons/device.jpeg'),
          fullAddress: `tcp://${nearbyDevices.length % deviceName.length}`,
          position: getRandomPosition(200, nearbyDevices.map((device: { position: any; }) => device.position), 50),
          scale: new Animated.Value(0),
        };
        Animated.timing(newDevice.scale, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
        setNearbyDevices((prevDevices) => [...prevDevices, newDevice]);
      }
    }, 2000);
  return () => {
    clearInterval(timer);
  }
}, [nearbyDevices])



  return (
    <LinearGradient
    colors={['#bb9e93', '#bb9e', '#bb83']}
    style={sendStyles.container}
    start={{ x: 0, y: 1 }}
    end={{ x: 0, y: 0 }}
    >
    <SafeAreaView/>
    <View style={sendStyles.mainContainer}>
    <View style={sendStyles.infoContainer}>
      <Icon name='search' size={40} color='#000' iconFamily='MaterialIcons'   />
      <CustomText fontFamily='Okra-Bold' fontSize={16} style={{marginTop:20, color:'#000'}} >
         Looking for nearby devices
      </CustomText>
      <CustomText fontFamily='Okra-Bold' fontSize={12} style={{textAlign:'center',color:'#000'}}>
        Ensure your device's Hotspot is on and the client is connected to the same network
      </CustomText>
    <BreakerText text='or'/>
  <TouchableOpacity style={sendStyles.qrButton} onPress={()=>setIsScannerVisible(true)}>
    <Icon name='qrcode' size={16} color='#000' iconFamily='MaterialCommunityIcons' />
    <CustomText fontFamily='Okra-Bold' fontSize={12} style={{textAlign:'center',color:'#000'}}>
      Scan QR Code
    </CustomText>
  </TouchableOpacity>
    </View>

    <View style={sendStyles.animationContainer}>
      <View style={sendStyles.lottieContainer}>
        <LottieView style={sendStyles.lottie}  source={require('../assets/animations/scanner.json')} autoPlay loop={true} hardwareAccelerationAndroid />
        {
          nearbyDevices?.map((device) => (
            <Animated.View
            key={device?.id}
            style={[sendStyles.deviceDot,{
              transform: [
              

                {scale: device?.scale},
              ],
              left:screenWidth/2 + device?.position?.x,
              top:screenHeight/2 + device?.position?.y,
            }]}
            >
              <TouchableOpacity style={sendStyles.popup} onPress={()=>handleScan(device?.fullAddress)}>
                <Image source={device?.image} style={sendStyles.deviceImage} />
                <CustomText fontFamily='Okra-Bold' fontSize={12} style={[sendStyles.deviceText,{color:'#000'}]}>
                  {device?.name}
                </CustomText>
              </TouchableOpacity>
            </Animated.View>
          ))
        }
      
      
      </View>
      <Image source={require('../assets/images/profile.jpg')} style={sendStyles.profileImage

      } />
    </View>
      <TouchableOpacity onPress={handleGoBack} style={sendStyles.backButton}>
        <Icon name='arrow-back' size={20} color='#000' iconFamily='MaterialIcons' />
       
      </TouchableOpacity>

    </View>
    {
      isScannerVisible && (
        <QRScannerModal visible={isScannerVisible} onClose={()=>setIsScannerVisible(false)}  />
      )
    }
    </LinearGradient>
  )
}

export default SendScreen