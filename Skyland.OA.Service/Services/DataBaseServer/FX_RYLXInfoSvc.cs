using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;// Json转换
using System.Data;
using BizService.Common;
using IWorkFlow.Host;
using System;
using IWorkFlow.ORM;//

namespace BizService.Services.FX_RYLXInfoSvc
{
    // created by zhoushing
    // FX_RYLXInfoSvc
    class FX_RYLXInfoSvc : BaseDataHandler
    {
        public override string Key
        {
            get
            {
                return "FX_RYLXInfoSvc";
            }
        }
        [DataAction("GetData", "content")]
        public string GetData(string content)
        {
            try
            {
                var data = new GetDataModel();// 获取数据
                FX_RYLXInfo sourceList = new FX_RYLXInfo();
                StringBuilder strSql = new StringBuilder();
                strSql.Append(@"SELECT 
	A.ryid,A.UserID,A.UserType,A.UserNumber,B.CnName AS UserName,C.FullName  AS DepartmentName,
(CASE A.UserType WHEN 1 THEN '调查人员' WHEN 2 THEN '询问人员' ELSE '执法人员' END) AS UserTypeText 
FROM FX_RYLXInfo A
	LEFT JOIN FX_UserInfo B ON A.UserID = B.UserID
	LEFT JOIN FX_Department C ON C.DPID = B.DPID
ORDER BY A.ryid");
                string jsonData = JsonConvert.SerializeObject(Utility.Database.ExcuteDataSet(strSql.ToString()).Tables[0]);
                data.sourceList = (List<FX_RYLXInfo>)JsonConvert.DeserializeObject(jsonData, typeof(List<FX_RYLXInfo>));

                // 初始化一空行 
                data.sourceListEdit = new FX_RYLXInfo();
                return Utility.JsonResult(true, null, data);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, ex.Message);
            }
        }

        //保存
        [DataAction("Save", "content")]
        public string Save(string content)
        {
            try
            {
                SaveDataModel data = JsonConvert.DeserializeObject<SaveDataModel>(content);

                StringBuilder strSql = new StringBuilder();
                DataTable dt = new DataTable();
                if (Convert.ToInt32(data.baseInfo.ryid) == 0)
                {
                    strSql.Append(@"SELECT 
	A.ryid,A.UserID,A.UserType,A.UserNumber,B.CnName AS UserName,
(CASE A.UserType WHEN 1 THEN '调查人员' WHEN 2 THEN '询问人员' ELSE '执法人员' END) AS UserTypeText 
FROM FX_RYLXInfo A
	LEFT JOIN FX_UserInfo B ON A.UserID = B.UserID 
WHERE A.UserID = '" + data.baseInfo.UserID + "' AND A.UserType = " + data.baseInfo.UserType);
                    dt = Utility.Database.ExcuteDataSet(strSql.ToString()).Tables[0];
                    if (dt.Rows.Count > 0)
                        return Utility.JsonResult(false, dt.Rows[0]["UserName"].ToString() + " 类型：" + dt.Rows[0]["UserTypeText"].ToString() + " 已存在，不能重复新增");
                }
                else
                {
                    strSql.Append(@"SELECT 
	A.ryid,A.UserID,A.UserType,A.UserNumber,B.CnName AS UserName,
(CASE A.UserType WHEN 1 THEN '调查人员' WHEN 2 THEN '询问人员' ELSE '执法人员' END) AS UserTypeText 
FROM FX_RYLXInfo A
	LEFT JOIN FX_UserInfo B ON A.UserID = B.UserID 
WHERE A.UserID = '" + data.baseInfo.UserID + "' AND A.UserType = " + data.baseInfo.UserType + " AND A.ryid <> " + data.baseInfo.ryid);
                    dt = Utility.Database.ExcuteDataSet(strSql.ToString()).Tables[0];
                    if (dt.Rows.Count > 0)
                        return Utility.JsonResult(false, dt.Rows[0]["UserName"].ToString() + " 类型：" + dt.Rows[0]["UserTypeText"].ToString() + " 已存在，不能重复新增");
                }

                SaveData(data);
                var retContent = GetData("");
                return retContent;
            }
            catch (Exception ex)
            {
                return Utility.JsonResult(false, "保存失败:" + ex.Message.Replace(":", " "));
            }
        }

        //保存数据
        public void SaveData(SaveDataModel data)
        {
            
            data.baseInfo.Condition.Add("ryid=" + data.baseInfo.ryid);
            if (Utility.Database.Update<FX_RYLXInfo>(data.baseInfo) <= 0)
            {
                Utility.Database.Insert<FX_RYLXInfo>(data.baseInfo);
            }
        }

        [DataAction("DeleteData", "content")]
        public string DeleteData(string content)
        {
            var delEnt = new FX_RYLXInfo();
            delEnt.Condition.Add("ryid=" + content);
            if (Utility.Database.Delete(delEnt) > 0)
                return GetData("");
            else
                return Utility.JsonResult(false, "删除失败");
        }

    }

    /// <summary>
    /// 获取数据模型
    /// </summary>
    public class GetDataModel
    {
        public FX_RYLXInfo baseInfo;
        public List<FX_RYLXInfo> sourceList;
        public FX_RYLXInfo sourceListEdit;
    }

    /// <summary>
    /// 保存数据模型
    /// </summary>
    public class SaveDataModel
    {
        public FX_RYLXInfo baseInfo;
        public KOGridEdit<FX_RYLXInfo> sourceList;
    }
}
