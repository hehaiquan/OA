

$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'myWorkLog' };
    this.show = function (module, root) {
        $.Biz.myWorkLog.show(module, root);
    }
});

$.Biz.myWorkLog = new function () {
    var self = this;
    var root;
    self.data = null;
    var data;
    var gridModel;
    var models = {};
    var searchData;

    //基本信息模
    models.searchDiv = $.Com.FormModel({
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) {
            vm._setName = function (d) {
                if (d == 0) {
                    return "今天";
                } else if (d == -1) {
                    return "昨天";
                }
                else {
                    var myDate = new Date();  //获取当前日期
                    var date = myDate.getDate();//当前天数
                  //  endtime(myDate);
                    myDate.setDate(date + d);

                    return myDate.getDate();
                }
            }

            vm._setWeek = function (d) {
            
                var myDate = new Date();
                var date = myDate.getDate();
                myDate.setDate(date + d);
                    var weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
                    var year = myDate.getFullYear();
                    var month = myDate.getMonth() + 1;
                    var day = myDate.getDate();
                    var week = weekDay[myDate.getDay()];
                    return week;
            }
            vm._search = function (d) {
                var myDate = new Date();  //获取当前日期
                var date = myDate.getDate();//当前天数
                myDate.setDate(date + d);
                var endTime = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();//时间
                loadData(endTime, endTime);// 载入数据 
            }
        },
        //数据合法性验证，返回false则不会提交
        beforeSave: function (vm, root) {
            return true;
        }
    });


    models.gridModel = $.Com.GridModel({
        keyColumns: "id",//主键字段
        //绑定前触发，在这里可以做绑定前的处理
        edit: function (item, callback) {
            if (item.logType == 1) {
                //浏览弹窗
                viewWimdows(item, callback);
            } else {
                //可编辑弹窗
                showWindows(item, callback);
            }
        },
        remove: function (row) {
            if (!confirm("确定要删除这条数据吗？")) return false;
            $.post("/B_WorkLogSvc.data?action=DeleteData", { id: row.id }, function (res) {
                var data = eval('(' + res + ')');
                if (!data.success) {
                      $.Com.showMsg(data.msg);
                    loadData('', '');
                }
            })
        },
        elementsCount: 10  //分页,默认5
    });

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;

        var userInform = parent.$.iwf.userinfo.CnName;

        root.load("models/WorkLog/MyWorkLog.html", function () {

            models.searchDiv.show(root.find("[data-id='searchDiv']"), { datetime: null, datetime1: null });
            loadData("", "");

            //添加
            root.find("[data-id='AddBn']").bind("click", function () {
                self.data.baseInfo.createDate = "";
                showWindows(self.data.baseInfo);
            })

            //查询
            root.find("[data-id='searchBn']").bind("click", function () {
                loadData($.trim(root.find("[data-id='beginText']").val()), $.trim(root.find("[data-id='endText']").val()));// 载入数据 
            });

            //七天前
            root.find("[data-id='zjqt']").bind("click", function () {
                searchData(-6);//最近七天
            });

            //一个月前
            root.find("[data-id='zjygy']").bind("click", function () {
                searchData(-29);//最近一个月
            });
        })
    }

    // 载入数据
    function loadData(beginTime, endTime) {

        $.fxPost("B_WorkLogSvc.data?action=GetData", { beginTime: beginTime, endTime: endTime,workLogType:"1"}, function (ret) {
            self.data = ret.data;
            if (ret.data) {
                models.gridModel.show(root.find('[data-role="workLogList"]'), ret.data.List);
            }
        });
    }
    //弹窗---未暂存
    function showWindows(item) {

         models.detailmodel = $.Com.FormModel({

        });
        var dlgOpts = {
            title: '编辑页面', width: 800, height: 700,
            button: [
           {
               text: '提交', handler: function (data) {
                   var da = models.detailmodel.getData();
                   da.logType = 1;
                   saveData(da, win);
               }
           },
          {
              text: '暂存', handler: function (data) {
                  var da = models.detailmodel.getData();
                  da.logType = 0;
                  saveData(da, win);
              }
          },
          {
              text: '取消', handler: function () {
                  win.close();
              }
          }
            ]
        };

        var win = $.Com.showFormWin(item, function () {
        }, models.detailmodel, root.find("[data-id='editMyWorkLog']"), dlgOpts);

    }

    //弹窗---已提交
    function viewWimdows(item) {
        models.detailmodel = $.Com.FormModel({

        });
        var dlgOpts = {
            title: '编辑页面', width: 800, height: 700,
            button: [
          {
              text: '取消', handler: function () {
                  win.close();
              }
          }
            ]
        };

        var win = $.Com.showFormWin(item, function () {
        }, models.detailmodel, root.find("[data-id='editMyWorkLog']"), dlgOpts);
    }

    //保存
    function saveData(lawData, win) {

        if (lawData.createDate == '' || lawData.createDate == null) {
              $.Com.showMsg("请选择日期！");
            return;
        }

        if (lawData.substance == '' || lawData.substance == null) {
              $.Com.showMsg("请填写内容！");
            return;
        }

        var content = JSON.stringify(lawData);
        var msg = "";
        $.post('B_WorkLogSvc.data?action=SaveData', { JsonData: content,workLogType:"1"}, function (res) {
            var json = eval('(' + res + ')')
            if (json.success) {
                win.close();
                  $.Com.showMsg(json.msg);
            }
            else {
                  $.Com.showMsg(json.msg);
            }
            //刷新
            loadData('', '');
        })
    }

    function searchData(dates) {
        var myDate = new Date();  //获取当前日期
        var date = myDate.getDate();//当前天数
        var beginTime = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();//开始时间
        myDate.setDate(date + dates);
        var endTime = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();//结束时间
        if (dates < 0) {
            loadData(endTime, beginTime);// 载入数据    

        } else {
            loadData(beginTime, endTime);// 载入数据    

        }
    }
}