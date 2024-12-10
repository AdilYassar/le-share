import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { bottomTabStyles } from '../../styles/bottomTabStyle'
import { optionStyles } from '../../styles/optionsStyles'
import CustomText from '../global/CustomText'
import Icon from '../global/Icon'
import { navigate } from '../../utils/NavigationUtil'
import QRScannerModal from '../modals/QRScannerModal'

const AbsoluteQRBottom = () => {
    const [isVisible,setVisible] = useState(false)
  return (
    <>
    <View style={bottomTabStyles.container}>
      <TouchableOpacity onPress={()=>navigate('RecievedFileScreen')}  >
        <Icon  name='application-outline' iconFamily='MaterialCommunityIcons' color='#bb9e9e'  size={24} />
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>setVisible(true)} style={bottomTabStyles.qrCode} >
        <Icon  name='qrcode-scan' iconFamily='MaterialCommunityIcons' color='#bb9e9e'  size={26} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Icon  name='beer' iconFamily='MaterialCommunityIcons' color='#bb9e9e'  size={24} />
      </TouchableOpacity>
    </View>
    {isVisible && <QRScannerModal visible={isVisible} onClose={()=>setVisible(false)} />}
    </>
  )
}

export default AbsoluteQRBottom