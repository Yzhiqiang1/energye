import {Text, View, Image, TextInput, ScrollView, Dimensions, Pressable, SafeAreaView, TouchableHighlight} from 'react-native'
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import styleg from '../../indexCss'//公共样式
import {HttpService} from '../../utils/http'
import { Register } from '../../utils/app'
import { store } from '../../redux/storer'
import Loading from '../../component/Loading/Loading'
import { Icon } from '@rneui/base'
import { Shadow } from 'react-native-shadow-2';

const api = require('../../utils/api')
const Fs = Dimensions.get('window').width*0.8
const ht = Dimensions.get('window').height*0.8

export class Configuration extends Component<any,any> {
  constructor(props: any){
    super(props)
    this.state = {
        LoginStatus: 1, //登录状态 默认未登录
        searchVal: '', //关键字搜索
        objList: '', //云组态信息
        objArr: [], //云组态列表
        page: 1, //当前分页
        pageSize: 8, //每页条数
        isPageLoad: true, //加载中效果
        isLastPage: false, //是否加载最后一页
        scrollIs: true, //滚动中禁止重复滚动
        boxHeight: 0,

        msgType: 1,
        LoadingMsg: '',
        visible: false,
    }
  }
  
  componentDidMount(){
    let that = this;
    // 调用登录验证
    Register.userSignIn(false).then(res => {
        //校验登录成功后执行
        if (res == true) {
            //登录状态
            this.setState({
                LoginStatus: 2
            }, () => {
                //校验通过后调用方法
                that.check_ok();
            })
        }
    });
  }
  boxH=(e: any)=>{
    const { height: newHeight } = e.nativeEvent.layout;
    this.setState({
        boxHeight: newHeight
    })
  }
  /************************************
   *     校验登录通过
   * *****************************/
  check_ok(){
    this.getFirst();
  }
  //首次查询
  getFirst(){
    let that = this;
    // 加载效果
    this.setState({
        msgType: 1,
        visible: true,
        LoadingMsg: '查询中...'
    })
    //查询数据
    that.setState({
        page: 1,
        scrollIs: true,
        isLastPage: false,
    }, () => {
        that.yunzutaiList(1);
    })
  }
  //关键字搜索
  _search=(value: any)=>{
    this.setState({
      searchVal:value
    })
  }
  //提交搜索
  searchSubmit=()=>{
    if (this.state.searchVal != "") {
        this.getFirst();
    } else {
        //错误提示信息
        this.setState({
          msgType: 2,
          visible: true,
          LoadingMsg: '关键字不能为空'
        },()=>{
            setTimeout(()=>{
                this.setState({
                    visible: false,
                })
            },2000)
        })
    }
  }
  //重置关键字搜索
  searchClose = ()=>{
    this.setState({
      searchVal:''
    },() => {
      this.getFirst();
    })
  }
  //滚动查询
  downScroll = (e: any) => {
    let that = this;
    let offsetY = e.nativeEvent.contentOffset.y; //滑动距离
    let contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
    let oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
    //滑动触底触发
    if (offsetY + oriageScrollHeight >= contentSizeHeight-5){
      if (that.state.scrollIs == true) {
        //是否为最后一页
        if (that.state.isLastPage == false) {
            let page = that.state.page + 1; //分页+1
            that.setState({
                page: page,
                scrollIs: false,
                isPageLoad: false,
            }, () => {
                //查询数据
                that.yunzutaiList(2);
            })
        }
      }
    }
  }
  //查询云组态列表
  yunzutaiList(type: number){
    let that = this;
    let userId = store.getState().userId; //用户ID
    let page = that.state.page; //当前分页
    let pageSize = that.state.pageSize; //每页条数
    let keywords = that.state.searchVal; //关键字
    HttpService.apiPost(api.yunzutaiList,{
      userId: userId,
      page: page,
      status: 1,
      keywords: keywords,
      pageSize: pageSize
    }).then((res:any)=>{
      this.setState({
        visible: false
      })
      if (res.flag == "00") {
        if (type == 1) {
            that.setState({
                objList: res.data,
                objArr: res.data.yunzutaiList,
                isLastPage: pageSize * page <= res.data.rowCount ? false : true,
            })
        } else if (type == 2) {
            that.setState({
                objList: res.data,
                objArr: that.state.objArr.concat(res.data.yunzutaiList),
                isLastPage: pageSize * page <= res.data.rowCount ? false : true,
            })
        }
      } else {
        this.setState({
          msgType: 2,
          visible: true,
          LoadingMsg: res.msg
        },()=>{
            setTimeout(()=>{
                this.setState({
                    visible: false,
                })
            },2000)
        })
      }
    }).catch((res)=>{
      console.log(res);
    })
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{position: 'absolute',top: 0,width: "100%",height: "100%",backgroundColor: '#2da2fe'}}>
        </View>
        <Loading
            type={this.state.msgType}
            LoadingMsg={this.state.LoadingMsg}
            visible={this.state.visible}
        ></Loading>
        <SafeAreaView style={{flex: 1}}>
          <View style={styleg.containerMax} onLayout={(event) => this.boxH(event)}>
            <View style={styles.nav}>
              <Pressable style={styles.navLeft} onPress={()=>{this.props.navigation.navigate('HomeBar')}}>
                  <Icon
                      name='left'
                      type='antdesign'
                      color='#fff'
                      size={22}
                  />
                  <Text allowFontScaling={false} style={styles.text}>首页</Text>
              </Pressable>
              <Text style={styles.navName} allowFontScaling={false}>云组态</Text>
            </View>

