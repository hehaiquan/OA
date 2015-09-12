using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BizService.Services;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;

namespace BizService.B_PhoneRecordSvc
{
    public class B_PhoneRecordSvc : BaseDataHandler
    {
        string feilist = "CONVERT(varchar(20),newTB.recordDate,120) as recordDate,newTB.id,newTB.incomeManName,newTB.incomeOrgnization,newTB.incomePhoneNumber,newTB.answerMan,newTB.answerOrgnization,newTB.mainTitle,newTB.todoSomething,newTB.toDoManId,newTB.eventStatus,a1.CnName as todoManName";

        [DataAction("GetData", "userid")]
        public string GetData(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            var data = new B_PhoneRecordSvc.GetDataModel();

            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat("select {0} from B_PhoneRecord as newTB left join FX_UserInfo as a1 on newTB.toDoManId=a1.UserID  order by recordDate desc", feilist);
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                Utility.Database.Commit(tran);
                string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
                data.dataList = (List<B_PhoneRecord>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_PhoneRecord>));
                data.baseInform = new B_PhoneRecord();
                data.baseInform.recordDate = DateTime.Now.ToString();

                return Utility.JsonResult(true, "数据加载成功", data);//将对象转为json字符串并返回到客户端
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }


        /// <summary>
        /// 保存与修改电话记录
        /// </summary>
        /// <param name="JsonData">前台数据</param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("SaveData", "JsonData", "userid")]
        public string SaveData(string JsonData, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder validateTip = new StringBuilder();//验证提示
            try
            {

                B_PhoneRecord phoneRecord = JsonConvert.DeserializeObject<B_PhoneRecord>(JsonData);

             //验证信息
                if(phoneRecord.recordDate==null||phoneRecord.recordDate==""){
                    validateTip.Append("\r\n录入日期不能为空！");
                }
                if(validateTip.Length>0) throw new Exception(validateTip.ToString());
                
                if (phoneRecord.id == 0 )
                {
                    //新增
                    Utility.Database.Insert(phoneRecord, tran);
                    Utility.Database.Commit(tran);
                    return Utility.JsonResult(true, "保存数据成功");
                }
                else
                {
                    phoneRecord.Condition.Add("id=" + phoneRecord.id);
                    //修改
                    Utility.Database.Update<B_PhoneRecord>(phoneRecord, tran);
                    Utility.Database.Commit(tran);
                    return Utility.JsonResult(true, "保存数据成功");
                }
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据保存失败！异常信息: " + e.Message);
            }
        }


        /// <summary>
        /// 删除电话记录信息
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("DeleteData", "id", "userid")]
        public string DeleteData(string id, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_PhoneRecord phoneRecord = new B_PhoneRecord();
                phoneRecord.Condition.Add("id=" + id);
                Utility.Database.Delete(phoneRecord, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除成功！");
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

        /// <summary>
        /// 获取数据模型
        /// </summary>
        public class GetDataModel
        {
            public List<B_PhoneRecord> dataList;
            public B_PhoneRecord baseInform;
        }


        public override string Key
        {
            get
            {
                return "B_PhoneRecordSvc";
            }
        }
    }
}
