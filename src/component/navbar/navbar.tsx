import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator,
    Image, Pressable, Dimensions, DeviceEventEmitter, Animated, ScrollView, NativeModules, Platform} from 'react-native'
import { HttpService } from '../../utils/http'//网络请求服务
import { Icon } from '@rneui/themed';
import Tree from '../tree/Tree'
import Loading from '../Loading/Loading'
import { parameter_Group } from '../../redux/reducers/counterSlice'
import { store } from '../../redux/storer'
import { Modal } from 'native-base'
import { t } from 'i18next'

const { StatusBarManager } = NativeModules;
const api = require( '../../utils/api')//接口文件
const ht = Dimensions.get('window').height*0.8
const Fs = Dimensions.get('window').width*0.8

const isIphoneXOrAbove = () => {
    const dimen = Dimensions.get('window');
    return (
      Platform.OS === 'ios' &&
      !Platform.isPad &&
      !Platform.isTV &&
      (dimen.height === 812 || dimen.width === 812 || dimen.height === 896 || dimen.width === 896)
    );
};
  
const getStatusBarHeight = () => {
if (isIphoneXOrAbove()) {
    return 44; // iPhone X 及以上设备的状态栏高度
}
return 20; // 其他 iOS 设备的状态栏高度
};

const navigationBar = ht/8 + (Platform.OS === 'ios' ? getStatusBarHeight() : StatusBarManager.HEIGHT);//导航栏高度

