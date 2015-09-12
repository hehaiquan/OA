using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BizService.Common;
using System.IO;
using System.Web;
using IWorkFlow.BaseService;

namespace BizService.Services.B_OA_ConferenceMainSvc
{
    // created by zhoushing
    class B_OA_ConferenceMainSvc : BaseDataHandler
    {
        //B_OA_ConferenceMain
        [DataAction("GetData", "userid", "caseid", "baid")]
        public object  GetData(string userid, string caseId, string baid)
        {
            try
            {
                //只有待办箱才有设置为已读
                if (!String.IsNullOrEmpty(baid)) engineAPI.SetIsReaded(caseId, baid, userid);

                var data = new GetDataModel();
                // 一个会议有多个议程  
                #region 会议信息
                B_OA_ConferenceMain en = new B_OA_ConferenceMain();
                en.Condition.Add("workflowcaseid = " + caseId);
                data.baseInfo = Utility.Database.QueryObject<B_OA_ConferenceMain>(en);

                //新建
                if (data.baseInfo == null)
                {
                    var baseInfo = new B_OA_ConferenceMain();
                    //var userInfo = ComClass.GetUserInfo(userid);
                    data.baseInfo = baseInfo;
                }
                #endregion

                #region 议程信息列表
                if (data.baseInfo != null)
                {
                    B_OA_Conf_Agenda agendaEnt = new B_OA_Conf_Agenda();
                    agendaEnt.Condition.Add("workflowcaseid=" + data.baseInfo.workflowcaseid);
                    data.agendaList = Utility.Database.QueryList<B_OA_Conf_Agenda>(agendaEnt);
                }
                #endregion

                #region 编辑行议程信息
                if (data.baseInfo != null)
                {
                    data.agendaListDetail = new B_OA_Conf_Agenda();
                    data.agendaListDetail.workflowcaseid = data.baseInfo.workflowcaseid;
                }
                #endregion

               return data;
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("获取数据失败！", ex));
            }
        }

        ////保存
        //[DataAction("save", "BizParams", "userid", "content")]
        //public string Save(string BizParams, string userid, string content)
        //{
        //    SkyLandDeveloper developer = new SkyLandDeveloper(BizParams, userid, tran);
        //    IDbTransaction tran = Utility.Database.BeginDbTransaction();
        //    try
        //    {
        //        SaveDataModel data = JsonConvert.DeserializeObject<SaveDataModel>(content);
        //        string caseid = developer.Create();
        //        SaveData(data, tran, caseid);
        //        SetCaseName(data, developer);
        //        developer.Commit();
        //        var retContent = GetData(userid, caseid, developer.baid);
        //        return Utility.JsonResult(true, null, retContent);
        //    }
        //    catch (Exception ex)
        //    {
        //        developer.RollBack();
        //        ComBase.Logger(ex);
        //        return Utility.JsonResult(false, "保存失败:" + ex.Message.Replace(":", " "));
        //    }
        //}

        //保存数据
        public void SaveData(SaveDataModel data, IDbTransaction tran, string caseId)
        {
            try
            {
                if (null != caseId) data.baseInfo.workflowcaseid = caseId;
                data.baseInfo.Condition.Add("workflowcaseid=" + data.baseInfo.workflowcaseid);
                B_OA_ConferenceMain en = Utility.Database.QueryObject<B_OA_ConferenceMain>(data.baseInfo);

                //更新或插入主业务信息
                if (Utility.Database.Update<B_OA_ConferenceMain>(data.baseInfo, tran) < 1)
                {
                    Utility.Database.Insert<B_OA_ConferenceMain>(data.baseInfo, tran);
                }
                #region 基础操作

                #region 新增与修改操作
                var updateCol = data.agendaList.data;
                var delete = data.agendaList.deleteList;
                foreach (var updateItem in updateCol)
                {
                    updateItem.Condition.Clear();
                    if (updateItem.id == null)// 新增
                    {
                        // updateItem.id = 0;// 这里的主键是自增的
                        updateItem.workflowcaseid = data.baseInfo.workflowcaseid;// 外键
                        Utility.Database.Insert(updateItem, tran);
                    }
                    else// 更新
                    {
                        updateItem.Condition.Add("id=" + updateItem.id);
                        Utility.Database.Update(updateItem, tran);
                    }
                }
                #endregion

                #region 删除操作
                var delCol = string.IsNullOrWhiteSpace(delete) ? null : delete.Split(';');
                if (delCol != null)
                {
                    foreach (var delItem in delCol)
                    {
                        if (!string.IsNullOrWhiteSpace(delItem))
                        {
                            var delEnt = new B_OA_Conf_Agenda();// 实例化一个对象
                            delEnt.Condition.Add("id=" + delItem);// 删除条件（要主键）
                            Utility.Database.Delete(delEnt, tran);// 删除
                        }
                    }
                }
                #endregion

                #endregion
            }
            catch (Exception e)
            {
                ComBase.Logger(e);
                throw e;
            }
        }

