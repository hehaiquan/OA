using DocumentFormat.OpenXml.Drawing;
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

namespace BizService.Common
{
    public class CommonFunctional
    {
        /// <summary>
        /// 生成KEY值
        /// </summary>
        /// <param name="KeyId">需生成的KeyId</param>
        /// <returns>反回一个Key值</returns>
        public static String MakeMainKey(string KeyId)
        {
            string KeyValue = "";
            string MakeMainKey_SQL = "declare @KeyId varchar(50);" +
    "declare @KeyValue varchar(50);" +
    "declare @KeyDate varchar(10);" +
    "declare @KeyDate_ varchar(10);" +
    "declare @TopKeyValue  varchar(30);" +
    "set @KeyId='" + KeyId + "';" +
    "Select @KeyDate=CONVERT(varchar(100), GETDATE(), 112); " +
    "if not exists(select MainKeyId from Sys_GetKeyValue where MainKeyId=@KeyId) " +
    "begin " +
      "insert into Sys_GetKeyValue(MainKeyId) values(@KeyId); " +
    "end " +
    "select @KeyValue=KeyValue,@KeyDate_=KeyDate from Sys_GetKeyValue where MainKeyId=@KeyId;" +
    "if @KeyDate=@KeyDate_ " +
    " begin " +
    "   set @KeyValue=@KeyValue+1;" +
    "   set @TopKeyValue=@KeyDate+@KeyValue;" +
    "   update Sys_GetKeyValue set KeyValue=@KeyValue,TopKeyValue=@TopKeyValue where MainKeyId=@KeyId; " +
    " end " +
    " else " +
    " begin " +
    "   set @KeyValue=1;" +
    "   set @TopKeyValue=@KeyDate+@KeyValue;" +
    "   update Sys_GetKeyValue set KeyDate=@KeyDate,KeyValue=@KeyValue,TopKeyValue=@TopKeyValue where MainKeyId=@KeyId;" +
    " end " +
    "set @KeyValue=@TopKeyValue;" +
    "select @KeyValue;";
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                DataSet KeyValueSet = Utility.Database.ExcuteDataSet(MakeMainKey_SQL, tran);
                Utility.Database.Commit(tran);
                KeyValue = KeyValueSet.Tables[0].Rows[0][0].ToString();
                return KeyValue;
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                throw ex;
            }
        }


        /// <summary>
        /// 生成编号
        /// </summary>
        /// <param name="type"></param>
        /// <param name="tran"></param>
        /// <returns></returns>
        public static B_OA_CommonCode getCommonCode(string type, IDbTransaction tran)
        {
            B_OA_CommonCode common = new B_OA_CommonCode();
            common.Condition.Add("type = " + type);
            common = Utility.Database.QueryObject<B_OA_CommonCode>(common, tran);
            if (common == null)
            {
                common = new B_OA_CommonCode();
                common.code = "1";
                common.type = type;
                Utility.Database.Insert(common, tran);
            }
            UpdateCodeModel(type, tran);
            return common;

        }

