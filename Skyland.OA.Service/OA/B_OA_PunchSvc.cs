using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BizService.Common;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;

namespace BizService.Services
{
    public class B_OA_PunchSvc : BaseDataHandler
    {
        /// <summary>
        /// 获取数据模型
        /// </summary>
        public class GetDataModel
        {
            public List<B_OA_Punch> dataList;
            public B_OA_Punch baseInfo;
        }

        /// <summary>
        /// 保存数据模型
        /// </summary>
        public class SaveDataModel
        {
            public B_OA_Punch baseInfo;
        }

        [DataAction("SearchReport", "startTime", "endTime", "countType", "userName", "dpname", "userid")]
        public string SearchReport(string startTime, string endTime, string countType, string userName, string dpname, string userid)
        {
            GetDataModel dataModel = new GetDataModel();
            StringBuilder strSql = new StringBuilder();
            strSql.Append(string.Format(@"SELECT 
	 A.UserID ,A.CnName AS userName,B.FullName AS dpname,
	 SUM(CASE WHEN ISNULL(C.ToWorkTime,'') = '' THEN 0 
	 WHEN C.ToWorkTime > CONVERT(VARCHAR(20),(CONVERT(VARCHAR(10),C.ToWorkTime,120) + SUBSTRING(CONVERT(VARCHAR(20),E.StartTime,120),11,9)),120) THEN 1
	 ELSE 0 END ) AS late,
	SUM(CASE WHEN ISNULL(C.ToWorkTime,'') = '' THEN 0 
	 WHEN C.DownWorkTime < CONVERT(VARCHAR(20),(CONVERT(VARCHAR(10),C.DownWorkTime,120) + SUBSTRING(CONVERT(VARCHAR(20),E.EndTime,120),11,9)),120) THEN 1
	 ELSE 0 END ) AS leaveEarly,
	 SUM(CASE WHEN ISNULL(C.ToWorkTime,'') = '' THEN 1 
	 WHEN ISNULL(C.DownWorkTime,'') = '' THEN 1
	 ELSE 0 END ) AS missing
FROM FX_UserInfo A
	LEFT JOIN FX_Department B ON B.DPID = A.DPID
	LEFT JOIN B_OA_Punch C ON A.UserID = C.UserID
	LEFT JOIN B_OA_WorkingDay D ON C.WorkingDayID = D.WorkingDayID
	LEFT JOIN B_OA_WorkingTimes E ON E.WorkingDayID = D.WorkingDayID
WHERE 
    C.PunchDate >= '{0}'
	AND C.PunchDate <= '{1}'
	AND B.DPName  LIKE '%{2}%'
	AND A.CnName LIKE '%{3}%'
GROUP BY A.UserID ,A.CnName,B.FullName
	", startTime,endTime,dpname,userName));
            DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString());
            string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
            dataModel.dataList = (List<B_OA_Punch>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_Punch>));
            if (dataModel.baseInfo == null)
            {
                dataModel.baseInfo = new B_OA_Punch();
            }
            return Utility.JsonResult(true, null, dataModel);
        }


        [DataAction("SearchDate", "userid")]
        public string SearchDate(string userid)
        {
            GetDataModel dataModel = new GetDataModel();
            StringBuilder strSql = new StringBuilder();
            strSql.Append(string.Format(@"SELECT 
	    ISNULL(PunchID,0) AS PunchID , UserID,CONVERT(VARCHAR(10),PunchDate,120) AS PunchDate,(CASE ToWorkTime WHEN NULL THEN '' ELSE SUBSTRING(CONVERT(VARCHAR(20),ToWorkTime,120),12,5) END) AS ToWorkTime, 
        (CASE DownWorkTime WHEN NULL THEN '' ELSE SUBSTRING(CONVERT(VARCHAR(20),DownWorkTime,120),12,5) END) AS  DownWorkTime, Remark,
        SUBSTRING(CONVERT(VARCHAR(20),C.StartTime,120),11,6) AS StartTime,SUBSTRING(CONVERT(VARCHAR(20),C.EndTime,120),11,6) AS EndTime,
	    A.WorkingDayID, WorkingDayName, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, BeginExecuteDay
        FROM B_OA_Punch A
			LEFT JOIN B_OA_WorkingDay B ON A.WorkingDayID = B.WorkingDayID
	        LEFT JOIN B_OA_WorkingTimes C ON B.WorkingDayID = C.WorkingDayID
	    WHERE 
				A.UserID = '{0}'
	", userid));
            DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString());
            string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
            dataModel.dataList = (List<B_OA_Punch>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_Punch>));
            return Utility.JsonResult(true, null, dataModel);
        }

