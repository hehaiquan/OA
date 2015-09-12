define(function () {
    return new function () {

        var me = this;
        this.options = { key: 'doneCase', title: '在办箱' };
        var allDoneCase = [];
        var gridRoot;
        var toolDiv;
        var toolbar;
        var queryContion = {};

        function lookflowProcess() {
            //debugger;
            if (gvm.selectData == undefined) {
                $.Com.showMsg("请选择相应的业务！");
                return;
            }
            else {
                var ID = gvm.selectData.ID;
                var Name = gvm.selectData.Name;
                //彭博修改
                me.showWorkFlow(ID, Name);
            }
        }

        //收回操作
        function GetBack() {
            if (gvm.selectData == undefined) {
                $.Com.showMsg("请选择相应的业务！");
                return;
            }
            else {
                $.getJSON("engine.data?action=RevocationMyCase&ttt=" + Math.random(), { caseid: gvm.selectData.ID }, function (data) {
                    if (data.success) {
                        initGrid();
                        if ($.iwf.searchDoingcase) $.iwf.searchDoingcase();
                    }
                    $.Com.showMsg(data.msg);
                });
            }
        }

        function CanGetBack(node, sender) {
            if (sender.checked) {
                queryContion.onlyCanback = true;
            } else
                queryContion.onlyCanback = null;
            loadGrid();
            //sender.checked = !sender.checked;
        }

        function selectFlow(node, sender) {
            if (!sender && !node) {
            } else {
                toolbar.element('selectflow').children().first().children().first().text(node.name);
                if (node.id == '')
                    queryContion.flowid = null;
                else
                    queryContion.flowid = node.id;
                loadGrid();
            }
        }

        var gvm = {
            htmlUrl: "fx/com/wf/donecase.html",
            rowclick: function (sender, data) {
                gvm.selectData = data;
            },
            linkclick: function (sender, data) {
                var params = { caseid: data.ID, flowid: data.FlowID, title: data.Name };
                params.state = "havedone";
                //$.iwf.onmodulechange(data.ID + ".WFformmodel:" + JSON.stringify(params));
                $.iwf.onmodulechange(data.ID + ".fx/com/wf/form:" + JSON.stringify(params));
            },
            fn: {
                GetIcon: function (n) {
                    if (n == true)
                        return "fa fa-undo text-muted "
                    else
                        return "";

                    return "";
                },
                //IsRevocateState: function (n) {
                //    if (n == true)
                //        return "(可撤回)";
                //    else
                //        return "";
                //},
                //myName: function (n) {
                //    switch (n) {
                //        case "DONE": return "已办";
                //        case "DOING": return "在办";
                //        case "STOP": return "(停办)";
                //        case "WAITING": return "(等待)";
                //    }
                //},
                dateChange: function (n) {
                    return n;
                }
            }
        };

        function initGrid(params) {
            if (!params) params = {};
            $.fxPost("engine.data?action=havebeendone", params, function (data) {
                allDoneCase = data;
                loadGrid();
                var flows = {}
                $.each(data, function (i, item) {
                    if (flows[item.FlowID] == undefined)
                    { flows[item.FlowID] = item.FlowName }
                })

                var toolData = [
                //{ title: '查看流程', text: '查看流程', iconCls: 'fa fa-retweet', handler: lookflowProcess },
                { title: '在接受人未读之前可以撤回业务', text: '收回', iconCls: 'fa fa-undo', handler: GetBack, css: 'btn-primary' },
                {
                    title: '刷新', iconCls: 'fa fa-refresh', type: 'circle', "float": 'right', handler: function () { search(); }
                },
                { type: 'split', "float": 'right' },
                { type: 'checkbox', name: 'airlen1', checked: false, title: '查看可撤回业务', text: '显示收回业务', handler: CanGetBack, float: 'right' },
                { type: 'split', "float": 'right' },
                {
                    type: 'menu', text: '查看所有业务', handler: selectFlow, float: 'right', id: 'selectflow',
                    children: [{ id: '', name: '查看所有业务' }]
                },

                ];

                for (var id in flows) {
                    toolData[5].children.push({ id: id, name: flows[id] });
                }
                toolbar = null;
                toolDiv.empty();
                toolbar = toolDiv.iwfToolbar({ data: toolData });


            });
        }

        function loadGrid() {
            var data = [];
            if (queryContion) {
                var data = []
                $.each(allDoneCase, function (i, item) {
                    var beIn = true;
                    if (queryContion.flowid && item.FlowID != queryContion.flowid) beIn = false;
                    if (queryContion.onlyCanback && item.IsCanRevocate == false) beIn = false;
                    if (queryContion.keyword && item.Name.indexof(queryContion.keyword) == -1) beIn = false;
                    if (beIn) data.push(item);
                });
            } else
                data = allDoneCase;
            gvm.data = data;
            gridRoot.iwfGrid(gvm);
        }

        function search(params) {
            //此处应为查询代码
            if (gridRoot == undefined) return;

            if (params && params != "")
                queryContion.keyword = params;
            else
                queryContion.keyword = null;
            loadGrid();
        }

        if ($.iwf.searchDonecase == undefined) $.iwf.searchDonecase = search;

        this.show = function (module, root) {
            var key = this.options.key;
            var json = module.params.replace(/"/g, "'");
            var params = eval('({' + json + '})');

            toolDiv = $('<div data-id="toolbar" class="pageTitle iwf-toolbar"> </div>').appendTo(root);
            gridRoot = root.append('<div data-id="querymycaseroot" style="height:100%;"></div>').children().last();
            initGrid(params);

            gridRoot.height(gridRoot.parent().height() - 90);

        }

        this.resize = function (w, h) {
            if (gridRoot) gridRoot.height(gridRoot.parent().height() - 90);
        }

        //彭博修改
        this.showWorkFlow = function (ID, Name) {
            //debugger;gvm.selectData.Name
            var win = $('body').iwfWindow({
                //width: 800, height: 600,
                title: '<' + Name + '> 业务办理流程',
                button: [{
                    text: '关闭', handler: function (data) {
                        win.close();
                    }
                }]
            });
            //彭博修理了这个功能的bug
            win.load('/framework/addins/gridmodel/FlowChart.html', function () {
                $.post("engine.data?action=lookflowProcess", { caseid: ID }, function (res) {
                    var data = eval("(" + res + ")");
                    var tmplDOM = win.content().find("[iwftpye=myTemplate]");
                    var rows = win.content().find("[iwftpye=rows]");
                    tmplDOM.tmpl(data, { changeyyyyMMdd: $.Com.formatDate }).appendTo(rows);
                });
            });
        }
    }
});

