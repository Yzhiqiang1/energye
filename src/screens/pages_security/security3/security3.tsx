import { Dimensions, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import Navbar from '../../../component/navbar/navbar'
import styleg from '../../../indexCss'
import { Register } from '../../../utils/app'
import { store } from '../../../redux/storer'
import { HttpService } from '../../../utils/http'
import Loading from '../../../component/Loading/Loading'
import VideoPlayer from 'react-native-video-controls';
import { withTranslation } from 'react-i18next';//语言包

const api = require('../../../utils/api')
const Fs = Dimensions.get('window').width*0.8

export class Security3 extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
            LoginStatus: 1, //登录状态默认未登录
            /**
             * 设备数据
             * **/
            deviceName: '', //设备名称
            deviceId: null, //设备ID
            deviceNo: null, //设备序列号
            /**
             * 传感器数据
             */
            sensorArr: [], //传感器数据
            /**
             * 分页获取
             */
            currPage: 1, //下拉请求页码
            pageSize: 20, //每页获取条数
            pageCount: 0, //总页数
            scroll_is: true, //是否允许滚动
            isPage_Load: true, //下拉加载效果
            isPage_test: false, //是否请求文字提示

            //是否启用实时数据
            socketTask: true, //默认启用

            msgType: 1,
            visible: false,
            LoadingMsg: '',

            loading: false
        }
    }
    componentDidMount(): void {
         //调用登录验证
         Register.userSignIn(false).then(res => {
            //校验登录成功后执行
            if (res == true) {
                //向自定义导航传递登录状态
                this.setState({
                    LoginStatus: 2
                }, () => {
                    //校验通过后调用方法
                    this.check_ok();
                })
            } else {
                //向自定义导航传递登录状态
                this.setState({
                    LoginStatus: 1
                })
            }
        });
    }
    /************************************
     * 
     *     校验登录通过
     * 
     * *****************************/
    check_ok=()=>{
        let that = this;
        let parameterGrou:any = store.getState().parameterGroup //获取选中组和设备信息
        if (parameterGrou.monitorGroup.selectKey) {
            //查询数据
            that.getData();
        } else {
            //信息提示
            this.setState({
              msgType: 2,
              visible: true,
              LoadingMsg: this.props.t('getNotData')//'获取参数失败！'
          },()=>{
              setTimeout(()=>{
                  this.setState({
                      visible: false,
                  })
              },2000)
          })
        }
    }
    //组选中切换
    handleSelect=(e:any)=>{
        //通知首页更新
        this.getData();
    }
    /**
     * 空函数 阻止事件冒泡
     */
    notap=(e:any)=>{}

    /**
     * 获取传感器
     */
    getData=()=>{
        let that = this;
        //请求参数
        let userId = store.getState().userId; //用户ID
        //查询设备ID
        let ObjdeviceId = store.getState().parameterGroup.monitorGroup.selectKey;
        let strdeviceId = "";
        for (let i in ObjdeviceId) {
            strdeviceId += strdeviceId == "" ? ObjdeviceId[i] : ',' + ObjdeviceId[i];
        }
        HttpService.apiPost(api.sxt_getData, {
            userId: userId,
            deviceIds: strdeviceId,
        }).then((data:any) => {
            if (data.flag == '00') {
                let listData = data.data;
                if (listData.length > 0) {
                    let sensorArr = [];
                    let objPos:any = {};
                    //第一层循环  --   循环有传感器的设备
                    for (let a = 0; a < listData.length; a++) {
                        objPos[listData[a].deviceno] = listData[a].deviceno;
                        //判断设备中是否有传感器数据
                        if (listData[a].sensorsList != null && listData[a].sensorsList != '') {
                            //第二层循环  --  循环每个设备中多个传感器
                            for (let b = 0; b < listData[a].sensorsList.length; b++) {
                                let sensorItem = listData[a].sensorsList[b]
                                // console.log(sensorItem,55);

                                /**
                                 * 查询-传感器类型
                                 * **/
                                let sensorType = Number(sensorItem.sensortypeid);
                                /**
                                 * 视频历史回放
                                 * **/
                                let deviceSerial = ''; //设备序列号
                                let channelNo = ''; //设备通道
                                /**
                                 * 查询-处理数据
                                 * **/
                                let value = ''; //传感器数据
                                let state = 0; //传感器状态
                                let stateCss = ''; //传感器状态样式

                                /**
                                 * 查询-处理传感器状态
                                 * **/
                                if (sensorItem.isLine == 1) { //设备在线
                                    stateCss = '';
                                    state = 0;
                                    if (sensorItem.isAlarms == 1) {
                                        stateCss = 'police';
                                        state = 2;
                                    }

                                } else if (sensorItem.isLine == 0) { //设备离线
                                    stateCss = 'offLine';
                                    state = 1;
                                }


                                if (sensorType === 7) {
                                    //处理value值
                                    value = sensorItem.hls ? sensorItem.hls : '';
                                    // //提取 设备序列号和通道号
                                    if (sensorItem.live) {
                                        let start = sensorItem.live.indexOf("/"); //倒数第二出现位置
                                        for (var i = 0; i < 2; i++) {
                                            start = sensorItem.live.indexOf("/", start + 1);
                                        }
                                        let last = sensorItem.live.lastIndexOf('/'); //最后一次出现位置
                                        deviceSerial = sensorItem.live.slice(Number(start) + 1, Number(last));
                                        channelNo = sensorItem.live.slice(Number(last) + 1, Number(last) + 2);
                                    } else if (sensorItem.replay) {
                                        let start = sensorItem.replay.indexOf("/"); //倒数第二出现位置
                                        for (var i = 0; i < 2; i++) {
                                            start = sensorItem.replay.indexOf("/", start + 1);
                                        }
                                        let last = sensorItem.replay.lastIndexOf('/'); //最后一次出现位置
                                        deviceSerial = sensorItem.replay.slice(Number(start) + 1, Number(last));
                                        channelNo = sensorItem.replay.slice(Number(last) + 1, Number(last) + 2);
                                    }
                                }
                                /**
                                 * 查询-传感器图标
                                 * **/
                                //    let _src=sensorItem.iocUrl ? sensorItem.iocUrl.substr(0,7).toLowerCase() == 'http://' || sensorItem.iocUrl.substr(0,8).toLowerCase() == 'https://' ? sensorItem.iocUrl : api.imgurl + sensorItem.iocUrl: ''
                                // console.log(_src,45345);
                                /**
                                 *  处理传感器数据
                                 */
                                sensorArr.push({
                                    id: sensorItem.id,
                                    name: sensorItem.sensorname, //传感器名称
                                    type: 7,
                                    value: value,
                                    unit: sensorItem.unit, //传感器单位
                                    time: sensorItem.updateTime, //传感器createTime

                                    // src: _src,//传感器图标
                                    // src:"/images/default/video.png",

                                    state: state, //传感器状态
                                    stateCss: stateCss, //传感器状态样式
                                    loading: false, //开关加载状态

                                    //经纬度信息
                                    lng: sensorItem.lng ? sensorItem.lng : '',
                                    lat: sensorItem.lat ? sensorItem.lat : '',

                                    //视频历史回放
                                    accesstoken: sensorItem.accesstoken, //传感器accesstoken
                                    deviceSerial: deviceSerial, //设备序列号
                                    channelNo: channelNo, //通道号   

                                    //用于获取萤石云 accessToken
                                    appkey: sensorItem.appkey,
                                    secret: sensorItem.secret,
                                })
                            }
                        } else { //设备无传感器信息
                            continue
                        }
                    }
                    //  console.log(sensorArr,6666);
                    that.setState({
                        sensorArr: sensorArr
                    }, () => {
                        //关闭加载效果
                        this.setState({
                          visible: false,
                        });
                    })
                } else {
                    that.setState({
                        sensorArr: [],
                    }, () => {
                        //关闭加载效果
                        this.setState({
                          visible: false,
                        });
                    })
                }
            } else {
                //关闭加载效果
                this.setState({
                  visible: false,
                });
                // //错误提示信息
                this.setState({
                  msgType: 2,
                  visible: true,
                  LoadingMsg: data.msg
              },()=>{
                  setTimeout(()=>{
                      this.setState({
                          visible: false,
                      })
                  },2000)
              })
            }
        }).catch((fail_message) => {
            //关闭加载效果
            this.setState({
              visible: false,
            });
            // //错误提示信息
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
        });
    }

    onBuffer=({ isBuffering }:any)=>{
      this.setState({ loading: isBuffering });
    }
    onEnd=()=>{

    }
    render() {
      const { t } = this.props
        return (
          <View style={{flex: 1}}>
              <View style={{position: 'absolute',top: 0,width: "100%",height: "100%",backgroundColor: '#fff'}}>
              </View>
              {/* 弹窗效果组件 */}
              <Loading 
                  type={this.state.msgType} 
                  visible={this.state.visible} 
                  LoadingMsg={this.state.LoadingMsg}>
              </Loading>
              <SafeAreaView style={{flex: 1}}>
                  {/* 引入自定义导航栏 */}
                  <Navbar 
                      pageName={t('camera')}//摄像头
                      showBack={true}
                      showHome={false}
                      isCheck={6}
                      LoginStatus={this.state.LoginStatus}
                      props={this.props}
                      handleSelect={this.handleSelect}>
                  </Navbar>
                  {/* 内容区 */}
                  <View style={styleg.container}>
                      <View style={styles.casePage}>
                          <View style={styles.listMasonry}>
                              {/* 判断下所选设备有无传感器数据 */}
                              {this.state.sensorArr.length == 0?
                                  <Text allowFontScaling={false} style={styles.empty}>{t('TANS')}</Text>:''//当前设备下没有传感器
                              }
                              {/* 循环传感器 */}
                              {this.state.sensorArr.map((top_item:any,top_index:number)=>{
                                  return(
                                      <View style={[styles.itemMasonry,top_item.stateCss]} key={top_index}>
                                          {/* 头部可直接进入历史查询 */}
                                          { top_item.type == 7?
                                              //视频类型 
                                              <Pressable style={styles.itemHead} onPress={()=>{
                                                  this.props.navigation.navigate('Playback',{
                                                      sensorName: top_item.name,
                                                      accessToken: top_item.accesstoken,
                                                      deviceSerial: top_item.deviceSerial,
                                                      appkey: top_item.appkey,
                                                      secret: top_item.secret,
                                              })}}>
                                                  <View style={styles.ico}>
                                                  </View>
                                                  <Text allowFontScaling={false} style={styles.name}>
                                                      {top_item.name}
                                                  </Text>
                                                  <View style={styles.state}>
                                                  </View>
                                              </Pressable>:''
                                          }
                                              
                                          {/* 传感器内容区 */}
                                          <View style={styles.itemCon} >
                                              <View style={styles.itemValue}>
                                                  {/* 视频型 */}
                                                  {top_item.type == 7?
                                                      <View style={styles.Video}>
                                                        {top_item.value?
                                                          <VideoPlayer
                                                          resizeMode="cover"
                                                          style={styles.Video}
                                                          source={{ uri: top_item.value}}
                                                          onBuffer={(data:any)=>this.onBuffer(data)}
                                                          disableVolume={true}
                                                          disableBack={true}
                                                          disableFullscreen={true}
                                                          >
                                                          </VideoPlayer>
                                                        :''} 
                                                        {top_item.value == ''?
                                                          <Text allowFontScaling={false} style={styles.videoNone}>{t('AOSLAH')}</Text>:''//小程序仅支持直播地址HLS
                                                        }
                                                      </View>:''
                                                  }
                                              </View>
                                              <Text allowFontScaling={false} style={styles.itemTime}>
                                                  {/* {item.time} */}
                                              </Text>
                                          </View>
                                    </View>
                                  )
                              })}
                          </View>
                      </View>
                      {/* 下拉加载中动画 */}
                      {this.state.isPage_Load?
                          <View style={styles.isPageLoad}>
                              <View style={styles.load}>
                              </View>
                          </View>
                      :''}
                      
                      {/* 加载所有数据文字提示 */}
                      {this.state.isPage_test?
                        <Text allowFontScaling={false} style={styles.isPageTxt} onPress={()=>console.log(this.state.isPage_test)}>
                            {t('ADHBL')}
                        </Text>:''//已加载所有数据
                      }
                  </View>
              </SafeAreaView>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    dataList:{
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        bottom: 0,
        // overflowAnchor: 'none',
      },
      casePage :{
        padding: 10,
      },
      listMasonry :{
        /* column-count: 2,
        column-gap: 20rpx, */
      },
      itemMasonry :{
        backgroundColor: '#fff',
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        borderRadius: 5,
        position: 'relative',
        marginBottom: 10,
      },
      itemHead:{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#ebedf0',
        borderStyle: 'solid',
      },
      ico:{
        width: 23,
        height: 23,
        marginTop: 9,
        marginLeft: 2,
        overflow: 'hidden',
      },
      imgs:{
        width: 23,
        height: 23,
        // borderRadius: '50%',
        overflow: 'hidden',
      },
      name:{
        width: '100%',
        height: 40,
        lineHeight: 40,
        textAlignVertical: 'center',
        fontSize: Fs/24,
        color: '#333',
        verticalAlign: 'middle',
        overflow: 'hidden',
      },
      statess:{
        position:'absolute',
        top: 5,
        right: -5,
        width: 8,
        height: 8,
        // border:1px solid #2b92d4,
        borderRadius: 25,
        // background-image: radial-gradient(#6cc3fe, #21a1d0),
        // box-shadow:0 1rpx 30rpx rgba(59,255,255,0.4),
        zIndex: 999,
        overflow:'hidden',
      },
      trigger:{
        position:'absolute',
        top: 20,
        right: -5,
        width: 16,
        height: 16,
        zIndex: 999,
        overflow: 'hidden',
      },
      itemChart:{
        position: 'relative',
        width: '100%',
        height: 40,
        marginTop: 5,
      
      },
      itemCon:{
        position: 'relative',
        width: '100%',
        marginTop: 5,
      },
      itemValue:{
        position: 'relative',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 10
      },
      value:{
        fontSize: Fs/14,
        color: '#333',
        textAlign: 'center',
        // text-overflow:ellipsis,
        // white-space: nowrap,
        overflow: 'hidden',
      },
      img:{
        width: '100%',
      },
      unit:{
        fontSize: Fs/22,
        color: 'red',
      },
      video:{
        width: '100%',
        height: 120,
        zIndex: 1,
      },
      videoErr:{
        color:' red',
        fontSize: Fs/24,
      },
      itemTime:{
        position: 'relative',
        width: '100%',
        lineHeight: 15,
        textAlign: 'center',
        fontSize: Fs/24,
        color:' rgb(255, 255, 255)',
        marginTop: 5,
        overflow: 'hidden',
      },
      /**  设备报警  **/
      states:{
        // border: 1px solid #f82525,
        // background-image: radial-gradient(#ff3c3c, #fd3030),
        // box-shadow: 0 1rpx 30rpx rgba(218, 86, 81, 0.3),
      },
      units:{
        color: '#fc1c1c',
      },
      values:{
        color: '#fc1c1c',
      },
      /**  设备离线  **/
      state:{
        position: 'absolute',
        top: 5,
        right: 5,
        width:10,
        height:10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#2b92d4',
        borderStyle: 'solid',
        backgroundColor: '#63bff8'
      },
      offLinevalue:{
        color: '#92938b',
      },
      nothing:{
        position: 'relative',
        width: '100%',
        height: 50,
        lineHeight: 50,
        textAlign: 'center',
        fontSize: Fs/24,
        color: 'rgb(255, 255, 255)',
        overflow: 'hidden',
      },
      /* 加载效果 */
      isPageTxt:{
        position: 'relative',
        width: '100%',
        height: 40,
        lineHeight: 40,
        textAlign: 'center',
        fontSize: Fs/24,
        color: 'rgb(255, 255, 255)',
        overflow: 'hidden',
      },
      isPageLoad:{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
      },
      load:{
        position: 'relative',
        width: 16,
        height: 16,
      },
   
      LowerInput:{
        position: 'relative',
        width: '100%',
        height: 180,
        backgroundColor: '#333',
        color: '#fff',
        padding: 10,
      },
      videoNone:{
        position: 'absolute',
        top: '50%',
        left: 0,
        width: '100%',
        textAlign: 'center',
        color: '#f2f2f2',
        fontSize: Fs/26,
        zIndex: 99999,
      },
      empty:{
          textAlign: 'center',
          fontSize: 20,
          color: '#333'
      },
      Video:{
        width: '100%',
        height: 200,
        backgroundColor: '#333'
      },
})

export default withTranslation()(Security3)