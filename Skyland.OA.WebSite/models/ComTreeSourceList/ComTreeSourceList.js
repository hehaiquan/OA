// created by Zhoushining at July 31th, 2014 
$.Biz.comTreeSourceList = function (elm, valueAccessor) {
    elm = $(elm);
    // valueAccessor  contains  multi: true, codeValue: id, codeName: name, codeTableName: table1
    var selectCallback;
    var selectNodes = [];

    // 这四个变量仅用于表数据查询
    var inputMultiple = valueAccessor.multiple;// true--多选；false--单选
    var inputCodeValue = valueAccessor.codevalue;
    var inputCodeName = valueAccessor.codename;
    var inputTableName = valueAccessor.tablename;
    var inputConditions = valueAccessor.conditions;

    var div;
    var checkImage = "<i class='fa fa-check-square-o fa-lg' style='margin-right: 5px;' ></i>";

    this.show = function (module, root) {
        if (root.children().length != 0) return;
        selectCallback = module.callback;//回调函数

        root.load("models/ComTreeSourceList/ComTreeSourceList.html", function () {
            div = root.find("[data-id='comListdiv']");
            div.css("height", "100%");
            // 载入数据
            var params = {
                multiple: inputMultiple,
                codeValue: inputCodeValue,
                codeName: inputCodeName,
                tableName: inputTableName,
                conditions: inputConditions
            };

            $.fxPost("/B_ComSvc.data?action=GetComTreeSource", { content: JSON.stringify(params) }, function (json) {
                if (json.data) {
                    //alert("data exists!");
                    div.val(json.data);
                    //alert(JSON.stringify(json.data));
                    var items = {
                        data: json.data,
                        expandbyClick: true, // parentNode
                        flowlayout: div.width() - 10,
                        itemclick: function (item, element) {
                            //if (item.children.length > 0) return;
                            if (inputMultiple) {// 多选
                                if (!item.check) {
                                    element.prepend(checkImage);
                                    selectNodes.push({ id: item.id, name: item.name });
                                } else {
                                    element.children().remove("i");
                                    // 删除
                                    for (var i = 0; i < selectNodes.length; i++) {
                                        if (selectNodes[i].id) selectNodes.splice(i, 1);
                                    }
                                }
                                //var multipleStr = "";
                                var codeValueStr = "";
                                var codeNameStr = "";
                                //var tableNameStr = "";
                                for (var i = 0; i < selectNodes.length; i++) {
                                    codeValueStr += selectNodes[i].id + ";";
                                    codeNameStr += selectNodes[i].name + ";";
                                }

                                var mode_codeValue = root.find("[data-id='mode_codeValue']");
                                var mode_codeName = root.find("[data-id='mode_codeName']");
                                if (inputCodeValue) { mode_codeValue.val(codeValueStr) }
                                mode_codeName.val(codeNameStr);
                            } else {// 单选
                                if (inputCodeValue != null) {
                                    inputCodeValue = item.id;
                                    inputCodeName = item.name;
                                }
                                selectCallback({ codeValue: item.id, codeName: item.name });
                            }
                            item.check = !item.check;
                        }
                    };
                    if (div) {
                        var objmenu = $("<div></div>").appendTo(div).listView2(items);
                    } else {
                        var objmenu = $("<div></div>").appendTo(elm.parent()).listView2(items);
                        objmenu.css("overflow", "auto");
                        elm.parent().DropdownMenu({ content: objmenu });
                    }


                    // 全选
                    root.find("[data-id='chooseall']").bind("click", function () {
                        // 删除所有图标和数据
                        root.find("[data-id='comListdiv'] a").each(function () {
                            $(this).children().remove("i");
                        });
                        // 出栈
                        selectNodes.splice(0, selectNodes.length);
                        var mode_codeValue = root.find("[data-id='mode_codeValue']");
                        var mode_codeName = root.find("[data-id='mode_codeName']");
                        mode_codeValue.val("");
                        mode_codeName.val("");

                        root.find("[data-id='comListdiv'] a").each(function () {
                            // 添加图标
                            $(this).prepend(checkImage);
                        });
                        // 入栈
                        for (var i = 0; i < json.data.length; i++) {
                            selectNodes.push({ id: json.data[i].id, name: json.data[i].name });
                        }

                        var codeValueStr = "";
                        var codeNameStr = "";
                        for (var i = 0; i < selectNodes.length; i++) {
                            codeValueStr += selectNodes[i].id + ";";
                            codeNameStr += selectNodes[i].name + ";";
                        }

                        var mode_codeValue = root.find("[data-id='mode_codeValue']");
                        var mode_codeName = root.find("[data-id='mode_codeName']");
                        if (inputCodeValue) { mode_codeValue.val(codeValueStr) }
                        mode_codeName.val(codeNameStr);
                        // alert(selectNodes.length);
                    });

                    // 取消全选
                    root.find("[data-id='cancelchooseall']").bind("click", function () {
                        root.find("[data-id='comListdiv'] a").each(function () {
                            // 删除图标
                            $(this).children().remove("i");
                        });
                        // 出栈
                        selectNodes.splice(0, selectNodes.length);
                        var mode_codeValue = root.find("[data-id='mode_codeValue']");
                        var mode_codeName = root.find("[data-id='mode_codeName']");
                        mode_codeValue.val("");
                        mode_codeName.val("");
                        // alert(selectNodes.length);
                    });
                }
            });

        });
    };

};

// window show
$.Biz.comListInfoSelect = function (element, valueAccessor, callback) {
    var model = new $.Biz.comTreeSourceList(element, valueAccessor);
    var root = null;

    var opts = {
        title: "请选择",
        height: 730,
        width: 750,
        button: [
            {
                text: '确定', handler: function (data) {
                    var mode_codevalue = root.find("[data-id='mode_codeValue']");
                    var mode_codename = root.find("[data-id='mode_codeName']");
                    if (valueAccessor.codevalue != null) {
                        valueAccessor.codes = mode_codevalue.val();
                        valueAccessor.names = mode_codename.val();//设置用户名
                    }
                    callback({ codeValue: valueAccessor.codes, codeName: valueAccessor.names });
                    mode_codevalue.val("");
                    mode_codename.val("");
                    win.close();
                }
            },
          {
              text: '取消', handler: function () { win.close(); }
          }
        ]
    };

    var win = $.iwf.showWin(opts);// 弹出窗口
    root = win.content();
    model.show(
        {
            callback: function (item) {
                callback(item);
                win.close();// 关闭弹窗
            }
        },
        root
        );
};



