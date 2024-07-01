import { Dimensions, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import Navbar from '../../../component/navbar/navbar'
import { Register } from '../../../utils/app';
import styleg from '../../../indexCss';
import MyCanvas from '../../../component/my-canvas/MyCanvas';
import { store } from '../../../redux/storer';
import { HttpService } from '../../../utils/http';
import Loading from '../../../component/Loading/Loading'//加载组件
import PickerBut from '../../../component/PickerBut/PickerBut';
import { withTranslation } from 'react-i18next';//语言包
let util = require('../../../utils/util.js');
const api = require('../../../utils/api')
const Fs = Dimensions.get('window').width*0.8

export class PowerTest4 extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
        top: 0, //内容区与顶部距离
        LoginStatus: 1, //登录状态 默认未登录

        //日月切换
        dataSwitch: ["日报", "月报"],
        dataSwitchIn: 0,
        //日期选择
        _date: util.nowDate(),
        //类型选择
        // dataType: ["功率", "电流", "相电压", "线电压", "不平衡度", "电压谐波", "电流谐波"],
         dataType: [this.props.t('power'),this.props.t('current'),this.props.t('phaseVoltage'),this.props.t('lineVoltage'),this.props.t('degreeImbalance'),this.props.t('HOV'),this.props.t('HOC'),],
        dataTypeIn: 0,
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
        if (parameterGrou.multiGroup.selectKey) {
            that.getTbaleDayData();
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
    handleSelect=()=>{
        //查询电力运行日报
        this.getTbaleDayData();
    }
    //日月切换
    clickDataSwitch=(e:any)=>{
        let that = this;
        let dataSwitchIn = that.state.dataSwitchIn;
        if (dataSwitchIn != e) {
            that.setState({
                _date: e == 1 ? util.nowDate(1) : util.nowDate(),
                dataSwitchIn: Number(e)
            })
        }
    }
    //日期选择
    clickDate=(e:any)=>{
        this.setState({
            _date: e,
        })
    }
    //类型选择
    clickDataType=(e:any)=>{
        let that = this;
        that.setState({
            dataTypeIn: Number(e)
        })
    }
    //搜索
    clickSearch=()=>{
    //查询电力运行日报
    this.getTbaleDayData();
    }
    //获取电力运行日报
    getTbaleDayData=()=>{
        let that = this;
        let LoginStatus = that.state.LoginStatus; //登录状态
        if (LoginStatus == 1) {
            //错误提示信息
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg:  this.props.t('YANLI')//'您还未登录,无法查询数据！'
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
            LoadingMsg: this.props.t('Loading')//'加载中...'
        }); //加载效果
        //用户ID
        let userId = store.getState().userId;
        //查询设备ID
        let ObjdeviceId = store.getState().parameterGroup.multiGroup.selectKey;
        let strdeviceId = "";
        for (let i in ObjdeviceId) {
            strdeviceId += strdeviceId == "" ? ObjdeviceId[i] : ',' + ObjdeviceId[i];
        }
        //处理日报 月报 接口切换
        let url = that.state.dataSwitchIn == 0 ? api.getTbaleDayData : api.getTbaleMonthData;
        //查询日期
        let date = that.state._date;
        //查询类型
        let names = ""
        let dataTypeIn = that.state.dataTypeIn;
        if (dataTypeIn == 0) {
            names = "P,Q,S,Pf"
        } else if (dataTypeIn == 1) {
            names = "Ia,Ib,Ic,II"
        } else if (dataTypeIn == 2) {
            names = "Uan,Ubn,Ucn"
        } else if (dataTypeIn == 3) {
            names = "Uab,Ubc,Uca"
        } else if (dataTypeIn == 4) {
            names = "UUnB,IUnB"
        } else if (dataTypeIn == 5) {
            names = "THD_Ia,THD_Ib,THD_Ic"
        } else if (dataTypeIn == 6) {
            names = "THD_Uan,THD_Ubn,THD_Ucn"
        }
        //定义图表数据
        let queryData:any = [];
        //查询数据
        HttpService.apiPost(url, {
            userId: userId,
            deviceIds: strdeviceId,
            date: date,
            names: names
        }).then((res:any) => {
            console.log(res, "返回的值");
            if (res.flag == "00") {
                let listData = res.data;
                //校验数据是否为空
                if (listData.length > 0) {
                    for (let i = 0; i < listData.length; i++) {
                        //传感器数据
                        let objData = listData[i];
                        //定义参数
                        queryData.push({
                            name: "",
                            state: true,
                            title: objData.date + ' ' + objData.menuName,
                            legendData: [this.props.t('Max'), this.props.t('Min'), this.props.t('average')],
                            xAxisData: [],
                            series: [{
                                name: this.props.t('Max'),//"最大值",
                                type: 'bar',
                                barGap: 0,
                                showBackground: true,
                                backgroundStyle: {
                                    color: "rgba(180, 180, 180, 0.05)"
                                },
                                data: []
                            }, {
                                name: this.props.t('Min'),//"最小值",
                                type: 'bar',
                                barGap: 0,
                                showBackground: true,
                                backgroundStyle: {
                                    color: "rgba(180, 180, 180, 0.05)"
                                },
                                data: []
                            }, {
                                name: this.props.t('average'),//"平均值",
                                type: 'bar',
                                barGap: 0,
                                showBackground: true,
                                backgroundStyle: {
                                    color: "rgba(180, 180, 180, 0.05)"
                                },
                                data: []
                            }]
                        })
                        //处理数据
                        /** 功率 **/
                        if (dataTypeIn == 0) {//功率
                            //区块名字
                            queryData[i].name = this.props.t('power')//"功率";
                            /** 有功功率(kW) **/
                            if (objData.P_max || objData.P_min || objData.P_avg) {
                                queryData[i].xAxisData.push(this.props.t('activePower')+"(kW)");
                                //最大值
                                queryData[i].series[0].data.push({
                                    value: objData.P_max,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.P_max_time + '(' + objData.P_max + ')'
                                    }
                                })
                                //最小值
                                queryData[i].series[1].data.push({
                                    value: objData.P_min,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.P_min_time + '(' + objData.P_min + ')'
                                    }
                                })
                                //平均值
                                queryData[i].series[2].data.push({
                                    value: objData.P_avg,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: objData.P_avg
                                    }
                                })
                            }
                            /** 无功功率(kVar) **/
                            if (objData.Q_max || objData.Q_min || objData.Q_avg) {
                                queryData[i].xAxisData.push(this.props.t('reactivePower')+"(kVar)");
                                //最大值
                                queryData[i].series[0].data.push({
                                    value: objData.Q_max,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.Q_max_time + '(' + objData.Q_max + ')'
                                    }
                                })
                                //最小值
                                queryData[i].series[1].data.push({
                                    value: objData.Q_min,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.Q_min_time + '(' + objData.Q_min + ')'
                                    }
                                })
                                //平均值
                                queryData[i].series[2].data.push({
                                    value: objData.Q_avg,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: objData.Q_avg
                                    }
                                })
                            }
                            /** 视在功率(kVA) **/
                            if (objData.S_max || objData.S_min || objData.S_avg) {
                                queryData[i].xAxisData.push(this.props.t('apparentPower')+"(kVA)");
                                //最大值
                                queryData[i].series[0].data.push({
                                    value: objData.S_max,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.S_max_time + '(' + objData.S_max + ')'
                                    }
                                })
                                //最小值
                                queryData[i].series[1].data.push({
                                    value: objData.S_min,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.S_min_time + '(' + objData.S_min + ')'
                                    }
                                })
                                //平均值
                                queryData[i].series[2].data.push({
                                    value: objData.S_avg,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: objData.S_avg
                                    }
                                })
                            }
                            /** 功率因素 **/
                            // if (objData.Pf_max || objData.Pf_min || objData.Pf_avg) {
                            //     queryData[i].xAxisData.push("功率因素");
                            //     //最大值
                            //     queryData[i].series[0].data.push({
                            //         value: objData.Pf_max,
                            //         label: {
                            //             show: true,
                            //             rotate: -90,
                            //             align: 'right',
                            //             formatter: '时间:' + objData.Pf_max_time + '(' + objData.Pf_max + ')'
                            //         }
                            //     })
                            //     //最小值
                            //     queryData[i].series[1].data.push({
                            //         value: objData.Pf_min,
                            //         label: {
                            //             show: true,
                            //             rotate: -90,
                            //             align: 'right',
                            //             formatter: '时间:' + objData.Pf_min_time + '(' + objData.Pf_min + ')'
                            //         }
                            //     })
                            //     //平均值
                            //     queryData[i].series[2].data.push({
                            //         value: objData.Pf_avg,
                            //         label: {
                            //             show: true,
                            //             rotate: -90,
                            //             align: 'right',
                            //             formatter: objData.Pf_avg
                            //         }
                            //     })
                            // }
                            /** 电流 **/
                        } 
                        else if (dataTypeIn == 1) {//电流
                            //区块名称
                            queryData[i].name = this.props.t('current');//"电流";
                            /** A相电流(A) **/
                            if (objData.Ia_max || objData.Ia_min || objData.Ia_avg) {
                                queryData[i].xAxisData.push(this.props.t('PAC')+"(A)");//A相电流
                                //最大值
                                queryData[i].series[0].data.push({
                                    value: objData.Ia_max,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.Ia_max_time + '(' + objData.Ia_max + ')'
                                    }
                                })
                                //最小值
                                queryData[i].series[1].data.push({
                                    value: objData.Ia_min,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.Ia_min_time + '(' + objData.Ia_min + ')'
                                    }
                                })
                                //平均值
                                queryData[i].series[2].data.push({
                                    value: objData.Ia_avg,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: objData.Ia_avg
                                    }
                                }, )
                            }
                            /** B相电流(A) **/
                            if (objData.Ib_max || objData.Ib_min || objData.Ib_avg) {
                                queryData[i].xAxisData.push(this.props.t('PBC')+"(A)");//B相电流
                                //最大值
                                queryData[i].series[0].data.push({
                                    value: objData.Ib_max,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.Ib_max_time + '(' + objData.Ib_max + ')'
                                    }
                                })
                                //最小值
                                queryData[i].series[1].data.push({
                                    value: objData.Ib_min,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.Ib_min_time + '(' + objData.Ib_min + ')'
                                    }
                                })
                                //平均值
                                queryData[i].series[2].data.push({
                                    value: objData.Ib_avg,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: objData.Ib_avg
                                    }
                                })
                            }
                            /** C相电流(A) **/
                            if (objData.Ic_max || objData.Ic_min || objData.Ic_avg) {
                                queryData[i].xAxisData.push(this.props.t('PCC')+"(A)");//C相电流
                                //最大值
                                queryData[i].series[0].data.push({
                                    value: objData.Ic_max,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.Ic_max_time + '(' + objData.Ic_max + ')'
                                    }
                                })
                                //最小值
                                queryData[i].series[1].data.push({
                                    value: objData.Ic_min,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.Ic_min_time + '(' + objData.Ic_min + ')'
                                    }
                                })
                                //平均值
                                queryData[i].series[2].data.push({
                                    value: objData.Ic_avg,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: objData.Ic_avg
                                    }
                                })
                            }
                            /** 漏电电流(A) **/
                            if (objData.II_max || objData.II_min || objData.II_avg) {
                                queryData[i].xAxisData.push(this.props.t('currentLeakage')+"(A)");//漏电电流
                                //最大值
                                queryData[i].series[0].data.push({
                                    value: objData.II_max,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.II_max_time + '(' + objData.II_max + ')'
                                    }
                                })
                                //最小值
                                queryData[i].series[1].data.push({
                                    value: objData.II_min,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.II_min_time + '(' + objData.II_min + ')'
                                    }
                                })
                                //平均值
                                queryData[i].series[2].data.push({
                                    value: objData.II_avg,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: objData.II_avg
                                    }
                                })
                            }
                            /** 电压 **/
                        } 
                        else if (dataTypeIn == 2) {//相电压
                            //区块名称
                            queryData[i].name = this.props.t('phaseVoltage')//"相电压";
                            /** A相电压(V) **/
                            if (objData.Uan_max || objData.Uan_min || objData.Uan_avg) {
                                queryData[i].xAxisData.push(this.props.t('PAV')+"(V)");//A相电压
                                //最大值
                                queryData[i].series[0].data.push({
                                    value: objData.Uan_max,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.Uan_max_time + '(' + objData.Uan_max + ')'
                                    }
                                })
                                //最小值
                                queryData[i].series[1].data.push({
                                    value: objData.Uan_min,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.Uan_min_time + '(' + objData.Uan_min + ')'
                                    }
                                })
                                //平均值
                                queryData[i].series[2].data.push({
                                    value: objData.Uan_avg,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: objData.Uan_avg
                                    }
                                }, )
                            }
                            /** B相电压(V) **/
                            if (objData.Ubn_max || objData.Ubn_min || objData.Ubn_avg) {
                                queryData[i].xAxisData.push(this.props.t('PBV')+"(V)");//B相电压
                                //最大值
                                queryData[i].series[0].data.push({
                                    value: objData.Ubn_max,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.Ubn_max_time + '(' + objData.Ubn_max + ')'
                                    }
                                })
                                //最小值
                                queryData[i].series[1].data.push({
                                    value: objData.Ubn_min,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.Ubn_min_time + '(' + objData.Ubn_min + ')'
                                    }
                                })
                                //平均值
                                queryData[i].series[2].data.push({
                                    value: objData.Ubn_avg,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: objData.Ubn_avg
                                    }
                                }, )
                            }
                            /** C相电压(V) **/
                            if (objData.Ucn_max || objData.Ucn_min || objData.Ucn_avg) {
                                queryData[i].xAxisData.push(this.props.t('PCV')+"(V)");//C相电压
                                //最大值
                                queryData[i].series[0].data.push({
                                    value: objData.Ucn_max,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.Ucn_max_time + '(' + objData.Ucn_max + ')'
                                    }
                                })
                                //最小值
                                queryData[i].series[1].data.push({
                                    value: objData.Ucn_min,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.Ucn_min_time + '(' + objData.Ucn_min + ')'
                                    }
                                })
                                //平均值
                                queryData[i].series[2].data.push({
                                    value: objData.Ucn_avg,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: objData.Ucn_avg
                                    }
                                }, )
                            }
                        } 
                        else if (dataTypeIn == 3) {//线电压
                            //区块名称
                            queryData[i].name = this.props.t('lineVoltage');//"线电压";
                            /** AB相电压(V) **/
                            if (objData.Uab_max || objData.Uab_min || objData.Uab_avg) {
                                queryData[i].xAxisData.push(this.props.t('AB')+"(V)");
                                //最大值
                                queryData[i].series[0].data.push({
                                    value: objData.Uab_max,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.Uab_max_time + '(' + objData.Uab_max + ')'
                                    }
                                })
                                //最小值
                                queryData[i].series[1].data.push({
                                    value: objData.Uab_min,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.Uab_min_time + '(' + objData.Uab_min + ')'
                                    }
                                })
                                //平均值
                                queryData[i].series[2].data.push({
                                    value: objData.Uab_avg,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: objData.Uab_avg
                                    }
                                }, )
                            }
                            /** BC相电压(V) **/
                            if (objData.Ubc_max || objData.Ubc_min || objData.Ubc_avg) {
                                queryData[i].xAxisData.push(this.props.t('BC')+"(V)");//BC相电压
                                //最大值
                                queryData[i].series[0].data.push({
                                    value: objData.Ubc_max,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.Ubc_max_time + '(' + objData.Ubc_max + ')'
                                    }
                                })
                                //最小值
                                queryData[i].series[1].data.push({
                                    value: objData.Ubc_min,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.Ubc_min_time + '(' + objData.Ubc_min + ')'
                                    }
                                })
                                //平均值
                                queryData[i].series[2].data.push({
                                    value: objData.Ubc_avg,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: objData.Ubc_avg
                                    }
                                }, )
                            }
                            /** CA相电压(V) **/
                            if (objData.Uca_max || objData.Uca_min || objData.Uca_avg) {
                                queryData[i].xAxisData.push(this.props.t('CA')+"(V)");//CA相电压
                                //最大值
                                queryData[i].series[0].data.push({
                                    value: objData.Uca_max,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.Uca_max_time + '(' + objData.Uca_max + ')'
                                    }
                                })
                                //最小值
                                queryData[i].series[1].data.push({
                                    value: objData.Uca_min,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.Uca_min_time + '(' + objData.Uca_min + ')'
                                    }
                                })
                                //平均值
                                queryData[i].series[2].data.push({
                                    value: objData.Uca_avg,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: objData.Uca_avg
                                    }
                                }, )
                            }
                        } 
                        else if (dataTypeIn == 4) {//不平衡度
                            //区块名称
                            queryData[i].name = this.props.t('degreeImbalance');//"不平衡度";
                            /** 电压三相不平衡度(%) **/
                            if (objData.UUnB_max || objData.UUnB_min || objData.UUnB_avg) {
                                queryData[i].xAxisData.push(this.props.t('VTUD')+"(%)");//电压三相不平衡度
                                //最大值
                                queryData[i].series[0].data.push({
                                    value: objData.UUnB_max,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.UUnB_max_time + '(' + objData.UUnB_max + ')'
                                    }
                                })
                                //最小值
                                queryData[i].series[1].data.push({
                                    value: objData.UUnB_min,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.UUnB_min_time + '(' + objData.UUnB_min + ')'
                                    }
                                })
                                //平均值
                                queryData[i].series[2].data.push({
                                    value: objData.UUnB_avg,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: objData.UUnB_avg
                                    }
                                }, )
                            }
                            /** 电流三相不平衡度(%) **/
                            if (objData.IUnB_max || objData.IUnB_min || objData.IUnB_avg) {
                                queryData[i].xAxisData.push(this.props.t('CTUD')+"(%)");
                                //最大值
                                queryData[i].series[0].data.push({
                                    value: objData.IUnB_max,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.IUnB_max_time + '(' + objData.IUnB_max + ')'
                                    }
                                })
                                //最小值
                                queryData[i].series[1].data.push({
                                    value: objData.IUnB_min,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.IUnB_min_time + '(' + objData.IUnB_min + ')'
                                    }
                                })
                                //平均值
                                queryData[i].series[2].data.push({
                                    value: objData.IUnB_avg,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: objData.IUnB_avg
                                    }
                                }, )
                            }
                        } 
                        else if (dataTypeIn == 5) {//电压谐波
                            //区块名称
                            queryData[i].name = this.props.t('HOV');//"电压谐波";
                            /** A相电压总谐波畸变率(%) **/
                            if (objData.THD_Ia_max || objData.THD_Ia_min || objData.THD_Ia_avg) {
                                queryData[i].xAxisData.push(this.props.t('PhaseAtotal')+"(%)");
                                //最大值
                                queryData[i].series[0].data.push({
                                    value: objData.THD_Ia_max,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.THD_Ia_max_time + '(' + objData.THD_Ia_max + ')'
                                    }
                                })
                                //最小值
                                queryData[i].series[1].data.push({
                                    value: objData.THD_Ia_min,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.THD_Ia_min_time + '(' + objData.THD_Ia_min + ')'
                                    }
                                })
                                //平均值
                                queryData[i].series[2].data.push({
                                    value: objData.THD_Ia_avg,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: objData.THD_Ia_avg
                                    }
                                }, )
                            }
                            /** B相电压总谐波畸变率(%) **/
                            if (objData.THD_Ib_max || objData.THD_Ib_min || objData.THD_Ib_avg) {
                                queryData[i].xAxisData.push(this.props.t('PhaseBtotal')+"(%)");
                                //最大值
                                queryData[i].series[0].data.push({
                                    value: objData.THD_Ib_max,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.THD_Ib_max_time + '(' + objData.THD_Ib_max + ')'
                                    }
                                })
                                //最小值
                                queryData[i].series[1].data.push({
                                    value: objData.THD_Ib_min,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.THD_Ib_min_time + '(' + objData.THD_Ib_min + ')'
                                    }
                                })
                                //平均值
                                queryData[i].series[2].data.push({
                                    value: objData.THD_Ib_avg,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: objData.THD_Ib_avg
                                    }
                                }, )
                            }
                            /** C相电压总谐波畸变率(%) **/
                            if (objData.THD_Ic_max || objData.THD_Ic_min || objData.THD_Ic_avg) {
                                queryData[i].xAxisData.push(this.props.t('PhaseCtotal')+"(%)");//C相总谐波畸变率
                                //最大值
                                queryData[i].series[0].data.push({
                                    value: objData.THD_Ic_max,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.THD_Ic_max_time + '(' + objData.THD_Ic_max + ')'
                                    }
                                })
                                //最小值
                                queryData[i].series[1].data.push({
                                    value: objData.THD_Ic_min,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.THD_Ic_min_time + '(' + objData.THD_Ic_min + ')'
                                    }
                                })
                                //平均值
                                queryData[i].series[2].data.push({
                                    value: objData.THD_Ic_avg,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: objData.THD_Ic_avg
                                    }
                                }, )
                            }

                        } 
                        else if (dataTypeIn == 6) {//电流谐波
                            //区块名称
                            queryData[i].name = this.props.t('HOC')//"电流谐波";
                            /** A相电流总谐波畸变率(%) **/
                            if (objData.THD_Uan_max || objData.THD_Uan_min || objData.THD_Uan_avg) {
                                queryData[i].xAxisData.push(this.props.t('PhaseAtotal')+"(%)");//A相总谐波畸变率
                                //最大值
                                queryData[i].series[0].data.push({
                                    value: objData.THD_Uan_max,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.THD_Uan_max_time + '(' + objData.THD_Uan_max + ')'
                                    }
                                })
                                //最小值
                                queryData[i].series[1].data.push({
                                    value: objData.THD_Uan_min,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.THD_Uan_min_time + '(' + objData.THD_Uan_min + ')'
                                    }
                                })
                                //平均值
                                queryData[i].series[2].data.push({
                                    value: objData.THD_Uan_avg,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: objData.THD_Uan_avg
                                    }
                                }, )
                            }
                            /** B相电流总谐波畸变率(%) **/
                            if (objData.THD_Ubn_max || objData.THD_Ubn_min || objData.THD_Ubn_avg) {
                                queryData[i].xAxisData.push(this.props.t('PhaseBtotal')+"(%)");//B相总谐波畸变率
                                //最大值
                                queryData[i].series[0].data.push({
                                    value: objData.THD_Ubn_max,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.THD_Ubn_max_time + '(' + objData.THD_Ubn_max + ')'
                                    }
                                })
                                //最小值
                                queryData[i].series[1].data.push({
                                    value: objData.THD_Ubn_min,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.THD_Ubn_min_time + '(' + objData.THD_Ubn_min + ')'
                                    }
                                })
                                //平均值
                                queryData[i].series[2].data.push({
                                    value: objData.THD_Ubn_avg,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: objData.THD_Ubn_avg
                                    }
                                }, )
                            }
                            /** C相电流总谐波畸变率(%) **/
                            if (objData.THD_Ucn_max || objData.THD_Ucn_min || objData.THD_Ucn_avg) {
                                queryData[i].xAxisData.push(this.props.t('PhaseCtotal')+"(%)");//C相总谐波畸变率
                                //最大值
                                queryData[i].series[0].data.push({
                                    value: objData.THD_Ucn_max,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.THD_Ucn_max_time + '(' + objData.THD_Ucn_max + ')'
                                    }
                                })
                                //最小值
                                queryData[i].series[1].data.push({
                                    value: objData.THD_Ucn_min,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: this.props.t('Time')+':' + objData.THD_Ucn_min_time + '(' + objData.THD_Ucn_min + ')'
                                    }
                                })
                                //平均值
                                queryData[i].series[2].data.push({
                                    value: objData.THD_Ucn_avg,
                                    label: {
                                        show: true,
                                        rotate: -90,
                                        align: 'right',
                                        formatter: objData.THD_Ucn_avg
                                    }
                                }, )
                            }
                        }
                    }
                    console.log(queryData, 'queryDataqueryData');
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
    openPicker=(type: number)=>{
        this.setState({
            open: true,
            typePk: type
        })
    }
  render() {
    const { t } = this.props
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
                    pageName={t('PowerOperationReport')}//电力运作报表
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
                        {/* <Picker
                            pickerType={4}
                            dataSwitch={this.state.dataSwitch}
                            dataSwitchIn={this.state.dataSwitchIn}
                            click={this.clickDataSwitch}
                            >
                        </Picker> */}
                        <Pressable style={styleg.button} onPress={()=>this.openPicker(1)}>
                            <Text allowFontScaling={false} style={styleg.TextButton}>{this.state.dataSwitch[this.state.dataSwitchIn]}</Text>
                            <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                        </Pressable>
                        <View style={styles.flex}>
                            {/* <Picker
                                pickerType={1}
                                date={this.state._date}
                                precisionType={this.state.dataSwitchIn==0 ? 1 : 2}
                                click={this.clickDate}
                            ></Picker> */}
                            <Pressable style={styleg.button} onPress={()=>this.openPicker(2)}>
                                <Text allowFontScaling={false} style={styleg.TextButton}>{this.state._date}</Text>
                                <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                            </Pressable>
                        </View>
                        {/* <Picker
                            pickerType={4}
                            dataSwitch={this.state.dataType}
                            dataSwitchIn={this.state.dataTypeIn}
                            click={this.clickDataType}
                            >
                        </Picker> */}
                        <Pressable style={styleg.button} onPress={()=>this.openPicker(3)}>
                                <Text allowFontScaling={false} style={styleg.TextButton}>{this.state.dataType[this.state.dataTypeIn]}</Text>
                                <Image style={styleg.ico} source={require('../../../image/down.png')}></Image>
                            </Pressable>
                        <Text allowFontScaling={false} style={styles.button} onPress={this.clickSearch}>{t('inquire')}</Text>
                    </View>
                    <ScrollView style={styles.echarts_con}>
                        {this.state.optionData.length == 0?
                        <Text allowFontScaling={false} style={styles.empty}>{t('noData')}</Text>:""//暂无数据
                        }
                        {this.state.optionData.map((data:any,index:any)=>{
                        return(
                            data.state==true?
                            <View key={index} style={styles.item}>
                                <Text allowFontScaling={false} style={styles.name} onPress={()=>console.log(data)
                                }>
                                    {data.name}
                                </Text>
                                <View style={styles.echarts}>
                                    <MyCanvas objData={data} objType="2"></MyCanvas>
                                </View>
                            </View>:""
                        )
                        })}

                    </ScrollView>
                </View>
                {/* 底部选择器 */}
                {this.state.open?
                    this.state.typePk==1?
                        <PickerBut
                            pickerType={4}
                            dataSwitch={this.state.dataSwitch}
                            dataSwitchIn={this.state.dataSwitchIn}
                            click={this.clickDataSwitch}
                            cancel={()=>this.setState({open: false})}
                        ></PickerBut>:
                    this.state.typePk==2?
                        <PickerBut
                            pickerType={1}
                            date={this.state._date}
                            precisionType={this.state.dataSwitchIn==0 ? 1 : 2}
                            click={this.clickDate}
                            cancel={()=>this.setState({open: false})}
                        ></PickerBut>:
                        <PickerBut
                            pickerType={4}
                            dataSwitch={this.state.dataType}
                            dataSwitchIn={this.state.dataTypeIn}
                            click={this.clickDataType}
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

export default withTranslation()(PowerTest4)