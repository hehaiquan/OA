using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BizService.Services.B_AutoMonitoringPlanSvc
{
    class B_BigEventsManageSvc : BaseDataHandler
    {

        [DataAction("SearchEvents", "content")]
        public string SearchEvents(string content)
        {
            var tran = Utility.Database.BeginDbTransaction();
            string sql = "select * from B_BigEvents";
            DataSet bigEventsDataSet = Utility.Database.ExcuteDataSet(sql.ToString(), tran);
            Utility.Database.Commit(tran);
            //string jsonData = JsonConvert.SerializeObject(bigEventsDataSet.Tables[0]);
            //List < B_BigEvents> list = (List<B_BigEvents>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_BigEvents>));

            return Utility.JsonResult(true, "数据加载成功", bigEventsDataSet.Tables[0]);//将对象转为json字符串并返回到客户端
        }

        /// <summary>
        /// 保存大事件内容
        /// </summary>
        /// <param name="JsonData">要保存的数据</param>
        /// <param name="userName"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string SaveBigEvents(string JsonData, string userName, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_BigEvents bigEvents = JsonConvert.DeserializeObject<B_BigEvents>(JsonData);
                if (bigEvents.id == 0 || bigEvents.id == null)
                {
                    //新增
                    bigEvents.recordMan = userid;//录入人
                    Utility.Database.Insert(bigEvents, tran);
                    Utility.Database.Commit(tran);
                    return Utility.JsonResult(true, "保存数据成功");
                }
                else
                {
                    //修改
                    bigEvents.Condition.Add("id=" + bigEvents.id);
                    Utility.Database.Update<B_BigEvents>(bigEvents, tran);
                    Utility.Database.Commit(tran);
                    return Utility.JsonResult(true, "保存数据成功");
                }
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "保存数据失败！异常信息: " + e.Message); ;//将对象转为json字符串并返回到客户端
            }
            return null;
        }
        /// <summary>
        /// 返回空的实体
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
        [DataAction("GetEventsModel", "content")]
        public string GetEventsModel(string content)
        {
            B_BigEvents model = new B_BigEvents();
            return Utility.JsonResult(true, null, model);
        }

        public class GetDataModel
        {
            B_BigEvents bigEvents = new B_BigEvents();
            List<B_BigEvents> list_BigEvents = new List<B_BigEvents>();
        }

        public override string Key
        {
            get
            {
                return "B_BigEventsManageSvc";
            }
        }
    }
}