        /// <summary>
        /// 设置流程实例标题
        /// </summary>
        /// <param name="data"></param>
        /// <param name="deveoloper"></param>
        public void SetCaseName(SaveDataModel data, SkyLandDeveloper deveoloper)
        {
            string unitName = data.baseInfo.sqks;
            string titleType = "会议申请";
            deveoloper.caseName = unitName + "-" + titleType;
        }

        //[DataAction("getDict", "str")]
        //private string getDict(string str) 
        //{
        //    try
        //    {
        //        Dictionary<string, Dictionary<string, string>> dict = new Dictionary<string, Dictionary<string, string>>();

        //        string json = Utility.LoadFile("DataDictConfig.json");
        //        Dictionary<string, string> configDict = JsonConvert.DeserializeObject<Dictionary<string, string>>(json);

        //        string sqls = "";

        //        string[] strArr = new string[configDict.Count];

        //        int num = 0;
        //        foreach (KeyValuePair<string, string> kvp in configDict)
        //        {
        //            strArr[num] = kvp.Key;
        //            sqls += kvp.Value;
        //            num++;
        //        }

        //        DataSet ds = Utility.Database.ExcuteDataSet(sqls);

        //        for (int i = 0; i < ds.Tables.Count; i++)
        //        {
        //            Dictionary<string, string> dictChildren = new Dictionary<string, string>();

        //            foreach (DataRow dr in ds.Tables[i].Rows) 
        //            {
        //                dictChildren.Add(dr[0].ToString(), dr[1].ToString());
        //            }

        //            dict.Add(strArr[i], dictChildren);
        //        }

        //        string jsonData = JsonConvert.SerializeObject(dict);

        //        return jsonData;
        //    }
        //    catch (Exception ex) {
        //        return Utility.JsonMsg(false,ex.ToString());
        //    }
        //}

