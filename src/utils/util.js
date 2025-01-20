import { t } from 'i18next'
//获取年月日时分秒
const formatTime = function(date,sep,type) {
  let _sep = sep ? sep : '/';
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  if(type == 1){
    return [year, month, day].map(formatNumber).join(_sep) + ' ' + [hour, minute].map(formatNumber).join(':')
  }else{
    return [year, month, day].map(formatNumber).join(_sep) + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
}
//获取年月日时分秒 无分隔符
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('')  + [hour, minute, second].map(formatNumber).join('')
}
//获取年月日
const formatData = function(date,sep) {
  let _sep = sep ? sep : '/';
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join(_sep);
}
//加减日期 
const plusReduceData = function(data,type,num){
  let _num = num ? num : 1; 
  let timeStamp = new Date(data).getTime();
  let oneDay = (24*60*60*1000) * _num;
  let handleData = type == 1 ? timeStamp - oneDay : timeStamp + oneDay;
  let newData = formatData(new Date(handleData),'-')
  return newData;
}
//获取当前时间(加减时间戳可获取前后时间)
const getTime = function(num){
  let _num = num ? num : 0; 
  let _timestamp = new Date().getTime() - _num;
  let _time = formatTime(new Date(_timestamp),'-');
  return _time;
}
//数组分割成字符串
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//实例化当前年月日
function nowDate(type){
  let myDate = new Date();
  let n = myDate.getFullYear();
  let y = myDate.getMonth() + 1;
  let r = myDate.getDate();
  if (y < 10) {
    y = "0" + y;
  }
  if (r < 10) {
    r = "0" + r;
  }
  var nowDate = type == 2 ? n : type == 1 ? n + "-" + y : n + "-" + y + "-" + r;
  return nowDate;
}
//返回当前原始单个 年 月  日  时  分 秒  【1：毫秒  2：分钟  3：时 4：日  5:月  其他：年】
function oneData(type){
  let myDate = new Date();
  let n = myDate.getFullYear();
  let y = myDate.getMonth();
  let r = myDate.getDate();
  let h = myDate.getHours();
  let m = myDate.getMinutes();
  let s = myDate.getTime();
  var nowDate = type == 1 ? s : type == 2 ? m : type == 3 ? h : type == 4 ? r : type == 5 ? y : n;
  return nowDate;
}
//获取当月天数 数组
function mGetDate(year,month){
  var d = new Date(year, month, 0);
  let arr = [];
  for(var i = 0; i < d.getDate(); i++){
    arr.push(i < 9 ? '0' + (i+1) : i+1);
  }
  return arr;
}
//获取指定月份 有几周
function getWeek(year, month) {
  let d = new Date();
  //第一天是星期几
  d.setFullYear(year, month-1, 1);
  let w1 = d.getDay();
  if (w1 == 0){
    w1 = 7;
  }
  //每月总天数
  d.setFullYear(year, month, 0);
  let dd = d.getDate();
  //第一个星期一
  let d1 = '';
  if (w1 != 1){
    d1 = 7 - w1 + 2;
  }else{
    d1 = 1;
  }
  let week_count = Math.ceil((dd-d1+1)/7);
  let arrWeek = {
    value:[],
    data:[],
  }
  for(let i = 0; i < week_count; i++) {
    let monday = d1+i*7;
    let sunday = monday + 6;
    let _monday = monday < 10 ? '0'+monday : monday;
    let from = year+"-"+month+"-"+ _monday;
    let to;
    if (sunday <= dd) {
        to = year+"-"+month+"-"+sunday;
    } else {
        d.setFullYear(year, month-1, sunday);
        to = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    }
    arrWeek.value.push(t('di')+(i+1)+t('week')+" (" + from + t('to') + to + ")");
    arrWeek.data.push([t('di')+(i+1)+t('week'),from,to]);
  }
  return arrWeek;
}
//时间戳转换
export function getTransition(timestamp,type) {
  let time = new Date(timestamp)
  let fullYear = time.getFullYear()
  let month = time.getMonth() + 1
  let date = time.getDate()
  let hours = time.getHours()
  let minutes = time.getMinutes()
  if(month<10){
      month = '0' + month
  }
  if(date<10){
      date = '0' + date
  }
  if(hours<10){
    hours = '0' + hours
  }
  if(minutes<10){
    minutes = '0' + minutes
  }
  if(type == 1){
    return fullYear + '-' + month + '-' + date
  }else if(type == 2){
    return fullYear + '-' + month 
  }else if(type == 3){
    return fullYear + '-' + month + '-' + date + ' ' + hours + ':' + minutes
  }else if(type == 4){
    return fullYear
  }else if(type == 5){
    return fullYear + '-' + month + '-' + date + ' ' + hours + ':' + minutes
  }

}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  nowDate: nowDate,
  getTime:getTime,
  plusReduceData: plusReduceData,
  oneData: oneData,
  mGetDate: mGetDate,
  getWeek: getWeek,
  getTransition: getTransition,
}
  