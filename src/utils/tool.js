//手机号正则
function regMobile(mobile) {
    var regMobile = /^1(3|4|5|7|8|9)\d{9}$/;	//手机号码格式：1开头接着3或4或5或7或8或9接着9位
    return regMobile.test(mobile) ? true : false;
  }
  //邮箱正则
  function regEmail(email) {
    let regEmail = /^([a-zA-Z0-9.]*[-_]?[a-zA-Z0-9]+)*@([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)+[\\.][A-Za-z]{2,3}([\\.][A-Za-z]{2})?$/;
    return regEmail.test(email) ? true : false;
  }
  //纯数字正则
  function regNumber(name) {
    var regName = /^[0-9]+$/;
    return regName.test(name) ? true : false;
  }
  //字母正则
  function regLetter(name) {
    var regName = /^[A-Za-z]+$/;
    return regName.test(name) ? true : false;
  }
  //是否为纯数字加字母
  function isNumberAndLetter(str) {
    var numberCount = 0, letterCount = 0, otherCount = 0;
    for (var i = 0; i < str.length; i++) {
      if (regNumber(str[i])) {
        numberCount++;
      } else if (regLetter(str[i])) {
        letterCount++;
      } else {
        otherCount++;
      }
    }
    if (numberCount > 0 && letterCount > 0 && otherCount >= 0) {
      return true;
    } else {
      return false;
    }
  }
  /** 生成随机数 **/
  var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'r', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  function randomNum(num) {
    var res = "";
    for (var i = 0; i < num; i++) {
      var id = Math.ceil(Math.random() * 35);
      res += chars[id];
    }
    return res;
  }
  //截取小数位
  function getPointNum(a, num) {
      var a_type = typeof (a);
      if (a_type == "number") {
        var aStr = a.toString();
        var aArr = aStr.split('.');
      } else if (a_type == "string") {
        var aArr = a.split('.');
      }
      if (aArr.length > 1) {
        a = aArr[0] + "." + aArr[1].substr(0, num);
      }
      return a
  }
  //任意字符串替换星号
  function allData(data) {
    return data.substr(0, 3) + '****' + data.substr(7, data.split('').length);
  }
  //验证固定电话
  function integer(data){
    var integer = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
    return integer.test(data) ? true : false;
  }
  //验证正负正数 浮点数
  function plusMinus(data){
    let plusMinus = /(^[\-0-9][0-9]*(.[0-9]+)?)$/;
    return plusMinus.test(data) ? true : false;
  }
  //验证 字母 或字母+数字 或纯数字
  function zmsi(data){
    let zmsi = /^[0-9a-zA-Z]*$/g;
    return zmsi.test(data) ? true : false;
  }
  
  module.exports = {
    regMobile : regMobile,//手机正则验证
    regEmail: regEmail,//邮箱正则
    isNumberAndLetter: isNumberAndLetter,//校验密码是否为数组+字母
    regNumber: regNumber,//校验是否为纯数字
    randomNum: randomNum,//生成随机数
    getPointNum: getPointNum,//截取小数位
    allData: allData,//任意字符串替换星号
    integer: integer,//验证固定电话
    plusMinus: plusMinus,//验证正负正数 浮点数
    zmsi: zmsi,//验证 字母 或字母+数字 或纯数字
  }