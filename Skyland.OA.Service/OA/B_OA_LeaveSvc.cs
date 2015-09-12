using System.Drawing;
using BizService.Common;
using IWorkFlow.BaseService;
using IWorkFlow.Host;
using IWorkFlow.OfficeService.OpenXml;
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
    public class B_OA_LeaveSvc : BaseDataHandler
    {
        //打印数据源
        public DataTable mPrintTable = new DataTable();

        [DataAction("GetData", "userid", "caseid", "baid", "actid")]
        public object GetData(string userid, string caseId, string baid, string actid)
        {
            try
            {
                //只有待办箱才有设置为已读
                if (!String.IsNullOrEmpty(baid)) engineAPI.SetIsReaded(caseId, baid, userid);

                var data = new GetDataModel();
                B_OA_LeaveList en = new B_OA_LeaveList();
                en.Condition.Add("caseId=" + caseId);
                data.baseInfo = Utility.Database.QueryObject<B_OA_LeaveList>(en);
                if (data.baseInfo == null)
                {
                    data.baseInfo = new B_OA_LeaveList();
                    DeptInfoAndUserInfo d_u_Infor = ComClass.GetDeptAndUserByUserId(userid);
                    data.baseInfo.leaveer = userid;
                    data.baseInfo.leaveName = d_u_Infor.userinfo.CnName;
                    data.baseInfo.dpname = d_u_Infor.deptinfo.DPName;
                }
                else
                {
                    data.baseInfo.leaveName = ComClass.GetUserInfo(data.baseInfo.leaveer).CnName;
                    data.baseInfo.dpname = ComClass.GetDeptByUserId(data.baseInfo.leaveer).FullName;
                }

                return data;
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("获取数据失败！", ex));
            }
        }

        ////保存
        //[DataAction("save", "BizParams", "userid", "content")]
        //public string Save(string BizParams, string userid, string content)
        //{
        //    IDbTransaction tran = Utility.Database.BeginDbTransaction();
        //    SkyLandDeveloper developer = new SkyLandDeveloper(BizParams, userid, tran);
        //    try
        //    {
        //        SaveDataModel data = JsonConvert.DeserializeObject<SaveDataModel>(content);
        //        string caseid = developer.caseid;//获取业务流ID
        //        if (caseid == null || caseid.Equals(""))
        //        {
        //            caseid = developer.Create();//生成一个业务流ID
        //        }

        //        SaveData(data, tran, caseid);//保存
        //        developer.Commit();//提交事务
        //        var retContent = GetData(userid, caseid, developer.baid, developer.wfcase.actid);
        //        return Utility.JsonResult(true, null, retContent);
        //    }
        //    catch (Exception ex)
        //    {
        //        developer.RollBack();//回滚事务
        //        ComBase.Logger(ex);//写日专到本地文件
        //        return Utility.JsonResult(false, "保存失败:" + ex.Message.Replace(":", " "));
        //    }
        //}

        //保存数据
        public void SaveData(SaveDataModel data, IDbTransaction tran, string caseId)
        {
            try
            {
                if (caseId != null) data.baseInfo.caseId = caseId;
                data.baseInfo.Condition.Add("caseId=" + data.baseInfo.caseId);
                //更新或插入主业务信息
                if (Utility.Database.Update<B_OA_LeaveList>(data.baseInfo, tran) < 1)
                {
                    Utility.Database.Insert<B_OA_LeaveList>(data.baseInfo, tran);
                }
            }
            catch (Exception e)
            {
                ComBase.Logger(e);
                throw e;
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
                SaveDataModel data = JsonConvert.DeserializeObject<SaveDataModel>(content);
                string caseid = data.baseInfo.caseId;
                if (caseid == null || caseid.Equals(""))
                {
                    caseid = developer.Create();//生成一个业务流ID
                }
                if (developer.wfcase.actid == "A001")
                {
                    data.baseInfo.createDate = DateTime.Now;
                    developer.caseName = ComClass.GetUserInfo(userid).CnName + "-请假申请";
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
                return Utility.JsonResult(false, "发送失败:" + ex.Message.Replace(":", " "));
            }
        }

        /// <summary>
        /// 获取会议数据
        /// </summary>
        /// <param name="userid">当前用户ID</param>
        /// <returns>返回json数据结果</returns>
        [DataAction("SearchDate", "startTime", "endTime", "leaveType", "leaveName", "dpname", "userid")]
        public string SearchDate(string startTime, string endTime, string leaveType, string leaveName, string dpname, string userid)
        {
            StringBuilder strSql = new StringBuilder();
            GetDataModel dataModel = new GetDataModel();
            strSql.Append(String.Format(@"SELECT  
	id, caseId,CONVERT(VARCHAR(16),leaveStartTime,120) AS leaveStartTime, CONVERT(VARCHAR(16),leaveEndTime,120) AS leaveEndTime, 
	DATEDIFF(DAY,leaveStartTime,leaveEndTime) AS totalDays,
	leaveer,remark, leaveReason, leaveType,B.CnName AS leaveName,
	C.FullName AS dpname,(CASE WHEN A.leaveType = 1 THEN '事假' WHEN  A.leaveType = 2 THEN '病假' WHEN  A.leaveType = 3 THEN '探亲假' ELSE '其它' END) AS leaveTypeText
 FROM  
	B_OA_LeaveList A
	LEFT JOIN FX_UserInfo B ON A.leaveer = B.UserID
	LEFT JOIN FX_Department C ON B.DPID = C.DPID
WHERE 
	A.leaveStartTime >= '{0}'
	AND A.leaveEndTime <= '{1}'
    AND (C.FullName = '{4}' OR '{4}' = '')
	AND (A.leaveType = '{2}' OR '{2}' = '')
	AND B.CnName LIKE '%{3}%'

", startTime, endTime, leaveType, leaveName, dpname));
            DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString());
            string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
            dataModel.list = (List<B_OA_LeaveList>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_LeaveList>));
            if (dataModel.baseInfo == null)
            {
                dataModel.baseInfo = new B_OA_LeaveList();
            }
            return Utility.JsonResult(true, null, dataModel);
        }


        /// <summary>
        /// 查找请假申请表，用于查看每年度的请假情况
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        [DataAction("GetLeveListByUser", "uid")]
        public object GetLeveListByUser(string uid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                //查找年度请假情况
                CondtionModel condition = GetLeaveCondtionByYear(uid, "2015", tran);
                DataTable dataTable = condition.dataTable;
                ConModel model = condition.con;
                Utility.Database.Commit(tran);
                return new
                {
                    model = model,
                    dataTable = dataTable
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);
                return Utility.JsonResult(false, "发送失败:" + ex.Message.Replace(":", " "));
            }
        }

        /// <summary>
        /// 查找年度请假情况
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="year"></param>
        /// <param name="tran"></param>
        /// <returns></returns>
        public CondtionModel GetLeaveCondtionByYear(string uid, string year, IDbTransaction tran)
        {
            CondtionModel condtion = new CondtionModel();
            StringBuilder strSql = new StringBuilder();
            strSql.AppendFormat(@"
select b1.leaveReason,b1.leaveType,b1.leaveStartTime,b1.leaveEndTime,b1.totalDays,b1.actualDays,d1.mc as leaveTypeName
from  B_OA_LeaveList as b1 
LEFT JOIN Para_BizTypeItem as d1 on d1.csz =cast(b1.leaveType as nvarchar)-- b1.leaveType
LEFT JOIN Para_BizTypeDictionary as c1 on  c1.id = d1.flid
where c1.lx = 'leaveType' and b1.leaveer = '{0}'
and b1.caseId in
(select b.CaseID from FX_WorkFlowCase as a 
LEFT JOIN FX_WorkFlowBusAct as b on a.ID = b.CaseID
where FlowID ='W000079' and ActID = 'A004'
GROUP BY b.CaseID)
and b1.leaveStartTime >='2015-01-01' and b1.leaveStartTime <='2015-12-31'
", uid);

            DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
            DataTable dataTable = dataSet.Tables[0];
            condtion.dataTable = dataTable;


            strSql.Clear();
            strSql.AppendFormat(@"
select SUM(b1.actualDays) as actualDays
from  B_OA_LeaveList as b1 
LEFT JOIN Para_BizTypeItem as d1 on d1.csz =cast(b1.leaveType as nvarchar)-- b1.leaveType
LEFT JOIN Para_BizTypeDictionary as c1 on  c1.id = d1.flid
where c1.lx = 'leaveType' and b1.leaveer = 'U000008'
and b1.caseId in
(select b.CaseID from FX_WorkFlowCase as a 
LEFT JOIN FX_WorkFlowBusAct as b on a.ID = b.CaseID
where FlowID ='W000079' and ActID = 'A004'
GROUP BY b.CaseID)
and b1.leaveStartTime >='2015-01-01' and b1.leaveStartTime <='2015-12-31'
", uid);
            DataTable dataDay = Utility.Database.ExcuteDataSet(strSql.ToString(), tran).Tables[0];
            ConModel con = new ConModel();
            //名字
            con.applyName = ComClass.GetUserInfo(uid).CnName;
            if (dataDay.Rows.Count > 0)
            {
                //已休假日期
                con.haveLeaveDate = float.Parse(dataDay.Rows[0]["actualDays"].ToString());
            }
            FX_UserInfo_Add user = new FX_UserInfo_Add();
            user.Condition.Add("UID =" + uid);
            user = Utility.Database.QueryObject<FX_UserInfo_Add>(user, tran);
            if (user != null)
            {
                //工作年限
                con.workYear = float.Parse(user.WYear.ToString());
                //应享受休假天数
                con.orghtoLeaveDate = float.Parse(user.VDay.ToString());
            }
            condtion.con = con;
            return condtion;
        }

        #region 打印

        [DataAction("PrintDoc", "caseid","type", "userid")]
        public object PrintDoc(string caseid,string type, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                string wordPath = CommonFunctional.GetDocumentPathByName("Leave", "FileModelDir");
                string targetpath = CommonFunctional.GetDocumentPathByName("Leave", "FileDir");
                if (type == "公休")
                {
                    targetpath = targetpath + "公休假申请表" + caseid + ".docx";
                    wordPath = wordPath + "公休假申请表.docx";
                }
                else
                {
                    targetpath = targetpath + "病事补休假审批表" + caseid + ".docx";
                    wordPath = wordPath + "病事补休假审批表.docx";
                }

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
                ComBase.Logger(ex);
                return Utility.JsonResult(false, "打印失败:" + ex.Message.Replace(":", " "));
            }
        }

        private Dictionary<string, Object> CreateWordSendDocData(string caseid, IDbTransaction tran)
        {
            B_OA_LeaveList leave = new B_OA_LeaveList();
            leave.Condition.Add("caseId=" + caseid);
            leave = Utility.Database.QueryObject<B_OA_LeaveList>(leave, tran);
            Dictionary<string, Object> dict = new Dictionary<string, Object>();
            DeptInfoAndUserInfo dpAndUserInfo = ComClass.GetDeptAndUserByUserId(leave.leaveer);
            FX_UserInfo_Add userInfor = CommonFunctional.GetUserInfoAddByUserId(leave.leaveer, tran);

            if (userInfor != null)
            {
                //工作年限
                dict.Add("wyear", userInfor.WYear == null ? "" : userInfor.WYear);
                //参加工作时间
                if (!string.IsNullOrEmpty(userInfor.inJobDate.ToString()))
                {
                    string inJobDate = (DateTime.Parse(userInfor.inJobDate.ToString())).ToString("yyyy年MM月dd日");

                    dict.Add("inJobDate", inJobDate);
                }
                dict.Add("vday", userInfor.VDay == null ? "" : userInfor.VDay);

            }
            //姓名
            dict.Add("name", dpAndUserInfo.userinfo.CnName == null ? "" : dpAndUserInfo.userinfo.CnName);
            //科室
            dict.Add("dpName", dpAndUserInfo.deptinfo.DPName == null ? "" : dpAndUserInfo.deptinfo.DPName);
            //拟休假天数
            dict.Add("totalDays", leave.totalDays.ToString());
            //请假事由
            dict.Add("leaveReson", leave.leaveReason == null ? "" : leave.leaveReason);
            //起止日期
            string startTime = (DateTime.Parse(leave.leaveStartTime.ToString())).ToString("yyyy年MM月dd日 hh:mm");
            string endTime = (DateTime.Parse(leave.leaveEndTime.ToString())).ToString("yyyy年MM月dd日 hh:mm");
            dict.Add("startTime", startTime);
            dict.Add("endTime", endTime);
            //查找已休假天数
            StringBuilder strSql = new StringBuilder();
            strSql.AppendFormat(@"
select SUM(b1.actualDays) as actualDays
from  B_OA_LeaveList as b1 
LEFT JOIN Para_BizTypeItem as d1 on d1.csz =cast(b1.leaveType as nvarchar)-- b1.leaveType
LEFT JOIN Para_BizTypeDictionary as c1 on  c1.id = d1.flid
where c1.lx = 'leaveType' and b1.leaveer = '{0}'
and b1.caseId in
(select b.CaseID from FX_WorkFlowCase as a 
LEFT JOIN FX_WorkFlowBusAct as b on a.ID = b.CaseID
where FlowID ='W000079' and ActID = 'A004'
GROUP BY b.CaseID)
and b1.leaveStartTime >='2015-01-01' and b1.leaveStartTime <='2015-12-31'
", leave.leaveer);
            DataTable dataDay = Utility.Database.ExcuteDataSet(strSql.ToString(), tran).Tables[0];
            if (dataDay.Rows.Count > 0)
            {
                dict.Add("haveLeaveDay", dataDay.Rows[0]["actualDays"].ToString());
            }

            //获取所有评阅意见
            FX_WorkFlowBusAct work = new FX_WorkFlowBusAct();
            work.Condition.Add("CaseID = " + caseid);
            work.OrderInfo = "ReceDate asc";
            List<FX_WorkFlowBusAct> listWork = Utility.Database.QueryList<FX_WorkFlowBusAct>(work, tran);
            //将所有工作流信息格式化
            List<B_OA_PrintParagragh> listPara = CommonFunctional.ChangeListToMatch(listWork);
            //室主任意见
            List<B_OA_PrintParagragh> szryjList = new List<B_OA_PrintParagragh>();
            //办公室审核
            List<B_OA_PrintParagragh> bgsshList = new List<B_OA_PrintParagragh>();
            //分管领导意见
            List<B_OA_PrintParagragh> fgldyjList = new List<B_OA_PrintParagragh>();
            //站长审核
            List<B_OA_PrintParagragh> zzshList = new List<B_OA_PrintParagragh>();
            int k = 0;
            //室主任意见
            for (k = 0; k < listPara.Count; k++)
            {
                if (listPara[k].ActID == "A002")
                {
                    szryjList.Add(listPara[k]);
                }
            }
            //室主任意见
            var imgSzryjList = new OpenXmlHelper.ImageTextArray[szryjList.Count];
            for (k = 0; k < szryjList.Count; k++)
            {
                imgSzryjList[k] = new OpenXmlHelper.ImageTextArray();
                imgSzryjList[k].Images = szryjList[k].Image;
                imgSzryjList[k].Text = szryjList[k].Text;
                imgSzryjList[k].Foots = szryjList[k].Foots;
                imgSzryjList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("szryj", imgSzryjList);

            //办公室审核
            for (k = 0; k < listPara.Count; k++)
            {
                if (listPara[k].ActID == "A007")
                {
                    bgsshList.Add(listPara[k]);
                }
            }
            //办公室审核
            var imgBgsshList = new OpenXmlHelper.ImageTextArray[szryjList.Count];
            for (k = 0; k < szryjList.Count; k++)
            {
                imgBgsshList[k] = new OpenXmlHelper.ImageTextArray();
                imgBgsshList[k].Images = bgsshList[k].Image;
                imgBgsshList[k].Text = bgsshList[k].Text;
                imgBgsshList[k].Foots = bgsshList[k].Foots;
                imgBgsshList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("bgsh", imgBgsshList);

            //分管领导意见
            for (k = 0; k < listPara.Count; k++)
            {
                if (listPara[k].ActID == "A003")
                {
                    fgldyjList.Add(listPara[k]);
                }
            }
            //分管领导意见
            var imgFgldyjList = new OpenXmlHelper.ImageTextArray[fgldyjList.Count];
            for (k = 0; k < fgldyjList.Count; k++)
            {
                imgFgldyjList[k] = new OpenXmlHelper.ImageTextArray();
                imgFgldyjList[k].Images = fgldyjList[k].Image;
                imgFgldyjList[k].Text = fgldyjList[k].Text;
                imgFgldyjList[k].Foots = fgldyjList[k].Foots;
                imgFgldyjList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("fgldyj", imgFgldyjList);

            //站长审核
            for (k = 0; k < listPara.Count; k++)
            {
                if (listPara[k].ActID == "A008")
                {
                    zzshList.Add(listPara[k]);
                }
            }
            //站长审核
            var imgZzshListList = new OpenXmlHelper.ImageTextArray[zzshList.Count];
            for (k = 0; k < zzshList.Count; k++)
            {
                imgZzshListList[k] = new OpenXmlHelper.ImageTextArray();
                imgZzshListList[k].Images = zzshList[k].Image;
                imgZzshListList[k].Text = zzshList[k].Text;
                imgZzshListList[k].Foots = zzshList[k].Foots;
                imgZzshListList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("zzspyj", imgZzshListList);
            return dict;
        }


        /// <summary>
        /// 创建一个Word数据
        /// </summary>
        /// <param name="caseid"></param>
        /// <returns></returns>
        private Dictionary<string, Object> CreateWordSendDocData(string caseid)
        {
            //创建内容
            Dictionary<string, Object> dict = new Dictionary<string, Object>();

            string rootPath = HttpContext.Current.Server.MapPath("/");
            rootPath = rootPath.Replace("\\", "/");
            string path = "";
            for (int i = 0; i < mPrintTable.Columns.Count; i++)
            {
                if (mPrintTable.Columns[i].ColumnName == "path")
                    continue;
                dict.Add(mPrintTable.Columns[i].ColumnName, mPrintTable.Rows[0][i]);

                //行转列
                if ((i + 1) == mPrintTable.Columns.Count)
                {
                    for (int j = 0; j < mPrintTable.Rows.Count; j++)
                    {
                        path = rootPath + mPrintTable.Rows[j]["path"];
                        dict.Add("handWrite" + (j + 1), System.Drawing.Image.FromFile(path));
                    }
                }
            }

            return dict;
        }


        [DataAction("GetLeaveApplyGrid", "userid")]
        public object GetLeaveApplyGrid(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat(@"
select a.caseId,b.CnName as userName,e.DPName as dpName,a.leaveReason,a.actualDays,c.mc as leaveTypeName,a.leaveStartTime,a.leaveEndTime,a.createDate
from B_OA_LeaveList as a
LEFT JOIN FX_UserInfo as b on a.leaveer = b.UserId
LEFT JOIN Para_BizTypeItem as c on c.csz =a.leaveType
LEFT JOIN Para_BizTypeDictionary as d on  d.id = c.flid
LEFT JOIN FX_Department as e on e.DPID = b.DPID
where d.lx = 'leaveType' 
ORDER BY a.createDate desc");
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                DataTable dataTable = ds.Tables[0];
                Utility.Database.Commit(tran);
                return new
                {
                    dataTable = dataTable
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);
                throw (new Exception("读取失败！", ex));
            }
        }

        [DataAction("GetLeaveByCaseId", "caseid")]
        public object GetLeaveByCaseId(string caseid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_LeaveList baseInfor = new B_OA_LeaveList();
                baseInfor.Condition.Add("caseId = " + caseid);
                baseInfor = Utility.Database.QueryObject<B_OA_LeaveList>(baseInfor);
                baseInfor.leaveName = ComClass.GetUserInfo(baseInfor.leaveer).CnName;
                baseInfor.dpname = ComClass.GetDeptByUserId(baseInfor.leaveer).FullName;
                Utility.Database.Commit(tran);
                return new
                {
                    baseInfor = baseInfor
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);
                throw (new Exception("打印失败！", ex));
            }

        }

        [DataAction("SaveData", "jsonData")]
        public object SaveData(string jsonData)
        {
            var tran = Utility.Database.BeginDbTransaction();
            B_OA_LeaveList data = JsonConvert.DeserializeObject<B_OA_LeaveList>(jsonData);
            try
            {
                if (!string.IsNullOrEmpty(data.caseId))
                {
                    data.Condition.Add("caseId = " + data.caseId);
                    Utility.Database.Update<B_OA_LeaveList>(data, tran);
                }
                Utility.Database.Commit(tran);
                bool b = true;
                return new
                {
                    b = b
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);
                throw (new Exception("保存失败！", ex));
            }
        }


        [DataAction("DeleteData", "caseId", "userid")]
        public object DeleteData(string caseId, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            { //审核记录表
                if (!string.IsNullOrEmpty(caseId))
                {
                    B_OA_LeaveList car = new B_OA_LeaveList();
                    car.Condition.Add("caseId=" + caseId);
                    Utility.Database.Delete(car, tran);
                    engineAPI.Delete(caseId, userid, tran);
                    Utility.Database.Commit(tran);
                }
                else
                {
                    throw (new Exception("删除数据失败"));
                }
                bool b = true;
                return new
                {
                    b = b
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);
                throw (new Exception("删除失败！", ex));
            }
        }


        #endregion

        public class CondtionModel
        {
            public DataTable dataTable;
            public ConModel con;
        }

        // 获取数据模型
        public class GetDataModel
        {
            public B_OA_LeaveList baseInfo;
            public List<B_OA_LeaveList> list;
            public List<B_OA_Sighture> handWriteList;
            public B_OA_LeaveList DetailEdit = new B_OA_LeaveList();
        }

        //用于显示请假情况
        public class ConModel
        {
            //申请人名字
            public string applyName;
            //已休假天数
            public float? haveLeaveDate;
            //应享受天数
            public float orghtoLeaveDate;
            //工作年限
            public float workYear;
        }

        /// <summary>
        /// 保存数据模型
        /// </summary>
        public class SaveDataModel
        {
            public B_OA_LeaveList baseInfo;
            public KOGridEdit<B_OA_LeaveList> list;
        }

        public override string Key
        {
            get
            {
                return "B_OA_LeaveSvc";
            }
        }
    }
}
