using IWorkFlow.Host;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BizService.Services.ComplaintStaticSvc
{
    class ComplaintStaticSvc : BaseDataHandler
    {
        [DataAction("GetComplaintStatic", "content")]
        public string GetComplaintStatic(string content)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder sb = new StringBuilder();
//            sb.AppendFormat(@"select a.FlowName, isnull(b.account,0) as account
//                                from 
//                                (
//                                    select FlowName + case IsEnd when 0 then '在办' when 1 then '办结' when 2 then '停办' end as FlowName,
//                                    IsEnd 
//                                    FROM FX_WorkFlowCase 
//                                    where FlowName = '信访业务'
//                                    group by FlowName, IsEnd
//                                ) a
//                                LEFT JOIN
//                                (
//                                    select FlowName+case IsEnd when 0 then '在办' when 1 then '办结' when 2 then '停办' end as FlowName,
//                                    IsEnd, 
//                                    case IsEnd when 0 then count(1) when 1 then count(1) when 2 then count(1) end as account
//                                    from FX_WorkFlowCase
//                                    where FlowName = '信访业务'
//                                    --and convert(VARCHAR(20),CreateDate, 111) = convert(VARCHAR(20), getdate(),111)
//	                                GROUP by FlowName, IsEnd
//                                ) b
//                                on (a.IsEnd = b.IsEnd)");
            sb.AppendFormat(@"select a.FlowName,
	                                isnull(b.account,0) as account 
                                from 
	                                (select FlowName FROM FX_WorkFlowCase 
	                                where FlowName = '信访业务') a
                                LEFT JOIN 
	                                (select FlowName, count(1) as account 
	                                from FX_WorkFlowCase 
	                                where 1=1 --and convert(VARCHAR(20),CreateDate, 111) = convert(VARCHAR(20), getdate(),111)
	                                group by  FlowName) b
                                on (a.FlowName=b.FlowName)");
            DataTable dt = Utility.Database.ExcuteDataSet(sb.ToString(), tran).Tables[0];

            return Utility.JsonResult(true, "查询数据成功！", dt);
        }

        [DataAction("GetSearchData", "flowid", "userid")]
        public string GetSearchData(string flowid, string userid)
        {
            try
            {
                StringBuilder sb = new StringBuilder();
                sb.AppendFormat(@"SELECT  e.ActName, a.ID, a.Name, a.FlowID, a.FlowName, a.CreateDate, a.Creater, 
		                                    a.CreaterCnName, a.IsEnd, a.[Content], a.LimitDate, a.Ender, a.EnderCnName, a.EndDate, 
		                                    b.workflowcaseid, b.*, e.CaseID, e.BAID, e.ActName, e.ActID, e.UserID, e.UserName,e.ReceDate
                                    FROM (
		                                    SELECT ID, Name, FlowID, FlowName, CreateDate,Creater, CreaterCnName, IsEnd, 
		                                    [Content], LimitDate, Ender, EnderCnName, EndDate
		                                    FROM  dbo.FX_WorkFlowCase
		                                    WHERE (FlowID = '{0}')
                                    ) AS a 
                                    INNER JOIN B_Complaint AS b 
                                    ON a.ID = b.workflowcaseid 
                                    LEFT OUTER JOIN ( 
	                                    SELECT DISTINCT c.CaseID, c.BAID, c.ActName, c.ActID, c.UserID, c.UserName,c.ReceDate
	                                    FROM dbo.FX_WorkFlowBusAct AS c 
	                                    INNER JOIN 
	                                    (
	                                     SELECT CaseID, MAX(ReceDate) AS ReceDate
	                                     FROM  dbo.FX_WorkFlowBusAct
	                                     GROUP BY CaseID
	                                    ) AS d 
	                                    ON c.CaseID = d.CaseID AND c.ReceDate = d.ReceDate
                                    ) AS e 
                                    ON e.CaseID = a.ID ", flowid);
                DataSet dataSet = Utility.Database.ExcuteDataSet(sb.ToString());// 查询数据表
                return Utility.JsonResult(true, "查询成功！", dataSet.Tables[0]);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex.Message);
                return Utility.JsonResult(false, "查询失败！", ex.Message);
            }
        }

        public override string Key
        {
            get
            {
                return "ComplaintStaticSvc";
            }
        }
    }

}
