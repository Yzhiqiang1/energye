import { StyleSheet, Text, View, DeviceEventEmitter, Dimensions, SafeAreaView, Pressable, Image } from 'react-native'
import React, { Component } from 'react'
import Navbar from '../../../component/navbar/navbar'
import styleg from '../../../indexCss'
import { Register } from '../../../utils/app'
import { store } from '../../../redux/storer'
import { HttpService } from '../../../utils/http'
import util, { plusReduceData } from '../../../utils/util'
import Loading from '../../../component/Loading/Loading'
import PickerBut from '../../../component/PickerBut/PickerBut'
const api = require('../../../utils/api')
const Fs = Dimensions.get('window').width*0.8
import { t } from 'i18next'

export class PowerAnalysis4 extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
            LoginStatus: 1, //登录状态,默认未登录

            start: plusReduceData(util.nowDate(), 1, 5), //查询日期
            end: util.nowDate(), //结束日期
            //数据项
            optionData: [],

            msgType: 1,
            visible: false,
            LoadingMsg: ''
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
     *     校验登录通过
     * *****************************/
    check_ok=()=>{
        let that = this;
        let parameterGrou = store.getState().parameterGroup; //获取选中组和设备信息
        if (parameterGrou.radioGroup.selectKey != '') {
            //查询数据
            that.getData();
        } else {
            //信息提示
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: t('getNotData')
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
        DeviceEventEmitter.emit('refresh')
        //查询逐日极值数据
        this.getData();
    }
    //开始日期
    clickStart=(e:any)=>{
        let that = this;
        that.setState({
            start: e
        })
    }
    //结束日期
    clickEnd=(e:any)=>{
        let that = this;
        that.setState({
            end: e
        })
    }
    //搜索
    clickSearch=()=>{
        let that = this;
        let start = new Date(that.state.start).getTime();
        let end = new Date(that.state.end).getTime(); //结束日期
        if (start > end) {
            //错误提示信息
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: t('TSDMN')
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
        } else {
            //查询数据
            that.getData();
        }
    }
    //查询数据
    getData=()=>{
        let that = this;
        let LoginStatus = that.state.LoginStatus; //登录状态
        if (LoginStatus == 1) {
            //错误提示信息
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: t('YANLI')
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
            return false;
        }
        this.setState({
            msgType: 1,
            visible: true,
            LoadingMsg: t('Loading')
        }); //加载效果
        let userId = store.getState().userId; //用户ID
        let deviceId = store.getState().parameterGroup.radioGroup.selectKey; //获取设备ID
        let start = that.state.start //开始日期
        let end = that.state.end; //结束日期
        //定义图表数据
        let queryData = [];
        //查询数据
        HttpService.apiPost(api.sh_getData, {
            userId: userId,
            deviceid: deviceId,
            start: start,
            end: end,
        }).then((res:any) => {
            console.log(res)
            if (res.flag == "00") {
                let listData = res.data;
                //校验数据是否为空
                if (listData.length > 0) {
                    //循环数据
                    for (let i = 0; i < listData.length; i++) {
                        let objData = listData[i]; //传感器数据
                        queryData.push(objData);
                    }
                    that.setState({
                        optionData: queryData,
                    }, () => {
                        //关闭加载效果
                        // wx.hideLoading();
                        this.setState({
                            visible: false,
                        })
                    })
                } else {
                    that.setState({
                        optionData: [],
                    }, () => {
                        //关闭加载效果
                        this.setState({
                            visible: false,
                        })
                    })
                }
            } else {
                //关闭加载效果
                this.setState({
                    visible: false,
                })
                // //错误提示信息
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

    render() {
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
                        pageName={t('lossAnalysis')}
                        showBack={true}
                        showHome={false}
                        isCheck={2}
                        LoginStatus={this.state.LoginStatus}
                        props={this.props}
                        handleSelect={this.handleSelect}>
                    </Navbar>
                    {/* 内容区 */}
                    <View style={styleg.container}>
                        <View style={styles.query_head}>
                            <View style={styles.flex}>
                                <Pressable style={styleg.button} onPress={()=>this.setState({open: true,typePk: 1})}>
                                    <Text allowFontScaling={false} style={styleg.TextButton}>{this.state.start}</Text>
                                    <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                                </Pressable>
                            </View>
                            <Text allowFontScaling={false} style={styles.text}>
                                {t('to')}
                            </Text>
                            <View style={styles.flex}>
                                <Pressable style={styleg.button} onPress={()=>this.setState({open: true,typePk: 2})}>
                                    <Text allowFontScaling={false} style={styleg.TextButton}>{this.state.end}</Text>
                                    <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                                </Pressable>
                            </View>
                            <Text allowFontScaling={false} style={styles.button} onPress={this.clickSearch}>{t('inquire')}</Text>
                        </View>
                        
                        <View style={styles.echarts_con}>
                            {this.state.optionData.length == 0?
                                <Text allowFontScaling={false} style={styles.empty}>{t('noData')}</Text>:
                                <View style={styles.item}>
                                    <View style={styles.name}>
                                        <Text allowFontScaling={false} style={styles.nameText}>{t('lossData')}</Text>
                                    </View>
                                    <View style={styles.table}>
                                        <View style={styles.row}>
                                            <Text allowFontScaling={false} style={styles.th}>{t('returnCabinetName')}</Text>
                                            <Text allowFontScaling={false} style={styles.th}>{t('CBEC')}</Text>
                                            <Text allowFontScaling={false} style={styles.th}>{t('TTEC')}</Text>
                                            <Text allowFontScaling={false} style={styles.th}>{t('CASD')}</Text>
                                            <Text allowFontScaling={false} style={styles.th}>{t('PercentageDifference')}</Text>
                                        </View>
                                        {this.state.optionData.map((item: any,index: number)=>{
                                            return(
                                                <View key={index} style={[styles.row,index%2 == 0? styles.b1 : null]}>
                                                    <Text allowFontScaling={false} style={[styles.td,styles.c1]}>{item.name}</Text>
                                                    <Text allowFontScaling={false} style={styles.td}>{item.energy}</Text>
                                                    <Text allowFontScaling={false} style={styles.td}>{item.total}</Text>
                                                    <Text allowFontScaling={false} style={styles.td}>{item.residue}</Text>
                                                    <Text allowFontScaling={false} style={styles.td}>{item.percentage}</Text>
                                                </View>
                                            )
                                        })}
                                        
                                    </View>
                                </View>
                            }
                        </View>
                    </View>
                    {/* 日期选择 */}
                    {this.state.open ? 
                        this.state.typePk==1?
                        <PickerBut
                            pickerType={1}
                            date={this.state.start}
                            precisionType={1}
                            click={this.clickStart}
                            cancel={()=>this.setState({open: false})}
                        ></PickerBut>:
                        <PickerBut
                            pickerType={1}
                            date={this.state.end}
                            precisionType={1}
                            click={this.clickEnd}
                            cancel={()=>this.setState({open: false})}
                        ></PickerBut>
                    :''}
                </SafeAreaView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    tab:{
        position: 'relative',
        width: 120,
        height:30,
        paddingLeft:10,
        paddingRight:10,
        display: 'flex',
        flexDirection:'row',
        alignItems: 'center',
        overflow: 'hidden',
        borderStyle:'solid',
        borderColor:'#d9d9d9',
        borderWidth:1,
        borderRadius: 5,
    },
    ico:{
        position: 'absolute',
        top: 7,
        right: 5,
        width: 15,
        height: 15,
        overflow: 'hidden',
    },
    flexIs:{
        color: '#1890FF',
        borderStyle:'solid',
        borderBottomColor:'#1890FF',
        borderBottomWidth:2
    },
    query_head:{
        position: 'relative',
        width: '100%',
        height: 50,
        paddingRight:10,
        paddingLeft:10,
        display: 'flex',
        flexDirection:'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    timing:{
        flex:1,
        display:'flex',
        flexDirection:'row',
    },
    flex:{
        flex: 1,
    },
    button:{
        position: 'relative',
        width: 'auto',
        height: 35,
        lineHeight: 34,
        paddingLeft: 12,
        paddingRight: 12,
        fontSize: Fs/22,
        color: '#666666',
        borderStyle:'solid',
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 2,
        marginLeft: 7,
        overflow: 'hidden',
    },
    down:{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 40,
        height: 40,
        zIndex: 99,
        textAlign: 'center',
        overflow: 'hidden',
    },
    echarts_con:{
        position: 'absolute',
        top: 50,
        width: '100%',
        bottom: 0,
    },
    item:{
        position: 'relative',
        width: '100%',
        backgroundColor: '#fff',
        marginTop: 10,
        
    },
    name:{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        borderColor: '#E5E5E5',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        overflow: 'hidden',
        paddingRight: 10,
        paddingLeft: 15
    },
    nameText:{
        height: 40,
        lineHeight: 40,
        textAlignVertical: 'center',
        fontSize: Fs/22,
        textAlign: 'center',
    },
    echarts:{
        position: 'relative',
        width: '100%',
        padding: 10,
    },
    empty:{
        position: 'relative',
        width: '100%',
        paddingTop: 25,
        paddingBottom: 25,
        textAlign: 'center',
        fontSize: Fs/22,
        color: '#999999',
        overflow: 'hidden',
    },
    img:{
        width: 15,
        height: 15,
    },
    table:{
        position: 'relative',
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 5,
        paddingLeft: 5,
        overflow: 'hidden',
    },
    row:{
        display:'flex',
        flexDirection:'row',
        alignItems: 'center'
    },
    th:{
        flex:1,
        paddingBottom:7,
        paddingTop:7,
        paddingRight:3,
        paddingLeft:3,
        overflow: 'hidden',
        fontSize: Fs/22,
        color: '#666666',
        textAlign:'center'
    },
    td:{
        flex:1,
        paddingBottom:7,
        paddingTop:7,
        paddingRight:3,
        paddingLeft:3,
        overflow: 'hidden',
        fontSize: Fs/24,
        color: '#666666',
        textAlign:'center'
    },
    c1:{
        color: '#1890FF',
    },
    b1:{
        backgroundColor: "#F3FAFF",
    },
    w22:{
        flex:2,
        width: '22%'
    },
    w24:{
        flex:2,
        width: '24%'
    },
    text:{
        position: 'relative',
        height: 30,
        lineHeight: 30,
        textAlignVertical: 'center',
        paddingRight: 5,
        fontSize: Fs/24,
        color: '#666666',
        overflow: 'hidden',
    }
})

export default PowerAnalysis4