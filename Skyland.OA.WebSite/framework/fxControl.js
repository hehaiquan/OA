
//录入控件，采用ko绑定实现
//允许各个项目组根据需要进行扩展，但是要求必须加入注释！！
//只能加入输入控件的扩展

//单选框 //可选：客户端缓存、数组、键值对
ko.bindingHandlers.Radio2 = {
    init: function (element, valueAccessor, allBindings) {
        var OptinsData = valueAccessor();
        var value = allBindings().value;
        if ((typeof OptinsData) == "string") OptinsData = $.Com.getDict(OptinsData);
        $(element).hide();
        $(element).next().remove();
        var tt = "";
        var radioname = 'ra' + Math.random();
        var $div = $('<div class="btn-group" data-toggle="buttons">').insertAfter($(element));
        if (OptinsData instanceof Array) {
            for (var i = 0; i < OptinsData.length; i++) {
                var $radio = $(' <label class="btn btn-default"><input type="radio" name="' + radioname + '" value="' + OptinsData[i] + '" >' + OptinsData[i] + '</label>').appendTo($div);
                if ($radio.children("input").val() == $(element).val()) {
                    $radio.addClass("active");
                    $radio.children("input").attr('checked', 'checked');
                }
                $radio.bind("click", function () {
                    $(element).val($(this).children("input").val());
                    value($(element).val());
                })

            }
        }
        else {
            for (var key in OptinsData) {
                var $radio = $(' <label class="btn btn-default"><input type="radio" name="' + radioname + '" value="' + key + '" >' + OptinsData[key] + '</label>').appendTo($div);
                if ($radio.children("input").val() == $(element).val()) {
                    $radio.addClass("active");
                    $radio.children("input").attr('checked', 'checked');
                }
                $radio.bind("click", function () {
                    $(element).val($(this).children("input").val())
                    value($(element).val());
                })
            }
        }
    }
};
//多选框 //可选：客户端缓存、数组、键值对
ko.bindingHandlers.checkbox2 = {
    init: function (element, valueAccessor, allBindings) {
        var OptinsData = valueAccessor();
        var value = allBindings().value;
        if ((typeof OptinsData) == "string") OptinsData = $.Com.getDict(OptinsData);
        $(element).hide();
        $(element).next().remove();
        var tt = "";
        var radioname = 'ra' + Math.random();
        var $div = $('<div class="btn-group" data-toggle="buttons">').insertAfter($(element));
        if (OptinsData instanceof Array) {
            for (var i = 0; i < OptinsData.length; i++) {
                var $radio = $(' <label class="btn btn-default"><input type="checkbox" name="' + radioname + '" value="' + OptinsData[i] + '" >' + OptinsData[i] + '</label>').appendTo($div);
                if ($(element).val().indexOf($radio.children("input").val()) >= 0) {
                    $radio.addClass("active");
                    $radio.children("input").attr('checked', 'checked');
                }
                $radio.bind("click", function () {
                    var str = '';
                    var curval = $(this).children("input").val();
                    $div.find("[name='" + radioname + "']").each(function () {
                        if (this.checked)
                        { if (curval != $(this).val()) str += $(this).val() + ','; }
                        else
                        { if (curval == $(this).val()) str += $(this).val() + ','; }
                    });
                    if (str != '') str = str.substring(0, str.length - 1);
                    value(str);
                })

            }
        }
        else {
            for (var key in OptinsData) {
                var $radio = $(' <label class="btn btn-default"><input type="checkbox" name="' + radioname + '" value="' + key + '" >' + OptinsData[key] + '</label>').appendTo($div);
                if ($(element).val().indexOf($radio.children("input").val()) >= 0) {
                    $radio.addClass("active");
                    $radio.children("input").attr('checked', 'checked');
                }
                $radio.bind("click", function () {
                    var str = '';
                    var curval = $(this).children("input").val();
                    $div.find("[name='" + radioname + "']").each(function () {
                        //当前按钮的状态会滞后
                        if (this.checked)
                        { if (curval != $(this).val()) str += $(this).val() + ','; }
                        else
                        { if (curval == $(this).val()) str += $(this).val() + ','; }
                    });
                    if (str != '') str = str.substring(0, str.length - 1);
                    value(str);
                })
            }
        }
    }
};
//下拉框 //可选：客户端缓存、数组、键值对
ko.bindingHandlers.DictOptions2 = {
    init: function (element, valueAccessor, allBindings) {
        var OptinsData = valueAccessor();
        var value = allBindings().value;

        if ((typeof OptinsData) == "string") OptinsData = $.Com.getDict(OptinsData);

        $(element).empty();
        if (OptinsData instanceof Array) {
            for (var i = 0; i < OptinsData.length; i++) {
                $(element).append("<option value='" + OptinsData[i] + "'>" + OptinsData[i] + "</option>");
            }
        }
        else {
            for (var key in OptinsData) {
                $(element).append("<option value='" + key + "'>" + OptinsData[key] + "</option>");
            }
        }

    }
};




//日期输入控件  样式实现了，但是还有不行
ko.bindingHandlers.datetimeFormat2 = {
    init: function (element, valueAccessor, allBindings) {
        var datetimeformat = valueAccessor();
        $(element).wrap('<div class="input-group"></div>');
        $(element).after('<span class="input-group-addon"><i class="fa fa-calendar"></i></span>');
        $(element).addClass('form-control');
        $(element).ComDatetimepicker(datetimeformat);
    }
};

//frameListChose录入控件
//TreeSource:数据源，inputData：绑定值，onChange数据改变时的回调；
ko.bindingHandlers.TreeSource2 = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var el = $(element);
        // var TreeSource = valueAccessor();
        var initData = allBindingsAccessor().inputData;

        var TreeSource = ko.utils.unwrapObservable(valueAccessor());
        if (TreeSource.queryUrl != undefined) {
            var dp = new DataProxy(TreeSource);
            dp.Get({ keyword: el.val() }, function (dataS) {
                //for (var key in dataS) {
                //    bindControl(dataS[key]);
                //    break;
                //}
                bindControl(dataS.data);
            })

        } else {
            bindControl(TreeSource);
        }

        function bindControl(data) {
            var ttt = [];
            if (initData() != undefined) ttt = initData();
            var chose = el.frameListChose({
                TreeSource: data, InitCheckSource: ttt, ChoseChangeEvent: function () {
                    initData(el.frameListChose("GetAllChoseData"));
                    if (allBindingsAccessor().onChange) allBindingsAccessor().onChange();

                }
            });
        }

    }
};

