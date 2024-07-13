import { Dimensions, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import Navbar from '../../../component/navbar/navbar'
import styleg from '../../../indexCss'
import MyCanvas from '../../../component/my-canvas/MyCanvas'
import util from '../../../utils/util'
import { Register } from '../../../utils/app'
import { store } from '../../../redux/storer'
import tool from '../../../utils/tool'
import { HttpService } from '../../../utils/http'
import Loading from '../../../component/Loading/Loading'
import PickerBut from '../../../component/PickerBut/PickerBut'
const api = require('../../../utils/api')
const Fs = Dimensions.get('window').width*0.8

export class WaterAnalysis1 extends Component<any,any> {
    _s = util.oneData(3) < 10 ? '0' + util.oneData(3) : util.oneData(3);
    constructor(props:any){
        super(props)
        this.state={
            LoginStatus: 1, //登录状态 默认未登录

            //日月年切换
            dataSwitchIn: 0,
    
            //年月日时
            start: util.nowDate(), //开始时间
            start_HH: "00",
    
            startDate: new Date(util.oneData(), util.oneData(5), util.oneData(4)).getTime(), //时间戳
           
            end: util.nowDate(), //结束日期
            end_HH: this._s + '',
            // end_HH_mm:_s+":"+_f,
            endDate: new Date(util.oneData(), util.oneData(5), util.oneData(4), util.oneData(3), util.oneData(2)).getTime(), //时间戳
    
            //年月-日期选择
            _month: util.nowDate(1),
            //年月-日选择
            _monthTime: [
                util.mGetDate(util.oneData(6), (util.oneData(5) + 1)),
                util.mGetDate(util.oneData(6), (util.oneData(5) + 1)),
            ],
            _monthTimeIn: [0, util.oneData(4) - 1],
            //年-日期选择
            _year: util.nowDate(2),
            _yearTime: [
                ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
                ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
            ],
            _yearTimeIn: [0, util.oneData(5)],
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
            if (parameterGrou.multiGroup.selectKey) {
                //查询数据
                that.getData();
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
        handleSelect=(e:any)=>{
            //查询电力运行日报
            this.getData();
        }
        //日月年 选项卡切换
        clickDataSwitch=(e:any)=>{
            let that = this;
            let dataSwitchIn = that.state.dataSwitchIn;
            if (dataSwitchIn != e) {
                that.setState({
                    dataSwitchIn: e
                })
            }
        }
    
    
        /********
         * 年月日 时 处理
         * *********/
        //开始日期时间
        startConfirm=(e:any)=>{
            this.setState({
                start: e.slice(0, 10),
                start_HH: e.slice(11, 13),
            })
        }
        //结束日期时间
        endConfirm=(e:any)=>{
            this.setState({
                end: e.slice(0, 10),
                end_HH: e.slice(11, 13),
            })
        }
         /********
     * 年月 日期时间处理
     * *********/
    _monthClick=(e:any)=>{
        let arrVal = e.split('-');
        this.setState({
            _month: e,
            _monthTime: [util.mGetDate(arrVal[0], arrVal[1]), util.mGetDate(arrVal[0], arrVal[1])],
            _monthTimeIn: [0, util.oneData(4) - 1],
        })
    }
    //日选择
    _monthTimeClick=(e:any)=>{
        let that = this;
        let minTime = that.state._monthTime[0][e[0]];
        let maxTime = that.state._monthTime[1][e[1]];
        if (minTime > maxTime) {
            //错误提示信息
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: '开始日期不得大于结束日期！'
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
            return false;
        }
        that.setState({
            _monthTimeIn: e
        })
    }
    /********
     * 年月 日期时间处理
     * *********/
    _yearClick=(e:any)=>{
        this.setState({
            _year: e
        })
    }
    //日选择
    _yearTimeClick=(e:any)=>{
        let that = this;
        let minTime = that.state._yearTime[0][e[0]];
        let maxTime = that.state._yearTime[1][e[1]];
        if (minTime > maxTime) {
            //错误提示信息
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: '开始月份不得大于结束月份！'
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
            return false;
        }
        that.setState({
            _yearTimeIn: e
        })
    }
    //搜索
    clickSearch=()=>{
        //查询电力运行日报
        this.getData();
    }
    //获取电力运行日报
    getData=()=>{
        let that = this;
        let LoginStatus = that.state.LoginStatus; //登录状态
        if (LoginStatus == 1) {
            //错误提示信息
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: '您还未登录,无法查询数据！'
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
            LoadingMsg: '加载中...'
        }) //加载效果
        //用户ID
        let userId = store.getState().userId;
        //查询设备ID
        let ObjdeviceId = store.getState().parameterGroup.multiGroup.selectKey;
        let strdeviceId = "";
        for (let i in ObjdeviceId) {
            if (i != "isGroup") {
                strdeviceId += strdeviceId == "" ? ObjdeviceId[i] : ',' + ObjdeviceId[i];
            }
        }
        //查询类型 日 月 年
        let dataSwitchIn = that.state.dataSwitchIn;
        //处理日报 月报 年报 接口切换
        let url = dataSwitchIn == 0 ? api.ysbb_getDayData : dataSwitchIn == 1 ? api.ysbb_getMonthData : api.ysbb_getYearData;
        //接口参数
        let parameter:any = {
            userId: userId,
            deviceIds: strdeviceId,
        }
        let date = '';

        if (dataSwitchIn == 0) {
            parameter.start = that.state.start;
            parameter.end = that.state.end;
            parameter.hour1 = that.state.start_HH;
            parameter.hour2 = that.state.end_HH;
        } else if (dataSwitchIn == 1) {
            date = that.state._month;
            parameter.date = that.state._month;
            parameter.day1 = that.state._monthTime[0][that.state._monthTimeIn[0]];
            parameter.day2 = that.state._monthTime[1][that.state._monthTimeIn[1]];
        } else if (dataSwitchIn == 2) {
            date = that.state._year;
            parameter.date = that.state._year;
            parameter.month1 = that.state._yearTime[0][that.state._yearTimeIn[0]];
            parameter.month2 = that.state._yearTime[1][that.state._yearTimeIn[1]];
        }
        //定义图表数据
        let queryData:any = [
            {
                id: tool.randomNum(6),
                type: 1,
                name: '折线报表',
                state: true,
                title: '',
                legendData: [],
                xAxisData: [],
                xAxisDataIs: false,
                yAxisName: "",
                series: []
            },
            {
                id: tool.randomNum(6),
                type: 2,
                name: '用水占比',
                state: true,
                title: '',
                total: 0,
                legendData: [],
                series: [{
                        // name: '用水占比',
                        name: '',
                        type: 'pie',
                        center: ['50%', '55%'],
                        radius: ['35%', '50%'],
                        label: {
                            alignTo: 'labelLine',
                            formatter: '{c|{c}({d}%)}',
                            backgroundColor: '#ffffff',
                            borderColor: '#8C8D8E',
                            borderWidth: 1,
                            borderRadius: 4,
                            rich: {
                                c: {
                                    color: '#4C5058',
                                    fontSize: 12,
                                    align: 'center',
                                    padding: [0, 5],
                                    lineHeight: 26
                                }
                            }
                        },
                        data: []
                    },
                    {
                        name: '总计',
                        type: 'pie',
                        center: ['50%', '55%'],
                        radius: ['34%', '35%'],
                        label: {
                            position: 'center',
                            formatter: '{a}\n{c}',
                            fontSize: 14,
                        },
                        data: []
                    }
                ]
            }
        ];
        //查询数据
        HttpService.apiPost(url, parameter).then((res:any) => {
            if (res.flag == "00") {
                let listData = res.data.data;
                let allTime = res.data.allTime;
                console.log(listData, '获取用能报表')
                //校验数据是否为空
                if (listData.length > 0) {
                    for (let i = 0; i < listData.length; i++) {
                        //传感器数据
                        let objData = listData[i];
                        if (objData.data != undefined) {
                            //定义曲线对象
                            queryData[0].title = objData.sensorName + '(' + objData.sensorUnit + ')';
                            queryData[0].legendData.push(objData.name);
                            queryData[0].series[i] = {
                                name: objData.name,
                                type: 'line',
                                connectNulls: true,
                                data: []
                            };
                            /*循环处理数据*/
                            let arrData = objData.data; //对象数据
                            let dataName = dataSwitchIn == 0 ? '时' : dataSwitchIn == 1 ? '日' : '月';
                            ///////////////////
                            //处理折线数据,
                            // 日报
                            if (dataName == '时') {
                                // x轴数据
                                queryData[0].xAxisData = allTime;
                                var keys = Object.keys(arrData);
                                var values = Object.values(arrData);
                                queryData[0].series[i].data = values;
                            }
                            //月报
                            else if (dataName == '日') {
                                for (let a = 0; a < 32; a++) {
                                    let num = a < 10 ? '0' + a : a;
                                    if (arrData[num] != undefined) {
                                        if (queryData[0].xAxisDataIs == false) {
                                            queryData[0].xAxisData.push(a + dataName);
                                        } else {
                                            if (queryData[0].xAxisData.length < arrData.length) {
                                                queryData[0].xAxisDataIs = false;
                                                queryData[0].xAxisData = [];
                                                queryData[0].xAxisData.push(a + '月');
                                            }
                                        }
                                        queryData[0].series[i].data.push(arrData[num]);
                                    }
                                    if (a == 31) {
                                        queryData[0].xAxisDataIs = true;
                                    }
                                }
                            }
                            //年报
                            else if (dataName == '月') {
                                for (let a = 0; a < 12; a++) {
                                    let num = a < 10 ? '0' + a : a;
                                    if (arrData[num] != undefined) {
                                        if (queryData[0].xAxisDataIs == false) {
                                            queryData[0].xAxisData.push(a + dataName);
                                        } else {
                                            if (queryData[0].xAxisData.length < arrData.length) {
                                                queryData[0].xAxisDataIs = false;
                                                queryData[0].xAxisData = [];
                                                queryData[0].xAxisData.push(a + '时');
                                            }
                                        }
                                        queryData[0].series[i].data.push(arrData[num]);
                                    }
                                    if (a == 12) {
                                        queryData[0].xAxisDataIs = true;
                                    }
                                }
                            }

                            ///////////////////
                            //处理饼图数据,
                            queryData[1].title = objData.sensorName;
                            queryData[1].legendData.push(objData.name);
                            queryData[1].series[0].data.push({
                                value: objData.total,
                                name: objData.name
                            });
                            queryData[1].total = ((queryData[1].total * 1000000) + (objData.total * 1000000)) / 1000000;
                        }
                        if (i == (listData.length - 1)) {
                            queryData[1].series[1].data.push({
                                value: queryData[1].total,
                                name: "总计"
                            });
                        }

                    }
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
                        pageName={'用水报表'}
                        showBack={true}
                        showHome={false}
                        isCheck={3}
                        LoginStatus={this.state.LoginStatus}
                        props={this.props}
                        handleSelect={this.handleSelect}>
                    </Navbar>
                    {/* 内容区 */}
                    <View style={styleg.container}>
                        {/* 选项卡 */}
                        <View style={styles.tab}>
                            <Text allowFontScaling={false} style={[styles.tabflex,this.state.dataSwitchIn == 0 ? styles.flexIs : null]} onPress={()=>this.clickDataSwitch(0)}>日报</Text>
                            <Text allowFontScaling={false} style={[styles.tabflex,this.state.dataSwitchIn == 1 ? styles.flexIs : null]} onPress={()=>this.clickDataSwitch(1)}>月报</Text>
                            <Text allowFontScaling={false} style={[styles.tabflex,this.state.dataSwitchIn == 2 ? styles.flexIs : null]} onPress={()=>this.clickDataSwitch(2)}>年报</Text>
                        </View>
                        {/* 查询框 */}
                        <View style={styles.query_head}>
                            {/* 年月日 */}
                            {this.state.dataSwitchIn == 0?
                                <View style={styles.flexs}>
                                    <View style={styles.flex}>
                                        <Pressable style={styleg.button} onPress={()=>this.setState({open: true,typePk: 1})}>
                                            <Text allowFontScaling={false} style={styleg.TextButton}>
                                                {this.state.start+' '+this.state.start_HH+'时'}
                                            </Text>
                                            <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                                        </Pressable>
                                    </View>
                                    <View style={styles.flex}>
                                        <Pressable style={styleg.button} onPress={()=>this.setState({open: true,typePk: 2})}>
                                            <Text allowFontScaling={false} style={styleg.TextButton}>
                                                {this.state.end+' '+this.state.end_HH+'时'}
                                            </Text>
                                            <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                                        </Pressable>
                                    </View>
                                </View>:''
                            }
                            {/* 年月 */}
                            {this.state.dataSwitchIn == 1?
                                <View style={styles.flexs}>
                                    <View style={styles.flex}>
                                        <Pressable style={styleg.button} onPress={()=>this.setState({open: true,typePk: 3})}>
                                            <Text allowFontScaling={false} style={styleg.TextButton}>
                                                {this.state._month}
                                            </Text>
                                            <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                                        </Pressable>
                                    </View>
                                    {/* 多列选择器 */}
                                    <View style={styles.flex}>
                                        <Pressable style={styleg.button} onPress={()=>this.setState({open: true,typePk: 4})}>
                                            <Text allowFontScaling={false} style={styleg.TextButton}>
                                                {this.state._monthTime[0][this.state._monthTimeIn[0]]+'日 至 '+this.state._monthTime[1][this.state._monthTimeIn[1]]+'日'}
                                            </Text>
                                            <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                                        </Pressable>
                                    </View>
                                </View>:''
                            }
                            {/* 年 */}
                            {this.state.dataSwitchIn == 2?
                                <View style={styles.flexs}>
                                    <View style={styles.flex}>
                                        {/* <Picker
                                            pickerType={1}
                                            date={this.state._year}
                                            precisionType={4}
                                            click={this._yearClick}
                                        ></Picker> */}
                                        <Pressable style={styleg.button} onPress={()=>this.setState({open: true,typePk: 5})}>
                                            <Text allowFontScaling={false} style={styleg.TextButton}>
                                                {this.state._month}
                                            </Text>
                                            <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                                        </Pressable>
                                    </View>
                                    {/* 多列选择器 */}
                                    <View style={styles.flex}>
                                        {/* <Picker
                                            pickerType={2}
                                            monthTime={this.state._yearTime}
                                            monthTimeIn={this.state._yearTimeIn}
                                            precisionType={2}
                                            text = '月'
                                            click={this._yearTimeClick}
                                        ></Picker> */}
                                        <Pressable style={styleg.button} onPress={()=>this.setState({open: true,typePk: 6})}>
                                            <Text allowFontScaling={false} style={styleg.TextButton}>
                                                {this.state._yearTime[0][this.state._yearTimeIn[0]]+'月 至 '+this.state._yearTime[1][this.state._yearTimeIn[1]]+'月'}
                                            </Text>
                                            <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                                        </Pressable>
                                    </View>
                                </View>:''
                            }
                            <Text allowFontScaling={false} style={styles.button} onPress={this.clickSearch}>查询</Text>
                        </View>
                        <View style={styles.echarts_con}>
                            {this.state.optionData.length == 0?
                                <Text allowFontScaling={false} style={styles.empty}>暂无数据</Text>:''
                            }
                            {this.state.optionData.map((item:any,index:number)=>{
                                return(
                                    item.state == true ?
                                    <View style={styles.item}>
                                        <View style={styles.name}> 
                                            {item.name}
                                        </View>
                                        <View style={styles.echarts}>
                                            <MyCanvas objData={item} obj-type={item.type == 1 ? 1 : 4}></MyCanvas>
                                        </View>
                                    </View>:''
                                )
                            })}
                        </View>
                    </View>
                    {/* 日期选择 */}
                    {this.state.open?
                        this.state.typePk==1?
                            <PickerBut
                                pickerType={1}
                                date={[this.state.start,this.state.start_HH]}
                                precisionType={3}
                                click={this.startConfirm}
                                cancel={()=>this.setState({open: false})}
                            ></PickerBut>:
                        this.state.typePk==2?
                            <PickerBut
                                pickerType={1}
                                date={[this.state.end,this.state.end_HH]}
                                precisionType={3}
                                click={this.endConfirm}
                                cancel={()=>this.setState({open: false})}
                            ></PickerBut>:
                        this.state.typePk==3?
                            <PickerBut
                                pickerType={1}
                                date={this.state._month}
                                precisionType={2}
                                click={this._monthClick}
                                cancel={()=>this.setState({open: false})}
                            ></PickerBut>:
                        this.state.typePk==4?
                            <PickerBut
                                pickerType={2}
                                monthTime={this.state._monthTime}
                                monthTimeIn={this.state._monthTimeIn}
                                precisionType={2}
                                click={this._monthTimeClick}
                                cancel={()=>this.setState({open: false})}
                            ></PickerBut>:
                        this.state.typePk==5?
                            <PickerBut
                                pickerType={1}
                                date={this.state._year}
                                precisionType={4}
                                click={this._yearClick}
                                cancel={()=>this.setState({open: false})}
                            ></PickerBut>:
                            <PickerBut
                                pickerType={2}
                                monthTime={this.state._yearTime}
                                monthTimeIn={this.state._yearTimeIn}
                                precisionType={2}
                                click={this._yearTimeClick}
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
    tab:{
        position: 'relative',
        width: '100%',
        paddingLeft:10,
        paddingRight:10,
        display: 'flex',
        flexDirection:'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        zIndex: 9,
        overflow: 'hidden',
        borderBottomColor: '#f4f4f4',
        borderStyle:'solid',
        borderBottomWidth:1,
    },
    choice_date:{
        position: 'relative',
        width: '100%',
        height: 30,
        lineHeight: 30,
        // padding: 0 20rpx,
        fontSize: Fs/18,
        color: '#666666',
        // border: 1px solid #d9d9d9,
        borderRadius: 5,
        paddingRight: 25,
        overflow: 'hidden',
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
    flexs: {
        flex: 1,
        display: 'flex',
        flexDirection:'row',
        alignItems: 'center',
    },
    timing:{
        flex:1,
        display:'flex',
        flexDirection:'row',
    },
    tabflex:{
        flex: 1,
        fontSize: Fs/22,
        textAlign:'center',
        lineHeight:40,
        height: 40,
        textAlignVertical: 'center',
    },
    flex:{
        flex: 1,
        fontSize: Fs/22,
        textAlign:'center',
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
        marginLeft: 7,
        overflow: 'hidden',
    },
    text:{},
    echarts_con:{
        position: 'absolute',
        top: 90,
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


export default WaterAnalysis1