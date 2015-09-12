using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using DocumentFormat.OpenXml.Office.CustomUI;
using IWorkFlow.BaseService;
using IWorkFlow.DataBase;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;

namespace BizService.Services
{
    public class FX_UserInforAddSvc : BaseDataHandler
    {
        [DataAction("GetDataByUserId", "uid", "userid")]
        public object GetDataByUserId(string uid, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat(@"
select a.UserID,a.EnName,a.CnName,a.PWD,a.Phone,a.DPID,a.RankID,b.* from FX_UserInfo as a 
LEFT JOIN FX_UserInfo_Add as b on a.UserID = b.UID where a.UserID = '{0}' 
", uid);

                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string json = JsonConvert.SerializeObject(dataSet.Tables[0]);
                List<FX_UserInfo_Add> listUser = (List<FX_UserInfo_Add>)JsonConvert.DeserializeObject(json, typeof(List<FX_UserInfo_Add>));
                FX_UserInfo_Add userInforAdd = listUser[0];
                Utility.Database.Commit(tran);
                return new
                {
                    userInforAdd = userInforAdd
                };

            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                throw (new Exception("获取数据失败！", ex));
            }
        }

        [DataAction("SaveData", "json", "userid")]
        public object SaveData(string json, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                FX_UserInfo_Add userInforAdd = JsonConvert.DeserializeObject<FX_UserInfo_Add>(json);
                if (string.IsNullOrEmpty(userInforAdd.UserID))
                {
                    #region 李总源码
                    UserInfo insertObj = new UserInfo();

                    string New_UserID = Utility.MaxValue<UserInfo>("U", 6);
                    {
                        UserInfo user = new UserInfo();
                        user.Condition.Add("UserID=" + New_UserID);
                        UserInfo findUser = Utility.Database.QueryObject<UserInfo>(user);
                        if (findUser != null) throw new Exception("出现重复UserID,系统异常请及时联系管理员");
                    }
                    insertObj.DPID = userInforAdd.DPID;
                    insertObj.UserID = New_UserID;
                    insertObj.EnName = userInforAdd.EnName;
                    insertObj.PWD = userInforAdd.PWD;
                    insertObj.CnName = userInforAdd.CnName;
                    if (!string.IsNullOrEmpty(userInforAdd.RankID))
                    {
                        insertObj.RankID = userInforAdd.RankID;
                    }
                    else
                    {
                        insertObj.RankID ="0";
                    }
                    Utility.Database.Insert<UserInfo>(insertObj, tran);
                    #endregion

                    //用户表附加信息表
                    userInforAdd.UID = New_UserID;
                    Utility.Database.Insert<FX_UserInfo_Add>(userInforAdd, tran);
                }
                else
                {
                    #region 李总源码
                    if (userInforAdd.UserID == IWorkPrivilegeManage.AdminID) return PackResult.JsonMsg(false, "顶级管理员不能编辑");

                    UserInfo _userinfo = new UserInfo();
                    _userinfo.Condition.Add("UserID=" + userInforAdd.UserID);
                    UserInfo _user = Utility.Database.QueryObject(_userinfo);

                    DataRowMap rm = new DataRowMap();
                    rm.TableName = "FX_UserInfo";
                    rm.Condition.Add("UserID=" + userInforAdd.UserID);
                    rm.Fields.Add(new FieldInfo("PWD", userInforAdd.PWD));
                    rm.Fields.Add(new FieldInfo("EnName", userInforAdd.EnName));
                    rm.Fields.Add(new FieldInfo("CnName", userInforAdd.CnName));
                    rm.Fields.Add(new FieldInfo("DPID", userInforAdd.DPID));
                    rm.Fields.Add(new FieldInfo("Phone", userInforAdd.Phone));

                    if (!string.IsNullOrEmpty(userInforAdd.RankID))
                    {
                        rm.Fields.Add(new FieldInfo("RankID", userInforAdd.RankID));
                    }
                    else
                    {
                        rm.Fields.Add(new FieldInfo("RankID","0"));
                    }

                    //if (_user.DPID != userInforAdd.DPID) rm.Fields.Add(new FieldInfo("RankID", null));
                    Utility.Database.Update(rm, tran);
                    #endregion

                    FX_UserInfo_Add userInfor = new FX_UserInfo_Add();
                    userInfor.Condition.Add("UID = " + userInforAdd.UserID);
                    userInfor = Utility.Database.QueryObject<FX_UserInfo_Add>(userInfor, tran);
                    if (userInfor == null)
                    {
                        userInforAdd.UID = userInforAdd.UserID;
                        Utility.Database.Insert(userInforAdd, tran);
                    }
                    else
                    {
                        userInforAdd.Condition.Add("UID=" + userInforAdd.UID);
                        Utility.Database.Update(userInforAdd, tran);
                    }
                }
                Utility.Database.Commit(tran);
                bool b = true;
                return new
                {
                    b = b
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                throw (new Exception("获取数据失败！", ex));
            }
        }

