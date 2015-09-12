using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BizService.Common
{
    public class ComCreatHtml
    {
        /// <summary>
        /// 手写电子签名
        /// </summary>
        /// <param name="caseId">业务流水号</param>
        /// <param name="height">签名面板高度</param>
        /// <param name="width">签名面板宽度</param>
        /// <param name="handWriteHtml">返回 电子签名Html</param>
        /// <param name="handWriteUrl">返回 电子签名服务端路径</param>
        /// <returns>注册电子签名结果 ""-表示成功,否则异常信息</returns>
        public static string HandWriteHtml(string caseId, int height, int width, out string handWriteHtml, out string handWriteUrl)
        {
            //注册电子签名控件
            string rootPath = HttpContext.Current.Server.MapPath("/");
            string result = ComFileOperate.RegisterControl("352FC637-AE88-4CEC-AD99-B9C4B0F75508", rootPath + "bin\\iWebRevision.ocx");

            //生成电子签名面板
            StringBuilder strHtml = new StringBuilder();
            strHtml.Append("<table width='100%' border='0' cellspacing='0' cellpadding='0' align='center' height='100%'>");
            //strHtml.Append("<tr>");
            //strHtml.Append("<td height='24' width='60' nowrap><font color='red'></td>");
            //strHtml.Append("<td>");
            //strHtml.Append("<!--<a class='LinkButton' data-id='SendOutOpenSignature'>[打开签章]</a>-->");
            //strHtml.Append("<!--<a class='LinkButton' data-id='SendEditTypeChange'>[文字签批]</a>-->");
            //strHtml.Append("</td>");
            //strHtml.Append("</tr>");
            strHtml.Append(" <tr>");
            strHtml.Append("<td height='" + height + "px' colspan='2' style='border-bottom: 1px dashed); border-color: #999999); border-top: 1px dashed); border-color: #999999'>");
            strHtml.Append("<object name='SendOut_" + caseId + "' classid='clsid:2294689C-9EDF-40BC-86AE-0438112CA439' codebase='iWebRevision.cab#version=6,0,0,0' width='" + width + "px' height='" + height + "px' z-inde='-1' viewastext>");
            strHtml.Append("<param name='WebUrl' data-bind='' value=''>");
            strHtml.Append(" <!-- WebUrl:系统服务器路径，与服务器交互操作，如打开签章信息 -->");
            strHtml.Append("<param name='RecordID' value='20100608034902'>");
            strHtml.Append("<!-- RecordID:本文档记录编号 -->");
            strHtml.Append("<param name='FieldName' value='SendOut'>");
            strHtml.Append("<!-- FieldName:签章窗体可以根据实际情况再增加，只需要修改控件属性 FieldName 的值就可以 -->");
            strHtml.Append(" <param name='UserName' value='演示人'>");
            strHtml.Append(" <!-- UserName:签名用户名称 -->");
            strHtml.Append(" <param name='Enabled' value='0'>");
            strHtml.Append("  <!-- Enabled:是否允许修改，0:不允许 1:允许  默认值:1  -->");
            strHtml.Append("<param name='PenColor' value='#0099FF'>");
            strHtml.Append("<!-- PenColor:笔的颜色，采用网页色彩值  默认值:#000000  -->");
            strHtml.Append("<param name='BorderStyle' value='1'>");
            strHtml.Append("<!-- BorderStyle:边框，0:无边框 1:有边框  默认值:1  -->");
            strHtml.Append("<param name='EditType' value='0'>");
            strHtml.Append(" <!-- EditType:默认签章类型，0:签名 1:文字  默认值:0  -->");
            strHtml.Append("<param name='ShowPage' value='0'>");
            strHtml.Append("<!-- ShowPage:设置默认显示页面，0:电子印章,1:手写签名,2:文字批注  默认值:0  -->");
            strHtml.Append("<param name='InputText' value=''>");
            strHtml.Append("<!-- InputText:设置署名信息，  为空字符串则默认信息[用户名+时间]内容  -->");
            strHtml.Append(" <param name='PenWidth' value='2'>");
            strHtml.Append("<!-- PenWidth:笔的宽度，值:1 2 3 4 5   默认值:2  -->");
            strHtml.Append("<param name='FontSize' value='11'>");
            strHtml.Append("<!-- FontSize:文字大小，默认值:11 -->");
            strHtml.Append("<param name='SignatureType' value='0'>");
            strHtml.Append(" <!-- SignatureType:签章来源类型，0表示从服务器数据库中读取签章，1表示从硬件密钥盘中读取签章，2表示从本地读取签章，并与ImageName(本地签章路径)属性相结合使用  默认值:0 -->");
            strHtml.Append("<param name='InputList' value='同意\r\n不同意\r\n请上级批示\r\n请速办理'>");
            strHtml.Append("<!-- InputList:设置文字批注信息列表  -->");
            strHtml.Append("</object>");
            strHtml.Append(" </td>");
            strHtml.Append("</tr>");
            strHtml.Append(" </table>");
            handWriteHtml = strHtml.ToString();

            //电子签名路径
            string server = HttpContext.Current.Request.ServerVariables["HTTP_HOST"];
            handWriteUrl = "http://" + server + "/Forms/ComAspxPage/HandWrite.ashx";

            return result;
        }
    }
}
