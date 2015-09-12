using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using System.Data;
using BizService.Common;
using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;

namespace BizService.Services.FX_DepartmentSvc
{
    class FX_DepartmentSvc : BaseDataHandler
    {
        [DataAction("GetDepartmentList", "content")]
        public string GetDepartmentList(string content)
        {
            try
            {
                DataSet dataSet = Utility.Database.ExcuteDataSet(" select DPID as id, DPName as name from FX_Department ");
                return Utility.JsonResult(true, null, dataSet.Tables[0]);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, "查询部门数据失败！", null);
            }

        }
        [DataAction("GetAllList", "content")]
        public object GetAllList(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                FX_Department dp = new FX_Department();
                List<FX_Department> list = new List<FX_Department>();
                List<FX_Department> listDp = Utility.Database.QueryList(dp, tran);
                //直接返回数据，而不需要打包一层了
                return new
                {
                    list = listDp,
                    dp
                };

            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                throw (new Exception("数据获取失败！错误：" + ex.Message, ex));
            }
        }

        [DataAction("UpdateDPName", "DPID", "DPName", "FullName", "userid")]
        public object UpdateDPName(string DPID, string DPName, string FullName, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat(@"update FX_Department set DPName = '{0}' , FullName = '{1}' where DPID = '{2}'", DPName, FullName, DPID);
                Utility.Database.ExecuteNonQuery(strSql.ToString(), tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "修改成功");
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                throw (new Exception("保存数据失败！错误：" + ex.Message, ex));
            }
        }


        [DataAction("DeleteDp", "dpId", "userid")]
        public object DeleteDp(string dpId, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                bool b = FindExist(dpId, tran);
                if (b == true)
                {
                    return Utility.JsonResult(false, "还有部分员工被归类在此部门中，不能删除此数据");
                }
                else
                {
                    FX_Department dp = new FX_Department();
                    dp.Condition.Add("DPID = " + dpId);
                    Utility.Database.Delete(dp, tran);
                }
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除成功！");
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                throw (new Exception("保存数据失败！错误：" + ex.Message, ex));
            }
        }


        [DataAction("CreateDepartment", "DPName", "FullName")]
        public string CreateDepartment(string DPName, string FullName)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {

                string NEW_DPID = MaxValue("D", 6, tran);
                FX_Department insert_obj = new FX_Department();
                insert_obj.DPID = NEW_DPID;
                insert_obj.DPName = DPName;
                insert_obj.FullName = FullName;
                insert_obj.createDate = DateTime.Now.ToString();
                Utility.Database.Insert<FX_Department>(insert_obj, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "添加成功！");
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return PackResult.JsonMsg(false, "CreateDepartment失败!" + e.Message);
            }
        }

        public string MaxValue(string symbol, int len, IDbTransaction tran)
        {
            string sql = "SELECT MAX(DPID) AS DPID  FROM FX_Department";
            DataSet ds = Utility.Database.ExcuteDataSet(sql, tran);
            string o = ds.Tables[0].Rows[0][0].ToString();
            string str = null;
            if (o is DBNull) str = "0";
            else str = Regex.Replace((string)o, "\\D+", "");

            return string.Format("{0}{1:D" + len + "}", symbol, Convert.ToInt32(str) + 1);
        }


        //查找是否有用户在此部门
        public bool FindExist(string dpid, IDbTransaction tran)
        {
            FX_UserInfo user = new FX_UserInfo();
            user.Condition.Add("DPID =" + dpid);
            List<FX_UserInfo> listUser = Utility.Database.QueryList<FX_UserInfo>(user, tran);
            if (listUser.Count > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public override string Key
        {
            get
            {
                return "FX_DepartmentSvc";
            }
        }
    }// class
}
