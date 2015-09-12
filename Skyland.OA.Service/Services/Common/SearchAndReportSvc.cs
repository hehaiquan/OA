using BizService;
using IWorkFlow.Host;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BizService.Services.Common
{
    class SearchAndReportSvc : BaseDataHandler
    {
        [DataAction("GetData", "flds", "tablename", "condition", "order", "userid")]
        public string GetData(string flds, string tablename, string condition, string order, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();// 定义并开启一个
            DataSet dataSet = null;
            try
            { 
                if (flds == null || flds.Trim() == "") flds = "*";
                if (condition != null && condition != "") { condition = " where " + condition; } else { condition = ""; }
                if (order != null && order != "") order = " order by " + order; else order = "";
                string strSql = "select " + flds + " from " + tablename + condition + order;
                dataSet = Utility.Database.ExcuteDataSet(strSql, tran);// 执行查询并将查询结果放到DataSet里  
                Utility.Database.Commit(tran);//提交事务
                tran.Dispose();
                string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
                return Utility.JsonResult(true, null, jsonData);// 将对象转为json字符串返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);// 事务回滚
                ComBase.Logger(ex);//  记录日志
                return Utility.JsonResult(false, ex.Message);
            }
            finally
            {
                tran.Dispose();
                if (dataSet != null) dataSet.Dispose();
            }
        }

        public override string Key
        {
            get
            {
                return "SearchAndReportSvc";
            }
        }
    }
}
