using BizService.Common;
using IWorkFlow.BaseService;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BizService.Services
{
    public class B_OA_TrafficFlow_PublicNoticeSvc : BaseDataHandler
    {
        [DataAction("GetData", "userid", "caseid")]
        public object  GetData(string userid, string caseId)
        {
            try
            {
                GetDataModel dataModel = new GetDataModel();
                B_OA_Notice en = new B_OA_Notice();
                en.Condition.Add("caseid=" + caseId);
                dataModel.baseInfor_Notice = Utility.Database.QueryObject<B_OA_Notice>(en);
                if (dataModel.baseInfor_Notice == null)
                {
                    //初始化数据
                    IDbTransaction tran = Utility.Database.BeginDbTransaction();
                    var baseInfor_Notice = new B_OA_Notice();
                    baseInfor_Notice.status = "checkUnthrough";
                    baseInfor_Notice.CreaterId = userid;
                    var userInfor = ComClass.GetUserInfo(userid);
                    baseInfor_Notice.CreateMan = userInfor.CnName;
                    baseInfor_Notice.CreateTime = DateTime.Now.ToString();
                    baseInfor_Notice.NewsId = ComClass.GetGuid();
                    baseInfor_Notice.Chk = "0";
                    dataModel.baseInfor_Notice = baseInfor_Notice;

                    Utility.Database.Commit(tran);
                }
                return Utility.JsonResult(true, null, dataModel);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("获取数据失败！", ex));
            }
        }

        [DataAction("send", "BizParams", "userid", "content")]
        public string Send(string BizParams, string userid, string content)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            SkyLandDeveloper developer = new SkyLandDeveloper(BizParams, userid, tran);
            try
            {
                GetDataModel data = JsonConvert.DeserializeObject<GetDataModel>(content);

                string caseid = developer.caseid;
                if (String.IsNullOrEmpty(caseid))
                {
                    string unitName = data.baseInfor_Notice.NewsTitle;
                    string titleType = "文档发布";
                    developer.caseName = unitName + "-" + titleType;
                    caseid = developer.Create();

                }


                //string validateInfor = ValiadateInput(data.baseInfor_Notice);

                //if (validateInfor.Length > 0)
                //{
                //    developer.RollBack();
                //    return Utility.JsonResult(false, validateInfor);
                //}

                //保存数据
                if (developer.wfcase.actid == "A002")
                {
                    data.baseInfor_Notice.status = "checkThrough";
                    data.baseInfor_Notice.isSeeInDoor = true;
                    //邮件送达
                    if (data.baseInfor_Notice.isSendEmail == true)
                    {
                        SendEmail(data.baseInfor_Notice, tran,userid);                    
                    }
                }

                SaveData(data, tran, caseid, userid);
                //SetCaseName(data, developer);
                developer.Send();
                developer.Commit();
                return Utility.JsonResult(true, "发送成功！");

            }
            catch (Exception ex)
            {
                developer.RollBack();
                ComBase.Logger(ex);
                throw (new Exception("业务发送失败！", ex));
            }
        }

        //验证输入的信息
        public string ValiadateInput(B_OA_Notice notice)
        {
            StringBuilder strSql = new StringBuilder();
            if (notice.NewsTitle == "" || notice.NewsTitle == null)
            {
                strSql.Append("\n标题不能为空。");
            }


            if (notice.documentTypeId == "" || notice.documentTypeId == null)
            {
                strSql.Append("\n请选择文件类型，文件类型不能为空。");
            }

            //会议通知
            if (notice.isConferenceInform == true)
            {
                if (notice.conferenceEndDate == "" || notice.conferenceEndDate == null)
                {
                    strSql.Append("\n您勾选了“会议通知”，请选择会议时间。");
                }
            }
            //邮件送达
            if (notice.isSendEmail == true)
            {
                if (notice.sendEmailToManId == "" || notice.sendEmailToManId == null)
                {
                    strSql.Append("\n您勾选了“邮件送达”，请选择收件人。");
                }
            }
            //指定发布范围
            if (notice.publicRange == 1)
            {
                if (notice.rangeCheckManId == "" || notice.rangeCheckManId == null)
                {
                    strSql.Append("\n您选择了指定了发布范围，请选择指定人员。");
                }
            }
            return strSql.ToString();
        }

        //邮件送达
        public void SendEmail(B_OA_Notice notice , IDbTransaction tran,string userid) {
            //邮件送达
            if (notice.isSendEmail == true)
            {
                string Mail_Id = ComClass.GetGuid();
                //保存已发送
                B_Email email = new B_Email();
                email.Mail_ID = Mail_Id;
                email.Mail_CreateData = DateTime.Now.ToString();//发送时间   
                email.ID = Mail_Id;// +"_" + DateTime.Now.ToLocalTime().ToString();/ID主键
                email.Mail_SendPersonId = userid;//发件人ID
                var userInfor = ComClass.GetUserInfo(userid);
                email.Mail_SendPersonName = userInfor.CnName;//发件人姓名
                email.Mail_Deleted = "0";//是否已删除
                email.Mail_deletedPerson = "";//删除人
                email.Mail_Type = "1";//类型,0 未发送,草稿,1已发送
                email.MailDocumentType = "fajian";//的文件夹分类 默认是0收件箱
                email.Mail_IsSee = "0";//是否已被查看
                email.markId = "";//标签id
                email.markName = "";//标签名称
                email.markColor = "";//标签颜色
                email.whosEmailId = userid;//邮件拥有者
                email.Mail_SendDate = DateTime.Now.ToString();//发送时间
                email.emailRecieveDate = DateTime.Now.ToString();//接收事件
                email.isSaveSendBox = true;//保存发件
                email.Mail_ReceivePersonId = notice.sendEmailToManId;//接收人ID
                email.Mail_ReceivePersonName = notice.sendEmailToManName;//接收人名称
                email.isImportant = true;//重要邮件
                email.Mail_Title = "(来自文档中心)" + notice.NewsTitle;//标题
                email.Mail_SendAttachment = notice.ShareAttachment;//附件
                email.Mail_SendText = notice.NewsText;//内容
                Utility.Database.Insert<B_Email>(email, tran);
                //保存给发送方
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
        }

        public void SetCaseName(GetDataModel data, SkyLandDeveloper developer)
        {
            try
            {
                string unitName = data.baseInfor_Notice.NewsTitle;
                string titleType = "文档发布";
                developer.caseName = unitName + "-" + titleType;
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
            }
        }

        public void SaveData(GetDataModel data, IDbTransaction tran, string caseId, string userid)
        {
            if (caseId != null) data.baseInfor_Notice.caseid = caseId;
            data.baseInfor_Notice.Condition.Add("caseid=" + caseId);
            B_OA_Notice en = Utility.Database.QueryObject<B_OA_Notice>(data.baseInfor_Notice);

            if (en == null)
            {
                Utility.Database.Insert(data.baseInfor_Notice, tran);
            }
            else
            {
                Utility.Database.Update(data.baseInfor_Notice, tran);
            }
            //存入文章与文章类别关系表中
            SaveFileType_R(data.baseInfor_Notice, tran);

            //将指定人员查看存入关系表中
            if (data.baseInfor_Notice.publicRange == 1)
            {
                InserAppointManSee(data.baseInfor_Notice, tran);
            }
        }

        //将指定人员查看存入关系表中
        public void InserAppointManSee(B_OA_Notice baseInfor_Notice, IDbTransaction tran)
        {

            string rangeCheckManId = baseInfor_Notice.rangeCheckManId;
            string[] manIdArray = rangeCheckManId.Split(';');
            //删除原数据
            B_OA_Notice_AppointManSee manSee_Delete = new B_OA_Notice_AppointManSee();
            manSee_Delete.Condition.Add("noticeid =" + baseInfor_Notice.NewsId);
            Utility.Database.Delete(manSee_Delete, tran);

            for (var range = 0; range < manIdArray.Length - 1; range++)
            {
                B_OA_Notice_AppointManSee manSee = new B_OA_Notice_AppointManSee();
                manSee.noticeid = baseInfor_Notice.NewsId;
                manSee.userid = manIdArray[range];
                Utility.Database.Insert(manSee, tran);
            }
        }

        //保存到关系表中
        public void SaveFileType_R(B_OA_Notice notice, IDbTransaction tran)
        {
            //删除文章与目录关系表
            B_OA_Notice_FileType_R del_nf_R = new B_OA_Notice_FileType_R();
            del_nf_R.Condition.Add("noticeId = " + notice.NewsId);
            Utility.Database.Delete(del_nf_R, tran);
            //保存关系表
            string[] documenTypeArray = notice.documentTypeId.Split('/');
            for (int k = 0; k < documenTypeArray.Length; k++)
            {
                B_OA_Notice_FileType_R nf_R = new B_OA_Notice_FileType_R();
                nf_R.noticeId = notice.NewsId;
                nf_R.fileTypeId = documenTypeArray[k];

                Utility.Database.Insert(nf_R, tran);
            }
        }


        public class GetDataModel
        {
            public B_OA_Notice baseInfor_Notice;
        }

        public override string Key
        {
            get
            {
                return "B_OA_TrafficFlow_PublicNoticeSvc";
            }
        }
    }
}
