define(function () {
    return new function () {

        var $Message , $messageMenu;

        function poll() {

            //轮询更新当前用户新的消息
            $.getJSON("message.data?action=getmsg", { type: "", tt: Math.random() }, function (data) {
                if (data.length && data.length > 0) {
                    $.each(data, function (i, msg) {
                        if (msg.type != "sys") showNewMsg(msg);
                    });
                }
            });

        };

        this.init = function (element) {
            if (appConfig.messageInterval <= 0) return;
            $Message = element;
            $messageMenu = $('<div id="iwf-NewMsg" class="list-group " style="width:300px;margin-bottom:0px; position: absolute;right: 100px; top:60px; box-shadow:0px 6px 12px rgba(0,0,0,0.175);"></div>').appendTo("body");
            $messageMenu.hide();

            //菜单初始化

            var $messageMenu = $('<ul class="list-group" style="width:300px;margin-bottom:0px;"></ul>').appendTo(element.parent().parent());
            $messageMenu.css("overflow", "auto");
            $Message.parent().DropdownMenu({ content: $messageMenu });
            $Message.hide();

            $.getJSON("message.data?action=getmsg", { type: "login", tt: Math.random() }, function (data) {

                if (data.length && data.length > 0) {
                    $.each(data, function (i, msg) {
                        $.iwf.messages.push(msg);
                    });
                    updateMsg();
                }
            });

            //设置轮询
            setInterval(function () {
                poll();
            }, appConfig.messageInterval)

        }



        ///消息提醒菜单！！
        updateMsg = function () {
            if ($messageMenu == undefined) return;
            if ($.iwf.messages.length > 0 && $messageMenu) {
                $Message.show();
                $messageMenu.show();
                $messageMenu.empty();
            }
            else { $Message.hide();     $messageMenu.parent().hide(); return }

            $.each($.iwf.messages, function (i, item) {
                if (item.type == "once") return;
                if (item.hide == true) return;
                if (item.icon == undefined) item.icon = "fa fa-comment-o";
                var $li = $('<a class="list-group-item"><div class="list-group-item-heading"><i class="' + item.icon + '"/> <strong>' + item.text + '</strong><button class="badge pull-right close" aria-hidden="true" data-hind="C000021">×</button></div><small> ' + item.descript + '</small></a>').appendTo($messageMenu);

                $li.find("button").bind("click", function () {
                    if ($messageMenu) { $li.remove(); if ($messageMenu.children().length < 1) { $messageMenu.parent().hide(); $Message.hide(); } }
                    return false;
                })

                $li.bind("click", function () {
                    $.iwf.onmodulechange(item.url);
                    $messageMenu.parent().hide();
                    item.hide = true;
                    $li.remove();
                    $.post("message.data?action=deletemsg", { guid: item.guid, tt: Math.random() }, function (data) { });
                    if ($messageMenu.children().length < 1) { $Message.hide(); }
                })
            })
        }

        //新消息提醒
        showNewMsg = function (item) {

            var $messageMenu = $("#iwf-NewMsg");
            $messageMenu.show();
            var $li = $('<a class="list-group-item bg-info"><div class="list-group-item-heading"><i class="' + item.icon + '"/> <strong>' + item.text + '</strong><button class="badge pull-right close" aria-hidden="true" data-hind="C000021">×</button></div><small> ' + item.descript + '</small></a>').appendTo($messageMenu);

            function deleteli() {

                $li.remove(); $li = null
                if ($messageMenu.children().length == 0) $messageMenu.hide();;
            }

            $li.find("button").bind("click", function () {
                if ($li) deleteli();
                return false;
            })

            setTimeout(function () {
                if ($li) {
                    deleteli();
                    //到期隐藏后加入菜单
                    $.iwf.messages.push(item);
                    updateMsg();
                }
            }, 13000);

            $li.bind("click", function () {
                $.iwf.onmodulechange(item.url);
                //删除消息
                $.post("message.data?action=deletemsg", { guid: item.guid }, function (data) { });
                //在菜单中隐藏该消息
                item.hide = true;
                updateMsg();
                if ($li) deleteli();
            })

        }





    }
})