//自定义绑定combox，用于支持返回数据的dictory格式和数组
//selectOptions:当前域可访问对象
ko.bindingHandlers.selectOptions2 = {
    init: function (element, valueAccessor, allBindings) {
        // var OptinsData = page.AllData[valueAccessor()];
        var OptinsData = valueAccessor();
        $(element).empty();
        if (OptinsData instanceof Array) {
            for (var i = 0; i < OptinsData.length; i++) {
                $(element).append("<option value='" + i + "'>" + OptinsData[i] + "</option>");
            }
        }
        else {
            for (var key in OptinsData) {
                $(element).append("<option value='" + key + "'>" + OptinsData[key] + "</option>");
            }
        }

    }
};




// 制作常用语控件
//selectOptions:当前域可访问对象
ko.bindingHandlers.usedPhraseType2 = {
    init: function (element, valueAccessor, allBindings) {
        var type = valueAccessor().type;
        var input = valueAccessor().input;
        $(element).next().children().bind("click", function () {
            $.Biz.usedPhraseSelect(type, function (data) {
                if (data != null) {
                    //$(element).val(data.nr);//常用语内容
                    input(data.nr);//常用语内容
                }
            });
        });
    }
};



//通用选择控件  created by Zhoushining DateTime: 2014-07-31 可以用于选择人、选择部门、选择单位，支持单选和多选  参数（｛Multi: true, CodeValue: id, CodeName: name, CodeTableName: table1｝）
ko.bindingHandlers.ComTreeSources2 = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var valueAccessor = valueAccessor();
        $(element).next().children().bind("click", function () {
            $.Biz.comListInfoSelect(element, valueAccessor, function (data) {
                //if (data != null) {
                //    $(element).val(data);
                //}
            });
        });
    }
};

//自定义autocomplete控件，如果autocomplete=Array，则自动过滤array，也可以是DataProxy的设置，比如
// autocomplete：{queryUrl：xxx.data?action=...}
//onselect：完成选择后触发
ko.bindingHandlers.autocomplete2 = {
    'init': function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var el = $(element);
        var root = el.wrap("<div/>").parent().css({
            'position': 'relative'
        });
        var list = $('<ul unselectable="on"/>').addClass('dropdown-menu').hide().css({
            'top': (root.height()) ? root.height() : 22,
            'width': (element.clientWidth) ? element.clientWidth : 100,
            'overflow': 'auto',
            'max-height': '300px'
        }).appendTo(root);
        list.bind('mouseover',
        function () {
            list.mouseOnList = true;
        }).bind('mouseout',
        function () {
            list.mouseOnList = false;
        });
        function onItemClick(sender) {
            valueAccessor().selectItem = sender.data;
            ko.selectExtensions.writeValue(element, this.textContent);
            list.hide();
            el.focus();
            ko.utils.triggerEvent(element, 'change');
            if (allBindingsAccessor().onselect) allBindingsAccessor().onselect(sender.data);

        }
        function addListItem(text, data) {
            $('<li unselectable="on">' + text + '</li>').appendTo(list).bind('click', data, onItemClick);
        }
        function showTipe(data) {
            var val = el.val();
            list.children().remove();
            if (data instanceof Array) {
                ko.utils.arrayForEach(data,
                function (item) {
                    if (item instanceof Object) {
                        var valueKey = '';
                        var isAdd = false;
                        for (key in item) {
                            if (!valueKey) valueKey = key;
                            if (item[key].search(val) > -1) {
                                isAdd = true;
                                break;
                            }
                        }
                        if (isAdd) addListItem(item[valueKey], item);
                    } else if (item.search(val) > -1) {
                        addListItem(item, item);
                    }
                });
            } else {
                for (key in data) {
                    if (data[key] && data[key].search && data[key].search(val) > -1) {
                        addListItem(data[key], data[key]);
                    }
                }
            }
            if (list.is(":hidden") && list.children().length > 0) {
                list.show();
            } else if (list.children().length == 0) {
                list.hide();
            }
        }
        var onKeypress = function () {
            var value = ko.utils.unwrapObservable(valueAccessor());
            //if (typeof value == "function") {
            //    var key = allBindingsAccessor().autokey;
            //    value.call(viewModel, showTipe, el.val(), key);
            //}
            // if (el.val() == "") return;
            if (value.queryUrl != undefined) {
                var dp = new DataProxy(value);
                dp.Get({ keyword: el.val() }, function (dataS) {
                    for (var key in dataS) {
                        showTipe(dataS[key])
                        break;
                    }
                })
            } else showTipe(value);
            //} else if ((typeof value)== 'string') {
            //    showTipe(page.AllData[value]);
            //}

        };
        var onMouseClick = function () {
            if (list.is(":hidden")) onKeypress();
            else list.hide();
        };
        var onFocusout = function () {
            if (!list.mouseOnList) list.hide();
        };
        ko.utils.registerEventHandler(element, "keyup", onKeypress);
        ko.utils.registerEventHandler(element, "click", onMouseClick);
        ko.utils.registerEventHandler(element, "focusout", onFocusout);
    }
};



/////////////////////////////////////////////////
//////////以下为迁移过来的控件///////////////////
/////////////////////////////////////////////////

//frameListChose录入控件
//TreeSource:数据源，inputData：绑定值，onChange数据改变时的回调；
ko.bindingHandlers.TreeSource = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var el = $(element);
        // var TreeSource = valueAccessor();
        var initData = allBindingsAccessor().inputData;

        var TreeSource = ko.utils.unwrapObservable(valueAccessor());
        if (TreeSource.queryUrl != undefined) {
            var dp = new DataProxy(TreeSource);
            dp.Get({ keyword: el.val() }, function (dataS) {
                //for (var key in dataS) {
                //    bindControl(dataS[key]);
                //    break;
                //}
                bindControl(dataS.data);
            })

        } else {
            bindControl(TreeSource);
        }

        function bindControl(data) {
            var ttt = [];
            if (initData() != undefined) ttt = initData();
            var chose = el.frameListChose({
                TreeSource: data, InitCheckSource: ttt, ChoseChangeEvent: function () {
                    initData(el.frameListChose("GetAllChoseData"));
                    if (allBindingsAccessor().onChange) allBindingsAccessor().onChange();

                }
            });
        }

    }
};

