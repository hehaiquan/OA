//办理意见列表

define(function () {
    return function () {
        var root;
        var self;
        var RemarkListUrl = "fx/com/wf/toolbar/RemarkList.html";
        this.show = function (data, div) {

            data.RemarkListData.reverse();
            data.PassListData.reverse();

            root = $(div);

            root.load(RemarkListUrl, function () {
                var tmpl = root.find("[iwftype=RemarklistTmpl]");
                if (tmpl.length == 0) return;
                var tmplstr = tmpl[0].outerHTML;
                // if (self.api.caseid == "") { tmpl.remove(); return; }
                $.each(data.RemarkListData, function (index, Entity) {
                    //Entity.senderRemark = "无意见";
                    Entity.completedate = $.Com.formatDate(Entity.completedate);
                    var tempdom = $(tmplstr.replace$Object(Entity, true)).removeAttr("iwftype");
                    tempdom.insertBefore(tmpl);

                    //var img = document.createElement("img");

                    ////设置 img 属性，如 id
                    //img.setAttribute("data-id", "W000058_C000842_A005_2015728181426");

                    ////设置 img 图片地址
                    //img.src = "/officeFile/sighture/W000058_C000842_A005_2015728181426.jpg";

                    //tempdom[0].children[0].appendChild(img);
                    if ((Entity.senderRemark != null) && (Entity.senderRemark.length > 4) && (Entity.senderRemark.substring(Entity.senderRemark.length - 4) == '.jpg')) {
                        tempdom[0].children[0].innerText = "";
                        var img = document.createElement("img");
                        //设置 img 图片地址
                        img.src = "/officeFile/" + Entity.senderRemark;
                        tempdom[0].children[0].appendChild(img);

                    }
                });
                tmpl.remove();

                var tmpl2 = root.find("[iwftype=RemarklistTmpl2]");
                if (tmpl2.length == 0) return;
                var tmplstr2 = tmpl2[0].outerHTML;
                $.each(data.PassListData, function (index, Entity) {
                    //Entity.senderRemark = "无意见";
                    Entity.completedate = $.Com.formatDate(Entity.completedate);
                    var tempdom = $(tmplstr2.replace$Object(Entity, true)).removeAttr("iwftype");
                    tempdom.insertBefore(tmpl2);
                });
                tmpl2.remove();
            });

        }
    }
}
);