using System.Data;
using BizService;
using IWorkFlow.BaseService;
using IWorkFlow.Host;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.ORM;

namespace BizServices.Services.OAInnerDocSearchSvc
{
    class OAInnerDocSearchSvc : BaseDataHandler
    {
        [DataAction("GetData", "FileTypeId", "userid")]
        public object GetData(string FileTypeId, string userid)
        {
            try
            {
                var tran = Utility.Database.BeginDbTransaction();
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat(@"
select a.caseId,a.title,a.code,b.CnName as userName,a.createDate,c.DPName as dpName,a.remark from
 B_OA_SendDoc_Inner_QuZhan as a
LEFT JOIN FX_UserInfo as b on a.underTakeManId = b.UserId
LEFT JOIN FX_Department as c on a.underTakeDepId = c.DPID
LEFT JOIN B_OA_FileType AS d ON d.FileTypeId = a.FileTypeId
LEFT JOIN FX_WorkFlowCase as e on a.caseid = e.ID
where 1=1
and e.ID is not null
ORDER BY a.caseid DESC
    ");

                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                DataTable dataList = ds.Tables[0];
                Utility.Database.Commit(tran);
                return new
                {
                    dataList = dataList
                };
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("获取数据失败！", ex));
            }

        }

        [DataAction("DeleteDoc", "caseId", "userid")]
        public object DeleteDoc(string caseId, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            { //审核记录表
                if (!string.IsNullOrEmpty(caseId))
                {
                    B_OA_SendDoc_Inner_QuZhan receiveDoc = new B_OA_SendDoc_Inner_QuZhan();
                    receiveDoc.Condition.Add("caseId=" + caseId);
                    Utility.Database.Delete(receiveDoc, tran);
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
                    b = b
                };
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("删除失败！", ex));
            }
        }

        public override string Key
        {
            get
            {
                return "OAInnerDocSearchSvc";
            }
        }
    }
}
