using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using System.Data;
using System.Web;
using IWorkFlow.BaseService;

namespace BizService.Services
{
    public class B_OA_WorkingDaySvc : BaseDataHandler
    {
        /// <summary>
        /// 获取考勤时间数据模型
        /// </summary>
        public class GetDataModel
        {
            public List<B_OA_WorkingDay> dataList;
            public B_OA_WorkingDay baseInfo = new B_OA_WorkingDay();
        }

        /// <summary>
        /// 保存数据模型
        /// </summary>
        public class SaveDataModel
        {
            public B_OA_WorkingDay baseInfo;
            public KOGridEdit<B_OA_WorkingTimes> dataList;
        }

        //获取数据
        [DataAction("GetData", "userid")]
        public string GetData(string userid)
        {
            StringBuilder strSql = new StringBuilder();
            GetDataModel dataModel = new GetDataModel();
            strSql.Append(@"SELECT TOP 1
	 A.WorkingDayID, WorkingDayName, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, CONVERT(VARCHAR(10),BeginExecuteDay,120) AS BeginExecuteDay,
	 (CASE Monday WHEN 1 THEN '周一' ELSE '' END) +
	 (CASE  WHEN (Tuesday = 1 AND Monday = 0) THEN '周二' WHEN Tuesday = 1 THEN '，周二' ELSE '' END)+
	 (CASE WHEN (Wednesday = 1 AND Tuesday = 0 AND Monday = 0) THEN '周三'  WHEN Wednesday = 1 THEN '，周三' ELSE '' END)+
	 (CASE WHEN (Thursday = 1 AND Wednesday = 0 AND Tuesday = 0 AND Monday = 0) THEN '周四' WHEN Thursday = 1 THEN '，周四' ELSE '' END)+
	 (CASE WHEN (Friday = 1 AND Thursday = 0 AND Wednesday = 0 AND Tuesday = 0 AND Monday = 0) THEN '周五' WHEN Friday = 1 THEN '，周五' ELSE '' END)+
	 (CASE WHEN (Saturday = 1 AND Friday = 0 AND Thursday = 0 AND Wednesday = 0 AND Tuesday = 0 AND Monday = 0) THEN '周六' WHEN Saturday = 1 THEN '，周六' ELSE '' END)+
	 (CASE Sunday WHEN 1 THEN '，周日' ELSE '' END) AS WorkingDay,
	 ISNULL(STUFF((SELECT '' + B.WorkingTime FROM
     (SELECT WorkingDayID, (SUBSTRING(CONVERT(VARCHAR(20),StartTime,120),11,6) + '~' + SUBSTRING(CONVERT(VARCHAR(20),EndTime,120),11,6)) AS WorkingTime
     FROM B_OA_WorkingTimes WHERE WorkingDayID = A.WorkingDayID)B
     FOR XML PATH ('')),1,1,''),'') AS WorkingTime,SUBSTRING(CONVERT(VARCHAR(20),B.StartTime,120),11,6) AS StartTime,
     SUBSTRING(CONVERT(VARCHAR(20),B.EndTime,120),11,6) AS EndTime
FROM B_OA_WorkingDay A
	LEFT JOIN B_OA_WorkingTimes B ON B.WorkingDayID = A.WorkingDayID
ORDER BY A.WorkingDayID DESC");
            DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString());
            string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
            dataModel.dataList = (List<B_OA_WorkingDay>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_WorkingDay>));
            return Utility.JsonResult(true, null, dataModel);
        }

        /// <summary>
        /// 保存数据
        /// </summary>
        /// <param name="JsonData">要保存的数据</param>
        /// <returns>反回json结果</returns>
        [DataAction("Save", "JsonData", "userid")]
        public string Save(string JsonData, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            SkyLandDeveloper developer = new SkyLandDeveloper("{}",userid,tran);
            int WorkingDayID = 0;
            try
            {
                //操作主表
                B_OA_WorkingDay dataModel = JsonConvert.DeserializeObject<B_OA_WorkingDay>(JsonData);
                //每修改一次增加一个班次、不做判断
                dataModel.Condition.Add("WorkingDayID = " + dataModel.WorkingDayID);

                if (Utility.Database.Insert<B_OA_WorkingDay>(dataModel, tran) > 0)
                {
                    StringBuilder strSql = new StringBuilder();
                    strSql = new StringBuilder();
                    strSql.Append(@"SELECT @@IDENTITY FROM B_OA_WorkingDay");
                    DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                    if (dataSet.Tables.Count > 0)
                    {
                        if (dataSet.Tables[0].Rows.Count > 0)
                            WorkingDayID = Convert.ToInt32(dataSet.Tables[0].Rows[0][0]);
                    }
                }

                B_OA_WorkingTimes time = new B_OA_WorkingTimes();
                time.Condition.Add("WorkingDayID = " + dataModel.WorkingDayID);
                time.WorkingDayID = WorkingDayID;
                time.StartTime = "1900-1-1 " + dataModel.StartTime + ":00";
                time.EndTime = "1900-1-1 " + dataModel.EndTime + ":00";
                Utility.Database.Insert<B_OA_WorkingTimes>(time, tran);
                developer.Commit();
                return Utility.JsonResult(true, "保存成功");
            }
            catch (Exception e)
            {
                developer.RollBack();
                return Utility.JsonResult(false, "保存数据失败！异常信息: " + e.Message);
            }
        }

        //暂不做删除功能

        public override string Key
        {
            get
            {
                return "B_OA_WorkingDaySvc";
            }
        }
    }
}
