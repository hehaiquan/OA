/* 插件类型：统一应用级别插件 frametree
 * 功能 : 自定义右键菜单，可拖拽树（完成度85%）
 * 作者：彭博
 * 参考：//zTree样式表
 * 最后更新时间：2013-07-27 17:50
 * 依赖：jquery，jquery-ui，
 */
(function ($, undefined) {
    if ($.pb && $.pb.frametree) return;
    String.prototype.replace$html = function (str) {
        var reg = new RegExp("\\$\\{&Html\\}", "g");
        return this.replace(reg, str);
    };

    var identynum = 0;
    function newUnique() {
        ++identynum;
        var str = "Unique" + identynum.toString();
        return str;
    }
    var global = {
        HostUrl: document.location.protocol + "//" + document.location.host + "/",
        GetidentityId: function () { identityId++; return identityId; },
        //QuoteJS: function (url) { document.write('<script src="' + url + '"></script>'); },
        //QuoteCSS: function (url) { document.write('<link href="' + url + '" rel="stylesheet" />'); },
        GetUrlValue: function (url, key) { var reg = new RegExp("(^|\\?|&)" + key + "=([^&]*)(\\s|&|$)", "i"); return (reg.test(url)) ? RegExp.$2 : ""; },
        LoadIframeCallBack: function (url, callback) {
            var iframe = $('<iframe></iframe>').attr("src", url).hide();
            $('body').append(iframe);
            iframe.load(function () {
                var text = $(this).contents()[0].body.innerHTML;
                if (callback) callback(text);
                iframe.remove();
            });
        },
        TreeID: newGuid(),
        _framePluginFolder: (function (keyword, me) {
            var script = document.getElementsByTagName('script');
            var l = script.length;
            for (i = 0; i < l; i++) {
                me = !!document.querySelector ?
                    script[i].src : script[i].getAttribute('src', 4);

                if (me.indexOf(keyword) !== -1)
                    break;
            }
            return me.substr(0, me.indexOf(keyword)) + keyword;
        })("framePlugin"),
        _Curpath: (function (keyword, me) {
            var script = document.getElementsByTagName('script');
            var l = script.length;
            for (i = 0; i < l; i++) {
                me = !!document.querySelector ?
                    script[i].src : script[i].getAttribute('src', 4);

                if (me.substr(me.lastIndexOf('/')).indexOf(keyword) !== -1)
                    break;
            }
            return me.substr(0, me.lastIndexOf('/') + 1);
        })("frame-supertree")
    };

    //global.QuoteCSS(global._framePluginFolder + "/ztree-css/zTreeStyle.css");
    require(["css!resources/zTreeStyle/metro", "css!script/framePlugin/frame-supertree/supertree"], function () { });

    function newGuid() {
        var guid = "";
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += "-";
        }
        return guid;
    }

    var guid = newGuid();
    $.widget("pb.frametree", {
        options: {
            CreateSiblingsCallback: null,//假如使用默认右键菜单的(新建本级节点)(主动式)回调
            DeleteThisCallback: null,//假如使用默认右键菜单的(删除本节点)(主动式)回调
            AppendCreateCallback: null,//假如使用默认右键菜单的(添加子节点)(主动式)回调
            AppendDirCreateCallback: null,//假如使用默认右键菜单的(添加子目录)(主动式)回调
            EditCallback: null,//假如使用默认右键菜单的(编辑本节点)(主动式)回调
            treesource: null, //树形结构基础数据源
            commonnodedrag: true,//普通父级节点拖拽使能（是否允许非末级节点可以拖拽）
            ID: null,//识别性唯一ID
            Field_id: "id",
            Field_name: "name",
            Field_children: "children",
            ExtraFilterField: null,
            checkbox: true,                     //是否开启checkbox模式
            onlycheckone: false,            //在checkbox情况下,是否开启单选模式
            abortcheck: false,                 //是否强制Disable所有checkbox
            drag: false,                             //是否开启拖拽模式
            IsDeleteSourceDom: true,  //在树形移动的最后是否需要删除源节点
            IsPreventOutSide: false,      //是否仅限于内部拖动
            IsOnlyMoveOutSide: false, // 是否仅限于外部拖动
            IsBanDrag_OnChangeLevel: false,//是否禁止会导致级别改的拖动
            IsOnlyTarget_EndLI_AppendCommonLI: false,//是否只允许目标节点指定为(结束节点)或(目录根节点的Append方式)
            ico: true,
            IsFilterSiblings: true,
            IshasContextmenu: false,
            contextmenu: null,
            contextmenudefaultHTML: global._Curpath + "/defaultMenu.html"
        },
        //事件注解
        _Event: {
            "changedomEvent": "节点拖动后事件",
            "EndCheckChangeEvent": "末级节点有选中变动事件",
            "node_click": "节点单击事件",
            "node_dblclick": "节点双击事件",
            "node_rightclick": "右键菜单事件"
        },
        _create: function () {

            var self = this;
            var o = this.options;
            self.element.attr("treeguid", global.TreeID);
            self.element.attr("treeul", "root");
            //self.AllElement = $("[treeguid=" + global.TreeID + "]");
            //构造小箭头
            self.arrow = $('<SPAN style="DISPLAY: none; TOP: 0px; LEFT: 0px;z-index: 99999999;" class=tmpzTreeMove_arrow></SPAN>');
            self.dragUI = null;
            $('body').append(self.arrow);
            //构造右键菜单
            if (o.IshasContextmenu == false) {
                self._buildtree();
                self._buildEvent();
                return;
            }
            if (o.contextmenu)//判断是否有自定义的(右键上下文菜单)
            {
                self.rightmenu = o.contextmenu.hide();
                self.rightmenu.css("z-index", "99999999");
                self._buildtree();
                self._buildEvent();
            } else {

                global.LoadIframeCallBack(o.contextmenudefaultHTML, function (resText) {
                    self.rightmenu = $(resText).hide().appendTo('body');
                    self._buildtree();
                    self._buildEvent();
                    //默认可回调事件
                    //创建
                    self.rightmenu.find('[menu-type=create]').mousedown(function () {
                        if (o.CreateSiblingsCallback)//假如存在重载
                            o.CreateSiblingsCallback(function (value, showName) { var obj = self.GetCurSelectNode(); self.CreateSiblings(obj.dom, value, showName); });
                    });
                    //添加
                    self.rightmenu.find('[menu-type=appendDir]').mousedown(function () {
                        if (o.AppendDirCreateCallback)//假如存在重载
                            o.AppendDirCreateCallback(function (value, showName) { var obj = self.GetCurSelectNode(); self.AppendDirCreate(obj.dom, value, showName); });
                    });
                    //添加
                    self.rightmenu.find('[menu-type=append]').mousedown(function () {
                        if (o.AppendCreateCallback)//假如存在重载
                            o.AppendCreateCallback(function (value, showName) { var obj = self.GetCurSelectNode(); self.AppendCreate(obj.dom, value, showName); });
                    });
                    //编辑
                    self.rightmenu.find('[menu-type=edit]').mousedown(function () {
                        if (o.EditCallback)//假如存在重载
                            o.EditCallback();
                    });
                    //删除
                    self.rightmenu.find('[menu-type=del]').mousedown(function () {
                        if (o.DeleteThisCallback)//假如存在重载
                            o.DeleteThisCallback(function () { var obj = self.GetCurSelectNode(); self.DeleteThis(obj.dom); });
                    });
                });
            }

        },
        _init: function () {
            var o = this.options;
            var self = this;
        },
        //获取在本页面下所有初始化过的Element
        _getAllElement: function () {
            return $("[treeguid=" + global.TreeID + "]");
        },
        _getAllTreeSelector: function () {
            return "[treeguid=" + global.TreeID + "]";
        },
        //获取dom深度
        _getdomlevel: function (dom) {
            var num = -1;
            var findLevel = function (node) {
                if (node.parent(".ztree").length > 0) return num;
                else {
                    if (node.parent().hasClass("CommonLI") || node.parent().hasClass("EndLI")) { num++; }
                    return findLevel(node.parent());
                }
            };
            var level = findLevel(dom);
            return level;
        },
        //PB自定义拼接数据结构
        _spell: function (key, dom) {
            var self = this;
            var o = this.options;
            var obj = new Object();
            var ent = self.element.data(key);

            var level = self._getdomlevel(dom);
            obj.IsEndLI = dom.parent().hasClass("EndLI");
            obj[o.Field_id] = ent[o.Field_id];
            obj[o.Field_name] = ent[o.Field_name];
            obj.dom = dom;
            obj.parentdom = self._FindParentCommonNode_A(dom);
            obj.level = parseInt(level);
            obj.key = key;
            obj.value = ent;
            obj.parentvalue = self._FindParentCommonLIDataByNode_A(dom);
            return obj;
        },
        //PB自定义拼接数据结构
        _spellEasy: function (key, dom) {
            var self = this;
            var o = this.options;
            var obj = new Object();
            var ent = self.element.data(key);
            obj[o.Field_id] = ent[o.Field_id];
            obj[o.Field_name] = ent[o.Field_name];
            obj.dom = dom;
            obj.value = ent;
            return obj;
        },
        //根据关键字过滤终结节点函数
        FilterNodes: function (keyword) {
            var self = this;
            var o = this.options;
            self.ExpandAllNodes();
            self.element.find("li").attr("filterAll", null);
            self.element.find("li").attr("filterflag", null);
            self.element.find("li").show();
            self.element.find("a").each(function () {
                if ($(this).children(".nodetext").children(".filterKey").length > 0) {
                    var key = $(this).attr("key");
                    var ent = self.element.data(key);
                    $(this).children(".nodetext").text("");
                    $(this).children(".nodetext").text(ent.name);
                }
            });
            var keyValue = $.trim(keyword);
            if (keyValue == "") { return; }

            function IsMatch(element) {
                var dom = $(element);
                var results = dom.find("a");
                var flag = false;
                results.each(function () {
                    var title = self.element.data($(this).attr("key"))[o.Field_name];
                    var res_spandom = $(this).children(".nodetext");
                    if (res_spandom.children(".filterKey").length > 0) { flag = true; return; }

                    var expvalue = keyValue.replaceRegSpecial();

                    var regex = new RegExp("(" + expvalue + ")", 'gi'); //gi是忽略大小写
                    if (regex.test(title)) {
                        var html = title.replace(RegExp.$1, '<span class="filterKey">' + RegExp.$1 + '</span>');
                        res_spandom.html(html);
                        flag = true;
                        //假如不是末级节点
                        if ($(this).parent().hasClass("CommonLI")) {
                            $(this).parent().attr("filterAll", "true");
                        } else {
                            return flag;
                        }
                    } else {
                        $(this).parent().attr("filterflag", "false");
                    }
                    //以上是正则正常匹配
                    //以下是针对末级节点且过滤特殊字段
                    if (o.ExtraFilterField != null && $(this).parent().hasClass("EndLI")) {
                        var extravalue = self.element.data($(this).attr("key"))[o.ExtraFilterField];

                        var extraRegex = new RegExp("^" + keyValue, 'gi');
                        if (extraRegex.test(extravalue)) {
                            var html = '<span class="filterKey">' + self.element.data($(this).attr("key"))[o.Field_name] + '</span>';
                            res_spandom.html(html);
                            flag = true;
                        }
                    }
                });
                return flag;
            }

            function filter(dom) {
                if (IsMatch(dom)) {
                    $(dom).attr("filterflag", null);
                    if ($(dom).children("ul").length > 0) {
                        $(dom).children("ul").children("li").each(function () { filter(this); });
                    } else {

                    }
                } else {
                    if (o.IsFilterSiblings == true) $(dom).hide();
                    else {
                        if ($(dom).children("ul").length > 0) $(dom).hide();
                    }
                }
            }

            self.element.children("li").each(function (index, ent) { filter(this); });

            //凡是针对于是父级匹配的自己必须全部显示
            self.element.find(".CommonLI[filterAll=true]").each(function () {
                $(this).children("ul").children(".EndLI").attr("filterflag", null).show();
            });
        },
        //获得所有的正在过滤且like匹配到的ARR
        GetFilterMatchEndNodes: function () {
            var self = this;
            var o = this.options;
            var arr = new Array();
            self.element.find(".EndLI").each(function () {
                var dom = $(this).children("a");
                if (dom.children(".nodetext").children(".filterKey").length > 0) {
                    var key = dom.attr("key");
                    var data = self._spell(key, dom);
                    arr.push(data);
                }
            });
            return arr;
        },
        //获取最终的DOM架构映射的（标准Object）(外部可用)
        GetSchemaObject: function () {
            var self = this;
            var o = this.options;
            var GetSchema = function (dom) {
                var arr = new Array();
                dom.children("li").each(function () {
                    var obj = new Object();
                    var Uniquekey = $(this).children("a").attr("key");
                    var Uniquedom = $(this).children("a");
                    obj = $.extend({}, true, self._spell(Uniquekey, Uniquedom));
                    //var ent = self.element.data(Uniquekey);
                    //obj[o.Field_id] = ent[o.Field_id];
                    //obj[o.Field_name] = ent[o.Field_name];
                    //obj["level"] = self._getdomlevel($(this).children("a"));
                    if ($(this).children("ul").length == 0) { obj["children"] = []; }
                    else {
                        var ul = $(this).children("ul");
                        obj["children"] = new GetSchema(ul);
                    }
                    arr.push(obj);
                });
                return arr;
            };
            var result = GetSchema(self.element);
            return result;
        },
        //
        GetSchemaUnderNode: function (dom) {
            var self = this;
            var o = this.options;

            var self = this;
            var o = this.options;
            var GetSchemaOne = function (dom) {
                var arr = new Array();
                dom.children("li").each(function () {
                    var obj = new Object();
                    var Uniquekey = $(this).children("a").attr("key");
                    var Uniquedom = $(this).children("a");
                    obj = $.extend({}, true, self._spell(Uniquekey, Uniquedom));
                    //var ent = self.element.data(Uniquekey);
                    //obj[o.Field_id] = ent[o.Field_id];
                    //obj[o.Field_name] = ent[o.Field_name];
                    //obj["level"] = self._getdomlevel($(this).children("a"));
                    if ($(this).children("ul").length == 0) { obj["children"] = []; }
                    else {
                        var ul = $(this).children("ul");
                        obj["children"] = new GetSchemaOne(ul);
                    }
                    arr.push(obj);
                });
                return arr;
            };
            var result = GetSchemaOne(dom.find("~ul"));
            return result;
        },
        //获取所有尾部节点拼接数据
        GetSchemaEndNodes: function () {
            var self = this;
            var arr = new Array();
            self.element.find(".EndLI").each(function () {
                var dom = $(this).children("a");
                var key = $(this).children("a").attr("key");
                var data = self._spell(key, dom);
                arr.push(data);
            });
            return arr;
        },
        //获取一个节点数据集合
        GetNodeByDom: function (dom) {
            var self = this;
            if (dom.length == 0) { return null; }
            var key = dom.attr("key");
            var obj = self._spell(key, dom);
            return obj;
        },
        //获取当前选中的节点（外部可用）
        GetCurSelectNode: function () {
            var self = this;
            var dom = self.element.find("a.curSelectedNode").first();
            return self.GetNodeByDom(dom);
        },
        //获取所有打钩的节点（外部可用）
        GetEasyAllCheckNodes: function () {
            var self = this;
            var arr = new Array();
            self.element.find(".EndNode.checkbox_true_full").each(function () {
                var dom = $(this).find("~a");
                var key = dom.attr("key");
                //var level = dom.attr("level");
                //开始拼装
                var obj = self._spellEasy(key, dom);
                arr.push(obj);
            });
            return arr;
        },
        //获取所有打钩的节点（外部可用）
        GetAllCheckNodes: function () {
            var self = this;
            var arr = new Array();
            self.element.find(".EndNode.checkbox_true_full").each(function () {
                var dom = $(this).find("~a");
                var key = dom.attr("key");
                //var level = dom.attr("level");
                //开始拼装
                var obj = self._spell(key, dom);
                arr.push(obj);
            });
            return arr;
        },
        //强制全部将末尾Checkbox设置为True或false(外部可用)
        SetEndLICheckBoxAll: function (flag) {
            var self = this;
            var o = this.options;
            self.element.find(".EndLI,.CommonLI").each(function () {
                var dom = $(this).children("a");
                var key = $(this).children("a").attr("key");
                var data = self.element.data(key);
                var checkbox = dom.prev();
                if (flag == undefined || flag == true) {
                    if (checkbox.hasClass("checkbox_false_full")) {
                        checkbox.removeClass("checkbox_false_full");
                        checkbox.addClass("checkbox_true_full");
                    }
                }
                if (flag == false) {
                    if (checkbox.hasClass("checkbox_true_full")) {
                        checkbox.removeClass("checkbox_true_full");
                        checkbox.addClass("checkbox_false_full");
                    }
                }
            });
        },
        //强制选中Arr中ID对应的末级别Checkbox(外部可用)
        SetEndLICheckBox: function (arr, flag) {
            var self = this;
            var o = this.options;

            function non_strict_Contains(arr, item) {
                if (arr.length == 0) return false;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] == item) {
                        return true;
                    }
                }
                return false;
            }


            self.element.find(".CommonLI").each(function () {
                var dom = $(this).children("a");
                var key = $(this).children("a").attr("key");
                var data = self.element.data(key);
                var checkbox = dom.prev();
                if (checkbox.hasClass("checkbox_true_full")) {
                    checkbox.removeClass("checkbox_true_full");
                    checkbox.addClass("checkbox_false_full");
                }
            });

            self.element.find(".EndLI").each(function () {
                var dom = $(this).children("a");
                var key = $(this).children("a").attr("key");
                var data = self.element.data(key);
                var checkbox = dom.prev();
                if (non_strict_Contains(arr, data[o.Field_id])) {
                    if (flag == undefined || flag == true) {
                        if (checkbox.hasClass("checkbox_false_full")) {
                            checkbox.removeClass("checkbox_false_full");
                            checkbox.addClass("checkbox_true_full");
                        }
                    }
                    if (flag == false) {
                        if (checkbox.hasClass("checkbox_true_full")) {
                            checkbox.removeClass("checkbox_true_full");
                            checkbox.addClass("checkbox_false_full");
                        }
                    }
                }
            });
        },
        //强制展开所有节点（外部可用）
        ExpandAllNodes: function () {
            var self = this;
            self._ExpandUL(self.element);
        },
        //折叠某个UL及其所有无限子集
        _ExpandUL: function (UL, filterfunc) {
            var self = this;
            UL.find(".switch:not(.noline_docu)").each(function () {
                if (filterfunc) {
                    if (filterfunc($(this)) == false) return;
                }
                if ($(this).hasClass("noline_close")) {
                    $(this).removeClass("noline_close");
                    $(this).addClass("noline_open");
                    $(this).find("~ ul").show();
                    var ico = $(this).find("~a").find(".button");
                    if (ico.length == 0) return;
                    if (ico.hasClass("ico_close")) { ico.removeClass("ico_close"); ico.addClass("ico_open"); }
                    return;
                }
            });
        },
        //折叠某个UL及其所有无限子集
        _UnExpandUL: function (UL, filterfunc) {
            var self = this;
            UL.find(".switch:not(.noline_docu)").each(function () {
                if (filterfunc) {
                    if (filterfunc($(this)) == false) return;
                }
                if ($(this).hasClass("noline_open")) {
                    $(this).removeClass("noline_open");
                    $(this).addClass("noline_close");
                    $(this).find("~ ul").hide();
                    var ico = $(this).find("~a").find(".button");
                    if (ico.length == 0) return;
                    if (ico.hasClass("ico_open")) { ico.removeClass("ico_open"); ico.addClass("ico_close"); }
                    return;
                }
            });
        },
        //强制折叠所有该节点之下的所有有收缩功能
        UnExpandUnderNode: function (dom) {
            var self = this;
            var UL = dom.find("~ul");
            self._UnExpandUL(UL);
        },
        //强制收缩所有节点（外部可用）
        UnExpandAllNodes: function (underlevel) {
            var self = this;
            if (underlevel) {
                self._UnExpandUL(self.element, function (switchdom) {
                    if (self._getdomlevel(switchdom) < underlevel) return false;
                    else return true;
                });
            }
            else self._UnExpandUL(self.element);
            //self._UnExpandUL(self.element, function (dom) {
            //    if (underlevel) if (self._getdomlevel($(this)) < underlevel) return false;
            //    return true;
            //});
        },
        //强行设置某个末级节点选中 (外部可用)
        SetEndLISelectedByID: function (ID) {
            var self = this;
            var o = this.options;

            self.element.find(".EndLI a").removeClass("curSelectedNode");

            self.element.find(".EndLI a").each(function () {
                var key = $(this).attr("key");
                var data = self.element.data(key);
                if (data[o.Field_id] == ID) {
                    $(this).addClass("curSelectedNode");
                }

            });


        },
        //强制设置diabled的勾选  (外部可用)
        SetDisabledCheckBox: function (dom, flag) {
            var checkdom = dom.parent().children(".chk");
            checkdom.removeClass("checkbox_false_disable");
            checkdom.removeClass("checkbox_true_disable");
            if (flag == true) checkdom.addClass("checkbox_true_disable");
            if (flag == false) checkdom.addClass("checkbox_false_disable");
        },
        //手动修改节点以及他之下的(属于完全的重置包括Ico图标等等的一起,重置数据Key)
        UpdateThisAll: function (dom, value) {
            var self = this;
            var flag = Object.prototype.toString.call(value) === "[object Array]";
            var treesource = flag ? value : new Array(value);

            var htmlStr = self._buildTreeHtmlDom(treesource);
            var key = dom.attr("key");
            self.element.removeData(key);
            var NewDOM = $(htmlStr);
            dom.parent().replaceWith(NewDOM);
            return NewDOM.children("a");
        },
        //手动创建兄弟节点函数（dom是原始目标节点,value是压入键值对的值）→→→→→→添加同级目录或文件
        CreateSiblings: function (dom, value, showtext) {
            if (showtext == undefined) showtext = "新节点"
            var self = this;
            var key = newUnique();
            var newnode = dom.parent().clone();
            newnode.children("ul").empty();
            newnode.find("a").attr("key", key).removeClass("curSelectedNode");
            newnode.find(".nodetext").text(showtext);
            self.element.data(key, value);
            newnode.insertAfter(dom.parent());
        },
        //手动修改节点(相比UpdateThisAll这是一种简单性修改，只修改自身节点)
        EditThis: function (dom, value, showtext, dealICOCallback) {
            var self = this;
            var newnode = dom.parent();
            var key = newnode.children("a").attr("key");
            var NodeA = newnode.children("a");
            var NodeICO = newnode.children("a button");
            if (dealICOCallback) dealICOCallback(NodeICO);
            if (showtext != undefined) NodeA.find(".nodetext").text(showtext);
            self.element.data(key, value);
        },
        //手动删除节点函数（dom是需要删除的节点）→→→→→→→→→→→→→→→→→→删除
        DeleteThis: function (dom) {
            var self = this;
            var key = dom.attr("key");
            self.element.removeData(key);
            dom.parent().remove();
        },
        //如果判断他不是End节点可以append（dom是原始目标节点）→→→→→→→→→→→添加子级文件
        AppendCreate: function (dom, value, showtext) {
            var self = this;
            var soruceli = dom.parent();
            if (soruceli.hasClass("EndLI")) { alert("未节点不能添加下级"); return; }
            if (showtext == undefined) showtext = "新节点"
            var str = '';
            var key = newUnique();
            var temp = self.TmplEndLI.clone(); //文件模板
            temp.find(".nodetext").text(showtext);
            temp.find("a").attr("key", key);
            self.element.data(key, value);

            if (soruceli.hasClass("CommonLI")) soruceli.children("ul").prepend(temp);

        },
        //添加目录→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→添加子级目录
        AppendDirCreate: function (dom, value, showtext) {
            var self = this;
            var soruceli = dom.parent();
            if (soruceli.hasClass("EndLI")) { alert("未节点不能添加下级"); return; }
            if (showtext == undefined) showtext = "新节点"
            var str = '';
            var key = newUnique();
            var temp = self.TmplCommonLI.clone();//目录模板
            temp.find(".nodetext").text(showtext);
            temp.find("a").attr("key", key);
            self.element.data(key, value);
            if (soruceli.hasClass("CommonLI")) soruceli.children("ul").prepend(temp);
        },
        //
        _FindRootByNode_A: function (A) {
            var target_root = A.parentsUntil("[treeul=root]").last().parent();
            return target_root;
        },
        //
        _FindCommonLIByNode_A: function (A) {
            function FindParent(dom, selector) {
                if (dom) {
                    if (dom.parent()) {
                        if (dom.parent("[treeul=root]").length > 0) return undefined;
                        if (dom.parent(selector).length > 0) return dom.parent(selector);
                        else return FindParent(dom.parent(), selector);
                    } else return undefined;
                }
            };
            var CommonLI = FindParent(A, ".CommonLI");
            return CommonLI;
        },
        //
        _FindParentCommonNode_A: function (A) {
            var self = this;
            var o = this.options;
            if (A.parent("[treeul=root]").length > 0) return undefined;
            var LI = A.parent().parent().parent(".CommonLI");
            return LI.children("a");
        },

        _FindParentCommonLIDataByNode_A: function (A) {
            var self = this;
            var o = this.options;
            var Dom_A = self._FindParentCommonNode_A(A);
            if (Dom_A == undefined) return undefined;
            var key = Dom_A.attr("key");
            var data = self.element.data(key);
            return data;
        },
        //节点拖拽最终实现函数
        _changedom: function (value) {
            var self = this;
            var o = this.options;
            var info = value;

            //从sourcedom节点上移动到→targetdom
            if (info.sourcedom.attr("key") == info.targetdom.attr("key")) return;
            var source_key = info.sourcedom.attr("key");
            var target_key = info.targetdom.attr("key");

            var target_li = info.targetdom.parent();
            var source_li = info.sourcedom.parent();

            var temp = source_li.clone();
            var target_root = self._FindRootByNode_A(info.targetdom);//找到Root
            var SourceParent_CommonLI = self._FindCommonLIByNode_A(info.sourcedom);//找到父目录节点
            var TargetParent_CommonLI = self._FindCommonLIByNode_A(info.targetdom);//找到父目录节点
            if (o.IsOnlyMoveOutSide) {
                var Obj = new Object();
                Obj.SourceData = self.element.data(source_key);
                Obj.TargetData = target_root.data(target_key);
                Obj.TargetParentData = TargetParent_CommonLI ? target_root.data(TargetParent_CommonLI.children("a").attr("key")) : undefined;
                Obj.SourceParentData = SourceParent_CommonLI ? self.element.data(SourceParent_CommonLI.children("a").attr("key")) : undefined;
                self._trigger("changedomEvent", self, Obj);
                return;
            }


            target_root.find(".curSelectedNode").removeClass("curSelectedNode");//找到在此root下处理
            if (info.state == "appendTo") temp[info.state](target_li.children("ul"));
            else {
                if (target_li.hasClass("CommonLI") && o.commonnodedrag == false) return;
                temp[info.state](target_li);
            }
            if (o.IsDeleteSourceDom == true) setTimeout(function () { source_li.remove(); }, 1);//判断是否可以删除源节点

            var Obj = new Object();
            Obj.SourceData = self.element.data(source_key);
            Obj.TargetData = target_root.data(target_key);
            Obj.TargetParentData = TargetParent_CommonLI ? target_root.data(TargetParent_CommonLI.children("a").attr("key")) : undefined;
            Obj.SourceParentData = SourceParent_CommonLI ? self.element.data(SourceParent_CommonLI.children("a").attr("key")) : undefined;
            self._trigger("changedomEvent", self, Obj);
        },
        //末级节点选中被改变事件触发
        _EndCheckChangeEvent: function (DOM, flag) {
            var self = this;
            var arr = new Array();
            DOM.each(function () {
                var dom = $(this);
                var a_dom = dom.next();
                var key = a_dom.attr("key");
                var data = self._spellEasy(key, a_dom)
                //
                if (data.check != undefined) data.check = flag;
                else data["check"] = flag;
                //
                arr.push(data);
            });
            self._trigger("EndCheckChangeEvent", DOM, { "data": arr });
        },
        //checkchangeEvent
        _checkchangeEvent: function (dom, flag) {
            var self = this;
            var a_dom = dom.next();
            var key = a_dom.attr("key");
            var data = self.element.data(key);
            if (data.check != undefined) data.check = flag;
            var level = self._getdomlevel(a_dom);
            var obj = new Object();
            obj.data = data;
            obj.level = level;
            self._trigger("node_checkchange", a_dom, obj);
        },
        //各种关键事件绑定函数
        _buildEvent: function () {
            var self = this;
            var o = this.options;
            var insertInfo = new Object();//拖拽信息
            //假如是一个可伸缩的按钮则看情况伸或缩
            self.element.delegate(".noline_open", "click", function () {
                $(this).removeClass("noline_open");
                $(this).addClass("noline_close");
                $(this).find("~ ul").slideUp();
                var ico = $(this).find("~a").find(".button");
                if (ico.length == 0) return;
                if (ico.hasClass("ico_open")) { ico.removeClass("ico_open"); ico.addClass("ico_close"); }
            });
            self.element.delegate(".noline_close", "click", function () {
                $(this).removeClass("noline_close");
                $(this).addClass("noline_open");
                $(this).find("~ ul").slideDown();
                var ico = $(this).find("~a").find(".button");
                if (ico.length == 0) return;
                if (ico.hasClass("ico_close")) { ico.removeClass("ico_close"); ico.addClass("ico_open"); }
            });
            //选中高亮
            function mousePos(e) {
                var x, y;
                return {
                    x: e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
                    y: e.clientY + document.body.scrollTop + document.documentElement.scrollTop
                };
            };

            self.element.delegate("a", 'contextmenu', function (e) {
                if (o.IshasContextmenu == false) return false;
                var key = $(this).attr("key");
                var data = self._spell(key, $(this));
                self._trigger("node_rightclick", e, data);
                self.isrightclick = true;
                var pos = mousePos(e);
                var Pos_Y = pos.y;
                var Pos_X = pos.x;
                var WinHeight = $(window).height();
                if (e.clientY + self.rightmenu.outerHeight() > WinHeight) { Pos_Y = pos.y - self.rightmenu.outerHeight() };
                if (insertInfo["sourcedom"].attr("key") == $(this).attr("key")) self.rightmenu.css({ top: Pos_Y, left: Pos_X }).show();
                //alert("右键功能开发中");
                return false;
            });
            $(document).bind("mousedown", function (e) {
                if (self.isrightclick) { self.rightmenu.hide(); self.isrightclick = false; }
            });

            self.element.delegate("a", "mousedown", function () {
                self.element.find("a").removeClass("curSelectedNode");
                $(this).addClass("curSelectedNode");
                var dom = $(this);
                var key = dom.attr("key");//获取建
                var obj = self._spell(key, dom);
                self._trigger("node_Selected", $(this), obj);
            });

            var DragDomNodes = "";
            //DragDomNodes = self.element;
            //DragDomNodes = self.AllElement;
            //拖拽开始事件(这里是重点)
            self.element.delegate("a", "mousedown", function (e) {
                insertInfo["sourcedom"] = $(this);
                if (self.isrightclick == true) return;
                if (o.drag == false) return;
                if (o.commonnodedrag == false && insertInfo["sourcedom"].parent().hasClass("CommonLI")) { return; }
                var temp_a = $(this).clone().removeClass("curSelectedNode").get(0);//移除选中状态
                var ent = self.element.data($(this).attr("key"));
                self.dragUI = $("<ul></ul>").css("z-index", "99999").addClass("zTreeDragUL ztree").append("<li style='padding:0px;'>" + temp_a.outerHTML + "</li>");
                self.dragUI.find(".nodetext").text(ent.name);
                self.dragUI.hide();
                self.arrow.hide();
                $('body').append(self.dragUI);
                self.IsDown = true;
            });
            //拖拽过程事件(这里是重点)

            $(document).delegate(self._getAllTreeSelector() + " a", "mousemove", function (e) {
                $(document).find(self._getAllTreeSelector() + " a").not($(this)).removeClass("tmpTargetNode_inner");

                var pos = $(this).offset();

                var height = $(this).height();
                var mousepos = mousePos(e);
                insertInfo["targetdom"] = $(this);
                if (self.IsDown) {
                    var target_li = insertInfo["targetdom"].parent();
                    var source_li = insertInfo["sourcedom"].parent();
                    var target_IsEnd = target_li.hasClass("CommonLI") == true ? false : true;
                    var source_IsEnd = source_li.hasClass("CommonLI") == true ? false : true;
                    //
                    var source_root = self._FindRootByNode_A(insertInfo["sourcedom"]);//找到Root
                    var IsFinalAllowFlag = true;//本次拖拽是否允许有效

                    //目标节点必须是本树形结构内的一部分,不能是外部的树形,如果
                    if (source_root.find(insertInfo["targetdom"]).length == 0 && o.IsPreventOutSide == true) {
                        self.changeflag = false;
                        $(this).css("cursor", "not-allowed");
                        return;
                    }

                    //目标节点只能是外部,如果是本树之间拖拽将被禁止
                    if (source_root.find(insertInfo["targetdom"]).length > 0 && o.IsOnlyMoveOutSide == true) {
                        self.changeflag = false;
                        $(this).css("cursor", "not-allowed");
                        return;
                    }


                    //父节点不能移动到自己和自己的子节点
                    if (source_li.hasClass("CommonLI")) {
                        self.arrow.hide();
                        self.changeflag = false;
                        $(this).css("cursor", "not-allowed");
                        if (source_li.find(insertInfo["targetdom"]).length != 0) return;
                        if (insertInfo["sourcedom"].attr("key") == insertInfo["targetdom"].attr("key")) return;
                    }
                    //自己的子节点不能再次添加到自己
                    if (target_li.hasClass("CommonLI") && pos.top + height / 3 < mousepos.y && pos.top + height * 2 / 3 > mousepos.y) {
                        self.arrow.hide();
                        self.changeflag = false;
                        $(this).css("cursor", "not-allowed");
                        if (target_li.find(insertInfo["sourcedom"]).length != 0) return;
                    }

                    //除去以上标准特殊情况外
                    var topoffet = 0;//箭头上下偏移
                    var insertstate = "";//插入在前还是在后的状态
                    //如果目标是一个文件夹
                    if (target_li.hasClass("CommonLI")) {
                        if (pos.top + height / 3 > mousepos.y) { topoffet = -8; insertstate = "insertBefore"; }//箭头靠上打
                        else if (pos.top + height / 3 < mousepos.y && pos.top + height * 2 / 3 > mousepos.y) { topoffet = 0; insertstate = "appendTo"; }//箭头对中心
                        else { topoffet = 8; insertstate = "insertAfter"; }//箭头靠下打
                    } else {
                        if (pos.top + height / 2 > mousepos.y) { topoffet = -8; insertstate = "insertBefore"; }//箭头靠上打
                        else { topoffet = 8; insertstate = "insertAfter"; }//箭头靠下打
                    }
                    if (insertstate == "appendTo") insertInfo["targetdom"].addClass("tmpTargetNode_inner");
                    else insertInfo["targetdom"].removeClass("tmpTargetNode_inner");



                    if (o.IsBanDrag && (o.IsBanDrag(source_li, target_li, insertstate) == false))
                        if (flag == true) IsFinalAllowFlag = false;

                    if (o.IsBanDrag_OnChangeLevel) {
                        var flag = function () {
                            //假如原始为父辈，目标为末级，就得禁止
                            if (source_IsEnd == false && target_IsEnd == true) return true;
                            //假如原始为父辈，目标也为父辈，内部添加就得禁止
                            if (source_IsEnd == false && target_IsEnd == false && insertstate == "appendTo") return true;
                            //假如原始为末级，目标为父辈，兄弟添加就得禁止
                            if (source_IsEnd == true && target_IsEnd == false && insertstate != "appendTo") return true;
                            return false;
                        }();
                        if (flag == true) IsFinalAllowFlag = false;
                    }

                    if (o.IsOnlyTarget_EndLI_AppendCommonLI == true && target_li.hasClass("CommonLI") && (insertstate == "insertAfter" || insertstate == "insertBefore")) {
                        if (flag == true) IsFinalAllowFlag = false;
                    }

                    insertInfo["state"] = insertstate;
                    self.arrow.css({ top: pos.top + topoffet, left: pos.left - 16 }).show();

                    if (IsFinalAllowFlag == false) {
                        $(this).css("cursor", "not-allowed");
                        self.changeflag = false;
                    }
                    else {
                        $(this).css("cursor", "pointer");
                        self.changeflag = true;//节点移动过的标志位
                    }

                }
            });





            $("body").mousemove(function (e) {
                if (self.IsDown) {
                    var pos = mousePos(e);
                    self.dragUI.css({ top: pos.y, left: pos.x + 15 }).show();
                }
            });

            $("body").bind("mouseup", function (e) {
                if (self.IsDown) {
                    if (self.dragUI != null) self.dragUI.remove();

                    self.IsDown = false;
                    self.arrow.hide();
                    self._getAllElement().find("a").css("cursor", "pointer");
                    self._getAllElement().find("a").removeClass("tmpTargetNode_inner");
                    if (self.changeflag == true) { self.changeflag = false; self._changedom(insertInfo); }
                }
            });
            //如果没有checkbox的处理
            if (o.checkbox == false) {

            }//如果有checkbox的处理
            else {
                var Selectall = function (val) {
                    var CurDom = val.find("li:not([filterflag=false]) .chk");
                    CurDom.each(function () {
                        if ($(this).hasClass("checkbox_false_full")) {
                            $(this).removeClass("checkbox_false_full");
                            $(this).addClass("checkbox_true_full");
                        }
                    });
                    self._EndCheckChangeEvent(CurDom, true);
                };
                var Unselectall = function (val) {
                    var CurDom = val.find("li:not([filterflag=false]) .chk");
                    CurDom.each(function () {
                        if ($(this).hasClass("checkbox_true_full")) {
                            $(this).removeClass("checkbox_true_full");
                            $(this).addClass("checkbox_false_full");
                        }
                    });
                    self._EndCheckChangeEvent(CurDom, false);
                };
                //绑定一般checkbox的click事件
                self.element.delegate(".chk", "click", function () {
                    if (!$(this).hasClass("EndNode") && o.onlycheckone) return;
                    //假如是取消，现在准备勾选
                    var flag_check_false = $(this).hasClass("checkbox_false_full_focus") || $(this).hasClass("checkbox_false_full");
                    var flag_check_true = $(this).hasClass("checkbox_true_full_focus") || $(this).hasClass("checkbox_true_full");
                    var flag_foucs = false;
                    var _foucs = flag_foucs == true ? "_foucs" : "";
                    if (flag_check_false) {
                        if (o.onlycheckone) {
                            self.element.find(".chk").removeClass("checkbox_true_full");
                            self.element.find(".chk").addClass("checkbox_false_full");
                        }
                        $(this).removeClass("checkbox_false_full" + _foucs);
                        $(this).addClass("checkbox_true_full" + _foucs);
                        if ($(this).find("~ ul").length != 0) {
                            Selectall($(this).find("~ ul"));
                        }//一旦有子级则全选子级
                        else {
                            self._EndCheckChangeEvent($(this), true);
                        }
                        self._checkchangeEvent($(this), true);
                        return;
                    }
                    //假如是勾选，现在准备取消
                    if (flag_check_true) {
                        $(this).removeClass("checkbox_true_full" + _foucs);
                        $(this).addClass("checkbox_false_full" + _foucs);
                        //一旦发现自己的父级以前处于选中状态则必选取消其选中
                        $(this).parents("li").each(function () {
                            $(this).children(".CommonNode").each(function () {
                                if ($(this).hasClass("checkbox_true_full")) {
                                    $(this).removeClass("checkbox_true_full");
                                    $(this).addClass("checkbox_false_full");
                                    self._checkchangeEvent($(this), false);
                                }
                            });
                        });
                        //这是一个特别的处理用来处理子级没有全选的时候,取消父级的全选
                        if ($(this).find("~ ul").length != 0) {
                            Unselectall($(this).find("~ ul"));
                        }//一旦有子级则全选子级//一旦有子级则全不选子级
                        else {
                            self._EndCheckChangeEvent($(this), false);
                        }
                        self._checkchangeEvent($(this), false);
                        return;
                    }
                });
                //使点标签可以出发check选择
                self.element.delegate("a", "click", function () {
                    $(this).prev().trigger("click");
                });
            }
            //纯事件处理
            self.element.delegate("a", "dblclick", function () {
                var dom = $(this);
                var key = dom.attr("key");//获取建
                //开始拼装
                var obj = self._spell(key, dom);
                self._trigger("node_dblclick", $(this), obj);
            });
            self.element.delegate("a", "click", function () {
                var dom = $(this);
                var key = dom.attr("key");//获取建
                //var level = dom.attr("level");//获取深度
                //开始拼装
                var obj = self._spell(key, dom);
                self._trigger("node_click", $(this), obj);
            });
            //额外事件
        },
        //DOM Tree核心HTML构造
        _buildTreeHtmlDom: function (datasource) {
            var self = this;
            var o = this.options;

            var Field = new Object();

            Field["name"] = o.Field_name;
            Field["children"] = o.Field_children;

            var ico_tmpl = '<span class="button ico_${State} ${IcoClass}" style="${IcoStyle}"></span>'
            var checkbox_tmpl = '<span class="button chk checkbox_${Check}_${EnableState} ${CheckNode}"></span>'

            if (o.checkbox == false) checkbox_tmpl = "";
            if (o.ico == false) ico_tmpl = "";
            var li_tmpl = '<li hidefocus class="${li_State}"><span class="button switch noline_${State}"></span>'
                + checkbox_tmpl + '<a class="" target="_blank" key="${key}">' + ico_tmpl + '<span class="nodetext">${Name}</span></a>${&Html}</li>';


            //模板构造完毕，开始无限递归造树

            var fmt_LI = function (Level, IsParent, IsCheck, Entity) {
                var Name = Entity[Field["name"]];

                var level = "level" + Level.toString();
                var levelNum = Level.toString();
                var UniqueKey = newUnique();//唯一值
                //
                //var li_State = IsParent ? "CommonLI" : "EndLI";
                //var CheckNode = IsParent ? "CommonNode" : "EndNode";
                //var EnableState = o.abortcheck ? "disable" : "full";
                //var Check = IsCheck ? "true" : "false";
                //var Name = Name ? Name.toString() : "--";
                //装载键值对
                self.element.data(UniqueKey, Entity);//写入键值
                //开始准备构造li
                var ReplaceEntity = new Object();
                ReplaceEntity["State"] = IsParent ? (Entity["IsOpen"] == false ? "close" : "open") : "docu";
                ReplaceEntity["EnableState"] = o.abortcheck ? "disable" : "full";
                //ReplaceEntity["levelNum"] = Level;
                ReplaceEntity["key"] = UniqueKey;
                ReplaceEntity["li_State"] = IsParent ? "CommonLI" : "EndLI";
                ReplaceEntity["CheckNode"] = IsParent ? "CommonNode" : "EndNode";
                ReplaceEntity["Name"] = Name ? Name.toString().encodeHtml() : "--";
                ReplaceEntity["Check"] = IsCheck ? "true" : "false";
                ReplaceEntity["IcoStyle"] = Entity["IcoStyle"];
                ReplaceEntity["IcoClass"] = Entity["IcoClass"];
                return li_tmpl.replace$Object(ReplaceEntity);
            };
            var fmt_UL = function (levelIndex, IsOpen) {
                var ul_tmpl = '<ul class="noline">${&Html}</ul>';
                if (IsOpen == false) ul_tmpl = '<ul class="noline" style="display:none">${&Html}</ul>';
                return ul_tmpl.replace("#levelIndex", levelIndex);
            }

            if (!self.fmt_LI) self.fmt_LI = fmt_LI;
            self.TmplEndLI = $(fmt_LI(0, false, false, {}).replace$html(""));
            self.TmplCommonLI = $(fmt_LI(0, true, false, {}).replace$html("")).append('<ul class="noline"></ul>');


            var BuildTreeMain = function (nodes, levelIndex, IsOpen) {
                var self = this;
                var text = "";
                if (levelIndex == null) levelIndex = 0;
                var ul = "";
                if (levelIndex != 0) {
                    ul = fmt_UL(levelIndex, IsOpen);
                }
                $.each(nodes, function (index, ent) {
                    var IsdefaultCheck = false;
                    var IsParent = false;
                    var nextIsOpen = ent["IsOpen"];
                    if (ent["check"] == true) IsdefaultCheck = true;
                    if (ent["IsParent"] == true) IsParent = true;
                    if (ent[Field["children"]] == undefined || ent[Field["children"]].length == 0) {
                        var IsParentHTML = "";
                        if (IsParent == true) IsParentHTML = '<ul class="noline"></ul>';
                        text += fmt_LI(levelIndex, IsParent, IsdefaultCheck, ent).replace$html(IsParentHTML);
                    }
                    else if (ent[Field["children"]].length != 0) {
                        var nextnode = ent[Field["children"]];
                        var nextroot = fmt_LI(levelIndex, true, IsdefaultCheck, ent);

                        var nextTree = new BuildTreeMain(nextnode, levelIndex + 1, nextIsOpen);
                        text += nextroot.replace$html(nextTree.result);
                    }
                });
                if (levelIndex != 0) {
                    text = ul.replace$html(text);
                }
                self.result = text;
            };

            var tree = new BuildTreeMain(datasource);
            return tree.result;
        },
        //DOM Tree核心构造
        _buildtree: function (value) {
            var self = this;
            var o = this.options;
            var treesource = o.treesource;
            if (value) { treesource = value; }
            self.element.empty();
            self.element.addClass("ztree");
            self.element.css("-moz-user-select", "-moz-none");
            self.element[0].onselectstart = function () { return false; };
            self.element.append(self._buildTreeHtmlDom(treesource));
        },
        //二次修改参数区
        _setOption: function (key, value) {
            var self = this;
            switch (key) {
                case "treesource":
                    self._buildtree(value);
                    break;
                default:
                    break;
            }
            $.Widget.prototype._setOption.apply(this, arguments);
        }
    });
})(jQuery);