using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BizService.Services.Common
{
    public class Para_OA_CarInfoSvc : BaseDataHandler
    {
        /// <summary>
        /// 获取用语数据
        /// </summary>
        /// <param name="userid">当前用户ID</param>
        /// <returns>返回json数据结果</returns>
        [DataAction("GetData", "userid")]
        public string GetData(string userid)
        {
            StringBuilder strSql = new StringBuilder();
            try
            {
                GetDataModel dataModel = new GetDataModel();
                strSql.Append(@"SELECT 
	 id, cph, zdlc, sjlc, whlc, sfky,(CASE sfky WHEN 0 THEN '正常' ELSE '停用' END) AS sfkyText, zt, carType, carBrand, carModel, carEngine, chassis, 
	 color, loadWeight, seatCount, price,CONVERT(VARCHAR(10),proDate,120) AS proDate, CONVERT(VARCHAR(10),buyDate,120) AS buyDate, belongTo, remark, recordDate, recordMan, Driver,
	 B.CnName AS driverName 
FROM 
	Para_OA_CarInfo A
	 LEFT JOIN FX_UserInfo B ON A.Driver = B.UserID
ORDER BY sfky ASC");
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString());
                string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
                dataModel.dataList = (List<Para_OA_CarInfo>)JsonConvert.DeserializeObject(jsonData, typeof(List<Para_OA_CarInfo>));
                return Utility.JsonResult(true, null, dataModel);
            }
            catch (Exception ex)
            {
                return Utility.JsonResult(false, ex.Message);
            }
        }

        /// <summary>
        /// 获取数据
        /// </summary>
        /// <param name="userid">当前用户ID</param>
        /// <returns>返回json数据结果</returns>
        [DataAction("loadData", "userid")]
        public string LoadData(string userid)
        {
            //DataSet dataSet = null;
            //SkyLandDeveloper developer = SkyLandDeveloper.FromJson("{}");//获取业务流相关参数
            try
            {
                GetDataModel data = new GetDataModel();
                Para_OA_CarInfo list = new Para_OA_CarInfo();
                data.dataList = Utility.Database.QueryList(list);
                return Utility.JsonResult(true, null, data);
            }
            catch (Exception ex)
            {
                return Utility.JsonResult(false, ex.Message);
            }
        }


        /// <summary>
        /// 保存数据
        /// </summary>
        /// <param name="JsonData">要保存的数据</param>
        /// <returns>反回json结果</returns>
        [DataAction("Save", "JsonData", "userid")]
        public string Save(string JsonData, string userid)
        {
            try
            {
                Para_OA_CarInfo dataObject = JsonConvert.DeserializeObject<Para_OA_CarInfo>(JsonData);
                dataObject.Condition.Add("id=" + dataObject.id);
                //更新或插入主业务信息
                if (Utility.Database.Update<Para_OA_CarInfo>(dataObject) < 1)
                {
                    dataObject.recordDate = DateTime.Now.ToString();
                    dataObject.recordMan = userid;
                    Utility.Database.Insert<Para_OA_CarInfo>(dataObject);
                }
                return Utility.JsonResult(true, "保存成功");
            }
            catch (Exception e)
            {
                return Utility.JsonResult(false, "保存失败！异常信息: " + e.Message); ;//将对象转为json字符串并返回到客户端
            }
        }



        /// <summary>
        /// 获取用户常用语数据模型
        /// </summary>
        public class GetDataModel
        {
            public List<Para_OA_CarInfo> dataList;
            public Para_OA_CarInfo editData = new Para_OA_CarInfo();
        }

        /// <summary>
        /// 删除数据
        /// </summary>
        /// <param name="userid">当前用户ID</param>
        /// <param name="id">主键ID</param>
        /// <returns>返回结果数据集</returns>
        [DataAction("DeleteData", "JsonData", "userid")]
        public string DeleteData(string JsonData, string userid)
        {
            bool success = true;
            IDbTransaction tran = Utility.Database.BeginDbTransaction();//开始事务并返回一个事务对象
            try
            {
                List<Para_OA_CarInfo> list = JsonConvert.DeserializeObject<List<Para_OA_CarInfo>>(JsonData);
                foreach (Para_OA_CarInfo carInfo in list)
                {
                    carInfo.Condition.Add("id = " + carInfo.id);
                    carInfo.sfky = 1;
                    if (Utility.Database.Update<Para_OA_CarInfo>(carInfo, tran) < 1)
                    {
                        success = false;
                        break;
                    }
                }
                if (!success)
                {
                    Utility.Database.Rollback(tran);
                    return Utility.JsonResult(false, "删除失败", null);
                }
                else
                {
                    Utility.Database.Commit(tran);
                    return Utility.JsonResult(true, "删除成功！");
                }

            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex.Message);
                return Utility.JsonResult(false, ex.Message, null);
            }
        }

        [DataAction("GetCarById", "carid")]
        public object GetCarById(string carid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
             try
            {
                Para_OA_CarInfo carInfor = new Para_OA_CarInfo();
                 carInfor.Condition.Add("id="+carid);
               carInfor = Utility.Database.QueryObject<Para_OA_CarInfo>(carInfor, tran);
                return new
                {
                    carInfor = carInfor
                };
            }
             catch (Exception ex)
             {
                 ComBase.Logger(ex);//写日专到本地文件
                 throw (new Exception("获取数据失败！", ex));
             }
        }

        public override string Key
        {
            get
            {
                return "Para_OA_CarInfoSvc";
            }
        }


    }
}
