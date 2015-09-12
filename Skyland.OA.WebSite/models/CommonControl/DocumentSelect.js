$.Biz.DocumentSelect = function () {
    var selectCallback;
    var models = {};
    models.documentModel = { fileTypeId: "", parentId: "", fileTypeName: "" };//右边input绑定实体

    this.show = function (module, root, departmentId) {
        if (root.children().length != 0) return;
        selectCallback = module.callback;

        root.load("models/CommonControl/DocumentSelect.html", function () {
            $.fxPost("DocumentCenterSvc.data?action=GetDataByDepartmentId", { departmentId: departmentId }, function (ret) {

                models.options = {
                    expandbyClick: true,  	//是否点击父节点展开子节点
                    //flowlayout: 100,	//叶子节点宽度
                    expandable: true, 	//是否可展开
                    data: [],
                    itemclick: function (item, element) {
                        root.find("[data-id='inputDocument']").val(item.text);
                        models.documentModel.fileTypeId = item.id;//主键
                        models.documentModel.parentId = item.title;//父类节点
                        models.documentModel.fileTypeName = item.text;//文件类型名称
                        selectCallback(item);
                    }
                };
                //加载根节点
                if (ret.data.length > 0) {
                    for (var i = 0; i < ret.data.length; i++) {
                        if (ret.data[i].ParentId == departmentId) {
                            var singleData = ret.data[i];
                            models.options.data.push({
                                type: 'group',
                                title: singleData.ParentId,
                                text: singleData.FileTypeName,
                                id: singleData.FileTypeId,
                                children: recursion(ret.data, singleData)
                            });
                        }
                    }
                }
                $('[data-id="treeMenu"]').listView2(models.options);
            });
        })

        //迭代
        function recursion(data, parentItem) {
            var childrenData = $(data).filter(function (index, item) {
                if (item.ParentId == parentItem.FileTypeId)
                    return true;
            });
            if (!childrenData || childrenData.length == 0) { //递归出口
                return [];
            }
            var childrenItems = [];
            for (var a = 0; a < childrenData.length; a++) {
                //循环迭代子节点
                childrenItems.push({
                    id: childrenData[a].FileTypeId,
                    title: childrenData[a].ParentId,
                    text: childrenData[a].FileTypeName,
                    children: recursion(data, childrenData[a])//递归子节点
                });
            }
            return childrenItems;
        }
    }
}

//加入放入的文件
$.Biz.DocumentSelectWin = function (callback, departmentId) {
    var model = new $.Biz.DocumentSelect();
    var opts = { title: '文档类别选择', height: 730, width: 750 };
    var win = $.iwf.showWin(opts);
    var root = win.content();
    model.show(
        {callback: function (item) { callback(item); win.close(); } },
        root, departmentId
  );
}