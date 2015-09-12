define(function () {
    return function () {
        var root;
        var self = this;
        var persontree;
        var NextReceiveInfo = {};
        var wfcase;

        //更新用户列表
        function updateUserlist(data, defaultUsers) {
            NextReceiveInfo.ReceivePersons = defaultUsers;
            var userlist = [];

            if (defaultUsers && defaultUsers.length && defaultUsers.length > 0) {

                var bein = false;
                $.each(defaultUsers, function (j, node) {
                    for (i = 0; i < userlist.length; i++) {
                        if (userlist[i].text == node.title) {
                            userlist[i].children.push(node)
                            bein = true;
                            break;
                        }
                    }
                    if (!bein) {
                        userlist.push({
                            text: node.title,
                            expand: true,
                            unselectable: true,
                            css: "list-group-item treeview-bar",
                            children: [node]
                        });
                    }

                    node.checked = true;
                });

            }
            var usercount = 0;
            //根据服务端数据进行调整
            $.each(data, function (i, node) {
                if (node.children) {
                    usercount += node.children.length;
                }
            });
            if (usercount > 10)
                $.each(data, function (i, node) {
                    if (node.children) {
                        var newnode = {
                            text: node.name,
                            expand: usercount < 50, //超过50个人可选就不自动展开
                            unselectable: true,
                            css: "list-group-item treeview-bar",
                            children: []
                        };

                        $.each(node.children, function (t, user) {
                            $.each(defaultUsers, function (j, duser) {
                                if (user.id == duser.id) {
                                    user.checked = true;
                                    return false;
                                }

                            })
                            if (user.checked != true) {
                                user.checked = false
                                newnode.children.push(user)
                            }
                        })
                        if (newnode.children.length > 0) userlist.push(newnode);

                    }
                });
            else {
                var newnode = {
                    text: "&nbsp;",
                    expand: true,
                    unselectable: true,
                    css: "list-group-item treeview-bar",
                    children: []
                };
                $.each(data, function (i, node) {
                    if (node.children) {
                        $.each(node.children, function (t, user) {
                            $.each(defaultUsers, function (j, duser) {
                                if (user.id == duser.id) {
                                    user.checked = true;
                                    return false;
                                }

                            })
                            if (user.checked != true) {
                                user.checked = false
                                newnode.children.push(user)
                            }
                        })

                    }
                });
                if (newnode.children.length > 0) userlist.push(newnode);
            }

            var items = {
                data: userlist,
                expandbyClick: true,  //是否点击父节点展开
                expandable: true,
                css: {
                    item: "treeview-item btn btn-default",
                    selected: 'active'
                },

                flowlayout: 85,       //子节点的宽度
                itemclick: function (item, element) {
                    if (item.children && item.children.length > 0) return;

                    if (item.checked) {
                        NextReceiveInfo.ReceivePersons.push({ id: item.id, name: item.name });
                    }
                    else {
                        for (var i = 0; i < NextReceiveInfo.ReceivePersons.length; i++) {
                            if (NextReceiveInfo.ReceivePersons[i].id == item.id) NextReceiveInfo.ReceivePersons.splice(i, 1);
                        }
                    }
                    if (self.onSelected) self.onSelected(NextReceiveInfo); // self.UpdateChoseBtnText();
                }
            };
            persontree.empty();
            var usermenu = persontree.listView2(items);
            usermenu.css("overflow", "auto");

            if (self.onSelected) self.onSelected(NextReceiveInfo); //  self.UpdateChoseBtnText();//更新按钮显示文字
        }

        //处理切换提交步骤事件
        function changeAct(sender, callback) {
            if (sender.target.length != 0) {
                var node = $(sender.target);
                node.addClass("active").siblings().removeClass("active");
                NextReceiveInfo = {
                    ActInfo: {
                        id: node.attr("data-actid"),
                        name: (node[0].innerText == "当前步骤") ? "转办" : node[0].innerText
                    }
                };
            }

            if (NextReceiveInfo.ActInfo.id == "END") {
                persontree.empty();
                if (self.onSelected) self.onSelected({
                    ActInfo: { name: "办结", id: "END" },
                    ReceivePersons: [{ ID: NextReceiveInfo.userid }]
                });
            }
            else {
                //选定步骤的可提交人
                $.fxPost("engine.data?action=GetReceiversByAct", { "flowid": wfcase.flowid, "actid": NextReceiveInfo.ActInfo.id, "caseid": wfcase.caseid }, function (RESULT) {

                    if (callback) callback(RESULT);

                    updateUserlist(RESULT.lstPersonTree, RESULT.lstDefaultPersons);
                    if (RESULT.lstDefaultPersons) {
                        NextReceiveInfo.ReceivePersons = RESULT.lstDefaultPersons;
                    }
                    if (self.onSelected) self.onSelected(NextReceiveInfo); //self.UpdateChoseBtnText();

                });
            }
        }


        this.show = function (data, div) {

            root = $(div);
            wfcase = data.wfcase;

            persontree = root.find("[iwftype=persontree]");

            //设置提交节点
            NextReceiveInfo = {
                ActInfo: {
                    id: data.DefaultNextInfo.ID,
                    name: data.DefaultNextInfo.Name
                }
            };

            if (data.DefaultNextInfo.lstDefaultPersons && data.DefaultNextInfo.lstDefaultPersons.PickByField("ID")) {
                NextReceiveInfo.ReceivePersons = data.DefaultNextInfo.lstDefaultPersons;
            }
            if (data.DefaultNextInfo.ID != "END") { //self.UpdateChoseBtnText();
                if (self.onSelected) self.onSelected(NextReceiveInfo);
            }
            else {
                //self.listchosebtn.find("[iwftype=listchoseContent]").first().text("办结");
                if (self.onSelected) self.onSelected({
                    ActInfo: { name: "办结", id: "END" },
                    ReceivePersons: [{ ID: NextReceiveInfo.userid }]
                });
                //NextReceiveInfo.ReceivePersons = [{ ID: NextReceiveInfo.userid}];
            }


            ///过滤框目前还不实现
            //self.personbox


            //初始化设置可选步骤
            function setActOptions(actlist, defaultAct) {
                var tmpl = root.find("[iwftype=ActionTmpl]"); //self.dropDiv.find("[iwftype=ActionTmpl]");
                var tmplStr = tmpl[0].outerHTML;

                //设置可选步骤
                $.each(actlist, function (index, Entity) {
                    var tempdom = $(tmplStr.replace$Object(Entity)).removeAttr("iwftype");
                    tempdom.insertBefore(tmpl);
                });
                var Allnodes = tmpl.siblings();
                tmpl.remove();

                //绑定事件
                Allnodes.bind("click", changeAct);
                //默认选中
                Allnodes.filter("[data-actid=" + defaultAct.ID + "]").addClass("active").siblings().removeClass("active");
                //当前步骤  //self.CurActivityModel.ID
                Allnodes.filter("[data-actid=" + wfcase.flowid + "]").addClass("list-group-item-info").text("当前步骤");//.attr('title', 'self.CurActivityModel.Name');
            }

            setActOptions(data.ListActivityModel, data.DefaultNextInfo);

            if (data.DefaultNextInfo.lstPersonTree) updateUserlist(data.DefaultNextInfo.lstPersonTree, data.DefaultNextInfo.lstDefaultPersons);

            //开始初始化【提供回调】
            if (self.afterInitfunc) self.afterInitfunc();
        };

        this.set = function (persons, actid) {
            changeAct({ target: root.find("[data-actid=" + actid + "]") }, function (result) {

                result.lstDefaultPersons = persons;

            });
        }
    }
})