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

namespace BizService.Services.LawRegulationsOperation
{
    class LawRegulationsOperationSvc : BaseDataHandler
    {
        public override string Key
        {
            get
            {
                return "LawRegulationsOperationSvc";
            }
        }

        [DataAction("GetData", "content")]
        public string GetData(string content)
        {
            try
            {
                var data = new GetDataModel();// 获取数据
                Para_LawRegulations sourceList = new Para_LawRegulations();
                if (!string.IsNullOrWhiteSpace(content))
                {
                    var conditionObj = Utility.FromJson<Para_LawRegulations>(content);
                    if (!string.IsNullOrWhiteSpace(conditionObj.mc)) sourceList.Condition.Add("mc like %" + conditionObj.mc + "%");
                    if (!string.IsNullOrWhiteSpace(conditionObj.nr)) sourceList.Condition.Add("nr like %" + conditionObj.nr + "%");
                    if (!string.IsNullOrWhiteSpace(conditionObj.ts)) sourceList.Condition.Add("ts=" + conditionObj.ts);
                    if (!string.IsNullOrWhiteSpace(conditionObj.ks)) sourceList.Condition.Add("ks=" + conditionObj.ks);
                }
                data.sourceList = Utility.Database.QueryList(sourceList);
                
                // 初始化一空行
                data.sourceListEdit = new Para_LawRegulations();
                data.sourceListEdit.ID = Utility.Database.QueryMaxValue("Para_LawRegulations", "ID") == DBNull.Value ? 1 : Convert.ToInt32(Utility.Database.QueryMaxValue("Para_LawRegulations", "ID")) + 1;
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
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                SaveDataModel data = JsonConvert.DeserializeObject<SaveDataModel>(content);
                SaveData(data);
                var retContent = GetData(Utility.ToJson(data.baseInfo));
                return retContent;
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
            try
            {
                DataTable dt = Utility.Database.ExcuteDataSet("select ID from Para_LawRegulations where ID =" + data.baseInfo.ID).Tables[0];
                // 获取参数值
                if (dt.Rows.Count == 0)
                {
                    Utility.Database.Insert<Para_LawRegulations>(data.baseInfo);
                }
                else
                {
                //    var ent = new Para_LawRegulations();
                    data.baseInfo.Condition.Add("ID=" + data.baseInfo.ID);
                    Utility.Database.Update<Para_LawRegulations>(data.baseInfo);
                }
            }
            catch (Exception e)
            {
                ComBase.Logger(e);
                throw e;
            }
        }

        [DataAction("DeleteData", "content")]
        public string DeleteData(string content)
        {
            var delEnt = new Para_LawRegulations();
            delEnt.Condition.Add("ID=" + content);
            Utility.Database.Delete(delEnt);
            return Utility.JsonResult(true, "success");
        }
    }

    /// <summary>
    /// 获取数据模型
    /// </summary>
    public class GetDataModel
    {
        public Para_LawRegulations baseInfo;
        public List<Para_LawRegulations> sourceList;
        public Para_LawRegulations sourceListEdit;
    }

    /// <summary>
    /// 保存数据模型
    /// </summary>
    public class SaveDataModel
    {
        public Para_LawRegulations baseInfo;
        public KOGridEdit<Para_LawRegulations> sourceList;
    }
}
