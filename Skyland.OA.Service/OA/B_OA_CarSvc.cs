using System.Drawing;
using BizService.Common;
using DocumentFormat.OpenXml.Drawing.Diagrams;
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
    public class B_OA_CarSvc : BaseDataHandler
    {
        private DataTable mPrintTable = new DataTable();
        string rootPath = HttpContext.Current.Server.MapPath("/");

        [DataAction("GetData", "userid", "caseid", "baid", "actid")]
        public object GetData(string userid, string caseId, string baid, string actid)
        {
            try
            {
                //只有待办箱才有设置为已读
                if (!String.IsNullOrEmpty(baid)) engineAPI.SetIsReaded(caseId, baid, userid);

                var data = new GetDataModel();
                //                StringBuilder strSql = new StringBuilder();
                //                strSql.Append(String.Format(@"SELECT  
                //	workflowcaseid, sqr, sqrid, sqsj, ycks, ycksid, rs, ycsj, sycl, ccdd, ycsy, B.CnName AS pcr, (CASE pcsj WHEN '1900-1-1 00:00:00' THEN '' ELSE pcsj END) AS pcsj , fhsj, ccr, Stroke, Distance, Status, CONVERT(VARCHAR(16),CreatTime,120) AS CreatTime,
                //	(CASE Status WHEN 0 THEN '待派车' ELSE '已派车' END) AS StatusText,(CONVERT(VARCHAR(16),ycsj,120) +'---' +CONVERT(VARCHAR(16),fhsj,120)) AS useTime, sycl as cph,C.CnName AS driverName
                //FROM B_OA_Car A
                //    LEFT JOIN FX_UserInfo B ON A.pcr = B.UserIDWW
                //    LEFT JOIN FX_UserInfo C ON A.ccr = C.UserID
                //WHERE 
                //	workflowcaseid = '{0}'
                //", caseId));
                //DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString());
                //data.dataList = (List<B_OA_Car>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_Car>));
                //新建
                if (caseId == "")
                {
                    DeptInfoAndUserInfo userData = ComClass.GetDeptAndUserByUserId(userid);
                    data.baseInfo = new B_OA_Car();
                    data.baseInfo.CreatTime = DateTime.Now;
                    data.baseInfo.useManId = userData.userinfo.UserID;
                    data.baseInfo.useMan = userData.userinfo.CnName;
                    data.baseInfo.applyDepartment = userData.deptinfo.DPName;
                    data.baseInfo.useManPhone = userData.userinfo.Phone;
                }

                else
                {
                    B_OA_Car car = new B_OA_Car();
                    car.Condition.Add("workflowcaseid=" + caseId);
                    car = Utility.Database.QueryObject<B_OA_Car>(car);
                    data.baseInfo = car;
                }

                return data;
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("获取数据失败！", ex));
            }
        }

        /// <summary>
        /// 获取用车数据
        /// </summary>
        /// <param name="userid">当前用户ID</param>
        /// <returns>返回json数据结果</returns>
        [DataAction("SearchDate", "sqr", "cph", "startTime", "endTime", "userid")]
        public object SearchDate(string sqr, string cph, string startTime, string endTime, string userid)
        {
            StringBuilder strSql = new StringBuilder();
            GetDataModel dataModel = new GetDataModel();
            if (dataModel.baseInfo == null)
            {
                dataModel.baseInfo = new B_OA_Car();
            }
            strSql.AppendFormat(@"
select strartTime+'---'+endTime as useTime,endTime,strartTime,carName,useMan,useManPhone,CreatTime 
from B_OA_Car
where CreatTime >= '{0}' AND CreatTime <= '{1}'
", startTime, endTime);
            DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString());
            DataTable dataTable = dataSet.Tables[0];
            return new
            {
                dataTable = dataTable
            };
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
        //        developer.caseName = data.baseInfo.sqr + "-用车申请";// 设置流程实例标题
        //        developer.Commit();//提交事务
        //        var retContent = GetData(userid, caseid, developer.wfcase.baid, developer.wfcase.actid);
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
        public void SaveData(SaveDataModel data, IDbTransaction tran, string caseId)
        {

            if (caseId != null) data.baseInfo.workflowcaseid = caseId;
            data.baseInfo.Condition.Add("workflowcaseid=" + data.baseInfo.workflowcaseid);
            //更新或插入主业务信息
            if (Utility.Database.Update<B_OA_Car>(data.baseInfo, tran) < 1)
            {
                Utility.Database.Insert<B_OA_Car>(data.baseInfo, tran);
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
                //                StringBuilder strSql = new StringBuilder();
                //                strSql.Append(@"SELECT  
                //	workflowcaseid, sqr, sqrid, sqsj, ycks, ycksid, rs, ycsj, sycl, ccdd, ycsy, B.CnName AS pcr, (CASE pcsj WHEN '1900-1-1 00:00:00' THEN '' ELSE pcsj END) AS pcsj , fhsj, ccr, Stroke, Distance, Status, CONVERT(VARCHAR(16),CreatTime,120) AS CreatTime,
                //	(CASE Status WHEN 0 THEN '待派车' ELSE '已派车' END) AS StatusText,(CONVERT(VARCHAR(16),ycsj,120) +'---' +CONVERT(VARCHAR(16),fhsj,120)) AS useTime, sycl as cph,C.CnName AS driverName
                //FROM B_OA_Car A
                //    LEFT JOIN FX_UserInfo B ON A.pcr = B.UserID
                //    LEFT JOIN FX_UserInfo C ON A.ccr = C.UserID WHERE workflowcaseid <> '" + data.baseInfo.workflowcaseid + "' AND  sycl = '" + data.baseInfo.cph + "' AND(('" + data.baseInfo.ycsj + "' Between ycsj and fhsj)OR ('" + data.baseInfo.fhsj + "' Between ycsj and fhsj))");
                //                DataTable table = Utility.Database.ExcuteDataSet(strSql.ToString()).Tables[0];
                //                if (table.Rows.Count > 0)
                //                    return Utility.JsonResult(false, "车牌号：" + table.Rows[0]["cph"].ToString() + "\n时间：" + table.Rows[0]["ycsj"].ToString() + " 至 " + table.Rows[0]["fhsj"].ToString() + "\n申请人：" + table.Rows[0]["sqr"].ToString());

                //                strSql = new StringBuilder();
                //                strSql.Append(@"SELECT  
                //	workflowcaseid, sqr, sqrid, sqsj, ycks, ycksid, rs, ycsj, sycl, ccdd, ycsy, B.CnName AS pcr, (CASE pcsj WHEN '1900-1-1 00:00:00' THEN '' ELSE pcsj END) AS pcsj , fhsj, ccr, Stroke, Distance, Status, CONVERT(VARCHAR(16),CreatTime,120) AS CreatTime,
                //	(CASE Status WHEN 0 THEN '待派车' ELSE '已派车' END) AS StatusText,(CONVERT(VARCHAR(16),ycsj,120) +'---' +CONVERT(VARCHAR(16),fhsj,120)) AS useTime, sycl as cph,C.CnName AS driverName
                //FROM B_OA_Car A
                //    LEFT JOIN FX_UserInfo B ON A.pcr = B.UserID
                //    LEFT JOIN FX_UserInfo C ON A.ccr = C.UserID WHERE workflowcaseid <> '" + data.baseInfo.workflowcaseid + "' AND  ccr = '" + data.baseInfo.cph + "' AND(('" + data.baseInfo.ycsj + "' Between ycsj and fhsj)OR ('" + data.baseInfo.fhsj + "' Between ycsj and fhsj))");
                //                table = Utility.Database.ExcuteDataSet(strSql.ToString()).Tables[0];
                //                if (table.Rows.Count > 0)
                //                    return Utility.JsonResult(false, "司机：" + table.Rows[0]["driverName"].ToString() + "\n时间：" + table.Rows[0]["ycsj"].ToString() + " 至 " + table.Rows[0]["fhsj"].ToString() + "\n申请人:" + table.Rows[0]["sqr"].ToString());

                string caseid = developer.caseid;
                if (String.IsNullOrEmpty(caseid))
                {
                    string unitName = data.baseInfo.useMan;
                    string titleType = "用车申请";
                    developer.caseName = unitName + "-" + titleType;
                    caseid = developer.Create();
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



        #region 打印

        [DataAction("PrintDoc", "caseid", "userid")]
        public object PrintDoc(string caseid, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                string wordPath = CommonFunctional.GetDocumentPathByName("Car", "FileModelDir");
                string targetpath = CommonFunctional.GetDocumentPathByName("Car", "FileDir");
                targetpath = targetpath + "用车申请单" + caseid + ".docx";
                wordPath = wordPath + "用车申请单.docx";
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
            B_OA_Car car = new B_OA_Car();
            car.Condition.Add("workflowcaseid=" + caseid);
            car = Utility.Database.QueryObject<B_OA_Car>(car, tran);
            Dictionary<string, Object> dict = new Dictionary<string, Object>();
            //申请部门
            dict.Add("applyDepartment", car.applyDepartment == null ? "" : car.applyDepartment);
            //出车时间
            if (!string.IsNullOrEmpty(car.strartTime.ToString()))
            {
                string createDate = (DateTime.Parse(car.strartTime.ToString())).ToString("yyyy年MM月dd日 hh时");
                dict.Add("strartTime", createDate);//主送
            }
            if (!string.IsNullOrEmpty(car.endTime.ToString()))
            {
                string createDate = (DateTime.Parse(car.endTime.ToString())).ToString("yyyy年MM月dd日 hh时");
                dict.Add("endTime", createDate);//主送
            }
            //出差地点
            dict.Add("strarDestination", car.strarDestination == null ? "" : car.strarDestination);
            dict.Add("endDestination", car.endDestination == null ? "" : car.endDestination);
            //出差事由
            dict.Add("travelReson", car.travelReson == null ? "" : car.travelReson);
            //用车人名单
            dict.Add("personList", car.personList == null ? "" : car.personList);
            //用车联系人
            dict.Add("useMan", car.useMan == null ? "" : car.useMan);
            //用车联系人电话
            dict.Add("useManPhone", car.useManPhone == null ? "" : car.useManPhone);
            //驾驶员名字
            dict.Add("diverMan", car.diverMan == null ? "" : car.diverMan);
            //派出车辆
            dict.Add("carName", car.carName == null ? "" : car.carName);
            //备注
            dict.Add("remark", car.remark == null ? "" : car.remark);

            //获取所有评阅意见
            FX_WorkFlowBusAct work = new FX_WorkFlowBusAct();
            work.Condition.Add("CaseID = " + caseid);
            work.OrderInfo = "ReceDate asc";
            List<FX_WorkFlowBusAct> listWork = Utility.Database.QueryList<FX_WorkFlowBusAct>(work, tran);
            //将所有工作流信息格式化
            List<B_OA_PrintParagragh> listPara = CommonFunctional.ChangeListToMatch(listWork);
            //办公室核稿意见
            List<B_OA_PrintParagragh> officeSugList = new List<B_OA_PrintParagragh>();
            int k = 0;
            //办公室核稿意见
            for (k = 0; k < listPara.Count; k++)
            {
                if (listPara[k].ActID == "A002")
                {
                    officeSugList.Add(listPara[k]);
                }
            }
            //办公室核稿意见
            var imgOfficeSugListList = new OpenXmlHelper.ImageTextArray[officeSugList.Count];
            for (k = 0; k < officeSugList.Count; k++)
            {
                imgOfficeSugListList[k] = new OpenXmlHelper.ImageTextArray();
                imgOfficeSugListList[k].Images = officeSugList[k].Image;
                imgOfficeSugListList[k].Text = officeSugList[k].Text;
                imgOfficeSugListList[k].Foots = officeSugList[k].Foots;
                imgOfficeSugListList[k].FootAlign = DocumentFormat.OpenXml.Wordprocessing.JustificationValues.Right;
            }
            dict.Add("officeSug", imgOfficeSugListList);
            return dict;
        }


        [DataAction("GetCarRecordGrid", "userid")]
        public object GetCarRecordGrid(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat(@"select useMan,workflowcaseid,CreatTime,carName,diverMan,endDestination from B_OA_Car order by  workflowcaseid desc");
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

        [DataAction("GetCarByCaseId", "caseid")]
        public object GetCarByCaseId(string caseid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_Car baseInfor = new B_OA_Car();
                baseInfor.Condition.Add("workflowcaseid = " + caseid);
                baseInfor = Utility.Database.QueryObject<B_OA_Car>(baseInfor);
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
            B_OA_Car data = JsonConvert.DeserializeObject<B_OA_Car>(jsonData);
            try
            {
                if (!string.IsNullOrEmpty(data.workflowcaseid))
                {
                    data.Condition.Add("workflowcaseid = " + data.workflowcaseid);
                    Utility.Database.Update<B_OA_Car>(data, tran);
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

        [DataAction("DeleteData", "caseId","userid")]
        public object DeleteData(string caseId,string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            { //审核记录表
                if (!string.IsNullOrEmpty(caseId))
                {
                    B_OA_Car car = new B_OA_Car();
                    car.Condition.Add("workflowcaseid=" + caseId);
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
                ComBase.Logger(ex);
                throw (new Exception("删除失败！", ex));
            }
        }


        #endregion


        // 获取数据模型
        public class GetDataModel
        {
            public List<B_OA_Car> dataList;
            public B_OA_Car baseInfo;
        }


        /// <summary>
        /// 保存数据模型
        /// </summary>
        public class SaveDataModel
        {
            public B_OA_Car baseInfo;
        }


        public override string Key
        {
            get
            {
                return "B_OA_CarSvc";
            }
        }
    }
}
