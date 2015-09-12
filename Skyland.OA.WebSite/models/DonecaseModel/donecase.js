$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'donecase2' };
    var keyword = "";
    this.search = function (params) {
        //keyword = params["keyword"];
        //pagenum = 1;
        //callback
        ////alert(keyword);
        //此处应为查询代码
    }
    var pagenum = 1;
    var pageOrderInfo = new Object();
    pageOrderInfo["field"] = "CreateDate";
    pageOrderInfo["sord"] = "desc";

    this.show = function (module, root) {
        if (root.children().length == 0) {
            root.css("overflow", "hidden");
            var opt = {
                fn: {
                    changeyyyyMMdd: $.Com.formatDate
                }
            };
            root.load("models/DonecaseModel/donecase.html", function () {
                var PageInfo = root.find("[iwftype=pageinfo]");
                var PageDownBtn = root.find("[iwftype=pageDown]");
                var PageUpBtn = root.find("[iwftype=pageUp]");
                var GoInput = root.find("[iwftype=GoInput]");
                var GoToBtn = root.find("[iwftype=GoTo]");
                var RecordCount = root.find("[iwftype=RecordCount]");

                var Tbody = root.find(".new-param-tmpl");
                var TMPL = Tbody.clone();
                Tbody.empty();
                root.find(".iwf-btndiv").mousedown(function () {
                    $(this).addClass("iwf-btndiv-offet");
                }).mouseleave(function () {
                    $(this).removeClass("iwf-btndiv-hover");
                    $(this).removeClass("iwf-btndiv-offet");
                }).mouseup(function () {
                    $(this).removeClass("iwf-btndiv-offet");
                    $(this).trigger("btnEvent");
                });

                root.find(".iwf-btndiv").bind("btnEvent", function () {
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

                function refresh() {
                    jQuery.Loading.open("查询中");
                    $.post("engine.data?action=DoneCasePager", { page: pagenum, field: pageOrderInfo["field"], sord: pageOrderInfo["sord"], "keyword": keyword }, function (resText) {
                        var data = eval("(" + resText + ")");
                        RecordCount.text(data.Count);
                        PageInfo.text(data.pageNum + "/" + data.pagesSum);
                        pageOrderInfo.SumPages = data.pagesSum;



                        Tbody.empty();
                        TMPL.tmpl(data.lst, opt.fn).appendTo(Tbody);
                        Tbody.children("tr").find("a").bind('click', function () {
                            var data = $(this).parentsUntil("tr").last().parent().data().tmplItem.data;
                            var params = { caseid: data.ID, baid: data.BAID, flowid: data.FlowID, title: data.Name, isend: true, actid: data.ActID };
                            params.state = "donecase";
                            $.iwf.onmodulechange(data.ID + ".formmodel:" + JSON.stringify(params));
                        });
                        jQuery.Loading.close();
                    });
                }
                me.search = function (params) {
                    if (params) keyword = params["keyword"];
                    pagenum = 1;
                    refresh();
                }
                refresh();
            });
        }
    }
}());

