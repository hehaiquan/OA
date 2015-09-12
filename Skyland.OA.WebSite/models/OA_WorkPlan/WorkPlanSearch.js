$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'WorkPlanSearch' };
    this.show = function (module, root) {
        $.Biz.WorkPlanSearch.show(module, root);
    }
});



$.Biz.WorkPlanSearch = new function () {
    var self = this;
    var root;
    self.data = null;
    var models = {};
    //基本信息模
    models.searchDiv = $.Com.FormModel({
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) {
        },
        //数据合法性验证，返回false则不会提交
        beforeSave: function (vm, root) {
            return true;
        },
        afterBind: function (vm, root) { }
    });

    models.gridModel = $.Com.GridModel({
        keyColumns: "id",//主键字段
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) {
        },
        edit: function (item, callback) { },
        remove: function (row) { },
        elementsCount: 10  //分页,默认5
    });



    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/OA_WorkPlan/WorkPlanSearch.html", function () {
            models.searchDiv.show(root.find("[data-id='searchDiv']"), { name:null,dept:null,datetime: null, datetime1: null });
            models.gridModel.show(root.find('[data-role="listGrid"]'), []);
            //查询
            root.find("[data-id='searchBn']").bind("click", function () {
                var where = "1=1 ";
                var name = $.trim(root.find("[data-id='name']").val());
                if (name != "") where += " and userName='" + name + "' ";
                var dept = $.trim(root.find("[data-id='dept']").val());
                if (dept != "") where += " and deptName='" + dept + "' ";
                var startTime = $.trim(root.find("[data-id='beginText']").val());
                var endTime = $.trim(root.find("[data-id='endText']").val());
                if (startTime != "") where += " and convert(varchar(20),startTime,23)>='" + startTime + "' ";
                if (endTime != "") where += " and convert(varchar(20),endTime,23)<='" + endTime + "' ";
                loadData(where) // 载入数据 
            });


            var myDate = new Date();  //获取当前日期
            var date = myDate.getDate();//当前天数
            var startTime = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();
            myDate.setDate(date - 29);
            var endTime = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();
            //var where = "convert(varchar(20),startTime,23)>='" + endTime + "' ";
            //where += "and convert(varchar(20),endTime,23)<='" + startTime + "' ";
            var where = "1=1 ";
            loadData(where) // 载入数据 

        });
    }


    // 载入数据
    function loadData(where) {
        var par = {
            tablename: "B_OA_WorkPlan",
            showfield: "id,workPlanName,userid,userName,CONVERT(varchar(30),startTime,120) startTime,CONVERT(varchar(30),endTime,120) endTime,department,deptName,remark",
            where: where,
            order: "department,userName,startTime desc"
        }
        $.fxPost("UsedPhraseSvc.data?action=GetData", par, function (data) {
            data = eval('(' + data.data + ')')
            models.gridModel.show(root.find('[data-role="listGrid"]'), data);
        });
    }

};





