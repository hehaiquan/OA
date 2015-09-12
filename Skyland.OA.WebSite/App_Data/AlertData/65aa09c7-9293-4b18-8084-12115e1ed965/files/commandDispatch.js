//指挥调度系统
$.Gis.workSpaces.wsSysComDispatch = new function () {
    this.options = { title: "指挥调度", icon: 'fa fa-flag-o' };
    var self = this;
    self.dzspWin;//电子少盘
    self.dLayerGroup = L.layerGroup([]);//点图层组
    self.xLayerGroup = L.layerGroup([]);//线图层组
    self.mLayerGroup = L.layerGroup([]);//面图层组
    self.pointArray = { id: 0, jsonData: null, name: null, creater: parent.$.iwf.userinfo.CnName, createTime: null };//对象数组
    var mgdType = { '学校': false, '医院': false, '居民区': false, '政府部门': false, '加油站': false };
    var mgdLayer;
    var tim;
    var points = [];

    //接警侧边窗口控制
    var AlertWinManager = new function () {
        var self = this;

        var nWins = 0;//窗口数量
        var nNewedWins = 0;//已经创建过的窗口数量

        this._container = $('<div style="position: absolute; top: 88px;left:10px; width: 400px;" data-id="alertWinContainer"></div>');
        this.wins = {};

        this.add = function (alertinfo) {
            var msgbox = null;
            if (alertinfo.id in this.wins) {
                msgbox = this.wins[alertinfo.id];
                msgbox.update(alertinfo);
            }
            else {
                //if ($.Gis.root.find("[data-id='alertWinContainer']").length === 0) {
                //    this._container.appendTo($.Gis.root);
                //}
                var top = 88 + 30 * nWins + 'px',
                    left = 10 + 30 * nWins + 'px',
                    style = "border-radius:4px;border-width:1px;background:RGBA(255,255,255,0.8);position: absolute; top:" + top + ";left:" + left + "; width: 400px;",
                    opts = { style: style, index: nNewedWins },
                    container = $.Gis.root;
                msgbox = new MsgboxWin(container, opts);
                this.wins[alertinfo.id] = msgbox;
                nWins++;
                nNewedWins++;
                msgbox.show(alertinfo);
            }

        };

        this.remove = function (id) {
            if (!id in this.wins) return;
            nWins--;
            //if (nWins === 0) {
            //    this._container.remove();
            //}
            delete this.wins[id];
        };
    };

    //侧边栏显示接警详细信息
    function MsgboxWin(root, opts) {
        if (!(this instanceof arguments.callee))
            return new arguments.callee();
        var msgbox = $('<div style="' + opts.style + '"></div>').appendTo(root);
        msgbox = $(msgbox);

        var $self = this,
            modelDetail = null,
            gpsMarker = null,//定位点
            nTps = 3,//支持的文件数量
            nFiles = 10,//支持的图片数量
            index = opts.index,//窗口索引
            id = 0;//项ID 


        //监测点相关样式
        var divIcon = L.divIcon({ className: '', html: '<i class="fa fa-star fa-2x" style="color:#f00"><i>' }),
            default_text = "未命名",
            layers = L.featureGroup(),
            reports = [];//监测信息

        $.Gis.map.addLayer(layers);
        //根据id得到报告
        function _getReportById(id) {
            id = parseInt(id);
            if (isNaN(id)) return null;
            var report = null;
            $.each(reports, function (i, item) {
                if (item.id == id) {
                    report = item;
                    return false;
                }
            });
            return report;
        }
        layers.on('click', function (e) {
            var latlng = e.layer.getLatLng(),
                t_layer = null;
            layers.eachLayer(function (layer) {
                if (layer.getLatLng().equals(latlng) && layer.options.props) {
                    t_layer = layer;
                    return false;
                }
            });
            if (t_layer != null) {
                _showOpts(t_layer);
            }
        });
        this._id = null;//窗口ID
        this.show = function (alertinfo) {

            //支持拖拽，不支持则注释掉
            msgbox.draggable();

            this._id = alertinfo.id;

            msgbox.load("epb/GIS/yjflow.html #yjflow", function () {
                //_bindEvent();
                msgbox.find('.list-group-item:odd:not(:first)').toggle();
                msgbox.find('[data-id="yjMsg"]').find('[data-id="hideli"]').children("i:not(:first)").toggleClass('fa-rotate-180');
                $self.update(alertinfo);
            });
        }
        this.update = function (alertinfo) {
            if (modelDetail == null)
                modelDetail = $.Com.FormModel({
                    beforeBind: function (vm, root) {
                        vm.del = function (data, type) {
                            if (!confirm("确定要删除吗？")) return;
                            var _data = data;
                            if (type == 2) {  //涉事企业
                                var ents = ko.mapping.toJS(modelDetail.viewModel.ents);
                                _data = [];
                                for (var i = 0, len = ents.length; i < len; i++) {
                                    if (ents[i].id == data.id()) continue;
                                    _data.push(ents[i]);
                                }
                                _data = JSON.stringify(_data);
                            }
                            else if (type == 3) {  //预案
                                _data = JSON.stringify([]);
                            }
                            $.fxPost("GetGisDataSvc.data?action=UpdateSpecialItem", { guid: modelDetail.viewModel.id(), type: type, data: _data }, function (res) {
                                if (res.success) {
                                    if (type == 4)//图片
                                        modelDetail.viewModel.tps.mappedRemove(data);
                                    else if (type == 5)//附件
                                        modelDetail.viewModel.fjs.mappedRemove(data);
                                    else if (type == 3)//预警方案
                                        modelDetail.viewModel.plans.mappedRemove(data);
                                    else if (type == 2) {//涉事企业
                                        modelDetail.viewModel.ents.mappedRemove(data);
                                    }

                                }
                                else {
                                    alert("删除失败!");
                                }
                            });
                        };
                        vm.edit = function (data, type) {
                            data = ko.mapping.toJS(data);
                            data = JSON.parse(data.extendValues);
                            if (type == 3) {
                                var opts1 = { title: '选择预案', height: 800, width: 1000 };
                                var win1 = $.iwf.showWin(opts1);
                                $.Biz.EmergencyPlanPage.show({ curData: data }, win1.content());
                            }
                            else if (type == 2) {
                                var opts2 = { title: '企业信息', height: 800, width: 1000 };
                                var win2 = $.iwf.showWin(opts2);
                                $.post("Base_UnitinfoSvc.data?action=getDetail", { content: JSON.stringify(data) }, function (res) {
                                    var red = eval('(' + res + ')');
                                    red.displayflag = true;
                                    $.Biz.yyyd_detail.show(win2.content(), red);
                                });
                            }

                        };
                    }
                });

            //绑定数据
            modelDetail.show(msgbox, alertinfo);
            _bindEvent();
            _showTime();
            _loadJCDs(_updateJCD);
            _loadReports(_updateReport);
        };
        this.close = function () {
            msgbox.remove();
            if (gpsMarker) {
                $.Gis.map.removeLayer(gpsMarker);
            }
            if (layers)
                $.Gis.map.removeLayer(layers);
            AlertWinManager.remove(this._id);
        };
        //绑定事件
        function _bindEvent() {
            //设置接警状态
            msgbox.find('[data-id="alertStatus"]').bind("click", function () {
                var status = modelDetail.viewModel.status();
                //终止的接警不能再开启
                if (status != '0') { return; }
                var info = '接警终止后，不能再开启，信息也不能修改，确定终止吗?';
                if (!confirm(info)) return;
                var date_format = _getTime();
                $.fxPost('GetGisDataSvc.data?action=UpdateSpecialItem', { guid: modelDetail.viewModel.id(), type: 6, data: '1,' + date_format }, function (res) {
                    if (!(res.success)) {
                        alert("设置失败!");
                    }
                    else {
                        modelDetail.viewModel.jarq(date_format);
                        modelDetail.viewModel.status('1');
                    }
                });
            });
            //折叠
            msgbox.find('[data-id="hidemsg"]').bind("click", function () {
                if ($(this).children('i').hasClass('fa-rotate-180')) {
                    msgbox.find('[data-id="yjMsg"]').show();
                }
                else {
                    msgbox.find('[data-id="yjMsg"]').hide();
                }
                $(this).children('i').toggleClass('fa-rotate-180');
            });
            //关闭
            msgbox.find('[data-id="closemsg"]').bind('click', function () {
                $self.close();
            });
            //折叠子面板
            msgbox.find('[data-id="hideli"]').bind("click", function () {
                $(this).children('i').toggleClass('fa-rotate-180');
                var libox = $(this).parent().next();
                libox.toggle();
            });
            //修改报警资料
            msgbox.find('[data-id="alertEdit"]').bind("click", function () {
                var alertinfo = modelDetail.getData();
                alertJiejing(alertinfo);
            });
            //设置事故地点
            msgbox.find('[data-id="setPoint"]').bind("click", function () {
                $.Gis.map.once('click', function (e) {
                    var latlng = e.latlng,
                        lng = e.latlng.lng.toFixed(4),
                        lat = e.latlng.lat.toFixed(4);
                    modelDetail.viewModel.jd(lng);
                    modelDetail.viewModel.wd(lat);

                    //保存到服务器
                    var type = 1,
                        str_latlng = lng + "," + lat,
                        guid = modelDetail.viewModel.id();
                    $.fxPost('GetGisDataSvc.data?action=UpdateSpecialItem', { guid: guid, type: type, data: str_latlng }, function (res) {
                    })
                    _addMarker(latlng);
                });
            });
            //清除位置
            msgbox.find('[data-id="clearPoint"]').bind('click', function () {
                modelDetail.viewModel.jd('');
                modelDetail.viewModel.wd('');
                $.fxPost('GetGisDataSvc.data?action=UpdateSpecialItem', { guid: modelDetail.viewModel.id(), type: 1, data: ',' }, function (res) {
                })
                if (gpsMarker) {
                    $.Gis.map.removeLayer(gpsMarker);
                    gpsMarker = null;
                }
            });
            //定位
            msgbox.find('[data-id="flyto"]').bind("click", function () {
                var lat = parseFloat(modelDetail.viewModel.wd()),
                    lng = parseFloat(modelDetail.viewModel.jd()),
                    latlng = [lat, lng];
                _addMarker(latlng);
                $.Gis.map.setView(latlng);
            });
            //选择预案
            msgbox.find('[data-id="selectyuan"]').bind("click", function () {
                var opts = {
                    title: '选择预案', height: 800, width: 1400,
                    button: [{
                        text: '确定', handler: function () {
                            var selData = $.Biz.EmergencyPlanPage.getData();
                            var curSel = ko.mapping.toJS(modelDetail.viewModel.plans);
                            for (var i = 0, len = curSel.length; i < len; i++) {
                                if (selData.id == curSel[i].id) {
                                    winc.close();
                                    return;
                                }
                            }
                            var ftData = [{ name: selData.mc, id: selData.id, extendValues: JSON.stringify(selData) }];
                            // httpData = curSel.concat(ftData);//不支持过个预案，要支持反注释掉该行
                            var httpData = JSON.stringify(ftData);
                            $.fxPost('GetGisDataSvc.data?action=UpdateSpecialItem', { guid: modelDetail.viewModel.id(), type: 3, data: httpData }, function (res) {
                                if (!res.success) {
                                    alert("设置失败!");
                                }
                                else {
                                    modelDetail.viewModel.plans.splice(0, modelDetail.viewModel.plans().length);//不支持多个预案，要支持注释掉该行
                                    modelDetail.viewModel.plans.mappedCreate(ftData[0]);
                                }
                            });
                            win.close();
                        }
                    }]
                };
                var win = $.iwf.showWin(opts);
                $.Biz.EmergencyPlanPage.show({ "select": true }, win.content());
            });
            //选择涉事单位
            msgbox.find('[data-id="selectunit"]').bind("click", function () {
                var opts = {
                    title: '选择企业', height: 900, width: 1400,
                    button: [{
                        text: '确定', handler: function () {
                            var selData = $.Biz.yyyd.getData();
                            var curSel = ko.mapping.toJS(modelDetail.viewModel.ents);
                            for (var i = 0, len = curSel.length; i < len; i++) {
                                if (selData.wrydm == curSel[i].id) {
                                    win.close();
                                    return;
                                }
                            }
                            var ftData = [{ name: selData.qymc, id: selData.wrydm, extendValues: JSON.stringify(selData) }];
                            var httpData = curSel.concat(ftData);//支持多个涉事企业，要支持注释掉该行
                            httpData = JSON.stringify(httpData);
                            $.fxPost('GetGisDataSvc.data?action=UpdateSpecialItem', { guid: modelDetail.viewModel.id(), type: 2, data: httpData }, function (res) {
                                if (!res.success) {
                                    alert("设置失败!");
                                }
                                else {
                                    //modelDetail.viewModel.ents.splice(0, modelDetail.viewModel.ents().length);//支持多个涉事企业，要反支持注释掉改行
                                    modelDetail.viewModel.ents.mappedCreate(ftData[0]);
                                }
                            });
                            win.close();
                        }
                    }]
                };
                var win = $.iwf.showWin(opts);
                $.Biz.yyyd.showWin({ "select": true }, win.content());
            });
            //添加监测点
            msgbox.find('[data-id="addJCD"]').bind("click", function () {
                $.Gis.map.once('click', function (e) {
                    var latlng = e.latlng,
                        props = _newItem(1);
                    props.name = default_text
                    props.latlng = [latlng.lat, latlng.lng];
                    props.time = _getTime();
                    _addJCMarker(props, true);
                    _saveJCDSetting();
                });
            });
            //单击每个监测点
            msgbox.find("[data-id='JCDList']").on("click", 'a:even', function () {
                var data_id = parseInt($(this).attr('data-id')),
                    layer = layers.getLayer(data_id);
                $.Gis.map.setView(layer.getLatLng());
                _showOpts(layer);
            });
            //删除监测点位
            msgbox.find("[data-id='JCDList']").on("click", 'a:odd', function () {
                if (!confirm("确定要删除吗?")) return;
                var data_id = $(this).siblings('a').attr("data-id"),
                    del_t_layer = layers.getLayer(data_id);
                if (del_t_layer) {
                    layers.removeLayer(del_t_layer);
                    var latlng = del_t_layer.getLatLng(),
                        m_layer = null;
                    layers.eachLayer(function (layer) {
                        if (layer.getLatLng().equals(latlng)) {
                            m_layer = layer;
                            return false;
                        }
                    });
                    layers.removeLayer(m_layer);
                }
                _updateJCD();
                _saveJCDSetting();
            });
            //添加信息
            msgbox.find('[data-id="addReport"]').bind("click", function () {
                _showRpOpts();
            });
            msgbox.find("[data-id='ReportList']").on("click", 'a:even', function () {
                var id = parseInt($(this).attr('data-id')),
                    report = _getReportById(id);
                if (report == null) return;
                _showRpOpts(report);
            });
            msgbox.find("[data-id='ReportList']").on("click", 'a:odd', function () {
                if (!confirm("确定要删除吗?")) return;
                var id = $(this).siblings('a').attr("data-id"),
                    report = _getReportById(id);
                if (report == null) return;
                var index = reports.indexOf(report);
                reports.splice(index, 1);
                _saveReports(_updateReport);
            });
        }
        //添加定位点
        function _addMarker(latlng) {
            if (gpsMarker) {
                gpsMarker.setLatLng(latlng);
            }
            else {
                gpsMarker = L.marker(latlng).bindPopup('<b>' + modelDetail.viewModel.sjmc() + '</b>');
                $.Gis.map.addLayer(gpsMarker);
            }
        }
        //添加监测点
        function _addJCMarker(props, update) {
            //先查找相关的marker
            var textMarker = null,
                mMarker = null,
                latlng = props.latlng,
                text = props.name;
            if (latlng instanceof Array)
                latlng = L.latLng(latlng);
            layers.eachLayer(function (layer) {
                if (layer.getLatLng().equals(latlng)) {
                    if (layer.options.props)
                        textMarker = layer;
                    else
                        mMarker = layer;
                    if (textMarker && mMarker) return false;
                }
            });
            if (textMarker == null) {
                var textDivIcon = L.divIcon({
                    className: '',
                    html: '<div data-id="lbl" style="background-color:#00f;color:#fff;text-align:center;line-height:normal;width:' + text.length * 15 + 'px;">' + text + '</div>',
                    iconAnchor: [-10, 16]
                });
                mMarker = L.marker(latlng, { icon: divIcon }),
                textMarker = L.marker(latlng, { icon: textDivIcon }),
                textMarker.options.props = props;
                layers.addLayer(mMarker);
                layers.addLayer(textMarker);
            }
            else {
                mMarker.setLatLng(latlng);
                textMarker.setLatLng(latlng);
                $(textMarker._icon).find("[data-id='lbl']").text(text).css({ width: text.length * 15 });
                textMarker.options.props.name = text;
            }
            if (update)
                _updateJCD(textMarker);
        }
        //计算耗时时间
        function _showTime() {

            var $time = msgbox.find("[data-id='time']");

            if (!modelDetail.viewModel.fssj()) {
                $time.hide();
                return;
            }

            var nowTime = new Date(),
                happenedTime = new Date(modelDetail.viewModel.fssj().replace(/-/g, '/'));

            if (happenedTime == null) {
                $time.hide();
                return;
            }

            if (modelDetail.viewModel.status() != '0') { //已终结
                if (!modelDetail.viewModel.jarq()) {
                    $time.hide();
                    return;
                }
                nowTime = new Date(modelDetail.viewModel.jarq().replace(/-/g, '/'));
                if (nowTime == null) {
                    $time.hide();
                    return;
                }
            }

            var difTime = nowTime.getTime() - happenedTime.getTime();
            if (difTime < 0) {
                $time.hide();
                return;
            }

            //计算天数
            var days = Math.floor(difTime / (24 * 3600 * 1000))

            //计算出小时数
            var leave1 = difTime % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
            var hours = Math.floor(leave1 / (3600 * 1000))

            //计算相差分钟数
            var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000));

            var time = days + "天 " + hours + "时 " + minutes + " 分";
            if (modelDetail.viewModel.status() == '0') {
                time = '【未结案】已耗时:' + time;
            }
            else {
                time = '【已结案】共耗时:' + time;
            }
            $time.show();
            $time.text(time);
        }
        //更新监测点
        function _updateJCD(marker) {
            var jcdList = msgbox.find("[data-id='JCDList']"),
                $item = $('<div style="height:25px;"><a></a><a style="line-height: 25px;"><i class="fa fa-times" style="float:right"></i></a></div>');
            if (marker) {
                var $el = jcdList.find("[data-id='" + marker._leaflet_id + "']"),
                    text = '';
                if ($el.length == 0) {
                    $item.appendTo(jcdList);
                    $el = $($item.children()[0]).attr("data-id", marker._leaflet_id);
                    text = jcdList.children().length + '.';
                }
                else
                    text = $el.text().substr(0, $el.text().indexOf('.') + 1);
                $el.text(text + marker.options.props.name);
            }
            else {
                jcdList.empty();
                var index = 1;
                layers.eachLayer(function (layer) {
                    if (layer.options.props) {
                        $item = $('<div style="height:25px;"><a></a><a style="line-height: 25px;"><i class="fa fa-times" style="float:right"></i></a></div>');
                        $item.appendTo(jcdList);
                        $($item.children()[0]).attr("data-id", layer._leaflet_id).text(index + '.' + layer.options.props.name);
                        index++;
                    }
                });
            }
        }
        //更新监测信息
        function _updateReport() {
            var reportList = msgbox.find("[data-id='ReportList']"),
                $item = $('<div style="height:25px;"><a></a><a style="line-height: 25px;"><i class="fa fa-times" style="float:right"></i></a></div>');
            reportList.empty();
            var index = 1;
            $.each(reports, function (i, report) {
                var tp_item = $item.clone();
                tp_item.appendTo(reportList);
                $(tp_item.children()[0]).attr("data-id", report.id).text(index + '.' + report.name);
                index++;
            });
        }
        //监测点配置保存
        function _saveJCDSetting(callback) {
            var lstProps = [];
            layers.eachLayer(function (layer) {
                if (layer.options.props)
                    lstProps.push(layer.options.props);
            });
            var json = JSON.stringify(lstProps);
            $.fxPost('GetGisDataSvc.data?action=OperateJCSet', { data: json, guid: modelDetail.viewModel.id(), mode: 'save', type: 0 }, function (res) {
                if (!res.success) {
                    alert("保存失败!");
                }
                else {
                    if (callback) callback();
                }
            });
        }
        //监测信息保存
        function _saveReports(callback) {
            var json = JSON.stringify(reports);
            $.fxPost('GetGisDataSvc.data?action=OperateJCSet', { data: json, guid: modelDetail.viewModel.id(), mode: 'save', type: 1 }, function (res) {
                if (!res.success) {
                    alert("保存失败!");
                }
                else {
                    if (callback) callback();
                }
            });
        }
        //监测点配置信息
        function _showOpts(layer) {
            var opts = {
                title: '监测点信息',
                width: 800,
                height: 520,
                button: [{
                    text: '保存',
                    css: "btn btn-primary",
                    handler: function () {
                        props = ko.mapping.toJS(formModel.viewModel);
                        props.jcxm = vm.selectItems();
                        layer.options.props = props;
                        _addJCMarker(props, true);
                        _saveJCDSetting();
                        win.close();
                    }
                }]
            },
            formModel = $.Com.FormModel({}),
            win = $.iwf.showWin(opts),
            root = win.content(),
            vm = {
                types: ko.observableArray([]),
                items: ko.observableArray([]),
                selectType: ko.observable(layer.options.props.jcType),
                selectItem: ko.observable(),
                selectItems: ko.observableArray(layer.options.props.jcxm),
                repeat: ko.observable(),
                del: function (data) {
                    if (!confirm("确定删除该监测项目吗?")) return;
                    this.selectItems.remove(data);
                }
            };
            root.load('epb/GIS/yjflow.html [data-id="jcdSet"]', function () {
                formModel.show(root.find("[data-id='baseInfo']"), layer.options.props);
                ko.applyBindings(vm, root.find("[data-id='itemList']")[0]);
                $.fxPost('GetGisDataSvc.data?action=GetJCItems', {}, function (res) {
                    var tp_types = [];
                    $.each(res, function (index, item) {
                        if (item.itemname == '' || item.type == '')
                            return true;
                        tp_types.push(item.type);
                    });
                    $.each(tp_types, function (index, item) {
                        if (tp_types.indexOf(item) == index)
                            vm.types.push(item);
                    });
                    ko.applyBindings(vm, root.find("[data-id='itemType']")[0]);

                    root.find("[data-id='tType']").bind('change', function () {
                        vm.items.removeAll();
                        var type = vm.selectType();
                        $.each(res, function (index, item) {
                            if (item.type == type)
                                vm.items.push(item.itemname);
                        });
                        if (vm.items().length > 0)
                            vm.selectItem(vm.items()[0]);
                    });
                    root.find("[data-id='addItem']").bind('click', function () {
                        var _item = vm.selectItem(),
                            selItems = vm.selectItems(),
                            isExist = false;
                        if (!_item) {
                            vm.repeat("请先选择要检测的项目!")
                            return;
                        }
                        //查看是否已添加
                        $.each(selItems, function (index, item) {
                            if (item.itemname == _item) {
                                isExist = true;
                                return false;
                            }
                        });
                        if (isExist) {
                            vm.repeat("该项目已添加,请选择其他监测项目!")
                            return;
                        }
                        vm.repeat("");
                        var xm = _newItem(2);
                        xm.itemname = _item;
                        vm.selectItems.push(xm);
                    });
                    if (vm.types().length > 0) {
                        if (!vm.selectType())
                            vm.selectType(vm.types()[0]);
                        root.find("[data-id='tType']").trigger('change');
                    }
                });
            });
        }
        //添加信息
        function _showRpOpts(report) {
            var opts = {
                title: report ? '编辑信息' : '添加信息',
                width: 800,
                height: 600,
                button: [{
                    text: '保存',
                    css: "btn btn-primary",
                    handler: function () {
                        _saveItem();
                    }
                }]
            },
            item = {},
            type = '',//信息类别
            model = $.Com.FormModel({}),
            win = $.iwf.showWin(opts),
            root = win.content();
            _init();
            //初始化
            function _init() {
                root.load('epb/GIS/yjflow.html [data-id="rpType"],[data-id="rpInfo"]', function () {
                    //编辑模式下
                    if (report) {
                        root.find('[data-id="rpType"]').remove();//移除信息类型
                        var tp_id = (report.type == 3) ? "option1" : (report.type == 4) ? "option2" : 'option3';
                        _loadSpecTmp(tp_id)
                    }
                    else {
                        root.find("[data-id='rpType']").find(':radio').bind('change', function () {
                            _loadSpecTmp();
                        });
                        root.find("[data-id='']").bind('click', function () {
                            _addOneRecord(item, true);
                        });
                        _loadSpecTmp();
                    }
                });
            }
            function _loadSpecTmp(to_id) {
                var info = root.find("[data-id='rpInfo']");
                if (!to_id) {
                    var data_id = root.find(":radio:checked").attr("data-id"),
                        to_id = data_id.substr(1);
                }
                if (to_id == 'option1')
                    type = 3
                else if (to_id == 'option2')
                    type = 4;
                if (report)
                    item = report;
                else if (type)
                    item = _newItem(type);
                ko.cleanNode(info[0]);
                model.viewModel = null;
                info.load("epb/GIS/yjflow.html [data-id='" + to_id + "']", function () {
                    model.show(info, item);
                });
            }
            function _saveItem() {
                item = model.getData();
                if (type == 3) {
                    _uploadTp(_saveCalllback);
                }
                else {
                    _saveCalllback();
                }
            }
            function _saveCalllback() {
                if (!report) {
                    id++;
                    item.id = id;
                }
                else {
                    var t_report = _getReportById(report.id);
                    if (t_report == null) return;
                    var t_index = reports.indexOf(t_report);
                    reports.splice(t_index, 1);
                }
                reports.push(item);
                _saveReports(function () {
                    _updateReport();
                    win.close();
                });
            }
            function _uploadTp(callback) {
                var bpic = root.find("[name='_pic_']").val().length > 0 ? true : false;
                if (bpic) {
                    var str_query = "&guid=" + modelDetail.viewModel.id() + "&type=" + 4;
                    $.ajaxFileUpload({
                        url: 'GetGisDataSvc.data?action=UpdateSpecialItem' + str_query,
                        secureuri: false,
                        fileElementId: ['_pic_'],
                        dataType: 'json',
                        success: function (data, status) {
                            if (!data.data && (!(data.data instanceof Array))) {
                                return;
                            }
                            var tps = data.data;
                            for (var i = 0; i < tps.length; i++) {
                                item.tps.push(tps[i]);
                            }
                            _uploadFj(callback);
                        },
                        error: function (data, status, e) {
                            alert("图片上传失败!");
                        }
                    });
                }
                else {
                    _uploadFj(callback);
                }
            }
            function _uploadFj(callback) {
                var bfile = root.find("[name='_file_']").val().length > 0 ? true : false;
                if (bfile) {
                    var str_query = "&guid=" + modelDetail.viewModel.id() + "&type=" + 5;
                    $.ajaxFileUpload({
                        url: 'GetGisDataSvc.data?action=UpdateSpecialItem' + str_query,
                        secureuri: false,
                        fileElementId: ['_file_'],
                        dataType: 'json',
                        success: function (data, status)  //服务器成功响应处理函数
                        {
                            if (!data.data && (!(data.data instanceof Array))) {
                                return;
                            }
                            var fjs = data.data;
                            for (var i = 0; i < fjs.length; i++) {
                                item.files.push(fjs[i]);
                            }
                            callback();
                        },
                        error: function (data, status, e)//服务器响应失败处理函数
                        {
                            alert("文件上传失败!");
                        }
                    });
                }
                else {
                    callback();
                }
            }
            function _addOneRecord(item, isEdit) {
                var opt1 = {
                    title: isEdit ? '编辑信息' : '添加信息',
                    width: 500,
                    height: 400,
                    button: isEdit ? [{
                        text: '保存', css: "btn btn-primary",
                        handler: function () {
                        }
                    }] : []
                },
                model1 = $.Com.FormModel({}),
                vm = {
                    selectItem: ko.observable(),
                },
                win1 = $.iwf.showWin(opt1),
                root1 = win1.content();
                root1.load('epb/GIS/yjflow.html [data-id="yjreportedit"]', function () {

                });
            }

            function bindJC(el) {
                $.each(lstProps, function (i, props) {
                    var t_item;
                    for (var i = 0, len = item.results.length; i < len; i++) {
                        if (props.name == item.results[i].name) {
                            t_item = item.results[i];
                            break;
                        }
                    }
                    if (!t_item) {
                        t_item = _newItem(5);
                        t_item.name = props.name;
                        item.results.push(t_item);
                    }
                    var b1, results = t_item.results;
                    for (var i = 0, len = props.jcxm.length; i < len; i++) {
                        b1 = false;
                        for (var j = 0, jLen = results.length; j < jLen; j++) {
                            if (results[j].name == props.jcxm[i].itemname) {
                                b1 = true;
                                break;
                            }
                        }
                        if (!b1) {
                            var tp_item = _newItem(6);
                            tp_item.name = props.jcxm[i].itemname;
                            t_item.results.push(tp_item);
                        }
                    }
                });
            }
        }
        //加载监测点
        function _loadJCDs(callback) {
            layers.clearLayers();
            $.fxPost('GetGisDataSvc.data?action=OperateJCSet', { guid: modelDetail.viewModel.id(), mode: 'get', type: 0 }, function (res) {
                if (!(res instanceof Array)) {
                    res = res.data;
                }
                $.each(res, function (index, item) {
                    _validItem(item, 1);
                    $.each(item.jcxm, function (i, iResult) {
                        _validItem(iResult, 2);
                    });
                    _addJCMarker(item, false);
                });
                if (callback) {
                    callback();
                }
            });
        }
        //加载监测信息
        function _loadReports(callback) {
            $.fxPost('GetGisDataSvc.data?action=OperateJCSet', { guid: modelDetail.viewModel.id(), mode: 'get', type: 1 }, function (res) {
                if (!(res instanceof Array)) {
                    res = res.data;
                }
                //检测兼容性
                $.each(res, function (index, item) {
                    id++;
                    item.id = id;
                    _validItem(item, item.type);
                    if (item.type == 4) {
                        $.each(item.results, function (i, iResult) {
                            _validItem(iResult, 5);
                            $.each(iResult.results, function (j, jResult) {
                                _validItem(jResult, 6);
                            });
                        });
                    }
                    reports.push(item);
                });
                if (callback) {
                    callback();
                }
            });
        }
        //检查，为了兼容旧数据
        function _validItem(item, type) {
            var dItem = _newItem(type);
            for (var key in dItem) {
                if (!(key in item)) {
                    item[key] = dItem[key];
                }
            }
        }
        //监测类信息数据格式
        function _newItem(type) {
            var item;
            switch (type) {
                case 1://监测点的配置信息
                    item = {
                        name: '',
                        latlng: [],
                        time: '',
                        jcType: '',
                        jcxm: [],
                        description: ''
                    };
                    break;
                case 2://每一个监测项目的配置信息
                    item = {
                        itemname: ''
                    };
                    break;
                case 3:  //现场快报格式
                    item = {
                        name: '',
                        time: '',
                        type: 3,
                        description: '',
                        tps: [],
                        files: []
                    };
                    break;
                case 4://监测快报格式
                    item = {
                        name: '',
                        type: 4,
                        bs: '',//报送
                        cs: '',//抄送
                        description: '',
                        results: []//检测结果
                    };
                    break;
                case 5://每一个样品监测结果的格式
                    item = {
                        name: '',//样品名称
                        time: '',//采样时间
                        results: []
                    }
                    break;
                case 6://监测项格式
                    item = {
                        name: '',//检测项
                        result: '',
                        description: ''//说明
                    };
                    break;

            }
            return item || {};
        }
    }

    //接警
    function alertJiejing(editInfo) {
        var title = "启动";
        if (editInfo) {
            title = "保存";
        }
        var alertinfo,//接警信息结构
            no_emptys = {
                sjmc: {
                    errorText: "事件名称不能为空!"
                },
                fssj: {
                    errorText: "发生时间不能为空!"
                },
                sjdd: {
                    errorText: "事件地点不能为空!"
                },
                jjsj: {
                    errorText: "接警时间不能为空!"
                },
                jd: {
                    errorText: '经度格式错误，有效范围为-180度到180度!',
                    validate: function (val) {
                        val = parseFloat(val);
                        if (isNaN(val)) return false;
                        return val >= -180 && val <= 180;
                    }
                },
                wd: {
                    errorText: '纬度格式错误，有效范围为-90度到90度',
                    validate: function (val) {
                        val = parseFloat(val);
                        if (isNaN(val)) return false;
                        return val >= -90 && val <= 90;
                    }
                }
            },//验证字段
            alertmodel = $.Com.FormModel({}),
            opts = {
                title: '接警',
                height: 600,
                width: 900,
                mask: true,
                local: { left: 13, top: 177 },
                button: [{
                    text: title,
                    css: "btn btn-danger",
                    handler: function () {
                        alertinfo = alertmodel.getData();
                        alertinfo.jd = alertWin.find('[data-id="jd"]').val();
                        alertinfo.wd = alertWin.find('[data-id="wd"]').val();
                        if (!_validate()) return;
                        var model = JSON.stringify(alertinfo);
                        $.fxPost('GetGisDataSvc.data?action=SaveAlert', { jsonData: model }, function (res) {
                            if (res.success) {
                                AlertWinManager.add(alertinfo);
                                alertWin.close();
                            }
                            else {
                                alert(title + "失败!")
                            }
                        });
                    }
                }]
            };
        if (editInfo && editInfo.status != '0') {
            opts.button.length = 0;
        }
        var alertWin = $.iwf.showWin(opts),
            $root = alertWin.content();

        $root.load("epb/GIS/jiejing.html #div_alert", function () {
            if (editInfo) {
                alertmodel.show($root, editInfo);
                if (editInfo.status != '0') //设只读
                    $.Com.setReadOnly($root, { 'data-part': 'readonly' }, true);
            }
            else {
                $.fxPost("GetGisDataSvc.data?action=NewAlert", {}, function (data) {
                    var date_format = _getTime();
                    data.fssj = date_format;
                    data.jjsj = date_format;
                    alertinfo = data;
                    alertmodel.show($root, alertinfo);
                });
            }
        });

        //检验输入信息
        function _validate() {
            var fn = function (val) {
                return !!val;
            };
            for (var item in no_emptys) {
                if (item in alertinfo) {
                    if (no_emptys[item].validate)
                        fn = no_emptys[item].validate;
                    if (!fn(alertinfo[item])) {
                        alert(no_emptys[item].errorText);
                        return false;
                    }
                }
            }
            return true;
        }
    }

    //创建图标点
    function markPoint(st) {
        var color = "#00ff00";
        var iconhtml = '';
        iconhtml = '<div style="border-radius:14px !important; height:25px;width:25px; padding: 6px 5px;margin:2px;font-size:12px; background-color:white;">';
        //iconhtml = '<div style="border-radius:14px !important; height:25px;width:25px; padding: 6px 5px;margin:2px;font-size:12px; background-color:' + color + ';">';

        if (st.CODE == "A701")//学校
            iconhtml += '<span class="fa fa-university"></span></div>';
        else if (st.CODE == "2800")//医院
            iconhtml += '<span class="fa fa-hospital-o"></span></div>';
        //else if (st.Type == "城市趋势点")
        //    iconhtml += '<span class="fa fa-building"></span></div>';
        //else if (st.Type == "国控对照点")
        //    iconhtml += '<span class="fa fa-image"></span></div>';



        var iconsize = [30, 24];
        var icon = L.divIcon({ html: iconhtml, className: "", iconSize: iconsize });

        // var icon = L.MakiMarkers.icon({ icon: "marker-stroked", color: color, size: "m" });

        var m = L.marker([parseFloat(st.Y), parseFloat(st.X)], { icon: icon });//图标标记

        var popupContent = "<strong>" + st.NAME + "</strong><br>";

        var w = document.documentElement.clientWidth - 50;
        $pan = $("<div style='maxwidth:" + w + "px'>" + popupContent + "</div><div><span class='btn btn-circle' style='float:right' > > </span></div>");

        m.bindPopup($pan[0]).openPopup({ closeButton: false });
        //}
        //m.type = st.Type;
        return m;

    }

    //绘制敏感点
    function addMGDLayer(where) {

        if (where == "") return;
        where = where.substring(0, where.length - 3);
        if (latlng) where = '(' + where + ') and Y > ' + (latlng.lat - 0.02) + ' and Y < ' + (latlng.lat + 0.02) + ' and X > ' + (latlng.lng - 0.02) + ' and X < ' + (latlng.lng + 0.02);
        var pam = {
            tablename: "G_Agency",
            showfield: null,
            where: where
        }
        //获取数据并加载图层
        $.post('GetGisDataSvc.data?action=GetData', pam, function (res) {
            var data = eval('(' + res + ')');
            data = eval('(' + data.data + ')');
            $.each(data, function (index, poi) {
                points.push(markPoint(poi));
            });

            mgdLayer = L.layerGroup(points).addTo($.Gis.map);
            $.Gis.LayerManager.addLayer(mgdLayer, { name: '敏感点', id: 'mgd' });

        });

        ////获取数据并加载图层
        //var options = { TableName: "G_Agency", LatFieldName: "X", LngFieldName: "Y", PropertiesFields: null, IsExceptFields: false, Where: "1=1" };
        //options.Where = " isnull(X,'')<>'' and isnull(Y,'')<>'' ";
        //$.Gis.GisSer.GeojsonFeature.GetPoint(options, true, function (data) {
        //    //self.hygmData = data;
        //    $.each(data, function (index, poi) {
        //        points.push(markPoint(poi));
        //    });
        //    mgdLayer = L.layerGroup(points).addTo($.Gis.map);
        //    $.Gis.LayerManager.addLayer(mgdLayer, { name: '敏感点', id: 'mgd' });
        //});


    }

    //电子沙盘窗口
    function spWin() {

        var pointObject = { html: "", type: "" };//点对象
        var mLayer;//面
        var curNoodleindex = 0;//当前面的索引号
        var jsonM = {
            "type": "FeatureCollection",
            "features": []
        }

        var noodle = {
            "type": "Feature",
            "id": "08",
            "properties": {
                "name": "线一",
                "density": 49.33
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        //[
                        //    108.5064697265625,
                        //    22.734478924357198
                        //],
                        //[
                        //    108.59161376953123,
                        //    22.73004577306216
                        //]
                    ]
                ]
            }
        }
        //在地图上加点图标
        function addPoint(e) {
            var wd = e.latlng.lat//纬度
            var jd = e.latlng.lng//经度
            var iconsize = [30, 24];
            var icon = L.divIcon({ html: pointObject.html, className: "", iconSize: iconsize });
            var m = L.marker([parseFloat(wd), parseFloat(jd)], { icon: icon });//图标标记
            //var $pan = $("<div>你好<br/><a href='script:vod(0)'><span>一源一档</span></a></div>");
            //m.bindPopup($pan[0]);
            m.on('mousedown', function (e) {
                if (3 == e.originalEvent.which) {//右键
                    //禁用右键菜单
                    $(document).bind("contextmenu", function (e) {
                        return false;
                    });
                    $.Gis.map.removeLayer(self.dLayerGroup.getLayer(e.target._leaflet_id));
                    self.dLayerGroup.removeLayer(e.target._leaflet_id);

                } else if (1 == e.originalEvent.which) {//左键单击事件

                }
            });
            var layer = m.addTo($.Gis.map);
            self.dLayerGroup.addLayer(layer);
        }

        //在地图上加线
        function addLine(e) {
            var wd = e.latlng.lat//纬度
            var jd = e.latlng.lng//经度
            var iconsize = [30, 24];
            var icon = L.divIcon({ html: pointObject.html, className: "", iconSize: iconsize });
            var m = L.marker([parseFloat(wd), parseFloat(jd)], { icon: icon });//图标标记
            m.on('mousedown', function (e) {
                if (3 == e.originalEvent.which) {//右键
                    //禁用右键菜单
                    $(document).bind("contextmenu", function (e) {
                        return false;
                    });
                    $.Gis.map.removeLayer(self.dLayerGroup.getLayer(e.target._leaflet_id));
                    self.dLayerGroup.removeLayer(e.target._leaflet_id);

                } else if (1 == e.originalEvent.which) {//左键单击事件

                }
            });
            var layer = m.addTo($.Gis.map);
            self.dLayerGroup.addLayer(layer);
        }

        //在地图上加面
        function Noodles(e, type) {
            var wd = e.latlng.lat//纬度
            var jd = e.latlng.lng//经度

            var len = noodle.geometry.coordinates[0].length;
            if (len >= 2 && type == 0) {
                noodle.geometry.coordinates[0].splice(len - 1, 1);//移除数组元素
            }
            noodle.geometry.coordinates[0].push([jd, wd]);
            if (jsonM.features[curNoodleindex] == null) {
                jsonM.features.push(noodle);
            } else {
                jsonM.features[curNoodleindex] = noodle
            }
            if (mLayer) {
                $.Gis.map.removeLayer(mLayer);
            }
            mLayer = L.geoJson(jsonM).addTo($.Gis.map);


            //m.on('mousedown', function (e) {
            //    if (3 == e.originalEvent.which) {//右键
            //        //禁用右键菜单
            //        $(document).bind("contextmenu", function (e) {
            //            return false;
            //        });
            //        $.Gis.map.removeLayer(self.dLayerGroup.getLayer(e.target._leaflet_id));
            //        self.dLayerGroup.removeLayer(e.target._leaflet_id);

            //    } else if (1 == e.originalEvent.which) {//左键单击事件

            //    }
            //});

            //var layer = m.addTo($.Gis.map);
            //self.dLayerGroup.addLayer(layer);
        }

        //单击事件
        function onclick(e) {
            if (pointObject.type == "d") {
                addPoint(e);//在地图上加点图标
            }
            else if (pointObject.type == "x") {
                addLine(e);//在地图上加线
            } else if (pointObject.type == "m") {

                $.Gis.map.off('mousemove', onmousemove);//鼠标在地图上移动时事件
                $.Gis.map.on('mousemove', onmousemove);//鼠标在地图上移动时事件
                Noodles(e, 1);//在地图上加面
            }
        }

        //鼠标在地图上移动事件
        function onmousemove(e) {
            if (pointObject.type == "x") {
                addLine(e);//在地图上加线
            } else if (pointObject.type == "m") {
                Noodles(e, 0);//在地图上加面
            }
        }

        //$.Gis.map.on('click', onclick);//在地图添加单击事件
        $.Gis.map.on('mouseup', onclick);//在地图添加单击事件


        this.options = { key: 'dzspwin', title: '电子沙盘管理', icon: undefined };
        this.show = function (root) {

            root.load("epb/GIS/jiejingDzsp.html", function () {
                var tal = root.find("[data-id='dzsp']");//获取选项卡DIV对象
                //初始化选项卡
                tal.iwfTab({ tabchange: function (dom) { } });

                //邦定单击事件       
                tal.find("[data-id='activity-tab-d-content']").find('.btn').bind("click", function () {
                    var element = $(this);//获取当前被点击的对象
                    var children = element.children();//获取子对象，也就页面上的图标，如：<span><i class="fa fa-plus"></i>警察局</span>
                    pointObject.html = children.context.innerHTML;
                    pointObject.type = "d";
                });

                //邦定单击事件       
                tal.find("[data-id='activity-tab-x-content']").find('.btn').bind("click", function () {
                    var element = $(this);//获取当前被点击的对象
                    pointObject.html = element.attr('data-id');//获取颜色
                    pointObject.type = "x";
                });

                //邦定单击事件       
                tal.find("[data-id='activity-tab-m-content']").find('.btn').bind("click", function () {
                    var element = $(this);//获取当前被点击的对象
                    pointObject.html = element.attr('data-id');//获取颜色
                    pointObject.type = "m";
                });



                //邦定保存
                root.find("[data-id='spmcBn']").bind("click", function () {
                    var spname = root.find("[data-id='spmc']").val();
                    if ($.trim(spname) == "") { alert("名称不能空"); return; }
                    var josn = { dLayerArray: [], xLayerArray: [], mLayerArray: [] };
                    var dLayers = self.dLayerGroup.getLayers();
                    var dLayerArray = [];
                    for (var i = 0; i < dLayers.length; i++) {
                        dLayerArray.push({
                            id: dLayers[i]._leaflet_id,
                            html: dLayers[i].options.icon.options.html,
                            x: dLayers[i]._latlng.lng,
                            y: dLayers[i]._latlng.lat
                        });
                    }
                    josn.dLayerArray = dLayerArray;
                    var content = JSON.stringify(josn);
                    self.pointArray = { id: self.pointArray.id, jsonData: content, name: spname, creater: parent.$.iwf.userinfo.CnName, createTime: self.pointArray.createTime }
                    $.post('GetGisDataSvc.data?action=SaveDzspData', { JsonData: JSON.stringify(self.pointArray) }, function (res) {
                        var data = eval('(' + res + ')');
                        if (data.success) {
                            alert(data.msg);
                            self.pointArray = data.data;
                        }
                        else {
                            alert(data.msg);
                        }
                    });
                });

                //清空
                root.find("[data-id='qk']").bind("click", function () {
                    clearLayers();

                });
                //清空
                function clearLayers() {
                    if (self.dLayerGroup) {
                        var layers = self.dLayerGroup.getLayers();
                        for (var i = 0; i < layers.length; i++) {
                            $.Gis.map.removeLayer(layers[i]);
                            self.pointArray = { id: 0, jsonData: null, name: null, creater: parent.$.iwf.userinfo.CnName, createTime: null };//对象数组
                        }
                        self.dLayerGroup.clearLayers();
                    }
                    root.find("[data-id='spmc']").val(self.pointArray.name);
                }

                //加载以往沙盘
                root.find("[data-id='jzywsp']").bind("click", function () {
                    $.Biz.DzspSelectWin(function (item) {
                        clearLayers();//清空
                        var data = item;
                        self.pointArray.id = data.id;
                        self.pointArray.jsonData = data.jsonData;
                        self.pointArray.name = data.name;
                        self.pointArray.creater = data.creater;
                        self.pointArray.createTime = data.createTime;
                        var jsonData = eval('(' + self.pointArray.jsonData + ')');

                        //加载点图层
                        var josn = jsonData.dLayerArray;
                        for (var i = 0; i < josn.length; i++) {
                            var wd = josn[i].y//纬度
                            var jd = josn[i].x//经度
                            var iconsize = [30, 24];
                            var icon = L.divIcon({ html: josn[i].html, className: "", iconSize: iconsize });
                            var m = L.marker([parseFloat(wd), parseFloat(jd)], { icon: icon });//图标标记
                            m.on('mousedown', function (e) {
                                if (3 == e.originalEvent.which) {//右键
                                    ////禁用右键菜单
                                    //$(document).bind("contextmenu", function (e) {
                                    //    return false;
                                    //});
                                    $.Gis.map.removeLayer(self.dLayerGroup.getLayer(e.target._leaflet_id));
                                    self.dLayerGroup.removeLayer(e.target._leaflet_id);
                                }
                            });
                            var layer = m.addTo($.Gis.map);
                            self.dLayerGroup.addLayer(layer);
                        }
                        root.find("[data-id='spmc']").val(self.pointArray.name);

                    });
                });

                //L.geoJson(jsonText).addTo($.Gis.map);

            });

        }

        //关闭回调
        this.closeCallback = function () {
            self.dzspWin = null;
            $.Gis.map.off('mouseup', onclick);//移除地图单击事件mouseup
            $.Gis.map.off('mousemove', onmousemove);//鼠标在地图上移动时事件
            return true;
        }

    }

    //初始化子菜单
    this.show = function (element, opts) {
        var tools = [
                    {
                        title: '启动应急处置程序', text: '接警', iconCls: 'fa fa-bell-o', css: 'btn btn-primary', handler: function () { alertJiejing(); }
                    },
                    {
                        text: '预案', handler: function () { }
                    },
                    {
                        type: 'menu', title: '环境敏感点查询', text: '敏感点', show: function (menuelement, btnelement) {
                            function setCheck() {
                                var tt = "敏感点：";
                                var where = "";
                                for (var f in mgdType) {
                                    if (mgdType[f]) {
                                        if (f == "学校") where += " CODE='A701' or ";
                                        if (f == "医院") where += " CODE='2800' or ";
                                    }
                                }
                                addMGDLayer(where);
                                // tt += "]";

                                $(btnelement).children("span").first().text(tt.substr(0, tt.length - 1));
                                //  addLayer();
                            }

                            var model = new function () {
                                this.show = function (root) {
                                    if (root.children().length != 0) return;

                                    var mgdTypeTools = [{ type: 'text', text: '选择敏感点类型' }
                                            , {
                                                type: 'group', handler: function (el, data) {
                                                    mgdType[data.text] = data.checked;
                                                    setCheck();
                                                }, children: []
                                            }
                                    ]
                                    for (var f in mgdType) {
                                        //   { type: 'checkbox', name: 'ddd', checked: true, title: '在用', text: '在用', value: 'useing' }
                                        mgdTypeTools[1].children.push({ type: 'checkbox', name: 'mgdType', checked: mgdType[f], text: f, value: f });
                                    }

                                    root.append('<div style="margin: 10px "></div>').children().last().iwfToolbar({ data: mgdTypeTools });

                                }
                            }

                            menuelement.css("width", "380px")

                            model.show(menuelement);

                        }
                    },
                    {
                        text: '电子沙盘', iconCls: 'fa fa-pencil-square-o', handler: function () {
                            if (self.dzspWin == null) self.dzspWin = $.Gis.gisWin.add(new spWin());   //调用窗口创建函数
                            self.dzspWin.show();

                        }
                    },
                    {
                        text: 'GPS', iconCls: 'fa fa-car', handler: function () { $.Gis.addWS('wsGPS'); }
                    },
                    { type: 'split' },
                    {
                        type: 'menu', text: '选择事件', iconCls: 'icon-search', show: function (menuele, btnele) {
                            var model = new function () {
                                var isClick = false,
                                    gridModel = $.Com.GridModel({
                                        edit: function (item, callback) {
                                            var guid = item.id;
                                            $.fxPost("GetGisDataSvc.data?action=GetAlert", { guid: guid }, function (res) {
                                                if (!res.success) {
                                                    alert("打开失败,该信息可能已删!");
                                                }
                                                else {
                                                    var alertinfo = res.data;
                                                    AlertWinManager.add(alertinfo);
                                                }
                                            });
                                        },
                                        remove: function (row) {
                                            if (!confirm("确定要删除吗？")) return;
                                            $.fxPost('GetGisDataSvc.data?action=DeleteAlert', { guid: row.id() }, function (res) {
                                                if (res.success) {
                                                    alert("删除成功!");
                                                }
                                                else {
                                                    alert("删除失败!");
                                                }
                                            });
                                        },
                                        elementsCount: 1000,
                                        keyColumns: "id"
                                    }),
                                    allDatas = null;

                                //从服务器获取数据并展示
                                function _showDataFromSvr(ele, filter) {
                                    $.fxPost('GetGisDataSvc.data?action=GetAlertList', {}, function (res) {
                                        res.sort(function (a, b) {
                                            if (a.fssj == '' || b.fssj == '') return 1;
                                            var aTime = a.fssj.replace(/-/g, '/');
                                            var bTime = b.fssj.replace(/-/g, '/');
                                            a = new Date(aTime);
                                            b = new Date(bTime);
                                            return a == b ? 0 : (a < b ? 1 : -1);
                                        });
                                        allDatas = res;
                                        _filterData(ele, filter);
                                    });
                                }

                                //筛选数据
                                function _filterData(ele, filter) {
                                    var array = allDatas;
                                    if (filter) {
                                        array = [];
                                        for (var i = 0; i < allDatas.length; i++) {
                                            if (filter(allDatas[i])) {
                                                array.push(allDatas[i]);
                                            }
                                        }
                                    }
                                    gridModel.show(ele, array);

                                    ele.find(".contentPanel").bind("mouseover", function () {
                                        $(this).children(".right").show();
                                        //$(this).find("button").css({ "margin-top": $(this).height() / 2 - 10 });
                                    });
                                    ele.find(".contentPanel").bind("mouseout", function () {
                                        $(this).children(".right").hide();
                                    });

                                    return array;
                                }

                                this.show = function (root) {
                                    root.load('epb/GIS/jiejing.html #eventList', function () {
                                        var condition = root.find("[data-id='alertSearch']"),
                                            alert_container = root.find("[data-id='alertList']"),
                                            checked = false,//办结状态是否勾选
                                            keywords = '';//查询关键字
                                        condition.find("#filter").bind('click', function () {
                                            keywords = condition.find("#txtValue").val().trim();
                                            _filterData(alert_container, _filterFn);
                                        });
                                        condition.find("#refresh").bind('click', function () {
                                            keywords = condition.find("#txtValue").val().trim();
                                            _showDataFromSvr(alert_container, _filterFn);
                                        });
                                        condition.find("#chkstatus").change(function () {
                                            checked = $(this)[0].checked;
                                            keywords = condition.find("#txtValue").val().trim();
                                            _filterData(alert_container, _filterFn);
                                        })
                                        condition.bind("click", function () {
                                            isClick = true;
                                        });

                                        // 过滤函数
                                        function _filterFn(item) {
                                            var toShow = true;
                                            if (checked == true && item.status != '0') {
                                                toShow = false;
                                            }
                                            if (item.sjmc.indexOf(keywords) == -1 && item.fssj.indexOf(keywords) == -1) {
                                                toShow = false;
                                            }
                                            return toShow;
                                        }

                                        root.parent().bind("hide.bs.dropdown", function () {
                                            if (isClick) {
                                                isClick = false;
                                                return false;
                                            }
                                            return true;
                                        });

                                        _showDataFromSvr(alert_container, null);
                                    });
                                };
                            };
                            model.show(menuele);
                        }
                    }

        ];

        element.append('<div style="margin:0px 0px 10px 0px"></div>').children().last().iwfToolbar({ data: tools });

    }

    //非PC模式下，切换到其他菜单时，会执行该函数（实现去除该工作区的图层组）
    this.unload = function () {

    }
    function _getTime(time) {
        if (time)
            return time.replace(/-/g, '/');
        var date = new Date(),
            date_format = date.getFullYear() + "/" +
                        (date.getMonth() + 1) + "/" +
                        date.getDate() + " " +
                        date.getHours() + ":" +
                        date.getMinutes() + ":" +
                        date.getSeconds();
        return date_format;

    }
}();