        /// <summary>
        /// 生成编号后修改编号code的值 用于自动生成文号后文号号码改变
        /// </summary>
        /// <param name="type">code类别</param>
        /// <param name="tran"></param>
        /// <returns></returns>
        protected static void UpdateCodeModel(string type, IDbTransaction tran)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.AppendFormat("select * from B_OA_CommonCode where type ='{0}'", type);
            DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
            DataTable dt = ds.Tables[0];
            int code = int.Parse(dt.Rows[0][1].ToString());
            code = code + 1;
            strSql.Clear();
            strSql.AppendFormat("update B_OA_CommonCode set code ='{0}' where type='{1}'", code, type);
            Utility.Database.ExecuteNonQuery(strSql.ToString(), tran);
        }

        /// <summary>
        /// 查找审批意见
        /// </summary>
        /// <param name="caseId"></param>
        /// <returns></returns>
        public static GetDataModel GetWorkFlowCaseByCaseId(string caseId, IDbTransaction tran)
        {

            GetDataModel dataModel = new GetDataModel();
            dataModel.listWork = new List<FX_WorkFlowBusAct>();
            dataModel.listSightrue = new List<B_OA_Sighture>();
            dataModel.listAttachment = new List<FX_AttachMent>();

            FX_WorkFlowBusAct work = new FX_WorkFlowBusAct();
            work.Condition.Add("CaseID = " + caseId);
            StringBuilder strSql = new StringBuilder();
            dataModel.listWork = Utility.Database.QueryList<FX_WorkFlowBusAct>(work, tran);
            //读取签发
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
            dataModel.listAttachment = listAttachment;
            //            strSql.Clear();
            //            strSql.AppendFormat(@"
            //                select 
            //                b.ID,b.Name,b.FlowName,b.CreaterCnName,CONVERT(VARCHAR(20),b.CreateDate,120) as CreateDate 
            //                from B_OA_Supervision as a
            //                LEFT JOIN FX_WorkFlowCase as b 
            //                on a.caseid = b.id
            //                where a.relationCaseId = '{0}' 
            //                    ", caseId);
            //            DataSet ds_WorkFlowCase = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
            //            string jsonData_WorkFlow = JsonConvert.SerializeObject(ds_WorkFlowCase.Tables[0]);
            //            List<FX_WorkFlowCase> listWorkFlow = (List<FX_WorkFlowCase>)JsonConvert.DeserializeObject(jsonData_WorkFlow, typeof(List<FX_WorkFlowCase>));
            //            dataModel.listSupervision = listWorkFlow;
            return dataModel;//将对象转为json字符串并返回到客户端

        }


        /// <summary>
        /// 获取季度开始、结束时间
        /// </summary>
        /// <param name="iYear">年份</param>
        /// <param name="iQuarter">季度</param>
        /// <param name="dStartTime">返回开始时间</param>
        /// <param name="dEndTime">返回结束时间</param>
        public static void GetQuarterTime(int iYear, int iQuarter, out string dStartTime, out string dEndTime)
        {
            string strMonth = "";
            switch (iQuarter)
            {
                case 1:
                    strMonth = "01"; break;
                case 2:
                    strMonth = "04"; break;
                case 3:
                    strMonth = "07"; break;
                case 4:
                    strMonth = "09"; break;
                default: break;
            }
            DateTime inTime = Convert.ToDateTime(iYear + "-" + strMonth + "-01");
            dStartTime = inTime.AddMonths(0 - ((inTime.Month - 1) % 3)).ToString("yyyy-MM-01");
            dEndTime = DateTime.Parse(inTime.AddMonths(3 - ((inTime.Month - 1) % 3)).ToString("yyyy-MM-01")).AddDays(-1).ToShortDateString();
        }

        public static List<B_OA_PrintParagragh> ChangeListToMatch(List<FX_WorkFlowBusAct> listWork)
        {
            List<B_OA_PrintParagragh> listPara = new List<B_OA_PrintParagragh>();

            // 将工作流所有的信息格式化
            for (int i = listWork.Count - 1; i >= 0; i--)
            {
                if (listWork[i].Remark != null && listWork[i].Remark != "")
                {
                    B_OA_PrintParagragh paragra = new B_OA_PrintParagragh();
                    if ((listWork[i].Remark.Length > 4) && (listWork[i].Remark.Substring(listWork[i].Remark.Length - 4) == ".jpg"))
                    {
                        string rootPath = HttpContext.Current.Server.MapPath("/");
                        rootPath = rootPath.Replace("\\", "/");
                        string dir = IWorkFlow.Host.Utility.config.get("FileDir");
                        dir = dir.Replace("\\", "/");
                        string path = rootPath + dir + listWork[i].Remark;
                        if (File.Exists(path))
                        {
                            paragra.Image = System.Drawing.Image.FromFile(path);
                        }
                    }
                    else
                    {
                        paragra.Text = listWork[i].Remark;
                    }
                    paragra.Foots = listWork[i].UserName + listWork[i].ReceDate.ToString("yyyy年MM月dd日 HH:mm");
                    paragra.UserName = listWork[i].UserName;
                    paragra.FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
                    paragra.ActID = listWork[i].ActID;
                    listPara.Add(paragra);
                }
            }
            return listPara;
        }

        public static DataTable GetUserNameAndDepartNameByActId(string caseid, string actId, IDbTransaction tran)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.AppendFormat(@"
select top(1) b.CnName,b.DPName,b.UserID  from FX_WorkFlowBusAct  as a
LEFT JOIN V_FX_UserInfoAndDp as b 
on
b.UserID = a.UserID
where a.CaseID='{0}' and a.ActID = '{1}'
", caseid, actId);
            DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);

            return ds.Tables[0];

        }

        /// <summary>
        /// 获取业务当前节点Id（actid）
        /// </summary>
        /// <param name="caseid"></param>
        /// <returns></returns>
        public static FX_WorkFlowBusAct GetCurrentActId(string caseid)
        {
            FX_WorkFlowBusAct busact = new FX_WorkFlowBusAct();
            busact.Condition.Add("CaseID = " + caseid);
            busact.OrderInfo = "ReceDate DESC";
            busact = Utility.Database.QueryObject<FX_WorkFlowBusAct>(busact);
            return busact;
        }

        /// <summary>
        /// 通过业务iD删除业务相关表
        /// </summary>
        /// <param name="caseid"></param>
        /// <param name="tran"></param>
        public static void DeleteWorkdFlowByCaseId(string caseid, IDbTransaction tran)
        {

            StringBuilder strSql = new StringBuilder();

            strSql.Clear();
            strSql.AppendFormat("delete FX_WorkFlowBusAct where CaseID in('{0}')", caseid);
            Utility.Database.ExecuteNonQuery(strSql.ToString(), tran);
            //删除附件表
            strSql.Clear();
            strSql.AppendFormat("delete FX_AttachMent where CaseID in('{0}')", caseid);
            Utility.Database.ExecuteNonQuery(strSql.ToString(), tran);
            //删除业务流表
            strSql.AppendFormat("delete FX_WorkFlowCase where ID in('{0}')", caseid);
            Utility.Database.ExecuteNonQuery(strSql.ToString(), tran);
            //传阅信息
            strSql.AppendFormat("delete FX_WorkFlowPass where CaseID in('{0}')", caseid);
            Utility.Database.ExecuteNonQuery(strSql.ToString(), tran);

        }

        /// <summary>
        /// 通过附件文件夹名称获取附件文件夹绝对路径
        /// </summary>
        /// <param name="documentName"></param>
        /// <returns></returns>
        public static string GetDocumentPathByName(string documentName, string type)
        {
            string rootPath = HttpContext.Current.Server.MapPath("/");//系统路径
            string dir = "";
            if (type == "FileDir")
            {
                dir = IWorkFlow.Host.Utility.config.get("FileDir");
                dir = rootPath + dir + documentName + "/";

            }
            else if (type == "FileModelDir")
            {
                dir = IWorkFlow.Host.Utility.config.get("FileModelDir");
                dir = rootPath + dir + documentName + "/";

            }
            else if (type == "")
            {
                dir = IWorkFlow.Host.Utility.config.get("FileDir");
                dir = rootPath + dir;
            }

            dir = dir.Replace("\\", "/");
            //判断路径是否存在，若不存在自动生成文件夹路径
            BizService.Common.ComFileOperate.CreateDirectory(dir);
            return dir;
        }

        /// <summary>
        /// 根据标记查找文档管理
        /// </summary>
        /// <param name="flagType"></param>
        /// <returns></returns>
        public static DataTable GetFileTypeByFlag(string flagType, IDbTransaction tran)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.AppendFormat(@"
SELECT
	FileTypeId,FileTypeName,FileTypeName as name,ParentId
FROM
	B_OA_FileType
WHERE
	CodePath LIKE '%' 
	+ (
		SELECT
			FileTypeId
		FROM
			B_OA_FileType AS a
		WHERE
			flagType = '{0}'
	) + '%'
AND isParent = 0
", flagType);
            DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
            DataTable dataTable = dataSet.Tables[0];
            return dataTable;
        }

        public static DataTable GetParamItem(string dic, string id, IDbTransaction tran)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.AppendFormat(@"
select a.csz as id, a.mc as mc from Para_BizTypeItem a , Para_BizTypeDictionary b 
                            where a.flid = b.id and b.lx = '{0}' and a.csz ='{1}'
", dic, id);
            DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
            if (dataSet.Tables[0].Rows.Count > 0)
            {
                return dataSet.Tables[0];
            }
            else { return null; }
        }

        public static void ChangeGuidToCaseId(string guid, string caseid, IDbTransaction tran)
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

        public static FX_UserInfo_Add GetUserInfoAddByUserId(string userid, IDbTransaction tran)
        {
            FX_UserInfo_Add user = new FX_UserInfo_Add();
            user.Condition.Add("UID=" + userid);
            user = Utility.Database.QueryObject<FX_UserInfo_Add>(user, tran);
            return user;
        }

        public class GetDataModel
        {
            public List<FX_WorkFlowBusAct> listWork;
            public List<B_OA_Sighture> listSightrue;
            public List<FX_AttachMent> listAttachment;
            public DataTable dataTable;
            public List<FX_WorkFlowCase> listSupervision;
        }

    }
}
