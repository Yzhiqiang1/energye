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
import { NativeBaseProvider, Box } from "native-base";


function App(): React.JSX.Element {

  return (
    <NativeBaseProvider>
      <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <NavigationContainer>
                <Index></Index>
              </NavigationContainer>
            </PersistGate>
      </Provider>
    </NativeBaseProvider>
  );
}
export default App;

