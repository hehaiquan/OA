////弹出编辑子窗体
//$.Com.showSubformWin = function (form, opts) {
//    var root = window;
//    do {
//        root = root.parent;
//    } while (root.$.iwf == undefined)

//    var win = root.$.iwf.showWin(opts);

//    form.appendTo(win.content());
//    form.show();
//    return win;
//};

//清空对象属性
cleanEntity = function (srcEntity) {
    for (var prop in srcEntity) {
        var targetProp = prop;
        var objType = typeof (srcEntity[prop]);
        switch (objType) {
            case "string":
                srcEntity[prop] = "";
                break;
            case "boolean":
                srcEntity[prop] = false;
                break;
            case "object":
                srcEntity[prop] = new Object();
                break;
            default:
                srcEntity[prop] = null;
                break;
        }
    }
};

(function ($) {
    $.ComFun = {
        GetFormatData: function (data, type) {
            if (data != null && data != "" && data != undefined) {
                if (type == 1) {
                    return data.substring(0, 19).replace("T", " ");
                } else {
                    return data.substring(0, 10);
                }
            }
            return "";
        },
        GetDateTime: function (type, diffday) {
            var now = new Date();
            if (diffday) {
                now.setDate(now.getDate() + diffday);
            }
            var year = now.getFullYear();       //年
            var month = now.getMonth() + 1;     //月
            var day = now.getDate();            //日

            var hh = now.getHours();            //时
            var mm = now.getMinutes();          //分

            var clock = year + "-";

            if (month < 10)
                clock += "0";

            clock += month + "-";

            if (day < 10)
                clock += "0";

            clock += day;
            if (type == 1) {
                clock += " ";
                if (hh < 10)
                    clock += "0";

                clock += hh + ":";
                if (mm < 10) clock += '0';
                clock += mm;
            }
            return (clock);
        },
        //取现在时间
        GetNowDate: function (type) {
            var datetime;
            var d = new Date();
            var vYear = d.getFullYear();
            var vMon = d.getMonth() + 1;
            var vDay = d.getDate();
            var h = d.getHours();
            var m = d.getMinutes();
            var se = d.getSeconds();
            var mm = d.getMilliseconds();
            if (vMon <= 9) {
                vMon = "0" + vMon;
            }
            if (vDay <= 9) {
                vDay = "0" + vDay;
            }
            if (h <= 9)
                h = "0" + h;
            if (m <= 9)
                m = "0" + m;
            if (se <= 9)
                se = "0" + se;
            if (mm <= 9) {
                mm = "0" + mm;
            }
            if (type == "yyyy-mm-dd hh:mm") {
                datetime = vYear + "-" + vMon + "-" + vDay + " " + h + ":" + m;
            } else if (type == 'yyyymmddhhmmss') {
                datetime = vYear.toString() + vMon.toString() + vDay.toString() + h.toString() + m.toString() + se.toString();
            } else if ('yyyymmddhhmmssmmm') {
                datetime = vYear.toString() + vMon.toString() + vDay.toString() + h.toString() + m.toString() + se.toString() + mm.toString();

            } else {
                datetime = vYear + "-" + vMon + "-" + vDay + " " + h + ":" + m;
            }
            return (datetime);
        },
        //获取一个随机数
        newGuid: function () {
            var guid = "";
            for (var i = 1; i <= 32; i++) {
                var n = Math.floor(Math.random() * 16.0).toString(16);
                guid += n;
                if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                    guid += "-";
            }
            return guid;
        }
         //传入时间格式例如"2015-06-03T04:03:00"
        , DateTimeToChange: function (str, type) {
            if (!str) {
                return ("");
            }
            if(str.indexOf('.')!=-1) {
                str = str.substring(0, str.indexOf('.'));
            };
            var date = new Date(Date.parse(str.replace(/-/g, "/").replace("T", " ")));
           
            var year = date.getFullYear();
            var month = date.getMonth() + 1;    //js从0开始取 
            var date1 = date.getDate();
            var hour = date.getHours();
            var minutes = date.getMinutes();
            var second = date.getSeconds();
            if (hour <= 9)
                hour = "0" + hour;
            if (minutes <= 9)
                minutes = "0" + minutes;
            if (second <= 9)
                second = "0" + second;
            var changeAfter = "";
            if (type == "yyyy年MM月dd日") {
                changeAfter = year + "年" + month + "月" + date1 + "日";
            } else if (type == "yyyy年MM月dd日 hh:mm") {
                changeAfter = year + "年" + month + "月" + date1 + "日&nbsp;" + hour + ":" + minutes;
            } else if (type == "yyyy年MM月dd日 hh时mm分ss秒") {
                changeAfter = year + "年" + month + "月" + date1 + "日&nbsp;" + hour + "时" + minutes + "分" + second + "秒";
            } else if (type == "yyyy-MM-dd hh:mm:ss") {
                changeAfter = year + "-" + month + "-" + date1 + "&nbsp;" + hour + ":" + minutes + ":" + second;
            } else if (type == "yyyy-MM-dd hh:mm") {
                changeAfter = year + "-" + month + "-" + date1 + "&nbsp;" + hour + ":" + minutes;
            } else if (type == "yyyy-MM-dd") {
                changeAfter = year + "-" + month + "-" + date1;
            }
            return (changeAfter);
        },
        //传入时间格式例如"2015年06月03日 时04"
        DateTimeToChange_Two: function (str, type) {
            str = str.replace(" ", "T");
            str = str.replace("年", "-");
            str = str.replace("月", "-");
            str = str.replace("日", "");
            str = str.replace("时", "");
            str = str + ":00:00";
            return str;
        },
        //将审批意见格式化，用于在类似纸质表单界面的排版样式 listWord工作流表 dir手写签批图片存放路径
        ChangeListToMatch: function (listWork, dir, callback) {
            var listArray = [];
            for (var i = 0; i < listWork.length; i++) {
                var displayModel = { img: "", divData: "", actID: "", username: "" };
                displayModel.actID = listWork[i].ActID;
                displayModel.username = listWork[i].UserName;
                var createDate = $.ComFun.DateTimeToChange(listWork[i].SENDDATE, "yyyy年MM月dd日 hh:mm");
                if (listWork[i].Remark) {
                    if ((listWork[i].Remark.length > 4) && (listWork[i].Remark.substring(listWork[i].Remark.length - 4) == '.jpg')) {
                        var img = document.createElement("img");
                        //设置 img 图片地址
                        img.src = "/" + dir + "/" + listWork[i].Remark;
                        //ldpsDiv[0].appendChild(img);
                        var divData = "<br/><div style='float:right;color: black;'>" + listWork[i].UserName + "&nbsp;" + createDate + "</div><br/><br/>";
                        displayModel.img = img;
                        displayModel.divData = divData;
                        listArray.push(displayModel);

                    } else {
                        if (listWork[i].Remark != "退件") {
                            var divData = "<div style='color: black;'>" + listWork[i].Remark + "</div>";
                            divData += "<div style='float:right;color: black;'>" + listWork[i].UserName + "&nbsp;" + createDate + "</div><br/><br/>";
                            displayModel.divData = divData;
                            listArray.push(displayModel);
                        }
                    }
                } else {
                    var divData = "<div style='float:right;color: black;'>" + listWork[i].UserName + "&nbsp;" + createDate + "</div><br/><br/>";
                    displayModel.divData = divData;
                    listArray.push(displayModel);
                }
            }
            return listArray;
        },
        //将抽选出的审批意见插入相应的div中 dataDiv界面 work工作流对象
        AppendDataToDiv: function (dataDiv, work) {
            //放入图片
            if (work.img != "" && work.img != null) {
                dataDiv[0].appendChild(work.img);
            }
            //放入文字
            dataDiv.append(work.divData);
        }
    }
})(jQuery);

