$.SkylandValidate = {
    formValidate: function (root, isValidateRequired, isAppendSign) {
        //正则验证
        function validate(obj) {
            var checkObj = $(obj);
            var errorMsg = "";
            //验证邮件
            if (checkObj.is('.email')) {
                if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(obj.value)) {
                    errorMsg = '请输入正确的E-Mail地址.';
                }
            }
            if (checkObj.is('.tel')) {
                if (!/(\d{3}-)?\d{8}|(\d{4}-)(\d{7})/.test(obj.value)) {
                    errorMsg = '请输入正确的电话号码.';
                }
            }

            if (checkObj.is('.phone')) {
                if (!/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(obj.value)) {
                    errorMsg = '请输入正确的手机号码.';
                }
            }

            if (checkObj.is('.postal')) {
                if (!/^[1-9][0-9]{5}$/.test(obj.value)) {
                    errorMsg = '请输入正确的邮编.';
                }
            }
            if (checkObj.is('.idcard')) {
                if (!/\d{17}[\d|X]|\d{15}/.test(obj.value)) {
                    errorMsg = '请输入正确的身份证号.';
                }
            }
            if (checkObj.is('.date')) {
                if (!/((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/.test(obj.value)) {
                    errorMsg = '请输入正确的日期.';
                }
            }
            if (checkObj.is('.datetime')) {
                if (!/^((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s(((0?[0-9])|(1[0-9])|(2[0-3]))\:(([0-5][0-9])|([0-9]))(((\s)|(\:(([0-5][0-9])|([0-9]))))?)))?$/.test(obj.value)) {
                    errorMsg = '请输入正确的日期时间.';
                }
            }
            if (checkObj.is('.integer')) {
                if (!/^-?[1-9]\d*$/.test(obj.value)) {
                    errorMsg = '请输入整数.';
                }
            }
            if (checkObj.is('.positive-integer')) {
                if (!/^[1-9]\d*$/.test(obj.value)) {
                    errorMsg = '请输入正整数.';
                }
            }
            if (checkObj.is('.negative-integer')) {
                if (!/^-[1-9]\d*$/.test(obj.value)) {
                    errorMsg = '请输入负整数.';
                }
            }
            if (checkObj.is('.float')) {
                if (!/^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/.test(obj.value)) {
                    errorMsg = '请输入小数.'; //浮点数
                }
            }
            if (checkObj.is('.non-negative-floating')) {
                if (!/^(\d{2,}|[0-9])\.\d+|0$/.test(obj.value)) {
                    errorMsg = '请输入正数小数.'; //非负浮点数
                }
            }
            if (checkObj.is('.non-positive-floating')) {
                if (!/^(-([1-9]\d*\.\d*|0\.\d*[1-9]\d*))|0?\.0+|0$/.test(obj.value)) {
                    errorMsg = '请输入负数小数.'; //非正浮点数
                }
            }
            if (checkObj.is('.number')) {
                if (!/^-?([1-9]\d*\.\d*|0\.\d+|[1-9]\d*|0)$/.test(obj.value)) {
                    errorMsg = '请输入数字.'; //数字(包括正负整数、小数和0)
                }
            }
            if (checkObj.is('.positive-number')) {
                if (!/^([1-9]\d*\.\d*|0\.\d+|[1-9]\d*)$/.test(obj.value)) {
                    errorMsg = '请输入正数.'; //正数(包括正的整数、小数，不包括0)
                }
            }
            if (checkObj.is('.negative-number')) {
                if (!/^-([1-9]\d*\.\d*|0\.\d+|[1-9]\d*)$/.test(obj.value)) {
                    errorMsg = '请输入负数.'; //负数(包括负的整数、小数，不包括0)
                }
            }
            if (checkObj.is('.non-negative-number')) {
                if (!/^([1-9]\d*\.\d*|0\.\d+|[1-9]\d*|0)$/.test(obj.value)) {
                    errorMsg = '请输入非负数.'; //非负数(包括正的整数、小数和0)
                }
            }
            if (checkObj.is('.non-positive-number')) {
                if (!/^(-([1-9]\d*\.\d*|0\.\d+|[1-9]\d*)|0)$/.test(obj.value)) {
                    errorMsg = '请输入非正数.'; //非正数(包括负的整数、小数和0)
                }
            }
            if (checkObj.is('.password')) {
                if (!/^[A-Za-z]{1}([A-Za-z0-9]|[._]){5,19}$/.test(obj.value)) {
                    errorMsg = '密码不能包含特殊字符,长度为5到19位.';
                }
            }

            return errorMsg;
        }
        //必填项追加标识
        function appendSign(className) {
            $(root).find(":input." + className).each(function () {
                if ($(this).parent().find('strong').length) {
                    return;
                }
                var className = 'high';
                if ($(this).parent().is('.input-group')) {
                    className = 'high-btn';
                }
                var $required = $("<strong class='" + className + "'>*</strong>"); //创建元素
                $(this).parent().append($required); //然后将它追加到文档中
            });
        }

        //清空提示
        $(root).find(".formtips").remove();
        //必填项追加*
        if (isValidateRequired && isAppendSign) {//是否追加*
            appendSign("required");
        }
        if (isAppendSign) { //是否追加*
            appendSign("forceRequired");
        }
        //清空事件，防止多次调用
        $(root).find(":input").unbind('blur');
        //$(root).find(":input").unbind('focus');
        //文本框失去焦点后
        $(root).find(":input").blur(function () {
            var $parent = $(this).parent();
            if ($parent.is('.input-group')) {
                $parent = $parent.parent();
            }
            $parent.find(".formtips").remove();

            var errorMsg = "";
            if ($(this).is('.required') && isValidateRequired) {//验证必填，无需验证时isValidateRequired=false
                if (this.value == "" || this.value == null) {
                    errorMsg = '不能为空.';
                } else {
                    //继续验证
                    errorMsg = validate(this);
                }
            } else if ($(this).is('.forceRequired')) {//强制验证必填
                if (this.value == "" || this.value == null) {
                    errorMsg = '不能为空.';
                } else {
                    //继续验证
                    errorMsg = validate(this);
                }
            } else {
                if (this.value != "" && this.value != null) {
                    //继续验证
                    errorMsg = validate(this);
                }
            }
            if (errorMsg != "") {//input-group格式的控件集，要把提示信息放到外面
                //$parent.append('<div class="formtips onError">' + errorMsg + '</div>');//原
                //新：浮动
                var div = $('<div class="formtips onError tooltip top in"><div class="tooltip-arrow"></div><div class="tooltip-inner">' + errorMsg + '</div></div>');
                $parent.append(div);
                //var width = -div[0].clientWidth + 7;
                //$(div).css({ 'right': width + 'px' });
                //$(div.children()[0]).addClass('formtips-arrow');
                $(div.children()[0]).css({ 'border-top-color': 'rgb(229, 83, 83)' });

            } else {//一般的控件集，直接把提示信息追加到input之后
                $parent.find(".formtips").remove();
            }
        });
        //.keyup(function () {
        //    //$(this).triggerHandler("blur");
        //}).focus(function () {
        //    $(this).triggerHandler("blur");
        //}); //end blur

    },
    submitValidate: function (root) {
        //提交，最终验证。
        $(root).find(":input").trigger('blur');
        var numError = $(root).find('.onError').length;
        if (numError) {
            //切换tab页
            var isParent = false;
            var nav = $(root).parent().find('.nav').first();
            if (nav.length == 0) {
                nav = $(root).parent().parent().find('.nav').first();
                isParent = true;
            }
            if (nav.length > 0) {
                var navContent = nav.next();
                for (var i = 0; i < nav.parent().children().length - 1; i++) {
                    var dataId = root.attr('data-id');
                    if (isParent) {
                        dataId = root.parent().attr('data-id');
                    }
                    if (navContent.attr('data-id') == dataId) {
                        nav.find('li:eq(' + i + ')').click();//模拟点击tab页切换
                        break;
                    }
                    navContent = navContent.next();
                }
            }
            //触发焦点
            var firstErrorInput = $(root).find('.onError:eq(0)').parent().find(':input:eq(0)');
            //$(root).find('.onError:eq(0)').focus();
            firstErrorInput.focus();
            //滚动到相应位置
            var scroll = $(root).find('.onError:eq(0)').offset().top;
            //WFformmodel---工作流相关的界面滚动条在子div控制
            var mainChildren = $("#iwf-frame-main>div:visible");//.children().find(':visible');
            if (mainChildren.attr('model') == 'WFformmodel') {
                mainChildren.children().last().animate({ scrollTop: scroll }, 100);
            } else {//其他界面直接由界面控制
                mainChildren.animate({ scrollTop: scroll }, 500);
            }


            return false;
        }
        return true;
    }
};

//公共界面组件，包括tab\window\listview\toobar\
(function ($) {

    $.fn.iwfWindow = function (options) {
        var self = this;
        var defaults = {
            css: {
                root: 'modal-content',
                title: 'modal-header',
                content: 'modal-body',
                foot: 'modal-footer'
            },
            width: 1920,
            height: 1080,
            local: null,
            mask: true,
            tpl: {
                html: '',
                selCss: ''
            },
            title: '窗口',
            button: [],
            closeable: true,
            btncss: 'btn btn-default'
        };
        var opts = $.extend(defaults, options);
        var selectData = null;
        //  var titleHeight = 35,
        //  footHeight = (opts.button.length > 0) ? 45 : 0;
        var rbody = $(this);
        var dialogDIV = $('<div><div class="modal-backdrop fade in"></div><div style=" position:absolute; left:0px; top:0px; z-index:2000; "></div></div>');

        var bg = dialogDIV.appendTo(rbody);
        var root = $(bg.children()[1]);
        this.dialogdom = root;
        if (opts.mask == false) { $(bg.children()[0]).hide(); }//隐藏遮罩层  --黄欢加上  2014-11-14
        //不能超过当前窗口宽度
        opts.width = (opts.width < ($("body").width() - 10) ? opts.width : $("body").width() - 10);
        if (window.innerHeight > 300) {
            opts.height = (opts.height < (window.innerHeight - 15) ? opts.height : window.innerHeight - 15);
        }

        root.width(opts.width).addClass(opts.css.root).height(opts.height).css({ "backgroundColor": opts.backgroundColor });
        if (opts.local) root.css(opts.local);
        else root.css({
            left: (rbody.width() - opts.width) / 2,
            top: Math.max((rbody.height() - opts.height) / 2, 5)
        });
        function titleMouseDown(e) {
            var offx = e.clientX - parseInt(root.css('left'));
            var offy = e.clientY - parseInt(root.css('top'));
            $(document).bind('mousemove', function (ex) {
                root.css({
                    left: ex.clientX - offx,
                    top: ex.clientY - offy
                })
            })
        }
        var headhtml = '<span>' + opts.title + '</span>';
        if (opts.closeable) headhtml += '<a class="close"  href="javascript:void(0)" aria-hidden="true">&times;</a>';
        var title = $('<div>' + headhtml + '</div>').appendTo(root);

        title.addClass(opts.css.title).children("a").bind("click", function () {
            if (opts.closeEvent) opts.closeEvent();
            bg.remove();
        });
        title.bind('mousedown', titleMouseDown).bind('mouseup', function () {
            $(document).unbind('mousemove');
        });
        var content = $('<div></div>').appendTo(root);



        content.addClass(opts.css.content).height(opts.height - 145).css({ "backgroundColor": "white" });;
        content.css("overflow", "auto");
        if (opts.append) content.append(opts.append);
        if (opts.button && opts.button.length > 0) {
            var foot = $('<div></div>').appendTo(root);
            foot.addClass(opts.css.foot);//.height(footHeight - 1);
            var nofocus = true;
            $.each(opts.button,
            function (index, item) {
                var temp = $('<input type="button" value="' + item.text + '" />').appendTo(foot);
                if (nofocus || item.focus) { temp[0].focus(); nofocus = false; }
                if (item.css)
                    temp.addClass(item.css);
                else
                    temp.addClass(opts.btncss);
                temp.bind('click', item, function (sender) {
                    if (sender.data.handler) sender.data.handler(selectData)
                })
            })
        } else
            content.addClass(opts.css.content).height(opts.height - 100);
        var re = /\{([^\{\}]+)\}/g;
        var fnRe = /(\w+)\(([^\(\)]+)\)/i;
        this.loadData = function (data) {
            $.each(data,
            function (i, item) {
                var html = opts.tpl.html.replace(re,
                function (sender, key) {
                    if (fnRe.test(key)) {
                        if (opts[RegExp.$1]) return opts[RegExp.$1](item[RegExp.$2]);
                        else return item[RegExp.$2]
                    } else {
                        return (item[key]) ? item[key] : ''
                    }
                });
                var row = $(html).appendTo(content);
                row.bind("click", item,
                function (sender) {
                    $(this).siblings().removeClass(opts.tpl.selCss);
                    $(this).addClass(opts.tpl.selCss);
                    if (opts.itemclick) opts.itemclick(row, sender.data)
                })
            })
        };
        this.load = function (url, callback) {
            content.load(url, callback)
        };
        this.append = function (html) {
            content.append(html)
        };
        this.content = function () {
            return content
        };
        this.children = function () {
            return content.children()
        };
        this.close = function () {
            $.iwf.onfocus();
            if (opts.closeEvent) opts.closeEvent();
            bg.remove()
        };
        return this
    };

    ///列表
    //options:
    // expandbyClick:false,
    //flowlayout:100;
    //expandable:fasle,
    //data: [
    //{ title: '新建业务', text: '新建', iconCls: 'icon-arrow-left', css: 'btn-primary',id:'001',checked:true
    //    handler: function () {
    //       alert("");
    //    }
    //},
    //{ type: 'split' },
    //{ type: 'group',title: '分组的待办箱', text: '待办箱', iconCls: 'icon-save',id:'002',url:'',expend:true,expandbyClick:true,unselectable:true,
    //    children: [
    //    { id: 'cd-001', title: '信访', text: '信访',url:'' },
    //    { id: 'cd-003', title: '收文', text: ' 收文 ',url:'' }
    //  ]
    // },
    //{ type: 'split' },
    //{ title: '系统设置', text: '系统设置',url:'' }
    //    ] 
    $.fn.listView2 = function (options) {

        var defaults = {
            title: "",
            css: {
                line: 'divider',
                list: 'list-group',
                item: 'list-group-item',
                selected: 'active'
            },
            data: [],
            selectIndex: -1,
            flowlayout: 0,
            expandable: true,
            expandbyClick: false,
            itemclick: function (item) { }
        }
        var me = this;
        var opts = $.extend(defaults, options);
        var root = $(this);



        function addItem(items, element, isRoot) {
            var aItem;
            $.each(items, function (index, node) {


                if (node.type == "split") {
                    $('<a style="height:4px;padding:0px;"  class="' + opts.css.item + '" unselectable="on"></a>').appendTo(element);
                } else {
                    var ttt = (node.title) ? ' title="' + node.title + '" ' : '';
                    var isFlow = (isRoot == false && node.type != "group" && opts.flowlayout > 0) ? 'style="float:left; width:' + opts.flowlayout + 'px;"' : '';
                    var nodecss = (node.css) ? node.css : opts.css.item;
                    if (node.checked == true) nodecss += " " + opts.css.selected;
                    if (node.name && node.text == undefined) node.text = node.name;
                    var a = $('<a  data-id="' + node.id + '" class="' + nodecss + '" unselectable="on" ' + ttt + isFlow + ' >' + node.text + '</a>').appendTo(element);
                    aItem = a;
                    if (node.iconCls) $('<span unselectable="on" class="' + node.iconCls + '">&nbsp;</span>').prependTo(a);
                    a.data = node.url;
                    if (node.children && (opts.expandbyClick || node.expandbyClick)) { a.css("cursor", "pointer") };
                    a.bind('click', function (ev) {
                        if (node.checked == true) {
                            $(this).removeClass(opts.css.selected);
                            node.checked = false;
                        } else if (node.checked == false) {
                            $(this).addClass(opts.css.selected);
                            node.checked = true;
                        }
                        if (node.unselectable != true && node.checked == undefined) me.setSelectedbyID(node.id);
                        if (node.handler)
                            node.handler(node, a);
                        else {
                            //opts.itemclick(node, a);
                            if (opts.handler)
                                opts.handler(node, a);
                            else
                                opts.itemclick(node, a);
                        }
                        if (node.children && (opts.expandbyClick || node.expandbyClick)) {

                            expandSubMenu(this);
                        }
                    });
                    // 如果是有子菜单
                    if (node.children && node.children.length > 0) {
                        var ul = $('<div data-ul="' + node.id + '" style="margin:0 0 0px 3px;" class="subtree"></div>').appendTo(element);
                        if (opts.expandable == true) {
                            var btnHind = $('<div class="pull-right ">' + (opts.title ? opts.title : "") + '&nbsp;<span data-hind="' + node.id + '" unselectable="on" class="fa fa-caret-down  fa-lg" style="width:8px;height:12px;"></span></div>').appendTo(a);

                            btnHind.bind('click', function (e) {

                                if (btnHind.children().hasClass("fa fa-caret-down")) {
                                    btnHind.children().removeClass("fa fa-caret-down");
                                    btnHind.children().addClass("fa fa-caret-left");
                                    ul.hide();
                                    node.expand = false;
                                } else {
                                    btnHind.children().removeClass("fa fa-caret-left");
                                    btnHind.children().addClass("fa fa-caret-down");
                                    ul.show();
                                    node.expand = true;
                                }
                                return false;
                            });
                        }
                        addItem(node.children, ul, false);

                        if (node.expand == false) {
                            btnHind.children().removeClass("fa fa-caret-down");
                            btnHind.children().addClass("fa fa-caret-left");
                            ul.hide();
                        }
                    }
                }
            });

            if (aItem && isRoot == false) {
                aItem.css("border-bottom-right-radius", "0px");
                aItem.css("border-bottom-left-radius", "0px");
                aItem.css("margin-bottom", "-1px");

            }

            if (isRoot == false && opts.flowlayout > 0) {
                $('<div style="clear: both;"></div>').appendTo(element);

            }
        }

        function expandSubMenu(node, isExpand) {
            var btnHind = $(node).children("div");
            var ul = $(node).next();
            if (isExpand == undefined) isExpand = !btnHind.children().hasClass("fa fa-caret-down");
            if (!isExpand) {
                btnHind.children().removeClass("fa fa-caret-down");
                btnHind.children().addClass("fa fa-caret-left");
                ul.hide();

            } else {
                btnHind.children().removeClass("fa fa-caret-left");
                btnHind.children().addClass("fa fa-caret-down");
                ul.show();
            }
        }

        var ul = $('<div data-ul="listviewroot" class="' + opts.css.list + '" style="margin:0px;"></div>').appendTo(root);
        if (opts.children) opts.data = opts.children;
        addItem(opts.data, ul);

        var selectid;

        this.setSelectedbyID = function (id) {
            root.find("[data-id]").removeClass(opts.css.selected);
            if (id) selectid = id;
            root.find("[data-id='" + id + "']").addClass(opts.css.selected);
            // selectid = id;
        }

        this.getSelectedID = function () {
            return selectid;
        }
        //根据ID触发点击事件
        this.toggleClickByID = function (id) {
            root.find("[data-id=" + id + "]").click();
        }

        return this;

    }

    ///工具条，加入按钮选择接口，加入更多控件支持！！
    //options:
    //data: [
    //{ title: '表单列表', text: '表单列表', select: false, iconCls: 'icon-arrow-left',
    //    handler: function () {
    //       alert("");
    //    }
    //},
    //{ type: 'split' },
    //{ title: '保存', text: '保存', iconCls: 'icon-save', handler: save, css: 'btn-primary' },
    //{ type: 'split' },
    //{
    //    title: '管理数据源', text: '数据源', iconCls: 'icon-sitemap', handler: function () {
    //        datasourceManage(options.dataDefined, function (data) {
    //            //保存后会加入中文备注 
    //            options.saveConfig(data, function (json) {
    //                //dataDefined = json;
    //                propertys.setData(json);
    //            });
    //        });
    //    }
    //},
    //{ type: 'split' },
    //{ content:'<select> ...</select>' },
    //{ type: 'group', children: [
    //    { id: 'cd-001', title: '设计', text: '设计', handler: codeShow, select: true },
    //    { id: 'cd-003', title: 'JS', text: ' JS ', handler: codeShow, select: false }
    //  ]
    // },
    //{
    //    type: 'menu', iconCls: 'fa fa-table', text: '表格', handler: tableAction,flowlayout:100,
    //    children: [
    //            { id: 'td-001', name: '插入表格' },
    //            { id: 'td-002', name: '插入行' },
    //            { id: 'td-003', name: '插入列' },
    //            { id: 'td-004', name: '合并下一列' },
    //            { id: 'td-005', name: '合并下一行' }
    //    ]
    //},
    //{
    //    type: 'menu', iconCls: 'fa fa-table', text: '表格', handler: tableAction,show:function(root){}            
    //}
    //{ type: 'split' },
    //{ title: '设置为业务模块', text: '业务模块', handler: addToPrivilege, css: 'btn-info' }
    //    ]  
    $.fn.iwfToolbar = function (options) {
        var defaults = {
            css: {
                root: 'iwf-toolbar',
                button: 'btn btn-default',
                link: 'iwf-toolbar-link',
                text: 'iwf-toolbar-text2',
                select: 'active',
                split: 'btn-split',
                circle: 'btn-circle',
                menu: 'btn-menu'
            },
            data: [],
            handler: function (data, sender) { }
        };
        var opts = $.extend(defaults, options);
        var root = $(this).addClass(opts.css.root);
        root.children().remove();
        function itemUp(sender, el) {
            //var el = $(this);
            ////  el.blur();
            //  if (sender.data.select != undefined || sender.data.checked != undefined) {
            //      if (sender.data.select != undefined) sender.data.select = !sender.data.select;
            //      if (sender.data.checked != undefined) { sender.data.checked = !sender.data.checked; sender.data.select = sender.data.checked; }

            //      if (sender.data.select) el.addClass(opts.css.select);
            //      else el.removeClass(opts.css.select)
            //  }
            if (sender.data.select != undefined) sender.data.select = !sender.data.select;
            if (sender.data.checked != undefined) {
                sender.data.checked = !sender.data.checked;
                $(el).toggleClass(opts.css.select);
            }
            if (sender.data.handler) sender.data.handler(this, sender.data);
            else opts.itemclick(this, sender.data)

        }

        function setMenuItem(ui, menuNodes) {
            var usermenu = $('<div class="dropdown-menu" role="menu" aria-labelledby="dLabel" style="width:200px;"></div>').appendTo(ui).listView2(menuNodes);
            ui.find("a").css("border-width", "0px");
        }
        //function setMenuItem(ui, data) {
        //    var menuRoot = $('<div style="width:400px; max-height:350px;position:absolute;border: 1px solid #999;background-color: #FFF;overflow:auto;z-index:99999;" />').hide().appendTo(ui);
        //    function selectChange(gid, uid) {
        //        for (var i = 0; i < data.children.length; i++) {
        //            var group = data.children[i];
        //            for (var j = 0; j < group.children.length; j++) {
        //                var u = group.children[j];
        //                if (data.singled) {
        //                    if (u.selected) u.selected = (u.id == uid && gid == group.id)
        //                } else if (gid == group.id) {
        //                    if (u.selected) u.selected = (u.id == uid)
        //                }
        //            }
        //        }
        //        createUI()
        //    }
        //    function createUI() {
        //        menuRoot.children().remove();
        //        var text = '';
        //        if (!data.children || data.children.length == 0) return;
        //        $.each(data.children,
        //        function (i, group) {
        //            $('<div style="height:25px;border-bottom:1px solid #EBEDEB;background-color: #F4F5F4;padding-left: 10px;font-weight: bold;">' + group.name + '</div>').appendTo(menuRoot);
        //            var itemContent = $('<div style="overflow:hidden;padding-left: 5px;border-bottom:1px solid #ccc;"></div>').appendTo(menuRoot);
        //            $.each(group.children,
        //            function (j, u) {
        //                var itemui = $('<div style="float: left;margin:2px 0 2px 10px;"><span class=".btn .btn-default" unselectable="on">' + u.name + '</span></div>').appendTo(itemContent);
        //                if (u.id) itemui.children('span').attr("data-id", u.id);

        //                if (u.selected) {
        //                    text += group.name + ":" + u.name + " ";
        //                    itemui.children('span').addClass("btn-info");
        //                }
        //                itemui.children('span').bind('click', u,
        //                function (sender) {
        //                    if (u.selected != undefined) {
        //                        u.selected = !u.selected;
        //                        selectChange(group.id, u.id);
        //                        itemui.children('span').toggleClass("btn-info");
        //                    }
        //                    if (data.handler) data.handler(group, u);
        //                    else opts.itemclick(group, u)
        //                })
        //            })
        //        });
        //        ui.children().eq(1).text(text || data.text)
        //    }
        //    ui.css({
        //        'position': 'relative'
        //    }).mouseover(function () {
        //        if (data.children && data.children.length > 0) {
        //            if (menuRoot.children().length == 0) createUI();
        //            menuRoot.show()
        //        }
        //    }).mouseleave(function () {
        //        menuRoot.hide()
        //    });
        //    createUI()
        //}

        function setBtnItem(items, element, handler, isgroup) {
            $.each(items, function (i, item) {

                if (handler && item.handler == undefined) item.handler = handler;

                //if (item.type == "radio" || item.type == "checkbox") {
                //    var temp = $('<label   title="' + (item.title || '') + '"></label >').appendTo(element);
                //    temp.addClass(opts.css.button);
                //}
                //else
                var temp = $('<div  title="' + (item.title || '') + '"></div>').appendTo(element);

                if (item.type == 'split') {
                    temp.addClass(opts.css.split)
                } else if (item.type == 'text') {
                    temp.addClass(opts.css.text)
                    $('<span style="margin:5px;">' + item.text + ' </span>').appendTo(temp);
                } else if (item.type == 'group') {
                    temp.addClass("btn-group");
                    setBtnItem(item.children, temp, item.handler, true);
                    if (item.children[0].type == "radio" || item.children[0].type == "checkbox") temp.attr("data-toggle", "buttons");
                } else if (item.type == 'menu') {
                    temp.addClass("dropdown");
                    var dropdown = $('<span  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span>' + item.text + '</span>  <span class="caret"></span> </span>').appendTo(temp);
                    dropdown.addClass(opts.css.button);
                    if (item.children)
                        setMenuItem(temp, item, item.handler);
                    else if (item.show) {
                        var usermenu = $('<div class="dropdown-menu" role="menu" aria-labelledby="dLabel"></div>').appendTo(temp);
                        item.show(usermenu, dropdown);
                    }
                    if (item.iconCls) var bt = $('<span unselectable="on" class="' + item.iconCls + '" style="line-height:1.428571429"></span>').prependTo(dropdown);
                    dropdown.dropdown();

                    // temp = dropdown;

                } else if (item.type == 'radio') {
                    var vv = '';
                    if (item.value) vv = '" value="' + item.value

                    var rad = $('<input type="radio" autocomplete="off" name="' + item.name + vv + '"> ' + item.text + '</input> ').appendTo(temp);
                    if (item.checked == true) temp.addClass(opts.css.select);

                    temp.bind('click', item, function () { itemUp({ data: item }) })
                    // $( item.text).appendTo(temp);
                } else if (item.type == 'checkbox') {
                    //var vv = '';
                    //if (item.value) vv = '" value="' + item.value
                    //var rad = $('<input type="checkbox" autocomplete="off" name="' + item.name + vv + '"> ' + item.text + '</input> ').appendTo(temp);
                    temp.addClass(opts.css.button);
                    if (item.text) temp.append('<span unselectable="on" style="margin-left:5px;margin-right:5px;">' + item.text + '</span>')


                    if (item.checked == true) temp.addClass(opts.css.select);
                    temp.bind('click', item, function (sender) {
                        itemUp({ data: item }, this)

                    })
                    // $(item.text).appendTo(temp);
                } else if (item.type == 'link') {
                    temp.addClass(opts.css.link);
                    if (item.text) temp.append('<span unselectable="on" style="margin-left:5px;margin-right:5px;"><a href="javascript:void(0);">' + item.text + '</a></span>')
                } else {
                    temp.addClass(opts.css.button);
                    if (isgroup != true) temp.css("margin-left", "3px");
                    if (item.text) temp.append('<span unselectable="on" style="margin-left:5px;margin-right:5px;">' + item.text + '</span>')
                    temp.bind('mouseup', item, itemUp)
                    if (item.select == true) temp.addClass(opts.css.select);
                    if (item.type == 'circle') temp.addClass(opts.css.circle);
                }
                if (item.iconCls && item.type != 'menu') var bt = $('<span unselectable="on" class="' + item.iconCls + '" style="line-height:1.428571429"></span>').prependTo(temp);


                if (item.css) temp.addClass(item.css);

                temp.css({ float: item.float || "left" });

                if (item.id) temp.attr("data-id", item.id);
            });
        }
        setBtnItem(opts.data, root);

        root.find('.btn').button();

        this.element = function (id) {
            return root.find("[data-id='" + id + "']");
        }

        return this
    };

    //tab页(PB修改过)
    $.fn.iwfTab = function (options) {
        var defaults = {
            tabCss: "nav nav-tabs",
            itemCss: "iwf-tabs-item2",
            itemSelectedCss: "active",
            tabchange: function (tab) { }
        }

        var opts = $.extend(defaults, options);
        var me = $(this);
        var tab = me.children("ul");
        var tabcontent = me.children("div");
        tab.css("cursor", "pointer");
        //PB加
        function autoresize() {
            me.children("div").each(function () {
                var dom = $(this);
                dom.height(me.height() - tab.outerHeight());
                dom.css("overflow", "auto");
            });
        }

        function itemClick(e) {

            var childs = tab.children();
            var temp = $(this);
            if (opts.beforeTabchange) {
                var flag = opts.beforeTabchange(temp, e);
                if (flag == false) return false;
            }
            tabcontent.hide();
            //iframe还存在与系统时的旧写法
            //var filterContent = tabcontent.filter("#" + temp.attr("id") + "-content").show();
            //iframe不存在时的新写法
            var filterContent = tabcontent.filter("[data-id=" + temp.attr("data-id") + "-content]").show();


            opts.tabchange(filterContent);

            temp.addClass(opts.itemSelectedCss).siblings().removeClass(opts.itemSelectedCss);
        }

        tab.addClass(opts.tabCss);
        tab.children().addClass(opts.itemCss).bind('click', itemClick);
        tab.children().first().click();
        //PB加
        if (opts.stretch == true) return me;
        me.bind("resize", autoresize);
        autoresize();
        return me;
    }

    $.fn.DropdownMenu = function (options) {
        var self = this;
        //var _namespace = ".DropdownMenu" + DropdownMenu;
        //this.Namespace = _namespace;

        var el = $(this);
        var root = el.wrap("<div/>").parent().css({
            'position': 'relative'
        });
        var content = options.content;
        //  root.children(".dropdown-menu").remove();
        var container = $('<div unselectable="on"/>').addClass('dropdown-menu').hide().css({
            'top': (root.height()) ? root.height() : 30,
            'width': (options.width) ? options.width : content.clientWidth,
            'overflow': 'auto',
            'height': (options.height) ? options.height : content.clientHeight,
            'padding': '0px'
        }).appendTo(root);

        container.append(content);

        container.bind('mouseover', function () {
            container.mouseOnList = true;
        }).bind('mouseout', function () {
            container.mouseOnList = false;
        });
        function onItemClick(sender) {
            container.hide();
            el.focus();
        }

        function showTipe() {
            if (container.is(":hidden") && container.children().length > 0) {
                container.show();
            } else if (container.children().length == 0) {
                container.hide();
            }
        }

        var onMouseClick = function () {
            if (container.is(":hidden")) showTipe();
            else container.hide();
        };
        var onFocusout = function () {
            if (!container.mouseOnList) container.hide();
        };

        $(document).bind("mousedown", function (e) {
            if (e.target != el[0] && !$.contains(el[0], e.target)) {
                onFocusout();
            }
        });
        el.bind("click", onMouseClick);
        //.bind("focusout", onFocusout);

        this.hide = function () {
            container.hide();
        }
        //DropdownMenu++;
        return this;
    }




    //获取数据，加入了对禁止缓存，重新登陆的支持。
    jQuery.fxPost = function (url, params, callback, loseback) {
        if (!params) params = {};
        //如果没有设置params
        if (typeof params == 'function') {
            if (callback) loseback = callback;
            callback = params;
            params = {};
        }
        if (appConfig.iwfServiceTemp) {
            url = appConfig.iwfServiceTemp[url];
        } else {
            //处理两个服务端分别处理的情况，一个.net，一个是node.js
            if (appConfig.nodeService) {
                if (url.indexOf(".data") < 0)
                    url = window.location.protocol + '//' + window.location.hostname + appConfig.nodeService + url;
            }
            else if (appConfig.netService) {
                if (url.indexOf(".data") > 0)
                    url = window.location.protocol + '//' + window.location.hostname + appConfig.netService + url;
            }
        }

        params.ttt = Math.random();  //如果是post应该可以删除

        function getResult(json) {
            if (json.success == false) {
                if (json.msg == '请先登录系统！')
                    $.iwf.relogin();  //还没有登陆的话需要重新输入密码
                else if (loseback)
                    loseback(json);   //如果有错误处理
                else {
                    if (appConfig.isDebug && json.message) {
                        //alert(json.msg + "\n 详细信息：" + json.message);   //否则就显示错误
                        var win = $.iwf.showWin({ width: 900, height: 600, title: '错误提示' });
                        win.content().html('<pre>' + json.msg + "\n 详细信息：" + json.message + '</pre>');
                    }
                    else {
                        //alert(json.msg);   //否则就显示错误
                        var win = $.iwf.showWin({ width: 600, height: 450, title: '提示' });
                        win.content().html('<pre>' + json.msg + '</pre>');
                    }
                }
            }
            else {
                callback(json);
            }
        }

        $.ajax({
            type: "POST", url: url, data: params, dataType: "json", //crossDomain: true,
            success: function (data) {
                getResult(data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                if (loseback) loseback(errorThrown);
                else {
                    if (appConfig.isDebug)
                        alert("请求发送失败!\n 请检查服务端是否启动或网络是否连接,查看系统启动日志\n 错误:status:" + XMLHttpRequest.status + "readyState:" + XMLHttpRequest.readyState + "textStatus:" + textStatus);
                    else
                        alert("请求发送失败，请联系系统管理员");
                }
            },
            complete: function (e) { },
            beforeSend: function (xhr) { }
        });
    }

    if ($.frameloading) jQuery.Loading = $.frameloading();

    ///附件上传
    //opts:{attachbutton:$(btn),readOnly:false,Params:{caseid:,baid:guid:},Attachments:[
    //{
    //    "Size": 0,  //必须
    //    "AutoID": "e67f3077-4c91-4d8b-aa94-03668c3dd98f",
    //    "CaseID": "",
    //    "ActID": "",
    //    "ActName": null,
    //    "FileName": "rev.pdf",  //必须
    //    "FilePath": "409b351b-ea8a-4f1b-b767-e24b1c13dae9.pdf",  //必须
    //    "UploadDate": "2015-05-22 11:04:15",  //必须
    //    "UserID": "U000008"  //必须
    //}]
    //SkylandAttach.data?action=UploadFile | DownAttach |DeleteRemoteAttach
    $.fn.AttachBar = function (opts) {
        var self = this;
        var root = $(this);
        var attachbutton = opts.attachbutton;
        var inputfileDIV;

        var serviceUrl = "SkylandAttach.data?action=UploadFile";

        $.Com.addStyle("fx/com/wf/Attach/attach.css");

        var readOnly = opts.readOnly;  //self.api.toolbarState == "flowReadonly"
        if (readOnly && attachbutton) attachbutton.hide();
        //格式化文件大小
        function formatFileSize(size) {
            if (size > 1024 * 1024) {
                size = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
            }
            else {
                size = (Math.round(size * 100 / 1024) / 100).toString() + 'KB';
            }
            return size;
        }
        //获取文件后缀名
        function GetFileExtension(fileName) {
            var index1 = fileName.lastIndexOf(".");
            var index2 = fileName.length;
            var postf = fileName.substring(index1 + 1, index2);//后缀名
            return postf.toLowerCase();
        }

        function InitDealAttachment(lstAttach) {
            //var self = this;
            //var o = this.options;
            //if (o.showAttachment != true) return;
            if (lstAttach == null) { alert("WebConfig中未指定附件存放目录appSettings的key=RelativeUploadDir"); return; }

            //self.Attachment = root;  //self.RootBodyDiv.find("[data-id=WF_Attachment]");

            if (root.length == 0) return;
            //var GetUserAttachService = "SkylandAttach.data?action=GetUserAttach";
            var tmpl = '<div class="AttachBar name_wrap" style="float: left;margin-right:20px; width: 150px; white-space: nowrap; text-overflow: ellipsis;overflow:hidden" action="attachone">'
                            + '<span class="ico ico_${Extension}" title="${Detail}"></span>'
                            + '<span class="title" title="${Detail}">${FileName}</span>'
                            + '<div class="AttachBarop" action="fileopera">'
                            + '<a href="javascript:void(0)" action="downAttach" title="下载附件" class="Attachbtn" style="margin-left: 10px; "><i class="fa fa-download"></i></a> &nbsp;'
                            + '<a href="javascript:void(0)" action="deleteAttach" style="margin-left: 10px; margin-right: 5px;" title="删除" class="Attachbtn"><i class="fa fa-trash-o"></i></a>'
                            + '</div>'
                            + ' <div class="PBprogress" style="box-sizing: content-box;width:100px;display:none" action="fileprogress">'
                                   + ' <div class="PBprogressbar" style="" action="bar"></div>'
                            + '</div>'
                        + '</div>';
            var AppFileDivDom = $('<div class="app_file" style="margin:0 20px;"></div>')
            inputfileDIV = $('<div><input style="visibility: hidden;" type="file" name="fileselect[]" multiple="" /></div>');
            inputfileDIV.appendTo(root);
            inputfileDIV.hide();

            //绑定click
            //attachbutton.bind('click', function () {
            //    inputfileDIV.find("input").replaceWith('<input  style="visibility: hidden;" type="file" name="fileselect[]" multiple="" />');
            //    inputfileDIV.find("input").trigger('click');
            //});

            function funUploadFile(file, uploadDom) {
                var xhr = new XMLHttpRequest();
                var fileprogressDom = uploadDom.find("[action=fileprogress]").show();
                var fileoperaDom = uploadDom.find("[action=fileopera]").hide();
                uploadDom.fadeIn();
                if (xhr.upload) {
                    // 上传中
                    xhr.upload.addEventListener("progress", function (e) {

                        var progressbar = fileprogressDom.find('[action = bar]');
                        var percent = (e.loaded / e.total * 100).toFixed(2) + '%'; progressbar.css('width', percent);
                    }, false);
                    // 文件上传成功或是失败
                    xhr.onreadystatechange = function (e) {
                        if (xhr.readyState == 4) {
                            if (xhr.status == 200) {
                                var obj = new Object();
                                var ent;
                                try {
                                    ent = eval('(' + xhr.responseText + ')');
                                } catch (e) {
                                    fileSize_DIV.text("上传失败");
                                    return;
                                }
                                ent.Size = file.size;
                                uploadDom.data("UploadInfo", ent);
                                //不是很清楚
                                //self.EventTrigger.event_uploadSucess(self, file, ent);

                                fileprogressDom.hide();
                                fileoperaDom.show();
                            } else {



                            }
                        }
                    };
                    //
                    xhr.open("POST", serviceUrl, true);
                    //
                    var fd = new FormData(); // html5新增的对象,可以包装字符,二进制信息 
                    fd.append(file.name, file);

                    for (var name in opts.Params) {
                        fd.append(name, opts.Params[name]);
                    }
                    //for (var i = 0; i < o.workflowParams.length; i++) {}
                    //fd.append("caseid", self.api.caseid);
                    //fd.append("actid", self.api.actid);
                    //xhr.setRequestHeader("X_FILENAME", file.name);
                    xhr.send(fd);
                    //
                }
            }
            //绑定事件
            inputfileDIV.delegate("input", "change", function (e) {
                var files = e.target.files || e.dataTransfer.files;
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    var obj = {
                        FileName: file.name,
                        Detail: "文件名:" + file.name + "\r\n" +
                                                  "大小:" + formatFileSize(file.size) + "\r\n" +
                                                  "上传日期:" + new Date().format("yyyy-MM-dd hh:mm:ss"),
                        Extension: GetFileExtension(file.name)
                    }
                    var html = tmpl.replace$Object(obj);
                    //文件显示图标
                    var AttachDom = $(html);
                    AppFileDivDom.prepend(AttachDom);
                    AttachDom.hide();
                    funUploadFile(file, AttachDom);
                }
            });

            $.each(lstAttach, function (index, ent) {
                var obj = {
                    FileName: ent["FileName"],
                    Detail: "文件名:" + ent["FileName"] + "\r\n" +
                                                "大小:" + formatFileSize(ent["Size"]) + "\r\n" +
                                                "上传日期:" + ent["UploadDate"],
                    Extension: GetFileExtension(ent["FileName"])
                }
                var AttachDom = $(tmpl.replace$Object(obj));
                AppFileDivDom.append(AttachDom);
                AttachDom.data("UploadInfo", ent);
            });
            AppFileDivDom.delegate("[action=downAttach]", "click", function (e) {
                var dom = $(this).parentsUntil("[action=attachone]").last().parent();
                var ent = dom.data("UploadInfo");
                if (ent.Size == 0) { alert("文件未在服务器上找到"); return; }
                var downUrl = "/SkylandAttach.data?action=DownAttach" + "&OLDNAME=" + escape(ent["FileName"]) + "&PATH=" + ent["FilePath"];
                window.location.href = downUrl;
            });
            AppFileDivDom.delegate("[action=deleteAttach]", "click", function (e) {
                e.stopPropagation();
                var dom = $(this).parentsUntil("[action=attachone]").last().parent();
                var ent = dom.data("UploadInfo");
                if (confirm("是否确定删除该附件")) {
                    //不是很清楚
                    if (readOnly) { alert("不能删除非待办状态的附件"); return; }

                    jQuery.PackResult("SkylandAttach.data?action=DeleteRemoteAttach", { "ID": ent["AutoID"] }, function () {
                        dom.fadeOut();
                    });
                }
            });
            //
            AppFileDivDom.append('<div style="clear: both"></div>');
            AppFileDivDom.appendTo(root);
        };

        InitDealAttachment(opts.Attachments);

        if (readOnly) root.find("[action=attachone]").hide();

        this.upload = function () {
            inputfileDIV.find("input").replaceWith('<input  style="visibility: hidden;" type="file" name="fileselect[]" multiple="" />');
            inputfileDIV.find("input").trigger('click');

        };

        //设置控件是否只读
        this.setReadonly = function (isReadonly) {
            readOnly = isReadonly;
            attachbutton.show();
            root.find("[action=attachone]").hide();
        }

        //获取所有附件Keys集合
        this.GetAllAttachKeys = function () {
            var arr = new Array();
            root.find("[action=attachone]").each(function () {
                var ent = $(this).data("UploadInfo");
                if (ent) { arr.push(ent["AutoID"]); }
            });
            return arr;
        };

        if (attachbutton) attachbutton.bind('click', self.upload);

        return self;

    };

    $.fn.iwfautocomplete = function (opts) {
        //'init': function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var el = $(this);

        var root = el.wrap("<div/>").parent().css({
            'position': 'relative'
        });
        var list = $('<ul unselectable="on"/>').addClass('dropdown-menu').hide().css({
            'top': (root.height()) ? root.height() : 22,
            'width': (element.clientWidth) ? element.clientWidth : 100,
            'overflow': 'auto',
            'max-height': '300px'
        }).appendTo(root);
        list.bind('mouseover',
        function () {
            list.mouseOnList = true;
        }).bind('mouseout',
        function () {
            list.mouseOnList = false;
        });
        function onItemClick(sender) {
            //valueAccessor().selectItem = sender.data;
            //ko.selectExtensions.writeValue(element, this.textContent);
            list.hide();
            el.focus();
            el.val(sender.data)
            //ko.utils.triggerEvent(element, 'change');
            //if (allBindingsAccessor().onselect) allBindingsAccessor().onselect(sender.data);

        }
        function addListItem(text, data) {
            $('<li unselectable="on">' + text + '</li>').appendTo(list).bind('click', data, onItemClick);
        }
        function showTipe(data) {
            var val = el.val();
            list.children().remove();
            if (data instanceof Array) {
                //ko.utils.arrayForEach(data,
                $.each(data,
                function (item) {
                    if (item instanceof Object) {
                        var valueKey = '';
                        var isAdd = false;
                        for (key in item) {
                            if (!valueKey) valueKey = key;
                            if (item[key].search(val) > -1) {
                                isAdd = true;
                                break;
                            }
                        }
                        if (isAdd) addListItem(item[valueKey], item);
                    } else if (item.search(val) > -1) {
                        addListItem(item, item);
                    }
                });
            } else {
                for (key in data) {
                    if (data[key] && data[key].search && data[key].search(val) > -1) {
                        addListItem(data[key], data[key]);
                    }
                }
            }
            if (list.is(":hidden") && list.children().length > 0) {
                list.show();
            } else if (list.children().length == 0) {
                list.hide();
            }
        }
        var onKeypress = function () {
            //var value = ko.utils.unwrapObservable(valueAccessor());

            //if (value.queryUrl != undefined) {
            //    var dp = new DataProxy(value);
            //    dp.Get({ keyword: el.val() }, function (dataS) {
            //        for (var key in dataS) {
            //            showTipe(dataS[key])
            //            break;
            //        }
            //    })
            //} else

            showTipe(opts.values);


        };
        var onMouseClick = function () {
            if (list.is(":hidden")) onKeypress();
            else list.hide();
        };
        var onFocusout = function () {
            if (!list.mouseOnList) list.hide();
        };

        el.bind("keyup", onKeypress);
        el.bind("click", onMouseClick);
        el.bind("focusout", onFocusout);


    };


})(jQuery);


//公共函数
$.Com = {
    //设置cookie
    setCookies: function (name, value) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + 60);

        document.cookie = name + "=" + escape(value) + ";expires=" + exdate.toGMTString();
    },
    //取得cookie的值
    getCookies: function (name) {
        var regStr = name + "=([^;]*)";
        var arr = document.cookie.match(new RegExp(regStr));
        if (arr != null) return unescape(arr[1]);
        else return null;
    },
    //删除cookie
    delCookies: function (name) {
        //删除一个cookie，就是将其过期时间设定为一个过去的时间
        var ck = name + "=;expires=" + new Date('2000/01/01');
        document.cookie = ck;
    },

    //取得唯一值,根据json的字段，获得所有唯一值的数组
    uniq: function (json, pro) {
        var toObject = function (a, pro) {
            var o = {};
            for (var i = 0, j = a.length; i < j; i = i + 1) {
                o[a[i][pro]] = true;
            }
            return o;
        };
        var keys = function (o) {
            var a = [], i;
            for (i in o) {
                if (o.hasOwnProperty(i)) {
                    a.push(i);
                }
            }
            return a;
        };

        return keys(toObject(json, pro))
    },

    //日期格式化
    formatDate: function (n) {
        try {
            var mydate
            if (n == undefined || n == null)
                mydate = new Date();
            else if (n instanceof Date)
                mydate = n;
            else
                mydate = new Date(Date.parse(n.replace(/-/g, "/").replace("T", " ")));
            var now = new Date();
            if (mydate.getFullYear() == now.getFullYear()) {
                if (mydate.getMonth() == now.getMonth()) {
                    if (mydate.getDate() == now.getDate())
                        return "今日" + mydate.getHours() + ":" + checkTime(mydate.getMinutes());
                    else if (mydate.getDate() == now.getDate() - 1)
                        return "昨日" + mydate.getHours() + ":" + checkTime(mydate.getMinutes());
                    else
                        return "本月" + mydate.getDate() + "日 " + mydate.getHours() + "时";
                } else if (mydate.getMonth() == now.getMonth() - 1)
                    return "上月" + mydate.getDate() + "日";
                else
                    return (mydate.getMonth() + 1) + "月" + mydate.getDate() + "日";
            } else
                return n.substring(0, 11);
        } catch (e) {
            return n;
        }

        function checkTime(i) {
            if (i < 10)
            { i = "0" + i }
            return i
        }
    },

    //添加css文件  2014-6-19
    addStyle: function (href) {
        (function (head) {
            var link = document.createElement('link');

            link.href = href;
            link.rel = 'stylesheet';

            head.appendChild(link);
        })(document.getElementsByTagName('head')[0]);
        return false;
    },
    //添加js文件（调用此方法，可以进行调试，如用$.getScrpit方法难以调试） 2014-6-20 
    addScript: function (url, callback) {
        (function (head) {
            var script = document.createElement('script');

            script.src = url;

            script[document.all ? "onreadystatechange" : "onload"] = function () {
                if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                    if (callback) {
                        callback();
                    }
                }
            };

            head.appendChild(script);
        })(document.getElementsByTagName('head')[0]);
        return false;
    },

    //确定系统缓存的字典数据
    dictCache: {},
    getDict: function (dictType) {
        return $.Com.dictCache[dictType];
    },
    loadDictCache: function () {
        $.fxPost(appConfig.cacheServie, {}, function (Json) {
            $.Com.dictCache = Json;
        }, function (err) {
            $.iwf.messages.push({ text: "数据缓存出错", descript: err.msg });
        });
    },

    showMsg: function (msg, title, opts, callback) {
        var tt = "";
        if (opts == undefined || opts == null || opts == '') {
            if (msg.length > 100) {
                opts = { width: 800, height: 600, title: '提示' };
                tt = '<pre>' + msg + '</pre>';
            }
            else {
                opts = { width: 500, height: 250, title: '提示' };
                tt = ' <div style="margin:20px 40px;"><h4>' + msg + '</h4></div>';
            }
        }
        var win;
        opts.button = [{ text: '确定', handler: function () { if (callback) callback(); win.close(); } }];
        if (title) opts.title = title;
        win = $.iwf.showWin(opts);
        win.content().html(tt);
    },

    confirm: function (msg, callback, title, opts) {
        var tt = "";
        if (opts == undefined) {
            if (msg.length > 100) {
                opts = { width: 800, height: 600, title: '确认' };
                tt = '<pre>' + msg + '</pre>';
            }
            else {
                opts = { width: 500, height: 250, title: '确认' };
                tt = ' <div style="margin:20px 40px;"><h4>' + msg + '</h4></div>';
            }
        }
        var win;
        opts.button = [{ text: '是', handler: function () { win.close(); callback() } }, { text: '否', focus: true, handler: function () { win.close(); } }];
        if (title) opts.title = title;
        win = $.iwf.showWin(opts);
        win.content().html(tt);
    },

    prompt: function (callback, title, opts) {
        var tt = "";
        if (opts == undefined) {
            opts = { width: 450, height: 240, title: '请输入' };
            tt = ' <div style="margin:10px 15px;"><textarea rows="3" style="width: 100%;"></textarea></div>';

        }
        var win;
        opts.button = [{
            text: '确定', css: 'btn btn-primary', handler: function () {
                win.close();
                callback(win.content().find("textarea").val());
            }
        }, { text: '取消', handler: function () { win.close(); } }];
        if (title) opts.title = title;
        win = $.iwf.showWin(opts);
        win.content().html(tt);
    }
};


