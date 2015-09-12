$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'bigEventsManage' };
    this.show = function (module, root) {
        $.Biz.bigEventsManage.show(module, root);
    }
});

$.Biz.bigEventsManage = new function () {
    var root;
    var gridModel;
    var detailModel = $.Com.FormModel({});

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/BigEvents/BigEventsManage.html", function () {
            loadData();
            //富文本编辑器
            CKEDITOR.replace('editor_Substance');
            //事件表显示
            root.find("[data-id='eventsTableGrid']").attr("style", "display:normal");
            //按钮编辑
            root.find("[data-id='editent']").attr("style", "display:none");
            root.find("[data-id='btnBack']").attr("style", "display:none");
            root.find("[data-id='saveEvent']").attr("style", "display:none");

            //绑定返回事件
            root.find("[data-id='btnBack']").click(function () {
                root.find("[data-id='btnBack']").attr("style", "display:none");
                root.find("[data-id='saveEvent']").attr("style", "display:none");
                root.find("[data-id='editent']").attr("style", "display:none");
                root.find("[data-id='eventsTableGrid']").attr("style", "display:normal");
            });

            //绑定添加事件
            root.find("[data-id='btnAdd']").click(function () {
                root.find("[data-id='editent']").attr("style", "display:normal");
                root.find("[data-id='eventsTableGrid']").attr("style", "display:none");
                root.find("[data-id='btnBack']").attr("style", "display:normal");
                root.find("[data-id='saveEvent']").attr("style", "display:normal");
                CKEDITOR.instances.editor_Substance.setData("");
                $.fxPost("B_BigEventsManageSvc.data?action=GetEventsModel", "", function (ret) {
                    detailModel.show(root.find("[data-id='editent']"), ret.data);// 空出模板让用户填写
                });
            });
            //保存邮件绑定事件
            root.find("[data-id='saveEvent']").bind("click", function () {
                var da = detailModel.getData();
                 saveData(da);
            });

            
            //刷新
            root.find("[data-id='update']").bind("click", function () {
                loadData();
            });

        });
    }

    function loadData() {
        $.fxPost("B_BigEventsManageSvc.data?action=SearchEvents", "", function (ret) {
            if (ret.data) {
                gridModel = $.Com.GridModel({
                    beforeBind: function (vm, _root) {

                    },
                    elementsCount: 10,
                    edit: function (item, callback) {
                        detailModel.show(root.find("[data-id='editent']"), item);
                      
                        // 显示
                        root.find("[data-id='editent']").attr("style", "display:normal");
                        root.find("[data-id='eventsTableGrid']").attr("style", "display:none");
                        root.find("[data-id='btnBack']").attr("style", "display:normal");
                        root.find("[data-id='saveEvent']").attr("style", "display:normal");
                        //富文本加载
                        CKEDITOR.instances.editor_Substance.setData(item.substance);
                    },
                    remove: function (row) {
                        //if (!confirm("确定要删邮件吗？")) return false;
                        //else {
                        //    var id = row.ID();
                        //    deleteData(id, emailState == "RemoveEmail" ? "1" : "0");
                        //}
                    },
                    columns: [
                        { title: "录入人", key: "recordMan", sortable: true, width: "120px", content: "<span class=\"btn btn-link\" data-bind=\"text:recordMan,click: $root.editRow\"></span>" },
                        { title: "标题", key: "title", sortable: true,width: "120px", content: "<span class=\"btn btn-link\" data-bind=\"text:title,click: $root.editRow\"></span>" },
                        { title: "创建时间", key: "recordDate", sortable: true, width: "120px", content: "<span class=\"btn btn-link\" data-bind=\"text: recordDate(),click: $root.editRow\"></span>" },
                        { title: "删除", key: "action", sortable: true, width: "50px", content: "<span class=\"btn\" data-bind='click: $root.removeRow'><i  class=\"fa fa-times\"></i></span>" }

                    ],
                    keyColumns: "id"
           , cssClass: "table table-striped table-bordered  table-condensed"
                });
                gridModel.show(root.find("[data-id='eventsTableGrid']"), ret.data);

            }
        });
    }
    function saveData(da) {
        lawData.substance = CKEDITOR.instances.editor_Substance.getData();
    }
}