//日期输入控件
ko.bindingHandlers.dateFormat = {
    init: function (element, valueAccessor, allBindings) {
        var datetimeformat = valueAccessor();
        $(element).datepicker();
    }
};

//Jquery1.9以后不支持$.browser，而zTree等控件需要调用，所以在此加上
$.browser = new Object();
$.browser.mozilla = (/firefox/).test(navigator.userAgent.toLowerCase());
$.browser.webkit = (/webkit/).test(navigator.userAgent.toLowerCase());
$.browser.opera = (/opera/).test(navigator.userAgent.toLowerCase());
$.browser.msie = (/msie/).test(navigator.userAgent.toLowerCase());

function getSortIndex(key, sortArray) {
    for (var i = 0; i < sortArray.length; i++) {
        var value = sortArray[i][key];
        if (value) {
            return value;
        }
    }
    return undefine;
}

function showDoc(parameters, title, isopen, issave, callback) {
    $.fxPost("/B_Common_CreateDocSvc.data?action=getDocName", parameters, function (ret) {
        if (ret.success) {
            if (ret.msg == "ok") {
                var path = eval('(' + ret.data + ')').wordPath;
                var wdata = {
                    Logo: title,
                    Title: title,
                    IsWarnSave: issave,//是否弹出提示保存按钮
                    Callback: function (result) {
                    },
                    ToolPrivilege: {
                        Save: issave,//保存按钮
                        Open: isopen//显示打开按钮
                    },
                    HttpParams: { severFilePath: path, saveFilePath: path }
                };
                ShowWordWin(wdata);
                if (callback)
                    callback();
            }
            else if (ret.msg == "nodoc") {
                $.Com.showMsg("未找到指定文件！");
            }
        }
    });
}

function showDocAndCreate(url, parameters, title, isopen, issave, callback) {
    $.fxPost(url, parameters, function (ret) {
        if (ret.success) {
            var path = eval('(' + ret.data + ')').wordPath;
            var wdata = {
                Logo: title,
                Title: title,
                IsWarnSave: issave,//是否弹出提示保存按钮
                Callback: function (result) {
                },
                ToolPrivilege: {
                    Save: issave,//保存按钮
                    Open: isopen//显示打开按钮
                },
                HttpParams: { severFilePath: path, saveFilePath: path }
            };
            ShowWordWin(wdata);
            if (callback)
                callback();
        }
    });
}