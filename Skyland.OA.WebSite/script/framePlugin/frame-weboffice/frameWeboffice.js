

function ShowWordWin(data) {

    var global = {
        HostUrl: document.location.protocol + "//" + document.location.host + "/",
        QuoteJS: function (url) { document.write('<script src="' + this.HostUrl + url + '"></script>'); },
        QuoteCSS: function (url) { document.write('<link href="' + this.HostUrl + url + '" rel="stylesheet" />'); },
        _Curpath: (function (keyword, me) {
            var script = document.getElementsByTagName('script');
            var l = script.length;
            for (i = 0; i < l; i++) {
                me = !!document.querySelector ?
                    script[i].src : script[i].getAttribute('src', 4);

                if (me.substr(me.lastIndexOf('/')).indexOf(keyword) !== -1)
                    break;
            }
            return me.substr(0, me.lastIndexOf('/') + 1);
        })("frameWeboffice")
    };

    var Url = global._Curpath + "WordContainer.html";

    var UniqueParams = new Object();
    UniqueParams["Logo"] = data["Logo"];
    UniqueParams["Title"] = data["Title"];
    UniqueParams["HttpParams"] = data["HttpParams"];


    //老版本是地址栏传递(这个方式优点是简单，缺点是不能太长)
    var ParamsDataStrV0 = data.length == 0 ? "" : ("?json=" + encodeURIComponent(JSON.stringify(data)));

    var ParamsDataStrV1 = UniqueParams.length == 0 ? "" : ("?unique=" + encodeURIComponent(JSON.stringify(UniqueParams)));

    //外壳是会考虑还有旧的没换新的外壳的情况
    if (window.top.SkylandCom) {
        data.IsExe = true;
        try {
            data.ShellVer = window.top.SkylandCom.getwordversion();
        } catch (e) {

        }
        if (data.ShellVer == undefined) Url += ParamsDataStrV0;
        if (data.ShellVer == "V1") Url += ParamsDataStrV1;
    } else
        Url += ParamsDataStrV1;



    //
    if (!window.top.WordCallback) window.top.WordCallback = new Object();

    window.top.WordCallback[Url] = data.Callback;


    window.top.SkylandComCloseWin = function (key) {
        var obj = new Object();
        obj["action"] = "CloseWin";
        obj["result"] = true;
        window.top.WordCallback[key](obj);
    }

    if (window.top.SkylandCom) {
        if (data.ShellVer == undefined) window.top.SkylandCom["openword"](Url);
        if (data.ShellVer == "V1") window.top.SkylandCom["openword"](Url, JSON.stringify(data));
        window.top.SkylandComCallback = function (key, str) {
            window.top.WordCallback[key](eval('(' + decodeURIComponent(str) + ')'));
        }
    }
    else {
        //lhgdialog({
        //    content: 'url:' + Url,
        //    zIndex: 9999999,
        //    title: data.Title || '正文',
        //    id: "word",
        //    left: 0,
        //    top: 0,
        //    width: 500,
        //    height: 500,
        //    drag: false,
        //    lock: true,
        //    data: {},
        //    min: false,
        //    max: false,
        //    close: function () {
        //        if (data.IsWarnSave) {
        //            if (confirm("是否保存正文？")) {
        //                this.content.ExecAction("Save", data);
        //            }
        //        }
        //        this.content.$("#WordDiv iframe").hide();
        //        window.top.SkylandComCloseWin(Url);
        //    },
        //    init: function (win) {
        //        if (win.GetObj && win.globalUrlData == undefined) win.Init(data);
        //    }
        //}).max();

        var winIframe;
        var iframe = $('<iframe id="container" src="' + Url + '" style="width: 100%; height: 100%" frameborder="0"></iframe>');
        iframe.load(function () {
            winIframe = iframe[0].contentWindow;
            if (winIframe.GetObj && winIframe.globalUrlData == undefined) winIframe.Init(data);
        });
        var opts = {
            title: data.Title || '正文', height: 3000, width: 2000, button: [], backgroundColor: "#bce8f1",
            closeEvent: function () {
                //alert("关闭");
                if (data.IsWarnSave) {
                    if (confirm("是否保存正文？")) {
                        winIframe.ExecAction("Save", data);
                    }
                }
                winIframe.$("#WordDiv iframe").hide();
                window.top.SkylandComCloseWin(Url);
            }
        };
        var win = $.iwf.showWin(opts);
        var winRoot = win.content();
        winRoot.append(iframe);
    }
}