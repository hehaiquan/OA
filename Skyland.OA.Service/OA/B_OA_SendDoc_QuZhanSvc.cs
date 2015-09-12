using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BizService.Common;
using IWorkFlow.BaseService;
using IWorkFlow.Host;
using IWorkFlow.OfficeService.OpenXml;
using IWorkFlow.ORM;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Drawing;

namespace BizService.Services
{
    class B_OA_SendDoc_QuZhanSvc : BaseDataHandler
    {
        [DataAction("GetData", "userid", "caseId", "baid")]
        public object GetData(string userid, string caseId, string baid)
        {
            try
            {
                //只有待办箱才有设置为已读
                if (!String.IsNullOrEmpty(baid)) engineAPI.SetIsReaded(caseId, baid, userid);

                GetDataModel data = new GetDataModel();
                B_OA_SendDoc_QuZhan en = new B_OA_SendDoc_QuZhan();
                en.Condition.Add("caseid=" + caseId);
                data.sendDocBaseInfo = Utility.Database.QueryObject<B_OA_SendDoc_QuZhan>(en);
                if (data.sendDocBaseInfo == null)
                {
                    var baseInfo = new B_OA_SendDoc_QuZhan();
                    baseInfo.fwrq = DateTime.Now;
                    //baseInfo.gklx = "1";//公开类型默认为主动公开
                    data.sendDocBaseInfo = baseInfo;
                  UserInfo userInfor =  ComClass.GetUserInfo(userid);
                  data.sendDocBaseInfo.createMan = userInfor.CnName;
                  data.sendDocBaseInfo.createManId = userInfor.UserID;
                }
                return data;
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("获取数据失败！", ex));
            }
        }

