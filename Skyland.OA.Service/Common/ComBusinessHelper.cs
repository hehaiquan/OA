using BizService;
using IWorkFlow.Host;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BizService.Services
{
    class ComBusinessHelper : BaseDataHandler
    {
        [DataAction("GetLinkCaseData", "tablename", "whereparms", "userid")]
        public string GetLinkCaseData(string tablename, string whereparms, string userid)
        {
            try
            {
                if (tablename == "") return Utility.JsonResult(false, "表名不能为空！", null); 
                string sql = @" select * from " + tablename + " where 1=1 ";
                if (whereparms!="")
                {
                    sql += " and " + whereparms;
                }

                DataSet ds = new DataSet();
                ds = Utility.Database.ExcuteDataSet(sql);
                return Utility.JsonResult(true, "查询成功！", ds.Tables[0]);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex.Message);
                return Utility.JsonResult(false, "查询失败！", null);
            }
        }

        public override string Key
        {
            get
            {
                return "ComBusinessHelper";
            }
        }
    }
}
