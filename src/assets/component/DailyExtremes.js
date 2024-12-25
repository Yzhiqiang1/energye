import * as React from 'react';
import Svg, {Defs, LinearGradient, Stop, G, Rect, Path} from 'react-native-svg';
const SvgDailyExtremes = props => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94 94" {...props}>
    <Defs>
      <LinearGradient
        id="dailyExtremes_svg__a"
        x1={0.5}
        x2={0.5}
        y2={1}
        gradientUnits="objectBoundingBox">
        <Stop offset={0} stopColor="#ffcb00" />
        <Stop offset={1} stopColor="#ffa200" />
      </LinearGradient>
    </Defs>
    <G transform="translate(-328 -335)">
      <Rect
        width={94}
        height={94}
        rx={47}
        style={{
          fill: 'url(#dailyExtremes_svg__a)',
        }}
        transform="translate(328 335)"
      />
      <Path
        d="M123.875 350.751H138.4v-22.592l-4.034-2.69-10.49 8.607v16.676Zm17.751 0h14.524v-22.592l-6.993 5.648-7.531-3.765v20.71Zm17.751-25.282v25.282H173.9v-25.013l-6.186-7.8Z"
        style={{
          fill: '#fff',
        }}
        transform="translate(226.381 51.69)"
      />
      <Path
        d="m94.428 114.6 7.8-6.455 15.062 8.876 17.751-16.407.269-.269 2.959 2.959 4.841-13.179-13.717 4.3 3.228 3.228-15.6 14.524-15.062-8.607-9.952 8.069a1.911 1.911 0 0 0 2.421 2.959Zm47.606 25.551H92.008a1.883 1.883 0 0 0 0 3.766h50.027a1.883 1.883 0 1 0 0-3.765Z"
        style={{
          fill: '#fff',
        }}
        transform="translate(257.979 264.979)"
      />
    </G>
  </Svg>
);
export default SvgDailyExtremes;
