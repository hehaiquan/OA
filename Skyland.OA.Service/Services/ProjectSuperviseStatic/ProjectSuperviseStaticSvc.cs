using IWorkFlow.Host;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;

namespace BizService.Services.ProjectSuperviseStaticSvc
{
    class ProjectSuperviseStaticSvc : BaseDataHandler
    {
        [DataAction("GetProjectSuperviseStatic", "content")]
        public string GetProjectSuperviseStatic(string content)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat(@"select a.FlowName,
	                                isnull(b.account,0) as account 
                                from 
	                                (select FlowName FROM FX_WorkFlowCase 
	                                where FlowName in (                                                            
                                                            '环境影响技术评估',
                                                            '总量控制指标',
                                                            '建设项目审批',                                                            
                                                            '试生产审批',
                                                            '试生产监管',
                                                            '三同时监管',                                                            
                                                            '自行监测方案备案',
                                                            '突发环境事件应急预案备案',
                                                            '建设项目验收')  
	                                group by FlowName) a
                                LEFT JOIN 
	                                (select FlowName, count(1) as account 
	                                from FX_WorkFlowCase 
	                                where 1=1 --and convert(VARCHAR(20),CreateDate, 111) = convert(VARCHAR(20), getdate(),111)
	                                group by  FlowName) b
                                on (a.FlowName=b.FlowName)");
            DataTable dt = Utility.Database.ExcuteDataSet(sb.ToString(), tran).Tables[0];

            return Utility.JsonResult(true, "查询数据成功！", dt);
        }

        //where FlowName not in (
        //                                                    '发文',
        //                                                    '车辆申请',
        //                                                    '会议申请',
        //                                                    '收文(办理件)',
        //                                                    '收文(传阅)',
        //                                                    '信访业务',
        //                                                    '排污许可证申请（新证）',
        //                                                    '污染物排放申请',
        //                                                    '现场监察',
        //                                                    '行政处罚',
        //                                                    '出差申请',
        //                                                    '请假申请',
        //                                                    '环境噪声',
        //                                                    '排污许可证申请（换证）',
        //                                                    '限期整改',
        //                                                    '危险废物转移(转出)',
        //                                                    '企业注册',
        //                                                    '市区中午夜间连续施工证明申请',
        //                                                    '建筑施工噪声申报')  

        public override string Key
        {
            get
            {
                return "ProjectSuperviseStaticSvc";
            }
        }
    }
}
