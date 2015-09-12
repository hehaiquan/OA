//$.Com.addScript("/script/fileupload/Skyland.FilesUpload.js");
$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'unitmanager' };
    this.show = function (module, root) {
        $.Biz.unitmanager.show(module, root);
    };
});

$.Biz.unitmanager = new function () {
    var self = this;
    var root;
    self.data = null;
    //var wftool;
    var models = {};
    var textarea = "<textarea class='form-control' name='NewsText1' data-bind='value:NewsText' rows='16'></textarea>";

    models.gridModel = $.Com.GridModel({
        keyColumns: "UnitID",//主键字段
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, _root) {
            vm.AreaCodeName = ko.observable();
            vm.CtgCodeName = ko.observable();
            vm.UnitName = ko.observable();

            vm.searchBtn = function() {
                $.fxPost("UnitManagerService.data?action=SearchData", { AreaCodeName: vm.AreaCodeName(), CtgCodeName: vm.CtgCodeName(), UnitName: vm.UnitName()}, function (data) {
                    for (var i = 0; i < data.data.length; i++) {
                        var item = data.data[i];
                    }
                    self.data = data.data;
                    models.gridModel.show(root.find('[data-id="unitManagerGrid"]'), self.data);

                });
            };
           vm.addBtn = function () {};
        },
        edit: function (item, callback) {
            var unitid = item.UnitID;
            $.fxPost("UnitManagerService.data?action=GetDetailData", { "unitid": unitid }, function (data) {
                //data.data.mMng.ProductionDate = $.ComFun.GetFormatData(data.data.mMng.ProductionDate, 0);
                UnitInfoForm.show(root.find("[data-id='UnitInfo']"), data.data);
            });
            root.find("[data-id='unitManagerGrid']").hide();
            root.find("[data-id='detailForm']").show();
        },
        remove: function (row) {
            if (!confirm("确定要删除这条数据吗？")) return false;
            $.post("UnitManagerService.data?action=DeleteData&id=" + row.UnitID(), {}, function (res) {
                var data = eval('(' + res + ')');
                if (data.success) {
                    alert(data.msg);
                    for (var i = 0; i < self.data.length; i++) {
                        if (self.data[i].UnitID == row.UnitID()) {
                            self.data.splice(i, 1);//移除数组元素
                            break;
                        }
                    }
                    return true;
                } else {
                    alert(data.msg);
                    return false;
                }
            });
        },
        elementsCount: 10  //分页,默认5
    });

    var UnitInfoForm = $.Com.FormModel({
        beforeBind: function (vm, _root) {            
            vm.saveBtn = function () {
                $.fxPost("UnitManagerService.data?action=Save", "content=" + JSON.stringify(UnitInfoForm.getData()), function (data) {
                    for (var i = 0; i < self.data.length; i++) {
                        if (self.data[i].UnitID == vm.UnitID()) {
                            self.data.splice(i, 1);//移除数组元素
                            break;
                        }
                    }
                    self.data.splice(0, 0, {
                        UnitID: vm.UnitID(),
                        AdminDivision: vm.AdminDivision(),
                        UnitCName: vm.UnitCName(),
                        OrgCode: vm.OrgCode(),
                        EconomicType: vm.EconomicType(),
                        LegalCName: vm.LegalCName(),
                        UnitCategory: "",
                        CompanyScale: vm.CompanyScale(),
                        Membership: vm.Membership(),

                        //UnitAddress: vm.UnitAddress(),
                        //Province: vm.Province(),
                        //City: vm.City(),
                        //County: vm.County(),
                        //Street: vm.Street(),
                        //PostalCode: vm.PostalCode(),
                        //IndustryCategoryL: vm.IndustryCategoryL(),
                        //IndustryCategoryM: vm.IndustryCategoryM(),
                        //IndustryCategoryS: vm.IndustryCategoryS(),
                        //Area: vm.Area(),
                        //ProductionDate: vm.ProductionDate(),
                        //RegisteredCapital: vm.RegisteredCapital(),
                        //FixedAssets: vm.FixedAssets(),
                        //CredentialsType: vm.CredentialsType(),
                        //LegalCredentialsCode: vm.LegalCredentialsCode(),
                        //LegalTel: vm.LegalTel(),
                        //ParentDepartmentName: vm.ParentDepartmentName(),
                        //CompanyEnvironment: vm.CompanyEnvironment(),
                        //ContactName: vm.ContactName(),
                        //ContactCredentialsCode: vm.ContactCredentialsCode(),
                        //ContactTel: vm.ContactTel(),
                        //ContactPhone: vm.ContactPhone(),
                        //ContactWeChat: vm.ContactWeChat(),
                        //ContactFax: vm.ContactFax(),
                        //Longitude: vm.Longitude(),
                        //Latitude: vm.Latitude(),
                        ////UnitCategory: vm.UnitCategoryCode(),
                        //HwPcompy: vm.HwPcompy(),
                        //HwCcompy: vm.HwCcompy(),
                        //HwCcompyNum: vm.HwCcompyNum(),
                        //HwDCompy: vm.HwDCompy(),
                        //HwDCompyNum: vm.HwDCompyNum(),
                        //MedclCompy: vm.MedclCompy(),
                        //MedclCompyNum: vm.MedclCompyNum(),
                        //MedclDCompy: vm.MedclDCompy(),
                        //MedclDCompyNum: vm.MedclDCompyNum(),
                        //ImptCompy: vm.ImptCompy(),
                        //SwDCompy: vm.SwDCompy(),
                        //SwDCompyNum: vm.SwDCompyNum(),
                        //EcnoCompy: vm.EcnoCompy(),
                        //EcnoCompyNum: vm.EcnoCompyNum(),
                        //TranCompy: vm.TranCompy(),
                        //TranCompyNum: vm.TranCompyNum()
                    }); //在第一位插入对象
                    models.gridModel.show(root.find('[data-id="detailForm"]'), self.data);
                    alert(data.msg);
                });
            };

            vm.returnBtn=function() {
                root.find("[data-id='unitManagerGrid']").show();
                root.find("[data-id='detailForm']").hide();
            };
        }
    });

    

    this.show = function (module, _root) {
        root = _root;
        //if (root.children().length != 0) return;
        root.load("models/UnitManager/UnitManager.html", function () {
            $.fxPost("UnitManagerService.data?action=GetInitData", {}, function (data) {
                for (var i = 0; i < data.data.length; i++) {
                    var item = data.data[i];
                }
                self.data = data.data;
                models.gridModel.show(root.find('[data-id="unitManagerGrid"]'), self.data);

                //root.find("[data-id='ctgSelect']").prepend("<option value='0'>全部</option>");
            });
            
            });
    };
};

