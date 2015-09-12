using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BizService.Common;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using System.Data;
using System.Web;
using System.IO;
using Newtonsoft.Json.Linq;
using System.Drawing;
using IWorkFlow.BaseService;

namespace BizService.Services
{
    class B_OA_Supervision_ReminderSvc : BaseDataHandler
    {
        [DataAction("GetData", "userid", "caseId", "baid")]
        public object GetData(string userid, string caseId, string baid)
        {
            //只有待办箱才有设置为已读
            if (!String.IsNullOrEmpty(baid)) engineAPI.SetIsReaded(caseId, baid, userid);

            GetDataModel data = new GetDataModel();
            B_OA_SupervisionReminder en = new B_OA_SupervisionReminder();
            en.Condition.Add("caseId=" + caseId);
            data.reminderBaseInfor = Utility.Database.QueryObject<B_OA_SupervisionReminder>(en);

            B_OA_Supervision_Bill supervisionBill = new B_OA_Supervision_Bill();
            supervisionBill.Condition.Add("caseid =" + caseId);
            data.supervisionBill = Utility.Database.QueryObject<B_OA_Supervision_Bill>(supervisionBill);

            if (data.reminderBaseInfor == null)
            {
                var baseInfo = new B_OA_SupervisionReminder();
                baseInfo.createDate = DateTime.Now.ToString();
                baseInfo.reminderManId = userid;
                baseInfo.reminderManName = ComClass.GetUserInfo(userid).CnName;
                data.reminderBaseInfor = baseInfo;

                //督办通知单据
                B_OA_Supervision_Bill supervisionBill_ad = new B_OA_Supervision_Bill();
                supervisionBill_ad.content = GetSupervisionBill();
                supervisionBill_ad.year = DateTime.Now.Year.ToString();
                supervisionBill_ad.createDate = DateTime.Now.ToString("yyyy年MM月dd日");
                data.supervisionBill = supervisionBill_ad;
            }
            return data;
        }


