//默认地图已加载
define(function () {
    var map = $.Gis.map;
    return {
        createLegend: function (opts) {
            var labels = opts.labels || [],//图例颜色
                colors = opts.colors || [],//图例文字
                position = opts.position || 'bottomleft',//指定位置
                html = opts.html || false,//是否使用自定义html
                hoverHtml = opts.hoverHtml;//悬浮是否有提示html
            var legend = L.control({ position: position });
            legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', '');
                try {
                    div.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                } catch (e) {
                    div.style.backgroundColor = '#EBEBEB';
                }

                div.style.paddingLeft = '5px';
                div.style.paddingRight = '5px';
                L.DomEvent.disableClickPropagation(div);
                var htmls = [];
                for (var i = 0; i < colors.length; i++) {
                    htmls.push('<span>' + labels[i] + '</span>');
                    if (typeof html === 'function') htmls.push(html(colors[i]));
                    else htmls.push('<i style="display:inline-block;height:15px;margin-bottom:-3px;width:30px;background:' + colors[i] + '"></i>&nbsp;');
                }
                div.innerHTML = htmls.join("");
                if (typeof hoverHtml === "string") {
                    var infoDiv = null,
                        pos = "right";
                    if (legend.getPosition() === "bottomleft") pos = "left";
                    L.DomEvent.on(div, "mouseover", function (e) {
                        infoDiv = L.DomUtil.create("div", "");
                        infoDiv.style.backgroundColor = "#eeeaea";
                        infoDiv.style.position = "absolute";
                        infoDiv.style.padding = "5px";
                        infoDiv.style.maxWidth = "600px";
                        infoDiv.style[pos] = "10px";
                        infoDiv.style.bottom = (map._controlCorners[legend.getPosition()].clientHeight + 5) + "px";
                        infoDiv.innerHTML = hoverHtml;
                        infoDiv.style.zIndex = 1200;
                        document.body.appendChild(infoDiv);
                    }).on(div, "mouseout", function (e) {
                        if (infoDiv) {
                            document.body.removeChild(infoDiv);
                            infoDiv = null;
                        }
                    });
                }
                return div;
            };
            return function (bShow) {
                if (bShow) {
                    if (!map._controlCorners[legend.getPosition()].contains(legend._container || null)) map.addControl(legend);
                }
                else {
                    if (map._controlCorners[legend.getPosition()].contains(legend._container)) map.removeControl(legend);
                }
            }
        },
        showInfo: function (props, opts) {
            var arr_html = [],
                tp_config = opts.config || {},
                noDisplayFields = (opts.noDisplayFields || []).concat(tp_config.noDisplayFields || []).concat(["Lat","Lng"]),
                displayFields = $.extend({}, opts.displayFields || {}, tp_config.displayFields),
                showNoValue = tp_config.showNoValue || opts.showNoValue || false,
                tPopup = $.extend({}, opts.popup || {}, tp_config.popup),
                tLink = $.extend({}, opts.link || {}, tp_config.link),
                popup = {
                    show: tPopup.show || true,
                    offset: tPopup.offset ? { offset: tPopup.offset } : {},
                    setView: tPopup.setView || true
                },
                link = {
                    show: tLink.show || false,
                    linkText: tLink.linkText || "监测结果",
                    click: tLink.click || null
                };
            arr_html.push("<div style='font-weight:bolder;color:#82757C;font-size:12px'>");
            for (var item in props) {
                if (!props.hasOwnProperty(item)) continue;
                if (noDisplayFields.indexOf(item) !== -1) continue;
                if (noDisplayFields.indexOf(item) !== -1) continue;
                var posIndex = arr_html.length,
                    displayName = item,
                    val = props[item];
                if (item in displayFields) {
                    if (typeof displayFields[item] === 'object') {
                        displayName = displayFields[item].text;
                        posIndex = displayFields[item].index;
                        if (typeof displayFields[item].val == 'function') val = displayFields[item].val(props);
                    }
                    else {
                        displayName = displayFields[item];
                    }
                }
                if (val != null) val = $.trim(val);
                if (!val && showNoValue === false) continue;
                //插入信息
                if (posIndex == 0) posIndex = 1;
                posIndex = (posIndex >= arr_html.length) ? arr_html.length : posIndex;
                arr_html.splice(posIndex, 0, "<p><span style='color:#2E2E2E;margin-top:15px;'>" + displayName + ":</span><span>" + val + "</span></p>");
            }
            if (link.show === true) {
                if (typeof link.linkText === "function") arr_html.push(link.linkText(props));
                else arr_html.push("<a href='javascript:void(0)' data-id='lkInfo' style='float:right'>" + link.linkText + "</a><br/>");
            }
            arr_html.push("</div>");
            if (popup.show === true) {
                var p = L.popup(popup.offset);
                var latlng = null;
                if (tp_config.getPoint) latlng = tp_config.getPoint(props);
                else latlng=[+props.lat,+props.lng];
                p.setLatLng(latlng).setContent(arr_html.join("")).openOn(map);
                if (popup.setView === true) map.setView(latlng);
                if (link.click) $(p._container).find("[data-id='lkInfo']").bind('click', function () { link.click(props); });
                return p;
            }
            else {
                return arr_html.join("");
            }
        }
    }
})