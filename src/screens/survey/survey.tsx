import { Dimensions, PixelRatio, ScrollView, StyleSheet, Text, View, SafeAreaView} from 'react-native'
import React, { Component } from 'react'
import { Register } from '../../utils/app'
import Navbar from '../../component/navbar/navbar'
import styleg from '../../indexCss'
import { Image } from '@rneui/base'
import store from '../../redux/store'
import {HttpService} from '../../utils/http'
import { CheckBox } from '@rneui/themed';
import MyCanvas from '../../component/my-canvas/MyCanvas'
import Loading from '../../component/Loading/Loading'
const api = require('../../utils/api')
const Fs = Dimensions.get('window').width*PixelRatio.getFontScale()
let cs: any

export class Survey extends Component<any,any> {
  constructor(props:any){
    super(props)
    this.state={
      LoginStatus: 1,//登录状态

      toDay: "", //当日
      toMonth: "", //当月
      lastDay: "", //上一日
      lastMonth: "", //上一月
      dayTendency: "", //当日趋势
      monthTendency: "", //当月趋势

      //历史时间选择
      _radio: "48h",
      //数据项
      optionData_1: [],
      optionData_2: [],

      // 弹出窗口
      msgType: 1,
      visible: false,//加载效果控制
      LoadingMsg:''// 加载效果文字
    }
  }
  componentDidMount(): void {
    console.log(Dimensions.get('window').height);
    
    Register.userSignIn(false).then(res => {
      //校验登录成功后执行
      if (res == true) {
          this.check_ok(); //校验通过后调用方法
          //向自定义导航传递登录状态
          this.setState({
              LoginStatus: 2
          })
      } else {
          //向自定义导航传递登录状态
          this.setState({
              LoginStatus: 1
          })
      }
    });
  }
  check_ok(){
    let that = this;
    let parameterGrou = store.getState().userReducer.parameterGroup//获取选中组和设备信息
    if (parameterGrou.multiGroup.selectKey) {
        that.getPart();
    } else {
        //信息提示
        this.setState({
          msgType: 2,
          visible: true,
          LoadingMsg: '获取参数失败！'
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
  handleSelect=(e: any)=>{
    //用能概况-环比
    this.getPart();
  }
  //历史指定日期时间选择
  onChange(e:string) {
    this.setState({
        _radio: e,
    }, () => {
        //用能概况-历史趋势
        this.getEnergy(1);
    })
  }
  //用能概况-环比
  getPart(){
    let that = this;
    this.setState({
      msgType: 1,
      visible: true,
      LoadingMsg: '加载中...'
    })
    //用户ID
    let userId = store.getState().userReducer.userId;
    //查询设备ID
    let ObjdeviceId = store.getState().userReducer.parameterGroup.multiGroup.selectKey;
    let ids = "";
    for (let i in ObjdeviceId) {
        //有更新
        ids += ids == "" ? ObjdeviceId[i] : ',' + ObjdeviceId[i];
    }
    //查询数据
    HttpService.apiPost(api.getPart, {
        userId: userId,
        ids: ids,
    }).then((res: any) => {
        if (res.flag == "00") {
            let listData = res.data;
            that.setState({
                toDay: listData.toDay, //当日
                toMonth: listData.toMonth, //当月
                lastDay: listData.lastDay, //上一日
                lastMonth: listData.lastMonth, //上一月
                dayTendency: listData.dayTendency, //当日趋势
                monthTendency: listData.monthTendency, //当月趋势
            }, () => {
                //用能概况-日平均负荷
                that.getDayLoad();
            })
        } else {
            //用能概况-日平均负荷
            that.getDayLoad();
            //错误提示信息
            this.setState({
              msgType: 2,
              visible: true,
              LoadingMsg: res.msg
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
        }
    }).catch((fail_message: any) => {
        //用能概况-日平均负荷
        that.getDayLoad();
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
    });
  }
  //用能概况-日平均负荷
  getDayLoad(){
    let that = this;
        //用户ID
        let userId = store.getState().userReducer.userId;
        //查询设备ID
        let ObjdeviceId = store.getState().userReducer.parameterGroup.multiGroup.selectKey;
        let ids = "";
        for (let i in ObjdeviceId) {
            ids += ids == "" ? ObjdeviceId[i] : ',' + ObjdeviceId[i];
        }
        //查询数据
        HttpService.apiPost(api.getDayLoad, {
            userId: userId,
            ids: ids,
        }).then((res:any) => {
            if (res.flag == "00") {
                //传感器数据
                let times = res.data.times;
                let values = res.data.values;
                //定义图表数据
                let queryData:any = {
                    name: "",
                    state: true,
                    title: '日平均负荷曲线',
                    legendData: [],
                    xAxisData: [],
                    yAxisName: "单位(Kw)",
                    series: [{
                        name: '',
                        type: 'line',
                        connectNulls: true,
                        data: []
                    }]
                };
                //处理数据
                for (let i = 0; i < values.length; i++) {
                    queryData.xAxisData.push(times[i]);
                    queryData.series[0].data.push(values[i]);
                }
                //更新数据
                that.setState({
                    optionData_1: [queryData]
                }, () => {
                    //用能概况-历史趋势
                    that.getEnergy();
                    //关闭加载效果
                    this.setState({
                      visible: false,
                    })
                })
            } else {
                //用能概况-历史趋势
                that.getEnergy();
                //错误提示信息
                this.setState({
                  msgType: 2,
                  visible: true,
                  LoadingMsg: res.msg
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            visible: false,
                        })
                    },2000)
                })
            }
        }).catch((fail_message) => {
            //用能概况-历史趋势
            that.getEnergy();
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
        });
  }
  //用能概况-历史趋势
  getEnergy(_type: number = 0){
    //加载效果
    if (_type == 1) {
        this.setState({
          msgType: 1,
          visible: true,
          LoadingMsg: '加载中...'
        })
    };
    let that = this;
    //用户ID
    let userId = store.getState().userReducer.userId;
    //查询设备ID
    let ObjdeviceId =store.getState().userReducer.parameterGroup.multiGroup.selectKey;
    let ids = "";
    for (let i in ObjdeviceId) {
        ids += ids == "" ? ObjdeviceId[i] : ',' + ObjdeviceId[i];
    }
    let type = that.state._radio;
    //查询数据
    HttpService.apiPost(api.getEnergy, {
        userId: userId,
        ids: ids,
        type: type,
    }).then((res:any) => {
        if (res.flag == "00") {
            //传感器数据
            let times = res.data.times;
            let values = res.data.values;
            //定义图表数据
            let queryData:any = {
                name: "",
                state: true,
                title: '历史趋势',
                legendData: [],
                xAxisData: [],
                yAxisName: "单位(Kw)",
                series: [{
                    name: '',
                    type: 'line',
                    connectNulls: true,
                    data: []
                }]
            };
            //处理数据
            for (let i = 0; i < values.length; i++) {
                queryData.xAxisData.push(times[i]);
                queryData.series[0].data.push(values[i]);
            }
            //更新数据
            that.setState({
                optionData_2: [queryData]
            }, () => {
                //关闭加载效果
                this.setState({
                  visible: false,
                })
                console.log(this.state.optionData_2);
            })
        } else {
            //关闭加载效果
            this.setState({
              visible: false,
            })
            //错误提示信息
            this.setState({
              msgType: 2,
              visible: true,
              LoadingMsg: res.msg
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
    });
  }
  SC =()=>{
      cs.measure((x: any, y: any,width:any, height:any )=>{
        console.log(x,y);
        console.log(width,height);
      })
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1,width:'100%',height:'100%',}} ref={(ref)=>{cs=ref}}>
         {/* 引入自定义导航栏 */}
        <Navbar 
            pageName={"用能概况"}
            showBack={true}
            showHome={false}
            isCheck={3}
            LoginStatus={this.state.LoginStatus}
            props={this.props}
            handleSelect={this.handleSelect}
        >
        </Navbar>
        {/* 内容区 */}
        <ScrollView style={styleg.container}>
             <View style={styles.list}>
                <Text  style={[styles.title]} onPress={this.SC}>环比(单位：kW·h)</Text>
                <View style={styles.con}>
                    <View style={styles.row}>
                        <View style={[styles.row33,styles.pl]}>
                            <View style={styles.item}>
                                <View style={styles.name}>
                                    <Image style={styles.img} source={require('../../image/survey_ico1.png')}></Image>
                                    <Text style={styles.test}>当日用能</Text>
                                </View>
                                <View style={styles.value}>
                                    <Text style={styles.test}>{this.state.toDay}</Text>
                                    <Image style={styles.imgline} source={require('../../image/survey_line1.png')}></Image>
                                </View>
                            </View>
                        </View>
                         <View style={[styles.row33,styles.pl]}>
                            <View style={styles.item}>
                                <View style={styles.name}>
                                    <Image style={styles.img} source={require('../../image/survey_ico2.png')}></Image>
                                    <Text style={styles.test}>昨日同期</Text>
                                </View>
                                <View style={styles.value}>
                                    <Text style={styles.test}>{this.state.lastDay}</Text>
                                    <Image style={styles.imgline} source={require('../../image/survey_line2.png')}></Image>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.row33,styles.pr]}>
                            <View style={styles.item}>
                                <View style={styles.name}>
                                    <Image style={styles.img} source={require('../../image/survey_ico3.png')}></Image>
                                    <Text style={styles.test}>日趋势</Text>
                                </View>
                                <View style={styles.value}>
                                    <Text style={styles.test}>{this.state.dayTendency}%</Text>
                                    <Image style={styles.imgline} source={require('../../image/survey_line3.png')}></Image>
                                </View>
                                {this.state.dayTendency!= ''?
                                  this.state.dayTendency>=0?
                                  <View style={styles.tenbox}>
                                    <Image 
                                    style={styles.tendency}
                                    source={require('../../image/survey_up.png')} 
                                    ></Image>
                                  </View>
                                  :
                                  <View style={styles.tenbox}>
                                     <Image 
                                      style={styles.tendency}
                                      source={require('../../image/survey_down.png')} 
                                      ></Image>
                                   </View>
                                  : ''}
                            </View>
                        </View> 
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.row33,styles.pl]}>
                            <View style={styles.item}>
                                <View style={styles.name}>
                                    <Image style={styles.img} source={require('../../image/survey_ico1.png')}></Image>
                                    <Text style={styles.test}>当月用能</Text>
                                </View>
                                <View style={styles.value}>
                                    <Text style={styles.test}>{this.state.toMonth}</Text>
                                    <Image style={styles.imgline} source={require('../../image/survey_line1.png')}></Image>
                                </View>
                            </View>
                        </View>
                        <View style={styles.row33}>
                            <View style={styles.item}>
                                <View style={styles.name}>
                                    <Image style={styles.img} source={require('../../image/survey_ico2.png')}></Image>
                                    <Text style={styles.test}>上月同期</Text>
                                </View>
                                <View style={styles.value}>
                                    <Text style={styles.test}>{this.state.lastMonth}</Text>
                                    <Image style={styles.imgline} source={require('../../image/survey_line2.png')}></Image>
                                </View>
                            </View>
                        </View>
                        <View style={styles.row33}>
                            <View style={styles.item}>
                            <View style={styles.name}>
                                    <Image style={styles.img} source={require('../../image/survey_ico3.png')}></Image>
                                    <Text style={styles.test}>月趋势</Text>
                                </View>
                                <View style={styles.value}>
                                    <Text style={styles.test}>{this.state.monthTendency}%</Text>
                                    <Image style={styles.imgline} source={require('../../image/survey_line3.png')}></Image>
                                </View>
                                {this.state.monthTendency != ''?
                                  this.state.monthTendency>=0?
                                  <View style={styles.tenbox}>
                                    <Image 
                                    style={styles.tendency}
                                    source={require('../../image/survey_up.png')} 
                                    ></Image>
                                  </View>
                                  :
                                  <View style={styles.tenbox}>
                                     <Image 
                                      style={styles.tendency}
                                      source={require('../../image/survey_down.png')} 
                                      ></Image>
                                   </View>
                                  :'' 
                                }
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            {this.state.optionData_1.length > 0?
              <View style={styles.list}>
                <Text style={styles.title}>日平均负荷曲线</Text>
                <View style={styles.echarts}>
                    {/* <my-canvas obj-data="{{optionData_1[0]}}"></my-canvas> */}
                    <MyCanvas objData={this.state.optionData_1[0]}></MyCanvas>
                </View>
              </View>:''
            }
            {this.state.optionData_2.length > 0?
              <View style={styles.list}>
                <Text style={styles.title}>历史趋势</Text>
                <View style={styles.radio}>
                    <CheckBox
                      containerStyle={styles.radioCk}
                      checked={this.state._radio === '48h'}
                      onPress={() => this.onChange('48h')}
                      title={'过去48时'}
                      size={16}
                      checkedIcon="dot-circle-o"
                      uncheckedIcon="circle-o"
                    />
                    <CheckBox
                      containerStyle={styles.radioCk}
                      checked={this.state._radio === '31d'}
                      onPress={() => this.onChange('31d')}
                      title={'过去31天'}
                      size={16}
                      checkedIcon="dot-circle-o"
                      uncheckedIcon="circle-o"
                    />
                    <CheckBox
                      containerStyle={styles.radioCk}
                      checked={this.state._radio === '12M'}
                      onPress={() => this.onChange('12M')}
                      title={'过去12月'}
                      size={16}
                      checkedIcon="dot-circle-o"
                      uncheckedIcon="circle-o"
                    />
                    <CheckBox
                      containerStyle={styles.radioCk}
                      checked={this.state._radio === '3y'}
                      onPress={() => this.onChange('3y')}
                      title={'过去3年'}
                      size={16}
                      checkedIcon="dot-circle-o"
                      uncheckedIcon="circle-o"
                    />
                </View>
                <View style={styles.echarts}>
                    <MyCanvas objData={this.state.optionData_2[0]}></MyCanvas>
                </View>
            </View> :''
            }
        </ScrollView>
        {/* 弹窗效果 */}
        <Loading 
            type={this.state.msgType} 
            visible={this.state.visible} 
            LoadingMsg={this.state.LoadingMsg}>
        </Loading>
      </SafeAreaView>
    )
  }
}

