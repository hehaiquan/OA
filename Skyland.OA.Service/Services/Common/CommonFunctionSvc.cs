using BizService.Common;
using IWorkFlow.BaseService;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace BizService.CommonFunctionSvc
{
    public class CommonFunctionSvc : BaseDataHandler
    {

        [DataAction("GetWorkFlowCaseByCaseId", "caseId", "actid")]
        public object GetWorkFlowCaseByCaseId(string caseId, string actid)
        {
            List<FX_AttachMent> listAttachment = new List<FX_AttachMent>();
            List<B_OA_Supervision> listSupervision = new List<B_OA_Supervision>();
            DataTable ngbm = new DataTable();

            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                //工作流信息
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat(@"
select * from FX_WorkFlowBusAct where CaseID = '{0}' and SendDate is not null ORDER BY SendDate DESC", caseId);
                var ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);

                List<FX_WorkFlowBusAct> listWork =
                     JsonConvert.DeserializeObject<List<FX_WorkFlowBusAct>>(JsonConvert.SerializeObject(ds.Tables[0]));

                //附件信息
                FX_AttachMent attachment = new FX_AttachMent();
                attachment.Condition.Add("CaseID = " + caseId);
                listAttachment = Utility.Database.QueryList<FX_AttachMent>(attachment, tran);
                //督办信息
                B_OA_Supervision supervision = new B_OA_Supervision();
                supervision.Condition.Add("caseId = " + caseId);
                supervision.OrderInfo = "createDate desc";
                listSupervision = Utility.Database.QueryList<B_OA_Supervision>(supervision, tran);
                //获取附件路径
                string dir = IWorkFlow.Host.Utility.config.get("FileDir");
                dir = dir.Replace("\\", "/");
                //拟稿人和拟稿部门
                if (!string.IsNullOrEmpty(actid))
                {
                    ngbm = GetUserNameAndDepartNameByActId(caseId, actid, tran);
                }
                //关闭连接池
                Utility.Database.Commit(tran);
                return new
                {
                    listAttachment = listAttachment,
                    listWork = listWork,
                    listSupervision = listSupervision,
                    dir = dir,
                    ngbm = ngbm
                };
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("获取数据失败！", ex));
            }
        }

        public DataTable GetUserNameAndDepartNameByActId(string caseid, string actid, IDbTransaction tran)
        {
            DataTable userDP = BizService.Common.CommonFunctional.GetUserNameAndDepartNameByActId(caseid, actid, tran);
            return userDP;
        }

        public override string Key
        {
            get
            {
                return "CommonFunctionSvc";
            }
        }
    }
}
