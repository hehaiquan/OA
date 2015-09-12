//地图基础功能
define(function () {
    var t = {};

    //GIS量算工具
    (function () {
        t.gistools = {

            tools: {},

            curTool: null,

            map: null,

            keyfn: (function () {
                if (!window) return;
                window.document.onkeydown = function () {
                    if (!window.event) return;
                    if (window.event.keyCode == 27 || window.event.keyCode == 46) {
                        if (t.gistools.curTool && t.gistools.curTool.cancel)
                            t.gistools.curTool.cancel();
                    }
                };

            }()),//支持esc,delete键取消

            remove: function () {
                this.clear();
                if (this.control != null) {
                    this.map.removeControl(this.control);
                    this.control = null;
                }
                this.map.removeLayer(this.container);
                this.map.off('zoomend', this._updateText, this);
            },

            m_per_lat: 40075017 / 360, //广州纬度23.117，cos(23.117)*地球长半轴为广州纬线圈的周长

            m_per_lng: 40075017 / 360, //广州经线,

            container: L.featureGroup(), //容纳全部的数据

            clearCallback: null,

            control: null,

            addTo: function (map, createControl) {
                this.map = map;
                if (!map.hasLayer(this.container)) {
                    map.addLayer(this.container);
                    map.on('zoomend', this._updateText, this);
                }
                if (createControl !== false) this.create();
            },

            hasAdded: function () {
                return this.control != null;
            },

            _updateText: function () {
                var svg = this.map._pathRoot;
                if (svg == null) return;
                this.updateText(svg);
            },

            draw: function (key) {
                if (this.curTool && this.curTool.cancel) {
                    this.curTool.cancel();
                }
                this.curTool = null;
                var tool = this.tools[key];
                if (tool)
                    this.curTool = tool;
                else
                    return;
                this.curTool.draw();
            },

            clear: function (key) {
                for (var tool in this.tools) {
                    if (this.tools.hasOwnProperty(tool)) {
                        if (this.tools[tool].dispose)
                            this.tools[tool].dispose();
                    }
                }
                /*防止用户在使用某个工具的过程中点击了其它按钮导致图形文字删不掉*/
                var svg = $(this._pathRoot);
                var layers = this.container.getLayers(),
                    len = layers.length;
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        svg.find("[data-id='pathdef-" + layers[i]._leaflet_id + "']").parent().remove();
                    }
                }
                this.container.clearLayers();
                //回调
                if (this.clearCallback != null) {
                    this.clearCallback();
                    this.clearCallback = null;
                }
            },

            //获取实际距离，单位km
            getDis: function (gpt1, gpt2) {
                //var p1 = gpt2.lat - gpt1.lat;
                //var p2 = gpt2.lng - gpt1.lng;
                //this.m_per_lng = Math.cos(L.LatLng.DEG_TO_RAD * gpt1.lat) * 40075017 / 360;
                //var dis2 = p1 * p1 * this.m_per_lat * this.m_per_lat + p2 * p2 * this.m_per_lng * this.m_per_lng;
                //return (Math.sqrt(dis2) / 1000).toFixed(2);
                return (gpt1.distanceTo(gpt2) / 1000).toFixed(2);
            },

            //将指定的距离转换成m，lat指定当前转换参考的纬度，默认为纬度0
            getShpereDis: function (d, lat) {
                lat = (lat === undefined) ? 0 : lat;
                return (360 / (Math.cos(L.LatLng.DEG_TO_RAD * gpt1.lat) * 40075017)) * d;
            },

            //获取屏幕距离，单位px
            getClientDis: function (gpt1, gpt2) {
                var map = t.gistools.map;
                var _p1 = map.latLngToContainerPoint(gpt1);
                var _p2 = map.latLngToContainerPoint(gpt2);
                var p1 = _p1.x - _p2.x;
                var p2 = _p1.y - _p2.y;
                var dis2 = p1 * p1 + p2 * p2;
                return Math.sqrt(dis2);
            },

            //获取面积，openlayer算法，单位m2
            getArea: function (latLngs) {
                var pointsCount = latLngs.length,
                area = 0.0,
                d2r = L.LatLng.DEG_TO_RAD,
                p1, p2;
                if (pointsCount > 2) {
                    for (var i = 0; i < pointsCount; i++) {
                        p1 = latLngs[i];
                        p2 = latLngs[(i + 1) % pointsCount];
                        area += ((p2.lng - p1.lng) * d2r) * (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
                    }
                    area = area * 6378137.0 * 6378137.0 / 2.0;
                }
                return Math.abs(area).toFixed(1);
            },

            showText: function (curTextNode, curid, svg, text, curLine) {
                if (curTextNode != null) {
                    svg.removeChild(curTextNode);
                }
                curTextNode = L.Path.prototype._createElement('text');
                var textPath = L.Path.prototype._createElement('textPath');

                var dy = -2;
                curTextNode.setAttribute('dy', dy);

                textPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", '#' + curid);
                textPath.setAttribute("data-id", curid);
                textPath.appendChild(document.createTextNode(text));
                textPath.style.color = '#00f';
                textPath.style.fontSize = '16px';
                textPath.style.fontWeight = 'bolder';
                curTextNode.appendChild(textPath);

                svg.insertBefore(curTextNode, svg.firstChild);

                var textWidth = curTextNode.getBBox().width;
                var w1 = 0, w2 = 0;
                var geos = curLine.getLatLngs();
                var len = geos.length,
                    textIndex = 0;//记录文字的索引

                if (len == 2) {
                    w2 = t.gistools.getClientDis(geos[0], geos[1]);
                    ++textIndex;
                }
                else {
                    for (var i = 0, tlen = len - 3; i <= tlen; i++) {
                        w1 += this.getClientDis(geos[i], geos[i + 1]);
                        ++textIndex;
                    }
                    w2 = this.getClientDis(geos[len - 2], geos[len - 1]);
                    ++textIndex;
                }
                curTextNode.setAttribute('dx', w1 + ((w2 / 2) - (textWidth / 2)));
                curTextNode.setAttribute('index', textIndex);
                return curTextNode;
            },

            //地图放大缩小时要更新文字
            updateText: function (svg) {
                if (!svg.getElementsByTagName) return;
                var text_tags = svg.getElementsByTagName('text'),
                    data_id = null,
                    line_cache = {},
                    latlngs = null,
                    textIndex = -1,
                    w1 = 0,
                    w2 = 0;
                for (var i = 0, len = text_tags.length; i < len; i++) {
                    data_id = text_tags[i].getElementsByTagName('textPath')[0].getAttribute('data-id');
                    data_id = data_id.substr(8);
                    if (line_cache[data_id] != undefined)
                        latlngs = line_cache[data_id];
                    else {
                        latlngs = this.container.getLayer(data_id).getLatLngs();
                        line_cache[data_id] = latlngs;
                    }
                    if (latlngs == null) continue;
                    var index = text_tags[i].getAttribute('index');
                    if (index == null) continue;
                    textIndex = parseInt(index);
                    w1 = w2 = 0;
                    for (var j = 0; j < textIndex - 1; j++) {
                        w1 += this.getClientDis(latlngs[j], latlngs[j + 1]);
                    }
                    w2 = this.getClientDis(latlngs[textIndex - 1], latlngs[textIndex]);
                    text_tags[i].setAttribute('dx', w1 + ((w2 / 2) - (text_tags[i].getBBox().width / 2)));
                }
            },

            //创建工具条
            create: function () {
                if (this.control != null) {
                    this.map.removeControl(this.control);
                }
                Control = L.Control.extend({
                    options: {
                        position: (UIMode == "mouse") ? 'bottomleft' : 'topleft'
                    },
                    onAdd: function (map) {
                        var container = L.DomUtil.create('div', 'btn-group-vertical btn-group-sm');
                        var jq_container = $(container);//.attr("data-toggle", "buttons");
                        var point = $("<button type='button' title='点' class='btn btn-default' title='取点'>＼</button>").appendTo(jq_container);
                        var line = $("<button type='button' title='线' class='btn btn-default' title='距离量算'>＼</button>").appendTo(jq_container);
                        var polygon = $("<button type='button' class='btn btn-default' title='面积量算'>★</button>").appendTo(jq_container);
                        //var rect = $("<button type='button' class='btn btn-default' title='框选范围，按住鼠标进行托拽..'>■</button>").appendTo(jq_container);
                        var circle = $("<button type='button' class='btn btn-default' title='圆形框选'>●</button>").appendTo(jq_container);
                        var clear = $("<button type='button' class='btn btn-default' title='清除'><i class='fa fa-trash fa-2x'></i>清除</button>").appendTo(jq_container);
                        point.click(function () {
                            t.gistools.draw('point');
                        });
                        line.click(function () {
                            t.gistools.draw("polyline");
                        });
                        polygon.click(function () {
                            t.gistools.draw("polygon");
                        });
                        //rect.click(function () {
                        //    t.gistools.draw("rect");
                        //});
                        circle.click(function () {
                            t.gistools.draw("circle");
                        });
                        clear.click(function () {
                            t.gistools.clear();
                        });
                        return container;
                    }
                });
                this.control = new Control();
                this.map.addControl(this.control);
            }

        }
    }());

    t.gistools.tools.point = new function () {
        var tp_ui = null,
            posui = $("<div></div>").css({
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: 40,
                'z-index': 1000,
                color: '#fff',
                'text-align': 'center',
                'background-color': 'rgba(68,68,68,0.7)',
                'line-height': '40px'
            }).attr("data-id", "_map_click_pos");
        this.draw = function () {
            if (!t.gistools.map) return;
            t.gistools.map.on('click', mapClick);
            tp_ui = $.Gis.root.find('[data-id="_map_click_pos"]');
            if (tp_ui.length == 0) {
                var latlng = t.gistools.map.getCenter();
                tp_ui = posui;
                posui.html("<span style='margin-right:15px;'>中心经度:" + latlng.lng + "</span><span>中心纬度:" + latlng.lat + "</span>").appendTo($.Gis.root);
            }
        }
        this.cancel = function () {
            t.gistools.map.off('click', mapClick);
        }
        this.dispose = function () {
            this.cancel();
            $.Gis.setRadar(null, false);
            if (tp_ui) tp_ui.remove();
        }
        function mapClick(e) {
            var latlng = e.latlng;
            $.Gis.setRadar(latlng, true);
            tp_ui.html("<span style='margin-right:15px;'>点击经度:" + latlng.lng + "</span><span>点击纬度:" + latlng.lat + "</span>");
        }

    }

    t.gistools.tools.polyline = new function () {
        var me = this;
        this.polylines = [];
        this.lineStyle = {
            "color": "#804000",
            "weight": 3
        };

        var bText = true, //是否显示文字
            bDown = false, //鼠标是否按下
            nPoints = 0, //当前所当前所画线的点数
            curLine = null, //当前线
            curid = 'pathdef-',
            curTextNode = null;

        this.draw = function () {
            if (!t.gistools.map) return;
            _cur_reset();
            t.gistools.map.on("mousedown", _onmousedown);
            t.gistools.map.on("mousemove", _onmousemove);
            t.gistools.container.on("dblclick", _onmousedblclick);
        }
        this.cancel = function () {
            if (curLine == null) return;
            t.gistools.container.removeLayer(curLine);
            if (bText) {
                var svg = $(t.gistools.map._pathRoot);
                svg.find("[data-id='" + curid + "']").parent().remove();
            }
            _cur_reset();

        }
        this.dispose = function () {
            _cur_reset();
            var svg = $(t.gistools.map._pathRoot);
            for (var i = 0; i < this.polylines.length; i++) {
                if (bText)
                    svg.find("[data-id='pathdef-" + this.polylines[i]._leaflet_id + "']").parent().remove();
                t.gistools.container.removeLayer(this.polylines[i]);
            }
            this.polylines.length = 0;
        }

        function _onmousedown(e) {
            if (e.originalEvent.button === 1 || e.originalEvent.button === 2) return;
            if (!bDown) {
                curLine = L.polyline([e.latlng], me.lineStyle);
                t.gistools.container.addLayer(curLine);
                curid += curLine._leaflet_id;
                curLine._path.setAttribute('id', curid);
                bDown = true;
                nPoints = 1;
            }
            else {
                if (bText) {
                    curTextNode = null;
                }
                nPoints++;

            }
        }
        function _onmousemove(e) {
            if (!bDown) return;
            curLine.spliceLatLngs(nPoints, 1, e.latlng);
            if (bText) {
                var text = t.gistools.getDis(curLine.getLatLngs()[nPoints - 1], e.latlng);
                curTextNode = t.gistools.showText(curTextNode, curid, t.gistools.map._pathRoot,
                    text < 1 ? (text * 1000 + "m") : (text + "km"),
                    curLine);
            }
        }
        function _onmousedblclick(e) {
            if (!bDown) return;
            me.polylines.push(curLine);
            _cur_reset();
        }
        function _cur_reset() {
            nPoints = 0;
            bDown = false;
            curLine = null;
            curid = 'pathdef-';
            curTextNode = null;
            t.gistools.map.off("mousedown", _onmousedown);
            t.gistools.map.off("mousemove", _onmousemove);
            t.gistools.container.off("dblclick", _onmousedblclick);
        }

    };

    t.gistools.tools.circle = new function () {
        var me = this;
        this.circles = [];
        this.byStyle = {
            "color": "#804000",
            "weight": 3,
            "fillOpacity": 0.15,
            "dashArray": "5,10"
        };
        this.cusStyle = {
            "color": "#804000",
            "weight": 3,
            "fillOpacity": 0.15
        };
        var bText = true, //是否显示文字
           bDown = false, //鼠标是否按下
           curCircle = null, //当前圆
           curid = 'pathdef-',
           curTextNode = null,
           curLine = null,
           curLineStyle = {
               "color": "#00f",
               "weight": 2,
               "dashArray": "5,10"
           };

        this.draw = function () {
            if (!t.gistools.map) return;
            _cur_reset();
            t.gistools.map.on("mousedown", _onmousedown);
            t.gistools.map.on("mousemove", _onmousemove);
        }

        this.cancel = function () {
            if (curCircle == null) return;
            t.gistools.container.removeLayer(curCircle);
            if (bText) {
                t.gistools.container.removeLayer(curLine);
                var svg = $(t.gistools.map._pathRoot);
                svg.find("[data-id='" + curid + "']").parent().remove();
            }
            _cur_reset();

        }
        //根据条件画出区域
        this.drawBys = function (latlngs, radius) {
            var tp_circle,
                featureGroup = L.featureGroup();
            for (var i = 0, len = latlngs.length; i < len; i++) {
                tp_circle = L.circle(latlngs[i], radius, this.byStyle);
                featureGroup.addLayer(tp_circle);
            }
            this.circles.push(featureGroup);
            t.gistools.container.addLayer(featureGroup);

        }
        //根据指定的条件检索符合条件的地物集合
        this.search = function (layer, latlngs, radius, showFn, fn) {
            this.drawBys(latlngs, radius);
            var tp_latlng;
            var arrResult = [];
            for (var i = 0, len = latlngs.length; i < len; i++) {
                tp_latlng = latlngs[i];
                if (fn)
                    getIn(layer, tp_latlng, radius, arrResult, fn);
                else
                    getIn(layer, tp_latlng, radius, arrResult);
            }
            if (showFn)
                showFn(arrResult, t.gistools.container);
        }

        this.dispose = function () {
            _cur_reset();
            for (var i = 0, len = this.circles.length; i < len; i++) {
                t.gistools.container.removeLayer(this.circles[i]);
            }
            this.circles.length = 0;
        }
        //进行数据的搜索
        function getIn(layer, latlng, radius, arrResult, fn) {
            if (layer instanceof Array) {
                for (var i = 0, len = layer.length; i < len; i++) {
                    var lat_lng = fn(layer[i]);
                    var dis = t.gistools.getDis(lat_lng, latlng) * 1000;
                    if (dis <= radius)
                        arrResult.push(layer[i]);
                }
            }
            else if (layer instanceof L.LayerGroup) {
                var layers = layer.getLayers();
                for (var i = 0, len = layers.length; i < len; i++) {
                    if (fn)
                        arguments.callee(layers[i], latlng, radius, arrResult, fn);
                    else
                        arguments.callee(layers[i], latlng, radius, arrResult);
                }
            }
            else if (layer.getLatLng) {
                var lat_lng = layer.getLatLng();
                var dis = t.gistools.getDis(lat_lng, latlng) * 1000;
                if (dis <= radius)
                    arrResult.push(layer);
            }
            else if (layer.getBounds) {
                var rect1 = layer.getBounds();
                var rect2 = L.circle(latlng, radius).getBounds();
                if (rect2.intersects(rect1) || rect2.contains(rect1) || rect1.contains(rect2))
                    arrResult.push(layer);
            }
        }

        function _onmousedown(e) {
            if (e.originalEvent.button === 1 || e.originalEvent.button === 2) return;
            if (!bDown) {
                curCircle = L.circle(e.latlng, 0, me.cusStyle);
                t.gistools.container.addLayer(curCircle);
                if (bText) {
                    curLine = L.polyline([e.latlng], curLineStyle);
                    t.gistools.container.addLayer(curLine);
                    curid += curLine._leaflet_id;
                    curLine._path.setAttribute('id', curid);
                }
                bDown = true;
            }
            else {
                if (bText) {
                    t.gistools.container.removeLayer(curLine);
                    var svg = $(t.gistools.map._pathRoot);
                    svg.find("[data-id='pathdef-" + curLine._leaflet_id + "']").parent().remove();
                }
                var radius = t.gistools.getDis(curCircle.getLatLng(), e.latlng) * 1000;
                curCircle.setRadius(radius);
                me.circles.push(curCircle);
                _cur_reset();

            }
        }

        function _onmousemove(e) {
            if (!bDown) return;
            var radius = t.gistools.getDis(curCircle.getLatLng(), e.latlng) * 1000;
            curCircle.setRadius(radius);
            if (bText) {
                curLine.spliceLatLngs(1, 1, e.latlng);
                radius = radius < 10000 ? (radius.toFixed(2) + "m") : ((radius / 1000).toFixed(1) + "km");
                curTextNode = t.gistools.showText(curTextNode, curid, t.gistools.map._pathRoot, radius, curLine);
            }
        }

        function _cur_reset() {
            bDown = false;
            curLine = null;
            curid = 'pathdef-';
            curTextNode = null;
            curCircle = null;
            t.gistools.map.off("mousedown", _onmousedown);
            t.gistools.map.off("mousemove", _onmousemove);
        }
    };

    t.gistools.tools.polygon = new function () {
        var me = this;
        this.polygons = [];
        this.style = {
            "color": "#804000",
            "weight": 2
        };

        var bText = true, //是否显示文字
          bDown = false, //鼠标是否按下
          nPoints = 0, //当前所当前所画线的点数
          curPolygon = null,//当前多边形
          displayLabel = null;

        this.draw = function () {
            if (!t.gistools.map) return;
            _cur_reset();
            t.gistools.map.on("mousedown", _onmousedown);
            t.gistools.map.on("mousemove", _onmousemove);
            t.gistools.container.on("dblclick", _onmousedblclick);
        }

        this.cancel = function () {
            if (curPolygon == null) return;
            t.gistools.container.removeLayer(curPolygon);
            _cur_reset();
        }

        this.dispose = function () {
            _cur_reset();
            for (var i = 0; i < this.polygons.length; i++) {
                t.gistools.container.removeLayer(this.polygons[i]);
            }
            this.polygons.length = 0;
        }

        function _onmousedown(e) {
            if (e.originalEvent.button === 1 || e.originalEvent.button === 2) return;
            if (!bDown) {
                curPolygon = L.polygon([e.latlng], me.style);
                t.gistools.container.addLayer(curPolygon);
                bDown = true;
                nPoints = 1;
                if (bText) {
                    displayLabel = new L.Label();
                }
            }
            else {
                nPoints++;
            }
        }
        function _onmousemove(e) {
            if (!bDown) return;
            curPolygon.spliceLatLngs(nPoints, 1, e.latlng);
            if (bText) {
                var area = t.gistools.getArea(curPolygon.getLatLngs());
                if (area > 10000)
                    area = (area / 666.67).toFixed(1) + "亩";
                else
                    area += "m<sup>2</sup>";
                displayLabel.setLatLng(e.latlng).setContent("面积:" + area);
                if (!t.gistools.container.hasLayer(displayLabel)) {
                    t.gistools.container.addLayer(displayLabel);
                }
            }
        }
        function _onmousedblclick(e) {
            if (!bDown) return;
            me.polygons.push(curPolygon);
            _cur_reset();
        }
        function _cur_reset() {
            nPoints = 0;
            bDown = false;
            curPolygon = null;
            curid = 'pathdef-';
            curTextNode = null;
            t.gistools.map.off("mousedown", _onmousedown);
            t.gistools.map.off("mousemove", _onmousemove);
            t.gistools.container.off("dblclick", _onmousedblclick);
            //if (bText) {
            //    if (t.gistools.container.hasLayer(displayLabel))
            //        t.gistools.container.removeLayer(displayLabel);
            //}
        }
    };

    t.gistools.tools.rect = new function () {
        var me = this;
        this.rects = [];
        this.style = {
            "color": "#804000",
            "weight": 2
        };

        var curRect = null,
        bDown = false;

        this.draw = function () {
            if (!t.gistools.map) return;
            _cur_reset();
            t.gistools.map.dragging.disable();
            t.gistools.map.on("mousedown", _onmousedown);
            t.gistools.map.on("mousemove", _onmousemove);
            t.gistools.map.on("mouseup", _onmouseup);
        }
        this.dispose = function () {
            _cur_reset();
            for (var i = 0; i < this.rects.length; i++) {
                t.gistools.container.removeLayer(this.rects[i]);
            }
            this.rects.length = 0;
        }
        this.cancel = function () {
            if (curRect == null) return;
            t.gistools.container.removeLayer(curRect);
            _cur_reset();
        }
        function _onmousedown(e) {
            if (!bDown) {
                bDown = true;
                curRect = L.polygon([e.latlng], me.style);
                t.gistools.container.addLayer(curRect);
            }
        }
        function _onmousemove(e) {
            if (!bDown) return;
            if (e.originalEvent.button === 1 || e.originalEvent.button === 2) return;
            var pos0 = curRect.getLatLngs()[0];
            var dx_lng = e.latlng.lng - pos0.lng,
                dy_lat = e.latlng.lat - pos0.lat;
            var pos1 = L.latLng(pos0.lat, pos0.lng + dx_lng);
            var pos2 = L.latLng(pos0.lat + dy_lat, pos0.lng + dx_lng);
            var pos3 = L.latLng(pos0.lat + dy_lat, pos0.lng);
            curRect.spliceLatLngs(1, 3, pos1, pos2, pos3);
        }
        function _onmouseup(e) {
            if (!bDown) return;
            if (curRect.getLatLngs().length == 1) {
                me.cancel();
                return;
            }
            me.rects.push(curRect);
            _cur_reset();
        }
        function _cur_reset() {
            bDown = false;
            curRect = null;
            t.gistools.map.dragging.enable();
            t.gistools.map.off("mousedown", _onmousedown);
            t.gistools.map.off("mousemove", _onmousemove);
            t.gistools.map.off("mouseup", _onmouseup);
        }
    };

    t.gistools.tools.location = new function () {
        this.draw = function () {
            if (t.gistools.map) {
                locate(t.gistools.map, function (latlng) {
                    if ($.Gis.gpsMarker == null) {
                        $.Gis.gpsMarker = L.marker(latlng);
                    }
                    if (!t.gistools.container.hasLayer($.Gis.gpsMarker)) {
                        t.gistools.container.addLayer($.Gis.gpsMarker);
                    }
                    t.gistools.map.setView(latlng);
                });
            }
        }
        this.begin = function (map, callback) {
            locate(map, callback);
        }
        this.dispose = function () {
            if ($.Gis.gpsMarker) {
                t.gistools.container.removeLayer($.Gis.gpsMarker);
                $.Gis.gpsMarker = null;
            }
        }
        function locate(map, callback) {
            if (!map.hasEventListeners("locationfound")) {
                map.on("locationfound", function (e) {
                    var latlng = e.latlng;
                    if (callback) callback(e.latlng);
                });
            }
            var locateOptions = { watch: false, setView: false, maxZoom: 15, enableHighAccuracy: true };
            map.locate(locateOptions);
        }
    };

    //实现地图的导航功能
    (function (L) {
        L.NavBar = {
            options: {
                forwardTitle: '回到下一视图',
                backTitle: '回到上一视图',
                homeTitle: '回到最初视图'
            },

            onAdd: function (map, buttons) {
                this._map = map;

                // Set options
                if (!this.options.center) {
                    this.options.center = map.getCenter();
                }
                if (!this.options.zoom) {
                    this.options.zoom = map.getZoom();
                }
                options = this.options;

                // Add toolbar buttons
                this._homeButton = this._createButton(options.homeTitle, buttons[0], this._goHome);
                this._fwdButton = this._createButton(options.forwardTitle, buttons[1], this._goFwd);
                this._backButton = this._createButton(options.backTitle, buttons[2], this._goBack);

                // Initialize view history and index
                this._viewHistory = [{ center: this.options.center, zoom: this.options.zoom }];
                this._curIndx = 0;
                this._updateDisabled();
                this._map.once('moveend', function () { this._map.on('moveend', this._updateHistory, this); }, this);
                this._map.setView(this.options.center, this.options.zoom);
            },

            onRemove: function (map) {
                map.off('moveend', this._updateHistory, this);
            },

            _goHome: function () {
                this._map.setView(this.options.center, this.options.zoom);
            },

            _goBack: function () {
                if (this._curIndx !== 0) {
                    this._map.off('moveend', this._updateHistory, this);
                    this._map.once('moveend', function () { this._map.on('moveend', this._updateHistory, this); }, this);
                    this._curIndx--;
                    this._updateDisabled();
                    var view = this._viewHistory[this._curIndx];
                    this._map.setView(view.center, view.zoom);
                }
            },

            _goFwd: function () {
                if (this._curIndx != this._viewHistory.length - 1) {
                    this._map.off('moveend', this._updateHistory, this);
                    this._map.once('moveend', function () { this._map.on('moveend', this._updateHistory, this); }, this);
                    this._curIndx++;
                    this._updateDisabled();
                    var view = this._viewHistory[this._curIndx];
                    this._map.setView(view.center, view.zoom);
                }
            },

            _createButton: function (title, link, fn) {

                //var link = L.DomUtil.create('a', className, container);
                //link.href = '#';
                link.title = title;

                L.DomEvent
                .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
                .on(link, 'click', L.DomEvent.stop)
                .on(link, 'click', fn, this)
                .on(link, 'click', this._refocusOnMap, this);

                return link;
            },
            //zjl change 最多支持倒退20步
            _updateHistory: function () {
                var newView = { center: this._map.getCenter(), zoom: this._map.getZoom() };

                if (this._viewHistory.length >= 20) {
                    this._viewHistory.splice(1, 10);
                    if (this._curIndx <= 10) this._curIndx = 0;
                    else this._curIndx = this._curIndx - 10;
                }

                var insertIndx = this._curIndx + 1;
                this._viewHistory.splice(insertIndx, this._viewHistory.length - insertIndx, newView);
                this._curIndx++;
                // Update disabled state of toolbar buttons
                this._updateDisabled();
            },

            _setFwdEnabled: function (enabled) {
                var leafletDisabled = 'disabled';
                var fwdDisabled = 'disabled';
                if (enabled === true) {
                    L.DomUtil.removeClass(this._fwdButton, fwdDisabled);
                    L.DomUtil.removeClass(this._fwdButton, leafletDisabled);
                } else {
                    L.DomUtil.addClass(this._fwdButton, fwdDisabled);
                    L.DomUtil.addClass(this._fwdButton, leafletDisabled);
                }
            },

            _setBackEnabled: function (enabled) {
                var leafletDisabled = 'disabled';
                var backDisabled = 'disabled';
                if (enabled === true) {
                    L.DomUtil.removeClass(this._backButton, backDisabled);
                    L.DomUtil.removeClass(this._backButton, leafletDisabled);
                } else {
                    L.DomUtil.addClass(this._backButton, backDisabled);
                    L.DomUtil.addClass(this._backButton, leafletDisabled);
                }
            },

            _updateDisabled: function () {
                if (this._curIndx == (this._viewHistory.length - 1)) {
                    this._setFwdEnabled(false);
                } else {
                    this._setFwdEnabled(true);
                }

                if (this._curIndx <= 0) {
                    this._setBackEnabled(false);
                } else {
                    this._setBackEnabled(true);
                }
            },

            _refocusOnMap: function (e) {
                // if map exists and event is not a keyboard event
                if (this._map && e && e.screenX > 0 && e.screenY > 0) {
                    this._map.getContainer().focus();
                }
            }

        }
    }(L));

    return t;
});