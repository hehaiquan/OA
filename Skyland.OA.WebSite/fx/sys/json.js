define(function () {
    return new function () {

        var self = this;

        this.options = { key: 'MaxJsonEditor' };

        function jsonToString(obj) {
            if (JSON && JSON.stringify) return JSON.stringify(obj);
            switch (typeof (obj)) {
                case 'string':
                    return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';
                case 'array':
                    return '[' + obj.map(jsonToString).join(',') + ']';
                case 'object':
                    if (obj instanceof Array) {
                        var strArr = [];
                        var len = obj.length;
                        for (var i = 0; i < len; i++) strArr.push(jsonToString(obj[i]));
                        return '[' + strArr.join(',') + ']';
                    } else if (obj == null) {
                        return 'null';
                    } else {
                        var string = [];
                        for (var property in obj) string.push(jsonToString(property) + ':' + jsonToString(obj[property]));
                        return '{' + string.join(',') + '}';
                    }
                case 'number':
                    return obj;
                case false:
                    return obj;
            }
        }


        function isNumber(val) {
            return typeof val === 'number' && isFinite(val);
        }

        function isArray(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
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
            } else if (isObject(Value)) {//isObject({})==true,这点要特别注意到
                finalObj["name"] = Name;
                finalObj["children"] = new Array();
                for (var key in Value) {
                    finalObj["children"].push(ConvertToTreeObj(key, Value[key]));
                }
                if (finalObj["children"].length == 0) finalObj["PropertyValue"] = Value;
            }
            else {
                var text = Name + "：" + JsonSerialize(Value);
                finalObj["name"] = text;
                finalObj["PropertyValue"] = Value;
            }
            return finalObj;
        }

        function ConvertToJsonObj(node) {
            var finalObj = new Object();
            var PropertyName = node.value["PropertyName"];

            //自己是一个数组的子集同时自己也是一个数组
            if (node.value["IsArrayElement"] && node.value.IsParent) {
                finalObj = new Array();
                if (node["children"] && node["children"].length > 0) {
                    for (var i = 0; i < node["children"].length; i++) {
                        var obj = node["children"][i];
                        var key = obj.value["PropertyName"];
                        var target = ConvertToJsonObj(obj);
                        var finalvalue;

                        if (obj.value["IsArrayElement"] && obj.value.IsParent) finalvalue = target;
                        else finalvalue = target[key];

                        finalObj.push(finalvalue);
                    }
                }
                return finalObj;
            }
                //自己也是一个数组但自己不是任何数组的子集
            else if (node.value.IsParent && node.value["IsArrayElement"] != true) finalObj[PropertyName] = new Array();
                //自己既不是数组,也不是任何数组的子集
            else finalObj[PropertyName] = new Object();

            if (node["children"] && node["children"].length > 0) {
                for (var i = 0; i < node["children"].length; i++) {

                    var obj = node["children"][i];
                    var key = obj.value["PropertyName"];
                    var target = ConvertToJsonObj(obj);
                    var finalvalue;
                    if (obj.value["IsArrayElement"] && obj.value.IsParent) finalvalue = target;
                    else finalvalue = target[key];


                    if (isArray(finalObj[PropertyName])) finalObj[PropertyName].push(finalvalue);
                    else finalObj[PropertyName][key] = finalvalue;

                }
            }
            else {
                if (node.value.IsParent == true) {

                }
                else {
                    var PropertyValue = node.value["PropertyValue"];
                    if (PropertyValue == null) PropertyValue = null;
                    finalObj[PropertyName] = PropertyValue;
                }
            }
            return finalObj;
        }

        function AnalyseJsonToTreeObj(res) {
            var data = eval('(' + res + ')');
            var TreeObj = ConvertToTreeObj("JSON", data);

            if (TreeObj.children.length == 0) return [];
            else {
                var arr = new Array();
                arr.push(TreeObj);
                return arr;
            }
        }

        function JsonSerialize(value, Isbeautify) {
            if (Isbeautify) return JSON.stringify(value, null, 4);
            else return jsonToString(value);
        }

        this.show = function (module, root, InitOpt) {

            root.load("fx/sys/MaxJsonEditor.html", function () {
                var MenuStr = '<div  style="position: absolute; left: 0px; top: 0px; background-color: #ead8d8; display: none">'
                              + '<ul class="frametreeMenu">'
                              + '<li action="Add">添加Json节点</li>'
                              + '<li action="Edit">编辑Json节点</li>'
                              + '<li action="Delete">删除Json节点</li>'
                              + '</ul></div>';
                var ViewMenu = $(MenuStr).appendTo('body');
                var JSONTreeUI = root.find("[iwftype=tree]");
                var JSONTextarea = root.find("textarea").focus(function () { this.select(); });

                self.GetThisJson = function () {

                    if (!JSONTextarea.is(":visible")) Refresh_JSONTextarea();

                    return JSONTextarea.val();

                };


                if (InitOpt && InitOpt.JsonText && isEasyData(InitOpt.JsonText)) JSONTextarea.val(InitOpt.JsonText.toString());

                root.find("[iwftype=Beautify]").click(function () {
                    var json = GetJsonFromTextarea();
                    try {
                        data = eval('(' + json + ')');
                        var res = JsonSerialize(data, true);
                        JSONTextarea.val(res);
                    } catch (e) {
                        alert("非Json格式无法美化");
                        return;
                    }
                });
                root.find("[iwftype=Condense]").click(function () {
                    var json = GetJsonFromTextarea();
                    try {
                        data = eval('(' + json + ')');
                        var res = JsonSerialize(data);
                        JSONTextarea.val(res);
                    } catch (e) {
                        alert("非Json格式无法压缩");
                        return;
                    }
                });



                var GetJsonFromTextarea = function () {
                    var str = JSONTextarea.val();
                    if ($.trim(str) == "") str = "{}";
                    return str;
                }

                var GetJsonDataFromTreeNode = function (Node) {
                    Node.children = JSONTreeUI.frametree("GetSchemaUnderNode", Node.dom);
                    var result = ConvertToJsonObj(Node);
                    var FlagNodeIsArrayElement = Node.value.IsArrayElement;
                    if (Node.value.IsArrayElement == true && !Node.value.IsParent) result = result[Node.value.PropertyName];
                    return result;
                }

                var GetTreeDataFromJson = function (Node, json) {
                    var data;
                    if (Node.value.PropertyValue && Node.value.IsArrayElement) {
                        if (json == "") json = "\"\"";
                    } else {
                        if (json == "") json = "{}";
                    }
                    try {
                        data = eval('(' + json + ')');
                    } catch (e) {
                        alert("非标准Json无法形成可用视图");
                        return undefined;
                    }




                    if (Node.value.IsArrayElement == true) {
                        var TreeObj = ConvertToTreeObj(Node.value["PropertyName"], data, true);
                        var arr = new Array(TreeObj);
                        return arr;
                    } else {
                        //if (!Node.value.IsParent && isArray(data)) {
                        if (isObject(data) == false) {
                            alert("无法从原本Object转化成非Object类型违法Json规则，若要一定要改请修改整个父级");
                            return undefined;
                        }
                        var TreeObj = ConvertToTreeObj("JSON", data);
                        var NeedReplace = TreeObj.children;
                        return NeedReplace;
                    }
                }

                ViewMenu.find("[action=Add]").mousedown(function () {
                    var selectNode = JSONTreeUI.frametree("GetCurSelectNode");
                    var win = $('body').iwfWindow({
                        title: '添加',
                        width: 800,
                        height: 600,
                        button: [
                           {
                               text: '确定', handler: function () {
                                   var json = win.content().find("textarea").val();
                                   json = $.trim(json);
                                   var AddObj;

                                   if (selectNode.value.IsParent) {
                                       if (json == "") json = "\"\"";
                                   }
                                   else {
                                       if (json == "") json = "{}";
                                   }

                                   try {
                                       AddObj = eval('(' + json + ')');
                                   } catch (e) {
                                       alert("非标准Json无法形成可用视图");
                                       return;
                                   }

                                   var result = GetJsonDataFromTreeNode(selectNode);

                                   var resultContent;
                                   if (selectNode.value.IsArrayElement) resultContent = result;
                                   else resultContent = result[selectNode.value["PropertyName"]];

                                   if (selectNode.value.IsParent) resultContent.push(AddObj);
                                   else {
                                       if (isObject(AddObj) == false) { alert("无法在Object之下添加非Object，这违反Json标准规则"); return; }
                                       else {
                                           for (var name in AddObj) {
                                               if (resultContent[name] && !confirm("检测到本级已有" + name + "属性，是否覆盖原属性")) continue;
                                               resultContent[name] = AddObj[name];
                                           }
                                       }
                                   }
                                   var str = JsonSerialize(result);
                                   var TreeObj = GetTreeDataFromJson(selectNode, str);
                                   var NewDom = JSONTreeUI.frametree("UpdateThisAll", selectNode.dom, TreeObj);
                                   JSONTreeUI.frametree("UnExpandUnderNode", NewDom);
                                   win.close();
                               }
                           }, {
                               text: '取消', handler: function () { win.close(); }
                           }
                        ]
                    });
                    win.content().html('<textarea style="width: 100%;height:100%"></textarea>');
                });

                ViewMenu.find("[action=Delete]").mousedown(function () {
                    var selectNode = JSONTreeUI.frametree("GetCurSelectNode");
                    JSONTreeUI.frametree("DeleteThis", selectNode.dom);
                    var finalNode = JSONTreeUI.frametree("GetNodeByDom", selectNode.parentdom);

                    if (finalNode.value.IsParent == true) {
                        var result = GetJsonDataFromTreeNode(finalNode);
                        var str = JsonSerialize(result);
                        var TreeObj = GetTreeDataFromJson(finalNode, str);
                        var NewDom = JSONTreeUI.frametree("UpdateThisAll", finalNode.dom, TreeObj);
                        JSONTreeUI.frametree("UnExpandUnderNode", NewDom);
                    }
                });

                ViewMenu.find("[action=Edit]").mousedown(function () {
                    var selectNode = JSONTreeUI.frametree("GetCurSelectNode");
                    var result = GetJsonDataFromTreeNode(selectNode);

                    var strjson = JsonSerialize(result, true);

                    var win = $('body').iwfWindow({
                        title: '编辑',
                        width: 800,
                        height: 600,
                        button: [
                            {
                                text: '确定', handler: function () {
                                    var str = win.content().find("textarea").val();
                                    str = $.trim(str);
                                    //if (str == "") str = "{}";
                                    var TreeObj = GetTreeDataFromJson(selectNode, str);
                                    if (TreeObj == undefined) return;
                                    var NewDom = JSONTreeUI.frametree("UpdateThisAll", selectNode.dom, TreeObj);
                                    JSONTreeUI.frametree("UnExpandUnderNode", NewDom);
                                    win.close();
                                }
                            }, {
                                text: '取消', handler: function () { win.close(); }
                            }
                        ]
                    });
                    win.content().html('<textarea style="width: 100%;height:100%"></textarea>');
                    win.content().find("textarea").val(strjson).focus();

                });

                function Refresh_JSONTextarea() {
                    var obj = JSONTreeUI.frametree("GetSchemaObject");
                    if (obj.length == 0) { JSONTextarea.val(""); return; }
                    var TreeObj = obj[0];
                    var result = ConvertToJsonObj(TreeObj);
                    var str = JsonSerialize(result["JSON"]);
                    JSONTextarea.val(str);
                };

                root.iwfTab({
                    //Json转化UI时之前先要校验
                    beforeTabchange: function (dom, event) {
                        var viewingangle = dom.attr("viewingangle");
                        if (viewingangle == "View") {
                            try {
                                var str = JSONTextarea.val();
                                if ($.trim(str) == "") str = "{}";
                                eval('(' + str + ')');
                                return true;
                            } catch (e) {
                                event.preventDefault();
                                alert("非标准Json无法形成可用视图");
                                return false;
                            }
                        }
                    },
                    //视角相互转换
                    tabchange: function (dom) {
                        var viewingangle = dom.attr("viewingangle");
                        switch (viewingangle) {
                            case "View":
                                var str = GetJsonFromTextarea();
                                var treeOBJ = AnalyseJsonToTreeObj(str);
                                JSONTreeUI.frametree({
                                    treesource: treeOBJ,
                                    checkbox: false,
                                    IshasContextmenu: true,
                                    contextmenu: ViewMenu,
                                    node_rightclick: function (event, data) {
                                        ViewMenu.find("li[action]").hide();
                                        if (data.IsEndLI == false) ViewMenu.find("[action=Add]").show();
                                        if (data.level != 0) ViewMenu.find("[action=Edit],[action=Delete]").show();
                                    }
                                });
                                JSONTreeUI.frametree("UnExpandAllNodes", 1);
                                break;
                            case "Detail":
                                Refresh_JSONTextarea();
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