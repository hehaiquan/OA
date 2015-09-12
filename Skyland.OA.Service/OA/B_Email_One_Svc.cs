using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BizService.Services;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using BizService.Common;
using System.Web;

namespace BizService.B_Email_One_Svc
{
    public class B_Email_One_Svc : BaseDataHandler
    {
        //        string FieldList = @"CONVERT(VARCHAR(20),Mail_CreateData,120) as Mail_CreateData,CONVERT(VARCHAR(20),Mail_SendDate,120) as Mail_SendDate,(CASE WHEN Mail_IsSee='1' then '已读' else '未读' end) as isSeeName,
        //            CONVERT(VARCHAR(20),emailRecieveDate,120) as emailRecieveDate,CONVERT(VARCHAR(20),mailDeleteDate,120) as mailDeleteDate,  
        //            ID,Mail_ID,Mail_Title,Mail_SendText,Mail_SendPersonId,Mail_SendPersonName, Mail_ReceivePersonId,Mail_ReceivePersonName,
        //                      Mail_Deleted,Mail_deletedPerson,Mail_Type,Mail_IsSee,MailDocumentType,Mail_SendAttachment,isSaveSendBox,
        //                isImportant,isReadReceipt,haveAttachment,CCId,CCName,CCSecretId,CCSecretIdName,isCollection,isHaveCC,isHaveSecretCC,haveReply,markName,markId,markColor,hasChangeEmail,whosEmailId";

        string FieldList = @" CONVERT(VARCHAR(20),a.Mail_CreateData,120) as Mail_CreateData,CONVERT(VARCHAR(20),a.Mail_SendDate,120) as Mail_SendDate,
            (CASE WHEN a.Mail_IsSee='1' then '已读' else '未读' end) as isSeeName,
            CONVERT(VARCHAR(20),a.emailRecieveDate,120) as emailRecieveDate,CONVERT(VARCHAR(20),a.mailDeleteDate,120) as mailDeleteDate,  
            a.ID,a.Mail_ID,a.Mail_Title,a.Mail_SendText,a.Mail_SendPersonId,a.Mail_SendPersonName,a.Mail_ReceivePersonId,a.Mail_ReceivePersonName,
            a.Mail_Deleted,a.Mail_deletedPerson,a.Mail_Type,a.Mail_IsSee,a.MailDocumentType,a.Mail_SendAttachment,a.isSaveSendBox,
            a.isImportant,a.isReadReceipt,a.haveAttachment,a.CCId,a.CCName,a.CCSecretId,a.CCSecretIdName,a.isCollection,a.isHaveCC,
            a.isHaveSecretCC,a.haveReply,a.markName,a.markId,a.markColor,a.hasChangeEmail,a.whosEmailId";

        /// <summary>
        /// 初始化邮件
        /// </summary>
        /// <param name="userid">用户ID，系统会自动传入</param>
        /// <returns>反回json结果</returns>
        //[DataAction("InitMail", "emailstate", "userid")]
        //public string InitMail(string emailstate, string userid)
        //{
        //    var tran = Utility.Database.BeginDbTransaction();
        //    var data = new B_EmailSvc.GetDataModel();
        //    try
        //    {
        //        StringBuilder sql = new StringBuilder();
        //        sql.AppendFormat("select {0} from B_Email where ", FieldList);
        //        if (emailstate == "ManuscriptEmail") sql.Append(" Mail_Deleted=0 and Mail_SendPersonId='{0}' and Mail_Type='0' and Mail_SendDate is null");//如果是草稿
        //        if (emailstate == "ReceiveEmail") sql.Append(" Mail_Deleted=0 and Mail_ReceivePersonId='{0}' and Mail_Type='1' and MailDocumentType = 'shoujian'");//如果是收件箱
        //        if (emailstate == "SendEmail") sql.Append(" Mail_Deleted=0 and Mail_SendPersonId='{0}' and Mail_Type='0' and isnull(Mail_SendDate,'')<>'' ");//如果是已发送箱
        //        if (emailstate == "RemoveEmail") sql.Append(" (Mail_ReceivePersonId='{0}' or Mail_SendPersonId='" + userid + "') and Mail_Deleted='1' "); else sql.Append(" and Mail_Deleted='0' ");//如果是删除箱
        //        sql.Append(" order by Mail_SendDate desc ");
        //        string sqlStr = string.Format(sql.ToString(), userid);
        //        DataSet MailDataSet = Utility.Database.ExcuteDataSet(sqlStr, tran);
        //        Utility.Database.Commit(tran);
        //        string jsonData = JsonConvert.SerializeObject(MailDataSet.Tables[0]);
        //        data.dataList = (List<B_Email>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_Email>));
        //        data.dataEdit = new B_Email();
        //        return Utility.JsonResult(true, "数据加载成功", data);//将对象转为json字符串并返回到客户端
        //    }
        //    catch (Exception e)
        //    {
        //        Utility.Database.Rollback(tran);
        //        return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
        //    }
        //}

