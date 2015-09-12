using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using System.Data;

namespace BizService.Services.Common
{
    public class B_OA_DeviceSvc : BaseDataHandler
    {
        /// <summary>
        /// 获取用户常用语数据模型
        /// </summary>
        public class GetDataModel
        {
            public List<B_OA_Device> dataList;
            public B_OA_Device editData = new B_OA_Device();
        }

        /// <summary>
        /// 获取会议数据
        /// </summary>
        /// <param name="userid">当前用户ID</param>
        /// <returns>返回json数据结果</returns>
        [DataAction("GetData", "userid")]
        public string GetData(string userid)
        {
            StringBuilder strSql = new StringBuilder();
            GetDataModel dataModel = new GetDataModel();
            strSql.Append(@"SELECT  
	DeviceID ,A.MeetingRoomID ,DeviceName ,A.Status ,A.Remark,
	B.MeetingRoomName,(CASE A.Status WHEN 0 THEN '正常' ELSE '损坏' END) AS StatusText
FROM 
	B_OA_Device A
	INNER JOIN B_OA_MeetingRoom B ON B.MeetingRoomID = A.MeetingRoomID
 ORDER BY B.MeetingRoomName");

            DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString());
            string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
            dataModel.dataList = (List<B_OA_Device>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_Device>));
            return Utility.JsonResult(true, null, dataModel);
        }

        /// <summary>
        /// 获取数据
        /// </summary>
        /// <param name="userid">当前用户ID</param>
        /// <returns>返回json数据结果</returns>
        [DataAction("loadData", "userid")]
        public string LoadData(string cph, string sfky, string userid)
        {
            GetDataModel data = new GetDataModel();
            B_OA_Device list = new B_OA_Device();
            data.dataList = Utility.Database.QueryList(list);
            return Utility.JsonResult(true, null, data);
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
                B_OA_Device dataObject = JsonConvert.DeserializeObject<B_OA_Device>(JsonData);
                dataObject.Condition.Add("DeviceID=" + dataObject.DeviceID);
                //更新或插入主业务信息
                StringBuilder strSql = new StringBuilder();
                strSql.Append("SELECT TOP 1 1 FROM B_OA_Device WHERE");
                strSql.Append(" DeviceID <> " + dataObject.DeviceID + " AND MeetingRoomID = " + dataObject.MeetingRoomID + " AND DeviceName = '" + dataObject.DeviceName + "'");
                DataTable dt = Utility.Database.ExcuteDataSet(strSql.ToString()).Tables[0];
                if (dt.Rows.Count > 0)
                    return Utility.JsonResult(false, "保存失败！\n错误信息：" + dataObject.DeviceName + " 已存在");
                if (Utility.Database.Update<B_OA_Device>(dataObject) < 1)
                {
                    Utility.Database.Insert<B_OA_Device>(dataObject);
                }
                return Utility.JsonResult(true, "保存成功");
            }
            catch (Exception e)
            {
                return Utility.JsonResult(false, "保存数据失败！异常信息: " + e.Message); ;//将对象转为json字符串并返回到客户端
            }
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
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                List<B_OA_Device> list = JsonConvert.DeserializeObject<List<B_OA_Device>>(JsonData);
                foreach (B_OA_Device device in list)
                {
                    device.Condition.Add("DeviceID = " + device.DeviceID);
                    if (Utility.Database.Delete(device, tran) < 1)
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

        public override string Key
        {
            get
            {
                return "B_OA_DeviceSvc";
            }
        }

    }
}
