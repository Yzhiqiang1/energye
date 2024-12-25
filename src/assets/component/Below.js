import * as React from 'react';
import Svg, {G, Rect, Path} from 'react-native-svg';
const SvgBelow = props => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <G transform="translate(-425 -113)">
      <Rect className="below_svg__a" transform="translate(425 113)" />
      <Path
        d="m436.184 131.135.81.865 11.173-11.912a1.286 1.286 0 0 0 0-1.727 1.093 1.093 0 0 0-1.621 0l-9.55 10.182-9.542-10.182a1.09 1.09 0 0 0-1.619 0 1.286 1.286 0 0 0 0 1.728l10.306 11 .046.05Z"
        className="below_svg__b"
      />
    </G>
  </Svg>
);
export default SvgBelow;
