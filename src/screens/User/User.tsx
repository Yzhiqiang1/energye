import { Text, View, Pressable, Dimensions, SafeAreaView, TouchableHighlight } from 'react-native'
import React, { Component } from 'react'
import styleg from '../../indexCss'//公共scc
import { StyleSheet } from 'react-native'
import { Register } from '../../utils/app'
import { Image } from '@rneui/themed';
import { HttpService } from '../../utils/http'
import Loading from '../../component/Loading/Loading'//加载窗口组件
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LogOut } from '../../redux/reducers/counterSlice'
import { store } from '../../redux/storer'
import { Icon } from '@rneui/base'
import { Linking } from 'react-native';

const api = require('../..//utils/api')
const Fs = Dimensions.get('window').width*0.8
const ht = Dimensions.get('window').height*0.8

export class User extends Component<any,any> {
  constructor(props: any,){
    super(props)
    this.state = {
        /**
         * 小程序是否登录
         * **/
        logonStatus: false,
        /**
         * 用户名头像相关信息
         */
        userImg: '../../image/logo.png', //用户头像
        userName: '', //账号名称
        userId: '', //账号ID

        msgType: 1,
        visible: false,
        LoadingMsg: '',
    }
  }

  componentDidMount(): void {
    let that = this;
    //调用登录验证
    Register.userSignIn(false).then(res => {
      //校验登录成功后执行
      if (res == true) {
          that.check_ok(); //校验通过后调用方法
      }
    });
  }
  /*******************************
     * 
     *     校验登录通过
     * 
     * *****************************/
  check_ok() {
    //更新userID
    this.setState({
        userImg: store.getState().avatar,
        userName: store.getState().userName,
        userId: store.getState().userId,
        logonStatus: true,
    })
  }
  /**
   * 退出登录
   */
  signOut=()=>{
    //打开加载效果
    this.setState({
      msgType: 1,
      visible: true,
      LoadingMsg: '注销中...'
    })
    let userId = store.getState().userId;
    HttpService.apiPost(api.appSignOut,{
      userId:userId
    }).then((data:any)=>{
      if(data.flag == '00'){
        //退出清空全局数据
        store.dispatch(LogOut())
        //清理本地存储
        const removeData = async () => {
          try {
            await AsyncStorage.removeItem('@user');
          } catch(e) {
            console.log('Error removing data');
          }
        };
        removeData()
         //关闭加载效果
        this.setState({
          visible: false
        })
         //退出后跳转登录页面
         this.props.navigation.reset({
          index: 1,
          routes: [{ name: 'BindAccount' }],
        });
      }else {
        //关闭加载效果
        this.setState({
          visible: false
        })
        //错误提示信息
        this.setState({
          msgType: 2,
          visible: true,
          LoadingMsg: '注销失败'
        },()=>{
          setTimeout(()=>{
              this.setState({
                  visible: false,
              })
          },2000)
        })
      }
    }).catch((fail_message)=>{
      //关闭加载效果
      this.setState({
        visible: false
      })
      //错误提示信息
      this.setState({
        msgType: 2,
        visible: true,
        LoadingMsg: fail_message
      },()=>{
        setTimeout(()=>{
            this.setState({
                visible: false,
            })
        },2000)
      })
    })
  }

