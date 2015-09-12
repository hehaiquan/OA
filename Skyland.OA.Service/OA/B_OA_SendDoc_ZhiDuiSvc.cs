using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BizService.Common;
using IWorkFlow.Host;
using IWorkFlow.OfficeService.OpenXml;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using System.Data;
using System.Web;
using System.IO;
using Newtonsoft.Json.Linq;
using System.Drawing;
using IWorkFlow.BaseService;
using BizService;

namespace BizService.Services
{
    class B_OA_SendDoc_ZhiDuiSvc : BaseDataHandler
    {
        [DataAction("GetData", "userid", "caseId", "baid")]
        public object GetData(string userid, string caseId, string baid)
        {
            try
            {
                //只有待办箱才有设置为已读
                if (!String.IsNullOrEmpty(baid)) engineAPI.SetIsReaded(caseId, baid, userid);

                B_OA_SendDoc_ZhiDui en = new B_OA_SendDoc_ZhiDui();
                en.Condition.Add("caseid=" + caseId);
                B_OA_SendDoc_ZhiDui sendDocBaseInfo = Utility.Database.QueryObject<B_OA_SendDoc_ZhiDui>(en);
                if (sendDocBaseInfo == null)
                {
                    var baseInfo = new B_OA_SendDoc_ZhiDui();
                    baseInfo.fwrq = DateTime.Now;
                    baseInfo.dzy = ComClass.GetUserInfo(userid).CnName;
                    //baseInfo.gklx = "1";//公开类型默认为主动公开
                    sendDocBaseInfo = baseInfo;
                }
                return new
                {
                    sendDocBaseInfo = sendDocBaseInfo
                };
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("获取数据失败！", ex));
            }
        }

