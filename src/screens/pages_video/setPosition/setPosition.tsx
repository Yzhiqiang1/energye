import { Text, StyleSheet, View } from 'react-native'
import React, { Component } from 'react'
import { Register } from '../../../utils/app';
import Loading from '../../../component/Loading/Loading';
import { MapView } from 'react-native-amap3d';
const api = require('../../../utils/api.js');
const CTSD = require('../../../utils/CTSD.js');//引入坐标转换文件

let _mapView:any = ''
export default class setPosition extends Component<any,any> {
    constructor(props:any){
        super(props)
        this.state={
            //要修改的设备 信息
            userId: '',
            deviceId: '',
            deviceName: '',
            linktype: '',
            timescale: '',
            top_index: '',
            index: '',
            //地图中心点 (直接更改地图无动画效果)
            latitude: 22.608515, //维度
            longitude: 113.843689, //经度    

            //地图marker标注点实际经纬度
            sign_lat: 22.608515, //维度
            sign_lng: 113.843689, //经度

            //搜索框
            positionVal: '',
            positionIndex: -1, //选中地址下标
            lastPositionVal: '', //上一次查询内容
            //地图手动选取地址
            manualAddress: '',
            //搜索出来的地址信息
            addressArr: [],
            //底部弹窗
            popupShow: false,
            //marker标注点
            markers_data: [{
                id: 0,
                latitude: 22.608515,
                longitude: 113.843689,
            }],
            msgType: 1,
            visible: false,
            LoadingMsg: ''
        }
    }
    componentDidMount(): void {
        let that = this;
        //调用登录验证
        Register.userSignIn(false).then(res => {
            //用户登录
            if (res) {
                //获取URL参数
                let userId = this.props.userId;
                let deviceId = this.props.deviceId;
                let deviceName = this.props.deviceName;
                let linktype = this.props.linktype;
                let lng = this.props.lng;
                let lat = this.props.lat;
                let timescale = this.props.timescale;
                let top_index = this.props.top_index; //一级下标
                let index = this.props.index; //二级下标
                if (userId && deviceId && deviceName && linktype && lng && lat && timescale && top_index && index) {
                    //动态更改title
                    // wx.setNavigationBarTitle({
                    //     title: deviceName + "-位置修改"
                    // })
                    //百度系坐标转为火星坐标
                    let bd = CTSD.bd09togcj02(lng, lat);
                    //更新数据
                    that.setState({
                        userId: userId,
                        deviceId: deviceId,
                        deviceName: deviceName,
                        linktype: linktype,
                        timescale: timescale,
                        top_index: top_index,
                        index: index,
                        //地图marker标注点实际经纬度
                        sign_lng: bd[0],
                        sign_lat: bd[1],
                        //打开位置弹窗
                        popupShow: true,
                    }, () => {
                        this.setState({
                            msgType: 1,
                            visible: true,
                            LoadingMsg: '查询中...'
                        });
                        //地址逆解析
                        that._reverseGeocoder();
                        //获取地图实例
                        // var mapCtx = wx.createMapContext("myMap");
                        //平移地图中心点
                        // mapCtx.moveToLocation({
                        //     longitude: bd[0],
                        //     latitude: bd[1],
                        // })
                        // //平移marker标记点
                        // mapCtx.translateMarker({
                        //     markerId: 0,
                        //     duration: 500,
                        //     destination: {
                        //         longitude: bd[0],
                        //         latitude: bd[1],
                        //     },
                        // })
                    })
                } else {
                    //弹窗提示
                    // wx.showModal({
                    //     title: '提示信息',
                    //     content: '获取参数失败,请联系管理员',
                    //     showCancel: false,
                    //     confirmText: '关闭',
                    // })
                }
            } else {
                //弹窗提示
                // wx.showModal({
                //     title: '提示信息',
                //     content: '用户未登录或登录失效',
                //     showCancel: false,
                //     confirmText: '关闭',
                // })
            }
        });
    }
    /*********************************************************************
     * 搜索框查询
     * *******************************************************************/
    //手动打开弹窗
    _mapMenu=()=>{
        this.setState({
            popupShow: true,
        })
    }
    //输入框输入
    bindKeywordsName=(e:any)=> {
        this.setState({
            positionVal: e.detail.value
        })
    }
    blurKeywordsName=(e:any)=> {
        this.setState({
            positionVal: e.detail.value
        })
    }
    //搜索按钮搜索  并打开弹窗
    _search=(e:any)=> {
        let that = this;
        let val = that.state.positionVal; //当前查询
        let lastVal = that.state.lastPositionVal; //上一次查询
        let sign_lat = that.state.sign_lat; //地图marker标注点纬度
        let sign_lng = that.state.sign_lng; //地图marker标注点经度
        if (val) {
            //判断如果和上一次输入内容相同 只需要打开弹窗
            if (val != lastVal) {
                //加载效果
                this.setState({
                    msgType: 1,
                    visible: true,
                    LoadingMsg: '查询中...'
                });
                //天地图地点搜索
                let lonlat = CTSD.gcj02towgs84(Number(sign_lng), Number(sign_lat)); //经纬度转换
                let mapBound = lonlat[0] + "," + lonlat[1] + "," + lonlat[0] + "," + lonlat[1]
                // wx.request({
                //     url: api.tdSearch,
                //     data: {
                //         postStr: {
                //             "keyWord": val,
                //             "level": 18,
                //             "mapBound": mapBound,
                //             "queryType": 1,
                //             "start": 0,
                //             "count": 10,
                //             show: 2
                //         },
                //         type: 'query',
                //         tk: api.tdKey
                //     },
                //     method: 'GET',
                //     header: {
                //         'Content-Type': 'text/plain',
                //     },
                //     success: function (res) {
                //         console.log(res)
                //         //关闭加载效果
                //         wx.hideLoading();
                //         if (res.statusCode == 200) {
                //             if (res.data.status.infocode == 1000) {
                //                 if (res.data.pois) {
                //                     let pois = res.data.pois;
                //                     console.log(pois)
                //                     //更新数据
                //                     that.setData({
                //                         addressArr: pois,
                //                         positionIndex: -1, //选中地址下标
                //                         lastPositionVal: val, //上一次查询内容
                //                         popupShow: true, //打开弹窗
                //                     })
                //                 } else {
                //                     that.setData({
                //                         addressArr: [],
                //                         positionIndex: -1, //选中地址下标
                //                         lastPositionVal: val, //上一次查询内容
                //                         popupShow: true, //打开弹窗
                //                     })
                //                 }
                //             } else {
                //                 //弹窗提示
                //                 wx.showModal({
                //                     title: '提示信息',
                //                     content: '查询失败',
                //                     showCancel: false,
                //                     confirmText: '关闭',
                //                 })
                //             }
                //         } else {
                //             //弹窗提示
                //             wx.showModal({
                //                 title: '提示信息',
                //                 content: '查询失败',
                //                 showCancel: false,
                //                 confirmText: '关闭',
                //             })
                //         }
                //     },
                //     fail: function (e) {
                //         //关闭加载效果
                //         wx.hideLoading();
                //         //弹窗提示
                //         wx.showModal({
                //             title: '提示信息',
                //             content: '查询失败',
                //             showCancel: false,
                //             confirmText: '关闭',
                //         })
                //     }
                // })
            } else {
                that.setState({
                    popupShow: true, //打开弹窗
                })
            }
        } else {
            this.setState({
                msgType: 2,
                visible: true,
                LoadingMsg: '关键字不能为空',
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },2000)
            })
        }
    }
    //关闭弹窗
    onClose=()=> {
        this.setState({
            popupShow: false
        });
    }
    //选中地址
    _select=(e:any)=> {
        let that = this;
        let index = Number(e.currentTarget.dataset.index); //获取选中下标
        let positionIndex = that.state.positionIndex; //上次选中下标
        if (index != positionIndex) {
            //更新数据
            that.setState({
                positionIndex: index, //更新选中下标
                manualAddress: '', //清空地图手动选取地址
            })
            //获取选中经纬度
            let lonlat = that.state.addressArr[index].lonlat.split(",");
            let location = CTSD.wgs84togcj02(Number(lonlat[0]), Number(lonlat[1]));

            // //获取地图实例
            // var mapCtx = wx.createMapContext("myMap");
            // //设置地图中心点
            // mapCtx.moveToLocation({
            //     longitude: location[0],
            //     latitude: location[1],
            // })
            // //平移标识点
            // mapCtx.translateMarker({
            //     markerId: 0,
            //     duration: 500,
            //     destination: {
            //         longitude: location[0],
            //         latitude: location[1],
            //     },
            // })
            //更新地图marker标注点经纬度
            that.setState({
                sign_lng: location[0],
                sign_lat: location[1],
            })
        }
    }
    //手动获取时  点击地图获取坐标
    _view=(e:any)=> {
        let that = this;
        //获取选中经纬度
        let lat = e.detail.latitude;
        let lng = e.detail.longitude;
        //获取地图实例
        // var mapCtx = wx.createMapContext("myMap");
        //设置地图中心点
        // mapCtx.moveToLocation({
        //     longitude: lng,
        //     latitude: lat,
        // })
        // //平移标识点
        // mapCtx.translateMarker({
        //     markerId: 0,
        //     duration: 500,
        //     destination: {
        //         latitude: lat,
        //         longitude: lng,
        //     },
        // })
        //更新地图marker标注点经纬度
        that.setState({
            sign_lat: lat,
            sign_lng: lng,
            positionIndex: -1, //重置选中地址下标
            popupShow: true, //打开弹窗
        }, () => {
            //地址逆解析
            that._reverseGeocoder();
        })
    }
    /*********************************************************************
     * 获取用户当前坐标
     * *******************************************************************/
    getLocation=()=> {
        let that = this;
        //获取用户当前坐标
        // wx.getLocation({
        //     type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
        //     success: function (res) {
        //         //获取地图实例
        //         var mapCtx = wx.createMapContext("myMap");
        //         //平移标识点
        //         mapCtx.translateMarker({
        //             markerId: 0,
        //             duration: 500,
        //             destination: {
        //                 longitude: res.longitude,
        //                 latitude: res.latitude,
        //             },
        //         })
        //         //更新位置信息
        //         that.setState({
        //             latitude: res.latitude,
        //             longitude: res.longitude,
        //             sign_lat: res.latitude,
        //             sign_lng: res.longitude,
        //             positionVal: '', //关键字
        //             positionIndex: -1, //选中地址下标
        //             lastPositionVal: '', //上一次搜索框输入内容
        //             popupShow: false, //关闭底部弹窗
        //             addressArr: [], //重置搜索结果
        //             manualAddress: '', //手动地图选址
        //         }, () => {
        //             //地址逆解析
        //             that._reverseGeocoder();
        //         })
        //     },
        //     fail: function (res) {
        //         //关闭加载效果
        //         wx.hideLoading();
        //         //弹窗提示
        //         wx.showModal({
        //             title: '定位权限未开启',
        //             content: "您已拒绝小程序获取您的当前位置,请手动开启定位权限！",
        //             showCancel: false,
        //             confirmText: '关闭',
        //         })
        //     }
        // })
    }
    /*********************************************************************
     * 根据经纬度获取大概地理位置 地址逆解析
     * *******************************************************************/
    _reverseGeocoder=()=>{
        let that = this;
        //天地图地址逆解析
        let lonlat = CTSD.gcj02towgs84(Number(that.state.sign_lng), Number(that.state.sign_lat))
        // wx.request({
        //     url: api.geocoder,
        //     data: {
        //         postStr: {
        //             'lon': lonlat[0],
        //             'lat': lonlat[1],
        //             'ver': 1
        //         },
        //         type: 'geocode',
        //         tk: api.tdKey
        //     },
        //     method: 'GET',
        //     header: {
        //         'Content-Type': 'text/plain',
        //     },
        //     success: function (res) {
        //         if (res.statusCode == 200) {
        //             if (res.data.status == 0) {
        //                 let address = res.data.result.formatted_address + '附近';
        //                 that.setData({
        //                     manualAddress: address
        //                 }); //更新地址
        //             } else {
        //                 that.setData({
        //                     manualAddress: '查询地址失败'
        //                 }) //更新地址
        //             }
        //         } else {
        //             that.setData({
        //                 manualAddress: '查询地址失败'
        //             }) //更新地址
        //         }
        //         wx.hideLoading(); //关闭加载效果
        //     },
        //     fail: function (e) {
        //         that.setData({
        //             manualAddress: '查询地址失败'
        //         }) //更新地址
        //         wx.hideLoading(); //关闭加载效果
        //     }
        // })
    }

    //确认修改位置
    _modifyLocation=(e:any)=> {
        let that = this;
        let userId = that.state.userId;
        let deviceId = that.state.deviceId;
        let deviceName = that.state.deviceName;
        let linktype = that.state.linktype;
        let timescale = that.state.timescale;
        let top_index = Number(that.state.top_index);
        let index = Number(that.state.index);
        //地图marker标注点经纬度
        let lng = that.state.sign_lng;
        let lat = that.state.sign_lat;
        //火星坐标系转为百度坐标系
        let gcj02tobd09 = CTSD.gcj02tobd09(Number(lng),Number(lat));
        let bd_lng = gcj02tobd09[0];
        let bd_lat = gcj02tobd09[1];
        //弹出确认窗口
        // wx.showModal({
        //     title: '提示',
        //     content: '确认修改设备位置吗？',
        //     success(res) {
        //         if (res.confirm) {
        //             wx.showLoading({
        //                 title: '修改中...',
        //                 mask: true,
        //             }); //加载效果
        //             app.apiPost(api.updateDevice, {
        //                 userId: userId,
        //                 deviceId: deviceId,
        //                 deviceName: deviceName,
        //                 linkType: linktype,
        //                 timescale: timescale,
        //                 lat: bd_lat,
        //                 lng: bd_lng,
        //                 sensorList: [],
        //             }).then((data) => {
        //                 //关闭加载效果
        //                 wx.hideLoading();
        //                 wx.showToast({
        //                     title: data.msg,
        //                     icon: 'none',
        //                     duration: 3000
        //                 })
        //                 //修改上一页缓存数据
        //                 if (data.flag == '00') {
        //                     let pages = getCurrentPages();
        //                     let prePage = pages[pages.length - 2];
        //                     prePage.modifydeviceArr(top_index, index, bd_lng, bd_lat);
        //                 }
        //             }).catch((fail_message) => {
        //                 wx.hideLoading(); //关闭加载效果
        //                 //错误提示信息
        //                 wx.showToast({
        //                     title: fail_message,
        //                     icon: 'none',
        //                     duration: 3000
        //                 })
        //             });
        //         }
        //     }
        // })
    }
    render() {
        return (
        <View>
            <View style={styles.container_full}>
                {/* <map 
                    class="map"
                    id="myMap" 
                    latitude="{{latitude}}"
                    longitude="{{longitude}}"
                    scale="16" 
                    markers="{{markers_data}}"
                    show-location
                    show-scale
                    bindtap="_View"
                ></map> */}
                <MapView 
                        ref={(ref) => (_mapView = ref)}
                        myLocationEnabled={true}
                        initialCameraPosition={{
                            target: {
                                latitude: this.state.sign_lat,
                                longitude: this.state.sign_lng,
                            },
                            zoom: 18
                        }}
                        onPress={({ nativeEvent }) => this._view(nativeEvent)}
                        onLoad={()=>this.onLoad}
                        >
                            <Marker
                                icon={require('../../image/dw.png')}
                                position={{
                                    latitude: this.state.sign_lat,
                                    longitude: this.state.sign_lng 
                                }}
                            />
                        </MapView>
                {/*搜索框 */}
                <View class="search">
                    {/*输入框搜索 */}
                    <View class="input">
                        <View class="mapMenu" bindtap="_mapMenu">
                            <image class="img"  src='../../image/mapMenu.png'></image>
                        </View>
                        <input 
                            class='in'
                            value="{{positionVal}}"
                            name="name"
                            bindinput="bindKeywordsName"
                            bindblur='blurKeywordsName'
                            placeholder="输入关键字搜索位置"
                        ></input>
                        <View class="but" bindtap="_search">
                            <image class="ico"  src='../../image/se.png'></image>
                        </View>
                    </View>
                </View>

                {/* 修改设备位置 */}
                <View class="modifyLocation" bindtap="_modifyLocation">
                    提交修改
                </View>
                {/* 地址列表 */}
                <van-popup 
                    show="{{ popupShow }}"
                    position="bottom"
                    overlay="{{false}}"
                    bind:close="onClose"
                    custom-style="width:100%;height:45%;"
                >
                    <View class="popupHead">
                        选择位置
                        <View class="popupClose" bindtap="onClose">
                            <image class="ico"  src='../../image/search-close.png'></image>
                        </View>
                    </View>

                    <View class="popup">
                    
                        <block wx:if="{{manualAddress!=''}}">
                            <View class="manualAddress">
                            {{manualAddress}}   
                            </View>
                        </block>

                        <View class="popupCon">
                            <block wx:if="{{addressArr.length > 0}}">
                                <View class="list {{index == positionIndex?'on':''}}" wx:for="{{addressArr}}" wx:key="id" data-index="{{index}}" bindtap="_select">
                                    <View class class="flex">
                                        <View class="name">
                                            {{item.name}}      
                                        </View>
                                        <View class="address">
                                            {{item.province}}{{item.city}}{{item.county}}{{item.address}}  
                                        </View>
                                    </View>
                                </View>
                            </block>
                            <block wx:else>
                                <View class="empty">
                                    暂无查询内容.
                                </View>
                            </block>
                        </View>
                    </View>
                </van-popup>
            </View>
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

const styles = StyleSheet.create({
    container_full:{

    },
})