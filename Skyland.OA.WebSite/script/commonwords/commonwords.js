/*!
 * boxy autocompleteextend
 *
 * Depends:
 *	autocompleteextend.js
 */
(function ($, undefined) {
    $.fn.commonwords = function (options) {
        var opts = $.extend({}, $.fn.commonwords.options, options, {
            isShowExtendMenuWhenUnMatch: true,
            isCloseAfterSelected: true
        });
        var that = this;
        return this.each(function () {
            that.autocompleteextend({
                match: extractLast,
                isShowExtendMenuWhenUnMatch: opts.isShowExtendMenuWhenUnMatch,
                isCloseAfterSelected: opts.isCloseAfterSelected,
                minLength: 0,
                source: function (request, response) {
                    $.getJSON("/CommonWordsSvc.data?action=getCommonWords", {
                        term: extractLast(request.term),
                        userId: opts.userId,
                        controlUrl: opts.controlUrl,
                        random: Math.random()
                    }, response);
                },
                focus: function () { // prevent value inserted on focus
                    return true;
                },
                select: function (event, ui) {
                    var terms = split(this.value); // remove the current input
                    terms.pop();
                    terms.push(ui.item.label); // add the selected item
                    terms.push(""); // add placeholder to get the comma-and-space at the end
                    this.value = terms.join("");//去掉常用语后面的分号 2013/9/5 jinguanh

                    return false;
                },
                search: function () { // custom minLength
                    var term = extractLast(this.value);
                    //if (term.length < 1) {
                    //    return false;
                    //}
                    //return;
                },
                menuButtons: {
                    "删除": {
                        src: "../../script/other/img/MiniDelete.png",
                        func: function (event, data, btn) {
                            $.post("/CommonWordsSvc.data?action=deleteCommonWords", {
                                value: data.item.value,
                            }, function (item) {
                                $(btn).parent().parent().remove();
                            });
                        }
                    },
                    "用户": {
                        src: "../../script/other/img/ShowOnCurrentPerson.png",
                        func: function (event, data, btn) {
                            $.post("/CommonWordsSvc.data?action=changeUserCommonWords", {
                                wordId: data.item.value,
                                userId: opts.userId
                            }, function (item) {
                                if (data.item.userId) {
                                    btn.css("background-image", "url(../../script/other/img/ShowOnAllPeople.png)");
                                } else {
                                    btn.css("background-image", "url(../../script/other/img/ShowOnCurrentPerson.png)");
                                }
                            });

                            //return false;
                        },
                        initialized: function (btn, data) {
                            if (data.item.userId) {
                                btn.css("background-image", "url(../../script/other/img/ShowOnAllPeople.png)");
                            } else {
                                btn.css("background-image", "url(../../script/other/img/ShowOnCurrentPerson.png)");
                            }
                        }
                    }
                },
                controlButtons: {
                    "新增": {
                        src: "../../script/other/img/MiniAdd.png",
                        func: function (event, data) {
                            $.post("/CommonWordsSvc.data?action=addCommonWords", {
                                term: data.item.label,
                                userId: opts.userId,
                                controlUrl: opts.controlUrl
                            }, function (item) {
                            });
                        }
                    }
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
    $.fn.commonwords.options = {
        userId: "",
        controlUrl: "",

        autoOpen: true,  //获取焦点时自动打开弹出框
        delay: 300,
        minLength: 0,
        source: null,

        // callbacks
        change: null,
        close: null,
        focus: null,
        open: null,
        response: null,
        search: null,
        select: null,
        menuButtons: null, //弹出菜单附加的按钮
        controlButtons: null, //控件附加的菜单
        isCloseAfterSelected: true, //选中后是否关闭弹出框
        isRefreshAfterSelected: true, //选中后是否刷新弹出框
        isShowExtendMenuWhenUnMatch: true //当数据不匹配时是否显示附加的菜单
    };
}(jQuery));