//自定义绑定combox，用于支持返回数据的dictory格式和数组
//selectOptions:当前域可访问对象
ko.bindingHandlers.selectOptions = {
    init: function (element, valueAccessor, allBindings) {
        // var OptinsData = page.AllData[valueAccessor()];
        var OptinsData = valueAccessor();
        $(element).empty();
        if (OptinsData instanceof Array) {
            for (var i = 0; i < OptinsData.length; i++) {
                $(element).append("<option value='" + i + "'>" + OptinsData[i] + "</option>");
            }
        }
        else {
            for (var key in OptinsData) {
                $(element).append("<option value='" + key + "'>" + OptinsData[key] + "</option>");
            }
        }

    }
};

//根据系统缓存获得字典绑定combox，用于支持返回数据的dictory格式和数组
//selectOptions:当前域可访问对象
ko.bindingHandlers.DictOptions = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var dictType = valueAccessor().dictype;
        //var displayChoose = valueAccessor().displaychoose;
        $(element).empty();
        var deaultOp = $("<option value=''>-请选择-</option>");
        if (!valueAccessor().value()) {
            deaultOp.attr({ "selected": "selected" });
        }
        $(element).append(deaultOp);

        var optinsData = eval($.Com.getDict(dictType));
        var op;
        if (optinsData instanceof Array) {
            for (var i = 0; i < optinsData.length; i++) {
                op = $("<option value='" + i + "'>" + optinsData[i] + "</option>");
                if (valueAccessor().value() == i) {
                    op.attr({ "selected": "selected" });
                }
                $(element).append(op);
            }
        }
        else {
            for (var key in optinsData) {
                op = $("<option value='" + key + "'>" + optinsData[key] + "</option>");
                if (valueAccessor().value() == key) {
                    op.attr({ "selected": "selected" });
                }
                $(element).append(op);
            }
        }
        $(element).bind("change", function () {
            valueAccessor().value($(this).children('option:selected').val());
        });
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor().value();
        if (value == null) {
            value = "";
        }
        var children = $(element).children();
        for (var i = 0; i < children.length; i++) {
            var chil = children[i];
            if (chil.value == value) {
                chil.selected = true;
            } else {
                chil.selected = false;
            }
        }
    }
};

// 制作排放标准控件
ko.bindingHandlers.standardItem = {
    init: function (element, valueAccessor, allBindings) {
        //var type = valueAccessor().type;
        var input = valueAccessor().input;

        var objEvt = $._data($(element).next().children()[0], "events");
        if (objEvt && objEvt["click"]) {
            //alert("存在click方法");
        } else {
            $(element).next().children().bind("click", function () {
                $.Biz.StandardItemSelect(null, function (data) {
                    if (data != null) {
                        //$(element).val(data.nr);//排放标准内容
                        input(data.StandardName);//排放标准内容
                    }
                });
            });
        }
    }
};

//鼠标经过弹出DIV显示全部内容控件
ko.bindingHandlers.showAllContentDiv = {
    init: function (element, valueAccessor, allBindings) {

        var div = "<div style='position:absolute;border:#999999;border-style: solid;border-width: thin;display: none;background-color: #FFFCD7;z-index:9999; data-bind='text:StandardCode'></div>";
        $(element).after($(div)); //被选元素之后插入内容

        //鼠标移动到控件时触发
        $(element).mouseover(function () {
            var title = $(element);
            var div = title.next();
            //div.text(title.text());
            //div.offsetLeft = title.offset().left;
            //div.offset().Left = title.offset().left;
            //div.offset().top = title.offset().top + title.height();;
            div.css("left", title.offset().left + "px");
            div.css("max-width", title.width() + "px");
            //div.css("top", title.offset().top + "px");
            div.show();
        });
        //鼠标离开时触发
        $(element).mouseout(function () {
            $(element).next().hide()
        });
    },

    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var length = valueAccessor().length;
        var title = $(element);
        var div = title.next();
        var titleText = $.trim(title.text());
        div.text(titleText);
        title.text(titleText.length > length ? titleText.substring(0, length) + "..." : titleText);
    }
};


// 制作排污去向控件
ko.bindingHandlers.EmissionFate = {
    init: function (element, valueAccessor, allBindings) {
        var type = valueAccessor().type;
        var input = valueAccessor().input;

        var objEvt = $._data($(element).next().children()[0], "events");
        if (objEvt && objEvt["click"]) {
            //alert("存在click方法");
        } else {
            $(element).next().children().bind("click", function () {
                $.Biz.EmissionFateSelect(type, function (data) {
                    if (data != null) {
                        //input(data.dm);//代码
                        input(data.mc);//名称
                    }
                });
            });
        }
    }
};