  handleOpenWebsite=() => {
    const url = 'https://www.energye.cn/login'; // 替换成您想要打开的网址
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log('Can\'t handle url: ' + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{position: 'absolute',top: 0,width: "100%",height: "100%",backgroundColor: '#2da2fe'}}>
        </View>
        <SafeAreaView style={{flex: 1}}>
          {/* 弹窗效果组件 */}
          <Loading 
              type={this.state.msgType} 
              visible={this.state.visible} 
              LoadingMsg={this.state.LoadingMsg}>
          </Loading>
          <View style={styleg.containerMax}>
            <View style={styles.nav}>
              {/* <Pressable style={({ pressed })=>[{backgroundColor: pressed? '#c3c3c3' : '#b4b4b4'  },styles.navLeft]} onPress={()=>{this.props.navigation.navigate('HomeBar')}}>
                <Image style={styles.navImg} source={require('../../image/Home.png')}></Image>
              </Pressable> */}
              <Pressable style={styles.navLeft} onPress={()=>{this.props.navigation.navigate('HomeBar')}}>
                  <Icon
                      name='left'
                      type='antdesign'
                      color='#fff'
                      size={22}
                  />
                  <Text allowFontScaling={false} style={{fontSize: Fs/18,color: '#fff'}}>首页</Text>
              </Pressable>
              <Text allowFontScaling={false}style={styles.navName}>我的</Text>
            </View>
            
            <Pressable style={styles.user}>
                {
                this.state.logonStatus?
                  this.state.userImg?
                    <Image style={styles.logo} source={{uri: `${this.state.userImg}`}}></Image> :
                    <Image style={styles.logo} source={require('../../image/logo.png')}></Image>
                  :
                  <Image style={styles.logo} source={require('../../image/logo.png')}></Image>
                }
                {this.state.logonStatus?
                  <View style={styles.text}>
                      <Text allowFontScaling={false}style={styles.name}>
                          {this.state.userName}
                      </Text>
                      <Text allowFontScaling={false}style={styles.id}>
                        账号ID：{this.state.userId}
                      </Text>
                  </View>
                    :
                  <Pressable style={styles.text} onPress={()=>this.props.navigation.navigate('BindAccount')}>
                    <Text allowFontScaling={false}style={styles.name}>
                        您还没有登录
                    </Text>
                    <Text allowFontScaling={false}style={styles.id}>
                        点击登录或注册账号
                    </Text>
                  </Pressable>
                  }
              <Image style={styles.rightIco} source={require('../../image/right.png')}></Image>
            </Pressable>

            <View style={styles.con}>
              {this.state.logonStatus?
                  <TouchableHighlight style={styles.signOut} onPress={this.signOut} underlayColor={'#2da2fe'}>
                    <Text allowFontScaling={false} style={styles.signOutText}>
                      退出登录
                    </Text>
                  </TouchableHighlight>
                : ''
              }
              {this.state.logonStatus?
                  <Text style={{color: '#178fff'}} allowFontScaling={false} onPress={this.handleOpenWebsite}>
                    注销请访问官网
                  </Text>
              : ''}
            </View>
          </View>
        </SafeAreaView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  nav:{
    position:'relative',
    height: ht/10,
    backgroundColor:'#2ea4ff',
  },
  navLeft:{
    position:'absolute',
    left:10,
    top:'50%',
    marginTop: -15,
    zIndex:999,
    width: 100,
    height: 30,
    borderRadius: 20,
    display:'flex',
    flexDirection: 'row',
    alignItems:'center',
  },
  navImg:{
    width:25,
    height:25,
  },
  navName:{
    height:ht/10,
    lineHeight:ht/10,
    textAlignVertical: 'center',
    textAlign:'center',
    fontSize: Fs/16,
    color:'#fff'
  },
  user:{
    position: 'absolute',
    top: ht/10,
    left: 0,
    width: '100%',
    height: 90,
    padding: 15,
    backgroundColor: '#fff',
    zIndex: 999,
    display: 'flex',
    flexDirection:'row',
    overflow: 'hidden',
  },
  logo:{
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  text:{
    position: 'relative',
    flex: 1,
    height: 120,
    paddingBottom:5,
    paddingTop:5,
    paddingLeft:10,
    overflow: 'hidden',
  },
  name:{
    position: 'relative',
    width: '100%',
    height: 25,
    lineHeight: 25,
    fontSize: Fs/16,
    color: '#000',
    fontWeight: '700',
  },
  id:{
    position: 'relative',
    width: '100%',
    height: 25,
    lineHeight: 25,
    fontSize: Fs/24,
    fontWeight: '400',
    color: '#666',
  },
  rightIco:{
    position: 'relative',
    width: 15,
    height: 15,
    marginTop: 35,
    transform: [{rotate:'270deg'}],
    overflow: 'hidden',
  },
  con:{
    position: 'absolute',
    top: 160,
    left: 0,
    right: 0,
    bottom: 75,
    zIndex: 99999,
    display:'flex',
    alignItems:'center',
  },
  signOut:{
    position: 'relative',
    width: '70%',
    height: 40,
    backgroundColor:'#1890FF',
    borderRadius: 2,
    margin: 40
  },
  signOutText:{
    fontSize: Fs/22,
    textAlign: 'center',
    color: '#fff',
    height: 40,
    lineHeight: 40,
    textAlignVertical: 'center',
  },
  button: {
    borderRadius: 6,
    width: 220,
    margin: 20,
    position:'absolute',
    bottom: 70,
    zIndex:999999
  },
})

export default User