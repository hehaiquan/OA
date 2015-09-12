<%@ WebHandler Language="C#" Class="B_OA_CommonSightureOperation" %>

using System;
using System.Web;
using DBstep;
using System.IO;
using System.Web.UI;
using Newtonsoft.Json;
using System.Text;
using IWorkFlow.Host;
using System.Data;
using IWorkFlow.ORM;
using System.Collections.Generic;

/// <summary>
/// 手写签批公共服务端
/// </summary>
public class B_OA_CommonSightureOperation : Page
{

    public int mFileSize;
    public byte[] mFileBody;
    public string mFileType;
    public string mRecordID;
    public string mFieldName;
    public string mFieldValue;
    public string mDateTime;
    public string mOption;
    public string mMarkName;
    public string mPassword;
    public string mMarkList;
    public string mBookmark;
    public string mDescript;
    public string mHostName;
    public string mMarkGuid;
    public string mUserName;
    public string mFilePath;
    public string Sql;
    public string mCommand;
    public string mInfo;
    public string rootPath;
    public DBstep.iMsgServer2000 MsgObj;

    //表名
    public string tableName;
    //列名
    public string columnsName;

    protected void Page_Load(object sender, EventArgs e)
    {
        MsgObj = new DBstep.iMsgServer2000();
        mFilePath = Server.MapPath(".");
        MsgObj.MsgVariant(Request.BinaryRead(Request.ContentLength));     //读取客户端发送来的数据包
        if (MsgObj.GetMsgByName("DBSTEP").Equals("DBSTEP"))               //检测客户端传递的数据包格式
        {
            mOption = MsgObj.GetMsgByName("OPTION");                        //取得操作类型
            if (mOption.Equals("SIGNATRUELIST"))                           //下面的代码为创建印章列表
            {
                MsgObj.MsgTextClear();                                    //清除SetMsgByName设置的值
                if (SignatureList())                                      //调入印章列表
                {
                    MsgObj.SetMsgByName("SIGNATRUELIST", mMarkList);       //设置印章列表字符串
                    MsgObj.MsgError("");				                  //清除错误信息
                }
                else
                {
                    MsgObj.MsgError("创建印章列表失败!");		          //设置错误信息
                }
            }

            if (mOption.Equals("SIGNATRUEIMAGE"))                         //下面的代码为调入印章图案
            {
                mMarkName = MsgObj.GetMsgByName("IMAGENAME");	             //取得印章名称
                mUserName = MsgObj.GetMsgByName("USERNAME");		         //取得用户名
                mPassword = MsgObj.GetMsgByName("PASSWORD");		         //取得印章密码
                mFileType = ".jpg";                                        //默认为.jpg类型
                MsgObj.MsgTextClear();                                   //清除SetMsgByName设置的值
                if (SignatureImage(mMarkName, mPassword)) 	             //调入印章
                {
                    MsgObj.SetMsgByName("IMAGETYPE", mFileType);         //设置图片类型
                    MsgObj.MsgFileBody(mFileBody);			            //将签章数据信息打包
                    MsgObj.SetMsgByName("STATUS", "打开成功!");  	    //设置状态信息
                    MsgObj.MsgError("");				                //清除错误信息
                }
                else
                {
                    MsgObj.MsgError("签名或密码错误!");		            //设置错误信息
                }
            }

            if (mOption.Equals("SAVESIGNATURE"))                         //下面的代码为保存印章数据
            {

                mRecordID = MsgObj.GetMsgByName("RECORDID");		        //取得文档编号
                mFieldName = MsgObj.GetMsgByName("FIELDNAME");		    //取得签章字段名称
                mFieldValue = MsgObj.GetMsgByName("FIELDVALUE");	        //取得签章数据内容
                mUserName = MsgObj.GetMsgByName("USERNAME");		        //取得用户名称
                if (mUserName != "")
                {
                    //mDateTime = MsgObj.GetMsgByName("DATETIME");		        //取得签章日期时间
                    //mHostName = Request.UserHostAddress;                      //取得客户端IP
                    MsgObj.MsgTextClear();
                    string msg = SaveSighture(mFieldName);
                    if (msg != "")
                    {
                        MsgObj.MsgError(msg);
                        MsgObj.SetMsgByName("STATUS", "保存失败");	//设置状态信息
                    }
                }
            }


            if (mOption.Equals("LOADSIGNATURE"))                        //下面的代码为调入签章数据
            {
                mRecordID = MsgObj.GetMsgByName("RECORDID");		       //取得文档编号
                mFieldName = MsgObj.GetMsgByName("FIELDNAME");		   //取得签章字段名称

                mUserName = MsgObj.GetMsgByName("USERNAME");		       //取得用户名称
                MsgObj.MsgTextClear();                                 //清除SetMsgByName设置的值
                if (LoadSignature()) 		        	               //调入签章数据信息
                {
                    MsgObj.SetMsgByName("FIELDVALUE", mFieldValue);     //设置签章数据
                    MsgObj.SetMsgByName("STATUS", "调入成功!");  	   //设置状态信息
                    MsgObj.MsgError("");				               //清除错误信息
                }
                else
                {
                    MsgObj.MsgError("调入标签失败!");		           //设置错误信息
                }
            }


            if (mOption.Equals("SAVEHISTORY"))                         //下面的代码为保存印章历史信息
            {
                mRecordID = MsgObj.GetMsgByName("RECORDID");		      //取得文档编号
                mFieldName = MsgObj.GetMsgByName("FIELDNAME");	      //取得签章字段名称
                mMarkName = MsgObj.GetMsgByName("MARKNAME");		      //取得签章名称
                mUserName = MsgObj.GetMsgByName("USERNAME");		      //取得用户名称
                mDateTime = MsgObj.GetMsgByName("DATETIME");		      //取得签章日期时间
                mHostName = Request.UserHostAddress;                   //取得客户端IP
                mMarkGuid = MsgObj.GetMsgByName("MARKGUID");            //取得序列号
                MsgObj.MsgTextClear();
                if (SaveHistory()) 		        	                  //保存印章历史信息
                {
                    MsgObj.SetMsgByName("MARKNAME", mMarkName);        //将签章名称列表打包
                    MsgObj.SetMsgByName("USERNAME", mUserName);        //将用户名列表打包
                    MsgObj.SetMsgByName("DATETIME", mDateTime);        //将签章日期列表打包
                    MsgObj.SetMsgByName("HOSTNAME", mHostName);        //将客户端IP列表打包
                    MsgObj.SetMsgByName("MARKGUID", mMarkGuid);        //将序列号列表打包
                    MsgObj.SetMsgByName("STATUS", "保存印章日志成功!");//设置状态信息
                    MsgObj.MsgError("");				              //清除错误信息
                }
                else
                {
                    MsgObj.MsgError("保存印章日志失败!");		      //设置错误信息
                }
            }

            if (mOption.Equals("SHOWHISTORY"))                         //下面的代码为打开签章历史信息
            {
                mRecordID = MsgObj.GetMsgByName("RECORDID");		      //取得文档编号
                mFieldName = MsgObj.GetMsgByName("FIELDNAME");		  //取得签章字段名称
                mUserName = MsgObj.GetMsgByName("USERNAME");		      //取得用户名
                MsgObj.MsgTextClear();                                //清除SetMsgByName设置的值
                if (ShowHistory()) 		        	              //调入印章历史信息
                {
                    MsgObj.SetMsgByName("MARKNAME", mMarkName);		  //将签章名称列表打包
                    MsgObj.SetMsgByName("USERNAME", mUserName);		  //将用户名列表打包
                    MsgObj.SetMsgByName("DATETIME", mDateTime);		  //将签章日期列表打包
                    MsgObj.SetMsgByName("HOSTNAME", mHostName);		  //将客户端IP列表打包
                    MsgObj.SetMsgByName("MARKGUID", mMarkGuid);        //将序列号列表打包
                    MsgObj.SetMsgByName("STATUS", "调入印章日志成功"); //设置状态信息
                    MsgObj.MsgError("");
                    //清除错误信息
                }
                else
                {
                    MsgObj.SetMsgByName("STATUS", "调入印章日志失败");	//设置状态信息
                    MsgObj.MsgError("调入印章日志失败");		        //设置错误信息
                }
            }

            if (mOption.Equals("SENDMESSAGE"))
            {
                mCommand = MsgObj.GetMsgByName("COMMAND");
                mInfo = MsgObj.GetMsgByName("TESTINFO");
                MsgObj.MsgTextClear();
                MsgObj.MsgFileClear();
                if (mCommand.Equals("SELFINFO"))
                {
                    mInfo = "服务器端收到客户端传来的信息：“" + mInfo + "”\r\n";
                    //组合返回给客户端的信息
                    mInfo = mInfo + "服务器端发回当前服务器时间：" + DateTime.Now;
                    MsgObj.SetMsgByName("RETURNINFO", mInfo);					//将返回的信息设置到信息包中
                }

            }
        }
        else
        {
            MsgObj.MsgError("客户端发送数据包错误!");
            MsgObj.MsgTextClear();
            MsgObj.MsgFileClear();
        }
        Response.BinaryWrite(MsgObj.MsgVariant());
    }