// 上传文件控件
//用法:<span class="btn btn-link" data-bind="uploadFileControl:{value:NewsAttachment,saveFolderPath:'',extension:'.xls,.doc'}">添加附件&nbsp;&nbsp;&nbsp;<i class="fa fa-plus"></i></span>
ko.bindingHandlers.uploadFileControl = {
    init: function (element, valueAccessor, allBindings) {
        var self = this;
        var saveFolderPath = valueAccessor().saveFolderPath;
        var extension = valueAccessor().extension;
        var fileSize = valueAccessor().fileSize;
        self.value = valueAccessor().value;
        var hostUrl = window.location.host;
        self.con = [];

        var ob_ = $(element).next();
        if (ob_ && ob_.attr('data-id') == '_addfj_') {
            removeObject(ob_, element, '_addfj_');
        }

        if (value() != null && value() != "") self.con = value().split('|');
        var con = self.con;
        var relativePath = "";
        for (var i = 0; i < con.length; i++) {
            var index = con[i].lastIndexOf("/");
            var str = con[i].substring(index + 1, con[i].length);
            if (str != "") {
                index = str.lastIndexOf("_");
                str = str.substring(index + 1, str.length);
                var st = "<span data-id='_addfj_'><br><a href='http://" + hostUrl + "/" + con[i] + "' target='_blank' class='btn btn-link'>" + str + "</a><input type='hidden' value='" + con[i] + "'/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class='btn btn-link' data-id='" + i + "'><i class='fa fa-times'></i></span></span>";
                var bo = $(st);
                bo.find("[data-id='" + i + "']").click(function () {
                    var bo = $(this);
                    var text = $(bo.parent().children()[2]).val();//获取文件名
                    self.value(self.value().replace(text, ""));//删除对应的文件
                    var a = self.value().substring(self.value().length - 1, self.value().length);//获取符串最后尾的字符
                    if (a == "|") self.value(self.value().substring(0, self.value().length - 1));//去掉"|"
                    self.value(self.value().replace("||", "|"));
                    bo.parent().remove();//移除附件
                });
                $(element).after(bo);
            }
        }

        var objEvt = $._data($(element)[0], "events");
        if (objEvt && objEvt["click"]) {
            //alert("存在click方法");
        } else {
            $(element).bind("click", function () {
                uploadFileControl({ saveFolderPath: saveFolderPath, extension: extension, fileSize: fileSize }, function (data) {
                    if (data.success) {
                        var content = eval('(' + data.data + ')');
                        //var html = "";
                        var relativePath = "";
                        for (var i = 0; i < content.length; i++) {
                            relativePath += content[i].relativePath + "|"
                            var st = "<span  data-id='_addfj_'><br><a href='http://" + hostUrl + "/" + content[i].relativePath + "' target='_blank' class='btn btn-link'>" + content[i].fileName + "</a><input type='hidden' value='" + content[i].relativePath + "'/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class='btn btn-link' data-id='add" + i + "'><i class='fa fa-times'></i></span></span>";
                            var bo = $(st);
                            bo.find("[data-id='add" + i + "']").click(function () {
                                var bo = $(this);
                                var text = $(bo.parent().children()[2]).val();//获取文件名
                                self.value(self.value().replace(text, ""));//删除对应的文件
                                var a = self.value().substring(self.value().length - 1, self.value().length);//获取符串最后尾的字符
                                if (a == "|") self.value(self.value().substring(0, self.value().length - 1));//去掉"|"
                                self.value(self.value().replace("||", "|"));
                                bo.parent().remove();//移除附件
                            });
                            $(element).after(bo);
                        }

                        relativePath = relativePath.substring(0, relativePath.length - 1);//去掉最后的"|"
                        var s;
                        if (self.value() == null || self.value() == "") {
                            s = relativePath
                        } else {
                            s = self.value() + "|" + relativePath;
                        }
                        self.value(s);
                        //alert(data.msg);
                        //var content = eval('(' + data.content + ')');
                        //alert("上传文件名" + content[0].fileName);
                        //alert("保存后文件名" + content[0].saveFileName);
                        //alert("保存后文件大小" + content[0].fileSize);
                        //alert("保存后文件相对路径" + content[0].relativePath);
                        //alert("保存后文件绝对路径" + content[0].absolutePath);
                        //alert("保存后文件扩展名" + content[0].extension);
                    } else {
                        alert(data.msg);
                    }
                });
            });
        }


    },
    update: function (element, valueAccessor, allBindings) {
        var self = this;
        var saveFolderPath = valueAccessor().saveFolderPath;
        var extension = valueAccessor().extension;
        var fileSize = valueAccessor().fileSize;
        self.value = valueAccessor().value;
        var hostUrl = window.location.host;
        self.con = [];

        var ob_ = $(element).next();
        if (ob_ && ob_.attr('data-id') == '_addfj_') {
            removeObject(ob_, element, '_addfj_');
        }

        if (value() != null && value() != "") self.con = value().split('|');
        var relativePath = "";
        for (var i = 0; i < con.length; i++) {
            var index = con[i].lastIndexOf("/");
            var str = con[i].substring(index + 1, con[i].length);
            if (str != "") {
                index = str.indexOf("_");
                str = str.substring(index + 1, str.length);
                var st = "<span data-id='_addfj_'><br><a href='http://" + hostUrl + "/" + con[i] + "' target='_blank' class='btn btn-link'>" + str + "</a><input type='hidden' value='" + con[i] + "'/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class='btn btn-link' data-id='" + i + "'><i class='fa fa-times'></i></span></span>";
                var bo = $(st);
                bo.find("[data-id='" + i + "']").click(function () {
                    var bo = $(this);
                    var text = $(bo.parent().children()[2]).val();//获取文件名
                    self.value(self.value().replace(text, ""));//删除对应的文件
                    var a = self.value().substring(self.value().length - 1, self.value().length);//获取符串最后尾的字符
                    if (a == "|") self.value(self.value().substring(0, self.value().length - 1));//去掉"|"
                    self.value(self.value().replace("||", "|"));
                    bo.parent().remove();//移除附件
                });
                $(element).after(bo);
            }
        }
    }
};
function removeObject(ob, element, dataid) {
    ob.remove();
    var object = $(element).next();
    if (object && object.length > 0 && object.attr('data-id') == dataid) {
        removeObject(object, element, '_addfj_');
    }
}

// 显示文件控件
//用法:<span class="btn btn-link" data-bind="showFileControl:{value:NewsAttachment,columns:3}"></span>
ko.bindingHandlers.showFileControl = {
    init: function (element, valueAccessor, allBindings) {
        var self = this;
        //var saveFolderPath = valueAccessor().saveFolderPath;
        var columns = valueAccessor().columns;//显示列数
        var value = valueAccessor().value;
        self.con = [];

        var ob_ = $(element).next();
        if (ob_ && ob_.attr('data-id') == '_fj_') {
            removeObject(ob_, element, '_fj_');
        }

        //var hostUrl = window.location.host;
        //if (value() != null && value() != "") self.con = value().split('|');
        //var con = self.con;
        //var relativePath = "";
        //for (var i = 0; i < con.length; i++) {
        //    var index = con[i].lastIndexOf("/");
        //    var str = con[i].substring(index + 1, con[i].length);
        //    if (str != "") {
        //        index = str.lastIndexOf("_");
        //        str = str.substring(index + 1, str.length);
        //        var st = "<div data-id='_fj_' class='col-md-" + columns + "'><span><a href='http://" + hostUrl + "/" + con[i] + "' target='_blank' class='btn btn-link'>" + str + "</a><input type='hidden' value='" + con[i] + "'/></span></div>";
        //        //if (((i + 1) % columns) == 0) st += "<br>";
        //        var bo = $(st);
        //        //$(element).after(bo);
        //        bo.appendTo($(element));
        //    }
        //}
    },
    update: function (element, valueAccessor, allBindings) {
        var self = this;
        //var saveFolderPath = valueAccessor().saveFolderPath;
        var columns = valueAccessor().columns;//显示列数
        var value = valueAccessor().value;
        self.con = [];

        var ob_ = $(element).next();
        if (ob_ && ob_.attr('data-id') == '_fj_') {
            removeObject(ob_, element, '_fj_');
        }

        var hostUrl = window.location.host;
        if (value() != null && value() != "") self.con = value().split('|');
        var con = self.con;
        var relativePath = "";
        var code = con.length + 1;
        for (var i = 0; i < con.length; i++) {
            code = code - 1;
            var index = con[i].lastIndexOf("/");
            var str = con[i].substring(index + 1, con[i].length);
            if (str != "") {
                index = str.lastIndexOf("_");
                str = str.substring(index + 1, str.length);
                //var st = "<div data-id='_fj_' class='col-md-" + columns + "'><span>附件"+code+".<a href='http://" + hostUrl + "/" + con[i] + "' target='_blank' class='btn btn-link'>" + str + "</a><input type='hidden' value='" + con[i] + "'/></span></div>";
                var st = "<div data-id='_fj_'><span>附件" + code + ":<a href='http://" + hostUrl + "/" + con[i] + "' target='_blank' class='btn btn-link'>" + str + "</a><input type='hidden' value='" + con[i] + "'/></span></div>";
                //if (((i + 1) % columns) == 0) st += "<br>";
                var bo = $(st);
                $(element).after(bo);
            }
        }


    }
};


