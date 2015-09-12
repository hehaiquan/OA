using BizService.Common;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BizService.Services.Common
{
    class B_ComSvc : BaseDataHandler
    {
        #region 流程相关
        /// <summary>
        /// 获取审批意见
        /// </summary>
        /// <param name="caseId">流程实例ID</param>
        /// <returns></returns>
        [DataAction("GetFlowCaseOpinion", "caseId")]
        public string GetFlowCaseOpinion(string caseId)
        {
            try
            {
                var result = ComClass.GetFlowCaseOpinion(caseId);
                return JsonConvert.SerializeObject(result);
            }
            catch (Exception e)
            {
                return Utility.JsonMsg(false, "获取咨询审批意见失败！");
            }
        }
        #endregion

        #region 权限相关
        /// <summary>
        /// 获取用户的全部权限列表
        /// </summary>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetPrivileges", "userid", "_userId")]
        public string GetPrivileges(string userid, string _userId)
        {
            try
            {
                userid = string.IsNullOrWhiteSpace(_userId) ? userid : _userId;
                var priList = ComClass.GetPrivilegebyUserId(userid);
                var result = priList.Select(o => new { Type = o.Type, ModelKey = o.ModelKey });
                return Utility.JsonResult(true, null, result);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex.StackTrace);
                return Utility.JsonResult(false, "获取用户权限列表失败！");
            }
        }

        #endregion

        #region 通用
        /// <summary>
        /// 删除数据表记录
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="info"></param>
        /// <returns></returns>
        [DataAction("DelTableData", "userid", "info")]
        public string DelTableData(string userid, string info)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(userid))
                    throw new Exception("没有权限！");
                var para = JsonConvert.DeserializeObject<Para_DelTableData>(info);
                if (ComDBHelper.DelTableData(para))
                {
                    return Utility.JsonResult(true, "操作成功！");
                }
                else
                {
                    throw new Exception("操作失败！");
                }
            }
            catch (Exception ex)
            {
                ComBase.Logger(info);
                ComBase.Logger(ex);
                return Utility.JsonResult(false, ex.Message);
            }
        }

        /// <summary>
        /// 获取表记录的空模板
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="info"></param>
        /// <returns></returns>
        [DataAction("GetRecordEmptyTpl", "userid", "tableName")]
        public string GetRecordEmptyTpl(string userid, string tableName)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(userid))
                    throw new Exception("没有权限！");
                var dict = ComDBHelper.GetRecrodEmptyTpl(tableName);
                return Utility.JsonResult(true, string.Empty, dict);
            }
            catch (Exception ex)
            {
                ComBase.Logger(tableName);
                ComBase.Logger(ex);
                return Utility.JsonResult(false, ex.Message);
            }
        }

        /// <summary>
        /// 通用分页查询
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="queryInfo"></param>
        /// <returns></returns>
        [DataAction("PageQuery", "userid", "queryInfo")]
        public string PageQuery(string userid, string queryInfo)
        {
            return ComPageQuery.PageQueryToJsonResult(queryInfo);
        }

        /// <summary>
        /// 获取数据字典
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="data">字符串数组类型</param>
        /// <returns></returns>
        [DataAction("GetDataDict", "userid", "data")]
        public string GetDataDict(string userid, string data)
        {
            try
            {
                Dictionary<string, object> dictCol = new Dictionary<string, object>();
                string[] typeCol = JsonConvert.DeserializeObject<string[]>(data);
                foreach (var item in typeCol)
                {
                    if (dictCol.ContainsKey(item))
                        continue;
                    //dictCol.Add(item, ComClass.GetDataDict(item));//数据库中获取
                    dictCol.Add(item, ComClass.GetDataDictFromXml(item));//xml文件中获取
                }

                return Utility.JsonResult(true, null, dictCol);
            }
            catch (Exception ex)
            {
                return Utility.JsonResult(false, "获取数据字典失败！错误信息：" + ex.Message);
            }
        }


        #endregion





        public class GetProjectTypeModel
        {
            public List<Para_CP_ProjectTrade> pTypeList;
        }
        //项目类别选择
        [DataAction("projectTypeSvc", "userid", "queryInfo")]
        public string projectTypeSvc(string userid, string queryInfo)
        {

            try
            {
                var data = new GetProjectTypeModel();

                Para_CP_ProjectTrade unitList = new Para_CP_ProjectTrade();
                data.pTypeList = Utility.Database.QueryList(unitList);

                return Utility.JsonResult(true, null, data);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, ex.Message);
            }
        }

        public string GetRankUsers()
        {

            //var dd = IWorkFlow.EngineService.EngineRank.GetRankRoleUser();

            return "";
        }

        [DataAction("GetComTreeSource", "content")]
        public string GetComTreeSource(string content)
        {
            ComBase.Logger("coontent:" + content);
            dynamic data = JValue.Parse(content);
            bool multiple = data.multiple;
            string codeValue = data.codeValue;// UserID
            string codeName = data.codeName;// CnName
            string tableName = data.tableName;// FX_UserInfo
            string whereStr = data.conditions;// 
            string sql = "";

            //DataSet dataSet = Utility.Database.ExcuteDataSet(" select DPID as id, DPName as name from FX_Department ");
            //return Utility.JsonResult(true, null, dataSet.Tables[0]);
            DataSet dataSet = new DataSet();
            dataSet.Clear();
            sql = string.Format("select {0} from {1} where 1 = 1", codeValue + " as id," + codeName + " as name ", tableName);
            if (!string.IsNullOrEmpty(whereStr))
            {
                whereStr = whereStr.Replace("$$", " ");
                whereStr = whereStr.Replace("[", "'");
                whereStr = whereStr.Replace("]", "'");
                sql += whereStr;
            }
            dataSet = Utility.Database.ExcuteDataSet(sql);

            //switch (tableName)
            //{
            //    case "FX_UserInfo":
            //        dataSet.Clear();
            //        sb.AppendFormat("select {0} from {1}", codeValue + " as id," + codeName + " as name ", tableName);
            //        //List<FX_UserInfo> ddd1 = Utility.Database.QueryList<FX_UserInfo>(sb.ToString());
            //        dataSet = Utility.Database.ExcuteDataSet(sb.ToString());

            //        //List<FX_UserInfo> ddd1 = Utility.Database.QueryList<FX_UserInfo>(sb.ToString());
            //        return Utility.JsonResult(true, null, dataSet.Tables[0]);
            //    case "FX_Department":
            //        dataSet.Clear();
            //        sb.AppendFormat("select {0} from {1}", codeValue + " as id," + codeName + " as name ", tableName);
            //        dataSet = Utility.Database.ExcuteDataSet(sb.ToString());
            //        //List<GetDataModels> eeee = Utility.Database.QueryList<GetDataModels>(sb.ToString());
            //        return Utility.JsonResult(true, null, dataSet.Tables[0]);

            //    default:
            //        break;
            //}

            //var sql = " UserID, CnName";
            //sb.AppendFormat("select {0} from {1}", codeValue + "," + codeName, tableName);
            //var tablePartField = Utility.Database.GetTableList();
            //var tableAllField = Utility.Database.GetAllFieldInfo(tableName);// 获取表所有字段

            //List<GetDataModels> ddd = Utility.Database.QueryList<GetDataModels>(sb.ToString());
            return Utility.JsonResult(true, null, dataSet.Tables[0]);
        }

        public class GetDataModels
        {
            public ChangeModel<FX_UserInfo> userList;
            public ChangeModel<FX_Department> deparmentList;
        }

        public override string Key
        {
            get
            {
                return "B_ComSvc";
            }
        }
    }
}
