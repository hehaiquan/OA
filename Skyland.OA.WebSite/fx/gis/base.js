//以后图层统一默认地图已加载，即map已存在，这是基本工具栏
define(['fx/gis/baseTool', 'fx/gis/map'], function (util, mapObject) {
    var map = $.Gis.map;
    if (map == null) throw new error("地图还未初始化！");

    return new function () {
        this.options = { title: "地图", icon: 'fa fa-home' };
        var self = this;
        var root = null;

        this.show = function (ele, opts) {
            root = ele;
            var tools = [
                {
                    id: 'mapType', text: '地图', type: 'menu', handler: changeMap, children: [
                        { id: 'bj-001', text: '地图', unselectable: true },
                        { id: 'bj-002', text: '影像', unselectable: true }
                    ]
                },
               { type: 'split' },
               {
                   type: 'group', handler: function () { }, children: [
                   { id: 'dh-001', iconCls: 'fa fa-globe', title: '全图' },
                   { id: 'dh-002', iconCls: 'fa fa-arrow-left', title: '上一视图' },
                   { id: 'dh-003', iconCls: 'fa fa-arrow-right', title: '下一视图' }]
               },
               {
                   type: 'group', children: [
                        {
                            title: '在地图上点击获取位置', iconCls: 'fa fa-hand-o-up', css: 'hidden-sm hidden-xs', text: '取点', handler: function () { util.gistools.draw("point"); }
                        },
                        {
                            title: '距离量算', iconCls: 'fa fa-expand', css: 'hidden-sm hidden-xs', text: '测量', handler: function () { util.gistools.draw("polyline"); }
                        }
                        ,
                        {
                            title: '面积量算', iconCls: 'fa fa-star', css: 'hidden-sm hidden-xs', text: '面积', handler: function () { util.gistools.draw("polygon"); }
                        },
                        {
                            title: '半径量算', iconCls: 'fa fa-circle-thin', css: 'hidden-sm hidden-xs', text: '半径', handler: function () { util.gistools.draw("circle"); }
                        },
                        {
                            title: '定位', text: '定位', iconCls: 'fa fa-map-marker', handler: function () { util.gistools.draw("location"); }
                        },
                        {
                            title: '清除', iconCls: 'fa fa-trash-o', text: '清除', handler: function () { util.gistools.clear(); }
                        }]
               },
               {
                   title: '设置背景亮度', iconCls: 'fa fa-adjust', text: '蒙版', handler: function (element) {
                       var mapOpacity = null;
                       if (mapObject.getOpacity() === 1) mapOpacity = 0.5;
                       else mapOpacity = 1;
                       mapObject.setOpacity(mapOpacity);
                       $(element).toggleClass("active");
                   }
               }
            //{
            //    title: '图层管理', text: '图层管理', css: 'hidden-xs', iconCls: "fa fa-list-ul", handler: function () {
            //        if ($.Gis.gisWin && $.Gis.LayerManager && $.Gis.gisWin.wins['laymgr'] == undefined) $.Gis.gisWin.add($.Gis.LayerManager).show();
            //    }
            //}
            ];

            var toolBar = root.append('<div style="margin:0px 0px 10px 0px"></div>').children().last().iwfToolbar({ data: tools });
            init();
        };

        function init() {
            L.NavBar.onAdd(map, [root.find("[data-id='dh-001']")[0], root.find("[data-id='dh-003']")[0], root.find("[data-id='dh-002']")[0]]);
            util.gistools.addTo(map, false);
        }

        function changeMap(opt, ele) {
            var node = $(root.find('[data-id="mapType"]').children('span').children('span')[0]);
            if (node.text() === opt.text) return;
            node.text(opt.text);
            if (opt.id === 'bj-001') {
                mapObject.changeMap('txdt');
            }
            else {
                mapObject.changeMap('txyx');
            }
        }
    }

});