function uploadFileControl(par, callbackFunction) {
    //var id = "a" + Math.random();//获取一个随机数;
    var myDate = new Date();
    var id = myDate.getMilliseconds() + "";//获取一个随机数;
    var filesid = [];
    filesid.push(id);
    var opts = {
        title: '上传文件', height: 450, width: 500
       , button: [
           {
               text: '确定', handler: function (data) {
                   $.ajaxFileUpload({
                       url: "/UsedPhraseSvc.data?action=UploadlFile&filesid=" +
                           id + "&saveFolderPath=" + par.saveFolderPath + "&extension=" + par.extension + "&fileSize=" + par.fileSize,
                       secureuri: false,
                       fileElementId: filesid,//["sds","sd","sdss"]
                       dataType: 'json',
                       success: function (data) {
                           if (callbackFunction) callbackFunction(data);
                           win.close();
                       }
                   });

               }
           },
           { text: '取消', handler: function () { win.close(); } }
       ]
    };
    var win = $.iwf.showWin(opts);
    var winRoot = win.content();
    var div = "<div class='row form-horizontal form-bordered' style='margin: 10px'>" +
     "<form data-id='form" + id + "' method='post' enctype='multipart/form-data' runat='server'>" +
     "<div class='form-group'>" +
                "<label class='col-md-3' style='float: left'>选择文件</label>" +
                "<div class='col-md-7'>" +
                   "<input type='file' name='" + id + "' id='" + id + "' />" +
                "</div>" +
                "<div class='col-md-1'>" +
                  "<span data-id='add" + id + "' class='btn btn-link' style='float: right'><i class='icon-plus'></i></span>" +
                "</div>" +
     "</div>" +
     "</form>" +
   "</div>";

    var i = 1;
    winRoot.append(div);
    var form = winRoot.find("[data-id='form" + id + "']");
    form.find("[data-id='add" + id + "']").click(function () {

        filesid.push(id + i);
        form.append("<div class='form-group' data-id='div" + id + i + "'>" +
                    "<label class='col-md-3' style='float: left'>选择文件</label>" +
                    "<div class='col-md-7'>" +
                       "<input  type='file' name='" + id + i + "' id='" + id + i + "' />" +
                    "</div>" +
                    "<div class='col-md-1'>" +
                      "<span data-id='" + id + i + "' class='btn btn-link' style='float: right'><i style='color:red' class='icon-remove'></i></span>" +
                    "</div>" +
         "</div>");

        form.find("[data-id='" + id + i + "']").click(function (element) {
            var ob = $(this);
            ob.parent().parent().remove();
            var indexof = filesid.indexOf(ob.attr('data-id'));
            filesid.splice(indexof, 1);
            //alert(obj.parent().attr('id')); 搜索
        });
        i++;

    });


}


// 制作常用语控件
//selectOptions:当前域可访问对象
ko.bindingHandlers.usedPhraseType = {
    init: function (element, valueAccessor, allBindings) {
        var type = valueAccessor().type;
        var input = valueAccessor().input;

        var objEvt = $._data($(element).next().children()[0], "events");
        if (objEvt && objEvt["click"]) {
            //alert("存在click方法");
        } else {
            $(element).next().children().bind("click", function () {
                $.Biz.usedPhraseSelect(type, function (data) {
                    if (data != null) {
                        //$(element).val(data.nr);//常用语内容
                        input(data.nr);//常用语内容
                    }
                });
            });
        }


    }
};


//选人
ko.bindingHandlers.TreeUserSource = {
    init: function (element, valueAccessor, allBindings) {
        var valueAccessor = valueAccessor();

        var objEvt = $._data($(element).next().children()[0], "events");
        if (objEvt && objEvt["click"]) {
            //alert("存在click方法");
        } else {

            $(element).next().children().bind("click", function () {
                $.Biz.userListInfoSelect(element, valueAccessor, function (data) {
                    //if (data != null) {
                    //    $(element).val(data.nr);//常用语内容
                    //}
                });
            });
        }
    }
};

//选人（新）
ko.bindingHandlers.TreeUserSourceControl = {
    init: function (element, valueAccessor, allBindings) {
        var valueAccessor = valueAccessor();

        var objEvt = $._data($(element).next().children()[0], "events");
        if (objEvt && objEvt["click"]) {
            //alert("存在click方法");
        } else {

            $(element).next().children().bind("click", function () {
                $.Biz.UserSelectControl(element, valueAccessor, function (data) {
                    //if (data != null) {
                    //    $(element).val(data.nr);//常用语内容
                    //}
                });
            });
        }
    }
};


//单选
ko.bindingHandlers.TreeUserSourceSingleControl = {
    init: function (element, valueAccessor, allBindings) {
        var valueAccessor = valueAccessor();

        var objEvt = $._data($(element).next().children()[0], "events");
        if (objEvt && objEvt["click"]) {
            //alert("存在click方法");
        } else {

            $(element).next().children().bind("click", function () {
                $.Biz.UserSingleSelectControl(element, valueAccessor, function (data) {
                    //if (data != null) {
                    //    $(element).val(data.nr);//常用语内容
                    //}
                });
            });
        }
    }
};


