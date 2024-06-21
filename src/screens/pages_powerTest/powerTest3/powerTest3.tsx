import { Dimensions, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import Navbar from '../../../component/navbar/navbar'
import styleg from '../../../indexCss';
import MyCanvas from '../../../component/my-canvas/MyCanvas';
import store from '../../../redux/store'
import { Register } from '../../../utils/app';
import { HttpService } from '../../../utils/http';
import { Picker } from '../../../component/Picker/Picker'//选择器
import { PickerBut } from '../../../component/PickerBut/PickerBut'//选择器
import Loading from '../../../component/Loading/Loading'//加载组件
let util = require('../../../utils/util.js');
const api = require('../../../utils/api')
const Fs = Dimensions.get('window').width*0.8

export class PowerTest3 extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
            top: 0, //内容区与顶部距离
            LoginStatus: 1, //登录状态 默认未登录

            _date: util.nowDate(), //日期选择
            //时间选择
            _timeArr: ["一分钟", "五分钟", "十五分钟", "半小时", "一个小时"],
            _timeIn: 3,
            //数据项
            optionData: [],

            datetShow: false,
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
    /************************************
     *     校验登录通过
     * *****************************/
    check_ok=()=>{
        let that = this;
        let parameterGrou = store.getState().userReducer.parameterGroup; //获取选中组和设备信息
        if (parameterGrou.multiGroup.selectKey) {
            //查询电量数据
            that.getTbaleData();
        } else {
            //信息提示
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg:'获取参数失败！'
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
    handleSelect=()=>{
        //查询电量数据
        this.getTbaleData();
    }
    //日期选择
    clickDate=(e:any)=>{
        this.setState({
            _date: e,
        })
    }
    //时间选择
    clickTime=(e:any)=>{
        this.setState({
            _timeIn: Number(e)
        })
    }
    //搜索
    clickSearch=()=>{
        //查询电量数据
        this.getTbaleData();
    }
    // 获取电量数据
    getTbaleData=()=>{
        let that = this;
        let LoginStatus = that.state.LoginStatus; //登录状态
        if (LoginStatus == 1) {
            //错误提示信息
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg:'您还未登录,无法查询数据！'
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
            LoadingMsg:'加载中...'
        })//加载效果
        let userId = store.getState().userReducer.userId; //用户ID
        //处理设备ID
        let ObjdeviceId = store.getState().userReducer.parameterGroup.multiGroup.selectKey;
        let strdeviceId = "";
        for (let i in ObjdeviceId) {
            strdeviceId += strdeviceId == "" ? ObjdeviceId[i] : ',' + ObjdeviceId[i];
        }
        let date = that.state._date; //查询日期
        let interval = that.state._timeIn == 0 ? 1 : that.state._timeIn == 1 ? 5 : that.state._timeIn == 2 ? 15 : that.state._timeIn == 3 ? 30 : 60; //查询时间
        //定义图表数据
        let queryData:any = [];
        let queryIs:any = {};
        //查询数据
        HttpService.apiPost(api.getTbaleData, {
            userId: userId,
            deviceIds: strdeviceId,
            date: date,
            interval: interval,
            names: "Epi"
        }).then((res:any) => {
            console.log(res, 78777778);
            if (res.flag == "00") {
                let listData = res.data;
                //校验数据是否为空
                if (listData.length > 0) {
                    //循环处理数据
                    for (let i = 0; i < listData.length; i++) {
                        let objData = listData[i]; //传感器数据
                        //初始化变量
                        if (queryIs[objData.id] == undefined) {
                            let querylist = {
                                name: "用电总量",
                                state: true,
                                title: date + ' ' + objData.deviceName,
                                legendData: ["Epi"],
                                xAxisData: [],
                                yAxisName: ["单位(" + objData.Epi_unit + ")"],
                                series: [{
                                    name: "Epi",
                                    type: 'line',
                                    connectNulls: true,
                                    markPoint: {
                                        data: [{
                                            type: 'max',
                                            name: 'Max'
                                        }, {
                                            type: 'min',
                                            name: 'Min'
                                        }]
                                    },
                                    data: []
                                }]
                            };
                            //更新数据
                            queryIs[objData.id] = queryData.length;
                            queryData.push(querylist);
                        }
                        //校验数据是否为空
                        if (objData.time != '') {
                            queryData[queryIs[objData.id]].xAxisData.push(objData.time);
                            queryData[queryIs[objData.id]].series[0].data.push(objData.Epi);
                        }
                    }
                    // console.log(queryData,6455465);
                    that.setState({
                        optionData: queryData,
                    }, () => {
                        //关闭加载效果
                        this.setState({
                            visible: false
                        })
                    })
                    console.log(that.state.optionData, 777777);
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
            // //错误提示信息
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

    openPicker=(type:any)=>{
        console.log(1);
        
        this.setState({
            open: true,
            typePk: type
        })
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
                        pageName={'电力运作报表'}
                        showBack={true}
                        showHome={false}
                        isCheck={3}
                        LoginStatus={this.state.LoginStatus}
                        props={this.props}
                        handleSelect={this.handleSelect}
                    ></Navbar>
                    {/* 内容区 */}
                    <View style={styleg.container}>
                        <View style={styles.query_head}>
                            <View style={styles.flex}>
                                {/* <Picker
                                    pickerType={1}
                                    date={this.state._date}
                                    precisionType={1}
                                    click={this.clickDate}
                                ></Picker> */}
                                <Pressable style={styleg.button} onPress={()=>this.openPicker(1)}>
                                    <Text allowFontScaling={false} style={styleg.TextButton}>{this.state._date}</Text>
                                    <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                                </Pressable>
                            </View>
                            {/* <Picker
                                pickerType={4}
                                dataSwitch={this.state._timeArr}
                                dataSwitchIn={this.state._timeIn}
                                click={this.clickTime}
                                >
                            </Picker> */}
                            <Pressable style={styleg.button} onPress={()=>this.openPicker(2)}>
                                <Text allowFontScaling={false} style={styleg.TextButton}>{this.state._timeArr[this.state._timeIn]}</Text>
                                <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                            </Pressable>
                            <Text allowFontScaling={false} style={styles.button} onPress={this.clickSearch}>查询</Text>
                        </View>
                        <ScrollView style={styles.echarts_con}>
                            {this.state.optionData == 0?
                                <Text allowFontScaling={false} style={styles.empty}>暂无数据</Text>:""
                            }
                            {this.state.optionData.map((data:any,index:number)=>{
                                return(
                                    data.state == true ? 
                                    <View key={index} style={styles.item}>
                                        <Text allowFontScaling={false} style={styles.name}>
                                            {data.name}
                                        </Text>
                                        <View style={styles.echarts}>
                                            <MyCanvas objData={data}></MyCanvas>
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
                        ></PickerBut>
                        :
                        <PickerBut
                            pickerType={4}
                            dataSwitch={this.state._timeArr}
                            dataSwitchIn={this.state._timeIn}
                            click={this.clickTime}
                            cancel={()=>this.setState({open: false})}
                        ></PickerBut>
                    :''}
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
        height: 30,
        lineHeight: 30,
        textAlignVertical: 'center',
        paddingLeft: 12,
        paddingRight: 12,
        fontSize: Fs/22,
        color: '#666666',
        borderStyle:'solid',
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 5,
        marginLeft: 7,
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
    picker:{
        position: 'relative',
        width:100,
        height:30,
        display:'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderStyle:'solid',
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 5,
        marginLeft: 5,
        overflow: 'hidden',
    },
    pickerIco:{
        position: 'absolute',
        top: 7,
        left: 80,
        width: 15,
        height: 15,
        overflow: 'hidden',
    }
})

export default PowerTest3