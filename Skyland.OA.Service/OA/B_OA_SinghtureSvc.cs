using DocumentFormat.OpenXml.Drawing.Charts;
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
using System.Drawing;
using IWorkFlow.OfficeService.OpenXml;
using DataTable = System.Data.DataTable;
using IWorkFlow.BaseService;


namespace BizService.Services
{
    class B_OA_SinghtureSvc : BaseDataHandler
    {
        [DataAction("GetSighture", "caseId", "columnName")]
        public object GetSighture(string caseId, string columnName)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                DataTable dt;
                StringBuilder strSql = new StringBuilder();
                //读取手写签名
                strSql.AppendFormat(@"select s.*,u.CnName from B_OA_Sighture as s 
                LEFT JOIN FX_UserInfo as u on s.userid = u.UserID  where s.caseid='{0}' and s.columnName = '{1}' and s.type = '{2}'", caseId, columnName, "0");
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                return new
                {
                    dt = ds.Tables[0]
                };
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                //尽量使用这个种方式返回错误，在调试模式下显示详细错误信息
                throw (new Exception("数据获取失败！错误：" + ex.Message, ex));

            }
        }

        public override string Key
        {
            get
            {
                return "B_OA_SinghtureSvc";
            }
        }

    }
}
