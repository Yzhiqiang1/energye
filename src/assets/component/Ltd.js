import * as React from 'react';
import Svg, {G, Rect, Path} from 'react-native-svg';
const SvgLtd = props => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 46" {...props}>
    <G>
      <Rect
        style={{
          fill: '#fff',
          opacity: 0.01,
        }}
      />
      <Path
        d="M40.25 0A5.75 5.75 0 0 1 46 5.75v34.5A5.75 5.75 0 0 1 40.25 46H5.75A5.75 5.75 0 0 1 0 40.25V5.75A5.75 5.75 0 0 1 5.75 0ZM28.02 23h-7.283l-6.362 8.927L23 34.089l-4.468 9.036L31.625 31 23 29.719ZM5.75 5.75v11.5h34.5V5.764ZM34.5 8.625v5.75h-5.75v-5.75Zm-8.625 0v5.75h-5.75v-5.75Zm-8.625 0v5.75H11.5v-5.75Z"
        style={{
          fill: '#ffae00',
        }}
      />
    </G>
  </Svg>
);
export default SvgLtd;
