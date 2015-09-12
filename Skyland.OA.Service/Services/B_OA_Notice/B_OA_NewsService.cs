using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.BaseService;
using IWorkFlow.Engine;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;

namespace Skyland.EES.NNEPB.Service.Services.Notice
{
    class B_OA_NewsService : BaseDataHandler
    {
        [DataAction("GetList", "userid","type","pages","flag")]
        public string GetList(string userid, string type, string pages, string flag)
        {
            try
            {
                B_OA_News en = new B_OA_News();
                en.Condition.Add(" (flag=0 or flag is null)");
                if (!string.IsNullOrEmpty(flag))
                {
                    en.Condition.Add(" OR flag=" + flag);
                }
                if (!string.IsNullOrEmpty(type) && int.Parse(type) > 0)
                {
                    en.Condition.Add(" and type=" + int.Parse(type));
                }
                en.OrderInfo = "dateTime desc";
                List<B_OA_News> data = Utility.Database.QueryList<B_OA_News>(en);
                if (!string.IsNullOrEmpty(pages) && int.Parse(pages) > 0)
                {
                    data = data.Take(int.Parse(pages)).ToList();
                }
                var ad = from p in data
                         select new
                         {
                             id=p.id,
                             title=p.bt,
                             openurl = p.wblj,
                             author = p.zz,
                             dateTime = p.nrsj,
                             type = p.lx,
                             source = p.ly,
                             //typeName=CommonClass.GetCommTypeName(p.type),
                                                          typeName="",
                             flagName = p.sfky == 0 ? "未发布" : "已发布"
                         };

                return JsonConvert.SerializeObject(ad);
            }
            catch (Exception e)
            {
                return Utility.JsonMsg(true, e.Message);
            }
        }

        [DataAction("GetListAll", "userid")]
        public string GetListAll(string userid)
        {
            try
            {
                B_OA_NewsService en = new B_OA_NewsService(); 
                en.Condition.Add(" (flag=0 or flag is null)");

               // List<Privilege> listPrivilege = PrivilegeManageService.GetListPrivilegeType(userid, "维护权限集");
                List<Privilege> listPrivilege = PrivilegeManageService.Instance.GetListPrivilegeType(userid, "维护权限集");
                if (userid !="U000008" && listPrivilege != null && listPrivilege.Count > 0)
                {
                    string str = " and (1>1 ";
                    foreach (var item in listPrivilege)
                    {
                        if (item.ModelKey.IndexOf("Edit") > 0)
                        {
                            string type = item.ModelKey.Substring(item.ModelKey.IndexOf("Edit") + 4, 2);
                            if (!string.IsNullOrEmpty(type) && int.Parse(type) > 0)
                            {
                                str += " or type=" + int.Parse(type);
                                //en.Condition.Add(" or type=" + int.Parse(type));
                            }
                        }
                    }
                    str += ")";
                    en.Condition.Add(str);
                }
                
                en.OrderInfo = "dateTime desc";
                List<B_OA_NewsService> data = Utility.Database.QueryList<B_OA_NewsService>(en);
                var ad = from p in data
                         select new
                         {
                             id = p.id,
                             title = p.title,
                             openurl = p.openurl,
                             author = p.author,
                             dateTime = p.dateTime,
                             type = p.type,
                             source = p.source,
                             typeName = CommonClass.GetCommTypeName(p.type),
                             flagName = p.flag == 1 ? "未发布" : "已发布"
                         };

                return JsonConvert.SerializeObject(ad);
            }
            catch (Exception e)
            {
                return Utility.JsonMsg(true, e.Message);
            }
        }

        /// <summary>
        /// 用于在iPad上展示新闻信息
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="type"></param>
        /// <param name="pages"></param>
        /// <returns></returns>
        [DataAction("GetNewsListForiPad", "userid", "type", "pages")]
        public string GetNewsListForiPad(string userid, string type, string pages)
        {
            try
            {
                B_OA_NewsService ent = new B_OA_NewsService();
                ent.Condition.Add(" (flag=0 or flag is null)");
                if (!string.IsNullOrEmpty(type) && int.Parse(type) > 0)
                {
                    ent.Condition.Add(" and type=" + int.Parse(type));
                }
                ent.OrderInfo = " addDate desc";

                List<B_OA_NewsService> list = Utility.Database.QueryList<B_OA_NewsService>(ent);
                if (!string.IsNullOrEmpty(pages) && int.Parse(pages) > 0)
                {
                    list = list.Take(int.Parse(pages)).ToList();
                }

                var data = from p in list
                         select new
                         {
                             id = p.id,
                             title = p.title,
                             openurl = p.openurl,
                             addDate = p.addDate,
                         };

                return JsonConvert.SerializeObject(data);
            }
            catch (Exception e)
            {
                return Utility.JsonMsg(true, e.Message);
            }
        }

