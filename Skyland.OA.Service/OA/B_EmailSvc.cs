using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BizService.Services
{
    public class B_EmailSvc : BaseDataHandler
    {
        string FieldList = " 0 as del,ID,Mail_ID,Mail_Title,Mail_SendPersonName,CONVERT(varchar(10),Mail_SendDate,23) as Mail_SendDate,Mail_IsSee,Mail_SendText,Mail_ReceivePersonName,Mail_SendPersonId,Mail_ReceivePersonId ";
        /// <summary>
        /// 初始化邮件
        /// </summary>
        /// <param name="userid">用户ID，系统会自动传入</param>
        /// <returns>反回json结果</returns>
        [DataAction("InitMail", "emailstate", "userid")]
        public string InitMail(string emailstate, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            var data = new GetDataModel();

            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append("select " + FieldList + " from B_Email where ");
                if (emailstate == "ManuscriptEmail") sql.Append(" Mail_Deleted=0 and Mail_SendPersonId='{0}' and Mail_Type='0' and Mail_SendDate is null");//如果是草稿
                if (emailstate == "ReceiveEmail") sql.Append(" Mail_Deleted=0 and Mail_ReceivePersonId='{0}' and Mail_Type='1' ");//如果是收件箱
                if (emailstate == "SendEmail") sql.Append(" Mail_Deleted=0 and Mail_SendPersonId='{0}' and Mail_Type='0' and isnull(Mail_SendDate,'')<>'' ");//如果是已发送箱
                if (emailstate == "RemoveEmail") sql.Append(" (Mail_ReceivePersonId='{0}' or Mail_SendPersonId='" + userid + "') and Mail_Deleted='1' "); else sql.Append(" and Mail_Deleted='0' ");//如果是删除箱
                sql.Append(" order by Mail_SendDate desc ");
                string sqlStr = string.Format(sql.ToString(), userid);
                DataSet MailDataSet = Utility.Database.ExcuteDataSet(sqlStr, tran);
                Utility.Database.Commit(tran);
                string jsonData = JsonConvert.SerializeObject(MailDataSet.Tables[0]);
                data.dataList = (List<B_Email>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_Email>));
                data.dataEdit = new B_Email();
                return Utility.JsonResult(true, "数据加载成功", data);//将对象转为json字符串并返回到客户端
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
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
                    sql = "update B_Email set Mail_Deleted='1',Mail_deletedPerson='" + userid + "' where ID in(" + Id + ")";

                }
                Utility.Database.ExecuteNonQuery(sql, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "册除数据成功");

            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "册除数据失败！异常信息: " + e.Message);
            }
        }

        /// <summary>
        /// 保存,发送邮件
        /// </summary>
        /// <param name="JsonData">要保存的数据</param>
        /// <returns>反回json结果</returns>
        [DataAction("SaveMail", "JsonData", "IsSend", "userName", "userid")]
        public string SaveMail(string JsonData, string IsSend, string userName, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_Email email = JsonConvert.DeserializeObject<B_Email>(JsonData);
                //email.Mail_Receive = email.Mail_ReceivePersonId;//接收人ID
                if (email.Mail_ID == null || email.Mail_ID == "")
                {
                    email.Mail_ID = ComClass.GetGuid();
                    email.Mail_CreateData = DateTime.Now.ToString();//设置首输时间     
                    email.ID = email.Mail_ID;// +"_" + DateTime.Now.ToLocalTime().ToString();//邮件ID
                    email.Mail_SendPersonId = userid;
                    email.Mail_SendPersonName = userName;
                    email.Mail_SendAttachment = email.Mail_ID;//附件ID
                    //email.Mail_IsCC = "0";//是否是抄送
                    email.Mail_Deleted = "0";//是否已删除
                    email.Mail_deletedPerson = "";//删除人
                    email.Mail_Type = "0";
                    email.Mail_IsSee = "0";//是否已被查看
                }

                email.Condition.Add("ID=" + email.ID);
                //更新或插入主业务信息
                if (Utility.Database.Update<B_Email>(email, tran) < 1)
                {
                    Utility.Database.Insert<B_Email>(email, tran);
                }

                //发送邮件
                if (IsSend == "1")//如果是发送邮件
                {
                    DataSet ResultDataSet = Utility.Database.ExcuteDataSet("exec B_SendEmail '" + email.Mail_ID + "'", tran);

                    if (ResultDataSet.Tables[0].Rows[0]["rtnMSG"].ToString() == "")
                    {
                        Utility.Database.Commit(tran);
                        return Utility.JsonResult(true, "发送邮件成功");
                    }
                    else
                    {
                        Utility.Database.Rollback(tran);
                        return Utility.JsonResult(false, "发送邮件失败！异常信息: " + ResultDataSet.Tables[0].Rows[0]["rtnMSG"].ToString());
                    }
                }
                else
                {
                    Utility.Database.Commit(tran);
                    return Utility.JsonResult(true, "保存数据成功");
                }


            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "保存数据失败！异常信息: " + e.Message); ;//将对象转为json字符串并返回到客户端
            }
        }

        // created by zhou 用于门户数据显示
        [DataAction("GetReceiveMailList", "top", "mailid", "userid")]
        public string GetReceiveMailList(string top, string mailid, string userid)
        {
            try
            {
                var tran = Utility.Database.BeginDbTransaction();
                StringBuilder sb = new StringBuilder();
                string topstr = "";
                if (!String.IsNullOrEmpty(top)) { topstr = " TOP " + top; }
                sb.AppendFormat(@"SELECT {0} Mail_ID, Mail_Title, Convert(varchar(20), Mail_CreateData, 120) as Mail_CreateData
                                    ,ID,Mail_SendText,Mail_SendPersonId,Mail_SendPersonName,Mail_SendDate,Mail_ReceivePersonId,
                                    Mail_ReceivePersonName,Mail_SendAttachment,Mail_Deleted,Mail_deletedPerson,Mail_Type,Mail_IsSee, MailDocumentType
                                    from B_Email
                                    where 1=1 and Convert(varchar(20), Mail_CreateData, 23) = Convert(varchar(20),getdate(), 23) ", topstr);

                if (!String.IsNullOrEmpty(mailid)) { sb.AppendFormat(" and Mail_ID='{0}'", mailid); }
                if (!String.IsNullOrEmpty(userid)) { sb.AppendFormat(" and Mail_ReceivePersonId='{0}'", userid); }

                DataTable dt = Utility.Database.ExcuteDataSet(sb.ToString(), tran).Tables[0];
                return Utility.JsonResult(true, "发送成功！", dt);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex.Message);
                return Utility.JsonResult(false, ex.Message, null);
            }
        }

        /// <summary>
        /// 将邮件设置为已(未)查看
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("UpdateB_EmailByIdSetMail_IsSee", "id","mailIsSee" ,"userid")]
        public string UpdateB_EmailByIdSetMail_IsSee(string id,string mailIsSee, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_Email email = new B_Email();
                email.Condition.Add("ID="+id);
                email = Utility.Database.QueryObject<B_Email>(email);
                email.Mail_IsSee = mailIsSee;
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
        /// 获取数据模型
        /// </summary>
        public class GetDataModel
        {
            public List<B_Email> dataList;
            public B_Email dataEdit;
        }

        public class SaveDataModel
        {
            public B_Email saveEmail;
        }

        public override string Key
        {
            get
            {
                return "B_EmailSvc";
            }
        }
    }
}

