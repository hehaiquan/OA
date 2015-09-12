define(new function () {
    var me = this;
    me.data = null;
    this.options = { key: 'MyAdminOffice' };
    var models = {}

    this.show = function (module, root) {
        if (root.children().length == 0) {
            root.load("nnepb/portlet/OA/document.html", function () {
                

            });

          
        }
    }

}());