define(new function () {
    var me = this;
    me.data = null;
    this.options = { key: 'SpecialBriefing' };
    var models = {}

    this.show = function (module, root) {
        if (root.children().length == 0) {
            root.load("nnepb/portlet/SpecialBriefing.html", function () {
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
        }
    }
})