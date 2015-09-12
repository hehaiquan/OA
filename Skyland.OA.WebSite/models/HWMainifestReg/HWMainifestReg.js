//$.Com.addScript("/script/fileupload/Skyland.FilesUpload.js");
$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'manifestreg' };
    this.show = function (module, root) {
        $.Biz.manifestreg.show(module, root);
    };
});

$.Biz.manifestreg = new function () {
    var self = this;
    var root;
    self.data = null;
    //var wftool;
    var models = {};
    var textarea = "<textarea class='form-control' name='NewsText1' data-bind='value:NewsText' rows='16'></textarea>";

    models.gridModel = $.Com.GridModel({
        keyColumns: "HWManifestID",//主键字段
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, _root) {
            vm.HWmaniCode = ko.observable();
            vm.dateStart = ko.observable();
            vm.dateEnd = ko.observable();
            vm.Type = ko.observable();
            vm.Pcom = ko.observable();
            vm.Dcom = ko.observable();

            vm.searchBtn = function() {
                $.fxPost("HWManifestRegService.data?action=SearchData", { HWmaniCode: vm.HWmaniCode(), dateStart: vm.dateStart(), dateEnd: vm.dateEnd(), Type: vm.Type(), Pcom: vm.Pcom(), Dcom: vm.Dcom ()}, function (data) {
                    for (var i = 0; i < data.data.length; i++) {
                        var item = data.data[i];
                        item.TransferTime = $.ComFun.GetFormatData(item.TransferTime, 0);
                    }
                    self.data = data.data;
                    models.gridModel.show(root.find('[data-id="hwMainiGrid"]'), self.data);

                });
            };
            vm.addBtn = function () {
                $.fxPost("HWManifestRegService.data?action=addNew", {}, function (data) {
                    data.data.mReg.TransferTime = $.ComFun.GetFormatData(data.data.mReg.TransferTime, 0);
                    data.data.mReg.C1Time = $.ComFun.GetFormatData(data.data.mReg.C1Time, 0);
                    data.data.mReg.C2Time = $.ComFun.GetFormatData(data.data.mReg.C2Time, 0);
                    data.data.mReg.ReceiveDate = $.ComFun.GetFormatData(data.data.mReg.ReceiveDate, 0);
                    
                    ManifestRegForm.show(root.find("[data-id='HWMainifestReg']"), data.data.mReg);
                    PCompanyForm.show(root.find("[data-id='Pcompany']"), data.data.PCom);
                    TCompanyForm.show(root.find("[data-id='Tcompany']"), data.data.TCom);
                    DCompanyForm.show(root.find("[data-id='Dcompany']"), data.data.DCom);
                    HWInfoForm.show(root.find("[data-id='HWInfo']"), data.data.hwInfo);
                    HWKindForm.show(root.find("[data-id='HWKind']"), data.data.hwKind);
                });
                root.find("[data-id='hwMainiGrid']").hide();
                root.find("[data-id='detailForm']").show();
           };
        },
        edit: function (item, callback) {
            var div = root.find("[data-id='newsEdit']");
            div.empty(); //删除被选元素的子元素。
            var hwmainifestid = item.HWManifestID;
            
            $.fxPost("HWManifestRegService.data?action=GetDetailData", { "hwmainifestid": hwmainifestid }, function (data) {
                data.data.mReg.TransferTime = $.ComFun.GetFormatData(data.data.mReg.TransferTime, 0);
                data.data.mReg.C1Time = $.ComFun.GetFormatData(data.data.mReg.C1Time, 0);
                data.data.mReg.C2Time = $.ComFun.GetFormatData(data.data.mReg.C2Time, 0);
                data.data.mReg.ReceiveDate = $.ComFun.GetFormatData(data.data.mReg.ReceiveDate, 0);
                if (data.data.mReg.HWManifestCode) {
                    if (data.data.mReg.HWManifestCode.length < 14) {
                        root.find("[data-id='HWManifestCode1']")[0].value = data.data.mReg.HWManifestCode.substring(0, data.data.mReg.HWManifestCode.length - 8);
                        root.find("[data-id='HWManifestCode2']")[0].value = data.data.mReg.HWManifestCode.substring(data.data.mReg.HWManifestCode.length - 8, data.data.mReg.HWManifestCode.length);
                    } else {
                        root.find("[data-id='HWManifestCode1']")[0].value = data.data.mReg.HWManifestCode.substring(0, 6);
                        root.find("[data-id='HWManifestCode2']")[0].value = data.data.mReg.HWManifestCode.substring(6, 14);
                    }
                } else {
                    root.find("[data-id='HWManifestCode1']")[0].value = "";
                    root.find("[data-id='HWManifestCode2']")[0].value = "";
                }
                
                ManifestRegForm.show(root.find("[data-id='HWMainifestReg']"), data.data.mReg);
                PCompanyForm.show(root.find("[data-id='Pcompany']"), data.data.PCom);
                TCompanyForm.show(root.find("[data-id='Tcompany']"), data.data.TCom);
                DCompanyForm.show(root.find("[data-id='Dcompany']"), data.data.DCom);
                HWInfoForm.show(root.find("[data-id='HWInfo']"), data.data.hwInfo);
                HWKindForm.show(root.find("[data-id='HWKind']"), data.data.hwKind);
            });
            root.find("[data-id='hwMainiGrid']").hide();
            root.find("[data-id='detailForm']").show();
        },
        elementsCount: 10  //分页,默认5
    });

    //产废单位Form
    var PCompanyForm = $.Com.FormModel({
        beforeBind: function (vm, _root) {
            selectUnit(vm, "selectPUnit", "PcompanyID");
        }
    });

    //运输单位Form
    var TCompanyForm = $.Com.FormModel({
        beforeBind: function (vm, _root) {
            selectUnit(vm, "selectTUnit", "TcompanyID");
        }
    });

    //处置单位Form
    var DCompanyForm = $.Com.FormModel({
        beforeBind: function (vm, _root) {
            selectUnit(vm, "selectDUnit", "DcompanyID");
        }
    });

    function selectUnit(vm,idNmae,type) {
        vm[idNmae] = function () {
            $.Biz.UnitSelectWin(function (data) {
                vm.UnitCName(data.UnitCName);
                vm.ContactTel(data.ContactTel);
                vm.UnitAddress(data.UnitAddress);
                vm.PostalCode(data.PostalCode);
                ManifestRegForm.viewModel[type](data.UnitID);
            });
        };
    }

    var HWInfoForm = $.Com.FormModel({
        beforeBind: function (vm, _root) {
            
        }
    });

    var HWKindForm = $.Com.FormModel({
        beforeBind: function (vm, _root) {
           
            if (vm.RealTransferAmount) {
                vm.RealTransferAmount(ManifestRegForm.viewModel.RealTransferAmount());
            } else {
                vm.RealTransferAmount = ko.observable(ManifestRegForm.viewModel.RealTransferAmount());
            }
            vm.selectHWInfo = function () {
                $.Biz.HWInfoSelectWin(function (data) {
                    vm.HWName(data.HWName);
                    vm.HWType(data.HWType);
                    vm.HWCharacter(data.HWCharacter);
                    HWInfoForm.viewModel.HWForm(data.HWForm);
                    HWInfoForm.viewModel.PackWay(data.PackWay);
                    HWInfoForm.viewModel.HWIngredient(data.HWIngredient);
                    HWInfoForm.viewModel.TabooMeasures(data.TabooMeasures);
                    ManifestRegForm.viewModel.HWInfoID(data.HWInfoID);
                });
            };
        }
    });

    var ManifestRegForm = $.Com.FormModel({
        beforeBind: function (vm, _root) {
            
            vm.saveBtn = function () {
                ManifestRegForm.viewModel.HWManifestCode(root.find("[data-id='HWManifestCode1']")[0].value + root.find("[data-id='HWManifestCode2']")[0].value);
                //var saveContent = { mreg: ManifestRegForm.getData(), PCompany: PCompanyForm.getData(), TCompany: TCompanyForm.getData(), DCompany: DCompanyForm.getData(), hwInfo: HWInfoForm.getData(), hwKind: HWKindForm.getData() };
                $.fxPost("HWManifestRegService.data?action=Save", "content=" + JSON.stringify(ManifestRegForm.getData()), function (data) {
                    for (var i = 0; i < self.data.length; i++) {
                        if (self.data[i].HWManifestID == vm.HWManifestID()) {
                            self.data.splice(i, 1);//移除数组元素
                            break;
                        }
                    }
                    self.data.splice(0, 0, {
                        HWManifestID: vm.HWManifestID(),
                        HWManifestCode: vm.HWManifestCode(),
                        TransferTime: vm.TransferTime(),
                        TransferType: vm.TransferType(),
                        PCompanyName: PCompanyForm.viewModel.UnitCName(),
                        DCompanyName: DCompanyForm.viewModel.UnitCName(),
                        HWType: HWKindForm.viewModel.HWType(),
                        HWName: HWKindForm.viewModel.HWName(),
                        RealTransferAmount: vm.RealTransferAmount()
                    }); //在第一位插入对象
                    models.gridModel.show(root.find('[data-id="hwMainiGrid"]'), self.data);
                    alert(data.msg);
                });
            };

            vm.returnBtn=function() {
                root.find("[data-id='hwMainiGrid']").show();
                root.find("[data-id='detailForm']").hide();
            };
        }
    });

    

    this.show = function (module, _root) {
        root = _root;
        //if (root.children().length != 0) return;
        root.load("models/HWMainifestReg/HWMainifestReg.html", function () {
            $.fxPost("HWManifestRegService.data?action=GetInitData", {}, function (data) {
                for (var i = 0; i < data.data.length; i++) {
                    var item = data.data[i];
                    item.TransferTime = $.ComFun.GetFormatData(item.TransferTime, 0);
                }
                self.data = data.data;
                models.gridModel.show(root.find('[data-id="hwMainiGrid"]'), self.data);
                
            });
            
            });
    };
};

