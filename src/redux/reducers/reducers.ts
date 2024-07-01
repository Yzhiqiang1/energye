const userReducer = (
    state:any = {
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
    }, 
    action: any) => {
        switch (action.type) {
            case 'Set_accessToken':
                state.accessToken = action.data.access_token;
                return state
            case 'Log_Out':
                state.userId = null;
                state.amt = null;
                state.userName = null;
                state.avatar = null;
                state.clientId = null;
                state.secret = null;
                state.websocket_key = null;
                state.accessToken = null;
                state.localSocket = function () { };
                state.isSocket = true;//是否允许创建连接
                state.inSocket = true;//是否需要主动关闭连接 true需要 false不需要
                state.dropLineNum = 10;//掉线重连次数
                state.dropLineTime = 10000;//掉线重连时间/秒
                state.parameterGroup = {radioGroup: {groupId:'',selectKey:'',selectName:''},radioSonGroup: {groupId:'',selectKey: '',selectName:''},multiGroup: {groupId:'',isGroup:'',selectKey:'',selectName:''},onlyGroup:{groupId:''},monitorGroup:{selectKey:'',selectName:''}};
                return state
            case 'Set_State':
                state.clientId = action.data.clientId
                state.secret = action.data.secret
                state.userId = action.data.userId
                state.userName = action.data.userName
                state.websocket_key = action.data.websocket_key
                state.avatar = action.data.avatar ? action.data.avatar : require('../../image/logo.png')
                return state
            case 'parameter_Group':
                state.parameterGroup.radioGroup.selectKey = action.data.selectKey ? action.data.selectKey : state.parameterGroup.radioGroup.selectKey
                state.parameterGroup.radioGroup.selectName = action.data.name ? action.data.name : state.parameterGroup.radioGroup.selectName
                state.parameterGroup.radioGroup.groupId = action.data.groupId ? action.data.groupId : state.parameterGroup.radioGroup.groupId
                state.parameterGroup.onlyGroup.groupId = action.data.onlyGroupId ? action.data.onlyGroupId : state.parameterGroup.onlyGroup.groupId
                state.parameterGroup.multiGroup.isGroup = action.data.multiIsGroup != undefined ? action.data.multiIsGroup : state.parameterGroup.multiGroup.isGroup
                state.parameterGroup.multiGroup.groupId = action.data.multiGroupId ? action.data.multiGroupId : state.parameterGroup.multiGroup.groupId
                state.parameterGroup.multiGroup.selectKey = action.data.multiSelectKey ? action.data.multiSelectKey : state.parameterGroup.multiGroup.selectKey
                state.parameterGroup.multiGroup.selectName = action.data.multiselectName ? action.data.multiselectName : state.parameterGroup.multiGroup.selectName
                state.parameterGroup.radioSonGroup.groupId = action.data.radioSonGroupId ? action.data.radioSonGroupId : state.parameterGroup.radioSonGroup.groupId
                state.parameterGroup.radioSonGroup.selectKey = action.data.radioSonSelectKey ? action.data.radioSonSelectKey : state.parameterGroup.radioSonGroup.selectKey
                state.parameterGroup.radioSonGroup.selectName = action.data.radioSonSelectName ? action.data.radioSonSelectName : state.parameterGroup.radioSonGroup.selectName
                state.parameterGroup.monitorGroup.selectKey = action.data.monitorSelectKey ? action.data.monitorSelectKey : state.parameterGroup.monitorGroup.selectKey
                state.parameterGroup.monitorGroup.selectName = action.data.monitorSelectName ? action.data.monitorSelectName : state.parameterGroup.monitorGroup.selectName
                return state
            case 'localSocket':
                state.localSocket = action.data.localSocket != undefined ? action.data.localSocket : state.localSocket,
                state.isSocket = action.data.isSocket != undefined ? action.data.isSocket : state.isSocket,
                state.inSocket = action.data.inSocket != undefined ? action.data.inSocket : state.inSocket,
                state.dropLineNum = action.data.dropLineNum != undefined ? action.data.dropLineNum : state.dropLineNum
                return state
            case 'scene':
                state.scene = action.data.scene
            default:
            return state
        }
    }

export default userReducer
