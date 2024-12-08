
import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { homeHeaderStyles } from '../../styles/homeHeaderStyles';
import { commonStyles } from '../../styles/commonStyles';
import Icon from '../global/Icon';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg'
import { screenHeight, screenWidth, svgPath } from '../../utils/Constants';
const HomeHeader = () => {
    return (
        <View style={homeHeaderStyles.mainContainer}>
            <SafeAreaView />
            <View style={[commonStyles.flexRowBetween, homeHeaderStyles.container]}>
                <TouchableOpacity onPress={()=>{console.log('menu button pressed')}}>
                    <Icon iconFamily="MaterialIcons" name="menu" size={22} color="#fff" />
                </TouchableOpacity>
                <Image source={require('../../assets/images/3.png')} style={homeHeaderStyles.logo} />
                <TouchableOpacity onPress={() => { console.log('profile logo pressed') }}>
                    <Icon iconFamily="MaterialIcons" name="person" size={22} color="#fff" />
                </TouchableOpacity>

            </View>


         {/* Wrap the SVG in a separate View */}
         <View style={{ marginTop: 35 }}> {/* Adjust marginTop to control the space below the header */}
                <Svg
                    height={screenHeight * 0.18}
                    width={screenWidth}
                    viewBox='0 0 1000 220'
                    style={homeHeaderStyles.curve}
                >
                    <Defs>
                        <LinearGradient id='grid' x1="1" y1='0' x2='0' y2='0'>
                            <Stop offset="0%" stopColor='#bb9e9e' stopOpacity="1" />
                            <Stop offset="100%" stopColor='#332F2FFF' stopOpacity="1" />
                        </LinearGradient>
                    </Defs>

                    <Path
                        fill='#332F2FFF'
                        d={svgPath}
                    />
                    <Path
                        fill='url(#grid)'
                    />
                </Svg>
            </View>
        </View>
    );
};

export default HomeHeader;