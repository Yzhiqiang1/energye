import { DeviceEventEmitter, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import {Register} from '../../../utils/app'
import store from '../../../redux/store'
import Navbar from '../../../component/navbar/navbar'
import styleg from '../../../indexCss'
import { HttpService } from '../../../utils/http'
import MyCanvas from '../../../component/my-canvas/MyCanvas'
import Loading from '../../../component/Loading/Loading'//加载组件
import Picker from '../../../component/Picker/Picker'//选择器
const util = require('../../../utils/util')
const api = require('../../../utils/api')//引入API文件
export class PowerTest1 extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
            top: 0, //内容区与顶部距离
            LoginStatus: 1, //登录状态默认未登录
    
            _date: util.nowDate(), //查询日期
            //数据项
            optionData: [],

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
                // 向自定义导航传递登录状态
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
        if (parameterGrou.radioGroup.selectKey) {
            that.getCharData();
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
    handleSelect=(e: any)=> {
        // 通知首页更新
        DeviceEventEmitter.emit('refresh')
        //查询日原数据
        this.getCharData();
    }
    //日期选择
    clickDate=(e:any)=>{
        this.setState({
            _date: e,
        })
    }
    //上一日
    preDate=()=>{
        let that = this;
        that.setState({
            _date: util.plusReduceData(this.state._date, 1)
        }, () => {
            //查询日原数据
            that.getCharData();
        })
    }
    //下一日
    nextData = () => {
        let that = this;
        that.setState({
            _date: util.plusReduceData(this.state._date, 2)
        }, () => {
            //查询日原数据
            that.getCharData();
        })
    }
    //查询
    getCharData=()=>{
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
        }) //加载效果
        let userId = store.getState().userReducer.userId; //用户ID
        let deviceId = store.getState().userReducer.parameterGroup.radioGroup.selectKey; //获取设备ID
        let date = that.state._date; //查询日期
        //定义图表数据
        let queryData:any = [{
                name: "有功功率",
                state: false,
                title: '',
                legendData: [],
                xAxisData: [],
                yAxisName: "",
                series: []
            },
            {
                name: "电流",
                state: false,
                title: '',
                legendData: [],
                xAxisData: [],
                yAxisName: "",
                series: []
            },
            {
                name: "相电压",
                state: false,
                title: '',
                legendData: [],
                xAxisData: [],
                yAxisName: "",
                series: []
            },
            {
                name: "线电压",
                state: false,
                title: '',
                legendData: [],
                xAxisData: [],
                yAxisName: "",
                series: []
            },
            {
                name: "频率",
                state: false,
                title: '',
                legendData: [],
                xAxisData: [],
                yAxisName: "",
                series: []
            },
            {
                name: "功率因素",
                state: false,
                title: '',
                legendData: [],
                xAxisData: [],
                yAxisName: "",
                series: []
            },
            {
                name: "无功功率",
                state: false,
                title: '',
                legendData: [],
                xAxisData: [],
                yAxisName: "",
                series: []
            },
            {
                name: "视在功率",
                state: false,
                title: '',
                legendData: [],
                xAxisData: [],
                yAxisName: "",
                series: []
            },
            {
                name: "三相不平衡度",
                state: false,
                title: '',
                legendData: [],
                xAxisData: [],
                yAxisName: "",
                series: []
            }
        ];
        //查询数据
        HttpService.apiPost(api.getCharData, {
            userId: userId,
            deviceId: deviceId,
            date: date,
            names: "P,Pa,Pb,Pc,Ia,Ib,Ic,Uan,Ubn,Ucn,Uab,Ubc,Uca,Fr,Pf,Q,S,IUnB,UUnB"
        }).then((res:any) => {
            if (res.flag == "00") {
                let listData = res.data.list;
                //校验数据是否为空
                if (listData.length > 0) {
                    //循环数据
                    for (let i = 0; i < listData.length; i++) {
                        let objData = listData[i];
                        let name = objData.name;
                        let index: any = "no";
                        let newName: string = '';
                        //有功功率
                        if (name == 'P' || name == 'Pa' || name == 'Pb' || name == 'Pc') {
                            newName = name == 'P' ? "总有功功率" : name == 'Pa' ? "A相" : name == 'Pb' ? "B相" : "C相";
                            index = 0;
                            //电流
                        } else if (name == 'Ia' || name == 'Ib' || name == 'Ic') {
                            newName = name == 'Ia' ? "A相电流" : name == 'Ib' ? "B相电流" : "C相电流";
                            index = 1;
                            //相电压
                        } else if (name == 'Uan' || name == 'Ubn' || name == 'Ucn') {
                            newName = name == 'Uan' ? "A相电压" : name == 'Ubn' ? "B相电压" : "C相电压";
                            index = 2;
                            //线电压
                        } else if (name == 'Uab' || name == 'Ubc' || name == 'Uca') {
                            newName = name == 'Uab' ? "A线电压" : name == 'Ubc' ? "B线电压" : "C线电压";
                            index = 3;
                            //频率
                        } else if (name == 'Fr') {
                            newName = "频率";
                            index = 4;
                            //功率因素
                        } else if (name == 'Pf') {
                            newName = "功率因素";
                            index = 5;
                            //无功功率
                        } else if (name == 'Q') {
                            newName = "无功功率";
                            index = 6;
                            //视在功率
                        } else if (name == 'S') {
                            newName = "视在功率";
                            index = 7;
                        } else if (name == 'IUnB' || name == 'UUnB') {
                            newName = name == 'IUnB' ? "电流不平衡度" : "电压不平衡度";
                            index = 8;
                        }
                        //更新数据
                        if (index != "no") {
                            queryData[index].state = true;
                            queryData[index].title = date + ' ' + res.data.name;
                            queryData[index].legendData.push(newName);
                            queryData[index].xAxisData = res.data.xAxis;
                            queryData[index].yAxisName = "单位(" + objData.unit + ")";
                            queryData[index].series.push({
                                name: newName,
                                type: 'line',
                                connectNulls: true,
                                markPoint: {
                                    data: [{
                                            type: 'max',
                                            name: 'Max'
                                        },
                                        {
                                            type: 'min',
                                            name: 'Min'
                                        }
                                    ]
                                },
                                data: objData.data
                            });
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
                visible: false
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
    setIsVisible=(e:boolean)=>{
        this.setState({
            isVisible: e
        })
    }
    render() {
        return (
        <View>
            {/* 引入自定义导航栏 */}
            <Navbar 
                pageName={'日原数据'}
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
                        <Picker
                            pickerType={1}
                            date={this.state._date}
                            precisionType={1}
                            click={this.clickDate}
                        ></Picker>
                    </View>
                    <Text style={styles.button} onPress={this.getCharData}>查询</Text>
                    <Text style={[styles.button,styles.buttonC1]}  onPress={this.preDate}>上一日</Text>
                    <Text style={styles.button}  onPress={this.nextData}>下一日</Text>
                </View>
                <ScrollView style={styles.echarts_con}>
                    {this.state.optionData.length == 0?
                        <Text style={styles.empty}>暂无数据</Text>:''
                    }
                    {this.state.optionData.map((data:any, index:any) => {
                        return(
                            data.state == true?
                            <View key={index} style={styles.item}>
                                <Text style={styles.name}>
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
            {/* 弹窗效果 */}
            <Loading 
                type={this.state.msgType} 
                visible={this.state.visible} 
                LoadingMsg={this.state.LoadingMsg}>
            </Loading>
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
    choice_date:{
        position: 'relative',
        width: '100%',
        height: 30,
        lineHeight: 34,
        paddingLeft:10,
        fontSize: 26,
        color: '#666666',
        borderStyle:'solid',
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 5,
        paddingRight: 25,
        overflow: 'hidden',
    },
    button:{
        position: 'relative',
        width: 'auto',
        height: 30,
        lineHeight: 34,
        paddingLeft: 12,
        paddingRight: 12,
        fontSize: 18,
        color: '#666666',
        borderStyle:'solid',
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 5,
        marginLeft: 7,
        overflow: 'hidden',
    },
    buttonC1:{
        backgroundColor: '#1890FF',
        color: '#fff',
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
        fontSize: 18,
        textAlign: 'center',
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 0.3,
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
        fontSize: 18,
        color: '#999999',
        overflow: 'hidden',
    },
    pickerStyle:{
        width: Dimensions.get('window').width,
        height: 200,
        backgroundColor:'white',
        borderRadius: 10
    },

})

export default PowerTest1