        [DataAction("send", "BizParams", "userid", "content")]
        public string Send(string BizParams, string userid, string content)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            SkyLandDeveloper developer = new SkyLandDeveloper(BizParams, userid, tran);
            try
            {
                GetDataModel data = JsonConvert.DeserializeObject<GetDataModel>(content);// new SaveDataModel();                               

                string caseid = developer.caseid;
                if (String.IsNullOrEmpty(caseid))
                {
                    string unitName = data.sendDocBaseInfo.title;
                    string titleType = "发文";
                    developer.caseName = unitName + "-" + titleType;
                    caseid = developer.Create();
                }

                if (developer.wfcase.actid == "A001")
                {
                    //当此文未草稿的时候并未生成caseid，而存的是guid，此步骤是将正文路径的caseid字段修改成caseid
                    CommonFunctional.ChangeGuidToCaseId(developer.wfcase.guid, caseid, tran);
                }
                SaveData(data, tran, caseid);
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


        public B_OA_SendDoc_QuZhan SaveData(GetDataModel data, IDbTransaction tran, string caseId)
        {
            StringBuilder strSql = new StringBuilder();
            if (caseId != null) data.sendDocBaseInfo.caseid = caseId;
            data.sendDocBaseInfo.Condition.Add("caseid=" + data.sendDocBaseInfo.caseid);
            B_OA_SendDoc_QuZhan en = Utility.Database.QueryObject<B_OA_SendDoc_QuZhan>(data.sendDocBaseInfo);
            //如果主键和id都为空，插入信息
            if (data.sendDocBaseInfo.id <= 0)
            {
                data.sendDocBaseInfo.fwrq = DateTime.Now;
                Utility.Database.Insert(data.sendDocBaseInfo, tran);
                strSql.Clear();
                strSql.AppendFormat(@"select @@IDENTITY");
                int id = Utility.Database.QueryObject<int>(strSql.ToString(), tran);
                data.sendDocBaseInfo.id = id;
            }
            else
            {
                Utility.Database.Update(data.sendDocBaseInfo, tran);
            }
            return data.sendDocBaseInfo;
        }


        /// <summary>
        /// 点击正文模版
        /// </summary>
        /// <param name="BizParams">业务数据</param>
        /// <param name="content">数据</param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("CreateMainBody", "content", "guid", "caseid", "userid", "type", "actId")]
        public object CreateMainBody(string content, string guid, string caseid, string userid, string type, string actId)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            GetDataModel dataModel = new GetDataModel();
            try
            {
                string id = "";
                if (String.IsNullOrEmpty(caseid))
                {
                    id = guid;
                }
                else
                {
                    id = caseid;
                }
                //正文路径
                string path = GetFilePath("mainbody", id, userid, tran, type, actId);
                Utility.Database.Commit(tran);
                return new
                {

                    path = path
                };
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("读取正文模版失败！", ex));
            }
        }

        /// <summary>
        /// 获取正文路径
        /// </summary>
        /// <param name="docType"></param>
        /// <param name="caseId"></param>
        /// <param name="userid"></param>
        /// <param name="tran"></param>
        /// <returns></returns>
        public string GetFilePath(string docType, string caseId, string userid, IDbTransaction tran, string type, string actId)
        {
            B_Common_CreateDoc createDoc = new B_Common_CreateDoc();
            StringBuilder strSql = new StringBuilder();
            string returnPath = "";//返回路径
            string filePath = "";//数据库要记录的的路径
            string documentName = "SendDocContent";//文件加路径
            string documentPath = CommonFunctional.GetDocumentPathByName(documentName, "FileDir");//文件夹全路径

            string modelName = "Send";
            string modelPath = CommonFunctional.GetDocumentPathByName(modelName, "FileModelDir");
            string modelFileName = "发文正文模板.docx";
            modelPath = modelPath + modelFileName;

            if (!File.Exists(modelPath))
            {
                throw (new Exception("发文正文模版路径不存在！"));
            }

            //优先查找套红模版,若已套红则优先选择套红模版，若没有套红则查询是否存入过正文，如果存入过返回存入过的正文路径，如果没有则新生成
            strSql.AppendFormat("select * from B_Common_CreateDoc where caseid = '{0}' and type = '{1}' and docType = '{2}'", caseId, type, "redCover");
            DataSet ds_Cover = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
            if (ds_Cover.Tables[0].Rows.Count > 0)
            {
                string jsonData_Cover = JsonConvert.SerializeObject(ds_Cover.Tables[0]);
                List<B_Common_CreateDoc> list_Cover = (List<B_Common_CreateDoc>)JsonConvert.DeserializeObject(jsonData_Cover, typeof(List<B_Common_CreateDoc>));
                filePath = list_Cover[0].filename;
                filePath = filePath.Replace("#", @"/");
                string path = CommonFunctional.GetDocumentPathByName("", "");
                returnPath = path + filePath;
            }
            else
            {
                strSql.Clear();
                strSql.AppendFormat("select * from B_Common_CreateDoc where caseid = '{0}' and type = '{1}' and docType = '{2}'", caseId, type, docType);
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
                List<B_Common_CreateDoc> list = (List<B_Common_CreateDoc>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_Common_CreateDoc>));
                if (list.Count == 0)
                {
                    DateTime dataTimeNow = DateTime.Now;
                    string strFileName = "发文正文_" + dataTimeNow.ToString("yyyyMMddHHmmss") + "_" + caseId + ".docx";
                    documentPath = documentPath + strFileName;
                    string savePath = documentName + "#" + strFileName;
                    returnPath = documentPath;

                    if (!File.Exists(documentPath))
                    {
                        File.Copy(modelPath, documentPath);
                    }
                    createDoc.caseid = caseId;
                    createDoc.createman = userid;
                    createDoc.type = type;
                    createDoc.createdate = dataTimeNow;
                    createDoc.filename = savePath;
                    createDoc.docType = "mainbody";
                    Utility.Database.Insert(createDoc, tran);
                }
                else
                {
                    filePath = list[0].filename;
                    filePath = filePath.Replace("#", @"/");
                    string path = CommonFunctional.GetDocumentPathByName("", "");
                    returnPath = path + filePath;
                    if (!File.Exists(returnPath))
                    {
                        if (actId == "A001")
                        {
                            File.Copy(modelPath, documentPath);
                        }
                        else
                        {
                            throw (new Exception("此发文的正文路径不存在，请联系统管理员 或 回退到发文拟稿时的步骤！"));
                        }
                    }

                    returnPath = returnPath.Replace("\\", "/");
                }
            }

            return returnPath;
        }


        // 打印发文正文
        [DataAction("PrintSendDocContent", "content", "userid")]
        public string PrintSendDocContent(string content, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            SkyLandDeveloper developer = new SkyLandDeveloper("{}", userid, tran);
            try
            {
                dynamic jdata = JValue.Parse(content);
                string fwrqString = jdata["fwrqString"];//fwrqString
                string printType = jdata["printType"];//printType
                string caseid = jdata["caseid"];
                string strFileName = "发文正文_";
                strFileName += DateTime.Now.ToString("yyyyMMddHHmmss") + "_temporary";
                strFileName += ".docx";
                string sendContentPath = CommonFunctional.GetDocumentPathByName("SendDocContent", "FileDir");
                string targetPath = sendContentPath + strFileName;
                string savePath = "SendDocContent#" + strFileName;

                string realFileName = "";
                switch (printType)
                {
                    case "1":
                        realFileName = "红头示例.docx";
                        break;
                }
                string modelPath = CommonFunctional.GetDocumentPathByName("Send", "FileModelDir");

                //选择模版，将模版复制出一份
                //通过caseid查找发文，并将字号贴上
                B_OA_SendDoc_QuZhan sendDoc = new B_OA_SendDoc_QuZhan();
                sendDoc.Condition.Add("caseid=" + caseid);
                sendDoc = Utility.Database.QueryObject(sendDoc, tran);
                Dictionary<string, Object> dict = new Dictionary<string, Object>();
                realFileName = modelPath + realFileName;
                dict.Add("fwzh", "文号测试");//发文字号
                //将字号赋到文档的相应位置
                IWorkFlow.OfficeService.IWorkFlowOfficeHandler.ProduceWord2007UP(realFileName, targetPath, dict);
                //获取正文的路径
                B_Common_CreateDoc createDoc = new B_Common_CreateDoc();
                createDoc.Condition.Add("caseid=" + caseid);
                createDoc.Condition.Add("docType=" + "mainBody");
                createDoc = Utility.Database.QueryObject(createDoc, tran);
                if (createDoc == null)
                {
                    throw (new Exception("选择模版失败:此发文未生成过正文，请编辑正文后再选择模版！"));
                }

                string fileName = createDoc.filename.Replace("#", "/");
                string filePath = CommonFunctional.GetDocumentPathByName("", "") + fileName;
                if (!File.Exists(filePath))
                {
                    developer.RollBack();
                    return Utility.JsonResult(false, "此正文路径不存在，无法套红");
                }
                //删除旧的套红过的源数据
                B_Common_CreateDoc delDoc = new B_Common_CreateDoc();
                delDoc.Condition.Add("caseid = " + caseid);
                delDoc.Condition.Add("type = " + "SendDocQuZhan");
                delDoc.Condition.Add("docType = " + "redCover");
                delDoc = Utility.Database.QueryObject<B_Common_CreateDoc>(delDoc);
                if (delDoc != null)
                {
                    delDoc.Condition.Add("id =" + delDoc.id);
                    Utility.Database.Delete(delDoc, tran);
                }
                //存入新的套红模版路径
                B_Common_CreateDoc redCover = new B_Common_CreateDoc();
                redCover.caseid = caseid;
                redCover.type = "SendDocQuZhan";
                redCover.filename = savePath;
                redCover.createdate = DateTime.Now;
                redCover.createman = userid;
                redCover.docType = "redCover";
                Utility.Database.Insert(redCover, tran);
                //将发文的正文路径
                GetDataModel dataModel = new GetDataModel();
                dataModel.mainBodyPath = filePath;
                dataModel.redCoverPath = targetPath;
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "发送成功！", dataModel);
            }
            catch (Exception ex)
            {
                developer.RollBack();
                ComBase.Logger(ex);
                return Utility.JsonResult(false, "选择模版失败:" + ex.Message.Replace(":", " "));
            }
        }

        [DataAction("AutoTypesetting", "caseid")]
        public object AutoTypesetting(string caseid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                string wordPath = CommonFunctional.GetDocumentPathByName("Send", "FileModelDir");
                wordPath = wordPath + "发文正文模板.docx";
                string targetpath = CommonFunctional.GetDocumentPathByName("SendDocContent", "FileDir");
                targetpath = targetpath + "发文模板_" + caseid + ".docx";
                var dic = CombindMainBody(caseid, tran);
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
                ComBase.Logger(ex);
                throw (new Exception("排版失败！", ex));

            }
        }

        [DataAction("PrintDoc", "caseid", "userid")]
        public object PrintDoc(string caseid, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                string wordPath = CommonFunctional.GetDocumentPathByName("Send", "FileModelDir");
                string targetpath = CommonFunctional.GetDocumentPathByName("Send", "FileDir");
                targetpath = targetpath + caseid + ".docx";
                wordPath = wordPath + "发文审批笺.docx";
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

        /// <summary>
        /// 创建一个Word数据
        /// </summary>
        /// <param name="caseid"></param>
        /// <returns></returns>
        private Dictionary<string, Object> CreateWordSendDocData(string caseid, IDbTransaction tran)
        {
            B_OA_SendDoc_QuZhan boacd = new B_OA_SendDoc_QuZhan();
            boacd.Condition.Add("caseid = " + caseid);//设置查询条件
            boacd = Utility.Database.QueryObject<B_OA_SendDoc_QuZhan>(boacd, tran);

            FX_WorkFlowBusAct wfba = new FX_WorkFlowBusAct();
            wfba.Condition.Add("CaseID = " + caseid);//设置查询条件
            List<FX_WorkFlowBusAct> wfbaList = Utility.Database.QueryList(wfba);

            Dictionary<string, Object> dict = new Dictionary<string, Object>();
            dict.Add("title", boacd.title == null ? "" : boacd.title);//标题
            dict.Add("printCount", boacd.printCount == null ? "" : boacd.printCount);//页数
            dict.Add("zs", boacd.zs == null ? "" : boacd.zs);//主送
            dict.Add("cs", boacd.cs == null ? "" : boacd.cs);//抄送
            dict.Add("cb", boacd.cb == null ? "" : boacd.cb);//抄报

            if (boacd.sendCheckType=="1")
            {
                dict.Add("ghz", boacd.guiHuanZhan == null ? "" : boacd.guiHuanZhan);//桂环站
                dict.Add("c_ghz", "☑");//桂环站
                dict.Add("c_dtnw", "☐");//代厅拟文
                dict.Add("c_nbsx", "☐");//内部事项
                dict.Add("c_qt", "☐");//其他
            }
            else if (boacd.sendCheckType == "2")
            {
                dict.Add("dtnw", boacd.daiTingNiWen == null ? "" : boacd.daiTingNiWen);//代厅拟文
                dict.Add("c_ghz", "☐");//桂环站
                dict.Add("c_dtnw", "☑");//代厅拟文
                dict.Add("c_nbsx", "☐");//内部事项
                dict.Add("c_qt", "☐");//其他
            }
            else if (boacd.sendCheckType == "3")
            {
                dict.Add("nbsx", boacd.neiBuShiXiang == null ? "" : boacd.neiBuShiXiang);//代厅拟文
                dict.Add("c_ghz", "☐");//桂环站
                dict.Add("c_dtnw", "☐");//代厅拟文
                dict.Add("c_nbsx", "☑");//内部事项
                dict.Add("c_qt", "☐");//其他
            }
            else if (boacd.sendCheckType == "4")
            {
                dict.Add("qt", boacd.qiTa == null ? "" : boacd.qiTa);//代厅拟文
                dict.Add("c_ghz", "☐");//桂环站
                dict.Add("c_dtnw", "☐");//代厅拟文
                dict.Add("c_nbsx", "☐");//内部事项
                dict.Add("c_qt", "☑");//其他
            }



            //密级
            DataTable mjTable = CommonFunctional.GetParamItem("mjTypeDic", boacd.mj, tran);
            if (mjTable != null)
            {
                dict.Add("mj", mjTable.Rows[0]["mc"]);//密级
            }
            //紧急
            DataTable emergencyTable = CommonFunctional.GetParamItem("emergencyLevelDic", boacd.mj, tran);
            if (emergencyTable != null)
            {
                dict.Add("emergency", emergencyTable.Rows[0]["mc"]);//密级
            }

            //获取所有评阅意见
            FX_WorkFlowBusAct work = new FX_WorkFlowBusAct();
            work.Condition.Add("CaseID = " + caseid);
            work.OrderInfo = "ReceDate asc";
            List<FX_WorkFlowBusAct> listWork = Utility.Database.QueryList<FX_WorkFlowBusAct>(work, tran);
            //将所有工作流信息格式化
            List<B_OA_PrintParagragh> listPara = CommonFunctional.ChangeListToMatch(listWork);
            //承办科室负责人
            List<B_OA_PrintParagragh> cbksfzrList = new List<B_OA_PrintParagragh>();
            //办公室核稿意见
            List<B_OA_PrintParagragh> bgshgyjList = new List<B_OA_PrintParagragh>();
            //校对人
            List<B_OA_PrintParagragh> jdrList = new List<B_OA_PrintParagragh>();
            //承办科室拟稿人
            List<B_OA_PrintParagragh> cbksngrList = new List<B_OA_PrintParagragh>();
            //承办科室拟稿人
            List<B_OA_PrintParagragh> qfList = new List<B_OA_PrintParagragh>();
       
            int k = 0;
            //承办科室负责人
            for (k = 0; k < listPara.Count;k++)
            {
                if (listPara[k].ActID == "A002")
                {
                    cbksfzrList.Add(listPara[k]);
                }
            }
            //办公室核稿意见
            for (k= 0; k < listPara.Count; k++)
            {
                if (listPara[k].ActID == "A003" || listPara[k].ActID == "A004")
                {
                    bgshgyjList.Add(listPara[k]);
                }
            }
            //校对人
            for (k = 0; k < listPara.Count; k++)
            {
                if (listPara[k].ActID == "A009")
                {
                    jdrList.Add(listPara[k]);
                }
            }
            //承办科室拟稿人
            for (k = 0; k < listPara.Count; k++)
            {
                if (listPara[k].ActID == "A001")
                {
                    cbksngrList.Add(listPara[k]);
                }
            }
            //签发
            for (k = 0; k < listPara.Count; k++)
            {
                if (listPara[k].ActID == "A005")
                {
                    qfList.Add(listPara[k]);
                }
            }
            //承办科室负责人
            var imgCbksfzrList = new OpenXmlHelper.ImageTextArray[cbksfzrList.Count];
            for (k = 0; k < cbksfzrList.Count; k++)
            {
                imgCbksfzrList[k] = new OpenXmlHelper.ImageTextArray();
                imgCbksfzrList[k].Images = cbksfzrList[k].Image;
                imgCbksfzrList[k].Text = cbksfzrList[k].Text;
                imgCbksfzrList[k].Foots = cbksfzrList[k].Foots;
                imgCbksfzrList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("cbksfzr", imgCbksfzrList);

            //办公室核稿意见
            var imgBgshgyjList = new OpenXmlHelper.ImageTextArray[bgshgyjList.Count];
            for (k = 0; k < bgshgyjList.Count; k++)
            {
                imgBgshgyjList[k] = new OpenXmlHelper.ImageTextArray();
                imgBgshgyjList[k].Images = bgshgyjList[k].Image;
                imgBgshgyjList[k].Text = bgshgyjList[k].Text;
                imgBgshgyjList[k].Foots = bgshgyjList[k].Foots;
                imgBgshgyjList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("bgshgyj", imgBgshgyjList);

            //校对人
            var imgJdrList = new OpenXmlHelper.ImageTextArray[jdrList.Count];
            for (k = 0; k < jdrList.Count; k++)
            {
                imgJdrList[k] = new OpenXmlHelper.ImageTextArray();
                imgJdrList[k].Images = jdrList[k].Image;
                imgJdrList[k].Text = jdrList[k].Text;
                imgJdrList[k].Foots = jdrList[k].Foots;
                imgJdrList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("jdr", imgJdrList);

            //承办科室拟稿人
            var imgCbksngrList = new OpenXmlHelper.ImageTextArray[cbksngrList.Count];
            for (k = 0; k < cbksngrList.Count; k++)
            {
                imgCbksngrList[k] = new OpenXmlHelper.ImageTextArray();
                imgCbksngrList[k].Images = cbksngrList[k].Image;
                imgCbksngrList[k].Text = cbksngrList[k].Text;
                imgCbksngrList[k].Foots = cbksngrList[k].Foots;
                imgCbksngrList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("cbksngr", imgCbksngrList);
            //签发
            var imgQfList = new OpenXmlHelper.ImageTextArray[qfList.Count];
            for (k = 0; k < qfList.Count; k++)
            {
                imgQfList[k] = new OpenXmlHelper.ImageTextArray();
                imgQfList[k].Images = qfList[k].Image;
                imgQfList[k].Text = qfList[k].Text;
                imgQfList[k].Foots = qfList[k].Foots;
                imgQfList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("qf", imgQfList);

            return dict;
        }

        //合并正文
        private Dictionary<string, Object> CombindMainBody(string caseid, IDbTransaction tran)
        {
            B_OA_SendDoc_QuZhan sendDoc = new B_OA_SendDoc_QuZhan();
            sendDoc.Condition.Add("caseid = " + caseid);
            sendDoc = Utility.Database.QueryObject<B_OA_SendDoc_QuZhan>(sendDoc, tran);
            var title = sendDoc.title;
            var mainBody = sendDoc.mainBody;
            Dictionary<string, Object> dict = new Dictionary<string, Object>();
            dict.Add("title", title);//业务ID
            dict.Add("content", mainBody);//业务ID
            return dict;
        }

        public class GetDataModel
        {
            public B_OA_SendDoc_QuZhan sendDocBaseInfo;
            public string mainBodyPath;
            public string redCoverPath;
        }

        public override string Key
        {
            get
            {
                return "B_OA_SendDoc_QuZhanSvc";
            }
        }
    }
}
