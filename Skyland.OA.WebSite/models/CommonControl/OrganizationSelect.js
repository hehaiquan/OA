$.Biz.OrganizationSelect = function (choiceData) {
    var models = {};
    var self = this;
    var root;
    var haveChoiceContent;
    var selectData;
    var haveSeleted = choiceData;//从窗口前传来的数据需要进行处理

    models.gridModel = $.Com.GridModel({
        edit: function(item, callback) {

        },
        keyColumns: "id" //主键字段
        ,
        elementsCount: 10 //分页,默认5
        ,
        beforeBind: function(vm, _rootOne) { //表格加载前
            //通过checkbox勾选数目显示按钮
            vm.toggleAssociation = function(item) {
                item.isSelected(!(item.isSelected()));
                var choiceList = [];
                var cacheData = models.gridModel.getCacheData().data; //取出表中改变的字段.
                for (var i = 0; i < cacheData.length; i++) {
                    if (cacheData[i].isSelected == true) {
                        choiceList.push(cacheData[i]);
                    }
                }
                var div = "";
                haveChoiceContent = root.find('[data-id="choiceContent"]');
                haveChoiceContent.empty();
                for (var j = 0; j < choiceList.length; j++) {
                    div = div + "<span>" + choiceList[j].fullName + "&nbsp;</span>";
                }
                haveChoiceContent.append(div);
                selectData = choiceList;
                return true;
            }
        }
    });

    this.show = function (module, _root) {
        if (_root.children().length != 0) return;
        root = _root;
        root.load("models/CommonControl/OrganizationSelect.html", function () {
            $.fxPost("/B_OA_SendDocSvc.data?action=GetOrganization", {}, function (ret) {
                var daraList = ret.data;
                models.gridModel.show(root.find('[data-role="organizationGrid"]'), daraList.list_Organization);
            })
        })
    }
    this.getData = function () {
        return selectData;
    }
}

//加入放入的文件
$.Biz.OrganizationSelectWin = function (callback, choiceData) {
    var model = new $.Biz.OrganizationSelect(choiceData);
    var root = null;
    var catelog = [];
    var fullNameList;
    var opts = {
        title: '组织机构', height: 730, width: 750,
        button: [
                  {
                      text: '确定', handler: function (data) {
                          var dataGet = model.getData();
                          callback(dataGet);
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
}