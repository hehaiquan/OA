define(function () {
    return function () {
        this.events = {};

        //注册一个事件
        this.on = function (type, fn, context) {
            var arrType = this.events[type] = this.events[type] || [];
            arrType.push({ fn: fn, ctx: context ? context : null });
        };

        //触发事件
        this.fire = function (type, args) {
            if (!(type in this.events)) return;
            var arrType = this.events[type],
                args = Array.prototype.slice.call(arguments, 1);
            for (var i = 0, len = arrType.length; i < len; i++) {
                arrType[i].fn.call(arrType[i].ctx ? arrType[i].ctx : null, args);
            }
        };

        //移除事件
        this.off = function (type, fn) {
            if (!(type in this.events)) return;
            if (fn == null) {
                delete this.events[type];
                return;
            }
            var arrType = this.events[type];
            for (var len = arrType.length, i = len - 1; i >= 0; i--) {
                if (arrType[i].fn == fn) arrType.splice(i, 1);
            }
            if (arrType.length == 0) {
                delete this.events[type];
            }
        };
    }
});