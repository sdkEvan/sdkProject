/* 聚类函数 */
exports.gatherArrtoJson = function () {
    var key_arr = [];
    var output = {};
    arr.map((v, i) => {
        v.index = i;
        if (key_arr.indexOf(v[key]) >= 0) {

            output[v[key]].push(v)
        } else {
            key_arr.push(v[key]);
            output[v[key]] = [v];
        }
    })

    return output;
}
/* 补全对象的key 返回同一个引用地址
*   @args| array  |keys 键名
    @obj | object
*/
exports.fillKey = function (obj,args) {
    var currentobj=obj;
    args.map(v=>{
        if(!currentobj.hasOwnProperty(v)){
            currentobj[v]={};
        }
        currentobj=currentobj[v];
    })
    return currentobj;
}

/* 获取当前日期 y-m-d */
exports.getNowDate = function(){
    let tDate = new Date();
    let Y = tDate.getFullYear() + '-';
    let M = (tDate.getMonth()+1 < 10 ? '0'+ (tDate.getMonth()+1) : tDate.getMonth()+1) + '-';
    let D = tDate.getDate() < 10 ? '0' + tDate.getDate() : tDate.getDate();
    let str = Y + M + D;
    return str;
}

/* 获取本月第一天 y-m-d */
exports.getFirstDate = function(){
    let tDate = new Date();
    let Y = tDate.getFullYear() + '-';
    let M = (tDate.getMonth()+1 < 10 ? '0'+(tDate.getMonth()+1) : tDate.getMonth()+1) + '-';
    let str = Y + M + '01';
    return str;
}

/* （Y-M-D h:i:s）格式转时间戳
*   @dateValue （Y-M-D h:i:s）格式的时间
*   @return 时间戳以（秒/S）为单位
*/
exports.getTimestamp = function(dateValue){
    let timestamp = Date.parse(new Date(dateValue)) / 1000;
    return timestamp; 
}

/*  时间戳转（Y-M-D h:i:s）格式
*   @timestamp 时间戳以（毫秒/ms）为单位
*   @return （Y-M-D h:i:s）时间
*/
exports.getNormalDate = function(timestamp){
    let tDate = new Date(timestamp);
    let Y = tDate.getFullYear() + '-';
    let M = (tDate.getMonth()+1 < 10 ? '0'+ (tDate.getMonth()+1) : tDate.getMonth()+1) + '-';
    let D = (tDate.getDate() < 10 ? '0' + tDate.getDate() : tDate.getDate()) + ' ';
    let h = (tDate.getHours() < 10 ? '0' + tDate.getHours() : tDate.getHours())+ ':';
    let m = (tDate.getMinutes() < 10 ? '0' + tDate.getMinutes() : tDate.getMinutes()) + ':';
    let s = tDate.getSeconds() < 10 ? '0' + tDate.getSeconds() :tDate.getSeconds(); 
    let pDate = Y + M + D + h + m + s;
    return pDate; 
}

/* GMT转普通格式(含时分秒) */
exports.GMTToDatetime = function(time){
    let date = new Date(time);
    let str = date.getFullYear() + '-' +
    (date.getMonth() + 1) + '-' + 
    date.getDate() + ' ' + 
    date.getHours() + ':' + 
    date.getMinutes() + ':' + 
    date.getSeconds();
    return str
}

/* GMT转普通格式(不含时分秒) */
exports.GMTToDate = function(time){
    let date = new Date(time);
    let str = date.getFullYear() + '-' +
    (date.getMonth() + 1) + '-' + 
    date.getDate();
    return str
}

/* 普通格式转GMT */
exports.strToGMT = function(time){
    let GMT = new Date(time);
    return GMT;
}

/* 金额格式化 */
/* exports.money = function(m){
    return m.toString().split('').reverse().join('').replace(/(\d{3}(?=\d)(?!\d+\.|$))/g, '$1,').split('').reverse().join('');
} */

/* 金额格式化 */
exports.money = function(s, n){   
    n = n > 0 && n <= 20 ? n : 2;   
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
    var l = s.split(".")[0].split("").reverse(),   
    r = s.split(".")[1];   
    t = "";   
    for(i = 0; i < l.length; i ++ ){   
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }   
    return t.split("").reverse().join("") + "." + r;   
} 

/* 获取数组中最大值
*  [1,22,5,8,9]
*/
exports.arrMax = function(arr){
    let max = Number(arr[0]);
    arr.forEach( v => {
        if(Number(v) > max){
            max = v;
        }
    })
    return Math.ceil(max);
}

/* 判断某一元素是否在数组中 */
exports.inArray = function(str,arr){
    for(let i in arr){
        if(str == arr[i]){
            return true;
        }
    }
    return false;
}

/* 获取session的值 */
exports.getSession = function(str){
    return JSON.parse(sessionStorage.getItem(str));
}

