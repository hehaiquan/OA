using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;

namespace BizService.Services.Common
{
    public class CommonDataSvc : BaseDataHandler
    {
        public override string Key
        {
            get
            {
                return "CommonDataService";
            }
        }

        //监测任务的autocompletebox(采样前准备、现场采样)
        [DataAction("GetInspectItemByTempAndType", "term", "type")]
        public string GetInspectItemByTempAndType(string term, string type)
        {
            Setting_InspectType s = new Setting_InspectType();
            s.Condition.Add("InspectTypeID=" + Convert.ToInt32(type));
            string typeName = Utility.Database.QueryObject<Setting_InspectType>(s).SecondKind;

            string filter = "";
            if (!string.IsNullOrWhiteSpace(term))
            {
                filter = term;
            }
            string QJtype = "";
            if (!string.IsNullOrWhiteSpace(type))
            {
                QJtype = typeName;
            }
            //??Thread.Sleep(500);
            string sql = "select ID,Name from Setting_AnalysisItemAbbreviation where InspectType = '" + QJtype + "'";
            List<Item> data = new List<Item>();
            IDataReader reader = Utility.Database.GetReader(sql);
            while (reader.Read())
            {
                //if (reader[1].ToString() != "水温" && reader[1].ToString() != "pH值" && reader[1].ToString() != "透明度" && reader[1].ToString() != "电导率" && reader[1].ToString() != "化学需氧量" && reader[1].ToString() != "溶氧量")
                //{
                data.Add(new Item() { label = reader[1].ToString(), value = reader[0].ToString() });
                //}
            }
            reader.Close();
            List<Item> dataAfterFilter = null;
            dataAfterFilter = data.Where(item => item.label.ToLower().Contains(filter.ToLower())).ToList();
            return JsonConvert.SerializeObject(dataAfterFilter);
        }

        //根据setting_InspectType表InspectType得到监测项目
        [DataAction("GetInspectItemByInspectType", "term", "type")]
        public string GetInspectItemByInspectType(string term, string type)
        {
            Setting_InspectType s = new Setting_InspectType();
            s.Condition.Add("InspectType=" + type);
            string typeName = Utility.Database.QueryObject<Setting_InspectType>(s).SecondKind;

            string filter = "";
            if (!string.IsNullOrWhiteSpace(term))
            {
                filter = term;
            }
            string QJtype = "";
            if (!string.IsNullOrWhiteSpace(type))
            {
                QJtype = typeName;
            }
            //Thread.Sleep(500);
            string sql = "select ID,Name from Setting_AnalysisItemAbbreviation where InspectType = '" + QJtype + "'";
            List<Item> data = new List<Item>();
            IDataReader reader = Utility.Database.GetReader(sql);
            while (reader.Read())
            {
                data.Add(new Item() { label = reader[1].ToString(), value = reader[0].ToString() });
            }
            reader.Close();
            List<Item> dataAfterFilter = null;
            dataAfterFilter = data.Where(item => item.label.ToLower().Contains(filter.ToLower())).ToList();
            return JsonConvert.SerializeObject(dataAfterFilter);
        }
    }

    //定义存储的键值对
    public class Item
    {
        public string label { get; set; }
        public string value { get; set; }
    }
}
