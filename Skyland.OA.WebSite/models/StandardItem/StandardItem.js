

//选择排放标准，就是弹出窗口的内容
$.Biz.StandardItem = function (lx) {
    var me = this;
    var models = {};
    var root;
    var ztr;//树
    me.selectValue = null;
    me.data = null;
    var detailmodel = $.Com.FormModel({});
    var setting = {
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
                pIdKey: "ParentID",
                rootPId: "0"
                , nameCol: "name"           //设置 zTree 显示节点名称的属性名称,此处默认为name 
            }
        },
        callback: {//回调涵数
            beforeClick: function (treeId, treeNode) {//单击
                //var str = "";
                //var s = function ss(Node) {
                //    if (Node.children) {
                //        for (var i = 0; i < Node.children.length; i++) {
                //            str += "'" + Node.children[i].id + "',";
                //            if (Node.children[i].children) {
                //                if (Node.children[i].children.length > 0) { s(Node.children[i].children[0]); }
                //            }
                //        }
                //    }
                //}
                //s(treeNode)


                var zTree = $.fn.zTree.getZTreeObj("standardItemTree");
                if (treeNode.isParent) {
                    return false; //这里反回真被选中的结点才有对象值,false则没对象值
                } else {


                    var getBz;
                    function getBzNode(treeNode) {
                        var pnode = treeNode.getParentNode();
                        if (pnode) {
                            var pname = pnode.name;
                            if (pname == "国标" || pname == "地标") {
                                getBz = treeNode;
                            } else {
                                getBzNode(pnode);
                            }
                        }
                    }
                    getBzNode(treeNode);//获取二级菜单
                    var par = {
                        standardId: getBz.id,
                        id: treeNode.id,
                        isTwoMenu:"0"
                    };
                    if (treeNode.getParentNode().name == "国标" || treeNode.getParentNode().name == "地标") {
                        par.isTwoMenu = "1";
                    }
                    
                    $.fxPost("StandardItemSvc.data?action=GetStandardInfo", par, function (ret) {
                        var data = eval('(' + ret.data + ')');
                        var div = root.find("[data-id='showInfo']");
                        detailmodel.show(div, data.StandardItem[0]);
                        if (treeNode.getParentNode().name == "国标" || treeNode.getParentNode().name == "地标") {
                            root.find("[data-id='StandardCondition']").text("");
                        } else {
                            root.find("[data-id='StandardCondition']").text(treeNode.name);
                        }
                        me.selectValue = data.StandardItem[0].StandardName + "  " + (par.isTwoMenu == "0" ? data.StandardCondition[0].Name : "");
                        gridModel.show(root.find("[data-id='standardMonitorGrid']"), data.StandardMonitor);
                        return true;//这里反回真被选中的结点才有对象值,false则没对象值
                    });
                }
            }
        }
    };


    var gridModel = $.Com.GridModel({
        beforeBind: function (vm, _root) {
            vm.formatItemsName = function (ItemsName, MonitorValueType) {
                var Limit = "监测项目名称:" + ItemsName() + "|" + "监控类型:" + MonitorValueType();
                return Limit;
            };
            vm.formatLimit = function (UpperLimit, LowLimit, Units) {
                UpperLimit(UpperLimit() == null ? "" : UpperLimit());
                LowLimit(LowLimit() == null ? "" : LowLimit());
                Units(Units() == null ? "" : Units());
                var Limit = "排放上限/下限:" + UpperLimit() + "/" + LowLimit() + Units();
                return Limit;
            };
        },
        elementsCount: 10,
        edit: function (item, callback) {
            //showDetail(item, callback);
        },
        keyColumns: "MonitorID"
        , cssClass: "table table-striped table-bordered  table-condensed"
    });



    this.show = function (module, myRoot) {
        if (myRoot.children().length != 0) return;
        root = myRoot;
        var selectCallback = module.callback;  //设置回调涵数
        root.load("models/StandardItem/StandardItem.html", function () {
            $.fxPost("StandardItemSvc.data?action=GetStandardItem", {}, function (ret) {
                var div = root.find("[data-id='showInfo']");
                var data = eval('(' + ret.data + ')');
                me.data = data;
                var t = root.find("[data-id='standardItemTree']");
                ztr = $.fn.zTree.init(t, setting, data);//初始化树型菜单
                //var zTree = $.fn.zTree.getZTreeObj("standardItemTree");
                //zTree.expandAll(true); //展开全部节点
                //  zTree.checkAllNodes(false);
                //调用方法展开节点，第二个参数是：是否展开(要的就是这个)第三个参数是：是否影响全部子节点，我这里不需要。
                var node = ztr.getNodeByParam("id", "国标");
                ztr.expandNode(node, true, false);
                node = ztr.getNodeByParam("id", "地标");
                ztr.expandNode(node, true, false);
            });

            var searchObject = root.find("[data-id='searchBn']");
            searchObject.click(function () {

                var name = $.trim(root.find("[data-id='bzmc']").val());
                var zTree = root.find("[data-id='standardItemTree']");
                if (name == "") {
                    $.fn.zTree.init(zTree, setting, me.data);
                    var node = ztr.getNodeByParam("id", "国标");
                    ztr.expandNode(node, true, false);
                    node = ztr.getNodeByParam("id", "地标");
                    ztr.expandNode(node, true, false);
                } else {
                    $.fxPost("StandardItemSvc.data?action=GetStandardItem", { name: name }, function (ret) {
                        var data = eval('(' + ret.data + ')');
                        $.fn.zTree.init(zTree, setting, data);
                        //调用方法展开节点，第二个参数是：是否展开(要的就是这个)第三个参数是：是否影响全部子节点，我这里不需要。
                        var node = ztr.getNodeByParam("id", "国标");
                        ztr.expandNode(node, true, false);
                        node = ztr.getNodeByParam("id", "地标");
                        ztr.expandNode(node, true, false);
                    });
                }
                //var hiddenNodes = zTree.getNodesByParam("isHidden", true);
                //if (hiddenNodes) {
                //    zTree.showNodes(hiddenNodes);
                //}

                //var searchForName = selectObject.val().$trim()
                //if (!searchForName || searchForName == "") {
                //    return;
                //}
                //var nodes = zTree.getNodesByFilter(function (node) {
                //    if (!node.isParent && node.name.indexOf(searchForName) == -1) {
                //        return true;
                //    }
                //    return false;
                //});
                //zTree.hideNodes(nodes); //hide child node
            });
        });

    };
};
//选择排放标准表的弹窗
$.Biz.StandardItemSelect = function (lx, callback) {

    var model = new $.Biz.StandardItem(lx);
    var opts = {
        title: '排放标准列表', height: 1000, width: 1250,
        button: [
           {
               text: '确定', handler: function (data) {
                   //var node = root.find("[data-id='nodeName']");
                   callback({ StandardName: model.selectValue });
                   //node.val("");
                   root.close();
               }
           },
           {
               text: '取消', handler: function () { root.close(); }
           }
        ]
    };
    var win = $.iwf.showWin(opts);//弹窗口
    var root = win;
    model.show(
        {
            callback: function (item) { callback(item); win.close(); }
        },
        win.content()
     );
};

