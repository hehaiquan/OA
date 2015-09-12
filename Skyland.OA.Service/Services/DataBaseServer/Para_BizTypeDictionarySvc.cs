using IWorkFlow.Host;// BaseDataHandler引用
using IWorkFlow.ORM;// 表属性
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;// Json转换
using System.Data;
using BizService.Common;//

namespace BizService.Services.Para_BizTypeDictionarySvc
{
    // created by zhoushing
    // Para_BizTypeDictionary
    class Para_BizTypeDictionarySvc : BaseDataHandler
    {
        public override string Key
        {
            get
            {
                return "Para_BizTypeDictionarySvc";
            }
        }

        [DataAction("GetData", "content")]
        public string GetData(string content)
        {
            try
            {
                var data = new GetDataModel();// 获取数据
                Para_BizTypeDictionary sourceList = new Para_BizTypeDictionary();
                data.sourceList = Utility.Database.QueryList(sourceList);

                // 初始化一空行 
                data.sourceListEdit = new Para_BizTypeDictionary();
                data.sourceListEdit.sfqy = "1";
                data.sourceListEdit.cjsj = DateTime.Now;
                return Utility.JsonResult(true, "", data);
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
                strSql.Append("SELECT TOP 1 1 FROM Para_BizTypeDictionary WHERE id = " + Convert.ToInt32(data.baseInfo.id));
                DataTable dt = Utility.Database.ExcuteDataSet(strSql.ToString()).Tables[0];
                if (dt.Rows.Count <= 0)
                {
                    //新增
                    strSql = new StringBuilder();
                    strSql.Append("SELECT TOP 1 1 FROM Para_BizTypeDictionary WHERE lx = '" + data.baseInfo.lx + "'");
                    dt = Utility.Database.ExcuteDataSet(strSql.ToString()).Tables[0];
                    if (dt.Rows.Count > 0)
                        return Utility.JsonResult(false, "字典类型：" + data.baseInfo.lx + " 已存在！");

                    strSql = new StringBuilder();
                    strSql.Append("SELECT TOP 1 1 FROM Para_BizTypeDictionary WHERE mc = '" + data.baseInfo.mc + "'");
                    dt = Utility.Database.ExcuteDataSet(strSql.ToString()).Tables[0];
                    if (dt.Rows.Count > 0)
                        return Utility.JsonResult(false, "字典名称：" + data.baseInfo.mc + " 已存在！");
                }
                else
                { 
                    //修改
                    strSql = new StringBuilder();
                    strSql.Append("SELECT TOP 1 1 FROM Para_BizTypeDictionary WHERE lx = '" + data.baseInfo.lx + "' AND id <> " + Convert.ToInt32(data.baseInfo.id));
                    dt = Utility.Database.ExcuteDataSet(strSql.ToString()).Tables[0];
                    if (dt.Rows.Count > 0)
                        return Utility.JsonResult(false, "字典类型：" + data.baseInfo.lx + " 已存在！");

                    strSql = new StringBuilder();
                    strSql.Append("SELECT TOP 1 1 FROM Para_BizTypeDictionary WHERE mc = '" + data.baseInfo.mc + "' AND id <> " + Convert.ToInt32(data.baseInfo.id));
                    dt = Utility.Database.ExcuteDataSet(strSql.ToString()).Tables[0];
                    if (dt.Rows.Count > 0)
                        return Utility.JsonResult(false, "字典名称：" + data.baseInfo.mc + " 已存在！");
                }

                SaveData(data);
                return GetData("");
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, "保存失败:" + ex.Message.Replace(":", " "));
            }
        }

        //保存数据
        public void SaveData(SaveDataModel data)
        {
            // 获取参数值
            data.baseInfo.Condition.Add("id=" + data.baseInfo.id);
            if (Utility.Database.Update<Para_BizTypeDictionary>(data.baseInfo) <= 0)
            {
                Utility.Database.Insert<Para_BizTypeDictionary>(data.baseInfo);
            }
        }

        [DataAction("DeleteData", "content")]
        public string DeleteData(string content)
        {
            var delEnt = new Para_BizTypeDictionary();
            delEnt.Condition.Add("id=" + content);
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
        public Para_BizTypeDictionary baseInfo;
        public List<Para_BizTypeDictionary> sourceList;
        public Para_BizTypeDictionary sourceListEdit;
    }

    /// <summary>
    /// 保存数据模型
    /// </summary>
    public class SaveDataModel
    {
        public Para_BizTypeDictionary baseInfo;
        public KOGridEdit<Para_BizTypeDictionary> sourceList;
    }
}