//基础表单组件
$.Com = $.extend({}, $.Com, {
    //创建表单模块
    FormModel: function (options) {
        if (options == undefined) options = {};
        var formModel = new function () { this.options = options; };
        if (formModel.options.isValidateRequired == undefined) formModel.options.isValidateRequired = true;//是否验证必填
        if (formModel.options.isAppendSign == undefined) formModel.options.isAppendSign = true;//是否追加*号



        formModel.show = function (root, data) {

            //ko.cleanNode($(root)[0]);

            var options = formModel.options;
            if (data == undefined) alert("没有绑定数据！");
            var vm;
            var isHave = false;
            if (formModel.viewModel) {
                ko.mapping.fromJS(data, formModel.viewModel);
                vm = formModel.viewModel;
                isHave = true;
            }
            else {
                vm = ko.mapping.fromJS(data);
                formModel.viewModel = vm;
                if (options.beforeBind) options.beforeBind(vm, root); //add by zjl 20150724
            }
            //if (options.beforeBind) options.beforeBind(vm, root);//remove by zjl 20150724
            if ($(root).children().length < 1) createTemple($(root), data);

            //允许修改配置
            if (appConfig.isDebug && false) {
                root.find('[data-debug]').remove();

                var gridtemp = root[0].innerHTML;
                var $btn = $("<a clas='btn btn-link' title='js配置表单模板' data-debug='y'> 显示模板</a>").appendTo(root);
                $btn.bind("click", function () {

                    win = $.iwf.showWin({ width: 1200, height: 900 });
                    win.content().text(gridtemp);

                });


                var $btn2 = $("<a clas='btn btn-link' title='修改ko表单配置'  data-debug='y'> 修改配置 </a>").appendTo(root);
                $btn2.bind("click", function () {
                    if ($.iwf.formdesign == undefined)
                        $.Com.addScript(appConfig.models["$.iwf.formdesign"], function () {
                            $.iwf.formdesign.setForm(data, root, formModel);
                        });
                    else
                        $.iwf.formdesign.setForm(data, root, formModel);
                });
            }

            //var gridtemp = root[0].innerHTML;
            //$btn = $("<a clas='btn btn-link' title='js配置表单模板，'> 显示模板</a>").appendTo(root);
            //$btn.bind("click", function () {
            //    win = $.iwf.showWin({ width: 1200, height: 900 });
            //    win.content().text(gridtemp);

            //});
            if (!isHave) {
                //添加表单的验证
                $.SkylandValidate.formValidate(root, formModel.options.isValidateRequired, formModel.options.isAppendSign);

                ko.applyBindings(formModel.viewModel, $(root).get(0));
            }
            //ko.applyBindings(vm, $(root).get(0));

            if (options.afterBind) options.afterBind(vm, root);

            formModel.root = root;

        }
        //自动创建绑定div模板
        function createTemple(root, data) {
            var tt = '';
            var i = 1;
            var count = 0;
            for (var key in data) {
                if (count > 21) break;
                count++;
                if (i > 0) tt += '<div class="form-group">';
                tt += ' <label class="col-sm-2 control-label">' + key + '</label><div class="col-sm-4"><input class="form-control" type="text" placeholder="" data-bind="value:' + key + '"></div>';
                if (i < 0) tt += '</div>';
                i = i * -1;

            }

            root.append(tt);


        }

        formModel.getData = function () {
            if (formModel.viewModel == undefined) alert("没有绑定数据！");
            var isOK = true;
            //$(formModel.root).html5Validate(function () { isOK = true; }
            //    , {
            //        validate: function () {
            //            if (formModel.options.beforeSave) return formModel.options.beforeSave(formModel.viewModel, formModel.root);
            //            return true;
            //        }
            //    });

            if (formModel.options.beforeSave)
                isOK = formModel.options.beforeSave(formModel.viewModel, formModel.root);
            //验证表单
            isOK = $.SkylandValidate.submitValidate(formModel.root) && isOK;
            if (isOK == false) return false;
            var data = ko.mapping.toJS(formModel.viewModel);

            for (var key in data) {
                try {
                    if (key.substr(0, 1) == "_") delete data[key];//删除Json数据中的属性
                } catch (e) { }
            }

            return data;
        }

        //不校验，直接保存当前表单
        formModel.getCacheData = function () {
            if (formModel.viewModel == undefined) alert("没有绑定数据！");
            return ko.mapping.toJS(formModel.viewModel);
        }

        formModel.setReadOnly = function () {
            //todo
        }

        return formModel;

    },
    //创建表格模块  //支持三种过滤： text\select\checkbox
    GridModel: function (options) {
        if (options == undefined) options = {};
        var opts = options
        var gridModel = new function () {
            this.opts = opts;
        }
        var element;

        //创建gird所需的html模板



        gridModel.show = function (root, initdata) {
            if (root) element = $(root);
            //ko.cleanNode(element[0]);

            var data;  //绑定的数据
            if (initdata.data) data = initdata.data;
            else data = initdata
            var vm;
            var dellist = "";
            if (initdata.deleteList) dellist = initdata.deleteList;

            //数据有效性判断
            if (data.length == undefined) {
                alert("请绑定到数组或对象的.data属性为数组");
                return;
            }



            if (gridModel.viewModel) {
                //重新加载（保存后调用）
                //ko.mapping.fromJS(data, gridModel.viewModel);
                vm = gridModel.viewModel;
                vm.getElements(data);
                //ko.cleanNode(element[0]);
                //ko.applyBindings(vm, element.get(0));
            } else {



                if (data.length > 300 && options.elementsCount == undefined) options.elementsCount = 20;//如果数据过多，强制分页
                //可以先写界面，也可以根据配置自动生成


                if (options.columns != undefined && options.columns.length > 0) {
                    root.empty();
                    if (options.setRowClick == undefined) options.setRowClick = false;
                    $.Com.gridbuilder.CreateGrid(element, options);
                } else {
                    //如果没有配置界面，则自动创建
                    if (root.children().length < 1) {
                        options.columns = [];
                        for (var key in data[0]) {
                            options.columns.push({ key: key });
                        }

                        if (options.cssClass == undefined) options.cssClass = " table table-striped table-bordered  table-condensed ";

                        if (options.setRowClick == undefined) options.setRowClick = false;
                        $.Com.gridbuilder.CreateGrid(element, options);
                        options.columns = undefined;


                    }
                }

                //允许修改配置
                if (appConfig.isDebug && false) {

                    var gridtemp = element[0].innerHTML;
                    var $btn = $("<a clas='btn btn-link' title='js配置表格模板，'> 显示模板</a>").appendTo(element);
                    $btn.bind("click", function () {

                        win = $.iwf.showWin({ width: 1200, height: 900 });
                        win.content().text(gridtemp);

                    });


                    var $btn2 = $("<a clas='btn btn-link' title='修改js表格配置，'> 修改配置 </a>").appendTo(element);
                    $btn2.bind("click", function () {
                        if ($.iwf.formdesign == undefined)
                            $.Com.addScript(appConfig.models["$.iwf.formdesign"], function () {
                                $.iwf.formdesign.setGrid(data, element, gridModel);
                            });
                        else
                            $.iwf.formdesign.setGrid(data, element, gridModel);
                    });
                }

                vm = new ViewModel(data, options.elementsCount, options.keyColumns);
                gridModel.viewModel = vm;


                bindUI(vm, data);

                if (options.beforeBind) options.beforeBind(vm, root);

                ko.applyBindings(vm, element.get(0));

                if (options.afterBind) options.afterBind(vm, root);
            }
            vm.deleteList = dellist;
        }

        function Item(data) {
            for (var key in data) {
                this[key] = ko.observable(data[key]);
            }
        }

        function bindUI(vm, srcArray) {

            //初始化过滤设置
            var filterSel = element.find('select[data-filterkey]');
            $.each(filterSel, function (key, sel) {
                if (sel.options.length < 1) {
                    var selectData = $.Com.uniq(srcArray, $(sel).attr("data-filterkey"));
                    //增加对data-filterkey-code属性的支持，可以实现字段的转义
                    if ($(sel).attr("data-filterkey-code")) {
                        var fieldcode = $(sel).attr("data-filterkey-code");
                        $(sel).append('<option value="全部">全部</option>');
                        $.each(selectData, function (key, val) {
                            $(sel).append('  <option value="' + val + '">' + $.Com.dictCache[fieldcode][val] + '</option>');
                        })
                    } else {
                        $(sel).append('<option value="全部">全部</option>');
                        $.each(selectData, function (key, text) {
                            if (text == 'null') {
                                $(sel).append('  <option value="null"> </option>');
                            } else {
                                $(sel).append('  <option value="' + text + '">' + text + '</option>');
                            }
                        })
                    }
                }
            });

            //初始化过滤设置
            var filterChk = element.find(':checkbox[data-filterkey]');
            $.each(filterChk, function (key, chk) {
                var pro = $(chk).attr("data-filterkey");
                var selectData = $.Com.uniq(srcArray, pro);
                $(chk).hide();
                var i = 0
                //增加对data-filterkey-code属性的支持，可以实现字段的转义
                if ($(chk).attr("data-filterkey-code")) {
                    var fieldcode = $(chk).attr("data-filterkey-code");
                    $.each(selectData, function (key, val) {
                        if (i > 10) return false; //不能太大了
                        $(chk).after(' <input type="checkbox" data-filterkey-in="' + pro + '" value="' + val + '" checked="checked"/>' + $.Com.dictCache[fieldcode][val]);
                        i++;
                    });
                } else {
                    $.each(selectData, function (key, text) {
                        if (i > 10) return false; //不能太大了
                        if (text == 'null') {
                            $(chk).after(' <input type="checkbox" data-filterkey-in="' + pro + '" value="null" checked="checked"/>');
                        } else {
                            $(chk).after(' <input type="checkbox" data-filterkey-in="' + pro + '" value="' + text + '" checked="checked" />' + text);
                        }
                        i++;
                    });
                }
            });

            $.Com.addStyle("fx/control/style.css");
            var filterSelDate = element.find('select[data-filterkey-daterange]');
            require(["fx/control/dateRange"], function (trl) {
                $.each(filterSelDate, function (key, sel) {
                    var dateRange = new trl($(sel));
                    var fld = $(sel).attr("data-filterkey-daterange");
                    var $txtfrom = $('<input type="text" data-filterkey-from="' + fld + '" style="display:none">').insertAfter(sel);
                    var $txtto = $('<input type="text"  data-filterkey-to="' + fld + '" style="display:none">').insertAfter(sel);
                    dateRange.onSet = function (startDay, endDay) {
                        $txtfrom.val(startDay);
                        $txtto.val(endDay);
                        vm.filterElements();
                    }
                });
            })



            //分页
            element.on("click", "a[data-pagecount]", function (e) {
                e.preventDefault()
                vm.elementsCount($(this).attr('data-pagecount'))
            });

            //排序
            element.on("click", "a[data-sortkey]", function (e) {
                e.preventDefault()
                vm.sortData($(this).attr('data-sortkey'))
            });

            //过滤
            element.on("change", 'select[data-filterkey]', vm.filterElements);
            element.on("keyup", ':text[data-filterkey]', vm.filterElements);
            element.on("click", ':checkbox[data-filterkey-in]', vm.filterElements);
            element.on("keyup", ':text[data-filterkey-from]', vm.filterElements);
            element.on("keyup", ':text[data-filterkey-to]', vm.filterElements);

        }

        function ViewModel(srcArray, elementsCount, keyColumns) {
            var self = this;

            self.sortOrder = 'asc'; //start sort order
            self.allElements = ko.observableArray([]) // 全部记录，可观测记录
            //  self.allData = ko.observableArray([]) // 数据集
            self.currentElements = ko.observableArray(self.allElements()) // 过滤后并排序的数据 
            self.customFilteredElements = ko.observableArray([]) // 经过自定义条件过滤后的数据
            self.standartFilteredElements = ko.observableArray([]) // 过滤后的数据
            self.paginator = ko.observableArray([])//分页按钮 (1 2 3 ...)
            self.elementsCount = ko.observable(elementsCount);// 每页的记录数
            self.currentPaginatorPage = ko.observable("1"); //当前页
            self.deleteList = "";

            //第几行
            self.itemNumber = function (index) {
                var elcount = self.elementsCount()
                if (elcount == 0) elcount = self.currentElements().length; //如果不分页

                return index + (self.currentPaginatorPage() - 1) * elcount + 1;
            }

            //get data for grid 加载数据
            self.getElements = function (initData) {

                if (initData) {
                    var elementsArr = []
                    //  self.allData(initData)
                    $.each(initData, function (key, value) {
                        elementsArr.push(new Item(value));
                    });
                    //如果没有记录，服务器会自动创建一条空记录。
                    if (initData.length == 1 && initData[0][keyColumns] == "") elementsArr[0]._status = "new";

                    self.allElements(elementsArr)
                    self.customFilteredElements(self.allElements())
                    self.standartFilteredElements(self.allElements())
                    self.currentElements(self.allElements())

                    //如果不分页
                    if (elementsCount == undefined || elementsCount == 0) {
                        self.elementsCount(0);
                    }
                }
            }

            //当前页绑定的数据
            self.elementsShow = ko.computed(function () {
                var elementsShow = []

                var elcount = self.elementsCount()
                if (elcount == 0) elcount = self.currentElements().length; //如果不分页

                for (var elementNumber = (self.currentPaginatorPage() - 1) * elcount; elementNumber < self.currentPaginatorPage() * elcount ; elementNumber++) {
                    if (self.currentElements()[elementNumber] != undefined)
                        elementsShow.push(self.currentElements()[elementNumber]);
                }
                return elementsShow;
            });

            //分页 页码
            self.paginator = ko.computed(function () {
                var paginator = []

                var elcount = self.elementsCount()
                if (elcount == 0) elcount = self.currentElements().length; //如果不分页


                //总页数
                var pageCount = parseInt((self.currentElements().length / elcount))
                if (self.currentElements().length % elcount > 0) {
                    pageCount++;
                }

                //如果总页数大于6
                if (pageCount > 6) {
                    if (self.currentPaginatorPage() > pageCount) {
                        self.currentPaginatorPage("1")
                    }
                    //selected first 5 pages
                    if (self.currentPaginatorPage() < 4) {
                        for (var pageNumber = 1; pageNumber < 5; pageNumber++) {
                            paginator.push({ name: pageNumber });
                        }
                        paginator.push({ name: "..." });
                        paginator.push({ name: pageCount });
                    }
                    //selected middle position
                    if (self.currentPaginatorPage() >= 4 && self.currentPaginatorPage() <= (pageCount - 3)) {
                        paginator.push({ name: "1" });
                        paginator.push({ name: "..." });
                        // paginator.push({ name: self.currentPaginatorPage() - 2 });
                        paginator.push({ name: self.currentPaginatorPage() - 1 });
                        paginator.push({ name: self.currentPaginatorPage() });
                        paginator.push({ name: self.currentPaginatorPage() + 1 });
                        //   paginator.push({ name: self.currentPaginatorPage() + 2 });
                        paginator.push({ name: "..." });
                        paginator.push({ name: pageCount });
                    }
                    //selected last 5 pages
                    if (self.currentPaginatorPage() > (pageCount - 3)) {
                        paginator.push({ name: "1" });
                        paginator.push({ name: "..." });
                        for (var pageNumber = pageCount - 3; pageNumber < pageCount + 1; pageNumber++) {
                            paginator.push({ name: pageNumber });
                        }
                    }
                } else {
                    //if count of pages in paginator less then 15 - display full paginator
                    if (self.currentPaginatorPage() > pageCount) {
                        self.currentPaginatorPage("1")
                    }
                    for (var pageNumber = 1; pageNumber < pageCount + 1; pageNumber++) {
                        paginator.push({ name: pageNumber });
                    }
                }

                return paginator;
            });

            // 设置当前页码
            self.setPage = function (pageNumber) {
                self.currentPaginatorPage(pageNumber.name)
            };
            //通过对allElements排序更新currentElements
            self.sortData = function (sortParam) {

                var sortedElements = self.allElements()
                var elementsNotNull = []
                var elementsNull = []

                //sort all rows by null and not null sortParam
                $.each(self.currentElements(), function (key, value) {
                    var param = "";
                    //check is element observable
                    param = $.isFunction(value[sortParam]) ? value[sortParam]() : value[sortParam];

                    //divide null and not null params
                    param != null ? elementsNotNull.push(value) : elementsNull.push(value);
                });

                //sort only not null elements
                var sortedElements = elementsNotNull
                sortedElements.sort(function (x, y) {
                    //check is field observable
                    if ($.isFunction(x[sortParam])) {
                        if (!isNaN(parseFloat(x[sortParam]())) && isFinite(x[sortParam]())) {
                            return x[sortParam]() - y[sortParam]();
                        } else {
                            return x[sortParam]() < y[sortParam]() ? 1 : (x[sortParam]() > y[sortParam]() ? -1 : 0);
                        }
                    } else {
                        if (!isNaN(parseFloat(x[sortParam])) && isFinite(x[sortParam])) {
                            return x[sortParam] - y[sortParam];
                        } else {
                            return x[sortParam] < y[sortParam] ? 1 : (x[sortParam] > y[sortParam] ? -1 : 0);
                        }
                    }
                });

                //check desc or asc sorting
                var result = []
                if (this.sortOrder == 'desc') {
                    sortedElements.reverse()
                    result = $.merge(sortedElements, elementsNull)
                    this.sortOrder = 'asc'
                } else {
                    result = $.merge(elementsNull, sortedElements)
                    this.sortOrder = 'desc'
                }

                //now add all rows to grid
                self.currentElements(result);
            };

            self.filterElements = function () {

                var inputArr = element.find(":text[data-filterkey]");
                var inputArr1 = element.find("select[data-filterkey]");
                var inputArrIn = element.find("[data-filterkey-in]");  //checkbox
                var inputArrFrom = element.find("[data-filterkey-from]");  //日期或数值
                var inputArrTo = element.find("[data-filterkey-to]");  //日期或数值

                var filteredElements = []; //all filtered elements
                var filterInput = [];
                var filterSelect = [];
                var filterCheck = [];
                var filterFrom = [];
                var filterTo = [];
                //文本框
                $.each(inputArr, function (key, input) {
                    if ($(input).val() != '') filterInput.push({ "id": $(input).attr("data-filterkey"), "value": $(input).val() });
                });
                //下拉框
                $.each(inputArr1, function (key, input) {
                    if ($(input).val() != '全部' && $(input).val() != 'All')
                        filterSelect.push({ "id": $(input).attr("data-filterkey"), "value": $(input).val() });

                });
                //多选框
                $.each(inputArrIn, function (key, input) {
                    if (input.checked == false) filterCheck.push({ "id": $(input).attr("data-filterkey-in"), "value": $(input).val() });
                });

                $.each(inputArrFrom, function (key, input) {
                    var n = $(input).val()
                    if (n == '') return;
                    var val = 0;
                    try {
                        val = new Date(Date.parse(n.replace(/-/g, "/")));
                    } catch (e) {
                        val = parseFloat(n);
                    }
                    //  if (!(new Date(n).getDate() == n.substring(n.length - 2))) val = parseFloat(n);

                    filterFrom.push({ "id": $(input).attr("data-filterkey-from"), "value": val });
                });

                $.each(inputArrTo, function (key, input) {
                    var n = $(input).val()
                    if (n == '') return;
                    var val = 0;
                    try {
                        val = new Date(Date.parse(n.replace(/-/g, "/")));
                    } catch (e) {
                        val = parseFloat(n);
                    }
                    //  if (!(new Date(n).getDate() == n.substring(n.length - 2))) val = parseFloat(n);

                    filterTo.push({ "id": $(input).attr("data-filterkey-to"), "value": val });
                });


                //筛选allElements，添加到filteredElements
                $.each(self.allElements(), function (key, element) {
                    var addToFiltered = true;

                    //filter by all text fields
                    $.each(filterInput, function (key, input) {
                        var elementName = element[input.id]()
                        if (input.value == '')
                            addToFiltered = true;
                        else if (elementName == null || elementName.indexOf(input.value) == '-1') {
                            addToFiltered = false;
                        }
                    });

                    //filter by all text fields
                    $.each(filterSelect, function (key, select) {
                        var elementName = element[select.id]()
                        //if (elementName != select.value && select.value != null && elementName==null) {
                        if (elementName != select.value && select.value != null && (elementName != null || select.value != 'null')) {
                            addToFiltered = false;
                        }
                    });

                    //多选框
                    $.each(filterCheck, function (key, Check) {
                        var elementName = element[Check.id]()
                        if (elementName == Check.value && Check.value != null && (elementName != null || Check.value != 'null')) {
                            addToFiltered = false;
                        }
                    });
                    //日期或数值的最小值
                    $.each(filterFrom, function (key, fromValue) {
                        var elementName = element[fromValue.id]()
                        if (typeof fromValue.value == "object") try { elementName = Date.parse(elementName); } catch (e) { }

                        if (elementName < fromValue.value && fromValue.value != null) {
                            addToFiltered = false;
                        }
                    });
                    //日期或数值的最大值
                    $.each(filterTo, function (key, toValue) {
                        var elementName = element[toValue.id]()
                        if (typeof toValue.value == "object") try { elementName = Date.parse(elementName); } catch (e) { }
                        if (elementName > toValue.value && toValue.value != null) {
                            addToFiltered = false;
                        }
                    });


                    if (addToFiltered) {
                        filteredElements.push(element);
                    }
                });

                var filteredCustom = [];
                //将过滤后的filteredElements 生成 standartFilteredElements
                self.standartFilteredElements(filteredElements);

                //check is custom filters using now
                if (self.customFilteredElements() != self.allElements()) {
                    //check what custom filtered elements exists in array filtered with standart filters
                    $.each(filteredElements, function (key, value) {
                        if ($.inArray(value, self.customFilteredElements()) != '-1') {
                            filteredCustom.push(value)
                        }
                    });
                    self.currentElements(filteredCustom);
                } else {
                    self.currentElements(filteredElements);
                }
            }


            //删除当前行
            self.removeRow = function (row) {
                if (row == undefined) row = this;
                if (options.remove && (options.remove(row) == false)) return;
                //  removeConfirm(row,callback){ if(confrimdelete)callback(); }
                if (options.removeConfirm) {
                    options.removeConfirm(row, function () {
                        self.currentElements.remove(row);
                        self.allElements.remove(row);
                        self.deleteList += eval('row.' + keyColumns + '()') + ";";
                    });
                    return;
                }
                self.currentElements.remove(row);
                self.allElements.remove(row);
                self.deleteList += eval('row.' + keyColumns + '()') + ";";
            };
            //编辑当前行
            self.editRow = function (row) {
                if (row == undefined) row = this;
                var rowIndex = $.inArray(row, self.currentElements())
                var d = ko.mapping.toJS(row);
                if (options.edit) {
                    options.edit(d, function saveRow(data) {
                        for (var key in data) {
                            if (!ko.isComputed(row[key]) && key != '_status') row[key](data[key]);
                            // if (!ko.isComputed(row[key])) row[key](data[key]);
                        }

                        self.currentElements()[rowIndex] = row;
                        var status = ko.utils.unwrapObservable(row._status);
                        if (status == null) row._status = 'edited';
                    });
                }
                else {
                    self
                }
            }


            //新建
            self.addRow = function (newItem) {
                var newRow = new Item(newItem);
                newRow._status = 'new';
                self.allElements.push(newRow);
                self.currentElements(self.allElements());
            }


            function saveRow(data) {
                // if (row == undefined) row = this;

                for (var key in data) {
                    if (!ko.isComputed(row[key])) row[key](data[key]);
                }

                self.currentElements()[rowIndex] = row;
                if (row._status == undefined) row._status = 'edited';
            }


            //display all data on page
            self.getElements(srcArray);

            self.bind = function () {
                ko.applyBindings(self, element.get(0));
            }
        }

        //返回保存数据
        gridModel.getData = function () {
            var vm = gridModel.viewModel;
            if (options.beforeSave != undefined) var beGoon = options.beforeSave(vm);
            if (beGoon == false) return false;

            var datalist = [];
            $.each(vm.allElements(), function (key, value) {
                if (value._status != undefined) datalist.push(ko.mapping.toJS(value));
            });
            return { data: datalist, deleteList: vm.deleteList }
        }

        //返回需缓存的数据，不管是否曾经编辑或删除！
        gridModel.getCacheData = function () {
            var vm = gridModel.viewModel;
            //if (options.beforeSave != undefined) var beGoon = options.beforeSave(vm);
            //if (beGoon == false) return false;

            var datalist = [];
            $.each(vm.allElements(), function (key, value) {
                datalist.push(ko.mapping.toJS(value));
            });
            return { data: datalist, deleteList: vm.deleteList }
        }

        return gridModel;
    },
    //根据配置参数生成GridModel的html模板
    gridbuilder: new function () {
        var element;
        var options;

        this.CreateGrid = function (div, ops) {


            element = div;
            //div.children("table").remove();
            //div.children(".pagination").remove();
            element.children().remove();
            options = ops;

            //get table with data
            table(element, options.columns, ops.setRowClick);





            if (options.filters) {
                var filtersHtml = filters(options.filters);
                $(filtersHtml).appendTo(element.find("table thead"));
            }

            //check is need paginator
            if (options.elementsCount != undefined && options.elementsCount > 0) {
                var paginatorHtml = paginator()
                $(paginatorHtml).appendTo(element);

            }


        }


        function paginator() {
            var paginatorHtml =
                '<div>  <div  style="float:left;" data-bind="visible: paginator().length > 1">' +
                    '<ul class="pagination" data-bind="foreach: paginator">' +
                        '<li data-bind="css: { active:  name == $root.currentPaginatorPage() }">' +
                            '<!-- ko if: name != \'...\' -->' +
                                '<a data-bind="text: name, click: $root.setPage" ></a><!-- /ko -->' +
                            '<!-- ko if: name == \'...\' --><span>...</span><!-- /ko -->' +
                        '</li></ul></div>';

            paginatorHtml += '<div style="float:right;">' +
                            '<ul class="pagination pagination-right">' +
                                '<li data-bind="css: { active:  $root.elementsCount() == 5 }"><a data-pagecount="5">5</a></li>' +
                                '<li data-bind="css: { active:  $root.elementsCount() == 10 }"><a data-pagecount="10">10</a></li>' +
                                '<li data-bind="css: { active:  $root.elementsCount() == 20 }"><a data-pagecount="20">20</a></li>' +
                            '</ul>' +
                        '</div></div>';

            return paginatorHtml;
        }

        function filters(properties, element) {
            var columns = options.columns

            var filterHtml = '';

            filterHtml += '<tr>';
            $.each(columns, function (key, value) {
                if (properties[value.key]) {
                    //check type of filter for current column
                    var curfilter = properties[value.key];
                    var csss = ' style="width:90%;" ';
                    if (properties[value.key]['cssStyle']) csss = ' class="' + properties[value.key]['cssStyle'] + '"';

                    switch (properties[value.key]['type']) {
                        case "num":
                            filterHtml += '<th width="' + value.width + '"><input type="text" style="width:45%;" data-filterkey-from="' + value.key + '" ></input><input type="text" style="width:45%;" data-filterkey-to="' + value.key + '" ></input></th>';
                            break;
                        case "date":
                            filterHtml += '<th width="' + value.width + '"><input type="text" ' + csss + ' data-filterkey-from="' + value.key + '" ></input><input type="text" ' + csss + ' data-filterkey-to="' + value.key + '" ></input></th>';
                            break;
                        case "checkbox":
                            filterHtml += '<th width="' + value.width + '"><input type="checkbox"  data-filterkey="' + value.key + '" ></input></th>';
                            break;
                        case "select":
                            filterHtml += '<th width="' + value.width + '"><select ' + csss + ' data-filterkey="' + value.key + '" >';
                            if (curfilter.data) {
                                filterHtml += '<option value="全部">全部</option>';
                                if ($.isArray(curfilter.data)) {//数组
                                    $.each(curfilter.data, function (index, element) {
                                        filterHtml += '<option value="' + element + '">' + element + '</option>';
                                    });
                                } else {//对象
                                    $.each(curfilter.data, function (index, element) {
                                        filterHtml += '<option value="' + element + '">' + element + '</option>';
                                    });
                                }
                            }
                            filterHtml += '</select></th>';
                            break;
                        default:
                            var placeholders = "";
                            if (properties[value.key]['placeholder']) placeholders = ' placeholder="' + properties[value.key]['placeholder'] + '"';
                            filterHtml += '<th width="' + value.width + '">' +
                                 '<input type="text" ' + csss + ' value="" data-filterkey="' + value.key +
                                 '" ' + placeholders + '></th>';
                            break;
                    }
                } else {
                    filterHtml += '<th ' + (value.enable || "") + 'width="' + value.width + '"></th>';
                }
            });
            filterHtml += '</tr>';
            return filterHtml;
        }

        function table(element, columns) {
            if (options.cssClass == undefined) options.cssClass = " table table-striped table-bordered  table-condensed ";

            var tableHtml = '';
            tableHtml +=
                '<table class="' + options.cssClass + '" >' +
                    '<thead>';

            tableHtml += '<tr class="sort">';

            $.each(columns, function (key, value) {
                if (value.filter == '文本框') {
                    if (options.filters == undefined) options.filters = {};
                    options.filters[value.key] = {};
                } else if (value.filter == '多选框') {
                    if (options.filters == undefined) options.filters = {};
                    options.filters[value.key] = { type: "checkbox" };
                } else if (value.filter == '下拉框') {
                    if (options.filters == undefined) options.filters = {};
                    options.filters[value.key] = { type: "select" };
                } else if (value.filter == '数值区间') {
                    if (options.filters == undefined) options.filters = {};
                    options.filters[value.key] = { type: "num" };
                } else if (value.filter == '日期区间') {
                    if (options.filters == undefined) options.filters = {};
                    options.filters[value.key] = { type: "date" };
                }

                if (value.sortable == undefined) value.sortable = true;//默认为ture
                if (value.title == undefined) value.title = value.key;
                if (value.databind == undefined)
                    value.data_bind = "text:" + value.key;
                else
                    value.data_bind = "text:" + value.databind;

                if (value.sortable) {
                    tableHtml += '<th ' + (value.enable || "") + ' width="' + value.width + '"><a href="' + value.key + '" data-sortkey="' + value.key + '" class="btn btn-link" style="padding:0px 6px">' + value.title + '</a></th>';
                } else {
                    tableHtml += '<th ' + (value.enable || "") + '  width="' + value.width + '">' + value.title + '</th>';
                }
            });

            tableHtml += '</tr></thead>';

            //add tbody part to table
            var ttt = '';
            if (options.setRowClick) ttt = 'data-bind="click: $root.editRow"';
            tableHtml += '<tbody data-bind="foreach: elementsShow, visible: currentElements().length > 0"><tr ' + ttt + '>';

            $.each(columns, function (key, value) {
                //show row number
                if (value.key == "number") {
                    tableHtml += '<td data-bind="text: $root.itemNumber($index())"></td>';
                    return true;
                }

                //show some content
                if (value.content) {
                    tableHtml += '<td ' + (value.enable || "") + ' width="' + value.width + '">' + value.content + '</td>';
                    return true;
                }

                //ordinary cell
                tableHtml += '<td ' + (value.enable || "") + ' width="' + value.width + '" data-bind="' + value.data_bind + '"></td>';
            });

            tableHtml += '</tr></tbody></table>';

            $(tableHtml).appendTo(element);
        }
    },
    //只读
    setReadOnly: function (target, options, isreadonly) {

        // optins={'data-part':'readonly','data-part':'keep','data-part':'hide'}
        // data-readonly-type:控件只读方式（可选值：readonly-只读、hide-隐藏）

        function setElement(self) {

            if (self.attr('data-readonly-type') == "hide") {
                self.hide();
                return;
            }

            if (self.attr('data-readonly-type') == "show") {
                self.show();
                return;
            }

            switch (self[0].tagName) {

                case "A":
                    self[0].onclick = null;
                    self.css("text-decoration", "none")
                    self.attr("href", null);
                    break;
                case "LABEL":
                    self[0].onclick = null;
                    self.removeClass("btn-link");
                    self.css("text-decoration", "none")
                    break;
                default:
                    break;
            }

            switch (self[0].type) {
                case "text":
                    var NewInput = self.attr("readonly", "true").css({ "border": "none", "outline": "none" });
                    NewInput.unbind();
                    NewInput.focus(function () { this.select(); });
                    break;
                case "checkbox":
                    self.change(function (e) {
                        $(this).attr("checked", !this.checked);
                    });
                    break;
                case "radio":
                    self.attr("disabled", true);
                    break;
                case "select-one":
                    var value = self.find("option:selected").text();
                    var csswidth = self.css("width");
                    var NewInput = $('<input type="text" class="form-control"/>').attr("readonly", "true").css({ "border": "none", "outline": "none" }).val(value).insertAfter(self);
                    NewInput.focus(function () { this.select(); });
                    self.hide();
                    break;
                case "textarea":
                    var value = self.val();
                    var NewInput = self.attr("readonly", "true").css({ "border": "none", "outline": "none" });
                    NewInput.unbind();
                    NewInput[0].ondblclick = null;
                    NewInput.focus(function () { this.select(); });
                    break;
                case "button":
                case "submit":
                    if (self.attr('data-readonly-type') == "disabled")//禁用
                        self.attr("disabled", "disabled")
                    else if (self.attr('data-readonly-type') == "keep")//不处理
                        return;
                    else
                        self.hide();
                    break;
                default: break;
            }
        }


        var $root = $(target || 'body');
        if ($root.attr("data-readonly-type") == 'hide' && isreadonly == true) { $root.hide(); return }
        //遍历所有的页面节点
        $root.children().each(function (i, part) {

            var $part = $(part);
            if ($part.attr("data-part") == undefined) {
                if ($part.children().length > 0 && part.type != "select-one" && part.tagName != "BUTTON")
                    $.Com.setReadOnly($part, options, isreadonly);//递归
                else
                    if (isreadonly == true) setElement($part);
            } else {
                for (var key in options) {
                    if ($part.attr("data-part").indexOf(key) > -1) {
                        if (options[key] == "hide")  //如果定义为不可见
                            $part.hind();
                        else if (options[key] == "readonly") {  //如果明确说明只读
                            if ($part.children().length > 0 && part.type != "select-one" && part.tagName != "BUTTON")
                                $.Com.setReadOnly($part, options, true);//递归
                            else
                                setElement($part);
                        } else {   //如果没有定义为制定的值
                            if ($part.children().length > 0 && part.type != "select-one" && part.tagName != "BUTTON")
                                $.Com.setReadOnly($part, options, isreadonly);//递归
                        }
                    } else {   //如果没有定义
                        if ($part.children().length > 0 && part.type != "select-one" && part.tagName != "BUTTON")
                            $.Com.setReadOnly($part, options, isreadonly);//递归
                    }
                }
            }
        });
    },

    //显示子窗体，用于数据编辑
    showFormWin: function (data, callback, model, div, options) {
        var win;
        var dlgOpts = {
            width: 600, height: 500,
            button: [{
                text: '确定', handler: function () {
                    var data2 = model.getData();
                    if (data2 == false) alert("保存数据失败！");
                    else {
                        callback(data2);
                        win.close();
                    }
                }
            }]
        };
        dlgOpts = $.extend({}, dlgOpts, options);

        if (model.htmlroot == undefined) model.htmlroot = $(div).clone();

        win = $.iwf.showWin(dlgOpts);

        $(model.htmlroot).appendTo(win.content());
        $(model.htmlroot).show();
        model.show(win.content(), data);
        return win;

    }

});