        [DataAction("GetData", "userid", "mId")]
        public string GetData(string userId, string mId)
        {
            try
            {
                B_OA_NewsData data = new B_OA_NewsData();
                data.lst_CommandType = new List<Para_CommType>();
                List<Para_CommType> lstCommandType = CommonClass.GetCommType("News"); 
                if (lstCommandType != null && lstCommandType.Count > 0)
                {
                    if (userId == "U000008")
                    {
                        data.lst_CommandType = lstCommandType;
                    }
                    else
                    {
                        List<Privilege> listPrivilege = IWorkFlow.BaseService.IWorkPrivilegeManage.QueryPrivilegebyUserID(userId).FindAll(g => g.Type == "维护权限集");
                        if (listPrivilege != null && listPrivilege.Count > 0)
                        {
                            foreach (var item in listPrivilege)
                            {
                                if (item.ModelKey.IndexOf("Edit") > 0)
                                {
                                    string type = item.ModelKey.Substring(item.ModelKey.IndexOf("Edit") + 4, 2);
                                    data.lst_CommandType.Add(lstCommandType.Where(p => p.id == int.Parse(type)).FirstOrDefault());
                                }
                            }
                        }
                    }
                }
                B_OA_NewsService _En = new B_OA_NewsService();
                _En.Condition.Add("id = " + mId);
                _En = Utility.Database.QueryObject<B_OA_NewsService>(_En);
                if (_En == null)
                {
                    _En = new B_OA_NewsService();
                    _En.userID = userId;
                    UserSelect us = CommonClass.GetUserSelect(userId);
                    if (us != null) _En.author = us.CnName;
                    _En.dateTime = DateTime.Now;
                } 
                data._entity_B_OA_News = _En;
                return JsonConvert.SerializeObject(data);
            }
            catch (Exception e)
            {
                // throw new Exception("数据加载失败！ ERR:" + e.Message);  
                return "ERR:数据加载失败！msg: " + e.Message;
            }
        }

        [DataAction("save", "content")]
        public string Save(string content)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                SaveData(content, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonMsg(true, "数据保存成功");
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonMsg(false, e.Message);
            }
        }

        public void SaveData(string content, IDbTransaction tran)
        {
            B_OA_NewsData data = new B_OA_NewsData();
            data = JsonConvert.DeserializeObject<B_OA_NewsData>(content);
            data._entity_B_OA_News.Condition.Add("id=" + data._entity_B_OA_News.id);
            if (Utility.Database.Update<B_OA_NewsService>(data._entity_B_OA_News, tran) < 1)
            {
                data._entity_B_OA_News.addDate = DateTime.Now;
                data._entity_B_OA_News.flag = 0;
                Utility.Database.Insert<B_OA_NewsService>(data._entity_B_OA_News, tran);
            }
        }

        [DataAction("DeleteData", "userid", "mId","mFlag")]
        public string DeleteData(string userId, string mId,string mFlag)
        {
            try
            {
                string result = "操作失败!";
                B_OA_NewsService _En = new B_OA_NewsService();
                _En.Condition.Add("id = " + mId);
                _En = Utility.Database.QueryObject<B_OA_NewsService>(_En);
                if (null != _En)
                {
                    _En.flag = int.Parse(mFlag);
                    _En.Condition.Add("id = " + mId);
                    if (Utility.Database.Update<B_OA_NewsService>(_En) > 0)
                    {
                        result = "操作成功!";
                    }
                }
                return result;
            }
            catch (Exception e)
            {
                return "操作失败！msg: " + e.Message;
            }
        }

        public override string Key
        {
            get
            {
                return "B_OA_NewsService";
            }
        }
    }
    public class B_OA_NewsData
    {
        public B_OA_NewsService _entity_B_OA_News;
        public List<Para_CommType> lst_CommandType;
    }
    }
}
