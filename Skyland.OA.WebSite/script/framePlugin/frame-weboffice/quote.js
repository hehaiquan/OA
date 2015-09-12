var global = {
    HostUrl: document.location.protocol + "//" + document.location.host + "/",
    QuoteJS: function (url) { document.write('<script src="' + this.HostUrl + url + '"></script>'); },
    QuoteCSS: function (url) { document.write('<link href="' + this.HostUrl + url + '" rel="stylesheet" />'); }
};
global.QuoteJS("script/jquery/jquery-1.11.3.js");