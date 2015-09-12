//待办箱

define(function () {
    return new function () {

        var self = this;
        this.options = { key: 'doingcase', title: '待办箱' };
        //var caseData;
        var params = {};  //当前查询条件
        var gridRoot;

        function deleteCase() {
            if (!gvm.selectData) return

            $.Com.confirm("你决定删除[ " + gvm.selectData.Name + " ]业务吗？", function () {
                var obj = {
                    guid: gvm.selectData.guid,
                    flowid: gvm.selectData.FlowID,
                    caseid: gvm.selectData.ID
                }
                if (!obj.caseid) {
                    $.fxPost("IWorkDraftManage.data?action=DeleteDraft", obj, function () {
                        $.Com.showMsg("草稿删除成功");
                        gvm.selectData = null;
                        self.search();
                    });
                }
                else {
                    $.fxPost("frameopen.data?action=deletecase", obj, function (json) {
                        $.Com.showMsg(json.msg);
                        jQuery.iwf.onmoduleclose(gvm.selectData.ID);
                        gvm.selectData = null;
                        self.search();
                    });
                }
            });
        }

        function stopCase() {
            if (!gvm.selectData) return
            var obj = {
                guid: gvm.selectData.guid,
                flowid: gvm.selectData.FlowID,
                caseid: gvm.selectData.ID,
                baid: gvm.selectData.BAID
            }
            if (!obj.caseid) {
                $.Com.showMsg("业务还没有创建！");
                return;
            }
            $.Com.confirm("你决定停办[ " + gvm.selectData.Name + " ]业务吗？", function () {
                $.Com.prompt(function (data) {
                    obj.remark = data;
                    $.fxPost("frameopen.data?action=stopcase", obj, function (json) {
                        $.Com.showMsg(json.msg);
                        gvm.selectData = null;
                        self.search();
                    });
                }, "停办意见");

            });
        }

        function resumeCase() {
            if (!gvm.selectData) return
            var obj = {
                guid: gvm.selectData.guid,
                flowid: gvm.selectData.FlowID,
                caseid: gvm.selectData.ID,
                baid: gvm.selectData.BAID
            }
            if (obj.state == "STOP") {
                $.Com.showMsg("业务还没有被停用！");
                return;
            }
            $.Com.confirm("你决定恢复[ " + gvm.selectData.Name + " ]业务办理吗？", function () {
                $.Com.prompt(function (data) {
                    obj.remark = data;
                    $.fxPost("frameopen.data?action=resumecase", obj, function (json) {
                        $.Com.showMsg(json.msg);
                        gvm.selectData = null;
                        self.search();
                    });
                }, "恢复办理意见");

            });
        }

        function sendtoOther() {
            if (!gvm.selectData) return
            var obj = {
                guid: gvm.selectData.guid,
                flowid: gvm.selectData.FlowID,
                caseid: gvm.selectData.ID,
                baid: gvm.selectData.BAID
            }
            $.Com.showMsg("功能还未实现！");
        }



        var gvm = {
            htmlUrl: "fx/com/wf/doingcase.html",
            rowclick: function (sender, data) {
                gvm.selectData = data;
            },
            linkclick: function (sender, data) {
                var wfcase = {
                    caseid: data.ID,
                    baid: data.BAID,
                    flowid: data.FlowID,
                    title: data.Name,
                    actid: data.ActID,
                    guid: data.guid
                };
                wfcase.state = "doingcase";
                var key = data.ID || data.guid;
                $.iwf.onmodulechange(key + ".fx/com/wf/form:" + JSON.stringify(wfcase));
            },
            fn: {
                myName: '当前在办',
                changeyyyyMMdd: $.Com.formatDate,
                GetTrclass: function (item) {
                    var cssclass = "";
                    if (!item.isreaded) cssclass = "unreaded ";
                    var Remaindays = item.Remaindays;
                    if (Remaindays == null) return cssclass;
                    if (Remaindays > 7) return cssclass;
                    if (Remaindays > 5) return cssclass + "active";
                    if (Remaindays > 3) return cssclass + "success";
                    if (Remaindays > 0) return cssclass + "warning";
                    if (Remaindays <= 0) return cssclass + "danger";
                    return "";
                },
                GetIcon: function (item) {
                    if (item.descript.indexOf('草稿') == 0) return "fa fa-pencil text-muted fa-lg"

                    //var Remaindays = item.Remaindays;
                    //if (Remaindays == null) return "fa-check-circle-o ";
                    ////  if (Remaindays > 7) return "fa-check";
                    //if (Remaindays > 5) return "fa-check";
                    //if (Remaindays > 3) return "fa-exclamation";
                    //if (Remaindays > 0) return "fa-exclamation-triangle";
                    //if (Remaindays <= 0) return "fa-frown-o";
                    return "";
                },
                dateChange: function (n) {
                    return n;
                }
            }
        };

        //加载数据并初始化子项以及grid
        function initGrid() {
            if ($.iwf.caseData == undefined) {
                $.fxPost("engine.data?action=Querymycase", {}, function (data) {
                    $.iwf.caseData = data;
                    getInboxTypes();
                    if (gridRoot) RefreshGrid();
                });
            } else {
                if (gridRoot) RefreshGrid();
            }
        }

        //根据查询参数刷新grid
        function RefreshGrid() {
            var showData = [];

            $.each($.iwf.caseData, function (i, items) {
                var arr = items.children.FindAll(function (ent) {


                    var flag1 = true;
                    var flag2 = true;
                    var flag3 = true;

                    if (params.Acts) {
                        flag1 = false;
                        for (var k in params) {
                            if (k == ent.FlowID && (params[k] == ent.ActID || params[k] == '')) flag1 = true;
                        }
                    }
                    else {
                        if (params.FlowID && ent.FlowID != params.FlowID) flag1 = false;
                        if (params.ActID && ent.ActID != params.ActID) flag2 = false;
                    }
                    if (!params.keyword) flag3 = true;
                    else {
                        if (ent.Name.indexOf($.trim(params.keyword)) == -1) flag3 = false;
                    }
                    return flag1 && flag2 && flag3;
                });
                var g = { text: items.text, children: arr, count: arr.length };
                if (g.children.length > 0) showData.push(g);
            });
            gvm.data = showData;
            gridRoot.iwfGrid(gvm);
        }

        //lyq的逻辑函数
        function getInboxTypes() {
            if (appConfig.doingCaseConfig == undefined) return;
            if (appConfig.doingCaseConfig.length == 0) return;

            var casecount = 0;

            function toObject(json, pro0, pro1, o, typs2, pro3, pro4) {
                // var o = {};

                for (var i = 0, j = json.length; i < j; i = i + 1) {
                    casecount++;
                    var pronew = json[i][pro0] + json[i][pro1];
                    if (o[pronew])
                        o[pronew] = o[pronew] + 1;
                    else {
                        o[pronew] = 1;
                        typs2[pronew] = { 'FlowName': json[i][pro3], 'ActName': json[i][pro4], 'FlowID': json[i][pro0], 'ActID': json[i][pro1] };
                    }
                }
                //return o;
            };

            var typs = {}; //所有值的数量
            var typs2 = {};//所有值的属性

            $.each($.iwf.caseData, function (i, items) {
                toObject(items.children, 'FlowID', 'ActID', typs, typs2, 'FlowName', 'ActName');
            });


            var doingcaseTypes = [];
            var i = 0
            $.each(appConfig.doingCaseConfig, function (index, item) {
                if (item.url == undefined || item.url == '') {
                    if (item.Acts) {
                        var tt = { Acts: item.Acts.length };
                        for (var j = 0; j < item.Acts.length; j++) {
                            tt[item.Acts[j].FlowID] = (item.Acts[j].ActID) ? item.Acts[j].ActID : '';
                        }
                        item.url = 'fx/com/wf/doingcase:' + JSON.stringify(tt);
                    }
                    else
                        item.url = 'fx/com/wf/doingcase:' + JSON.stringify({ FlowID: item.FlowID, ActID: item.ActID });
                }

                var count = 0;// 如果没有设定步骤，合计这个流程的全部步骤的合计数;
                for (i in typs) {

                    //如果是多个步骤合并
                    if (item.Acts && item.Acts.length > 1) {
                        for (var j = 0; j < item.Acts.length; j++) {
                            if (typs2[i].FlowID == item.Acts[j].FlowID) {
                                if (item.Acts[j].ActID) {
                                    if (typs2[i].ActID == item.Acts[j].ActID) {
                                        count += typs[i];
                                        typs[i] = 0;
                                        break;
                                    }
                                }
                                else {
                                    count += typs[i];
                                    typs[i] = 0;
                                }
                            }
                        }
                    }
                    else {
                        if (typs2[i].FlowID == item.FlowID) {
                            //单业务单步骤
                            if (item.ActID) {
                                if (typs2[i].ActID == item.ActID) {
                                    if (item.text == undefined || item.text == '') item.text = typs2[i].FlowName + ' ' + typs2[i].ActName;
                                    if (item.title == undefined || item.title == '') item.title = item.text
                                    doingcaseTypes.push({ id: 'doingcase__' + item.FlowID + item.ActID, text: item.text, count: typs[i], title: item.title, url: item.url });
                                    typs[i] = 0;
                                    return true;
                                }
                            }
                            else {
                                count += typs[i];
                                typs[i] = 0;
                            }
                        }
                    }
                }

                if (count > 0) {
                    //单业务
                    if (item.text == undefined || item.text == '') item.text = typs2[i].FlowName;
                    if (item.title == undefined || item.title == '') item.title = item.text
                    doingcaseTypes.push({ id: 'doingcase__' + ((item.Acts) ? item.id : item.FlowID), text: item.text, count: count, title: item.title, url: item.url });
                } else if (item.always) {
                    //一直显示
                    if (item.title == undefined || item.title == '') item.title = item.text
                    doingcaseTypes.push({ id: 'doingcase__' + item.FlowID, text: item.text, title: item.title, url: item.url });
                }


            });
            //没有定义的分箱也要显示出来
            //修改为默认按业务分组，而不按节点
            var actscount = 0;
            var flowcase = {};
            for (i in typs) {
                if (typs[i] > 0) {
                    //var item = {
                    //    text: typs2[i].FlowName + ' ' + typs2[i].ActName,
                    //    title: typs2[i].FlowName + '-- ' + typs2[i].ActName,
                    //    url: 'fx/com/wf/doingcase:' + JSON.stringify({ FlowID: typs2[i].FlowID, ActID: typs2[i].ActID })
                    //};
                    //doingcaseTypes.push({ id: 'doingCase__' + typs2[i].FlowID + typs2[i].ActID, text: item.text, count: typs[i], title: item.title, url: item.url });
                    //typs[i] = 0;

                    if (flowcase[typs2[i].FlowID]) {
                        flowcase[typs2[i].FlowID].count += typs[i];
                        flowcase[typs2[i].FlowID].acts++;
                    } else {
                        flowcase[typs2[i].FlowID] = {
                            id: 'doingCase__' + typs2[i].FlowID,
                            text: typs2[i].FlowName,
                            title: typs2[i].FlowName,
                            url: 'fx/com/wf/doingcase:{',// + JSON.stringify({ FlowID: typs2[i].FlowID }),  //Acts: [{ "FlowID": "W000001", "ActID": "A003" }, { "FlowID": "W000003", "ActID": "A001" }, { "FlowID": "W000006", "ActID": "A002" }],
                            count: typs[i],
                            acts: 1
                        };
                    }
                    actscount++;
                    flowcase[typs2[i].FlowID].url += '"' + typs2[i].FlowID + '":"' + typs2[i].ActID + '",';
                    typs[i] = 0;
                }
            }

            for (i in flowcase) {
                flowcase[i].url += '"acts":' + flowcase[i].acts + '}';
                doingcaseTypes.push(flowcase[i]);
            }



            if ($.iwf.left && $.iwf.left.initInbox) $.iwf.left.initInbox(doingcaseTypes, casecount);

        }


        var FlowParams = null;

        this.search = function (keyword) {
            if (keyword) {
                params.keyword = keyword;
                RefreshGrid();
            } else {
                if ($.iwf.caseData) {
                    $.iwf.caseData = undefined;
                    //$.each($("#iwf-frame-main").children(), function (i, div) {
                    //    var $div = $(div);
                    //    if ($div.attr("model").indexOf("wf-doingcase") >= 0) {
                    //        if (gridRoot && $div.attr("model") != gridRoot.parents().attr("model")) $div.remove();
                    //    }
                    //});
                    for (var key in $.iwf.activeModels) {
                        if (key.indexOf("fx/com/wf/doingcase_") > 0 || key.indexOf("fx/com/wf/doingCase") > 0) {
                            var divkey = key.substring(key.indexOf('_')+1).replaceAll('/','-');
                            if (divkey != gridRoot.parents().attr("model")) {
                                $.iwf.activeModels[key] = undefined;
                                $("#iwf-frame-main").children('[model='+divkey+']').remove();
                            }

                        }
                    }
                }
                initGrid();//无参数就刷新整个待办箱
            }
        }

        if ($.iwf.searchDoingcase == undefined) $.iwf.searchDoingcase = self.search;

        function refreshCasebox() {
            self.search();
        }

        var toolData = [
{ title: '删除业务', text: '删除', iconCls: 'fa fa-trash-o', handler: deleteCase, cssClass: 'btn btn-danger' },
{ title: '停办业务', text: '停办', iconCls: 'fa fa-pause', handler: stopCase },
{ title: '恢复业务', text: '恢复', handler: resumeCase },
{ title: '委托办理', text: '委托', handler: sendtoOther },
{ title: '刷新', iconCls: 'fa fa-refresh', type: 'circle', "float": 'right', handler: refreshCasebox }
        ];

        this.show = function (module, root) {
            var json = module.params.replace(/"/g, "'");
            if (json != "") params = eval('({' + json + '})');

            if (root.children().length == 0) {
                if ($.iwf.online == false) toolData = [];//离线时的考虑
                $('<div data-id="doingcasetoolbar" class="pageTitle iwf-toolbar"> </div>').appendTo(root).iwfToolbar({ data: toolData });
                var CreateBtn = $('<button type="button" class="btn btn-primary dropdown-toggle"  style="float: left;"> <span class="fa fa-file "></span>   新建 <span class="caret"></span>  </button>');
                if ($.iwf.online == false) CreateBtn.hide();//离线时的考虑
                root.children().last().prepend(CreateBtn);
                gridRoot = root.append('<div  style="height:100%;" data-id="doingcasegrid"></div>').children().last();
                initGrid();

                $.iwf.getModel("fx/com/wf/newCase", function (model) {
                    model.show(CreateBtn, gridRoot);
                })
                //addNews(CreateBtn, gridRoot);
                gridRoot.height(gridRoot.parent().height() - 88);
            }
        }

        this.resize = function (w, h) {
            if (gridRoot) gridRoot.height(gridRoot.parent().height() - 88);
        }
    }
});