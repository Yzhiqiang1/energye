import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'

let timeLineItem:any//时间指示条
let currentTimeScal:any//时间轴
let shaft:any //滚动盒子 设置滚动位置

export class TimeLine extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
            startssss: '00:00:00',
            start: '00:00:00', // 传入最近片段起始时刻
            end: '24:00:00', // 传入最近片段结束时刻 默认结束时间为24：00：00, 1440  24
            current: 0, // 当前播放时刻
            // rate: 1, // 1：2小时， 2：1小时， 3：半小时， 4：10分钟， 5：1分钟
            timelag: 30, // 120: 2小时， 60：1小时， 30：半小时，10：10分钟，1：1分钟
            timeArr: [], // 时间轴列表
            availTimeLine: [{st: "22:33:48", et: "23:59:59"},{st: "20:11:23", et: "22:33:48"},{st: "23:00:23", et: "23:00:48"}], // 由实际存在视频片段的时间组成，[{st: '', et: ''}, {st: '', et: ''}, ...]
            scrollTop: 0, // 页面滚动偏移量 页面偏移量由传入时刻决定
            currentTimer: '', // 时刻定时器
            timelineTimer: '', //时间轴定时器,
            index: 0, // 初始时刻在availtimeLine中的index
            playCode: 0, // 当前播放状态值
            date: '',
            noTimeLineTxt: '',
            currentTop: 0, //当前距离页面高度
        }
    }

    componentDidMount(): void {
        this.playCodeWay()
        this.dateLineWay();   
    }
    componentDidUpdate(prevProps: Readonly<any>): void {
        if(prevProps.playCode !== this.props.playCode){
            this.playCodeWay()
        }
        if(prevProps.dateLine !== this.props.dateLine){
            this.dateLineWay();
        }
    }

    //视频播放状态
    playCodeWay=()=> {
        //news 等于 2004 2003 2105 2009 开始播放
        let news = this.props.playCode
        if (news == 2004 || news == 2003 || news == 2105 || news == 2009) {
            // 根据偏移量自动滚动时间轴
            this._autoScrollTimeLine();
        } else  {
            const { currentTimer, timelineTimer } = this.state;
            //终止时刻定时器
            clearInterval(currentTimer);
            //终止时间轴定时器
            clearInterval(timelineTimer);
        }
        //更新视频播放状态
        this.setState({
            playCode: news
        })
    }

    //视频片段
    dateLineWay=()=>{
        let news = this.props.dateLine
        if (news.length && news.length > 0) {
            this.setState({
              availTimeLine: news,
              start: news[0].st,
              end: news[0].et,
              current: news[0].st,
            });
            // 渲染时间轴
            this._matchTimeDot();
            // 根据起始时间设置初始偏移量
            this.primaryOffsetH();
            // 将当前播放时间片段传给父组件
            this.props.getPalyParam({ stTime: news[0].st, etTime: news[0].et })
        } else {
            const { currentTimer, timelineTimer } = this.state;
            clearInterval(currentTimer);
            clearInterval(timelineTimer)
            this.setState({
                availTimeLine: [],
                current: 0,
            })
            // 渲染时间轴
            this._matchTimeDot();
            this.primaryOffsetH();
        }
    }

    // 时刻转分钟
    timeToMinute=(time: string)=>{
        const e = time?time.split(':'):[];
        let h = Number(e[0]);
        const m = Number(e[1]);
        return h * 60 + m
    }
    // 时刻转秒
    timeToSecond=(time: string)=>{
        const e = time?time.split(':'):[];
        let h = Number(e[0]);
        const m = Number(e[1]);
        const s = Number(e[2]);
        return h * 60 * 60 + m * 60 + ( s ? s : 0)
    }
    // 分钟转时刻
    minuteToTime=(minute: number)=>{
        let hour = Math.floor( minute / 60);
        let m = minute % 60;
        return (hour > 9 ? hour : '0'+hour) + ':' + (m > 9 ? m : '0'+m)  
    }
    // 计时器，每秒+1
    secondCountDown=()=>{
        // let current = String(this.state.current)
        let current = this.state.startssss
        const temp = current.split(':');
        let hour = Number(temp[0]);
        let minute = Number(temp[1]);
        let second = Number(temp[2]);
        let t = hour * 60 * 60 + minute * 60 + second + 1;
        let h = Math.floor(t/3600);
        let m = Math.floor((t - h * 3600) / 60);
        let s = t - h * 3600 - m * 60;
        this.setState({
            current: (h > 9 ? h : '0' + h) + ':' + ( m > 9 ? m : '0'+ m) + ':' + ( s > 9 ? s : '0' + s),
            startssss: (h > 9 ? h : '0' + h) + ':' + ( m > 9 ? m : '0'+ m) + ':' + ( s > 9 ? s : '0' + s)
        })
    }
    // 渲染时间轴
    _matchTimeDot=()=>{
        const { start, end, timelag, availTimeLine } = this.state;
        var timeArr:any = [];
        let availPercent = 0;
        //播放时间片段时刻转分钟
        let availArr = [];
        let len = availTimeLine.length;
        for (let i = 0; i < len; i++) {
            const temp = availTimeLine[i];
            let st = this.timeToSecond(temp.st);
            let et = this.timeToSecond(temp.et);
            let stminute;
            let etminute;
            let stAvailPercent = 0;
            let etAvailPercent = 0;
            stminute = Math.floor(st / (timelag * 60) ) * timelag ;
            stAvailPercent = (st - ( stminute * 60 )) / timelag ;
            etminute = Math.floor(et / (timelag * 60) ) * timelag;
            etAvailPercent = (et - ( etminute * 60 )) / timelag;
            availArr[i] = {
            st: stminute,
            et: etminute,
            stAvailPercent: stAvailPercent,
            etAvailPercent: etAvailPercent
            }
        }
        // // 时间转分钟
        let minute = this.timeToMinute(end);
        minute = Math.floor( minute / timelag ) * timelag
        for (let i = minute; i >= 0; ) {
            let marginTop = 0;
            let paddingBottom:any = 0;
            let availTop = 0;
            let recArr = [];
            if(i == minute) {
            marginTop = 70
            } 
            if (i == 0) {
                paddingBottom = '408%';
            } 
            for (let j = 0; j < len; j++) {
                if (i >= availArr[j].st && i <= availArr[j].et) {
                    if(i == availArr[j].st && i == availArr[j].et){
                        availPercent = availArr[j].etAvailPercent - availArr[j].stAvailPercent;
                        availTop = 60 - availArr[j].etAvailPercent;
                        var height:any = availArr[j].etAvailPercent - availArr[j].stAvailPercent;
                        var top:any = 60 - availArr[j].etAvailPercent;
                        recArr.push({
                        height: height,
                        top: top
                        })
                    } else {
                        if (i == availArr[j].st) {
                            recArr.push({
                                height: 60 - availArr[j].stAvailPercent,
                                top: 0
                            })
                        }
                        if (i == availArr[j].et) {
                            recArr.push({
                                height:availArr[j].etAvailPercent,
                                top: 60 - availArr[j].etAvailPercent,
                            })
                        } 
                        else if (i > availArr[j].st && i < availArr[j].et)  {
                            recArr.push({
                                height:60,
                                top: 0,
                            })
                        }
                    }
                }
            
            }
            let time = this.minuteToTime(i);
            timeArr.push({
                id: i,
                current: time,
                label: "a" + i,
                marginTop: marginTop,
                paddingBottom: paddingBottom,
                recArr: recArr,
            });
            i = i - timelag;
        }
        this.setState({
            timeArr: timeArr,
        },()=>{
            this.primaryOffsetH()
        });
        setTimeout(()=>{
            currentTimeScal.measureInWindow((x: any, y: any) => {
                this.setState({
                    currentTop: y-40
                });
            })
        },1000)
    }
    // 计算初始偏移量
    primaryOffsetH=()=>{
        const { start, timelag , timeArr } = this.state;
        const currentItem = timeArr[0]?.current;
        const currentTime = this.timeToSecond(currentItem);
        const startSecond = this.timeToSecond(start);
        const offsetS = currentTime - startSecond;
        const offsetH = Math.ceil( offsetS / timelag ) + 60; // offsetS / (timelag * 60) * 60
        this.setState({
            scrollTop: offsetH
        })
        shaft.scrollTo({ x: 0, y: offsetH, animated: true })
    }
    // 计算当前偏移量
    currentOffsetH=()=>{
        const { current, timelag, timeArr } = this.state;
        const startItem = timeArr[0].current;
        const startSecond = this.timeToSecond(startItem);
        const currentSecond = this.timeToSecond(current);
        const offsetS = startSecond - currentSecond;
        const offsetH = Math.ceil( offsetS / timelag ) + 60; // offsetS / (timelag * 60) * 60
        this.setState({
            scrollTop: offsetH
        })
    }
    // 通过时间轴位置获取当前时间
    rectTopTotime=(reactTop: number)=> {
        let { timelag } = this.state;
        let index = Math.floor(reactTop / 60) ; // 以分钟为刻度时，每个元素初始高度为60px, 向下取整并除以时刻倍数得出偏移item;
        let offsetH = Math.floor(reactTop - (index * 60)); // 偏移高度
        let current;
        let offsetSecond;
        if (offsetH == 0) {
            if (index == 0) {
            const currentMinute = this.timeToMinute(this.state.timeArr[0].current);
            const time = currentMinute + timelag;
            current = this.minuteToTime(time)
            offsetSecond = 0;
            } else {
            current = this.state.timeArr[index - 1].current;
            offsetSecond = 0;
            }
            
        } else {
            // 当timelag==120,timelag==60,timelag==30,timelag==10,timelag==1
            const time = this.state.timeArr[index]?.current;
            let minute = this.timeToMinute(time);
            // 相对于下一元素偏移
            const offsetY = 60 - offsetH;
            const offsetS = (offsetY * timelag ); // offsetY / 60 * timelag * 60
            const offsetM = Math.floor(offsetS / 60) + minute;
            const second = (Math.floor(offsetS / 60) * 60)
            offsetSecond = Math.ceil(offsetS - second); // 保留两位小数
            current = this.minuteToTime(offsetM);
        }
        this.setState({
            current: current + ':' + ( offsetSecond > 9 ? offsetSecond : '0' + offsetSecond),
            scrollTop: reactTop
        });
    }

    // 时间轴自动滚动， 时间每秒变化，时间轴根据timelag滚动
    _autoScrollTimeLine=()=>{
        const { timelag, end, availTimeLine } = this.state;
        let { scrollTop } = this.state;
        const that = this;
        const waitTime = timelag * 1000;
        let top = Math.abs(scrollTop);
        if(this.state.currentTimer){
            clearInterval(this.state.currentTimer)
        }
        if(this.state.timelineTimer) {
            clearInterval(this.state.timelineTimer)
        }
        /**时间时刻变化 */ 
        let currentTimer = setInterval(() => {
            let { index, current } = that.state;
            if (current == availTimeLine[index].et && index == 0) {
                clearInterval(currentTimer);
                clearInterval(timelineTimer);
                console.log('当播放到最后一刻停止');
            }
            else if (current == availTimeLine[index].et && index > 0) {
                that.setState({
                    index : index - 1,
                    current: availTimeLine[index-1].st
                });
                this.currentOffsetH();
                console.log('跳转到下一个时间片段');
                this.props.getPalyParam({ playParam: availTimeLine[index-1] })
            }
            else {
                this.secondCountDown();
            }
        }, 1000);

        /**时间轴滚动间隔为 timelg*1000 */
        let timelineTimer = setInterval(() => {
            let { scrollTop } = this.state;
            scrollTop--;
            that.setState({
                scrollTop: scrollTop
            })
            shaft.scrollTo({ x: 0, y: scrollTop})
        }, waitTime);
        this.setState ({
            currentTimer: currentTimer,
            timelineTimer: timelineTimer
        })
    }
    // 
    // 监听手动滚动时间轴时，停止时间轴滚动，时刻仍然变化 时间轴滚动
    _bindtouchMove=()=>{
        let { timelineTimer, currentTimer, currentTop } = this.state;
        if (timelineTimer || currentTimer) {
            clearInterval(timelineTimer);
            clearInterval(currentTimer)
        }
    }
    // 手动滚动停止，选定时刻自动播放
    _binddragend=(event: any)=>{
        /** 清除已存在的timer */
        let {  timelineTimer, currentTimer } = this.state;
        let _this = this;
        if (timelineTimer || currentTimer) {
            clearInterval( timelineTimer );
            clearInterval( currentTimer );
        }
        var timer: string | number | NodeJS.Timeout | undefined;
        const scollPromise = new Promise(function(resolve, reject) {
            let preTop = -1;
            timer = setInterval(() => {
                timeLineItem.measureInWindow((x:any,y:any) => {
                    if(y !== preTop){
                        preTop = y;
                    }else {
                        resolve(y);
                    }
                });
            },100)
        });
        scollPromise.then((data)=>{
            clearInterval(timer)
            timeLineItem.measureInWindow((x: any, y: any) => {
                let { timelag, availTimeLine, currentTop } = this.state;
                let reactTop = currentTop - y ; // 实际偏移高度
                if (reactTop == 0) {
                    const time = this.state.timeArr[0].current;
                    const currentTime = this.timeToMinute(time);
                    const minute = currentTime + timelag;
                    const current = this.minuteToTime(minute);
                    this.setState({
                        current: current + ':' + '00',
                    });
                } else {
                    // 根据实际偏移高度计算当前时间
                    this.rectTopTotime(reactTop);
                }
                /** 判断当前时刻是否在有播放片段的时间段内 */
                let len = availTimeLine.length;
                
                for (let i = 0; i < len-1; i++) {
                    const j = i + 1;

                    const temp = availTimeLine[i];
                    const nextTemp = availTimeLine[j];
                    console.log(availTimeLine);
                    let st = this.timeToSecond(temp.st);
                    let et = this.timeToSecond(temp.et);
                    let nextEt = this.timeToSecond(nextTemp.et);
                    let nextSt = this.timeToSecond(nextTemp.st);
                    const { current } = this.state;
                    const currentSecond = this.timeToSecond(current);
                    if (j == len-1 && ( currentSecond < nextSt)) {
                        this.setState({
                            index: j,
                            current: availTimeLine[j].st
                        });

                        this.currentOffsetH();
                        this.props.getPalyParam({ stTime: availTimeLine[j].st, etTime: availTimeLine[0].et  })
                        return;
                    }
                    // 在可播放范围内
                    
                    if (currentSecond >= st && currentSecond <= et) {
                        /** 时间轴移动 */
                        this.setState({
                            index: i,
                            current: current
                        });
                        // 将指定的播放时间片段传递给父组件i
                        //console.log('传递给父组件i:', current);
                        this.currentOffsetH();
                        this.props.getPalyParam({ etTime: availTimeLine[0].et , stTime: current })
                        return;
                    } else if (currentSecond < st && currentSecond > nextEt) {
                        this.setState({
                            index: i,
                            current: availTimeLine[i].st
                        });
                        this.currentOffsetH();
                        // 将指定的播放时间片段传递给父组件i
                        this.props.getPalyParam({ stTime: availTimeLine[i].st, etTime: availTimeLine[0].et })
                        return;
                    }
                }
            })
    })
    }
    
    render() {
        return (
            <View style={styles.timeLineContainer}>
                <View 
                    style={styles.currentTime}
                    ref={(ref)=> currentTimeScal = ref}
                >
                    <Text style={styles.currentTimeBg}>{this.state.current}</Text>
                </View>

                <ScrollView
                    style={styles.timeLineItemContainer}
                    onScrollEndDrag={(data)=>this._binddragend(data)}
                    ref={(ref)=>{ shaft = ref}}
                >
                    <View
                    accessible = {true}
                    style={styles.timeLineItem}
                    ref={(ref) => (timeLineItem = ref)}
                    >
                        {this.state.timeArr.map((item:any,index:number)=>{
                            return(
                                <View 
                                    style={[styles.timeItem,{marginTop:item.marginTop,paddingBottom:item.paddingBottom}]}
                                    key={index}
                                >
                                    <View style={styles.scale}></View>
                                    <View style={styles.scale}></View>
                                    <View style={styles.scale}></View>
                                    <View style={styles.scale}></View>
                                    <View style={styles.scale}></View>
                                    <View style={[styles.scale,{width: 10}]}></View>
                                    
                                    {item.recArr.map((item_r:any,index_r:number)=>{
                                        return(
                                            <View 
                                                key={index_r}
                                                style={[styles.itemUnavail,{height:item_r.height,top:item_r.top}]}>
                                                <Text allowFontScaling={false}>{item.height}</Text>
                                            </View>
                                        )
                                    })}
                                    <Text style={{position: 'absolute', top: 53, left: '40%',}}> {item.current}</Text>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({

    timeLineContainer :{
        height: '100%',
        position: 'relative',
        borderBottomWidth:2,
        borderColor: '#333',
        borderStyle: 'solid',
        padding: 0,
        margin: 0,
    },
      
    currentTime :{
        position: 'absolute',
        left: 0,
        top: 40,
        height: 30,
        borderBottomColor: '#FF8F42',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        width: '95%',
        paddingLeft: '36%',
    },

    currentTimeBg :{
        position: 'relative',
        top: 15,
        width: 100,
        height: 29,
        lineHeight: 29,
        backgroundColor: '#FF8F42',
        color: '#fff',
        textAlign: 'center',
        borderRadius: 15,
    },

    timeLineItemContainer :{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '30%',
    },
      
    timeItem :{
        position: 'relative',
        height: 60,
        fontSize: 14,
        borderRightWidth:  6,
        borderStyle: 'solid',
        borderRightColor: '#ddd',
        display: 'flex',
        alignItems: 'flex-end'
    },
    
    scale :{
        width: 6,
        height: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        borderStyle: 'solid',
    },
      
    itemUnavail :{
        width: 6,
        height:6,
        position: 'absolute',
        top: 0,
        left: '100%',
        backgroundColor: '#FF8F42',
    },
    
    timeLineItem :{
        maxHeight: '100%',
    },
})

export default TimeLine