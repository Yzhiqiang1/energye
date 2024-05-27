import { DeviceEventEmitter, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
//方法
import styleg from '../../../indexCss'
import { Register } from '../../../utils/app'
import store from '../../../redux/store'
import { HttpService } from '../../../utils/http'
import util, { plusReduceData } from '../../../utils/util'
// 组件
import Navbar from '../../../component/navbar/navbar'
import MyCanvas from '../../../component/my-canvas/MyCanvas'
import MyLegend from '../../../component/my-legend/MyLegend'
import Loading from '../../../component/Loading/Loading'//加载动画组件
import Picker from '../../../component/Picker/Picker'//选择器
const api = require('../../../utils/api')

export class PowerTest7 extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
            LoginStatus: 1, //登录状态 默认未登录
            start: plusReduceData(util.nowDate(), 1, 5), //查询日期-5天内的日期
            end: util.nowDate(), //结束日期
            optionData: [{
                    name: "电流谐波",
                    state: true,
                    title: '',
                    legendData: [],
                    xAxisData: [],
                    yAxisName: "",
                    series: []
                },
                {
                    name: "电压谐波",
                    state: true,
                    title: '',
                    legendData: [],
                    xAxisData: [],
                    yAxisName: "",
                    series: []
                },
            ],
            params: [{ //封装组件传的值
                categorys: ["a", 'b', 'c'],
                harmonics: ['0']
            }, {
                categorys: ["a", 'b', 'c'],
                harmonics: ['0']
            }],

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
    check_ok=()=> {
        let that = this;
        let parameterGrou = store.getState().userReducer.parameterGroup; //获取选中组和设备信息
        if (parameterGrou.radioGroup.selectKey) {
            that.getTbaleHarmonicData(0);
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
    handleSelect=(e:any)=> {
        //通知首页更新
        DeviceEventEmitter.emit('refresh')

        this.getTbaleHarmonicData(0);
    }

    //开始日期
    clickStart=(e:any)=> {
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
    clickSearch=()=> {
        let that = this;
        let start = new Date(that.state.start).getTime();
        let end = new Date(that.state.end).getTime(); //结束日期
        if (start > end) {
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg:'开始日期不能大于结束日期'
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },3000)
            })
        } else {
            //查询逐日极值数据
            this.getTbaleHarmonicData(0);
        }

    }

    //获取自定义事件的值
    //abc相
    myevent=(e:any)=> {
        let that = this
        var params = e[0]
        let index = e[1]
        let data = this.state.params
        data[index].categorys = params
        that.setState({
            params: data
        }, () => {
            that.getTbaleHarmonicData(1, index);
        })
    }
    //谐波含量
    myevent2=(e:any)=> {
        let that = this
        let params2 = e[0] //选中的参数
        let index = e[1] //第几个表格
        let data = this.state.params
        data[index].harmonics = params2
        that.setState({
            params: data
        }, () => {
            that.getTbaleHarmonicData(1, index);
        })
    }

    //获取谐波检测数据
    getTbaleHarmonicData=(type:any,index:any=0)=> { 
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
        let userId = store.getState().userReducer.userId; //用户ID
        let deviceId = store.getState().userReducer.parameterGroup.radioGroup.selectKey; //获取设备ID----【单选】

        let start = that.state.start + " " + "00:00:00" //开始日期
        let end = that.state.end + " " + "23:59:59"; //结束日期


        let _index = type == 0 ? 0 : index; //默认查询下标0【电流】----主要为了自定义组件的abc项和谐波含量
        let _params = type == 0 ? that.state.params : that.state.params[_index]; //查询参数----主要为了自定义组件的abc项和谐波含量

        //初始图表值【加载页面时没有数据的返回空的图表，防止空白页面】
        let queryData = [{
            name: "电流谐波",
            state: true,
            title: '',
            legendData: [],
            xAxisData: [],
            yAxisName: "",
            series: []
        }, {
            name: "电压谐波",
            state: true,
            title: '',
            legendData: [],
            xAxisData: [],
            yAxisName: "",
            series: []
        }]
        //加载效果
        this.setState({
            msgType: 1,
            visible: true,
            LoadingMsg:'加载中...'
        });
        /**
         * 查询数据
         * **/
        getData();

        function getData() {
            let paramsArr = type == 0 ? _params[_index] : _params; //参数默认是电流,返回的都是单个数据
            let letter = [];
            let select = [];
            let labels = [];
            let labelKey:any = {
                "HRUan0": "THD_Uan",
                "HRUbn0": "THD_Ubn",
                "HRUcn0": "THD_Ucn",
                "HRIa0": "THD_Ia",
                "HRIb0": "THD_Ib",
                "HRIc0": "THD_Ic",
            }
            //拼接参数labels
            if (_index == 0) { //电流
                let type = "HRI";
                letter = paramsArr.categorys //电流相集合['a']
                select = paramsArr.harmonics //电流谐波含量集合['0']

                for (var i = 0; i < letter.length; i++) {
                    for (var j = 0; j < select.length; j++) {
                        var key = type + letter[i] + select[j];
                        if (labelKey[key]) {
                            key = labelKey[key];
                        }
                        labels.push(key);
                    }
                }
            } else { //电压
                let type = "HRU";
                letter = paramsArr.categorys //电压相集合['a']
                select = paramsArr.harmonics //电压谐波含量集合['0']
                for (var i = 0; i < letter.length; i++) {
                    for (var j = 0; j < select.length; j++) {
                        key = type + letter[i] + "n" + select[j];
                        if (labelKey[key]) {
                            key = labelKey[key];
                        }
                        labels.push(key);
                    }
                }
            }
            //拼接c处理后的 labels
            let a=labels.join(",")
            //查询数据
            HttpService.apiPost(api.getTbaleHarmonicData, {
                userId: userId,
                start: start,
                end: end,
                deviceId: deviceId,
                labels: a,
            }).then((res:any) => {
                if (res.flag == "00") {
                    let listData = res.data.list
                    //检测数据是否为空
                    if (listData.length > 0) {
                        let labelName = JSON.stringify(res.data.labelName).replace(/\[|\]|\"/g, "").split(",");
                        let open:any = {
                            name: _index == 0 ? "电流谐波" : "电压谐波",
                            state: true,
                            title: "",
                            legendData: labelName,
                            xAxisData: [],
                            yAxisName: "",
                            series: []
                        }
                        //定义series位置
                        let po:any = {};
                        //循环处理数据
                        for (let a = 0; a < labelName.length; a++) {
                            po[labelName[a]] = a;
                            open.series.push({
                                name: labelName[a],
                                type: 'line',
                                connectNulls: true,
                                data: []
                            });
                        }


                        for (let i = 0; i < listData.length; i++) {
                            let objData = listData[i];
                            // if (!open.title) open.title = date + " " + objData.devicName;
                            //图表时间
                            open.xAxisData.push(objData.time);
                            //整理数据
                            for (let x in po) {
                                if (objData[x + '_real']) {
                                    open.series[po[x]].data.push(objData[x + '_real']);
                                } else {
                                    open.series[po[x]].data.push("");
                                }
                            }
                        }
                        //更新数据
                        let optionData = that.state.optionData
                        optionData[_index] = open
                        that.setState({ 
                           optionData: optionData,
                        }, () => {
                            //校验全体查询还是单个       
                            if (type == 0 && _index < 1) {
                                _index++;
                                getData();
                            }
                            if (type == 0 && _index == 1) {
                                that.setState({
                                    visible: false
                                })
                            } else {
                                that.setState({
                                    visible: false
                                })
                            }
                        })
                        //数据为空
                    } else {
                        let optionData = that.state.optionData
                        optionData[_index] = queryData[_index]
                        that.setState({
                            optionData: optionData,
                        }, () => {
                            that.setState({
                                visible: false
                            })
                        })
                    }
                } else {
                    //关闭加载效果
                    that.setState({
                        visible: false
                    })
                    // //错误提示信息
                    that.setState({
                        msgType: 2,
                        visible: true,
                        LoadingMsg: res.msg,
                    },()=>{
                        setTimeout(()=>{
                            that.setState({
                                visible: false,
                            })
                        },2000)
                    })
                }
            }).catch((fail_message) => {
                //关闭加载效果
                that.setState({
                    visible: false
                })
                // //错误提示信息
                that.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg:  '请求出错',
                },()=>{
                    setTimeout(()=>{
                        that.setState({
                            visible: false,
                        })
                    },2000)
                })
            });
        }
    }
    render() {
        return (
        <View>
            {/* 引入自定义导航栏 */}
            <Navbar
                pageName={'谐波检测'}
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
                        <Picker
                            pickerType={1}
                            date={this.state.start}
                            precisionType={1}
                            click={this.clickStart}
                        ></Picker>
                    </View>
                    <Text style={styles.text}>
                        至
                    </Text>
                    <View style={styles.flex}>
                         <Picker
                            pickerType={1}
                            date={this.state.end}
                            precisionType={1}
                            click={this.clickEnd}
                        ></Picker>
                    </View>
                    <Text style={styles.button} onPress={this.clickSearch}>查询</Text>
                </View>

                
                <ScrollView style={styles.echarts_con}>
                    {this.state.optionData.map((item:any,index:number)=>{
                        return(
                            item.state == true?
                            <View style={styles.item} key={index}>
                                <Text style={styles.name}>
                                    {item.name}
                                </Text>
                                <MyLegend objData={this.state.params[index]} dataIndex={index} myevent={this.myevent} myevent2={this.myevent2}></MyLegend>
                                <View style={styles.echarts}>
                                    <MyCanvas objData={item}></MyCanvas>
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
    button:{
        position: 'relative',
        width: 'auto',
        height: 30,
        lineHeight: 30,
        textAlignVertical: 'center',
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
    text:{
        paddingRight: 5
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
        fontSize: 18,
        color: '#999999',
        overflow: 'hidden',
    },
})

export default PowerTest7