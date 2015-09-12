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

namespace BizService.Services
{
    class B_OA_Supervision_Assign_DocSvc : BaseDataHandler
    {
        [DataAction("GetData", "userid", "caseId", "baid")]
        public object GetData(string userid, string caseId, string baid)
        {
            //只有待办箱才有设置为已读
            if (!String.IsNullOrEmpty(baid)) engineAPI.SetIsReaded(caseId, baid, userid);

            GetDataModel data = new GetDataModel();
            B_OA_Supervision en = new B_OA_Supervision();
            en.Condition.Add("caseId=" + caseId);
            data.supervisionBaseInfo = Utility.Database.QueryObject<B_OA_Supervision>(en);

            B_OA_Supervision_Bill supervisionBill = new B_OA_Supervision_Bill();
            supervisionBill.Condition.Add("caseid =" + caseId);
            data.supervisionBill = Utility.Database.QueryObject<B_OA_Supervision_Bill>(supervisionBill);

            if (data.supervisionBaseInfo == null)
            {
                var baseInfo = new B_OA_Supervision();
                baseInfo.createDate = DateTime.Now.ToString();
                baseInfo.supervisionManId = userid;
                baseInfo.status = "1";//未读取的督办
                baseInfo.supervisionManName = ComClass.GetUserInfo(userid).CnName;
                data.supervisionBaseInfo = baseInfo;
                //督办通知单据
                B_OA_Supervision_Bill supervisionBill_ad = new B_OA_Supervision_Bill();
                supervisionBill_ad.content = GetSupervisionBill();
                supervisionBill_ad.year = DateTime.Now.Year.ToString();
                supervisionBill_ad.createDate = DateTime.Now.ToString("yyyy年MM月dd日");
                data.supervisionBill = supervisionBill_ad;
            }

            return data;
        }

        public string GetSupervisionBill()
        {
            StringBuilder billDiv = new StringBuilder();
            billDiv.Append(@"
                    <p style='text-align: left;'><u><span style='font-size:16pt'>_____</span></u><u><span style='font-size:16pt'>：</span></u></p>
                    <p style='text-align: left;'><span style='font-size:16pt'>&nbsp;&nbsp;&nbsp;&nbsp;根据<u>&nbsp;&nbsp;</u>（）
                    文件要求及领导批示精神，现将该件转你科室（单位）办理，请你单位于<u> &nbsp;</u>月<u>&nbsp;
                    &nbsp;</u>日前将办理结果报送局办公室及相关部门。</span></p>  
                        ");
            return billDiv.ToString();
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
                    string unitName = data.supervisionBaseInfo.title;
                    string titleType = "公文督办";
                    developer.caseName = unitName + "-" + titleType;
                    caseid = developer.Create();
                }
                if (developer.wfcase.actid == "A001")
                {
                    data.supervisionBaseInfo.code = CreateSendNo("GWDB", tran);
                    //当此文未草稿的时候并未生成caseid，而存的是guid，此步骤是将正文路径的caseid字段修改成caseid
                    ChangeGuidToCaseId(developer.wfcase.guid, caseid, tran);

                    //保存督办申请单
                    data.supervisionBill.issuerManId = data.supervisionBaseInfo.issuerManId;
                    data.supervisionBill.issuerManName = data.supervisionBaseInfo.issuerManName.Replace(';', ' ');
                    SaveSupervisionNoticeBill(data.supervisionBill, caseid, tran);
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

        //保存督办申请单
        public void SaveSupervisionNoticeBill(B_OA_Supervision_Bill supervisionBill, string caseid, IDbTransaction tran)
        {
            if (supervisionBill.id == 0)
            {
                //编号
                string code = CommonFunctional.getCommonCode("supervisionDocCode", tran).code;
                supervisionBill.code = code;
                //督办类别 0为督办申请单
                supervisionBill.type = 0;
                supervisionBill.caseid = caseid;
                Utility.Database.Insert(supervisionBill, tran);
            }
            else
            {
                Utility.Database.Update(supervisionBill, tran);
            }
        }

        /// <summary>
        /// 自动生成发文文号
        /// </summary>
        /// <param name="type"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        public string CreateSendNo(string codeType, IDbTransaction tran)
        {
            string code = CommonFunctional.getCommonCode(codeType, tran).code;
            int i = int.Parse(code);
            code = i.ToString("000000");
            code = codeType + code;
            return code;
        }


        //将草稿的guid改为正式的业务ID
        public void ChangeGuidToCaseId(string guid, string caseid, IDbTransaction tran)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.AppendFormat("select * from B_OA_Supervision_Notice where caseid = '{0}'", guid);
            DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString());
            if (ds.Tables[0].Rows.Count > 0)
            {
                string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
                List<B_OA_Supervision_Notice> list = (List<B_OA_Supervision_Notice>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_Supervision_Notice>));
                for (int i = 0; i < list.Count; i++)
                {
                    B_OA_Supervision_Notice notice = new B_OA_Supervision_Notice();
                    notice = list[i];
                    notice.caseid = caseid;
                    notice.Condition.Add("id = " + notice.id);
                    Utility.Database.Update(notice, tran);
                }
            }
        }


