define(new function () {
    var root;
    var models = {};
    var haveChoiceContent;
    var selectData;
    var organization;
    var self = this;

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("nnepb/OA/CommonControl/OrganizationSelect.html", function () {
            initialModel();
            loadData();
            root.find("[data-id='addBtn']").bind("click", function () {
                showAddWind(organization);
            });
        });
    }

    function showAddWind(organization) {
        models.editModel = $.Com.FormModel({});
        var dlgOpts = {
            title: '新增', width: 500, height: 300,
            button: [
          {
              text: '确认', handler: function () {
                  var organization = models.editModel.getData();
                  var content = JSON.stringify(organization);
                  $.fxPost("B_OA_OrganizationSvc.data?action=SaveData", { content: content }, function (ret) {
                      loadData();
                      win.close();
                  });
              }
          }, {
              text: '关闭', handler: function () {
                  win.close();
              }
          }
            ]
        };
        var win = $.Com.showFormWin(organization, function () {
        }, models.editModel, root.find("[data-id='editWind']"), dlgOpts);
    }

    function initialModel() {
        models.gridModel = $.Com.GridModel({
            edit: function (item, callback) {
                showAddWind(item);
            },
            keyColumns: "id" //主键字段
    ,
            elementsCount: 10 //分页,默认5
    ,
            beforeBind: function (vm, _rootOne) { //表格加载前
                //通过checkbox勾选数目显示按钮
                vm.toggleAssociation = function (item) {
                    item.isSelected(!item.isSelected());
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
                        div = div + "<span>" + choiceList[j].fullName + "&nbsp;&nbsp;</span>";
                    }
                    haveChoiceContent.append(div);
                    return true;
                }

                vm.deleteRow = function (id) {
                    $.fxPost("B_OA_OrganizationSvc.data?action=DeleteData", { id: id() }, function (ret) {
                        loadData();
                    });
                }
            }
        });
    }

    this.getData = function() {
        selectData = root.find('[data-id="choiceContent"]')[0].innerText;
        return selectData;
    }

    function loadData() {
        $.fxPost("B_OA_OrganizationSvc.data?action=GetOrganization", {}, function (ret) {
            organization = ret.organization;
            models.gridModel.show(root.find('[data-role="organizationGrid"]'), ret.list_Organization);
        });
    }
})