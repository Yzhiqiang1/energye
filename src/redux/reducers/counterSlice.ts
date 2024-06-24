// counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: 0,
    userId: null,//用户ID
    userName: null,//用户名字
    avatar: null,//用户头像
    amt: null,//账户余额
    clientId: null,//用户clientId
    secret: null,//用户secret
    websocket_key: null,//实时数据websocket_key
    accessToken: 'aaaaa',//每次打开从新获取accessToken
    localSocket: function(){},//创建websocket连接
    isSocket: true,//是否允许创建连接
    inSocket: true,//是否需要断线重连
    dropLineNum: 10,//掉线重连次数
    dropLineTime: 10000,//掉线重连时间/秒
    accRefresh: false,//账户总览跳转到其他页面操作后返回是否刷新页面
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
        },

    },
    scene: []
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    // setAccessToken: (state) => {
    //     console.log(state);
    //     state.accessToken = 'ssss';
    // },
    increment: (state) => {
        state.value += 1;
    },
  },
});

export const { setAccessToken,increment } = counterSlice.actions;

export default counterSlice.reducer;