        /// <summary>
        /// 收件箱初始化 读取收件
        /// </summary>
        /// <param name="userid">用户ID</param>
        /// <returns></returns>
        [DataAction("GetEmailInboxInit", "userid")]
        public string GetEmailInboxInit(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            var data = new B_Email_One_Svc.GetDataModel();
            try
            {
                StringBuilder sqlStr = new StringBuilder();
                sqlStr.AppendFormat(@"select {0} from B_Email a where Mail_Deleted=0 and
                    whosEmailId='{1}' and  MailDocumentType = 'shoujian' order by emailRecieveDate desc", FieldList, userid);
                DataSet MailDataSet = Utility.Database.ExcuteDataSet(sqlStr.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(MailDataSet.Tables[0]);
                data.dataList = (List<B_Email>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_Email>));
                data.dataEdit = new B_Email();
                data.dataCount = new CounntModel();
                data.dataCount = GetUnReadCount(userid, tran);
                data.emailMarkModel = new B_OA_Email_Mark();
                data.emailDocumentModel = new B_EmailDocument();
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "数据加载成功", data);//将对象转为json字符串并返回到客户端
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

        /// <summary>
        /// 草稿箱
        /// </summary>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetEmailDraftInit", "userid")]
        public string GetEmailDraftInit(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            var data = new B_Email_One_Svc.GetDataModel();
            try
            {
                StringBuilder sqlStr = new StringBuilder();
                sqlStr.AppendFormat(@"select {0} from B_Email a where Mail_Deleted=0 and
                    whosEmailId = '{1}' and MailDocumentType = 'chaogao' order by Mail_CreateData desc", FieldList, userid);
                DataSet MailDataSet = Utility.Database.ExcuteDataSet(sqlStr.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(MailDataSet.Tables[0]);
                data.dataList = (List<B_Email>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_Email>));

                data.dataEdit = new B_Email();
                data.dataCount = new CounntModel();
                int count = MailDataSet.Tables[0].Rows.Count;
                data.dataCount.totalCount = count.ToString();
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "数据加载成功", data);//将对象转为json字符串并返回到客户端
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

        /// <summary>
        /// 发件箱
        /// </summary>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetEmailSendInit", "userid")]
        public string GetEmailSendInit(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            var data = new B_Email_One_Svc.GetDataModel();
            try
            {
                StringBuilder sqlStr = new StringBuilder();
                sqlStr.AppendFormat(@"select {0} from B_Email a where  Mail_Deleted=0 and whosEmailId='{1}' and MailDocumentType='fajian'  
                order by Mail_SendDate desc ", FieldList, userid);
                DataSet MailDataSet = Utility.Database.ExcuteDataSet(sqlStr.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(MailDataSet.Tables[0]);
                data.dataList = (List<B_Email>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_Email>));

                data.dataEdit = new B_Email();
                data.dataCount = new CounntModel();
                data.dataCount = GetUnReadEmailCount(userid, tran, "fajian");
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "数据加载成功", data);//将对象转为json字符串并返回到客户端
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

        /// <summary>
        /// 查找删除表
        /// </summary>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetDeleteEmail", "userid")]
        public string GetDeleteEmail(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            var data = new B_Email_One_Svc.GetDataModel();
            try
            {
                StringBuilder sqlStr = new StringBuilder();
                sqlStr.AppendFormat(@"select {0} from B_Email a where whosEmailId='{1}' and Mail_Deleted='1'  order by mailDeleteDate desc  
                 ", FieldList, userid);
                DataSet MailDataSet = Utility.Database.ExcuteDataSet(sqlStr.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(MailDataSet.Tables[0]);
                data.dataList = (List<B_Email>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_Email>));

                data.dataEdit = new B_Email();
                data.dataCount = new CounntModel();
                data.dataCount = GetUnReadEmailDeleteCount(userid, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "数据加载成功", data);//将对象转为json字符串并返回到客户端
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

        /// <summary>
        /// 查找为删除的邮件数量
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="tran"></param>
        /// <returns></returns>
        public CounntModel GetUnReadEmailDeleteCount(string userid, IDbTransaction tran)
        {

            //总共有多少发件和多少未读取的邮件
            StringBuilder sqlStr_Count = new StringBuilder();
            sqlStr_Count.AppendFormat(@"SELECT count(*) as readCount from B_Email  
            where whosEmailId='{0}' and Mail_Deleted='1' 
                union all  (
                 SELECT count(*) as totalcount from B_Email a 
              where whosEmailId='{0}' and Mail_Deleted='1' and Mail_IsSee='0')", userid);
            DataSet CountDataSet = Utility.Database.ExcuteDataSet(sqlStr_Count.ToString(), tran);
            DataTable countDataTable = CountDataSet.Tables[0];
            CounntModel countModel = new B_Email_One_Svc.CounntModel();
            countModel.totalCount = countDataTable.Rows[0][0].ToString();
            countModel.unReadCount = countDataTable.Rows[1][0].ToString();
            return countModel;
        }

        /// <summary>
        /// 读取未读取的发件数量
        /// </summary>
        /// <param name="userid"></param>
        /// <returns></returns>
        public CounntModel GetUnReadEmailCount(string userid, IDbTransaction tran, string emailType)
        {

            //总共有多少发件和多少未读取的邮件
            StringBuilder sqlStr_Count = new StringBuilder();
            //草稿箱
            if (emailType == "chaogao")
            {
                sqlStr_Count.AppendFormat(@"SELECT count(*) as readCount from B_Email  
            where whosEmailId='{0}' and Mail_Deleted='1' 
                union all  (
                 SELECT count(*) as totalcount from B_Email a 
              where whosEmailId='{0}' and Mail_Deleted='1' and Mail_IsSee='0')", userid);
            }
            //我的文件夹
            else if (emailType == "emailDocument")
            {
                return null;
            }
            else
            {
                sqlStr_Count.AppendFormat(@"SELECT count(*) as readCount from B_Email  a
            where Mail_Deleted=0 and whosEmailId='{0}' and MailDocumentType = '{1}'
                union all  (
                 SELECT count(*) as totalcount from B_Email  a
              where Mail_Deleted=0 and whosEmailId='{0}' and MailDocumentType = '{1}' and Mail_IsSee =0)", userid, emailType);
            }


            DataSet CountDataSet = Utility.Database.ExcuteDataSet(sqlStr_Count.ToString(), tran);
            DataTable countDataTable = CountDataSet.Tables[0];
            CounntModel countModel = new B_Email_One_Svc.CounntModel();
            countModel.totalCount = countDataTable.Rows[0][0].ToString();
            countModel.unReadCount = countDataTable.Rows[1][0].ToString();
            return countModel;
        }

        //读取未读邮件数量
        public CounntModel GetUnReadCount(string userid, IDbTransaction tran)
        {
            //总共有多少收件和多少未读取的邮件
            StringBuilder sqlStr_Count = new StringBuilder();
            sqlStr_Count.AppendFormat(@"SELECT count(*) as readCount from B_Email  a
            where Mail_Deleted=0 and whosEmailId='{0}' and MailDocumentType = 'shoujian'
                union all  (
                 SELECT count(*) as totalcount from B_Email  a
              where Mail_Deleted=0 and whosEmailId='{0}' and  MailDocumentType = 'shoujian' and Mail_IsSee =0) 
             ", userid);
            DataSet CountDataSet = Utility.Database.ExcuteDataSet(sqlStr_Count.ToString(), tran);
            DataTable countDataTable = CountDataSet.Tables[0];
            CounntModel countModel = new B_Email_One_Svc.CounntModel();
            countModel.totalCount = countDataTable.Rows[0][0].ToString();
            countModel.unReadCount = countDataTable.Rows[1][0].ToString();
            return countModel;
        }

        /// <summary>
        /// 册除数据
        /// </summary>
        /// <param name="Id">需删除的ID</param>
        /// <param name="deleteType">册除类型,1为逻辑删除，0为物理删除</param>
        /// <returns>反回json结果</returns>
        [DataAction("DeleteMail", "Id", "deleteType", "userid")]
        public string DeleteMail(string Id, string deleteType, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                Id = Id.TrimEnd(',');
                Id = "'" + Id.Replace(",", "','") + "'";
                string sql = "";
                if (deleteType == "1")
                {
                    sql = "delete B_Email where ID in(" + Id + ")";

                }
                else
                {
                    sql = "update B_Email set Mail_Deleted='1',Mail_deletedPerson='" + userid + "',mailDeleteDate = '" + DateTime.Now + "' where ID in(" + Id + ")";

                }
                Utility.Database.ExecuteNonQuery(sql, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除数据成功");

            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "删除数据失败！异常信息: " + e.Message);
            }
        }


        /// <summary>
        /// 保存邮件
        /// </summary>
        /// <param name="JsonData">要保存的数据</param>
        /// <param name="IsSend">保存还是发送</param>
        /// <returns>反回json结果</returns>
        [DataAction("SaveMail", "JsonData", "IsSend", "ReplyParamData", "userid")]
        public string SaveMail(string JsonData, string IsSend, string ReplyParamData, string userid)
        {

            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_Email email = JsonConvert.DeserializeObject<B_Email>(JsonData);
                string Mail_Id = ComClass.GetGuid();
                var userInfor = ComClass.GetUserInfo(userid);
                StringBuilder stringBuilder = new StringBuilder();
                //有无抄送若没有抄送清空抄送人
                if (email.isHaveCC == false)
                {
                    email.CCId = "";
                    email.CCName = "";
                }
                else
                {
                    //判断抄送人是否为空
                    if (email.CCId == null || email.CCId == "")
                    {
                        stringBuilder.Append("/b请选择抄送人");
                    }
                }

                //有没有密送若没有密送清空密送人
                if (email.isHaveSecretCC == false)
                {
                    email.CCSecretId = "";
                    email.CCSecretIdName = "";
                }
                else
                {
                    //判断密送人是否为空
                    if (email.CCSecretId == null || email.CCSecretId == "")
                    {
                        stringBuilder.Append("/b请选择密送人");
                    }
                }

                if (stringBuilder.Length > 0)
                {
                    return Utility.JsonResult(false, stringBuilder.ToString());
                }

                //有没有附件
                if (email.Mail_SendAttachment == null || email.Mail_SendAttachment == "" || email.Mail_SendAttachment == "null")
                {
                    email.haveAttachment = false;
                }
                else
                {
                    email.haveAttachment = true;
                }

                //将其保存为草稿
                if (email.Mail_ID == null || email.Mail_ID == "")
                {//添加
                    email.Mail_ID = Mail_Id;
                    email.Mail_CreateData = DateTime.Now.ToString();//发送时间   
                    email.ID = email.Mail_ID;// +"_" + DateTime.Now.ToLocalTime().ToString();/ID主键
                    email.Mail_SendPersonId = userid;//发件人ID
                    email.Mail_SendPersonName = userInfor.CnName;//发件人姓名
                    email.Mail_Deleted = "0";//是否已删除
                    email.Mail_deletedPerson = "";//删除人
                    email.Mail_Type = "0";//类型,0 未发送,草稿,1已发送
                    email.MailDocumentType = "chaogao";//的文件夹分类 默认是0收件箱
                    email.Mail_IsSee = "0";//是否已被查看
                    email.markId = "";//标签id
                    email.markName = "";//标签名称
                    email.markColor = "";//标签颜色
                    email.whosEmailId = userid;//邮件拥有者
                    Utility.Database.Insert<B_Email>(email, tran);
                }
                else
                {//修改
                    email.Condition.Add("ID=" + email.ID);
                    Utility.Database.Update<B_Email>(email, tran);

                }

                //发送邮件
                if (IsSend == "1")
                {

                    //保存发件
                    if (email.isSaveSendBox == true)
                    {
                        email.Condition.Add("ID=" + email.ID);
                        email.Mail_Type = "1";//邮件类型--已经发送
                        email.MailDocumentType = "fajian";//的文件夹分类 默认是0收件箱
                        email.Mail_SendDate = DateTime.Now.ToString();//发送时间
                        email.emailRecieveDate = DateTime.Now.ToString();//接收事件
                        Utility.Database.Update<B_Email>(email, tran);//修改发件人的数据
                    }
                    else
                    {
                        email.Condition.Add("ID=" + email.ID);
                        Utility.Database.Delete(email, tran);
                    }
                    if (email.Mail_SendPersonId != null && email.Mail_SendPersonId != "")
                    {
                        string[] sendIdArray = email.Mail_ReceivePersonId.Split(';');
                        for (int i = 0; i < sendIdArray.Length - 1; i++)
                        {
                            B_Email sendEmail = new B_Email();
                            sendEmail.ID = email.ID + sendIdArray[i];//主键
                            sendEmail.Mail_ID = email.Mail_ID;//关联ID
                            sendEmail.Mail_Title = email.Mail_Title;//主题
                            sendEmail.Mail_SendText = email.Mail_SendText;//发送内容
                            sendEmail.Mail_SendPersonId = email.Mail_SendPersonId;//发件人ID
                            var sendUserInfor = ComClass.GetUserInfo(sendEmail.Mail_SendPersonId);
                            sendEmail.Mail_SendPersonName = sendUserInfor.CnName;//发件人姓名
                            sendEmail.Mail_SendDate = email.Mail_SendDate;//发送时间
                            sendEmail.Mail_ReceivePersonId = sendIdArray[i];//接收人ID
                            sendEmail.Mail_ReceivePersonName = email.Mail_ReceivePersonName;
                            sendEmail.Mail_SendAttachment = email.Mail_SendAttachment;//附件
                            sendEmail.Mail_Deleted = "0";//是否删除0为未删除
                            sendEmail.Mail_Type = "1";//邮件类别（1已发送0草稿）
                            sendEmail.Mail_CreateData = DateTime.Now.ToString();//创建时间
                            sendEmail.Mail_IsSee = "0";//是否已读0未读1已读
                            sendEmail.MailDocumentType = "shoujian";//电子邮件文件夹类型
                            // sendEmail.isSaveSendBox = email.isSaveSendBox;//是否保存到发件箱
                            sendEmail.isImportant = email.isImportant;//是否是重要的邮件
                            sendEmail.isReadReceipt = email.isReadReceipt;//是否发送查看回执1发送回执0不回执
                            sendEmail.haveAttachment = email.haveAttachment;//是否有附件
                            sendEmail.CCId = email.CCId;//抄送人
                            sendEmail.CCName = email.CCName;//抄送人姓名
                            sendEmail.emailRecieveDate = DateTime.Now.ToString();//收件时间
                            sendEmail.markId = "";//标记ID
                            sendEmail.markName = "";//标记名称
                            sendEmail.markColor = "";//标记颜色
                            sendEmail.whosEmailId = sendIdArray[i]; //邮件拥有者
                            Utility.Database.Insert<B_Email>(sendEmail, tran);
                        }

                    }

                    //创建抄送发件
                    if (email.CCId != null || email.CCId != "")
                    {

                        string[] ccIdArray = email.CCId.Split(';');
                        for (int i = 0; i < ccIdArray.Length - 1; i++)
                        {
                            B_Email ccEmail = new B_Email();
                            ccEmail.ID = email.ID + ccIdArray[i] + "_cc";//主键
                            ccEmail.Mail_ID = email.Mail_ID;//关联ID
                            ccEmail.Mail_Title = email.Mail_Title;//主题
                            ccEmail.Mail_SendText = email.Mail_SendText;//发送内容
                            ccEmail.Mail_SendPersonId = email.Mail_SendPersonId;//发件人
                            ccEmail.Mail_SendDate = email.Mail_SendDate;//发送时间
                            ccEmail.Mail_ReceivePersonId = ccIdArray[i];//接收人
                            ccEmail.Mail_ReceivePersonName = email.Mail_ReceivePersonName;
                            var sendUserInfor = ComClass.GetUserInfo(ccIdArray[i]);
                            ccEmail.Mail_SendPersonName = sendUserInfor.CnName;//发件人姓名
                            ccEmail.Mail_SendAttachment = email.Mail_SendAttachment;//附件
                            ccEmail.Mail_Deleted = "0";//是否删除0为未删除
                            ccEmail.Mail_Type = "1";//邮件类别（1已发送0草稿）
                            ccEmail.Mail_CreateData = DateTime.Now.ToString();//创建时间
                            ccEmail.Mail_IsSee = "0";//是否已读0未读1已读
                            ccEmail.MailDocumentType = "shoujian";//电子邮件文件夹类型
                            // sendEmail.isSaveSendBox = email.isSaveSendBox;//是否保存到发件箱
                            ccEmail.isImportant = email.isImportant;//是否是重要的邮件
                            ccEmail.isReadReceipt = email.isReadReceipt;//是否发送查看回执1发送回执0不回执
                            ccEmail.haveAttachment = email.haveAttachment;//是否有附件
                            ccEmail.isHaveCC = true;//抄送人
                            ccEmail.CCId = email.CCId;//抄送人
                            ccEmail.CCName = email.CCName;//抄送人姓名
                            ccEmail.emailRecieveDate = DateTime.Now.ToString();//收件时间
                            ccEmail.isHaveSecretCC = false;
                            ccEmail.markId = "";//标记ID
                            ccEmail.markName = "";//标记名称
                            ccEmail.markColor = "";//标记颜色
                            ccEmail.whosEmailId = ccIdArray[i]; //邮件拥有者
                            Utility.Database.Insert<B_Email>(ccEmail, tran);
                        }
                    }

                    //创建密送发件
                    if (email.CCSecretId != null && email.CCSecretId != "")
                    {
                        string[] ccSecretIdArray = email.CCSecretId.Split(';');
                        for (int i = 0; i < ccSecretIdArray.Length - 1; i++)
                        {
                            B_Email ccsEmail = new B_Email();
                            ccsEmail.ID = email.ID + ccSecretIdArray[i] + "_ccs";//主键
                            ccsEmail.Mail_ID = email.Mail_ID;//关联ID
                            ccsEmail.Mail_Title = email.Mail_Title;//主题
                            ccsEmail.Mail_SendText = email.Mail_SendText;//发送内容
                            ccsEmail.Mail_SendPersonId = email.Mail_SendPersonId;//发件人
                            ccsEmail.Mail_SendDate = email.Mail_SendDate;//发送时间
                            ccsEmail.Mail_ReceivePersonId = ccSecretIdArray[i];//接收人
                            ccsEmail.Mail_ReceivePersonName = email.Mail_ReceivePersonName;
                            var sendUserInfor = ComClass.GetUserInfo(ccSecretIdArray[i]);
                            ccsEmail.Mail_SendPersonName = sendUserInfor.CnName;//发件人姓名
                            ccsEmail.Mail_SendAttachment = email.Mail_SendAttachment;//附件
                            ccsEmail.Mail_Deleted = "0";//是否删除0为未删除
                            ccsEmail.Mail_Type = "1";//邮件类别（1已发送0草稿）
                            ccsEmail.Mail_CreateData = DateTime.Now.ToString();//创建时间
                            ccsEmail.Mail_IsSee = "0";//是否已读0未读1已读
                            ccsEmail.MailDocumentType = "shoujian";//电子邮件文件夹类型
                            // sendEmail.isSaveSendBox = email.isSaveSendBox;//是否保存到发件箱
                            ccsEmail.isImportant = email.isImportant;//是否是重要的邮件
                            ccsEmail.isReadReceipt = email.isReadReceipt;//是否发送查看回执1发送回执0不回执
                            ccsEmail.haveAttachment = email.haveAttachment;//是否有附件
                            ccsEmail.CCId = email.CCId;//抄送人
                            ccsEmail.CCName = email.CCName;//抄送人姓名
                            ccsEmail.CCSecretId = email.CCSecretId;//密送人
                            ccsEmail.CCSecretIdName = email.CCSecretIdName;//密送人姓名
                            ccsEmail.isHaveCC = true;//抄送
                            ccsEmail.isHaveSecretCC = true;//密送
                            ccsEmail.emailRecieveDate = DateTime.Now.ToString();//收件时间
                            ccsEmail.markId = "";//标记ID
                            ccsEmail.markName = "";//标记名称
                            ccsEmail.markColor = "";//标记颜色
                            ccsEmail.whosEmailId = ccSecretIdArray[i]; //邮件拥有者
                            Utility.Database.Insert<B_Email>(ccsEmail, tran);
                        }
                    }

                    //若此邮件为回复邮件需要将原邮件的“是否回复”改成已经回复
                    if (ReplyParamData != null && ReplyParamData != "")
                    {
                        B_Email replyParamData = JsonConvert.DeserializeObject<B_Email>(ReplyParamData);
                        replyParamData.Condition.Add("ID=" + replyParamData.ID);
                        Utility.Database.Update<B_Email>(replyParamData, tran);
                        //StringBuilder strSql2 = new StringBuilder();

                        //strSql2.AppendFormat("update B_Email set haveReply =1 where ID ='{0}'", replyParamData.ID);

                        //Utility.Database.ExecuteNonQuery(strSql2.ToString());
                    }

                    Utility.Database.Commit(tran);
                    return Utility.JsonResult(true, "发送成功", new B_Email());
                }
                else
                {
                    Utility.Database.Commit(tran);
                    return Utility.JsonResult(true, "保存成功！", email);
                }


            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "保存数据失败！异常信息: " + e.Message); ;//将对象转为json字符串并返回到客户端
            }
        }

        //读取文件夹下拉
        [DataAction("GetEmailDocument", "userid")]
        public string GetEmailDocument(string usertid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat("SELECT * FROM B_EmailDocument where createManId='{0}'", usertid);
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                //Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "数据加载成功", ds.Tables[0]);//将对象转为json字符串并返回到客户端
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "保存数据失败！异常信息: " + e.Message); ;//将对象转为json字符串并返回到客户端
            }
        }


        /// <summary>
        /// 通过文件Id，与人员ID查找邮件
        /// </summary>
        /// <param name="id">邮件文件表id</param>
        /// <param name="userid">用户ID</param>
        /// <returns></returns>
        [DataAction("GetEmailByDocumentId", "id", "userid")]
        public string GetEmailByDocumentId(string id, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            GetDataModel dataModel = new GetDataModel();
            try
            {
                StringBuilder strSql = new StringBuilder();
                //                strSql.AppendFormat(@"
                //                 select {0},b.documentName as doucmentName,b.id as documentId from B_Email a
                //                 LEFT JOIN B_EmailDocument b on b.id = a.MailDocumentType  
                //                 WHERE a.whosEmailId = '{1}' and a.Mail_Deleted =0
                //                 and a.MailDocumentType<>'fajian' and a.MailDocumentType<>'shoujian' and a.MailDocumentType<>'chaogao' and a.MailDocumentType<>'guidang'
                //                ", FieldList, userid);

                strSql.AppendFormat(@"
                                 select {0},b.documentName as doucmentName,b.id as documentId from B_Email a
                                 LEFT JOIN B_EmailDocument b on b.id = a.MailDocumentType  
                                 WHERE a.whosEmailId = '{1}' and a.Mail_Deleted =0
                                ", FieldList, userid);

                if (id != "" && id != null)
                {
                    strSql.AppendFormat("and a.MailDocumentType='{0}'", id);
                }
                strSql.Append(" ORDER BY emailRecieveDate desc");
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
                List<B_Email> listEmail = (List<B_Email>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_Email>));

                DataTable dt = GetEmialDocumentNameAndCount(userid, tran);
                dataModel.dataList = listEmail;
                dataModel.dataTableCount = dt;

                Utility.Database.Commit(tran);



                return Utility.JsonResult(true, "数据加载成功", dataModel);//将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);//写日专到本地文件
                return Utility.JsonResult(false, "加载失败:" + ex.Message);
            }
        }

        /// <summary>
        /// 将邮件的文件类型恢复到邮件类型
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("RecorverToEmail", "JsonData", "userid")]
        public string RecorverToEmail(string JsonData, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_Email email = JsonConvert.DeserializeObject<B_Email>(JsonData);
                email.MailDocumentType = "shoujian";
                email.Condition.Add("ID=" + email.ID);
                Utility.Database.Update<B_Email>(email, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存成功！");
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);//写日专到本地文件
                return Utility.JsonResult(false, "删除失败:" + ex.Message);
            }
        }

        /// <summary>
        /// 修改Email
        /// </summary>
        /// <param name="JsonData"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("UpdateEmail", "JsonData", "userid")]
        public string UpdateEmail(string JsonData, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_Email email = JsonConvert.DeserializeObject<B_Email>(JsonData);
                email.Condition.Add("ID=" + email.ID);
                Utility.Database.Update<B_Email>(email, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存成功！");
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);//写日专到本地文件
                return Utility.JsonResult(false, "保存失败:" + ex.Message);
            }
        }

        /// <summary>
        /// 批量修改电子邮件信息
        /// </summary>
        /// <param name="JsonData"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("UpdateEmailList", "JsonData", "userid")]
        public string UpdateEmailList(string JsonData, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                List<B_Email> listEmail = JsonConvert.DeserializeObject<List<B_Email>>(JsonData);
                foreach (B_Email newE in listEmail)
                {
                    newE.Condition.Add("ID=" + newE.ID);
                    Utility.Database.Update<B_Email>(newE, tran);
                }
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存成功！");
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);//写日专到本地文件
                return Utility.JsonResult(false, "保存失败:" + ex.Message);
            }
        }


        /// <summary>
        /// 将邮件设置为已(未)查看
        /// </summary>
        /// <param name="id"></param>
        /// <param name="id"></param>
        /// <param name="mailIsSee">1设置为已查看0设置为为查看</param>
        /// <param name="emailType">邮件类型</param>
        /// <returns></returns>
        [DataAction("UpdateB_EmailByIdSetMail_IsSee", "id", "mailIsSee", "userid", "emailType")]
        public string UpdateB_EmailByIdSetMail_IsSee(string id, string mailIsSee, string userid, string emailType)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_Email email = new B_Email();
                email.Condition.Add("ID=" + id);
                email = Utility.Database.QueryObject<B_Email>(email);
                email.Mail_IsSee = mailIsSee;
                email.Condition.Add("ID=" + email.ID);
                Utility.Database.Update<B_Email>(email, tran);
                CounntModel countModel = new CounntModel();
                //刷新已读未读
                countModel = GetUnReadEmailCount(userid, tran, emailType);

                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存成功", countModel);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex.Message);
                return Utility.JsonResult(false, ex.Message, null);
            }
        }

        /// <summary>
        /// 批量彻底删除
        /// </summary>
        /// <param name="JsonData"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("DeleteEmailList", "JsonData", "userid")]
        public string DeleteEmailList(string JsonData, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                List<B_Email> listEmail = JsonConvert.DeserializeObject<List<B_Email>>(JsonData);
                foreach (B_Email newE in listEmail)
                {
                    newE.Condition.Add("ID=" + newE.ID);
                    Utility.Database.Delete(newE, tran);
                    //如果有附件，判断此附件是否已经是最后一条附件，若是则删除若不是则不删除，此机制用于邮件附件删除机制，以便不占内存空间
                    if (newE.haveAttachment == true)
                    {
                        B_Email d_Attach = new B_Email();
                        d_Attach.Condition.Add("Mail_SendAttachment like " + newE.Mail_SendAttachment);
                        List<B_Email> d_email = Utility.Database.QueryList<B_Email>(d_Attach, tran);
                        if (d_email.Count == 0)
                        {
                            string[] pathList = newE.Mail_SendAttachment.Split('|');
                            foreach (string path in pathList)
                            {
                                ComFileOperate.DeleteAttachment(path);
                            };
                        }
                    }
                }
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存成功！");
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex.Message);
                return Utility.JsonResult(false, ex.Message, null);
            }
        }

