using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;
using IWorkFlow.Host;
using IWorkFlow.ORM;

namespace BizService.B_GoodsSvc
{
    public class B_OA_DocSetSvc : BaseDataHandler
    {
        [DataAction("GetData", "userid")]
        public object GetData(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat(
@"
SELECT FileTypeId,FileTypeName as name ,ParentId,FileTypeName,CodePath,sourceType,b.linkName as linkUrl
from B_OA_FileType as a 
LEFT JOIN B_OA_FileType_DefineLink as b on b.id = a.linkId
where a.flagType = '1'
 UNION
 SELECT FileTypeId,FileTypeName as name ,ParentId,FileTypeName,CodePath ,sourceType,b.linkName as linkUrl
from B_OA_FileType as a 
LEFT JOIN B_OA_FileType_DefineLink as b on b.id = a.linkId
where a.flagType = '2'
UNION
SELECT  FileTypeId,FileTypeName as name ,ParentId,FileTypeName,CodePath ,sourceType,b.linkName as linkUrl
from B_OA_FileType as a 
LEFT JOIN B_OA_FileType_DefineLink as b on b.id = a.linkId
where ParentId in
(SELECT FileTypeId from B_OA_FileType where flagType = '1' or flagType = '2')

");
                DataTable dataTable = Utility.Database.ExcuteDataSet(strSql.ToString(), tran).Tables[0];
                B_OA_FileType fileModel = new B_OA_FileType();;
                return new
                {
                    dataTable = dataTable,
                    fileModel = fileModel
                };
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                throw (new Exception("获取数据失败！", e));
            }
        }



        public override string Key
        {
            get
            {
                return "B_OA_DocSetSvc";
            }
        }
    }

}