        public string GetSupervisionBill()
        {

            StringBuilder billDiv = new StringBuilder();
            billDiv.Append(@"
                       <p style='text-align: left;'><u><span style='font-size:16pt'>_ </span></u><u><span style='font-size:16pt'>：</span></u></p>
                       <p style='text-align: left;'><span style='font-size:16pt'>&nbsp;&nbsp;&nbsp; 根据<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>（）
                       文件要求及领导批示精神，现将该件转你科室（单位）办理，请你单位于<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>月<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>日前将办理结果报送局办公室及相关部门。</span></p>
                        ");
            return billDiv.ToString();
        }

        [DataAction("GetSupervisionReminderNotice", "keyId")]
        public string GetSupervisionReminderNotice(string keyId)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            GetDataModel dataModel = new GetDataModel();
            B_OA_Supervision_Reminder_Notice reminderNotice = new B_OA_Supervision_Reminder_Notice();
            try
            {

                reminderNotice.Condition.Add("caseid = " + keyId);
                B_OA_Supervision_Reminder_Notice result = Utility.Database.QueryObject<B_OA_Supervision_Reminder_Notice>(reminderNotice, tran);
                if (result == null)
                {
                    reminderNotice.year = DateTime.Now.Year.ToString();
                    reminderNotice.createDate = DateTime.Now.ToString();
                    reminderNotice.supervisionDate = DateTime.Now.ToString("yyyy年MM月dd日");
                }
                else
                {
                    reminderNotice = result;
                }
                dataModel.reminderNoticeBaseInfor = reminderNotice;
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存成功", dataModel);

            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

        /// <summary>
        /// 保存催办通知书
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
        [DataAction("SaveSupervisionReminderNotice", "content")]
        public string SaveSupervisionReminderNotice(string content)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_Supervision_Reminder_Notice reminderNotice = JsonConvert.DeserializeObject<B_OA_Supervision_Reminder_Notice>(content);
                if (reminderNotice.id == 0)
                {
                    Utility.Database.Insert(reminderNotice, tran);
                }
                else
                {
                    reminderNotice.Condition.Add("id = " + reminderNotice.id);
                    Utility.Database.Update(reminderNotice, tran);
                }
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存成功");
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

        [DataAction("send", "BizParams", "userid", "content")]
        public string Send(string BizParams, string userid, string content)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            SkyLandDeveloper developer = new SkyLandDeveloper(BizParams, userid, tran);
            try
            {


                GetDataModel data = JsonConvert.DeserializeObject<GetDataModel>(content);// new SaveDataModel();  

                string caseid = developer.caseid;
                if (String.IsNullOrEmpty(caseid))
                {
                    string unitName = data.reminderBaseInfor.title;
                    string titleType = "催办事项";
                    developer.caseName = unitName + "-" + titleType;
                    caseid = developer.Create();
                }
                if (developer.wfcase.actid == "A001")
                {
                    data.reminderBaseInfor.code = CreateSendNo("DBCB", tran);

                    //当此文未草稿的时候并未生成caseid，而存的是guid，此步骤是将正文路径的caseid字段修改成caseid
                    ChangeGuidToCaseId(developer.wfcase.guid, caseid, tran);

                    //保存督办申请单
                    data.supervisionBill.issuerManId = data.reminderBaseInfor.issuerManId;
                    data.supervisionBill.issuerManName = data.reminderBaseInfor.issuerManName.Replace(';',' ');
                    SaveSupervisionNoticeBill(data.supervisionBill, caseid, tran);
                }
                SaveData(data, tran, caseid);
                // SetCaseName(data, developer);
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

        //保存督办申请单
        public void SaveSupervisionNoticeBill(B_OA_Supervision_Bill supervisionBill, string caseid, IDbTransaction tran)
        {
            if (supervisionBill.id == 0)
            {
                //编号
                string code = CommonFunctional.getCommonCode("supervisionReminderNoticeCode", tran).code;
                supervisionBill.code = code;
                //督办类别 0为督办申请单
                supervisionBill.type = 0;
                supervisionBill.caseid = caseid;
                Utility.Database.Insert(supervisionBill, tran);
            }
            else
            {
                Utility.Database.Update(supervisionBill, tran);
            }
        }


        /// <summary>
        /// 自动生成发文文号
        /// </summary>
        /// <param name="type"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string CreateSendNo(string codeType, IDbTransaction tran)
        {
            string code = CommonFunctional.getCommonCode(codeType, tran).code;
            int i = int.Parse(code);
            code = i.ToString("000000");
            code = codeType + code;
            return code;
        }

        public B_OA_SupervisionReminder SaveData(GetDataModel data, IDbTransaction tran, string caseId)
        {
            StringBuilder strSql = new StringBuilder();
            if (caseId != null) data.reminderBaseInfor.caseId = caseId;
            data.reminderBaseInfor.Condition.Add("caseId=" + data.reminderBaseInfor.caseId);
            B_OA_SupervisionReminder en = Utility.Database.QueryObject<B_OA_SupervisionReminder>(data.reminderBaseInfor);
            //如果主键和id都为空，插入信息
            if (data.reminderBaseInfor.id == 0)
            {

                Utility.Database.Insert(data.reminderBaseInfor, tran);
                strSql.Clear();
                strSql.AppendFormat(@"select @@IDENTITY");
                int id = Utility.Database.QueryObject<int>(strSql.ToString(), tran);
                data.reminderBaseInfor.id = id;
            }
            else
            {
                Utility.Database.Update(data.reminderBaseInfor, tran);
            }
            return data.reminderBaseInfor;

        }

        [DataAction("UpdateReminderCount", "caseid", "count", "userid")]
        public string UpdateReminderCount(string caseid, string count, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_SupervisionReminder reminder = new B_OA_SupervisionReminder();
                reminder.Condition.Add("caseId = " + caseid);
                reminder = Utility.Database.QueryObject<B_OA_SupervisionReminder>(reminder, tran);
                if (reminder != null)
                {
                    reminder.reminderCount = int.Parse(count);
                    reminder.Condition.Add("id =" + reminder.id);
                    Utility.Database.Update(reminder, tran);
                }
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "数据加载成功");//将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + ex.Message);
            }
        }

        public void SetCaseName(GetDataModel data, SkyLandDeveloper developer)
        {
            try
            {
                string unitName = data.reminderBaseInfor.title;
                string titleType = "催办事项";
                developer.caseName = unitName + "-" + titleType;
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
            }

        }

        public void ChangeGuidToCaseId(string guid, string caseid, IDbTransaction tran)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.AppendFormat("select * from B_OA_Supervision_Reminder_Notice where caseid = '{0}'", guid);
            DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString());
            if (ds.Tables[0].Rows.Count > 0)
            {
                string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
                List<B_OA_Supervision_Reminder_Notice> list = (List<B_OA_Supervision_Reminder_Notice>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_Supervision_Reminder_Notice>));
                for (int i = 0; i < list.Count; i++)
                {
                    B_OA_Supervision_Reminder_Notice notice = new B_OA_Supervision_Reminder_Notice();
                    notice = list[i];
                    notice.caseid = caseid;
                    notice.Condition.Add("id = " + notice.id);
                    Utility.Database.Update(notice, tran);
                }
            }
        }


        public class GetDataModel
        {
            public B_OA_SupervisionReminder reminderBaseInfor;
            public B_OA_Supervision_Reminder_Notice reminderNoticeBaseInfor;
            public B_OA_Supervision_Bill supervisionBill;

        }

        public override string Key
        {
            get
            {
                return "B_OA_Supervision_ReminderSvc";
            }
        }

    }
}
