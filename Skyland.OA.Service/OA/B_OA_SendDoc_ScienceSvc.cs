using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BizService.Common;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using System.Data;
using System.Web;
using System.IO;
using Newtonsoft.Json.Linq;
using System.Drawing;
using IWorkFlow.BaseService;
using IWorkFlow.OfficeService.OpenXml;

namespace BizService.Services
{
    class B_OA_SendDoc_ScienceSvc : BaseDataHandler
    {

        [DataAction("GetData", "userid", "caseId", "baid")]
        public object GetData(string userid, string caseId, string baid)
        {
            try
            {
                //只有待办箱才有设置为已读
                if (!String.IsNullOrEmpty(baid)) engineAPI.SetIsReaded(caseId, baid, userid);

                GetDataModel data = new GetDataModel();
                B_OA_SendDoc_Science en = new B_OA_SendDoc_Science();
                en.Condition.Add("caseid=" + caseId);
                data.sendDocBaseInfo = Utility.Database.QueryObject<B_OA_SendDoc_Science>(en);
                if (data.sendDocBaseInfo == null)
                {
                    var baseInfo = new B_OA_SendDoc_Science();
                    baseInfo.sendDate = DateTime.Now;
                    baseInfo.createManId = userid;
                    //baseInfo.gklx = "1";//公开类型默认为主动公开
                    data.sendDocBaseInfo = baseInfo;
                }
                return data;
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("获取数据失败！", ex));
            }
        }


