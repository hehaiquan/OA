$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'SchedulePortal' };

    this.search = function () {
        loadGrid();
    }

    this.show = function (module, root) {
        if (root.children().length == 0) {
            root.load("models/Schedule/SchedulePortal.html", function () { });
        }
    }
});
