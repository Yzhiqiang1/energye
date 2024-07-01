/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {Index} from './src/index'
import { Provider } from 'react-redux';
import {store, persistor} from './src/redux/storer';
import { PersistGate } from 'redux-persist/integration/react';

function App(): React.JSX.Element {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Index></Index>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
export default App;

