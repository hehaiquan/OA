$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'addSchedule' };
    this.show = function (module, root) {
        $.Biz.AddSchedule.show(module, root);
    }
});



$.Biz.AddSchedule = new function () {
    var self = this;
    var root;
    self.data = null;
    var models = {};

    //基本信息模
    models.baseInfo = $.Com.FormModel({
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) { },
        //数据合法性验证，返回false则不会提交
        beforeSave: function (vm, root) {
            return true;
        },
        afterBind: function (vm, root) { }
    });

    models.gridModel = $.Com.GridModel({
        keyColumns: "ScheduleId",//主键字段
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) {
            //vm._BrowseNotice = function (NewsId) {
            //    $.Biz.BrowseNoticeWin(
            //        NewsId, function (data) { }
            //    );
            //}
        },
        edit: function (item, callback) { showDetail(item, callback); },
        remove: function (row) {
            if (!confirm("确定要删除这条数据吗？")) return false;
            $.post("/B_OA_ScheduleSvc.data?action=DeleteData&id=" + row.ScheduleId(), {}, function (res) {
                var data = eval('(' + res + ')');
                if (data.success) {
                    //  $.Com.showMsg(data.msg);
                    for (var i = 0; i < self.data.List.length; i++) {
                        if (self.data.List[i].ScheduleId == row.ScheduleId()) {
                            self.data.List.splice(i, 1);//移除数组元素
                            break;
                        }
                    }
                    return true;
                } else {
                      $.Com.showMsg(data.msg);
                    return false;
                }
            });

        },
        elementsCount: 10  //分页,默认5
    });



    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/OA_Schedule/AddSchedule.html", function () {

            root.find("[data-id='AddBn']").bind("click", function () {
                showDetail(self.data.baseInfo, function (data) { models.gridModel.viewModel.addRow(data); });
            });

            //查询
            root.find("[data-id='searchBn']").bind("click", function () {
                loadData($.trim(root.find("[data-id='beginText']").val()), $.trim(root.find("[data-id='endText']").val()));// 载入数据 
            });

            loadData(null, null);// 载入数据 

            //// 载入数据
            ////var params = { emailState: emailState };
            //$.fxPost("B_OA_ScheduleSvc.data?action=GetData", { }, function (data) {
            //    //self.data = eval('(' + data.data + ')');
            //    self.data =data.data;
            //    models.gridModel.show(root.find('[data-role="ScheduleGrid"]'), self.data.List);
                
            //});

        });
    }

    // 载入数据
    function loadData(beginTime, endTime) {
        $.fxPost("B_OA_ScheduleSvc.data?action=GetData", { beginTime: beginTime, endTime: endTime, ScheduleType: null }, function (data) {
            //self.data = eval('(' + data.data + ')');
            self.data = data.data;
            models.gridModel.show(root.find('[data-role="ScheduleGrid"]'), self.data.List);
        });

    }


    // 保存数据
    function saveData(lawData, win, callback) {
        if (lawData == null || lawData == "") return;
        var content = JSON.stringify(lawData);
        var msg = "";
        if (lawData.ScheduleName == null || $.trim(lawData.ScheduleName) == "") msg += "\n日程名称不能空！"
        if (lawData.Leader == null || $.trim(lawData.Leader) == "") msg += "\n办事人不能空！"
        if (lawData.Place == null || $.trim(lawData.Place) == "") msg += "\n地点不能空！"
        if (lawData.ScheduleTime == null || $.trim(lawData.ScheduleTime) == "") msg += "\n日程时间不能空！"
        if (msg != "") {   $.Com.showMsg(msg); return; }
        $.post('B_OA_ScheduleSvc.data?action=SaveData', { JsonData: content, userName: parent.$.iwf.userinfo.CnName }, function (res) {
            var json = eval('(' + res + ')')
            if (json.success) {
                lawData.ScheduleId = json.data.ScheduleId;
                callback(lawData);
                win.close();
            }
            else {
                  $.Com.showMsg(json.msg);
            }
            
        });
    }


    //显示弹窗
    function showDetail(item, callback) {
        var detailmodel = $.Com.FormModel({

        });
        var dlgOpts = {
            title: '编辑页面', width: 800, height: 700,
            button: [
           {
               text: '保存', handler: function (data) {
                   var da = detailmodel.getData();
                   saveData(da,win, callback);
                   
               }
           },
          {
              text: '取消', handler: function () { win.close(); }
          }
            ]
        };

        //数据、保存回调、模块、html模板、选项
        var win = $.Com.showFormWin(item, function () {
            //// 确定保存数据
            //var data = detailmodel.getData();
            //saveData(data);
            
        }, detailmodel, root.find("[data-id='editSchedule']"), dlgOpts);

    }


};





