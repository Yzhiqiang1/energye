import * as React from 'react';
import Svg, {G, Rect, Path} from 'react-native-svg';
const SvgSwitch = props => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 46" {...props}>
    <G transform="translate(-250.553 -314.553)">
      <Rect
        style={{
          fill: '#fff',
          opacity: 0.01,
        }}
        transform="translate(250.553 314.553)"
      />
      <Path
        d="M29.373 6.373a23 23 0 1 0 23 23 23 23 0 0 0-23-23M27.841 14.8H31.5v10.35h-3.659zm1.832 28.614a13.537 13.537 0 0 1-6.462-25.431l1.751 3.217a9.872 9.872 0 1 0 9.423 0l1.752-3.218a13.537 13.537 0 0 1-6.463 25.43Z"
        style={{
          fill: '#459df7',
        }}
        transform="translate(244.18 308.18)"
      />
    </G>
  </Svg>
);
export default SvgSwitch;
