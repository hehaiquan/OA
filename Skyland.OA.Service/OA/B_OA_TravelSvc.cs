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
    public class B_OA_TravelSvc : BaseDataHandler
    {
        public DataTable mPrintTable = new DataTable();

        [DataAction("GetData", "userid", "caseid", "baid")]
        public object GetData(string userid, string caseId, string baid)
        {
            try
            {
                //只有待办箱才有设置为已读
                if (!String.IsNullOrEmpty(baid)) engineAPI.SetIsReaded(caseId, baid, userid);

                GetDataModel data = new GetDataModel();
                B_OA_TravelList en = new B_OA_TravelList();
                en.Condition.Add("caseId=" + caseId);
                data.baseInfo = Utility.Database.QueryObject<B_OA_TravelList>(en);
                if (data.baseInfo == null)
                {
                    DeptInfoAndUserInfo d_u_Infor = ComClass.GetDeptAndUserByUserId(userid);
                    var baseInfo = new B_OA_TravelList();
                    baseInfo.travelerName = d_u_Infor.userinfo.CnName;
                    baseInfo.dpname = d_u_Infor.deptinfo.DPName;
                    data.baseInfo = baseInfo;
                }
                else
                {
                    DeptInfoAndUserInfo d_u_Infor = ComClass.GetDeptAndUserByUserId(data.baseInfo.traveler);
                    data.baseInfo.travelerName = d_u_Infor.userinfo.CnName;
                    data.baseInfo.dpname = d_u_Infor.deptinfo.DPName;
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
        //    SkyLandDeveloper developer = new SkyLandDeveloper(BizParams, userid, tran);
        //    IDbTransaction tran = Utility.Database.BeginDbTransaction();
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
        //        var retContent = GetData(userid, caseid);
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
                if (Utility.Database.Update<B_OA_TravelList>(data.baseInfo, tran) < 1)
                {
                    Utility.Database.Insert<B_OA_TravelList>(data.baseInfo, tran);
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
                    caseid = developer.Create();
                }
                if (developer.wfcase.actid == "A001")
                {
                    data.baseInfo.traveler = userid;
                    data.baseInfo.travelStatus = "1";
                    developer.caseName = ComClass.GetUserInfo(userid).CnName + "-出差申请";
                }
                else
                {
                    data.baseInfo.travelStatus = "2";
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

        /// <summary>
        /// 获取会议数据
        /// </summary>
        /// <param name="userid">当前用户ID</param>
        /// <returns>返回json数据结果</returns>
        [DataAction("SearchDate", "startTime", "endTime", "travelStatus", "travelerName", "dpname", "userid")]
        public string SearchDate(string startTime, string endTime, string travelStatus, string travelerName, string dpname, string userid)
        {
            StringBuilder strSql = new StringBuilder();
            GetDataModel dataModel = new GetDataModel();
            strSql.Append(String.Format(@"SELECT  
	id, caseId,CONVERT(VARCHAR(10),travelStartTime,120) AS travelStartTime, CONVERT(VARCHAR(10),travelEndTime,120) AS travelEndTime, DATEDIFF(DAY,travelStartTime,travelEndTime) AS totalDays, travelStartTime1_sj, travelEndTime1_sj, totalDays1_sj, 
	traveler, travelAddress, travelFee, remark, travelReason, travelStatus,B.CnName AS travelerName,
	C.FullName AS dpname,(CASE WHEN A.travelStatus = 1 THEN '待审批' WHEN  (A.travelStatus = 2 AND A.travelStartTime > GETDATE()) THEN '已审批'
	WHEN  (A.travelStatus = 2 AND A.travelStartTime < GETDATE() AND A.travelEndTime > GETDATE()) THEN '出差中' ELSE '已结束' END) AS StatusText
 FROM  
	B_OA_TravelList A
	LEFT JOIN FX_UserInfo B ON A.traveler = B.UserID
	LEFT JOIN FX_Department C ON B.DPID = C.DPID
WHERE 
	A.travelStartTime >= '{0}'
	AND A.travelEndTime <= '{1}'
    AND (C.FullName = '{4}' OR '{4}' = '')
	AND (A.travelStatus = '{2}' OR ('{2}' = '' AND A.travelEndTime < '{1}') OR ('{2}' = ''))
	AND B.CnName LIKE '%{3}%'
", startTime, endTime, travelStatus, travelerName, dpname));
            DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString());
            string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
            dataModel.list = (List<B_OA_TravelList>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_TravelList>));
            if (dataModel.baseInfo == null)
            {
                dataModel.baseInfo = new B_OA_TravelList();
            }
            return Utility.JsonResult(true, null, dataModel);
        }

        [DataAction("GetTravelGrid", "userid")]
        public object GetTravelGrid(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat(@"
select caseId,travelReason,b.CnName,travelAddress,travelStartTime,travelEndTime 
from B_OA_TravelList as a
LEFT JOIN FX_UserInfo as b on a.traveler = b.UserID
order By caseId desc
");
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


        [DataAction("GetTravelByCaseId", "caseid")]
        public object GetTravelByCaseId(string caseid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_TravelList baseInfor = new B_OA_TravelList();
                baseInfor.Condition.Add("caseId = " + caseid);
                baseInfor = Utility.Database.QueryObject<B_OA_TravelList>(baseInfor, tran);
                DeptInfoAndUserInfo d_u_Infor = ComClass.GetDeptAndUserByUserId(baseInfor.traveler);
                baseInfor.travelerName = d_u_Infor.userinfo.CnName;
                baseInfor.dpname = d_u_Infor.deptinfo.DPName;
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
                throw (new Exception("获取数据失败！", ex));
            }

        }

        [DataAction("SaveData", "jsonData")]
        public object SaveData(string jsonData)
        {
            var tran = Utility.Database.BeginDbTransaction();
            B_OA_TravelList data = JsonConvert.DeserializeObject<B_OA_TravelList>(jsonData);
            try
            {
                if (!string.IsNullOrEmpty(data.caseId))
                {
                    data.Condition.Add("caseId = " + data.caseId);
                    Utility.Database.Update<B_OA_TravelList>(data, tran);
                }
                Utility.Database.Commit(tran);
                bool b = true;
                return new
                {
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
                    B_OA_TravelList data = new B_OA_TravelList();
                    data.Condition.Add("caseId=" + caseId);
                    Utility.Database.Delete(data, tran);
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
                };
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("删除失败！", ex));
            }
        }

        #region 打印

        [DataAction("PrintDoc", "caseid", "userid")]
        public string PrintDoc(string caseid, string userid)
        {
            //SkyLandDeveloper developer = SkyLandDeveloper.FromJson("{}");
            try
            {
                string rootPath = HttpContext.Current.Server.MapPath("/");

                string wordPath = rootPath + "officeFileModel\\OA\\出差审批表.docx";
                if (!Directory.Exists(rootPath + "officeFile/OA"))//若文件夹不存在则新建文件夹  
                {
                    Directory.CreateDirectory(rootPath + "officeFile/OA"); //新建文件夹  
                }
                string targetpath = rootPath + "officeFile\\OA\\出差审批表_" + caseid;

                targetpath = targetpath.Replace("\\", "/");
                wordPath = wordPath.Replace("\\", "/");
                targetpath += ".docx";

                IWorkFlow.OfficeService.IWorkFlowOfficeHandler.ProduceWord2007UP(wordPath, targetpath, CreateWordSendDocData(caseid));
                return Utility.JsonResult(true, "发送成功！", "{wordPath:\"" + targetpath + "\"}");
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, "打印失败:" + ex.Message.Replace(":", " "));
            }
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

        #endregion

        // 获取数据模型
        public class GetDataModel
        {
            public B_OA_TravelList baseInfo;
            public List<B_OA_TravelList> list;
            public List<B_OA_Sighture> handWriteList;
            public B_OA_TravelList DetailEdit = new B_OA_TravelList();
        }

        /// <summary>
        /// 保存数据模型
        /// </summary>
        public class SaveDataModel
        {
            public B_OA_TravelList baseInfo;
            public KOGridEdit<B_OA_TravelList> list;
        }

        public override string Key
        {
            get
            {
                return "B_OA_TravelSvc";
            }
        }
    }
}
