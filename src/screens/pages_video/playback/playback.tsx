import { Image, ImageBackground, StyleSheet, View, Platform, Pressable, NativeModules, StatusBar, Text, SafeAreaView, } from 'react-native'
import React, { Component } from 'react'
import Picker from '../../../component/Picker/Picker'
import { Register } from '../../../utils/app'
import Navbars from '../../../component/Navbars/Navbars';
import TimeLine from '../../../component/timeLine/timeLine'
import Video from 'react-native-video';
import Loading from '../../../component/Loading/Loading';
import Orientation from 'react-native-orientation-locker';
import { Dimensions } from 'react-native'
import NetInfo from "@react-native-community/netinfo";
const api = require('../../../utils/api')
const { StatusBarManager } = NativeModules;
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight : StatusBarManager.HEIGHT;//状态栏高度
let size = Dimensions.get('window')
const Fs = size.width*0.8
const ht = size.height*0.8

let autoHideTimer: any = undefined
let livePlayerContext: any
let unsubscribe: any

export class Playback extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state = {
            title: '加载中...',
            sensorName: '', //传感器名称
            accessToken: '', //accessToken
            deviceSerial: '', //设备序列号
            channelNo: '', //设备通道
            appkey: '',
            secret: '',
            LoginStatus: 1, //登录状态
            videoSrc: 's', //播放地址

            //播放器宽高
            playW: '100%',
            playH: '100%',

            showVideoControls: true, //是否竖屏
            fullScreen: false, //是否全屏
            videoLoadingStatus: 0, //视频传输进度
            playVideo: false, //视频播放还是停止
            code: '', //播放代码
            panelStatus: 1, //视频隐私遮蔽
            repeat: false,

            videoNetWorkError: false, //播放视频是否出错
            showHDSelect: false,
            autoHideTimer: undefined,
            objectFit: 'contain', //视频填充模式
            openSound: true, //是否静音
            deviceOffline: true, //设备是否在线 true 在线 false 离线

            protocol: 3, //流播放协议，1-ezopen、2-hls、3-rtmp
            playCode: 0, // 当前播放错误码
            recType: 2, // 1-云存储，2-本地录像
            type: 2, // 2-本地录像回放，3-云存储录像回放
            storageType: ['本地存储', '云存储'],
            storageIn: 0, // true-本地存储，false-云存储

            param: {}, //获取播放片段参数
            date: '', //当前日期
            dateLine: [], // 时间片段
            contentItemShow: false, // 暂无数据
            toDay: '', //今日日期

            current: 0,

            msgType: 1,
            visible: false,
            LoadingMsg: '',

