<%@ WebHandler Language="C#" Class="Word_Operation" %>

using System;
using System.Web;
using DBstep;
using System.IO;
using System.Web.UI;
using Newtonsoft.Json;
using System.Text;

public class Word_Operation : Page
{
    private iMsgServer2000 MsgObj = new iMsgServer2000();
    private string mOption;

    private string ServerRoot = System.AppDomain.CurrentDomain.SetupInformation.ApplicationBase;
    protected void Page_Load(object sender, EventArgs e)
    {
        //相对模板路径
        string relativePath = string.IsNullOrEmpty(Request["relativeRootPath"]) ? null : Request["relativeRootPath"];
        //直接文件路径
        string severFilePath = string.IsNullOrEmpty(Request["severFilePath"]) ? null : Request["severFilePath"];
        //
        string saveFilePath = string.IsNullOrEmpty(Request["saveFilePath"]) ? null : Request["saveFilePath"];

        string mainBodyPath = string.IsNullOrEmpty(Request["MainBodyPath"]) ? null : Request["MainBodyPath"];

        string markName = string.IsNullOrEmpty(Request["MarkName"]) ? null : Request["MarkName"];

        string Save_fullPath = "";
        //假如保存路径文件存在说明是打开方式,否则是新建方式
        string Open_fullPath = "";
        //一下是逻辑处理Open_fullPath和Save_fullPath 
        if (!String.IsNullOrEmpty(severFilePath))
        {
            Save_fullPath = Open_fullPath = severFilePath;
        }
        else if (!String.IsNullOrEmpty(relativePath))
        {
            Save_fullPath = Open_fullPath = Path.Combine(ServerRoot, relativePath);
        }
        else
        {

        }

        if (!String.IsNullOrEmpty(saveFilePath)) Save_fullPath = saveFilePath;

        string LOADFILE_Error = "";
        string SAVEFILE_Error = "";

        if (!File.Exists(Open_fullPath)) LOADFILE_Error = "打开文件路径不存在";
        if (!File.Exists(Save_fullPath)) SAVEFILE_Error = "保存文件路径不存在";

        if (Path.GetExtension(Save_fullPath) == ".xlsx") Save_fullPath = Path.ChangeExtension(Save_fullPath, ".xls");


        MsgObj.Load(Request);
        //判断是否是合法的信息包，或者数据包信息是否完整
        if (MsgObj.GetMsgByName("DBSTEP").Equals("DBSTEP"))
        {
            mOption = MsgObj.GetMsgByName("OPTION");
            if (mOption.Equals("LOADFILE"))
            {
                if (MsgObj.MsgFileLoad(Open_fullPath))			//从文件夹调入文档
                {
                    MsgObj.SetMsgByName("STATUS", "打开成功!.");		                          //设置状态信息
                    MsgObj.MsgError("");		                                                  //清除错误信息
                }
                else
                {
                    MsgObj.MsgError("打开失败!" + LOADFILE_Error);		                                          //设置错误信息
                }
            }
            //保存客户端上传的文档
            else if (mOption.Equals("SAVEFILE"))
            {
                MsgObj.MsgTextClear();                                                              //清除文本信息
                if (MsgObj.MsgFileSave(Save_fullPath))
                {						      //保存文档内容到文件夹中
                    MsgObj.SetMsgByName("STATUS", "保存成功!");	                                  //设置状态信息
                    MsgObj.MsgError("");  //清除错误信息
                }
                else
                {
                    MsgObj.MsgError("保存失败!" + SAVEFILE_Error);		                                          //设置错误信息
                }
                MsgObj.MsgFileClear();
            }
            else if (mOption.Equals("SAVEASHTML"))
            {
                MsgObj.MsgFileSave(Path.ChangeExtension(Save_fullPath, ".html"));
            }
            else if (mOption.Equals("SAVESIGNATURE"))//保存签章信息
            {



            }
            else if (mOption.Equals("INSERTFILE"))
            {
                if (!string.IsNullOrEmpty(mainBodyPath))
                {
                    string path = mainBodyPath;
                    //FileStream fileStream = File.Open(@"D:\text.docx", FileMode.OpenOrCreate);
                    FileStream stream = new FileInfo(path).OpenRead();
                    byte[] buffer = new byte[stream.Length];
                    stream.Read(buffer, 0, Convert.ToInt32(stream.Length));
                    MsgObj.MsgFileBody(buffer);
                    //将文件信息打包
                    MsgObj.SetMsgByName("POSITION", "mainBody");		//设置插入书签的位置
                    MsgObj.SetMsgByName("STATUS", "插入文件成功!");	//设置状态信息
                    MsgObj.MsgError("");
                }
            }
        }
        MsgObj.Send(Response);
    }
}