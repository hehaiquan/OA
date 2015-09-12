using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BizService.Services;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;


namespace BizService.BBSSectionSvc
{
    public class BBSSectionSvc : BaseDataHandler
    {
        [DataAction("GetData", "userid")]
        public string GetData(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            var data = new BBSSectionSvc.GetDataModel();
            try
            {
                string sql = "select * from B_BBSSection";
                DataSet ds = Utility.Database.ExcuteDataSet(sql, tran);
                Utility.Database.Commit(tran);
                string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
                data.dataList = (List<B_BBSSection>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_BBSSection>));
                data.baseInform = new B_BBSSection();
                return Utility.JsonResult(true, "数据加载成功", data);//将对象转为json字符串并返回到客户端
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

        [DataAction("SaveData", "JsonData", "userid")]
        public string SaveData(string JsonData, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_BBSSection bbsSection = JsonConvert.DeserializeObject<B_BBSSection>(JsonData);
                var userInfo = ComClass.GetUserInfo(userid);
                if (bbsSection.sid == 0)
                {//新增
                    bbsSection.sCreateManId = userid;
                    bbsSection.sCreateManName = userInfo.CnName;
                    bbsSection.sClickCount = 0;
                    bbsSection.sTopicCount = 0;
                    Utility.Database.Insert(bbsSection, tran);
                    Utility.Database.Commit(tran);
                    return Utility.JsonResult(true, "保存数据成功");
                }
                else
                { //修改
                    bbsSection.Condition.Add("sid=" + bbsSection.sid);
                    Utility.Database.Update<B_BBSSection>(bbsSection, tran);
                    Utility.Database.Commit(tran);
                    return Utility.JsonResult(true, "保存数据成功");
                }
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "保存失败！异常信息: " + e.Message);
            }
        }