        [DataAction("GetModel", "flid")]
        public object GetModel(string flid)
        {
            FX_UserInfo_Add userInforAdd = new FX_UserInfo_Add();
            userInforAdd.DPID = flid;
            return new
            {
                userInforAdd = userInforAdd
            };
        }

        [DataAction("DeleteData", "uid")]
        public object DeleteData(string uid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                if (!string.IsNullOrEmpty(uid))
                {
                    #region 李总代码
                    //删除用户表
                    UserInfo _userinfo = new UserInfo();
                    DataRowMap rm = new DataRowMap();
                    rm.TableName = "FX_UserInfo";
                    rm.Fields.Add(new FieldInfo("EnName", null));
                    rm.Fields.Add(new FieldInfo("DPID", null));
                    rm.Fields.Add(new FieldInfo("UIConfig", null));
                    rm.Fields.Add(new FieldInfo("PortalConfig", null));
                    rm.Fields.Add(new FieldInfo("RankID", null));
                    rm.Condition.Add("UserID=" + uid);
                    Utility.Database.Update(rm, tran);
                    //删角色
                    RoleUserR _roleuserr = new RoleUserR();
                    _roleuserr.Condition.Add("UserID=" + uid);
                    Utility.Database.Delete<RoleUserR>(_roleuserr, tran);
                    //删用户权限组对应关系
                    UserGroupR usergroupr = new UserGroupR();
                    usergroupr.Condition.Add("UserID=" + uid);
                    Utility.Database.Delete<UserGroupR>(usergroupr, tran);
                    //删用户和权限直接对应表
                    UserPrivilegeR userprivileger = new UserPrivilegeR();
                    userprivileger.Condition.Add("UserID=" + uid);
                    Utility.Database.Delete<UserPrivilegeR>(userprivileger, tran);
                    //用户关联信息表
                    FX_UserInfo_Add userAdd = new FX_UserInfo_Add();
                    userprivileger.Condition.Add("UID=" + uid);
                    Utility.Database.Delete<FX_UserInfo_Add>(userAdd, tran);
                    #endregion
                    Utility.Database.Commit(tran);
                }
                return new
                {
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                throw (new Exception("获取数据失败！", ex));
            }
        }

        [DataAction("EdtiParent","id", "parentId")]
        public object EdtiParent(string id,string parentId)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                DataRowMap rm = new DataRowMap();
                rm.TableName = "FX_UserInfo";
                rm.Condition.Add("UserID=" + id);
                rm.Fields.Add(new FieldInfo("DPID", parentId));
                Utility.Database.Update(rm);
                return new { };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                throw (new Exception("保存数据失败！错误：" + ex.Message, ex));
            }
        }

        [DataAction("UpdateRank", "JsonData")]
        public object UpdateRank(string JsonData)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                List<RankModel> rankList = (List<RankModel>)JsonConvert.DeserializeObject(JsonData, typeof(List<RankModel>));

                for (int i = 0 ; i < rankList.Count;i++)
                {
                    DataRowMap rm = new DataRowMap();
                    rm.TableName = "FX_UserInfo";
                    rm.Condition.Add("UserID=" + rankList[i].id);
                    rm.Fields.Add(new FieldInfo("RankID", rankList[i].rankId));
                    Utility.Database.Update(rm,tran);
                }
                Utility.Database.Commit(tran);
                return new
                {
                    
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                throw (new Exception("保存数据失败！错误：" + ex.Message, ex));
            }
        }

            [DataAction("UpdateDpRank", "JsonData")]
        public object UpdateDpRank(string JsonData)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                List<RankModel> rankList = (List<RankModel>)JsonConvert.DeserializeObject(JsonData, typeof(List<RankModel>));

                for (int i = 0 ; i < rankList.Count;i++)
                {
                    DataRowMap rm = new DataRowMap();
                    rm.TableName = "FX_Department";
                    rm.Condition.Add("DPID=" + rankList[i].id);
                    rm.Fields.Add(new FieldInfo("RankID", rankList[i].rankId));
                    Utility.Database.Update(rm,tran);
                }
                Utility.Database.Commit(tran);
                return new
                {
                    
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                throw (new Exception("保存数据失败！错误：" + ex.Message, ex));
            }
        }
        

        public class RankModel
        {
            public string id;
            public string rankId;
        }

        public override string Key
        {
            get
            {
                return "FX_UserInforAddSvc";
            }
        }
    }
}
