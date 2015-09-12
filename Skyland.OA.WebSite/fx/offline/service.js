define(['localforage'], function (localforage) {
    return new function () {
        //$.Com.QuoteJS("/fx/offline/localforage.js");  

        (function ($) {
            //在线AJAX查询数据
            function AJAX(SeverUrl, Params, callback, loseback) {
                GetAjaxResText(SeverUrl, Params, function (res) {
                    DealRes(res, callback, loseback);
                });
            }
            //处理返回值
            function DealRes(res, callback, loseback) {
                var json;
                try { json = eval('(' + res + ')'); } catch (e) {
                    alert("函数未返回可解析的Json格式");
                    if (loseback) { loseback("函数未返回正确的Json格式"); }
                }
                if (json == undefined) return;
                if (json.success) {
                    if (callback) callback(json.data);
                    else if (json.msg) alert(json.msg);
                } else {
                    if (json.msg == '请先登录系统！') $.iwf.relogin();
                    if (loseback) loseback(json);
                    else if (json.msg) alert(json.msg);
                }
            }

            function GetAjaxResText(SeverUrl, Params, callback) {
                jQuery.ajax({
                    type: "POST",
                    url: SeverUrl,
                    data: Params,
                    datatype: "json",
                    success: function (res, textStatus, jqXHR) {
                        if (callback) callback(res);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        var obj = new Object();
                        obj["success"] = false;
                        obj["type"] = "httperror";
                        obj["msg"] = textStatus
                        if (callback) callback(JSON.stringify(obj));
                    }
                })
            }

            //严格检查是否离线
            jQuery.CheckOnline = function (Callback) {
                var flag_ajaxerror = "Init";
                jQuery.ajax({
                    type: "POST",
                    url: appConfig.messageService + "getmsg",  //fx.data?action=getguid
                    datatype: "json",
                    timeout: '300',
                    success: function (data, textStatus, jqXHR) {
                        if (flag_ajaxerror == "Init") {
                            flag_ajaxerror = true;
                            if (Callback) Callback(true);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if (flag_ajaxerror == "Init") {
                            flag_ajaxerror = false;
                            if (Callback) Callback(false);
                        }
                    }
                });
                setTimeout(function () {
                    if (flag_ajaxerror == "Init") {
                        flag_ajaxerror = false;
                        if (Callback) Callback(false);
                    }
                }, appConfig.messageInterval);
            };

            //得到本地数据
            jQuery.GetLoaclData = function (key, callback, loseback) {
                //驱动localforage
                localforage.setDriver(localforage.LOCALSTORAGE).then(function () {
                    //找到所有Keys
                    localforage.keys(function (keys) {
                        if (keys.Contains(key)) {
                            localforage.getItem(key, function (readValue, e) {
                                if (e != null) {//e是内部异常必须丢出来
                                    alert(e.toString());
                                } else {
                                    if (callback && readValue) callback(readValue);
                                }
                            });
                        }
                        else {
                            if (loseback) loseback("NoOfflineData", "未找到离线数据");
                        }
                    });
                });
            }
            //设置本地数据
            jQuery.SetLoaclData = function (key, value, callback, loseback) {
                localforage.setDriver(localforage.LOCALSTORAGE).then(function () {
                    localforage.setItem(key, value, function (readValue, e) {
                        if (e != null) {//e是内部异常必须丢出来
                            if (loseback) loseback(e.toString());
                        } else {
                            if (callback) callback(value);
                        }
                    });
                });
            }
            //移除本地数据
            jQuery.RemoveLoaclData = function (key, callback) {
                localforage.setDriver(localforage.LOCALSTORAGE).then(function () {
                    localforage.removeItem(key, callback);
                });
            }
            //清空本地数据
            jQuery.ClearLoaclData = function (callback) {
                localforage.clear(callback);
            };
            //数据服务本地化
            jQuery.LocalizeResult = function (SeverUrl, Params, callback, loseback) {
                var TargetKEY = SeverUrl + "★" + JSON.stringify(Params);
                GetAjaxResText(SeverUrl, Params, function (res) {
                    jQuery.SetLoaclData(TargetKEY, res, function () {
                        var json;
                        try {
                            json = eval('(' + res + ')');
                        } catch (e) {
                            if (loseback) loseback("函数未返回正确的Json格式");
                        }
                        if (json.success && callback) callback(json.data);
                        else if (loseback) loseback(json.msg);
                    }, loseback);
                });
            }
            //最普通的在线查询数据和提交数据
            jQuery.PackResult = function (SeverUrl, Params, callback, loseback) {
                AJAX(SeverUrl, Params, callback, loseback);
            }
            // 把改装jQuery.PackResult成同步
            jQuery.PackResultSync = function (SeverUrl, Params) {
                var res = jQuery.ajax({
                    type: "POST",
                    url: SeverUrl,
                    data: Params,
                    async: false,
                    datatype: "json",
                    success: function (res, textStatus, jqXHR) {

                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                    }
                }).responseText;
                var returnObj;
                DealRes(res, function (data) {
                    returnObj = data;
                }, function () {


                });
                return returnObj;
            }

            //通用查询数据应用于需要离线的模块
            jQuery.QueryResult = function (SeverUrl, Params, callback, loseback) {
                if (window.applicationCache == undefined) return jQuery.PackResult(SeverUrl, Params, callback, loseback);
                var TargetKEY = SeverUrl + "★" + JSON.stringify(Params);
                var SubmitKEY = SeverUrl + "☆" + JSON.stringify(Params);
                jQuery.CheckOnline(function (IsOnline) {
                    if (IsOnline == false)
                        jQuery.GetLoaclData(SubmitKEY, function (res) {
                            DealRes(res, callback, loseback);
                        }, function () {
                            jQuery.GetLoaclData(TargetKEY, function (res) {
                                DealRes(res, callback, loseback);
                            }, loseback);
                        });
                    else {
                        //一旦检测到还有固有离线数据,立马清理掉
                        jQuery.GetLoaclData(TargetKEY, function (res) {
                            jQuery.RemoveLoaclData(TargetKEY);
                        });

                        jQuery.GetLoaclData(SubmitKEY, function (res) {
                            DealRes(res, callback, loseback);
                        }, function (status, msg) {
                            AJAX(SeverUrl, Params, callback, loseback);
                        });


                    }
                });
            };
            //离线专用提交数据方式
            jQuery.OfflineSubmit = function (SeverUrl, Params, Value, callback, loseback) {
                var TargetKEY = SeverUrl + "☆" + JSON.stringify(Params);
                var obj = {
                    success: true,
                    data: Value
                };
                jQuery.SetLoaclData(TargetKEY, JSON.stringify(obj), callback, loseback);
            };
            //移除离线提交的东西
            jQuery.OfflineRemove = function (SeverUrl, Params, callback) {
                var SubmitKEY = SeverUrl + "☆" + JSON.stringify(Params);
                jQuery.RemoveLoaclData(SubmitKEY, callback);
            }

        })(jQuery);

    }
})