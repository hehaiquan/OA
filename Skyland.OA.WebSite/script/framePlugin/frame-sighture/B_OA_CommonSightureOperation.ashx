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
/// ��дǩ�����������
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

    //����
    public string tableName;
    //����
    public string columnsName;

    protected void Page_Load(object sender, EventArgs e)
    {
        MsgObj = new DBstep.iMsgServer2000();
        mFilePath = Server.MapPath(".");
        MsgObj.MsgVariant(Request.BinaryRead(Request.ContentLength));     //��ȡ�ͻ��˷����������ݰ�
        if (MsgObj.GetMsgByName("DBSTEP").Equals("DBSTEP"))               //���ͻ��˴��ݵ����ݰ���ʽ
        {
            mOption = MsgObj.GetMsgByName("OPTION");                        //ȡ�ò�������
            if (mOption.Equals("SIGNATRUELIST"))                           //����Ĵ���Ϊ����ӡ���б�
            {
                MsgObj.MsgTextClear();                                    //���SetMsgByName���õ�ֵ
                if (SignatureList())                                      //����ӡ���б�
                {
                    MsgObj.SetMsgByName("SIGNATRUELIST", mMarkList);       //����ӡ���б��ַ���
                    MsgObj.MsgError("");				                  //���������Ϣ
                }
                else
                {
                    MsgObj.MsgError("����ӡ���б�ʧ��!");		          //���ô�����Ϣ
                }
            }

            if (mOption.Equals("SIGNATRUEIMAGE"))                         //����Ĵ���Ϊ����ӡ��ͼ��
            {
                mMarkName = MsgObj.GetMsgByName("IMAGENAME");	             //ȡ��ӡ������
                mUserName = MsgObj.GetMsgByName("USERNAME");		         //ȡ���û���
                mPassword = MsgObj.GetMsgByName("PASSWORD");		         //ȡ��ӡ������
                mFileType = ".jpg";                                        //Ĭ��Ϊ.jpg����
                MsgObj.MsgTextClear();                                   //���SetMsgByName���õ�ֵ
                if (SignatureImage(mMarkName, mPassword)) 	             //����ӡ��
                {
                    MsgObj.SetMsgByName("IMAGETYPE", mFileType);         //����ͼƬ����
                    MsgObj.MsgFileBody(mFileBody);			            //��ǩ��������Ϣ���
                    MsgObj.SetMsgByName("STATUS", "�򿪳ɹ�!");  	    //����״̬��Ϣ
                    MsgObj.MsgError("");				                //���������Ϣ
                }
                else
                {
                    MsgObj.MsgError("ǩ�����������!");		            //���ô�����Ϣ
                }
            }

            if (mOption.Equals("SAVESIGNATURE"))                         //����Ĵ���Ϊ����ӡ������
            {

                mRecordID = MsgObj.GetMsgByName("RECORDID");		        //ȡ���ĵ����
                mFieldName = MsgObj.GetMsgByName("FIELDNAME");		    //ȡ��ǩ���ֶ�����
                mFieldValue = MsgObj.GetMsgByName("FIELDVALUE");	        //ȡ��ǩ����������
                mUserName = MsgObj.GetMsgByName("USERNAME");		        //ȡ���û�����
                if (mUserName != "")
                {
                    //mDateTime = MsgObj.GetMsgByName("DATETIME");		        //ȡ��ǩ������ʱ��
                    //mHostName = Request.UserHostAddress;                      //ȡ�ÿͻ���IP
                    MsgObj.MsgTextClear();
                    string msg = SaveSighture(mFieldName);
                    if (msg != "")
                    {
                        MsgObj.MsgError(msg);
                        MsgObj.SetMsgByName("STATUS", "����ʧ��");	//����״̬��Ϣ
                    }
                }
            }


            if (mOption.Equals("LOADSIGNATURE"))                        //����Ĵ���Ϊ����ǩ������
            {
                mRecordID = MsgObj.GetMsgByName("RECORDID");		       //ȡ���ĵ����
                mFieldName = MsgObj.GetMsgByName("FIELDNAME");		   //ȡ��ǩ���ֶ�����

                mUserName = MsgObj.GetMsgByName("USERNAME");		       //ȡ���û�����
                MsgObj.MsgTextClear();                                 //���SetMsgByName���õ�ֵ
                if (LoadSignature()) 		        	               //����ǩ��������Ϣ
                {
                    MsgObj.SetMsgByName("FIELDVALUE", mFieldValue);     //����ǩ������
                    MsgObj.SetMsgByName("STATUS", "����ɹ�!");  	   //����״̬��Ϣ
                    MsgObj.MsgError("");				               //���������Ϣ
                }
                else
                {
                    MsgObj.MsgError("�����ǩʧ��!");		           //���ô�����Ϣ
                }
            }


            if (mOption.Equals("SAVEHISTORY"))                         //����Ĵ���Ϊ����ӡ����ʷ��Ϣ
            {
                mRecordID = MsgObj.GetMsgByName("RECORDID");		      //ȡ���ĵ����
                mFieldName = MsgObj.GetMsgByName("FIELDNAME");	      //ȡ��ǩ���ֶ�����
                mMarkName = MsgObj.GetMsgByName("MARKNAME");		      //ȡ��ǩ������
                mUserName = MsgObj.GetMsgByName("USERNAME");		      //ȡ���û�����
                mDateTime = MsgObj.GetMsgByName("DATETIME");		      //ȡ��ǩ������ʱ��
                mHostName = Request.UserHostAddress;                   //ȡ�ÿͻ���IP
                mMarkGuid = MsgObj.GetMsgByName("MARKGUID");            //ȡ�����к�
                MsgObj.MsgTextClear();
                if (SaveHistory()) 		        	                  //����ӡ����ʷ��Ϣ
                {
                    MsgObj.SetMsgByName("MARKNAME", mMarkName);        //��ǩ�������б���
                    MsgObj.SetMsgByName("USERNAME", mUserName);        //���û����б���
                    MsgObj.SetMsgByName("DATETIME", mDateTime);        //��ǩ�������б���
                    MsgObj.SetMsgByName("HOSTNAME", mHostName);        //���ͻ���IP�б���
                    MsgObj.SetMsgByName("MARKGUID", mMarkGuid);        //�����к��б���
                    MsgObj.SetMsgByName("STATUS", "����ӡ����־�ɹ�!");//����״̬��Ϣ
                    MsgObj.MsgError("");				              //���������Ϣ
                }
                else
                {
                    MsgObj.MsgError("����ӡ����־ʧ��!");		      //���ô�����Ϣ
                }
            }

            if (mOption.Equals("SHOWHISTORY"))                         //����Ĵ���Ϊ��ǩ����ʷ��Ϣ
            {
                mRecordID = MsgObj.GetMsgByName("RECORDID");		      //ȡ���ĵ����
                mFieldName = MsgObj.GetMsgByName("FIELDNAME");		  //ȡ��ǩ���ֶ�����
                mUserName = MsgObj.GetMsgByName("USERNAME");		      //ȡ���û���
                MsgObj.MsgTextClear();                                //���SetMsgByName���õ�ֵ
                if (ShowHistory()) 		        	              //����ӡ����ʷ��Ϣ
                {
                    MsgObj.SetMsgByName("MARKNAME", mMarkName);		  //��ǩ�������б���
                    MsgObj.SetMsgByName("USERNAME", mUserName);		  //���û����б���
                    MsgObj.SetMsgByName("DATETIME", mDateTime);		  //��ǩ�������б���
                    MsgObj.SetMsgByName("HOSTNAME", mHostName);		  //���ͻ���IP�б���
                    MsgObj.SetMsgByName("MARKGUID", mMarkGuid);        //�����к��б���
                    MsgObj.SetMsgByName("STATUS", "����ӡ����־�ɹ�"); //����״̬��Ϣ
                    MsgObj.MsgError("");
                    //���������Ϣ
                }
                else
                {
                    MsgObj.SetMsgByName("STATUS", "����ӡ����־ʧ��");	//����״̬��Ϣ
                    MsgObj.MsgError("����ӡ����־ʧ��");		        //���ô�����Ϣ
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
                    mInfo = "���������յ��ͻ��˴�������Ϣ����" + mInfo + "��\r\n";
                    //��Ϸ��ظ��ͻ��˵���Ϣ
                    mInfo = mInfo + "�������˷��ص�ǰ������ʱ�䣺" + DateTime.Now;
                    MsgObj.SetMsgByName("RETURNINFO", mInfo);					//�����ص���Ϣ���õ���Ϣ����
                }

            }
        }
        else
        {
            MsgObj.MsgError("�ͻ��˷������ݰ�����!");
            MsgObj.MsgTextClear();
            MsgObj.MsgFileClear();
        }
        Response.BinaryWrite(MsgObj.MsgVariant());
    }

    //����ǩ��ͼ��
    public bool SignatureImage(string vMarkName, string vPassWord)
    {

        return true;
    }

    //ȡ��ǩ���б�
    public bool SignatureList()
    {

        return true;
    }

    //�ж�ǩ��������Ϣ�Ƿ����
    public bool ShowSignatureIS()
    {
        bool Result = false;
        return (Result);
    }


    //����ǩ��
    public bool UpdateSignature()
    {
        bool Result = false;
        return (Result);
    }

    //����ӡ����Ϣ
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
    /// ɾ��ǩ�����ж�Ӧ�ļ����ļ���
    /// </summary>
    /// <param name="caseid"></param>
    /// <param name="tableName">����</param>
    /// <param name="columnName">����</param>
    /// <param name="type">����</param>
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
                //ɾ����Ӧ�ļ�
                string path = list_sightrue[i].path;
                //ɾ����Ӧ�ļ�
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

    //�г����а汾��Ϣ
    public bool ShowHistory()
    {
        bool Result = true;

        return (Result);
    }
}