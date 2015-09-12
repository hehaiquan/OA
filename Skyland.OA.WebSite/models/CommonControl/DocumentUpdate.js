

$.Biz.DocumentUpdateView = function (noticeId) {
    var root;
    var self = this;
    var models = {};
    var editor;
    var url = "";
    var textarea = "<textarea class='form-control' name='aticleText_UpdateInform' data-bind='value:NewsText' rows='16'></textarea>";
    var selectData;
    //文章发布model
    models.publishAticleModel = $.Com.FormModel({
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
    });

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return
        root.load("models/CommonControl/DocumentUpdate.html", function () {
            loadAtistByNewsId(noticeId, function (notice) {
                models.publishAticleModel.show(root.find("[data-id='baseInfo']"), notice);

                var aticleText_Update = root.find("[data-id='aticleText_Update']");
                aticleText_Update.empty(); //删除被选元素的子元素。
                aticleText_Update.append(textarea);
                editor = CKEDITOR.replace('aticleText_UpdateInform');
                editor.setData(notice.NewsText);

                //文件类型
                var dataArray = [];
                var documentNameArray = notice.documentTypeName.split('/');
                var documentIdArray = notice.documentTypeId.split('/');
                for (var i = 0 ; i < documentIdArray.length; i++) {
                    var documentTypeModel = { id: "", name: "" };
                    documentTypeModel.id = documentIdArray[i]
                    documentTypeModel.name = documentNameArray[i];
                    dataArray.push(documentTypeModel);
                }
                loadSelect(dataArray);
            });

            //发布范围
            root.find("[data-id='publicRange']").bind("change", function () {
                var c = $(this).val();
                if (c == "0") {
                    root.find("[data-id='rangePeoleView']").attr("style", "display:none");
                } else {
                    root.find("[data-id='rangePeoleView']").attr("style", "display:display");
                }
                models.publishAticleModel.getData().publicRange = 'c';
            });
        })
    }

    //读取所选树状图显示
    function loadSelect(data) {
        choiceAticelData = data;
        root.find("[data-id='haveChoiceContent']").empty();
        var haveChoiceContent = root.find("[data-id='haveChoiceContent']");
        //循环创建菜单
        for (var i = 0; i < data.length; i++) {
            var divItem = $("<div title='' style='float: left' data-id='" + data[i].id + "'> <b>" + data[i].name + "</b><img data-id='up" + i + "' src='../../resources/images/docCenter/delete.png' /></div>");

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


    //通过表主键查找文章
    function loadAtistByNewsId(noticeId, callback) {
        $.fxPost("/DocumentCenterSvc.data?action=GetNoticeByNoticeId", { noticeId: noticeId }, function (ret) {
            callback(ret.notice);
        })
    }


    this.getData = function () {
        if (choiceAticelData == "" || choiceAticelData == undefined || choiceAticelData == null) {
            $.Com.showMsg("文件类型不能为空");
            return;
        }
        var choiceData = choiceAticelData;
        var documentTypeName = "";
        var documentTypeId = "";
        for (var i = 0 ; i < choiceData.length; i++) {
            if (i != choiceData.length - 1) {
                documentTypeName += choiceData[i].name + "/";
                documentTypeId += choiceData[i].id + "/";
            } else {
                documentTypeName += choiceData[i].name;
                documentTypeId += choiceData[i].id;
            }
        }
        var publiceAticle = models.publishAticleModel.getData();
        publiceAticle.documentTypeName = documentTypeName;
        publiceAticle.documentTypeId = documentTypeId;
        publiceAticle.NewsText = editor.getData();
        selectData = publiceAticle;
        return selectData;
    }
}


//加入放入的文件
$.Biz.DocumentUpdateWin = function (noticeId, callback) {
    var model = new $.Biz.DocumentUpdateView(noticeId);
    var root = null;
    var catelog = [];
    var opts = {
        title: '文档编辑', height: 730, width: 900,
        button: [
                  {
                      text: '保存', handler: function () {
                          var notice = model.getData();
                          var jsonData = JSON.stringify(notice);
                          $.fxPost("/DocumentCenterSvc.data?action=UpdateAticle", { JsonData: jsonData }, function (ret) {
                              win.close();
                          })
                      }
                  },
                  { text: '关闭', handler: function () { win.close(); } }
        ]
    };
    var win = $.iwf.showWin(opts);
    var root = win.content();
    model.show(
        { callback: function (item) { callback(item); win.close(); } },
        root
  );

}