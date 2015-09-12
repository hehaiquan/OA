using BizService.Common;
using IWorkFlow.BaseService;
using IWorkFlow.DataBase;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BizService
{
    class ComClass
    {
        #region 基础相关

        #region 用户部门相关
        /// <summary>
        /// 根据用户ID获取用户信息
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public static UserInfo GetUserInfo(string userId)
        {
            UserInfo en = new UserInfo();
            en.Condition.Add("UserID=" + userId);
            en = Utility.Database.QueryObject<UserInfo>(en);
            return en;
        }


        /// <summary>
        /// 获取全部部门
        /// </summary>
        /// <returns></returns>
        public static List<Department> GetAllDepts()
        {
            Department deptEnt = new Department();
            deptEnt.OrderInfo = "rankid";
            var deptList = Utility.Database.QueryList(deptEnt);
            // deptList = deptList.OrderBy(o => o.RankId).ToList<Department>();// 排序
            return deptList;
        }

        public static FX_Department GetDeptByUserId(string userId)
        {
            //// Department deptEnt = new Department();
            //var sql = @"select UserID, EnName, CnName, DPName from FX_UserInfo a, FX_Department b where a.DPID = b.DPID and a.UserID = " + userId;
            //DataSet ds = Utility.Database.ExcuteDataSet(sql);
            //return ds;
            UserInfo uient = new UserInfo();
            uient.Condition.Add("UserID=" + userId);
            uient = Utility.Database.QueryObject<UserInfo>(uient);

            FX_Department dptent = new FX_Department();
            dptent.Condition.Add("DPID=" + uient.DPID);
            dptent = Utility.Database.QueryObject<FX_Department>(dptent);
            return dptent;
        }

        // 获取部门和用户信息
        public static DeptInfoAndUserInfo GetDeptAndUserByUserId(string userId)
        {
            try
            {
                var data = new DeptInfoAndUserInfo();
                UserInfo uient = new UserInfo();
                uient.Condition.Add("UserID=" + userId);
                uient = Utility.Database.QueryObject<UserInfo>(uient);
                data.userinfo = uient;

                FX_Department dptent = new FX_Department();
                dptent.Condition.Add("DPID=" + uient.DPID);
                dptent = Utility.Database.QueryObject<FX_Department>(dptent);
                data.deptinfo = dptent;
                return data;

            }
            catch (Exception ex)
            {
                ComBase.Logger(ex.Message);
                return null;
            }
        }

        public static DataTable GetSighture(string caseId,string type,IDbTransaction tran) {
            StringBuilder strSql = new StringBuilder();
            //读取签发
            strSql.AppendFormat(@"select s.*,u.CnName from B_OA_Sighture as s 
                LEFT JOIN FX_UserInfo as u on s.userid = u.UserID  where s.caseid='{0}'  and s.type = '{1}'", caseId, "0");
            DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
            return ds.Tables[0];
        }

        #endregion

        #region 权限相关

        /// <summary>
        /// 获取某个用户的全部权限
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public static List<IWorkFlow.BaseService.Privilege> GetPrivilegebyUserId(string userId)
        {
            return IWorkFlow.BaseService.IWorkPrivilegeManage.QueryPrivilegebyUserID(userId);//.FindAll(g => g.Type == "信访权限集").Select(p => p.ModelKey).Contains("deleteCase");
        }

        /// <summary>
        /// 是否拥有权限
        /// </summary>
        /// <param name="userId">用户ID</param>
        /// <param name="type">权限类型</param>
        /// <param name="modelKey">权限值</param>
        /// <returns></returns>
        public static bool IsHavePrivilege(string userId, string type, string modelKey)
        {
            var priList = GetPrivilegebyUserId(userId);
            return priList.Where(o => o.Type == type && o.ModelKey == modelKey).Count() > 0;
        }

        #endregion

        #region 数据字典（下拉框）数据

        /// <summary>
        /// 获取数据字典项
        /// </summary>
        /// <param name="type">数据字典类型</param>
        /// <returns></returns>
        public static List<BASE_DataDictItem> GetDataDictItemByType(string type)
        {
            BASE_DataDictType ddType = new BASE_DataDictType();
            ddType.Condition.Add(string.Format("TYPE={0}", type));
            ddType = Utility.Database.QueryObject(ddType);
            if (ddType != null)
            {
                string pk = ddType.PK;
                BASE_DataDictItem ddItem = new BASE_DataDictItem();
                ddItem.Condition.Add(string.Format("FK={0}", pk));
                return Utility.Database.QueryList(ddItem);
            }
            return null;
        }

        /// <summary>
        /// 获取数据字典项
        /// </summary>
        /// <param name="type">类型</param>
        /// <param name="isEnabled">是否只取启用的（默认：是）</param>
        /// <returns></returns>
        public static Dictionary<string, string> GetDataDict(string type, bool isEnabled = true)
        {
            Dictionary<string, string> dict = new Dictionary<string, string>();
            var list = GetDataDictItemByType(type);
            if (list != null)
            {
                foreach (var item in list)
                {
                    if (isEnabled)
                    {
                        if (string.IsNullOrWhiteSpace(item.IsEnabled) || item.IsEnabled != "0")
                        {
                            dict.Add(item.Value, item.Name);
                        }
                    }
                    else
                    {
                        dict.Add(item.Value, item.Name);
                    }
                }
            }
            return dict;
        }

        /// <summary>
        /// 获取数据字典项
        /// </summary>
        /// <param name="type">类型</param>
        /// <param name="isEnabled">是否只取启用的（默认：是）</param>
        /// <returns></returns>
        public static Dictionary<string, string> GetDataDictFromXml(string type, bool isEnabled = true)
        {
            Dictionary<string, string> dict = new Dictionary<string, string>();
            ComDataDict dd = new ComDataDict();
            var dditem = dd.GetDataDictConfig(type);
            if (dditem != null)
            {
                foreach (var item in dditem.DataDictItems)
                {
                    if (isEnabled)
                    {
                        if (item.IsEnabled == null || item.IsEnabled.Value)
                        {
                            dict.Add(item.Value, item.Name);
                        }
                    }
                    else
                    {
                        dict.Add(item.Value, item.Name);
                    }
                }
            }

            return dict;
        }

        #endregion

        #region 其他
        /// <summary>
        /// 获取GUID
        /// </summary>
        /// <returns></returns>
        public static string GetGuid()
        {
            System.Guid guid = new Guid();
            guid = Guid.NewGuid();
            return string.Format("{0}_{1}", DateTime.Now.ToString("yyyyMMddHHmmss"), guid.ToString());
        }
        #endregion

        #endregion

        #region 业务相关



        #endregion

        #region 工作流相关
        /// <summary>
        /// 获取工作流审批意见列表WorkFlowBusact（sqlserver）
        /// </summary>
        /// <param name="caseId">流程实例ID</param>
        /// <returns></returns>
        public static List<FX_WorkFlowBusAct> GetFlowCaseOpinion(string caseId)
        {
            string sql = @"
select *
  from (select a.CASEID, --获取发送人审批意见
               a.BAID,
               a.ACTID,
               a.ACTNAME,
               a.SENDACTID,
               a.SENDACTNAME,
               a.SENDER,
               a.SENDERNAME,
               a.USERID,
               a.USERNAME,
               a.RECEDATE,
               a.RECESTATE,
               a.STATE,
               a.REMARK,
               a.ISREADED,
               b.recedate as senddate
          from fx_workflowbusact a
          join fx_workflowbusact b
            on a.caseid = '{0}'
           and (a.state = 1 or a.state = 2) --限定已完成状态的
           and b.caseid = a.caseid --限定caseid
           and a.userid = b.sender --限定发送人
           and b.baid =
               ('BA'+right('000'+CONVERT(varchar,right(a.BAID,3)+1),3)) --限定发送步骤(存在下一个步骤则表示当前步骤为发送步骤)
        union all
        --获取最后审批人
        select a.CASEID,
               a.BAID,
               a.ACTID,
               a.ACTNAME,
               a.SENDACTID,
               a.SENDACTNAME,
               a.SENDER,
               a.SENDERNAME,
               a.USERID,
               a.USERNAME,
               a.RECEDATE,
               a.RECESTATE,
               a.STATE,
               a.REMARK,
               a.ISREADED,
               b.enddate as senddate
          from fx_workflowcase b
          join fx_workflowbusact a
            on b.id = 'C000002'
           and b.id = a.caseid
           and b.isend = 1--限定办结状态的
           and a.userid = b.ender --限定办结人
           and baid = ( select top 1 BAID from [FX_WorkFlowBusAct] where caseid = '{0}' order by baid desc)--限定最后步骤
           ) tball
 order by senddate desc --降序排序
";
            sql = string.Format(sql, caseId);
            DataSet ds = Utility.Database.ExcuteDataSet(sql);
            return ConvertHelper<FX_WorkFlowBusAct>.DataTableToList(ds.Tables[0]);
        }

        /// <summary>
        /// 获取工作流审批意见列表WorkFlowBusact（oracle）
        /// <param name="caseId">流程实例ID</param>
        /// <returns></returns>
        public static List<FX_WorkFlowBusAct> GetFlowCaseOpinion_Oracle(string caseId)
        {
            string sql = @"
select *
  from (select a.CASEID, --获取发送人审批意见
               a.BAID,
               a.ACTID,
               a.ACTNAME,
               a.SENDACTID,
               a.SENDACTNAME,
               a.SENDER,
               a.SENDERNAME,
               a.USERID,
               a.USERNAME,
               a.RECEDATE,
               a.RECESTATE,
               a.STATE,
               to_char(a.REMARK) as REMARK,
               a.ISREADED,
               b.recedate as senddate
          from fx_workflowbusact a
          join fx_workflowbusact b
            on a.caseid = '{0}'
           and (a.state = 1 or a.state = 2) --限定已完成状态的
           and b.caseid = a.caseid --限定caseid
           and a.userid = b.sender --限定发送人
           and b.baid =
               ('BA' || LPAD(to_number(SUBSTR(a.baid, 3)) + 1, 3, '0')) --限定发送步骤
        union
        --获取最后审批人
        select a.CASEID,
               a.BAID,
               a.ACTID,
               a.ACTNAME,
               a.SENDACTID,
               a.SENDACTNAME,
               a.SENDER,
               a.SENDERNAME,
               a.USERID,
               a.USERNAME,
               a.RECEDATE,
               a.RECESTATE,
               a.STATE,
               to_char(a.REMARK) as REMARK,
               a.ISREADED,
               b.enddate as senddate
          from fx_workflowcase b
          join fx_workflowbusact a
            on b.id = '{0}'
           and b.id = a.caseid
           and b.isend = 1--限定办结状态的
           and a.userid = b.ender --限定办结人
           and baid = (select baid --限定最后步骤
                         from (select *
                                 from fx_workflowbusact
                                where caseid = '{0}'
                                order by baid desc)
                        where rownum = 1))
 order by senddate desc --降序排序

";
            sql = string.Format(sql, caseId);
            DataSet ds = Utility.Database.ExcuteDataSet(sql);
            return ConvertHelper<FX_WorkFlowBusAct>.DataTableToList(ds.Tables[0]);
        }


        #endregion


    }

    public class DeptInfoAndUserInfo
    {
        public UserInfo userinfo;
        public FX_Department deptinfo;
    }
}
