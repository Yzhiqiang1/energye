import { createSlice } from '@reduxjs/toolkit';

const initialState:any = {
    userId: null,//用户ID
    userName: null,//用户名字
    avatar: null,//用户头像
    amt: null,//账户余额
    clientId: null,//用户clientId
    secret: null,//用户secret
    websocket_key: null,//实时数据websocket_key
    accessToken: null,//每次打开从新获取accessToken
    localSocket: function(){},//创建websocket连接
    isSocket: true,//是否允许创建连接
    inSocket: true,//是否需要断线重连
    dropLineNum: 10,//掉线重连次数
    dropLineTime: 10000,//掉线重连时间/秒
    accRefresh: false,//账户总览跳转到其他页面操作后返回是否刷新页面
    privacy: false,//隐私政策同意情况
    firstApp: true,//是否为下载后第一次打开app
    parameterGroup: {
        //单选
        radioGroup: {
            groupId:'',
            selectKey:'',
            selectName:''
        },
        //单选包含子组件
        radioSonGroup: {
            groupId:'',
            selectKey: '',
            selectName:''
        },
        //多选组
        multiGroup: {
            groupId:'',
            isGroup:'',
            selectKey:'',
            selectName:''
        },
        //仅选择组
        onlyGroup: {
            groupId:'',
        },
        //摄像头设备
        monitorGroup: {
            selectKey: '',
            selectName:'',
        },
    },
    scene: []
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    //保存accesstoken
    setAccessToken: (state,data) => {
        state.accessToken = data.payload.access_token;
    },
    //退出登录清空状态
    LogOut: (state) => {
        state.userId = null;
        state.amt = null;
        state.userName = null;
        state.avatar = '';
        state.clientId = null;
        state.secret = null;
        state.websocket_key = null;
        state.accessToken = '';
        state.localSocket = function () { };
        state.isSocket = true;//是否允许创建连接
        state.inSocket = true;//是否需要主动关闭连接 true需要 false不需要
        state.dropLineNum = 10;//掉线重连次数
        state.dropLineTime = 10000;//掉线重连时间/秒
        state.parameterGroup = {
            radioGroup: {groupId:'',selectKey:'',selectName:''},
            radioSonGroup: {groupId:'',selectKey: '',selectName:''},
            multiGroup: {groupId:'',isGroup:'',selectKey:'',selectName:''},
            onlyGroup:{groupId:''},
            monitorGroup:{selectKey:'',selectName: ''}
        };
    },
    //登录获取信息保存
    Set_State: (state,data) => {
        state.clientId = data.payload.clientId
        state.secret = data.payload.secret
        state.userId = data.payload.userId
        state.userName = data.payload.userName
        state.websocket_key = data.payload.websocket_key
        state.avatar = data.payload.avatar ? data.payload.avatar : ''
    },
    // 设备组，树更改
    parameter_Group: (state,data) => {
        const datas = data.payload
        state.parameterGroup.radioGroup.selectKey = datas.selectKey ? datas.selectKey : state.parameterGroup.radioGroup.selectKey
        state.parameterGroup.radioGroup.selectName = datas.name ? datas.name : state.parameterGroup.radioGroup.selectName
        state.parameterGroup.radioGroup.groupId = datas.groupId ? datas.groupId : state.parameterGroup.radioGroup.groupId
        state.parameterGroup.onlyGroup.groupId = datas.onlyGroupId ? datas.onlyGroupId : state.parameterGroup.onlyGroup.groupId
        state.parameterGroup.multiGroup.isGroup = datas.multiIsGroup != undefined ? datas.multiIsGroup : state.parameterGroup.multiGroup.isGroup
        state.parameterGroup.multiGroup.groupId = datas.multiGroupId ? datas.multiGroupId : state.parameterGroup.multiGroup.groupId
        state.parameterGroup.multiGroup.selectKey = datas.multiSelectKey ? datas.multiSelectKey : state.parameterGroup.multiGroup.selectKey
        state.parameterGroup.multiGroup.selectName = datas.multiselectName ? datas.multiselectName : state.parameterGroup.multiGroup.selectName
        state.parameterGroup.radioSonGroup.groupId = datas.radioSonGroupId ? datas.radioSonGroupId : state.parameterGroup.radioSonGroup.groupId
        state.parameterGroup.radioSonGroup.selectKey = datas.radioSonSelectKey ? datas.radioSonSelectKey : state.parameterGroup.radioSonGroup.selectKey
        state.parameterGroup.radioSonGroup.selectName = datas.radioSonSelectName ? datas.radioSonSelectName : state.parameterGroup.radioSonGroup.selectName
        state.parameterGroup.monitorGroup.selectKey = datas.monitorSelectKey ? datas.monitorSelectKey : state.parameterGroup.monitorGroup.selectKey
        state.parameterGroup.monitorGroup.selectName = datas.monitorSelectName ? datas.monitorSelectName : state.parameterGroup.monitorGroup.selectName
    },
    localSocket: (state,data) =>{
        const datas = data.payload
        state.localSocket = datas.localSocket != undefined ? datas.localSocket : state.localSocket,
        state.isSocket = datas.isSocket != undefined ? datas.isSocket : state.isSocket,
        state.inSocket = datas.inSocket != undefined ? datas.inSocket : state.inSocket,
        state.dropLineNum = datas.dropLineNum != undefined ? datas.dropLineNum : state.dropLineNum
    },
    //未登录时扫码保存图片
    Scene: (state,data) => {
        state.scene = data.payload.scene
    },
    //app隐私政策同意情况保存
    appPrivacy: (state,data) => {
        console.log(data.payload);
        
        state.firstApp = false
        state.privacy = data.payload.privacy
    }
  },
});

export const { 
    setAccessToken,
    LogOut,
    Set_State,
    parameter_Group,
    localSocket,
    Scene,
    appPrivacy,
} = counterSlice.actions;

export default counterSlice.reducer;