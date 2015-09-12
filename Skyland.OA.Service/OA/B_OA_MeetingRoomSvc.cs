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
    public class B_OA_MeetingRoomSvc : BaseDataHandler
    {
        /// <summary>
        /// 获取用户常用语数据模型
        /// </summary>
        public class GetDataModel
        {
            public List<B_OA_MeetingRoom> dataList;
            public B_OA_MeetingRoom editData = new B_OA_MeetingRoom();
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
            strSql.Append(@"SELECT MeetingRoomID ,
                            Layer ,
                            MeetingRoomName ,
                            Number ,
                            (CASE Status WHEN 0 THEN '启用' ELSE '停用' END) AS StatusText,ISNULL(STUFF((SELECT '、' + B.DeviceName FROM
		                    (SELECT MeetingRoomID,DeviceName
		                    FROM B_OA_Device WHERE MeetingRoomID = A.MeetingRoomID)B
		                    FOR XML PATH ('')),1,1,''),'无') AS Device,Remark,Status
                    FROM B_OA_MeetingRoom A ORDER BY MeetingRoomName
            ");
            DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString());
            string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
            dataModel.dataList = (List<B_OA_MeetingRoom>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_MeetingRoom>));
            return Utility.JsonResult(true, null, dataModel);
        }

        /// <summary>
        /// 获取数据
        /// </summary>
        /// <param name="userid">当前用户ID</param>
        /// <returns>返回json数据结果</returns>
        [DataAction("loadData", "userid")]
        public string LoadData(string userid)
        {
            GetDataModel data = new GetDataModel();
            B_OA_MeetingRoom list = new B_OA_MeetingRoom();
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
                B_OA_MeetingRoom dataObject = JsonConvert.DeserializeObject<B_OA_MeetingRoom>(JsonData);
                dataObject.Condition.Add("MeetingRoomID = " + dataObject.MeetingRoomID);
                //更新或插入主业务信息
                StringBuilder strSql = new StringBuilder();
                strSql.Append("SELECT TOP 1 1 FROM B_OA_MeetingRoom WHERE");
                if (dataObject.MeetingRoomID == 0)
                    strSql.Append(" MeetingRoomName = '" + dataObject.MeetingRoomName  + "'");
                else
                {
                    strSql.Append(" MeetingRoomID <> " + dataObject.MeetingRoomID + " AND MeetingRoomName = '" + dataObject.MeetingRoomName + "'");
                }
                DataTable dt = Utility.Database.ExcuteDataSet(strSql.ToString()).Tables[0];
                if(dt.Rows.Count > 0)
                    return Utility.JsonResult(false, "保存失败！\n错误信息：" + dataObject.MeetingRoomName + " 已存在");
                if (Utility.Database.Update<B_OA_MeetingRoom>(dataObject) < 1)
                {
                    Utility.Database.Insert<B_OA_MeetingRoom>(dataObject);
                }
                return Utility.JsonResult(true, "保存成功");
            }
            catch (Exception e)
            {
                return Utility.JsonResult(false, "保存失败！异常信息: " + e.Message); ;//将对象转为json字符串并返回到客户端
            }
        }


        /// <summary>
        /// 删除数据
        /// </summary>
        /// <param name="userid">当前用户ID</param>
        /// <param name="id">主键ID</param>
        /// <returns>返回结果数据集</returns>
        [DataAction("DeleteData", "JsonData", "userid")]
        public string DeleteData(string JsonData,string userid)
        {
            bool success = true;
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                List<B_OA_MeetingRoom> list = JsonConvert.DeserializeObject<List<B_OA_MeetingRoom>>(JsonData);
                foreach (B_OA_MeetingRoom meetingRoom in list)
                {
                    meetingRoom.Condition.Add("MeetingRoomID=" + meetingRoom.MeetingRoomID);
                    meetingRoom.Status = 1;
                    if (Utility.Database.Update<B_OA_MeetingRoom>(meetingRoom) < 1)
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
                return "B_OA_MeetingRoomSvc";
            }
        }
    }
}
