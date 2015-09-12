define(function () {
    return new function () {
        //iwf调用界面三个位置：onhashchange,加载模块，onmoduleclose关闭模块，onresize，改变大小
        $.iwf = $.extend({}, $.iwf, {

            userinfo: {},   //登录用户信息
            //models: {},     //{key:model}
            historyList: [],//历史记录
            groupInfo: {},  //自定义分组信息
            online: true,   //在线离线标志位
            dictCache: {},  //系统缓存
            oldhash: {},
            curModel: null, //当前页面模块
            activeModels: {},  //框架已经激活的模块。与div对应
            //{ descript: "测试说明：点击跳转到权限管理....", text: "测试信息", url: "sysmodule.MaxPrivilege:{}", icon: 'fa fa-comment-o' }
            messages: [],
            //界面控制,地址变化时触发
            onhashchange: function () {

                var hash = jQuery.iwf.gethash();
                //if (hash.module == null) {
                //    if ($.iwf.userinfo.UINav) {
                //        //$.iwf.userinfo.UINav[0].children[0].url = 'fx_' + $.iwf.userinfo.UINav[0].children[0].url;
                //        hash = jQuery.iwf.gethash("#" + $.iwf.userinfo.UINav[0].children[0].url);
                //    }
                if (hash.module == null) jQuery.iwf.nav.firstSelect(); 
                    //alert("请设置启动模块！");
                    //return;
                   
                //}
                //}
                //    if (jQuery.iwf.nav) jQuery.iwf.nav.firstSelect();    //todo, 清理和界面相关的部分；
                //else {
                //如果没有带参数，则只切换，不刷新模块
                if (hash.state == undefined || jQuery.iwf.oldhash.model != hash.model || jQuery.iwf.oldhash.module != hash.module) {
                    if (jQuery.iwf.nav) jQuery.iwf.nav.show(hash); //显示导航
                    if (jQuery.iwf.top) jQuery.iwf.top.show(hash); //显示top
                    jQuery.iwf.main.show(hash); //显示框架工作区

                }
                jQuery.iwf.oldhash = hash;
                if ($.iwf.ModulechangeCallback) {
                    $.iwf.ModulechangeCallback();
                }
                return hash;
            },
            //更新地址栏
            onmodulechange: function (moduleconfig, callback) {
                $.iwf.ModulechangeCallback = undefined;
                //切换tab页
                if (moduleconfig.indexOf('.') < 1) {
                    for (var k in $.iwf.activeModels) {
                        if (k.lastIndexOf(key) == k.indexOf('_')) {
                            moduleconfig += k.replace('_', '.') + ':{' + $.iwf.activeModels[k].iwfCurParam + '}';
                            break;
                        }
                    }
                } else if (moduleconfig.indexOf(':') < 1) {
                    //如果没有设置参数，则自动获取上次设置的参数，并且不会重新调用model.show
                    var targetModel = $.iwf.activeModels[moduleconfig.replace('.', '_')];
                    if (targetModel != undefined) {
                        moduleconfig += ':{' + targetModel.iwfCurParam + '}';
                    } else
                        moduleconfig += ':{}';
                }

                var newhash = $.iwf.gethash("#" + moduleconfig);
                $.iwf.historyList.push(newhash);

                if ($.iwf.historyList.length > 49) $.iwf.historyList.splice(0, 1);
                if (!appConfig.isDebug) moduleconfig = encodeURI(moduleconfig);
                window.location.href = (window.location.pathname + window.location.search + "#" + moduleconfig);
                $.iwf.ModulechangeCallback = callback;
                //将地址栏的更改保存到cookie
                //if (moduleconfig) jQuery.iwf.setCookies(HASH_KEY, moduleconfig);
            },
            //关闭tab页   todo 清理和界面相关的部分
            onmoduleclose: function (key) {
                //关闭所有当前页面的model
                for (modelkey in $.iwf.activeModels) {
                    if (modelkey.indexOf(key + "_") == 0) $.iwf.closeModel(modelkey);
                    //if (modelkey.indexOf(key + "_") == 0) delete $.iwf.activeModels[modelkey];
                };
                //必须删除历史记录
                if (jQuery.iwf.historyList) jQuery.iwf.historyList.RemoveOne(function (a) { return a.module == key; });//彭博修正bug
                //关闭导航相关主窗体
                if (jQuery.iwf.nav)
                    jQuery.iwf.nav.close(key);
                else {
                    do {
                        var hash = $.iwf.urlBack()
                        if (hash == undefined || hash.module == null) {
                            // me.firstSelect();
                            history.back();
                        }
                        else if (hash.module != id) {
                            $.iwf.onmodulechange(hash.module + "." + hash.model + ":{" + hash.params + "}");
                            break;
                        }
                    } while (hash != null)
                }
                if (jQuery.iwf.main.close) jQuery.iwf.main.close(key);
            },
            //根据url地址获得当前界面设置 hash { module:'' , model:'' , params:''  }
            gethash: function (hashStr) {
                var hash = {};
                var hashReg = new RegExp("#([a-z0-9_-]+)$", "i");
 
                var urlReg = new RegExp("#([^\.]*)\.([^\{]+)\:\{(.*)\}$", "i");/*new RegExp("#([^\.]*)\.([^\{]+)\:\{([^\{]*)\}", "i");*/
                var urlReg2 = new RegExp("#([^\.]*)\.([^\{]+)\:\{(.*)\}:(.*)", "i"); /* new RegExp("#([^\.]*)\.([^\{]+)\:\{([^\{]*)\}:(.*)", "i");*/
                var haveParams = true;

                if (hashStr == undefined) {
                    hashStr = decodeURI(location.hash);
                    if (hashStr == '' && $.iwf.userinfo.UINav) hashStr = "#" + $.iwf.userinfo.UINav[0].children[0].url;
                }

                if (hashStr.indexOf('{') < 0) {
                    hashStr += ':{}'
                    haveParams = false;
                }

                if (urlReg2.test(hashStr)) {
                    hash.module = RegExp.$1; //功能页
                    hash.model = RegExp.$2;  //功能模块
                    hash.params = RegExp.$3;  //框架参数
                    hash.state = RegExp.$4;  //模块参数，传递给模块
                } else if (urlReg.test(hashStr)) {
                    hash.module = RegExp.$1;
                    hash.model = RegExp.$2;
                    hash.params = RegExp.$3;
                } else if (hashReg.test(hashStr)) {
                    hash.module = RegExp.$1;
                }
                if (!haveParams) delete hash.params;
                return hash;
            },
            //历史记录管理  urlBack返回上一历史记录， getHashbyModule获取最近一个tab的地址
            urlBack: function () {
                if (history.length > 0) return $.iwf.historyList.pop();
                return null;
            },

            getHashbyModule: function (module) {
                for (var i = $.iwf.historyList.length - 1; i > 0; i--) {
                    if ($.iwf.historyList[i].module == module) return $.iwf.historyList[i];
                }
                return null;
            },


            //加载相应业务模块  目前的修改已经要求，全部都采用异步回调！！
            getModel: function (key, callback) {

                var model = $.iwf.models[key];  //原有注册的模块
                if (model) {
                    if (callback) callback(model)
                    return model;
                }

                //采用requireJS实现的模块
                if (key.indexOf('/') > -1) {
                    //key = key.substr(0, key.indexOf('-')); //处理那些比如doingcase-001这样的一个模块多个实例的问题
                    require([key], function (model) {
                        if (model && callback) callback(model)
                    });
                    return;
                }
                //处理$.iwf.xxx这种情况，替换成iwf-xxx
                if (key.indexOf('-') > 0)
                    key = '$.' + key.replace('-', '.');
                else if (key.indexOf('$') < 0)
                    key = '$.iwf.' + key; //针对系统管理模块

                var model = eval("(" + key + ")");

                if (model) {
                    if (callback) callback(model)
                    return model;
                }

                //异步加载模块
                var filePath = appConfig.models[key];

                // alert("未在AppConfig函数路径字典中找到键" + key);
                if (filePath) {
                    $.Com.addScript(filePath, function () {
                        var model = eval("(" + key + ")");
                        if (model) {
                            if (callback) callback(model)
                        } else
                            alert("未加载" + key);
                    });
                }
            },
            //取得当前已经加载模块实例
            getActiveModel: function (key) {
                key = key.replace('.', '_');
                var tt = key.indexOf('_');

                if (tt < 0) key = '_' + key;
                if (tt < 1) {
                    for (var k in $.iwf.activeModels) {
                        if (k.lastIndexOf(key) == tt) return $.iwf.activeModels[k];
                    }
                }
                else
                    return $.iwf.activeModels[key];
            },

            //将对应的业务模块加载到页面上
            loadModel: function (key, model, modelDIV, param) {
                if ($.iwf.activeModels[key] == undefined) {
                    if (!model.show) return;
                    modelDIV.css("overflow", "auto");
                    //$.CheckOnline(function (flag) {
                        //$.iwf.online = flag;
                        model.show(param, modelDIV);
                    //});
                    $.iwf.curModel = model;
                    $.iwf.activeModels[key] = model;
                    model.iwfCurParam = param.params;
                } else {
                    if (param.params != model.iwfCurParam) {
                        model.show(param, modelDIV);
                        model.iwfCurParam = param.params;
                    }
                    $.iwf.curModel = model;
                }
            },
            //删除对应的业务模块
            closeModel: function (key, Module, root) {
                if ($.iwf.activeModels[key] == undefined) return;
                if ($.iwf.activeModels[key].close) $.iwf.activeModels[key].close(Module, root);
                $.iwf.activeModels[key] = null;
                delete $.iwf.activeModels[key];
            },

            //界面事件
            onsearch: function (key, params) {
                var model = this.getModel(key);
                if (model && model.search) model.search(params);
            },

            //todo 清理和界面相关的部分
            onresize: function () {

                var fxSize = {
                    width: document.documentElement.clientWidth,
                    height: document.documentElement.clientHeight,
                    topHeight: 0
                }
                if (jQuery.iwf.top) fxSize.topHeight = jQuery.iwf.top.height();
                if (jQuery.iwf.main && jQuery.iwf.main.resize) jQuery.iwf.main.resize(fxSize);
                if (jQuery.iwf.nav) jQuery.iwf.nav.resize();

            },
            onfocus: function () {
                //  jQuery.iwf.search.focus();
            },

            //注册框架事件
            initialize: function () {
                window.onhashchange = jQuery.iwf.onhashchange;
                window.onresize = jQuery.iwf.onresize;
            },
            relogin: function () {
                var userid = $.Com.getCookies('userid');
                $.Com.delCookies("userid");
                $.Com.delCookies("password");

                if ($.iwf.userinfo && $.iwf.userinfo.username == undefined) {
                    $.iwf.LoginUI();
                    return;
                }
                var gridwin = $('body').iwfWindow({
                    title: $.iwf.userinfo.CnName + ' 重新登录',
                    width: 400, height: 220,
                    append: '<table width="80%" border="0" style="margin:0 20px;" ><tr><td>&nbsp;<input id="password" type="password" class="form-control " placeholder="请输入密码"/></td></tr></table>',
                    closeable: false,
                    button: [{
                        text: '确定',
                        css: 'btn btn-primary',
                        handler: function (data) {
                            var params = { username: $.iwf.userinfo.username, password: $("#password").val(), rmb: false };

                            $.post("org.data?action=login", params, function (s) {
                                try {
                                    var data = eval("(" + s + ")");
                                }
                                catch (err) {
                                    alert("未知错误:" + s + ",请联系管理员！"); return;
                                }
                                if (data.success == false) {
                                    alert(data.msg); return;
                                }

                                document.cookie = "userid=" + data.UserID;
                                document.cookie = "username=" + escape(data.cnname);
                                gridwin.close();
                            });
                        }
                    }, {
                        text: '退出',
                        css: 'btn btn-default',
                        handler: function (data) {
                            document.cookie = "userid=" + userid;
                            $.iwf.logout();
                        }
                    }]
                });
            },
            //退出系统
            logout: function () {
                $.Com.delCookies("username");
                $.Com.delCookies("password");
                $.iwf.userinfo.username = undefined;
                //无论是否成功都会退出
                $.fxPost("org.data?action=loginout", {},
                    function (res) {
                        $.iwf.LoginUI();
                    }, function () {
                        $.iwf.LoginUI();
                    });
                $.Com.delCookies("userid");
            },
            login: function (htmlfile) {
                var userid = $.Com.getCookies('userid');
                if (userid == undefined || userid == "") $.iwf.LoginUI(location.hash);

                $.iwf.userinfo.username = $.Com.getCookies('loginname');
                $.iwf.userinfo.userid = "1";
                $.iwf.userinfo.CnName = $.Com.getCookies("username");
                $.iwf.initialize();
                $.Com.loadDictCache();
            },


            //如果有callback则直接加载html模板，并处理回调函数//准备作废
            showWin: function (opts, url, callback) {
                var win = $('body').iwfWindow(opts);

                if (url != undefined) {
                    if (typeof callback == 'function') {
                        win.load(url, callback);
                    }
                    else {
                        var iframe = $('<iframe frameborder="0" src="' + url + '" width="100%" height="100%"></iframe>');
                        win.append(iframe);
                    }
                }
                return win;
            },

            LoginUI: function (hash) {
                if (hash == undefined || hash == null) hash = '';
                window.location.href = 'login.html' + hash;
            }
        }
        )
    };
});