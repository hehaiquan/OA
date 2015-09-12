(function ($, undefined) {
    if ($.pb && $.pb.frameExtendlist) return;
    var global = {
        browser: function () {
            var Sys = {};
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/(msie\s|trident.*rv:)([\w.]+)/)) { Sys.ie = ua.match(/(msie\s|trident.*rv:)([\w.]+)/)[2]; return Sys; }//是否为IE
            if (ua.match(/firefox\/([\d.]+)/)) { Sys.firefox = true; return Sys; }//是否为firefox
            if (ua.match(/chrome\/([\d.]+)/)) { Sys.chrome = true; return Sys; }//是否为chrome
            if (ua.match(/opera.([\d.]+)/)) { Sys.opera = true; return Sys; }//是否为opera
            if (ua.match(/version\/([\d.]+).*safari/)) { Sys.safari = true; return Sys; }//是否为safari
            return Sys;
        }(),
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1, //IE内核                
                presto: u.indexOf('Presto') > -1, //opera内核                
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核                
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核                
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端                
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端                
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器                
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器                
                iPad: u.indexOf('iPad') > -1, //是否iPad                
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部            
            };
        }(),
        HostUrl: document.location.protocol + "//" + document.location.host + "/",
        TabContainer: frameElement == null ? "" : frameElement.parentElement,
        GetidentityId: function () { identityId++; return identityId; },
        QuoteJS: function (url) { document.write('<script src="' + url + '"></script>'); },
        QuoteCSS: function (url) { document.write('<link href="' + url + '" rel="stylesheet" />'); },
        GetUrlValue: function (url, key) { var reg = new RegExp("(^|\\?|&)" + key + "=([^&]*)(\\s|&|$)", "i"); return (reg.test(url)) ? RegExp.$2 : ""; },
        _Curpath: (function (script, keyword, me) {
            var l = script.length;

            for (i = 0; i < l; i++) {
                me = !!document.querySelector ?
                    script[i].src : script[i].getAttribute('src', 4);

                if (me.substr(me.lastIndexOf('/')).indexOf(keyword) !== -1)
                    break;
            }
            return me.substr(0, me.lastIndexOf('/') + 1);
        })(document.getElementsByTagName('script'), "frame-extendlist"),
        LoadIframeCallBack: function (url, callback) {
            var iframe = $('<iframe></iframe>').attr("src", url).hide();
            $('body').append(iframe);
            iframe.load(function () {
                var text = $(this).contents()[0].body.innerHTML;
                if (callback) callback(text);
                iframe.remove();
            });
        }
    };
    //
    global.QuoteCSS(global._Curpath + "listchose.css");

    function CopyToClipboard(text) {
        if (global.browser.ie) window.clipboardData.setData('text', text);
        else alert("非IE浏览器暂不支持复制文本");
    }
    //
    var identynum = 0;
    function newUnique() {
        ++identynum;
        var str = "Unique" + identynum.toString();
        return str;
    }

    //
    var inputdiv = '<div style="border: medium none;  WIDTH: 13px; FLOAT: left; OVERFLOW: hidden;" class="addr_text addr_normal"><input accesskey="t" style="OUTLINE-STYLE: none; OUTLINE-COLOR: invert; OUTLINE-WIDTH: none; WIDTH: 100%; -webkit-appearance: none" tabindex="1" type="text" /></div>';
    var content = '<div style="WHITE-SPACE: nowrap; FLOAT: left" class="addr_base addr_normal"  unselectable="on"><b unselectable="on">#TEXT</b><span class="semicolon">;</span></div>';
    //
    var filterInput = '<div style="border:solid #c3c3c3;border-width: 0 0 1px 0"><table style="width: 100%"><tr><td style="padding: 0px;"><input style="width: 90%; height: 100%; border: 0px; background-color: transparent; COLOR: rgb(170,170,170)" class="frameSearchInput" title="点此输入你的关键字" value="点此输入你的关键字" /></td><td style="width: 24px; padding: 0px;"><div class="ico-search"></div></td></tr></table></div>';
    var toolbar = '<div class="toolbar"><div style="text-align: left"><input type="button" value="全部折叠" iwftype="fold" /><input type="button" value="全部展开" iwftype="unfold" /></div></div>';

    var _doc = document;
    var top_doc;
    var top_window = (function (w) {
        try {
            top_doc = w['top'].document;  // 跨域|无权限
            top_doc.getElementsByTagName; // chrome 浏览器本地安全限制
        } catch (e) {
            top_doc = w.document; return w;
        };

        // 如果指定参数self为true则不跨框架弹出，或为框架集则无法显示第三方元素
        if (top_doc.getElementsByTagName('frameset').length > 0) {
            top_doc = w.document; return w;
        }
        return w['top'];
    })(window);
    var MarkID = 0;

    function mousePos(e) {
        var x, y;
        return {
            x: e.clientX + _doc.body.scrollLeft + _doc.documentElement.scrollLeft,
            y: e.clientY + _doc.body.scrollTop + _doc.documentElement.scrollTop
        };
    };

    $.widget("pb.frameExtendlist", {
        options: {
            UserDefineModel: null,//另外增加一种自定义模式user-define
            ComboBoxHeight: 300,//下拉框默认高度
            OtherNoAutoblurElements: []
        },
        _create: function () {
            var self = this;
            var o = this.options;
            self._namespaceID = this.eventNamespace || ('frameListChose' + MarkID); MarkID++;
            self.element.addClass("div_txt");
            self.element.attr({ "unselectable": "on" });
            self.element.css("-moz-user-select", "-moz-none");

            self.ComboBox = $('<div style="border:solid #c3c3c3;border-width: 1px 1px 1px 1px"></div>').css({ "background-color": "#f0f6e4", "min-width": "200px", "position": "absolute" }).width(self.element.outerWidth());
            self.ComboBox.css("z-index", 999999);
            self.ComboBox.hide();
            self.ComboBox.appendTo($(_doc.body));
            if (o.UserDefineModel) {
                self._clearMainDIV();//清空Div
                //开始初始化构造ComboBox
                o.UserDefineModel.show(self.ComboBox, o);
                //
                self._bindEvent();
            }
            else {
                alert("未自定义UserDefineModel");
            }
            //结束
        },
        _clearMainDIV: function () {
            var self = this;
            var o = this.options;
            //清空DIV构造
            self.element.empty();
            $(inputdiv).appendTo(self.element);
            $('<div style="CLEAR: both;"></div>').appendTo(self.element);
        },
        _bindEvent: function () {
            var self = this;
            var o = this.options;
            //需要多次绑定
            function BindEvery() {
                self.element.find(".addr_base").unbind();
                self.element.find(".addr_base").each(function () {
                    this.onselectstart = function () { return false; };
                });
                self.element.find(".addr_base").bind("mousedown mouseup", function (e) {
                    e.stopPropagation();
                    self.IsDown = false;
                });
                self.element.find(".addr_base").bind("mousedown", function (e) {
                    e.stopPropagation();
                    if (e.ctrlKey) {
                        $(this).toggleClass("addr_Chose");
                        return;
                    }
                    if (e.shiftKey) return;
                    self.element.find(".addr_base").removeClass("addr_Chose");
                    $(this).addClass("addr_Chose");
                    RemoveInput_AddDiv();
                });
                self.element.find(".addr_base").bind("mouseup", function (e) {

                });
                self.element.find(".addr_base").bind("dblclick", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if (o.IsCanEdit == false) return;//假如编辑模式禁止则不允许双击编辑
                    if (e.ctrlKey || e.shiftKey) return;
                    //
                    var old_InputDom = self.element.find(".addr_text");
                    var dom = $(this);
                    var obj = new Object();
                    var NEEDVALUE = dom.find("b").text();
                    obj.dom = $(inputdiv);
                    obj.dom.insertBefore(dom);
                    obj.dom.find("input")[0].onpropertychange = obj.dom.find("input")[0].oninput = function () {
                        AutoInputChange(obj.dom);
                    }
                    obj.dom.find("input").focus();
                    obj.dom.find("input")[0].ACTION = "modify";
                    //
                    obj.dom.find("input").val(NEEDVALUE);  //IE下面这句话足以
                    if (!global.browser.ie || global.browser.ie == "11.0") AutoInput(obj.dom);//这句话特别针对谷歌火狐
                    old_InputDom.remove();
                    //
                    setTimeout(function () {
                        dom.remove();
                        BindEvent_Input(obj.dom);
                    }, 2);
                });
            }
            BindEvery();
            //shfit键选中
            //光标移动拖拽选中
            $(_doc).mousemove(function (e) {
                //e.preventDefault();
                if (e.shiftKey) return;
                if (self.IsDown == true) {
                    if (self.element.children(".edit").length > 0) return;
                    if (self.element.children(".addr_base").length == 0) return;
                    if (self.element.children(".addr_text").length == 0) return;
                    var arr = self._FindAllNeedSelectArrDom(e);
                    self.element.find(".addr_base").removeClass("addr_Chose");
                    $.each(arr, function (index, ent) {
                        ent.addClass("addr_Chose");
                    });
                }
            });
            //document事件处理
            $(_doc).mouseenter(function (e) {

            });
            //窗口resize后
            $(window).resize(function () {
                self._ComboBoxPosition();
            });

            function RemoveInput_AddDiv(type) {
                var dom = self.element.children(".addr_text");

                if (o.IsCanEdit == false) dom.find("input").val("");
                var value = $.trim(dom.find("input").val());
                //一定要正在编辑的
                if (dom.hasClass("edit")) {
                    if (value == "") { dom.find("input").val(""); return; }
                    if (value != "") {
                        var ACTION = "";
                        ACTION = dom.find("input")[0].ACTION;
                        if (!ACTION) ACTION = "add";

                        var DivBase = $(content.replaceAll("#TEXT", value));

                        DivBase.insertBefore(dom);

                        DivBase[0].KEYVALUE = undefined;

                        var DictValue = { "value": DivBase[0].KEYVALUE, "text": value };

                        self._StrikeChangeEvent([DictValue], ACTION, DivBase[0]);


                        if (DictValue == undefined) DivBase.addClass("addr_extra");
                        BindEvery();
                    }
                    //定位下拉框
                    self._ComboBoxPosition();
                    //如果不是失去焦点这种特殊形成方式
                    if (type == "Enter") {
                        var IndexPos = self.element.children(".addr_normal").index(dom) + 1;
                        var obj = new Object();
                        obj.indexpos = IndexPos;
                        obj.dom = $(inputdiv).insertAfter(dom);
                        dom.remove();
                        setTimeout(function () {
                            MakeUp_InputText(obj.dom);
                        });
                    } else {
                        dom.remove();
                    }

                }
            }
            //输入框删除事件触发
            function KeyDown_Remove_Div() {
                var arr = new Array();

                self.element.find(".addr_Chose").each(function () {
                    var value = $(this)[0].KEYVALUE;
                    var name = $(this).find("b").text();
                    arr.push({ "value": value, "text": name });
                });

                self.element.children(".addr_Chose").remove();

                self._StrikeChangeEvent(arr, "remove");

                self._ComboBoxPosition(); //定位下拉框
            }

            function AutoInput(InputDiv) {
                var input = InputDiv.find("input")[0];
                var iCount = input.value.replace(/[^\u0000-\u00ff]/g, "aa").length;
                var Word_Width = parseInt($(input).css("font-size"));
                var finalWidth = 0;
                iCount = iCount + 1;
                finalWidth = (iCount / 2) * Word_Width;
                self.element.children(".addr_text").width(finalWidth + Word_Width);
                self._ComboBoxPosition();//定位下拉框
                if (input.value == "") { InputDiv.removeClass("edit"); }
                else InputDiv.addClass("edit");
            }

            function AutoInputChange(InputDiv) {

                var input = InputDiv.find("input")[0];


                if (input.oldValue == undefined) input.oldValue = input.value;
                if (input.oldValue == input.value) return;
                else input.oldValue = input.value;
                AutoInput(InputDiv);

            }

            o.SetDIVText = function (Arr) {
                //清空DIV构造
                self.element.empty();
                $.each(Arr, function (index, ent) {
                    var DivBase = $(content.replaceAll("#TEXT", ent.text));
                    //
                    DivBase[0].KEYVALUE = ent["value"];
                    if (DivBase[0].KEYVALUE == undefined) DivBase.addClass("addr_extra");
                    DivBase.appendTo(self.element);
                });
                //每次重置后自动加一个Input到尾端并给与焦点
                var INPUTDiv = $(inputdiv);
                INPUTDiv.appendTo(self.element);
                setTimeout(function () {
                    MakeUp_InputText(INPUTDiv);
                }, 2);
                //
                $('<div style="CLEAR: both;"></div>').appendTo(self.element);
                BindEvery();
            }

            o.GetData = function () {
                return self.GetAllData();
            };

            function BindEvent_Input(InputDiv) {

                var MyInput = InputDiv.find("input");

                MyInput.bind("mouseup", function (e) { e.stopPropagation(); self.IsDown = false; }); //防止路由

                MyInput.bind("keyup", function (e) { e.stopPropagation(); });//防止路由

                InputDiv.bind("mousedown", function (e) {
                    e.stopPropagation();
                    self.element.children(".addr_base").removeClass("addr_Chose");
                    if (MyInput.val() == "") { self.IsDown = true; }
                });

                MyInput.bind("mousedown", function (e) {
                    e.stopPropagation();
                    self.element.children(".addr_base").removeClass("addr_Chose");
                    if (this.value == "") {
                        self.IsDown = true;
                    }
                }); //防止路由

                MyInput.bind("keydown", function (e) {
                    var PCKEY = {
                        End: 35,
                        Home: 36,
                        Left: 37,
                        Up: 38,
                        Right: 39,
                        Down: 40
                    };
                    e.stopPropagation();
                    //只要keydown那么就触发
                    //火狐下59代表分号键,正常是186(特殊考虑),以及(13=Enter)(9=Tab)
                    if (e.keyCode == 13 || e.keyCode == 9 || e.keyCode == 186 || e.keyCode == 59) {
                        //if ($.trim(this.value) == "") { this.value = ""; /*jQuery.proxy(ChangeSize, this);*/ return; }
                        RemoveInput_AddDiv("Enter");
                        e.preventDefault(); return;
                    }    //如果是tab键或者Enter键
                    //判断如果是回退键或是删除键
                    if ((e.keyCode == 8 || e.keyCode == 46) && this.value == "") {
                        if (self.element.children(".addr_Chose").length > 0) {
                            KeyDown_Remove_Div();
                            return;
                        }
                        if (e.keyCode == 8) self.element.children(".addr_text").prev(".addr_base").addClass("addr_Chose");
                        if (e.keyCode == 46) { self.element.children(".addr_text").next(".addr_base").addClass("addr_Chose"); }
                    }
                    //判断如果是上下左右按键
                    if ((e.keyCode >= PCKEY.End && e.keyCode <= PCKEY.Down) && this.value == "") {
                        var obj = self._FindPosInputByKey(e.keyCode);
                        if (obj == null) return;
                        var INPUTDiv = $(inputdiv);
                        if (self.element.children(".addr_text").length > 0) self.element.children(".addr_text").remove();
                        if (self.element.children(".addr_text").length == 0) {
                            INPUTDiv[obj.opera](obj.dom);
                            setTimeout(function () {
                                MakeUp_InputText(INPUTDiv);
                            }, 2);
                        }
                    }
                    //判断是Ctrl+A
                    if (e.keyCode == 65 && e.ctrlKey == true) {
                        self.element.children(".addr_base").addClass("addr_Chose");
                        e.preventDefault(); return;
                    }
                    //
                    if (e.keyCode == 67 && e.ctrlKey == true) {
                        var arr = self.element.find(".addr_Chose").map(function () {
                            var name = $(this).find("b").text();
                            return name;
                        });
                        var str = "";
                        $.each(arr, function (index, ent) {
                            str += ent;
                            str += ";";
                        });
                        CopyToClipboard(str);
                        e.preventDefault(); return;
                    }
                    //
                });

                MyInput.bind("keyup", function (e) {
                    e.stopPropagation();
                    var keyword = $.trim($(this).val());
                    //判断是Ctrl+V
                    if (keyword.indexOf(";") != -1 && keyword != "") {
                        self.IsPaste = false;
                        var arr = keyword.split(";");
                        var resultarr = $.grep(arr, function (a) { return a != ""; });
                        if (resultarr.length > 0) {
                            var dom = self.element.children(".addr_text");
                            var lstAdd = new Array();
                            MyInput.val("");
                            //MyInput.width(13);
                            $.each(resultarr, function (index, ent) {
                                var DivBase = $(content.replaceAll("#TEXT", ent));
                                var DictValue = { "value": undefined, "text": ent };
                                DivBase[0].KEYVALUE = undefined;
                                DivBase.insertBefore(dom);
                                lstAdd.push(DictValue);
                            });
                            BindEvery();
                            self._ComboBoxPosition();
                            AutoInput(InputDiv);
                            self._StrikeChangeEvent(lstAdd, "add");
                            return;
                        }
                    }
                    AutoInput(InputDiv);
                    //对关键词的一个处理
                    if (self.CurKeyWord != undefined) {
                        if (self.CurKeyWord != keyword) { self._TreeFilter(keyword); }
                    }
                    else {
                        if (keyword != "") { self._TreeFilter(keyword); }
                    }
                    self.CurKeyWord = keyword;//最后都要赋值
                    //
                    if (this.value != "") self.element.find(".addr_base").removeClass("addr_Chose");
                });

                MyInput.bind("blur", function (e) {
                    e.stopPropagation();
                    //CloseBlur();//犹豫要不要加
                });

                MyInput.bind("focus", function (e) {
                    self._ComboBoxPosition(); //定位下拉框
                    if (!o.UserDefineModel.IsNoComboBox) self.ComboBox.show();
                });
            }

            function MakeUp_InputText(InputDiv) {
                BindEvent_Input(InputDiv);

                InputDiv.find("input")[0].onpropertychange = function () {
                    AutoInputChange(InputDiv);
                };

                InputDiv.find("input")[0].oninput = function () {
                    AutoInputChange(InputDiv);
                };
                InputDiv.find("input").focus();
            }

            function CloseBlur() {
                self.IsDown = false;
                self.element.find(".addr_base").removeClass("addr_Chose");
                self.ComboBox.hide();
                self._TreeFilter("");
                RemoveInput_AddDiv();
            }

            $("iframe").each(function () {
                this.contentWindow.onmousedown = this.contentWindow.onfocus = function () {
                    CloseBlur();
                };
            });

            if (frameElement != null) {
                $(top_doc).bind('mousedown.' + self._namespaceID, function (e) {
                    if (e.shiftKey) return;
                    try {
                        CloseBlur();
                    } catch (e) {

                    }
                });
                $(top_doc).bind('mouseup.' + self._namespaceID, function (e) {
                    if (e.shiftKey) return;
                    self.IsDown = false;
                });
            }

            $(_doc).bind('mousedown.' + self._namespaceID, function (e) {
                if (e.target == self.element[0]) return;
                if ($.contains(self.element[0], e.target)) return;//一直无法理解有时候这句话没起到作用
                self.element.find(".addr_base").removeClass("addr_Chose");
                if (e.shiftKey) return;
                if (e.target == self.ComboBox[0]) return;
                if ($.contains(self.ComboBox[0], e.target)) return;
                //指定其他不会失去焦点的元素
                for (var i = 0; i < o.OtherNoAutoblurElements.length; i++) {
                    if (e.target == o.OtherNoAutoblurElements[i]) return;
                    if ($.contains(o.OtherNoAutoblurElements[i], e.target)) return;
                }
                //
                var InputText = self.element.children(".addr_text").find("input").val();
                if (InputText != "") CloseBlur();
            });
            $(_doc).bind('mouseup.' + self._namespaceID, function (e) {
                self.IsDown = false;
                if (e.target == self.ComboBox[0]) return;
                if ($.contains(self.ComboBox[0], e.target)) return;
                //
            });
            $(_doc).bind('keydown.' + self._namespaceID, function (e) {
                if ((e.keyCode == 8 || e.keyCode == 46)) {
                    if (self.element.children(".addr_Chose").length > 0) {
                        KeyDown_Remove_Div();
                        e.preventDefault();
                        return false;
                    }
                }
                //e.preventDefault();
                //return false;
            });
            //判定光标所在位置并加以定位
            self.element.bind("mouseup", function (e) { e.stopPropagation(); self.IsDown = false; });
            self.element.bind("mousedown", function (e) {
                if (e.shiftKey) {
                    if (self.element.children(".addr_text").length == 0) return;
                    var pos = mousePos(e);
                    var arr = self._FindAllNeedSelectArrDom(e);
                    self.element.find(".addr_base").removeClass("addr_Chose");
                    $.each(arr, function (index, ent) {
                        ent.addClass("addr_Chose");
                    });
                    return;
                }
                //if (self.IsDown == true) return;
                var INPUTDiv = $(inputdiv);
                var obj = self._FindNearestDom(e);


                if (obj.dom == null) { alert("请不要点击无效光标区域"); return; }
                self.IsDown = true;
                self.element.find(".addr_base").removeClass("addr_Chose");
                RemoveInput_AddDiv();

                if (self.element.children(".addr_text").length > 0) self.element.children(".addr_text").remove();
                if (self.element.children(".addr_text").length == 0) {
                    INPUTDiv[obj.opera](obj.dom);
                    setTimeout(function () {
                        MakeUp_InputText(INPUTDiv);
                    }, 2);
                }
            });
        },
        _ComboBoxPosition: function () {
            var self = this;
            var o = this.options;
            var pos = self.element.offset();
            var X = pos.left;
            var Y;
            //判断是不是下面不够位置去显示ComboBox
            if (pos.top + self.element.outerHeight() + self.ComboBox.outerHeight() > document.body.scrollTop + document.documentElement.scrollTop + $(window).height()) {
                Y = pos.top - self.ComboBox.outerHeight();
            } else {
                Y = pos.top + self.element.outerHeight();
            }

            if (pos.top < self.ComboBox.outerHeight()) Y = pos.top + self.element.outerHeight();
            self.ComboBox.css({
                width: self.element.outerWidth() - 2, //2个像素边框
                left: X,
                top: Y
            });
        },
        _FindAllNeedSelectArrDom: function (e) {
            var self = this;
            var o = this.options;
            var pos = mousePos(e);
            var data = new Object();
            data.dom = self.element.children(".addr_text").eq(0);
            data.indexpos = self.element.children(".addr_normal").index(self.element.children(".addr_text").first());
            var arr = self.element.find(".addr_base").toArray();
            var NEW_ARR = new Array();
            var RowNum = -1;
            var HeightARR = new Array();
            var RowArr = new Array();
            for (var k = 0; k < arr.length; k++) {
                if (!HeightARR.Contains($(arr[k]).offset().top)) {
                    HeightARR.push($(arr[k]).offset().top);
                    RowNum++;
                    RowArr.push({ "Index": RowNum, "top": $(arr[k]).offset().top, "leftArr": [] });
                }
                RowArr[RowNum]["leftArr"].push({ "left": $(arr[k]).offset().left, "floatIndex": k });
            }
            var j = 0;
            var CurRow = new Object();
            for (j = 0; j < HeightARR.length; j++) {
                if (pos.y >= HeightARR[j] - 1 && pos.y <= HeightARR[j] + data.dom.outerHeight() + 1) {
                    CurRow.top = HeightARR[j];
                    CurRow.Num = j;
                    break;
                }
            }
            //if (j == 3) alert("异常");
            if (CurRow.Num == undefined) {//标示一定超过上下的边界
                if (pos.y < Math.min.apply(null, HeightARR)) {
                    CurRow.top = HeightARR[0];
                    CurRow.Num = 0;
                    if (IsAlert) alert("超过上边界限");
                }
                if (pos.y > Math.max.apply(null, HeightARR) + data.dom.outerHeight()) {
                    CurRow.top = HeightARR[HeightARR.length - 1];
                    CurRow.Num = HeightARR.length - 1;
                    if (IsAlert) alert("超过下边界限");
                }
            }
            //开始定位
            var leftarr = RowArr[CurRow.Num]["leftArr"].PickByField("left");
            var boundaryleft = Math.min.apply(null, leftarr);
            var boundaryright = Math.max.apply(null, leftarr) + $(arr[RowArr[CurRow.Num]["leftArr"][RowArr[CurRow.Num]["leftArr"].length - 1].floatIndex]).outerWidth();
            var FromPos = data.indexpos;
            var ToPos = data.indexpos;
            var IsAlert = false;
            //标示是本行拖选
            if (CurRow.top == data.dom.offset().top) {
                if (pos.x < boundaryleft) {
                    ToPos = RowArr[CurRow.Num]["leftArr"][0].floatIndex;
                    if (FromPos == ToPos) return [];
                    if (IsAlert) alert("本行超过左边界限" + ToPos);
                }
                if (pos.x < data.dom.offset().left && pos.x >= boundaryleft) {
                    for (i = 0; i < arr.length; i++) {
                        var flag1 = $(arr[i]).offset().top == CurRow.top;
                        if (i == data.indexpos) continue;
                        if (flag1 && $(arr[i]).offset().left - 7 < pos.x && $(arr[i]).offset().left + $(arr[i]).outerWidth() > pos.x) {
                            ToPos = i;
                            if (IsAlert) alert("本行未超边界限" + ToPos);
                            break;
                        }
                    }
                    if (FromPos == ToPos) return [];
                }
                if (pos.x >= data.dom.offset().left && pos.x <= boundaryright) {
                    for (i = 0; i < arr.length; i++) {
                        var flag1 = $(arr[i]).offset().top == CurRow.top;
                        if (flag1 && $(arr[i]).offset().left + $(arr[i]).outerWidth() + 7 > pos.x) {
                            ToPos = i;
                            if (IsAlert) alert("本行未超边界限" + ToPos);
                            break;
                        }
                    }
                }
                if (pos.x > boundaryright) {
                    ToPos = RowArr[CurRow.Num]["leftArr"][RowArr[CurRow.Num]["leftArr"].length - 1].floatIndex;
                    if (FromPos - 1 == ToPos) return [];
                    if (IsAlert) alert("本行超过右边界限" + ToPos);
                }
            }
            //标示是后行拖选
            if (CurRow.top > data.dom.offset().top) {
                if (pos.x < boundaryleft) {
                    ToPos = RowArr[CurRow.Num]["leftArr"][0].floatIndex - 1;
                    if (IsAlert) alert("下行行超过左边界限" + ToPos);
                }
                if (pos.x < data.dom.offset().left && pos.x >= boundaryleft) {
                    for (i = arr.length - 1; i > 0; i--) {
                        var flag1 = $(arr[i]).offset().top == CurRow.top;
                        if (flag1 && $(arr[i]).offset().left < pos.x) {
                            ToPos = i;
                            if (IsAlert) alert("下行未超边界限" + ToPos);
                            break;
                        }
                    }
                }
                if (pos.x > data.dom.offset().left && pos.x <= boundaryright) {
                    for (i = arr.length - 1; i > 0; i--) {
                        var flag1 = $(arr[i]).offset().top == CurRow.top;
                        if (flag1 && $(arr[i]).offset().left < pos.x) {
                            ToPos = i;
                            if (IsAlert) alert("下行未超边界限" + ToPos);
                            break;
                        }
                    }
                }
                if (pos.x > boundaryright) {
                    ToPos = RowArr[CurRow.Num]["leftArr"][RowArr[CurRow.Num]["leftArr"].length - 1].floatIndex;
                    if (IsAlert) alert("下行超过右边界限" + ToPos);
                }
            }
            //标示是前行拖选
            if (CurRow.top < data.dom.offset().top) {
                if (pos.x < boundaryleft) {
                    ToPos = RowArr[CurRow.Num]["leftArr"][0].floatIndex;
                    if (IsAlert) alert("上行行超过左边界限" + ToPos);
                }
                if (pos.x < data.dom.offset().left && pos.x >= boundaryleft) {
                    for (i = 0; i < arr.length; i++) {
                        var flag1 = $(arr[i]).offset().top == CurRow.top;
                        if (flag1 && $(arr[i]).offset().left + $(arr[i]).outerWidth() > pos.x) {
                            ToPos = i;
                            if (IsAlert) alert("上行未超边界限" + ToPos);
                            break;
                        }
                    }

                }
                if (pos.x > data.dom.offset().left && pos.x <= boundaryright) {
                    for (i = 0; i < arr.length; i++) {
                        var flag1 = $(arr[i]).offset().top == CurRow.top;
                        if (flag1 && $(arr[i]).offset().left + $(arr[i]).outerWidth() > pos.x) {
                            ToPos = i;
                            if (IsAlert) alert("上行未超边界限" + ToPos);
                            break;
                        }
                    }

                }
                if (pos.x > boundaryright) {
                    ToPos = (1 + RowArr[CurRow.Num]["leftArr"][RowArr[CurRow.Num]["leftArr"].length - 1].floatIndex);
                    if (IsAlert) alert("上行超过右边界限" + ToPos);
                }
            }


            //开始拼装
            var SelectArr = new Array();
            if (FromPos > ToPos) FromPos--;
            $.each(arr, function (index, ent) {
                if (index <= Math.max(ToPos, FromPos) && index >= Math.min(ToPos, FromPos)) {
                    SelectArr.push($(ent));
                }
            });
            //alert(FromPos);
            //alert(ToPos);
            return SelectArr;
            //alert(FromPos);
            //alert(ToPos);

        },
        _FindNearestDom: function (e) {
            var self = this;
            var o = this.options;
            var arr = self.element.find(".addr_base").toArray();
            if (arr.length == 0) return { "opera": "prependTo", "dom": self.element };

            var finalIndex = null;
            var InfoIndex = null;
            var pos = mousePos(e);
            var NEW_ARR = new Array();
            var NEW_ARR_Y = new Array();
            $.each(arr, function (index, ent) {
                var obj = new Object();
                obj.Index = index;
                var offset_X = $(ent).offset().left - pos.x; //节点左侧到点击点距离   必须刚好多余0少于6(这里的6和margin的左右3)
                var offset_Y = pos.y - $(ent).offset().top; //点击点超过节点上侧距离不能超过他自己长度
                if (offset_X <= 6 && offset_X >= 0 && offset_Y >= -3 && offset_Y <= $(ent).outerHeight() + 2) {
                    NEW_ARR.push(obj);
                }
                if (offset_Y >= -3 && offset_Y <= $(ent).outerHeight() + 2) { NEW_ARR_Y.push(obj); }
            });

            var insert = "insertBefore";
            if (NEW_ARR.length > 0) { finalIndex = NEW_ARR[NEW_ARR.length - 1].Index; InfoIndex = finalIndex; }
            if (NEW_ARR.length == 0 && NEW_ARR_Y.length > 0) { finalIndex = NEW_ARR_Y[NEW_ARR_Y.length - 1].Index; insert = "insertAfter"; InfoIndex = finalIndex + 1; }
            var dom;
            if (finalIndex == null) dom = null;
            else dom = $(arr[finalIndex]);
            return { "opera": insert, "dom": dom };
        },
        _FindPosInputByKey: function (code) {
            var self = this;
            var o = this.options;
            var PCKEY = {
                End: 35,
                Home: 36,
                Left: 37,
                Up: 38,
                Right: 39,
                Down: 40
            };
            /**************/
            var RowNum = -1;
            var HeightARR = new Array();
            var RowArr = new Array();
            var arr = self.element.find(".addr_base").toArray();
            for (var k = 0; k < arr.length; k++) {
                if (!HeightARR.Contains($(arr[k]).offset().top)) {
                    HeightARR.push($(arr[k]).offset().top);
                    RowNum++;
                    RowArr.push({ "Index": RowNum, "top": $(arr[k]).offset().top, "leftArr": [] });
                }
                RowArr[RowNum]["leftArr"].push({ "left": $(arr[k]).offset().left, "floatIndex": k });
            }
            //最后加上一特定坐标
            RowArr[RowArr.length - 1].leftArr.push({ "left": $(arr[arr.length - 1]).offset().left + $(arr[arr.length - 1]).outerWidth() + 6, "floatIndex": arr.length })
            //开始计算本行
            var CurRow = new Object();
            for (j = 0; j < HeightARR.length; j++) {
                if (self.element.children(".addr_text").eq(0).offset().top == HeightARR[j]) {
                    CurRow.top = HeightARR[j];
                    CurRow.Num = j;
                    break;
                }
            }
            /**************/
            var data = new Object();
            data.dom = self.element.children(".addr_text").eq(0);
            data.indexpos = self.element.children(".addr_normal").index(self.element.children(".addr_text").first());
            var NEW_INDEX = null;
            var New_RowNum = null;
            switch (code) {
                case PCKEY.Down:
                    New_RowNum = CurRow.Num + 1;
                    if (New_RowNum > HeightARR.length - 1) New_RowNum = HeightARR.length - 1;
                    var old_left = data.dom.offset().left;
                    var New_RowArr = RowArr[New_RowNum];
                    New_RowArr.leftArr.SortFunc(function (ent) {
                        return Math.abs(ent.left - old_left);
                    });
                    NEW_INDEX = New_RowArr.leftArr[0].floatIndex;
                    break;
                case PCKEY.Up:
                    New_RowNum = CurRow.Num - 1;
                    if (New_RowNum < 0) New_RowNum = 0;
                    var old_left = data.dom.offset().left;
                    var New_RowArr = RowArr[New_RowNum];
                    New_RowArr.leftArr.SortFunc(function (ent) {
                        return Math.abs(ent.left - old_left);
                    });
                    NEW_INDEX = New_RowArr.leftArr[0].floatIndex;
                    break;
                case PCKEY.Left:
                    NEW_INDEX = data.indexpos - 1;
                    if (NEW_INDEX < 0) NEW_INDEX = 0
                    break;
                case PCKEY.Right:
                    NEW_INDEX = data.indexpos + 1;
                    if (NEW_INDEX > self.element.children(".addr_normal").length - 1) NEW_INDEX = self.element.children(".addr_normal").length - 1;
                    break;
                case PCKEY.End:
                    NEW_INDEX = self.element.children(".addr_normal").length - 1;
                    break;
                case PCKEY.Home:
                    NEW_INDEX = 0
                    break;
                default:
                    break;
            }
            //假如一样则认为光标未动过
            if (data.indexpos == NEW_INDEX) return null;
            //否则认为光标动过
            var OperaDom = null;
            var OperaMethod = null;
            if (self.element.find(".addr_base").length == NEW_INDEX) {
                OperaDom = self.element.find(".addr_base")[self.element.find(".addr_base").length - 1];
                OperaMethod = "insertAfter";
            }
            else {
                OperaDom = self.element.find(".addr_base")[NEW_INDEX];
                OperaMethod = "insertBefore";
            }
            return { "opera": OperaMethod, "dom": OperaDom };
        },

        _StrikeChangeEvent: function (arr, action, Element) {
            var self = this;
            var o = this.options;
            if (!o.UserDefineModel.onTextChange) { alert("未定义onTextChange事件"); return; }
            return o.UserDefineModel.onTextChange(arr, action, Element);
        },
        _TreeFilter: function (keyword) {
            var self = this;
            var o = this.options;
            o.UserDefineModel.Filter(keyword);
        },
        GetAllData: function () {
            var self = this;
            var o = this.options;
            var arr = new Array();
            self.element.find(".addr_base").each(function () {
                var value = $(this)[0].KEYVALUE;
                var name = $(this).find("b").text();
                arr.push({ "value": value, "text": name });
            });
            return arr;
        }

    });
})(jQuery);