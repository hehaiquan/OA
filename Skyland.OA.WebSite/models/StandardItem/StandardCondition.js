//选择排放标准，就是弹出窗口的内容

$.Biz.StandardCondition = function (StandardID) {

    //el = $(el);
    //var selectCallback;
    //var selectNodes = [];
    //var inputUserid = valueAccessor.userid;
    //var inputUserName = valueAccessor.username;
    //var opt = valueAccessor.opt;//获取是否多选值
    //var checkImage = "<i class='fa fa-check-square-o fa-lg' style='margin-right:5px'></i>";
    this.show = function (module, root) {
        if (root.children().length != 0) return;
        //selectCallback = module.callback;  //选择单位回调

        root.load("models/StandardItem/StandardCondition.html", function () {
            var div = root.find("[data-id='standardConditionTree']");
            div.css("height", "100%");
            $.fxPost("/StandardItemSvc.data?action=GetStandardCondition", { standardid: StandardID }, function (json) {

                var items = {
                    data: json.data.listData,
                    expandbyClick: true,  //是否点击父节点展开
                    flowlayout:0,       //子节点的宽度
                    itemclick: function (item, element) {
                        if (item.children!=null) return;
                        root.find("[data-id='nodeName']").val(item.name);
                        item.check = !item.check;
                    }
                };

                if (div) {
                    var usermenu = $("<div></div>").appendTo(div).listView2(items);

                } else {
                    var usermenu = $("<div></div>").appendTo(el.parent()).listView2(items);
                    usermenu.css("overflow", "auto");
                    el.parent().DropdownMenu({ content: usermenu });
                }
            });

        });
    }

}



//选择标准项目的弹窗
$.Biz.StandardConditionSelect = function (StandardID, callback) {
//$.Biz.userListInfoSelect = function (element,valueAccessor, callback) {
    //var model = new $.Biz.userListInfo(element, valueAccessor);
    var model = new $.Biz.StandardCondition(StandardID);
    var opts = {
        title: '标准项目', height: 730, width: 1200,
        button: [
           {
               text: '确定', handler: function (data) {
                   var node = root.find("[data-id='nodeName']");   ;
                   callback({ StandardName: node.val() });
                   node.val("");
                   root.close();
               }
           },
           {
               text: '取消', handler: function () { root.close(); }
           }
        ]
    };

    var root = $.iwf.showWin(opts);//弹窗口
    model.show(
        {
            callback: function (item) { callback(item); root.close(); }
        },
        root.content()
     );

}
