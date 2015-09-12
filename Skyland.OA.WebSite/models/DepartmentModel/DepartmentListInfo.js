//选择用户常用语的model，就是弹出窗口的内容
$.Biz.departmentListInfo = function (el, valueAccessor) {

    el = $(el);
    var selectCallback;
    var selectNodes = [];
    var inputDpid = valueAccessor.dpid;
    var inputDpname = valueAccessor.dpname;
    var opt = valueAccessor.opt;//获取是否多选值
    var div;
    var checkImage = "<i class='fa fa-check-square-o fa-lg' style='margin-right:5px'></i>";

    var models = {};
    var root = null;

    this.show = function (module, _root) {
        if (_root) root = _root;
        if (root.children().length != 0) return;
        selectCallback = module.callback;  //选择单位回调

        root.load("models/DepartmentListInfo/DepartmentListInfo.html", function () {
            var params = {};
            $.fxPost("/FX_DepartmentSvc.data?action=GetDepartmentList", params, function (json) {
                var items = {
                    data: json.data,
                    expandbyClick: true,  //是否点击父节点展开
                    flowlayout: root.width() - 10,       //子节点的宽度
                    itemclick: function (item, element) {

                        //if (item.children.length > 0) return;
                        if (inputDpid != null) inputDpid(item.id);
                        inputDpname(item.name);//设置用户名
                        selectCallback({ dpname: item.name, dpid: item.id });
                    }
                };
                var usermenu = $("<div></div>").appendTo(root).listView2(items);
            });

        });

    }

}


//加入用户列表的弹窗
$.Biz.departmentListInfoSelect = function (element, valueAccessor, callback) {
    var model = new $.Biz.departmentListInfo(element, valueAccessor);
    var root = null;
    var opts = {
        title: '选择部门',
        height: 730,
        width: 750,
        button: [
           {
               text: '确定', handler: function (data) {
                   var mode_dpid = root.find("[data-id='mode_dpid']");
                   var mode_dpname = root.find("[data-id='mode_dpname']");
                   if (valueAccessor.dpid != null) valueAccessor.dpid(mode_dpid.val());
                   valueAccessor.dpname(mode_dpname.val());//设置用户名
                   mode_dpid.val("");
                   mode_dpname.val("");
                   win.close();
               }
           },
          {
              text: '取消', handler: function () { win.close(); }
          }
        ]
    };

    if (!valueAccessor.opt) opts.button = null;
    var win = $.iwf.showWin(opts);
    root = win.content();

    //var inputDpid = valueAccessor.dpid;
    //var inputDpname = valueAccessor.dpname;
    //var opt = valueAccessor.opt;//获取是否多选值

    //var data;
    //var params = {};
    //$.fxPost("/FX_DepartmentSvc.data?action=GetDepartmentList", params, function (json) {

    //    var items = {
    //        data: json.data,
    //        expandbyClick: true,  //是否点击父节点展开
    //        flowlayout: root.width() - 10,       //子节点的宽度
    //        itemclick: function (item, element) {
    //            if (item.children && item.children.length > 0) return;

    //            if (inputDpid != null) inputDpid(item.id);
    //            inputDpname(item.name);//设置用户名
    //            selectCallback({ username: item.name, userid: item.id });

    //            item.check = !item.check;
    //        }
    //    };

    //    var usermenu = $("<div></div>").appendTo(root).listView2(items);

    //    model.show({
    //        callback: function (item) { callback(item); win.close(); }
    //    },
    //        root
    //     );

    //});

    model.show({
        callback: function (item) { callback(item); win.close(); }
    },
            root
         );

}


