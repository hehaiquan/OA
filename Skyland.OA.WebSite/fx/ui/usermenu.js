define(function () {
    return new function () {
        this.show = function (element) {

            ////用户菜单，包括修改密码等等
            //$.iwf.showUserMenu = function (element) {
            var userinfoname = element;
            userinfoname.children("span").text($.iwf.userinfo.CnName);

            var userData = appConfig.userMenu;

            userData.push({ text: '重新登录', handler: function () { $.iwf.relogin(); } });
            userData.push({ text: '退出', handler: function () { $.iwf.logout(); } });

            $.each(userData, function (i, item) {
                item.unselectable = true;
                item.id = "userMenu" + i;
            })

            var items = {
                css: {
                    line: 'divider',
                    list: 'list-group',
                    item: 'list-group-item treeview-item',
                    selected: 'active'
                },
                data: userData,
                itemclick: function (item) {
                    $.iwf.onmodulechange(item.url);
                    usermenu.parent().hide();
                    // hideMenu2();
                }
            };

            var usermenu = $("<div></div>").appendTo(userinfoname.parent().parent()).listView2(items);
            usermenu.css("overflow", "auto");
            userinfoname.parent().DropdownMenu({ content: usermenu });
        }


        //}
    }
})