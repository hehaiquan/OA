$.Biz.B_OA_TrafficFlow_PublicNotice = function (wftool) {
    var self = this;
    var textarea = "";
    var editor;
    var models = {};
    var choiceAticelData;

    this.options = {
        HtmlPath: "Forms/B_OA_TrafficFlow_PublicNotice/B_OA_TrafficFlow_PublicNotice.html",
        Url: "B_OA_TrafficFlow_PublicNoticeSvc.data"
    };


    models.baseInfor_Notice = $.Com.FormModel({
        beforeBind: function (vm, root) {
            vm._getDocumentSelect = function () {
                $.Biz.DocumentSelectTwoWin(
                    function (data) {
                        if (data != null) {
                            //显示选择的文章类型
                            loadSelect(data);
                        }
                    }, choiceAticelData)
            }
        }
        , beforeSave: function (vm, root) {
        },
        isAppendSign: true
    });


    //读取所选树状图显示
    function loadSelect(data) {
        choiceAticelData = data;
        root.find("[data-id='haveChoiceContent']").empty();
        var haveChoiceContent = root.find("[data-id='haveChoiceContent']");
        //循环创建菜单
        for (var i = 0; i < data.length; i++) {
            var divItem = $("<div title='' style='float: left' data-id='" + data[i].id + "'> <b>" + data[i].name + "</b><img data-id='up" + i + "' src='../../css/images/docCenter/delete.png' /></div>");

            haveChoiceContent.append(divItem);
            haveChoiceContent.find("[data-id='up" + i + "']").bind("click", function () {
                var dataid = $(this).eq(0).parent().attr("data-id");
                for (var i = 0 ; i < data.length; i++) {
                    if (data[i].id == dataid) {
                        var data_ad = arr_del(data, i + 1);
                        loadSelect(data_ad);
                    }
                }
            });
        }
    }


    function arr_del(data, d) {
        return data.slice(0, d - 1).concat(data.slice(d))
    }
    
    this.show = function (formdiv, formdata, wftool) {
        if (formdiv) root = formdiv;
        data = formdata;

        var wactid = wftool.wfcase.actid;

        var baseInfor_Notice = data.data.baseInfor_Notice;
        var textarea = "<textarea class='form-control' name='aticleText_" + baseInfor_Notice.NewsId + "' data-bind='value:NewsText' rows='20'></textarea>";

        var aticleText_Update = root.find("[data-id='aticleText_Update']");
        aticleText_Update.empty(); //删除被选元素的子元素。
        aticleText_Update.append(textarea);
        editor = CKEDITOR.replace("aticleText_" + baseInfor_Notice.NewsId);
        models.baseInfor_Notice.show(root.find("[data-id='baseInfo']"), baseInfor_Notice);
        editor.setData(models.baseInfor_Notice.NewsText);

        //加载文章类别
        if (baseInfor_Notice.documentTypeName) {
            var dataArray = [];
            var documentNameArray = baseInfor_Notice.documentTypeName.split('/');
            var documentIdArray = baseInfor_Notice.documentTypeId.split('/');
            for (var i = 0 ; i < documentIdArray.length; i++) {
                var documentTypeModel = { id: "", name: "" };
                documentTypeModel.id = documentIdArray[i]
                documentTypeModel.name = documentNameArray[i];
                dataArray.push(documentTypeModel);
            }
            loadSelect(dataArray);
        }
    }

    this.getCacheData = function () {

        data.baseInfor_Notice = models.baseInfor_Notice.getCacheData();
        //文章内容
        data.baseInfor_Notice.NewsText = editor.getData();
        //文章类别
        var choiceData = choiceAticelData;
        var documentTypeName = "";
        var documentTypeId = "";
        if (choiceData) {
            for (var i = 0 ; i < choiceData.length; i++) {
                if (i != choiceData.length - 1) {
                    documentTypeName += choiceData[i].name + "/";
                    documentTypeId += choiceData[i].id + "/";
                } else {
                    documentTypeName += choiceData[i].name;
                    documentTypeId += choiceData[i].id;
                }
            }
        }
        data.baseInfor_Notice.documentTypeName = documentTypeName;
        data.baseInfor_Notice.documentTypeId = documentTypeId;
        return JSON.stringify(data);
    }

    this.getData = function () {
        var d1 = models.baseInfor_Notice.getData();
        d1.NewsText = editor.getData();

        //文章类别
        var choiceData = choiceAticelData;
        var documentTypeName = "";
        var documentTypeId = "";
        if (choiceData) {
            for (var i = 0 ; i < choiceData.length; i++) {
                if (i != choiceData.length - 1) {
                    documentTypeName += choiceData[i].name + "/";
                    documentTypeId += choiceData[i].id + "/";
                } else {
                    documentTypeName += choiceData[i].name;
                    documentTypeId += choiceData[i].id;
                }
            }
        }
        d1.documentTypeName = documentTypeName;
        d1.documentTypeId = documentTypeId;
        if (d1 && d1 != null)
            return JSON.stringify({ "baseInfor_Notice": d1 });
        else
            return false;
    }
}

$.Biz.B_OA_TrafficFlow_PublicNotice.prototype.version = "1.0";
