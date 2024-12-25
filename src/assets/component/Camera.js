import * as React from 'react';
import Svg, {G, Rect, Path} from 'react-native-svg';
const SvgCamera = props => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 46" {...props}>
    <G transform="translate(-630.524 -314.524)">
      <Rect
        style={{
          fill: '#fff',
          opacity: 0.01,
        }}
        transform="translate(630.524 314.524)"
      />
      <Path
        d="M105.067 297.03a2.58 2.58 0 0 1-2.526 2.625H75.6a2.58 2.58 0 0 1-2.526-2.625v-22.748a2.58 2.58 0 0 1 2.526-2.625h26.945a2.58 2.58 0 0 1 2.526 2.625v22.748Zm11.3-23.013-7.3 4.721v13.833l7.251 4.684a1.83 1.83 0 0 0 1.159.4 1.647 1.647 0 0 0 1.589-1.7v-20.6a1.647 1.647 0 0 0-1.589-1.7 1.8 1.8 0 0 0-1.109.361Z"
        style={{
          fill: '#36be7c',
        }}
        transform="translate(557.458 51.868)"
      />
    </G>
  </Svg>
);
export default SvgCamera;
