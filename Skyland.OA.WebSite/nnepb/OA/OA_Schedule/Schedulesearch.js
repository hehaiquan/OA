define(new function () {
    var self = this;
    var root;
    self.data = null;
    var models = {};
    var ScheduleType = "领导"
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
                    myDate.setDate(date + d);
                    return myDate.getDate();
                }
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
        },
        afterBind: function (vm, root) { }
    });

    models.gridModel = $.Com.GridModel({
        keyColumns: "ScheduleId",//主键字段
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) {
        },
        edit: function (item, callback) { },
        remove: function (row) {

        },
        elementsCount: 10  //分页,默认5
    });



    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;


        root.load("models/OA_Schedule/Schedulesearch.html", function () {

            models.searchDiv.show(root.find("[data-id='searchDiv']"), { datetime: null, datetime1: null });

            //最近七天
            root.find("[data-id='zjqt']").bind("click", function () {
                //var myDate = new Date();  //获取当前日期
                //var date = myDate.getDate();//当前天数
                //var beginTime = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();//开始时间
                //myDate.setDate(date + 6);//最近七天
                //var endTime = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();//结束时间
                //loadData(beginTime, endTime);// 载入数据

                searchData(6);//最近七天
            });
            //最近一个月
            root.find("[data-id='zjygy']").bind("click", function () {
                searchData(29);//最近一个月
            });

            //查询
            root.find("[data-id='searchBn']").bind("click", function () {
                loadData($.trim(root.find("[data-id='beginText']").val()), $.trim(root.find("[data-id='endText']").val()));// 载入数据 
            });


            searchData(6);//最近七天

        });
    }

    function searchData(dates) {
        var myDate = new Date();  //获取当前日期
        var date = myDate.getDate();//当前天数
        var beginTime = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();//开始时间
        myDate.setDate(date + dates);
        var endTime = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();//结束时间
        loadData(beginTime, endTime);// 载入数据    
    }

    // 载入数据
    function loadData(beginTime, endTime) {
        $.fxPost("B_OA_ScheduleSvc.data?action=GetData", { beginTime: beginTime, endTime: endTime, ScheduleType: ScheduleType }, function (data) {
            //self.data = eval('(' + data.data + ')');
            self.data = data.data;
            models.gridModel.show(root.find('[data-role="ScheduleGrid"]'), self.data.List);

        });

    }
});






