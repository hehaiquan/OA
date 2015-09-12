$.Biz.EIAExpertSelect = function (choiceData) {
    var models = {};
    var self = this;
    var root;
    var haveChoiceContent;
    var selectData;
    var oldSeletedData = choiceData;//从窗口前传来的数据需要进行处理

    models.gridModel = $.Com.GridModel({
        edit: function (item, callback) {

        }
       , keyColumns: "id"//主键字段
       , elementsCount: 99 //分页,默认5
       , beforeBind: function (vm, _rootOne) {//表格加载前
           //通过checkbox勾选数目显示按钮
           vm.toggleAssociation = function (item) {
               item.isSelected(!(item.isSelected()));
               var choiceList = [];
               var cacheData = models.gridModel.getCacheData().data;//取出表中改变的字段.
               for (var i = 0; i < cacheData.length; i++) {
                   if (cacheData[i].isSelected == true) {
                       choiceList.push(cacheData[i]);
                   }
               }

               var div = "";
               haveChoiceContent = root.find('[data-id="choiceContent"]');
               haveChoiceContent.empty();
               for (var j = 0 ; j < choiceList.length; j++) {
                   var expertid = choiceList[j].ExpertsId;
                   div = div + "<span>" + expertid + "&nbsp;&nbsp;</span>";
                   if (!isExistsExpert(expertid)) {
                       models.ExpertSelectedGridModel.viewModel.addRow(choiceList[j]);
                   }
               }
               haveChoiceContent.append(div);
               selectData = choiceList;
               return true;
           };
       }
    });
    
    models.ExpertSelectedGridModel = $.Com.GridModel({
        keyColumns: "id"//主键字段
       , elementsCount: 10  //分页,默认5
       , beforeBind: function (vm, _rootOne) {//表格加载前

       },
       edit: function (item, callback) {

       },
       remove: function (item, callback) {
        
       }
    });
    
    this.show = function(module, _root) {
        if (_root.children().length != 0)
            return;
        root = _root;
        root.load("models/CommonControl/EIAExpertSelect.html", function() {
            $.fxPost("/B_EIA_DocumentEvaluationMainSvc.data?action=GetEIAExpert", {}, function (ret) {
                var data = ret.data;
                if (data.paraEIAExpertInfoList && data.paraEIAExpertInfoList.length > 0)
                    models.gridModel.elementsCount = data.paraEIAExpertInfoList.length;
                if (data.pszjList && data.pszjList.length > 0)
                    models.ExpertSelectedGridModel.elementsCount = data.pszjList.length;
                
                models.gridModel.show(root.find('[data-role="expertGrid"]'), data.paraEIAExpertInfoList);
                models.ExpertSelectedGridModel.show(root.find('[data-role="expertSelectedGrid"]'), data.pszjList);

                var txtGetNum = root.find('[data-id="getNum"]');
                root.find('[data-id="btnMinus"]').click(function() {
                    var getnum = parseInt(txtGetNum.val());
                    if (getnum > 1)
                        txtGetNum.val(getnum - 1);
                });
                
                root.find('[data-id="btnPlus"]').click(function () {
                    var getnum = parseInt(txtGetNum.val());
                    txtGetNum.val(getnum + 1);
                });
                
               $('#selectAll').change(function () {
                   $('.chkexpert').prop("checked", $(this).prop("checked"));
               });
                
               root.find('[data-id="btnKSZJ"]').click(function () {
                   var expertidarr = new Array();
                   $('.chkexpert').each(function (i, item) {
                       if ($(item).prop("checked"))
                           expertidarr.push($(item).val());
                   });
                   if (expertidarr.length == 0) {
                         $.Com.showMsg("请先在专家库选择符合条件的专家再抽取！");
                       return;
                   }
                   var extractedExpertIds = getExtractExpertIds(expertidarr);
                   var len = extractedExpertIds.length;
                   if (len > 0)
                       addNewExpert(extractedExpertIds);

                     $.Com.showMsg("抽取完成，本次新抽取到" + len + "名专家！");
               });
            });
        });
    };

    this.getData = function() {
        return models.ExpertSelectedGridModel.getCacheData().data;
    };

    //判断以抽取专家列表中是否已存在某个专家
    function isExistsExpert(expertid) {
        var existsList = models.ExpertSelectedGridModel.getCacheData().data;
        for (var i = 0; i < existsList.length; i++) {
            if (existsList[i].ExpertsId == expertid) {
                return true;
            } else
                continue;
        }
        
        if (oldSeletedData && oldSeletedData.data && oldSeletedData.data.length > 0) {
            for (var j = 0; j < oldSeletedData.data.length; j++) {
                if (oldSeletedData.data[j].ExpertsId == expertid) {
                    return true;
                } else
                    continue;
            }
        }
        return false;
    }
    
    function getSelectExpert(expertid) {
        var choiceList = [];
        var cacheData = models.gridModel.getCacheData().data;
        for (var i = 0; i < cacheData.length; i++) {
            if (cacheData[i].ExpertsId == expertid) {
                choiceList.push(cacheData[i]);
            }
        }
        return choiceList;
    }

    function getExtractExpertIds(srcexpertids) {
        var srclen = srcexpertids.length;
        var extractedids = "";
        var getnum = parseInt(root.find('[data-id="getNum"]').val());
        var notExtractExpertIds = new Array();//保存未抽取过的专家
        for (var m = 0; m < srclen; m++) {
            if (!isExistsExpert(srcexpertids[m])) {//判断并过滤掉抽取过的专家
                notExtractExpertIds.push(srcexpertids[m]);
            }
        }

        var nlen = notExtractExpertIds.length;
        if (nlen <= getnum) {//如果选择的专家中，未抽取过的专家数量小于或等于要抽取的数量（getnum），则直接返回，无需随机抽取
            return notExtractExpertIds;
        }

        //当选择的专家中，未抽取过的专家数量大于要抽取的数量（getnum），则开始随机抽取
        for (var i = 0; i < nlen; i++) {
            //Math.random();//生成一个0-1之间的随机数
            //Math.random()*(200-50);//生成一个0-150之间的随机数
            //Math.random()*(200-50)+50;//生成一个50-200之间的随机数
            var n = Math.floor(((nlen - 1) - 0 + 1) * Math.random() + 0);
            var id = notExtractExpertIds[n];
            if (extractedids.length > 0) {
                var hasidArr = extractedids.split(";");
                if (hasidArr.length == getnum)
                    break;
            }
            if (extractedids.indexOf(id) == -1) {
                if (extractedids.length == 0)
                    extractedids = id;
                else
                    extractedids += ";" + id;
            } else { //如果专家已存在，则重置计数i为0，直到获取不同三个专家为止
                i = 0;
            }
        }
        return extractedids.split(";");
    }

    function addNewExpert(extractedExpertIds) {
        var cacheData = models.gridModel.getCacheData().data;
        var elen = extractedExpertIds.length;
        var alen = cacheData.length;
        for (var i = 0; i < elen; i++) {
            for (var j = 0; j < alen; j++) {
                if (extractedExpertIds[i] == cacheData[j].ExpertsId) {
                    models.ExpertSelectedGridModel.viewModel.addRow(cacheData[j]);
                }
            }
        }
    }
};
//加入放入的文件
$.Biz.EIAExpertSelectWin = function (callback, choiceData) {
    var model = new $.Biz.EIAExpertSelect(choiceData);
    var root = null;
    var catelog = [];
    var fullNameList;
    var opts = {
        title: '评审专家抽取', height: 700, width: 1000,
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
    root = win.content();
    model.show(
        { callback: function (item) { callback(item); win.close(); } },
        root
  );
};