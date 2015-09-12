define(new function () {
    var me = this;
    this.options = { key: 'dailyrecievedocument_Handle' };
    var models = {};

    String.prototype.overHide = function (length) {
        var tmp = 0;
        var len = 0;
        var okLen = 0;
        var okStr = "";
        for (var i = 0; i < length; i++) {
            if (this.charCodeAt(i) > 255) tmp += 2;// 大于255表示汉字，一个汉字为2个字符
            else len += 1;// 小于等于255表示字符或者数字，为1个字符；
            okLen += 1;// 计数器，等于length
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
        if (root.children().length == 0) {
            root.load("nnepb/portlet/OA/DailyReceiveDocumentHandlePage.html", function () {
                root.css({ 'paddingTop': '5px' });
                jQuery.PackResult("engine.data?action=Querymycase&ttt=" + Math.random(), {}, function (data) {
                    var SUM = 0;
                    var ToDay = 0;
                    var Top5 = new Array();
                    for (var i = 0; i < 3; i++) {
                        //var count = data[i].count;
                        //SUM += count;
                        //if (data[i].text == "今天的业务") ToDay += count;
                        if (!data[0]) {
                            continue;
                        }
                        for (var j = 0; j < data[i].children.length; j++) {

                            if (data[i].children[j].FlowID == "W000067"
                                //  ||收文(传阅)  data[i].children[j].FlowID == "W000067"//收文(办理)
                              ) {
                                Top5.push(data[i].children[j]);
                                SUM++;
                                if (data[i].text == "今天的业务") ToDay++;
                            }
                            if (Top5.length == 5) break;
                        }
                        if (Top5.length == 5) break;

                    }

                    rowclick = function (json) {
                        //var params = { caseid: data.ID, baid: data.BAID, flowid: data.FlowID, title: data.Name, userid: $.iwf.userinfo.UserID, actid: data.ActID };
                        //$.iwf.onmodulechange(data.ID + ".WFformmodel:" + JSON.stringify(params));
                        var data = eval('(' + json + ')')
                        var params = { caseid: data.ID, baid: data.BAID, flowid: data.FlowID, title: data.Name, userid: $.iwf.userinfo.UserID, actid: data.ActID };
                        $.iwf.onmodulechange(data.ID + ".WFformmodel:" + json);
                    };

                    var div = root.find("[data-id='headTitle']");
                    var url_dbx = 'index.html#casemodule.doingcase:{key:001}'; //index.html#M0.doingcase:{title:"待办箱"}
                    div.append("当前共有&nbsp;&nbsp;<span style='color:#D31D12;'>" + SUM + "</span>&nbsp;&nbsp;条待办业务；其中今日新增&nbsp;&nbsp;<span style='color:#D31D12;'>" + ToDay + "</span>&nbsp;&nbsp;条&nbsp;&nbsp;&nbsp;&nbsp;<a href='" + url_dbx + "'><span class='more'>更多>></span></a><div style='HEIGHT: 1px; OVERFLOW: hidden; BORDER-TOP: #ddd 1px solid'><br/>");
                    var DataListDiv = root.find("[data-id='myDailyReceiveDocumentDataList_Handle']");
                    var divHtml = "";
                    for (var i = 0; i < Top5.length; i++) {
                        var data = Top5[i];
                        var params = { caseid: data.ID, baid: data.BAID, flowid: data.FlowID, title: data.Name, userid: $.iwf.userinfo.UserID, actid: data.ActID };
                        divHtml += "<tr style='cursor: pointer' onclick=rowclick('" + JSON.stringify(params) + "')>";
                        divHtml += "<td><a style='line-height: 30px; color: #000000;'>" + Top5[i].Name.overHide(52) + "</a><br><span style='color: #057748;'>" + Top5[i].FlowName + "--" + Top5[i].ActName + "</span ><span style='float: right; color: gray'>" + $.Com.formatDate(Top5[i].ReceiveDate) + "</span></td>";
                        //divHtml += "<td><span style='font-size: 12px; color: #057748; line-height: 30px;'>" + Top5[i].ActName + "</span></td>";//Top5[i].FlowName
                        //divHtml += "<td><span style='float: right; color: gray'>" + $.Com.formatDate(Top5[i].ReceiveDate) + "</span></td></tr>";
                    }
                    //divHtml = "<table width='100%' border='0' cellspacing='0'><thead><th>标题</th><th>当前位置</th><th style='float: right'>时间</th></thead>" + divHtml + "</table>";
                    divHtml = "<table width='100%' border='0' cellspacing='0' class=' table-hover table-condensed'>" + divHtml + "</table>";
                    DataListDiv.append(divHtml);
                    //models.myOfficialDocumentDataList = $.Com.FormModel({});
                    //models.myOfficialDocumentDataList.show(root.find("[data-id='myOfficialDocumentDataList']"), Top5[0]);

                });
            });
        }
    }
})