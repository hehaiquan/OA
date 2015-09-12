define(new function () {
    var me = this;
    this.options = { key: 'MyCaseModel' };

    var gvm = {
        htmlUrl: "nnepb/portlet/MyCaseModel.html",
        rowclick: function(sender, data) {
            var params = { caseid: data.ID, baid: data.BAID, flowid: data.FlowID, title: data.Name, userid: $.iwf.userinfo.UserID, actid: data.ActID, guid: data.guid };
            if (data.ID.length > 0)
                $.Com.Go(data.ID + ".fx/com/wf/form:" + JSON.stringify(params));
            else
                $.Com.Go(data.guid + ".fx/com/wf/form:" + JSON.stringify(params));
        },
        linkclick: function(sender, data) {

        },
        fn: {
            myName: '当前在办',
            changeyyyyMMdd: $.Com.formatDate
        },
        css: {
            //  root: uimodelcss,
            row: 'mcm-grid-row',
            rowSelected: 'mcm-gird-active',
            rowSplit: 'treeview-bar'
        },
    };
    var gridRoot;

    String.prototype.overHide = function (length) {
        var tmp = 0;
        var len = 0;
        var okLen = 0;
        var okStr = "";
        for (var i = 0; i < length; i++) {
            if (this.charCodeAt(i) > 255) tmp += 2; //大于255表示汉字，一个汉字为2个字符
            else len += 1;//小于等于255表示字符或者数字，为1个字符
            okLen += 1;   //计数器，等于length
            if (tmp + len == length) {
                okStr = this.substring(0, okLen);
                break;
            }
            if (tmp + len > length) {
                okStr = this.substring(0, okLen - 1);
                break;
            }
        }
        if (okStr < this) return okStr + "...";
        else return this + "";
    };
    this.show = function (module, root) {
        if (root.children().length > 0) {
            root.children().remove();
        }
        if (root.children().length == 0) {
            $.fxPost("engine.data?action=Querymycase&ttt=" + Math.random(), {}, function (data) {
                root.css({ 'paddingTop': '5px' });
                var SUM = 0;
                var ToDay = 0;
                var Top5 = new Array();
                for (var i = 0; i < data.length; i++) {
                    var count = data[i].count;
                    SUM += count;
                    if (data[i].text == "今天的业务") ToDay += count;
                    for (var j = 0; j < data[i].children.length; j++) {

                        if (data[i].children[j].FlowID == "W000058" || //发文
                            data[i].children[j].FlowID == "W000066" || //收文(传阅)
                            data[i].children[j].FlowID == " W000067"//收文(办理)
                        ) {
                        } else {
                            Top5.push(data[i].children[j]);
                        }
                        if (Top5.length == 5) break;
                    }
                    if (Top5.length == 5) break;
                }

                var url_dbx = 'index.html#casemodule.fx/com/wf/doingCase:{}'; //index.html#M0.doingcase:{title:"待办箱"}
                root.append("&nbsp;&nbsp;<span style='color:#D31D12;'>" + SUM + "</span>&nbsp;条待办业务；新增&nbsp;&nbsp;<span style='color:#D31D12;'>" + ToDay + "</span>&nbsp;&nbsp;条&nbsp;&nbsp;&nbsp;&nbsp;<div style='HEIGHT: 1px; OVERFLOW: hidden; BORDER-TOP: #ddd 1px solid'><br/>");
                gridRoot = root.append('<div id="querymycaseroot" style="margin-top: 10px;"></div>').children().last();

                gvm.data = Top5;
                gridRoot.iwfGrid(gvm);
            },
            function(err) {
                root.text(err.msg);
            });
        }
    };
});

