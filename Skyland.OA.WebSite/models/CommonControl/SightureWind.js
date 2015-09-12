$.Biz.SightureWindView = function (param, win ) {
    var models = {};
    var self = this;
    var root;
    var SendOut;
    var params = JSON.parse(param);
    this.show = function (module, _root) {
        if (_root.children().length != 0) return;
        root = _root;
        root.load("models/CommonControl/SightureWind.html", function () {
            GetUserId(function (da) {
                loadData();
            });
        });

        function loadData() {

            var opts = {
                WebUrl: params.url,
                RecordID: "1121231212123",
                UserName: "",
                imageDiv: root.find("[data-id='qfImage']"),
                width: "900px",
                height: "400px",
                Enabled: "1",
                PenColor: "#000000",
                ShowPage: "1",
                FieldName: 'SendDoc/qf',
                UserName: 'U0000008',
            };
            var sighture = root.find("[data-id='sighture']");
            var qf_textarea = "<table width='100%' border='0' cellspacing='0' cellpadding='0' align='center' height='100%'>";
            qf_textarea += "<tr>";
            qf_textarea += "<td height='24' width='60' nowrap><font color='red'>&nbsp;请在下方的黑色边框内手写签字</font></td>";
            qf_textarea += "<td>";
            qf_textarea += "<!-- <a class='LinkButton' data-id='SendOutOpenSignature'>[打开签章]</a>-->";
            qf_textarea += "<!--<a class='LinkButton' data-id='SendEditTypeChange'>[文字签批]</a>-->";
            qf_textarea += "</td>";
            qf_textarea += "</tr>";
            qf_textarea += " <tr>";
            qf_textarea += "<td height='70px' colspan='2' style='border-bottom: 1px dashed; border-color: #999999; border-top: 1px dashed; border-color: #999999'>";
            qf_textarea += "<object name='SendOut_" + opts.RecordID + "' classid='clsid:2294689C-9EDF-40BC-86AE-0438112CA439' codebase='iWebRevision.cab#version=6,0,0,0' width='" + opts.width + "' height='" + opts.height + "' z-inde='0' viewastext>";
            qf_textarea += "<param name='WebUrl' data-bind='' value=''>";
            qf_textarea += " <!-- WebUrl:系统服务器路径，与服务器交互操作，如打开签章信息 -->";
            qf_textarea += "<param name='RecordID' value='20100608034902'>";
            qf_textarea += "<!-- RecordID:本文档记录编号 -->";
            qf_textarea += "<param name='FieldName' value='SendOut'>";
            qf_textarea += "<!-- FieldName:签章窗体可以根据实际情况再增加，只需要修改控件属性 FieldName 的值就可以 -->";
            qf_textarea += " <param name='UserName' value='演示人'>";
            qf_textarea += " <!-- UserName:签名用户名称 -->";
            qf_textarea += " <param name='Enabled' value='0'>";
            qf_textarea += "  <!-- Enabled:是否允许修改，0:不允许 1:允许  默认值:1  -->";
            qf_textarea += "<param name='PenColor' value='#0099FF'>";
            qf_textarea += "<!-- PenColor:笔的颜色，采用网页色彩值  默认值:#000000  -->";
            qf_textarea += "<param name='BorderStyle' value='1'>";
            qf_textarea += "<!-- BorderStyle:边框，0:无边框 1:有边框  默认值:1  -->";
            qf_textarea += "<param name='EditType' value='0'>";
            qf_textarea += " <!-- EditType:默认签章类型，0:签名 1:文字  默认值:0  -->";
            qf_textarea += "<param name='ShowPage' value='0'>";
            qf_textarea += "<!-- ShowPage:设置默认显示页面，0:电子印章,1:手写签名,2:文字批注  默认值:0  -->";
            qf_textarea += "<param name='InputText' value=''>";
            qf_textarea += "<!-- InputText:设置署名信息，  为空字符串则默认信息[用户名+时间]内容  -->";
            qf_textarea += " <param name='PenWidth' value='2'>";
            qf_textarea += "<!-- PenWidth:笔的宽度，值:1 2 3 4 5   默认值:2  -->";
            qf_textarea += "<param name='FontSize' value='11'>";
            qf_textarea += "<!-- FontSize:文字大小，默认值:11 -->";
            qf_textarea += "<param name='SignatureType' value='0'>";
            qf_textarea += " <!-- SignatureType:签章来源类型，0表示从服务器数据库中读取签章，1表示从硬件密钥盘中读取签章，2表示从本地读取签章，并与ImageName(本地签章路径)属性相结合使用  默认值:0 -->";
            qf_textarea += "<param name='InputList' value='同意\r\n不同意\r\n请上级批示\r\n请速办理'>";
            qf_textarea += "<!-- InputList:设置文字批注信息列表  -->";
            qf_textarea += "</object>";
            qf_textarea += "</br>";
            qf_textarea += "<button class='btn btn-default' data-id='suchAsFitting_" + opts.RecordID + "' type='button' style='margin-bottom: 30px;'>如拟</button>";
            qf_textarea += "<button class='btn btn-default' data-id='handInput_" + opts.RecordID + "' type='button' style='margin-bottom: 30px; margin-left: 5px;'>手写输入</button>";
            qf_textarea += "<button class='btn btn-default' data-id='printText_" + opts.RecordID + "' type='button' style='margin-bottom: 30px; margin-left: 5px;'>键盘输入</button>";
            qf_textarea += "<button class='btn btn-default' data-id='last_S_" + opts.RecordID + "' type='button' style='margin-bottom: 30px; margin-left: 5px;'>上一笔</button>";
            qf_textarea += "<button class='btn btn-default' data-id='next_S_" + opts.RecordID + "' type='button' style='margin-bottom: 30px; margin-left: 5px;'>下一笔 </button>";
            qf_textarea += "<button class='btn btn-default' data-id='clearAll_" + opts.RecordID + "' type='button' style='margin-bottom: 30px; margin-left: 5px;'>清除所有</button>";
            qf_textarea += "<button class='btn btn-default' data-id='saveSighture_" + opts.RecordID + "' type='button' style='margin-bottom: 30px; margin-left: 5px;' >确定</button>";
            qf_textarea += "<button class='btn btn-default' data-id='close_" + opts.RecordID + "' type='button' style='margin-bottom: 30px; margin-left: 5px;' >关闭</button>";
            qf_textarea += " </td>";
            qf_textarea += "</tr>";
            qf_textarea += " </table>";
            sighture.append(qf_textarea);

            SendOut = $("[name='SendOut_" + opts.RecordID + "']")[0];
            //SendOut.WebUrl =opts.WebUrl; //服务端路径
            ////SendOut.WebUrl = "SightureOperation.data?action=";
            //SendOut.Enabled = opts.Enabled; //可编写状态
            //SendOut.PenColor = opts.PenColor; //颜色黑色
            //SendOut.ShowPage = opts.ShowPage; //默认为手写
            ////SendOut.FieldName = opts.FieldName //表中的字段名
            //SendOut.RecordID = opts.RecordID; //文档编号
            ////SendOut.UserName = opts.UserName;


            SendOut.WebUrl = opts.WebUrl; //服务端路径
            SendOut.Enabled = opts.Enabled; //可编写状态
            SendOut.PenColor = opts.PenColor; //颜色黑色
            SendOut.ShowPage = opts.ShowPage; //默认为手写
            SendOut.FieldName = opts.FieldName //表中的字段名
            SendOut.RecordID = opts.RecordID; //文档编号
            SendOut.UserName = opts.UserName;

            //手写输入
            root.find("[data-id='handInput_" + opts.RecordID + "']").click(function () {
                SendOut.EditType = '0';
            });

            //文字输入
            root.find("[data-id='printText_" + opts.RecordID + "']").click(function () {
                SendOut.EditType = '1';
            });

            //上一笔
            root.find("[data-id='last_S_" + opts.RecordID + "']").click(function () {
                SendOut.Redo();
            });

            //下一笔
            root.find("[data-id='next_S_" + opts.RecordID + "']").click(function () {
                SendOut.Undo();
            });
            //如拟
            root.find("[data-id='suchAsFitting_" + opts.RecordID + "']").click(function () {
                //JS调用代码：
                var mData = "<?xml version='1.0' encoding='utf-8' standalone='yes'?> ";
                mData = mData + "<Text_Data> ";
                mData = mData + "<Line_1> ";
                mData = mData + "<Context>[如拟]</Context> ";
                mData = mData + "<FontName>宋体</FontName>";
                mData = mData + "<FontSize>10</FontSize>";
                mData = mData + "<FontColor>#000000</FontColor> ";
                mData = mData + "<FontBold>True</FontBold >";
                mData = mData + "<TextPos>0,0</TextPos>";
                mData = mData + "<FontCss>";
                mData = mData + "<Font_2>";
                mData = mData + "<Context>[如拟]</Context>";
                mData = mData + "<FontName>宋体</FontName>";
                mData = mData + "<FontSize>12</FontSize>";
                mData = mData + "<FontColor>#000000</FontColor> ";
                mData = mData + "<FontBold>False</FontBold >";
                mData = mData + "</Font_2>";
                mData = mData + "</FontCss>";
                mData = mData + "</Line_1>";
                mData = mData + "</Text_Data>";
                var mResult = SendOut.RunTextSignature(mData);
                if (mResult == 1) {

                } else if (mResult == -1) {
                    alert("未设置特殊字符串");
                } else if (mResult == -2) {
                    alert("特殊字符串设置错误，必须以“[”开始，“]”结束");
                } else if (mResult == -3) {
                    alert("特殊字符串在总的字符串信息中未找到");
                }
            });

            //清除所有
            root.find("[data-id='clearAll_" + opts.RecordID + "']").click(function () {
                SendOut.ClearAll();
            });

            //确定保存
            root.find("[data-id='saveSighture_" + opts.RecordID + "']").click(function () {
                SendOut.SaveSighture();
                win.close();
            });

            root.find("[data-id='close_" + opts.RecordID + "']").click(function () {
                SendOut.SaveSighture();
                win.close();
            });
        }

        function GetUserId(userId) {
            $.fxPost("/FX_UserInfoSvc.data?action=GetUserId", {}, function (res) {
                if (!res.success) {
                    $.Com.showMsg(res.msg);
                    return;
                }
                userId(res.data);
            });
        }
    };
};

//加入放入的文件
$.Biz.SightureWind = function (callback, param) {
    var root = null;

    var opts = {
        title: '手写签批', height: 600, width: 1000
    };
    var win = $.iwf.showWin(opts);
    var model = new $.Biz.SightureWindView(param, win);

    var root = win.content();
    model.show(
        { callback: function (item) { callback(item); win.close(); } },
        root
  );

}