        /// <summary>
        /// 通过用户ID查找邮箱标签
        /// </summary>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetEmailMarkByUserid", "JsonData", "userid")]
        public string GetEmailMarkByUserid(string JsonData, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            try
            {
                B_OA_Email_Mark emailMark = new B_OA_Email_Mark();
                emailMark.Condition.Add("userid=" + userid);
                strSql.AppendFormat("select * from B_OA_Email_Mark where userid='{0}'", userid);
                DataSet MailDataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);

                string jsonData = JsonConvert.SerializeObject(MailDataSet.Tables[0]);
                List<B_OA_Email_Mark> markList = (List<B_OA_Email_Mark>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_Email_Mark>));
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "数据加载成功", markList);//将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex.Message);
                return Utility.JsonResult(false, ex.Message, null);
            }
        }

        /// <summary>
        /// 保存邮件标签
        /// </summary>
        /// <param name="markName">邮件标签名</param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("SaveEmailMark", "JsonData", "userid")]
        public string SaveEmailMark(string JsonData, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_Email_Mark mark = JsonConvert.DeserializeObject<B_OA_Email_Mark>(JsonData);
                if (mark.id == 0 || mark.id == null)
                {
                    mark.userid = userid;
                    Utility.Database.Insert<B_OA_Email_Mark>(mark, tran);
                }
                else
                {
                    mark.Condition.Add("id=" + mark.id);
                    Utility.Database.Update(mark, tran);
                }
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存成功");//将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex.Message);
                return Utility.JsonResult(false, ex.Message, null);
            }
        }

        /// <summary>
        /// 删除邮件标签
        /// </summary>
        /// <param name="JsonData"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("DeleteEmailMark", "id", "userid")]
        public string DeleteEmailMark(string id, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_Email_Mark mark = new B_OA_Email_Mark();
                mark.Condition.Add("id = " + id);
                Utility.Database.Delete(mark, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除成功");//将对象转为json字符串并返回到客户端

            }
            catch (Exception ex)
            {
                ComBase.Logger(ex.Message);
                return Utility.JsonResult(false, ex.Message, null);
            }
        }

        /// <summary>
        /// 保存邮件文件夹
        /// </summary>
        /// <param name="documentName">文件夹名称</param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("SaveEmailDocument", "documentName", "userid")]
        public string SaveEmailDocument(string documentName, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            try
            {
                string id = ComClass.GetGuid();
                B_EmailDocument emailDocucment = new B_EmailDocument();
                emailDocucment.createManId = userid;
                emailDocucment.documentName = documentName;
                emailDocucment.id = id;
                Utility.Database.Insert<B_EmailDocument>(emailDocucment);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存成功");
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex.Message);
                return Utility.JsonResult(false, ex.Message, null);
            }
        }

        /// <summary>
        /// 通过用户ID查找此用户的邮件的文件夹名称和已读未读的数量，用在页面'我的文件夹'中
        /// </summary>
        /// <param name="userid"></param>
        /// <returns></returns>
        public DataTable GetEmialDocumentNameAndCount(string userid, IDbTransaction tran)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.AppendFormat(@"select ISNULL(unsee,0) as unsee,ISNULL(hassee,0) as hassee,ISNULL(total,0) as total,m.* from B_EmailDocument m left join 
                (select COUNT(*)-SUM(Mail_IsSee) as unsee ,
                SUM(Mail_IsSee) as hassee,count(*) 
                as total,MailDocumentType from B_Email  where whosEmailId='{0}' and Mail_Deleted =0 group by MailDocumentType) as a on a.MailDocumentType=m.id", userid);
            DataSet MailDataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
            return MailDataSet.Tables[0];
        }

        /// <summary>
        /// 通过用户ID查找此用户的邮件的文件夹名称和已读未读的数量，用在页面'我的文件夹'中
        /// </summary>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetEmialDocumentNameAndCount_Two", "userid")]
        public string GetEmialDocumentNameAndCount_Two(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            try
            {

                strSql.AppendFormat(@"select ISNULL(unsee,0) as unsee,ISNULL(hassee,0) as hassee,ISNULL(total,0) as total,m.* from B_EmailDocument m left join 
                (select COUNT(*)-SUM(Mail_IsSee) as unsee ,
                SUM(Mail_IsSee) as hassee,count(*) 
                as total,MailDocumentType from B_Email  where whosEmailId='{0}' and Mail_Deleted =0 group by MailDocumentType) as a on a.MailDocumentType=m.id", userid);
                DataSet MailDataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(MailDataSet.Tables[0]);
                GetDataModel dataModel = new GetDataModel();
                List<B_EmailDocument> docList = (List<B_EmailDocument>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_EmailDocument>));

                dataModel.listObj = new List<object>();
                dataModel.listObj.Add(docList);
                strSql.Clear();
                strSql.AppendFormat("select * from B_OA_Email_Mark where userid='{0}'", userid);
                DataSet markDS = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData_markDS = JsonConvert.SerializeObject(markDS.Tables[0]);
                List<B_OA_Email_Mark> markList = (List<B_OA_Email_Mark>)JsonConvert.DeserializeObject(jsonData_markDS, typeof(List<B_OA_Email_Mark>));
                dataModel.listObj.Add(markList);
                dataModel.emailDocumentModel = new B_EmailDocument();
                dataModel.emailMarkModel = new B_OA_Email_Mark();
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存成功", dataModel);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex.Message);
                return Utility.JsonResult(false, ex.Message, null);
            }
        }


        /// <summary>
        /// 保存文件夹
        /// </summary>
        /// <param name="JsonData"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("SaveEmailDocument_Two", "JsonData", "userid")]
        public string SaveEmailDocument_Two(string JsonData, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            B_EmailDocument B_EmailDoc = JsonConvert.DeserializeObject<B_EmailDocument>(JsonData);
            try
            {
                if (B_EmailDoc.documentName == null)
                {
                    return Utility.JsonResult(false, "文件夹名称不能为空！");
                }
                if (B_EmailDoc.id == "" || B_EmailDoc.id == null)
                {
                    B_EmailDoc.id = ComClass.GetGuid();
                    B_EmailDoc.createManId = userid;
                    Utility.Database.Insert<B_EmailDocument>(B_EmailDoc);
                }
                else
                {

                    B_EmailDoc.Condition.Add("id=" + B_EmailDoc.id);
                    Utility.Database.Update(B_EmailDoc);
                }
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存成功");
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex.Message);
                return Utility.JsonResult(false, ex.Message, null);
            }
        }


        //清空文件夹
        [DataAction("TruncateDocument", "documentId", "userid")]
        public string TruncateDocument(string documentId, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            try
            {
                strSql.AppendFormat(@"    select  * from B_Email a
                 WHERE a.whosEmailId = '{0}' and a.Mail_Deleted =0
                 and a.MailDocumentType<>'fajian' and a.MailDocumentType<>'shoujian' and a.MailDocumentType<>'chaogao' and a.MailDocumentType<>'guidang'
                and a.MailDocumentType='{1}'", userid, documentId);
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
                List<B_Email> listEmail = (List<B_Email>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_Email>));
                foreach (B_Email b in listEmail)
                {
                    b.Condition.Add("id=" + b.ID);
                    Utility.Database.Delete(b, tran);
                }
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "清空成功");
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex.Message);
                return Utility.JsonResult(false, ex.Message, null);
            }
        }

        /// <summary>
        /// 删除文件夹
        /// </summary>
        /// <param name="JsonData"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("DeleteDocument", "JsonData", "userid")]
        public string DeleteDocument(string JsonData, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            try
            {
                B_EmailDocument doc = JsonConvert.DeserializeObject<B_EmailDocument>(JsonData);
                strSql.AppendFormat(@"    select  * from B_Email a
                 WHERE a.whosEmailId = '{0}' and a.Mail_Deleted =0
                 and a.MailDocumentType<>'fajian' and a.MailDocumentType<>'shoujian' and a.MailDocumentType<>'chaogao' and a.MailDocumentType<>'guidang'
                and a.MailDocumentType='{1}'", userid, doc.id);
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
                List<B_Email> listEmail = (List<B_Email>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_Email>));
                //是否同时删除邮件
                if (doc.isDeleteDocument == true)
                {
                    foreach (B_Email b in listEmail)
                    {
                        b.Condition.Add("id=" + b.ID);
                        Utility.Database.Delete(b, tran);
                    }
                }
                else
                {
                    //转移到收件箱
                    foreach (B_Email b in listEmail)
                    {
                        b.MailDocumentType = "shoujian";
                        b.Mail_Deleted = "0";
                        b.Condition.Add("id=" + b.ID);
                        Utility.Database.Update(b, tran);
                    }
                }
                //删除文件夹
                doc.Condition.Add("id =" + doc.id);
                Utility.Database.Delete(doc, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除成功!");
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex.Message);
                return Utility.JsonResult(false, ex.Message, null);
            }
        }

        /// <summary>
        /// 邮件搜索
        /// </summary>
        /// <param name="JsonData"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("SearchEmailByConditon", "JsonData", "userid")]
        public string SearchEmailByConditon(string JsonData, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();

            try
            {

                strSql.AppendFormat(@"select {0} from B_EMAIL as a  where  a.whosEmailId = '{1}' and  a.Mail_Deleted =0", FieldList, userid);

                B_Email email = JsonConvert.DeserializeObject<B_Email>(JsonData);

                if (email.Mail_SendPersonId != null && email.Mail_SendPersonId != "")
                {

                    string[] arry = email.Mail_SendPersonId.Split(';');
                    if (arry.Length == 2)
                    {
                        strSql.AppendFormat(@" and  a.Mail_SendPersonId = '{0}'", arry[0]);
                    }
                    else
                    {
                        for (int i = 0; i < arry.Length - 1; i++)
                        {
                            if (i == 0)
                            {
                                strSql.AppendFormat(@" and  (a.Mail_SendPersonId = '{0}'",
                                    arry[i]);
                            }
                            else if (i == arry.Length - 2)
                            {
                                strSql.AppendFormat(@"or a.Mail_SendPersonId='{0}')", arry[i]);
                            }
                            else
                            {
                                strSql.AppendFormat(@"or a.Mail_SendPersonId='{0}'", arry[i]);
                            }
                        }
                    }
                }
                //内容
                if (email.sCheckText == true)
                {
                    if (email.sCheckTittle == true)
                    {
                        strSql.AppendFormat(@" and  (a.Mail_SendText LIKE '%{0}%'", email.sText);
                    }
                    else
                    {
                        strSql.AppendFormat(@" and  a.Mail_SendText LIKE '%{0}%'", email.sText);
                    }
                }
                //标题
                if (email.sCheckTittle == true)
                {
                    if (email.sCheckText == true)
                    {
                        strSql.AppendFormat(@" or  a.Mail_Title LIKE '%{0}%')", email.sText);
                    }
                    else
                    {
                        strSql.AppendFormat(@" and  a.Mail_Title LIKE '%{0}%'", email.sText);
                    }
                }
                if (email.sDate != "" && email.sDate != null)
                {
                    strSql.AppendFormat(@" and  a.emailRecieveDate >='{0}'", email.sDate);
                }

                if (email.sEndDate != "" && email.sEndDate != null)
                {
                    strSql.AppendFormat(@" and  a.emailRecieveDate <='{0}'", email.sEndDate);
                }
                GetDataModel data = new GetDataModel();
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
                data.dataList = (List<B_Email>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_Email>));
                data.dataEdit = new B_Email();
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "加载成功!", data);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex.Message);
                return Utility.JsonResult(false, ex.Message, null);
            }
        }


        [DataAction("GetEmailGate", "top", "mailid", "userid")]
        public string GetEmailGate(string top, string mailid, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            try
            {
                strSql.AppendFormat(@"select top {2} {0} from B_Email a where Mail_Deleted=0 and
                    whosEmailId='{1}' and  MailDocumentType = 'shoujian' order by emailRecieveDate desc", FieldList, userid, top);
                DataSet MailDataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                return Utility.JsonResult(true, "加载成功！", MailDataSet.Tables[0]);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex.Message);
                return Utility.JsonResult(false, ex.Message, null);
            }

        }

        [DataAction("GetAllEmailList", "userid")]
        public object GetAllEmailList(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_Email model = new B_Email();
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat(@"select {0} from B_EMAIL as a  where  a.whosEmailId = '{1}' and  a.Mail_Deleted =0", FieldList, userid);
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
                List<B_Email> emailList = (List<B_Email>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_Email>));
                Utility.Database.Commit(tran);
                return new
                {
                    model = model,
                    emailList = emailList
                };
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex.Message);
                throw (new Exception("数据获取失败！错误：" + ex.Message, ex));
            }
        }

        [DataAction("GetEmailModel", "content")]
        public string GetEmailModel(string content)
        {
            B_Email model = new B_Email();
            return Utility.JsonResult(true, null, model);
        }

        [DataAction("GetEmailModelList", "content")]
        public string GetEmailModelList(string content)
        {
            List<B_Email> model = new List<B_Email>();
            return Utility.JsonResult(true, null, model);
        }


        /// <summary>
        /// 获取数据模型
        /// </summary>
        public class GetDataModel
        {
            public List<B_Email> dataList;
            public B_Email dataEdit;
            public CounntModel dataCount;
            public DataTable dataTableCount;
            public B_EmailDocument emailDocumentModel;
            public B_OA_Email_Mark emailMarkModel;
            public List<B_EmailDocument> emailDocumentModelList;
            public List<object> listObj;
        }

        public class CounntModel
        {
            public string totalCount;//所有的收件数量
            public string unReadCount;//未读的收件数量
        }

        public class SaveDataModel
        {
            public B_Email saveEmail;
        }

        public override string Key
        {
            get
            {
                return "B_Email_One_Svc";
            }
        }
    }
}
