define(new function () {
    var root;
    var choiceBtn = "";//从门户中选中的按钮名称，用于门户跳转进来时，设定按钮组选中。

    //门户跳转
    this.fromGateway = function (param, type) {
        this.fromGatewayInit(param, type);
        //当此页面加载过时，门户跳转来将走到这部fromGateway函数，此时需要此函数设置按钮的选中
        setBackgoundBlue(param);
    };
    this.fromGatewayInit = function (param, type) {
        //读取数据
        loadData(param);
        //初始加载
        choiceBtn = param;
    };



    this.show = function (model, _root) {
        root = _root;
        root.css("position", "relative");
        if (root.children().length != 0) return;

        root.load("nnepb/OA/SearchAndStatic/OAReceiveDocSearchPage.html", function () {
            loadReceiveBtn();
                loadData("");
        });
    };

    //条件读取数据
    function loadData(condition) {
        var modelDIV = root.find("[data-id='receiveGrid']");
        var url = "";
        url = "nnepb/OA/SearchAndStatic/OAReceiveDocSearchGrid";
        moduleItem = { module: 'm2', model: url, fileType: condition }
        $.iwf.getModel(moduleItem.model, function (model) {
            if (typeof model == 'function') model = new model();
            modelDIV.empty();
            ko.cleanNode(modelDIV[0]);
            modelDIV.css("overflow", "auto");
            model.viewModel = undefined;
            if (!model.show) return;
            model.show(moduleItem, modelDIV);
        });
    };

    //读取按钮
    function loadReceiveBtn() {
        $.fxPost("OAReceiveDocSearchSvc.data?action=getBtnArray", "", function (ret) {
            if (!ret.success) {
                alert(ret.msg);
                return;
            }
            var btnDiv = root.find("[data-id='btnReceiveArray']");
            btnDiv.empty();
            var div = "";
            var datalist = ret.data;
            var first = { FileTypeId: "0", FileTypeName: "所有类别" };
            datalist.push(first);
            datalist.reverse();
            for (var i = 0 ; i < datalist.length; i++) {
                div = $(" <button type='button' class='btn btn-default' data-id='" + datalist[i].FileTypeId + "'>" + datalist[i].FileTypeName + "</button>");
                btnDiv.append(div);
                btnDiv.find("[data-id='" + datalist[i].FileTypeId + "']").bind("click", function () {

                    //找出div中所有的按钮，将颜色设置成白色底黑色字体
                    var buttonArray = root.find("[data-id='btnReceiveArray']")[0].getElementsByTagName("button");
                    root.find("[data-id='btnReceiveArray']").find("button").css("background-color", "#FFF");
                    root.find("[data-id='btnReceiveArray']").find("button").css("color", "#000000");
                    //将所选字段设置为有背景色并且是白色字体
                    var btnName = $(this).eq(0).context.innerHTML;
                    var data_id = $(this).eq(0).attr('data-id');
                    $(this).eq(0).attr("style", "color: white; background-color:#4BB1C0");

                    if (btnName == "所有类别") {
                        loadData("");
                    } else {
                        loadData(data_id);
                    }
                });
            }
            //初始加载，若有门户传入数据，则此数据不
            if (choiceBtn != "") {
                setBackgoundBlue(choiceBtn);
            } else {
                setBackgoundBlue("所有类别");
            }
        })
    }

    //页面初始化--按钮组颜色设置
    function setBackgoundBlue(typeName) {
        root.find("[data-id='btnReceiveArray']").find("button").each(function (index, item) {
            if (typeName == item.innerHTML) {
                //找出div中所有的按钮，将颜色设置成白色底黑色字体
                var buttonArray = root.find("[data-id='btnReceiveArray']")[0].getElementsByTagName("button");
                root.find("[data-id='btnReceiveArray']").find("button").css("background-color", "#FFF");
                root.find("[data-id='btnReceiveArray']").find("button").css("color", "#000000");
                //将所选字段设置为有背景色并且是白色字体
                $(item).css("color", "white");
                $(item).css("background-color", "#4BB1C0");
            }
        });
    }
});
