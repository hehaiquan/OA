define(['nnepb/com/selectUser/win'],function (selectUser) {
    return function (wftool) {
        //$.Biz.B_OA_Travel = function () {

        var me = this;
        var root;
        var data;
        var models = {};

        this.options = {
            HtmlPath: "nnepb/oa/travel/travel.html",
            Url: "B_OA_TravelSvc.data"
            // Url: "../svr/oa/travel/"
        };

        //基本信息模
        models.baseInfo = $.Com.FormModel({
            //绑定前触发，在这里可以做绑定前的处理
            beforeBind: function (vm, root) {

            },
            //数据合法性验证，返回false则不会提交
            beforeSave: function (vm, root) {
                var msg = "";
                if (vm.traveler() == null || $.trim(vm.traveler()) == "") msg += "\n出差人不能空！"
                if (vm.travelDate() == null || $.trim(vm.travelDate()) == "") msg += "\n申请日期不能空！"
                if (msg != "") { $.Com.showMsg(msg); return false; }
                return true;
            },
            afterBind: function (vm, root) { }
        });

        //请假列表
        models.listGrid = $.Com.GridModel({
            beforeBind: function (vm, root) { },
            beforeSave: function (vm, root) {
                return true;
            },
            remove: function (item, callback) {
            },
            keyColumns: "id",//主键字段
        });

        this.show = function (formdiv, formdata, wftool) {
            if (formdiv) root = formdiv;
            data = formdata;
            models.baseInfo.show(root.find("[data-id='baseInfo']"), formdata.baseInfo);
            models.listGrid.show(root.find('[data-role="listGrid"]'), formdata.list);
            root.find("[data-id='AddSource']").click(function () {
                models.listGrid.viewModel.addRow(formdata.DetailEdit);
                setControlShowStatus(wftool);//设置控件显示状态
            });
            setControlShowStatus(wftool);//设置控件显示状态
        }

        this.getCacheData = function () {
            data.baseInfo = models.baseInfo.getCacheData();
            data.list = models.listGrid.getCacheData();
            return JSON.stringify(data);
        };
        this.cacheData = data;
        this.getData = function () {
            var baseInfo = models.baseInfo.getData();
            var list = models.listGrid.getData();
            if (baseInfo != false && list != false)
                return JSON.stringify({
                    "baseInfo": baseInfo,
                    "list": list
                });
            else
                return false;
        };




        //设置控件显示状态
        function setControlShowStatus(wftool) {

            if (wftool.wfcase.actid == "A001") {
                root.find("[data-id='WF_RemarkBox']").hide();//隐藏评阅意见控件
            }
            //有权限时才显示确定按钮
            if (wftool.wfcase.actid != "A001") {

                root.find("[data-id='traveler']").attr("disabled", true)//将元素设置为disabled,禁用控件
                root.find("[data-id='travelerBn']").attr("disabled", true)//将元素设置为disabled,禁用控件
                var leaveDate = root.find("[data-id='travelDate']");
                leaveDate.attr("disabled", true)///时间禁用
                leaveDate.unbind("click"); //移除click事件 
                root.find("[data-id='reason']").attr("disabled", true)//将元素设置为disabled,禁用控件
                root.find("[data-id='remark']").attr("disabled", true)//将元素设置为disabled,禁用控件
                root.find("[data-id='AddSource']").attr("disabled", true)//将元素设置为disabled,禁用控件

                var leaveStartTime = root.find("[data-id='travelStartTime']");
                leaveStartTime.attr("disabled", true)///时间禁用
                leaveStartTime.unbind("click"); //移除click事件 
                var leaveEndTime = root.find("[data-id='travelEndTime']");
                leaveEndTime.attr("disabled", true)///时间禁用
                leaveEndTime.unbind("click"); //移除click事件 
                root.find("[data-id='totalDays']").attr("disabled", true)//将元素设置为disabled,禁用控件

                var remove = root.find("[data-id='remove']");
                remove.unbind("click"); //移除click事件 

            }
            if (wftool.wfcase.actid != "A004") {
                var leaveStartTime = root.find("[data-id='travelStartTime1_sj']");
                leaveStartTime.attr("disabled", true)///时间禁用
                leaveStartTime.unbind("click"); //移除click事件 
                var leaveEndTime = root.find("[data-id='travelEndTime1_sj']");
                leaveEndTime.attr("disabled", true)///时间禁用
                leaveEndTime.unbind("click"); //移除click事件 
                root.find("[data-id='totalDays1_sj']").attr("disabled", true)//将元素设置为disabled,禁用控件
            }

        }

    };
});

//$.Biz.B_OA_Travel.prototype.version = "1.0";



