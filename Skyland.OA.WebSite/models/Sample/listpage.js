$.Biz.listpage = new function () {
    var root;
    var data;
    var wftool;



    var gridmode = $.Com.GridModel({
        beforeBind: function (vm, root) {
        }
        ,elementsCount: 10  //分页,默认5
       , edit: function (item, callback) {
            showDetail(item, callback);
         }
        , keyColumns: "EntId"//主键字段
       , columns: [
              //{ title: "Email", key: "email", data_bind: "text: email", width: "20%", sortable: true }, title默认为key，data_bind默认为key，sortable默认为true
              { title: "#", key: "number", width: "10%" },
              { title: "区县", key: "Area", width: "10%" },
              { title: "企业名称", key: "EntName", width: "40%", content: "<span class=\"btn btn-link\" data-bind=\"text:EntName,click: $root.editRow\" style=\"white-space:normal;\"></span>" },
              { title: "锅炉数量", key: "BoilerCount", width: "20%" }//,
              //{ title: "街道", key: "Street", width: "10%" },
              //{ title: "详细地址", key: "Address" }
          ]
          , filters: {
              "Area": { type: "select"},
              "EntName": { placeholder: "按名称模糊查询" },
          }
          , cssClass: " table table-striped table-bordered"
    });

    //显示弹窗
    function showDetail(item, callback) {
        var gridmode2 = $.Com.GridModel({});
        var detailmodel = $.Com.FormModel({});
        var divroot = root;
        if (UIMode != "mouse") {

            var win;
            var dlgOpts = {
                width: 800, height: 1000
            };
            //dlgOpts = $.extend({}, dlgOpts, options);

            var htmlroot = root.find("[data-id='editent']").clone();

            win = $.iwf.showWin(dlgOpts);

            $(htmlroot).appendTo(win.content());
            root.find("[data-id='editent']").hide();
            divroot = $(htmlroot);
            divroot.show();
            // model.show(win.content(), data);

        }

        detailmodel.show(divroot.find("[data-id='editform']"), item);
        gridmode2.show(divroot.find("[data-id='boilerlist']"), item.BoilerInfo);

        divroot.find("[data-id='save']").unbind();
        divroot.find("[data-id='save']").bind("click", function () {
            var data = detailmodel.getData();
            data.accInfo = gridmode2.getData();

            var dataJson = JSON.stringify(data);
            saveData(dataJson);

            //callback();
        });


    }

    //保存数据
    function saveData(dataJson) {
        //alert('数据保存成功！'); return;
        $.post('GISBoilerService.data?action=Save', { content: dataJson }, function (res) {
            alert(res);
        });
    }
    
    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("Forms/GIS/boiler/listPage.html", function () {
            var areaName = ''; //
            var params = Object();
            params.area = areaName;
            params.fuelType = '';
            params.status = '';
            $.post('GISBoilerService.data?action=GetData', params, function (res) {
                var data = eval('(' + res + ')');
                if (data != undefined && data.length > 0) {
                    gridmode.show(root.find("[data-id='list']"), data);

                    root.find("[data-id='new']").bind("click", function () {
                        showDetail(data[data.length-1], function (data) { gridmode.viewModel.addRow(data); });

                    });
                }
            });

        });




    }

}();