        //发送
        [DataAction("send", "BizParams", "userid", "content")]
        public string Send(string BizParams, string userid, string content)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            SkyLandDeveloper developer = new SkyLandDeveloper(BizParams, userid, tran);
            try
            {
                GetDataModel data = JsonConvert.DeserializeObject<GetDataModel>(content);
                string caseid = developer.caseid;

                if (String.IsNullOrEmpty(caseid))
                {
                    string unitName = data.sendDocBaseInfo.title;
                    string titleType = "环科所发文";
                    developer.caseName = unitName + "-" + titleType;
                    caseid = developer.Create();

                    //作者名字
                    data.sendDocBaseInfo.createManName = ComClass.GetUserInfo(userid).CnName;
                }

                if (developer.wfcase.actid == "A001")
                {
                 
                    //业务关联表
                    if (data.sendRelation.relationCaseId != "")
                    {
                        B_OA_SendDoc_R sendR = new B_OA_SendDoc_R();
                        sendR.actId = data.sendRelation.actId;
                        sendR.caseId = caseid;
                        sendR.wId = data.sendRelation.wId;
                        sendR.filePath = data.sendRelation.filePath;
                        sendR.triggerActId = data.sendRelation.triggerActId;
                        sendR.relationCaseId = data.sendRelation.relationCaseId;
                        Utility.Database.Insert<B_OA_SendDoc_R>(sendR, tran);
                    }
                }

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
                throw (new Exception("业务发送失败！", ex));
            }
        }

        [DataAction("GetWorkFlowCaseByCaseId", "caseid", "userid")]
        public string GetWorkFlowCaseByCaseId(string caseid, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                var model = CommonFunctional.GetWorkFlowCaseByCaseId(caseid, tran);

                return Utility.JsonResult(true, null, model);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, ex.Message);
            }
        }

        /// <summary>
        /// 设置流程实例标题
        /// </summary>
        /// <param name="data"></param>
        /// <param name="deveoloper"></param>
        public void SetCaseName(GetDataModel data, SkyLandDeveloper deveoloper)
        {
            string unitName = data.sendDocBaseInfo.title;
            string titleType = "环境科学研修所发文";
            deveoloper.caseName = unitName + "-" + titleType;
        }

        /// <summary>
        /// 打印发文笺
        /// </summary>
        /// <param name="caseid"></param>
        /// <returns></returns>
        [DataAction("PrintSendDoc", "caseid", "userid")]
        public string PrintSendDoc(string caseid, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                if (string.IsNullOrWhiteSpace(caseid)) return Utility.JsonResult(false, "保存业务后才能打印！");
                string rootPath = HttpContext.Current.Server.MapPath("/").Replace("\\", "/");
                string wordPath = rootPath + "officeFileModel/SendScient/环科所发文模版.docx";
                if (!Directory.Exists(rootPath + "officeFile/SendScient"))//若文件夹不存在则新建文件夹  
                {
                    Directory.CreateDirectory(rootPath + "officeFile/SendScient"); //新建文件夹  
                }
                string targetpath = rootPath + "officeFile/SendScient/环科所发文模版_" + caseid; // +"_" + strYear + " " + strHour + "时" + strMinute + "分" + strSecond + "秒";
                targetpath = targetpath.Replace("\\", "/");
                wordPath = wordPath.Replace("\\", "/");
                targetpath += ".docx";
                var dic = CreateWordSendDocData(caseid, tran);
                IWorkFlow.OfficeService.IWorkFlowOfficeHandler.ProduceWord2007UP(wordPath, targetpath, dic);
                foreach (var item in dic)
                {
                    if (item.Value is Image)
                    {
                        var img = item.Value as Image;
                        img.Dispose();
                    }
                };
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "", targetpath);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, ex.Message);
            }
        }

        /// <summary>
        /// 创建一个Word数据
        /// </summary>
        /// <param name="caseid"></param>
        /// <returns></returns>
        private Dictionary<string, Object> CreateWordSendDocData(string caseid, IDbTransaction tran)
        {
            StringBuilder strSql = new StringBuilder();
            B_OA_SendDoc_Science boacd = new B_OA_SendDoc_Science();
            boacd.Condition.Add("caseid = " + caseid);//设置查询条件
            boacd = Utility.Database.QueryObject<B_OA_SendDoc_Science>(boacd);


            // 发文
            Dictionary<string, Object> dict = new Dictionary<string, Object>();
            dict.Add("title", boacd.title);
            dict.Add("mainDelivery", boacd.mainDelivery);
            dict.Add("cc", boacd.cc);
            dict.Add("copyAndrecord", boacd.copyAndrecord);
            dict.Add("printCount", boacd.printCount.ToString());
            dict.Add("ngr", boacd.createManName);

            //评阅意见的插入
            #region
            FX_WorkFlowBusAct work = new FX_WorkFlowBusAct();
            work.Condition.Add("CaseID = " + caseid);
            work.OrderInfo = "ReceDate asc";
            List<FX_WorkFlowBusAct> listWork = Utility.Database.QueryList<FX_WorkFlowBusAct>(work, tran);
            //将所有工作流信息格式化
            List<B_OA_PrintParagragh> listPara = CommonFunctional.ChangeListToMatch(listWork);
            List<B_OA_PrintParagragh> hgrList = new List<B_OA_PrintParagragh>();
            List<B_OA_PrintParagragh> qfList = new List<B_OA_PrintParagragh>();
                        //领导批示
            for (int i = 0; i < listPara.Count; i++)
            {
                // 拟稿人
                if (listPara[i].ActID == "A002")
                {
                    hgrList.Add(listPara[i]);
                }
                //签发
                else if (listPara[i].ActID == "A003")
                {
                    qfList.Add(listPara[i]);
                }
            }
            int k = 0;
            //核稿人
            var imgHgrList = new OpenXmlHelper.ImageTextArray[hgrList.Count];
            for (k = 0; k < hgrList.Count; k++)
            {
                imgHgrList[k] = new OpenXmlHelper.ImageTextArray();
                imgHgrList[k].Images = hgrList[k].Image;
                imgHgrList[k].Text = hgrList[k].Text;
                imgHgrList[k].Foots = hgrList[k].Foots;
                imgHgrList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("hgr", imgHgrList);

            //签发人
            var imgQfList = new OpenXmlHelper.ImageTextArray[qfList.Count];
            for (k = 0; k < qfList.Count; k++)
            {
                imgQfList[k] = new OpenXmlHelper.ImageTextArray();
                imgQfList[k].Images = qfList[k].Image;
                imgQfList[k].Text = qfList[k].Text;
                imgQfList[k].Foots = qfList[k].Foots;
                imgQfList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("qfr", imgQfList);
            #endregion

            return dict;
        }

        //保存数据
        public void SaveData(GetDataModel data, IDbTransaction tran, string caseId)
        {
            try
            {
                if (caseId != null) data.sendDocBaseInfo.caseid = caseId;
                data.sendDocBaseInfo.Condition.Add("caseID=" + data.sendDocBaseInfo.caseid);
                //更新或插入主业务信息
                if (Utility.Database.Update<B_OA_SendDoc_Science>(data.sendDocBaseInfo, tran) < 1)
                {
                    Utility.Database.Insert<B_OA_SendDoc_Science>(data.sendDocBaseInfo, tran);
                }

            }
            catch (Exception e)
            {
                ComBase.Logger(e);
                throw e;
            }
        }

        public override string Key
        {
            get
            {
                return "B_OA_SendDoc_ScienceSvc";
            }
        }


        public class GetDataModel
        {
            public B_OA_SendDoc_R sendRelation;//业务关系表
            public B_OA_SendDoc_Science sendDocBaseInfo;
        }

    }
}
