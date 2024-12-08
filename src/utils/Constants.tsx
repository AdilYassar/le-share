import { Dimensions, Platform } from "react-native";
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestPhotoPermission = async () => {
  if (Platform.OS !== 'ios') {
    return
  }
  try {
    const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    if (result === RESULTS.GRANTED) {
      console.log('STORAGE PERMISSION GRANTED ✅');
    } else {
      console.log('STORAGE PERMISSION DENIED ❌');
    }
  } catch (error) {
    console.error('Error requesting permission:', error);
  }
};

export const isBase64 = (str: string) => {
  const base64Regex =
    /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
  return base64Regex.test(str);
};

export const screenHeight = Dimensions.get('screen').height
export const screenWidth = Dimensions.get('screen').width
export const multiColor = ['#0B3D91', '#1E4DFF', '#104E8B', '#4682B4', '#6A5ACD', '#7B68EE']
export const svgPath ="M0,288L34.3,266.7C68.6,245,137,203,206,202.7C274.3,203,343,245,411,256C480,267,549,245,617,202.7C685.7,160,754,96,823,96C891.4,96,960,160,1029,160C1097.1,160,1166,96,1234,74.7C1302.9,53,1371,75,1406,85.3L1440,96L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"

export enum Colors {
  primary = '#bb9e9e',
  background = '#000',
  text = '#222',
  theme = '#bb9e9e',
  secondary = '#E5EBF5',
  tertiary = '#C56767FF',
  secondary_light = '#F6F7F9',
}