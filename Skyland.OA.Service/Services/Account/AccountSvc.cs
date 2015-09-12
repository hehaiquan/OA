using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BizService.Services
{
    public class AccountSvc : BaseDataHandler
    {
        //台帐数据
        [DataAction("AccountData","caseid", "userid")]
        public string AccountData(string caseid,string userid)
        {
            IDbTransaction tran = null;
            DataSet dataSet = null;
            try
            {
                tran = Utility.Database.BeginDbTransaction();
                //var user = ComClass.GetUserInfo(userid);//获取当前用户信息
                string sql = "select * from V_B_EIA_DocumentEvaluationMain where ID='{0}';"+
                             "select * from V_B_CP_ExamApprovalMain where mianid='{1}';";
                sql = string.Format(sql, caseid, caseid);
                dataSet = Utility.Database.ExcuteDataSet(sql, tran);
                if (dataSet != null && dataSet.Tables[0] != null) dataSet.Tables[0].TableName = "hp";
                if (dataSet != null && dataSet.Tables[1] != null) dataSet.Tables[1].TableName = "jsxm";
                Utility.Database.Commit(tran);//提交事务
                return Utility.JsonResult(true, null, dataSet);//将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);//写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message);//将对象转为json字符串并返回到客户端
            }
            finally
            {
                dataSet.Dispose();
                tran.Dispose();
            }
        }




        public override string Key
        {
            get
            {
                return "AccountSvc";
            }
        }
    }
}
