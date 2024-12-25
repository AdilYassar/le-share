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
      console.log('STORAGE PERMISSION DENIEDD ❌');
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
export const svgPath ="M0,128L20,117.3C40,107,80,85,120,80C160,75,200,85,240,117.3C280,149,320,203,360,197.3C400,192,440,128,480,112C520,96,560,128,600,144C640,160,680,160,720,181.3C760,203,800,245,840,240C880,235,920,181,960,144C1000,107,1040,85,1080,64C1120,43,1160,21,1200,26.7C1240,32,1280,64,1320,80C1360,96,1400,96,1420,96L1440,96L1440,0L1420,0C1400,0,1360,0,1320,0C1280,0,1240,0,1200,0C1160,0,1120,0,1080,0C1040,0,1000,0,960,0C920,0,880,0,840,0C800,0,760,0,720,0C680,0,640,0,600,0C560,0,520,0,480,0C440,0,400,0,360,0C320,0,280,0,240,0C200,0,160,0,120,0C80,0,40,0,20,0L0,0Z"

export enum Colors {
  primary = '#bb9e9e',
  background = '#000',
  text = '#222',
  theme = '#bb9e9e',
  secondary = '#E5EBF5',
  tertiary = '#C56767FF',
  secondary_light = '#F6F7F9',
}