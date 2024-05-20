import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { Register } from '../../../utils/app';
import Loading from '../../../component/Loading/Loading';
import { WebView } from 'react-native-webview'
import styleg from '../../../indexCss';
let api = require('../../utils/api.js'); //引入API文件

export class PlayH5 extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
            url: '',
            deviceSerial: '',
            channelNo: '',
            appkey: '',
            secret: '',

            msgType: 1,
            visible: false,
            LoadingMsg: ''
        }
    }
    componentDidMount(): void {
        console.log(this.props, 'options2');
        let that = this;
        //调用登录验证
        Register.userSignIn(false).then((res:any) => {
            //校验登录成功后执行
            if (res) {

                let deviceSerial = this.props.deviceSerial ? this.props.deviceSerial : '';
                let appkey = this.props.appkey ? this.props.appkey : '';
                let secret = this.props.secret ? this.props.secret : '';


                if (deviceSerial && appkey && secret) {
                    //更新数据
                    that.setState({
                        deviceSerial: deviceSerial,
                        channelNo: this.props.channelNo ? this.props.channelNo : 1,
                        appkey: appkey,
                        secret: secret,
                    }, () => {
                        //获取萤石云token
                        that.ysToken();
                    })
                } else {
                    //获取参数失败
                    // wx.showToast({
                    //     title: data.msg,
                    //     icon: 'none',
                    //     duration: 3000
                    // })
                }
            }
        });
    }
    //获取萤石云token
    ysToken=()=>{
        let that = this;
        let deviceSerial = that.state.deviceSerial;
        let channelNo = that.state.channelNo;
        let appkey = that.state.appkey;
        let secret = that.state.secret;
        //加载效果
        this.setState({
            msgType: 1,
            visible: true,
            LoadingMsg: '加载中...'
        });
       //获取数据  
        fetch(api.ysToken, {
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
            // 关闭加载效果   
            this.setState({
                visible: false,
            })
            if (response.code == '200') {
                let accessToken = response.data.accessToken;
                let url = "https://open.ys7.com/jssdk/theme/h5/live.html?deviceSerial=" + deviceSerial + "&channelNo=" + channelNo + "&accessToken=" + accessToken + "&validCode=";
                //更新数据
                that.setState({
                    url: url,
                })
            } else {
                //提示信息
                this.setState({
                    msgType: 2,
                    visible: true,
                    LoadingMsg: response.msg,
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            visible: false,
                        })
                    },2000)
                })
            }
        }).catch((error) => {
        })
    }
    render() {
        return (
        <View>
            <WebView src={this.state.url} source={{ uri: this.state.url }}>
            </WebView>
            {/* 弹窗效果组件 */}
            <Loading 
                type={this.state.msgType} 
                visible={this.state.visible} 
                LoadingMsg={this.state.LoadingMsg}>
            </Loading>
        </View>
        )
    }
}

export default PlayH5