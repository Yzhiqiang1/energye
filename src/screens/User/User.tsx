import { Text, View, Pressable, ScrollView} from 'react-native'
import React, { Component } from 'react'
import { Menu } from '../../component/menu/menu'//底部导航组件
import styleg from '../../indexCss'//公共scc
import { StyleSheet } from 'react-native'
import store from '../../redux/store'
import { Log_Out } from '../../redux/actions/user'
import { Register } from '../../utils/app'
import { Image } from '@rneui/themed';
import { HttpService } from '../../utils/http'
import Loading from '../../component/Loading/Loading'//加载窗口组件
const api = require('../..//utils/api')

export class User extends Component<any,any> {
  constructor(props: {}){
    super(props)
    this.state = {
        /**
         * 小程序是否登录
         * **/
        logonStatus: false,
        /**
         * 用户名头像相关信息
         */
        userImg: require('../../image/logo.png'), //用户头像
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
        userImg: store.getState().userReducer.avatar,
        userName: store.getState().userReducer.userName,
        userId: store.getState().userReducer.userId,
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
    let userId = store.getState().userReducer.userId;
    HttpService.apiPost(api.appSignOut,{
      userId:userId
    }).then((data:any)=>{
      if(data.flag == '00'){
         //退出清空全局数据
         store.dispatch(Log_Out())
         //关闭加载效果
        this.setState({
          visible: false
        })
         //退出后跳转登录页面
         this.props.navigation.reset({
          index: 1,
          routes: [{ name: 'Index' }],
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

  toggleDialog3 = ()=>{
    this.setState({
      visible: !this.state.visible
    })
  }
  render() {
    return (
      <View style={styleg.containerMax}>

        <View style={styles.nav}>
          <Pressable style={styles.navLeft} onPress={()=>{this.props.navigation.navigate('Index')}}>
            <Image style={styles.navImg} source={require('../../image/Home.png')}></Image>
          </Pressable>
          <Text style={styles.navName}>我的</Text>
        </View>

        <Pressable style={styles.user}>
          <Image style={styles.logo} source={this.state.userImg}></Image>

            {this.state.logonStatus?
              <View style={styles.text}>
                  <Text style={styles.name}>
                      {this.state.userName}
                  </Text>
                  <Text style={styles.id}>
                      账号ID：{this.state.userId}
                  </Text>
              </View>
                :
              <Pressable style={styles.text} onPress={()=>this.props.navigation.navigate('BindAccount')}>
                <Text style={styles.name}>
                    您还没有登录
                </Text>
                <Text style={styles.id}>
                    点击登录或注册账号
                </Text>
              </Pressable>
              }
          <Image style={styles.rightIco} source={require('../../image/right.png')}></Image>
        </Pressable>
        <View style={styles.con}>
          {this.state.logonStatus?
            <Text style={styles.signOut} onPress={this.signOut}>
              退出登录
            </Text> : ''
          }
        </View>
        {/* 弹窗效果组件 */}
          
        <Loading 
            type={this.state.msgType} 
            visible={this.state.visible} 
            LoadingMsg={this.state.LoadingMsg}>
        </Loading>
        <Menu myMeun={'1004'} props = {this.props}></Menu>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  nav:{
    position:'relative',
    height:60,
    backgroundColor:'#2ea4ff',
  },
  navLeft:{
    position:'absolute',
    left:10,
    top:15,
    zIndex:999,
    width: 30,
    height: 30,
    backgroundColor:'#c3c3c3',
    borderRadius: 20,
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
  },
  navImg:{
    width:25,
    height:25,
  },
  navName:{
    height:60,
    lineHeight:60,
    textAlignVertical: 'center',
    textAlign:'center',
    fontSize:20,
    color:'#fff'
  },
  user:{
    position: 'absolute',
    top: 60,
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
    fontSize: 22,
    color: '#000',
    fontWeight: '700',
  },
  id:{
    position: 'relative',
    width: '100%',
    height: 25,
    lineHeight: 25,
    fontSize: 16,
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
    zIndex: 909999,
    display:'flex',
    alignItems:'center',
  },
  signOut:{
    position: 'relative',
    width: '70%',
    height: 40,
    lineHeight: 40,
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    backgroundColor:'#1890FF',
    borderRadius: 5,
    margin:40
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
