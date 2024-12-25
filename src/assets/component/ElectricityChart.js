import * as React from 'react';
import Svg, {Defs, LinearGradient, Stop, G, Rect, Path} from 'react-native-svg';
const SvgElectricityChart = props => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94 94" {...props}>
    <Defs>
      <LinearGradient
        id="electricityChart_svg__a"
        x1={0.5}
        x2={0.5}
        y2={1}
        gradientUnits="objectBoundingBox">
        <Stop offset={0} stopColor="#4acd8c" />
        <Stop offset={1} stopColor="#18c465" />
      </LinearGradient>
    </Defs>
    <G transform="translate(-563 -335)">
      <Rect
        width={94}
        height={94}
        rx={47}
        style={{
          fill: 'url(#electricityChart_svg__a)',
        }}
        transform="translate(563 335)"
      />
      <Path
        d="M75.342 34.133H37.3a3.18 3.18 0 0 0-3.17 3.17v38.039a3.18 3.18 0 0 0 3.17 3.17h38.042a3.18 3.18 0 0 0 3.17-3.17V37.3a3.18 3.18 0 0 0-3.17-3.17ZM43.484 51.647l6.657-5.864a1.584 1.584 0 0 1 2.14 0l5.627 4.993 6.34-5.706h-2.22a1.59 1.59 0 0 1-1.585-1.585 1.625 1.625 0 0 1 1.585-1.585h6.261a1.625 1.625 0 0 1 1.585 1.585v6.261a1.585 1.585 0 1 1-3.17 0v-2.537L59.017 54.1a1.87 1.87 0 0 1-1.03.4 1.67 1.67 0 0 1-1.03-.4l-5.627-4.989-5.547 4.989a1.61 1.61 0 0 1-2.219-.158 1.48 1.48 0 0 1-.4-1.109.98.98 0 0 1 .317-1.189Zm-1.03 8.876h18.227a1.585 1.585 0 1 1 0 3.17H42.454a1.585 1.585 0 1 1 0-3.17m27.736 10.3H42.454a1.585 1.585 0 1 1 0-3.17h27.737a1.585 1.585 0 1 1 0 3.17Z"
        style={{
          fill: '#fff',
        }}
        transform="translate(553.677 325.678)"
      />
    </G>
  </Svg>
);
export default SvgElectricityChart;