    //调入签章图案
    public bool SignatureImage(string vMarkName, string vPassWord)
    {

        return true;
    }

    //取得签名列表
    public bool SignatureList()
    {

        return true;
    }

    //判断签章数据信息是否存在
    public bool ShowSignatureIS()
    {
        bool Result = false;
        return (Result);
    }


    //保存签名
    public bool UpdateSignature()
    {
        bool Result = false;
        return (Result);
    }

    //保存印章信息
    public bool SaveSignature()
    {
        IDbTransaction tran = Utility.Database.BeginDbTransaction();
        try
        {
            B_OA_SendDoc sendDoc = new B_OA_SendDoc();
            sendDoc.Condition.Add("caseid = " + mRecordID);
            sendDoc = Utility.Database.QueryObject<B_OA_SendDoc>(sendDoc, tran);
            sendDoc.qf = mFieldValue;
            sendDoc.Condition.Add("caseid = " + mRecordID);
            Utility.Database.Update(sendDoc, tran);
            Utility.Database.Commit(tran);
            return true;
        }
        catch (Exception e)
        {
            Utility.Database.Rollback(tran);
            return false;
        }
    }

    public bool WebSaveImage()
    {
        return true;
    }


    public bool LoadSignature()
    {
        IDbTransaction tran = Utility.Database.BeginDbTransaction();
        try
        {
            StringBuilder strSql = new StringBuilder();
            strSql.AppendFormat(@"select * from B_OA_Sighture where caseid='{0}' and tableName='{1}' and columnName = '{2}' and type='{3}'", mRecordID, "SendDoc", "qf", "0");
            DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
            string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
            List<B_OA_Sighture> list_sightrue = (List<B_OA_Sighture>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_Sighture>));
            if (list_sightrue.Count > 0)
            {
                B_OA_Sighture sighture = new B_OA_Sighture();
                sighture = list_sightrue[0];
                mFieldValue = sighture.fieldValue;
            }
            Utility.Database.Commit(tran);
            return true;
        }
        catch (Exception e)
        {
            Utility.Database.Rollback(tran);
            return false;
        }
    }

    /// <summary>
    /// 删除签名表中对应文件和文件夹
    /// </summary>
    /// <param name="caseid"></param>
    /// <param name="tableName">表名</param>
    /// <param name="columnName">列名</param>
    /// <param name="type">类型</param>
    /// <returns></returns>
    public bool DeleteSendDoc(string caseid, string tableName, string columnName, string userid, IDbTransaction tran)
    {
        StringBuilder strSql = new StringBuilder();
        strSql.AppendFormat(@"select * from B_OA_Sighture where caseid='{0}' and tableName='{1}' and columnName = '{2}' and userid='{3}'", caseid, tableName, columnName, userid);
        DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
        string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
        List<B_OA_Sighture> list_sightrue = (List<B_OA_Sighture>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_Sighture>));
        if (list_sightrue.Count > 0)
        {
            for (int i = 0; i < list_sightrue.Count; i++)
            {
                B_OA_Sighture sightrue = new B_OA_Sighture();
                //删除对应文件
                string path = list_sightrue[i].path;
                //删除对应文件
                BizService.Common.ComFileOperate.DeleteAttachment(path);
                sightrue.Condition.Add("id = " + list_sightrue[i].id);
                Utility.Database.Delete(sightrue, tran);
            }
        }
        return true;
    }

    public string SaveSighture(string savePath)
    {
        IDbTransaction tran = Utility.Database.BeginDbTransaction();
        try
        {
            savePath = HttpUtility.UrlDecode(savePath);
            MsgObj.MsgFileSave(savePath);
            return "";
        }
        catch (Exception e)
        {
            Utility.Database.Rollback(tran);
            return e.ToString();
        }
    }

    public bool SaveHistory()
    {
        bool Result = true;
        return (Result);
    }

    //列出所有版本信息
    public bool ShowHistory()
    {
        bool Result = true;

        return (Result);
    }
}