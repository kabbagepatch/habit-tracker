import { habitColors } from '@/hooks/theme';
import { Image, StyleSheet, Text } from 'react-native';
const plant1Level1 = require('../assets/images/plants/plant1_level1.png');
const plant1Level2 = require('../assets/images/plants/plant1_level2.png');
const plant1Level3 = require('../assets/images/plants/plant1_level3.png');
const plant1Level4 = require('../assets/images/plants/plant1_level4.png');
const plant1Level5 = require('../assets/images/plants/plant1_level5.png');
const plant1Level6Red = require('../assets/images/plants/plant1_level6_red.png');
const plant1Level6Blue = require('../assets/images/plants/plant1_level6_blue.png');
const plant1Level6Mint = require('../assets/images/plants/plant1_level6_mint.png');
const plant1Level6Yellow = require('../assets/images/plants/plant1_level6_yellow.png');
const plant1Level6Pink = require('../assets/images/plants/plant1_level6_pink.png');
const plant1Level7Red = require('../assets/images/plants/plant1_level7_red.png');
const plant1Level7Blue = require('../assets/images/plants/plant1_level7_blue.png');
const plant1Level7Mint = require('../assets/images/plants/plant1_level7_mint.png');
const plant1Level7Yellow = require('../assets/images/plants/plant1_level7_yellow.png');
const plant1Level7Pink = require('../assets/images/plants/plant1_level7_pink.png');

export default function Plant({ color, level, height }: { color: string, level?: number, height: number }) {
  let source;
  switch(level) {
    case 1: source = plant1Level1; break;
    case 2: source = plant1Level2; break;
    case 3: source = plant1Level3; break;
    case 4: source = plant1Level4; break;
    case 5: source = plant1Level5; break;
    case 6:
      if (getColorString(color) === 'red') source = plant1Level6Red;
      if (getColorString(color) === 'blue') source = plant1Level6Blue;
      if (getColorString(color) === 'mint') source = plant1Level6Mint;
      if (getColorString(color) === 'yellow') source = plant1Level6Yellow;
      if (getColorString(color) === 'pink') source = plant1Level6Pink;
      break;
    case 7: 
      if (getColorString(color) === 'red') source = plant1Level7Red;
      if (getColorString(color) === 'blue') source = plant1Level7Blue;
      if (getColorString(color) === 'mint') source = plant1Level7Mint;
      if (getColorString(color) === 'yellow') source = plant1Level7Yellow;
      if (getColorString(color) === 'pink') source = plant1Level7Pink;
      break;
  }
  return <Image style={[styles.plant, { height }]} source={source} />
}

function getColorString(color: string) : string {
  if (color === habitColors[0]) return 'red';
  if (color === habitColors[1]) return 'blue';
  if (color === habitColors[2]) return 'blue';
  if (color === habitColors[3]) return 'mint';
  if (color === habitColors[4]) return 'yellow';
  if (color === habitColors[5]) return 'pink';

  return 'red';
}

const styles = StyleSheet.create({
  plant: {
    left: -2,
    width: '120%',
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
  }
});
