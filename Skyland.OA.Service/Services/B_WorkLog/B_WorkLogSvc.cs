using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BizService.Services;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;

namespace BizService.B_WorkLogSvc
{
    public class B_WorkLogSvc : BaseDataHandler
    {
        /// <summary>
        /// 查询数据
        /// </summary>
        /// <param name="beginTime">起始时间</param>
        /// <param name="endTime">结束时间</param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetData", "beginTime", "endTime", "workLogType", "userid")]
        public string GetData(string beginTime,string endTime,string workLogType,string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            //定义原始模板，传入前台
            GetDataModel data = new GetDataModel();
            data.baseInfo = new B_WorkLog();
            //data.baseInfo.createDate =  DateTime.Now.ToString('yyyy-MM-dd');
            data.baseInfo.workOvertime = "0";
            try
            {
                //定义查找条件
                StringBuilder strWhereSql = new StringBuilder();
                if (beginTime!="") {
                    strWhereSql.AppendFormat(@" and newTb.createDate>='{0}'", beginTime);
                }
                if (endTime!="")
                {
                    strWhereSql.AppendFormat(@" and newTb.createDate<='{0}'",endTime);
                }

                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat(@"select CONVERT(varchar(20),newTb.createDate,23) as createDate,newTb.*,a.mc as logTypeName from B_WorkLog as newTb 
                left join (select * from Para_BizTypeItem where flid = (select id from Para_BizTypeDictionary where lx='logTypeDic')) as a on newTb.logType=a.csz 
                where newTb.createManId='{0}' and newTb.workLogType={1}
                ", userid, workLogType);

                if(strWhereSql.ToString()!=""){
                    strSql.Append(strWhereSql);
                }

                DataSet goodsDataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                data.List = goodsDataSet.Tables[0];
                Utility.Database.Commit(tran);//提交事务
                return Utility.JsonResult(true, "数据加载成功", data);//将对象转为json字符串并返回到客户端

            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

        /// <summary>
        /// 工作日志的添加和修改
        /// </summary>
        /// <param name="JsonData"></param>
        /// <param name="workLogType">工作日志类型</param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("SaveData", "JsonData", "workLogType", "userid")]
        public string SaveData(string JsonData,string workLogType, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_WorkLog b_WorkLog = JsonConvert.DeserializeObject<B_WorkLog>(JsonData);
                //更新或插入主业务信息
                if (b_WorkLog.id == 0)
                {
                    b_WorkLog.createManId = userid;
                    b_WorkLog.workLogType = workLogType;//工作日志类型1个人类型2部门类型
                    var userInfo = ComClass.GetUserInfo(userid);
                    b_WorkLog.departmentId = userInfo.DPID;
                    Utility.Database.Insert<B_WorkLog>(b_WorkLog, tran);
                }
                else
                {
                    b_WorkLog.Condition.Add("id=" + b_WorkLog.id);
                    Utility.Database.Update<B_WorkLog>(b_WorkLog, tran);
                }
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存成功！", b_WorkLog);//将对象转为json字符串并返回到客户端
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "保存数据失败！异常信息: " + e.Message);//将对象转为json字符串并返回到客户端
            }
        }

        /// <summary>
        /// 删除信息
        /// </summary>
        /// <param name="id">主键</param>
        /// <returns></returns>
        [DataAction("DeleteData", "id", "userid")]
        public string DeleteData(string id,string userid) {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_WorkLog b_WorkLog = new B_WorkLog();
                b_WorkLog.Condition.Add("id = " + id);//设置查询条件,条件为当前用户ID
                Utility.Database.Delete(b_WorkLog, tran);
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
        /// 查询数据
        /// </summary>
        /// <param name="beginTime">起始时间</param>
        /// <param name="endTime">结束时间</param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetDataForDepWorkLog", "beginTime", "endTime", "workLogType", "userid")]
        public string GetDataForDepWorkLog(string beginTime, string endTime, string workLogType,string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
        
            //定义原始模板，传入前台
            GetDataModel data = new GetDataModel();
            data.baseInfo = new B_WorkLog();
            data.baseInfo.workOvertime = "0";//加班时间默认为0
            try
            {
                //获取用户信息
                var userInfo = ComClass.GetUserInfo(userid);
                string dpId = userInfo.DPID;//部门Id
         

                //sql语句
                StringBuilder strSql = new StringBuilder();
                if (dpId == "D000007")//局领导可查看到所有日志
                {
                    strSql.AppendFormat(@"select CONVERT(varchar(20),newTb.createDate,23) as createDate,newTb.*,a.mc as logTypeName,b1.DPName as departmentName from B_WorkLog as newTb 
                left join (select * from Para_BizTypeItem where flid = (select id from Para_BizTypeDictionary where lx='logTypeDic')) as a on newTb.logType=a.csz 
                left join FX_Department as b1 on newTb.departmentId = b1.DPID          
                where newTb.workLogType='{0}'
                ", workLogType);
                }
                else {//非局领导以外只能看到自己部门数据
                    strSql.AppendFormat(@"select CONVERT(varchar(20),newTb.createDate,23) as createDate,newTb.*,a.mc as logTypeName,b1.DPName as departmentName from B_WorkLog as newTb 
                left join (select * from Para_BizTypeItem where flid = (select id from Para_BizTypeDictionary where lx='logTypeDic')) as a on newTb.logType=a.csz 
                left join FX_Department as b1 on newTb.departmentId = b1.DPID          
                where newTb.workLogType='{0}' and newTb.departmentId='{1} '
                ", workLogType, dpId);
                }
                //定义查找条件
                StringBuilder strWhereSql = new StringBuilder();
                if (beginTime != "")
                {
                    strWhereSql.AppendFormat(@"and newTb.createDate>='{0}'", beginTime);
                }
                if (endTime != "")
                {
                    strWhereSql.AppendFormat(@"and newTb.createDate<='{0}'", endTime);
                }
                //判断strWhereSql是否为空
                if (strWhereSql.ToString() != "")
                {
                    strSql.Append(strWhereSql);
                }

                DataSet goodsDataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                data.List = goodsDataSet.Tables[0];
                Utility.Database.Commit(tran);//提交事务
                return Utility.JsonResult(true, "数据加载成功", data);//将对象转为json字符串并返回到客户端

            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

        public string GetWorkLogModel()
        {
            B_WorkLog model = new B_WorkLog();
            return Utility.JsonResult(true, null, model);

        }

        // 获取数据模型
        public class GetDataModel
        {
            public B_WorkLog baseInfo;
            public DataTable List;

        }
        public override string Key
        {
            get
            {
                return "B_WorkLogSvc";
            }
        }
    }
}
