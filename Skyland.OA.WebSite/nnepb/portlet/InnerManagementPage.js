define(new function () {
    var me = this;
    me.data = null;
    this.options = { key: 'InnerManagement' };
    var models = {}

    this.show = function (module, root) {
        if (root.children().length == 0) {
            root.load("nnepb/portlet/InnerManagementPage.html", function () {
                root.css({ 'paddingTop': '5px' });

                ViewChoiceFromInnerManagePage = function (type) {
                    $.fxPost('DocumentCenterSvc.data?action=GetFiletypeByFileTypeName', { documentType: type }, function (res) {
                        if (!res.success) {
                              $.Com.showMsg(res.msg);
                            return;
                        }
                        var dataModel = res.data;
                        $.Biz.documentCenter.fileType = dataModel.fileTypeModel;
                        $.Biz.documentCenter.type = 'view';
                        if ($.Biz.documentCenter.isInitial) {
                            $.Biz.documentCenter.viewData();
                        }
                        $.iwf.onmodulechange('dc.documentCenter:{title:"文档中心"}');
                    })
                }

                var DataListDiv = root.find("[data-id='MyInnerManagementList']");
                var divHtml = "";
                //divHtml += "<tr >";
                //divHtml += "<td><span style='line-height: 30px; color: #000000;'>&nbsp;&nbsp;</span><a href='#'><span class='more'>更多>></span></a></td>";
                //divHtml += "</tr>";

                divHtml += "<tr style='cursor: pointer'>";
                divHtml += "<td><a style='line-height: 30px; color: #000000;'  onclick=ViewChoiceFromInnerManagePage('计划总结')>计划总结</a><span style='line-height: 30px;float: right; color: gray'></span></td>";
                divHtml += "</tr>";

                divHtml += "<tr style='cursor: pointer'>";
                divHtml += "<td><a style='line-height: 30px; color: #000000;'  onclick=ViewChoiceFromInnerManagePage('规章制度')>规章制度</a><span style='line-height: 30px;float: right; color: gray'></span></td>";
                divHtml += "</tr>";

                divHtml += "<tr style='cursor: pointer'>";
                divHtml += "<td><a style='line-height: 30px; color: #000000;'  onclick=ViewChoiceFromInnerManagePage('值班管理')>值班管理</a><span style='line-height: 30px;float: right; color: gray'></span></td>";
                divHtml += "</tr>";

                divHtml += "<tr style='cursor: pointer'>";
                divHtml += "<td><a style='line-height: 30px; color: #000000;'  onclick=ViewChoiceFromInnerManagePage('资产管理')>资产管理</a><span style='line-height: 30px;float: right; color: gray'></span></td>";
                divHtml += "</tr>";

                divHtml = "<table width='100%' border='0' cellspacing='0' class=' table-hover table-condensed'>" + divHtml + "</table>";
                DataListDiv.append(divHtml);

                /*
                $.fxPost('B_OA_WorkPlanSvc.data?action=GetDoorData', { top: 5 }, function (res) {

                    if (!res.success) {
                          $.Com.showMsg(res.msg);
                        return;
                    }
                    //me.data = eval('(' + res + ')');
                    me.data = res.data;
                    //me.data = me.data.data;

                    WorkPlanRowclick = function (i) {
                        $.Biz.WorkPlanBrowseWin(me.data[i].id, function (data) { });
                    };

                    var url_dbx = "";
                    if (me.data.length > 0) {
                        url_dbx = 'index.html#m2.WorkPlanSearch:{title:"工作计划查询"}'; //工作计划查询      
                    }

                    var DataListDiv = root.find("[data-id='MyInnerManagementList']");
                    var divHtml = "";
                    divHtml += "<tr >";
                    divHtml += "<td><span style='line-height: 30px; color: #000000;'>&nbsp;&nbsp;</span><a href='" + url_dbx + "'><span class='more'>更多>></span></a></td>";
                    divHtml += "</tr>";
                    for (var i = 0; i < me.data.length; i++) {
                        divHtml += "<tr style='cursor: pointer' onclick=WorkPlanRowclick(" + i + ")>";
                        //divHtml += "<tr style='cursor: pointer'>";
                        divHtml += "<td><a style='line-height: 30px; color: #000000;'>" + me.data[i].workPlanName.overHide(52) + "</a><span style='line-height: 30px;float: right; color: gray'>" + me.data[i].userName + "</span></td>";
                        divHtml += "</tr>";
                    }
                    divHtml = "<table width='100%' border='0' cellspacing='0' class=' table-hover table-condensed'>" + divHtml + "</table>";
                    DataListDiv.append(divHtml);

                });
                */

            });
        }
    }

}());