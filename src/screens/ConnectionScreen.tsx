import { View, TouchableOpacity, ActivityIndicator, Platform, FlatList, SafeAreaView } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { useTcp } from '../service/TCPProvider'
import Icon from '../components/global/Icon'
import LinearGradient from 'react-native-linear-gradient'
import { sendStyles } from '../styles/sendStyles'
import { connectionStyles } from '../styles/connectionStyles'
import CustomText from '../components/global/CustomText'
import Options from '../components/home/Options'
import { resetAndNavigate } from '../utils/NavigationUtil'
import { formatFileSize } from '../utils/libraryHelpers'
import RNFetchBlob from 'rn-fetch-blob' // Updated import



const ConnectionScreen:FC = () => {
  const {
    connectedDevice,
    disconnect,
    isConnected,
    sendFileAck,
    totalSentBytes,
    totalRecievedBytes,
    recievedFiles,
    sentFiles,
  } = useTcp()

  const [activeTab,setActiveTab] = useState<'SENT' | 'RECEIVED'>('SENT');
  const renderThumbnail = (mimeType: string) => {
    switch(mimeType){
      case '.mp4':
        return <Icon name='videocam' size={16} color='#000' iconFamily='MaterialIcons' />
      case '.mp3':
        return <Icon name='music-note' size={16} color='#000' iconFamily='MaterialIcons' />     
      case '.jpg':
        return <Icon name='image' size={16} color='#000' iconFamily='MaterialIcons' />     
      case '.pdf':
        return <Icon name='picture-as-pdf' size={16} color='#000' iconFamily='MaterialIcons' /> 
      default:
        return <Icon name='folder' size={16} color='#000' iconFamily='MaterialIcons' />     
    }
  }
  const onMediaPickedUp = (image:any) => {
    console.log('Media Picked Up',image);
    sendFileAck(image, 'image');

  }
  const onFilePickedUp = (file:any) => {
    console.log('File Picked Up',file);
    sendFileAck(file, 'file');
  }

  // useEffect(()=>{
  //   if(!isConnected){
  //     resetAndNavigate('HomeScreen');
  //   }
  // },[isConnected])
  


const handleTabChange = (tab:'SENT' | 'RECEIVED') => {
  setActiveTab(tab);

}


const renderItem = ({item}:any) => {
  return(
    <View style={connectionStyles.fileItem}>
      <View style={connectionStyles.fileInfoContainer}>
        {renderThumbnail(item.mimeType)}
       <View style={connectionStyles.fileDetails}>
       <CustomText style={{color:'#000'}}>
          {item.name}
        </CustomText>
        <CustomText style={{color:'#000'}}>
         {item?.mimeType} ~ {formatFileSize(item.size)}

        </CustomText>
       </View>
      </View>
      {
        item?.available ? (
         <TouchableOpacity
         style={connectionStyles.openButton}
         onPress={()=>{
          const normalizedPath = Platform.OS === 'ios' ? `file://${item.uri}` : item?.uri;
          console.log('Opening File',normalizedPath);
          if(Platform.OS === 'ios'){
            try {
              RNFetchBlob.ios.openDocument(normalizedPath)
              console.log('File Opened');
              console.log('File Opened');
            } catch (error: any) {
              console.error('Failed to open file', error);
            }
          }else{
            RNFetchBlob.android.actionViewIntent(normalizedPath,'*/*')
            .then(()=>console.log('File Opened'))
            .catch((error:any)=>console.error('Failed to open file',error))
          }

         }}>
          <CustomText style={{color:'#000'}} fontSize={12}>
            Open
          </CustomText>
         </TouchableOpacity> 
        ):(
          <ActivityIndicator size='small' color='#000' />
        )
      }
    </View>
  )
}


  return (
   
  <LinearGradient
  colors={['#bb9e93', '#bb9e', '#bb83']}
  style={sendStyles.container}
  start={{ x: 0, y: 1 }}
  end={{ x: 0, y: 0 }}
  >
  <SafeAreaView/>
  <View style={sendStyles.mainContainer}>
    <View style={connectionStyles.container}>
      <View style={connectionStyles.connectionContainer}>
       <View style={{width:'55%'}}>
       <CustomText style={{color:'#000'}}>
          Connected With {connectedDevice?.name}
        </CustomText>
       </View>
       <TouchableOpacity onPress={()=>disconnect()} style={connectionStyles.disconnectButton}>
          <Icon name='close' size={20} color='#000' iconFamily='MaterialIcons' />
          <CustomText style={{color:'#000'}}>
            Disconnect
          </CustomText>

       </TouchableOpacity>
      </View>
      <Options onMediaPickedUp={onMediaPickedUp} onFilePickedUp={onFilePickedUp} />
      <View style={connectionStyles.fileContainer}>
        <View style={connectionStyles.sendReceiveContainer}>
          <View style={connectionStyles.sendReceiveButtonContainer}>
            <TouchableOpacity
            onPress={()=>handleTabChange('SENT')}
            style={[connectionStyles.sendReceiveButton, activeTab==='SENT' ? connectionStyles.activeButton:connectionStyles.inactiveButton]}>
              <Icon name='cloud-upload' size={20} color={activeTab==='SENT'?'#000':'blue'} iconFamily='MaterialIcons' />
              <CustomText
              style={{color:activeTab==='SENT'?'#000':'blue'}}
              fontSize={12}

              >
                Sent

              </CustomText>
            </TouchableOpacity>


            <TouchableOpacity
             onPress={()=>handleTabChange('RECEIVED')}
            style={[connectionStyles.sendReceiveButton, activeTab==='RECEIVED' ? connectionStyles.activeButton:connectionStyles.inactiveButton]}>
              <Icon name='cloud-upload' size={20} color={activeTab==='RECEIVED'?'#000':'blue'} iconFamily='MaterialIcons' />
              <CustomText
              style={{color:activeTab==='RECEIVED'?'#000':'blue'}}
              fontSize={12}

              >
                Receive

              </CustomText>
            </TouchableOpacity>
          </View>
          <View style={connectionStyles.sendReceiveDataContainer}>
            <CustomText fontSize={10} style={{color:'#000'}}>
              {formatFileSize(activeTab === 'SENT' ? totalSentBytes : totalRecievedBytes || 0)}
            </CustomText>

           < CustomText fontSize={12} style={{color:'#000'}}>
    /
            </CustomText>
<CustomText fontSize={10} style={{color:'#000'}}>
  {activeTab === 'SENT'
    ? formatFileSize(sentFiles.reduce((total: number, file: any) => total + file.size, 0))
    : formatFileSize(recievedFiles.reduce((total: number, file: any) => total + file.size, 0))
  }
</CustomText>
          </View>
        </View>
      {
        (activeTab === 'SENT' ? sentFiles?.length : recievedFiles?.length > 0) ? (
          <FlatList
          data={activeTab === 'SENT' ? sentFiles : recievedFiles}
          keyExtractor={(item:any)=>item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={connectionStyles.fileList}
          />

        ):(
          <View style={connectionStyles.noDataContainer}>
            <CustomText style={{color:'#000'}}>
              No Files {activeTab === 'SENT' ? 'no files sent' : ' not received yet'}
            </CustomText>
          </View>
        )
      }






      </View>
    
    
    
    </View>
    <TouchableOpacity onPress={()=>resetAndNavigate('HomeScreen')} style={sendStyles.backButton}>
        <Icon name='arrow-back' size={20} color='#000' iconFamily='MaterialIcons' />
      </TouchableOpacity>
  </View>
  </LinearGradient>

  )
}

export default ConnectionScreen