        //获取数据
        [DataAction("GetData", "userid")]
        public string GetData(string userid)
        {
            GetDataModel dataModel = new GetDataModel();
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append(string.Format(@"SELECT TOP 1
	ISNULL(PunchID,0) AS PunchID , UserID, PunchDate, CONVERT(VARCHAR(20),ToWorkTime,120) AS ToWorkTime, 
 CONVERT(VARCHAR(20),DownWorkTime,120) AS DownWorkTime, Remark,SUBSTRING(CONVERT(VARCHAR(20),B.StartTime,120),11,6) AS StartTime,SUBSTRING(CONVERT(VARCHAR(20),B.EndTime,120),11,6) AS EndTime,
	A.WorkingDayID, WorkingDayName, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, BeginExecuteDay
 FROM B_OA_WorkingDay A
	LEFT JOIN B_OA_WorkingTimes B ON A.WorkingDayID = B.WorkingDayID
	LEFT JOIN B_OA_Punch C ON C.UserID = '{0}' AND (ToWorkTime > CONVERT(VARCHAR(10),GETDATE(),120)OR DownWorkTime > CONVERT(VARCHAR(10),GETDATE(),120)) AND A.WorkingDayID = C.WorkingDayID
ORDER BY A.WorkingDayID DESC
	", userid));
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString());
                string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
                dataModel.baseInfo = ((List<B_OA_Punch>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_Punch>)))[0];

                return Utility.JsonResult(true, null, dataModel);
            }
            catch (Exception ex)
            {
                return Utility.JsonResult(false, ex.Message);
            }
        }

        //保存数据
        [DataAction("save", "JsonData","optType", "userid")]
        public string Save(string JsonData, string optType, string userid)
        {
            try
            {
                B_OA_Punch puch = JsonConvert.DeserializeObject<B_OA_Punch>(JsonData);
                puch.Condition.Add("PunchID =" + puch.PunchID);
                if (puch.PunchID == 0)
                {
                    puch.UserID = userid;
                    puch.PunchDate = DateTime.Today.ToString();
                    //取得当前工作班次
                    StringBuilder strSql = new StringBuilder();
                    strSql.Append("SELECT TOP 1 WorkingDayID FROM B_OA_WorkingDay WHERE BeginExecuteDay < GETDATE() ORDER BY WorkingDayID DESC");
                    DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString());
                    if(dataSet.Tables[0].Rows.Count > 0)
                        puch.WorkingDayID = dataSet.Tables[0].Rows[0]["WorkingDayID"].ToString();
                    else
                    {
                         return Utility.JsonResult(false, "请维护考勤班次");
                    }
                }
                if (optType == "1")
                    puch.ToWorkTime = DateTime.Now.ToString();
                if (optType == "2")
                    puch.DownWorkTime = DateTime.Now.ToString();
                if (Utility.Database.Update<B_OA_Punch>(puch) < 1)
                {
                    Utility.Database.Insert<B_OA_Punch>(puch);
                }

                return Utility.JsonResult(true, "保存成功");
            }
            catch (Exception e)
            {
                return Utility.JsonResult(false, "保存数据失败！异常信息: " + e.Message); 
            }
        }

        public override string Key
        {
            get
            {
                return "B_OA_PunchSvc";
            }
        }
    }
}
