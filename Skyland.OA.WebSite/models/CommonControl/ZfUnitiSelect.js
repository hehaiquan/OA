//选择政府单位的列表，就是弹出窗口的内容
$.Biz.ZfUnitiSelectList = function () {
    self = this;
    var selectCallback;
    var rootDiv;
    var detailmodel = $.Com.FormModel({});
    var gridModel = $.Com.GridModel({
        edit: function (item, callback) {             
            //self.selectData = item;
            //var div = rootDiv.find("[data-id='showInfo']");
            //detailmodel.show(div, item);

            selectCallback(item); 
        },
        remove: function (row) {
            $.post("/UsedPhraseSvc.data?action=DeleteZfUnitiData&id=" + row.id(), {}, function (res) {
                var data = eval('(' + res + ')');
                if (data.success) {
                    return true;
                } else {
                    return false;
                      $.Com.showMsg(data.msg);
                }
            });

        },
       keyColumns: "id"//主键字段
       ,elementsCount: 10  //分页,默认5
    });

    this.show = function (module, root) {
        if (root.children().length != 0) return;
        rootDiv=root;
        selectCallback = module.callback;  //选择单位回调
        var par = {
            tablename: "Para_ZfUniti",
            showfield: "",
            where: null
        }
        root.load("models/CommonControl/ZfUnitiSelect.html", function () {
           
            $.fxPost("UsedPhraseSvc.data?action=GetData", par, function (data) {
                data = eval('(' + data.data + ')')
                gridModel.show(root.find('[data-role="unitGrid1"]'), data);
            });

            root.find("[data-id='save']").click(function () {
                var data = {
                    dwmc: $.trim(root.find("[data-id='dwmc']").val()),
                    lxr: $.trim(root.find("[data-id='lxr']").val()),
                    lxdh: $.trim(root.find("[data-id='lxdh']").val()),
                    txdz: $.trim(root.find("[data-id='txdz']").val())
                };
                if (data.dwmc == null || data.dwmc == "") {   $.Com.showMsg("单位名称不能空"); return; }
                var jsonstring= JSON.stringify(data);
                $.fxPost("UsedPhraseSvc.data?action=SaveZfUnitiData", { jsonData: jsonstring }, function (data) {
                    //data = eval('(' + data.data + ')')
                    $.fxPost("UsedPhraseSvc.data?action=GetData", par, function (data) {
                        data = eval('(' + data.data + ')')
                        gridModel.show(root.find('[data-role="unitGrid1"]'), data);
                    });
                });
            });
        });
    }
}

//政府列单位例表的弹窗，选择企业
$.Biz.ZfUnitiSelectWin = function (callback) {
    var model = new $.Biz.ZfUnitiSelectList();
    var opts = {
        title: '政府单位列表', height: 730, width: 800,
        // button: [
        //           {
        //               text: '确定', handler: function (data) {
        //                   callback(model.selectData);
        //                   win.close();
        //               }
        //           },
        //           { text: '取消', handler: function () { win.close(); } }
        //]
    };
    var win = $.iwf.showWin(opts);
    var root = win.content();
    model.show(
          { callback: function (item) { callback(item); win.close(); } },
          root
    );
}

