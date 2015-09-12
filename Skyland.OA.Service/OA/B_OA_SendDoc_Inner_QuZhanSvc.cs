using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BizService.Common;
using IWorkFlow.BaseService;
using IWorkFlow.Host;
using IWorkFlow.OfficeService.OpenXml;
using IWorkFlow.ORM;
using Newtonsoft.Json;

namespace BizService.B_OA_SendDoc_Inner_QuZhanSvc
{
    public class B_OA_SendDoc_Inner_QuZhanSvc : BaseDataHandler
    {
        [DataAction("GetData", "userid", "caseId", "baid", "actid")]
        public object GetData(string userid, string caseId, string baid, string actid)
        {
            try
            {
                if (!String.IsNullOrEmpty(baid)) engineAPI.SetIsReaded(caseId, baid, userid);
                var data = new GetDataModel();
                if (caseId == "")
                {
                    DeptInfoAndUserInfo userData = ComClass.GetDeptAndUserByUserId(userid);
                    data.sendDocBaseInfo = new B_OA_SendDoc_Inner_QuZhan();
                    data.sendDocBaseInfo.underTakeManId = userData.userinfo.UserID;
                    data.sendDocBaseInfo.undertakeMan = userData.userinfo.CnName;
                    data.sendDocBaseInfo.underTakeDep = userData.deptinfo.DPName;
                    data.sendDocBaseInfo.underTakeDepId = userData.deptinfo.DPID;
                    B_OA_FileType fileType = new B_OA_FileType();
                    fileType.Condition.Add("flagType = " + "3");
                    fileType = Utility.Database.QueryObject<B_OA_FileType>(fileType);
                    data.sendDocBaseInfo.fileTypeId = fileType.FileTypeId;
                }
                else
                {
                    B_OA_SendDoc_Inner_QuZhan userData = new B_OA_SendDoc_Inner_QuZhan();
                    userData.Condition.Add("caseId=" + caseId);
                    userData = Utility.Database.QueryObject<B_OA_SendDoc_Inner_QuZhan>(userData);
                    data.sendDocBaseInfo = userData;
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
                    string titleType = "内部事项";
                    developer.caseName = unitName + "-" + titleType;
                    caseid = developer.Create();
                }
                if (developer.wfcase.actid == "A001")
                {
                    string strSql = "select Max(substring(code,9,5)) from B_OA_SendDoc_Inner_QuZhan";
                    DataSet ds = Utility.Database.ExcuteDataSet(strSql, tran);
                    string code = ds.Tables[0].Rows[0][0].ToString();
                    if (code == "")
                    {
                        data.sendDocBaseInfo.code = "NB[" + DateTime.Now.Year.ToString() + "]00001";
                    }
                    else
                    {
                        data.sendDocBaseInfo.code = "NB[" + DateTime.Now.Year + "]" + (int.Parse(code) + 1).ToString();
                    }

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
                if (caseId != null) data.sendDocBaseInfo.caseId = caseId;
                data.sendDocBaseInfo.Condition.Add("caseId=" + data.sendDocBaseInfo.caseId);
                //更新或插入主业务信息
                if (Utility.Database.Update<B_OA_SendDoc_Inner_QuZhan>(data.sendDocBaseInfo, tran) < 1)
                {
                    Utility.Database.Insert<B_OA_SendDoc_Inner_QuZhan>(data.sendDocBaseInfo, tran);
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
                string wordPath = CommonFunctional.GetDocumentPathByName("Send", "FileModelDir");
                string targetpath = CommonFunctional.GetDocumentPathByName("SendDocContent", "FileDir");
                targetpath = targetpath + "内部事项" + caseid + ".docx";
                wordPath = wordPath + "内部事项.docx";
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
            B_OA_SendDoc_Inner_QuZhan sendDoc = new B_OA_SendDoc_Inner_QuZhan();
            sendDoc.Condition.Add("caseid=" + caseid);
            sendDoc = Utility.Database.QueryObject<B_OA_SendDoc_Inner_QuZhan>(sendDoc, tran);

            Dictionary<string, Object> dict = new Dictionary<string, Object>();
            dict.Add("code", sendDoc.code == null ? "" : sendDoc.code);//编号
            dict.Add("underTakeDep", sendDoc.underTakeDep == null ? "" : sendDoc.underTakeDep);//承办科室
            dict.Add("undertakeMan", sendDoc.undertakeMan == null ? "" : sendDoc.undertakeMan);//承办人
            dict.Add("content", sendDoc.content == null ? "" : sendDoc.content);//内容
            dict.Add("title", sendDoc.title == null ? "" : sendDoc.title);//内容
            dict.Add("remark", sendDoc.remark == null ? "" : sendDoc.remark);//备注
            if (!string.IsNullOrEmpty(sendDoc.createDate.ToString()))
            {
                string createDate = (DateTime.Parse(sendDoc.createDate.ToString())).ToString("yyyy年MM月dd日");
                dict.Add("createDate", createDate);//主送
            }
            //获取所有评阅意见
            FX_WorkFlowBusAct work = new FX_WorkFlowBusAct();
            work.Condition.Add("CaseID = " + caseid);
            work.OrderInfo = "ReceDate asc";
            List<FX_WorkFlowBusAct> listWork = Utility.Database.QueryList<FX_WorkFlowBusAct>(work, tran);
            //将所有工作流信息格式化
            List<B_OA_PrintParagragh> listPara = CommonFunctional.ChangeListToMatch(listWork);
            //办公室核稿意见
            List<B_OA_PrintParagragh> cbksfzryjList = new List<B_OA_PrintParagragh>();
            //会办单位意见
            List<B_OA_PrintParagragh> hqksyjList = new List<B_OA_PrintParagragh>();
            //站领导批示
            List<B_OA_PrintParagragh> zldpsList = new List<B_OA_PrintParagragh>();
            int k = 0;
            //承办科室负责人意见
            for (k = 0; k < listPara.Count; k++)
            {
                if (listPara[k].ActID == "A002")
                {
                    cbksfzryjList.Add(listPara[k]);
                }
            }
            //承办科室负责人
            var imgCbksfzryjList = new OpenXmlHelper.ImageTextArray[cbksfzryjList.Count];
            for (k = 0; k < cbksfzryjList.Count; k++)
            {
                imgCbksfzryjList[k] = new OpenXmlHelper.ImageTextArray();
                imgCbksfzryjList[k].Images = cbksfzryjList[k].Image;
                imgCbksfzryjList[k].Text = cbksfzryjList[k].Text;
                imgCbksfzryjList[k].Foots = cbksfzryjList[k].Foots;
                imgCbksfzryjList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("cbksfzryj", imgCbksfzryjList);

            //会办单位意见
            for (k = 0; k < listPara.Count; k++)
            {
                if (listPara[k].ActID == "A003")
                {
                    hqksyjList.Add(listPara[k]);
                }
            }
            //承办科室负责人
            var imgHqksyjList = new OpenXmlHelper.ImageTextArray[hqksyjList.Count];
            for (k = 0; k < hqksyjList.Count; k++)
            {
                imgHqksyjList[k] = new OpenXmlHelper.ImageTextArray();
                imgHqksyjList[k].Images = hqksyjList[k].Image;
                imgHqksyjList[k].Text = hqksyjList[k].Text;
                imgHqksyjList[k].Foots = hqksyjList[k].Foots;
                imgHqksyjList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("hqksyj", imgHqksyjList);

            //
            for (k = 0; k < listPara.Count; k++)
            {
                if (listPara[k].ActID == "A004")
                {
                    zldpsList.Add(listPara[k]);
                }
            }
            //承办科室负责人
            var imgZldpsList = new OpenXmlHelper.ImageTextArray[zldpsList.Count];
            for (k = 0; k < zldpsList.Count; k++)
            {
                imgZldpsList[k] = new OpenXmlHelper.ImageTextArray();
                imgZldpsList[k].Images = zldpsList[k].Image;
                imgZldpsList[k].Text = zldpsList[k].Text;
                imgZldpsList[k].Foots = zldpsList[k].Foots;
                imgZldpsList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("zldps", imgZldpsList);
            return dict;

        }

        // 获取数据模型
        public class
        GetDataModel
        {
            public B_OA_SendDoc_Inner_QuZhan sendDocBaseInfo;
        }

        public override string Key
        {
            get
            {
                return "B_OA_SendDoc_Inner_QuZhanSvc";
            }
        }
    }

}
