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

namespace BizService.Services.OASendDocSearchSvc
{
    // created by zhoushing
    class OASendDocSearchSvc : BaseDataHandler
    {
        [DataAction("GetData", "FileTypeId", "userid")]
        public object GetData(string FileTypeId, string userid)
        {
            try
            {

                var tran = Utility.Database.BeginDbTransaction();
                var data = new GetDataModel();
                StringBuilder strSql = new StringBuilder();

                strSql.AppendFormat(@"
SELECT
a.caseid,
	a.id,
	a.title,
	b.FileTypeName,
	a.fwrq,
  a.createMan,
	CASE
WHEN a.sendCheckType = '1' THEN
	'桂环站'
WHEN a.sendCheckType = '2' THEN
	'代厅拟文'
WHEN a.sendCheckType = '3' THEN
	'内部事项'
WHEN a.sendCheckType = '4' THEN
	'其他'
ELSE
	'未知'
END sendCheckType,
 CASE
WHEN a.sendCheckType = '1' THEN
	guiHuanZhan
WHEN a.sendCheckType = '2' THEN
	daiTingNiWen
WHEN a.sendCheckType = '3' THEN
	neiBuShiXiang
WHEN a.sendCheckType = '4' THEN
	qiTa
ELSE
	''
END sendCheckTypeName
FROM
	B_OA_SendDoc_QuZhan AS a
LEFT JOIN B_OA_FileType AS b ON b.FileTypeId = a.sendType
LEFT JOIN FX_WorkFlowCase as c on a.caseid = c.ID
where 1=1
and c.ID is not null
");

                if (FileTypeId != "")
                {
                    strSql.AppendFormat(@" AND a.sendType = '{0}'", FileTypeId);
                }

                strSql.Append(@"

ORDER BY
	caseid DESC");
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
                DataTable dataTable = CommonFunctional.GetFileTypeByFlag("1", tran);
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
                    B_OA_SendDoc_QuZhan sendDoc = new B_OA_SendDoc_QuZhan();
                    sendDoc.Condition.Add("caseid=" + caseId);
                    Utility.Database.Delete(sendDoc, tran);
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
                throw (new Exception("获取数据失败！", ex));
            }
        }

        public override string Key
        {
            get
            {
                return "OASendDocSearchSvc";
            }
        }
    }// class

    public class GetDataModel
    {
        public List<B_OA_SendDoc> dataList = new List<B_OA_SendDoc>();
    }// class

}