        //发送
        [DataAction("send", "BizParams", "userid", "content")]
        public string Send(string BizParams, string userid, string content)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            SkyLandDeveloper developer = new SkyLandDeveloper(BizParams, userid, tran);
            try
            {
                SaveDataModel data = JsonConvert.DeserializeObject<SaveDataModel>(content);
                string caseid = developer.Create();
                SaveData(data, tran, caseid);
                SetCaseName(data, developer);
                developer.Send();
                developer.Commit();
                return Utility.JsonResult(true, "发送成功！");
            }
            catch (Exception ex)
            {
                developer.RollBack();
                ComBase.Logger(ex);
                return Utility.JsonResult(false, "发送失败:" + ex.Message.Replace(":", " "));
            }
        }

        // 打印发文
        [DataAction("PrintConferenceMainDoc", "caseid", "userid")]
        public string PrintConferenceMainDoc(string caseid, string userid)
        {
            //SkyLandDeveloper developer = SkyLandDeveloper.FromJson("{}");
            try
            {
                if (string.IsNullOrWhiteSpace(caseid)) return Utility.JsonResult(false, "保存业务后才能打印！");
                string rootPath = HttpContext.Current.Server.MapPath("/");
                DateTime dateTime = DateTime.Now;
                var strYear = dateTime.ToLongDateString();
                var strHour = dateTime.Hour.ToString();
                var strMinute = dateTime.Minute.ToString();
                var strSecond = dateTime.Second.ToString();

                string wordPath = rootPath + "officeFileModel\\B_OA_ConferenceMain\\会议申请模板.docx";
                if (!Directory.Exists(rootPath + "officeFile/B_OA_ConferenceMain"))//若文件夹不存在则新建文件夹  
                {
                    Directory.CreateDirectory(rootPath + "officeFile/B_OA_ConferenceMain"); //新建文件夹  
                }
                string targetpath = rootPath + "officeFile\\B_OA_ConferenceMain\\会议申请模板_" + caseid; // +"_" + strYear + " " + strHour + "时" + strMinute + "分" + strSecond + "秒";

                targetpath = targetpath.Replace("\\", "/");
                wordPath = wordPath.Replace("\\", "/");
                targetpath += ".docx";

                IWorkFlow.OfficeService.IWorkFlowOfficeHandler.ProduceWord2007UP(wordPath, targetpath, CreateWordConferenceMainData(caseid));
                return Utility.JsonResult(true, "发送成功！", "{wordPath:\"" + targetpath + "\"}");
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, "打印失败:" + ex.Message.Replace(":", " "));
            }
        }

        /// <summary>
        /// 创建一个Word数据
        /// </summary>
        /// <param name="caseid"></param>
        /// <returns></returns>
        private Dictionary<string, Object> CreateWordConferenceMainData(string caseid)
        {
            B_OA_ConferenceMain boacm = new B_OA_ConferenceMain();
            boacm.Condition.Add("workflowcaseid=" + caseid);//设置查询条件
            boacm = Utility.Database.QueryObject<B_OA_ConferenceMain>(boacm);


            List<B_OA_Conf_Agenda> boacaList = new List<B_OA_Conf_Agenda>();
            B_OA_Conf_Agenda ent = new B_OA_Conf_Agenda();
            ent.Condition.Add("workflowcaseid=" + caseid);//设置查询条件
            boacaList = Utility.Database.QueryList<B_OA_Conf_Agenda>(ent);

            // 发文s
            Dictionary<string, Object> dict = new Dictionary<string, Object>();
            dict.Add("sqr", boacm.sqr);//申请人
            dict.Add("hysid", boacm.hysid);//申请场地 会议室ID
            dict.Add("sqrq", boacm.sqrq);//申请日期
            dict.Add("xsysb", boacm.xsysb);//申请设备
            dict.Add("zksj", boacm.zksj);//召开时间
            dict.Add("zcr", boacm.zcr);//主持人
            dict.Add("cyry", boacm.cyry);//参加人员
            dict.Add("hyzt", boacm.hyzt);//会议主题  

            for (int i = 0; i < boacaList.Count; i++)
            {
                dict.Add("kssj" + i.ToString(), (boacaList[i] == null) ? "" : Convert.ToDateTime(boacaList[i].kssj).ToString("yyyy-MM-dd HH:mm"));
                dict.Add("jssj" + i.ToString(), (boacaList[i] == null) ? "" : Convert.ToDateTime(boacaList[i].jssj).ToString("yyyy-MM-dd HH:mm"));
                dict.Add("fyr" + i.ToString(), (boacaList[i] == null) ? "" : boacaList[i].fyr);
                dict.Add("ycnr" + i.ToString(), (boacaList[i] == null) ? "" : boacaList[i].ycnr);
            }

            //for (int i = 0; i < wfbaList.Count; i++)
            //{
            //    switch (wfbaList[i].BAID.ToString())
            //    {
            //        case "BA001":
            //            dict.Add("Remark" + wfbaList[i].BAID.ToString(), (wfbaList[i] == null) ? "" : wfbaList[i].Remark);// 意见     
            //            break;
            //        case "BA002":
            //            dict.Add("Remark" + wfbaList[i].BAID.ToString(), (wfbaList[i] == null) ? "" : wfbaList[i].Remark);// 意见
            //            break;
            //        case "BA003":
            //            dict.Add("Remark" + wfbaList[i].BAID.ToString(), (wfbaList[i] == null) ? "" : wfbaList[i].Remark);// 意见
            //            break;
            //        case "BA004":
            //            dict.Add("Remark" + wfbaList[i].BAID.ToString(), (wfbaList[i] == null) ? "" : wfbaList[i].Remark);// 意见
            //            break;
            //        case "BA005":
            //            dict.Add("Remark" + wfbaList[i].BAID.ToString(), (wfbaList[i] == null) ? "" : wfbaList[i].Remark);// 意见
            //            break;
            //        case "BA006":
            //            dict.Add("Remark" + wfbaList[i].BAID.ToString(), (wfbaList[i] == null) ? "" : wfbaList[i].Remark);// 意见
            //            break;
            //        case "BA007":
            //            dict.Add("Remark" + wfbaList[i].BAID.ToString(), (wfbaList[i] == null) ? "" : wfbaList[i].Remark);// 意见
            //            break;
            //        case "BA008":
            //            dict.Add("Remark" + wfbaList[i].BAID.ToString(), (wfbaList[i] == null) ? "" : wfbaList[i].Remark);// 意见
            //            break;
            //        case "BA009":
            //            dict.Add("Remark" + wfbaList[i].BAID.ToString(), (wfbaList[i] == null) ? "" : wfbaList[i].Remark);// 意见
            //            break;
            //        case "BA010":
            //            dict.Add("Remark" + wfbaList[i].BAID.ToString(), (wfbaList[i] == null) ? "" : wfbaList[i].Remark);// 意见
            //            break;
            //    }

            //}
            return dict;
        }


        public override string Key
        {
            get
            {
                return "B_OA_ConferenceMainSvc";
            }
        }

        public class GetDataModel
        {
            public B_OA_ConferenceMain baseInfo;
            public List<B_OA_Conf_Agenda> agendaList;
            public B_OA_Conf_Agenda agendaListDetail;
        }

        public class SaveDataModel
        {
            public B_OA_ConferenceMain baseInfo;
            public KOGridEdit<B_OA_Conf_Agenda> agendaList;



        }
    }


}