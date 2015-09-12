$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'email' };
    this.show = function (module, root) {
        $.Biz.email.show(module, root);
    }
});

$.Biz.email = new function () {
    var root;
    var data;
    var wftool;
    var emailState = "ReceiveEmail";

    var gridModel = $.Com.GridModel({
        beforeBind: function (vm, _root) {

        },
        afterBind: function (vm, _root) {
            //CKEDITOR.replace('Mail_SendText');
        },
        
        elementsCount: 10,
         edit: function (item, callback) { showDetail(item, callback); },
         remove: function (row) {
            if (!confirm("确定要删邮件吗？")) return false;
            else {
                var id = row.ID();
                deleteData(id, emailState == "RemoveEmail"?"1":"0");
            }
        },
        columns: [
            { title: "发件人", key: "Mail_SendPersonName", sortable: true,width: "120px", content: "<span class=\"btn btn-link\" data-bind=\"text:Mail_SendPersonName,click: $root.editRow\"></span>" },
            { title: "标题", key: "Mail_Title", sortable: true, content: "<span class=\"btn btn-link\" data-bind=\"text:Mail_Title,click: $root.editRow\"></span>" },
            { title: "日期", key: "sjlc", sortable: true, width: "120px", content: "<span class=\"btn btn-link\" data-bind=\"text: Mail_SendDate(),click: $root.editRow\"></span>" },
            { title: "删除", key: "action", sortable: true, width: "50px", content: "<span class=\"btn\" data-bind='click: $root.removeRow'><i  class=\"fa fa-times\"></i></span>" }

        ],
         keyColumns: "ID"
        , cssClass: "table table-striped table-bordered  table-condensed"
    });


    //显示弹窗
    function showDetail(item, callback) {
        var detailmodel = $.Com.FormModel({
          
        });
        var divroot = root;
        var dlgOpts = {
            title: '邮件编辑', width: 800, height: 700,
            button: [
           {
               text: '保存邮件', handler: function (data) {
                   var da = detailmodel.getData();
                   saveData(da,"0");
                   win.close();
               }
           },
           {
               text: '发送邮件', handler: function (data) {
                   var da = detailmodel.getData();
                   saveData(da, "1", callback);
                   win.close();
               }
           },
          {
              text: '取消', handler: function () { win.close(); }
          }
            ]
        };

        if (emailState == "ReceiveEmail" || emailState == "SendEmail" || emailState == "RemoveEmail") dlgOpts.button = null;
        //数据、保存回调、模块、html模板、选项
        var win = $.Com.showFormWin(item, function () {
            //// 确定保存数据
            //var data = detailmodel.getData();
            //saveData(data);
        }, detailmodel, root.find("[data-id='editent']"), dlgOpts);
    }

    // 保存数据
    function saveData(lawData, IsSend, callback) {
        //  $.Com.showMsg('数据保存成功！'); return;
        if (lawData == null || lawData == "") return;
        //var content = JSON.stringify({ "savedate": lawData });
        var content = JSON.stringify(lawData);
        $.post('B_EmailSvc.data?action=SaveMail', { JsonData: content, IsSend: IsSend, userName: parent.$.iwf.userinfo.CnName }, function (res) {
            var json = eval('(' + res + ')')
            if (json.success) {
                  $.Com.showMsg(json.msg);
                //callback(lawData);
                //emailState = "SendEmail";
                //loadData("SendEmail");//加载已发送邮件
            }
            else {
                  $.Com.showMsg(json.msg);
            }

        });
    }

    // 载入数据
    function loadData(emailState) {
        // 载入数据
        var params = { emailState: emailState };
        $.fxPost("B_EmailSvc.data?action=InitMail", params, function (ret) {
            if (ret.data) {
                data = ret.data
                gridModel.show(root.find("[data-id='emailTableGrid']"), data.dataList);
            }
        });
    }

    // 删除行数据
    function deleteData(id, deleteType) {
        if (!id) return;
        var param = { Id: id, deleteType: deleteType };
        $.post("/B_EmailSvc.data?action=DeleteMail", param, function (ret) {
            var data = eval('(' + ret + ')');
            if (data.success) {
                return true;
            } else {
                  $.Com.showMsg(data.msg);
                return false; 
            }
        });

    }

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/Email/Email.html", function () {
            loadData("ReceiveEmail");
            //CKEDITOR.replace('Mail_SendText');
            //写邮件
            root.find("[data-id='newEmail']").bind("click", function () {
                emailState = "newEmail";
                showDetail(data.dataEdit, function (data) { gridModel.viewModel.addRow(data); });
                emailState = "ReceiveEmail";
            });

            //收件箱
            root.find("[data-id='ReceiveEmail']").bind("click", function () {
                emailState = "ReceiveEmail";
                loadData("ReceiveEmail");
            });
            //草稿箱
            root.find("[data-id='ManuscriptEmail']").bind("click", function () {
                emailState = "ManuscriptEmail";
                loadData("ManuscriptEmail");
            });
            //已发送
            root.find("[data-id='SendEmail']").bind("click", function () {
                emailState = "SendEmail";
                loadData("SendEmail");
            });
            //已删除
            root.find("[data-id='RemoveEmail']").bind("click", function () {
                emailState = "RemoveEmail";
                loadData("RemoveEmail");
            });
        });
    }
};
