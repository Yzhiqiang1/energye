import * as React from 'react';
import Svg, {Defs, LinearGradient, Stop, G, Rect, Path} from 'react-native-svg';
const SvgExtremeValueReport = props => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94 94" {...props}>
    <Defs>
      <LinearGradient
        id="extremeValueReport_svg__a"
        x1={0.5}
        x2={0.5}
        y2={1}
        gradientUnits="objectBoundingBox">
        <Stop offset={0} stopColor="#c283f8" />
        <Stop offset={1} stopColor="#ac66eb" />
      </LinearGradient>
    </Defs>
    <G transform="translate(-93 -504)">
      <Rect
        width={94}
        height={94}
        rx={47}
        style={{
          fill: 'url(#extremeValueReport_svg__a)',
        }}
        transform="translate(93 504)"
      />
      <Path
        d="M128.6 142.647a2.82 2.82 0 0 1 2.819 2.819v35.522a2.82 2.82 0 0 1-2.819 2.819H86.879a2.82 2.82 0 0 1-2.819-2.819v-35.522a2.82 2.82 0 0 1 2.819-2.819zm-17.83 20.971H100.3v10.845h.153a10.707 10.707 0 0 0 10.321-10.665v-.176Zm-12.806-12.479a10.863 10.863 0 0 0 0 21.716v-10.846h10.473a10.684 10.684 0 0 0-10.473-10.87m28.525 16.6h-10.713a1.269 1.269 0 1 0 0 2.537h10.713a1.269 1.269 0 1 0 0-2.537m0-5.92h-10.713a1.269 1.269 0 1 0 0 2.537h10.713a1.269 1.269 0 1 0 0-2.537m0-5.92h-10.713a1.269 1.269 0 1 0 0 2.537h10.713a1.269 1.269 0 1 0 0-2.537"
        style={{
          fill: '#fff',
        }}
        transform="translate(32.258 387.773)"
      />
    </G>
  </Svg>
);
export default SvgExtremeValueReport;
