using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BizService.Services;
using IWorkFlow.BaseService;
using IWorkFlow.DataBase;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;

namespace BizService.B_GoodsSvc
{
    public class B_OA_UserSvc : BaseDataHandler
    {
        [DataAction("GetUserTree", "userid")]
        public object GetUserTree(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat(@"
select a.id,a.name,a.parentId,a.flag,a.drag,a.RankID from (
select DPID as id,DPName as name ,PDPID as parentId,'0' as flag,'false' as drag, CAST(RankID AS int) as RankID from FX_Department
union all
select UserId as id,CnName as name,DPID as parentId,'1' as flag,'true' as drag, CAST(RankID AS int) as RankID from FX_UserInfo
where EnName is not null
) as a GROUP BY a.id,a.name,a.parentId,a.flag,a.drag,a.RankID  order by parentId asc,a.RankID asc 
");
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                DataTable treeSource = dataSet.Tables[0];
                Utility.Database.Commit(tran);
                return new
                {
                    treeSource = treeSource
                };
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("获取数据失败！", ex));
            }
        }

        [DataAction("GetDepTree", "userid")]
        public object GetDepTree(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat(@"
select DPID as id,DPName as name ,PDPID as parentId from FX_Department
union 
select '1' as id ,'全体部门' as name ,'0' as parentId ");
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                DataTable treeSource = dataSet.Tables[0];
                Utility.Database.Commit(tran);
                return new
                {
                    treeSource = treeSource
                };
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("获取数据失败！", ex));
            }
        }

        class UserAllInfo
        {
            public UserInfo _userinfo;
            public List<Department> _lst_department;
        }

        [DataAction("GetUserInfobyid", "id")]
        public string GetUserInfobyid(string id)
        {
            UserAllInfo obj = new UserAllInfo();
            //
            UserInfo query = new UserInfo();
            query.Condition.Add("UserID=" + id);
            obj._userinfo = Utility.Database.QueryObject<UserInfo>(query);
            //
            Department query2 = new Department();
            obj._lst_department = Utility.Database.QueryList<Department>(query2);
            try
            {
                return PackResult.JsonObj(true, obj);
            }
            catch (Exception e)
            {
                return PackResult.JsonMsg(false, "GetUserInfobyid失败");
            }
        }


        [DataAction("SaveUserInfo", "UserID", "PWD", "EnName", "CnName", "DPID", "Phone")]
        public string SaveUserInfo(string UserID, string PWD, string EnName, string CnName, string DPID, string Phone)
        {
            try
            {
                if (UserID == IWorkPrivilegeManage.AdminID) return PackResult.JsonMsg(false, "顶级管理员不能编辑");

                UserInfo _userinfo = new UserInfo();
                _userinfo.Condition.Add("UserID=" + UserID);
                UserInfo _user = Utility.Database.QueryObject(_userinfo);

                DataRowMap rm = new DataRowMap();
                rm.TableName = "FX_UserInfo";
                rm.Condition.Add("UserID=" + UserID);
                rm.Fields.Add(new FieldInfo("PWD", PWD));
                rm.Fields.Add(new FieldInfo("EnName", EnName));
                rm.Fields.Add(new FieldInfo("CnName", CnName));
                rm.Fields.Add(new FieldInfo("DPID", DPID));
                rm.Fields.Add(new FieldInfo("Phone", Phone));
                if (_user.DPID != DPID) rm.Fields.Add(new FieldInfo("RankID", null));
                Utility.Database.Update(rm);
                return PackResult.JsonMsg(true, "添加成功");
            }
            catch (Exception e)
            {
                return PackResult.JsonMsg(false, "SaveUserInfo失败");
            }
        }

        [DataAction("AppendUser", "DPID", "EnName", "PWD", "CnName")]
        public string AppendUser(string DPID, string EnName, string PWD, string CnName)
        {
            try
            {
                lock (forlock)
                {
                    UserInfo insertObj = new UserInfo();

                    string New_UserID = Utility.MaxValue<UserInfo>("U", 6);
                    {
                        UserInfo user = new UserInfo();
                        user.Condition.Add("UserID=" + New_UserID);
                        UserInfo findUser = Utility.Database.QueryObject<UserInfo>(user);
                        if (findUser != null) throw new Exception("出现重复UserID,系统异常请及时联系管理员");
                    }

                    insertObj.DPID = DPID;
                    insertObj.UserID = New_UserID;
                    insertObj.EnName = EnName;
                    insertObj.PWD = PWD;
                    insertObj.CnName = CnName;

                    Utility.Database.Insert<UserInfo>(insertObj);
                    return PackResult.JsonObj(true, insertObj);
                }
            }
            catch (Exception e)
            {

                return PackResult.JsonMsg(false, "EditDepartment失败" + e.Message);
            }
        }

        static Object forlock = new Object();
        [DataAction("CreateDepartment", "DPName", "ParentId")]
        public object CreateDepartment(string DPName, string ParentId)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                lock (forlock)
                {
                   
                    string NEW_DPID = Utility.MaxValue<Department>("D", 6, tran);
                    Department insert_obj = new Department();
                    insert_obj.DPID = NEW_DPID;//主键
                    insert_obj.DPName = DPName;//文件名称
                    insert_obj.PDPID = ParentId;//父类ID
                    Utility.Database.Insert<Department>(insert_obj, tran);
                    Utility.Database.Commit(tran);
                    return new
                    {
                        insert_obj = insert_obj
                    };
                }
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return PackResult.JsonMsg(false, "CreateDepartment失败!" + e.Message);
            }
        }

        [DataAction("EditDepartment", "DPID", "DPName")]
        public string EditDepartment(string DPID, string DPName)
        {
            try
            {
                DataRowMap rm = new DataRowMap();
                rm.TableName = "FX_Department";
                rm.Condition.Add("DPID=" + DPID);
                rm.Fields.Add(new FieldInfo("DPName", DPName));
                Utility.Database.Update(rm);
                return PackResult.JsonMsg(true, null);
            }
            catch (Exception)
            {
                return PackResult.JsonMsg(false, "EditDepartment失败");
            }
        }


        [DataAction("DeleteDp", "dpId", "userid")]
        public object DeleteDp(string dpId, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                bool b = FindExist(dpId, tran);
                bool c = FindSonExist(dpId, tran);

                if (b == true)
                {
                    return Utility.JsonResult(false, "删除部门前先保证部门下没有任何用户");
                }
                else if (c == true)
                {
                    return Utility.JsonResult(false, "删除部门前先保证部门下没有任何子部门");
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
                throw (new Exception("删除失败！错误：" + ex.Message, ex));
            }
        }

        private bool FindSonExist(string dpid, IDbTransaction tran)
        {
            FX_Department dp = new FX_Department();
            dp.Condition.Add("PDPID =" + dpid);
            List<FX_Department> listDp = Utility.Database.QueryList<FX_Department>(dp, tran);
            if (listDp.Count > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
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


        [DataAction("EdtiParent", "id", "parentId")]
        public object EdtiParent(string id, string parentId)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                DataRowMap rm = new DataRowMap();
                rm.TableName = "FX_Department";
                rm.Condition.Add("DPID=" + id);
                rm.Fields.Add(new FieldInfo("PDPID", parentId));
                Utility.Database.Update(rm);
                return new {};
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                throw (new Exception("保存数据失败！错误：" + ex.Message, ex));
            }
        }

        public override string Key
        {
            get
            {
                return "B_OA_UserSvc";
            }
        }
    }

}
