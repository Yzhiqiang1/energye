import { DeviceEventEmitter, Dimensions, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import store from '../../../redux/store'
import { Register } from '../../../utils/app';
import Navbar from '../../../component/navbar/navbar';
import styleg from '../../../indexCss';
import MyCanvas from '../../../component/my-canvas/MyCanvas';
import { HttpService } from '../../../utils/http';
import Loading from '../../../component/Loading/Loading'//加载组件
import Picker from '../../../component/Picker/Picker';
import PickerBut from '../../../component/PickerBut/PickerBut';
const util = require('../../../utils/util.js');
const api = require('../../../utils/api')
const { plusReduceData } = require('../../../utils/util.js');
const Fs = Dimensions.get('window').width*0.8

export class PowerTest2 extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
            top: 0, //内容区与顶部距离
            LoginStatus: 1, //登录状态,默认未登录

            start: plusReduceData(util.nowDate(), 1, 5), //查询日期
            end: util.nowDate(), //结束日期
            //数据项
            optionData: [],
            // 弹出窗口
            msgType: 1,
            visible: false,//加载效果控制
            LoadingMsg:'',// 加载效果文字
            //日期选择
            open: false,
            typePk: 1
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
    check_ok(){
        let that = this;
        let parameterGrou = store.getState().userReducer.parameterGroup; //获取选中组和设备信息
        if (parameterGrou.radioGroup.selectKey != '') {
            that.getExtreme();
        } else {
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
     handleSelect=(e:any)=>{
        //通知首页更新
        DeviceEventEmitter.emit('refresh')
        //查询逐日极值数据
        this.getExtreme();
    }
    //开始日期
    clickStart=(e:any)=>{
        this.setState({
            start: e,
        })
    }
    //结束日期
    clickEnd=(e:any)=> {
        this.setState({
            end: e,
        })
    }
    //搜索
    clickSearch=()=>{
        let that = this;
        let start = new Date(that.state.start).getTime();
        let end = new Date(that.state.end).getTime(); //结束日期
        if (start > end) {
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg:'开始日期不能大于结束日期!'
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
        } else {
            //查询逐日极值数据
            this.getExtreme();
        }
    }
    //获取逐日极值数据
    getExtreme=()=>{
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
        let deviceId = store.getState().userReducer.parameterGroup.radioGroup.selectKey; //获取设备ID
        let start = that.state.start //开始日期
        let end = that.state.end; //结束日期
        //定义图表数据
        let queryData:any = [];
        //查询数据
        HttpService.apiPost(api.getExtreme, {
            userId: userId,
            deviceId: deviceId,
            start: start,
            end: end,
            names: "P,Pa,Pb,Pc,Ia,Ib,Ic,Uan,Ubn,Ucn,Uab,Ubc,Uca,Fr,Pf,Q,S,IUnB,UUnB"
        }).then((res:any) => {
            if (res.flag == "00") {
                let listData = res.data;
                //校验数据是否为空
                if (listData.length > 0) {
                    //循环数据
                    for (let i = 0; i < listData.length; i++) {
                        if(listData[i].data){
                        let objData = listData[i]; //传感器数据
                        let name = objData.sensorLabel; //传感器标签
                        let querylist:any = {
                            name: "",
                            state: true,
                            title: objData.deviceName,
                            legendData: ["最大值", "最小值", "平均值"],
                            xAxisData: [],
                            yAxisName: ["单位(" + objData.sensorUnit + ")"],
                            series: [{
                                name: "最大值",
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
                            }, {
                                name: "最小值",
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
                            }, {
                                name: "平均值",
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
                            //有功功率
                        if (name == 'P' || name == 'Pa' || name == 'Pb' || name == 'Pc') {
                            querylist.name = name == 'P' ? "总有功功率" : name == 'Pa' ? "A相有功功率" : name == 'Pb' ? "B相有功功率" : "C相有功功率";
                            //电流
                        } else if (name == 'Ia' || name == 'Ib' || name == 'Ic') {
                            querylist.name = name == 'Ia' ? "A相电流" : name == 'Ib' ? "B相电流" : "C相电流";
                            //相电压
                        } else if (name == 'Uan' || name == 'Ubn' || name == 'Ucn') {
                            querylist.name = name == 'Uan' ? "A相电压" : name == 'Ubn' ? "B相电压" : "C相电压";
                            //线电压
                        } else if (name == 'Uab' || name == 'Ubc' || name == 'Uca') {
                            querylist.name = name == 'Uab' ? "A线电压" : name == 'Ubc' ? "B线电压" : "C线电压";
                            //频率
                        } else if (name == 'Fr') {
                            querylist.name = "频率";
                            //功率因素
                        } else if (name == 'Pf') {
                            querylist.name = "功率因素";
                            //无功功率
                        } else if (name == 'Q') {
                            querylist.name = "无功功率";
                            //视在功率
                        } else if (name == 'S') {
                            querylist.name = "视在功率";
                        } else if (name == 'IUnB' || name == 'UUnB') {
                            querylist.name = name == 'IUnB' ? "电流不平衡度" : "电压不平衡度";
                        }
                        // //处理数据数值
                        let objList:any = objData.data;
                        for (let a = 0; a < objList.length; a++) {
                            //校验数据是否为空
                            if (objList[a].time) {
                                querylist.series[0].data.push(objList[a].max ? objList[a].max : ""); //最大值
                                querylist.series[1].data.push(objList[a].min ? objList[a].min : ""); //最小值
                                querylist.series[2].data.push(objList[a].mean ? objList[a].mean : ""); //平均值
                                querylist.xAxisData.push(objList[a].time);
                            }
                        }
                        queryData.unshift(querylist);
                        }
                    }
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
                visible: false
            })
            // //错误提示信息
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: '请求出错'
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
        });
    }
    openPicker=(type: number)=>{
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
                        pageName={'逐日极数据'}
                        showBack={true}
                        showHome={false}
                        isCheck={2}
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
                                    date={this.state.start}
                                    precisionType={1}
                                    click={this.clickStart}
                                ></Picker> */}
                                <Pressable style={styleg.button} onPress={()=>this.openPicker(1)}>
                                    <Text allowFontScaling={false} style={styleg.TextButton}>{this.state.start}</Text>
                                    <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                                </Pressable>
                            </View>
                            <Text allowFontScaling={false} style={styles.text}>
                                至
                            </Text>
                            <View style={styles.flex}>
                                {/* <Picker
                                    pickerType={1}
                                    date={this.state.end}
                                    precisionType={1}
                                    click={this.clickEnd}
                                ></Picker> */}
                                <Pressable style={styleg.button} onPress={()=>this.openPicker(2)}>
                                    <Text allowFontScaling={false} style={styleg.TextButton}>{this.state.end}</Text>
                                    <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                                </Pressable>
                            </View>
                            <Text allowFontScaling={false} style={styles.button} onPress={this.clickSearch}>查询</Text>
                        </View>
                        
                        <ScrollView style={styles.echarts_con}>
                            {this.state.optionData.length == 0?
                                <Text allowFontScaling={false} style={styles.empty}>暂无数据</Text>:''
                            }
                            {this.state.optionData.map((data:any,index:number)=>{
                                return(
                                    data.state == true&&index<10?
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
                    {/* 日期选择器 */}
                    {this.state.open?
                        this.state.typePk==1?
                            <PickerBut
                                pickerType={1}
                                date={this.state.start}
                                precisionType={1}
                                click={this.clickStart}
                                cancel={()=>this.setState({open: false})}
                            ></PickerBut>
                            :
                            <PickerBut
                                pickerType={1}
                                date={this.state.end}
                                precisionType={1}
                                click={this.clickEnd}
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

    text:{
        fontSize: Fs/24,
        marginRight: 5,
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

export default PowerTest2