            <View style={styles.head}>
              <View style={styles.search}>
                  <View style={styles.flex}>
                      <TextInput allowFontScaling={false} style={styles.input} value={this.state.searchVal} placeholder='关键字搜索' onChangeText={this._search} ></TextInput>
                      {this.state.searchVal!=''?
                        <Pressable style={styles.close} onPress={this.searchClose}>
                            <Image style={styles.closeimg} source={require('../../image/search-close.png')}></Image>
                        </Pressable>:''
                      }
                  </View>
                  <TouchableHighlight style={styles.button} onPress={this.searchSubmit} underlayColor={'#2da2fe'}>
                      <View style={{width: '100%', height: '100%'}} >
                        <Image style={styles.ico} source={require('../../image/searcha.png')} ></Image>
                        <Text style={styles.searchT} allowFontScaling={false}>搜索</Text>
                      </View>
                  </TouchableHighlight>
              </View>
              <View style={styles.allowance}>
                  <Text style={styles.name} allowFontScaling={false}>我的组态</Text>
                  <View style={styles.number}>
                    <View style={styles.numberSpot1}></View>
                    <Text style={styles.Spot} allowFontScaling={false}>总计 {this.state.objList.cfgnum}</Text>
                  </View>
                  <View style={styles.number}>
                    <View style={styles.numberSpot2}></View>
                    <Text style={styles.Spot} allowFontScaling={false}>已用 {this.state.objList.count}</Text>
                  </View>
                  <View style={styles.number}>
                    <View style={styles.numberSpot3}></View>
                    <Text style={styles.Spot} allowFontScaling={false}>剩余 {this.state.objList ? this.state.objList.cfgnum - this.state.objList.count:''}</Text>
                  </View>
              </View>
            </View>

