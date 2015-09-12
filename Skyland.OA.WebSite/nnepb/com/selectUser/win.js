define(['nnepb/com/selectUser/tree'],function (selecttree) {
    return function (element, valueAccessor, callback) {

        var model = new selecttree(element, valueAccessor);
        var root = null;
        var opts = {
            title: '选择用户',
            height: 730,
            width: 750,
            button: [
               {
                   text: '确定', handler: function (data) {

                       var d = model.getData();
                       valueAccessor.userid(d.userid);
                       valueAccessor.username(d.username);
                       win.close();
                   }
               },
              {
                  text: '取消', handler: function () { win.close(); }
              }
            ]
        };


        if (!valueAccessor.opt) opts.button = null;
        var win = $.iwf.showWin(opts);
        root = win.content();
        model.show(
            {
                callback: function (item) { callback(item); win.close(); }
            },
            root
         );
    }
});