        /// <summary>
        /// 删除BBS模块
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("DeleteSectionData", "id", "userid")]
        public string DeleteSectionData(string id, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_BBSSection bbsSection = new B_BBSSection();
                bbsSection.Condition.Add("sid=" + id);
                Utility.Database.Delete(bbsSection, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除成功！");
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "删除失败！异常信息: " + e.Message);
            }
        }

        /// <summary>
        /// 通过模块ID查找主贴信息
        /// </summary>
        /// <param name="tsid">模块ID</param>
        /// <returns></returns>
        [DataAction("GetBBSTopicByTsid", "tsid", "userid")]
        public string GetBBSTopicByTsid(string tsid, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            var data = new BBSSectionSvc.GetDataTopicModel();
            var userInfo = ComClass.GetUserInfo(userid);
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat("select * from B_BBSTopic where tsid = {0} order by tCreateTime desc", tsid);
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                Utility.Database.Commit(tran);
                string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
                data.dataList = (List<B_BBSTopic>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_BBSTopic>));
                data.baseInform = new B_BBSTopic();
                data.baseInform.tCreateUserName = userInfo.CnName;
                data.baseInform.tCreateUserId = userInfo.UserID;
                return Utility.JsonResult(true, "数据加载成功", data);//将对象转为json字符串并返回到客户端
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

        [DataAction("SaveTopic", "JsonData", "userid")]
        public string SaveTopic(string JsonData, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_BBSTopic bbsTopic = JsonConvert.DeserializeObject<B_BBSTopic>(JsonData);
                if (bbsTopic.tid == 0)
                {//新增
                    Utility.Database.Insert(bbsTopic, tran);
                }
                else
                {//添加
                    bbsTopic.Condition.Add("tid=" + bbsTopic.tid);
                    Utility.Database.Update(bbsTopic, tran);
                }
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存数据成功");
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

        /// <summary>
        /// 通过主贴ID查找评论
        /// </summary>
        /// <param name="topicId">主贴ID</param>
        /// <param name="sectionId">模块ID</param>
        /// <returns></returns>
        [DataAction("GetBBSReplyByTopicId", "topicId", "sectionId", "userid")]
        public string GetBBSReplyByTopicId(string topicId, string sectionId, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                var data = new BBSSectionSvc.GetDataReplyModel();
                var userInfo = ComClass.GetUserInfo(userid);
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat("select * from B_BBSReply where RTID={0} order by RTime desc", topicId);

                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                Utility.Database.Commit(tran);
                string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
                data.dataList = (List<B_BBSReply>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_BBSReply>));
                data.baseInform = new B_BBSReply();
                data.baseInform.RTUIDName = userInfo.CnName;
                data.baseInform.RTUID = userInfo.UserID;
                data.baseInform.RSID = int.Parse(sectionId);
                data.baseInform.RTID = int.Parse(topicId);
                return Utility.JsonResult(true, "数据加载成功", data);//将对象转为json字符串并返回到客户端
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

        /// <summary>
        /// 保存评论
        /// </summary>
        /// <param name="JsonData"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("SaveReply", "JsonData", "userid")]
        public string SaveReply(string JsonData, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_BBSReply bbsReply = JsonConvert.DeserializeObject<B_BBSReply>(JsonData);
                bbsReply.RTime = DateTime.Now.ToString();
                if (bbsReply.rid == 0)
                {//新增
                    Utility.Database.Insert(bbsReply, tran);
                }
                else
                {//添加
                    bbsReply.Condition.Add("rid=" + bbsReply.rid);
                    Utility.Database.Update(bbsReply, tran);
                }
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存数据成功");
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

        [DataAction("DeleteReply", "replyId", "userid")]
        public string DeleteReply(string replyId, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_BBSReply bbsReply = new B_BBSReply();
                bbsReply.Condition.Add("rid=" + replyId);
                Utility.Database.Delete(bbsReply, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除成功");
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }


        [DataAction("DeleteTopic", "topicId", "userid")]
        public string DeleteTopic(string topicId, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                //先删除评论
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat("select * from B_BBSReply where RTID = {0}",topicId);
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
                List<B_BBSReply> listReply= (List<B_BBSReply>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_BBSReply>));
                foreach (B_BBSReply reply in listReply)
                {
                    reply.Condition.Add("rid=" + reply.rid);
                    Utility.Database.Delete(reply, tran);
                }

                //删除主贴
                B_BBSTopic bbsTopic = new B_BBSTopic();
                bbsTopic.Condition.Add("tid=" + topicId);
                Utility.Database.Delete(bbsTopic, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除成功");
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

         [DataAction("DeleteSectionBySectionId", "sectionId", "userid")]
        public string DeleteSectionBySectionId(string sectionId,string userid) {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                //先删除评论表
                StringBuilder rStrSql = new StringBuilder();
                rStrSql.AppendFormat("select * from B_BBSReply where RSID="+sectionId);
                DataSet rds = Utility.Database.ExcuteDataSet(rStrSql.ToString(), tran);
                string rJsonData = JsonConvert.SerializeObject(rds.Tables[0]);
                List<B_BBSReply> listReply = (List<B_BBSReply>)JsonConvert.DeserializeObject(rJsonData, typeof(List<B_BBSReply>));
                foreach (B_BBSReply reply in listReply)
                {
                    reply.Condition.Add("rid=" + reply.rid);
                    Utility.Database.Delete(reply, tran);
                }

                //删除主贴
                StringBuilder tStrSql = new StringBuilder();
                tStrSql.AppendFormat("select * from B_BBSTopic where tsid=" + sectionId);
                DataSet tds = Utility.Database.ExcuteDataSet(rStrSql.ToString(), tran);
                string tJsonData = JsonConvert.SerializeObject(tds.Tables[0]);
                List<B_BBSTopic> listTopic = (List<B_BBSTopic>)JsonConvert.DeserializeObject(tJsonData, typeof(List<B_BBSTopic>));
                foreach (B_BBSTopic topic in listTopic)
                {
                    topic.Condition.Add("tid=" + topic.tid);
                    Utility.Database.Delete(topic, tran);
                }
                //删除模块
                B_BBSSection bbsSection = new B_BBSSection();
                bbsSection.Condition.Add("sid=" + sectionId);
                Utility.Database.Delete(bbsSection, tran);

                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除成功");
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

        /// <summary>
        /// 模块数据模型
        /// </summary>
        public class GetDataModel
        {
            public List<B_BBSSection> dataList;
            public B_BBSSection baseInform;
        }

        /// <summary>
        /// 主贴数据模型
        /// </summary>
        public class GetDataTopicModel
        {
            public List<B_BBSTopic> dataList;
            public B_BBSTopic baseInform;
        }

        public class GetDataReplyModel
        {
            public List<B_BBSReply> dataList;
            public B_BBSReply baseInform;
        }
        public override string Key
        {
            get
            {
                return "BBSSectionSvc";
            }
        }
    }
}