///框架界面接口
//跳转到指定的路径，加载业务模块
//url格式如果是：module.model,当模块已经加载，则直接跳转,
//如果是module.model:{}，且参数和之前不同,则会重新调用model.show();
//如果是.model,则切换到具有该model的tab页
//如果是module.则切换到该tab页
$.Com.Go = function (url, callback) {
    $.iwf.onmodulechange(url, callback);
}

//关闭tab页, key:casemodule.doingcase:{}中的casemodule
$.Com.Close = function (key) {
    $.iwf.onmoduleclose(key);
}

//获取当前已经加载的模块，key：比如casemodule.doingcase:{}中的casemodule.doingcase
//如果不知道在哪个tab页，则使用.doingcase获取，如果有多个，则取第一个加载的那个
$.Com.getActiveModel = function (key) {
    $.iwf.getActiveModel(key)
}


///异步加载指定的业务模块 key:fx/com/wf/doneCase
//$.iwf.getModel: function (key, callback) 

///保存草稿
$.Com.saveDraft = function (Key, content, callback) {
    $.fxPost("IWorkDraftManage.data?action=WriteCaseToDraft", { guid: Key, content: content }, callback);
}

$.Com.deleteDraft = function (Key, callback) {
    $.fxPost("IWorkDraftManage.data?action=DeleteDraft", { guid: Key }, callback);
}

$.Com.getDraft = function (Key, callback) {
    $.fxPost("IWorkDraftManage.data?action=ReadCaseFromDraft", { guid: Key }, callback);
}