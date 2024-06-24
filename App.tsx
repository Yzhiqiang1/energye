/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {Index} from './src/index'

function App(): React.JSX.Element {

  return (
    <NavigationContainer>
      <Index></Index>
    </NavigationContainer>
  );
}
export default App;