//选部门
ko.bindingHandlers.TreeDepartmentSource = {
    init: function (element, valueAccessor, allBindings) {
        var valueAccessor = valueAccessor();

        //var objEvt = $._data($(element).next().children()[0], "events");
        var btn = $(element).next().children();
        btn.unbind();
        btn.bind("click", fn);
        function fn() {
            $.Biz.departmentListInfoSelect(element, valueAccessor, function (data) {
                if (data != null) {
                    $(element).val(data.dpname);
                }
            });
        }
    }
};

//通用选择控件  created by Zhoushining DateTime: 2014-07-31 可以用于选择人、选择部门、选择单位，支持单选和多选  参数（｛Multi: true, CodeValue: id, CodeName: name, CodeTableName: table1｝）
ko.bindingHandlers.ComTreeSources = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var valueAccessor = valueAccessor();
        var objEvt = $._data($(element).next().children()[0], "events");
        if (objEvt && objEvt["click"]) {
            //alert("存在click方法");
        } else {
            $(element).next().children().bind("click", function () {
                $.Biz.comListInfoSelect(element, valueAccessor, function (data) {
                    if (data != null) {
                        // 代码集
                        var newinput = document.createElement("input");
                        $(newinput).attr({ "data-id": "h_codestr" });
                        newinput.type = "hidden";
                        newinput.innerText = data.codeValue;
                        //$("input:hidden").val(); //或者$("input[type=hidden]").val()
                        $(newinput).val(data.codeValue);
                        $(element).before(newinput);

                        // 名称集
                        $(element).val(data.codeName);
                    }
                });
            });
        }
    }
};

// 制作法律规则控件
//selectOptions:当前域可访问对象
ko.bindingHandlers.lawRegulations = {
    init: function (element, valueAccessor, allBindings) {
        var type = valueAccessor().type;
        var codeValue = valueAccessor().codeValue;

        var objEvt = $._data($(element).next().children()[0], "events");
        if (objEvt && objEvt["click"]) {
            //alert("存在click方法");
        } else {
            $(element).next().children().bind("click", function () {
                $.Biz.lawRegulationsWin(element, function (ret) {
                    if (ret != null) {
                        $(element).val($.trim(ret.mc) + $.trim(ret.ks));
                        codeValue($.trim(ret.mc) + $.trim(ret.ks));
                    }
                });
            });
        }
    }
};

//自定义autocomplete控件，如果autocomplete=Array，则自动过滤array，也可以是DataProxy的设置，比如
// autocomplete：{queryUrl：xxx.data?action=...}
//onselect：完成选择后触发
ko.bindingHandlers.autocomplete = {
    'init': function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var el = $(element);
        var root = el.wrap("<div/>").parent().css({
            'position': 'relative'
        });
        var list = $('<ul unselectable="on"/>').addClass('dropdown-menu').hide().css({
            'top': (root.height()) ? root.height() : 22,
            'width': (element.clientWidth) ? element.clientWidth : 100,
            'overflow': 'auto',
            'max-height': '300px'
        }).appendTo(root);
        list.bind('mouseover',
        function () {
            list.mouseOnList = true;
        }).bind('mouseout',
        function () {
            list.mouseOnList = false;
        });
        function onItemClick(sender) {
            valueAccessor().selectItem = sender.data;
            ko.selectExtensions.writeValue(element, this.textContent);
            list.hide();
            el.focus();
            ko.utils.triggerEvent(element, 'change');
            if (allBindingsAccessor().onselect) allBindingsAccessor().onselect(sender.data);

        }
        function addListItem(text, data) {
            $('<li unselectable="on">' + text + '</li>').appendTo(list).bind('click', data, onItemClick);
        }
        function showTipe(data) {
            var val = el.val();
            list.children().remove();
            if (data instanceof Array) {
                ko.utils.arrayForEach(data,
                function (item) {
                    if (item instanceof Object) {
                        var valueKey = '';
                        var isAdd = false;
                        for (key in item) {
                            if (!valueKey) valueKey = key;
                            if (item[key].search(val) > -1) {
                                isAdd = true;
                                break;
                            }
                        }
                        if (isAdd) addListItem(item[valueKey], item);
                    } else if (item.search(val) > -1) {
                        addListItem(item, item);
                    }
                });
            } else {
                for (key in data) {
                    if (data[key] && data[key].search && data[key].search(val) > -1) {
                        addListItem(data[key], data[key]);
                    }
                }
            }
            if (list.is(":hidden") && list.children().length > 0) {
                list.show();
            } else if (list.children().length == 0) {
                list.hide();
            }
        }
        var onKeypress = function () {
            var value = ko.utils.unwrapObservable(valueAccessor());
            //if (typeof value == "function") {
            //    var key = allBindingsAccessor().autokey;
            //    value.call(viewModel, showTipe, el.val(), key);
            //}
            // if (el.val() == "") return;
            if (value.queryUrl != undefined) {
                var dp = new DataProxy(value);
                dp.Get({ keyword: el.val() }, function (dataS) {
                    for (var key in dataS) {
                        showTipe(dataS[key])
                        break;
                    }
                })
            } else showTipe(value);
            //} else if ((typeof value)== 'string') {
            //    showTipe(page.AllData[value]);
            //}

        };
        var onMouseClick = function () {
            if (list.is(":hidden")) onKeypress();
            else list.hide();
        };
        var onFocusout = function () {
            if (!list.mouseOnList) list.hide();
        };
        ko.utils.registerEventHandler(element, "keyup", onKeypress);
        ko.utils.registerEventHandler(element, "click", onMouseClick);
        ko.utils.registerEventHandler(element, "focusout", onFocusout);
    }
};

