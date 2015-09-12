define(function () {
    return new function () {
        var self = this;

        this.options = { key: 'sysobjectsmodel', modelName: "系统变量侦测" };

        function isNumber(val) {
            return typeof val === 'number' && isFinite(val);
        }

        function isArray(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }

        function isFunction(obj) {
            return Object.prototype.toString.call(obj) === '[object Function]';
        }

        function isObject(obj) {
            return Object.prototype.toString.call(obj) === '[object Object]';
            //if (obj === null || typeof obj === 'undefined') {
            //    return false;
            //}
            //return typeof obj === 'object';
        }

        function isEasyData(obj) {
            return !isArray(obj) && !isObject(obj);
        }

        function isJQuery(obj) {
            return obj instanceof jQuery
        }

        function JsonSerialize(value) {
            return JSON.stringify(value);
        }

        function ConvertToTreeObj(Name, Value, IsArrayElement) {
            var finalObj = new Object();
            finalObj["PropertyName"] = Name;
            //finalObj["PropertyValue"] = Value;
            if (IsArrayElement) finalObj["IsArrayElement"] = true;
            if (isArray(Value)) {
                finalObj["name"] = Name + "(" + Value.length + ")";
                finalObj["children"] = new Array();
                finalObj["IsParent"] = true;
                for (var i = 0; i < Value.length; i++) {
                    var temp = Value[i];
                    finalObj["children"].push(ConvertToTreeObj("[" + i + "]", temp, true));
                }
            }
            else if (isJQuery(Value)) {
                var text = Name + "：" + "JQueryDOM";
                finalObj["name"] = text;
                finalObj["PropertyValue"] = Value;
            }
            else if (isObject(Value)) {//isObject({})==true,这点要特别注意到
                finalObj["name"] = Name;
                finalObj["children"] = new Array();
                for (var key in Value) {
                    //if (Name == "MaxPrivilege") console.log(key);
                    finalObj["children"].push(ConvertToTreeObj(key, Value[key]));
                }
                if (finalObj["children"].length == 0) finalObj["PropertyValue"] = Value;
            }
            else if (isFunction(Value)) {
                var text = Name + "：Function";
                finalObj["name"] = text;
                finalObj["PropertyValue"] = Value;
            }
            else {
                var text = Name + "：" + JsonSerialize(Value);
                finalObj["name"] = text;
                finalObj["PropertyValue"] = Value;
            }
            return finalObj;
        }

        function GetTreeSource(Arr) {
            var arr = new Array();

            $.each(Arr, function (index, str) {
                var obj = eval("(" + str + ")");

                if (obj) {
                    var TreeObj = ConvertToTreeObj(str, obj);
                    arr.push(TreeObj);
                }

            });

            return arr;

        }



        function ConvertToModelTreeObj(Name, Value, IsArrayElement) {
            var finalObj = new Object();
            finalObj["PropertyName"] = Name;
            //finalObj["PropertyValue"] = Value;
            if (IsArrayElement) finalObj["IsArrayElement"] = true;
            if (isArray(Value)) return undefined;
            else if (isJQuery(Value)) return undefined;
            else if (isObject(Value)) {//isObject({})==true,这点要特别注意到
                finalObj["name"] = Name;
                finalObj["children"] = new Array();
                if (Value.options && Value.options.key && Value.show) {
                    finalObj["name"] = "Key:" + Name;

                    var arr = AllTypeArr.FindAll(function (ent) { return ent.ModelKey == Name; }).Select(function (ent) { return ent.PType; });

                    if (arr.length > 0) {
                        var str = "【PType=(" + arr.join(",") + ")】";
                        finalObj["name"] += str;
                    }

                    if (Value.options.modelName) {
                        finalObj["modelName"] = Value.options.modelName;
                        finalObj["name"] += "【" + finalObj["modelName"] + "】";

                    }
                    return finalObj;
                }

                for (var key in Value) {
                    if (key == "MaxPrivilege") console.log(key);
                    var result = ConvertToModelTreeObj(key, Value[key]);
                    if (result) {
                        finalObj["children"].push(result);
                    }
                }
                if (finalObj["children"].length == 0) return undefined;
            }
            else if (isFunction(Value)) return undefined;
            else return undefined;

            return finalObj;
        }

        function GetAllModelsTreeSource(Arr) {
            var arr = new Array();

            $.each(Arr, function (index, str) {
                var obj = eval("(" + str + ")");

                if (obj) {
                    var TreeObj = ConvertToModelTreeObj(str, obj);
                    if (TreeObj) arr.push(TreeObj);
                }

            });

            var RegisterArr = new Array();

            for (var modelkey in $.iwf.models) {
                var TreeObj = ConvertToModelTreeObj(modelkey, $.iwf.models[modelkey]);
                if (TreeObj) RegisterArr.push(TreeObj);
            };

            arr.push({
                "name": "Register",
                "children": RegisterArr
            });

            return arr;

        }

        function LoadJS(key, path, callback) {
            var obj = eval("(" + key + ")");
            if (obj) callback();
            else
                $.getScript(path, function () {
                    callback();
                });
        }

        function ArrEachfunc(arr, eachfunc, callback, index) {
            if (!eachfunc) alert("第二个参数为每次执行函数");
            if (!index) index = 0;
            if (arr.length - 1 == index) {
                if (callback) callback();
                return;
            }
            var ent = arr[index];
            eachfunc(ent, function () {
                ArrEachfunc(arr, eachfunc, callback, index + 1);
            });
        }


        var AllTypeArr;

        function GetAllPrivilege() {
            return jQuery.PackResultSync("IWorkPrivilegeManage.data?action=GetAllPrivilegeType", {});
        }


        this.show = function (module, root, InitOpt) {

            root.load("framework/addins/sysobjectsmodel/sysobjectsmodel.html", function () {

                var MenuStr = '<div  style="position: absolute; left: 0px; top: 0px; background-color: #ead8d8; display: none">'
                              + '<ul class="frametreeMenu">'
                              + '<li action="Add">关联到权限</li>'
                              + '<li action="Remove">移除指定PType关联</li>'
                              + '</ul></div>';
                var ViewMenu = $(MenuStr).appendTo('body');

                var ModelsTree;

                function ReCalculate() {
                    var selectNode = ModelsTree.frametree("GetCurSelectNode");
                    var NameStr = "Key:" + selectNode.value.PropertyName;
                    AllTypeArr = GetAllPrivilege();
                    var arr = AllTypeArr.FindAll(function (ent) { return ent.ModelKey == selectNode.value.PropertyName; }).Select(function (ent) { return ent.PType; });
                    if (arr.length > 0) {
                        var str = "【PType=(" + arr.join(",") + ")】";
                        NameStr += str;
                    }
                    if (selectNode.value.modelName) {
                        NameStr += "【" + modelName + "】";
                    }
                    var obj = new Object();
                    obj.dom = selectNode.dom;
                    obj.value = selectNode.value;
                    obj.value.name = obj.name = NameStr;
                    ModelsTree.frametree("EditThis", obj.dom, obj.value, obj.name);
                }

                AllTypeArr = GetAllPrivilege();


                ViewMenu.find("[action=Add]").mousedown(function () {

                    var selectNode = ModelsTree.frametree("GetCurSelectNode");

                    var win = $('body').iwfWindow({
                        title: '添加',
                        width: 400,
                        height: 400,
                        button: [
                             {
                                 text: '确定', handler: function () {
                                     var param = new Object();
                                     param.Name = win.dialogdom.find("[field=Name]").val();
                                     param.Key = $.trim(win.dialogdom.find("[field=Key]").val());
                                     param.PType = $.trim(win.dialogdom.find("[field=PType]").val());
                                     param.Type = win.dialogdom.find("[field=Type]").val();
                                     if (param.Name == "" || param.Name == null) { alert("权限中文名是必填項"); return; }
                                     if (param.Key == "" || param.Key == null) { alert("权限键值是必填項"); return; }
                                     $.PackResult("IWorkPrivilegeManage.data?action=CreatePrivilege", param, function (data) {
                                         win.close();
                                         ReCalculate();
                                         alert("添加完成");
                                     });

                                 }
                             },
                             {
                                 text: '取消', handler: function () {
                                     win.close();
                                 }
                             }
                        ]
                    });

                    win.load("framework/addins/sysobjectsmodel/CreatePrivilege.html", function () {
                        var AllTypeName = AllTypeArr.Select(function (ent) { return ent.Type; }).Distinct();
                        win.content().find("[field =Type]").frameAutoinput({ textArray: AllTypeName });
                        win.content().find("[field=Key]").val(selectNode.value.PropertyName);
                        win.content().find("[field=Name]").val("未命名");
                    });



                });

                ViewMenu.find("[action=Remove]").mousedown(function () {
                    var selectNode = ModelsTree.frametree("GetCurSelectNode");

                    var win = $('body').iwfWindow({
                        title: '移除',
                        width: 400,
                        height: 400,
                        button: [{
                            text: '确定', handler: function () {
                                var param = new Object();
                                param.PType = win.content().find("[field=PType]").val()
                                param.Key = selectNode.value.PropertyName;
                                var obj = AllTypeArr.Find(function (ent) { return ent.ModelKey == param.Key && ent.PType == param.PType; });
                                if (obj) {
                                    $.PackResult("IWorkPrivilegeManage.data?action=DeletePrivilege", { "PID": obj.PID }, function (data) {
                                        win.close();
                                        ReCalculate();
                                        alert("删除成功");
                                    });
                                } else {
                                    alert("此Key已不再此PType中找到");
                                }

                            }
                        }, {
                            text: '取消', handler: function () {
                                win.close();
                            }
                        }]
                    });

                    win.load("framework/addins/sysobjectsmodel/RemovePrivilege.html", function () {
                        AllTypeArr = GetAllPrivilege();
                        var arr = AllTypeArr.FindAll(function (ent) { return ent.ModelKey == selectNode.value.PropertyName; }).Select(function (ent) { return ent.PType; });
                        $.each(arr, function (index, item) {
                            var htmlstr = "<option value=" + item + ">" + item + "</opton>";
                            win.content().find("[field=PType]").append(htmlstr);
                        });
                    });
                });


                root.iwfTab({
                    tabchange: function (dom) {
                        var viewingangle = dom.attr("viewingangle");
                        switch (viewingangle) {
                            case "ActualTime":
                                var TreeUI = dom.find('[iwftype=tree]');
                                var variableArr = new Array();
                                var rg = new RegExp("[A-Z]");
                                for (var name in $) {
                                    var FirstAlphabet = name.substr(0, 1);
                                    if (name == "iwf" || rg.test(FirstAlphabet)) {
                                        var str = "$." + name;
                                        variableArr.push(str);
                                    }
                                }
                                var arr = GetTreeSource(variableArr);

                                TreeUI.frametree({
                                    treesource: [{
                                        "name": "JQuery",
                                        "children": arr
                                    }],
                                    checkbox: false
                                });

                                TreeUI.frametree("UnExpandAllNodes", 1);
                                break;
                            case "Models":
                                var TreeUI = dom.find('[iwftype=tree]');
                                ModelsTree = TreeUI;
                                var arr = new Array();
                                //把appConfig.models变成数组
                                for (var name in appConfig.models) {
                                    var key = name;
                                    var path = appConfig.models[name];
                                    var obj = new Object();
                                    obj["key"] = key;
                                    obj["path"] = path;
                                    arr.push(obj);
                                }
                                //变量处理，这里可能会耗点时间
                                var win = null;
                                ArrEachfunc(arr,
                                    function (item, continuefunc) {
                                        var obj = eval("(" + item.key + ")");
                                        if (obj) continuefunc();
                                        else {
                                            if (win == null) win = $('body').iwfWindow({
                                                title: '装载JS',
                                                width: 800,
                                                height: 500
                                            });

                                            var div = $("<div>" + item.path + "</div>");
                                            win.content().prepend(div);
                                            try {
                                                $.getScript(item.path, function () {
                                                    div.append("-->OK").css("color", "green");
                                                    continuefunc();
                                                });
                                            } catch (e) {
                                                div.append("-->error:" + e.message).css("color", "red");
                                                continuefunc();
                                            }
                                        }
                                    }, function () {
                                        //这里以确保全部JS已经加载完毕
                                        setTimeout(function () { if (win) win.close(); }, 1000);
                                        var variableArr = new Array();
                                        var rg = new RegExp("[A-Z]");
                                        for (var name in $) {
                                            var FirstAlphabet = name.substr(0, 1);
                                            if (name == "iwf" || rg.test(FirstAlphabet)) {
                                                var str = "$." + name;
                                                variableArr.push(str);
                                            }
                                        }

                                        var arr = GetAllModelsTreeSource(variableArr);

                                        TreeUI.frametree({
                                            treesource: [{
                                                "name": "所有models",
                                                "children": arr
                                            }],
                                            checkbox: false,
                                            IshasContextmenu: true,
                                            contextmenu: ViewMenu,
                                            node_rightclick: function (event, data) {
                                                ViewMenu.find("li[action]").hide();
                                                if (data.IsEndLI) ViewMenu.find("li[action]").show();
                                            }
                                        });

                                        TreeUI.frametree("UnExpandAllNodes", 1);
                                    });
                                break;
                            default:
                                break;
                        }
                    }
                });

            });

        }
    }
});