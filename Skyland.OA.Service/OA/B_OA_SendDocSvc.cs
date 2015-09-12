using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.AccessControl;
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
    class B_OA_SendDocSvc : BaseDataHandler
    {
        [DataAction("GetData", "userid", "caseId", "baid")]
        public object GetData(string userid, string caseId, string baid)
        {
            try
            {
                //只有待办箱才有设置为已读
                if (!String.IsNullOrEmpty(baid)) engineAPI.SetIsReaded(caseId, baid, userid);

                GetDataModel data = new GetDataModel();
                B_OA_SendDoc en = new B_OA_SendDoc();
                en.Condition.Add("caseid=" + caseId);
                data.sendDocBaseInfo = Utility.Database.QueryObject<B_OA_SendDoc>(en);
                if (data.sendDocBaseInfo == null)
                {
                    var baseInfo = new B_OA_SendDoc();
                    baseInfo.fwrq = DateTime.Now;
                    baseInfo.dzy = ComClass.GetUserInfo(userid).CnName;
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


        public B_OA_SendDoc SaveData(SaveDataModel data, IDbTransaction tran, string caseId)
        {
            StringBuilder strSql = new StringBuilder();
            if (caseId != null) data.sendDocBaseInfo.caseid = caseId;
            data.sendDocBaseInfo.Condition.Add("caseid=" + data.sendDocBaseInfo.caseid);
            B_OA_SendDoc en = Utility.Database.QueryObject<B_OA_SendDoc>(data.sendDocBaseInfo);
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
        /// 点击正文模版
        /// </summary>
        /// <param name="BizParams">业务数据</param>
        /// <param name="content">数据</param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("CreateMainBody", "content", "guid", "caseid", "userid", "type","actId")]
        public string CreateMainBody(string content, string guid, string caseid, string userid, string type,string actId)
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
                dataModel.mainBodyPath = path;
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "发送成功！", dataModel);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("读取正文模版失败！", ex));
            }
        }

        public void SetCaseName(SaveDataModel data, SkyLandDeveloper developer)
        {
            try
            {
                string unitName = data.sendDocBaseInfo.wjbt;
                string titleType = "发文";
                developer.caseName = unitName + "-" + titleType;
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
            }
        }

        [DataAction("send", "BizParams", "userid", "content")]
        public string Send(string BizParams, string userid, string content)
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
                    string titleType = "发文";
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
                        realFileName = "南宁市“美丽南宁 清洁水源”专项活动领导小组文件中红头.docx";
                        break;
                    case "2":
                        realFileName = "南宁市“美丽南宁 清洁水源”专项活动领导小组小红头.docx";
                        break;
                    case "3":
                        realFileName = "南宁市规划环境影响评价工作领导小组办公室文件红头.docx";
                        break;
                    case "4":
                        realFileName = "南宁市环保专项行动领导小组办公室上报红头文件.docx";
                        break;
                    case "5":
                        realFileName = "南宁市环保专项行动领导小组办公室文件红头.docx";
                        break;
                    case "6":
                        realFileName = "南宁市环保专项行动领导小组办公室小红头.docx";
                        break;
                    case "7":
                        realFileName = "南宁市环境保护局上报红头文件.docx";
                        break;
                    case "8":
                        realFileName = "南宁市环境保护局小红头.docx";
                        break;
                    case "9":
                        realFileName = "南宁市环境保护局中红头.docx";
                        break;
                    case "10":
                        realFileName = "南宁市环境保护委员会办公室文件红头（新）.docx";
                        break;
                    case "11":
                        realFileName = "南宁市环境保护委员会办公室文件上报红头.docx";
                        break;
                    case "12":
                        realFileName = "南宁市环境保护委员会办公室小红头.docx";
                        break;
                    case "14":
                        realFileName = "中共南宁市环境保护局党组上报红头.docx";
                        break;
                }
                string modelPath = CommonFunctional.GetDocumentPathByName("Send", "FileModelDir");

                //选择模版，将模版复制出一份
                //通过caseid查找发文，并将字号贴上
                B_OA_SendDoc sendDoc = new B_OA_SendDoc();
                sendDoc.Condition.Add("caseid=" + caseid);
                sendDoc = Utility.Database.QueryObject(sendDoc, tran);
                string fwzh = sendDoc.fwzh;
                Dictionary<string, Object> dict = new Dictionary<string, Object>();
                dict.Add("fwzh", fwzh == "" ? "" : fwzh);//发文字号
                realFileName = modelPath + realFileName;
                //将字号赋到文档的相应位置
                IWorkFlow.OfficeService.IWorkFlowOfficeHandler.ProduceWord2007UP(realFileName,targetPath, dict);
                

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
                delDoc.Condition.Add("type = " + "SendDoc");
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
                redCover.type = "SendDoc";
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
        /// <summary>
        /// 发文归档
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="documentType">收发文类型</param>
        /// <returns></returns>
        [DataAction("FilePlaceS", "caseid", "title", "userid")]
        public string FilePlaceS(string caseid, string title, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            string DPName = "";//部门名称
            string DPID = "";//部门ID
            string CnName = "";//归档人姓名
            string AttachmentType = "";//归档文件夹ID
            string saveFileName = "";//需要存档的文件夹名称
            string dir = "";
            string UserID = "";
            try
            {
                dir = AppDomain.CurrentDomain.BaseDirectory;//获取应用程序跟目录
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat("select * from FX_AttachMent where CaseID='{0}' and FileName like '归档_%'", caseid);
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
                List<FX_AttachMent> list_fx = (List<FX_AttachMent>)JsonConvert.DeserializeObject(jsonData, typeof(List<FX_AttachMent>));
                if (list_fx.Count == 0)
                {
                    return Utility.JsonResult(false, "没有归档文件，请上传归档文件");
                }
                if (list_fx.Count > 1)
                {
                    return Utility.JsonResult(false, "该文有两份归档文件，无法归档");
                }
                saveFileName = DateTime.Now.ToString("yyyy年MM月dd日 HH时mm分ss秒") + list_fx[0].FileName;
                //取出部门id
                var userInfo = ComClass.GetUserInfo(userid);
                DPID = userInfo.DPID;
                CnName = userInfo.CnName;
                UserID = userInfo.UserID;
                //查找部门ID
                FX_Department department = new FX_Department();
                department.Condition.Add("DPID=" + userInfo.DPID);
                FX_Department department_ad = Utility.Database.QueryList<FX_Department>(department, tran)[0];
                DPName = department_ad.DPName;

                //归档文件夹ID
                B_OA_FileType fileType = new B_OA_FileType();
                fileType.Condition.Add("FileTypeName=" + "发文归档");
                List<B_OA_FileType> listFileType = Utility.Database.QueryList<B_OA_FileType>(fileType, tran);
                if (listFileType.Count <= 0)
                {
                    return Utility.JsonResult(false, "文档中心分类中未有“发文归档”文档，请联系管理员添加");
                }
                B_OA_FileType fileType_ad = listFileType[0];
                AttachmentType = fileType_ad.FileTypeId;

                //保存文档
                B_OA_Notice newNotice = new B_OA_Notice();
                newNotice.NewsTitle = title;//文档标题
                newNotice.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");//现在时间
                newNotice.documentTypeId = AttachmentType;//文档类型id
                newNotice.CreateMan = CnName; //创建人
                newNotice.CreaterId = userid;//创建人ID
                newNotice.AttachmentName = "attachment/documentCenter/" + saveFileName;//保存文件路径
                newNotice.ShareAttachment = "0";//是否共享文件
                newNotice.Chk = "0";//是否已经审核
                newNotice.ChkM = CnName + ";";//审核人
                newNotice.Chkdate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");//审核时间
                newNotice.documentTypeName = "办公室;收发文归档;发文归档;";//文件文档分类名
                newNotice.NewsId = ComClass.GetGuid();
                newNotice.publicRange = 0;//所有人查看
                newNotice.isReadRecord = true;//查看记录
                newNotice.isTextSuggetion = true;//可以发表意见
                newNotice.status = "waitCheck";//审核状态待审核
                newNotice.ChkMId = UserID + ";";

                string path = dir + "attachment\\documentCenter\\";
                if (Directory.Exists(path) == false)//如果不存在就创建文件夹
                {
                    Directory.CreateDirectory(path);
                }
                //取出文件并保存到相应目录中
                File.Copy(dir + "附件目录\\" + list_fx[0].FilePath, path + saveFileName, true);

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
                    addvice.statuType = "waitcheck";
                    //审核状态名称
                    addvice.statusName = "待审核";
                    //文章表外键
                    addvice.noticeId = newNotice.NewsId;
                    Utility.Database.Insert(addvice, tran);
                }


                //插入文件夹附件表
                //B_OA_FileList newFileList = new B_OA_FileList();
                //newFileList.NewsId = ComClass.GetGuid();
                //newFileList.FileName = saveFileName;
                //newFileList.RelativePath = "attachment/fileDocument/" + saveFileName;
                //string a = dir.Replace("\\", "/");
                //newFileList.AbsolutePath = a + saveFileName;
                //newFileList.Extension = saveFileName.Split('.')[1];
                //newFileList.FileSize = 0;
                //newFileList.BeforeFileName = list_fx[0].FileName;
                //newFileList.Dept = DPID;
                //Utility.Database.Insert<B_OA_FileList>(newFileList, tran);

                //修改收文的归档状态
                B_OA_SendDoc sendDoc = new B_OA_SendDoc();
                sendDoc.Condition.Add("caseid=" + caseid);
                B_OA_SendDoc sendDoc_ad = Utility.Database.QueryList<B_OA_SendDoc>(sendDoc, tran)[0];
                sendDoc_ad.sfgd = 1;//修改归档状态为已归档
                Utility.Database.Update(sendDoc_ad, tran);

                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "归档成功,此文档上传的归档附件可在文档中心的“办公室》收发文归档》发文归档”文件夹中看到");
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }
        /*
        /// <summary>
        /// 创建一个Word数据
        /// </summary>
        /// <param name="caseid"></param>
        /// <returns></returns>
        private Dictionary<string, Object> CreateWordSendDocContentData(string caseid)
        {
            B_OA_SendDoc boacd = new B_OA_SendDoc();
            boacd.Condition.Add("caseid = " + caseid);//设置查询条件
            boacd = Utility.Database.QueryObject<B_OA_SendDoc>(boacd);

            // 发文正文
            Dictionary<string, Object> dict = new Dictionary<string, Object>();
            dict.Add("printTime", DateTime.Now.ToString("yyyy 年 MM 月 dd 日"));// 发文  

            return dict;
        }
        */
        /// <summary>
        /// 自动生成发文文号
        /// </summary>
        /// <param name="type"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("CreateSendNo", "codeType", "userid")]
        public string CreateSendNo(string codeType, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                string code = CommonFunctional.getCommonCode(codeType, tran).code;
                int i = int.Parse(code);
                code = i.ToString("000000");
                code = "[" + DateTime.Now.Year + "]" + code;
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "", code);
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }


        [DataAction("GetQF", "caseid", "userid")]
        public string GetQF(string caseid, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            string qf = "";
            try
            {
                strSql.AppendFormat("select qf from B_OA_SendDoc where caseid = '{0}'", caseid);
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                qf = ds.Tables[0].Rows[0][0].ToString();
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "", qf);
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

        #region 生成发文
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

                string wordPath = rootPath + "officeFileModel\\Send\\发文模板.docx";
                if (!Directory.Exists(rootPath + "officeFile/SendDoc"))//若文件夹不存在则新建文件夹  
                {
                    Directory.CreateDirectory(rootPath + "officeFile/SendDoc"); //新建文件夹  
                }
                string targetpath = rootPath + "officeFile\\SendDoc\\发文模板_" + caseid; // +"_" + strYear + " " + strHour + "时" + strMinute + "分" + strSecond + "秒";

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
            B_OA_SendDoc boacd = new B_OA_SendDoc();
            boacd.Condition.Add("caseid = " + caseid);//设置查询条件
            boacd = Utility.Database.QueryObject<B_OA_SendDoc>(boacd);

            FX_WorkFlowBusAct wfba = new FX_WorkFlowBusAct();
            wfba.Condition.Add("CaseID = " + caseid);//设置查询条件
            List<FX_WorkFlowBusAct> wfbaList = Utility.Database.QueryList(wfba);

            var boacdmjsql = @"select a.csz as id, a.mc as mc from Para_BizTypeItem a , Para_BizTypeDictionary b 
                            where a.flid = b.id and b.lx = 'mjTypeDic' and a.csz =" + boacd.mj;
            DataSet boacdmjds = Utility.Database.ExcuteDataSet(boacdmjsql);


            // 发文
            Dictionary<string, Object> dict = new Dictionary<string, Object>();
            dict.Add("caseid", boacd.caseid == "" ? "" : boacd.caseid);//业务ID
            dict.Add("fwrq", boacd.fwrq == null ? "" : Convert.ToDateTime(boacd.fwrq).ToString("yyyy-MM-dd"));//发文日期
            dict.Add("wjbh", boacd.wjbh == "" ? "" : boacd.wjbh);//文件编号

            dict.Add("fwzh", fwzh);

            dict.Add("fwlx", boacd.fwlx == "" ? "" : boacd.fwlx);//发文类型
            dict.Add("mj", boacdmjds.Tables.Count > 0 ? (boacdmjds.Tables[0].Rows.Count > 0 ? boacdmjds.Tables[0].Rows[0]["mc"] : "") : "");  //密级 //处理显示名称
            dict.Add("ys", boacd.ys == "" ? "" : boacd.ys);//印数

            //公开程度
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
                dict.Add("gkcd", "");
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
            // 打印日期
            dict.Add("printTime", DateTime.Now.ToLongDateString());

            DataTable dataTable = CommonFunctional.GetUserNameAndDepartNameByActId(caseid, "A002", tran);
            if (dataTable.Rows.Count > 0)
            {
                string name = dataTable.Rows[0][1] + " " + dataTable.Rows[0][0];
                dict.Add("ngr", name);// 拟稿人
            }
            //评阅意见的插入
            #region
            //获取所有评阅意见
            FX_WorkFlowBusAct work = new FX_WorkFlowBusAct();
            work.Condition.Add("CaseID = " + caseid);
            work.OrderInfo = "ReceDate asc";
             List<FX_WorkFlowBusAct> listWork = Utility.Database.QueryList<FX_WorkFlowBusAct>(work, tran);
            //将所有工作流信息格式化
             List<B_OA_PrintParagragh> listPara = CommonFunctional.ChangeListToMatch(listWork);
             List<B_OA_PrintParagragh> ngbmfzrhgList = new List<B_OA_PrintParagragh>();
             List<B_OA_PrintParagragh> hbdwyjList = new List<B_OA_PrintParagragh>();
             List<B_OA_PrintParagragh> fgldshList = new List<B_OA_PrintParagragh>();
             List<B_OA_PrintParagragh> jbgsfzrhgList = new List<B_OA_PrintParagragh>();
             List<B_OA_PrintParagragh> qfList = new List<B_OA_PrintParagragh>();
            //领导批示
            for (int i = 0; i < listPara.Count; i++)
            {
                // 拟稿部门负责人核稿
                if (listPara[i].ActID == "A002")
                {
                    ngbmfzrhgList.Add(listPara[i]);
                }
                //局办公室负责人核稿
                else if (listPara[i].ActID == "A004")
                {
                    jbgsfzrhgList.Add(listPara[i]);
                }
                // 分管领导审核
                else if (listPara[i].ActID == "A005")
                {
                    fgldshList.Add(listPara[i]);
                }
                //会办单位意见
                else if (listPara[i].ActID == "A010")
                {
                    hbdwyjList.Add(listPara[i]);
                }  //会办单位意见
                else if (listPara[i].ActID == "A006")
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

            //局办公室负责人核稿
            var imgJbgsfzrhgList = new OpenXmlHelper.ImageTextArray[jbgsfzrhgList.Count];
            for (k = 0; k < jbgsfzrhgList.Count; k++)
            {
                imgJbgsfzrhgList[k] = new OpenXmlHelper.ImageTextArray();
                imgJbgsfzrhgList[k].Images = jbgsfzrhgList[k].Image;
                imgJbgsfzrhgList[k].Text = jbgsfzrhgList[k].Text;
                imgJbgsfzrhgList[k].Foots = jbgsfzrhgList[k].Foots;
                imgJbgsfzrhgList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("jbgsfzrhg", imgJbgsfzrhgList);

            //分管领导审核
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
            //会办单位意见
            var imgHbdwyjList = new OpenXmlHelper.ImageTextArray[hbdwyjList.Count];
            for (k = 0; k < hbdwyjList.Count; k++)
            {
                imgHbdwyjList[k] = new OpenXmlHelper.ImageTextArray();
                imgHbdwyjList[k].Images = hbdwyjList[k].Image;
                imgHbdwyjList[k].Text = hbdwyjList[k].Text;
                imgHbdwyjList[k].Foots = hbdwyjList[k].Foots;
                imgHbdwyjList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("hbdwyj", imgHbdwyjList);
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
            #endregion


            //读取签发图片
            StringBuilder strSql = new StringBuilder();
            strSql.AppendFormat(@"
                                   select s.*,u.CnName from B_OA_Sighture as s
                                          LEFT JOIN FX_UserInfo as u on s.userid = u.UserID
                                   where s.caseid='{0}' and s.tableName='{1}' and s.columnName='{2}' and s.type='{3}'",
                                   caseid, "SendDoc", "qf", "0");
            DataSet sightureDs = Utility.Database.ExcuteDataSet(strSql.ToString());
            string jsonData = JsonConvert.SerializeObject(sightureDs.Tables[0]);
            List<B_OA_Sighture> listSighture = (List<B_OA_Sighture>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_Sighture>));
            if (listSighture.Count > 0)
            {
                B_OA_Sighture sighture = new B_OA_Sighture();
                sighture = listSighture[0];
                string rootPath = HttpContext.Current.Server.MapPath("/");
                rootPath = rootPath.Replace("\\", "/");
                string path = rootPath + sighture.path;
                if (File.Exists(path))
                {
                    dict.Add("qf", System.Drawing.Image.FromFile(path));//备注
                }
            }
            return dict;
        }


     

        /// <summary>
        /// 查找审批意见
        /// </summary>
        /// <param name="caseId"></param>
        /// <returns></returns>
        [DataAction("GetWorkFlowCaseByCaseId", "caseId")]
        public string GetWorkFlowCaseByCaseId(string caseId)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            GetDataModel dataModel = new GetDataModel();
            StringBuilder strSql = new StringBuilder();
            try
            {
                FX_WorkFlowBusAct work = new FX_WorkFlowBusAct();
                work.Condition.Add("CaseID = " + caseId);
                dataModel.listWork = Utility.Database.QueryList<FX_WorkFlowBusAct>(work, tran);
                //读取签发
                strSql.AppendFormat(@"select s.*,u.CnName from B_OA_Sighture as s 
                LEFT JOIN FX_UserInfo as u on s.userid = u.UserID  where s.caseid='{0}' and s.columnName = '{1}' and s.type = '{2}'", caseId, "qf", "0");
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                dataModel.listSightrue = ds.Tables[0];

                dataModel.listSupervision = GetSupervisionList(caseId, tran);

                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "数据加载成功", dataModel);//将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, ex.Message);
            }
        }

        public List<B_OA_Supervision> GetSupervisionList(string caseid, IDbTransaction tran)
        {
            List<B_OA_Supervision> listSupervision = new List<B_OA_Supervision>();
            B_OA_Supervision supervision = new B_OA_Supervision();
            supervision.Condition.Add("relationCaseId =" + caseid);
            listSupervision = Utility.Database.QueryList(supervision, tran);
            return listSupervision;
        }

        public DataSet GetRelationDoc(string caseId, IDbTransaction tran)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.AppendFormat(@"
                                   SELECT  ROW_NUMBER() OVER ( PARTITION BY b1.ID ORDER BY b1.createDate DESC, c1.ReceDate DESC ) AS ROWINDEX ,
        b1.ID ,
        b1.Name ,
        b1.FlowName ,
        b1.CreaterCnName ,
        CONVERT(VARCHAR(20), b1.CreateDate, 120) AS CreateDate ,
        c1.ReceDate,
        c1.ActName,
        a1.reminderCount
INTO    #Temp
FROM    ( 
          SELECT    b.CaseId,b.reminderCount
          FROM      B_OA_Supervision AS a
                    LEFT JOIN B_OA_SupervisionReminder AS b ON a.caseid = b.relationCaseId
          WHERE     a.caseId = '{0}'
                    AND b.relationCaseId IS NOT NULL
        ) AS a1
        LEFT JOIN FX_WorkFlowCase AS b1 ON a1.Caseid = b1.id
        LEFT JOIN FX_WorkFlowBusAct AS c1 ON a1.Caseid = c1.CaseId
SELECT  *
FROM    #Temp
WHERE   ROWINDEX = 1
DROP TABLE #Temp;


SELECT  ROW_NUMBER() OVER ( PARTITION BY b1.ID ORDER BY b1.createDate DESC, c1.ReceDate DESC ) AS ROWINDEX ,
        b1.ID ,
        b1.Name ,
        b1.FlowName ,
        b1.CreaterCnName ,
        CONVERT(VARCHAR(20), b1.CreateDate, 120) AS CreateDate ,
        c1.ReceDate,
        c1.ActName
INTO    #Temp2
FROM    ( SELECT    b.CaseId
          FROM      B_OA_Supervision AS a
                    LEFT JOIN B_OA_Supervision_Delay_Apply AS b ON a.caseid = b.relationCaseId
          WHERE     a.caseId = '{0}'
                    AND b.relationCaseId IS NOT NULL
         
        ) AS a1
        LEFT JOIN FX_WorkFlowCase AS b1 ON a1.Caseid = b1.id
        LEFT JOIN FX_WorkFlowBusAct AS c1 ON a1.Caseid = c1.CaseId
SELECT  *
FROM    #Temp2
WHERE   ROWINDEX = 1
DROP TABLE #Temp2;


                ", caseId);
            DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
            return ds;
        }

        /// <summary>
        /// 获取正文路径
        /// </summary>
        /// <param name="docType"></param>
        /// <param name="caseId"></param>
        /// <param name="userid"></param>
        /// <param name="tran"></param>
        /// <returns></returns>
        public string GetFilePath(string docType, string caseId, string userid, IDbTransaction tran, string type,string actId)
        {
            B_Common_CreateDoc createDoc = new B_Common_CreateDoc();
            StringBuilder strSql = new StringBuilder();
            string returnPath = "";//返回路径
            string filePath = "";//数据库要记录的的路径
            string documentName = "SendDocContent";//文件加路径
            string documentPath = CommonFunctional.GetDocumentPathByName(documentName,"FileDir");//文件夹全路径

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
                    documentPath =documentPath + strFileName;
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
                        else {
                            throw (new Exception("此发文的正文路径不存在，请联系统管理员 或 回退到发文拟稿时的步骤！"));                        
                        }
                    }
                   
                    returnPath =returnPath.Replace("\\", "/");
                }
            }

            return returnPath;
        }

        /** 
   * 字符串转二进制 
   * @param str 字符串 
   * @return byte数组 
   */
        public byte[] hex2byte(string str)
        {
            if (str == null)
                return null;
            str = str.Trim();
            int len = str.Length;
            if (len == 0 || len % 2 == 1)
                return null;
            byte[] b = new byte[len / 2];
            try
            {
                for (int i = 0; i < str.Length; i += 2)
                {

                    b[i / 2] = (byte)int.Parse("0X" + str.Substring(i, i + 2));
                }
                return b;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        #endregion

        public override string Key
        {
            get
            {
                return "B_OA_SendDocSvc";
            }
        }


        public class GetDataModel
        {
            public B_OA_SendDoc sendDocBaseInfo;
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

        public class SaveDataModel
        {
            public B_OA_SendDoc sendDocBaseInfo;
            public B_OA_SendDoc_R sendRelation;//业务关系表
        }
    }// class
}
