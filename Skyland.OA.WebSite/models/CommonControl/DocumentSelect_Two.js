$.Biz.DocumentSelectTwo = function (choiceData) {
    var models = {};
    var self = this;
    var ztr_Seleted;
    var root;
    var tree = null;
    var catelog = [];//选择目录
    var selectData;
    var haveSeleted = choiceData;//从窗口前传来的数据需要进行处理


    //树状图初始化
    self.setting = {
        view: {
            dblClickExpand: false,
            showLine: true,
            selectedMulti: false,
            fontCss: { style: "font-size:16px" }
        },
        //check: {
        //    enable: true
        //},
        data: {
            simpleData: {
                enable: true,
                idKey: "FileTypeId",
                pIdKey: "ParentId",
                rootPId: "0"
                , nameCol: "name"           //设置 zTree 显示节点名称的属性名称,此处默认为name 
            }
        },
        callback: {//回调涵数
            beforeClick: function (treeId, treeNode) {//单击
                //loadDataGridById(treeNode);
            },
            beforeCheck: function (treeId, treeNode) {

            },
            onCheck: zTreeOnCheck
        },
        check:
            {
                enable: true
            },
        edit: {

        }
    };

    //树状图初始化已选择
    self.setting_Selected = {
        data: {
            simpleData: {
                enable: true,
                idKey: "FileTypeId",
                pIdKey: "ParentId",
                rootPId: "0"
                , nameCol: "name"           //设置 zTree 显示节点名称的属性名称,此处默认为name 
            }
        },
        edit: {
            enable: true,
            showRemoveBtn: true,
            removeTitle: ""
        }
    };

    function zTreeBeforeRemove(treeId, treeNode) {
        return true;
    }

    function setRemoveBtn(treeId, treeNode) {
        return !treeNode.isParent;
    }


    function zTreeOnCheck(event, treeId, treeNode) {
        var choiceArray = self.ztr.getCheckedNodes();

        var array = [];
        for (var i = 0 ; i < choiceArray.length; i++) {
            var choiceModel = { name: "", FileTypeId: "", ParentId: "" };
            choiceModel.name = choiceArray[i].name;
            choiceModel.FileTypeId = choiceArray[i].FileTypeId;
            choiceModel.ParentId = choiceArray[i].ParentId;
            array.push(choiceModel);
        }
        loadDataTree_Selected(array);
    }

    function loadDataTree_Selected(list) {
        var ztr_Seleted = self.ztr_Seleted;
        var t = root.find("[data-id='DocumentClassSelectTree_Two']");
        ztr_Seleted = $.fn.zTree.init(t, self.setting_Selected, list);//初始化树型菜单
        ztr_Seleted.expandAll(true);
        selectData = ztr_Seleted;
    }

    //读取树状图
    function loadDataTree(haveSeleted) {
        //root.find("[data-id='DocumentClassTree']").empty();
        $.post("/DocumentCenterSvc.data?action=GetAllFileType", { parentId: "",type:"union" }, function (ret) {
            var json = JSON.parse(ret);
            var listData = [];
            self.tree = json.data.listFileTypeModel;
            var t = root.find("[data-id='DocumentClassSelectTree']");
            self.ztr = $.fn.zTree.init(t, self.setting, json.data.listFileTypeModel);//初始化树型菜单

            var height = window.innerHeight;
            root.find("[data-id='choiceData']").attr("style", "height:" + height * 0.82 + "px;");
            var tmHeight = root.find("[data-id='choiceData']").height();
            root.find('[data-id="documentThree"]').attr("style", "overflow-y: auto;height: " + tmHeight + "px");

            //若已选择过加载以选择信息
            if (haveSeleted != null && haveSeleted != "" && haveSeleted != undefined) {
             
                for (var i = 0 ; i < haveSeleted.length;i++){
                    var check = self.ztr.getNodeByParam("FileTypeId", haveSeleted[i].id);
                    self.ztr.checkNode(check, true, true);
                }
                var choiceArray = self.ztr.getCheckedNodes();
                var array = [];
                for (var i = 0 ; i < choiceArray.length; i++) {
                    var choiceModel = { name: "", FileTypeId: "", ParentId: "" };
                    choiceModel.name = choiceArray[i].name;
                    choiceModel.FileTypeId = choiceArray[i].FileTypeId;
                    choiceModel.ParentId = choiceArray[i].ParentId;
                    array.push(choiceModel);
                }
                //加载以选择
                loadDataTree_Selected(array);
            }
        })
    }

    this.show = function (module, _root) {
        if (_root.children().length != 0) return;
        //selectCallback = module.callback; 
        root = _root;
        root.load("models/CommonControl/DocumentSelect_Two.html", function () {
            loadDataTree(haveSeleted);
        });
     
    }
    this.getData = function () {
        return selectData;
    }
}


//加入放入的文件
$.Biz.DocumentSelectTwoWin = function (callback,choiceData) {
    var model = new $.Biz.DocumentSelectTwo(choiceData);
    var root = null;
    var catelog = [];
    var opts = {
        title: '文档分类选择', height: 730, width: 750,
        button: [
                  {
                      text: '确定', handler: function (data) {
                          if (model.getData() == undefined) {
                              win.close();
                              return;
                          }
                          var ids = [];
                          var groupArray = [];
                          //根据父类遍历出所有子类
                          for (var son = 0; son < model.getData().getNodes().length; son++) {
                              ids = getChildren(ids, model.getData().getNodes()[son]);
                          }
                          //根据子类遍历所有父类并拼成名称
                          for (var i = 0 ; i < ids.length; i++) {
                              var a = [];
                              //用于拼出的名称
                              var name = "";
                              checkAllParents(ids[i], a);
                              //拼出显示名称和ID
                              for (var j = a.length-1; j >= 0; j--) {
                                  name += a[j].name + ";";
                              }
                              var group = { name: "", id: "" };
                              name += ids[i].name + ";";
                              group.name = name;
                              group.id = ids[i].FileTypeId;
                              groupArray.push(group);
                          }
                          callback(groupArray);
                          win.close();
                      }
                  },
                  { text: '取消', handler: function () { win.close(); } }
        ]
    };
    var win = $.iwf.showWin(opts);
    var root = win.content();
    model.show(
        { callback: function (item) { callback(item); win.close(); } },
        root
  );

    //查找出子类
    function getChildren(ids, treeNode) {
        if (treeNode.isParent) {
            var obj = treeNode.children;
            if (obj instanceof Array) {
                for (var i = 0 ; i < obj.length; i++) {
                    getChildren(ids, obj[i]);
                }
            } else {
                for (var key in obj) {
                    getChildren(ids, obj);
                }
            }

        } else {
            ids.push(treeNode);
        }
        return ids;
    }

    //查找父类递归函数
    function checkAllParents(treeNode, a) {
        if (treeNode == null || treeNode.ParentId == '0') {
            return;
        }
        else {
            a.push({ name: treeNode.getParentNode().name, FileTypeId: treeNode.getParentNode().FileTypeId });
            checkAllParents(treeNode.getParentNode(), a);

        }
    }
}