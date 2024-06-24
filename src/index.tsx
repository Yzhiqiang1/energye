import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';//引入导航
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Tabbar from './routes/Tabbar';//底部导航
import BindAccount from "./screens/BindAccount/BindAccount";//登入页面
import ConfigurationDetails from "./screens/configurationDetails/configurationDetails"//云组态详情
import BindPhone from './screens/BindPhone/BindPhone';
import AccountRegister from './screens/accountRegister/accountRegister';
import Survey from './screens/survey/survey';
import Scanqr from './screens/scanqr/scanqr';
import PowerTest1 from './screens/pages_powerTest/powerTest1/powerTest1';
import PowerTest2 from './screens/pages_powerTest/powerTest2/powerTest2';
import PowerTest3 from './screens/pages_powerTest/powerTest3/powerTest3';
import PowerTest4 from './screens/pages_powerTest/powerTest4/powerTest4';
import PowerTest5 from './screens/pages_powerTest/powerTest5/powerTest5';
import PowerTest6 from './screens/pages_powerTest/powerTest6/powerTest6';
import PowerTest7 from './screens/pages_powerTest/powerTest7/powerTest7';
import powerAnalysis1 from './screens/pages_powerAnalysis/powerAnalysis1/powerAnalysis1';
import PowerAnalysis2 from './screens/pages_powerAnalysis/powerAnalysis2/powerAnalysis2';
import PowerAnalysis3 from './screens/pages_powerAnalysis/powerAnalysis3/powerAnalysis3';
import PowerAnalysis4 from './screens/pages_powerAnalysis/powerAnalysis4/powerAnalysis4';
import PowerAnalysis5 from './screens/pages_powerAnalysis/powerAnalysis5/powerAnalysis5';
import PowerAnalysis6 from './screens/pages_powerAnalysis/powerAnalysis6/powerAnalysis6';
import PowerAnalysis7 from './screens/pages_powerAnalysis/powerAnalysis7/powerAnalysis7';
import waterAnalysis1 from './screens/pages_waterAnalysis/waterAnalysis1/waterAnalysis1';
import waterAnalysis2 from './screens/pages_waterAnalysis/waterAnalysis2/waterAnalysis2';
import WaterAnalysis3 from './screens/pages_waterAnalysis/waterAnalysis3/waterAnalysis3';
import waterAnalysis4 from './screens/pages_waterAnalysis/waterAnalysis4/waterAnalysis4';
import WaterAnalysis5 from './screens/pages_waterAnalysis/waterAnalysis5/waterAnalysis5';
import GasAnalysis1 from './screens/pages_gasAnalysis/gasAnalysis1/gasAnalysis1';
import GasAnalysis2 from './screens/pages_gasAnalysis/gasAnalysis2/gasAnalysis2';
import GasAnalysis3 from './screens/pages_gasAnalysis/gasAnalysis3/gasAnalysis3';
import GasAnalysis4 from './screens/pages_gasAnalysis/gasAnalysis4/gasAnalysis4';
import GasAnalysis5 from './screens/pages_gasAnalysis/gasAnalysis5/gasAnalysis5';
import security1 from './screens/pages_security/security1/security1';
import security2 from './screens/pages_security/security2/security2';
import Security5 from './screens/pages_security/security5/security5';
import History_leakage from './screens/pages_security/history_leakage/history_leakage';
import History from './screens/pages_security/history/history';
import history_switchMonitor from './screens/pages_security/history_switchMonitor/history_switchMonitor';
import security3 from './screens/pages_security/security3/security3';
import ServiceInfo from './screens/serviceInfo/serviceInfo';
import Playback from './screens/pages_video/playback/playback'
import GetPassword from './screens/getPassword/getPassword'
import AsyncStorage from '@react-native-async-storage/async-storage';//本地存储
import store from './redux/store';
import { Set_State } from './redux/actions/user';

const Stack = createStackNavigator();

