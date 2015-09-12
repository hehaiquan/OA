using IWorkFlow.Host;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.ORM;
using System.Data;
using Newtonsoft.Json;

namespace BizService.Services.B_OA_AddressBookSvc
{
    // created by zhoushining
    class B_OA_AddressBookSvc : BaseDataHandler
    {
        // B_OA_AddressBook
        [DataAction("GetData", "content", "userid")]
        public object GetData(string content, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat("select id,name, phone, unitphone, mobilephone, fax, email, dpid, dpname, userId, personal, createtime, ownnerUserId from B_OA_AddressBook where personal='0' order by createtime desc", userid);

                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                var data = new GetDataModel();// 获取数据
                DataTable dataTable = ds.Tables[0];
                B_OA_AddressBook sourceListEdit = new B_OA_AddressBook();
                Utility.Database.Commit(tran);
                return new
                {
                    dataTable = dataTable,
                    sourceListEdit = sourceListEdit
                };
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, ex.Message);
            }
        }


        /// <summary>
        /// 读取个人通讯录
        /// </summary>
        /// <param name="content"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetDatas", "content", "userid")]
        public object GetDatas(string content, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat("select id,name, phone, unitphone, mobilephone, fax, email, dpid, dpname, userId, personal, createtime, ownnerUserId from B_OA_AddressBook where ownnerUserId='{0}' order by createtime desc", userid);
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                var data = new GetDataModel();// 获取数据
                DataTable  dataTable = ds.Tables[0];
                B_OA_AddressBook  sourceListEdit = new B_OA_AddressBook();
                Utility.Database.Commit(tran);
                return new
                {
                    dataTable = dataTable,
                    sourceListEdit = sourceListEdit
                };
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, ex.Message);
            }
        }

        // 保存
        [DataAction("Save", "content", "userid")]
        public string Save(string content, string userid)
        {
            //SkyLandDeveloper developer = SkyLandDeveloper.FromJson("{}");
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                SaveDataModel data = JsonConvert.DeserializeObject<SaveDataModel>(content);
                data.baseInfo.createtime = DateTime.Now;// 创建时间
                SaveData(data, userid, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存成功！");
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, "保存失败:" + ex.Message.Replace(":", " "));
            }
        }

        //// 保存
        //[DataAction("Saves", "content", "userid")]
        //public string Saves(string content, string userid)
        //{
        //    //SkyLandDeveloper developer = SkyLandDeveloper.FromJson("{}");
        //    IDbTransaction tran = Utility.Database.BeginDbTransaction();
        //    try
        //    {
        //        SaveDataModel data = JsonConvert.DeserializeObject<SaveDataModel>(content);
        //        var deptUserInfo = ComClass.GetDeptAndUserByUserId(userid);
        //        data.baseInfo.dpid = deptUserInfo.deptinfo.DPID;
        //        data.baseInfo.dpname = deptUserInfo.deptinfo.DPName;
        //        data.baseInfo.userId = userid;
        //        data.baseInfo.personal = 1;
        //        data.baseInfo.createtime = DateTime.Now;// 创建时间
        //        SaveData(data, tran);
        //        developer.Commit();

        //        var retContent = new GetDataModel();
        //        B_OA_AddressBook ent = new B_OA_AddressBook();
        //        ent.Condition.Add("id=" + data.baseInfo.id);

        //        B_OA_AddressBook ents = new B_OA_AddressBook();
        //        ents.Condition.Add("userId=" + data.baseInfo.userId);
        //        ents.Condition.Add("personal=" + 1);

        //        retContent.baseInfo = Utility.Database.QueryObject<B_OA_AddressBook>(ent);
        //        retContent.sourceList = Utility.Database.QueryList<B_OA_AddressBook>(ents);
        //        return Utility.JsonResult(true, "保存成功！", retContent);
        //    }
        //    catch (Exception ex)
        //    {
        //        developer.RollBack();
        //        ComBase.Logger(ex);
        //        return Utility.JsonResult(false, "保存失败:" + ex.Message.Replace(":", " "));
        //    }
        //}

        // 保存数据
        public void SaveData(SaveDataModel data, string userid, IDbTransaction tran)
        {
            try
            {
                DataTable dt = Utility.Database.ExcuteDataSet("select id from B_OA_AddressBook where id =" + data.baseInfo.id, tran).Tables[0];
                // 获取参数值
                if (dt.Rows.Count == 0)
                {
                    if (data.baseInfo.personal == 1)
                    {
                        data.baseInfo.ownnerUserId = userid;
                    }
                    Utility.Database.Insert<B_OA_AddressBook>(data.baseInfo, tran);
                }
                else
                {
                    // var ent = new B_OA_AddressBook();
                    data.baseInfo.Condition.Add("id=" + data.baseInfo.id);
                    Utility.Database.Update<B_OA_AddressBook>(data.baseInfo, tran);
                }
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("数据获取失败！错误：" + ex.Message, ex));
            }
        }

        // 复制与保存个人通讯录
        [DataAction("CopyAndSaveData", "content", "userid")]
        public string CopyAndSaveData(string content, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_AddressBook baseInfo = new B_OA_AddressBook();
                baseInfo.Condition.Add("id=" + content);
                baseInfo = Utility.Database.QueryObject<B_OA_AddressBook>(baseInfo);// 获取客户端数据

                var deptUserInfo = ComClass.GetDeptAndUserByUserId(userid);
                B_OA_AddressBook copyEnt = new B_OA_AddressBook();// 实例化一个对象并给它赋值
                copyEnt.name = baseInfo.name;
                copyEnt.phone = baseInfo.phone;
                copyEnt.unitphone = baseInfo.unitphone;
                copyEnt.mobilephone = baseInfo.mobilephone;
                copyEnt.fax = baseInfo.fax;
                copyEnt.email = baseInfo.email;
                copyEnt.dpid = deptUserInfo.deptinfo.DPID;
                copyEnt.dpname = deptUserInfo.deptinfo.DPName;
                copyEnt.userId = userid;
                copyEnt.personal = 1;
                copyEnt.createtime = DateTime.Now;// 创建时间
                copyEnt.ownnerUserId = userid;
                Utility.Database.Insert<B_OA_AddressBook>(copyEnt, tran);

                var returnData = new B_OA_AddressBook();// 返回值
                DataTable dt = Utility.Database.ExcuteDataSet("select @@identity;", tran).Tables[0];
                returnData.Condition.Add("id=" + Convert.ToInt32(dt.Rows[0][0]));
                returnData = Utility.Database.QueryObject<B_OA_AddressBook>(returnData, tran);
                Utility.Database.Commit(tran);
                tran.Dispose();

                return Utility.JsonResult(true, "复制成功！", returnData);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex.Message);
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "复制失败！", ex.Message);
            }
        }

        [DataAction("DeleteData", "content")]
        public string DeleteData(string content)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                var delEnt = new B_OA_AddressBook();
                delEnt.Condition.Add("id=" + content);
                Utility.Database.Delete(delEnt, tran);
                Utility.Database.Commit(tran);
                tran.Dispose();
                return Utility.JsonResult(true, "删除成功！");
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, ex.Message, null);
            }
        }

        // 获取部门编号
        [DataAction("GetDeptInfoAndUserInfo", "userid")]
        public string GetDeptInfoAndUserInfo(string userid)
        {
            // var userInfo = ComClass.GetUserInfo(userid);
            var departmentInfo = ComClass.GetDeptAndUserByUserId(userid);
            return Utility.JsonResult(true, "查询成功！", departmentInfo);
        }

        public override string Key
        {
            get
            {
                return "B_OA_AddressBookSvc";
            }
        }

    }// class

    public class GetDataModel
    {
        public B_OA_AddressBook baseInfo;
        public List<B_OA_AddressBook> sourceList;
        public B_OA_AddressBook sourceListEdit;
        public DataTable dataTable;
    }

    public class SaveDataModel
    {
        public B_OA_AddressBook baseInfo;
        public KOGridEdit<B_OA_AddressBook> sourceList;
    }
}
