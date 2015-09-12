(function ($) {
    $.fn.mutiselect = function (options) {
        var opts = $.extend({}, $.fn.mutiselect.defaults, options);
        var $this = this;
        var selectItems = new Array();
        this.getSelectedItems = function (callback) {
            //return selectItems;

            if (opts.checkurl != null) {
                $.post(opts.checkurl, {
                    term: $this.val(),
                    type: opts.type
                }, function (data) {
                    selectItems = JSON.parse(data);
                    if (callback != undefined)
                        callback(selectItems);
                });
            }
        };
        this.setType = function (selectType) {
            opts.type = selectType;
        };
            
        function showTree(callback) {
            $("ulTree").remove();
            var divID = getGuid();
            var mydiv = $('<div></div>');
            //修改选择控件的弹窗方式
            $('<ul class="ztree" id="'+divID+'"></ul>').appendTo(mydiv);
            mydiv.appendTo($(document).body);
            var win = $(mydiv).dialog({
                title: opts.treeWinTitle,
                buttons: {
                    "确定": function (data) {
                        treeConfig.save();
                        $(this).dialog("close");
                    },
                    "取消": function () { $(this).dialog("close"); }
                },
                width: opts.width,
                height:opts.height,
                modal: true,
                resizable: false
            });
            //var win = $('body').iwfWindow({
            //    title: opts.treeWinTitle,
            //    local: {
            //        top: opts.treeWinTop, left: opts.treeWinLeft
            //    },
            //    append: '<ul class="ztree"></ul>',
            //    button: [{
            //        text: '确定', handler: function (data) {
            //            treeConfig.save();
            //            win.close();
            //        }
            //    }, {
            //        text: '取消', handler: function () { win.close(); }
            //    }]
            //});

            var treeConfig = {
                data: {
                    simpleData: { enable: true, idKey: "id", pIdKey: "pid" }
                },
                check: { enable: true },
                save: function () {
                    if (treeConfig.view == undefined)
                        return;
                    var nodes = treeConfig.view.getCheckedNodes();
                    var selectTreeItems = [];
                    var text = opts.labelText;
                    var value = opts.valueText;
                    $.each(nodes, function (i, node) {
                        var item = {};
                        item[text] = node.name;
                        item[value] = node.id;
                        //var item = node.name;
                        selectTreeItems.push(item);
                    });
                    if (callback) {
                        callback(selectTreeItems);
                    }
                }
            };

            $.getJSON(opts.sourceurl, {
                term: "",
                type: opts.type
            }, function (json) {
                var treeData = [];
                $.each(json, function (i, item) {
                    var temp = { id: item[opts.valueText], name: item[opts.labelText], open: true };
                    if ($.trim($this.val()) != "") {
                        var inputText = split($this.val());
                        for (var j = 0; j < inputText.length; j++) {
                            if (inputText[j] == temp.name) {
                                temp.checked = true;
                                break;
                            }
                        }
                    }
                    treeData.push(temp);    
                });
                //debugger;
                var tree = $.fn.zTree.init(win.children().first(), treeConfig, treeData);
                treeConfig.view = tree;
            });
        }
        return this.each(function () {
            var width = $this.width();

            //添加右侧按钮
            var selectBtnId = getGuid();
            $this.after($('<input class="btn" type="button" id="' + selectBtnId + '" value=".."></input>'));
            $("#" + selectBtnId).css("height", 30).css("width", 25).css("margin-left", 1).click(function () {
                showTree(updateText);
            });
            $this.css("width", width - 28);
            function updateText(treeItems) {
                var items = [];
                for (var j = 0; j < treeItems.length; j++) {
                    items.push(treeItems[j][opts.labelText]);
                }
                var text = items.join(';');
                if ($.trim(text) != '')
                    text = text + ';';
                $this.val(text);
                if (opts.checkCallBack) {
                    var checkdata = {};
                    checkdata.ValidateItems = [];
                    checkdata.InvalidateItem = [];
                    $.each(treeItems, function(i,item) {
                        checkdata.ValidateItems.push(item);
                    });
                    opts.checkCallBack(checkdata);
                }
            };

            // don't navigate away from the field on tab when selecting an item
            $this.bind("keydown", function (event) {
                if (event.keyCode === $.ui.keyCode.TAB &&
						$(this).data("autocomplete").menu.active) {
                    event.preventDefault();
                }
            })
            .blur(function () {
                if (opts.checkurl != null && $.trim(this.value) != "") {
                    $.post(opts.checkurl, {
                        term: this.value,
                        type: opts.type
                    }, function (data) {
                        if (opts.checkCallBack) {
                            var returnData = JSON.parse(data);
                            opts.checkCallBack(returnData);
                        }
                    });
                }
            })
			.autocomplete({
			    minLength: 0,
			    autoFill: true,
			    multiple: true,
			    matchContains: true,
			    scrollHeight: 200,

			    source: function (request, response) {
			        $.getJSON(opts.sourceurl, {
			            term: extractLast(request.term),
			            type: opts.type
			        }, response);
			    },
			    search: function () {
			        // custom minLength
			        $(this).addClass(opts.autocomplete_loading_css);
			        var term = extractLast(this.value);
			        if (term.length < opts.minLength) {
			            return false;
			        }
			    },
			    open: function () {
			        $(this).removeClass(opts.autocomplete_loading_css);
			    },
			    focus: function () {
			        // prevent value inserted on focus
			        return false;
			    },
			    select: function (event, ui) {
			        var terms = split(this.value);
			        // remove the current input
			        terms.pop();
			        // add the selected item
			        terms.push(ui.item[opts.labelText]);
			        // add placeholder to get the comma-and-space at the end
			        terms.push("");
			        this.value = terms.join(";");
			        return false;
			    }
			});
        });
    };

    function split(val) {
        return val.split(/;\s*/);
    }
    function extractLast(term) {
        return split(term).pop();
    }

    function getGuid() {
        var guid = "";
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += "-";
        }
        return guid;
    }

    $.fn.mutiselect.defaults = {
        type: "",
        sourceurl: null,   //数据源
        checkurl: null, //数据验证
        autocomplete_loading_css: 'ui-autocomplete-loading',  //等待获取样式
        minLength: 0,           //最少输入多少字符触发从服务器取数据
        labelText: "label",     //text字段
        valueText: "value",     //value字段
        treeWinLeft: 200,       //弹窗位置Left
        treeWinTop: 200,        //弹窗位置Top
        width:350,            //窗体的宽度
        height:400,            //窗体的高度
        treeWinTitle: '请选择',     //弹窗标题
        checkCallBack: null     //当控件失去焦点或调用getSelectedItems时触发的回调
};
})(jQuery);