//一旦点击离线就会调用这个函数
define(function (offline) {
    return new function () {
        var self = this;
        this.options = { key: 'resetpwd', title: '修改密码', icon: '', layerout: 'window' };
        var root;

        this.show = function (param, div) {

            root = $("<div  style='margin:50px;'></div>").prependTo(div);

            var pwd = $.Com.getCookies('password');
            if (pwd == null) {
                //alert("未记住账号无法进入离线模式");
                root.html("<h2 style='margin:100px;'>未记住账号无法进入离线模式!!</h2>");
                return;
            }
            if ($.iwf.online == false) {
                // alert("已处于离线状态");
                root.html("<h2 style='margin:100px;'>已处于离线状态!!</h2>");
                return;
            }

            $.Com.setCookies('username', $.iwf.userinfo.CnName);

            function WriteErrorInfo(text) { $('<div style="color:red"></div>').html(text).prependTo(root); }
            function WriteOKInfo(text) { $('<div style="color:green"></div>').html(text).prependTo(root); }
            function WriteCommonInfo(text) { $('<div style="color:black"></div>').html(text).prependTo(root); }

            //对arr离线Url数组进行递归离线
            function ToolBatchCache(index, arr, callback, successfunc) {
                if (index == arr.length) { if (callback) callback(); return; }
                var Info = arr[index];
                var Url = Info["Url"];
                var Params = Info["Params"];
                jQuery.LocalizeResult(Url, Params, function () {
                    if (successfunc) successfunc(Url);
                    ToolBatchCache(index + 1, arr, callback, successfunc);
                }, function (msg) {
                    ToolBatchCache(index + 1, arr, callback, successfunc);
                    WriteErrorInfo(msg);
                });
            }

            //另外一种离线递归大同小异
            function PushCache(arr, startIndex, func) {
                var index = startIndex;
                if (index == arr.length) return;
                var ent = arr[index];
                func(ent, function () {
                    PushCache(arr, index + 1, func);
                });
            };

            //离线某一个待办业务
            function InitCase(wfcase, callback) {
                var param = getCacheParams(wfcase);
                jQuery.LocalizeResult("engine.data?action=GetCurCaseStepInfo", param, function (data) {
                    if (wfcase.baid) { if (wfcase.baid != data.BAID) { if (callback) callback(false); } }
                    if (data.IsEnd) { if (callback) callback(false); }
                    if (data.FPath) {

                        function myfunction(method) {
                            var GetDataParams = new Object();
                            GetDataParams["caseid"] = wfcase.caseid;
                            GetDataParams["flowid"] = wfcase.flowid;
                            GetDataParams["baid"] = wfcase.baid;
                            GetDataParams["actid"] = wfcase.actid;
                            GetDataParams["guid"] = wfcase.guid;

                            var model = new method();
                            var loaddataUrl = model.options["Url"] ? model.options["Url"] : FPath.split(".")[1] + "_" + FPath.split(".")[2] + ".data";
                            // var GetDataUrl = loaddataUrl + "?action=GetData";
                            if (loaddataUrl.substr(loaddataUrl.length - 1) == "/")
                                GetDataUrl = loaddataUrl + "get";
                            else
                                GetDataUrl = loaddataUrl + "?action=GetData";

                            var toolServiceArr = [
                                {
                                    Url: "engine.data?action=GetToolHelpInfo",
                                    Params: GetDataParams
                                },
                                {
                                    Url: "IWorkDraftManage.data?action=ReadCaseFromDraft",
                                    Params: GetDataParams
                                },
                                 {
                                     Url: GetDataUrl,
                                     Params: GetDataParams
                                 }
                            ];



                            ToolBatchCache(0, toolServiceArr, function () {
                                if (callback) callback(true);
                            });
                        }

                        $.iwf.getModel(data.FPath, function (method) {
                            var intance = new method();
                            if (intance && intance.getModel) {
                                intance.getModel(wfcase, function (funName) {
                                    if (funName != "") {
                                        $.iwf.getModel(funName, function (method) {
                                            myfunction(method);
                                        });
                                    } else
                                        alert('没有获得对应的函数！请检查工作流制定模块的getModel()');
                                });
                            } else {
                                myfunction(method);
                            }
                        });

                    } else {
                        if (callback) callback(false);
                    }
                });
            }


            //离线自己所有的代办也会
            function InitAllDoingCase() {
                jQuery.LocalizeResult("engine.data?action=Querymycase", {}, function (data) {
                    WriteOKInfo("缓存待办箱列表OK");
                    WriteOKInfo("开始所有业务的缓存");
                    var AllCase = new Array();
                    for (var i = 0; i < data.length; i++) Array.prototype.push.apply(AllCase, data[i].children)
                    PushCache(AllCase, 0, function (ent, callback) {
                        var obj = {
                            "caseid": ent.ID,
                            "baid": ent.BAID,
                            "flowid": ent.FlowID,
                            "actid": ent.ActID,
                            "guid": ent.guid,
                            "state": "doingcase",
                            "title": ent.Name
                        }
                        InitCase(obj, function (flag) {
                            if (flag) WriteOKInfo("您的待办业务【" + ent.Name + "】数据完毕");
                            if (callback) callback();
                        });
                    });
                }, function (msg) {
                    WriteErrorInfo(msg);
                });
            }

            //套一层没大意义，预留
            function PushCacheData() {
                InitAllDoingCase();
            }
            //从这里起，利用HTML5 manifest离线文件
            var iframe = $('<iframe frameborder="0" src="/framework/Offline/StartOffline.html" width="100%" height="100%"></iframe>');
            iframe.hide();
            iframe[0].onprogress = function (e) {
                var str = "缓存第" + e.loaded + "个文件 | 共" + e.total + "个文件 ";
                WriteCommonInfo(str);
            };
            iframe[0].oncached = function (e) {
                var str = "全部离线文件已缓存";
                WriteOKInfo(str);
                jQuery.ClearLoaclData(function () {
                    PushCacheData();
                });
            };
            iframe[0].onnoupdate = function (e) {
                var str = "全部离线已是最新";
                var div = $('<div style="color:green"></div>').append(str);
                WriteOKInfo(str);
                PushCacheData();
            };

            //离线额外服务
            if (appConfig.offlineService) {
                ToolBatchCache(0, appConfig.offlineService, function () {
                    root.append(iframe);
                }, function (url) {
                    if (url) WriteOKInfo("缓存基础离线服务数据【" + url + "】");
                });
            } else {
                root.append(iframe);
            }
        }

    }
});