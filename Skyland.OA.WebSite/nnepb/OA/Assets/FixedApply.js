define(function () {
    return function () {
        this.options = {
            HtmlPath: "nnepb/OA/Assets/FixedApply.html",
            Url: "B_OA_FixedApplySvc.data"
        };
        this.show = function(formdiv, formdata, wftool) {
            if (formdiv) root = formdiv;
            data = formdata;
            var caseid = wftool.wfcase.caseid;
            var wactid = wftool.wfcase.actid;
        }
    }
})