//日期输入控件
ko.bindingHandlers.datetimeFormat = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        //var datetimeformat = valueAccessor();
        //$(element).ComDatetimepicker(datetimeformat);

        //var str = "";
        //var allBindings = allBindingsAccessor();
        //if (allBindings.value) {
        //    var value = allBindings.value();
        //    if (value) {
        //        $(element).datetimepicker('setDate', new Date(value));
        //        //str = $(element).datetimepicker('getDate');
        //        //$(element).text(str);
        //    }
        //}


        var datetimeformat = valueAccessor();
        var picker = $(element).ComDatetimepicker(datetimeformat);

        //var str = "";
        //var allBindings = allBindingsAccessor();
        //var objectType = typeof (allBindings.value);
        //var value;
        //if (objectType == "function") {
        //    value = allBindings.value();
        //} else if (objectType == "string") {
        //    value = allBindings.value;
        //}
        //if (value) {
        //    $(element).datetimepicker('setDate', new Date(value));
        //}
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var datetimeformat = valueAccessor();
        var allBindings = allBindingsAccessor();
        var objectType = typeof (allBindings.value);
        var value;
        if (objectType == "function") {
            if (allBindings.value() && allBindings.value().format) {
                value = allBindings.value().format("yyyy-MM-dd hh:mm");
            } else {
                value = allBindings.value();
            }
        } else if (objectType == "string") {
            value = allBindings.value;
        }
        if (value) {
            //var strValue = value.replaceAll(' ', 'T');
            //if (strValue.indexOf('T') == (strValue.length-1)) {
            //    strValue = strValue.substr(0, strValue.length - 1);
            //}
            //var str = $(element).value;
            //$(element).datetimepicker('setDate', new Date(strValue));


            //修正日期格式多一个空格验证失败bug
            if (datetimeformat.indexOf("h") < 0) {
                $(element).datetimepicker('setDate', value);
                $(element)[0].value = $(element)[0].value.replaceAll(' ', '');
            } else if (value.indexOf("T") > 0) {
                $(element).datetimepicker('setDate', value);
            }

            allBindings.value($(element)[0].value);

        }
    }
};


//控件权限状态设置(非编辑元素（如：a/div/p）或有子元素(<td><a>我是子元素</a></td>)的html元素项隐藏时，必须在元素中设置属性：enable_status="hide"），
//示例(隐藏该td)：<td enable_status="hide" data-bind="enable_set:''" style="text-align: center;"><a data-bind="click:$parent.Edit" href="#" class="fa fa-edit" title="编辑"></a>&nbsp;&nbsp;<a  data-bind="click:$parent.Del" href="#" class="fa fa-times" title="删除"></a></td>
ko.bindingHandlers.enable_set = {
    init: function (element, valueAccessor, allBindings) {
        if (typeof comFlowForm == 'object' && typeof comFlowForm.convertToReadonly == 'function') {
            //继承父元素配置
            var enable_options = { enable_type: "", enable_actid: "", enable_status: "" };
            var parnet_enable_actid = $(element).closest('[enable_actid]').attr('enable_actid');
            enable_options.enable_actid = parnet_enable_actid || "";
            comFlowForm.convertToReadonly($(element), enable_options);
        }
    }
};


//通用日期时间控件初始化(datetimeFormat=日期时间格式，空时在控件的datetimeformat属性中取日期时间格式，都为空时默认为日期格式yy-mm-dd)

(function ($) {

    //日期时间格式：yy-mm-dd hh:mm:ss

    $.getScript("script/UI/jquery-ui-timepicker-addon.js");
    $.getScript("script/UI/jquery-ui-timepicker-zh-CN.js");

    if ($.fn.ComDatetimepicker == undefined) {
        $.fn.ComDatetimepicker = function (datetimeFormat) {
            $(this).each(function (index, element) {
                var self = $(element);
                var datetimeFormatInAttr = self.attr("datetimeformat");
                datetimeFormat = datetimeFormat || datetimeFormatInAttr || "yy-mm-dd";
                var dateAndTime = datetimeFormat.split(' ');
                var dateFormat = dateAndTime[0];//日期格式
                var timeFormat = dateAndTime[1] || '';//时间格式
                //日期
                //if (timeFormat == null) {
                //    self.datepicker({ dateFormat: dateFormat, changeMonth: true, changeYear: true, showDate: false });
                //curElem.datepicker({ dateFormat: dateFormat});
                //} else {//日期+时间
                var opts = {
                    dateFormat: dateFormat,
                    changeMonth: true, changeYear: true
                    , showTime: timeFormat != ''
                    , showHour: timeFormat.indexOf('hh') > -1
                    , showMinute: timeFormat.indexOf('mm') > -1
                    , showSecond: timeFormat.indexOf('ss') > -1
                    , timeFormat: timeFormat,
                    stepHour: 1,
                    stepMinute: 1,
                    stepSecond: 1,
                    beforeShow: function () {
                        setTimeout(function () {
                            var zIndex = $('#ui-datepicker-div').css('z-index');
                            if (isNaN(zIndex)) {
                                zIndex = 10;
                            } else {
                                zIndex = parseInt(zIndex) + 10;
                            }
                            $('#ui-datepicker-div').css('z-index', 99999);
                        }, 0);
                    }
                };
                //汉化 Timepicker  ------加载的汉化文件中不起作用
                $.timepicker.regional['zh-CN'] = {
                    timeOnlyTitle: '选择时间',
                    timeText: '时间',
                    hourText: '小时',
                    minuteText: '分钟',
                    secondText: '秒钟',
                    millisecText: '微秒',
                    timezoneText: '时区',
                    currentText: '现在时间',
                    closeText: '关闭',
                    timeFormat: 'hh:mm',
                    amNames: ['AM', 'A'],
                    pmNames: ['PM', 'P'],
                    ampm: false
                };
                $.timepicker.setDefaults($.timepicker.regional['zh-CN']);
                
                if (self.datetimepicker) self.datetimepicker(opts);


            });
        }
    }

})(jQuery);

