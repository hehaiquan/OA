$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'hpzjxmtj' };// 环评专家项目审批统计
    this.show = function (moduel, root) {
        $.Biz.hpzjxmtjStaticPage.show(moduel, root);
    };
});


$.Biz.hpzjxmtjStaticPage = new function () {
    var self = this;
    var root;
    self.data = null;
    var models = {};

    models.gridModel = $.Com.GridModel({
        keyColumns: "id",//主键字段
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) {
            vm.showYw = function (ID) {
                var hostUrl = window.location.host;
                $.iwf.getModel("formmodel").opencase({ 'caseid': ID });
            }
        },
        edit: function (item, callback) { },
        remove: function (row) { },
        elementsCount: 10  //分页,默认5
    });



    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/Static/hpzjxmtjStaticPage.html", function () {
            var where = "";
            loadData(where) // 载入数据 

        });
    }


    // 载入数据
    function loadData(where) {

        $.fxPost("StaticSvc.data?action=StaticExpertsXM", {}, function (data) {
           // data = eval('(' + data.data + ')')
            models.gridModel.show(root.find('[data-role="listGrid"]'), data.data);
        });
    }

};





//环评单位视图
//alter view V_B_EIA_DocumentEvaluationMain
//as 
//select a.*,b.*,e.* from (select * from FX_WorkFlowCase where FlowID='W000072') as a
//left join B_EIA_DocumentEvaluationMain as b on a.ID=b.workflowcaseid
//left join (
//select c.CaseID,c.BAID,c.ActName,c.ActID,c.UserID,c.UserName from FX_WorkFlowBusAct as c 
//inner join (select CaseID,MAX(BAID) as BAID from FX_WorkFlowBusAct group by CaseID) as d
// on(c.CaseID=d.CaseID and c.BAID=d.BAID) 
//) as e 
//on e.CaseID=a.id




////建投项目视图
//alter view V_B_CP_ExamApprovalMain
//as 
//select a.ID as mianid,Name,FlowID,FlowName,CreateDate,Creater,CreaterCnName,IsEnd,b.*,e.* from (select * from FX_WorkFlowCase where FlowID='W000060') as a
//left join B_CP_ExamApprovalMain as b on a.ID=b.workflowcaseid
//left join (
//select c.CaseID,c.BAID,c.ActName,c.ActID,c.UserID,c.UserName from FX_WorkFlowBusAct as c 
//inner join (select CaseID,MAX(BAID) as BAID from FX_WorkFlowBusAct group by CaseID) as d
// on(c.CaseID=d.CaseID and c.BAID=d.BAID) 
//) as e 
//on e.CaseID=a.id