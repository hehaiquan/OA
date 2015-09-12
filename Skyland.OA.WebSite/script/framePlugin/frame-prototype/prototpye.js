(function () {

    this.REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;

    this.REGX_HTML_DECODE = /&\w+;|&#(\d+);/g;

    this.REGX_TRIM = /(^\s*)|(\s*$)/g;

    this.HTML_DECODE = {
        "&lt;": "<",
        "&gt;": ">",
        "&amp;": "&",
        "&nbsp;": " ",
        "&quot;": "\"",
        "&copy;": ""

        // Add more
    };

    this.encodeHtml = function (s) {
        s = (s != undefined) ? s : this.toString();
        return (typeof s != "string") ? s :
            s.replace(this.REGX_HTML_ENCODE,
                      function ($0) {
                          var c = $0.charCodeAt(0), r = ["&#"];
                          c = (c == 0x20) ? 0xA0 : c;
                          r.push(c); r.push(";");
                          return r.join("");
                      });
    };

    this.decodeHtml = function (s) {
        var HTML_DECODE = this.HTML_DECODE;

        s = (s != undefined) ? s : this.toString();
        return (typeof s != "string") ? s :
            s.replace(this.REGX_HTML_DECODE,
                      function ($0, $1) {
                          var c = HTML_DECODE[$0];
                          if (c == undefined) {
                              // Maybe is Entity Number
                              if (!isNaN($1)) {
                                  c = String.fromCharCode(($1 == 160) ? 32 : $1);
                              } else {
                                  c = $0;
                              }
                          }
                          return c;
                      });
    };

    this.trim = function (s) {
        s = (s != undefined) ? s : this.toString();
        return (typeof s != "string") ? s :
            s.replace(this.REGX_TRIM, "");
    };

    this.hashCode = function () {
        var hash = this.__hash__, _char;
        if (hash == undefined || hash == 0) {
            hash = 0;
            for (var i = 0, len = this.length; i < len; i++) {
                _char = this.charCodeAt(i);
                hash = 31 * hash + _char;
                hash = hash & hash; // Convert to 32bit integer
            }
            hash = hash & 0x7fffffff;
        }
        this.__hash__ = hash;

        return this.__hash__;
    };
}).call(String.prototype);





//时间格式化函数
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};
//时间增减函数
Date.prototype.DateAdd = function (strInterval, Number) {
    var dtTmp = this;
    switch (strInterval) {
        case 's': return new Date(Date.parse(dtTmp) + (1000 * Number));
        case 'm': return new Date(Date.parse(dtTmp) + (60000 * Number));
        case 'h': return new Date(Date.parse(dtTmp) + (3600000 * Number));
        case 'd': return new Date(Date.parse(dtTmp) + (86400000 * Number));
        case 'w': return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
        case 'q': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'M': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'y': return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    }
}
//字符串全局替换函数
String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp('\\' + reallyDo + "(.*?)", (ignoreCase ? "gi" : "g")), replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
};
//抹杀特殊字符
String.prototype.replaceRegSpecial = function () {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
    var result = "";
    var str = this;
    if (str.length == 0) return "";
    for (var i = 0; i < str.length; i++) {
        result += str.substr(i, 1).replace(pattern, "\\" + str.substr(i, 1));
    }
    return result;
};
//${}通用设计替换法则
String.prototype.replace$Object = function (Obj, isEncodeHtml) {
    var str = this;
    //var reg = new RegExp("\\$\\{([^\}]+)\\}", "g");
    for (var name in Obj) {
        var reg = new RegExp("\\$\\{" + name + "\\}", "g");
        var value = Obj[name];
        if (!value) value = "";
        if (isEncodeHtml) value = value.toString().encodeHtml();
        str = str.replace(reg, value);
    }
    return str;
}


//数组全局方法
Array.prototype.PickByField = function (field) {
    var arr = this;
    var temp = new Array();
    for (var i = 0; i < arr.length; i++) {
        temp.push(arr[i][field]);
    }
    return temp;
}
Array.prototype.Contains = function (item) {
    if (this.length == 0) return false;
    for (var i = 0; i < this.length; i++) {
        if (this[i] === item) {
            return true;
        }
    }
    return false;
}
Array.prototype.RemoveItem = function (val) {
    var arys = this;
    for (var i = 0; i < arys.length; i++) {
        if (val == arys[i]) { arys.splice(i, 1); return true; }
    }
    return false;
};
Array.prototype.RemoveOne = function (func) {
    var arr = this;
    for (var i = 0; i < arr.length; i++) {
        var entity = arr[i];
        var result = false;
        if (func) {
            result = func(entity);
            if (result == true) { arr.splice(i, 1); return true; }
        } else {
            alert("数组RemoveOne参数不能为空"); break;
        }
    }
    return false;
};
Array.prototype.Distinct = function () {
    var arr = this;
    var NEWARR = new Array();
    for (var i = 0; i < arr.length; i++)
    {
        var item = arr[i];
        if (!NEWARR.Contains(item)) NEWARR.push(item);
    }
    return NEWARR;
};
Array.prototype.Select = function (func) {
    var arr = this;
    var finalArr = new Array();
    for (var i = 0; i < arr.length; i++) {
        var entity = arr[i];
        var result = new Object();
        if (func) { result = func(entity); finalArr.push(result); }
        else {
            alert("数组Select参数不能为空"); break;
        }
    }
    return finalArr;
}
Array.prototype.FindAll = function (func) {
    var arr = this;
    var finalArr = new Array();
    for (var i = 0; i < arr.length; i++) {
        var entity = arr[i];
        var result = false;
        if (func) {
            result = func(entity);
            if (result == true) finalArr.push(entity);
        }
        else {
            alert("数组FindAll参数不能为空"); break;
        }
    }
    return finalArr;
};
Array.prototype.Find = function (func) {
    var arr = this;
    var finalArr = new Array();
    for (var i = 0; i < arr.length; i++) {
        var entity = arr[i];
        var result = false;
        if (func) {
            result = func(entity);
            if (result == true) return entity;
        }
        else {
            alert("数组FindAll参数不能为空"); break;
        }
    }
    return undefined;
};
Array.prototype.Clear = function () {
    var arr = this;
    arr.splice(0, arr.length);
};
Array.prototype.SortFunc = function (func) {
    var arr = this;
    arr.sort(function (x, y) {
        var iNum1 = func(x);   //强制转换成int 型;
        var iNum2 = func(y);
        if (iNum1 < iNum2) { //加如    iNum1 < iNum2，那么 iNum1排在  iNum2前面；
            return -1;
        } else if (iNum1 > iNum2) {
            return 1;
        } else {
            return 0;
        }
    });
}
Array.prototype.Exists = function (func) {
    var arr = this;
    for (var i = 0; i < arr.length; i++) {
        var entity = arr[i];
        var result = false;
        if (func) {
            result = func(entity);
            if (result == true) return true;
        }
        else {
            alert("数组FindAll参数不能为空"); break;
        }
    }
    return false;
}

