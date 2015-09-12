using BizService.Common;
using IWorkFlow.BaseService;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;


namespace BizService.Services
{
    public class B_OA_TrafficFlow_NoticeVerifySvc : BaseDataHandler
    {
        [DataAction("GetData", "userid", "caseid")]
        public object  GetData(string userid, string caseId)
        {
            try
            {
                GetDataModel dataModel = new GetDataModel();
                B_OA_Notice en = new B_OA_Notice();
                en.Condition.Add("caseid=" + caseId);
                dataModel.baseInfor_Notice = Utility.Database.QueryObject<B_OA_Notice>(en);
                if (dataModel.baseInfor_Notice == null)
                {
                    //初始化数据
                    IDbTransaction tran = Utility.Database.BeginDbTransaction();
                    var baseInfor_Notice = new B_OA_Notice();
                    baseInfor_Notice.status = "checkUnthrough";
                    baseInfor_Notice.CreaterId = userid;
                    var userInfor = ComClass.GetUserInfo(userid);
                    baseInfor_Notice.CreateMan = userInfor.CnName;
                    baseInfor_Notice.CreateTime = DateTime.Now.ToString();
                    baseInfor_Notice.NewsId = ComClass.GetGuid();
                    baseInfor_Notice.Chk = "0";
                    B_OA_FileType fileType = ComDocumentCenterOperate.GetFileTypeByFlayType("4", tran);
                    baseInfor_Notice.documentTypeId = fileType.FileTypeId;
                    baseInfor_Notice.documentTypeName = ComDocumentCenterOperate.getFileTypeNameByFileTypeId(fileType.FileTypeId, tran);
                    dataModel.baseInfor_Notice = baseInfor_Notice;

                    Utility.Database.Commit(tran);
                }
                return  dataModel;
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
                GetDataModel data = JsonConvert.DeserializeObject<GetDataModel>(content);
                string caseid = developer.caseid;
                if (String.IsNullOrEmpty(caseid))
                {
                    string unitName = data.baseInfor_Notice.NewsTitle;
                    string titleType = "通知公告";
                    developer.caseName = unitName + "-" + titleType;
                    caseid = developer.Create();
                }

                //保存数据
                if (developer.wfcase.actid == "A002")
                {
                    data.baseInfor_Notice.status = "checkThrough";
                    data.baseInfor_Notice.isSeeInDoor = true;
                }
                SaveData(data, tran, caseid, userid);
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


        public void SetCaseName(GetDataModel data, SkyLandDeveloper developer)
        {
            try
            {
                string unitName = data.baseInfor_Notice.NewsTitle;
                string titleType = "通知公告";
                developer.caseName = unitName + "-" + titleType;
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
            }
        }

        public void SaveData(GetDataModel data, IDbTransaction tran, string caseId, string userid)
        {
            if (caseId != null) data.baseInfor_Notice.caseid = caseId;
            data.baseInfor_Notice.Condition.Add("caseid=" + caseId);
            B_OA_Notice en = Utility.Database.QueryObject<B_OA_Notice>(data.baseInfor_Notice);


            if (en == null)
            {
                //插入文章关系表 
                B_OA_Notice_FileType_R fileType_R = new B_OA_Notice_FileType_R();
                fileType_R.noticeId = data.baseInfor_Notice.NewsId;
                fileType_R.fileTypeId = ComDocumentCenterOperate.GetFileTypeByFlayType("4", tran).FileTypeId;
                Utility.Database.Insert(fileType_R, tran);

                Utility.Database.Insert(data.baseInfor_Notice, tran);
            }
            else
            {

                Utility.Database.Update(data.baseInfor_Notice, tran);
            }
            //将指定人员查看存入关系表中
            if (data.baseInfor_Notice.publicRange == 1)
            {
                InserAppointManSee(data.baseInfor_Notice, tran);
            }
        }

        public void InserAppointManSee(B_OA_Notice baseInfor_Notice, IDbTransaction tran)
        {

            string rangeCheckManId = baseInfor_Notice.rangeCheckManId;
            string[] manIdArray = rangeCheckManId.Split(';');
            //删除原数据
            B_OA_Notice_AppointManSee manSee_Delete = new B_OA_Notice_AppointManSee();
            manSee_Delete.Condition.Add("noticeid =" + baseInfor_Notice.NewsId);
            Utility.Database.Delete(manSee_Delete, tran);

            for (var range = 0; range < manIdArray.Length - 1; range++)
            {
                B_OA_Notice_AppointManSee manSee = new B_OA_Notice_AppointManSee();
                manSee.noticeid = baseInfor_Notice.NewsId;
                manSee.userid = manIdArray[range];
                Utility.Database.Insert(manSee, tran);
            }
        }

        public class GetDataModel
        {
            public B_OA_Notice baseInfor_Notice;
        }

        public override string Key
        {
            get
            {
                return "B_OA_TrafficFlow_NoticeVerifySvc";
            }
        }
    }
}
