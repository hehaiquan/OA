using DocumentFormat.OpenXml.Drawing.Charts;
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
using System.Web;
using System.IO;
using System.Drawing;
using IWorkFlow.OfficeService.OpenXml;
using DataTable = System.Data.DataTable;
using IWorkFlow.BaseService;

namespace BizService.Services
{
    class B_OA_ReceiveDoc_QuZhanSvc : BaseDataHandler
    {

        string rootPath = HttpContext.Current.Server.MapPath("/");

        [DataAction("GetData", "userid", "caseid", "baid", "actid")]
        public object GetData(string userid, string caseId, string baid, string actid)
        {
            try
            {
                //只有待办箱才有设置为已读
                if (!String.IsNullOrEmpty(baid)) engineAPI.SetIsReaded(caseId, baid, userid);

                var data = new GetDataModel();
                IDbTransaction tran = Utility.Database.BeginDbTransaction();
                #region 基础信息
                B_OA_ReceiveDoc_QuZhan en = new B_OA_ReceiveDoc_QuZhan();
                en.Condition.Add("caseID = " + caseId);
                data.baseInfo = Utility.Database.QueryObject<B_OA_ReceiveDoc_QuZhan>(en);
                //新建
                if (data.baseInfo == null)
                {

                    var baseInfo = new B_OA_ReceiveDoc_QuZhan();
                    string strSql = "select Max(substring(code,9,5)) from B_OA_ReceiveDoc_QuZhan";
                    DataSet ds = Utility.Database.ExcuteDataSet(strSql, tran);
                    string code = ds.Tables[0].Rows[0][0].ToString();
                    if (code == "")
                    {
                        baseInfo.code = "LW[" + DateTime.Now.Year.ToString() + "]00001";
                    }
                    else
                    {
                        baseInfo.code = "LW[" + DateTime.Now.Year + "]" + (int.Parse(code) + 1).ToString();
                    }
                    baseInfo.recordManId = userid;
                    baseInfo.recordManName = ComClass.GetUserInfo(userid).CnName;
                    //var userInfo = ComClass.GetUserInfo(userid);
                    data.baseInfo = baseInfo;
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
                    string unitName = data.baseInfo.wjmc;
                    string titleType = "来文";
                    developer.caseName = unitName + "-" + titleType;
                    caseid = developer.Create();
                }

                SaveData(data, tran, caseid);
                //SetCaseName(data, developer);
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

        //保存数据
        public void SaveData(GetDataModel data, IDbTransaction tran, string caseId)
        {
            try
            {
                if (caseId != null) data.baseInfo.caseid = caseId;
                data.baseInfo.Condition.Add("caseid=" + data.baseInfo.caseid);
                //更新或插入主业务信息
                if (Utility.Database.Update<B_OA_ReceiveDoc_QuZhan>(data.baseInfo, tran) < 1)
                {
                    Utility.Database.Insert<B_OA_ReceiveDoc_QuZhan>(data.baseInfo, tran);
                }

            }
            catch (Exception e)
            {
                ComBase.Logger(e);
                throw e;
            }
        }

        [DataAction("PrintDoc", "caseid")]
        public object PrintDoc(string caseid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                string wordPath = CommonFunctional.GetDocumentPathByName("Receive", "FileModelDir");
                string targetpath = CommonFunctional.GetDocumentPathByName("Receive", "FileDir");
                targetpath = targetpath + caseid + ".docx";
                wordPath = wordPath + "来文处理笺.docx";
                var dic = CreateWordSendDocData(caseid, tran);
                IWorkFlow.OfficeService.IWorkFlowOfficeHandler.ProduceWord2007UP(wordPath, targetpath, dic);
                Utility.Database.Commit(tran);
                foreach (var item in dic)
                {
                    if (item.Value is Image)
                    {
                        var img = item.Value as Image;
                        img.Dispose();
                    }
                }
                return new
                {
                    targetpath = targetpath
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);
                throw (new Exception("打印失败！", ex));
            }
        }

        private Dictionary<string, Object> CreateWordSendDocData(string caseid, IDbTransaction tran)
        {
            B_OA_ReceiveDoc_QuZhan receiveDoc = new B_OA_ReceiveDoc_QuZhan();
            receiveDoc.Condition.Add("caseid=" + caseid);
            receiveDoc = Utility.Database.QueryObject<B_OA_ReceiveDoc_QuZhan>(receiveDoc, tran);

            Dictionary<string, Object> dict = new Dictionary<string, Object>();
            dict.Add("code", receiveDoc.code == null ? "" : receiveDoc.code);//编号
            dict.Add("lwdw", receiveDoc.lwdw == null ? "" : receiveDoc.lwdw);//来文单位
            dict.Add("wjmc", receiveDoc.wjmc == null ? "" : receiveDoc.wjmc);//文件名称
            dict.Add("bgsnbyj", receiveDoc.toDoSug == null ? "" : receiveDoc.toDoSug);//文件名称
            dict.Add("remark", receiveDoc.remark == null ? "" : receiveDoc.remark);//备注

            if (!string.IsNullOrEmpty(receiveDoc.lwrq.ToString()))
            {
                string createDate = (DateTime.Parse(receiveDoc.lwrq.ToString())).ToString("yyyy年MM月dd日");
                dict.Add("createDate", createDate);//主送
            }

            if (!string.IsNullOrEmpty(receiveDoc.zbsj.ToString()))
            {
                string zbsj = (DateTime.Parse(receiveDoc.zbsj.ToString())).ToString("yyyy年MM月dd日");
                dict.Add("zbsj", zbsj);//主送
            }
            //获取所有评阅意见
            FX_WorkFlowBusAct work = new FX_WorkFlowBusAct();
            work.Condition.Add("CaseID = " + caseid);
            work.OrderInfo = "ReceDate asc";
            List<FX_WorkFlowBusAct> listWork = Utility.Database.QueryList<FX_WorkFlowBusAct>(work, tran);
            //将所有工作流信息格式化
            List<B_OA_PrintParagragh> listPara = CommonFunctional.ChangeListToMatch(listWork);
            //办公室核稿意见
            List<B_OA_PrintParagragh> ldpsList = new List<B_OA_PrintParagragh>();
            int k = 0;
            //领导批示
            for (k = 0; k < listPara.Count; k++)
            {
                if (listPara[k].ActID == "A005")
                {
                    ldpsList.Add(listPara[k]);
                }
            }
            //承办科室负责人
            var imgLdpsList = new OpenXmlHelper.ImageTextArray[ldpsList.Count];
            for (k = 0; k < ldpsList.Count; k++)
            {
                imgLdpsList[k] = new OpenXmlHelper.ImageTextArray();
                imgLdpsList[k].Images = ldpsList[k].Image;
                imgLdpsList[k].Text = ldpsList[k].Text;
                imgLdpsList[k].Foots = ldpsList[k].Foots;
                imgLdpsList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("ldps", imgLdpsList);
            return dict;
        }

        public override string Key
        {
            get
            {
                return "B_OA_ReceiveDoc_QuZhanSvc";
            }
        }

        public class GetDataModel
        {
            public B_OA_ReceiveDoc_QuZhan baseInfo;
        }
    }
}
