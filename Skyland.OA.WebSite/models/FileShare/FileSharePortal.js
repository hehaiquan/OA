﻿$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'FileSharePortal' };

   this.search = function () {
        loadGrid();
    }
    
    this.show = function (module, root) {
        if (root.children().length == 0) {
            root.load("models/FileShare/FileSharePortal.html", function () { });
        }
    }
});
