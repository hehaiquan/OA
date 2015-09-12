
$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'meetingroom' };
    this.show = function (module, root) {
        $.Biz.meetingroom.show(module, root);
    };
});

$.Biz.meetingroom = new function () {
    var root;
    var models = {};
    var meetingroomModel;//会议空model，用于添加
    //表格Model
    models.gridModel = $.Com.GridModel({
        beforeBind: function (vm, _root) {
        },
        beforeSave: function(vm, root) {
            var msg = "";
            if (vm.MeetingRoomName() == null || $.trim(vm.MeetingRoomName()) == "") msg += "\n会议室名称不能为空！";
            if (msg != "") {   $.Com.showMsg(msg); return false; }
            return true;
        },
        elementsCount: 10,
        edit: function (item, callback) {
            editMeetingroomform(item);
        }
        , remove: function (row) {
        }
        , keyColumns: "MeetingRoomID"


    });

    function loadData() {
        $.fxPost("/B_OA_MeetingRoomSvc.data?action=GetData", {}, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
            if (ret.data.dataList) {
                data = ret.data;
                meetingroomModel = data.editData;
                models.gridModel.show(root.find("[data-id='meetingroomTableGrid']"), data.dataList);
            }
        })
    }

    function saveData(data, win) {
        var re = /^[0-9]+[0-9]*$/;   //判断字符串是否为数字
        var msg = "";
        if (data == null || data == "")
            return false;
        if (data.MeetingRoomName == null || data.MeetingRoomName == "")
            msg += "\n会议室名称不能为空";
        if (!re.test(data.Number))
            msg += "\n请输入正确的容纳人数值";
        else {
            if (parseInt(data.Number) <= 0)
                msg += "\n容纳人数必须大于 0";
        }
        if (msg != "") {
              $.Com.showMsg(msg);
            return false;
        }
        var json = JSON.stringify(data);
        $.fxPost("/B_OA_MeetingRoomSvc.data?action=Save", { JsonData: json }, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
            if (ret) {
                  $.Com.showMsg(ret.msg);
                win.close();
                loadData();
            }
        })
    }
    
    function editMeetingroomform(item) {
        //会议Model
        models.MeetingroomFormModel = $.Com.FormModel({});

        var dlgOpts = {
            title: '会议室添加', width: 800, height: 700,
            button: [
           {
               text: '保存', handler: function (data) {
                   var da = models.MeetingroomFormModel.getData();
                   saveData(da, win);
               }
           },
          {
              text: '取消', handler: function () { win.close(); }
          }]
        };
        var win = $.Com.showFormWin(item, function () {
        }, models.MeetingroomFormModel, root.find("[data-id='editMeetingroom']"), dlgOpts);
    }

    //删除数据
    function DeleteDateList(list) {
        var json = JSON.stringify(list);

        //传入后台保存
        $.fxPost("/B_OA_MeetingRoomSvc.data?action=DeleteData", { JsonData: json }, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
            loadData();//加载刷新数据
            });
    }
    
    this.show = function (module, _root) {
        $.Biz.meetingroom.isInitial = true;
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/MeetingManage/MeetingRoom.html", function () {
            loadData();

            //删除
            root.find("[data-id='deleteBtn']").bind("click", function () {
                var deleteList = [];
                var cacheData = models.gridModel.getCacheData().data;//取出表中改变的字段.
                for (var i = 0; i < cacheData.length; i++) {
                    if (cacheData[i].isCheck == true) {
                        deleteList.push(cacheData[i]);
                    }
                }
                if (deleteList.length > 0) {
                    if (!confirm("确定要删除吗？")) {
                         return false;
                    }
                    DeleteDateList(deleteList);
                } else {
                      $.Com.showMsg("没有选中数据行");
                    return false;
                }
            });

            //新增
            root.find("[data-id='addNewBtn']").bind("click", function () {
                editMeetingroomform(meetingroomModel);
            });
        });
    }
}