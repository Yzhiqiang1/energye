import { Set_accessToken,Log_Out, localSocket } from '../redux/actions/user';
import store from '../redux/store'//全局管理
const api = require('./api')
const base64 = require('./base64');//引入base64
const Overlay = require('rn-overlay') //信息提示框
const Toast = Overlay.Toast
let timeout: string | number | NodeJS.Timeout | null | undefined = null
let ws: any = ''

export class Register {
    //验证是否登录
    static userSignIn(type: any){
        return new Promise((resolve, reject) => {
            let userId = store.getState().userReducer.userId
            let clientId = store.getState().userReducer.clientId;
            let secret = store.getState().userReducer.secret;
            if (userId != null && clientId != null && secret != null){
                let token = store.getState().userReducer.accessToken;
                if (token == null){
                    // //获取token
                    this.getAccessToken().then((data) => {
                        if (data == true) {
                            resolve(true);
                            //创建websocket连接
                            this.initSocket(type);
                        }
                    }).catch((fail_message) => {
                        resolve(false);
                        //错误提示信息
                        Toast.show(fail_message)
                    });
                }else{
                    resolve(true);
                    //创建websocket连接
                    this.initSocket(type);
                }
            }else{
                resolve(false);
            }
        })
    }
    //获取accessToken
    static getAccessToken(){
        let authorization = base64.encode(store.getState().userReducer.clientId + ":" + store.getState().userReducer.secret);
        return new Promise((resolve, reject) => {
            fetch(api.token,{
                method:'GET',
                headers:{
                    'Content-Type': 'text/plain',
                    'authorization': 'Basic ' + authorization
                }
            }).then(response => response.json()) //数据解析的方式，json解析
                .then(response => {
                    if(response.access_token){
                        store.dispatch(Set_accessToken(response))
                        resolve(true);
                    }else{
                        reject(response.error)
                    }
                }).catch((error) => {
                    reject('网络错误！');
                })
        })
    }
    //是否创建websocket连接
    static initSocket=(type:any)=>{
        let that = this;
        let open = store.getState().userReducer.isSocket;//是否允许创建链接
        if(type == true){//type 为true时 创建链接
            if (open == true){//open为true时 创建链接
                that.openWebsocket();
                store.dispatch(localSocket({inSocket:true,dropLineNum:10}))
            }
        }else{//type false 关闭链接
            if (open == false) {//open为false时 关闭链接
                store.dispatch(localSocket({inSocket:false}))
                ws.close();//关闭链接
                //重置倒计时
                if (timeout != null){
                    clearTimeout(timeout);
                    timeout = null;
                }
            }
        }
       
    }
    ///创建websocket连接并监听状态
    static openWebsocket=()=>{
        let that = this
        let websocket_key = store.getState().userReducer.websocket_key + '_0';
        let url = api.websocketUrl + websocket_key;
        let userId = store.getState().userReducer.userId;
        
        ws = new WebSocket(url)
        ws.onopen = () => {
            console.log("创建连接");
            store.dispatch(localSocket({isSocket:false}))//创建连接后 不允许再次创建链接
        };
        ws.onmessage = (e: { data: any; }) => {
            let data = JSON.parse(e.data);
            if (data.flag == "00") {
                if (data.deviceUserid == userId) {
                    store.getState().userReducer.localSocket(data);
                }
            }
        };
        
        ws.onerror = (e: { message: any; }) => {
            console.log('连接失败')
            store.dispatch(localSocket({isSocket:true}))//关闭连接后 允许再次创建链接
        };
        
        ws.onclose = (e: { code: any; reason: any; }) => {
            console.log('连接关闭');
            store.dispatch(localSocket({isSocket:true}))//关闭连接后 允许再次创建链接
            //判断是否允许 循环创建链接
            if (store.getState().userReducer.inSocket == true){
                that.reconnect();
            }
        };
    }
    // 连接失败从新连接
    static reconnect=()=>{
        let that = this;
        timeout  = setTimeout(() => {
            store.dispatch(localSocket({dropLineNum: store.getState().userReducer.dropLineNum -1}))
            if (store.getState().userReducer.dropLineNum > 0){//最多重连10次
                that.openWebsocket();//重新链接
            }else{
               Toast.show('WebSocket连接似乎遇到一个问题，请从新打开程序或者联系技术支持。')
            }
            //重置定时器
            timeout = null;
        }, store.getState().userReducer.dropLineTime);//每隔10秒连接一次
    }
    //退出登录
    static signOut(){
        store.dispatch(Log_Out())
    }
}