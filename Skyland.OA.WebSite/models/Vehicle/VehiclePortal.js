$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'VehiclePortal' };

    this.search = function () {
        loadGrid();
    }

    this.show = function (module, root) {
        if (root.children().length == 0) {
            root.load("models/Vehicle/VehiclePortal.html", function () { });
        }
    }
});
