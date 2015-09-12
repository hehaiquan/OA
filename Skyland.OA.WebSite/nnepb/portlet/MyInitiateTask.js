define(new function () {
    var me = this;
    me.data = null;
    this.options = { key: 'MyInitiateTask' };
    var models = {}

    this.show = function (module, root) {
        if (root.children().length == 0) {
            root.load("nnepb/portlet/MyInitiateTask.html", function () {
                root.css({ 'paddingTop': '5px' });
                var par = {
                    tablename: "B_OA_TaskList",
                    showfield: "top 5 id,TaskName,userName",
                    where: "isWc='0' and CONVERT(varchar(30),startTime,23)>=(GETDATE()-30) and userName='" + parent.$.iwf.userinfo.CnName + "'",
                    order: "startTime desc"
                }

                $.fxPost("UsedPhraseSvc.data?action=GetData", par, function (res) {
                    me.data = eval('(' + res.data + ')');
                    InitiateTaskRowclick = function (i) {
                        $.Biz.InitiateTaskBrowseWin(me.data[i].id, function (data) { });
                    };

                    var url_dbx = "";
                    if (me.data.length > 0) {
                        url_dbx = 'index.html#m2.ManageTask:{title:"工作任务管理"}'; //工作任务管理      
                    }

                    var DataListDiv = root.find("[data-id='MyWorkPlanList']");
                    var divHtml = "";
                    //divHtml += "<tr >";
                    //divHtml += "<td><span style='line-height: 30px; color: #000000;'>&nbsp;&nbsp;</span><a href='" + url_dbx + "'><span class='more'>更多>></span></a></td>";
                    //divHtml += "</tr>";
                    for (var i = 0; i < me.data.length; i++) {
                        divHtml += "<tr style='cursor: pointer' onclick=InitiateTaskRowclick(" + i + ")>";
                        //divHtml += "<tr style='cursor: pointer'>";
                        divHtml += "<td><a style='line-height: 30px; color: #000000;'>" + me.data[i].TaskName.overHide(52) + "</a><span style='line-height: 30px;float: right; color: gray'>" + me.data[i].userName + "</span></td>";
                        divHtml += "</tr>";
                    }
                    divHtml = "<table width='100%' border='0' cellspacing='0' class=' table-hover table-condensed'>" + divHtml + "</table>";
                    DataListDiv.append(divHtml);

                });
            });
        }
    }

}());