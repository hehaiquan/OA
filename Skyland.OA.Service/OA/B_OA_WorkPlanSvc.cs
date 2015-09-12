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
    public class B_OA_WorkPlanSvc : BaseDataHandler
    {
        //获取个人工作计划数据
        [DataAction("GetData", "name", "startTime", "endTime", "planType", "userid")]
        public string GetData(string name, string startTime, string endTime, string planType, string userid)
        {
            IDbTransaction tran = null;
            DataSet dataSet = null;
            try
            {

                var user = ComClass.GetUserInfo(userid);//获取当前用户信息
                if (startTime == null) startTime = "";
                if (endTime == null) endTime = "";
                if (name == null || name == "") name = user.CnName;//获取当前用户信息
                GetDataModel data = new GetDataModel();//获取数据模型
                tran = Utility.Database.BeginDbTransaction();
                string sql = "select id,workPlanName,userid,userName,department,deptName,remark,isWc,isFq,planType,convert(varchar(30),startTime,120) as startTime,convert(varchar(30),endTime,120) as endTime from  B_OA_WorkPlan where userName like '%{0}%' ";
                if (startTime == "" && endTime == "" ) sql += " and convert(varchar(30),startTime,120)>(GETDATE()-90) ";
                if (startTime != null && startTime != "") sql += " and convert(varchar(30),startTime,120)>='"+startTime+"'";
                if (endTime != null && endTime != "") sql += " and convert(varchar(30),endTime,120)<='"+endTime+"'";
               
                dataSet = Utility.Database.ExcuteDataSet(string.Format(sql, name), tran);
                Utility.Database.Commit(tran);//提交事务
                data.Table = dataSet.Tables[0];
                B_OA_WorkPlan workPlan = new B_OA_WorkPlan();
                workPlan.department = user.DPID;
                data.baseInfo = workPlan;
                return Utility.JsonResult(true, null, data);//将对象转为json字符串并返回到客户端
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

        //获取工作计划
        [DataAction("GetWorkPlan", "startTime", "endTime", "planType", "userid")]
        public string GetWorkPlan( string startTime, string endTime,string planType, string userid)
        {
            IDbTransaction tran = null;
            DataSet dataSet = null;
            try
            {
                var user = ComClass.GetUserInfo(userid);
                string DPID = user.DPID;//获取部站ID
                if (startTime == null) startTime = "";
                if (endTime == null) endTime = "";
                GetDataModel data = new GetDataModel();//获取数据模型
                tran = Utility.Database.BeginDbTransaction();
                string sql = "select id,workPlanName,userid,userName,department,deptName,remark,isWc,isFq,convert(varchar(30),startTime,120) as startTime,convert(varchar(30),endTime,120) as endTime from  B_OA_WorkPlan where department='{0}' ";
                if (startTime == "" && endTime == "") sql += " and convert(varchar(30),startTime,120)>(GETDATE()-90) ";
                if (startTime != null && startTime != "") sql += " and convert(varchar(30),startTime,120)>='" + startTime + "'";
                if (endTime != null && endTime != "") sql += " and convert(varchar(30),endTime,120)<='" + endTime + "'";
                sql += "and planType =" + planType;//工作计划类型
                dataSet = Utility.Database.ExcuteDataSet(string.Format(sql, DPID), tran);
                Utility.Database.Commit(tran);//提交事务
                data.Table = dataSet.Tables[0];
                B_OA_WorkPlan workPlan = new B_OA_WorkPlan();
                workPlan.department = user.DPID;
                workPlan.planType = int.Parse(planType);//工作计划类型
                workPlan.endTime = DateTime.Now.ToString();
                workPlan.startTime = DateTime.Now.ToString();
                data.baseInfo = workPlan;
                return Utility.JsonResult(true, null, data);//将对象转为json字符串并返回到客户端
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

        //获取门户工作计划数据
        [DataAction("GetDoorData", "top", "startTime", "endTime", "userid")]
        public string GetDoorData(string top ,string startTime, string endTime, string userid)
        {
            IDbTransaction tran = null;
            DataSet dataSet = null;
            try
            {   

                var user = ComClass.GetUserInfo(userid);
                string DPID = user.DPID;//获取部站ID
                if (top == null | top == "") top = "5";
                if (startTime == null) startTime = "";
                if (endTime == null) endTime = "";
                tran = Utility.Database.BeginDbTransaction();
                string sql = "select top " + top + " id,workPlanName,userid,userName,department,deptName,remark,isWc,isFq,convert(varchar(30),startTime,120) as startTime,convert(varchar(30),endTime,120) as endTime from  B_OA_WorkPlan where department='{0}' ";
                if (startTime == "" && endTime == "") sql += " and convert(varchar(30),startTime,120)>(GETDATE()-90) ";
                if (startTime != null && startTime != "") sql += " and convert(varchar(30),startTime,120)>='" + startTime + "'";
                if (endTime != null && endTime != "") sql += " and convert(varchar(30),endTime,120)<='" + endTime + "'";
                dataSet = Utility.Database.ExcuteDataSet(string.Format(sql, DPID), tran);
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


        //获取工作任务数据
        [DataAction("GetTaskData", "startTime", "endTime", "userid")]
        public string GetTaskData(string startTime, string endTime, string userid)
        {
            IDbTransaction tran = null;
            DataSet dataSet = null;
            try
            {
                var user = ComClass.GetUserInfo(userid);
                string DPID = user.DPID;//获取部站ID
                if (startTime == null) startTime = "";
                if (endTime == null) endTime = "";
                GetDataModel data = new GetDataModel();//获取数据模型
                tran = Utility.Database.BeginDbTransaction();
                string sql = "select TaskId,workPlanId,TaskName,userid,userName,department,deptName,WorkContent,remark,isWc,isFq,convert(varchar(30),startTime,120) as startTime,convert(varchar(30),endTime,120) as endTime from  B_OA_TaskMain where department='{0}' ";
                if (startTime == "" && endTime == "") sql += " and convert(varchar(30),startTime,120)>(GETDATE()-90) ";
                if (startTime != null && startTime != "") sql += " and convert(varchar(30),startTime,120)>='" + startTime + "'";
                if (endTime != null && endTime != "") sql += " and convert(varchar(30),endTime,120)<='" + endTime + "'";
                dataSet = Utility.Database.ExcuteDataSet(string.Format(sql, DPID), tran);
                Utility.Database.Commit(tran);//提交事务
                data.Table = dataSet.Tables[0];
                B_OA_TaskMain taskMain = new B_OA_TaskMain();
                taskMain.department = user.DPID;
                data.taskMain = taskMain;
                return Utility.JsonResult(true, null, data);//将对象转为json字符串并返回到客户端
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


        //获取工作任务管理数据
        [DataAction("GetManageTaskData", "startTime", "endTime", "userid")]
        public string GetManageTaskData(string startTime, string endTime, string userid)
        {
            IDbTransaction tran = null;
            DataSet dataSet = null;
            try
            {
                var user = ComClass.GetUserInfo(userid);
                string name = user.CnName;//获取部站ID
                if (startTime == null) startTime = "";
                if (endTime == null) endTime = "";
                GetDataModel data = new GetDataModel();//获取数据模型
                tran = Utility.Database.BeginDbTransaction();
                string sql = "select id,TaskId,workPlanId,TaskName,userid,userName,department,deptName,WorkContent,remark,isWc,convert(varchar(30),startTime,120) as startTime,convert(varchar(30),endTime,120) as endTime from  B_OA_TaskList where userName='{0}' ";
                if (startTime == "" && endTime == "") sql += " and convert(varchar(30),startTime,120)>(GETDATE()-90) ";
                if (startTime != null && startTime != "") sql += " and convert(varchar(30),startTime,120)>='" + startTime + "'";
                if (endTime != null && endTime != "") sql += " and convert(varchar(30),endTime,120)<='" + endTime + "'";
                dataSet = Utility.Database.ExcuteDataSet(string.Format(sql, name), tran);
                Utility.Database.Commit(tran);//提交事务
                data.Table = dataSet.Tables[0];
                B_OA_TaskList taskList = new B_OA_TaskList();
                taskList.department = user.DPID;
                data.taskList = taskList;
                return Utility.JsonResult(true, null, data);//将对象转为json字符串并返回到客户端
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


        [DataAction("GetStatisticsData", "userid")]
        public string GetStatisticsData( string userid)
        {
            IDbTransaction tran = null;
            DataSet dataSet = null;
            try
            {
                string name = ComClass.GetUserInfo(userid).CnName;
                tran = Utility.Database.BeginDbTransaction();
                //dateadd(dd,-day(getdate())+1,getdate())    --当月第一天
                //dateadd(dd,-day(getdate()),dateadd(m,1,getdate()))   --当月最后一天
                string sql = "select CONVERT(varchar(20),DATEADD(dd,number,dateadd(dd,-day(getdate())+1,getdate())),23) as date from master..spt_values where type = 'P' and DATEADD(dd,number,dateadd(dd,-day(getdate())+1,getdate())) < DATEADD(mm,1,dateadd(dd,-day(getdate())+1,getdate()));";
                sql += "select startTime,COUNT(id) id from( ";
                sql += "select convert(varchar(30),startTime,23) as startTime,id from B_OA_WorkPlan where userName='{0}' ";
                sql += ") as a  group by startTime;";
                dataSet = Utility.Database.ExcuteDataSet(string.Format(sql, name), tran);
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
            }
        }

        /// <summary>
        /// 保存工作计划
        /// </summary>
        /// <param name="JsonData">要保存的数据</param>
        /// <returns>反回json结果</returns>
        [DataAction("SaveData", "JsonData", "userName", "userid")]
        public string SaveData(string JsonData, string userName, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_WorkPlan workPlan = JsonConvert.DeserializeObject<B_OA_WorkPlan>(JsonData);
                if (workPlan.userid == null || workPlan.userid == "") workPlan.userid = userid;

                B_OA_TaskMain taskMain = new B_OA_TaskMain();
                taskMain.workPlanId = workPlan.id;
                taskMain.TaskName = workPlan.workPlanName;
                taskMain.userid = workPlan.userid;
                taskMain.userName = workPlan.userName;
                taskMain.startTime = workPlan.startTime;
                taskMain.endTime = workPlan.endTime;
                taskMain.department = workPlan.department;
                taskMain.deptName = workPlan.deptName;
                taskMain.WorkContent = workPlan.remark;
                taskMain.isWc = "0";
                taskMain.isFq = "0";

                //更新或插入主业务信息
                if (workPlan.id == 0)
                {
                    Utility.Database.Insert<B_OA_WorkPlan>(workPlan, tran);
                    DataSet set=Utility.Database.ExcuteDataSet("select @@identity", tran);
                    Utility.Database.Commit(tran);
                    taskMain.workPlanId = int.Parse(set.Tables[0].Rows[0][0].ToString());                              
                    Utility.Database.Insert<B_OA_TaskMain>(taskMain);
                    if (set != null) set.Dispose();
                }
                else
                {
                    B_OA_TaskMain en = new B_OA_TaskMain();
                    en.Condition.Add("workPlanId = " + workPlan.id);
                    en = Utility.Database.QueryObject<B_OA_TaskMain>(en);
                    if (en.isFq == "1")
                    {
                        Utility.Database.Rollback(tran);
                        return Utility.JsonResult(false, "工作已分配,不能修改");
                    }
                    else
                    {
                        workPlan.Condition.Add("id=" + workPlan.id);
                        Utility.Database.Update<B_OA_WorkPlan>(workPlan, tran);
                        taskMain.Condition.Add("workPlanId=" + workPlan.id);
                        Utility.Database.Update<B_OA_TaskMain>(taskMain, tran);
                        Utility.Database.Commit(tran);
                    }
                }
                             
                return Utility.JsonResult(true, "保存数据成功");//将对象转为json字符串并返回到客户端

            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "保存数据失败！异常信息: " + e.Message);//将对象转为json字符串并返回到客户端
            }
        }

         //发启工作任务
        [DataAction("SendTask", "JsonData", "userid")]
        public string SendTask(string JsonData, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            DataSet se = null;
            try
            {
                B_OA_TaskMain taskMain = JsonConvert.DeserializeObject<B_OA_TaskMain>(JsonData);

                string sql = "select id from B_OA_TaskList where taskid={0} and iswc='1'";
                se = Utility.Database.ExcuteDataSet(string.Format(sql, taskMain.TaskId), tran);
                if (se != null && se.Tables[0] != null) {
                    if (se.Tables[0].Rows.Count > 0) {
                        Utility.Database.Rollback(tran);
                        return Utility.JsonResult(false, "该工作任务已有部份完成，不能重新分配任务");//将对象转为json字符串并返回到客户端
                    }
                }
                taskMain.isFq = "1";
                //更新或插入主业务信息
                taskMain.Condition.Add("workPlanId=" + taskMain.workPlanId);
                Utility.Database.Update<B_OA_TaskMain>(taskMain, tran);
                string[] useridArr = taskMain.userid.TrimEnd(';').Trim().Split(';');
                string[] userNameArr = taskMain.userName.Split(';');
                B_OA_TaskList list = new B_OA_TaskList();
                list.Condition.Add("TaskId=" + taskMain.TaskId);
                Utility.Database.Delete<B_OA_TaskList>(list);
                for (int i = 0; i < useridArr.Length; i++)
                {
                    B_OA_TaskList taskList = new B_OA_TaskList();
                    taskList.userid = useridArr[i];
                    taskList.userName = userNameArr[i];
                    taskList.TaskId = taskMain.TaskId;
                    taskList.workPlanId = taskMain.workPlanId;
                    taskList.TaskName = taskMain.TaskName;
                    taskList.startTime = taskMain.startTime;
                    taskList.endTime = taskMain.endTime;
                    taskList.department = taskMain.department;
                    taskList.deptName = taskMain.deptName;
                    taskList.WorkContent = taskMain.WorkContent;
                    taskList.remark = null;
                    taskList.isWc = "0";
                    Utility.Database.Update<B_OA_TaskMain>(taskMain, tran);
                    Utility.Database.Insert<B_OA_TaskList>(taskList);
                }

                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存数据成功");//将对象转为json字符串并返回到客户端

            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "保存数据失败！异常信息: " + e.Message);//将对象转为json字符串并返回到客户端
            }
            finally {
                if (se != null) se.Dispose();
            }
        }

        //保存工作任务
        [DataAction("SaveTask", "JsonData", "userName", "userid")]
        public string SaveTask(string JsonData, string userName, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_TaskList taskList = JsonConvert.DeserializeObject<B_OA_TaskList>(JsonData);
                if (taskList.userid == null || taskList.userid == "") taskList.userid = userid;
                //更新或插入主业务信息
                if (taskList.id == 0)
                {
                    Utility.Database.Insert<B_OA_TaskList>(taskList, tran);            
                }
                else
                {
                    taskList.Condition.Add("id=" + taskList.id);
                    Utility.Database.Update<B_OA_TaskList>(taskList, tran);
                    string sql = "if not exists(select id from B_OA_TaskList where taskid={0} and isnull(iswc,'0')='0') begin ";
                    sql += "update B_OA_TaskMain set iswc='1' where taskid={1}; ";
                    sql += "update B_OA_WorkPlan set iswc='1' where id={2}; ";
                    sql += "end ";
                    Utility.Database.ExcuteDataSet(string.Format(sql, taskList.TaskId, taskList.TaskId, taskList.workPlanId), tran);

                }
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存数据成功");//将对象转为json字符串并返回到客户端

            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "保存数据失败！异常信息: " + e.Message);//将对象转为json字符串并返回到客户端
            }
        }


        //删除工作计划
        [DataAction("DeletePlan", "id", "userid")]
        public string DeletePlan(string id,string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_WorkPlan workPlan = new B_OA_WorkPlan();
                workPlan.Condition.Add("id=" + id);
                Utility.Database.Delete<B_OA_WorkPlan>(workPlan, tran);
                B_OA_TaskMain taskMain = new B_OA_TaskMain();
                taskMain.Condition.Add("workPlanId=" + id);
                Utility.Database.Delete<B_OA_TaskMain>(taskMain, tran);

                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除数据成功");//将对象转为json字符串并返回到客户端

            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "删除数据失败！异常信息: " + e.Message);//将对象转为json字符串并返回到客户端
            }
        }

        //删除工作分配
        [DataAction("DeleteTaskMain", "id","workPlanId", "userid")]
        public string DeleteTaskMain(string id,string workPlanId, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            DataSet se = null;
            try
            {
                string sql = "select id from B_OA_TaskList where taskid={0} and iswc='1'";
                se = Utility.Database.ExcuteDataSet(string.Format(sql, id), tran);
                if (se != null && se.Tables[0] != null)
                {
                    if (se.Tables[0].Rows.Count > 0)
                    {
                        Utility.Database.Rollback(tran);
                        return Utility.JsonResult(false, "该工作任务已有部份完成，不能删除");//将对象转为json字符串并返回到客户端
                    }
                }
                B_OA_WorkPlan workPlan = new B_OA_WorkPlan();
                workPlan.Condition.Add("id=" + workPlanId);
                Utility.Database.Delete<B_OA_WorkPlan>(workPlan, tran);
                B_OA_TaskMain taskMain = new B_OA_TaskMain();
                taskMain.Condition.Add("workPlanId=" + workPlanId);
                Utility.Database.Delete<B_OA_TaskMain>(taskMain, tran);
                B_OA_TaskList taskList = new B_OA_TaskList();
                taskList.Condition.Add("TaskId=" + id);
                Utility.Database.Delete<B_OA_TaskList>(taskList, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除数据成功");//将对象转为json字符串并返回到客户端

            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "删除数据失败！异常信息: " + e.Message);//将对象转为json字符串并返回到客户端
            }
            finally {
                if (se != null) se.Dispose();
            }
        }

        //删除工作
        [DataAction("DeleteManageTask", "id", "userid")]
        public string DeleteManageTask(string id,  string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            DataSet se = null;
            try
            {
                B_OA_TaskList taskList = new B_OA_TaskList();
                taskList.Condition.Add("id=" + id);
                Utility.Database.Delete<B_OA_TaskList>(taskList, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除数据成功");//将对象转为json字符串并返回到客户端

            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "删除数据失败！异常信息: " + e.Message);//将对象转为json字符串并返回到客户端
            }
            finally
            {
                if (se != null) se.Dispose();
            }
        }


        // 获取数据模型
        public class GetDataModel
        {
            public B_OA_WorkPlan baseInfo;
            public B_OA_TaskMain taskMain;
            public B_OA_TaskList taskList;
            public List<B_OA_WorkPlan> List;
            public DataTable Table;

        }




        //获取值班数据
        [DataAction("GetOnDutyData", "startTime", "endTime", "userid")]
        public string GetOnDutyData(string startTime, string endTime, string userid)
        {
            IDbTransaction tran = null;
            DataSet dataSet = null;
            try
            {
                var user = ComClass.GetUserInfo(userid);
                string DPID = user.DPID;//获取部站ID
                if (startTime == null) startTime = "";
                if (endTime == null) endTime = "";
                GetOnDutyDataModel data = new GetOnDutyDataModel();//获取数据模型
                tran = Utility.Database.BeginDbTransaction();
                string sql = "select id,workPlanName,userid,userName,department,deptName,remark,convert(varchar(30),startTime,120) as startTime,convert(varchar(30),endTime,120) as endTime from  B_OA_OnDuty where department='{0}' ";
                if (startTime == "" && endTime == "") sql += " and convert(varchar(30),startTime,120)>(GETDATE()-90) ";
                if (startTime != null && startTime != "") sql += " and convert(varchar(30),startTime,120)>='" + startTime + "'";
                if (endTime != null && endTime != "") sql += " and convert(varchar(30),endTime,120)<='" + endTime + "'";
                dataSet = Utility.Database.ExcuteDataSet(string.Format(sql, DPID), tran);
                Utility.Database.Commit(tran);//提交事务
                data.Table = dataSet.Tables[0];
                B_OA_OnDuty workPlan = new B_OA_OnDuty();
                workPlan.startTime = DateTime.Now.ToString();
                workPlan.department = user.DPID;
                data.baseInfo = workPlan;
                return Utility.JsonResult(true, null, data);//将对象转为json字符串并返回到客户端
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

        //保存值班数据
        [DataAction("SaveOnDutyData", "JsonData", "userid")]
        public string SaveOnDutyData(string JsonData, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_OnDuty onDuty = JsonConvert.DeserializeObject<B_OA_OnDuty>(JsonData);
               // if (onDuty.userid == null || onDuty.userid == "") onDuty.userid = userid;

                //更新或插入主业务信息
                if (onDuty.id == 0)
                {
                    Utility.Database.Insert<B_OA_OnDuty>(onDuty, tran);
                }
                else
                {
                    onDuty.Condition.Add("id=" + onDuty.id);
                    Utility.Database.Update<B_OA_OnDuty>(onDuty, tran);
                }
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存数据成功");//将对象转为json字符串并返回到客户端

            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "保存数据失败！异常信息: " + e.Message);//将对象转为json字符串并返回到客户端
            }
        }

        //删除值班安排
        [DataAction("DeleteOnDuty", "id", "userid")]
        public string DeleteOnDuty(string id, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_OnDuty onDuty = new B_OA_OnDuty();
                onDuty.Condition.Add("id=" + id);
                Utility.Database.Delete<B_OA_OnDuty>(onDuty, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除数据成功");//将对象转为json字符串并返回到客户端

            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "删除数据失败！异常信息: " + e.Message);//将对象转为json字符串并返回到客户端
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
                return "B_OA_WorkPlanSvc";
            }
        }
    }
}
