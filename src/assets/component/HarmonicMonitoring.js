import * as React from 'react';
import Svg, {Defs, LinearGradient, Stop, G, Rect, Path} from 'react-native-svg';
const SvgHarmonicMonitoring = props => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94 94" {...props}>
    <Defs>
      <LinearGradient
        id="harmonicMonitoring_svg__a"
        x1={0.5}
        x2={0.5}
        y2={1}
        gradientUnits="objectBoundingBox">
        <Stop offset={0} stopColor="#ffcb00" />
        <Stop offset={1} stopColor="#ffa200" />
      </LinearGradient>
    </Defs>
    <G transform="translate(-93 -673)">
      <Rect
        width={94}
        height={94}
        rx={47}
        style={{
          fill: 'url(#harmonicMonitoring_svg__a)',
        }}
        transform="translate(93 673)"
      />
      <Path
        d="M47.682 42.046H3.592A3.6 3.6 0 0 1 0 38.454V3.593A3.6 3.6 0 0 1 3.592 0h44.09a3.6 3.6 0 0 1 3.592 3.593v34.861a3.6 3.6 0 0 1-3.592 3.592m-4.246-7.5a1.633 1.633 0 1 0 1.633 1.633 1.635 1.635 0 0 0-1.633-1.633m-5.879 0a1.633 1.633 0 1 0 1.633 1.633 1.635 1.635 0 0 0-1.633-1.633m-5.878 0a1.633 1.633 0 1 0 1.633 1.633 1.635 1.635 0 0 0-1.633-1.633M7.511 6.532a.98.98 0 0 0-.98.98v23.757a.98.98 0 0 0 .98.98h36.252a.98.98 0 0 0 .98-.98V7.512a.98.98 0 0 0-.98-.98Z"
        style={{
          fill: '#fff',
        }}
        transform="translate(114.363 698.976)"
      />
      <Path
        d="M25.136 13.333a.98.98 0 0 1-.98-.98V3.807l-2.73 3.466a.98.98 0 0 1-.77.373H17l-4.186 5.313a.98.98 0 0 1-1.75-.606V3.807L8.335 7.273a.98.98 0 0 1-.77.373H.98a.98.98 0 1 1 0-1.959h6.111L11.276.373a.98.98 0 0 1 1.749.607v8.546l2.73-3.465a.98.98 0 0 1 .77-.374h3.656L24.367.373a.98.98 0 0 1 1.749.607v8.546l2.73-3.466a.98.98 0 0 1 .77-.372H36.8a.98.98 0 0 1 0 1.96h-6.708l-4.186 5.312a.98.98 0 0 1-.77.373"
        style={{
          fill: '#fff',
        }}
        transform="translate(121.11 711.967)"
      />
    </G>
  </Svg>
);
export default SvgHarmonicMonitoring;
