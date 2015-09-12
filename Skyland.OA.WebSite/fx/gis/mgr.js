define(function () {
    var map = $.Gis.map;
    if (map == null) throw new error("地图还未初始化!");
    return new function () {
        var self = this;
        this.options = { key: 'laymgr', title: '图层管理', icon: 'fa fa-list-ul' };
        this.layers = {};

        var $treeDiv;

        this.show = function (root) {
            $treeDiv = root;
            $treeDiv.empty();
            for (var key in self.layers) {
                var tt = self.layers[key];
                if (tt) self.addLayer(tt.layer, tt.opts);
            }
        }

        this.addLayer = function (lyr, Opts) {

            if (self.layers[Opts.id] != null) {
                Opts = self.layers[Opts.id].opts;
                this.removeLayer(Opts.id);
            }
            if (Opts.visible == null) Opts.visible = true;
            self.layers[Opts.id] = { 'layer': lyr, 'opts': Opts };
            if ($treeDiv == undefined) return;

            var $group = $treeDiv;
            if (Opts.groupname) {
                $group = $treeDiv.find("[data-ul='" + Opts.groupid + "']");
                if ($group.length < 1) {
                    var a = $(' <a class="list-group-item  treeview-bar" style="cursor:pointer;" data-id="' + Opts.groupid + '" unselectable="on">' + Opts.groupname + ' </a>').appendTo($treeDiv);
                    $group = $('<div style="margin: 0px 0px 0px 3px;"  class="list-group" data-ul="' + Opts.groupid + '"></div>').appendTo($treeDiv);

                    var btnHind = $('<div class="badge btn"><span data-hind="' + Opts.groupid + '" unselectable="on" class="fa fa-caret-down  fa-lg" style="width:8px;height:12px;"></span></div>').appendTo(a);

                    a.bind('click', function (e) {
                        if (btnHind.children().hasClass("fa fa-caret-down")) {
                            btnHind.children().removeClass("fa fa-caret-down");
                            btnHind.children().addClass("fa fa-caret-left");
                            $group.hide();

                        } else {
                            btnHind.children().removeClass("fa fa-caret-left");
                            btnHind.children().addClass("fa fa-caret-down");
                            $group.show();
                        }
                        return false;
                    });

                }
            }
            var checkIcon = 'fa-check-square-o';
            if (Opts.visible == false) checkIcon = 'fa-square-o';

            var $li = $('<a  class="list-group-item" style="border-width:0 0 1px 0;" data-id="' + Opts.id + '" unselectable="on"><span style="cursor:pointer"><i class="fa ' + checkIcon + '" style="width:22px;"></i>' + Opts.name + '</span></a>').appendTo($group);
            if (Opts.iconCls) $li.children('span').children('i').after('<i class="' + Opts.iconCls + '"></i>');

            $li.children("span").bind('click', function (e) {
                var opt = self.layers[Opts.id].opts;
                opt.visible = !opt.visible;
                if (opt.visible) { map.addLayer(lyr); }
                else { map.removeLayer(lyr); }
                self.setLayer(opt.id, opt);
                return false;
            });

            //var $delLayer = $('<span class="badge" style="cursor:pointer;" title="删除图层"><span aria-hidden="true">&times;</span></span>').appendTo($li).bind('click', function () {
            //    map.removeLayer(lyr);
            //    self.removeLayer(Opts.id);
            //    return false;
            //});

            if (Opts.showControl) {
                Opts.showControl($('<div style="width:100%"></div>').appendTo($li));
            }
        };

        this.removeLayer = function (id) {
            delete self.layers[id];
            if ($treeDiv) {
                var $li = $treeDiv.find("[data-id='" + id + "']");
                if ($li.parent().children().length == 1) {
                    $li.parent().prev().remove();
                    $li.parent().remove();
                }
                else
                    $li.remove();
            }
            if (self.removeCallback) self.removeCallback();
        }

        this.setLayer = function (id, opts) {
            if ($treeDiv) {
                if (opts.visible == true) {
                    var $icon = $treeDiv.find("[data-id='" + id + "']").children("span").children("i");
                    $icon.removeClass("fa-square-o")
                    $icon.addClass("fa-check-square-o");
                }
                if (opts.visible == false) {
                    var $icon = $treeDiv.find("[data-id='" + id + "']").children("span").children("i");
                    $icon.removeClass("fa-check-square-o")
                    $icon.addClass("fa-square-o")
                }
            }
        }
    }
});