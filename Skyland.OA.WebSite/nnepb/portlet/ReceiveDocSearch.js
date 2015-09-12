define(new function () {
    var me = this;
    this.options = { key: 'receiveDocSearch' };
    var models = {};

    this.show = function (module, root) {
        if (root.children().length == 0) {
            root.load("nnepb/portlet/ReceiveDocSearch.html", function () {
                root.css({ 'paddingTop': '5px' });
                var btnDiv = root.find("[data-id='receiveContent']");
                btnDiv.empty();
                $.fxPost("OAReceiveDocSearchSvc.data?action=getBtnArray", "", function (ret) {
                    if (!ret.success) {
                          $.Com.showMsg(ret.msg);
                        return;
                    }

                    GotoReceiveSearch = function (fileTypeName) {
                        $.Biz.OAReceiveDocPage.choiceData = fileTypeName;
                        $.Biz.OAReceiveDocPage.type = 'gateway';
                        $.Biz.OAReceiveDocPage.url = 'searchdatamodule.oareceivedocsearch:{title:"收文查询"}';
                        if ($.Biz.OAReceiveDocPage.isInitial) {
                            $.Biz.OAReceiveDocPage.fromGateway(fileTypeName, 'gateway');
                        }
                        $.iwf.onmodulechange('searchdatamodule.oareceivedocsearch:{title:"收文查询"}');
                    };

                    var divHtml = "";
                    var datalist = ret.data;
                    for (var i = 0 ; i < datalist.length; i++) {
                        divHtml += " <li onclick=GotoReceiveSearch('" + datalist[i].FileTypeName + "')><a href='javascript:void(0);' style='color: #000000;'>" + datalist[i].FileTypeName + "</a></li>";
                    }
                    btnDiv.append(divHtml);
                })
            })
        }
    }
})