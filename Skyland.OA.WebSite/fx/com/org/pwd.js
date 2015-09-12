//新的模块编写方式！！

define(function (resetPWD) {
    return new function () {

        this.options = { key: 'resetpwd', title: '修改密码', icon: '', layerout: 'window' };
        var root;
        this.show = function (module, r) {
            root = r;
            if (root.children().length == 0) {
                root.load("fx/com/org/resetPWD.html", callback);
            }
        }

        function callback() {
            root.find("#savePWD").bind("click", savePWD);
        }

        function savePWD() {
            var oldPWD = $("#oldPWD").val();
            var newPWD = $("#newPWD").val();
            var doublePWD = $("#doublePWD").val();

            if (oldPWD == newPWD) {
                alert("新密码不能与旧密码一样！");
                return;
            }
            if (newPWD != doublePWD) {
                alert("重复密码与新密码不一致，请重新填写！");
                $("#doublePWD").val("");
                $("#doublePWD").focus();
                return;
            }

            // $.post("org.data?action=changePWD", { oldPWD: oldPWD, newPWD: newPWD, doublePWD: doublePWD }, function (json) {
            $.fxPost("../fx/org/changePWD", { oldPWD: oldPWD, newPWD: newPWD, doublePWD: doublePWD }, function (json) {
                if (json.success) {
                    alert(json.msg + "请重新登录！");
                    $.iwf.LoginUI();
                }
                else {
                    alert(json.msg);
                }
            });
        }
    }()
}
    );