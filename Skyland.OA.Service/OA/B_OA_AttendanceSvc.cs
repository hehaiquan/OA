using BizService.Common;
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
    class B_OA_AttendanceSvc : BaseDataHandler
    {
        /// <summary>
        /// 获取初始化数据
        /// </summary>
        /// <param name="userid">用户ID</param>
        /// <param name="caseId">业务流WID</param>
        /// <param name="baid">步骤ID</param>
        /// <returns>返回初始化数据</returns>
        [DataAction("GetData", "beginTime", "endTime", "name", "userid")]
        public string GetData(string beginTime, string endTime, string name, string userid)
        {
            IDbTransaction tran = null;
            DataSet dataSet = null;
            GetDataModel dataModel = new GetDataModel();
            try
            {
                tran = Utility.Database.BeginDbTransaction();
                string sql = "select * from B_OA_Attendance where 1=1 ";
                if (name != null & name != "") { sql += " and name='{0}' "; sql = string.Format(sql, name); }
                if (beginTime != null & beginTime != "") { sql += " and WorkDate>='{0}'"; sql = string.Format(sql, beginTime); }
                if (endTime != null & endTime != "") { sql += " and WorkDate<='{0}'"; sql = string.Format(sql, endTime); }
                sql += " order by WorkDate desc ";
                dataSet = Utility.Database.ExcuteDataSet(sql, tran);
                string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
                List<B_OA_Attendance> listAttentdance = (List<B_OA_Attendance>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_Attendance>));
                dataModel.listAttendance = new List<B_OA_Attendance>();
                dataModel.listAttendance = listAttentdance;
                 
                Utility.Database.Commit(tran);//提交事务
                return Utility.JsonResult(true, null, dataModel);//将对象转为json字符串并返回到客户端
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

        [DataAction("SetUserName", "userid")]
        public string SetUserName( string userid)
        {
            IDbTransaction tran = null;
            DataSet dataSet = null;
            try
            {
                string mac = HardwareInfo.GetMac();
                var userInfo = ComClass.GetUserInfo(userid);
                tran = Utility.Database.BeginDbTransaction();
                string sql = "declare @userid varchar(20);set @userid='';select @userid=isnull(userid,'') from B_OA_userMacAddress where macAddress='{0}';" +
                             "if @userid<>'' begin " +
                             "select * from B_OA_userMacAddress where macAddress='{1}' and userid='{2}'; end else begin " +
                             "insert into B_OA_userMacAddress(userid,userName,macAddress) values('{3}','{4}','{5}'); select '-' as a; end ";
                sql = string.Format(sql, mac, mac, userid, userid, userInfo.CnName, mac);
                dataSet = Utility.Database.ExcuteDataSet(sql, tran);
                Utility.Database.Commit(tran);//提交事务
                if (dataSet == null || dataSet.Tables[0] == null || dataSet.Tables[0].Rows.Count < 1)
                {
                    return Utility.JsonResult(false, userInfo.CnName+"不能在该台电脑上打卡");//将对象转为json字符串并返回到客户端
                }
                else {
                    return Utility.JsonResult(true, null);//将对象转为json字符串并返回到客户端
                }
                
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
        /// 打卡
        /// </summary>
        /// <param name="userid">用户ID</param>
        /// <param name="caseId">业务流WID</param>
        /// <param name="baid">步骤ID</param>
        /// <returns>返回初始化数据</returns>
        [DataAction("Daka", "dakatype", "userid")]
        public string Daka(string dakatype,  string userid)
        {
            IDbTransaction tran = null;
            DataSet dataSet = null;
            try
            {   //var userInfo = ComClass.GetUserInfo(userid);
                string mac=HardwareInfo.GetMac();
                tran = Utility.Database.BeginDbTransaction();
                string sql = "select * from B_OA_workTime where workTimeId='zybb' ";
                sql += "select * from B_OA_userMacAddress where macAddress='" + mac + "';";
                dataSet = Utility.Database.ExcuteDataSet(sql, tran);
                Utility.Database.Commit(tran);//提交事务
                return SaveAttendanceData(dataSet.Tables[0].Select("workTimeId='zybb'"), dataSet.Tables[1].Rows[0]["userid"].ToString(), mac, dataSet.Tables[1].Rows[0]["userName"].ToString(), dakatype, DateTime.Now);
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


        //保存考勤数据
        private string SaveAttendanceData(DataRow[] workTime, string employeeId, string cardId, string name, string dakatype, DateTime da)
        {
            string datestring = da.ToLongDateString();
            string msg = "";
            IDbTransaction Trans = null;
            DataSet set = null;
            try
            {
                Trans = Utility.Database.BeginDbTransaction();
                string sql = "if not exists(" +
                               "select employeeId from B_OA_Attendance where employeeId='{0}' and cardId='{1}' and WorkDate=CONVERT(varchar(20),GETDATE(),23)" +
                            ") " +
                            "begin " +
                               "insert into B_OA_Attendance(employeeId,cardId,WorkDate,name) values('{2}','{3}',CONVERT(varchar(20),GETDATE(),23),'{4}') " +
                            "end ";
                sql = string.Format(sql, employeeId, cardId, employeeId, cardId, name);
                Utility.Database.ExcuteDataSet(sql, Trans);

                string startWorktime1_s = datestring + " " + workTime[0]["startWorktime1_s"].ToString();
                string startWorktime1_e = datestring + " " + workTime[0]["startWorktime1_e"].ToString();
                DateTime startTime1_s = Convert.ToDateTime(startWorktime1_s);
                DateTime startTime1_e = Convert.ToDateTime(startWorktime1_e);
                string startWorktime2_s = startWorktime2_s = datestring + " " + workTime[0]["startWorktime2_s"].ToString();
                DateTime startTime2_s = startTime2_s = Convert.ToDateTime(startWorktime2_s);
                string startWorktime2_e = datestring + " " + workTime[0]["startWorktime2_e"].ToString();
                DateTime startTime2_e = Convert.ToDateTime(startWorktime2_e);

                string endWorktime1_s = datestring + " " + workTime[0]["endWorktime1_s"].ToString();
                string endWorktime1_e = datestring + " " + workTime[0]["endWorktime1_e"].ToString();
                DateTime endTime1_s = Convert.ToDateTime(endWorktime1_s);
                DateTime endTime1_e = Convert.ToDateTime(endWorktime1_e);
                string endWorktime2_s = "";
                DateTime endTime2_s = new DateTime();
                string endWorktime2_e = "";
                DateTime endTime2_e = new DateTime();

                if (dakatype == "1")//早上上班卡
                {               
                    if (da < startTime1_s)//未到允许打卡时间
                    {
                        msg = "不在允许打卡时间范围内";
                    }
                    else if (da >= startTime1_s && da <= startTime1_e)//如果在允许打卡时间内
                    {
                        sql = "update B_OA_Attendance set startWorktime1='{0}',state1_s='正常' where isnull(startWorktime1,'')='' and employeeId='{1}' and cardId='{2}' and WorkDate=CONVERT(varchar(20),GETDATE(),23)";
                        sql = string.Format(sql, da.ToLongTimeString(), employeeId, cardId);
                        Utility.Database.ExcuteDataSet(sql, Trans);

                    }
                    else if (da > startTime1_e)//如果上班打卡时间超过允许时间
                    {
                        sql = "update B_OA_Attendance set startWorktime1='{0}',state1_s='迟到' where isnull(startWorktime1,'')='' and employeeId='{1}' and cardId='{2}' and WorkDate=CONVERT(varchar(20),GETDATE(),23)";
                            sql = string.Format(sql, da.ToLongTimeString(), employeeId, cardId);
                            Utility.Database.ExcuteDataSet(sql, Trans);
                    }
                    else
                    {
                        msg = "不在允许打卡时间范围内";
                    }

                }
                else if (dakatype == "2") //早上下班卡
                {       
                    if (workTime[0]["endWorktime2_s"] != null)
                    {
                        endWorktime2_s = datestring + " " + workTime[0]["endWorktime2_s"].ToString();
                        endTime2_s = Convert.ToDateTime(endWorktime2_s);
                    }             
                    if (workTime[0]["endWorktime2_e"] != null)
                    {
                        endWorktime2_e = datestring + " " + workTime[0]["endWorktime2_e"].ToString();
                        endTime2_e = Convert.ToDateTime(endWorktime2_e);
                    }

                    if (da < endTime1_s)//未到允许打卡时间
                    {
                        sql = "update B_OA_Attendance set endWorktime1='{0}',state1_e='早退' where employeeId='{1}' and cardId='{2}' and WorkDate=CONVERT(varchar(20),GETDATE(),23)";
                        sql = string.Format(sql, da.ToLongTimeString(), employeeId, cardId);
                        Utility.Database.ExcuteDataSet(sql, Trans); 
                    }
                    else if (da >= endTime1_s && da <= endTime1_e)//如果在允许打卡时间内
                    {
                        sql = "update B_OA_Attendance set endWorktime1='{0}',state1_e='正常' where employeeId='{1}' and cardId='{2}' and WorkDate=CONVERT(varchar(20),GETDATE(),23)";
                        sql = string.Format(sql, da.ToLongTimeString(), employeeId, cardId);
                        Utility.Database.ExcuteDataSet(sql, Trans);
                    }
                    else {
                        msg = "不在允许打卡时间范围内";
                    }
                }
                else if (dakatype == "3")//下午上班卡
                {
                    if (da < startTime2_s)//未到允许打卡时间
                    {
                        msg = "不在允许打卡时间范围内";
                    }
                    else if (da >= startTime2_s && da <= startTime2_e)//如果在允许打卡时间内
                    {
                        sql = "update B_OA_Attendance set startWorktime2='{0}',state2_s='正常' where isnull(startWorktime2,'')='' and employeeId='{1}' and cardId='{2}' and WorkDate=CONVERT(varchar(20),GETDATE(),23)";
                        sql = string.Format(sql, da.ToLongTimeString(), employeeId, cardId);
                        Utility.Database.ExcuteDataSet(sql, Trans);
                    }
                    else if (da > startTime1_e)//如果上班打卡时间超过允许时间
                    {
                        sql = "update B_OA_Attendance set startWorktime2='{0}',state2_s='迟到' where isnull(startWorktime2,'')='' and employeeId='{1}' and cardId='{2}' and WorkDate=CONVERT(varchar(20),GETDATE(),23)";
                        sql = string.Format(sql, da.ToLongTimeString(), employeeId, cardId);
                        Utility.Database.ExcuteDataSet(sql, Trans);
                    }
                    else
                    {
                        msg = "不在允许打卡时间范围内";
                    }

                }
                else if (dakatype == "4") //下午下班卡
                {
                    if (workTime[0]["endWorktime2_s"] != null)
                    {
                        endWorktime2_s = datestring + " " + workTime[0]["endWorktime2_s"].ToString();
                        endTime2_s = Convert.ToDateTime(endWorktime2_s);
                    }
                    if (workTime[0]["endWorktime2_e"] != null)
                    {
                        endWorktime2_e = datestring + " " + workTime[0]["endWorktime2_e"].ToString();
                        endTime2_e = Convert.ToDateTime(endWorktime2_e);
                    }

                    if (da < endTime2_s)//未到允许打卡时间
                    {
                        sql = "update B_OA_Attendance set endWorktime2='{0}',state2_e='早退' where employeeId='{1}' and cardId='{2}' and WorkDate=CONVERT(varchar(20),GETDATE(),23)";
                        sql = string.Format(sql, da.ToLongTimeString(), employeeId, cardId);
                        Utility.Database.ExcuteDataSet(sql, Trans);
                    }
                    else if (da >= endTime2_s && da <= endTime2_e)//如果在允许打卡时间内
                    {
                        sql = "update B_OA_Attendance set endWorktime2='{0}',state2_e='正常' where employeeId='{1}' and cardId='{2}' and WorkDate=CONVERT(varchar(20),GETDATE(),23)";
                        sql = string.Format(sql, da.ToLongTimeString(), employeeId, cardId);
                        Utility.Database.ExcuteDataSet(sql, Trans);
                    }
                    else
                    {
                        msg = "不在允许打卡时间范围内";
                    }
                }

                sql = "select * from B_OA_Attendance where employeeId='{1}' and cardId='{2}' and WorkDate=CONVERT(varchar(20),GETDATE(),23) ";
                sql = string.Format(sql, da.ToLongTimeString(), employeeId, cardId);
                set = Utility.Database.ExcuteDataSet(sql, Trans);
                Trans.Commit();//提交事务


                if (msg != "")
                {
                    return Utility.JsonResult(false, msg);//将对象转为json字符串并返回到客户端
                }
                else {
                    return Utility.JsonResult(true, "打卡成功", set.Tables[0]);//将对象转为json字符串并返回到客户端
                }
            }
            catch (Exception ex)
            {
                Trans.Rollback();
                throw ex;
            }
            finally
            {
                if (Trans != null) Trans.Dispose();
                if (set != null) set.Dispose();
            }
        }



        public override string Key
        {
            get
            {
                return "B_OA_AttendanceSvc";
            }
        }


        /// <summary>
        /// 获取数据模型
        /// </summary>
        public class GetDataModel
        {
            public List<B_OA_Attendance> listAttendance;
            public B_OA_Attendance attendance;
        }

    }
}

