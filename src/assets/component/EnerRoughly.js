import * as React from 'react';
import Svg, {G, Rect, Path} from 'react-native-svg';
const SvgEnerRoughly = props => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" {...props}>
    <G transform="translate(-61 -251.664)">
      <Rect
        width={72}
        height={72}
        rx={6}
        style={{
          fill: '#fda61d',
        }}
        transform="translate(61 251.664)"
      />
      <Path
        d="M86.393 86.393H73.179a6.635 6.635 0 0 1-6.619-6.619v-6.595a6.62 6.62 0 0 1 6.619-6.619H79.8a6.635 6.635 0 0 1 6.619 6.619Zm3.31 0V73.179a6.635 6.635 0 0 1 6.619-6.619h6.619a6.614 6.614 0 0 1 6.594 6.619V79.8a6.635 6.635 0 0 1-6.619 6.619Zm-3.31 3.31v13.214a6.635 6.635 0 0 1-6.619 6.619h-6.595a6.62 6.62 0 0 1-6.619-6.619V96.3a6.635 6.635 0 0 1 6.619-6.619Zm3.31 0h13.214a6.635 6.635 0 0 1 6.619 6.619v6.619a6.635 6.635 0 0 1-6.619 6.619H96.3a6.635 6.635 0 0 1-6.619-6.619Z"
        style={{
          fill: '#fff',
        }}
        transform="translate(8.359 199.772)"
      />
    </G>
  </Svg>
);
export default SvgEnerRoughly;
