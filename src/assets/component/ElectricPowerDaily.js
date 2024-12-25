import * as React from 'react';
import Svg, {Defs, LinearGradient, Stop, G, Rect, Path} from 'react-native-svg';
const SvgElectricPowerDaily = props => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94 94" {...props}>
    <Defs>
      <LinearGradient
        id="electricPowerDaily_svg__a"
        x1={0.5}
        x2={0.5}
        y2={1}
        gradientUnits="objectBoundingBox">
        <Stop offset={0} stopColor="#85a0ff" />
        <Stop offset={1} stopColor="#5f81f5" />
      </LinearGradient>
    </Defs>
    <G transform="translate(-563 -504)">
      <Rect
        width={94}
        height={94}
        rx={47}
        style={{
          fill: 'url(#electricPowerDaily_svg__a)',
        }}
        transform="translate(563 504)"
      />
      <Path
        d="M38.515 45.6a9.823 9.823 0 1 1 9.823-9.823 9.835 9.835 0 0 1-9.823 9.823M36.4 30.212a1 1 0 0 0-1 1V38.1a1 1 0 0 0 1 1h7.193a1 1 0 1 0 0-2H37.4v-5.89a1 1 0 0 0-1-.998M32.008 45.6H3.929A3.933 3.933 0 0 1 0 41.671V6.289a3.93 3.93 0 0 1 3.926-3.926h3.931v2.748a3.929 3.929 0 1 0 7.857 0V2.363h1.966v2.752a3.929 3.929 0 1 0 7.857 0V2.363h1.977v2.752a3.929 3.929 0 1 0 7.857 0V2.363H39.3a3.936 3.936 0 0 1 3.93 3.93v18.672a11.68 11.68 0 0 0-9.493.035 2 2 0 0 0-.334-.034H9.823a1.97 1.97 0 0 0-1.966 1.969v.782a1.97 1.97 0 0 0 1.966 1.969h18.613a11.7 11.7 0 0 0-1.371 3.339H9.823a1.97 1.97 0 0 0-1.966 1.967v.781a1.97 1.97 0 0 0 1.966 1.969h17.086A11.8 11.8 0 0 0 32 45.6ZM9.823 16.9a1.97 1.97 0 0 0-1.966 1.966v.784a1.97 1.97 0 0 0 1.966 1.967H33.4a1.97 1.97 0 0 0 1.969-1.967v-.784A1.97 1.97 0 0 0 33.4 16.9Zm21.62-9.82a1.95 1.95 0 0 1-1.388-.575 1.98 1.98 0 0 1-.577-1.391V1.968a1.968 1.968 0 1 1 3.935 0v3.147a1.98 1.98 0 0 1-1.97 1.965m-9.827 0a1.97 1.97 0 0 1-1.966-1.965V1.968a1.968 1.968 0 1 1 3.935 0v3.147a1.98 1.98 0 0 1-1.969 1.965m-9.823 0a1.95 1.95 0 0 1-1.393-.574 1.98 1.98 0 0 1-.577-1.391V1.968a1.968 1.968 0 1 1 3.935 0v3.147a1.98 1.98 0 0 1-1.965 1.965"
        style={{
          fill: '#fff',
        }}
        transform="translate(585.83 528.201)"
      />
    </G>
  </Svg>
);
export default SvgElectricPowerDaily;