export class Navbar extends React.Component<any,any> {
    //下箭头旋转动画数值
    deg = new Animated.Value(0);
    refreshListener: any;
    constructor(props: any ){
        super(props)
        this.state = {
            //下拉框名称
            treeName: '',
            //加载效果
            treeLoading: false,
            //组数据
            arrGroup: [],
            //是否显示下拉树
            showTree: false,
            //选中组下标 单选处理
            isGroup: 0,
            //下拉树选中节点(设备选中ID) 单选或多选
            selectKey: '',
            //下拉树数据
            dataTree: [],
            //是否更新
            update: false,

            msgType: 1,
            visible: false,
            LoadingMsg: '',
            rotate: '0deg'
        }
    }
    componentDidMount(): void {
        if (this.state.update == true) {
            //查询组数据
            this.getGroup();
            //重置更新状态
            this.setState({
                update: false
            })
        }
        // 监听数据变化
        this.refreshListener = DeviceEventEmitter.addListener('refresh', () => {
            if(this.props.pageName === t('home')){
                this.getGroup();
            }
        })
    }
    componentDidUpdate(prevProps:any) {
        // 监听登录状态变化
        if (this.props.LoginStatus !== prevProps.LoginStatus) {
            if(this.props.LoginStatus == 2){
                this.setState({
                    treeLoading: true
                },() => {
                    // 获取摄像头数据列表
                    if (this.props.isCheck == 6 || this.props.isCheck == 1) {
                        if (this.props.isCheck == 1 && store.getState().parameterGroup.monitorGroup.selectKey == '') {
                            this.getMonitor();
                        } else {
                            this.getMonitor();
                        }
                    }
                    if (this.props.isCheck != 6) {
                        //查询组数据
                        this.getGroup();
                    }
                })
            }
        }
    }
    componentWillUnmount() {
        if (this.refreshListener) {
            this.refreshListener.remove();
        }
    }
    //回退
    navBack = ()=> {
        this.props.props.navigation.goBack()
    }
    //回主页
    navHome = ()=> {
        this.props.props.navigation.navigate('Tabbar')
    }
    //树下拉框展开
    treeSelectClick=(event: any) => {
        event.preventDefault();
        //打开弹窗
        this.setState({
            showTree: !this.state.showTree,
        })
        if(this.state.showTree){
            Animated.timing(this.deg,
                {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true
                }
            ).start();
        }else{
            Animated.timing(this.deg,
                {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true
                }
            ).start();
        }
        const rotate = this.deg.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg'],
        })
        this.setState({
            rotate: rotate
        })
    }
    //树下拉框关闭
    handleOnRequestClose=()=>{
        this.setState({
            showTree: false
        })
        if(this.state.showTree){
            Animated.timing(this.deg,
                {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true
                }
            ).start();
        }else{
            Animated.timing(this.deg,
                {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true
                }
            ).start();
        }
        const rotate = this.deg.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg'],
        })
        this.setState({
            rotate: rotate
        })
    }
    //选择组
    choiceGroup=(e:any)=>{
        let is = this.state.isGroup; //之前选中
        let index = Number(e); //选中组下标
        let isCheck = this.props.isCheck; //选中类型
        if (is != index) {
            if (isCheck == 1 || isCheck == 2 || isCheck == 3 || isCheck == 5) {//含树的单选和多选
                this.setState({
                    msgType: 1,
                    visible: true,
                    LoadingMsg: t('inTheQuery')
                })
                this.setState({
                    isGroup: index,
                }, () => {
                    //查询树
                    this.getTree(2);
                })
            } else if (isCheck == 4) {//只含分组
                this.setState({
                    msgType: 1,
                    visible: false,
                })
                this.setState({
                    isGroup: index,
                }, () => {})
                //更新全局变量
                store.dispatch(parameter_Group({onlyGroupId: this.state.arrGroup[index].id}))
                //向父组件传递参数
                if(this.props.choiceGroup){
                    this.props.choiceGroup({type:true})
                }
            }
        }
    }
    //树选择
    handleSelect=(e: any)=>{
        console.log('Navbar');
        let isCheck = this.props.isCheck; //选中类型
        let isGroup = this.state.isGroup; //选中组下标
        //单选
        if (isCheck == 1 || isCheck == 2) { //首页/单选
            store.dispatch(parameter_Group({
                groupId:this.state.arrGroup[isGroup].id,
                selectKey: e.id,
                name: '/' + e.title
            }))
            // this.props.parameter_Group({
            //     groupId:this.state.arrGroup[isGroup].id,
            //     selectKey: e.id,
            //     name: '/' + e.title
            // })
            //更新数据
            this.setState({
                treeName: this.state.arrGroup[isGroup].name + '/' + e.title,
                selectKey: e.id
            })
            //多选
        } else if (isCheck == 3) { //多选
            let id = e.id; //子组件传递过来的ID
            let selectKey = {...store.getState().parameterGroup.multiGroup.selectKey}
            if (selectKey[id] == undefined) {
                let appIsGroup = store.getState().parameterGroup.multiGroup.isGroup;
                if (appIsGroup != isGroup) {
                    selectKey = {};
                    store.dispatch(
                        parameter_Group({
                            multiIsGroup: isGroup,
                            multiGroupId: this.state.arrGroup[isGroup].id
                        })
                    )
                    // this.props.parameter_Group({
                    //     multiIsGroup: isGroup,
                    //     multiGroupId: this.state.arrGroup[isGroup].id
                    // })
                }
                selectKey[id] = id
            } else {
                if (Object.keys(selectKey).length > 1) {
                    delete selectKey[id];
                } else {
                    //错误提示信息
                    this.setState({
                        msgType: 2,
                        visible: true,
                        LoadingMsg: t('selectDevice')
                    },()=>{
                        setTimeout(()=>{
                            this.setState({
                                visible: false,
                            })
                        },2000)
                    })
                    //终止程序
                    return false;
                }
            }
            //更新数据
            store.dispatch(
                parameter_Group({
                    multiSelectKey: selectKey,
                    multiselectName: '/'+ t('Select') + Object.keys(selectKey).length + t('numberDevices')
                })
            )
            // this.props.parameter_Group({
            //     multiSelectKey: selectKey,
            //     multiselectName: '/选中' + Object.keys(selectKey).length + '个设备'
            // })
            this.setState({
                selectKey: selectKey,
                treeName: this.state.arrGroup[isGroup].name + '/' + t('Select') + Object.keys(selectKey).length + t('numberDevices'),
            })
        } else if (isCheck == 5) { //单选且父组件包含子组件
            let id = e.id; //子组件传递过来的ID
            let selectKey = this.getChild(this.state.dataTree, id);
            //更新数据
            store.dispatch(
                parameter_Group({
                    radioSonGroupId: this.state.arrGroup[isGroup].id,
                    radioSonSelectKey: selectKey,
                    radioSonSelectName: '/'+ t('Select') + Object.keys(selectKey).length + t('numberDevices')
                })
            )
            // this.props.parameter_Group({
            //     radioSonGroupId: this.state.arrGroup[isGroup].id,
            //     radioSonSelectKey: selectKey,
            //     radioSonSelectName: '/选中' + Object.keys(selectKey).length + '个设备'
            // })
            this.setState({
                selectKey: selectKey,
                treeName: this.state.arrGroup[this.state.isGroup].name + '/'+ t('Select') + Object.keys(selectKey).length + t('numberDevices'),
            })
        } else if (isCheck == 6) { //摄像头设备
            let id = e.id; //子组件传递过来的ID
            let selectKey = store.getState().parameterGroup.monitorGroup.selectKey;
            if (selectKey[id] == undefined) {
                selectKey[id] = id;
            } else {
                if (Object.keys(selectKey).length > 1) {
                    delete selectKey[id];
                } else {
                    //错误提示信息
                    this.setState({
                        msgType: 2,
                        visible: true,
                        LoadingMsg: t('selectDevice')
                    },()=>{
                        setTimeout(()=>{
                            this.setState({
                                visible: false,
                            })
                        },2000)
                    })
                    //终止程序
                    return false;
                }
            }
            //更新数据
            store.dispatch(
                parameter_Group({
                    monitorSelectKey: selectKey,
                    monitorSelectName: t('Select') + Object.keys(selectKey).length + t('numberDevices') 
                })
            )
            // this.props.parameter_Group({
            //     monitorSelectKey: selectKey,
            //     monitorSelectName: '选中' + Object.keys(selectKey).length + '个设备'
            // })
            this.setState({
                selectKey: selectKey,
                treeName: t('Select') + Object.keys(selectKey).length + t('numberDevices'),
            })
        }
        /**
         * 更改为组件统一返回 树切换状态
         * **/
        if(this.props.handleSelect){
            this.props.handleSelect({type:true})
        }
    }
    /***
     * 获取设备组
     * ****/
    getGroup(){
        //请求参数
        let userId = store.getState().userId //用户ID
        let isCheck = this.props.isCheck; //选中类型
        HttpService.apiPost(api.getGroup, {
            userId: userId,
        }).then((res:any)=>{
            if (res.flag == '00') {
                if (res.data.length > 0) {
                    //获取选中设备组位置(选中组下标)
                    let isGroup = this.funIsGroup(res.data);
                    //更新数据  
                    this.setState({
                        isGroup: isGroup, //选中组下标
                        arrGroup: res.data, //组数据
                    }, () => {
                        //查询树
                        this.getTree(1);
                    })
                } else {
                    //更新数据
                    this.setState({
                        treeLoading: false,
                        treeName: t('noDevices'),
                    })
                }
            } else {
                //更新数据
                this.setState({
                    treeLoading: false,
                    treeName: res.msg,
                })
            }
        }).catch((fail_message) => {
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
        })
    }
   
    /***
     * 获取树
     * ****/
    getTree(type:number){
        let that = this;
        //获取选中类型
        let isCheck = this.props.isCheck;
        //请求参数
        let userId = store.getState().userId//用户ID
        let deviceIds = that.state.arrGroup[that.state.isGroup]?.deviceIds; //设备ID
        HttpService.apiPost(api.getTree, {
            userId: userId,
            deviceIds: deviceIds, //根据设备ID
        }).then((res:any) => {
            this.setState({
                visible: false,//关闭加载窗口
            })
            if (res.flag == '00' && res.data.length > 0) {
                /**********
                 * 数据处理
                 * ***********/
                if (type == 1) {//页面打开即获取
                    //单选
                    let name1 = ''; //下拉框名字
                    let selectKey1 = ''; //处理单选选中数据
                    if (isCheck == 1 || isCheck == 2) {
                        if (store.getState().parameterGroup.radioGroup.selectKey == '') {
                            selectKey1 = res.data[0].id;
                            name1 = '/' + res.data[0].title;
                            //更新全局变量
                            store.dispatch(parameter_Group({selectKey:selectKey1,name:name1}))
                            // this.props.parameter_Group({selectKey:selectKey1,name:name1})
                        } else {
                            selectKey1 = store.getState().parameterGroup.radioGroup.selectKey;
                            name1 = store.getState().parameterGroup.radioGroup.selectName;
                        }
                    }
                    //多选
                    let name2:string = ''; //下拉框名字
                    let selectKey2:any = {}; //处理多选选中数据
                    if (isCheck == 1 || isCheck == 3) {
                        if (store.getState().parameterGroup.multiGroup.selectKey == '') {
                            selectKey2[res.data[0].id] = res.data[0].id;
                            name2 = '/'+ t('Select') + Object.keys(selectKey2).length + t('numberDevices');
                            //更新全局变量
                            // this.props.parameter_Group({multiSelectKey:selectKey2,multiselectName:name2})
                            store.dispatch(parameter_Group({multiSelectKey:selectKey2,multiselectName:name2}))
                        } else {
                            selectKey2 = store.getState().parameterGroup.multiGroup.selectKey;
                            name2 = store.getState().parameterGroup.multiGroup.selectName;
                        }
                    }
                    //单选包含子组件
                    let name3 = ''; //下拉框名字
                    let selectKey3 = {}; //处理选中数据
                    if (isCheck == 1 || isCheck == 5) {
                        if (store.getState().parameterGroup.radioSonGroup.selectKey == '') {
                            //默认选中第一个以及所有子元素
                            selectKey3 = that.getChild(res.data, res.data[0].id)
                            name3 = '/'+ t('Select') + Object.keys(selectKey3).length + t('numberDevices');
                            //更新全局变量
                            store.dispatch(
                                parameter_Group({
                                    radioSonSelectKey:selectKey3,
                                    radioSonSelectName:name3
                                })
                            )
                            // this.props.parameter_Group({
                            //     radioSonSelectKey:selectKey3,
                            //     radioSonSelectName:name3
                            // })
                        } else {
                            selectKey3 = store.getState().parameterGroup.radioSonGroup.selectKey;
                            name3 = store.getState().parameterGroup.radioSonGroup.selectName;
                        }
                    }
                    //整理数据
                    let name = isCheck == 1 || isCheck == 2 ? name1 : isCheck == 3 ? name2 : isCheck == 5 ? name3 : '';
                    let selectKey =
                        isCheck == 1 || isCheck == 2 ? selectKey1 :
                        isCheck == 3 ? selectKey2 :
                        isCheck == 5 ? selectKey3 : '';
                    //更新数据 
                    that.setState({
                        treeLoading: false,
                        treeName: that.state.arrGroup[that.state.isGroup].name + name,
                        selectKey: selectKey,
                        dataTree: res.data,
                    })
                } else {//点击选中
                    that.setState({
                        treeLoading: false,
                        dataTree: res.data,
                        treeName: that.state.arrGroup[that.state.isGroup].name
                    })
                }
            } else {
                //更新数据
                that.setState({
                    treeLoading: false,
                    treeName: res.msg != t('operation') ? res.msg : t('selectGroup'),
                    dataTree: []
                })
            }
        }).catch((fail_message) => {
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
     /***
     * 获取摄像头
     * ***/ 
    getMonitor() {
        let that = this;
        //请求参数
        let userId = store.getState().userId; //用户ID
        this.setState({
            msgType: 1,
            visible: true, //打开加载窗口
            LoadingMsg: t('Loading')
        })
        HttpService.apiPost(api.getMonitor, {
            userId: userId,
        }).then((res:any) => {
            this.setState({
                visible: false,//打开加载窗口
            })
            if (res.flag == '00' && res.data.LayuiTree.length > 0) {
                let name:string = ''; //下拉框名字
                let selectKey:any = {}; //处理多选选中数据
                if (store.getState().parameterGroup.monitorGroup.selectKey == '') {
                    selectKey[res.data.LayuiTree[0].id] = res.data.LayuiTree[0].id; //默认选中第一个
                    name = t('SelectAdevice');
                    store.dispatch(
                        parameter_Group({
                            monitorSelectKey: selectKey,
                            monitorSelectName: name
                        })
                    )
                } else {
                    selectKey = store.getState().parameterGroup.monitorGroup.selectKey;
                    name = store.getState().parameterGroup.monitorGroup.selectName;
                }
               
                //更新数据 
                if (that.props.isCheck == 6) {
                    that.setState({
                        treeLoading: false,
                        treeName: name,
                        selectKey: selectKey,
                        dataTree: res.data.LayuiTree,
                    })
                }
            } else {
                //关闭加载效果
                //更新数据
                that.setState({
                    treeLoading: false,
                    treeName: res.msg != t('operation') ? 'null' : t('selectGroup'),
                })
            }
        }).catch((fail_message) => {
            that.setState({
                treeLoading: false,
                treeName: null,
            })
            //错误提示信息  
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: 'null'
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
        });
    }
    //对比获取组选中位置
    funIsGroup(res: any){
        let isCheck = this.props.isCheck; //获取选择类型
        let isGroup = 0; //组选中下标
        //单选
        if (isCheck == 1 || isCheck == 2) {
            let isGroup_2 = 0;
            if (store.getState().parameterGroup.radioGroup.groupId != '') {
                for (let a = 0; a < res.length; a++) {
                    if (res[a].id == store.getState().parameterGroup.radioGroup.groupId) {
                        isGroup_2 = a;
                        break;
                    }
                }
            }
            isGroup = isGroup_2;
            store.dispatch(parameter_Group({groupId:res[isGroup_2].id}))
        }
        //多选
        if (isCheck == 1 || isCheck == 3) {
            let isGroup_3 = 0;
            if (store.getState().parameterGroup.multiGroup.groupId != '') {
                for (let a = 0; a < res.length; a++) {
                    if (res[a].id == store.getState().parameterGroup.multiGroup.groupId) {
                        isGroup_3 = a;
                        break;
                    }
                }
            }

            if (isCheck == 3) isGroup = isGroup_3;
            store.dispatch(parameter_Group({multiIsGroup:isGroup_3,multiGroupId:res[isGroup_3].id}))
        }
        //仅设备
        if (isCheck == 1 || isCheck == 4) {
            let isGroup_4 = 0;
            if (store.getState().parameterGroup.onlyGroup.groupId != '') {
                for (let a = 0; a < res.length; a++) {
                    if (res[a].id == store.getState().parameterGroup.onlyGroup.groupId) {
                        isGroup_4 = a;
                        break;
                    }
                }
            }
            if (isCheck == 4) isGroup = isGroup_4;
            store.dispatch(parameter_Group({onlyGroupId:res[isGroup_4].id}))
        }
        //单选包含子组件
        if (isCheck == 1 || isCheck == 5) {
            let isGroup_5 = 0;
            if (store.getState().parameterGroup.radioSonGroup.groupId != '') {
                for (let a = 0; a < res.length; a++) {
                    if (res[a].id == store.getState().parameterGroup.radioSonGroup.groupId) {
                        isGroup_5 = a;
                        break;
                    }
                }
            }
            if (isCheck == 5) isGroup = isGroup_5;
            store.dispatch(parameter_Group({radioSonGroupId:res[isGroup_5].id}))
        }
        return isGroup;
        
    }
    //遍历指定父节点 以及所有子节点
    getChild(data: any, id: any, arr:any = {}){
        for (let el of data) {
            if (el.id === id) {
                arr[el.id] = el.id;
                if (el.children) {
                    this.childNodesDeep(el.children, arr);
                }
            } else if (el.children) {
                this.getChild(el.children, id, arr);
            }
        }
        return arr;
    }
    childNodesDeep(data: { id: string | number; children: any }[], arr: { [x: string]: string | number }) {
        if (data) {
            data.forEach((ele: { id: string | number; children: any }) => {
                arr[ele.id] = ele.id;
                if (ele.children) {
                    this.childNodesDeep(ele.children, arr);
                }
            });
        }
    }

    static defaultProps = {
        LoginStatus: '',
        isCheck: 1,
        showBack:false,
        showHome:false,
        pageName:''
    };
    render() {
        const {navigation,}: { navigation?: StackNavigationProp<any, any> } = this.props.props
        return (
            <View style={{
                zIndex: 9999,
                width: '100%',
            }}>
                <View style={[styles.navbar,{height: ht/8, pointerEvents: 'auto'}]}>
                    <View style={[styles.navbar_head]}>
                        {this.props.showBack?
                            <Pressable style={styles.navbar_left} onPress={this.navBack}>
                                <Icon
                                    name='left'
                                    type='antdesign'
                                    color='#333'
                                    size={22}
                                />
                                <Text allowFontScaling={false} style={styles.text}>{t('return')}</Text>
                            </Pressable>:''
                        }
                        {this.props.showHome?
                            <Pressable style={styles.navbar_left} onPress={this.navHome}>
                                <Icon
                                    name='left'
                                    type='antdesign'
                                    color='#333'
                                    size={22}
                                />
                                <Text style={styles.text}>{t('home')}</Text>
                            </Pressable>:''
                        }
                        <Text allowFontScaling={false} style={styles.navbar_text}>{this.props.pageName}</Text>
                        {this.props.LoginStatus == 1?
                            <TouchableOpacity style={styles.treeSelect} onPress={()=>{navigation?.navigate('BindAccount')}}>
                                <Text allowFontScaling={false} style={[styles.navbar_text,{fontSize:Fs/22,color:'#2EA4FF',fontWeight: '400'}]}>{t('youNotlogin')}</Text>
                            </TouchableOpacity>
                        : ''
                        }
                        {this.props.LoginStatus == 2?
                            <Pressable style={styles.treeSelect} onPress={this.treeSelectClick}>
                                {this.state.treeLoading?
                                    <ActivityIndicator color="#1989fa"/> :
                                    <View style={styles.test}>
                                        <Text allowFontScaling={false} style={styles.testName} numberOfLines={1} ellipsizeMode='tail'>
                                            {this.state.treeName}
                                        </Text>
                                        <Animated.View style={[styles.ico,{transform: [{rotate: this.state.rotate}]}]}>
                                            <Image style={styles.img} source={require("../../image/down.png")}></Image>
                                        </Animated.View>
                                    </View>
                                }
                            </Pressable>: ''
                        }
                    </View>
                    <Modal
                        isOpen={this.state.showTree} 
                        onClose={() => this.handleOnRequestClose()}
                        _backdrop={{
                            top: navigationBar,
                            bottom: -100, // 覆盖保护区域
                            opacity: 0.5, // 透明度
                        }}
                        size='full'
                    >
                        <Pressable style={styles.starring} onPress={this.treeSelectClick}></Pressable>
                        <Modal.Content style={{marginBottom: "auto", marginTop: navigationBar + 5}} maxWidth={'98%'}>
                            <Modal.Body style={{minHeight: 350, backgroundColor: "#ffffff"}}>
                                <View style={styles.con}>
                                    <View style={styles.boxs}>
                                        {this.state.isCheck != 6?
                                            <View style={[styles.left,this.props.isCheck==4?styles.leftW100:null]}>
                                                <ScrollView>
                                                    {this.state.arrGroup.map((data:any, index:any) => {
                                                        return(
                                                            <Text allowFontScaling={false} key={index} 
                                                                style={[styles.list,index == this.state.isGroup ? styles.listIs:null]}
                                                                onPress={()=>this.choiceGroup(index)}
                                                            >{data.name}</Text>
                                                        )
                                                    })}
                                                </ScrollView>
                                            </View>
                                            :''
                                        }
                                        {this.props.isCheck == 1 || this.props.isCheck == 2 ||
                                        this.props.isCheck == 3 || this.props.isCheck == 5 ||
                                        this.props.isCheck == 6 ?
                                            <ScrollView>
                                                <View style={styles.right}>
                                                    <ScrollView 
                                                    horizontal={true}
                                                    showsHorizontalScrollIndicator={false}
                                                    >
                                                        <Tree
                                                            dataTree={this.state.dataTree}
                                                            selectKey={this.state.selectKey}
                                                            isChecks={this.props.isCheck}
                                                            isOpenAll={true}
                                                            handleSelect={this.handleSelect}
                                                        ></Tree>
                                                    </ScrollView>
                                                </View>
                                            </ScrollView>
                                            : ''
                                        }
                                    </View>
                                </View>
                            </Modal.Body>
                        </Modal.Content>
                    </Modal>

                </View>
                {/* 弹窗效果组件 */}
                <Loading 
                    type={this.state.msgType} 
                    visible={this.state.visible} 
                    LoadingMsg={this.state.LoadingMsg}
                >
                </Loading>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    navbar:{
        position: 'relative',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 9999999,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f1f1'
    },
    navbar_head:{
        position: 'absolute',
        top: 10,
        width: '100%',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center'
    },
    navbar_left: {
        position: 'absolute',
        height:30,
        left: 5,
        zIndex:9,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    navbar_text:{
        width: '100%',
        textAlign:'center',
        fontSize: Fs/17,
        fontWeight: '600',
        color: '#333'
    },
    treeSelect:{
        position: 'relative',
        margin: 'auto',
        width: '100%',
        height: 28,
        lineHeight: 28,
        color:' #666',
        paddingTop: 5,
        overflow: 'hidden',
    },
    test:{
        position: 'relative',
        display:'flex',
        flexDirection:'row',
        height: 28,
        lineHeight: 28,
        color: '#666',
        overflow: 'hidden',
        justifyContent:'center',
        alignItems: 'center'
    },
    testBox:{
        display:'flex',
        flexDirection:'row',
    },
    testName:{
        maxWidth: 120,
        height: 28,
        lineHeight: 28,
        fontSize: Fs/24,
        color:'#666',
        marginRight: 10,
    },
    ico:{
        display:'flex',
        justifyContent: 'center',
        alignItems:'center',
        width:26,
        height:22,
    },
    img:{
        width: 16,
        height: 16,
    },
    box:{
        position: 'relative',
        width:'96%',
        marginTop:5,
        backgroundColor:'#ffff',
        borderRadius:10
    },
    con:{
        position: 'absolute',
        top: 5,
        width: '100%', 
        height: 350,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        display: 'flex',
        flexDirection:'row',
        padding: 0,
    },
    left:{
        position: 'relative',
        minWidth: 120,
        height: '100%',
        backgroundColor: '#f0f2f5',
        paddingTop:5,
        paddingBottom:5,
        zIndex: 9,
    },
    list:{
        position: 'relative',
        width: '100%',
        height: 30,
        lineHeight: 30,
        textAlignVertical: 'center',
        paddingRight: 5,
        paddingLeft: 10,
        fontSize: Fs/22,
        color: '#666',
    },
    listIs:{
        backgroundColor: '#ffffff',
        fontWeight: '700',
        color: '#1890FF',
    },
    right:{
        position: 'relative',
        flex:1,
        paddingTop:5,
        paddingRight:5,
        paddingBottom:5,
        marginLeft: -10,
        zIndex: 9,
    },
    leftW100:{
        width: '100%',
    },
    spin:{
        transform: [{rotate:'180deg'}],
    },
    boxs:{
        display:'flex',
        flexDirection:'row',
        width:'100%',
        maxHeight: 550,
        borderRadius: 5,
        zIndex: 9,
        overflow: 'hidden',
    }, 
    custom:{
        flex: 1,
        top: ht/8,
        backgroundColor: '#333',
    },
    modalBox: {
        position: "absolute",
        height: Dimensions.get('screen').height,
        width: Dimensions.get('screen').width,
        zIndex: 9999999999,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: '#333',
        fontSize: Fs/18
    },
    starring: {
        position: 'absolute',
        top: navigationBar/1.5,
        width: '100%',
        height: 20,
    },
})

export default Navbar