const styles  = StyleSheet.create({
  list:{
    position: 'relative',
    width: '100%',
    paddingLeft:10,
    paddingRight:10,
    marginTop: 10,
    backgroundColor: '#fff',
  },
  title:{
    position: 'relative',
    width: '100%',
    height: 30,
    lineHeight: 30,
    textAlignVertical: 'center',
    padding: 0,
    borderLeftWidth: 2,
    borderStyle:'solid',
    borderColor:'#313131',
    fontSize: Fs/16,
    color: '#313131',
    paddingLeft: 10,
    marginTop:12,
    marginBottom:10,
    overflow: 'hidden',
  },
  con:{
    position: 'relative',
    width: '100%',
    borderTopWidth: 1,
    borderStyle:'solid',
    borderColor:'#E5E5E5',
    paddingBottom: 15,
    overflow: 'hidden',
  },
  row:{
    position: 'relative',
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    width: '100%',
    marginTop: 10,
    overflow: 'hidden',
  },
  row33:{
    position: 'relative',
    width: '32%',
  },
  pl:{
    paddingLeft: 0,
  },
  pr:{
    paddingRight: 0,
  },
  item:{
    position: 'relative',
    width: '100%',
    borderStyle:'solid',
    borderWidth:1,
    borderColor:'#E5E5E5',
    borderRadius: 5,
    padding: 5,
    overflow: 'hidden',
  },
  name:{
    position: 'relative',
    width: '100%',
    display:'flex',
    flexDirection:'row',
    borderRadius: 5,
    padding: 5,
    overflow: 'hidden',
  },
  img:{
    width: 18,
    height: 18,
  },
  imgline: {
    width: 40,
    height: 14
  },
  test:{
    flex: 1,
    paddingRight:5,
    paddingLeft:5,
    fontSize: Fs/20,
    color: '#666666',
    overflow: 'hidden',
  },
  value:{
    position: 'relative',
    width: '100%',
    height: 30,
    lineHeight: 30,
    display: 'flex',
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tenbox: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  tendency:{
    width: 10,
    height:15,
  },
  echarts:{
    position: 'relative',
    width: '100%',
  },
  radio:{
      position: 'relative',
      width: '100%',
      paddingBottom: 10,
      overflow: 'hidden',
      display:'flex',
      flexDirection:'row',
  },
  radioCk:{
    flex: 1,
    width: '25%',
    marginRight:0,
    paddingRight:0
  },
})

export default Survey