using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BizService.Common;
using System.Web;
using System.IO;

namespace BizService.Services
{
    class B_ReceiveManageSvc : BaseDataHandler
    {
          string feilist = "CONVERT(varchar(20),receiveTime,120) as receiveTime,id,receivePersonName,organization,telephone,receiveAddress,recordManId,recordDatetime";
 
        /// <summary>
        /// 加载数据读取信息
        /// </summary>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetData", "userid")]
        public string GetData(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            var data = new B_ReceiveManageSvc.GetDataModel();
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat("select {0} from B_ReceiveManage", feilist);
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                Utility.Database.Commit(tran);
                string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
                data.dataList = (List<B_ReceiveManage>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_ReceiveManage>));
                data.baseInform = new B_ReceiveManage();
                return Utility.JsonResult(true, "数据加载成功", data);//将对象转为json字符串并返回到客户端
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

        /// <summary>
        /// 删除接待信息
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("DeleteData","id", "userid")]
        public string DeleteData(string id,string userid) {
            var tran = Utility.Database.BeginDbTransaction();
             try
             {
                 B_ReceiveManage receiveManage = new B_ReceiveManage();
                 receiveManage.Condition.Add("id="+id);
                 Utility.Database.Delete(receiveManage,tran);
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
        /// 保存接待数据数据
        /// </summary>
        /// <param name="JsonData">前台数据</param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("SaveData", "JsonData", "userid")]
        public string SaveData(string JsonData,string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_ReceiveManage receiveManage = JsonConvert.DeserializeObject<B_ReceiveManage>(JsonData);

                StringBuilder validateTip = new StringBuilder();
                //验证
                if (receiveManage.receiveTime == "" || receiveManage.receiveTime == null)//资产类别
                {
                    validateTip.Append("\r\n录入日期不能为空!");
                }

                if (receiveManage.receivePersonName == "" || receiveManage.receivePersonName == null)//被接待人
                {
                    validateTip.Append("\r\n接待人姓名不能为空!");
                }
                if (validateTip.Length > 0) throw new Exception(validateTip.ToString());

                if (receiveManage.id == 0)
                {
                    //新增
                    receiveManage.recordManId = userid;
                    receiveManage.recordDatetime = DateTime.Now.ToString();
                    Utility.Database.Insert(receiveManage, tran);
                    Utility.Database.Commit(tran);
                    return Utility.JsonResult(true, "保存数据成功");
                }
                else
                {
                    receiveManage.Condition.Add("id=" + receiveManage.id);
                    //修改
                    Utility.Database.Update<B_ReceiveManage>(receiveManage, tran);
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
        /// 获取数据模型
        /// </summary>
        public class GetDataModel
        {
            public List<B_ReceiveManage> dataList;
            public B_ReceiveManage baseInform;
        }


        public override string Key
        {
            get
            {
                return "B_ReceiveManageSvc";
            }
        }
    }
}
