//选择用户常用语的model，就是弹出窗口的内容
$.Biz.usedPhrase = function (lx) {
    //var myMv = this;
    var selectCallback;
    var gridModel = $.Com.GridModel({
        keyColumns: "id",//主键字段
        edit: function (item, callback) {
            selectCallback(item);
            svaeNr(item.nr);
        },
        remove: function (row) {
            $.post("/UsedPhraseSvc.data?action=DeleteData&id=" + row.id(), {}, function (res) {
                var data = eval('(' + res + ')');
                if (data.success) {
                    //  $.Com.showMsg(data.msg);
                    return true;
                } else {
                    return false;
                      $.Com.showMsg(data.msg);
                }
            });

        },
        elementsCount: 10  //分页,默认5
    });

    //保存常用语
    svaeNr = function (nr) {
        //var nr = $("#usedPhraseFilterInput").val();
        if (nr == null || nr == "") return;
        //selectCallback({ nr: nr });
        $.post("/UsedPhraseSvc.data?action=SaveData&lx=" + lx, { nr: nr }, function (res) {
            var data = eval('(' + res + ')');
            if (data.success) {
                return true;
            } else {
                return false;
                  $.Com.showMsg(data.msg);
            }
        });
    }

    this.show = function (module, root) {
        if (root.children().length != 0) return;
        selectCallback = module.callback;  //选择单位回调
        root.load("models/CommonControl/usedPhrase.html", function () {
            $.fxPost("UsedPhraseSvc.data?action=GetUsedPhrase&lx=" + lx, {}, function (data) {
                gridModel.show(root.find('[data-role="usedPhraseGrid"]'), data.data.usedPhraseList)

            });
            root.find("[data-id='usedPhraseFilterInput']").keypress(function (e) {
                if (e.keyCode == 13) {
                    var nr =root.find("[data-id='usedPhraseFilterInput']").val();
                    if (nr == null || nr == "") return;
                    selectCallback({ nr: nr });
                    svaeNr(nr);
                }
                //event.keyCode == 39
                //keydownk
            });
            root.find("[data-id='usedPhraseAddBn']").click(function () {
                var nr =root.find("[data-id='usedPhraseFilterInput']").val();
                if (nr == null || nr == "") return;
                selectCallback({ nr: nr });
                svaeNr(nr);
            });
        });

    }


}


//加入用户常用语列表的弹窗，选择常用语
$.Biz.usedPhraseSelect = function (lx, callback) {

    var model = new $.Biz.usedPhrase(lx);
    var root = null;
    var opts = { title: '选择常用语', height: 730, width: 750 };
    var win = $.iwf.showWin(opts);
    model.show(
        {
            callback: function (item) { callback(item); win.close(); }
        },
        win.content()
     );
}



/*

//选择用户常用语的model，就是弹出窗口的内容
$.Biz.usedPhrase = function (lx) {

    
    var me = this;
    // this.options = { key: 'Weather' };
    var grid;
    var rootDiv;

    function usedPhraseGird(div, selectCallback) {
        var opts = {
            keyColumns: "id"//主键字段
            , elementsCount: 10  //分页,默认5
            , paginator: true   //是否分页，默认不分页
            , columns: [
                //{ title: "#", key: "number", width: "10%" },
                {
                    //title: "<div class='input-group'>"+
                    //       "<input type='text' required='required' class='form-control' />"+
                    //       "<span class='input-group-btn'>"+
                    //       "<button class='btn btn-default' type='button' >添加</button>"+
                    //       "</span></div>",
                    title: "常用语", key: "nr", width: "95%",
                    content: "<span class=\"btn btn-link\" data-bind=\"text:nr,click: $root.editRow\"></span>"
                },
                { title: "操作", key: "action", sortable: false, content: "<span  class=\"btn\" class=\"btn btn-link\" data-bind='click: $root.removeRow,enable_set:null'><i  class=\"fa fa-times\"></i></span>" }
                ]
            , filters: {
                //"Source": { type: "select", data: getDict('xfly') },
                "nr": { placeholder: "常用语查询" }
            }
            , cssClass: " table table-striped table-bordered",
            beforeBind: function (vm, member, root) {
                //参数：vm - 当前member的VM对象；root - 当前koPage对象
                //在这里可以扩展一些其他函数（为了避免函数名称冲突，建议加上函数前缀“__”）
                //获取信访来源文本函数
                //vm.__GetSourceText = function (key) {
                //    return $("#selSource option[value=" + key + "]").text()
                //}
            },
            remove: function (row) {
    
                  $.Com.showMsg(row.id());
                $.post("/UsedPhraseSvc.data", {}, function (res) {
                    var data = eval('(' + res + ')');
                    var obj = new Object();
                });


                return false;
            }
        };

        opts.edit = function (item, callback) {
            selectCallback(item);
        };
        var myGrid = $(div).KOGrid(opts);
        return myGrid;
    }

    function usedPhraseDetail() {
    }

    this.show = function (module, root) {
        if (root.children().length == 0) {
            rootDiv = root;
            root.load("models/usedPhrase/usedPhrase.html", function () {
                var options = {
                    forms: {
                        "usedPhraseList": new usedPhraseGird(rootDiv.find('[data-role="usedPhraseGrid"]')[0], module.callback), "usedPhraseDetail": new usedPhraseDetail()
                    }
                    , dataProxy: { 
                        url: "UsedPhraseSvc.data?action=GetUsedPhrase&lx=" + lx
                    }
                };
                var _koPage = new koPage(options);
                _koPage.init();

                //$("#usedPhraseGrid tr:gt(0):eq(1)").remove();//删除第一行

            });
        }
    }
   


}

$.Biz.usedPhraseSelect = function (lx,callback) {

    var model = new $.Biz.usedPhrase(lx);
    var root = null;
    var opts = {
        title: '用户常用语',
        height: 800, width: 750
        //,button: [{
        //    text: '确定', handler: function (data) {
        //          $.Com.showMsg($(win.content()).children()[0].contentWindow.testvar);
        //    }
        //}, {
        //    text: '取消', handler: function () { win.close(); }
        //}]
    };
    var win = window.parent.$.iwf.showWin(opts);
    //弹出窗口并显示
    model.show(
        {
            callback: function (item) {
                callback(item);//回调涵数
                win.close();//关闭窗口
            }
        },
        win.content()
    );
}
*/