export class Index extends Component {
  componentDidMount(): void {
    //获取上次登入信息保存到全局
    const loadData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@user');
        if (jsonValue !== null) {
          // 解析JSON字符串回对象
          return JSON.parse(jsonValue);
        }
      } catch(e) {
        console.log('Error loading data');
      }
    };
    loadData().then(res=>{
      if(res){
        store.dispatch(Set_State(res))
      }
    })
  }
  render() {
    return (
      <SafeAreaProvider>
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="Tabbar" component={Tabbar}></Stack.Screen>
            <Stack.Screen name="BindAccount" component={BindAccount}></Stack.Screen>
            <Stack.Screen name="ConfigurationDetails" component={ConfigurationDetails}></Stack.Screen>
            <Stack.Screen name="BindPhone" component={BindPhone}></Stack.Screen>
            <Stack.Screen name="AccountRegister" component={AccountRegister}></Stack.Screen>
            <Stack.Screen name="Survey" component={Survey}></Stack.Screen>
            <Stack.Screen name="Scanqr" component={Scanqr}></Stack.Screen>
            <Stack.Screen name="PowerTest1" component={PowerTest1}></Stack.Screen>
            <Stack.Screen name="PowerTest2" component={PowerTest2}></Stack.Screen>
            <Stack.Screen name="PowerTest3" component={PowerTest3}></Stack.Screen>
            <Stack.Screen name="PowerTest4" component={PowerTest4}></Stack.Screen>
            <Stack.Screen name="PowerTest5" component={PowerTest5}></Stack.Screen>
            <Stack.Screen name="PowerTest6" component={PowerTest6}></Stack.Screen>
            <Stack.Screen name="PowerTest7" component={PowerTest7}></Stack.Screen>
            <Stack.Screen name="powerAnalysis1" component={powerAnalysis1}></Stack.Screen>
            <Stack.Screen name="powerAnalysis2" component={PowerAnalysis2}></Stack.Screen>
            <Stack.Screen name="powerAnalysis3" component={PowerAnalysis3}></Stack.Screen>
            <Stack.Screen name="powerAnalysis4" component={PowerAnalysis4}></Stack.Screen>
            <Stack.Screen name="powerAnalysis5" component={PowerAnalysis5}></Stack.Screen>
            <Stack.Screen name="powerAnalysis6" component={PowerAnalysis6}></Stack.Screen>
            <Stack.Screen name="powerAnalysis7" component={PowerAnalysis7}></Stack.Screen>
            <Stack.Screen name="waterAnalysis1" component={waterAnalysis1}></Stack.Screen>
            <Stack.Screen name="waterAnalysis2" component={waterAnalysis2}></Stack.Screen>
            <Stack.Screen name="waterAnalysis3" component={WaterAnalysis3}></Stack.Screen>
            <Stack.Screen name="waterAnalysis4" component={waterAnalysis4}></Stack.Screen>
            <Stack.Screen name="waterAnalysis5" component={WaterAnalysis5}></Stack.Screen>
            <Stack.Screen name="gasAnalysis1" component={GasAnalysis1}></Stack.Screen>
            <Stack.Screen name="gasAnalysis2" component={GasAnalysis2}></Stack.Screen>
            <Stack.Screen name="gasAnalysis3" component={GasAnalysis3}></Stack.Screen>
            <Stack.Screen name="gasAnalysis4" component={GasAnalysis4}></Stack.Screen>
            <Stack.Screen name="gasAnalysis5" component={GasAnalysis5}></Stack.Screen>
            <Stack.Screen name="security1" component={security1}></Stack.Screen>
            <Stack.Screen name="security2" component={security2}></Stack.Screen>
            <Stack.Screen name="security3" component={security3}></Stack.Screen>
            <Stack.Screen name="security5" component={Security5}></Stack.Screen>
            <Stack.Screen name="History_leakage" component={History_leakage}></Stack.Screen>
            <Stack.Screen name="History" component={History}></Stack.Screen>
            <Stack.Screen name="history_switchMonitor" component={history_switchMonitor}></Stack.Screen>
            <Stack.Screen name="ServiceInfo" component={ServiceInfo}></Stack.Screen>
            <Stack.Screen name="Playback" component={Playback}></Stack.Screen>
            <Stack.Screen name="GetPassword" component={GetPassword}></Stack.Screen>
        </Stack.Navigator>
      </SafeAreaProvider>
    )
  }
}

export default Index