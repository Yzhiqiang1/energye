import { Dimensions, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import Navbar from '../../../component/navbar/navbar'
import util from '../../../utils/util'
import styleg from '../../../indexCss'
import { Register } from '../../../utils/app'
import { store } from '../../../redux/storer'
import { HttpService } from '../../../utils/http'
import MyCanvas from '../../../component/my-canvas/MyCanvas'
import Loading from '../../../component/Loading/Loading'//加载组件
import { PickerBut } from '../../../component/PickerBut/PickerBut'
import { t } from 'i18next'

const api = require('../../../utils/api')
const tool = require('../../../utils/tool.js');
const Fs = Dimensions.get('window').width*0.8

export class PowerTest6 extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
            top: 0, //内容区与顶部距离
            LoginStatus: 1, //登录状态 默认未登录

            _date: util.nowDate(), //日期选择
            //类型选择
            _typeArr: [t('all'), t('phaseVoltage'), t('lineVoltage')],
            _typeIn: 0,
            names: ["Uan,Ubn,Ucn,Uab,Ubc,Uca,Ia,Ib,Ic,P,Q,S,Pf,T", "Uan,Ubn,Ucn,Ia,Ib,Ic,P,Q,S,Pf,T", "Uab,Ubc,Uca,Ia,Ib,Ic,P,Q,S,Pf,T"],
            //数据项
            optionData: [],

            dateShow: false,
            // 弹出窗口
            msgType: 1,
            visible: false,//加载效果控制
            LoadingMsg:''// 加载效果文字
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
    check_ok=()=>{
        let that = this;
        let parameterGrou = store.getState().parameterGroup; //获取选中组和设备信息
        if (parameterGrou.radioGroup.selectKey) {
            that.getTbaleHourData();
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
    //头部组选中切换
    handleSelect=()=>{
        //查询电力运行日报
        this.getTbaleHourData();
    }
    //日期选择
    clickDate=(e:any)=>{
        this.setState({
            _date: e,
        })
    }
    //类型选择
    clickType=(e:any)=>{
        let that = this;
        that.setState({
            _typeIn: Number(e)
        })
    }
    //搜索
    clickSearch=()=>{
        //查询电力运行日报
        this.getTbaleHourData();
    }
    //获取电力运行日报
    getTbaleHourData=()=>{
        let that = this;
        let LoginStatus = that.state.LoginStatus; //登录状态
        if (LoginStatus == 1) {
            //错误提示信息
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: t('YANLIA')
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
        //处理设备ID
        // let ObjdeviceId = app.globalData.parameterGroup.multiGroup.selectKey;//多选
        let deviceId = store.getState().parameterGroup.radioGroup.selectKey; //获取设备ID -单选

        let date = that.state._date; //查询日期
        let names = that.state.names[that.state._typeIn]; //查询类型
        console.log(names, 'names');
        //定义图表数据
        let queryData:any = [];
        let queryIs:any = {};
        let seIs:any = {};
        //查询数据
        HttpService.apiPost(api.getTbaleHourData, {
            userId: userId,
            deviceIds: deviceId,
            date: date,
            names: names
        }).then((res:any) => {
            if (res.flag == "00") {
                let listData = res.data;
                console.log(res, 'res');
                //校验数据是否为空
                if (listData.length > 0) {
                    //循环处理数据
                    for (let i = 0; i < listData.length; i++) {
                        //传感器数据
                        let objData = listData[i];
                        let id = objData.id;
                        /********************
                         * 处理数据
                         * *******************/
                        //A B C 相电压(V)
                        if (objData.sensorLabel == "Uan" || objData.sensorLabel == "Ubn" || objData.sensorLabel == "Ucn") { //A B C 相电压(V)
                            if (queryIs['dya' + id] == undefined) {
                                queryIs['dya' + id] = queryData.length;
                                queryData.push({
                                    id: tool.randomNum(6),
                                    name: t('phaseVoltage'),
                                    state: true,
                                    title: date + ' ' + objData.name,
                                    legendData: [],
                                    xAxisData: [],
                                    xAxisDataIs: false,
                                    yAxisName: [""],
                                    series: []
                                });
                            }
                            //处理legendData数据
                            queryData[queryIs['dya' + id]].legendData.push(objData.parameterName);
                            //处理xAxisData 和 series 数据
                            if (objData.data) {
                                let arrData = objData.data;
                                for (let a = 0; a < 24; a++) {
                                    //定义对象
                                    if (seIs[objData.sensorLabel + id] == undefined) {
                                        seIs[objData.sensorLabel + id] = queryData[queryIs['dya' + id]].series.length;
                                        queryData[queryIs['dya' + id]].series.push({
                                            name: objData.parameterName,
                                            type: 'line',
                                            connectNulls: true,
                                            data: []
                                        })
                                    }
                                    let num = a < 10 ? 'h0' + a : 'h' + a;
                                    if (arrData[num] != undefined) {
                                        if (queryData[queryIs['dya' + id]].xAxisDataIs == false) {
                                            queryData[queryIs['dya' + id]].xAxisData.push(a + t('Time'))
                                        }
                                        queryData[queryIs['dya' + id]].series[seIs[objData.sensorLabel + id]].data.push(arrData[num])
                                    }
                                    if (a == 23) {
                                        queryData[queryIs['dya' + id]].xAxisDataIs = true;
                                    }
                                }
                            }
                            //AB BC CA 线电压(V)
                        } else if (objData.sensorLabel == "Uab" || objData.sensorLabel == "Ubc" || objData.sensorLabel == "Uca") { //AB BC CA 线电压(V)
                            if (queryIs['dyb' + id] == undefined) {
                                queryIs['dyb' + id] = queryData.length;
                                queryData.push({
                                    id: tool.randomNum(6),
                                    name: t('lineVoltage'),
                                    state: true,
                                    title: date + ' ' + objData.name,
                                    legendData: [],
                                    xAxisData: [],
                                    xAxisDataIs: false,
                                    yAxisName: [""],
                                    series: []
                                });
                            }
                            //处理legendData数据
                            queryData[queryIs['dyb' + id]].legendData.push(objData.parameterName);
                            //处理xAxisData 和 series 数据
                            if (objData.data) {
                                let arrData = objData.data;
                                for (let a = 0; a < 24; a++) {
                                    //定义对象
                                    if (seIs[objData.sensorLabel + id] == undefined) {
                                        seIs[objData.sensorLabel + id] = queryData[queryIs['dyb' + id]].series.length;
                                        queryData[queryIs['dyb' + id]].series.push({
                                            name: objData.parameterName,
                                            type: 'line',
                                            connectNulls: true,
                                            data: []
                                        })
                                    }
                                    let num = a < 10 ? 'h0' + a : 'h' + a;
                                    if (arrData[num] != undefined) {
                                        if (queryData[queryIs['dyb' + id]].xAxisDataIs == false) {
                                            queryData[queryIs['dyb' + id]].xAxisData.push(a + t('hour'))
                                        }
                                        queryData[queryIs['dyb' + id]].series[seIs[objData.sensorLabel + id]].data.push(arrData[num])
                                    }
                                    if (a == 23) {
                                        queryData[queryIs['dyb' + id]].xAxisDataIs = true;
                                    }
                                }
                            }
                            //A B C 相电流(A)
                        } else if (objData.sensorLabel == "Ia" || objData.sensorLabel == "Ib" || objData.sensorLabel == "Ic") { //A B C 相电流(A)
                            if (queryIs['dl' + id] == undefined) {
                                queryIs['dl' + id] = queryData.length;
                                // console.log(queryIs,'queryIs');
                                // console.log(queryIs['dl' + id],"queryIs['dl' + id'");
                                queryData.push({
                                    id: tool.randomNum(6),
                                    name: t('current'),
                                    state: true,
                                    title: date + ' ' + objData.name,
                                    legendData: [],
                                    xAxisData: [],
                                    xAxisDataIs: false,
                                    yAxisName: [""],
                                    series: []
                                });
                            }
                            //处理legendData数据
                            queryData[queryIs['dl' + id]].legendData.push(objData.parameterName);
                            //处理xAxisData 和 series 数据
                            if (objData.data) {
                                let arrData = objData.data;
                                for (let a = 0; a < 24; a++) {
                                    //定义对象---series
                                    if (seIs[objData.sensorLabel + id] == undefined) {
                                        seIs[objData.sensorLabel + id] = queryData[queryIs['dl' + id]].series.length;
                                        queryData[queryIs['dl' + id]].series.push({
                                            name: objData.parameterName,
                                            type: 'line',
                                            connectNulls: true,
                                            data: []
                                        })
                                    }
                                    let num = a < 10 ? 'h0' + a : 'h' + a;
                                    if (arrData[num] != undefined) {
                                        if (queryData[queryIs['dl' + id]].xAxisDataIs == false) {
                                            queryData[queryIs['dl' + id]].xAxisData.push(a + t('hour')) //xAxisData
                                        }
                                        queryData[queryIs['dl' + id]].series[seIs[objData.sensorLabel + id]].data.push(arrData[num]) //queryData.series.data
                                    }
                                    if (a == 23) {
                                        queryData[queryIs['dl' + id]].xAxisDataIs = true;
                                    }
                                }
                            }
                            //总有功功率(kW) 总无功功率(kVar) 总视在功率(kVA)  
                        } else if (objData.sensorLabel == "P" || objData.sensorLabel == "Q" || objData.sensorLabel == "S") { //总有功功率(kW) 总无功功率(kVar) 总视在功率(kVA)  
                            if (queryIs['gl' + id] == undefined) {
                                queryIs['gl' + id] = queryData.length;
                                queryData.push({
                                    id: tool.randomNum(6),
                                    name: t('power'),
                                    state: true,
                                    title: date + ' ' + objData.name,
                                    legendData: [],
                                    xAxisData: [],
                                    xAxisDataIs: false,
                                    yAxisName: [""],
                                    series: []
                                });
                            }
                            //处理legendData数据
                            queryData[queryIs['gl' + id]].legendData.push(objData.parameterName);
                            //处理xAxisData 和 series 数据
                            if (objData.data) {
                                let arrData = objData.data;
                                for (let a = 0; a < 24; a++) {
                                    //定义对象
                                    if (seIs[objData.sensorLabel + id] == undefined) {
                                        seIs[objData.sensorLabel + id] = queryData[queryIs['gl' + id]].series.length;
                                        queryData[queryIs['gl' + id]].series.push({
                                            name: objData.parameterName,
                                            type: 'line',
                                            connectNulls: true,
                                            data: []
                                        })
                                    }
                                    let num = a < 10 ? 'h0' + a : 'h' + a;
                                    if (arrData[num] != undefined) {
                                        if (queryData[queryIs['gl' + id]].xAxisDataIs == false) {
                                            queryData[queryIs['gl' + id]].xAxisData.push(a + t('hour'))
                                        }
                                        queryData[queryIs['gl' + id]].series[seIs[objData.sensorLabel + id]].data.push(arrData[num])
                                    }
                                    if (a == 23) {
                                        queryData[queryIs['gl' + id]].xAxisDataIs = true;
                                    }
                                }
                            }
                            //总功率因数
                        } else if (objData.sensorLabel == "Pf") { //总功率因数
                            if (queryIs['ys' + id] == undefined) {
                                queryIs['ys' + id] = queryData.length;
                                queryData.push({
                                    id: tool.randomNum(6),
                                    name: t('powerFactor'),
                                    state: true,
                                    title: date + ' ' + objData.name,
                                    legendData: [],
                                    xAxisData: [],
                                    xAxisDataIs: false,
                                    yAxisName: [""],
                                    series: []
                                });
                            }
                            //处理legendData数据
                            queryData[queryIs['ys' + id]].legendData.push(objData.parameterName);
                            //处理xAxisData 和 series 数据
                            if (objData.data) {
                                let arrData = objData.data;
                                for (let a = 0; a < 24; a++) {
                                    //定义对象
                                    if (seIs[objData.sensorLabel + id] == undefined) {
                                        seIs[objData.sensorLabel + id] = queryData[queryIs['ys' + id]].series.length;
                                        queryData[queryIs['ys' + id]].series.push({
                                            name: objData.parameterName,
                                            type: 'line',
                                            connectNulls: true,
                                            data: []
                                        })
                                    }
                                    let num = a < 10 ? 'h0' + a : 'h' + a;
                                    if (arrData[num] != undefined) {
                                        if (queryData[queryIs['ys' + id]].xAxisDataIs == false) {
                                            queryData[queryIs['ys' + id]].xAxisData.push(a + '时')
                                        }
                                        queryData[queryIs['ys' + id]].series[seIs[objData.sensorLabel + id]].data.push(arrData[num])
                                    }
                                    if (a == 23) {
                                        queryData[queryIs['ys' + id]].xAxisDataIs = true;
                                    }
                                }
                            }
                            //有功电能(kW·h)
                        } else if (objData.sensorLabel == "T") { //有功电能(kW·h)
                            if (queryIs['dn' + id] == undefined) {
                                queryIs['dn' + id] = queryData.length;
                                queryData.push({
                                    id: tool.randomNum(6),
                                    name: t('energy'),
                                    state: true,
                                    title: date + ' ' + objData.name,
                                    legendData: [],
                                    xAxisData: [],
                                    xAxisDataIs: false,
                                    yAxisName: [""],
                                    series: []
                                });
                            }
                            //处理legendData数据
                            queryData[queryIs['dn' + id]].legendData.push(objData.parameterName);
                            //处理xAxisData 和 series 数据
                            if (objData.data) {
                                let arrData = objData.data;
                                for (let a = 0; a < 24; a++) {
                                    //定义对象
                                    if (seIs[objData.sensorLabel + id] == undefined) {
                                        seIs[objData.sensorLabel + id] = queryData[queryIs['dn' + id]].series.length;
                                        queryData[queryIs['dn' + id]].series.push({
                                            name: objData.parameterName,
                                            type: 'line',
                                            connectNulls: true,
                                            data: []
                                        })
                                    }
                                    let num = a < 10 ? 'h0' + a : 'h' + a;
                                    if (arrData[num] != undefined) {
                                        if (queryData[queryIs['dn' + id]].xAxisDataIs == false) {
                                            queryData[queryIs['dn' + id]].xAxisData.push(a + t('hour'))
                                        }
                                        queryData[queryIs['dn' + id]].series[seIs[objData.sensorLabel + id]].data.push(arrData[num])
                                    }
                                    if (a == 23) {
                                        queryData[queryIs['dn' + id]].xAxisDataIs = true;
                                    }
                                }
                            }
                        }
                    }
                    console.log(queryData, 'queryData');
                    //更新数据
                    that.setState({
                        optionData: queryData,
                    }, () => {
                        //关闭加载效果
                        this.setState({
                            visible: false
                        })
                    })
                } else {
                    that.setState({
                        optionData: [],
                    }, () => {
                        //关闭加载效果
                        this.setState({
                            visible: false
                        })
                    })
                }
            } else {
                //关闭加载效果
                this.setState({
                    visible: false
                })
                //错误提示信息
                this.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg: res.msg,
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
                visible: false
            })
            //错误提示信息
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: fail_message,
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
            {/* 弹窗效果 */}
            <Loading 
                type={this.state.msgType} 
                visible={this.state.visible} 
                LoadingMsg={this.state.LoadingMsg}>
            </Loading>
            <SafeAreaView style={{flex: 1}}>
                {/* 引入自定义导航栏 */}
                <Navbar 
                    pageName={t('Dropo')}
                    showBack={true}
                    showHome={false}
                    isCheck={2}
                    LoginStatus={this.state.LoginStatus}
                    props={this.props}
                    handleSelect={this.handleSelect}
                >
                </Navbar>
                {/* 内容区 */}
                <View style={styleg.container}>
                    <View style={styles.query_head}>
                        <View style={{flex:2}}>
                            <Pressable style={styleg.button} onPress={()=>this.setState({open: true, typePk: 1})}>
                                <Text allowFontScaling={false} style={styleg.TextButton}>{this.state._date}</Text>
                                <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                            </Pressable>
                        </View>
                        <View style={styles.flex}>

                            <Pressable style={styleg.button} onPress={()=>this.setState({open: true, typePk: 2})}>
                                <Text allowFontScaling={false} style={styleg.TextButton}>{this.state._typeArr[this.state._typeIn]}</Text>
                                <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                            </Pressable>
                        </View>
                        <Text allowFontScaling={false} style={styles.button} onPress={this.clickSearch}>{t('inquire')}</Text>
                    </View>
                    <ScrollView style={styles.echarts_con}>
                        {this.state.optionData.length == 0?
                            <Text allowFontScaling={false} style={styles.empty}>{t('noData')}</Text>:''
                        }
                        {this.state.optionData.map((item:any,index:any)=>{
                            return(
                                item.state == true?
                                <View style={styles.item} key={index}>
                                    <Text allowFontScaling={false} style={styles.name} >
                                        {item.name}
                                    </Text>
                                    <View style={styles.echarts}>
                                        <MyCanvas objData={item}></MyCanvas>
                                    </View>
                                </View>:''
                            )
                        })}
                    </ScrollView>
                </View>
                {/* 日期选择 */}
                {this.state.open?
                    this.state.typePk==1?
                        <PickerBut
                            pickerType={1}
                            date={this.state._date}
                            precisionType={1}
                            click={this.clickDate}
                            cancel={()=>this.setState({open: false})}
                        ></PickerBut>:
                        <PickerBut
                            pickerType={4}
                            dataSwitch={this.state._typeArr}
                            dataSwitchIn={this.state._typeIn}
                            click={this.clickType}
                            cancel={()=>this.setState({open: false})}
                        ></PickerBut>
                    :''
                }
            </SafeAreaView>
        </View>
    )
  }
}

const styles = StyleSheet.create({
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
    flex:{
        flex: 1,
    },
    button:{
        position: 'relative',
        width: 'auto',
        height: 35,
        lineHeight: 35,
        textAlignVertical: 'center',
        paddingLeft: 12,
        paddingRight: 12,
        fontSize: Fs/22,
        color: '#666666',
        borderStyle:'solid',
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 2,
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
        width: '100%',
        height: 40,
        lineHeight: 40,
        fontSize: Fs/22,
        textAlign: 'center',
        borderColor: '#E5E5E5',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        overflow: 'hidden',
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
})

export default PowerTest6