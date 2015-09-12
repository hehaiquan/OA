define(new function () {
    var me = this;
    me.data = null;
    this.options = { key: 'MyAdminOffice' };
    var models = {}

    this.show = function (module, root) {
        if (root.children().length == 0) {
            //
            $("<div>行政办公</div>").appendTo(root)
            $("<div></div>").appendTo(root).load("nnepb/portlet/MyAdminOfficePage.html", function () {
                root.css({ 'paddingTop': '5px' });
                // me.data = [];


                ViewChoiceFromMyAdminOffice = function (type) {
                    if (type == '局领导传阅') {
                        $.fxPost('DocumentCenterSvc.data?action=GetFiletypeByFileTypeName', { documentType: "局领导传阅" }, function (res) {
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
                    } else if (type == '领导日程') {
                        $.iwf.onmodulechange('m2.Schedulesearch:{title:"领导日程查询"}');
                    } else if (type == '发文管理') {
                        $.iwf.onmodulechange('searchdatamodule.oasenddocsearch:{title:"发文查询"}');

                    } else if (type == '收文管理') {
                        $.iwf.onmodulechange('searchdatamodule.oareceivedocsearch:{title:"收文查询"}');
                    }
                }

                var DataListDiv = root.find("[data-id='MyAdminOfficeList']");
                var divHtml = "";
                //divHtml += "<tr >";
                //divHtml += "<td><span style='line-height: 30px; color: #000000;'>&nbsp;&nbsp;</span><a href='#'><span class='more'>更多>></span></a></td>";
                //divHtml += "</tr>";

                divHtml += "<tr style='cursor: pointer'";
                divHtml += "<td><a style='line-height: 30px; color: #000000;' onclick=ViewChoiceFromMyAdminOffice('局领导传阅')>局领导传阅</a><span style='line-height: 30px;float: right; color: gray'></span></td>";
                divHtml += "</tr>";

                divHtml += "<tr style='cursor: pointer'";
                divHtml += "<td><a style='line-height: 30px; color: #000000;' onclick=ViewChoiceFromMyAdminOffice('领导日程')>领导日程</a><span style='line-height: 30px;float: right; color: gray'></span></td>";
                divHtml += "</tr>";

                divHtml += "<tr style='cursor: pointer'";
                divHtml += "<td><a style='line-height: 30px; color: #000000;' onclick=ViewChoiceFromMyAdminOffice('发文管理') >发文管理</a><span style='line-height: 30px;float: right; color: gray'></span></td>";
                divHtml += "</tr>";

                divHtml += "<tr style='cursor: pointer'";
                divHtml += "<td><a style='line-height: 30px; color: #000000;' onclick=ViewChoiceFromMyAdminOffice('收文管理')>收文管理</a><span style='line-height: 30px;float: right; color: gray'></span></td>";
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

                    var DataListDiv = root.find("[data-id='MyAdminOfficeList']");
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

            //
            $("<div>内部管理</div>").appendTo(root)
            $("<div></div>").appendTo(root).load("nnepb/portlet/InnerManagementPage.html", function () {
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
            //
            $("<div>专题简报</div>").appendTo(root)
            $("<div></div>").appendTo(root).load("nnepb/portlet/SpecialBriefing.html", function () {
                root.css({ 'paddingTop': '5px' });

                ViewChoiceFromSpecialBriefing = function (type) {
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

                var DataListDiv = root.find("[data-id='SpecialBreifingList']");
                var divHtml = "";
                //divHtml += "<tr >";
                //divHtml += "<td><span style='line-height: 30px; color: #000000;'>&nbsp;&nbsp;</span><a href='#'><span class='more'>更多>></span></a></td>";
                //divHtml += "</tr>";

                divHtml += "<tr style='cursor: pointer'>";
                divHtml += "<td><a style='line-height: 30px; color: #000000;'  onclick=ViewChoiceFromSpecialBriefing('减排')>减排</a><span style='line-height: 30px;float: right; color: gray'></span></td>";
                divHtml += "</tr>";

                divHtml += "<tr style='cursor: pointer'>";
                divHtml += "<td><a style='line-height: 30px; color: #000000;'  onclick=ViewChoiceFromSpecialBriefing('污染源普查')>污染源普查</a><span style='line-height: 30px;float: right; color: gray'></span></td>";
                divHtml += "</tr>";

                divHtml += "<tr style='cursor: pointer'>";
                divHtml += "<td><a style='line-height: 30px; color: #000000;'  onclick=ViewChoiceFromSpecialBriefing('环保专项行动')>环保专项行动</a><span style='line-height: 30px;float: right; color: gray'></span></td>";
                divHtml += "</tr>";

                divHtml += "<tr style='cursor: pointer'>";
                divHtml += "<td><a style='line-height: 30px; color: #000000;'  onclick=ViewChoiceFromSpecialBriefing('环境检测简报')>环境检测简报</a><span style='line-height: 30px;float: right; color: gray'></span></td>";
                divHtml += "</tr>";

                divHtml = "<table width='100%' border='0' cellspacing='0' class=' table-hover table-condensed'>" + divHtml + "</table>";
                DataListDiv.append(divHtml);

            })
            //
            $("<div>文件资料</div>").appendTo(root)
            $("<div></div>").appendTo(root).load("nnepb/portlet/Literature.html", function () {
                root.css({ 'paddingTop': '5px' });

                ViewChoiceFromLiterature = function (type) {
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

                var DataListDiv = root.find("[data-id='LitertureList']");
                var divHtml = "";
                //divHtml += "<tr >";
                //divHtml += "<td><span style='line-height: 30px; color: #000000;'>&nbsp;&nbsp;</span><a href='#'><span class='more'>更多>></span></a></td>";
                //divHtml += "</tr>";

                divHtml += "<tr style='cursor: pointer'>";
                divHtml += "<td><a style='line-height: 30px; color: #000000;'  onclick=ViewChoiceFromLiterature('领导讲话')>领导讲话</a><span style='line-height: 30px;float: right; color: gray'></span></td>";
                divHtml += "</tr>";

                divHtml += "<tr style='cursor: pointer'>";
                divHtml += "<td><a style='line-height: 30px; color: #000000;'  onclick=ViewChoiceFromLiterature('环保大事记')>环保大事记</a><span style='line-height: 30px;float: right; color: gray'></span></td>";
                divHtml += "</tr>";

                divHtml += "<tr style='cursor: pointer'>";
                divHtml += "<td><a style='line-height: 30px; color: #000000;'  onclick=ViewChoiceFromLiterature('环保年鉴')>环保年鉴</a><span style='line-height: 30px;float: right; color: gray'></span></td>";
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