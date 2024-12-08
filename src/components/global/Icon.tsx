/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface IconProps {
  color?: string; // Optional, defaults to "black" if not provided
  size: number; // Required
  name: string; // Required
  iconFamily: 'Ionicons' | 'MaterialCommunityIcons' | 'MaterialIcons'; // Limited to these three
}

const Icon: FC<IconProps> = ({ color = 'black', size, name, iconFamily }) => {
  const iconSize = RFValue(size);

  switch (iconFamily) {
    case 'Ionicons':
      return <Ionicons name={name} size={iconSize} color={color} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={name} size={iconSize} color={color} />;
    case 'MaterialIcons':
      return <MaterialIcons name={name} size={iconSize} color={color} />;
    default:
      console.error(`Unsupported icon family: ${iconFamily}`);
      return null; // Handle unsupported icon families
  }
};

export default Icon;
