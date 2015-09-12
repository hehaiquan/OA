//待办箱

define(function () {
    return new function () {

        var me = this;
        this.options = { key: 'passcase', title: '传阅箱' };
        var caseData;
        var params = {};  //当前查询条件
        var gridRoot;

        function deleteCase() {
            if (!gvm.selectData) return

            $.Com.confirm("你决定删除 [ 传阅  " + gvm.selectData.Name + " ]业务吗？", function () {
                var obj = {
                    baid: gvm.selectData.BAID,
                    caseid: gvm.selectData.ID
                }

                $.fxPost("engine.data?action=delPass", obj, function () {
                    $.Com.showMsg("传阅业务删除！");
                    gvm.selectData = null;
                    me.search();
                });

            });
        }


        var toolData = [
       { title: '删除业务', text: '删除', iconCls: 'fa fa-trash-o', handler: deleteCase, cssClass: 'btn btn-danger' },
       { title: '刷新', iconCls: 'fa fa-refresh', type: 'circle', "float": 'right', handler: this.search }

        ];

        var gvm = {
            htmlUrl: "fx/com/wf/passcase.html",
            rowclick: function (sender, data) {
                gvm.selectData = data;
            },
            linkclick: function (sender, data) {
                var params = {
                    caseid: data.ID,
                    baid: data.BAID,
                    title: "传阅" + data.Name,
                };
                params.state = "passcase";
                var key = data.ID || data.guid;
                $.iwf.onmodulechange(key + ".fx/com/wf/form:" + JSON.stringify(params));
            },
            fn: {
                myName: '当前在办',
                changeyyyyMMdd: $.Com.formatDate,
                GetTrclass: function (item) {

                    if (!item.isreaded) return "unreaded ";

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
            $.fxPost("engine.data?action=getPass", {}, function (data) {
                caseData = data;
                if (gridRoot) RefreshGrid();

            });
        }

        //根据查询参数刷新grid
        function RefreshGrid() {
            var showData = [];
            $.each(caseData, function (i, items) {
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



        var FlowParams = null;

        this.search = function (keyword) {
            if (keyword) {
                params.keyword = keyword;
                RefreshGrid();
            } else {
                initGrid();//无参数就刷新整个待办箱
            }
        }

        if ($.iwf.searchDoingcase == undefined) $.iwf.searchDoingcase = this.search;

        this.show = function (module, root) {
            var json = module.params.replace(/"/g, "'");
            params = eval('({' + json + '})');

            if (root.children().length == 0) {

                $('<div data-id="doingcasetoolbar" class="pageTitle iwf-toolbar"> </div>').appendTo(root).iwfToolbar({ data: toolData });
                var CreateBtn = $('<button type="button" class="btn btn-primary dropdown-toggle"  style="float: left;"> <span class="fa fa-file "></span>   新建 <span class="caret"></span>  </button>');


                gridRoot = root.append('<div  style="height:100%;" data-id="doingcasegrid"></div>').children().last();
                initGrid();

                gridRoot.height(gridRoot.parent().height() - 88);
            }
        }

        this.resize = function (w, h) {
            if (gridRoot) gridRoot.height(gridRoot.parent().height() - 88);
        }
    }
});