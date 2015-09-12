using System.Drawing;
using BizService.Common;
using IWorkFlow.Host;
using IWorkFlow.OfficeService.OpenXml;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Web;
using IWorkFlow.BaseService;


namespace BizService.Services.Common
{
    public class B_OA_MeetingSvc : BaseDataHandler
    {
        private DataTable mPrintTable = new DataTable();
        private string rootPath = HttpContext.Current.Server.MapPath("/");

        /// <summary>
        /// 获取用户常用语数据模型 
        /// </summary>
        public class GetDataModel
        {
            public B_OA_Meeting baseInfo;
            public List<B_OA_Meeting> dataList;
            public B_OA_Meeting editData = new B_OA_Meeting();
        }

        /// <summary>
        /// 保存数据模型
        /// </summary>
        public class SaveDataModel
        {
            public B_OA_Meeting baseInfo;
            public KOGridEdit<B_OA_Meeting> list;
        }

        /// <summary>
        /// 获取会议数据
        /// </summary>
        /// <param name="userid">当前用户ID</param>
        /// <returns>返回json数据结果</returns>
        [DataAction("GetData", "caseid", "userid")]
        public string GetData(string caseId, string userid)
        {
            StringBuilder strSql = new StringBuilder();
            GetDataModel dataModel = new GetDataModel();
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                strSql.Append(String.Format(@"SELECT  
	A.MeetingID ,A.MeetingRoomID ,OrganizID ,A.Phone ,MeetingName ,Presenter ,CONVERT(VARCHAR(10),A.StartTime,120) AS MeetingDate,CONVERT(VARCHAR(16),StartTime,120) AS StartTime ,
 CONVERT(VARCHAR(16),EndTime,120) AS EndTime ,SUBSTRING(CONVERT(VARCHAR(16),StartTime,120),6,11) AS sStartTime ,SUBSTRING(CONVERT(VARCHAR(16),EndTime,120),6,11) AS sEndTime,
    A.Number ,(CASE A.STATUS WHEN 0 THEN '待审批' WHEN 1 THEN '已审批' END) AS StatusText,A.STATUS,
    A.Remark ,Applicant ,CreatTime ,Approver ,ApprovalTime,B.MeetingRoomName,ISNULL(STUFF((SELECT '、' + B.DeviceName FROM
	(SELECT MeetingRoomID,DeviceName
	FROM B_OA_Device WHERE MeetingRoomID = A.MeetingRoomID)B
	FOR XML PATH ('')),1,1,''),'无') AS Device,A.ParticipantName,B.Number AS MaxNumber,CaseID,NeedDevice,Purpose,C.CnName AS OrganizerName,D.FullName AS Dpname,DpnameID,
ISNULL(STUFF((SELECT ';' + E.UserID FROM
	(SELECT MeetingID,UserID
	FROM B_OA_Participant WHERE MeetingID = A.MeetingID)E
	FOR XML PATH ('')),1,1,''),'') AS ParticipantNameid,
	ISNULL(STUFF((SELECT ';' + E.CnName FROM
	(SELECT MeetingID,CnName
	FROM B_OA_Participant F
	LEFT JOIN FX_UserInfo G ON F.UserID = G.UserID
	 WHERE MeetingID = A.MeetingID)E
	FOR XML PATH ('')),1,1,''),'') AS ParticipantNames
FROM 
	B_OA_Meeting A
	LEFT JOIN B_OA_MeetingRoom B ON B.MeetingRoomID = A.MeetingRoomID
LEFT JOIN FX_UserInfo C ON A.OrganizID = C. UserID
LEFT JOIN FX_Department D ON A.DpnameID = D.DPID
WHERE A.CaseID = '{0}'
ORDER BY A.MeetingID DESC
", caseId));

                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
                dataModel.dataList = (List<B_OA_Meeting>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_Meeting>));
                mPrintTable = dataSet.Tables[0];
                if (caseId == "")
                {
                    dataModel.baseInfo = new B_OA_Meeting();
                    dataModel.baseInfo.OrganizID = userid;
                    dataModel.baseInfo.OrganizerName = ComClass.GetUserInfo(userid).CnName;
                    dataModel.baseInfo.DpnameID = ComClass.GetUserInfo(userid).DPID;
                    dataModel.baseInfo.Dpname = ComClass.GetDeptByUserId(userid).DPName;
                }
                else
                    dataModel.baseInfo = dataModel.dataList[0];
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, null, dataModel);

            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, "读取失败:" + ex.Message.Replace(":", " "));
            }
        }

        /// <summary>
        /// 获取会议数据
        /// </summary>
        /// <param name="userid">当前用户ID</param>
        /// <returns>返回json数据结果</returns>
        [DataAction("SearchDate", "startTime", "endTime", "userid")]
        public string SearchDate(string startTime, string endTime, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                StringBuilder strSql = new StringBuilder();
                GetDataModel dataModel = new GetDataModel();
                strSql.Append(String.Format(@"SELECT  
	A.MeetingID ,A.MeetingRoomID ,OrganizID ,A.Phone ,MeetingName ,Presenter ,CONVERT(VARCHAR(10),MeetingDate,120) AS MeetingDate,CONVERT(VARCHAR(16),StartTime,120) AS StartTime ,
 CONVERT(VARCHAR(16),EndTime,120) AS EndTime ,SUBSTRING(CONVERT(VARCHAR(16),StartTime,120),6,11) AS sStartTime ,SUBSTRING(CONVERT(VARCHAR(16),EndTime,120),6,11) AS sEndTime,
    A.Number ,(CASE A.STATUS WHEN 0 THEN '待审批' WHEN 1 THEN '已审批' END) AS StatusText,A.STATUS,
    A.Remark ,Applicant ,CreatTime ,Approver ,ApprovalTime,B.MeetingRoomName,ISNULL(STUFF((SELECT '、' + B.DeviceName FROM
	(SELECT MeetingRoomID,DeviceName
	FROM B_OA_Device WHERE MeetingRoomID = A.MeetingRoomID)B
	FOR XML PATH ('')),1,1,''),'无') AS Device,A.ParticipantName,B.Number AS MaxNumber,CaseID,NeedDevice,Purpose,C.CnName AS OrganizerName,D.FullName AS Dpname,DpnameID,
ISNULL(STUFF((SELECT ';' + E.UserID FROM
	(SELECT MeetingID,UserID
	FROM B_OA_Participant WHERE MeetingID = A.MeetingID)E
	FOR XML PATH ('')),1,1,''),'') AS ParticipantNameid,
	ISNULL(STUFF((SELECT ';' + E.CnName FROM
	(SELECT MeetingID,CnName
	FROM B_OA_Participant F
	LEFT JOIN FX_UserInfo G ON F.UserID = G.UserID
	 WHERE MeetingID = A.MeetingID)E
	FOR XML PATH ('')),1,1,''),'') AS ParticipantNames
FROM 
	B_OA_Meeting A
	LEFT JOIN B_OA_MeetingRoom B ON B.MeetingRoomID = A.MeetingRoomID
LEFT JOIN FX_UserInfo C ON A.OrganizID = C. UserID
LEFT JOIN FX_Department D ON A.DpnameID = D.DPID
WHERE 
    StartTime >= '{0}'
    AND EndTime <= '{1}'
ORDER BY A.MeetingID DESC
", startTime, endTime));
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
                dataModel.dataList = (List<B_OA_Meeting>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_Meeting>));
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, null, dataModel);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, "读取失败:" + ex.Message.Replace(":", " "));
            }
        }


        /// <summary>
        /// 获取数据
        /// </summary>
        /// <param name="userid">当前用户ID</param>
        /// <returns>返回json数据结果</returns>
        [DataAction("loadData", "userid")]
        public string LoadData(string cph, string sfky, string userid)
        {
            GetDataModel data = new GetDataModel();
            B_OA_Meeting list = new B_OA_Meeting();
            data.dataList = Utility.Database.QueryList(list);
            data.baseInfo = new B_OA_Meeting();
            return Utility.JsonResult(true, null, data);
        }

        //保存数据
        public void SaveData(SaveDataModel data, IDbTransaction tran, string caseId)
        {
            try
            {
                if (caseId != null) data.baseInfo.CaseID = caseId;
                int meetingID = 0;
                data.baseInfo.Condition.Add("CaseID=" + data.baseInfo.CaseID);
                StringBuilder strSql = new StringBuilder();
                //更新或插入主业务信息
                if (Utility.Database.Update<B_OA_Meeting>(data.baseInfo, tran) < 1)
                {
                    if (Utility.Database.Insert<B_OA_Meeting>(data.baseInfo, tran) > 0)
                    {
                        //取得当前工作班次
                        strSql = new StringBuilder();
                        strSql.Append("SELECT @@IDENTITY AS MeetingID FROM B_OA_Meeting");
                        DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                        if (dataSet.Tables[0].Rows.Count > 0)
                        {
                            if (dataSet.Tables[0].Rows.Count > 0)
                                meetingID = Convert.ToInt32(dataSet.Tables[0].Rows[0]["MeetingID"]);
                        }
                    }
                }
                else
                {
                    meetingID = data.baseInfo.MeetingID;
                    //删除参数人员表信息
                    strSql.Append("DELETE FROM B_OA_Participant WHERE MeetingID = " + meetingID);
                    Utility.Database.ExecuteNonQuery(strSql.ToString(), tran);
                }

                //插入参会人员
                string[] pItem = data.baseInfo.ParticipantNameid.Split(';');
                for (int i = 0; i < pItem.Length; i++)
                {
                    if (pItem[i].ToString().Trim() == "")
                        continue;
                    B_OA_Participant participant = new B_OA_Participant();
                    participant.MeetingID = meetingID;
                    participant.UserID = pItem[i];
                    Utility.Database.Insert<B_OA_Participant>(participant, tran);
                }
            }
            catch (Exception e)
            {
                ComBase.Logger(e);
                throw e;
            }
        }

        //发送
        [DataAction("send", "BizParams", "userid", "content")]
        public string Send(string BizParams, string userid, string content)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            SkyLandDeveloper developer = new SkyLandDeveloper(BizParams, userid, tran);
            try
            {
                SaveDataModel data = JsonConvert.DeserializeObject<SaveDataModel>(content);

                StringBuilder strSql = new StringBuilder();
                strSql.Append(@"SELECT MeetingName,StartTime,EndTime, B.CnName FROM B_OA_Meeting A
LEFT JOIN FX_UserInfo B ON A.OrganizID = B. UserID
WHERE MeetingID <> " + data.baseInfo.MeetingID + " AND  MeetingRoomID = " + data.baseInfo.MeetingRoomID + " AND(('" + data.baseInfo.StartTime + "' Between StartTime and EndTime)OR ('" + data.baseInfo.EndTime + "' Between StartTime and EndTime))");
                DataTable table = Utility.Database.ExcuteDataSet(strSql.ToString()).Tables[0];
                if (table.Rows.Count > 0)
                    return Utility.JsonResult(false, "时间：" + table.Rows[0]["StartTime"].ToString() + " 至 " + table.Rows[0]["EndTime"].ToString() + "\n申请人：" + table.Rows[0]["CnName"].ToString());

                string caseid = data.baseInfo.CaseID;
                if (caseid == null || caseid.Equals(""))
                {
                    caseid = developer.Create();//生成一个业务流ID
                }

                if (developer.wfcase.actid == "A001")
                {
                    data.baseInfo.Applicant = userid;
                    data.baseInfo.CreatTime = DateTime.Now.ToString();
                }
                else if (developer.wfcase.actid == "A002")
                {
                    data.baseInfo.Approver = userid;
                    data.baseInfo.ApprovalTime = DateTime.Now.ToString();
                    data.baseInfo.Status = 1;
                }
                SaveData(data, tran, caseid);
                developer.caseName = data.baseInfo.MeetingName + "-会议申请";// 设置流程实例标题
                developer.Send();
                developer.Commit();
                return Utility.JsonResult(true, "发送成功！");
            }
            catch (Exception ex)
            {
                developer.RollBack();
                ComBase.Logger(ex);
                return Utility.JsonResult(false, "发送失败:" + ex.Message.Replace(":", " "));
            }
        }

        /// <summary>
        /// 获取会议数据
        /// </summary>
        /// <param name="userid">当前用户ID</param>
        /// <returns>返回json数据结果</returns>
        [DataAction("QueryMyMeetings", "userid")]
        public string QueryMyMeetings(string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                StringBuilder strSql = new StringBuilder();
                GetDataModel dataModel = new GetDataModel();
                strSql.Append(String.Format(@"SELECT  
	A.MeetingID  ,A.MeetingName ,CONVERT(VARCHAR(10),A.MeetingDate,120) AS MeetingDate,CONVERT(VARCHAR(16),A.StartTime,120) AS StartTime ,
 CONVERT(VARCHAR(16),A.EndTime,120) AS EndTime ,SUBSTRING(CONVERT(VARCHAR(16),A.StartTime,120),6,11) AS sStartTime ,
SUBSTRING(CONVERT(VARCHAR(16),A.EndTime,120),6,11) AS sEndTime,A.CaseID,A.NeedDevice,A.Purpose,A.Remark,SUBSTRING(CONVERT(VARCHAR(16),ApprovalTime,120),6,11) AS ApprovalTime
FROM 
	B_OA_Meeting A
	LEFT JOIN B_OA_Participant E ON E.MeetingID = A.MeetingID 
WHERE 
	E.UserID = '{0}'
	AND A.STATUS = 1
	AND A.StartTime > GETDATE()
ORDER BY A.MeetingID DESC
", userid));
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
                dataModel.dataList = (List<B_OA_Meeting>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_Meeting>));
                return Utility.JsonResult(true, null, dataModel);
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);
                return Utility.JsonResult(false, "发送失败:" + ex.Message.Replace(":", " "));
            }
        }

        /// <summary>
        /// 获取会议数据
        /// </summary>
        /// <param name="userid">当前用户ID</param>
        /// <returns>返回json数据结果</returns>
        [DataAction("QueryMeetingByMeetingID", "MeetingID", "userid")]
        public string QueryMeetingByMeetingID(string MeetingID, string userid)
        {
            StringBuilder strSql = new StringBuilder();
            GetDataModel dataModel = new GetDataModel();
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                strSql.Append(String.Format(@"SELECT  
	A.MeetingID ,A.MeetingRoomID ,OrganizID ,A.Phone ,MeetingName ,Presenter ,CONVERT(VARCHAR(10),StartTime,120) AS MeetingDate,CONVERT(VARCHAR(16),StartTime,120) AS StartTime ,
 CONVERT(VARCHAR(16),EndTime,120) AS EndTime ,SUBSTRING(CONVERT(VARCHAR(16),StartTime,120),12,5) AS sStartTime ,SUBSTRING(CONVERT(VARCHAR(16),EndTime,120),12,5) AS sEndTime,
    A.Number ,(CASE A.STATUS WHEN 0 THEN '待审批' WHEN 1 THEN '已审批' END) AS StatusText,A.STATUS,
    A.Remark ,Applicant ,CreatTime ,Approver ,CONVERT(VARCHAR(10),ApprovalTime,120) AS ApprovalTime,B.MeetingRoomName,ISNULL(STUFF((SELECT '、' + B.DeviceName FROM
	(SELECT MeetingRoomID,DeviceName
	FROM B_OA_Device WHERE MeetingRoomID = A.MeetingRoomID)B
	FOR XML PATH ('')),1,1,''),'无') AS Device,A.ParticipantName,B.Number AS MaxNumber,CaseID,NeedDevice,Purpose,C.CnName AS OrganizerName,D.FullName AS Dpname,DpnameID,
ISNULL(STUFF((SELECT ';' + E.UserID FROM
	(SELECT MeetingID,UserID
	FROM B_OA_Participant WHERE MeetingID = A.MeetingID)E
	FOR XML PATH ('')),1,1,''),'') AS ParticipantNameid,
	ISNULL(STUFF((SELECT ';' + E.CnName FROM
	(SELECT MeetingID,CnName
	FROM B_OA_Participant F
	LEFT JOIN FX_UserInfo G ON F.UserID = G.UserID
	 WHERE MeetingID = A.MeetingID)E
	FOR XML PATH ('')),1,1,''),'') AS ParticipantNames
FROM 
	B_OA_Meeting A
	LEFT JOIN B_OA_MeetingRoom B ON B.MeetingRoomID = A.MeetingRoomID
LEFT JOIN FX_UserInfo C ON A.OrganizID = C. UserID
LEFT JOIN FX_Department D ON A.DpnameID = D.DPID
WHERE 
	MeetingID = {0}
", Convert.ToInt32(MeetingID)));
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
                dataModel.dataList = (List<B_OA_Meeting>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_Meeting>));
                dataModel.baseInfo = dataModel.dataList[0];
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, null, dataModel);
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);
                return Utility.JsonResult(false, "发送失败:" + ex.Message.Replace(":", " "));
            }
        }

        #region 打印

        public B_OA_Meeting GetMeetingByCaseId(string caseId, IDbTransaction tran)
        {
            StringBuilder strSql = new StringBuilder();
            GetDataModel dataModel = new GetDataModel();
            strSql.Append(String.Format(@"SELECT  
	A.MeetingID ,A.MeetingRoomID ,OrganizID ,A.Phone ,MeetingName ,Presenter ,CONVERT(VARCHAR(10),A.StartTime,120) AS MeetingDate,CONVERT(VARCHAR(16),StartTime,120) AS StartTime ,
 CONVERT(VARCHAR(16),EndTime,120) AS EndTime ,SUBSTRING(CONVERT(VARCHAR(16),StartTime,120),6,11) AS sStartTime ,SUBSTRING(CONVERT(VARCHAR(16),EndTime,120),6,11) AS sEndTime,
    A.Number ,(CASE A.STATUS WHEN 0 THEN '待审批' WHEN 1 THEN '已审批' END) AS StatusText,A.STATUS,
    A.Remark ,Applicant ,CreatTime ,Approver ,ApprovalTime,B.MeetingRoomName,ISNULL(STUFF((SELECT '、' + B.DeviceName FROM
	(SELECT MeetingRoomID,DeviceName
	FROM B_OA_Device WHERE MeetingRoomID = A.MeetingRoomID)B
	FOR XML PATH ('')),1,1,''),'无') AS Device,A.ParticipantName,B.Number AS MaxNumber,CaseID,NeedDevice,Purpose,C.CnName AS OrganizerName,D.FullName AS Dpname,DpnameID,
ISNULL(STUFF((SELECT ';' + E.UserID FROM
	(SELECT MeetingID,UserID
	FROM B_OA_Participant WHERE MeetingID = A.MeetingID)E
	FOR XML PATH ('')),1,1,''),'') AS ParticipantNameid,
	ISNULL(STUFF((SELECT ';' + E.CnName FROM
	(SELECT MeetingID,CnName
	FROM B_OA_Participant F
	LEFT JOIN FX_UserInfo G ON F.UserID = G.UserID
	 WHERE MeetingID = A.MeetingID)E
	FOR XML PATH ('')),1,1,''),'') AS ParticipantNames
FROM 
	B_OA_Meeting A
	LEFT JOIN B_OA_MeetingRoom B ON B.MeetingRoomID = A.MeetingRoomID
LEFT JOIN FX_UserInfo C ON A.OrganizID = C. UserID
LEFT JOIN FX_Department D ON A.DpnameID = D.DPID
WHERE A.CaseID = '{0}'
ORDER BY A.MeetingID DESC
", caseId));

            DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
            string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
            List<B_OA_Meeting> dataList = (List<B_OA_Meeting>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_Meeting>));
            return dataList[0];
        }


        [DataAction("PrintDoc", "caseid", "userid")]
        public object PrintDoc(string caseid, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                string wordPath = CommonFunctional.GetDocumentPathByName("Meeting", "FileModelDir");
                string targetpath = CommonFunctional.GetDocumentPathByName("Meeting", "FileDir");
                targetpath = targetpath + "会议申请表" + caseid + ".docx";
                wordPath = wordPath + "会议申请表.docx";
                var dic = CreateWordSendDocData(caseid, tran);
                IWorkFlow.OfficeService.IWorkFlowOfficeHandler.ProduceWord2007UP(wordPath, targetpath, dic);
                Utility.Database.Commit(tran);
                foreach (var item in dic)
                {
                    if (item.Value is Image)
                    {
                        var img = item.Value as Image;
                        img.Dispose();
                    }
                }
                return new
                {
                    targetpath = targetpath
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);
                throw (new Exception("打印失败！", ex));
            }
        }

        /// <summary>
        /// 创建一个Word数据
        /// </summary>
        /// <param name="caseid"></param>
        /// <returns></returns>
        private Dictionary<string, Object> CreateWordSendDocData(string caseid, IDbTransaction tran)
        {
            B_OA_Meeting data = GetMeetingByCaseId(caseid, tran);
            Dictionary<string, Object> dict = new Dictionary<string, Object>();
            //申请科室
            dict.Add("Dpname", data.Dpname);
            //会议名称
            dict.Add("MeetingName", data.MeetingName == null ? "" : data.MeetingName);
            //内容
            dict.Add("Purpose", data.Purpose == null ? "" : data.Purpose);
            //会议时间
            if (!string.IsNullOrEmpty(data.StartTime.ToString()))
            {
                string StartTime = (DateTime.Parse(data.StartTime.ToString())).ToString("yyyy年MM月dd日 hh时");
                dict.Add("StartTime", StartTime);//主送
            }
            if (!string.IsNullOrEmpty(data.StartTime.ToString()))
            {
                string EndTime = (DateTime.Parse(data.EndTime.ToString())).ToString("yyyy年MM月dd日 hh时");
                dict.Add("EndTime", EndTime);//主送
            }

            //会议地点
            dict.Add("meetingRoomName", data.MeetingRoomName == null ? "" : data.MeetingRoomName);
            //参会人员
            dict.Add("ParticipantNames", data.ParticipantNames == null ? "" : data.ParticipantNames);
            //参会人数
            dict.Add("Number", data.Number.ToString() == null ? "" : data.Number.ToString());
            //参会人数
            dict.Add("OrganizerName", data.OrganizerName == null ? "" : data.OrganizerName);

            //获取所有评阅意见
            FX_WorkFlowBusAct work = new FX_WorkFlowBusAct();
            work.Condition.Add("CaseID = " + caseid);
            work.OrderInfo = "ReceDate asc";
            List<FX_WorkFlowBusAct> listWork = Utility.Database.QueryList<FX_WorkFlowBusAct>(work, tran);
            //将所有工作流信息格式化
            List<B_OA_PrintParagragh> listPara = CommonFunctional.ChangeListToMatch(listWork);
            //办公室核稿意见
            List<B_OA_PrintParagragh> officeSugList = new List<B_OA_PrintParagragh>();
            int k = 0;
            //承办科室负责人意见
            for (k = 0; k < listPara.Count; k++)
            {
                if (listPara[k].ActID == "A002")
                {
                    officeSugList.Add(listPara[k]);
                }
            }
            //办公室核稿意见
            var imgOfficeSugListList = new OpenXmlHelper.ImageTextArray[officeSugList.Count];
            for (k = 0; k < officeSugList.Count; k++)
            {
                imgOfficeSugListList[k] = new OpenXmlHelper.ImageTextArray();
                imgOfficeSugListList[k].Images = officeSugList[k].Image;
                imgOfficeSugListList[k].Text = officeSugList[k].Text;
                imgOfficeSugListList[k].Foots = officeSugList[k].Foots;
                imgOfficeSugListList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("officeSug", imgOfficeSugListList);
            return dict;
        }

        [DataAction("GetMeetingGrid", "userid")]
        public object GetMeetingGrid(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat(@"
select MeetingName,CreatTime,b.MeetingRoomName,c.CnName,a.CaseID from B_OA_Meeting as a
LEFT JOIN B_OA_MeetingRoom as b on a.MeetingRoomID = b.MeetingRoomID
LEFT JOIN FX_UserInfo as c on a.OrganizID = c.UserID
order by a.CaseID desc");
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                DataTable dataTable = ds.Tables[0];
                Utility.Database.Commit(tran);
                return new
                {
                    dataTable = dataTable
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);
                throw (new Exception("读取失败！", ex));
            }
        }


        [DataAction("GetMeetingByCaseId", "caseid")]
        public object GetCarByCaseId(string caseid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_Meeting baseInfor = new B_OA_Meeting();
                baseInfor.Condition.Add("CaseID = " + caseid);
                baseInfor = Utility.Database.QueryObject<B_OA_Meeting>(baseInfor,tran);
                Utility.Database.Commit(tran);
                return new
                {
                    baseInfor = baseInfor
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);
                throw (new Exception("获取数据失败！", ex));
            }

        }

        [DataAction("SaveData", "jsonData")]
        public object SaveData(string jsonData)
        {
            var tran = Utility.Database.BeginDbTransaction();
            B_OA_Meeting data = JsonConvert.DeserializeObject<B_OA_Meeting>(jsonData);
            try
            {
                if (!string.IsNullOrEmpty(data.CaseID))
                {
                    data.Condition.Add("CaseID = " + data.CaseID);
                    Utility.Database.Update<B_OA_Meeting>(data, tran);
                }
                Utility.Database.Commit(tran);
                bool b = true;
                return new
                {
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);
                throw (new Exception("保存失败！", ex));
            }
        }

        [DataAction("DeleteData", "caseId", "userid")]
        public object DeleteData(string caseId, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            { //审核记录表
                if (!string.IsNullOrEmpty(caseId))
                {
                    B_OA_Meeting data = new B_OA_Meeting();
                    data.Condition.Add("CaseID=" + caseId);
                    Utility.Database.Delete(data, tran);
                    engineAPI.Delete(caseId, userid, tran);
                    Utility.Database.Commit(tran);
                }
                else
                {
                    throw (new Exception("删除数据失败"));
                }
                bool b = true;
                return new
                {
                };
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("删除失败！", ex));
            }
        }

        #endregion

        public override string Key
        {
            get
            {
                return "B_OA_MeetingSvc";
            }
        }
    }
}
