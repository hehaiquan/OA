$.Biz.AttachmentPage = new function () {
    var root;
    var data;
    var wftool;

    // 显示弹窗
    function showDetail(item, callback) {
        var detailmodel = $.Com.FormModel({});
        var divroot = root;
        if (UIMode != "mouse") {

            var win;
            var dlgOpts = {
                width: 800, height: 1000
            };
            //dlgOpts = $.extend({}, dlgOpts, options);
            var htmlroot = root.find("[data-id='Normal_Attachment']").clone();
            win = $.iwf.showWin(dlgOpts);
            $(htmlroot).appendTo(win.content());
            root.find("[data-id='Normal_Attachment']").hide();
            divroot = $(htmlroot);
            divroot.show();
            // model.show(win.content(), data);
        }

        detailmodel.show(divroot.find("[data-id='Normal_Attachment']"), item);

        //divroot.find("[data-id='save']").unbind();
        //divroot.find("[data-id='save']").bind("click", function () {
        //    var data = detailmodel.getData();
        //    saveData(data);
        //});
    }

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/Sample/AttachmentPage.html", function () {
            InitDealAttachment(root);
        });
    }


    //处理业务的控件
    //处理附件
    function InitDealAttachment(root) {
        var self = root;
        var o = this.options;                                      
        //if (o.showAttachment != true) return;
        self.Attachment = self.find("[data-id=Normal_Attachment]");
        // var GetUserAttachService = "UploadAttachmentsSvc.data?action=GetUserAttach";
        var tmpl = '<div class="name_wrap" style="float: left;margin-right:10px; width: 150px; white-space: nowrap;" action="attachone">'
                        + '<span class="ico ico_${Extension}" title="${Detail}"></span>'
                        + '<span class="title" title="${Detail}">${FileName}</span>'
                        + '<div class="op" action="fileopera">'
                        + '<a href="javascript:void(0)" action="downAttach">下载</a>'
                        + '<a href="javascript:void(0)" action="deleteAttach" style="margin-left: 18px; margin-right: 5px;">删除</a>'
                        + '</div>'
                        + ' <div class="PBprogress" style="box-sizing: content-box;width:100px;" action="fileprogress">'
                               + ' <div class="PBprogressbar" style="" action="bar"></div>'
                        + '</div>'
                    + '</div>';
        var AppFileDivDom = $('<div class="app_file"></div>')
        var inputfileDIV = $('<div><input type="file" name="fileselect[]" multiple="" /></div>');
        inputfileDIV.appendTo(self.Attachment);
        //inputfileDIV.hide();

        //绑定click
        self.find("[data-id='Attachbutton']").bind('click', function () {
            inputfileDIV.find("input").replaceWith('<input type="file" name="fileselect[]" multiple="" />');
            inputfileDIV.find("input").trigger('click');
        });

        function funUploadFile(file, uploadDom) {
            var xhr = new XMLHttpRequest();
            var fileprogressDom = uploadDom.find("[action=fileprogress]").show();
            var fileoperaDom = uploadDom.find("[action=fileopera]").hide();
            uploadDom.fadeIn();
            if (xhr.upload) {
                // 上传中
                xhr.upload.addEventListener("progress", function (e) {
                    var progressbar = fileprogressDom.find('[action = bar]');
                    var percent = (e.loaded / e.total * 100).toFixed(2) + '%'; progressbar.css('width', percent);
                }, false);
                // 文件上传成功或是失败
                xhr.onreadystatechange = function (e) {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            var obj = new Object();
                            var ent;
                            try {
                                ent = eval('(' + xhr.responseText + ')');
                            } catch (e) {
                                fileSize_DIV.text("上传失败");
                                return;
                            }
                            ent.Size = file.size;
                            uploadDom.data("UploadInfo", ent);
                            fileprogressDom.hide();
                            fileoperaDom.show();
                        } else {



                        }
                    }
                };

                // 数据处理
                xhr.open("POST", "/UploadAttachmentsSvc.data?action=UploadFile", true);
                //
                var fd = new FormData(); // html5新增的对象,可以包装字符,二进制信息 
                fd.append(file.name, file);
                xhr.send(fd);
                //
            }
        }
        //绑定事件
        inputfileDIV.delegate("input", "change", function (e) {
            var files = e.target.files || e.dataTransfer.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var obj = new Object();
                obj["FileName"] = file.name;
                obj["Detail"] = "文件名:" + obj["FileName"] + "\r\n" +
                                          "大小:" + formatFileSize(file.size) + "\r\n" +
                                          "上传日期:" + new Date().format("yyyy-MM-dd hh:mm:ss");
                obj["Extension"] = GetFileExtension(obj["FileName"]);
                var html = tmpl.replace$Object(obj);
                var AttachDom = $(html);
                AppFileDivDom.prepend(AttachDom);
                AttachDom.hide();
                funUploadFile(file, AttachDom);
            }
        });
        //
        $.PackResult(GetUserAttachService, self.api, function (lstAttach) {
            //
            $.each(lstAttach, function (index, ent) {
                var obj = new Object();
                obj["FileName"] = ent["FileName"];
                obj["Detail"] = "文件名:" + ent["FileName"] + "\r\n" +
                                        "大小:" + formatFileSize(ent["Size"]) + "\r\n" +
                                        "上传日期:" + ent["UploadDate"];
                obj["Extension"] = GetFileExtension(ent["FileName"]);
                var AttachDom = $(tmpl.replace$Object(obj));
                AppFileDivDom.append(AttachDom);
                AttachDom.data("UploadInfo", ent);
            });
            AppFileDivDom.delegate("[action=downAttach]", "click", function (e) {
                var dom = $(this).parentsUntil("[action=attachone]").last().parent();
                var ent = dom.data("UploadInfo");
                if (ent.Size == 0) { alert("文件未在服务器上找到"); return; }
                var downUrl = "/SkylandAttach.data?action=DownAttach" + "&OLDNAME=" + escape(ent["FileName"]) + "&PATH=" + ent["FilePath"];
                window.location.href = downUrl;
            });
            AppFileDivDom.delegate("[action=deleteAttach]", "click", function (e) {
                e.stopPropagation();
                var dom = $(this).parentsUntil("[action=attachone]").last().parent();
                var ent = dom.data("UploadInfo");
                if (confirm("是否确定删除该附件")) {
                    jQuery.PackResult("/SkylandAttach.data?action=DeleteRemoteAttach", { "ID": ent["AutoID"] }, function () {
                        dom.fadeOut();
                    });
                }
            });
            //
            AppFileDivDom.append('<div style="clear: both"></div>');
            AppFileDivDom.appendTo(self.Attachment);
        });
    };

    



}

$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'Attachments' };

    this.show = function (module, root) {
        $.Biz.AttachmentPage.show(module, root);
    }
});



