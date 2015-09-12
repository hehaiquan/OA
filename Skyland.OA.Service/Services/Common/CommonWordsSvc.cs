using System;
using System.Collections.Generic;
using System.Linq;
using BizService.Common;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BizService.Services.Common
{
    public class CommonWordsSvc : BaseDataHandler
    {
        public override string Key
        {
            get
            {
                return "CommonWordsService";
            }
        }

        [DataAction("getCommonWords", "term", "userId", "controlUrl")]
        public string GetCommonWords(string term, string userId, string controlUrl)
        {
            try
            {
                var srt = new Sys_CommonWords();
                if (!string.IsNullOrWhiteSpace(userId))
                {
                    srt.Condition.Add(string.Format("UID = {0}", userId));
                }
                if (!string.IsNullOrWhiteSpace(controlUrl))
                {
                    srt.Condition.Add(string.Format("ControlUrl = {0}", controlUrl));
                }
                if (!string.IsNullOrWhiteSpace(term))
                {
                    srt.Condition.Add(string.Format("WordsItem like %{0}%", term));
                }

                var srtList = Utility.Database.QueryList(srt);

                return JsonConvert.SerializeObject(srtList.Select(i => new { label = i.WordsItem, value = i.ID.ToString(), userId = i.UserID })); ;
            }
            catch (Exception e)
            {
                return Utility.JsonMsg(false, ("数据加载失败:" + e.Message.Replace("\r\n", " ")));
            }
        }

        [DataAction("addCommonWords", "term", "userId", "controlUrl")]
        public string AddCommonWords(string term, string userId, string controlUrl)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(term))
                {
                    var srt = new Sys_CommonWords();
                    srt.UserID = userId;
                    srt.ControlUrl = controlUrl;
                    srt.WordsItem = term;
                    Utility.Database.Insert(srt);
                    return Utility.JsonMsg(true, ("数据添加成功:"));
                }
                return Utility.JsonMsg(false, ("内容不能为空"));
            }
            catch (Exception e)
            {
                return Utility.JsonMsg(false, ("数据添加失败:" + e.Message.Replace("\r\n", " ")));
            }
        }

        [DataAction("deleteCommonWords", "value")]
        public string DeleteCommonWords(string value)
        {
            try
            {
                int check = 0;
                if (int.TryParse(value, out check))
                {
                    var srt = new Sys_CommonWords();
                    srt.Condition.Add(string.Format("ID = {0}", value));
                    Utility.Database.Delete(srt);

                    return Utility.JsonMsg(true, ("数据删除成功:"));
                }
                return Utility.JsonMsg(false, ("ID不正确"));
            }
            catch (Exception e)
            {
                return Utility.JsonMsg(false, ("数据删除失败:" + e.Message.Replace("\r\n", " ")));
            }
        }

        [DataAction("changeUserCommonWords", "wordId", "userId")]
        public string ChangeUserCommonWords(string wordId, string userId)
        {
            try
            {

                if (!string.IsNullOrWhiteSpace(wordId))
                {
                    var srt = new Sys_CommonWords();
                    srt.Condition.Add(string.Format("ID={0}", wordId));
                    srt = Utility.Database.QueryObject(srt);
                    if (string.IsNullOrWhiteSpace(srt.UserID))
                    {
                        srt.UserID = userId;
                    }
                    else
                    {
                        srt.UserID = "";
                    }
                    srt.Condition.Add(string.Format("ID={0}", wordId));
                    Utility.Database.Update(srt);
                    return Utility.JsonMsg(true, ("数据更新成功:"));
                }
                return Utility.JsonMsg(false, ("操作失败"));
            }
            catch (Exception e)
            {
                return Utility.JsonMsg(false, ("数据添加失败:" + e.Message.Replace("\r\n", " ")));
            }
        }
    }
}
