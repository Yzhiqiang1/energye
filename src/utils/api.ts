//云平台部署时使用
let RootPath = 'https://api.energye.cn';

// let RootPath = 'http://192.168.1.76:9000';

let Imgurl = 'https://ui.dtuip.com';
module.exports = {
    imgurl: Imgurl, //图片路径
    rootPath: RootPath, //根目录
    token: RootPath + '/oauth/token?grant_type=client_credentials', //获取token
    bindLogin: RootPath + '/api/user/bindLogin', //绑定openId登录
    login: RootPath + '/api/user/miniAppLogin', //微信小程序帐号密码登录
    applogin: RootPath + '/api/user/appLogin', //APP帐号密码登录
    getVerifyCode: RootPath + '/api/user/verifyCode', //获取验证码
    verifyCodeLogin: RootPath + '/api/user/verifyCodeLogin', //验证码登录
    appVerifyCodeLogin: RootPath + '/api/user/appVerifyCodeLogin',//APP验证码登录
    register: RootPath + '/api/user/register', //注册
    appRegister: RootPath + "/api/user/appRegister",//APP注册
    signOut: RootPath + '/api/user/signOut', //退出登录
    appSignOut: RootPath + '/api/user/appSignOut',//APP退出登录

    
    getGroup: RootPath + '/api/common/getGroup', //获取用户回路分组
    getTree: RootPath + '/api/common/getTree', //获取分组树形
    getMonitor: RootPath + '/api/common/getMonitor', //获取摄像头

    getPart: RootPath +  "/api/system/getPart",//用能概况-环比
    getEnergy: RootPath +  "/api/system/getEnergy",//用能概况-历史趋势
    getDayLoad: RootPath +  "/api/system/getDayLoad",//用能概况-日平均负荷
    scanCodeCreateDevice: RootPath +  "/api/wechat/scanCodeCreateDevice",//扫码创建设备
    appScanCodeCreateDevice: RootPath +  "/api/wechat/appScanCodeCreateDevice",//扫码创建设备


    getCharData: RootPath + '/api/power/data/getChartData',//日原数据-折线
    getExtreme: RootPath + '/api/power/data/getExtreme',//逐日极值数据
    getTbaleData: RootPath + '/api/power/runreport/getTbaleData',//电力运作报表
    getTbaleDayData: RootPath + '/api/power/extremum/getTbaleDayData',//电力极值报表 日报
    getTbaleMonthData: RootPath + '/api/power/extremum/getTbaleMonthData',//电力极值报表 月报
    avr_getTbaleData: RootPath + '/api/power/monthreport/getTbaleData',//平均功率因数 月报
    avr_getYearData: RootPath + '/api/power/monthreport/getYearData',//平均功率因数 年报  
    getTbaleHourData: RootPath + '/api/power/hourreport/getTbaleHourData',//电力运行日报
    getTbaleHarmonicData: RootPath + '/api/electricity/harmonic/getData',//谐波检测


    ynbb_getDayData: RootPath +  "/api/analysis/energy/getDayData",//用能报表-日报
    ynbb_getMonthData: RootPath +  "/api/analysis/energy/getMonthData",//用能报表-月报
    ynbb_getYearData: RootPath +  "/api/analysis/energy/getYearData",//用能报表-年报
    tbfx_getData: RootPath +  "/api/analysis/compare/getData",//同比分析
    hb_getDayData: RootPath +  "/api/analysis/relative/getDayData",//环比分析-日报
    hb_getWeekData: RootPath +  "/api/analysis/relative/getWeekData",//环比分析-周报
    hb_getMonthData: RootPath +  "/api/analysis/relative/getMonthData",//环比分析-月报
    sh_getData: RootPath +  "/api/analysis/loss/getData",//损耗分析
    dnjc_getData: RootPath +  "/api/analysis/setcopy/getData",//电能集抄
    jfpg_getData: RootPath +  "/api/analysis/daypart/getData",//尖峰平谷
    fybb_getDayData: RootPath +  "/api/analysis/bill/getDayData",//费用报表-日报
    fybb_getMonthData: RootPath +  "/api/analysis/bill/getMonthData",//费用报表-月报
    fybb_getYearData: RootPath +  "/api/analysis/bill/getYearData",//费用报表-年报
    zdxl_getData: RootPath +  "/api/analysis/demandreport/getData",//最大需量


    ysbb_getDayData: RootPath +  "/api/water/water/getDayData",//用水报表-日报
    ysbb_getMonthData: RootPath +  "/api/water/water/getMonthData",//用水报表-月报
    ysbb_getYearData: RootPath +  "/api/water/water/getYearData",//用水报表-年报
    tbfx_water_getData: RootPath +  "/api/water/compare/getData",//同比分析
    hb_water_getDayData: RootPath +  "/api/water/relative/getDayData",//环比分析-日报
    hb_water_getWeekData: RootPath +  "/api/water/relative/getWeekData",//环比分析-周报
    hb_water_getMonthData: RootPath +  "/api/water/relative/getMonthData",//环比分析-月报
    sh_water_getData: RootPath +  "/api/water/loss/getData",//损耗分析
    snjc_water_getData: RootPath +  "/api/water/setcopy/getData",//水能集抄


    yqbb_getDayData: RootPath +  "/api/gases/gases/getDayData",//用气报表-日报
    yqbb_getMonthData: RootPath +  "/api/gases/gases/getMonthData",//用气报表-月报
    yqbb_getYearData: RootPath +  "/api/gases/gases/getYearData",//用气报表-年报
    tbfx_gases_getData: RootPath +  "/api/gases/compare/getData",//同比分析
    hb_gases_getDayData: RootPath +  "/api/gases/relative/getDayData",//环比分析-日报
    hb_gases_getWeekData: RootPath +  "/api/gases/relative/getWeekData",//环比分析-周报
    hb_gases_getMonthData: RootPath +  "/api/gases/relative/getMonthData",//环比分析-月报
    sh_gases_getData: RootPath +  "/api/gases/loss/getData",//损耗分析
    qnjc_gases_getData: RootPath +  "/api/gases/setcopy/getData",//气能集抄


    ldjc_getData: RootPath +  "/api/safe/leakage/getData",//获取漏电检测数据
    ldjc_getVoltage: RootPath +  "/api/safe/leakage/getVoltage",//获取漏电-查看电流历史
    ldjc_getTemperature: RootPath +  "/api/safe/leakage/getTemperature",//获取漏电-查看温度历史
    kgkz_getData: RootPath +  "/api/safe/switch/getSwitchData",//获取开关控制数据
    kgkz_sendData: RootPath +  "/api/safe/switch/sendData",//开关控制
    kgjc_getData: RootPath +  "/api/safe/switchMonitor/getSwitchData",//开关监测
    
    kgkz_getHistory: RootPath +  "/api/safe/switch/getHistory",//开关控制-查看历史
    kgjc_getHistory: RootPath +  "/api/safe/switchMonitor/getHistory",//开关监测-查看历史
    sxt_getData: RootPath +  "/api/common/getData",//获取摄像头

    // ysToken: 'https://open.ys7.com/api/lapp/token/get',//获取萤石云Token

    getAccessToken: 'https://open.ys7.com/api/lapp/token/get',//获取萤石云最新AccessToken
    videoTime: 'https://open.ys7.com/api/lapp/video/by/time',//获取萤石云视频时间轴
    videoAddress: 'https://open.ys7.com/api/lapp/v2/live/address/get',//获取萤石云视频地址


    yunzutaiList: RootPath +  "/api/yunzutai/list",//云组态

    ph_getLoadList: RootPath + "/api/safe/ph/getLoadList",//PH值-查询列表
    ph_getChart: RootPath + "/api/safe/ph/getChart",//PH值
    xdl_getLoadList: RootPath +  "/api/safe/current/getLoadList",//相电流-查询列表
    xdl_getChart: RootPath +  "/api/safe/current/getChart",//相电流


    websocketUrl: 'wss://wss.energye.cn/?chat=',//实时数据链接

    geocoder: 'https://api.tianditu.gov.cn/geocoder',//天地图地址逆解析
    tdSearch:'https://api.tianditu.gov.cn/v2/search',//天地地图普通 搜索服务
    tdKey: '94981833f780294d46dbf89a3bc14b41',//天地图key
  
};