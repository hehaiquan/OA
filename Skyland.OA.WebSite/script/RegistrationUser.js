function registrationUser() {

    //var params = { username: $("#username").val(), password: $("#password").val(), rmb: $("#rmbUser").attr("checked") };

    $.post("org.data?action=login", params, function (s) {
        //try {
        //    var data = eval("(" + s + ")");
        //}
        //catch (err) {
        //    alert("未知错误:" + s + ",请联系管理员！");
        //    return;
        //}


    });
}



$(document).ready(function () {

});