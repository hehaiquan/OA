using IWorkFlow.BaseService;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BizService.Common;
using System.Web;
using System.IO;
using BizService;
namespace BizServices.Services.OAReceiveDocSearchSvc
{
    // created by Zhoushining
    class OAReceiveDocSearchSvc : BaseDataHandler
    {
        [DataAction("GetData", "FileTypeId", "userid")]
        public object GetData(string FileTypeId, string userid)
        {
            try
            {
                var tran = Utility.Database.BeginDbTransaction();
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat(@"
SELECT a.caseid,a.wjmc,a.lwrq,a.zbsj,a.code,a.lwdw,a.recordManName,b.FileTypeName
from B_OA_ReceiveDoc_QuZhan as a
LEFT JOIN B_OA_FileType AS b ON b.FileTypeId = a.lwdwTypeId
LEFT JOIN FX_WorkFlowCase as c on a.caseid = c.ID
where 1=1
and c.ID is not null
    ");

                if (FileTypeId != "")
                {
                    strSql.AppendFormat(@" and a.lwdwTypeId='{0}'", FileTypeId);
                }
                strSql.AppendFormat(" ORDER BY a.caseid DESC");

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

        [DataAction("getBtnArray", "userid")]
        public string getBtnArray(string userid)
        {
            try
            {
                var tran = Utility.Database.BeginDbTransaction();

                DataTable dataTable = CommonFunctional.GetFileTypeByFlag("2", tran);

                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, null, dataTable);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, ex.Message);
            }
        }

        [DataAction("DeleteDoc", "caseId","userid")]
        public object DeleteDoc(string caseId, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            { //审核记录表
                if (!string.IsNullOrEmpty(caseId))
                {
                    B_OA_ReceiveDoc_QuZhan receiveDoc = new B_OA_ReceiveDoc_QuZhan();
                    receiveDoc.Condition.Add("caseid="+caseId);
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
                return "OAReceiveDocSearchSvc";
            }
        }
    }// class

    public class GetDataModel
    {
        public List<B_OA_ReceiveDoc> dataList = new List<B_OA_ReceiveDoc>();
    }// class
}
