using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BizService.Common;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;

namespace BizService.Services
{
    class B_OA_SupervisionStaticSvc : BaseDataHandler
    {
        [DataAction("GetCompleteSupervisionStatic", "year", "quarter", "userid")]
        public string GetCompleteSupervisionStatic(string year, string quarter, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            GetDataModel dataModel = new GetDataModel();
            StringBuilder whereSql = new StringBuilder();

            try
            {
                string strStartTime = "";
                string strEndTime = "";
                if (year != "" && quarter != "")
                {
                    CommonFunctional.GetQuarterTime(int.Parse(year), int.Parse(quarter), out strStartTime, out strEndTime);
                    whereSql.AppendFormat(@"and EndDate >= '{0}' and EndDate<='{1}' ", strStartTime, strEndTime);

                }
                else if (year != "" && quarter=="")
                {
                    whereSql.AppendFormat(@"and EndDate like '%{0}%'",year);
                }


                if (whereSql.ToString().Length > 0)
                {
                    strSql.AppendFormat(@"
SELECT  ROW_NUMBER() OVER ( PARTITION BY newTb.ID ORDER BY newTb.ReceDate DESC ) AS ROWINDEX ,
        newTb.*
INTO    #Temp
FROM    ( SELECT    a.ID ,
                    b.Remark ,
                    b.ReceDate,
                    c.code,
                    c.title,
                    c.supervisionManName,
                    c.undertake_Department,
                    c.assistDepartment,
                    a.EndDate
          FROM      FX_WorkFlowCase AS a
                    LEFT JOIN FX_WorkFlowBusAct AS b ON b.CaseID = a.ID
                    LEFT JOIN B_OA_Supervision AS c ON c.caseId = a.ID
          WHERE     a.IsEnd = '1'
                    AND ( a.FlowID = 'W000094'
                          OR a.FlowID = 'W000091'
                        )
                   {0}

        ) newTb
SELECT  *
FROM    #Temp
WHERE   ROWINDEX = 1
DROP TABLE #Temp

", whereSql);
                }
                else
                {
                    strSql.AppendFormat(@"
SELECT  ROW_NUMBER() OVER ( PARTITION BY newTb.ID ORDER BY newTb.ReceDate DESC ) AS ROWINDEX ,
        newTb.*
INTO    #Temp
FROM    ( SELECT    a.ID ,
                    b.Remark ,
                    b.ReceDate,
                    c.code,
                    c.title,
                    c.supervisionManName,
                    c.undertake_Department,
                    c.assistDepartment,
                    a.EndDate
          FROM      FX_WorkFlowCase AS a
                    LEFT JOIN FX_WorkFlowBusAct AS b ON b.CaseID = a.ID
                    LEFT JOIN B_OA_Supervision AS c ON c.caseId = a.ID
          WHERE     a.IsEnd = '1'
                    AND ( a.FlowID = 'W000094'
                          OR a.FlowID = 'W000091'
                        )
        ) newTb
SELECT  *
FROM    #Temp
WHERE   ROWINDEX = 1
DROP TABLE #Temp

");
                }

                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                Utility.Database.Commit(tran);
                dataModel.dt = ds.Tables[0];
                return Utility.JsonResult(true, "读取成功", dataModel);
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + ex.Message);
            }

        }

        [DataAction("GetReminderSupervisionStatic", "year", "quarter", "userid")]
        public string GetReminderSupervisionStatic(string year, string quarter, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            GetDataModel dataModel = new GetDataModel();
            StringBuilder whereSql = new StringBuilder();

            try
            {
                string strStartTime = "";
                string strEndTime = "";
                if (year != "" && quarter != "")
                {
                    CommonFunctional.GetQuarterTime(int.Parse(year), int.Parse(quarter), out strStartTime, out strEndTime);
                    whereSql.AppendFormat(@"and createDate >= '{0}' and createDate<='{1}' ", strStartTime, strEndTime);

                }
                else if (year != "" && quarter == "")
                {
                    whereSql.AppendFormat(@" and createDate like '%{0}%'", year);
                }

                strSql.AppendFormat(@"select undertake_Department,title,code,reminderCount,explain,createDate,caseId from B_OA_SupervisionReminder where 1=1");
                if (whereSql.ToString().Length>0)
                {
                    strSql.Append(whereSql);
                }
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                Utility.Database.Commit(tran);
                dataModel.dt = ds.Tables[0];
                return Utility.JsonResult(true, "读取成功", dataModel);
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + ex.Message);
            }
        }

        public class GetDataModel
        {
            public DataTable dt;
        }


        public override string Key
        {
            get
            {
                return "B_OA_SupervisionStaticSvc";
            }
        }
    }
}
