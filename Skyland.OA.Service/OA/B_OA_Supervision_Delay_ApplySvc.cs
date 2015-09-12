using IWorkFlow.BaseService;
using IWorkFlow.Host;
using IWorkFlow.OfficeService.OpenXml;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BizService.Services
{
    class B_OA_Supervision_Delay_ApplySvc : BaseDataHandler
    {
        string rootPath = HttpContext.Current.Server.MapPath("/");

        [DataAction("GetData", "userid", "caseId", "baid")]
        public object GetData(string userid, string caseId, string baid)
        {
            //只有待办箱才有设置为已读
            if (!String.IsNullOrEmpty(baid)) engineAPI.SetIsReaded(caseId, baid, userid);

            GetDataModel data = new GetDataModel();
            B_OA_Supervision_Delay_Apply en = new B_OA_Supervision_Delay_Apply();
            en.Condition.Add("caseId=" + caseId);
            data.delayApplyBaseInfor = Utility.Database.QueryObject<B_OA_Supervision_Delay_Apply>(en);
            if (data.delayApplyBaseInfor == null)
            {
                var baseInfo = new B_OA_Supervision_Delay_Apply();
                baseInfo.createDate = DateTime.Now.ToString();
                baseInfo.applyManId = userid;
                baseInfo.applyManName = ComClass.GetUserInfo(userid).CnName;
                data.delayApplyBaseInfor = baseInfo;
            }
            data.userid = userid;
            return data;
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
                    string unitName = data.delayApplyBaseInfor.title;
                    string titleType = "督办延期申请";
                    developer.caseName = unitName + "-" + titleType;
                    caseid = developer.Create();
                }
                StringBuilder strSql = new StringBuilder();
                SaveData(data, tran, caseid);
                //SetCaseName(data, developer);
                developer.Send();
                //修改延期时间
                if (developer.wfcase.actid == "A003")
                {
                    SetLimiteData(caseid, tran);
                }
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

        public void SetLimiteData(string caseid, IDbTransaction tran)
        {
            B_OA_Supervision_Delay_Apply delay = new B_OA_Supervision_Delay_Apply();
            delay.Condition.Add("caseId = " + caseid);
            delay = Utility.Database.QueryObject<B_OA_Supervision_Delay_Apply>(delay, tran);

            StringBuilder strSql = new StringBuilder();
            strSql.AppendFormat(@"select * from B_OA_Supervision where caseId =(
            select relationCaseId from B_OA_Supervision_Delay_Apply where caseId = '{0}')", delay.caseId);
            DataSet sightureDs = Utility.Database.ExcuteDataSet(strSql.ToString());
            string jsonData = JsonConvert.SerializeObject(sightureDs.Tables[0]);
            List<B_OA_Supervision> supervision = (List<B_OA_Supervision>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_Supervision>));

            for (int i = 0; i < supervision.Count; i++)
            {
                supervision[i].limiteDate = delay.delayDate;
                supervision[i].Condition.Add("id = " + supervision[i].id);
                Utility.Database.Update(supervision[i], tran);
            }
        }

        public B_OA_Supervision_Delay_Apply SaveData(GetDataModel data, IDbTransaction tran, string caseId)
        {
            StringBuilder strSql = new StringBuilder();
            if (caseId != null) data.delayApplyBaseInfor.caseId = caseId;
            data.delayApplyBaseInfor.Condition.Add("caseId=" + data.delayApplyBaseInfor.caseId);
            B_OA_Supervision_Delay_Apply en = Utility.Database.QueryObject<B_OA_Supervision_Delay_Apply>(data.delayApplyBaseInfor);
            //如果主键和id都为空，插入信息
            if (data.delayApplyBaseInfor.id == 0)
            {

                Utility.Database.Insert(data.delayApplyBaseInfor, tran);
                strSql.Clear();
                strSql.AppendFormat(@"select @@IDENTITY");
                int id = Utility.Database.QueryObject<int>(strSql.ToString(), tran);
                data.delayApplyBaseInfor.id = id;
            }
            else
            {
                Utility.Database.Update(data.delayApplyBaseInfor, tran);
            }
            return data.delayApplyBaseInfor;

        }

        [DataAction("GetWorkFlowCaseByCaseId", "caseId")]
        public string GetWorkFlowCaseByCaseId(string caseId)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            GetDataModel dataModel = new GetDataModel();
            try
            {
                FX_WorkFlowBusAct work = new FX_WorkFlowBusAct();
                work.Condition.Add("CaseID = " + caseId);
                dataModel.listWorkFlow = Utility.Database.QueryList<FX_WorkFlowBusAct>(work, tran);
                //读取签发
                DataTable dataTable = ComClass.GetSighture(caseId, "0", tran);
                string jsonData = JsonConvert.SerializeObject(dataTable);
                List<B_OA_Sighture> listSighture = (List<B_OA_Sighture>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_Sighture>));
                dataModel.listSighture = listSighture;
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, null, dataModel);//将对象转为json字符串并返回到客户端

            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, "发送失败：" + ex.Message.Replace(":", " "));
            }
        }

        public void SetCaseName(GetDataModel data, SkyLandDeveloper developer)
        {
            try
            {
                string unitName = data.delayApplyBaseInfor.title;
                string titleType = "督办延期申请";
                developer.caseName = unitName + "-" + titleType;
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
            }

        }

        [DataAction("Print", "caseId")]
        public string Print(string caseId)
        {
            try
            {
                IDbTransaction tran = Utility.Database.BeginDbTransaction();

                if (caseId == null || caseId == "") return Utility.JsonResult(false, "业务为空，不能打印");
                DateTime dateTime = DateTime.Now;
                string wordPath = rootPath + "officeFileModel\\Supervision\\督办延期申请单.docx";
                string targetpath = rootPath + "officeFile\\Supervision\\督办延期申请单_" + caseId + dateTime.ToLongDateString() + dateTime.Hour + "时" + dateTime.Minute + "分" + dateTime.Second + "秒";

                targetpath = targetpath.Replace("\\", "/");
                wordPath = wordPath.Replace("\\", "/");
                targetpath += ".docx";
                var dic = CreateWrodData(caseId, tran);
                IWorkFlow.OfficeService.IWorkFlowOfficeHandler.ProduceWord2007UP(wordPath, targetpath, dic);
                foreach (var item in dic)
                {
                    if (item.Value is Image)
                    {
                        var img = item.Value as Image;
                        img.Dispose();
                    }
                };
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "", targetpath);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, "打印失败：" + ex.Message.Replace(":", " "));
            }
        }


        /// <summary>
        /// 创建一个Word数据
        /// </summary>
        /// <param name="caseid"></param>
        /// <returns></returns>
        private Dictionary<string, Object> CreateWrodData(string caseId, IDbTransaction tran)
        {

            B_OA_Supervision_Delay_Apply en = new B_OA_Supervision_Delay_Apply();
            en.Condition.Add("caseId = " + caseId);//设置查询条件
            en = Utility.Database.QueryObject<B_OA_Supervision_Delay_Apply>(en);
            Dictionary<string, Object> list = new Dictionary<string, Object> {
                {"title",en.title },//收文日期
                {"delayReson",en.applyReason},//延期理由
                {"delayDate",en.delayDate.ToString()},//延期时间
                };

            //读取签发图片
            StringBuilder strSql = new StringBuilder();
            strSql.AppendFormat(@"select s.*,u.CnName from B_OA_Sighture as s
            LEFT JOIN FX_UserInfo as u on s.userid = u.UserID
            where s.caseid='{0}' and s.tableName='{1}'  and s.type='{2}'", caseId, "B_OA_Supervision_Delay_Apply", "0");
            DataSet sightureDs = Utility.Database.ExcuteDataSet(strSql.ToString());
            string jsonData = JsonConvert.SerializeObject(sightureDs.Tables[0]);
            List<B_OA_Sighture> listSighture = (List<B_OA_Sighture>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_Sighture>));

            if (listSighture.Count > 0)
            {

                var leaderList = new List<B_OA_Sighture>();
                var assitantList = new List<B_OA_Sighture>();

                for (int i = 0; i < listSighture.Count; i++)
                {

                    //领导批示
                    if (listSighture[i].columnName == "learderApproval")
                    {
                        leaderList.Add(listSighture[i]);

                    }
                    else if (listSighture[i].columnName == "assitanLeaderSighture")
                    {
                        assitantList.Add(listSighture[i]);
                    }
                }

                var leaderSightureStr = new OpenXmlHelper.ImageTextArray[leaderList.Count];
                var assitanSightureStr = new OpenXmlHelper.ImageTextArray[assitantList.Count];

                for (var j = 0; j < leaderList.Count; j++)
                {
                    B_OA_Sighture sighture_leader = new B_OA_Sighture();
                    sighture_leader = leaderList[j];
                    string rootPath = HttpContext.Current.Server.MapPath("/");
                    rootPath = rootPath.Replace("\\", "/");
                    string path = rootPath + sighture_leader.path;
                    if (File.Exists(path))
                    {
                        leaderSightureStr[j] = new OpenXmlHelper.ImageTextArray();
                        leaderSightureStr[j].Images = System.Drawing.Image.FromFile(path);
                        leaderSightureStr[j].Foots = sighture_leader.CnName + " " + Convert.ToDateTime(sighture_leader.createtime).ToString("yyyy年MM月dd日");
                        leaderSightureStr[j].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
                    }
                }

                for (var k = 0; k < assitantList.Count; k++)
                {
                    B_OA_Sighture sighture_assistant = new B_OA_Sighture();
                    sighture_assistant = assitantList[k];
                    string rootPath = HttpContext.Current.Server.MapPath("/");
                    rootPath = rootPath.Replace("\\", "/");
                    string path = rootPath + sighture_assistant.path;
                    if (File.Exists(path))
                    {
                        assitanSightureStr[k] = new OpenXmlHelper.ImageTextArray();
                        assitanSightureStr[k].Images = System.Drawing.Image.FromFile(path);
                        assitanSightureStr[k].Foots = sighture_assistant.CnName + " " + Convert.ToDateTime(sighture_assistant.createtime).ToString("yyyy年MM月dd日");
                        assitanSightureStr[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
                    }
                }
                if (assitanSightureStr.Count() > 0)
                {
                    list.Add("assistanSiggestion", assitanSightureStr);

                }

                if (leaderSightureStr.Count() > 0)
                {
                    list.Add("leaderSuggesion", leaderSightureStr);
                }
            }

            strSql.Clear();
            strSql.AppendFormat("select CaseId,ActID,UserName,ReceDate,Remark from FX_WorkFlowBusAct where CaseID = '{0}' order by ReceDate asc", caseId);
            DataSet busSet = Utility.Database.ExcuteDataSet(strSql.ToString());
            string jsonData_bus = JsonConvert.SerializeObject(busSet.Tables[0]);
            List<FX_WorkFlowBusAct> wfbaList = (List<FX_WorkFlowBusAct>)JsonConvert.DeserializeObject(jsonData_bus, typeof(List<FX_WorkFlowBusAct>));

            List<string> listString = new List<string>();
            for (int i = 0; i < wfbaList.Count; i++)
            {
                // 拟稿部门负责人核稿wfbaList[i].ActID == "A002" || 
                if (wfbaList[i].ActID == "A004")
                {
                    listString.Add(wfbaList[i].Remark + "--" + wfbaList[i].UserName + " " + wfbaList[i].ReceDate.ToString("yyyy年MM月dd日 hh:mm"));
                }
            }
            if (listString.Count > 0)
            {
                list.Add("officeSuggesion", listString);
            }
            return list;
        }


        public class GetDataModel
        {
            public B_OA_Supervision_Delay_Apply delayApplyBaseInfor;
            public List<FX_AttachMent> listAttachment;
            public List<FX_WorkFlowBusAct> listWorkFlow;
            public List<B_OA_Sighture> listSighture;
            public string userid;
        }

        public override string Key
        {
            get
            {
                return "B_OA_Supervision_Delay_ApplySvc";
            }
        }
    }
}
