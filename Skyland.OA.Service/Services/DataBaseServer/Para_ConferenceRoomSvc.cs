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

namespace BizService.Services.Para_ConferenceRoomSvc
{
    // created by zhoushing
    //Para_ConferenceRoom
    class Para_ConferenceRoomSvc : BaseDataHandler
    {
        public override string Key
        {
            get
            {
                return "Para_ConferenceRoomSvc";
            }
        }

        [DataAction("GetData", "content")]
        public string GetData(string content)
        {
            try
            {
                var data = new GetDataModel();// 获取数据
                Para_ConferenceRoom sourceList = new Para_ConferenceRoom();
                data.sourceList = Utility.Database.QueryList(sourceList);

                // 初始化一空行
                data.sourceListEdit = new Para_ConferenceRoom();
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
                SaveData(data);
                var retContent = GetData(data.baseInfo.ConferenceRoomID.ToString());
                return Utility.JsonResult(true, "保存成功！", retContent);
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
            data.baseInfo.Condition.Add("ConferenceRoomID=" + data.baseInfo.ConferenceRoomID);
            if (Utility.Database.Update<Para_ConferenceRoom>(data.baseInfo) <= 0)
            {
                Utility.Database.Insert<Para_ConferenceRoom>(data.baseInfo);
            }
        }

        [DataAction("DeleteData", "content")]
        public string DeleteData(string content)
        {
            var delEnt = new Para_ConferenceRoom();
            delEnt.Condition.Add("ConferenceRoomID=" + content);
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
        public Para_ConferenceRoom baseInfo;
        public List<Para_ConferenceRoom> sourceList;
        public Para_ConferenceRoom sourceListEdit;
    }

    /// <summary>
    /// 保存数据模型
    /// </summary>
    public class SaveDataModel
    {
        public Para_ConferenceRoom baseInfo;
        public KOGridEdit<Para_ConferenceRoom> sourceList;
    }
}