//表单设计中的录入控件参数设置！！
var inputControls = new function (ElType) {

    //属性字段说明
    this.propertyDic = {
        'label': '录入标题', 'optionsList': '值和标注', 'pattern': '校验表达式，和title一一对应，在title中进行了说明',
        'cssclass': '样式class，不同的控件有不同的样式可选', 'selectOptions': '选项源', 'autocomplete2': '自动完成源', 'DictOptions2': '缓存数据源，也可以是数组[\'a\',\'b\']，或者是json的键值对{\'1\':\'a\',\'2\':\'b\'}，不能有"',
        'checkbox2': '多选框选项，可以是缓存数据源，也可以是数组[\'a\',\'b\']，或者是json的键值对{\'1\':\'a\',\'2\':\'b\'}，不能有"', 'Radio2': '单选框选项，可以是缓存数据源，也可以是数组[\'a\',\'b\']，或者是json的键值对{\'1\':\'a\',\'2\':\'b\'}，不能有"', 'datetimeFormat2': '设置日期时间格式！'
    };
    this.eleTypeAuto = { "SELECT": "下拉框", "TEXTAREA": "多行文本框", "checkbox": "多选框", "radio": "单选框", "text": "文本框", "datepicker": "日期选择框" };
    var patternData2 = {
        '\\w+': '不能为空',
        '^\\d+$': '必须为数字且不能为空',
        '^\\d{4}-\\d{2}-\\d{2}$': '输入格式不对',
        '（"^(\d{3.4}-)\d{7,8}$"）': '电话号码',
        '("^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$")': 'Email地址',
        '（"^\d{15}|\d{18}$"）': '验证身份证号',
        '"^[0-9]*$"': '只能输入数字',
        '\S': '必填'
    };
    this.patternData = patternData2;

    //控件类型
    this.getControlSetting = function (ElType) {
        var attrList = [];
        var bindList = [];
        var nodeType = ElType;
        var typeCn = '';

        switch (ElType) {
            case "SELECT":
                attrList = ['id', 'cssclass', 'style', 'title', 'label', 'disabled', 'placeholder'];
                bindList = ['visible', 'value', 'DictOptions2'];
                nodeType = 'select';
                break;
            case "TEXTAREA":
                attrList = ['id', 'cssclass', 'style', 'title', 'label', 'disabled'];
                bindList = ['visible', 'value'];
                nodeType = 'textarea';
                break;
            case "checkbox":
                attrList = ['id', 'style', 'title', 'label', 'disabled'];
                bindList = ['visible', 'value', 'checkbox2'];
                nodeType = 'input';
                break;
            case "radio":
                attrList = ['id', 'style', 'title', 'label', 'disabled'];
                bindList = ['visible', 'value', 'Radio2'];
                nodeType = 'input';
                break;
            case "text":
                attrList = ['id', 'cssclass', 'style', 'title', 'label', 'disabled', 'pattern', 'placeholder'];
                bindList = ['visible', 'value', 'autocomplete2', 'onselect'];
                nodeType = 'input';
                break;
            case "datepicker":
                attrList = ['id', 'style', 'title', 'label', 'disabled'];
                bindList = ['visible', 'value', 'datetimeFormat'];
                nodeType = 'input';
                break;
            case "button":
                attrList = ['id', 'cssclass', 'style', 'title', 'value', 'disabled'];
                bindList = ['visible', 'click'];
                break;
            default:
                attrList = ['id', 'cssclass', 'style'];
                break;
        }
        return { attrList: attrList, bindList: bindList, nodeType: nodeType };
    }

    //各属性可选项
    this.getAutoOptions = function (attr, eltype) {
        switch (attr) {
            case "pattern":
                var tt = [];
                for (var key in patternData2) {
                    tt.push(key);
                }
                return tt;
            case "cssclass":
                var cssClass = {
                    button: [".btn .btn-default", "btn btn-primary", "btn btn-info", "btn btn-success", "btn btn-warning", "btn btn-danger", "btn btn-inverse", "btn btn-link"],
                    text: ["form-control", "input-medium search-query", "input-small"],
                    TABLE: ["table", "table table-striped", "table table-bordered", "table table-hover", "table table-condensed"],
                    DIV: ["alert", "alert alert-error", "alert alert-success", "alert alert-success"]
                };

                return cssClass[eltype];
            case "DictOptions2":
                var tt = [];
                for (var key in $.Com.dictCache) {
                    tt.push("'" + key + "'");
                }
                return tt;
            case "datetimeFormat":
                var tt = ["'yy-mm-dd'", "'yy-mm-dd hh:mm'", "'yy-mm-dd hh:mm:ss'"];

                return tt;
            default:
                return null;

        }
    }

}();


//iwf-checkbox 多选框

//ko.components.register('iwf-checkbox', {
//    viewModel: function (params) {
//        this.chosenValue = params.checked;
//        this.options = ko.observableArray();
//        var OptinsData = params.options;
//        if (OptinsData instanceof Array) {
//            for (var i = 0; i < OptinsData.length; i++) {
//                this.options.push({ text: OptinsData[i], value: OptinsData[i] });
//            }
//        }
//        else {
//            for (var key in OptinsData) {
//                this.options.push({ value: key, text: OptinsData[key] });
//            }
//        }
//    },
//    template:
//        '<div data-bind="foreach: options">\
//         <input type="checkbox"  data-bind="checked:$root.chosenValue,value:value" ><span data-bind="text:text">\
//         </div>'
//});

////iwf-radio 多选框

//ko.components.register('iwf-radio', {
//    viewModel: function (params) {
//        this.chosenValue = params.checked;
//        this.options = ko.observableArray();
//        var OptinsData = params.options;
//        if (OptinsData instanceof Array) {
//            for (var i = 0; i < OptinsData.length; i++) {
//                this.options.push({ text: OptinsData[i], value: OptinsData[i] });
//            }
//        }
//        else {
//            for (var key in OptinsData) {
//                this.options.push({ value: key, text: OptinsData[key] });
//            }
//        }
//    },
//    template:
//        '<div data-bind="foreach: options">\
//         <input type="radio" data-bind="checked:$root.chosenValue,value:value" ><span data-bind="text:text">\
//         </div>'
//});
////日期选择
//ko.components.register('iwf-datepicker', {
//    viewModel: function (params) {
//        this.chosenValue = params.value;
//        if (params.datetimeFormat == undefined || params.datetimeFormat == "") params.datetimeFormat = 'yy-mm-dd hh:mm';
//        // this.Format = ko.observable(params.datetimeFormat);
//        this.Format = params.datetimeFormat;
//    },
//    template:
//        '<input type="text"  data-bind="value:chosenValue,datetimeFormat2:Format" >'
//});


//ko.components.register('datetime-widget', {
//    viewModel: function (params) {
//        this.chosenValue = params.value;
//        this.like = function () { this.chosenValue('like'); }.bind(this);
//        this.dislike = function () { this.chosenValue('dislike'); }.bind(this);
//    },
//    template: '<div class="like-or-dislike" > \
//<strong data-bind="text: chosenValue"></strong>     </div>'
//});