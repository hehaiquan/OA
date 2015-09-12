//选择用户常用语的model，就是弹出窗口的内容
$.Biz.UserSelectControlInfor = function (el, valueAccessor) {
    var self = this;
    var root;
    var models = {};
    var canRedFontFlag = false;//标记是否名称是否标红
    var selectData = { userid: "", username: "", dpid: "", dpname: "" };
    var dpName;//部门名称
    models.gridModel = $.Com.GridModel({
        keyColumns: "id",//主键字段
        beforeBind: function (vm, _root) {//表格加载前
            vm._deleteData = function (rowData) {
                var check = self.ztr.getNodeByParam("id", rowData.id());
                self.ztr.checkNode(check, false, false);
                check.checked = false;
                self.ztr.updateNode(check);
                setCheckChoiceModel(function (da) {
                    models.gridModel.show(root.find('[data-id="choiceGrid"]'), da);
                });
            }
        },
        edit: function (item, callback) {

        },
        remove: function (row) {

        },
        elementsCount: 10 //分页,默认5
    });

    //树状图初始化
    self.setting = {
        view: {
            dblClickExpand: false,
            showLine: true,
            selectedMulti: false,
            nameIsHTML: true
            //addHoverDom: addHoverDom,
            //removeHoverDom: removeHoverDom
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "ParentId",
                rootPId: "0"
                , nameCol: "name"           //设置 zTree 显示节点名称的属性名称,此处默认为name 
            }
        },
        callback: {//回调涵数
            beforeClick: function (treeId, treeNode) {//单击
                if (treeNode.isParent) {
                    self.ztr.expandNode(treeNode);
                } else {
                    var ck;
                    if (treeNode.checked == true) {
                        ck = false;
                    } else {
                        ck = true;
                    }
                    treeNode.checked = ck;
                    self.ztr.updateNode(treeNode);
                    self.ztr.checkNode(treeNode, ck, ck);
                    zTreeOnCheck();
                }
            },
            onCheck: zTreeOnCheck
        },
        check:
        {
            enable: true
        },
    };

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/CommonControl/UserSelectControl.html", function () {
            //初始化选择表
            models.gridModel.show(root.find('[data-id="choiceGrid"]'), []);
            //加载数据
            loadData("byUser");
            //所有人
            root.find("[data-id='allMan']").bind("click", function () {
                //所有人员树状图折叠
                loadDataBySearchCondition("", "fold");
                if ((valueAccessor.opt == true || valueAccessor.opt == false)) {
                    root.find("[data-id='allMan']").attr("style", "display:none");
                    root.find("[data-id='departmentMan']").attr("style", "display:display");
                }
            });

            //本部人员
            root.find("[data-id='departmentMan']").bind("click", function () {
                canRedFontFlag = false;
                loadDataBySearchCondition(dpName, "");
                canRedFontFlag = true;
                root.find("[data-id='allMan']").attr("style", "display:display");
                root.find("[data-id='departmentMan']").attr("style", "display:none");
            });

            //搜索节点按钮
            root.find("[data-id='searchHumenButton']").bind("click", function () {
                var a = root.find("[data-id='dataValue']")[0].value;
                loadDataBySearchCondition(a, "");
            });

            //展开
            root.find("[data-id='spreadTree']").bind("click", function () {
                root.find("[data-id='spreadTree']").attr("style", "display:none");
                root.find("[data-id='foldTree']").attr("style", "display:display");
                self.ztr.expandAll(true);
            });

            //折叠
            root.find("[data-id='foldTree']").bind("click", function () {
                root.find("[data-id='spreadTree']").attr("style", "display:display");
                root.find("[data-id='foldTree']").attr("style", "display:none");
                self.ztr.expandAll(false);
            });
        })
    }

    //通过搜索条件查找树状图并显示
    function loadDataBySearchCondition(searchName, isAllman) {
        //取出所有的元素
        var choiceNodes = self.ztr.getNodesByParamFuzzy("name", searchName, null);
        //隐藏所有节点
        for (var i = 0 ; i < self.ztr.getNodes().length; i++) {
            setTreeVisible(self.ztr.getNodes()[i]);
        }
        var nodes = self.ztr.getNodesByParam("visible", false);
        self.ztr.hideNodes(nodes);

        //显示相关节点
        for (var j = 0 ; j < choiceNodes.length; j++) {
            if ((searchName != "") && (canRedFontFlag == true)) {
                choiceNodes[j].name = "<font color='red'>" + choiceNodes[j].name + "</font>";
            }
            //跟新name的样式
            self.ztr.updateNode(choiceNodes[j]);
            //那么它的所有上级节点和所有下级节点都设置为“可见”【先序遍历法】
            setTreeVisible_LowerLevel(choiceNodes[j]);
            setTreeVisible_HigherLevel(choiceNodes[j]);
        }
        var showNodes = self.ztr.getNodesByParam("visible", true);
        self.ztr.showNodes(showNodes);
        //self.ztr.reAsyncChildNodes(null, "refresh");
        if (isAllman == "fold") {
            self.ztr.expandAll(false);
        } else {
            self.ztr.expandAll(true);
        }
    }

    // 设置树节点为“不可见”状态【先序遍历法】
    function setTreeVisible(allNodes) {
        //去除name的html样式
        if (allNodes.name != null) {
            allNodes.name = allNodes.name.replace(/<[^>]+>/g, "");
        }
        allNodes.visible = false;
        self.ztr.updateNode(allNodes);
        if (allNodes.children && allNodes.children.length != 0) {
            for (var i = 0; i < allNodes.children.length; i++) {
                setTreeVisible((allNodes.children)[i]);
            }
        }
    }

    // 设置当前节点及其所有上级节点为“可见”状态
    function setTreeVisible_HigherLevel(tree) {
        tree.visible = true;
        if (tree.getParentNode() != null) {
            setTreeVisible_HigherLevel(tree.getParentNode());
        }
    }

    // 设置树节点为“可见”状态【先序遍历法】
    function setTreeVisible_LowerLevel(tree) {
        tree.visible = true;
        if (tree.children && tree.children.length != 0) {
            for (var i = 0; i < tree.children.length; i++) {
                setTreeVisible_LowerLevel((tree.children)[i]);
            }
        }
    }
    //树状图每点一次check触发一次
    function zTreeOnCheck() {
        setCheckChoiceModel(function (da) {
            models.gridModel.show(root.find('[data-id="choiceGrid"]'), da);
        })
    }
    function setCheckChoiceModel(callback) {
        var choiceArray = self.ztr.getNodesByParam("checked", true);
        var array = [];
        var useridStr = "";
        var usernameStr = "";
        var userdepartmentStr = "";
        if (choiceArray.length == 0) {
            callback([]);
            return;
        }
        for (var i = 0 ; i < choiceArray.length; i++) {
            if ((choiceArray[i].isParent == false) && (choiceArray[i].ParentId != '0')) {
                var choiceModel = { name: "", id: "", ParentId: "", departmentName: "" };

                if (choiceArray[i].name != null) {
                    choiceModel.name = choiceArray[i].name.replace(/<[^>]+>/g, "");
                } else {
                    choiceModel.name = choiceArray[i].name;
                }
                var node = self.ztr.getNodesByParam("id", choiceArray[i].ParentId);
                choiceModel.departmentName = node[0].name;
                choiceModel.id = choiceArray[i].id;
                choiceModel.ParentId = choiceArray[i].ParentId;
                array.push(choiceModel);
            }
        }
        //放入全局数组中，用于确定后将所选的name与id赋到对象中
        for (var j = 0 ; j < array.length; j++) {
            useridStr += array[j].id + ";";
            usernameStr += array[j].name + ";";
            if (userdepartmentStr.indexOf(array[j].departmentName) < 0) {
                userdepartmentStr += array[j].departmentName + ";";
            }
        }
        selectData.userid = useridStr;
        selectData.username = usernameStr;
        selectData.dpname = userdepartmentStr;
        callback(array);
    }
    //首次加载树状图
    function loadData(searchType) {
        $.fxPost("UserSelectControlSvc.data?action=GetData", { FilterText: (valueAccessor.opt == true || valueAccessor.opt == false) ? "" : valueAccessor.opt }, function (res) {
            if (!res.success) {
                  $.Com.showMsg(res.msg);
                return;
            }
            var res_data = res.data;
            dpName = res_data.dpName;//部门名称
            var divTree = root.find("[data-id='treeUserSelect']");

            require(["script/ztree/jquery.ztree.exhide-3.5.js"], function () {
                self.ztr = $.fn.zTree.init(divTree, self.setting, res_data.dt);//初始化树型菜单
                //读取用户所在部门的所有人员
                if (searchType == "byUser" && (valueAccessor.opt == true || valueAccessor.opt == false)) {
                    loadDataBySearchCondition(dpName, "");
                    self.ztr.expandAll(true);
                    canRedFontFlag = true;//首次加载完成后改为false
                } else {
                    loadDataBySearchCondition("", "");
                    self.ztr.expandAll(false);
                }

                //读取已选中的信息
                if (valueAccessor.userid() != "" && valueAccessor.userid() != undefined) {
                    var useridArray = valueAccessor.userid().split(";")
                    for (var i = 0 ; i < useridArray.length - 1; i++) {
                        var node = self.ztr.getNodesByParam("id", useridArray[i]);
                        node[0].checked = true;
                        self.ztr.updateNode(node[0]);
                        self.ztr.checkNode(node[0], true, true);
                        zTreeOnCheck();
                    }
                }
            });
         
        })
    }

    this.getData = function () {
        return selectData;
    }
}

//加入用户列表的弹窗
$.Biz.UserSelectControl = function (element, valueAccessor, callback) {
    var model = new $.Biz.UserSelectControlInfor(element, valueAccessor);
    var root = null;
    var opts = {
        title: '选择用户',
        height: 730,
        width: 750,
        button: [
           {
               text: '确定', handler: function (data) {
                   var d = model.getData();
                   if (valueAccessor.userid != null) valueAccessor.userid(d.userid);
                   if (valueAccessor.departmentName != null) {
                       valueAccessor.departmentName(d.dpname);
                   }
                   if (valueAccessor.count != null && d.username != "") {
                       valueAccessor.count(d.username.split(';').length-1);
                   }
                   valueAccessor.username(d.username);
                   win.close();
               }
           },
          {
              text: '取消', handler: function () { win.close(); }
          }
        ]
    };
    //if (!valueAccessor.opt) opts.button = null;
    var win = $.iwf.showWin(opts);
    root = win.content();
    model.show(
        {
            callback: function (item) { callback(item); win.close(); }
        },
        root
     );
}