//$.iwf.register(new function () {
//    var me = this;
//    this.options = { key: 'documentOrderManage' };
//    this.show = function (module, root) {
//        $.Biz.documentOrderManage.show(module, root);
//    }
//});

//$.Biz.documentOrderManage = new function () {
//    var self = this;
//    var root;
//    var models = {};
//    models.documentModel = { fileTypeId: "", parentId: "", fileTypeName: "", codePath: "" };//右边input绑定实体
//    models.newDocumentModel = { fileTypeName: "", parentId: "", codePath: "" }//弹窗绑定实体
//    models.adetailmodel = $.Com.FormModel({});//添加弹窗的实体
//    models.inputDiv = $.Com.FormModel({});

//    models.OrderGridModel = $.Com.GridModel({
//        keyColumns: "id",//主键字段
//        //绑定前触发，在这里可以做绑定前的处理
//        beforeBind: function (vm, root) {

//        },
//        edit: function (item, callback) {

//        },
//        remove: function (row) {
//            deleteRelation(row.id);
//        },
//        elementsCount: 10  //分页,默认5
//    });

//    this.show = function (module, _root) {
//        root = _root;
//        if (root.children().length != 0) return;
//        root.load("models/OA_Notice/DocumentOrderManage.html", function () {

//            models.inputDiv.show(root.find("[data-id='inputDocument']"), { documentName: "" });//右边文本框绑定
//            //加载读取数据
//            loadData();
//            loadGridData();

//            root.find("[data-id='orderBtn']").bind("click", function () {

//                $.post("DocumentCenterSvc.data?action=SaveDocumentRelation", { fileTypeId: models.documentModel.fileTypeId }, function (res) {
//                    if (res) {
//                        var json = JSON.parse(res);
//                          $.Com.showMsg(json.msg);
//                        loadGridData();
//                    }
//                })
//            })
//        });
//    }

//    //加载数据
//    function loadData() {
//        $.fxPost("DocumentCenterSvc.data?action=GetData", "", function (ret) {

//            models.options = {
//                expandbyClick: true,  	//是否点击父节点展开子节点
//                //flowlayout: 100,	//叶子节点宽度
//                expandable: true, 	//是否可展开
//                data: [],
//                itemclick: function (item, element) {
//                    root.find("[data-id='inputDocument']").val(item.text);
//                    models.documentModel.fileTypeId = item.id;
//                    models.documentModel.parentId = item.title;
//                    models.documentModel.fileTypeName = item.text;
//                    models.documentModel.codePath = item.codePath;
//                }
//            };
//            //加载根节点
//            if (ret.data.length > 0) {
//                for (var i = 0; i < ret.data.length; i++) {
//                    if (ret.data[i].ParentId == "0") {
//                        var singleData = ret.data[i];
//                        models.options.data.push({
//                            type: 'group',
//                            title: singleData.ParentId,
//                            text: singleData.FileTypeName,
//                            id: singleData.FileTypeId,
//                            codePath: singleData.CodePath,
//                            children: recursion(ret.data, singleData)
//                        });
//                    }
//                }
//            }

//            var height = window.innerHeight;
//            root.find("[data-id='listDiv']").attr("style", "height:" + height * 0.82 + "px;");
//            var tmHeight = root.find("[data-id='listDiv']").height();
//            root.find('[data-id="documentOrderManageTreeMenu"]').attr("style", "overflow-y: auto;height: " + tmHeight + "px");
//            $('[data-id="documentOrderManageTreeMenu"]').listView2(models.options);
//        });
//    }


//    //迭代函数
//    function recursion(data, parentItem) {
//        var childrenData = $(data).filter(function (index, item) {
//            if (item.ParentId == parentItem.FileTypeId)
//                return true;
//        });
//        if (!childrenData || childrenData.length == 0) { //递归出口
//            return [];
//        }
//        var childrenItems = [];
//        for (var a = 0; a < childrenData.length; a++) {
//            //循环迭代子节点
//            childrenItems.push({
//                id: childrenData[a].FileTypeId,
//                title: childrenData[a].ParentId,
//                text: childrenData[a].FileTypeName,
//                codePath: childrenData[a].CodePath,
//                children: recursion(data, childrenData[a])//递归子节点
//            });
//        }
//        return childrenItems;
//    }


//    function loadGridData() {
//        $.fxPost("DocumentCenterSvc.data?action=GetDocumentOrderMenuByUserId", "", function (ret) {
//            models.OrderGridModel.show(root.find('[data-id="orderGrid"]'), ret.data);
//        })
//    }
//    function deleteRelation(id) {
//        $.fxPost("DocumentCenterSvc.data?action=DeleteDocumentRelation", { id: id }, function (ret) {
//            if (ret.success) {
//                  $.Com.showMsg(ret.msg);
//                loadGridData();
//            }
//        })
//    }
//}