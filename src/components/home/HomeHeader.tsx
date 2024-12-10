
import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { homeHeaderStyles } from '../../styles/homeHeaderStyles';
import { commonStyles } from '../../styles/commonStyles';
import Icon from '../global/Icon';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg'
import { screenHeight, screenWidth, svgPath } from '../../utils/Constants';
import QRGenerateModal from '../modals/QRGenerateModal';


const HomeHeader = () => {
const [isVisible,setVisible] = useState(false)
    return (
        <View style={homeHeaderStyles.mainContainer}>
            <SafeAreaView />
            <View style={[commonStyles.flexRowBetween, homeHeaderStyles.container]}>
                <TouchableOpacity onPress={()=>{console.log('menu button pressed')}}>
                    <Icon iconFamily="MaterialIcons" name="menu" size={22} color="#fff" />
                </TouchableOpacity>
                <Image source={require('../../assets/images/3.png')} style={homeHeaderStyles.logo} />
                <TouchableOpacity onPress={() => { setVisible(true) }}>
                    <Icon iconFamily="MaterialIcons" name="person" size={22} color="#fff" />
                </TouchableOpacity>

            </View>
       

         {/* Wrap the SVG in a separate View */}
         <View style={{ marginTop: 35 }}>
    <Svg
        height={screenHeight * 0.18} // Adjust height as needed
        width={screenWidth}
        viewBox="0 0 1440 220" // Ensure viewBox matches your path dimensions
        style={homeHeaderStyles.curve}
    >
        <Defs>
            <LinearGradient id="grid" x1="0" y1="0" x2="0" y2="1"> 
                {/* Top: Black */}
                <Stop offset="0%" stopColor="#000000" stopOpacity="1" />
                {/* Bottom: Gradient color */}
                <Stop offset="100%" stopColor="#bb9e9e" stopOpacity="1" />
            </LinearGradient>
        </Defs>

        {/* Background Curve Path */}
        <Path
            d={svgPath} 
            fill="url(#grid)" // Use gradient for a smooth blend
        />
    </Svg>
    {isVisible
    && 
    <QRGenerateModal visible={isVisible} onClose={()=>setVisible(false)} />
    }
</View>

        </View>
    );
};

export default HomeHeader;