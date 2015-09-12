define( function () {
    return new function () {
        var me = this;
        this.options = { key: 'endCase', title: '办结箱' };

        this.search = function (params) {
            //此处应为查询代码
        }

        if ($.iwf.searchEndcase == undefined) $.iwf.searchEndcase = this.search;

        var pagenum = 1;
        var pageOrderInfo = { field: "CreateDate", sord: "desc" }

        var endBoxGrid;

        this.show = function (module, root) {
            if (root.children().length > 0) return;
            root.css("overflow", "hidden");

            var opt = { fn: { changeyyyyMMdd: $.Com.formatDate } };

            root.load("fx/com/wf/endcase.html", function () {
                var FlowSelect = root.find("[iwftype=FlowType]");
                var QuickSearch = root.find("[iwftype=QuickSearch]");
                var AdvancedSearch = root.find("[iwftype=AdvancedSearch]");
                var PageInfo = root.find("[iwftype=pageinfo]");
                var PageDownBtn = root.find("[iwftype=pagedown]");
                var PageUpBtn = root.find("[iwftype=pageup]");
                var GoInput = root.find("[iwftype=GoInput]");
                var GoToBtn = root.find("[iwftype=GoTo]");
                var Tbody = root.find(".new-param-tmpl");
                var TMPL = Tbody.clone();
                //Tbody.empty();

                $.fxPost("engine.data?action=QueryAllModel", {}, function (data) {
                    FlowSelect.append('<option value="">=请选择流程类型=</option>')
                    $.each(data, function (index, ent) {
                        FlowSelect.append('<option value="' + ent.id + '">' + ent.name + '</option>')
                    });
                });

                QuickSearch.bind("click", function () {
                    refresh({
                        name: root.find("[iwftype=CaseName]").val(),
                        flowid: FlowSelect.val()
                    });
                });

                //高级检索
                AdvancedSearch.bind("click", function () {
                    var win = $.iwf.showWin({
                        title: '高级检索',
                        width: 600,
                        height: 500,
                        button: [
                            {
                                text: '确定', handler: function () {
                                    var obj = new Object();
                                    obj["name"] = win.content().find("[iwftype=CaseName]").val();
                                    obj["flowid"] = win.content().find("[iwftype=FlowType]").val();
                                    obj["CreateTime_From"] = win.content().find("[iwftype=CreateTime_From]").val();
                                    obj["CreateTime_To"] = win.content().find("[iwftype=CreateTime_To]").val();
                                    obj["EndTime_From"] = win.content().find("[iwftype=EndTime_From]").val();
                                    obj["EndTime_To"] = win.content().find("[iwftype=EndTime_To]").val();
                                    obj["CreaterName"] = win.content().find("[iwftype=CreaterName]").val();
                                    obj["EnderName"] = win.content().find("[iwftype=EnderName]").val();
                                    obj["DealTime_From"] = win.content().find("[iwftype=DealTime_From]").val();
                                    obj["DealTime_To"] = win.content().find("[iwftype=DealTime_To]").val();


                                    win.close();
                                    refresh(obj);
                                }
                            }, {
                                text: '取消', handler: function () {
                                    win.close();
                                }
                            }
                        ]
                    });


                    win.load("framework/addins/DonecaseModel/SearchChildWin.html", function () {
                        var dataInput = win.content().find("[data-id=datetimepick]");

                        dataInput.datetimepicker({
                            format: 'yyyy-MM-dd',
                            language: 'en',
                            showTime: false,
                            showHour: false,
                            showMinute: false,
                            timeFormat: '',
                            stepHour: 1,
                            stepMinute: 1,
                            stepSecond: 1
                        });
                        var SearchFlowSelect = win.content().find("[iwftype=FlowType]");
                        $.fxPost("engine.data?action=QueryAllModel", {}, function (data) {
                            SearchFlowSelect.append('<option value="">全部</option>')
                            $.each(data, function (index, ent) {
                                SearchFlowSelect.append('<option value="' + ent.id + '">' + ent.name + '</option>')
                            });
                        });
                    });
                });

                //排序
                root.find("[iwftype=iwfGridSort]").bind("click", function () {
                    var field = $(this).attr("field");
                    var obj = new Object();
                    obj.field = field;

                    if ($(this).data("sord") == undefined) { $(this).data("sord", "desc"); obj.sord = $(this).data("sord"); pageOrderInfo = obj; pagenum = 1; refresh(); return; }
                    if ($(this).data("sord") == "desc") { $(this).data("sord", "asc"); obj.sord = $(this).data("sord"); pageOrderInfo = obj; pagenum = 1; refresh(); return; }
                    if ($(this).data("sord") == "asc") { $(this).data("sord", "desc"); obj.sord = $(this).data("sord"); pageOrderInfo = obj; pagenum = 1; refresh(); return; }
                });

                var ToolBarDIV = root.find(".iwf-toolbar");
                var GridDIV = root.find("[iwftype=iwfGridDiv]");
                GridDIV.height(root.height() - ToolBarDIV.outerHeight());
                var GridHeaderDIV = root.find("[iwftype=iwfGridHeaderDiv]");
                var GridContentDIV = root.find("[iwftype=iwfGridContentDiv]");
                GridContentDIV.height(GridDIV.height() - GridHeaderDIV.outerHeight());

                GoInput[0].onkeyup = function () {
                    this.value = this.value.replace(/[^\d]/g, '');
                };
                GoInput[0].onbeforepaste = function () {
                    this.value = this.value.replace(/[^\d]/g, '');
                };

                GoToBtn.click(function () {
                    if (GoInput[0].value == null) return;
                    if (GoInput[0].value == "") return;
                    var value = parseInt(GoInput[0].value);
                    if (value < 1) value = 1;
                    if (value > pageOrderInfo.SumPages) value = pageOrderInfo.SumPages;
                    pagenum = value;
                    GoInput[0].value = "";
                    refresh();
                });
                PageDownBtn.click(function () {
                    pagenum = pagenum + 1;
                    if (pagenum > pageOrderInfo.SumPages) {
                        pagenum = pageOrderInfo.SumPages;
                        return;
                    }
                    refresh();
                });
                PageUpBtn.click(function () {
                    pagenum = pagenum - 1;
                    if (pagenum == 0) {
                        pagenum = 1;
                        return;
                    }
                    refresh();
                });

                var gvm = {
                    //htmlUrl: "fx/com/wf/doingcase.html",
                    rowclick: function (sender, data) {
                        //gvm.selectData = data;
                    },
                    linkclick: function (sender, data) {
                        var params = {
                            caseid: data.ID,
                            flowid: data.FlowID,
                            title: data.Name,
                            isend: true,
                            state: "endcase"
                        };

                        var key = data.ID || data.guid;
                        $.iwf.onmodulechange(key + ".fx/com/wf/form:" + JSON.stringify(params));
                    },
                    fn: {
                        myName: '办结箱',
                        changeyyyyMMdd: $.Com.formatDate
                        //GetIcon: function (item) {
                        //    if (item.Name.indexOf('草稿') == 0) return "fa fa-pencil text-muted fa-lg"
                        //    return "";
                        //},
                        //dateChange: function (n) {
                        //    return n;
                        //}
                    }
                };

                function refresh(extraParams) {

                    var obj = {
                        page: pagenum,
                        field: pageOrderInfo["field"],
                        sord: pageOrderInfo["sord"]
                    }

                    obj = $.extend({}, obj, extraParams);
                    $.fxPost("engine.data?action=DoneCasePager", obj, function (data) {
                        if (endBoxGrid == undefined) {
                            gvm.data = data.lst;
                            endBoxGrid = root.iwfGrid(gvm);
                        }
                        else
                            endBoxGrid.refresh(data.lst);
                        PageInfo.text(data.pageNum + "/" + data.pagesSum);
                        pageOrderInfo.SumPages = data.pagesSum;
                    });

                    //    PageInfo.text(data.pageNum + "/" + data.pagesSum);
                    //    pageOrderInfo.SumPages = data.pagesSum;
                    //    Tbody.empty();

                    //    TMPL.tmpl(data.lst, opt.fn).appendTo(Tbody);

                    //    Tbody.children("tr").find("a").bind('click', function () {
                    //        var data = $(this).parentsUntil("tr").last().parent().data().tmplItem.data;
                    //        var params = {
                    //            caseid: data.ID,
                    //            flowid: data.FlowID,
                    //            title: data.Name,
                    //            isend: true,
                    //        };
                    //        params.state = "donecase";
                    //        $.iwf.onmodulechange(data.ID + ".fx/com/wf/form:" + JSON.stringify(params));
                    //    });

                    //});
                }

                refresh();
            });
        }

    }
});