        public B_OA_Supervision SaveData(GetDataModel data, IDbTransaction tran, string caseId)
        {
            StringBuilder strSql = new StringBuilder();
            if (caseId != null) data.supervisionBaseInfo.caseId = caseId;
            data.supervisionBaseInfo.Condition.Add("caseId=" + data.supervisionBaseInfo.caseId);
            B_OA_Supervision en = Utility.Database.QueryObject<B_OA_Supervision>(data.supervisionBaseInfo);
            //如果主键和id都为空，插入信息
            if (data.supervisionBaseInfo.id == 0)
            {

                Utility.Database.Insert(data.supervisionBaseInfo, tran);
                strSql.Clear();
                strSql.AppendFormat(@"select @@IDENTITY");
                int id = Utility.Database.QueryObject<int>(strSql.ToString(), tran);
                data.supervisionBaseInfo.id = id;
            }
            else
            {
                Utility.Database.Update(data.supervisionBaseInfo, tran);
            }
            return data.supervisionBaseInfo;

        }

        /// <summary>
        /// 保存催办通知书
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
        [DataAction("SaveSupervisionNotice", "content")]
        public string SaveSupervisionNotice(string content)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_Supervision_Notice supervisionNotice = JsonConvert.DeserializeObject<B_OA_Supervision_Notice>(content);
                if (supervisionNotice.id == 0)
                {
                    Utility.Database.Insert(supervisionNotice, tran);
                }
                else
                {
                    supervisionNotice.Condition.Add("id = " + supervisionNotice.id);
                    Utility.Database.Update(supervisionNotice, tran);
                }
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存成功");
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }


        public void SetCaseName(GetDataModel data, SkyLandDeveloper developer)
        {
            try
            {
                string unitName = data.supervisionBaseInfo.title;
                string titleType = "公文督办";
                developer.caseName = unitName + "-" + titleType;
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
            }

        }

        //读取催办通知书
        [DataAction("GetSupervsionNotice", "keyId")]
        public string GetSupervsionNotice(string keyId)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            GetDataModel dataModel = new GetDataModel();
            B_OA_Supervision_Notice supervision = new B_OA_Supervision_Notice();
            try
            {
                supervision.Condition.Add("caseId = " + keyId);
                B_OA_Supervision_Notice result = Utility.Database.QueryObject<B_OA_Supervision_Notice>(supervision, tran);
                if (result == null)
                {
                    supervision.year = DateTime.Now.Year.ToString();
                    supervision.createDate = DateTime.Now.ToString();
                    supervision.supervisionDate = DateTime.Now.ToString("yyyy年MM月dd日");
                }
                else
                {
                    supervision = result;
                }
                dataModel.supervisionNoticeBaseInfor = supervision;
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存成功", dataModel);

            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

        //读取催办督办的办理情况
        [DataAction("GetSupervisionMsg", "caseId", "userid")]
        public string GetSupervisionMsg(string caseId, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            GetDataModel dataModel = new GetDataModel();
            try
            {
                dataModel.supervisionMsg = new B_OA_SupervisionMsg();
                dataModel.supervisionMsg.userName = ComClass.GetUserInfo(userid).CnName;
                dataModel.supervisionMsg.createDate = DateTime.Now.ToString();
                dataModel.supervisionMsg.caseId = caseId;

                return Utility.JsonResult(true, "保存成功", dataModel);
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

        //读取办理情况model
        public B_OA_SupervisionMsg GetSupervisionMsgModel(string caseId, string userid, IDbTransaction tran)
        {
            B_OA_SupervisionMsg supervisionMsg = new B_OA_SupervisionMsg();
            supervisionMsg.userName = ComClass.GetUserInfo(userid).CnName;
            supervisionMsg.createDate = DateTime.Now.ToString();
            supervisionMsg.caseId = caseId;
            return supervisionMsg;
        }

        //保存办理情况model
        [DataAction("SaveSupervsionMsg", "content", "userid")]
        public string SaveSupervsionMsg(string content, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            GetDataModel dataModel = new GetDataModel();
            try
            {
                B_OA_SupervisionMsg supervisionMsg = JsonConvert.DeserializeObject<B_OA_SupervisionMsg>(content);
                if (supervisionMsg.id == 0)
                {
                    Utility.Database.Insert(supervisionMsg, tran);
                }
                else
                {
                    Utility.Database.Update(supervisionMsg, tran);
                }
                strSql.AppendFormat("select CONVERT(VARCHAR(20),a.createDate,120) as createDate,* from B_OA_SupervisionMsg as a where a.caseId = '{0}' ORDER BY a.createDate desc", supervisionMsg.caseId);
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
                List<B_OA_SupervisionMsg> list = (List<B_OA_SupervisionMsg>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_SupervisionMsg>));
                dataModel.listMsg = list;
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存成功", dataModel);
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

        [DataAction("GetSupervisionMsgList", "caseId", "userid")]
        public string GetSupervisionMsgList(string caseId, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            GetDataModel dataModel = new GetDataModel();
            try
            {
                strSql.AppendFormat("select CONVERT(VARCHAR(20),a.createDate,120) as createDate,* from B_OA_SupervisionMsg as a where a.caseId = '{0}' ORDER BY a.createDate desc", caseId);
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
                List<B_OA_SupervisionMsg> list = (List<B_OA_SupervisionMsg>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_SupervisionMsg>));
                dataModel.listMsg = list;

                //办理情况model
                dataModel.supervisionMsg = GetSupervisionMsgModel(caseId, userid, tran);
                //办理相关文档
                DataSet relationSet = GetRelationDoc(caseId, tran);
                //办理催办文档
                dataModel.reminderTable = relationSet.Tables[0];
                //办理延期文档
                dataModel.delayTable = relationSet.Tables[1];
                //读取督察督办信息
                dataModel.supervisionBaseInfo = GetSupervisionInforByCaseId(caseId, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存成功", dataModel);

            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }


        public B_OA_Supervision GetSupervisionInforByCaseId(string caseid, IDbTransaction tran)
        {
            B_OA_Supervision supervision = new B_OA_Supervision();
            supervision.Condition.Add("caseId = " + caseid);
            supervision = Utility.Database.QueryObject<B_OA_Supervision>(supervision, tran);
            return supervision;
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

        public string CreateNo(IDbTransaction tran)
        {
            string code = CommonFunctional.getCommonCode("DB", tran).code;
            int i = int.Parse(code);
            code = i.ToString("000000");
            return code;
        }


        public class GetDataModel
        {
            public B_OA_Supervision supervisionBaseInfo;
            public B_OA_Supervision_Notice supervisionNoticeBaseInfor;
            public B_OA_SupervisionMsg supervisionMsg;
            public List<B_OA_SupervisionMsg> listMsg;
            public List<FX_WorkFlowCase> listFlowCase;
            public DataTable reminderTable;
            public DataTable delayTable;
            public B_OA_Supervision_Bill supervisionBill;

        }

        public override string Key
        {
            get
            {
                return "B_OA_Supervision_Assign_DocSvc";
            }
        }
    }
}
