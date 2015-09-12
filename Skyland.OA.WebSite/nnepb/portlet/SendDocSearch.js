define(new function () {
    var me = this;
    this.options = { key: 'sendDocSearch' };
    var models = {};

    this.show = function (module, root) {
        if (root.children().length == 0) {
            root.load("nnepb/portlet/SendDocSearch.html", function () {
                

                root.css({ 'paddingTop': '5px' });
                var btnDiv = root.find("[data-id='sendContent']");
                btnDiv.empty();
                //$.fxPost("OASendDocSearchSvc.data?action=getBtnArray", "", function (ret) {
                //    if (!ret.success) {
                //          $.Com.showMsg(ret.msg);
                //        return;
                //    }
                    //跳转到发文查询界面
                    GotoSendSearch = function (fileTypeName) {
                        $.Biz.OASendDocSearchPage.choiceData = fileTypeName;
                        $.Biz.OASendDocSearchPage.type = 'gateway';
                        $.Biz.OASendDocSearchPage.url = 'searchdatamodule.oasenddocsearch:{title:"发文查询"}';
                        if ($.Biz.OASendDocSearchPage.isInitial) {
                            $.Biz.OASendDocSearchPage.fromGateway(fileTypeName, 'gateway');
                        }
                        $.iwf.onmodulechange('searchdatamodule.oasenddocsearch:{title:"发文查询"}');
                    };

                //    var divHtml = "";
                //    var datalist = ret.data;
                //    for (var i = 0 ; i < datalist.length; i++) {
                //        divHtml += "<tr style='cursor: pointer' onclick=GotoSendSearch('" + datalist[i].FileTypeName + "')>";
                //        divHtml += "<td><a style='line-height: 30px; color: #000000;'>" + datalist[i].FileTypeName.overHide(52) + "</a></td>";
                //        divHtml += "</tr>";
                //    }
                //    divHtml = "<table width='100%' border='0' cellspacing='0' class=' table-hover table-condensed'>" + divHtml + "</table>";
                //    btnDiv.append(divHtml);
                //})

                var DataListDiv = root.find("[data-id='sendContent']");
                //var divHtml = "";
                ////divHtml += "<tr >";
                ////divHtml += "<td><span style='line-height: 30px; color: #000000;'>&nbsp;&nbsp;</span><a href='#'><span class='more'>更多>></span></a></td>";
                ////divHtml += "</tr>";

                //divHtml += "<tr style='cursor: pointer'>";
                //divHtml += "<td><a style='line-height: 30px; color: #000000;'  onclick=GotoSendSearch('南环字')>南环字</a><span style='line-height: 30px;float: right; color: gray'></span></td>";
                //divHtml += "</tr>";

                //divHtml += "<tr style='cursor: pointer'>";
                //divHtml += "<td><a style='line-height: 30px; color: #000000;'  onclick=GotoSendSearch('南环报')>南环报</a><span style='line-height: 30px;float: right; color: gray'></span></td>";
                //divHtml += "</tr>";

                //divHtml += "<tr style='cursor: pointer'>";
                //divHtml += "<td><a style='line-height: 30px; color: #000000;'  onclick=GotoSendSearch('南环函')>南环函</a><span style='line-height: 30px;float: right; color: gray'></span></td>";
                //divHtml += "</tr>";

                //divHtml += "<tr style='cursor: pointer'>";
                //divHtml += "<td><a style='line-height: 30px; color: #000000;'  onclick=GotoSendSearch('南环干')>南环干</a><span style='line-height: 30px;float: right; color: gray'></span></td>";
                //divHtml += "</tr>";

                //divHtml = "<table width='100%' border='0' cellspacing='0' class=' table-hover table-condensed'>" + divHtml + "</table>";

                var divHtml ='<div class="row" style="margin:25px 5px">';
                divHtml += '   <div class="col-md-3 col-sm-6" style="padding:3px;"><a class="btn btn-success btn-block" onclick=GotoSendSearch(\'南环字\')>南环字</a></div>';
                divHtml += '   <div class="col-md-3 col-sm-6" style="padding:3px;"><a class="btn btn-success btn-block" onclick=GotoSendSearch(\'南环报\')>南环报</a></div>';
                divHtml += '   <div class="col-md-3 col-sm-6" style="padding:3px;"><a class="btn btn-success btn-block" onclick=GotoSendSearch(\'南环函\')>南环函</a></div>';
                divHtml += '   <div class="col-md-3 col-sm-6" style="padding:3px;"><a class="btn btn-success btn-block" onclick=GotoSendSearch(\'南环干\')>南环干</a></div></div>';

                DataListDiv.append(divHtml);
            })
        }
    }
})