        [DataAction("send", "BizParams", "userid", "content")]
        public object Send(string BizParams, string userid, string content)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            SkyLandDeveloper developer = new SkyLandDeveloper(BizParams, userid, tran);
            try
            {
                SaveDataModel data = JsonConvert.DeserializeObject<SaveDataModel>(content);// new SaveDataModel();   
                string caseid = developer.caseid;
                if (String.IsNullOrEmpty(caseid))
                {
                    string unitName = data.sendDocBaseInfo.wjbt;
                    string titleType = "支队发文";
                    developer.caseName = unitName + "-" + titleType;
                    caseid = developer.Create();
                }

                if (developer.wfcase.actid == "A001")
                {
                    //当此文未草稿的时候并未生成caseid，而存的是guid，此步骤是将正文路径的caseid字段修改成caseid
                    ChangeGuidToCaseId(developer.wfcase.guid, caseid, tran);
                    //业务关联表
                    if (data.sendRelation != null)
                    {
                        data.sendRelation.caseId = caseid;
                        Utility.Database.Insert(data.sendRelation, tran);
                    }
                }

                ////发文字号的生成
                //if (developer.wfcase.actid == "A007")
                //{
                //    DocNumberRule docNumber = new DocNumberRuleSvc().CreateDocNumber("发文");
                //    data.sendDocBaseInfo.fwzh = string.Format(docNumber.gz, docNumber.nf, docNumber.dqz);
                //}

                //当发文在最后一部时候将相应内容归入文档中心的相应目录
                if (developer.wfcase.actid == "A009")
                {
                    SaveToNotice(tran, caseid, userid);
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

        public B_OA_SendDoc_ZhiDui SaveData(SaveDataModel data, IDbTransaction tran, string caseId)
        {
            StringBuilder strSql = new StringBuilder();
            if (caseId != null) data.sendDocBaseInfo.caseid = caseId;
            data.sendDocBaseInfo.Condition.Add("caseid=" + data.sendDocBaseInfo.caseid);
            B_OA_SendDoc_ZhiDui en = Utility.Database.QueryObject<B_OA_SendDoc_ZhiDui>(data.sendDocBaseInfo);
            //如果主键和id都为空，插入信息
            if (data.sendDocBaseInfo.id == null)
            {
                data.sendDocBaseInfo.sfgd = 0;
                data.sendDocBaseInfo.fwrq = DateTime.Now;
                Utility.Database.Insert(data.sendDocBaseInfo, tran);
                strSql.Clear();
                strSql.AppendFormat(@"select @@IDENTITY");
                int id = Utility.Database.QueryObject<int>(strSql.ToString(), tran);
                data.sendDocBaseInfo.id = id;
                //生成成功后修改文号表
                //CommonFunctional common = new CommonFunctional();
                //common.UpdateCodeModel("sendCode", tran);
            }
            else
            {
                Utility.Database.Update(data.sendDocBaseInfo, tran);
            }
            return data.sendDocBaseInfo;

        }
        /// <summary>
        /// 保存到文档中心和文档中心审核意见表和文章关系表中
        /// </summary>
        /// <param name="tran"></param>
        /// <param name="caseid"></param>
        /// <param name="userid"></param>
        public void SaveToNotice(IDbTransaction tran, string caseid, string userid)
        {
            StringBuilder strSql = new StringBuilder();
            string DPName = "";//部门名称
            string DPID = "";//部门ID
            string CnName = "";//归档人姓名
            string saveFileName = "";//需要存档的文件夹名称
            string dir = "";
            string UserID = "";
            dir = AppDomain.CurrentDomain.BaseDirectory;//获取应用程序跟目录
            dir = dir.Replace("\\", "/");
            strSql.Clear();
            strSql.AppendFormat(@"select * from FX_AttachMent where CaseID='{0}'", caseid);
            DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
            if (ds.Tables[0].Rows.Count > 0)
            {
                string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
                List<FX_AttachMent> list_fx = (List<FX_AttachMent>)JsonConvert.DeserializeObject(jsonData, typeof(List<FX_AttachMent>));
                //将文件复制文档中心下的相应目录
                string path = dir + "attachment/documentCenter/";
                if (Directory.Exists(path) == false)//如果不存在就创建文件夹
                {
                    Directory.CreateDirectory(path);
                }

                for (int f = 0; f < list_fx.Count(); f++)
                {
                    string path1 = "";
                    string path2 = "";
                    path1 = dir + "附件目录/" + list_fx[f].FilePath;
                    string fileName = DateTime.Now.ToString("yyyy年MM月dd日HH时mm分ss秒") + "_" + list_fx[f].FileName;
                    path2 = path + fileName;
                    //取出文件并保存到相应目录中
                    File.Copy(path1, path2, true);
                    saveFileName += "attachment/documentCenter/" + fileName;
                    if (f != (list_fx.Count() - 1))
                    {
                        saveFileName += "|";
                    }
                }
            }

            //取出用户相关信息
            var userInfo = ComClass.GetUserInfo(userid);
            DPID = userInfo.DPID;
            CnName = userInfo.CnName;
            UserID = userInfo.UserID;
            //查找部门ID
            FX_Department department = new FX_Department();
            department.Condition.Add("DPID=" + userInfo.DPID);
            FX_Department department_ad = Utility.Database.QueryList<FX_Department>(department, tran)[0];
            DPName = department_ad.DPName;
            //放入的文件类型ID
            B_OA_SendDoc sendDoc = new B_OA_SendDoc();
            sendDoc.Condition.Add("caseid=" + caseid);
            sendDoc = Utility.Database.QueryObject<B_OA_SendDoc>(sendDoc);

            //保存文档
            B_OA_Notice newNotice = new B_OA_Notice();
            //newNotice.NewsTitle = sendDoc.;//文档标题
            newNotice.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");//现在时间
            newNotice.NewsTitle = sendDoc.wjbt;
            newNotice.documentTypeId = sendDoc.fwlxId;//文档类型id
            string documentTypeName = getFileTypeNameByFileTypeId(sendDoc.fwlxId, tran);
            newNotice.documentTypeName = documentTypeName;//所选树状图名称，从根节点到子节点
            newNotice.CreateMan = CnName;//创建人
            newNotice.CreaterId = userid;//创建人
            newNotice.AttachmentName = saveFileName;//保存文件路径
            newNotice.ShareAttachment = "0";//是否共享文件
            newNotice.isSeeInDoor = false;//是否在门户中查看
            newNotice.status = "checkThrough";//审核状态
            newNotice.caseid = sendDoc.caseid;
            newNotice.publicRange = 0;//非指定人查看
            newNotice.NewsId = ComClass.GetGuid();
            newNotice.publicRange = 0;//所有人查看
            newNotice.isReadRecord = true;//查看记录
            newNotice.isTextSuggetion = true;//可以发表意见
            newNotice.ChkMId = UserID + ";";
            newNotice.ChkM = CnName + ";";
            newNotice.Chkdate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");//审核时间

            Utility.Database.Insert<B_OA_Notice>(newNotice, tran);

            //插入审核记录
            //取出审核人ID数组
            string[] checkManId = newNotice.ChkMId.Split(';');
            //插入审核表,用于文章修改后，或者新生成的文章审核
            for (int i = 0; i < checkManId.Length - 1; i++)
            {
                B_OA_Notice_Addvice addvice = new B_OA_Notice_Addvice();
                var user_check = ComClass.GetUserInfo(checkManId[i]);
                //审核人ID
                addvice.chkId = checkManId[i];
                //审核人姓名
                addvice.chkName = user_check.CnName;
                //审核状态为未审核
                addvice.statuType = "checkThrough";
                //审核状态名称
                addvice.statusName = "审核通过";
                //文章表外键
                addvice.noticeId = newNotice.NewsId;
                Utility.Database.Insert(addvice, tran);
            }

            //插入文章关系表
            B_OA_Notice_FileType_R fileType_r = new B_OA_Notice_FileType_R();
            fileType_r.noticeId = newNotice.NewsId;
            fileType_r.fileTypeId = sendDoc.fwlxId;
            Utility.Database.Insert(fileType_r, tran);
            //sendDoc.fwlxId;
        }

        public string fileTypeName = "";
        public string getFileTypeNameByFileTypeId(string fileTypeId, IDbTransaction tran)
        {
            B_OA_FileType fileType = new B_OA_FileType();
            fileType.Condition.Add("FileTypeId = " + fileTypeId);
            fileType = Utility.Database.QueryObject<B_OA_FileType>(fileType);
            fileTypeName = fileType.FileTypeName + ";" + fileTypeName;
            if (fileType.ParentId == "0")
            {
                return fileTypeName;
            }
            else
            {
                return getFileTypeNameByFileTypeId(fileType.ParentId, tran);
            }
        }

        public void ChangeGuidToCaseId(string guid, string caseid, IDbTransaction tran)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.AppendFormat("select * from B_Common_CreateDoc where caseid = '{0}'", guid);
            DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString());
            if (ds.Tables[0].Rows.Count > 0)
            {
                string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
                List<B_Common_CreateDoc> list = (List<B_Common_CreateDoc>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_Common_CreateDoc>));
                for (int i = 0; i < list.Count; i++)
                {
                    B_Common_CreateDoc createDoc = new B_Common_CreateDoc();
                    createDoc = list[i];
                    createDoc.caseid = caseid;
                    createDoc.Condition.Add("id = " + createDoc.id);
                    Utility.Database.Update(createDoc, tran);
                }
            }
        }


        [DataAction("PrintSendDoc", "caseid", "fwzh", "userid")]
        public string PrintSendDoc(string caseid, string fwzh, string userid)
        {
            //SkyLandDeveloper developer = SkyLandDeveloper.FromJson("{}");
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                if (string.IsNullOrWhiteSpace(caseid)) return Utility.JsonResult(false, "保存业务后才能打印！");
                string rootPath = HttpContext.Current.Server.MapPath("/");
                DateTime dateTime = DateTime.Now;
                var strYear = dateTime.ToLongDateString();
                var strHour = dateTime.Hour.ToString();
                var strMinute = dateTime.Minute.ToString();
                var strSecond = dateTime.Second.ToString();

                string wordPath = rootPath + "officeFileModel\\SendZhiDui\\发文模板.docx";
                if (!Directory.Exists(rootPath + "officeFile/SendDocZhiDui"))//若文件夹不存在则新建文件夹  
                {
                    Directory.CreateDirectory(rootPath + "officeFile/SendDocZhiDui"); //新建文件夹  
                }
                string targetpath = rootPath + "officeFile\\SendDocZhiDui\\发文模板_" + caseid; // +"_" + strYear + " " + strHour + "时" + strMinute + "分" + strSecond + "秒";

                targetpath = targetpath.Replace("\\", "/");
                wordPath = wordPath.Replace("\\", "/");
                targetpath += ".docx";
                var dic = CreateWordSendDocData(caseid, tran, fwzh);
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
                return Utility.JsonResult(true, "发送成功！", "{wordPath:\"" + targetpath + "\"}");
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);
                return Utility.JsonResult(false, "打印失败:" + ex.Message.Replace(":", " "));
            }
        }


        /// <summary>
        /// 创建一个Word数据
        /// </summary>
        /// <param name="caseid"></param>
        /// <returns></returns>
        private Dictionary<string, Object> CreateWordSendDocData(string caseid, IDbTransaction tran, string fwzh)
        {
            B_OA_SendDoc_ZhiDui boacd = new B_OA_SendDoc_ZhiDui();
            boacd.Condition.Add("caseid = " + caseid);//设置查询条件
            boacd = Utility.Database.QueryObject<B_OA_SendDoc_ZhiDui>(boacd);

            FX_WorkFlowBusAct wfba = new FX_WorkFlowBusAct();
            wfba.Condition.Add("CaseID = " + caseid);//设置查询条件
            List<FX_WorkFlowBusAct> wfbaList = Utility.Database.QueryList(wfba);

            var boacdmjsql = @"select a.csz as id, a.mc as mc from Para_BizTypeItem a , Para_BizTypeDictionary b 
                            where a.flid = b.id and b.lx = 'mjTypeDic' and a.csz =" + boacd.mj;
            DataSet boacdmjds = Utility.Database.ExcuteDataSet(boacdmjsql);


            // 发文
            Dictionary<string, Object> dict = new Dictionary<string, Object>();
            dict.Add("fwzh", fwzh);

            dict.Add("fwlx", boacd.fwlx == "" ? "" : boacd.fwlx);//发文类型
            dict.Add("mj", boacdmjds.Tables.Count > 0 ? (boacdmjds.Tables[0].Rows.Count > 0 ? boacdmjds.Tables[0].Rows[0]["mc"] : "") : "");  //密级 //处理显示名称
            dict.Add("ys", boacd.ys == "" ? "" : boacd.ys);//印数

            DataSet gkcdgkcdds = new DataSet();
            var gkcdgkcdsql = "";
            if (boacd.gkcd != null)
            {
                gkcdgkcdsql = @"select a.csz as id, a.mc as mc from Para_BizTypeItem a , Para_BizTypeDictionary b 
                            where a.flid = b.id and b.lx = 'gkcdTypeDic' and a.csz =" + boacd.gkcd;
                gkcdgkcdds = Utility.Database.ExcuteDataSet(gkcdgkcdsql);
                dict.Add("gkcd", gkcdgkcdds.Tables.Count > 0 ? (gkcdgkcdds.Tables[0].Rows.Count > 0 ? gkcdgkcdds.Tables[0].Rows[0]["mc"] : "") : "");  //公开程度
            }
            else
            {
                dict.Add("gkcd", "");  //公开程度
            }
            dict.Add("wjbt", boacd.wjbt == "" ? "" : boacd.wjbt);//文件标题
            dict.Add("zs", boacd.zs == "" ? "" : boacd.zs);//主送
            dict.Add("cb", boacd.cb == "" ? "" : boacd.cb);//抄报
            dict.Add("cs", boacd.cs == "" ? "" : boacd.cs);//抄送
            dict.Add("ztc", boacd.ztc == "" ? "" : boacd.ztc);//    主题词
            dict.Add("zbbm", boacd.zbbm == "" ? "" : boacd.zbbm);//主办部门
            dict.Add("jd", boacd.jd == "" ? "" : boacd.jd);//校对
            dict.Add("dzy", boacd.dzy == "" ? "" : boacd.dzy);// 打字员
            dict.Add("bz", boacd.bz == "" ? "" : boacd.bz);//备注
            dict.Add("yx", boacd.yx == "" ? "" : boacd.yx);//一校
            dict.Add("ex", boacd.ex == "" ? "" : boacd.ex);//二校
            string gklx = boacd.gklx;//公开类型
            switch (gklx)
            {
                case "1":
                    dict.Add("gklx1", "√");
                    break;
                case "2":
                    dict.Add("gklx2", "√");
                    break;
                case "3":
                    dict.Add("gklx3", "√");
                    break;
            }
            dict.Add("printTime", DateTime.Now.ToLongDateString());// 打印日期

            DataTable dataTable = CommonFunctional.GetUserNameAndDepartNameByActId(caseid, "A002", tran);
            if (dataTable.Rows.Count > 0)
            {
                string name = dataTable.Rows[0][1] + " " + dataTable.Rows[0][0];
                dict.Add("ngr", name);// 拟稿人
            }
            #region
            //获取所有评阅意见
            FX_WorkFlowBusAct work = new FX_WorkFlowBusAct();
            work.Condition.Add("CaseID = " + caseid);
            work.OrderInfo = "ReceDate asc";
            List<FX_WorkFlowBusAct> listWork = Utility.Database.QueryList<FX_WorkFlowBusAct>(work, tran);
            //将所有工作流信息格式化
            List<B_OA_PrintParagragh> listPara = CommonFunctional.ChangeListToMatch(listWork);
            List<B_OA_PrintParagragh> ngbmfzrhgList = new List<B_OA_PrintParagragh>();
            List<B_OA_PrintParagragh> bgshgList = new List<B_OA_PrintParagragh>();
            List<B_OA_PrintParagragh> fgldshList = new List<B_OA_PrintParagragh>();
            List<B_OA_PrintParagragh> qfList = new List<B_OA_PrintParagragh>();

            for (int i = 0; i < listPara.Count; i++)
            {
                // 拟稿部门负责人核稿
                if (listPara[i].ActID == "A002")
                {
                    ngbmfzrhgList.Add(listPara[i]);
                } //分管领导审核意见
                else if (listPara[i].ActID == "A003")
                {
                    fgldshList.Add(listPara[i]);
                }    //办公室核稿
                else if (listPara[i].ActID == "A004")
                {
                    bgshgList.Add(listPara[i]);
                }//签发
                else if (listPara[i].ActID == "A005")
                {
                    qfList.Add(listPara[i]);
                }
            }

            int k = 0;
            //拟稿部门负责人
            var imgNgbmfzrhgList = new OpenXmlHelper.ImageTextArray[ngbmfzrhgList.Count];
            for (k = 0; k < ngbmfzrhgList.Count; k++)
            {
                imgNgbmfzrhgList[k] = new OpenXmlHelper.ImageTextArray();
                imgNgbmfzrhgList[k].Images = ngbmfzrhgList[k].Image;
                imgNgbmfzrhgList[k].Text = ngbmfzrhgList[k].Text;
                imgNgbmfzrhgList[k].Foots = ngbmfzrhgList[k].Foots;
                imgNgbmfzrhgList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("ngbmfzrhg", imgNgbmfzrhgList);

            //分管领导审核意见
            var imgFgldshList = new OpenXmlHelper.ImageTextArray[fgldshList.Count];
            for (k = 0; k < fgldshList.Count; k++)
            {
                imgFgldshList[k] = new OpenXmlHelper.ImageTextArray();
                imgFgldshList[k].Images = fgldshList[k].Image;
                imgFgldshList[k].Text = fgldshList[k].Text;
                imgFgldshList[k].Foots = fgldshList[k].Foots;
                imgFgldshList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("fgldsh", imgFgldshList);

            //办公室核稿
            var imgBgshgList = new OpenXmlHelper.ImageTextArray[bgshgList.Count];
            for (k = 0; k < fgldshList.Count; k++)
            {
                imgBgshgList[k] = new OpenXmlHelper.ImageTextArray();
                imgBgshgList[k].Images = bgshgList[k].Image;
                imgBgshgList[k].Text = bgshgList[k].Text;
                imgBgshgList[k].Foots = bgshgList[k].Foots;
                imgBgshgList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("bgshg", imgBgshgList);
            //签发
            var imgQfList = new OpenXmlHelper.ImageTextArray[qfList.Count];
            for (k = 0; k < fgldshList.Count; k++)
            {
                imgQfList[k] = new OpenXmlHelper.ImageTextArray();
                imgQfList[k].Images = qfList[k].Image;
                imgQfList[k].Text = qfList[k].Text;
                imgQfList[k].Foots = qfList[k].Foots;
                imgQfList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("qf", imgQfList);
            #endregion
            return dict;
        }


        // 打印发文正文
        [DataAction("PrintSendDocContent", "content", "userid")]
        public string PrintSendDocContent(string content, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            SkyLandDeveloper developer = new SkyLandDeveloper("{}", userid, tran);
            try
            {
                string rootPath = HttpContext.Current.Server.MapPath("/");
                rootPath = rootPath.Replace("\\", "/");
                dynamic jdata = JValue.Parse(content);
                string fwrqString = jdata["fwrqString"];//fwrqString
                string printType = jdata["printType"];//printType
                string caseid = jdata["caseid"];
                string fwzh = jdata["fwzh"];
                string strFileName = "发文正文_";
                strFileName += DateTime.Now.ToString("yyyyMMddHHmmss") + "_temporary";
                strFileName += ".docx";
                string targetpath = rootPath + "officeFile/SendDocContent/" + strFileName;
                string savePath = "officeFile/SendDocContent/" + strFileName;
                string realFileName = "";
                switch (printType)
                {
                    case "1":
                        realFileName = "officeFileModel/SendZhiDui/南宁市环境监察支队文件中红头.docx";
                        break;
                    case "2":
                        realFileName = "officeFileModel/SendZhiDui/南宁市环境监察支队小红头.docx";
                        break;
                }
                //选择模版，将模版复制出一份
                //通过caseid查找发文，并将字号贴上
                B_OA_SendDoc_ZhiDui sendDoc = new B_OA_SendDoc_ZhiDui();
                sendDoc.Condition.Add("caseid=" + caseid);
                sendDoc = Utility.Database.QueryObject(sendDoc, tran);
                Dictionary<string, Object> dict = new Dictionary<string, Object>();
                dict.Add("fwzh", fwzh == "" ? "" : fwzh);//发文字号
                realFileName = rootPath + realFileName;
                //将字号赋到文档的相应位置
                IWorkFlow.OfficeService.IWorkFlowOfficeHandler.ProduceWord2007UP(realFileName, targetpath, dict);
                //获取正文的路径
                B_Common_CreateDoc createDoc = new B_Common_CreateDoc();
                createDoc.Condition.Add("caseid=" + caseid);
                createDoc.Condition.Add("docType=" + "mainBody");
                createDoc = Utility.Database.QueryObject(createDoc, tran);
                if (createDoc == null)
                {
                    return Utility.JsonResult(false, "选择模版失败:此发文未生成过正文，请编辑正文后再选择模版！");
                }
                string fileName = createDoc.filename.Replace("#", "/");
                string filePath = rootPath + fileName;
                if (!File.Exists(filePath))
                {
                    developer.RollBack();
                    return Utility.JsonResult(false, "此模版路径不存在，无法套红");
                }
                //删除旧的套红过的源数据
                B_Common_CreateDoc delDoc = new B_Common_CreateDoc();
                delDoc.Condition.Add("caseid = " + caseid);
                delDoc.Condition.Add("type = " + "SendDocZhiDui");
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
                redCover.type = "SendDocZhiDui";
                redCover.filename = savePath.Replace("/", "#");
                redCover.createdate = DateTime.Now;
                redCover.createman = userid;
                redCover.docType = "redCover";
                Utility.Database.Insert(redCover, tran);
                //将发文的正文路径
                GetDataModel dataModel = new GetDataModel();
                dataModel.mainBodyPath = rootPath + createDoc.filename.Replace("#", "/");
                dataModel.redCoverPath = rootPath + redCover.filename.Replace("#", "/");
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

        [DataAction("GetSendDocTree", "userid")]
        public object GetSendDocTree(string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            try
            {

                DataTable dataTable = CommonFunctional.GetFileTypeByFlag("3",tran);
                B_OA_FileType fileType = new B_OA_FileType();
                return new
                {
                    dataTable = dataTable,
                    fileType = fileType
                };
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("获取数据失败！", ex));
            }
        }

        [DataAction("SaveFileType", "content", "userid")]
        public object SaveFileType(string content, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_FileType fileType = JsonConvert.DeserializeObject<B_OA_FileType>(content);
                if (string.IsNullOrEmpty(fileType.FileTypeId))
                {
                    B_OA_FileType p_type = new B_OA_FileType();
                    p_type.Condition.Add("flagType = " + "3");
                    p_type = Utility.Database.QueryObject<B_OA_FileType>(p_type, tran);
                    fileType.FileTypeId = ComClass.GetGuid();
                    fileType.ParentId = p_type.FileTypeId;
                    fileType.CodePath = p_type.CodePath + "/" + fileType.FileTypeId;
                    fileType.isParent = false;
                    fileType.OrderBy = 0;
                    fileType.CreateDate = DateTime.Now.ToString();
                    fileType.canDelete = false;
                    Utility.Database.Insert(fileType, tran);
                }
                else
                {
                    B_OA_FileType fileType_Edit = new B_OA_FileType();
                    fileType_Edit.Condition.Add("FileTypeId =" + fileType.FileTypeId);
                    fileType_Edit = Utility.Database.QueryObject<B_OA_FileType>(fileType_Edit, tran);
                    fileType.FileTypeName = fileType.FileTypeName;
                    Utility.Database.Insert(fileType_Edit, tran);
                }

                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除成功！");

            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("获取数据失败！", ex));
            }
        }

        [DataAction("DeleteFileType", "content", "userid")]
        public object DeleteFileType(string content,string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_FileType fileType = JsonConvert.DeserializeObject<B_OA_FileType>(content);
                B_OA_SendDoc_ZhiDui sendDoc = new B_OA_SendDoc_ZhiDui();
                sendDoc.Condition.Add("fwlxId=" + fileType.FileTypeId);
                List<B_OA_SendDoc_ZhiDui> listSend = Utility.Database.QueryList<B_OA_SendDoc_ZhiDui>(sendDoc, tran);
                if (listSend.Count > 0)
                {
                    throw (new Exception("删除失败！此文件类别下还包含有其它发文，无法删除！"));
                }
                else
                {
                    fileType.Condition.Add("FileTypeId =" + fileType.FileTypeId);
                    Utility.Database.Delete(fileType, tran);
                }
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除成功！");

            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("获取数据失败！", ex));
            }
        }

        public class GetDataModel
        {
            public B_OA_SendDoc_ZhiDui sendDocBaseInfo;
            public B_OA_Organization organization;
            public List<B_OA_Organization> list_Organization;
            public List<FX_WorkFlowBusAct> listWork;
            public DataTable listSightrue;
            public List<FX_AttachMent> listAttachment;
            public DataTable dataTable;
            public string mainBodyPath;//正文路径
            public string redCoverPath;//套红后的路径
            public List<B_OA_Supervision> listSupervision;//督察督办业务

        }

        public override string Key
        {
            get
            {
                return "B_OA_SendDoc_ZhiDuiSvc";
            }
        }

        public class SaveDataModel
        {
            public B_OA_SendDoc_ZhiDui sendDocBaseInfo;
            public B_OA_SendDoc_R sendRelation;//业务关系表
        }
    }
}