            Internet: false//网络状态
        }
    }
    componentDidMount(): void {
        Register.userSignIn(false).then(res => {
            //校验登录成功后执行
            if (res) {
                //优先处理url传参
                let that = this;
                let sensorName = this.props.sensorName ? this.props.sensorName : '';
                let accessToken = this.props.accessToken ? this.props.accessToken : '';
                let deviceSerial = this.props.deviceSerial ? this.props.deviceSerial : '';
                let channelNo = this.props.channelNo ? this.props.channelNo : '';
                let appkey = this.props.appkey ? this.props.appkey : '';
                let secret = this.props.secret ? this.props.secret : '';
                if (sensorName && accessToken && deviceSerial && channelNo && appkey && secret) {
                    //更新数据
                    that.setState({
                        sensorName: sensorName, //传感器名称
                        accessToken: accessToken, //accessToken
                        deviceSerial: deviceSerial, //设备序列号
                        channelNo: channelNo, //设备通道
                        appkey: appkey,
                        secret: secret,
                        LoginStatus: 2,
                        playVideo: true,
                    })
                    // //动态修改页面标题
                    this.setState({
                        title: sensorName
                    })
                    this.setState({
                        msgType: 1,
                        visible: true,
                        LoadingMsg: '本地存储查询中'
                    })
                    that.check_ok();
                } else {
                    //信息提示
                    this.setState({
                        msgType: 2,
                        visible: true,
                        LoadingMsg: '获取视频信息失败！提示：视频回放必须设置监控地址'
                    },()=>{
                        setTimeout(()=>{
                            this.setState({
                                visible: false,
                            })
                        },5000)
                    })
                    return false;
                }
            }
        });
        // 监听网络状态
        unsubscribe = NetInfo.addEventListener((state:any) => {
            if(!state.isInternetReachable && !state.details.isConnectionExpensive){
                this.setState({
                    playVideo:false,
                    Internet: false,
                    msgType: 2,
                    visible: true,
                    LoadingMsg: '当前网络异常',
                    videoNetWorkError: true,
                    videoLoadingStatus: 100,
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            visible: false,
                        })
                    },2000)
                })
            }else if(state.isInternetReachable && state.details.isConnectionExpensive){
                this.setState({
                    Internet: true,
                })
            }
        });
    }

    check_ok=()=>{
        //获取当前日期
        this.getTodayDate();
        this.getAccessToken();
    }
    //获取最新accessToken
    getAccessToken=()=>{
        let that = this;
        let appkey = that.state.appkey;
        let secret = that.state.secret;
        fetch(api.getAccessToken, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                appKey: appkey,
                appSecret: secret,
            }), //提交的参数
        }).then(response => response.json()) //数据解析的方式，json解析
        .then(response => {
        }).catch((error) => {
            //信息提示
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: 'accessToken异常(请求accessToken失败!)'
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },5000)
            })
        })
    }
    //获取存储类型 
    storageChange=(e:any)=>{
        if (e != this.state.storageIn) {
            if (e == 0) {
                //加载效果
                this.setState({
                    msgType: 1,
                    visible: true,
                    LoadingMsg: '查询中'
                })
                this.setState({
                    storageIn: e,
                    recType: 2,
                    type: 2
                });
                this.getTimeLine();
            } else if (e == 1) {
                //加载效果
                this.setState({
                    msgType: 1,
                    visible: true,
                    LoadingMsg: '查询中'
                })
                this.setState({
                    storageIn: e,
                    recType: 1,
                    type: 3
                });
                this.getTimeLine();
            }
        }
    }
    // 获取当天日期
    getTodayDate=()=>{
        const that = this;
        let type = null;
        var time = new Date();
        var h = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        let date = (h > 9 ? h : '0' + h) + '-' + (m > 9 ? m : '0' + m) + '-' + (d > 9 ? d : '0' + d);
        this.setState({
            date: date,
        });
        // 获取当前操作系统类型
        if (JSON.stringify(Platform.OS) == 'ios') {
            that.setState({
                toDay: date.replace(/\-/g, '/')
            });
        } else {
            that.setState({
                toDay: date
            })
        }
    }
    //时间处理
    format=(now:any)=>{
        var time = new Date(now);
        var h = time.getHours(); //返回日期中的小时数（0到23）
        var m = time.getMinutes(); //返回日期中的分钟数（0到59）
        var s = time.getSeconds(); //返回日期中的秒数（0到59）
        return (h > 9 ? h : '0' + h) + ':' + (m > 9 ? m : '0' + m) + ':' + (s > 9 ? s : '0' + s);
    }
    //播放按钮
    handlePlay=()=>{
        if(this.state.Internet){
            this.setState({
                playVideo: true, 
                videoLoadingStatus: 100,
                videoNetWorkError:false
            })
        }
    }
    //断线重连
    reconnect=()=>{
        if(this.state.Internet){
            livePlayerContext.seek(Number(this.state.current))//设置开始时间
            this.handlePlay()
            this.setState({
                videoNetWorkError:false
            })
        }else{
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: '网络异常'
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
        }
    }
    //停止播放
    handleStop=(type:any = 0)=>{
        this.setState({
            playVideo: false, 
            videoLoadingStatus: 0,
        })
    }
    //视频状态变化事件
    statechange=(e:any)=>{
        // const {
        //     code
        // } = e.detail;
        // let videoLoadingStatus = 0;
        // let videoNetWorkError = false;
        // switch (code) {
        //     case 2007: //启动loading
        //         videoLoadingStatus = 0;
        //         break;
        //     case 2001: //连接服务器
        //         videoLoadingStatus = 20;
        //         break;
        //     case 2002: //已经连接 RTMP 服务器,开始拉流
        //         videoLoadingStatus = 40;
        //         break;
        //     case 2008: // 解码器启动
        //         break;
        //     case 2009: //视频分辨率改动
        //         this.handlePlay();
        //         break;
        //     case 2004: // 视频播放开始
        //         videoLoadingStatus = 80;
        //         break;
        //     case 2003: //网络接收到首个视频数据包(IDR)
        //         videoLoadingStatus = 100;
        //         this.setState({
        //             playVideo: true,
        //         })
        //         break;
        //     case 2103: //网络断连, 已启动自动重连（本小程序不自动重连）

        //         break;
        //     case 3001:

        //         break;
        //     case 3002:

        //         break;
        //     case 3003:

        //         break;
        //     case 3005: //播放到最后一课
        //         videoLoadingStatus = 100;
        //         this.checkNetWork();
        //         this.handleStop();
        //         this.setState({
        //             videoNetWorkError: true,
        //             videoLoadingStatus: 100,
        //         });
        //         break;
        //     case 2105:
        //         //开始播放
        //         this.handlePlay();
        //         break;
        //     case -2301: // 经多次重连抢救无效，更多重试请自行重启播放
        //         videoLoadingStatus = 100;
        //         this.setState({
        //             videoNetWorkError: true,
        //             videoLoadingStatus: 100,
        //         })
        //         break;
        // }
        // this.setState({
        //     videoLoadingStatus: videoLoadingStatus,
        //     videoNetWorkError: videoNetWorkError,
        //     playCode: code
        // });
    }
    //检测网络是否异常
    checkNetWork=()=>{
        let that = this
        async function getCurrentNetworkState() {
            const networkState = await NetInfo.fetch();
            if(!networkState.isInternetReachable){
                that.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg: '当前网络异常'
                },()=>{
                    setTimeout(()=>{
                        that.setState({
                            visible: false,
                        })
                    },2000)
                })
            }else{
                that.setState({
                    videoNetWorkError: false,
                })
            }
        }
        getCurrentNetworkState();
    }
    //开启全屏
    fullScreen=()=>{
        livePlayerContext.presentFullscreenPlayer()
        this.setState({
            fullScreen: true,
        })
        Orientation.lockToLandscapeLeft() // 向左方向锁定横屏
    }
    //关闭全屏
    unfullScreen=()=>{
        this.setState({
            fullScreen: false
        })
        livePlayerContext.dismissFullscreenPlayer()
        Orientation.lockToPortrait(); // 锁定竖屏
    }
    //视频填充模式
    ToggleObjectFit=()=>{
        var objectFit = this.state.objectFit;
        this.setState({
            objectFit: objectFit === 'contain' ? 'fillCrop' : 'contain',
        })
    }
    //开始播放
    autoHideControl=()=>{
        const _this = this;
        clearTimeout(autoHideTimer);
        autoHideTimer = setTimeout(() => {
            const {
                showHDSelect
            } = _this.state;
            if (!showHDSelect) {
                this.setState({
                    showVideoControls: false,
                })
            }
        }, 5000);
    }
    //是否静音
    handleSound=()=> {
        var openSound = this.state.openSound;
        this.setState({
            openSound: !openSound,
        })
    }

    playError() {
        this.setState({
            showVideoControls: false,
            videoNetWorkError: true,
            videoLoadingStatus: 100,
        });
    }
    //点击视频
    onVideoTap=()=>{
        const {
            showVideoControls,
            videoNetWorkError
        } = this.state;
        if (videoNetWorkError) {
            return false;
        }
        if (showVideoControls) {
            this.setState({
                showVideoControls: false,
            });
            clearTimeout(this.state.autoHideTimer);
        } else {
            this.setState({
                showVideoControls: true,
            })
            this.autoHideControl();
        }
    }
    // 时间选择器
    bindDateChange=(e:any)=>{
        //加载效果
        this.setState({
            msgType: 1,
            visible: true,
            LoadingMsg: '查询中...'
        })
        this.setState({
            date: e
        });
        this.getTimeLine();
    }

    //获取视频时间轴
    getTimeLine=()=>{
        let that = this;
        let accessToken = that.state.accessToken; //accessToken
        let deviceSerial = that.state.deviceSerial; //设备序列号
        let channelNo = that.state.channelNo; //设备通道
        let recType = that.state.recType; //1-云存储，2-本地录像
        let date = that.state.date; //当前日期
        /*** 
         * 时间处理
         * ***/
        let currentDate = null;
        let timestampCurrent:any = null;
        let timestampToday:any = null;
        // 时间戳转换：Date.parse(new Date("2020-09-23 12:13:56"))
        if (date) {
            currentDate = date;
            const time = currentDate + ' ' + '00:00:00';
            const endTime = currentDate + ' ' + '23:59:59'
            timestampToday = Date.parse(String(new Date(time.replace(/\-/g, '/')))); // 选择日期凌晨时间戳
            timestampCurrent = Date.parse(String(new Date(endTime.replace(/\-/g, '/')))); // 选择日期时间戳
        }
        fetch( api.videoTime, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accessToken: accessToken,
                deviceSerial: deviceSerial,
                channelNo: channelNo,
                recType: recType,
                startTime: timestampToday,
                endTime: timestampCurrent
            }), //提交的参数
        }).then(response => response.json()) //数据解析的方式，json解析
        .then(response => {
            console.log('response',response.code);
            if (response.code == 200) {
                if (response != null) {
                    var result = response;
                    const len = result.length;
                    let availArr = [];
                    for (let i = len - 1; i >= 0; i--) {
                        let response = result[i];
                        let et = null;
                        let st = null;
                        // 最近片段可能存在endTime超过当前时间
                        if (i == (len - 1) && (response.endTime > timestampCurrent)) {
                            et = this.format(timestampCurrent)
                        } else {
                            et = this.format(response.endTime)
                        }
                        // 存在startTime可能为前一天的时间
                        if (i == 0 && (response.startTime < timestampToday)) {
                            st = this.format(timestampToday)
                        } else {
                            st = this.format(response.startTime);
                        }
                        availArr.push({
                            st: st,
                            et: et,
                        })
                    }
                    this.setState({
                        dateLine: availArr,
                    })
                } else {
                    //关闭加载效果
                    this.setState({
                        visible: false,
                        dateLine: [],
                    });
                    this.handleStop(1);
                    //信息提示
                    this.setState({
                        msgType: 2,
                        visible: true,
                        LoadingMsg: '暂无录像片段'
                    },()=>{
                        setTimeout(()=>{
                            this.setState({
                                visible: false,
                            })
                        },5000)
                    })
                }
            } else if (response.code == '10002') {
                //关闭加载效果
                this.setState({
                    visible: false,
                    dateLine: [],
                });
                //信息提示
                this.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg: 'accessToken过期或异常'
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            visible: false,
                        })
                    },5000)
                })
            } else if (response.code == "20002") {
                //关闭加载效果
                this.setState({
                    visible: false,
                    dateLine: [],
                });
                //信息提示
                this.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg: '获取播放时间片段失败(设备不存在)'
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            visible: false,
                        })
                    },5000)
                })
            } else if (response.code == "20007") {
                
                this.setState({
                    visible: false,//关闭加载效果
                    deviceOffline: false,
                    videoLoadingStatus: 100,
                    dateLine: [],
                })
                //信息提示
                this.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg: '获取播放时间片段失败(设备不在线)'
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            visible: false,
                        })
                    },5000)
                })
            } else {
                //关闭加载效果
                this.setState({
                    visible: false,
                    dateLine: [],
                });
                //信息提示
                this.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg: '获取播放时间片段失败'
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            visible: false,
                        })
                    },5000)
                })
            }

        }).catch((error) => {
            console.log('error',error);
        })
    }

    // 获取播放时间片段
    getPalyParam=(e:any)=>{
        let stTime = e.detail.stTime;
        let etTime = e.detail.etTime;
        const {
            type,
            date,
            accessToken,
            deviceSerial,
            channelNo,
        } = this.state;
        let startTime = date + ' ' + stTime;
        let stopTime = date + ' ' + etTime;

        //整理参数
        const param = {
            'accessToken': accessToken,
            'channelNo': channelNo,
            'deviceSerial': deviceSerial,
            'protocol': 3, // 流播放协议，1-ezopen、2-hls、3-rtmp
            'startTime': startTime,
            'stopTime': stopTime,
            'type': type, // 由页面按钮传入值
            'expireTime': 86400, //过期时间
        }
        // 获取播放地址
        this.getPlayUrl(param);
        // 云存储rtmp地址所需携带参数
        this.setState({
            param: param
        })
    }
    // 获取播放地址
    getPlayUrl=(param:any)=> {
        var that = this;
        fetch(api.videoAddress, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(param), //提交的参数
        }).then(response => response.json()) //数据解析的方式，json解析
        .then(response => {
            this.setState({
                visible: false,
            })
            console.log('获取播放地址',response);
            if(response.code == "200" && response.data && response.data.url){
                const playUrl = response.data.url;
                that.setState({
                    videoSrc: playUrl
                })
            }else if (response.code == "20007") {
                //信息提示
                this.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg: '获取播放地址失败(设备不在线)'
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            visible: false,
                        })
                    },2000)
                })
            }else if (response.code == "20002") {
                //信息提示
                this.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg: '获取播放地址失败(设备不存在)'
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            visible: false,
                        })
                    },2000)
                })
            } else if (response.code == "20001") {
                //信息提示
                this.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg: '获取播放地址失败(摄像头不存在)'
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            visible: false,
                        })
                    },2000)
                })
            } else if (response.code == "20018") {
                //信息提示
                this.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg: '获取播放地址失败(用户不拥有该设备)'
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            visible: false,
                        })
                    },2000)
                })
            } else if (response.code == "10001") {
                //信息提示
                this.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg: '获取播放地址失败(参数错误)'
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            visible: false,
                        })
                    },2000)
                })
            } else if (response.code == "60019") {
                //信息提示
                this.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg: '获取播放地址失败(设备已被加密，无法继续查看，请前往萤石云app解密。)'
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            visible: false,
                        })
                    },2000)
                })
            } else {
                //信息提示
                this.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg: `获取播放地址失败(${response.msg})`
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            visible: false,
                        })
                    },2000)
                })
            }
        }).catch((error) => {
            console.log('获取播放地址失败');
        })
    }
    Progress=(e:any)=>{
        this.setState({
            current: e.currentTime//当前播放时间（秒）
        })
    }
    videoError=(e: any)=>{
        console.log('错误');
        // this.checkNetWork()
        this.setState({
            playVideo: false,
            repeat: true
        })
    }
    onBuffer=(data:any)=>{
        console.log('onBuffer触发',data);
    }
    onLoad=(data:any)=>{
        console.log('onLoad触发',data);
    }
    
    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{position: 'absolute',top: 0,width: "100%",height: "100%",backgroundColor: '#fff'}}>
                </View>
                <SafeAreaView style={{flex: 1}}>
                    {!this.state.fullScreen?
                        <Navbars
                        name={this.state.title}
                        showHome={false}
                        showBack={true}
                        props={this.props}
                        ></Navbars>:''
                    }
                    
                    <View style={styles.pageLive}>
                        {/* 视频 */}
                        <View style={this.state.fullScreen?styles.videoContainerFull:styles.videoContainer}>
                            {this.state.videoSrc && this.state.Internet?
                                <Video
                                    ref={(ref: any) => {livePlayerContext = ref}}
                                    source={{ uri: this.state.videoSrc }}
                                    // source={{ uri: 'http://devimages.apple.com/iphone/samples/bipbop/gear1/prog_index.m3u8'}}
                                    style={{position: 'absolute', width: '100%', height: '100%',zIndex:99}}
                                    resizeMode="cover"
                                    paused={!this.state.playVideo}
                                    repeat={this.state.repeat}
                                    muted={!this.state.openSound}
                                    onProgress={(data: any)=>this.Progress(data)}
                                    onError={(e: any)=>this.videoError(e)} // 视频播放出错
                                    onBuffer={(data: any) => this.onBuffer(data)} // 视频播放缓冲
                                    onLoad={(data: any) => this.onLoad(data)}
                                    onPress={(data: any) => this.handleStop(data)}
                                >
                                </Video>
                            :''}
                            <ImageBackground 
                                style={{ position: 'absolute', width: '100%',height: '100%' }} 
                                source={require('../image/live/live_loading_bg.png')}>
                            </ImageBackground>
                            {/* loading状态 */}
                            {this.state.videoLoadingStatus === 100 ?
                                '':
                            <View style={{width:'100%',height:'100%'}}>
                                    {this.state.videoLoadingStatus !== 0 ?
                                        '':
                                        <Pressable style={styles.play} onPress={this.handlePlay}>
                                            <Image style={{width:46,height:46}} source={require('../image/live/landscape_play.png')}></Image>
                                        </Pressable>}
                                    
                                    {this.state.videoLoadingStatus === 0 || this.state.videoNetWorkError?
                                        '':
                                        <View style={styles.videoLoaing}>
                                            <Image style={styles.loadingGif} source={require('../image/live/loading_grey.gif')}></Image>
                                            <Text style={styles.videoLoadingText} >视频安全传输中...</Text>
                                        </View>
                                    }
                            </View>
                            }
                            {!this.state.videoNetWorkError?
                                '':
                                <View style={styles.mesh}>
                                    <Image style={{width:36,height:36}} source={require('../image/live/preview_fail.png')}></Image>
                                    <Text style={styles.meshHint}>网络不稳定，加载失败</Text>
                                    <Text style={styles.meshBut} onPress={this.reconnect}>重试</Text>
                                </View>
                            }
                            {/* 设备不在线 */}
                            {this.state.deviceOffline?'':
                                <View style={styles.videoLoaing}>
                                    <Image style={[styles.loadingGif,{marginBottom:10}]} source={require('../image/live/preview_fail_offline.png')}></Image>
                                    <Text style={styles.videoLoadingText}>设备不在线</Text>
                                </View>
                            }
                            <View style={styles.videoPlay} >
                                {this.state.playVideo?
                                    <Pressable onPress={this.handleStop}>
                                        <Image style={{width:34,height:34}} source={require('../image/video_icon_stop.png')}></Image>
                                    </Pressable>:
                                    <Pressable onPress={this.handlePlay}>
                                        <Image style={{width:34,height:34}} source={require('../image/video_icon_play.png')}></Image>
                                    </Pressable>
                                }
                            </View>
                            <Pressable style={styles.opensound} onPress={this.handleSound}>
                                {this.state.openSound?
                                    <Image style={{width:34,height:34}} source={require('../image/video_icon_opensound.png')}></Image>
                                    :
                                    <Image style={{width:34,height:34}} source={require('../image/video_icon_closesound.png')}></Image>
                                }
                            </Pressable>
                            {!this.state.fullScreen?
                                <Pressable style={styles.full} onPress={this.fullScreen}>
                                    <Image style={{width:34,height:34}} source={require('../image/video_icon_full.png')}></Image>
                                </Pressable>:
                                <Pressable style={styles.full} onPress={this.unfullScreen}>
                                    <Image style={{width:34,height:34}} source={require('../image/video_icon_full.png')}></Image>
                                </Pressable>
                            }
                        </View>

                        <View style={styles.controlArea}>
                            <View style={styles.cloudSwitch}>
                                {/* 选择日期 */}
                                <Picker
                                    pickerType={1}
                                    date={this.state.date}
                                    precisionType={1}
                                    click={this.bindDateChange}
                                ></Picker>
                                <Picker
                                    pickerType={4}
                                    dataSwitch={this.state.storageType}
                                    dataSwitchIn={this.state.storageIn}
                                    click={this.storageChange}
                                >
                                </Picker>
                            </View>
                            {/* 时间轴 */}
                            <View style={styles.timeAxis}>
                                <TimeLine 
                                    getPalyParam={this.getPalyParam}
                                    playCode={this.state.playCode}
                                    dateLine={this.state.dateLine}>
                                </TimeLine>
                            </View>
                        </View>
                    </View>
                    {/* 弹窗效果 */}
                    <Loading 
                        type={this.state.msgType} 
                        visible={this.state.visible} 
                        LoadingMsg={this.state.LoadingMsg}>
                    </Loading>
                </SafeAreaView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    pageLive:{
        position: 'absolute',
        top: ht/10,
        bottom: 0,
        width:'100%',
        backgroundColor: '#f2f2f2',
    },
    videoContainer :{
        position: 'relative',
        width: '100%',
        height: 210,
        textAlign: 'center',
        overflow: 'hidden',
    },
    videoContainerFull :{
        position: 'relative',
        top: -60,
        width: size.height+STATUS_BAR_HEIGHT,
        height: size.width,
        textAlign: 'center',
        overflow: 'hidden',
        zIndex: 99999,
    },
    videoItem :{
        width: '100%',
        height: 210,
        zIndex: 0,
    },
      
      
      
    hide :{
        display: 'none',
    },
    
    ptzLimit :{
        position: 'absolute',
        height: 0,
        width: 0,
    },
    ptzLimitRight :{
        top:0,
        right: 0,
        width: 15,
        height: 210,
    },
    ptzLimitLeft :{
        top:0,
        left: 0,
        width: 15,
        height: 210,
    },
    ptzLimitTop :{
    position: 'absolute',
    top:0,
    left: 0,
    width: '100%',
    height: 15,
    },
    ptzLimitDown :{
    position: 'absolute',
    bottom:0,
    left: 0,
    width: '100%',
    height: 15,
    },
      
    fullScreen :{
        height: '100%',
    },
   
    videoLoadingContainer :{
        position: 'relative',
        height: '100%',
        width: '100%',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
    },
    videoLoadingBg:{
        position: 'absolute',
        top:0,
        left: 0,
        width: '100%',
    },
    videoLoaing :{
        position: 'absolute',
        top: 60,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    loadingGif :{
        width: 40,
        height: 40,
    },
    videoLoadingText :{
        color: '#fff',
        fontSize: Fs/18,
        textAlign: 'center',
        width: '100%',
        lineHeight: 20,
        height: 20,
    },
    videoLoadingTextReTry :{
        // border: 2rpx solid #FFFFFF,
        borderRadius: 20,
        width: 78,
        height: 30,
        lineHeight: 30,
        marginTop: 20,
    },
    videoControlsContainer :{
        position: 'absolute',
        width: '100%',
        bottom:0,
        zIndex: 1000,
        display: 'flex',
        height: 42,
        justifyContent:'space-around',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        flexWrap:'wrap',
    },
    controlsImg :{
        width: 30,
        height: 30,
    },
      /* .page-live .video-container .video-back-container :{
        position: absolute,
        width: 360rpx,
        top:0,
        z-index: 1000,
        display: flex,
        height: 84rpx,
        justify-content:flex-start,
        align-items: flex-start,
        align-content: flex-start,
        flex-wrap:wrap,
      }, */
      videoBackContainer:{
          width: '100%',
          textAlign: 'left',
          left: 0,
          /* background: rgba(0,0,0,0.30), */
        },
      backImg :{
        width: 20,
        height: 20,
        // margin: 22rpx 20rpx 22rpx 30rpx,
      },
      backDevice :{
        color: '#fff',
        lineHeight: 42,
        height: 42,
        verticalAlign: 'top',
      },
      
    hd :{
        position: 'relative',
    },
      
    hdSelect :{
        position: 'absolute',
        bottom: 42,
        zIndex: 1000,
        height: 65,
        width: 50,
        left: 203,
        // background: rgba(0,0,0,0.70),
        borderRadius: 8,
        padding: 5,
    },
    hdOption :{
        fontSize: Fs/18,
        color: '#fff',
        letterSpacing: 0,
        height: 20,
        padding: 5,
    },
    active :{
        color: '#FF8F42',
    },
      
    controlsContainer :{
        textAlign: 'center',
        paddingTop: 10,
        marginBottom: 10,
        display: 'flex',
        justifyContent:'space-around',
        alignItems: 'center',
    },
    controlsItem :{
        width: '30%',
        verticalAlign: 'top',
        margin: 0,
    },
    itemImg :{
        width: 30,
        height: 30,
    },
    disabled :{
        color: '#CCCCCC',
    },
    panelContainer :{
        display: 'flex',
        justifyContent:'space-around',
        alignItems: "flex-start",
        alignContent: 'flex-start',
        flexWrap:'wrap',
    },
    panelItem :{
        width: 166,
        height: 122,
        marginTop: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        textAlign: 'center',
    },
    panelImage:{
        width: 60,
        height: 60,
        marginTop: 20,
    },
    panelName :{
        fontSize: Fs/20,
        // color: rgba(0, 0, 0, 0.65),
    },
    ptzContainer :{
        width: '100%',
        height: 424,
        backgroundColor: '#fff',
        textAlign: 'center',
    
    },
    close :{
        textAlign: 'right',
        // padding: 0 30rpx,
    },
    closeImg :{
        width: 18,
        height: 18,
        marginTop: 15, 
    },
    ptzImg :{
        width: 208,
        height: 208,
    },
    ptzImgContainer:{
        marginTop: 50,
    },
    voiceListItem :{
        marginTop: 10,
        marginBottom: 10,
        display: 'flex',
        justifyContent: 'space-between',
        paddingRight: 30,
        paddingLeft: 30
    },
    voiceListItemName :{
        fontSize: 24,
        color: '#666666',
        // letter-spacing: 0,
        lineHeight: 22,
    },
    voiceListItemGif :{
        width: 20,
        height: 20,
    },
    voiceListTitle :{
        fontSize: 24,
        color: '#333333',
        // letter-spacing: 0,
        lineHeight: 22,
        marginBottom: 10,
        marginTop: 10,
        paddingLeft: 30,
        paddingRight: 30,
    },
    scrollView :{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        alignSelf: 'flex-end',
    
    },
    voiceListContainer :{
        width: '100%',
    },
    
    voiceListItems :{
        width: '86%',
        alignSelf: 'flex-end',
    },
    
    listLoading :{
        textAlign: 'center',
        color: '#666666',
        fontSize: 10,
        width: '100%',
        alignItems: 'flex-end',
    },
    btnPrimary :{
        backgroundColor: '#4C80F7',
        // box-shadow: 0 10rpx 42rpx 0 rgba(0,0,0,0.05),
        borderRadius: 8,
        height: 46,
        lineHeight: 46,
        fontSize: 24,
        color: '#FFFFFF',
        margin: 30,
        marginTop: 0,
    },
    
    
    hidden :{
        display: 'none'!,
    },
      
    nodata :{
        marginTop: 100,
        height: 50,
        width: 120,
        margin: 'auto',
        lineHeight: 50,
        textAlign: 'center',
    },
    backImgs :{
        width: 20,
        height: 20,
        marginTop: 7,
        marginLeft: 7,
    },
    /***************
     ** 控制区
    ***************/
    controlArea:{
        position: 'absolute',
        top: 215,
        width: '100%',
        bottom: 0,
        paddingTop: 5,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    /** 日期选择 和 本地播放**/
    cloudSwitch :{
        position: 'relative',
        width: '100%',
        height: 35,
        paddingLeft: 10,
        paddingRight: 10,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    picker:{
        position: 'relative',
        width: 'auto',
        height: 30,
        lineHeight: 30,
        fontSize: 16,
        color: '#666',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#d7d7d7',
        borderRadius: 5,
        paddingRight: 35,
        paddingLeft: 5,
        // transition: all 0.3s,
        marginTop: 3,
        overflow: 'hidden',
    },
    dateIco:{
        position: 'absolute',
        top: 6,
        right: 5,
        width: 18,
        height: 18,
    },
    storage:{
        position: 'relative',
        width: 'auto',
        height: 30,
        lineHeight: 30,
        fontSize: 26,
        color: '#666',
        borderRadius: 5,

        marginTop: 3,
        overflow: 'hidden',
    },
    storageIco:{
        position: 'absolute',
        top: 6,
        right: 5,
        width: 18,
        height: 18
    },
    /** 时间轴 **/
    timeAxis:{
        position: 'absolute',
        top: 45,
        width: '100%',
        bottom: 0,
        borderTopWidth: 1,
        borderTopColor: '#f2f2f2',
        borderStyle: 'solid',
        paddingTop: 5,
    },
    /** 弹窗样式 **/
    dialogNodataContent:{
        position: 'relative',
        width: '100%',
        padding: 20,
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        overflow: 'hidden',
    },
    play:{
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -23,
        marginTop: -23,
        zIndex: 9999

    },
    videoPlay:{
        position: 'absolute',
        bottom: 10,
        left: 50,
        zIndex: 9999

    },
    opensound:{
        position: 'absolute',
        bottom: 10,
        left: '50%',
        marginLeft: -17,
        zIndex: 9999

    },
    full:{
        position: 'absolute',
        bottom: 10,
        right: 50,
        zIndex: 9999
    },
    mesh:{
        position: 'absolute',
        top: 50,
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        zIndex: 9999
    },
    meshHint:{
        marginTop: 5,
        marginBottom: 20,
        color: '#fff',
        fontSize: 16
    },
    meshBut: {
        width: 80,
        height: 30,
        lineHeight: 35,
        textAlign: 'center',
        color: '#fff',
        fontSize: 18,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 100,
    },
})

export default Playback