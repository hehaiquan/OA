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

namespace BizService.Services.Para_BizTypeItemSvc
{
    // created by zhoushing
    //Para_BizTypeItem
    class Para_BizTypeItemSvc : BaseDataHandler
    {
        // 查询数据
        [DataAction("GetData", "content")]
        public string GetData(string content)
        {
            try
            {
                var data = new GetDataModel();// 获取数据

                // 关联查询
                string strsql = @"select a.*,b.mc as flmc from Para_BizTypeItem a
                                left join Para_BizTypeDictionary b on a.flid = b.id";
                DataSet ds = Utility.Database.ExcuteDataSet(strsql);
                data.sourceList = ds.Tables[0];


                // 初始化一空行 
                data.sourceListEdit = new Para_BizTypeItem();
                data.sourceListEdit.cjsj = DateTime.Now;
                data.sourceListEdit.sfqy = "1";// 启用
                return Utility.JsonResult(true, null, data);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, ex.Message);
            }
        }

        // 保存数据（外部调用）
        [DataAction("Save", "content")]
        public string Save(string content)
        {
            try
            {
                SaveDataModel data = JsonConvert.DeserializeObject<SaveDataModel>(content);
                StringBuilder strSql = new StringBuilder();
                strSql.Append("SELECT TOP 1 1 FROM Para_BizTypeItem WHERE id = " + Convert.ToInt32(data.baseInfo.id));
                DataTable dt = Utility.Database.ExcuteDataSet(strSql.ToString()).Tables[0];
                if (dt.Rows.Count <= 0)
                {
                    //新增
                    strSql = new StringBuilder();
                    strSql.Append("SELECT TOP 1 1 FROM Para_BizTypeItem WHERE flid = '" + data.baseInfo.flid + "' AND mc = '" + data.baseInfo.mc + "'");
                    dt = Utility.Database.ExcuteDataSet(strSql.ToString()).Tables[0];
                    if (dt.Rows.Count > 0)
                        return Utility.JsonResult(false, "元素值域名称：" + data.baseInfo.mc + " 已存在！");
                }
                else
                {
                    //修改
                    strSql = new StringBuilder();
                    strSql.Append("SELECT TOP 1 1 FROM Para_BizTypeItem WHERE flid = '" + data.baseInfo.flid + "' AND mc = '" + data.baseInfo.mc + "' AND id <> " + Convert.ToInt32(data.baseInfo.id));
                    dt = Utility.Database.ExcuteDataSet(strSql.ToString()).Tables[0];
                    if (dt.Rows.Count > 0)
                        return Utility.JsonResult(false, "元素值域名称：" + data.baseInfo.mc + " 已存在！");
                }

                SaveData(data);
                var retContent = GetData("");
                return retContent;
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, "保存失败:" + ex.Message.Replace(":", " "));
            }
        }

        // 保存数据
        public void SaveData(SaveDataModel data)
        {
            // 获取参数值
            data.baseInfo.Condition.Add("id=" + data.baseInfo.id);
            if (Utility.Database.Update<Para_BizTypeItem>(data.baseInfo) <= 0)
            {
                Utility.Database.Insert<Para_BizTypeItem>(data.baseInfo);
            }
        }

        // 删除数据
        [DataAction("DeleteData", "content")]
        public string DeleteData(string content)
        {
            var delEnt = new Para_BizTypeItem();
            delEnt.Condition.Add("id=" + content);
            if (Utility.Database.Delete(delEnt) > 0)
                return GetData("");
            else
                return Utility.JsonResult(false, "删除失败");
        }


        public override string Key
        {
            get
            {
                return "Para_BizTypeItemSvc";
            }
        }
    }

    /// <summary>
    /// 获取数据模型
    /// </summary>
    public class GetDataModel
    {
        public Para_BizTypeItem baseInfo;
        // public List<Para_BizTypeItem> sourceList;
        public DataTable sourceList;
        public Para_BizTypeItem sourceListEdit;
    }

    /// <summary>
    /// 保存数据模型
    /// </summary>
    public class SaveDataModel
    {
        public Para_BizTypeItem baseInfo;
        public KOGridEdit<Para_BizTypeItem> sourceList;
    }
}