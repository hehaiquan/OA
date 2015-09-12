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

//开发者:黄欢
namespace BizService.Services
{
    class B_OA_ScheduleSvc : BaseDataHandler
    {
        /// <summary>
        /// 获取初始化数据
        /// </summary>
        /// <param name="userid">用户ID</param>
        /// <param name="caseId">业务流WID</param>
        /// <param name="baid">步骤ID</param>
        /// <returns>返回初始化数据</returns>
        [DataAction("GetData", "beginTime", "endTime", "ScheduleType", "userid")]
        public string GetData(string beginTime, string endTime,string ScheduleType, string userid)
        {
            //只有待办箱才有设置为已读
            //if (!String.IsNullOrEmpty(baid)) engineAPI.SetIsReaded(caseId, baid, userid);

            IDbTransaction tran = null;
            DataSet dataSet = null;
            try
            {
                tran = Utility.Database.BeginDbTransaction();
                GetDataModel data = new GetDataModel();//获取数据模型
                data.baseInfo = new B_OA_Schedule();

                string sql = "select CONVERT(varchar(20),ScheduleTime,23) as ScheduleTime,* from B_OA_Schedule where 1=1 ";
                if (ScheduleType != null & ScheduleType != "") { sql += " and ScheduleType='{0}' "; sql = string.Format(sql, ScheduleType); }

                if (beginTime != null & beginTime != "") { sql += " and ScheduleTime>='{0}'"; sql = string.Format(sql, beginTime); }
                if (endTime != null & endTime != "") { sql += " and ScheduleTime<='{0}'"; sql = string.Format(sql, endTime); }
                sql += " order by B_OA_Schedule.ScheduleTime ";
                dataSet = Utility.Database.ExcuteDataSet(sql, tran);
                data.List = dataSet.Tables[0];
                Utility.Database.Commit(tran);//提交事务
                return Utility.JsonResult(true, null, data);//将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);//写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message);//将对象转为json字符串并返回到客户端
            }
            finally {
                dataSet.Dispose();
            }
        }


        /// <summary>
        /// 保存数据
        /// </summary>
        /// <param name="JsonData">要保存的数据</param>
        /// <returns>反回json结果</returns>
        [DataAction("SaveData", "JsonData", "userName", "userid")]
        public string SaveData(string JsonData, string userName, string userid)
        {
            
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_Schedule OA_Schedule = JsonConvert.DeserializeObject<B_OA_Schedule>(JsonData);

                //更新或插入主业务信息
                if (OA_Schedule.ScheduleId == 0)
                {
                    Utility.Database.Insert<B_OA_Schedule>(OA_Schedule, tran);
                }
                else
                {
                    OA_Schedule.Condition.Add("ScheduleId=" + OA_Schedule.ScheduleId);
                    Utility.Database.Update<B_OA_Schedule>(OA_Schedule, tran);
                }

                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, null, OA_Schedule);//将对象转为json字符串并返回到客户端

            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "保存数据失败！异常信息: " + e.Message);//将对象转为json字符串并返回到客户端
            }
            finally {
                if (tran != null) tran.Dispose();
            }
        }


        /// <summary>
        /// 删除数据
        /// </summary>
        /// <param name="userid">当前用户ID</param>
        /// <param name="id">主键ID</param>
        /// <returns>返回结果数据集</returns>
        [DataAction("DeleteData", "userid", "id")]
        public string DeleteData(string userid, string id)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();//开始事务并返回一个事务对象
            try
            {
                B_OA_Schedule OA_Schedule = new B_OA_Schedule();
                OA_Schedule.Condition.Add("ScheduleId = " + id);//设置查询条件,条件为当前用户ID
                Utility.Database.Delete(OA_Schedule, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除成功！");
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);//写日专到本地文件
                return Utility.JsonResult(false, "删除失败:" + ex.Message);
            }
        }


        /// <summary>
        /// 获取门户数据
        /// </summary>
        /// <param name="userid">用户ID</param>
        /// <returns>返回初始化数据</returns>
        [DataAction("GetGatewayData", "top", "leader", "ScheduleType", "userid")]
        public string GetGatewayData(string top, string leader,string ScheduleType, string userid)
        {
            IDbTransaction tran = null;
            DataSet dataSet = null;
            try
            {
                tran = Utility.Database.BeginDbTransaction();
                StringBuilder sql = new StringBuilder();
                sql.Append("select top {0} convert(varchar(20),ScheduleTime,23) as ScheduleTime,* from B_OA_Schedule where ScheduleType='{1}' order by B_OA_Schedule.ScheduleTime desc ");
                string sqlStr = string.Format(sql.ToString(), top, ScheduleType);
                dataSet = Utility.Database.ExcuteDataSet(sqlStr, tran);
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
                if (dataSet != null) dataSet.Dispose();
                if (tran != null) tran.Dispose();
            }
        }



        // 获取数据模型
        public class GetDataModel
        {
            public B_OA_Schedule baseInfo;
            public DataTable List;

        }

        /// <summary>
        /// 保存数据模型
        /// </summary>
        public class SaveDataModel
        {
            public B_OA_Schedule baseInfo;
        }

        public override string Key
        {
            get
            {
                return "B_OA_ScheduleSvc";
            }
        }

    }
}

