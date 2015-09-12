$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'listedit' };


    this.show = function (module, root) {
        $.Biz.listpage.show(module, root);
    }
});