            <ScrollView style={[styles.view,{height:this.state.boxHeight-ht/6-ht/10-5}]} onMomentumScrollEnd={this.downScroll} overScrollMode={'never'}>
                {this.state.LoginStatus == 2?
                  <View style={styles.box}>
                  {this.state.objArr.map((data:any, index:any) => {
                    return (
                      <Shadow key={index} style={styles.item} distance={5} offset={[-1, 1]}>
                          <Pressable
                            style={({ pressed }) => [{backgroundColor: pressed ? '#ededed': 'white'}]}
                            onPress={()=>{this.props.navigation.navigate('ConfigurationDetails',{url:data.url,name:data.appname})}}
                          >
                              <View style={styles.images}>
                                  {data.appicon?
                                    <Image style={styles.img} source={{uri: `${data.appicon}`}}></Image>:
                                    <Image style={styles.img} source={require('../../image/Not.png')}></Image>
                                  }
                              </View>
                              <Text style={styles.Scrollname} allowFontScaling={false} numberOfLines={1} ellipsizeMode='tail'>{data.appname}</Text>
                          </Pressable>
                        </Shadow>
                    );
                  })}
                  </View> : ''  
                }
                {this.state.LoginStatus == 2?
                  <View>
                    {this.state.objArr.length > 0 && this.state.isLastPage == true?
                      <Text style={styles.isPageTxt} allowFontScaling={false}>
                          已加载所有数据
                      </Text> : ''
                    }
                  
                    {this.state.objArr.length == 0 && this.state.isPageLoad == true?
                      <Text style={styles.nothing} allowFontScaling={false}>
                        未查询到数据
                      </Text>:''
                    }
                    
                    {this.state.isPageLoad?
                      <View style={styles.isPageLoad}>
                        <View style={styles.load}></View>
                      </View>:''
                    }
                  </View> :
                    <Text style={styles.notLoggedIn} allowFontScaling={false}>
                        您还未登录
                        <Text style={styles.url} onPress={()=>this.props.navigation.navigate('BindAccount')}>点击登录</Text>
                    </Text> 
                }
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  nav:{
    position:'relative',
    height: ht/10,
    backgroundColor:'#2ea4ff',
  },
  navLeft:{
    position:'absolute',
    left: 5,
    top: '50%',
    marginTop: -15,
    zIndex:999,
    width: 100,
    height: 30,
    display:'flex',
    flexDirection: 'row',
    alignItems:'center',
  },
  navImg:{
    width:25,
    height:25,
  },
  navName:{
    height:ht/10,
    lineHeight:ht/10,
    textAlignVertical: 'center',
    textAlign:'center',
    fontSize: Fs/16,
    color:'#fff'
  },
  head:{
    position: 'absolute',
    top: ht/10,
    left: 0,
    width: '100%',
    height: ht/6,
    paddingRight:10,
    paddingLeft:10,
    backgroundColor: '#fff',
    overflow: 'hidden', 
  },
  search:{
    position: 'relative',
    width: '100%',
    height: ht/6/2,
    marginTop: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  flex:{
    position: 'relative',
    flex: 1,
    width: 0,
  },
  input:{
    position: 'relative',
    width: '100%',
    height: 40,
    paddingLeft: 5,
    paddingRight: 5,
    color: '#333',
    fontSize: Fs/20,
    borderStyle: 'solid',
    borderWidth:1,
    borderColor: '#f2f2f2',
    borderRadius: 5,
    zIndex: 1,
    overflow: 'hidden',
  },
  close:{
    position: 'absolute',
    top: 0,
    right: 0,
    width: 38,
    height: 38,
    padding: 9,
    zIndex: 99999,
    overflow: 'hidden',
  },
  closeimg:{
    width: '100%',
    height: '100%',
  },
  button:{
    position: 'relative',
    width: 80,
    height: 35,
    paddingRight:15,
    color: '#fff',
    backgroundColor: '#1890FF',
    borderRadius: 5,
    marginLeft: 15,
    overflow: 'hidden',
  },
  searchT:{
    height: 35,
    textAlign: 'right',
    lineHeight: 35,
    textAlignVertical: 'center',
    color:'#fff',
    fontSize: Fs/20,
  },
  ico:{
    position: 'absolute',
    top:8,
    left:10,
    width: 20,
    height: 20,
    zIndex: 999999,
    overflow: 'hidden'
  },
  allowance:{
    position: 'relative',
    width: '100%',
    height: ht/12,
    display: 'flex',
    flexDirection:'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  name:{
    position: 'relative',
    width: 'auto',
    lineHeight: 35,
    marginRight: 10,
    color: '#1890FF',
    fontWeight: '700',
    fontSize: Fs/20,
    overflow: 'hidden',
  },
  number:{
    position: 'relative',
    marginRight: 5,
    marginLeft: 5,
    width: 'auto',
    height: 30,
    paddingLeft: 12,
    paddingRight:12,
    overflow: 'hidden',
  },
  Spot: {
    height: 30,
    color: '#333',
    fontSize: Fs/24,
    lineHeight: 30,
    textAlignVertical: 'center',
  },
  numberSpot1:{
    position:'absolute',
    top:12,
    left:0,
    width: 8,
    height: 8,
    backgroundColor: '#33bcdd',
    borderRadius: 4,
    overflow: 'hidden',
  },
  numberSpot2:{
    position:'absolute',
    top:10,
    left:0,
    width: 8,
    height: 8,
    backgroundColor: '#ffc133',
    borderRadius: 4,
    overflow: 'hidden',
  },
  numberSpot3:{
    position:'absolute',
    top:10,
    left:0,
    width: 8,
    height: 8,
    backgroundColor: '#ff335a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  view:{
    position: 'absolute',
    top: ht/6+ht/10+5,
    padding: 5,
    width: '100%',
    backgroundColor: '#fff',
  },
  box:{
    width:'100%',
    display:'flex',
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'space-between',
    paddingTop: 5,
    paddingRight: 5,
    paddingLeft: 5,
  },

  item:{
    position: 'relative',
    overflow: 'hidden',
    width: Dimensions.get('window').width/2 - 15,
    marginBottom: 10,
    borderRadius: 2,
    // shadowColor: '#000', // 阴影颜色
    // shadowOffset: { // 阴影的水平和垂直偏移量
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25, // 阴影的透明度
    // shadowRadius: 3.84, // 阴影的模糊半径
    // elevation: 5, // Android 阴影设置
  },
  images:{
    position: 'relative',
    width: '100%',
    height: 110,
    overflow: 'hidden',
    paddingLeft: 10,
    paddingRight: 10,
  },
  img:{
    width: '100%',
    height: '100%',
  },
  Scrollname:{
    position: 'relative',
    width: '100%',
    height: 40,
    lineHeight: 40,
    textAlign: 'center',
    fontSize: Fs/20,
    color: '#333333',
    overflow: 'hidden',
    paddingLeft: 30,
    paddingRight: 30
  },
  isPageTxt:{
    position: 'relative',
    width: '100%',
    height: 40,
    lineHeight: 40,
    textAlign: 'center',
    fontSize: Fs/20,
    color: '#666',
    marginBottom: 10,
    overflow: 'hidden',
  },
  nothing:{
    position: 'relative',
    width: '100%',
    height: 35,
    lineHeight: 35,
    fontSize: Fs/18,
    color: '#999',
    textAlign: 'center',
    overflow: 'hidden',
  },
  isPageLoad:{
    position: 'relative',
    width: '100%',
    overflow: 'hidden'
  },
  load:{},
  notLoggedIn:{
    position: 'relative',
    width: '100%',
    height: 35,
    lineHeight: 35,
    fontSize: Fs/24,
    color: '#999',
    textAlign: 'center',
    overflow: 'hidden',
  },
  url:{
    color: '#4395ff',
    textDecorationLine:'underline',
    fontSize: Fs/24,
  },
  text: {
    fontSize: Fs/18,
    color: '#fff'
  }
})

export default Configuration