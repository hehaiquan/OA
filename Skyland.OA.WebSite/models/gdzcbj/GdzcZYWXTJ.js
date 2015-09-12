//$.iwf.register(new function () {
//    var me = this;
//    //this.options = { key: 'gdzcZYWXTJ' };
//    //this.show = function (module, root) {
//    //    $.Biz.gdzcZYWXTJ.show(module, root);
//    //}
//});

////$.Biz.gdzcZYWXTJ = new function () {
////    var root;
////    var curData;
////    var gridModel;
////    var goodsInforModel = $.Com.FormModel({});//物品信息
////    var goodsStatuModel = $.Com.FormModel({});//物品状态记录填写
////    var newGoodsInforModel = $.Com.FormModel({})
////    this.show = function (module, _root) {
////        root = _root;
////        if (root.children().length != 0) return;
////        root.load("models/gdzcbj/GdzcZYWXTJ.html", function () {
////            //tab设置
////            var tal = root.find("[data-id='talDiv']");
////            tal.iwfTab(
////                {
////                    stretch: true,
////                    tabchange: function (dom) {

////                    }
////                }
////            );
////            searchData();

////            //取消事件绑定事件
////            root.find("[data-id='save']").bind("click", function () {
////                var ad_GoodsInforModel = goodsInforModel.getData();
////                var ad_GoodsStatuModel = goodsStatuModel.getData();
////                var ad_NewGoodsInforModel = newGoodsInforModel.getData();
////                saveData(ad_GoodsInforModel, ad_GoodsStatuModel, ad_NewGoodsInforModel);
////            });
////        });
////    }

////    // 查询数据
////    function searchData() {
////        var content = "";
////        $.fxPost("B_GoodsSvc.data?action=SearchGoods", content, function (ret) {
////            if (ret.data.dataList) {
////                data = ret;
////                    gridModel = $.Com.GridModel({
////                    elementsCount: 10
////                   , edit: function (item, callback) {
////                       //物品信息tab绑定对象
////                       goodsInforModel.show(root.find("[data-id='detailent']"), item);
////                       //物品状态记录填写记录tab绑定对象
////                       GetGoodsModel(item,event.srcElement.id);
////                       //绑定tab窗体切换
////                       if (event.srcElement.id == 'content') {//物品信息Tab
////                           root.find("[data-id='activity-tab-ProjectTab_a']").click();
////                           return;
////                       }
////                       else if (event.srcElement.id == 'borrow') {//借用Tab
                         
////                           root.find("[data-id='activity-tab-ProjectTab_e']").click();
////                           item.wpzt = '2';
////                           return;
////                       } else if (event.srcElement.id == 'change') {//转移Tab
////                           root.find("[data-id='activity-tab-ProjectTab_e']").click();
////                           item.wpzt = '3';
////                           return;
////                       } else if (event.srcElement.id == 'fix') {//维修Tab
////                           root.find("[data-id='activity-tab-ProjectTab_e']").click();
////                           item.wpzt = '4';
////                           return;
////                       }

////                   }
////                   , remove: function (row) {
                      
////                   }
////                   , keyColumns: "id"

////                    });

////                    gridModel.show(root.find("[data-id='list']"), ret.data.dataList);
////            }
////        })
////    }
////    //物品状态信息填写的绑定 
////    //item选中的物品信息
////    //idName按下按钮Id
////    function GetGoodsModel(item,idName) {
////        $.fxPost("B_GoodsSvc.data?action=GetB_GoodsStatusRecordModel", "", function (ret) {
////            if (idName == 'borrow') {
////                var item2 = item;
////                item2.wpzt = '2';
////                newGoodsInforModel.show(root.find("[data-id='goodsStatusWrite1']"), item2);//写入物品状态填写
////            } else if (idName == 'change') {
////                var item2 = item;
////                item2.wpzt = '3';
////                newGoodsInforModel.show(root.find("[data-id='goodsStatusWrite1']"), item2);//写入物品状态填写
////            } else if (idName == 'fix') {
////                var item2 = item;
////                item2.wpzt = '4';
////                newGoodsInforModel.show(root.find("[data-id='goodsStatusWrite1']"), item2);//写入物品状态填写
////            }
////            goodsStatuModel.show(root.find("[data-id='goodsStatusWrite2']"), ret.data);// 空出模板让用户填写
////            });
////    }
////    //保存数据
////    function  saveData(ad_GoodsInforModel, ad_GoodsStatuModel, ad_NewGoodsInforModel){
////        if (ad_GoodsInforModel == null || ad_GoodsInforModel == "" || ad_GoodsStatuModel == null || ad_GoodsStatuModel == "" || ad_NewGoodsInforModel == "" || ad_NewGoodsInforModel == null) return;
////        $.post("B_GoodsSvc.data?action=UpdateGoodsStatus", { goodsInforModel: JSON.stringify(ad_GoodsInforModel), goodsStatuModel: JSON.stringify(ad_GoodsStatuModel), 
////            newGoodsInforModel: JSON.stringify(ad_NewGoodsInforModel), userName: parent.$.iwf.userinfo.CnName}, function (res) {
////                var json = eval('(' + res + ')');
////                      $.Com.showMsg(json.msg);
////        });
////    }
////}