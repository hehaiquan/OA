define(function () {
    //return function () {
        $.iwf.formdesign = new function () {
            //彭博帮改
            Array.prototype.S = function () { return String.fromCharCode(2); };
            Array.prototype.in_array = function (e) {
                var r = new RegExp(this.S() + e + this.S());
                return (r.test(this.S() + this.join(this.S()) + this.S()));
            }
            var me = this;
            this.options = { key: 'formdesign' };
            var lpanel, rpanel;

            function regeditForm(node) {
                var km = {
                    formGroup: ko.observableArray(formSetting.pdata),
                    formName: ko.observable((node && node.FName) ? node.FName : ''),
                    formPID: ko.observable(formSetting.parentID),
                    formURL: ko.observable((node && node.FUrl) ? node.FUrl : 'Forms/xx/page.html'),
                    formID: ko.observable((node && node.FID) ? node.FID : ''),

                    save: function (callback) {

                        var params = { id: (node) ? node.FID : null, pid: km.formPID(), name: km.formName(), furl: km.formURL() };
                        $.getJSON("engine.data?action=createform", params, function (json) {
                            if (json.success == false) {
                                alert(json.msg);
                            } else {
                                callback();
                            }
                        });
                    }
                };

                var win = $('body').iwfWindow({
                    title: '表单注册/编辑',
                    width: 450,
                    height: 250,
                    button: [{
                        text: '确定', handler: function (data) {
                            km.save(function () {
                                formSetting.load();
                                win.close();
                            });
                        }
                    }, {
                        text: '取消', handler: function () { win.close(); }
                    }]
                });
                win.load("fx/sys/formedit.html", function () {
                    ko.applyBindings(km, this);
                });
            }

            var formSetting = {

                delNode: function () {
                    if (formSetting.cNode && confirm("决定删除当前选择吗？")) {
                        $.getJSON("engine.data?action=deleteform", { fid: formSetting.cNode.FID, ttt: Math.random() }, function (data) {
                            if (data.success) formSetting.load();
                            else alert(data.msg);
                        });
                    }
                },

                treejson: {
                    data: [],
                    expandbyClick: true,
                    //flowlayout:120,
                    itemclick: function (node) {
                        formSetting.cNode = node;
                        if (node.url) designSetting.reload(node.ID, node.url);
                        return true;
                    }
                },

                load: function () {
                    $.getJSON("engine.data?action=getforms", { ttt: Math.random() }, function (json) {
                        // formSetting.pdata = [{ id: '', name: '==表单分组==' }];

                        $.each(json, function (i, item) {
                            var beIn = false;
                            if (item.PFID == null) {
                                $.each(formSetting.treejson.data, function (j, node) {
                                    if (node.id == (item.FID + "P")) {
                                        node.text = item.FName;
                                        beIn = true;
                                    }
                                });
                                if (beIn == false) {
                                    var n = { type: 'group', text: item.FName, id: item.FID + "P", expend: false, unselectable: true, css: "list-group-item treeview-bar" };
                                    n.children = [];

                                    formSetting.treejson.data.push(n);
                                }
                            } else {
                                $.each(formSetting.treejson.data, function (j, node) {
                                    if (node.id == (item.PFID + "P")) {
                                        beIn = true;
                                        node.children.push({ id: item.FID, text: item.FName, title: item.FUrl, url: item.FUrl });
                                        return false;
                                    }

                                });
                                if (beIn == false) {
                                    var n = { type: 'group', text: item.PFID, id: item.PFID + "P", expend: false, unselectable: true, css: "list-group-item treeview-bar" };
                                    n.children = [{ id: item.FID, text: item.FName, title: item.FUrl, url: item.FUrl }];
                                    formSetting.treejson.data.push(n);
                                }
                            }
                        });
                        var tree = lpanel.children('#allforms-tree');

                        $("#allforms-tree").listView2(formSetting.treejson);

                    });
                }
            };

            var tools = [
                //{ title: '添加分组', text: '分组', iconCls: 'fa fa-folder-open-alt', handler: function () { regeditForm('addgroup'); } },
                 //{ type: 'split' },
                { title: '新建表单或者分组', text: '新建', handler: function () { regeditForm(); } },
                 //{ type: 'split' },
                { title: '删除分组或表单', text: '删除', iconCls: 'fa fa-times', handler: function () { formSetting.delNode(); } }
            ];

            var designSetting = {
                currentID: null,
                HtmlfileName: null,
                dataDefined: {},
                getTableNames: function (callback, v) {
                    var url = "common.data?action=getalltablename";
                    $.getJSON(url, function (json) {
                        callback(json);
                    });
                },
                getFieldNames: function (tbName, callback) {
                    var url = "common.data?action=getfieldnames&tableName=" + tbName;
                    $.getJSON(url, function (json) {
                        var names = '';
                        $.each(json, function (i, item) {
                            if (names.length > 0) names += ",";
                            names += item[0];
                        });
                        callback(names);
                    });
                },
                reload: function (id, HtmlfileName) {
                    designSetting.currentID = id;
                    designSetting.HtmlfileName = HtmlfileName;
                    var params = { fid: id, fileName: HtmlfileName };
                    $.get("file.data?action=readform&ttt=" + Math.random(), params, function (shtml) {
                        if (shtml == "{\"success\":false,\"msg\":\"找不到文件\"}") {
                            alert("找不到 html 文件！");
                            designSetting.load('');
                        }
                        else
                            designSetting.load(shtml);
                    });
                },
                save: function (html) {
                    if (confirm("注意：保存HTML时将覆盖原HTML文件，你真的决定保存吗？")) {
                        var params = { fid: designSetting.currentID, content: encodeURI(html), fileName: designSetting.HtmlfileName };
                        $.post("file.data?action=saveform&ttt=" + Math.random(), params, function (data) {
                            var json = JSON.parse(data);
                            alert(json.msg);
                        });
                    }
                },
                reloadJS: function (callback) {
                    if (designSetting.HtmlfileName != null) {
                        var params = { fid: designSetting.currentID, fileName: designSetting.HtmlfileName.replace(".html", ".js") };
                        $.get("file.data?action=readform&ttt=" + Math.random(), params, function (sjs) {
                            if (sjs == "{\"success\":false,\"msg\":\"找不到文件\"}") {
                                alert("找不到 JS 文件！");
                                callback('');
                            }
                            else
                                if (callback) callback(sjs);
                        });
                    }
                },
                saveJS: function (js) {
                    if (confirm("注意：保存JS时将覆盖原JS文件，你真的决定保存吗？")) {
                        var params = { fid: designSetting.currentID, content: encodeURI(js), fileName: designSetting.HtmlfileName.replace(".html", ".js") };
                        $.post("file.data?action=saveform&ttt=" + Math.random(), params, function (data) {
                            var json = JSON.parse(data);
                            if (json.msg) alert(json.msg);

                        });
                    }
                },

                reloadConfig: function (callback) {
                    if (designSetting.HtmlfileName != null) {
                        var params = { fid: designSetting.currentID, fileName: designSetting.HtmlfileName.replace(".html", ".config") };
                        $.get("file.data?action=readform&ttt=" + Math.random(), params, function (sconfig) {
                            if (sconfig == "{\"success\":false,\"msg\":\"找不到文件\"}") {
                                alert("找不到数据访问配置文件！");
                                callback('{}');
                            }
                            else
                                if (callback) callback(sconfig);

                        });
                    }
                },
                saveConfig: function (Config, callback) {
                    if (confirm("注意：保存Config时将覆盖原Config文件，你真的决定保存吗？")) {
                        var params = { fid: designSetting.currentID, content: Config, fileName: designSetting.HtmlfileName.replace(".html", ".config") };
                        $.post("file.data?action=saveform&ttt=" + Math.random(), params, function (data) {
                            var json = JSON.parse(data);
                            if (json.msg) alert(json.msg);
                            else callback(json);
                        });
                    }
                }
            }

            this.resize = function () {
                if (designSetting.resize) designSetting.resize();
            }

            this.show = function (module, root) {
                if (root.children().length == 0) {
                    var content = root.splitContent({ module: module });
                    lpanel = content.leftPanel();

                    lpanel.append('<div style="margin:0px 0px 10px 0px"></div>').children().last().iwfToolbar({ data: tools });
                    //lpanel.append('<div class="iwf-navmodule-item-line"></div>');
                    //lpanel.append('<ul id="allforms-tree" class="ztree"></ul>');
                    lpanel.append('<div id="allforms-tree"></div>');

                    rpanel = content.rightPanel();
                    rpanel.iwfHtmlDesign(designSetting);
                    formSetting.load();
                }
                this.resize();
            }
        }();

        //数据源配置工具
        $.iwf.formdesign.datasourceManage = function (QueryConfig, callback) {

            var win = $('body').iwfWindow({
                title: '查询设计器',
                width: 800,
                height: 600,
                button: [{
                    text: '确定', handler: function (data) {
                        var config = getQueryString();

                        callback(JsonUti.convertToString(config));  //回调保存，并更新当前数据源设置。

                        win.close();
                    }
                }, {
                    text: '取消', handler: function () { win.close(); }
                }]
            });

            function getQueryString() {
                var config = new Object();
                win.content().find(".setting[divtype=clone]").each(function () {
                    var dom = $(this);
                    var Key = dom.find("[field=mark]").val();
                    var keyfield = dom.find("[field=unique]").val();
                    var conditions = dom.find("[field=conditions]").val().split(",");
                    var tableName = dom.find("[field=alltable]").val();
                    var type = dom.find("[field=type]").val();
                    var obj = dom.find("[field=fieldCombox]").frameListChose("GetAllChoseData");

                    var fields = obj.PickByField("id");


                    config[Key] = new Object();
                    config[Key]["table"] = tableName;
                    config[Key]["fields"] = fields;
                    config[Key]["conditions"] = conditions;
                    config[Key]["type"] = type;
                    config[Key]["keyfield"] = keyfield;
                });
                return config;
            }

            win.load("fx/sys/querydesign.html", function () {
                $("#querydesign-look-content").val(JSON.stringify(QueryConfig));
                win.content().iwfTab({
                    tabchange: function (dom) {
                        var viewingangle = dom.attr("viewingangle");
                        switch (viewingangle) {
                            case "look":
                                //
                                //debugger
                                var config = getQueryString();
                                dom.text(JsonUti.convertToString(config));
                                // dom.text(JSON.stringify(config));
                                //
                                break;
                            default:
                                //  QueryConfig = JSON.parse($("#querydesign-look-content").val());
                                // loadConfig();
                                break;
                        }
                    }
                });
                //开始去找所有的表
                $.PackResult("IWorkDbManage.data?action=FindALLTable", {}, function (data) {
                    //构成模板
                    var TempleDOM = win.content().find(".setting").clone().show().attr("divtype", "clone");
                    //表下框初始给一个（--选择表 --）
                    TempleDOM.find("[field=alltable]").append("<option value=none>--选择表 --</option>");
                    //表下框开始装载所有的表
                    $.each(data, function (index, ent) {
                        TempleDOM.find("[field=alltable]").append("<option value=" + ent + ">" + ent + "</option>");
                    });
                    //至此单行模板已经全部完成装载
                    var Tab1 = win.content().find("#querydesign-design-content");

                    function Analysis(data) {
                        var arr = new Array();
                        $.each(data, function (index, ent) {
                            var obj = new Object();
                            obj.id = ent.name;
                            obj.name = ent.zhname == "" ? ent.name : ent.name + "(" + ent.zhname + ")";
                            obj.zhname = ent.zhname;
                            obj.children = new Array();
                            arr.push(obj);
                        });
                        return arr;
                    }
                    //首先获取Tab1节点
                    function MakeUpUnique(NewItem, tablename, callback) {

                        //根据表获取
                        $.PackResult("IWorkDbManage.data?action=GetAllFieldInfo", { "tablename": tablename }, function (data) {
                            var arr = Analysis(data);
                            var initarr = Analysis(data);


                            NewItem.find("[field =fieldCombox]").frameListChose({ TreeSource: arr });
                            NewItem.find("[field =fieldCombox]").frameListChose({ InitCheckSource: initarr });

                            if (callback) callback(NewItem);
                        });

                        //$.PackResult("IWorkDbManage.data?action=FindALLField", { "tablename": tablename }, function (fields) {
                        //    //其实一下可以理解为根据得到的数据构造字段选择下拉框
                        //    NewItem.find("[field=field]").val(fields.join(","));
                        //    NewItem.find("[field=unique]").empty();
                        //    $.each(fields, function (index, ent) {
                        //        NewItem.find("[field=unique]").append("<option value=" + ent + ">" + ent + "</option>");
                        //    });


                        //    if (callback) callback(NewItem);
                        //});
                    }

                    function FindALLFieldCallback(NewItem, tablename, callback) {
                        $.PackResult("IWorkDbManage.data?action=GetAllFieldInfo", { "tablename": tablename }, function (data) {
                            NewItem.find("[field=unique]").empty();
                            $.each(data, function (index, ent) {
                                NewItem.find("[field=unique]").append("<option value=" + ent.name + ">" + ent.name + "</option>");
                            });
                            if (callback) callback(data);
                        });
                    }


                    function BindEventToNewOne(NewItem, callback) {
                        //表改变事件
                        NewItem.find("[field=alltable]").change(function () {
                            var tablename = $(this).val();
                            MakeUpUnique(NewItem, tablename);
                        });

                        NewItem.find("[action=del]").click(function () {
                            setTimeout(function () {
                                NewItem.remove();
                            }, 10)
                        });

                        if (callback) callback();
                    }

                    Tab1.find("[action=new]").click(function () {
                        var NewItem = $(TempleDOM[0].outerHTML);
                        Tab1.append(NewItem);
                        BindEventToNewOne(NewItem, function () {
                        })
                    });


                    function loadConfig() {
                        var arr = new Array();
                        for (var name in QueryConfig) {
                            var obj = new Object();
                            obj.Key = name;
                            obj.Entity = QueryConfig[name];
                            arr.push(obj);
                        }


                        $.each(arr, function (index, ent) {
                            var Key = ent.Key;
                            var keyfield = ent.Entity["keyfield"];
                            var tableName = ent.Entity["table"];
                            var type = ent.Entity["type"];
                            var conditions = [];
                            if (ent.Entity["conditions"] && ent.Entity["conditions"] != null) conditions = ent.Entity["conditions"].join(",");
                            var fields = ent.Entity["fields"];

                            var NewItem = $(TempleDOM[0].outerHTML);
                            NewItem.find("[field=mark]").val(Key);
                            NewItem.find("[field=type]").val(type);
                            NewItem.find("[field=conditions]").val(conditions);
                            NewItem.find("[field=alltable]").val(tableName);
                            Tab1.append(NewItem);

                            FindALLFieldCallback(NewItem, tableName, function (result) {
                                var finalFields = new Array();
                                var arr = Analysis(result);

                                if (fields && fields.length > 0) {
                                    finalFields = $.grep(arr, function (a) {
                                        return fields.Contains(a.id);
                                    });
                                }
                                else {
                                    finalFields = arr
                                }

                                NewItem.find("[field =fieldCombox]").frameListChose({
                                    IsCanEdit: false,
                                    TreeSource: arr,
                                    InitCheckSource: finalFields
                                });

                                NewItem.find("[field=unique]").val(keyfield);
                            });
                            BindEventToNewOne(NewItem, function () {
                                NewItem.find("[field=alltable]").val(tableName);
                            })
                        })
                    }
                    loadConfig();
                });

            });
        }



        //表单元素属性设置！
        $.fn.iwfProperty = function (options) {
            var me = this;
            var dataDefined = {};
            var attrVM;
            var bindVM;

            var jscodeer = $.iwf.formdesign.jscodeer;

            var patternData = {
                '\\w+': '不能为空',
                '^\\d+$': '必须为数字且不能为空',
                '^\\d{4}-\\d{2}-\\d{2}$': '输入格式不对',
                '（"^(\d{3.4}-)\d{7,8}$"）': '电话号码',
                '("^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$")': 'Email地址',
                '（"^\d{15}|\d{18}$"）': '验证身份证号',
                '"^[0-9]*$"': '只能输入数字',
                '\S': '必填'
            }
            function initVM() {
                attrVM = {
                    label: ko.observable(),
                    optionsList: ko.observable(),
                    id: ko.observable(),
                    style: ko.observable(),
                    styleAuto: ko.observableArray([]),
                    cssclass: ko.observable(),
                    cssclassAuto: ko.observableArray([]),
                    GridClass: ko.observable(),
                    GridClassAuto: ko.observableArray([]),
                    placeholder: ko.observable(),
                    value: ko.observable(),
                    valueAuto: ko.observableArray([]),
                    datasource: ko.observable(),
                    datasourceAuto: ko.observableArray([]),
                    dataarray: ko.observable(),
                    dataarrayAuto: ko.observableArray([]),
                    optionsAuto: ko.observableArray([]),
                    elementsCount: ko.observable(),

                    disabled: ko.observable(),
                    disabledAuto: ko.observableArray([]),
                    title: ko.observable(),
                    //titleAuto: ko.observableArray([]),
                    pattern: ko.observable(),
                    patternAuto: ko.observableArray([]),
                    text: ko.observable(),
                    value: ko.observable(),
                    checked: ko.observable(),
                    visible: ko.observable(),
                    bindAuto: ko.observableArray([])
                };

                for (var key in patternData) {
                    attrVM.patternAuto.push(key);
                }

                bindVM = {
                    selectOptions: ko.observable(),
                    selectOptionsAuto: ko.observableArray([]),
                    visible: ko.observable(),
                    checked: ko.observable(),
                    value: ko.observable(),
                    click: ko.observable(),
                    onselect: ko.observable(),
                    clickAuto: ko.observableArray([]),
                    bindAuto: ko.observableArray([]),
                    autocomplete: ko.observable()
                }
            }
            initVM();

            var curEl;
            var ElType;  //当前节点类型，文本、form、grid、checkbox...
            var dataName; //当前节点所关联数据源

            var cssClass = {
                button: [".btn .btn-default", "btn btn-primary", "btn btn-info", "btn btn-success", "btn btn-warning", "btn btn-danger", "btn btn-inverse", "btn btn-link"],
                text: ["input-medium search-query", "input-small"],
                TABLE: ["table", "table table-striped", "table table-bordered", "table table-hover", "table table-condensed"],
                DIV: ["alert", "alert alert-error", "alert alert-success", "alert alert-success"]
            }

            var ElTypeDic = { 'NewForm': '列表或表单容器', 'Form': '子表单', 'Grid': '列表控件', 'text': '文本框' };
            var propertyDic = { 'datasource': '表单数据源', 'dataarray': 'Grid数据源', 'label': '录入标签', 'optionsList': '值和标注', 'pattern': '校验表达式', 'cssclass': '样式class', 'selectOptions': '选项源', 'autocomplete': '自动完成源' };

            var attrList;
            var bindList = ['visible'];

            this.setData = function (data) {

                if (data != null) dataDefined = data;

                attrVM.datasourceAuto.removeAll();
                attrVM.dataarrayAuto.removeAll();
                bindVM.selectOptionsAuto.removeAll();
                for (var key in dataDefined) {
                    if (dataDefined[key].type == "Object")
                        attrVM.datasourceAuto.push(key);
                    else if (dataDefined[key].type == "List")
                        attrVM.dataarrayAuto.push(key);
                    else
                        bindVM.selectOptionsAuto.push("page.AllData." + key);
                }
            };

            //设定节点属性
            me.loadEl = function (el) {
                if (el == undefined || el == null) return;
                initVM();
                me.setData(null);
                curEl = $(el);
                dataName = "";

                function getLabel() {
                    var cgDiv = curEl.parent().parent();
                    if (cgDiv.hasClass("control-group")) {
                        var lab = cgDiv.children()[0];
                        if (lab.nodeName == "LABEL")
                            return lab.innerText;
                    }
                    return "";
                }
                function getOptionsList() {
                    var inputs = curEl.parent().children(":" + el.type);
                    var its = "";
                    $.each(inputs, function (i, item) {
                        var opT = "";
                        if (item.nextSibling && item.nextSibling.nodeValue) opT = item.nextSibling.nodeValue;
                        its += item.value + ":" + opT + ",";
                    })
                    its = its.substr(0, its.length - 1);
                    return its;
                }
                //当前选中元素的类别及所属表单数据源，并填充可选字段
                function getElType() {

                    ElType = (el.nodeName == 'INPUT') ? el.type : el.nodeName;

                    //设置div为form或grid
                    if (el.nodeName == "DIV") {

                        if (curEl.attr("datasource") != undefined)
                            ElType = "Form";
                        else if (curEl.attr("dataarray") != undefined) {
                            ElType = "Grid";
                        }
                        else {
                            var tEl = curEl.parent()[0];
                            do {
                                if ($(tEl).attr("datasource") != undefined) break;
                                if ($(tEl).attr("dataarray") != undefined) break;
                                tEl = $(tEl).parent()[0];
                            } while ($(tEl).parent()[0])
                            if ($(tEl).parent()[0] == undefined) ElType = "NewForm";
                        }
                    }
                    else {
                        var tEl = curEl.parent()[0];
                        do {
                            if ($(tEl).attr("datasource") != undefined) {
                                dataName = $(tEl).attr("datasource");
                                break;
                            }
                            else if ($(tEl).attr("dataarray") != undefined) {
                                dataName = $(tEl).attr("dataarray");
                                break;
                            }
                            tEl = $(tEl).parent()[0];
                        } while ($(tEl).parent()[0])
                        //设置绑定数据源的字段
                        bindVM.bindAuto.removeAll();
                        if (dataName != "" && dataDefined[dataName]) {
                            var fields = dataDefined[dataName].fields;
                            for (var f in fields)
                                bindVM.bindAuto.push(fields[f]);
                        }
                    }
                }

                function bindVMtoUI() {
                    me.children().remove();

                    function setItem(key, action, vm, tab) {
                        var keyname = (propertyDic[key]) ? propertyDic[key] : key;
                        var temp = $('<tr name="' + key + '"><td style="width:90px;text-align:right;height:30px;overflow:hidden;">' + keyname + '&nbsp;</td><td></td></tr>').appendTo(tab);
                        var tempBind = (vm[key + "Auto"]) ? key + 'Auto' : 'bindAuto';
                        if (key == 'autocomplete') tempBind = 'selectOptionsAuto';
                        var inp = $('<input style="width:90%;" data-bind="value:' + key + ',autocomplete:' + tempBind + '" data-field="' + key + '" type="text" />').appendTo(temp.children().last());
                        inp.bind("change", action);
                    };

                    var eldescript = (ElTypeDic[ElType]) ? ElTypeDic[ElType] : ElType;
                    if (ElType == "Grid")
                        eldescript += "&nbsp;&nbsp;" + attrVM.dataarray();
                    else if (ElType == "Form")
                        eldescript += "&nbsp;&nbsp;" + attrVM.datasource();
                    var proHead = $('<div width="100%" class="alert-success" style="height:35px;font-size:18px;padding:5px;">&nbsp;&nbsp;' + eldescript + '</div>').appendTo(me);

                    if (ElType == "Grid") {
                        var colbtn = $('<input style="float:right;margin-right:10px;margin-top:-3px;" type="button" value="设置列" class="btn btn-info" />').appendTo(proHead);
                        colbtn.click(function () {
                            dataName = attrVM.dataarray();
                            if (dataDefined[dataName])
                                $.iwf.formdesign.setGrid(dataDefined[dataName], curEl);
                            else
                                alert("请正确设置数据源！");
                        });
                    }

                    var root = $('<table width="100%" border="0" cellspacing="0" cellpadding="0"></table>').appendTo(me);
                    root.append('<tr><td colspan="2" style="background:#D2E5F2;padding:5px;">属性设置</td></tr>');
                    for (i = 0; i < attrList.length; i++) {
                        setItem(attrList[i], onAttrChange, attrVM, root);
                    }
                    ko.applyBindings(attrVM, root[0]);

                    if (bindList.length > 0) {
                        var root2 = $('<table width="100%" border="0" cellspacing="0" cellpadding="0"></table>').appendTo(me);
                        var ttt = ""
                        if (dataName != "") ttt = "&nbsp;&nbsp;(" + dataName + ")";
                        root2.append('<tr><td colspan="2" style="background:#D2E5F2;border-top: 1px solid #b6c7d3;padding:5px;">数据绑定' + ttt + '</td></tr>');
                        for (i = 0; i < bindList.length; i++) {
                            setItem(bindList[i], onBindChange, bindVM, root2);
                        }
                        ko.applyBindings(bindVM, root2[0]);
                    }

                }

                getElType();

                bindList = [];
                switch (ElType) {
                    case "div":
                        attrList = ['id', 'cssclass', 'style'];
                        break;
                    case "NewForm":
                        attrList = ['id', 'cssclass', 'style', 'datasource', 'dataarray'];
                        break;
                    case "Form":
                        attrList = ['id', 'cssclass', 'style', 'datasource'];
                        break;
                    case "Grid":
                        attrList = ['id', 'cssclass', 'style', 'dataarray'];
                        break;
                    case "TABLE":
                        attrList = ['id', 'cssclass', 'style', 'title'];
                        break;
                    case "SELECT":
                        attrList = ['id', 'cssclass', 'style', 'title', 'label', 'disabled', 'placeholder'];
                        bindList = ['visible', 'value', 'selectOptions'];
                        break;
                    case "TEXTAREA":
                        attrList = ['id', 'cssclass', 'style', 'title', 'label', 'disabled'];
                        bindList = ['visible', 'value'];
                        break;
                    case "checkbox":
                        attrList = ['id', 'cssclass', 'style', 'title', 'label', 'disabled', 'optionsList'];
                        bindList = ['visible', 'checked'];
                        break;
                    case "radio":
                        attrList = ['id', 'cssclass', 'style', 'title', 'label', 'disabled', 'optionsList'];
                        bindList = ['visible', 'checked'];
                        break;
                    case "text":
                        attrList = ['id', 'cssclass', 'style', 'title', 'label', 'disabled', 'pattern', 'placeholder'];
                        bindList = ['visible', 'value', 'autocomplete', 'onselect'];
                        break;
                    case "datepicker":
                        attrList = ['id', 'cssclass', 'style', 'title', 'label', 'disabled'];
                        bindList = ['visible', 'value'];
                        break;
                    case "button":
                        attrList = ['id', 'cssclass', 'style', 'title', 'value', 'disabled'];
                        bindList = ['visible', 'click'];
                        break;
                    default:
                        attrList = ['id', 'cssclass', 'style'];
                        break;
                }
                for (i = 0; i < attrList.length; i++) {
                    var attr = attrList[i];
                    if (attr == "label")
                        attrVM.label(getLabel());
                    else if (attr == "optionsList")
                        attrVM.optionsList(getOptionsList());
                    else if (attr == "cssclass")
                        attrVM.cssclass(curEl.attr("class"));
                    else if (curEl.attr(attr))
                        attrVM[attr](curEl.attr(attr));
                    //else
                    //    attrVM[attr]('');
                }

                function bindStrToJson(str) {
                    var jStr = str.replace(/\\/g, "@134").replace(/([^,:]+)/g, '"$1"');
                    var json = JSON.parse("{" + jStr + "}");
                    for (key in json) {
                        json[key] = json[key].replace(/@134/g, "\\")
                    }
                    return json
                };

                var bindStr = curEl.attr('data-bind');
                if (bindStr) {
                    var bindJson = bindStrToJson(bindStr);
                    for (var bind in bindJson) {
                        var ttt = bind.replace(/[ ]/g, "");//清除空格
                        bindVM[ttt](bindJson[ttt]);
                    }
                }
                var ccs = cssClass[ElType];
                attrVM.cssclassAuto.removeAll();
                if (ccs) {
                    for (var c in ccs)
                        attrVM.cssclassAuto.push(ccs[c]);
                }
                bindVMtoUI();
            }

            var onAttrChange = function (key, sender) {
                var v = $(this).val();
                var fieldName = $(this).attr("data-field");
                if (fieldName == 'label') {
                    $(curEl.parent().parent().children()[0]).text(v);
                }
                else if (fieldName == 'optionsList') {
                    //设置checkbox radio
                    var container = curEl.parent();
                    var ty = curEl[0].type;
                    container.empty();
                    var t = '<input type="' + ty + '" value="'
                    var ht = t + v.replaceAll(':', '"/>').replaceAll(',', t);

                    container.append(ht);
                    curEl = container.children(':' + ty);
                } else if (fieldName == "datasource" && v != "") {
                    //创建子表单

                    curEl.attr("datasource", v);
                    attrVM.datasource(v);
                    if (attrVM.datasourceAuto().in_array(v)) {
                        if (attrVM.id() == undefined || attrVM.id() == "") attrVM.id(v + "DIV");
                        jscodeer.addForm(v + "DIV", v);
                        curEl.attr("id", v + "DIV");
                    }
                }
                else if (fieldName == "dataarray" && v != "") {
                    //创建子表单

                    curEl.attr("dataarray", v);
                    attrVM.dataarray(v);
                    if (attrVM.dataarrayAuto().in_array(v)) {
                        if (attrVM.id() == undefined || attrVM.id() == "") {
                            attrVM.id(v + "DIV");
                            curEl.attr("id", v + "DIV");
                        }
                    }
                }
                else if (fieldName == 'cssclass') {

                    if (v) curEl.attr("class", v);
                    else curEl.removeAttr("class");
                }
                else if (fieldName == 'pattern') {
                    if (v) {
                        curEl.attr("pattern", v);
                        if (patternData[v]) {
                            attrVM.title(patternData[v]);
                            curEl.attr("title", patternData[v]);
                        }
                    }
                    else {
                        curEl.removeAttr("pattern");
                        attrVM.title("");
                        curEl.removeAttr("title");
                    }
                }
                else {

                    if (v) curEl.attr(fieldName, v);
                    else curEl.removeAttr(fieldName);
                }
            }

            var onBindChange = function (key, sender) {

                var v = $(this).val();
                var fieldName = $(this).attr("data-field");
                if (fieldName == 'value' || fieldName == 'checked') {
                    var tt = dataDefined[dataName].Dictionary[v];
                    if (tt && tt != "")
                        attrVM.label(tt);
                    else
                        attrVM.label(v);
                    $(curEl.parent().parent().children()[0]).text(attrVM.label());
                }

                var bindStr = '';
                $.each(bindList, function (i, item) {
                    var vb = bindVM[item]();
                    if (item == fieldName) vb = v;

                    if (vb) {
                        if (bindStr.length > 0) bindStr += ",";
                        bindStr += item + ':' + vb
                    }
                });
                if (ElType == "radio") {
                    curEl = curEl.parent().children(":radio");
                }
                if (bindStr.length > 0) curEl.attr('data-bind', bindStr);
                else curEl.removeAttr('data-bind');
            }

            var me = this;


            //设置grid的参数配置
            var gridConfig = {};


            return me
        };


        //html编辑器，另外还有数据源设计器
        //负责设计html文件。和config文件
        $.fn.iwfHtmlDesign = function (options) {

            var defaults = {
                getTableNames: function (callback) { },
                getFieldNames: function (tbName, callback) { },
                //主工具栏
                mainMenu: [
                {
                    title: '表单列表', text: '表单列表', select: false, iconCls: 'fa fa-arrow-left',
                    handler: function () {
                        if (this.select) $("#formdesign-split-tree").hide();
                        else $("#formdesign-split-tree").show();
                    }
                },
                 { type: 'split' },
                { title: '保存', text: '保存', iconCls: 'fa fa-save', handler: save, css: 'btn-primary' },
                { type: 'split' },
                {
                    title: '管理数据源', text: '数据源', iconCls: 'fa fa-sitemap', handler: function () {
                        $.iwf.formdesign.datasourceManage(options.dataDefined, function (data) {
                            //保存后会加入中文备注 
                            options.saveConfig(data, function (json) {
                                //dataDefined = json;
                                propertys.setData(json);
                            });
                        });
                    }
                },
                { type: 'split' },
                        {
                            type: 'group', children: [
                { id: 'cd-001', title: '设计', text: '设计', handler: codeShow, select: true },
                { id: 'cd-002', title: 'HTML', text: 'HTML', handler: codeShow, select: false },
                { id: 'cd-003', title: 'JS', text: ' JS ', handler: codeShow, select: false }
                            ]
                        },
                { type: 'split' },
                { title: '设置为业务模块', text: '业务模块', handler: addToPrivilege, css: 'btn-info' },
                { type: 'split' },
                { title: '在新窗口打开', text: '预览', handler: previewHtml },
                { text: "", type: "text", float: "right", id: "htmlpath" }
                ],
                //页面编辑工具栏
                toolData: [
                {
                    type: 'menu', iconCls: 'fa fa-table', text: '表格', handler: tableAction, flowlayout: 100,
                    children: [
                            { id: 'td-001', name: '插入表格' },
                            { id: 'td-002', name: '插入行' },
                            { id: 'td-003', name: '插入列' },
                            { id: 'td-004', name: '合并下一列' },
                            { id: 'td-005', name: '合并下一行' }
                    ]

                },
                {
                    type: 'menu', iconCls: 'fa fa-columns', text: 'Div', handler: insertDiv,
                    children: [{ id: 'dd-001', name: '12' },
                        { id: 'dd-002', name: '6-6' },
                        { id: 'dd-003', name: '8-4' },
                        { id: 'dd-013', name: '4-8' },
                        { id: 'dd-004', name: '4-4-4' },
                        { id: 'dd-005', name: '2-6-4' }]

                },
                { title: '插入Tab控件', text: 'Tab', key: 'tab', handler: insertFormElement },
                { type: 'split' },
                {
                    type: 'group', children: [
                    { title: '插入单行文本框', text: '文本框', key: 'input', handler: insertFormElement },
                    { title: '插入多行文本框', text: '多行文本', key: 'textarea', handler: insertFormElement },
                    { title: '插入下拉选择框', text: '下拉框', key: 'select', handler: insertFormElement },
                    { title: '插入单选框', text: '单选框', key: 'radio', handler: insertFormElement },
                    { title: '插入多选框', text: '多选框', key: 'checkbox', handler: insertFormElement },
                    { title: '插入按钮', text: '按钮', key: 'button', handler: insertFormElement },
                    { title: '插入日期选择', text: '日期选择', key: 'datepicker', handler: insertFormElement },
                    { title: '插入自动完成', text: '自动完成', key: 'autocomplete', handler: insertFormElement },
                    { title: '插入工作流控件', text: '工作流', key: 'wf', handler: insertWFtool },
                    { title: '插入附件管理', text: '附件', key: 'file', handler: insertFormElement, css: "disabled" },
                    { title: '插入常用语', text: '常用语', key: 'cyy', handler: insertFormElement, css: "disabled" },
                    { title: '插入自定义多选树', text: '多选树', key: 'dxs', handler: insertFormElement },

                    { title: '插入文档标题', text: '标题', key: 'title', handler: insertFormElement },
                    { title: '插入子标题', text: '子标题', key: 'legend', handler: insertFormElement },
                    { title: '插入图片', text: '图片', key: 'img', handler: insertFormElement }
                    ]
                }
                ]
            };

            var opts = $.extend(defaults, options);

            ///界面初始化
            var root = $(this);
            root.css({ "overflow": "hidden" });
            var topMenu = $('<div style="width:100%;height:35;" ></div>').appendTo(root);
            topMenu.iwfToolbar({ data: opts.mainMenu });
            var table = $('<table style="width:100%;min-width: 1400px;" border="0" cellspacing="0" cellpadding="0"></table>').appendTo(root);
            var tools = $('<tr><td style="height:35px;border-bottom: 1px solid #b6c7d3;" colspan="2"></td></tr>').appendTo(table).children().first();
            var navbar = $('<tr><td style="height:30px;border-bottom: 1px solid #b6c7d3;" colspan="2" ></td></tr></tr>').appendTo(table).children().first();
            // var infobar = navbar.next();
            var workspace = $('<tr><td valign="top""></td><td style="width:350px;background:#E9F0F5;" valign="top"></td></tr>').appendTo(table).children().first();
            var content = $('<iframe frameborder="0" scrolling="auto" style="width:100%;height:auto"></iframe>').appendTo(workspace);
            var code = $('<textarea style="width:100%;border:0px;padding:10px;"></textarea>').appendTo(root).hide();
            var jsCode = $('<textarea style="width:100%;border:0px;padding:10px;"></textarea>').appendTo(root).hide();
            var propertys = workspace.next().iwfProperty();
            tools.iwfToolbar({ data: opts.toolData });

            var page = content[0].contentWindow;
            content[0].onload = function () {
                $(page.document.head).empty();

                $('<link rel="stylesheet" type="text/css" href="resources/v3/css/bootstrapD.css"/>').appendTo(page.document.head);
                if (page.document.body.childNodes.length < 2) $('<div class="container"></div>').appendTo(page.document.body);

                page.onmouseup = function (e) {
                    if (e.ctrlKey) {
                        propertys.loadEl(getContent(true))
                    } else {
                        propertys.loadEl(getContent())
                    }
                };
            };


            options.load = function (html) {
                page.document.open();
                page.document.writeln(html);
                page.document.close();
                page.document.designMode = "On";
                page.document.contentEditable = true;
                // infobar.text("页面: " + options.HtmlfileName);
                topMenu.find("[data-id='htmlpath']").html("页面: " + options.HtmlfileName + "&nbsp;&nbsp;&nbsp;&nbsp; ");
                opts.reloadConfig(function (config) {
                    options.dataDefined = eval('(' + config + ')');
                    propertys.setData(options.dataDefined);
                });
                code.val(html);
                opts.reloadJS(function (js) {
                    jsCode.val(js);
                    jscodeer.loadJS(js);
                });
                codeShow()
            };

            options.resize = function () {
                var h = root.height();
                content.height(h - 150);
                code.height(h - 65);
                jsCode.height(h - 65)
            };

            options.resize();
            options.load('');


            function save() {
                if (!jsCode.is(":visible")) {
                    var forms = [];
                    $.each($(page.document.body).find("div[datasource]"), function (key, f) {
                        forms.push($(f).attr("datasource"));
                    });
                    $.each($(page.document.body).find("div[dataarray]"), function (key, f) {
                        forms.push($(f).attr("dataarray"));
                    });
                    jsCode.val(jscodeer.getJS(forms));
                }
                if (opts.saveJS) opts.saveJS(jsCode.val())
                var tempHtml = (code.is(":visible")) ? code.val() : $(page.document.body).html();
                if (opts.save) opts.save(tempHtml)
            }

            function previewHtml() {
                window.open("http://" + location.host + "/" + options.HtmlfileName);
            }

            function addToPrivilege() {
                alert("还未实现，本功能将页面设置为业务模块！加入权限管理");
            }

            function codeShow(sender, data) {
                if (!sender && !data) {
                    code.hide();
                    jsCode.hide();
                    content.show().focus()
                } else {
                    switch (data.id) {
                        case 'cd-001':
                            if (code.is(":visible")) {
                                $(page.document.body).html(code.val());
                                code.hide();
                                topMenu.find("[data-id='cd-002']").removeClass("btn-info");
                            }
                            if (jsCode.is(":visible")) {
                                //   jscodeer.loadJS();
                                jsCode.hide();
                                topMenu.find("[data-id='cd-003']").removeClass("btn-info");
                            }
                            topMenu.find("[data-id='cd-001']").addClass("btn-info");
                            table.show().focus();
                            break;
                        case 'cd-002':
                            if (content.is(":visible")) {
                                code.val($(page.document.body).html());
                                table.hide();
                                topMenu.find("[data-id='cd-001']").removeClass("btn-info");
                            }
                            if (jsCode.is(":visible")) {
                                // jscodeer.loadJS();
                                jsCode.hide();
                                topMenu.find("[data-id='cd-003']").removeClass("btn-info");
                            }
                            topMenu.find("[data-id='cd-002']").addClass("btn-info");
                            code.show().focus();
                            break;
                        case 'cd-003':
                            if (code.is(":visible")) {
                                $(page.document.body).html(code.val());
                                topMenu.find("[data-id='cd-002']").removeClass("btn-info");
                                code.hide();
                            }
                            topMenu.find("[data-id='cd-003']").addClass("btn-info");
                            topMenu.find("[data-id='cd-001']").removeClass("btn-info");
                            table.hide();
                            jsCode.show().focus();
                            var forms = [];
                            $.each($(page.document.body).find("div[datasource]"), function (key, f) {
                                forms.push($(f).attr("datasource"));
                            });
                            $.each($(page.document.body).find("div[dataarray]"), function (key, f) {
                                forms.push($(f).attr("dataarray"));
                            });
                            jsCode.val(jscodeer.getJS(forms));
                            break;
                    }
                }
            }

            var formsEl = {
                //input: '<input type="text" style="width:90%;"/>',
                input: '<div class="form-group"><label class="col-sm-label control-label">字段标题</label>\r\n <div class="col-sm-control"><input type="text" class="form-control" placeholder=""></div></div>\r\n',
                select: '<div class="form-group"><label class="col-sm-label control-label">字段标题</label>\r\n <div class="col-sm-control"><select  class="form-control"></select></div></div>',
                textarea: '<div class="form-group"><label class="col-sm-label control-label">字段标题</label>\r\n <div class="col-sm-control"><textarea  class="form-control"></textarea></div></div>\r\n',
                button: '<input type="button" value="按钮"/>\r\n',
                checkbox: '<div class="form-group"><label class="col-sm-label control-label">字段标题</label>\r\n <div class="col-sm-control"><input type="checkbox" value="1"/></div></div>\r\n',
                radio: '<div class="form-group"><label class="col-sm-label control-label">字段标题</label>\r\n <div class="col-sm-control"><input type="radio" value="1"/></div></div>\r\n',
                title: '<h3>修改标题</h3>\r\n',
                legend: '<legend class="valtype" data-valtype="text">子标题</legend>\r\n',
                datepicker: '<div class="form-group"><label class="col-sm-label control-label">字段标题</label>\r\n <div class="col-sm-control"><input type="datepicker"  class="form-control"></input></div></div>\r\n',
                autocomplete: '<div class="form-group"><label class="col-sm-label control-label">字段标题</label>\r\n <div class="col-sm-control"><input type="autocomplete" class="form-control" placeholder=""></div></div>\r\n',
                dxs: '<div class="form-group">\r\n <label class="col-sm-label control-label">字段标题</label>\r\n <div class="col-sm-control">\r\n <div class="mytest" data-bind="TreeSource: New_Dataproxy, inputData: NewValue, onChange: userFunction"></div>\r\n</div></div>'
            };
            var tableTemplate = '<table class=" table table-striped table-bordered" style="width:98%">\r\n  <thead>\r\n    <tr>\r\n      <td></td>\r\n      <td></td>\r\n      <td></td>\r\n      <td></td>\r\n    </tr>\r\n  </thead>\r\n  <tbody>\r\n    <tr>\r\n      <td></td>\r\n      <td></td>\r\n      <td></td>\r\n      <td></td>\r\n    </tr>\r\n  </tbody>\r\n</table>\r\n';
            var DivLayer = {
                "12": '<div class="row"><div class="col-md-12"></div></div>\r\n',
                "6-6": '<div class="row"><div class="col-md-6"></div><div class="col-md-6"></div></div>\r\n',
                "8-4": '<div class="row"><div class="col-md-8"></div><div class="col-md-4"></div></div>\r\n',
                "4-8": '<div class="row"><div class="col-md-4"></div><div class="col-md-8"></div></div>\r\n',
                "4-4-4": '<div class="row"><div class="col-md-4"></div><div class="col-md-4"></div><div class="col-md-4"></div></div>\r\n',
                "2-6-4": '<div class="row"><div class="col-md-2"></div><div class="col-md-6"></div><div class="col-md-4"></div></div>\r\n'
            }

            function insertDiv(data, sender) {
                if (!sender && !data) return;

                var el = getContent();
                if (el == null) el = page.document.body.children[0];
                var div = $(el);

                if (el && el.nodeName != 'DIV') {
                    if (div.parent()[0].nodeName == 'DIV')
                        div.after(DivLayer[data.name]);

                } else {
                    if (div.hasClass("row"))
                        div.after(DivLayer[data.name]);
                    else
                        div.append(DivLayer[data.name]);
                }

            }

            function insertFormElement() {
                var el = getContent();
                if (el == null) el = page.document.body.children[0];
                var div = $(el);
                if (div.hasClass("row") || div.hasClass("control")) return;

                var ht = ""
                if (this.key == 'img') {
                    var url = prompt('输入图片地址', 'http://');
                    ht = '<img src="' + url + '"/>';
                } else {
                    ht = formsEl[this.key] || formsEl.input;
                }

                if (el.nodeName == 'DIV' && !div.hasClass("control-group")) {
                    div.append(ht);
                } else
                    div.after(ht);
            }

            function insertWFtool() {
                var tt = '  <div id="toolbar" class="alert alert-info"  style="width:100%"></div>';
                if ($("#toolbar").length < 1)
                    $(page.document.body.children[0]).before(tt);
                jscodeer.addWF();
            }

            function tableAction(data, sender) {
                if (!sender && !data) {
                } else {
                    if (data.id == 'td-001')
                        insertTable();
                    else if (data.id == 'td-002')
                        addTableRow();
                    else if (data.id == 'td-003')
                        addTableCell();
                    else if (data.id == 'td-004')
                        combineTableCell();
                    else if (data.id == 'td-005')
                        delTableRow();


                }
                function insertTable() {
                    $(page.document.body).append(tableTemplate)
                }

                function addTableRow() {
                    var td = getContent();
                    if (td.nodeName == "TD") {
                        var tb = getTable(td);
                        var row = td.parentNode;
                        var newRow = tb.insertRow(row.rowIndex);
                        $(newRow).html($(row).html())
                    }
                }
                function delTableRow() {
                    var td = getContent();
                    if (td.nodeName == "TD") {
                        getTable(td).deleteRow(td.parentNode.rowIndex + 1)
                    }
                }
                function combineTableCell() {
                    var td = getContent();
                    if (td.nodeName == "TD") {
                        var tr = td.parentNode;
                        if (td.cellIndex < (tr.cells.length - 1)) {
                            td.colSpan += tr.cells[td.cellIndex + 1].colSpan;
                            tr.deleteCell(td.cellIndex + 1)
                        }
                    }
                }
                function addTableCell() {
                    var table = getTable();
                    if (table) $(table).find("tr").append("  <td></td>\r\n    ")
                }
            }

            function getTable(content) {
                if (!content) content = getContent();
                if (content.nodeName == "TABLE") return content;
                else {
                    while (content.parentNode) {
                        content = content.parentNode;
                        if (content.nodeName == "TABLE") return content
                    }
                    return null
                }
            }

            function getContent(isGetTable) {

                function getSelect() {
                    var sNode = null;
                    var select = (page.document.selection) ? page.document.selection.createRange() : {};

                    if (select.item) {
                        sNode = select.item(0);
                    }
                    else {
                        select = page.document.getSelection();
                        if (select.focusNode == undefined || select.focusNode == null) return null;
                        if (select.focusNode.nodeName == "DIV" || select.focusNode.nodeName == "TD")
                            sNode = select.focusNode.lastChild;
                        else if (select.focusNode.nodeName == "#text")
                            sNode = select.focusNode.previousSibling;
                        else
                            sNode = page.document.activeElement;


                        //if (select.anchorNode.nodeName != "#text")
                        //    sNode = select.anchorNode;
                        //else if (select.anchorNode.data == "\n") 
                        //    sNode = $(select.anchorNode).next()[0];
                        //else if (select.focusNode.nodeName != "#text")
                        //    sNode = select.focusNode;
                        //else {
                        //    sNode = $(select.anchorNode).next()[0];

                        //    //var range = document.createRange();
                        //    //range.setStart(select.anchorNode, select.anchorOffset + 1);
                        //    //range.setEnd(select.focusNode, select.focusOffset);
                        //    //sNode = range.startContainer.childNodes[0];
                        //    //var range=select.getRangeAt(0);
                        //    //var sNodes = range.cloneContents();
                        //    //if (sNodes.childNodes.length == 1) {
                        //    //    range.deleteContents();
                        //    //    range.insertNode(sNodes);
                        //    //}
                        //    //sNode = sNodes.childNodes[0];
                        //}

                        if (isGetTable) {
                            while (sNode && sNode.parentNode) {
                                if (sNode.nodeName == 'TABLE') break;
                                sNode = sNode.parentNode
                            }
                        }
                    }
                    return sNode;
                }

                var sNode = getSelect();

                navbar.empty();
                var d = $(sNode)[0];
                if (d == null) return null;
                if (sNode.children.length == 1) d = $(sNode).children()[0];
                var elementList = "";
                var els = [];
                do {
                    var t = d.id
                    if (t && t != "") t = "#" + t;
                    if ($(d).hasClass("control-group")) t = ".control-group";
                    if ($(d).attr("datasource")) t = "_Form";
                    if ($(d).attr("dataarray")) t = "_Grid";
                    var btnText = "&lt;" + d.tagName.toLowerCase() + t + "&gt; ";
                    els.push(d);

                    var btnEL = $('<span class="btn btn-link" style="padding:0px;" index="' + els.length + '">' + btnText + '</span>').prependTo(navbar);
                    if (d.tagName == "BODY") break;
                    btnEL.bind("click", function () {
                        try {
                            var i = $(this).attr("index") - 1;
                            propertys.loadEl(els[i]);
                            navbar.children("span").css("font-weight", "normal");
                            $(this).css("font-weight", "bold");
                            selectNode(els[i]);
                        } catch (err) { }
                    });

                    d = $(d).parent()[0];
                } while ($(d).parent()[0])

                //function selectNode2(node) {
                //    var oControlRange = node.createControlRange();
                //    oControlRange.add(node);
                //    oControlRange.select();
                //    propertys.loadEl(node)

                //}

                function selectNode(node) {
                    //var sel = window.getSelection();
                    //var range = sel.getRangeAt(0);
                    //range.selectNode(node);

                    //sel.removeAllRanges();
                    //sel.addRange(range);
                    if (window.getSelection) {        // Internet Explorer 9
                        var selection = window.getSelection();
                        selection.selectAllChildren(node);
                    }
                    if (node != window.selectNode) window.selectNode = node;

                    //   if (node != window.selectNode) window.selectNode = node;
                }

                return sNode
            }

            return this
        };

        //生成js代码，目前可以生成简单的form和grid的配置；
        //需要进一步细化
        $.iwf.formdesign.jscodeer = new function () {
            var oldjs = "";

            var js = " var page;\r\n var wftool;//全局对象必须不能重名\r\n \r\n ";
            //  var forms = [];
            var formJS = 'var {0} = {\r\n    div: "{1}",\r\n    dataKey: "{2}",\r\n    //initForm: function () { \r\n    //   表单初始化\r\n    //},  \r\n     //DataProxy: {\r\n    //    queryUrl: "&Datakeys=[\'user\']",  //数据访问\r\n    ////    saveUrl: "",  //数据保存，默认通用数据保存服务\r\n    //    convert: function (d1) {    //数据转义，将传递的对象转变为参数\r\n    //        if (d1.UserID) return { usid: d1.UserID };\r\n    //    }\r\n    //}\r\n   //New: function(vm) { \r\n    //    新建，默认将原有数据设置为0或""或当前时间，可以再修改\r\n    //}, \r\n    //beforeSave: function(vm) {\r\n    //   保存前调用，可以用来进行数据校验\r\n    //}, \r\n    //beforeBind: function(vm) { \r\n    //     数据绑定前调用，可以用来设置新的vm属性\r\n    //},\r\n    //afterBind: function(vm) {\r\n    //    数据帮定后调用\r\n    //} \r\n };\r\n\r\n';
            var gridJS = 'var {0} = { \r\n    div: "{1}",\r\n    dataKey: "{2}",\r\n   // beforeBind: function (vm) {},\r\n     // newItem: function (item) { }\r\n };\r\n\r\n';
            var js2 = '$(document).ready(function () {\r\n     //可选参数:url: 获取数据的地址；data: 数据集\r\n    //属性：   AllData: 从服务器获取的全部数据； getData(): 获取当前表单需保存的数据\r\n    page = new KOPage(pageOps);\r\n });\r\n';
            var wfJS = 'var wfOps = { \r\n    //Url: "/Test.data",\r\n    //saveData: function (obj) {\r\n    //    return "fsdfs";\r\n    //},\r\n    //getRemark: unction () {\r\n    //    return "办理意见";\r\n    //},\r\n    //getCaseName: function () {\r\n    //    return "流程名";\r\n    //},\r\n    //afterSave: function () {\r\n    //    alert("触发保存完毕事件");\r\n    //},\r\n    //afterSend: function () {\r\n    //    alert("触发发送完毕事件");\r\n    //},\r\n    //afterInit: function () {\r\n    //    alert("触发工具条加载完毕事件");\r\n    //},\r\n    //beforeBack: function () {\r\n    //    alert("退件之前事件触发");\r\n    //}\r\n };\r\n\r\n';
            var pageOpsJS = ' var pageOps = { forms:  {0} };\r\n\r\n';

            this.loadJS = function (jss) {
                oldjs = jss;
                if (oldjs.length > 50) {
                    js = oldjs.substring(0, oldjs.indexOf("$(document).ready"));
                    js2 = oldjs.substring(oldjs.indexOf("$(document).ready"));

                }
            }

            var jsCode;


            this.addForm = function (div, datakey) {
                var frmOps = datakey + "Ops";
                if (js.indexOf(frmOps) < 0) {
                    js += formJS.format(frmOps, div, datakey);

                }
                //  if (!forms.in_array(frmOps)) forms.push(frmOps);

                //jsCode.val(getJS());
            }

            this.addGrid = function (div, datakey, cols) {
                var gridOps = datakey + "Ops";
                if (js.indexOf(gridOps) < 0) {

                    js += gridJS.format(gridOps, div, datakey, cols);

                }
                //     if (!forms.in_array(gridOps)) forms.push(gridOps);
                //jsCode.val(getJS());

            }

            this.addWF = function () {
                if (js.indexOf("var wfOps") < 0) {
                    js = js + wfJS;

                    js2 = js2.replace('$(document).ready(function () {', '$(document).ready(function () {\r\n    wftool = $("#toolbar").WFToolBar(wfOps);\r\n\r\n');
                }
                //jsCode.val(getJS());

            }

            //this.addPage = function () {
            //   // js2 += pageJS.format(JSON.stringify( forms));
            //}

            this.getJS = function (forms) {
                //var bs = js2.indexOf("new KOPage({forms:") + 18;
                //var oldformslist = js2.substr(bs, js2.indexOf("})", bs) - bs);
                //js2 = js2.substr(0, bs) + JSON.stringify(forms).replaceAll("\"", "") + js2.substr(js2.indexOf("})", bs));
                // js2= js2.replace(oldformslist, JSON.stringify(forms));

                js = js.replaceAll('var pageOps', '// var pageOps');//注释原有pageOps

                for (var i = 0; i < forms.length; i++) {
                    forms[i] = forms[i] + "Ops";
                }
                js += pageOpsJS.replace('{0}', JSON.stringify(forms).replaceAll("\"", ""));

                return js + js2;
            }
        }

        //根据数组属性，配置gird的设置
        $.iwf.formdesign.setGrid = function (dataarray, curEl, kogrid) {
            if ($.iwf.formdesign.FieldDict == undefined) {
                $.getJSON("IWorkDbManage.data?action=getFieldDict", {}, function (json) {
                    if (json.success == false) {
                        alert(json.msg);
                    } else {
                        $.iwf.formdesign.FieldDict = json;
                    }
                })
                return;
            }

            //控件树  
            var ControlTreeData = [];

            //控件设置
            var controlSetting = {}

            if (kogrid.controlSetting) {
                controlSetting = kogrid.controlSetting
                ControlTreeData = kogrid.ControlTreeData;
            } else {
                //根据绑定字段自动初始化控件树
                var fields = dataarray[0];
                var tt = { id: 'root1', name: "第 1 行", "IsOpen": true, "IsParent": true, "IcoClass": "", "children": [] };
                ControlTreeData.push(tt);

                for (var key in fields) {
                    var zhname = $.iwf.formdesign.FieldDict[key];
                    tt.children.push({ id: key, name: key + ((zhname) ? ('-' + zhname) : ''), "IsParent": false });
                    controlSetting[key] = {
                        title: ((zhname) ? zhname : key),
                        key: key,
                        content: '',
                        width: '10%',
                        databind: key,
                        sortable: true,
                        colType: '文本',
                        filter: '文本框'
                    }
                }

                ControlTreeData.push({ id: 999, pId: 0, name: "不显示字段", "IsOpen": true, "IsParent": true, "IcoClass": "", "children": [] });
            }
            //当前节点的vm
            var curnodeid;

            var gridvm = {
                //  cols: ko.observableArray(),
                bindFAuto: ko.observableArray(),
                key: ko.observable(),
                title: ko.observable(),
                content: ko.observable(),
                width: ko.observable(),
                databind: ko.observable(),
                sortable: ko.observable(true),
                colType: ko.observable(),
                colTypeAuto: ko.observableArray(['文本', '转义列', '序号', '文本框', '下拉框', '多选框', '单选框', '删除按钮', '编辑按钮']),
                encode: ko.observable(),
                encodeData: ko.observableArray(),
                dictData: ko.observableArray(),
                encodeShow: ko.observable(false),
                dictShow: ko.observable(false),
                filter: ko.observable(),
                filterAuto: ko.observableArray(['', '文本框', '下拉框', '多选框', '数值区间', '日期区间']),

                onchange: function () {
                    if (gridvm.key() == undefined || gridvm.key() == "") gridvm.key(gridvm.databind());
                    if (gridvm.title() == undefined || gridvm.title() == "") {
                        //  var titlezh = dataDefined[dataName].Dictionary[gridvm.key()];
                        var titlezh = $.iwf.formdesign.FieldDict[gridvm.databind()];
                        if (titlezh && titlezh != "")
                            gridvm.title(titlezh);
                        else
                            gridvm.title(gridvm.databind());
                    }
                },
                onenCodechange: function () {
                    gridvm.databind('$.Com.dictCache[' + gridvm.encode() + '][' + gridvm.databind() + '()]');
                    if (gridvm.key() == undefined || gridvm.key() == "") gridvm.key(gridvm.databind());
                    if (gridvm.title() == undefined || gridvm.title() == "") {
                        var titlezh = $.iwf.formdesign.FieldDict[gridvm.databind()];
                        if (titlezh && titlezh != "")
                            gridvm.title(titlezh);
                        else
                            gridvm.title(gridvm.databind());
                    }
                },
                onDictchange: function () {
                    var stringObj = gridvm.content();
                    var reg = new RegExp("'undefined'", "g"); //创建正则RegExp对象  
                    var newstr = stringObj.replace(reg, gridvm.encode());
                    gridvm.content(newstr);
                },
                onTypechange: function () {
                    gridvm.encodeShow(false);

                    if (gridvm.colType() == "序号") {
                        gridvm.title("序号");
                        gridvm.key("number");
                        gridvm.width("3");
                    } else if (gridvm.colType() == "文本框") {
                        gridvm.content(" <input type=\"text\"  style=\"width:90%\" data-bind=\"value:" + gridvm.databind() + "\"/>");
                    } else if (gridvm.colType() == "转义列") {
                        gridvm.encodeShow(true);
                    } else if (gridvm.colType() == "下拉框") {
                        gridvm.dictShow(true);
                        gridvm.content("<select data-bind=\"selectOptins: 'undefined', value:" + gridvm.databind() + "\"></select>");
                    } else if (gridvm.colType() == "多选框") {
                        gridvm.dictShow(true);
                        gridvm.content("<input data-bind=\"checkbox2: 'undefined', value:" + gridvm.databind() + "\"></input>");
                    } else if (gridvm.colType() == "单选框") {
                        gridvm.dictShow(true);
                        gridvm.content("<input data-bind=\"Radio2: 'undefined', value:" + gridvm.databind() + "\"></input>");
                    } else if (gridvm.colType() == "删除按钮") {
                        gridvm.title("删除");
                        gridvm.content(" <span class=\"btn\" data-bind=\"click: $root.removeRow\"><i  class=\"fa fa-times\"></i></span>");
                    } else if (gridvm.colType() == "编辑按钮") {
                        gridvm.title("编辑");
                        if (gridvm.databind() || gridvm.databind() != '')
                            gridvm.content(" <a class=\"btn\" data-bind=\"click: $root.editRow\"><span data-bind=\"text:" + gridvm.databind() + "\"></span></a>");
                        else
                            gridvm.content(" <span class=\"btn\" data-bind=\"click: $root.editRow\"><i  class=\"fa fa-pencil\"></i></span>");
                    }
                }
            };   //左边的树控件

            var Tree = new function () {
                var treediv;
                function beforeDrag(treeId, treeNodes) {
                    for (var i = 0, l = treeNodes.length; i < l; i++) {
                        if (treeNodes[i].drag === false) {
                            return false;
                        }
                    }
                    return true;
                }
                function beforeDrop(treeId, treeNodes, targetNode, moveType) {
                    return targetNode ? targetNode.drop !== false : true;
                }

                this.show = function (div, data) {
                    treediv = div;
                    treeEl = div.frametree({
                        treesource: ControlTreeData, checkbox: false, drag: true, node_click: function (event, data) {
                            if (data.level == 0) {
                                return;
                            }
                            else {
                                if (curnodeid) {
                                    controlSetting[curnodeid] = {
                                        key: gridvm.key(),
                                        title: gridvm.title(),
                                        content: gridvm.content(),
                                        width: gridvm.width(),
                                        databind: gridvm.databind(),
                                        sortable: gridvm.sortable(),
                                        filter: gridvm.filter(),
                                        colType: gridvm.colType()
                                    };
                                }
                                var el = curEl.find("[data-bind='#value:" + data.id + "#']");
                                loadfld(controlSetting[data.id], el[0]);
                                curnodeid = data.id;
                                //propertys.loadEl(controlSetting[data.id], el[0]);
                            }
                        }
                    });
                };
                this.getData = function () {
                    return treediv.frametree(("GetSchemaObject"));
                };
            }

            function loadfld(fld, el) {
                gridvm.key(fld.key);
                gridvm.title(fld.title);
                gridvm.content(fld.content);
                gridvm.width(fld.width);
                gridvm.databind(fld.databind);
                gridvm.sortable(fld.sortable);
                gridvm.colType(fld.colType);
                gridvm.encode(fld.encode);
                gridvm.encodeShow(fld.encodeShow);
                gridvm.dictShow(fld.dictShow);
                gridvm.filter(fld.filter);
            }


            //加入转义列的选项,及多选框
            for (var key in $.Com.dictCache) {
                if (!($.Com.dictCache[key] instanceof Array)) gridvm.encodeData.push("'" + key + "'");
                gridvm.dictData.push("'" + key + "'");
            }

            var json = [];
            var gridwin = $('body').iwfWindow({
                title: '表格列设置',
                width: 1200,
                height: 900,

                append: '<div class="row bg-info" style="margin:5px 10px;"><input type="checkbox" id="setRowClick">&nbsp;行选择   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" id="setelementsCount" value="10" style="width:50px;"></input> 每页行数，0为不分页<br></div> \
                <div class="row"><div class="col-md-4" ">字段列表<br/><div data-id="treeView" style="height:700px;overflow-y: auto;"></div></div><div class="col-md-8">节点属性</div><div>\
                   <table class="table table-bordered  table-condensed" style="width: 680px;margin:5px;"> \
                    <tr><td style="width: 120px;"> key </td> <td> <input  type="text" data-bind="value:key" style="width: 120px;"> </td> </tr>\
                    <tr><td >列类型</td><td> <select style="width: 120px;" type="text" value="文本" data-bind="value:colType,options:colTypeAuto,event:{change:onTypechange}">\
                                            <input style="width: 120px;" type="text"  data-bind="visible:encodeShow, value:encode,autocomplete2:encodeData,event:{change:onenCodechange}"> \
                                            <input style="width: 120px;" type="text"  data-bind="visible:dictShow, value:encode,autocomplete2:dictData,event:{change:onDictchange}"></td>  </tr>\
                    <tr><td >列标题</td><td><input style="width: 120px;"" type="text" data-bind="value:title"> </td>  </tr>\
                    <tr><td>绑定字段</td><td><input style="width: 120px;" type="text" data-bind="value:databind,autocomplete2:bindFAuto,event:{change:onchange}"> </td> </tr>\
                    <tr><td>生成代码</td><td><textarea rows="3" style="width: 98%;" data-bind="value:content"></textarea> </td>  </tr>\
                    <tr><td>字段宽度</td><td><input style="width: 120px;" type="text" value="10%" data-bind="value:width"> </td> </tr>\
                    <tr><td>是否排序</td><td><input type="checkbox" data-bind="checked:sortable"/></td> </tr>\
                    <tr><td>过滤设置</td><td><select style="width: 120px;" type="text"  data-bind="value:filter,options:filterAuto"></td> </tr>\
             </table> </div></div>',


                //append: '<input type="checkbox" id="setRowClick">行选择   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" id="setelementsCount" value="10" style="width:30px;"></input> 每页行数，0为不分页<br> \
                //    <table class="table table-bordered  table-condensed" style="width: 95%;margin:5px;" border="0" cellspacing="1" cellpadding="0"> \
                //    <thead>  <tr> \
                //        <td style="width: 120px;"> key </td><td style="width: 150px;"> 列类型</td> \
                //        <td style="width: 120px;"> 标题 </td> \
                //        <td style="width: 120px;">绑定</td> \
                //        <td style="width: 100px;"> 宽度&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; 排序</td> \
                //        <td style="width: 120px;"> 过滤</td> </tr> </thead> \
                //    <tr> \
                //        <td> <input style="width: 90%;" type="text" data-bind="value:key"> </td>\
                //        <td> <select style="width: 90%;" type="text" value="文本" data-bind="value:colType,options:colTypeAuto,event:{change:onTypechange}">\
                //            <input style="width: 100px;" type="text"  data-bind="visible:encodeShow, value:encode,autocomplete2:encodeData,event:{change:onenCodechange}"> \
                //             <input style="width: 100px;" type="text"  data-bind="visible:dictShow, value:encode,autocomplete2:dictData,event:{change:onDictchange}"></td> \
                //        <td> <input style="width: 90%;" type="text" data-bind="value:title"> </td> \
                //        <td> <input style="width: 90%;" type="text" data-bind="value:databind,autocomplete2:bindFAuto,event:{change:onchange}"> </td>\
                //        <td> <input style="width: 50px;" type="text" value="10%" data-bind="value:width"> \
                //            <input type="checkbox" data-bind="checked:sortable"></td>\
                //        <td><select style="width: 80px;" type="text"  data-bind="value:filter,options:filterAuto"></td> </tr>\
                //    <tr> \
                //        <td colspan="5"> <input style="width: 90%;" type="text" data-bind="value:content"> </td> \
                //        <td> <input type="button" value="添加"  class="btn btn-primary" data-bind="click:onsave"> </td>  </tr>\
                //    <tbody data-bind="foreach:cols"> <tr>\
                //        <td data-bind="text:key"> </td> \
                //        <td data-bind="text:colType"> </td> \
                //        <td data-bind="text:title"> </td>\
                //        <td data-bind="text:databind"> </td><td data-bind="text:width+ sortable "> </td>  \
                //        <td data-bind="text: filter"></td> </tr> \
                //    <tr>\
                //        <td colspan="5" data-bind="text:content"> <input style="width: 90%;" type="text"> </td> \
                //        <td> <input type="button" class="btn btn-mini" value="删除" data-bind="click: $root.remove"> </td> </tr> </tbody></table>',


                button: [{
                    text: '确定',
                    handler: function (data) {

                        //保存当前设置
                        if (curnodeid) {
                            controlSetting[curnodeid] = {
                                key: gridvm.key(),
                                title: gridvm.title(),
                                content: gridvm.content(),
                                width: gridvm.width(),
                                databind: gridvm.databind(),
                                sortable: gridvm.sortable(),
                                filter: gridvm.filter(),
                                colType: gridvm.colType()
                            };
                        }

                        var settingData = Tree.getData();
                        var colsetting = [];
                        ControlTreeData = [];
                        $.each(settingData, function (i, col) {
                            var coldiv = { id: col.id, name: col.name, "IsOpen": true, "IsParent": true, "IcoClass": "", "children": [] };
                            ControlTreeData.push(coldiv);
                            if (col.name == "不显示字段" || col.children.length == 0) {
                                $.each(col.children, function (i, fld) {
                                    coldiv.children.push({ id: fld.id, name: fld.name, "IsParent": false });
                                });
                                return true;
                            }
                            var colnum = col.children.length;
                            $.each(col.children, function (j, fld) {
                                coldiv.children.push({ id: fld.id, name: fld.name, "IsParent": false });
                                controlSetting[fld.id].colNo = i;
                                colsetting.push(controlSetting[fld.id]);
                            });
                        });

                        $.Com.gridbuilder.CreateGrid(curEl, { elementsCount: parseInt($("#setelementsCount").val()), columns: colsetting, setRowClick: $("#setRowClick")[0].checked });
                        // kogrid.columnsetting = columns;
                        kogrid.controlSetting = controlSetting;
                        kogrid.ControlTreeData = ControlTreeData;

                        kogrid.viewModel = null;
                        kogrid.show(curEl, dataarray);

                        gridwin.close()
                    }
                },
                {
                    text: '取消',
                    handler: function () {
                        gridwin.close()
                    }
                }]
            });
            gridwin.content().find("[data-id='treeView']").empty();
            Tree.show(gridwin.content().find("[data-id='treeView']"), ControlTreeData);


            ko.applyBindings(gridvm, gridwin.content().find("table")[0])
        }

        //根据数组属性，配置koform的设置
        $.iwf.formdesign.setForm = function (data, curEl, koform) {
            if ($.iwf.formdesign.FieldDict == undefined) {
                $.getJSON("IWorkDbManage.data?action=getFieldDict", {}, function (json) {
                    if (json.success == false) {
                        alert(json.msg);
                    } else {
                        $.iwf.formdesign.FieldDict = json;
                    }
                })
                return;
            }

            //控件树  
            var ControlTreeData = [];

            //控件设置
            var controlSetting = {}

            if (koform.controlSetting) {
                controlSetting = koform.controlSetting
                ControlTreeData = koform.ControlTreeData;
            } else {
                //根据绑定字段自动初始化控件树
                var i = 1, col = 0;
                var tt;
                for (var key in data) {
                    if (i > 0) {
                        col++;
                        tt = { id: col, name: "第 " + col + " 行", "IsOpen": true, "IsParent": true, "IcoClass": "", "children": [] };
                        ControlTreeData.push(tt);
                    }
                    var zhname = $.iwf.formdesign.FieldDict[key];

                    tt.children.push({ id: key, name: key + ((zhname) ? ('-' + zhname) : ''), "IsParent": false });
                    controlSetting[key] = { 'Atrr': { 'label': ((zhname) ? zhname : key), cssclass: 'form-control' }, 'Bind': { 'value': key }, 'ElType': 'text' };
                    i = i * -1;
                }

                ControlTreeData.push({ id: 999, pId: 0, name: "不显示字段", "IsOpen": true, "IsParent": true, "IcoClass": "", "children": [] });
            }
            //左边的树控件
            var Tree = new function () {
                var treediv;
                function beforeDrag(treeId, treeNodes) {
                    for (var i = 0, l = treeNodes.length; i < l; i++) {
                        if (treeNodes[i].drag === false) {
                            return false;
                        }
                    }
                    return true;
                }
                function beforeDrop(treeId, treeNodes, targetNode, moveType) {
                    return targetNode ? targetNode.drop !== false : true;
                }

                this.show = function (div, data) {
                    treediv = div;
                    treeEl = div.frametree({
                        treesource: ControlTreeData, checkbox: false, drag: true, node_click: function (event, data) {
                            if (data.level == 0) {
                                // me.rootdom.find("[iwftype=UserToolBar]").show();
                                return;
                            }
                            else {
                                // me.rootdom.find("[iwftype=UserToolBar]").show();
                                //   jQuery.PackResult("IWorkUserManage.data?action=FindUserByDPID", { "DPID": data.id, "DPName": data.name }, function (data) {
                                var el = curEl.find("[data-bind='#value:" + data.id + "#']");
                                propertys.loadEl(controlSetting[data.id], el[0]);
                            }
                        }
                    });
                };
                this.getData = function () {
                    return treediv.frametree(("GetSchemaObject"));
                };
            }

            //根据当前表单获得控件树
            function getControlTree() {
            }
            //根据树创建表单
            function createHtml(data) {
                var attrList = [], bindList = [];
                ControlTreeData = [];

                //设置属性字符串
                function getAtrr(atrr) {

                    var ht = '';

                    $.each(attrList, function (i, fieldName) {
                        if (atrr[fieldName]) {
                            if (fieldName == 'label' || fieldName == 'optionsList') {
                                // $(curEl.parent().parent().children()[0]).text(v);
                            }
                            else if (fieldName == 'cssclass') {
                                ht += " class='" + atrr[fieldName] + "'";
                            }
                            else {
                                ht += " " + fieldName + "='" + atrr[fieldName] + "'";
                            }
                        }
                    });
                    return ht;
                }
                //设置绑定字符串
                function getBind(bind) {
                    var bindStr = '';

                    $.each(bindList, function (i, fieldName) {
                        if (bind[fieldName]) {
                            if (bindStr.length > 0) bindStr += ",";
                            bindStr += fieldName + ':' + bind[fieldName]
                        }
                    });
                    return bindStr;
                }

                var tt = ""
                $.each(data, function (i, col) {
                    var coldiv = { id: col.id, name: col.name, "IsOpen": true, "IsParent": true, "IcoClass": "", "children": [] };
                    ControlTreeData.push(coldiv);
                    if (col.name == "不显示字段" || col.children.length == 0) {
                        $.each(col.children, function (i, fld) {
                            coldiv.children.push({ id: fld.id, name: fld.name, "IsParent": false });
                        });
                        return true;
                    }
                    tt += '<div class="form-group">';
                    var colnum = col.children.length;
                    $.each(col.children, function (i, fld) {
                        coldiv.children.push({ id: fld.id, name: fld.name, "IsParent": false });
                        var label = fld.id;
                        var elSetting = controlSetting[fld.id];
                        var ElType = controlSetting[fld.id].ElType;
                        if (elSetting.Atrr.label) label = elSetting.Atrr.label;
                        var ctrlType = $.iwf.formdesign.controls.getControlSetting(ElType);
                        attrList = ctrlType.attrList;
                        bindList = ctrlType.bindList;
                        // if (ctrlType.nodeType == 'input') elSetting.Atrr.type = "text";
                        if (ctrlType.nodeType.indexOf('iwf-') > -1)
                            tt += ' <label class="col-sm-2 control-label">' + label + '</label><div class="col-sm-' + (12 / colnum - 2) + '"><' + ctrlType.nodeType + ((ctrlType.nodeType == 'input') ? ' type="text" ' : ' ') + getAtrr(elSetting.Atrr) + ' params="' + getBind(elSetting.Bind) + '"></' + ctrlType.nodeType + '></div>';
                        else
                            tt += ' <label class="col-sm-2 control-label">' + label + '</label><div class="col-sm-' + (12 / colnum - 2) + '"><' + ctrlType.nodeType + ((ctrlType.nodeType == 'input') ? ' type="text" ' : ' ') + getAtrr(elSetting.Atrr) + ' data-bind="' + getBind(elSetting.Bind) + '"></' + ctrlType.nodeType + '></div>';

                    });
                    tt += "</div>";
                })

                return tt;
            }

            var formsetwin = $('body').iwfWindow({
                title: '表单设置',
                width: 1200,
                height: 900,
                append: '<div class="row"><div class="col-md-6" ">表单节点<br/><div style="height:700px;overflow-y: auto;"></div></div><div class="col-md-6">节点属性</div></div>',

                button: [{
                    text: '预览',
                    handler: function () {
                        curEl.html(createHtml(Tree.getData()));
                        koform.viewModel = null;
                        koform.controlSetting = controlSetting;
                        koform.ControlTreeData = ControlTreeData;
                        koform.show(curEl, data);

                        //  formsetwin.close()
                    }
                },
                {
                    text: '取消',
                    handler: function () {
                        formsetwin.close()
                    }
                }]
            });

            Tree.show(formsetwin.content().children().first().children().first().children('div'), ControlTreeData);

            var propertys = formsetwin.content().children().first().children().first().next().iwfProperty2();


        }

        $.iwf.formdesign.controls = inputControls; //控件的扩展放在fxControl.js文件

        //表单元素属性设置！
        $.fn.iwfProperty2 = function () {

            var me = this;
            var dataDefined = {};
            var attrVM = {};
            var bindVM = {};

            var fldSetting;

            var attrList;
            var bindList;

            //设定节点属性  fSetting为当前节点设置，el为当前元素
            me.loadEl = function (fSetting, el) {
                fldSetting = fSetting;

                function bindVMtoUI() {
                    //删除原有内容
                    me.children("table").remove();

                    //创建相应的属性修改项
                    function setItem(key, action, vm, tab) {
                        //  var keyname = ($.iwf.formdesign.controls.propertyDic[key]) ? $.iwf.formdesign.controls.propertyDic[key] : key;

                        var temp = $('<tr name="' + key + '"><td style="width:90px;text-align:right;height:30px;overflow:hidden;">' + key + '&nbsp;</td><td></td></tr>').appendTo(tab);
                        // var tempBind = (vm[key + "Auto"]) ? key + 'Auto' : 'bindAuto';
                        var tempBind = "";
                        //是否有可选项协助录入
                        var autoOptions = $.iwf.formdesign.controls.getAutoOptions(key);
                        if (autoOptions != null) {
                            //  if (key == 'autocomplete') tempBind = 'selectOptionsAuto';
                            vm[key + "Auto"] = ko.observableArray(autoOptions);
                            tempBind = ',autocomplete2:' + key + "Auto";
                        }
                        var inp = $('<input style="width:90%;" data-bind="value:' + key + tempBind + '" data-field="' + key + '" type="text" />').appendTo(temp.children().last());
                        inp.bind("change", action);
                        inp.bind("click", function () {
                            var keyname = ($.iwf.formdesign.controls.propertyDic[key]) ? "属性设置说明：" + $.iwf.formdesign.controls.propertyDic[key] : '';
                            $descript.text(keyname);
                        });
                    };

                    //设置属性
                    var root = $('<table width="100%" border="0" cellspacing="0" cellpadding="0"></table>').appendTo(me);
                    root.append('<tr><td colspan="2" style="background:#D2E5F2;padding:5px;">属性设置</td></tr>');
                    for (i = 0; i < attrList.length; i++) {
                        if (attrVM[attrList[i]] == undefined) attrVM[attrList[i]] = ko.observable();
                        setItem(attrList[i], onAttrChange, attrVM, root);
                    }
                    ko.applyBindings(attrVM, root[0]);

                    //设置绑定
                    if (bindList.length > 0) {
                        var root2 = $('<table width="100%" border="0" cellspacing="0" cellpadding="0"></table>').appendTo(me);
                        root2.append('<tr><td colspan="2" style="background:#D2E5F2;border-top: 1px solid #b6c7d3;padding:5px;">数据绑定</td></tr>');
                        for (i = 0; i < bindList.length; i++) {
                            if (bindVM[bindList[i]] == undefined) bindVM[bindList[i]] = ko.observable();
                            setItem(bindList[i], onBindChange, bindVM, root2);
                        }
                        ko.applyBindings(bindVM, root2[0]);
                    }



                }
                //默认文本框
                if (fldSetting.ElType == undefined) fldSetting.ElType = "text";

                //根据控件类型 设置可用的属性，并初始化对应的vm；
                function setlist() {
                    bindList = [];
                    var ctrlType = $.iwf.formdesign.controls.getControlSetting(fldSetting.ElType);
                    attrList = ctrlType.attrList;
                    bindList = ctrlType.bindList;

                    for (i = 0; i < attrList.length; i++) {
                        var attr = attrList[i];
                        if (attrVM[attr] == undefined) attrVM[attr] = ko.observable();
                        attrVM[attr](fldSetting.Atrr[attr]);
                        //if (attr == "label")
                        //    attrVM.label(fldSetting.Atrr["label"]);   // attrVM.label(getLabel());
                        //else if (attr == "optionsList")
                        //    attrVM.optionsList(getOptionsList());
                        //    else if (attr == "cssclass")
                        //        attrVM.cssclass(fldSetting.Atrr["class"]);
                        //else if (fldSetting.Atrr[attr])
                        //    attrVM[attr](fldSetting.Atrr[attr]);
                        //else
                        //    attrVM[attr]('');
                    }

                    //将data-bind的值转为json
                    function bindStrToJson(str) {
                        var jStr = str.replace(/\\/g, "@134").replace(/([^,:]+)/g, '"$1"');
                        var json = JSON.parse("{" + jStr + "}");
                        for (key in json) {
                            json[key] = json[key].replace(/@134/g, "\\")
                        }
                        return json
                    };


                    for (var bind in fldSetting.Bind) {
                        if (bindVM[bind] == undefined) bindVM[bind] = ko.observable();
                        bindVM[bind](fldSetting.Bind[bind]);
                    }

                    //var ccs = cssClass[fldSetting.ElType];
                    //attrVM.cssclassAuto.removeAll();
                    //if (ccs) {
                    //    for (var c in ccs)
                    //        attrVM.cssclassAuto.push(ccs[c]);
                    //}
                }

                setlist();

                me.children().remove();

                var proHead = $('<div width="100%" class="alert-success" style="height:35px;font-size:18px;padding:5px;">&nbsp;&nbsp;<select/>&nbsp;</div>').appendTo(me);
                var $descript = $('<div style="top: 650px; width: 90%; position: absolute; min-height: 60px;" class="bg-info"></div>').appendTo(me);

                var sele = proHead.find("select");
                for (var key in $.iwf.formdesign.controls.eleTypeAuto) {
                    if (key != fldSetting.ElType) sele.append("<option value='" + key + "'>" + $.iwf.formdesign.controls.eleTypeAuto[key] + "</option>");
                    else sele.append("<option  selected='selected' value='" + key + "'>" + $.iwf.formdesign.controls.eleTypeAuto[key] + "</option>");
                };

                //切换控件类型
                sele.change(function () {
                    fldSetting.ElType = $(this).children('option:selected').val();
                    setlist();

                    bindVMtoUI();
                })

                bindVMtoUI();

            }

            var onAttrChange = function (key, sender) {
                var v = $(this).val();
                var fieldName = $(this).attr("data-field");
                fldSetting.Atrr[fieldName] = v;

                //如果是正则表达式，还会自动设置对应的title
                if (fieldName == 'pattern' && v && v != '') {
                    var tit = $.iwf.formdesign.controls.patternData[v];
                    if (tit) attrVM.title(tit);
                }
            }

            var onBindChange = function (key, sender) {
                var v = $(this).val();
                var fieldName = $(this).attr("data-field");
                fldSetting.Bind[fieldName] = v;
            }

            var me = this;

            return me
        };

    
        return $.iwf.formdesign;

});

