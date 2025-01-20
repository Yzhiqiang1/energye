import { Dimensions, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import { DatePickerView, PickerValue, PickerView } from '@ant-design/react-native'
import styleg from '../../indexCss';
import { getTransition } from '../../utils/util';
import { t } from 'i18next'

const Fs = Dimensions.get('window').width*0.8

export class Picker extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
            date: '',
            dateName: '',
            open: false,

            precisionType: 1,//精度类型
            precision: 'day',//日期精度，默认 日

            datePicker: '',

            /***********
             * 多列选择器
             **********/
            startDay: '',
            endDay: '',
            start: [],
            end: [],
            //选择器改变数据
            PstartDay: '',
            PendDay: '',

            /***********
             * 多列选择器  周
             **********/
            week: '',
            weekTransfer: '',
            weekData: '',
            /***********
             * 普通选择器
             **********/
            data: '',
            dataSwitch: [],
            dataTransfer: '',
            dataSwitchIn: '',
        }
    }
    componentDidMount(): void {
        let precision = 'day' //精度 默认日
        let date = this.props.date
        let dateName = this.props.date
        if(this.props.precisionType == 2){
            precision = 'month'//精度 月
        }else if(this.props.precisionType == 3){
            precision = 'hour'//精度 时
            date = this.props.date[0] + ' ' + this.props.date[1] + ':00'
            dateName = this.props.date[0] + ' ' + this.props.date[1] + '时'
        }else if(this.props.precisionType == 4){
            precision = 'year'//精度 年
        }else if(this.props.precisionType == 5){
            precision = 'minute'//精度 分
        }
        // 多列选择/日期选择
        if(this.props.pickerType == 2){
            this.dateInitial()
        }
        if(this.props.pickerType == 3){
            this.weekInitial()
        }
        if(this.props.pickerType == 4){
            this.dataSwitch()
        }
        this.setState({
            precisionType: this.props.precisionType,
            precision: precision,
            date: date,
            dateName: dateName
        })
    }
    componentDidUpdate(prevProps: Readonly<any>): void {
        if(this.props.date !== prevProps.date){
            let date = this.props.date
            let dateName = this.props.date
            if(this.props.precisionType == 3){
                date = this.props.date[0] + ' ' + this.props.date[1] + ':00'
                dateName = this.props.date[0] + ' ' + this.props.date[1] + '时'
            }
            this.setState({
                date: date,
                dateName: dateName
            })
        }
        if(this.props.monthTime !== prevProps.monthTime){
            if(this.props.pickerType == 2){
                this.dateInitial()
            }
            if(this.props.pickerType == 3){
                this.weekInitial()
            }
        }
        if(this.props.precisionType !== prevProps.precisionType){
            let precision = 'day'
            if(this.props.precisionType == 2){
                precision = 'month'//精度 月
            }else if(this.props.precisionType == 3){
                precision = 'hour'//精度 时
            }else if(this.props.precisionType == 4){
                precision = 'year'//精度 年
            }else if(this.props.precisionType == 5){
                precision = 'minute'//精度 分
            }
            this.setState({
                precision: precision
            })
        }
    }
    // 月 日 选择初始
    dateInitial=()=>{
        let start:any = []
        let end:any = []
        let startDay = this.props.monthTime[0][this.props.monthTimeIn[0]]
        let endDay = this.props.monthTime[1][this.props.monthTimeIn[1]]
        this.props.monthTime[0].map((valeu:any)=>{
            let obj = {
                value: valeu,
                label: valeu,
            }
            start.push(obj)
        })
        this.props.monthTime[1].map((valeu:any)=>{
            let obj = {
                value: valeu,
                label: valeu,
            }
            end.push(obj)
        })
        this.setState({
            start: start,
            end: end,
            startDay: startDay,
            endDay: endDay
        })
    }
    //周选择初始
    weekInitial=()=>{
        let week = this.props.monthTime[this.props.monthTimeIn].split('(')
        let weekData:any = []
        this.props.monthTime.map((value:any,index:number)=>{
            let obj = {
                label: value,
                value: index
            }
            weekData.push(obj)
        })
        this.setState({
            week: week[0],
            weekData: weekData
        })
    }
    //普通选择初始
    dataSwitch=()=>{
        let data = this.props.dataSwitch[this.props.dataSwitchIn]
        let dataSwitch:any = []
        this.props.dataSwitch.map((value:any,index:number)=>{
            let obj = {
                label: value,
                value: index
            }
            dataSwitch.push(obj)
        })
        this.setState({
            data: data,
            dataSwitch: dataSwitch,
        })
    }
    pressable=()=>{
        this.setState({open:false})
    }
    onChange=(date: Date)=>{
        this.setState({
            datePicker: date
        })
    }
    //确定日期
    confirm=()=>{
        let type = this.props.precisionType
        let date: any = getTransition(this.state.datePicker,type)
        if(type == 3){//精度 时
            if(this.state.datePicker){
                let dateName = date.replace(':00','时')
                this.setState({
                    dateName: dateName,
                    date: date,
                })
                this.props.click(date)
            }
        }else {
            if(this.state.datePicker){
                this.setState({
                    dateName: date,
                    date: date,
                })
                this.props.click(date)
            }
        }
        this.setState({
            open:false
        })
    }
    startChange=(value:any)=>{
        this.setState({
            PstartDay: value
        })
    }
    endChange=(value:any)=>{
        this.setState({
            PendDay: value
        })
    }
    uniteConfirm=()=>{
        let start = this.state.PstartDay?this.state.PstartDay:this.state.startDay
        let end = this.state.PendDay?this.state.PendDay:this.state.endDay
        this.props.click([Number(start)-1,Number(end)-1])
        if(Number(start)<Number(end)){
            this.setState({
                startDay: start,
                endDay: end,
                open: false
            })
        }
    }
    //周选择变换
    weekChange=(value: PickerValue[])=>{
        this.setState({
            weekTransfer: value
        })
    }
    //周选择确认
    weekConfirm=()=>{
        if(this.state.weekTransfer){
            let week = this.props.monthTime[this.state.weekTransfer].split('(')
            this.setState({
                weekValue: this.state.weekTransfer,
                week: week[0],
            })
            this.props.click(this.state.weekTransfer)
        }
        this.setState({
            open: false
        })
    }
    //普通选择变换
    dataChange=(value: PickerValue[])=>{
        this.setState({
            dataTransfer: value
        })
    }
    //普通选择确认
    dataConfirm=()=>{
        if(this.state.dataTransfer){
            let data = this.props.dataSwitch[Number(this.state.dataTransfer)]
            this.setState({
                data: data,
                dataSwitchIn: this.state.dataTransfer,
            })
            this.props.click(Number(this.state.dataTransfer))
        }
        this.setState({
            open: false
        })
    }
    render() {
        return (
            this.props.pickerType == 1?
            <View>
                <Pressable style={styleg.button} onPress={()=>{this.setState({open:true})}}>
                    <Text allowFontScaling={false} style={styleg.TextButton}>{this.state.dateName}</Text>
                    <Image style={styleg.ico} source={require('../../image/down.png')}></Image>
                </Pressable>
                <Modal 
                    visible={this.state.open}
                    transparent={true}>
                    <View style={styles.modalBack}>
                        <Pressable style={{flex: 1}} onPress={()=>{this.setState({open:false})}}>
                        </Pressable>
                        <View style={[styles.dialogBox]}>
                            <View style={styles.butTop}>
                                <Text allowFontScaling={false} style={styles.bot} onPress={()=>{this.setState({open:false})}}>{t('cancel')}</Text>
                                <Text allowFontScaling={false} style={[styles.bot,styles.right]} onPress={this.confirm}>{t('confirm')}</Text>
                            </View>
                            <DatePickerView
                                precision={this.state.precision}
                                defaultValue={new Date(String(this.state.date))}
                                onChange={(value: Date)=>this.onChange(value)}
                            >
                            </DatePickerView>
                        </View>
                    </View>
                </Modal>
            </View>:
            this.props.pickerType == 2?
            <View>
                <Pressable style={styleg.button} onPress={()=>{this.setState({open:true})}}>
                    <Text allowFontScaling={false} style={styleg.TextButton}>{this.state.startDay+this.props.text + t('to') + this.state.endDay+this.props.text}</Text>
                    <Image style={styleg.ico} source={require('../../image/down.png')}></Image>
                </Pressable>
                <Modal 
                    animationType="fade"
                    visible={this.state.open}
                    transparent={true}
                    presentationStyle={'overFullScreen'}>
                    <View style={{flex: 1,backgroundColor: 'rgba(0,0,0,0.4)'}}>
                        <Pressable style={{flex: 1}} onPress={()=>{this.setState({open:false})}}>
                        </Pressable>
                        <View style={[styles.dialogBox,{position: 'absolute',zIndex: 999}]}>
                            <View style={styles.butTop}>
                                <Text allowFontScaling={false} style={styles.bot} onPress={()=>{this.setState({open:false})}}>{t('cancel')}</Text>
                                <Text allowFontScaling={false} style={[styles.bot,styles.right]} onPress={this.uniteConfirm}>{t('confirm')}</Text>
                            </View>

                            <View style={{display:'flex',flexDirection:'row'}}>
                                <View style={{flex: 1}}>
                                    <PickerView
                                        data={this.state.start}
                                        defaultValue={[this.state.startDay]}
                                        onChange={(value)=>this.startChange(value)}>
                                    </PickerView>
                                </View>
                                <View style={{flex: 1}}>
                                    <PickerView
                                    data={this.state.end}
                                    defaultValue={[this.state.endDay]}
                                    onChange={(value)=>this.endChange(value)}>
                                    </PickerView>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>:
            this.props.pickerType == 3?
            <View>
                <Pressable style={styleg.button} onPress={()=>{this.setState({open:true})}}>
                    <Text allowFontScaling={false} style={styleg.TextButton}>{this.state.week}</Text>
                    <Image style={styleg.ico} source={require('../../image/down.png')}></Image>
                </Pressable>
                <Modal 
                    animationType="fade"
                    visible={this.state.open}
                    transparent={true}
                    presentationStyle={'overFullScreen'}>
                    <View style={{flex: 1,backgroundColor: 'rgba(0,0,0,0.4)',}}>
                        <Pressable style={{flex: 1}} onPress={()=>{this.setState({open:false})}}>
                        </Pressable>
                        <View style={[styles.dialogBox,{position: 'absolute',zIndex: 999}]}>
                            <View style={styles.butTop}>
                                <Text allowFontScaling={false} style={styles.bot} onPress={()=>{this.setState({open:false})}}>{t('cancel')}</Text>
                                <Text allowFontScaling={false} style={[styles.bot,styles.right]} onPress={this.weekConfirm}>{t('confirm')}</Text>
                            </View>

                            <View>
                            <PickerView
                                data={this.state.weekData}
                                defaultValue={this.state.weekValue}
                                onChange={(value)=>this.weekChange(value)}>
                            </PickerView>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>:
            this.props.pickerType == 4?
            <View>
                <Pressable style={styleg.button} onPress={()=>{this.setState({open:true})}}>
                    <Text allowFontScaling={false} style={styleg.TextButton}>{this.state.data}</Text>
                    <Image style={styleg.ico} source={require('../../image/down.png')}></Image>
                </Pressable>
                <Modal 
                    animationType="fade"
                    visible={this.state.open}
                    transparent={true}
                    presentationStyle={'overFullScreen'}>
                    <View style={{flex: 1,backgroundColor: 'rgba(0,0,0,0.4)',}}>
                        <Pressable style={{flex: 1}} onPress={()=>{this.setState({open:false})}}>
                        </Pressable>
                        <View style={[styles.dialogBox,{position: 'absolute',zIndex: 99999}]}>
                            <View style={styles.butTop}>
                                <Text allowFontScaling={false} style={styles.bot} onPress={()=>{this.setState({open:false})}}>{t('cancel')}</Text>{/*取消*/}
                                <Text allowFontScaling={false} style={[styles.bot,styles.right]} onPress={this.dataConfirm}>{t('confirm')}</Text>{/*取消*/}
                            </View>

                            <View>
                                <PickerView
                                    data={this.state.dataSwitch}
                                    defaultValue={this.state.dataSwitchIn}
                                    onChange={(value)=>this.dataChange(value)}>
                                </PickerView>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>:''
        )
    }
}

const styles = StyleSheet.create({
    text:{
        height: 30,
        lineHeight: 30,
        textAlignVertical: 'center',
        fontSize: Fs/22,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 5,
    },
    dialogBox:{
        zIndex: 9999,
        bottom: -20,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height/2.5,
        borderRadius: 10,
        backgroundColor: '#fff'
    },
    butTop:{
        position: 'relative',
        height: 40,
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: 20,
    },
    bot:{
        fontSize: Fs/22,
        lineHeight: 40,
    },
    right:{
        position: 'absolute',
        right: 20,
        color: '#2EA4FF'
    },
    modalBack:{
        position: 'absolute',
        zIndex: 999999,
        width: '100%',
        height: Dimensions.get('screen').height,
        backgroundColor: 'rgba(0,0,0,0.4)',
    }
})

export default Picker