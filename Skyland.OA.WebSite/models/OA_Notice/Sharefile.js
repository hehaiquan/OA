$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'sharefile' };
    this.show = function (module, root) {
        $.Biz.Sharefile.show(module, root);
    }
});




$.Biz.Sharefile = new function () {
    
    var self = this;
    var root;
    self.data = null;
    self.treeDate = null;
    self.ztr = null;//树对象
    //var idname="deptid"
    var isShare = 1;
    var models = {};
    self.setting = {
        view: {
            dblClickExpand: false,
            showLine: true,
            selectedMulti: false
        },
        //check: {
        //    enable: true
        //},
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "parentid",
                rootPId: "0"
                , nameCol: "name"           //设置 zTree 显示节点名称的属性名称,此处默认为name 
            }
        },
        callback: {//回调涵数
            beforeClick: function (treeId, treeNode) {//单击

                //var zTree = $.fn.zTree.getZTreeObj("SharefileDeptTree");
                if (treeNode.isParent) {
                    //searchfile(null);
                    return false; //这里反回真被选中的结点才有对象值,false则没对象值
                } else {
                    //searchfile(treeNode.deptid.replace(idname, ""), isShare);
                    searchfile(treeNode.id, isShare);
                }
            }
        }
    };


    models.gridModel = $.Com.GridModel({
        keyColumns: "RelativePath",//主键字段
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) {
            vm._HrefAttachment = function (RelativePath) {
                return "http://" + window.location.host + "/" + RelativePath() ;
            }
        },
        edit: function (item, callback) {

        },
        remove: function (row) {

        },
        elementsCount: 10  //分页,默认5
    });



    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/OA_Notice/Sharefile.html", function () {

            $.post("B_OA_NoticeSvc.data?action=GetDeptData", { isShare: isShare}, function (data) {
                data = eval('(' + data + ')');
                var listData =data.data;
                self.treeDate = listData;
                var t = root.find("[data-id='SharefileDeptTree']");
                self.ztr = $.fn.zTree.init(t, self.setting, listData);//初始化树型菜单
                //ztr.expandAll(true); //展开全部节点
                //zTree.checkAllNodes(false);

                ////调用方法展开节点，第二个参数是：是否展开(要的就是这个)第三个参数是：是否影响全部子节点，我这里不需要。
                var node = self.ztr.getNodeByParam("id", "1");//选中部门结点
                self.ztr.expandNode(node, true, false);//展开节点

            });

            searchfile(null, isShare);
            
        });
    }

    function searchfile(deptid, isShare) {
        $.post("B_OA_NoticeSvc.data?action=GetFileData", { deptid: deptid, isShare: isShare }, function (data) {
            data = eval('(' + data + ')');
            var listData = data.data;
            self.data = listData;
            models.gridModel.show(root.find('[data-role="fileGrid"]'), listData);
        });
    }

};




