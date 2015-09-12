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
    class B_OA_ReceiveDocSvc : BaseDataHandler
    {
        string rootPath = HttpContext.Current.Server.MapPath("/");

        [DataAction("GetData", "userid", "caseid", "baid", "actid")]
        public object GetData(string userid, string caseId, string baid, string actid)
        {
            try
            {
                //只有待办箱才有设置为已读
                if (!String.IsNullOrEmpty(baid)) engineAPI.SetIsReaded(caseId, baid, userid);

                var data = new GetShouWenDataModel();
                IDbTransaction tran = Utility.Database.BeginDbTransaction();
                #region 基础信息
                B_OA_ReceiveDoc en = new B_OA_ReceiveDoc();
                en.Condition.Add("caseID = " + caseId);
                data.baseInfo = Utility.Database.QueryObject<B_OA_ReceiveDoc>(en);
                //新建
                if (data.baseInfo == null)
                {

                    var baseInfo = new B_OA_ReceiveDoc();
                    string strSql = "select Max(substring(wjbh,9,5)) from B_OA_ReceiveDoc";
                    DataSet ds = Utility.Database.ExcuteDataSet(strSql, tran);
                    string code = ds.Tables[0].Rows[0][0].ToString();
                    if (code == "")
                    {
                        baseInfo.wjbh = "LW[" + DateTime.Now.Year.ToString() + "]00001";
                    }
                    else
                    {
                        baseInfo.wjbh = "LW[" + DateTime.Now.Year + "]" + (int.Parse(code) + 1).ToString();
                    }
                    baseInfo.recordManId = userid;
                    baseInfo.recordManName = ComClass.GetUserInfo(userid).CnName;
                    //var userInfo = ComClass.GetUserInfo(userid);
                    data.baseInfo = baseInfo;
                }
                //data.showLookBn = GetShowLookBn(rootPath);
                //if (actid == "A001") { data.showLookBn.excel = true; data.showLookBn.word = true; }
                #endregion

                return data;
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("获取数据失败！", ex));
            }
        }
        /// <summary>
        /// 查找办结
        /// </summary>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetReceiveDoc", "userid")]
        public string GetReceiveDoc(string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                string sql = @"select B_OA_ReceiveDoc.*,FX_WorkFlowCase.isEnd from 
                B_OA_ReceiveDoc left join FX_WorkFlowCase on FX_WorkFlowCase.ID = B_OA_ReceiveDoc.caseid
                 where FX_WorkFlowCase.IsEnd=1";
                DataSet ds = Utility.Database.ExcuteDataSet(sql, tran);
                string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
                List<B_OA_ReceiveDoc> listReceive = (List<B_OA_ReceiveDoc>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_ReceiveDoc>));
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "数据加载成功", listReceive);//将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, ex.Message);
            }
        }

        ////保存
        //[DataAction("save", "BizParams", "userid", "content")]
        //public string Save(string BizParams, string userid, string content)
        //{
        //    //IWorkFlow.Engine.EngineHost.Instance.GetBusinessModel("W000059");
        //    SkyLandDeveloper developer = new SkyLandDeveloper(BizParams, userid, tran);
        //    IDbTransaction tran = Utility.Database.BeginDbTransaction();
        //    try
        //    {
        //        SaveShouWenDataModel data = JsonConvert.DeserializeObject<SaveShouWenDataModel>(content);
        //        string caseid = developer.caseid;//获取业务流ID
        //        if (caseid == null || caseid.Equals(""))
        //        {
        //            caseid = developer.Create();//生成一个业务流ID
        //            data.baseInfo.jbgs = ComClass.GetUserInfo(userid).CnName;
        //        }

        //        SaveData(data, tran, caseid);//保存
        //        SetCaseName(data, developer);// 设置流程实例标题
        //        developer.Commit();//提交事务
        //        var retContent = GetData(userid, caseid, developer.baid, developer.wfcase.actid);
        //        return Utility.JsonResult(true, "保存成功！", retContent);
        //    }
        //    catch (Exception ex)
        //    {
        //        developer.RollBack();//回滚事务
        //        ComBase.Logger(ex);//写日专到本地文件
        //        return Utility.JsonResult(false, "保存失败:" + ex.Message.Replace(":", " "));
        //    }
        //}

        //保存数据
        public void SaveData(SaveShouWenDataModel data, IDbTransaction tran, string caseId)
        {
            try
            {
                if (caseId != null) data.baseInfo.caseid = caseId;
                data.baseInfo.Condition.Add("caseID=" + data.baseInfo.caseid);
                //更新或插入主业务信息
                if (Utility.Database.Update<B_OA_ReceiveDoc>(data.baseInfo, tran) < 1)
                {
                    Utility.Database.Insert<B_OA_ReceiveDoc>(data.baseInfo, tran);
                }

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
        public void SetCaseName(SaveShouWenDataModel data, SkyLandDeveloper deveoloper)
        {
            string unitName = data.baseInfo.wjbt;
            string titleType = "收文";
            deveoloper.caseName = unitName + "-" + titleType;
        }


        //发送
        [DataAction("send", "BizParams", "userid", "content")]
        public string Send(string BizParams, string userid, string content)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            SkyLandDeveloper developer = new SkyLandDeveloper(BizParams, userid, tran);
            try
            {
                SaveShouWenDataModel data = JsonConvert.DeserializeObject<SaveShouWenDataModel>(content);
                string caseid = developer.caseid;
                if (String.IsNullOrEmpty(caseid))
                {
                    string unitName = data.baseInfo.wjbt;
                    string titleType = "收文";
                    developer.caseName = unitName + "-" + titleType;
                    caseid = developer.Create();

                    data.baseInfo.jbgs = ComClass.GetUserInfo(userid).CnName;
                }

                if (developer.wfcase.flowid == "w000066")
                {
                    if (developer.wfcase.actid == "A003")
                    {
                        SaveToNotice(tran, caseid, userid);
                    }
                }
                else if (developer.wfcase.flowid == "w000067")
                {
                    if (developer.wfcase.actid == "A009")
                    {
                        SaveToNotice(tran, caseid, userid);
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

        /// <summary>
        /// 保存至文档中心
        /// </summary>
        /// <returns></returns>
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
            //取出用户相关信息
            var userInfo = ComClass.GetUserInfo(userid);
            DPID = userInfo.DPID;
            CnName = userInfo.CnName;
            UserID = userInfo.UserID;
            //查找部门ID
            FX_Department department = new FX_Department();
            department.Condition.Add("DPID=" + userInfo.DPID);
            department = Utility.Database.QueryList<FX_Department>(department, tran)[0];
            DPName = department.DPName;
            //放入的文件类型ID
            B_OA_ReceiveDoc receiveDoc = new B_OA_ReceiveDoc();
            receiveDoc.Condition.Add("caseid=" + caseid);
            receiveDoc = Utility.Database.QueryObject<B_OA_ReceiveDoc>(receiveDoc);

            //保存文档
            B_OA_Notice newNotice = new B_OA_Notice();
            //newNotice.NewsTitle = sendDoc.;//文档标题
            newNotice.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");//现在时间
            newNotice.NewsTitle = receiveDoc.wjbt;
            newNotice.documentTypeId = receiveDoc.lwlxId;//文档类型id
            string documentTypeName = getFileTypeNameByFileTypeId(receiveDoc.lwlxId, tran);
            newNotice.documentTypeName = documentTypeName;//所选树状图名称，从根节点到子节点
            newNotice.CreateMan = CnName;//创建人
            newNotice.CreaterId = userid;//创建人
            newNotice.AttachmentName = saveFileName;//保存文件路径
            newNotice.ShareAttachment = "0";//是否共享文件
            newNotice.isSeeInDoor = false;//是否在门户中查看
            newNotice.status = "checkThrough";//审核状态
            newNotice.caseid = receiveDoc.caseid;
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
            fileType_r.fileTypeId = receiveDoc.lwlxId;
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

        //正文
        [DataAction("GetDocumentPath", "caseid", "actid", "filetype", "cjsj", "userid")]
        public string GetDocumentPath(string caseid, string actid, string filetype, string cjsj, string userid)
        {
            //if (caseid == null || caseid == "") return Utility.JsonResult(false, "业务ID不能空，请先保存业务再编辑来文");
            //SkyLandDeveloper developer = SkyLandDeveloper.FromJson("{}");
            try
            {
                //string targetpath = rootPath + "officeFile\\B_OA_ReceiveDoc\\来文正文_" + caseid + ".doc";
                string targetpath = rootPath + "officeFile\\B_OA_ReceiveDoc\\来文正文_" + cjsj + ".doc";
                if (!File.Exists(targetpath))
                {
                    File.Copy(rootPath + "officeFileModel\\B_OA_ReceiveDoc\\来文正文模板.doc", targetpath);
                }
                targetpath = targetpath.Replace("\\", "/");
                return Utility.JsonResult(true, "发送成功！", "{wordPath:\"" + targetpath + "\"}");
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, "打印失败:" + ex.Message.Replace(":", " "));
            }
        }


        /// <summary>
        /// 打印
        /// </summary>
        /// <param name="caseid"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("Print", "caseid", "userid")]
        public string Print(string caseid, string userid)
        {
            //SkyLandDeveloper developer = SkyLandDeveloper.FromJson("{}");
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                DateTime dateTime = DateTime.Now;
                string wordPath = rootPath + "officeFileModel\\B_OA_ReceiveDoc\\来文模板.doc";
                string targetpath = rootPath + "officeFile\\B_OA_ReceiveDoc\\来文_" + caseid + " " + dateTime.ToLongDateString() + " " + dateTime.Hour + "时" + dateTime.Minute + "分" + dateTime.Second + "秒";

                targetpath = targetpath.Replace("\\", "/");
                wordPath = wordPath.Replace("\\", "/");
                targetpath += ".doc";
                var dic = CreateWrodData(caseid, tran);
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
                //File.Delete(targetpath);
                return Utility.JsonResult(true, "发送成功！", "{wordPath:\"" + targetpath + "\"}");
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, "打印失败:" + ex.Message.Replace(":", " "));
            }
        }

        /// <summary>
        /// 收文归档
        /// </summary>
        /// <param name="JsonData"></param>
        /// <param name="userid"></param>
        /// <param name="documentType">收发文类型</param>
        /// <returns></returns>
        [DataAction("FilePlaceR", "caseid", "title", "userid")]
        public string FilePlaceR(string caseid, string title, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            string DPName = "";//部门名称
            string DPID = "";//部门ID
            string CnName = "";//归档人姓名
            string AttachmentType = "";//归档文件夹ID
            string newAttachment = "";//归档文件
            string saveFileName = "";//需要存档的文件夹名称
            string UserID = "";
            string dir = "";
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
                fileType.Condition.Add("FileTypeName=" + "收文归档");
                B_OA_FileType fileType_ad = Utility.Database.QueryList<B_OA_FileType>(fileType, tran)[0];
                List<B_OA_FileType> listFileType = Utility.Database.QueryList<B_OA_FileType>(fileType, tran);
                if (listFileType.Count <= 0)
                {
                    return Utility.JsonResult(false, "文档中心分类中未有“发文归档”文档，请联系管理员添加");
                }
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
                newNotice.documentTypeName = "办公室;收发文归档;收文归档;";//文件文档分类名
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

                //修改收文的归档状态
                B_OA_ReceiveDoc recDoc = new B_OA_ReceiveDoc();
                recDoc.Condition.Add("caseid=" + caseid);
                B_OA_ReceiveDoc recDoc_ad = Utility.Database.QueryList<B_OA_ReceiveDoc>(recDoc, tran)[0];
                recDoc_ad.sfgd = 1;//修改归档状态为已归档
                Utility.Database.Update(recDoc_ad, tran);

                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "归档成功,此文档上传的归档附件可在文档中心的“办公室》收发文归档》发文归档”文件夹中看到");
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }




        /// <summary>
        /// 创建一个Word数据
        /// </summary>
        /// <param name="caseid"></param>
        /// <returns></returns>
        private Dictionary<string, Object> CreateWrodData(string caseid, IDbTransaction tran)
        {

            B_OA_ReceiveDoc en = new B_OA_ReceiveDoc();
            en.Condition.Add("caseid = " + caseid);//设置查询条件
            en = Utility.Database.QueryObject<B_OA_ReceiveDoc>(en);
            Dictionary<string, Object> list = new Dictionary<string, Object> {
                {"lwsj",en.swrq.ToString() },//收文日期
                {"lwdw",en.lwdw},//来文单位
                {"wjbt",en.wjbt},//文件标题
                {"nbyj",en.nbyj},//拟办意见
                {"jbgs",en.jbgs},//局办公室
                {"lwyq",en.lwyq},  //来文要求
                {"lwbh",en.lwbh},  //来问编号
                };

            List<B_OA_PrintParagragh> listPara = new List<B_OA_PrintParagragh>();
            List<B_OA_PrintParagragh> listPara_Ldps = new List<B_OA_PrintParagragh>();
            //获取所有评阅意见
            FX_WorkFlowBusAct work = new FX_WorkFlowBusAct();
            work.Condition.Add("CaseID = " + caseid);
            work.OrderInfo = "ReceDate asc";
            List<FX_WorkFlowBusAct> listWork = Utility.Database.QueryList<FX_WorkFlowBusAct>(work, tran);
            //将所有工作流信息格式化
            listPara = CommonFunctional.ChangeListToMatch(listWork);
            //领导批示
            for (int i = 0; i < listPara.Count;i++ )
            {
                if (listPara[i].ActID == "A004" || listPara[i].ActID == "A003")
                {
                    if (listPara[i].Image != null || listPara[i].Text != null)
                    {
                        listPara_Ldps.Add(listPara[i]);
                    }
                }
            }

            var imgLdps = new OpenXmlHelper.ImageTextArray[listPara_Ldps.Count];

            for (int k = 0; k < listPara_Ldps.Count; k++)
            {
                imgLdps[k] = new OpenXmlHelper.ImageTextArray();
                imgLdps[k].Images = listPara_Ldps[k].Image;
                imgLdps[k].Text = listPara_Ldps[k].Text;
                imgLdps[k].Foots = listPara_Ldps[k].Foots;
                imgLdps[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            list.Add("ldps", imgLdps);
            return list;
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
            dataModel.listWork = new List<FX_WorkFlowBusAct>();
            dataModel.listSightrue = new List<B_OA_Sighture>();
            dataModel.listAttachment = new List<FX_AttachMent>();
            try
            {
                FX_WorkFlowBusAct work = new FX_WorkFlowBusAct();
                work.Condition.Add("CaseID = " + caseId);
                StringBuilder strSql = new StringBuilder();
                dataModel.listWork = Utility.Database.QueryList<FX_WorkFlowBusAct>(work, tran);
                //读取手写签名
                strSql.AppendFormat(@"select s.*,u.CnName from B_OA_Sighture as s 
                LEFT JOIN FX_UserInfo as u on s.userid = u.UserID  where s.caseid='{0}' and s.columnName = '{1}' and s.type = '{2}'", caseId, "ldps", "0");
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                dataModel.dataTable = ds.Tables[0];
                //B_OA_Sighture sighture = new B_OA_Sighture();
                //sighture.Condition.Add("caseid=" + caseId);
                //sighture.Condition.Add("columnName=" + "ldps");
                //sighture.Condition.Add("type=" + "0");
                //dataModel.listSightrue = Utility.Database.QueryList<B_OA_Sighture>(sighture, tran);
                strSql.Clear();
                strSql.AppendFormat(@"select * from FX_AttachMent where caseid = '{0}'", caseId);
                DataSet ds_Attch = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(ds_Attch.Tables[0]);
                List<FX_AttachMent> listAttachment = (List<FX_AttachMent>)JsonConvert.DeserializeObject(jsonData, typeof(List<FX_AttachMent>));

                string server = HttpContext.Current.Request.ServerVariables["HTTP_HOST"];
                for (int i = 0; i < listAttachment.Count; i++)
                {

                    listAttachment[i].FilePath = "http://" + server + "//附件目录//" + listAttachment[i].FilePath;
                }
                dataModel.listSupervision = GetSupervisionList(caseId, tran);
                //发文关联
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


        public override string Key
        {
            get
            {
                return "B_OA_ReceiveDocSvc";
            }
        }

        public class GetDataModel
        {
            public List<FX_WorkFlowBusAct> listWork;
            public List<B_OA_Sighture> listSightrue;
            public List<FX_AttachMent> listAttachment;
            public DataTable dataTable;
            public List<B_OA_Supervision> listSupervision;
        }


        // 获取数据模型
        public class GetShouWenDataModel
        {
            public B_OA_ReceiveDoc baseInfo;
            // public ShowLookBn showLookBn;
        }

        /// <summary>
        /// 保存数据模型
        /// </summary>
        public class SaveShouWenDataModel
        {
            public B_OA_ReceiveDoc baseInfo;
        }

    }


}
