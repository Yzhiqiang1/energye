import * as React from 'react';
import Svg, {Defs, LinearGradient, Stop, G, Rect, Path} from 'react-native-svg';
const SvgNichiharaData = props => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94 94" {...props}>
    <Defs>
      <LinearGradient
        id="nichiharaData_svg__a"
        x1={0.5}
        x2={0.5}
        y2={1}
        gradientUnits="objectBoundingBox">
        <Stop offset={0} stopColor="#85a0ff" />
        <Stop offset={1} stopColor="#5f81f5" />
      </LinearGradient>
    </Defs>
    <G transform="translate(-93 -335)">
      <Rect
        width={94}
        height={94}
        rx={47}
        style={{
          fill: 'url(#nichiharaData_svg__a)',
        }}
        transform="translate(93 335)"
      />
      <Path
        d="M82.034 130.656a13.162 13.162 0 0 1 10.822-20.685 13 13 0 0 1 7.536 2.361l2.05 1.428V94.4a2.605 2.605 0 0 0-2.594-2.6H59.324a2.6 2.6 0 0 0-2.594 2.6v35.746a2.6 2.6 0 0 0 2.594 2.594H81l2.31-.027-1.222-1.973Zm12.1-27.433H65.059a1.688 1.688 0 0 1 0-3.374h29.07a1.688 1.688 0 1 1 0 3.374Zm-19.8 20.221a1.68 1.68 0 0 1-1.662 1.686h-7.613a1.688 1.688 0 0 1 0-3.374h7.606a1.68 1.68 0 0 1 1.662 1.688Zm2.594-10.953a1.683 1.683 0 0 1-1.686 1.688H65.051a1.688 1.688 0 0 1 0-3.374h10.184a1.683 1.683 0 0 1 1.686 1.683Z"
        style={{
          fill: '#fff',
        }}
        transform="translate(59.022 267.817)"
      />
      <Path
        d="M581.259 520.271c-.158-.182-.391-.415-.651-.675l-2.8-2.8a10.1 10.1 0 0 0 2.144-6.255v-.131a10.085 10.085 0 1 0-9.959 10.206 9.96 9.96 0 0 0 4.725-1.2 3.5 3.5 0 0 1 .311.338l2.726 2.734c.233.233.493.466.675.622a2 2 0 0 0 2.776.268l.233-.233a2.037 2.037 0 0 0-.18-2.873Zm-11.524-3.556a6.18 6.18 0 1 1 6.333-6.178v.129a6.183 6.183 0 0 1-6.333 6.049"
        style={{
          fill: '#fff',
        }}
        transform="translate(-417.699 -119.434)"
      />
    </G>
  </Svg>
);
export default SvgNichiharaData;
