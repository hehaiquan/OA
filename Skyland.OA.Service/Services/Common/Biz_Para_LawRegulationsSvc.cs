using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.Host;// 工作流接口Host
using BizService.Common;// Biz服务
using IWorkFlow.ORM;// 工作流接口ORM
using Newtonsoft.Json;// Json数据
using System.Data;
using IWorkFlow.BaseService;// 数据

namespace BizService.Services.Common
{
    class Biz_Para_LawRegulationsSvc : BaseDataHandler
    {
        // 获取数据
        [DataAction("GetLawRegulationsData", "content")]
        public string GetLawRegulationsData(string content)
        {
            try
            {
                var data = new GetDataModel();
                Para_LawRegulations en = new Para_LawRegulations();
                if (!string.IsNullOrWhiteSpace(content))
                {
                    en.Condition.Add("mc=" + content);
                }
                data.sourceList = Utility.Database.QueryList<Para_LawRegulations>(en);// 实体
                //JsonConvert.DeserializeObject()

                data.sourceListEdit = new Para_LawRegulations();
                //data.sourceListEdit.ID = data.baseInfo.PK;

                return Utility.JsonResult(true, null, data);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, ex.Message);
            }
           
        }

        // 保存数据（插入和更新操作）
        [DataAction("SaveLawRegualationsData","content")]
        public string SaveLawRegualationsData(string content)
        {
            // 空值处理

            // 插入的实体是什么，更新的实体是什么，是否启用事务，做的是不是业务？

            // 返回值是什么？
            //SkyLandDeveloper developer = SkyLandDeveloper.FromJson(content);
            try
            {
                Para_LawRegulations data = JsonConvert.DeserializeObject<Para_LawRegulations>(content);
                if (data != null)
                {
                    Utility.Database.Insert(data);
                }


            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, ex.Message);
            }
            return "";
        }

        // 删除数据


        public override string Key
        {
            get 
            {
                return "Biz_Para_LawRegulationsSvc";
            
            }
        }
    }// class

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
