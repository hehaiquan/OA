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
    public class StaticSvc : BaseDataHandler
    {
        //统计专家项目
        [DataAction("StaticExpertsXM", "userid")]
        public string StaticExpertsXM(string userid)
        {
            IDbTransaction tran = null;
            DataSet dataSet = null;
            try
            {
                tran = Utility.Database.BeginDbTransaction();
                //var user = ComClass.GetUserInfo(userid);//获取当前用户信息
                dataSet = Utility.Database.ExcuteDataSet("exec SP_StaticExpertsXM ''", tran);
                Utility.Database.Commit(tran);//提交事务
                return Utility.JsonResult(true, null, dataSet.Tables[0]);//将对象转为json字符串并返回到客户端
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
            }
        }



        // 获取数据模型
        public class GetOnDutyDataModel
        {
            public B_OA_OnDuty baseInfo;
            public List<B_OA_OnDuty> List;
            public DataTable Table;

        }



        public override string Key
        {
            get
            {
                return "StaticSvc";
            }
        }
    }
}
