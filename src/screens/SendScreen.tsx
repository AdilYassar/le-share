import { View, Text, Animated, Easing, SafeAreaView } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { useTcp } from '../service/TCPProvider'
import { goBack, navigate } from '../utils/NavigationUtil'
import dgram from 'react-native-udp'
import LinearGradient from 'react-native-linear-gradient'
import { sendStyles } from '../styles/sendStyles'
import Icon from '../components/global/Icon'



const deviceName = ['Oppo', 'redmi note 12', 'tecno camon 19', 'samsung galaxy s21', 'iphone 12', 'huawei y9a', 'infinix note 8', 'itel p36', 'nokia 8.3', 'sony xperia 1']



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
            position: getRandomPosition(150, prevDevices.map((device) => device.position), 50),
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


const getRandomPosition = (radius:number, existingPositions:{x:number, y:number}[],minDistance:number) => {

  let position:any;
  let isOverlapping;
  do{
    const angle = Math.random() * 360;
    const distance = Math.random() * (radius-50) +50;
    const x = distance * Math.cos((angle+Math.PI) / 180);
    const y = distance * Math.sin((angle+Math.PI) / 180);
    position = {x, y};

    isOverlapping = existingPositions.some((existingPosition) => {
      const dx = existingPosition.x - position.x;
      const dy = existingPosition.y - position.y;
      return Math.sqrt(dx*dx + dy*dy) < minDistance;
    });
  } while(isOverlapping);
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
          position: getRandomPosition(150, nearbyDevices.map((device: { position: any; }) => device.position), 50),
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
    </View>
    </View>
    </LinearGradient>
  )
}

export default SendScreen