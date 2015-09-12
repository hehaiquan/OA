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

namespace BizService.B_EmailDocumentSvc
{
    class B_EmailDocumentSvc : BaseDataHandler
    {

        string FieldList = "id,documentName,illustration,createManId";
        [DataAction("GetData", "userid")]
        public string GetData(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            GetDataModel data = new GetDataModel();
            data.databaseInform = new B_EmailDocument();

            try
            {
                StringBuilder sqlStr = new StringBuilder();
                sqlStr.AppendFormat("select {0} from B_EmailDocument where createManId='{1}' order by id desc", FieldList, userid);

                DataSet dataSet = Utility.Database.ExcuteDataSet(sqlStr.ToString(), tran);
                data.dataList = dataSet.Tables[0];

                Utility.Database.Commit(tran);//提交事务
                return Utility.JsonResult(true, "数据加载成功", data);//将对象转为json字符串并返回到客户端
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "数据加载失败！异常信息: " + e.Message);
            }
        }

        /// <summary>
        /// 刷新
        /// </summary>
        /// <param name="usertid">用户ID</param>
        /// <returns></returns>
        public GetDataModel UpdateData(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            GetDataModel data = new GetDataModel();
            data.databaseInform = new B_EmailDocument();

            StringBuilder sqlStr = new StringBuilder();
            sqlStr.AppendFormat("select {0} from B_EmailDocument where createManId='{1}' order by id desc", FieldList, userid);

            DataSet dataSet = Utility.Database.ExcuteDataSet(sqlStr.ToString(), tran);
            data.dataList = dataSet.Tables[0];

            Utility.Database.Commit(tran);//提交事务
            return data;//将对象转为json字符串并返回到客户端k
        }

        /// <summary>
        /// 保存或者添加数据
        /// </summary>
        /// <param name="前台传入的对象"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("SaveData", "jasonData", "userid")]
        public string SaveData(string jasonData, string userid)
        {

            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_EmailDocument emailDocument = JsonConvert.DeserializeObject<B_EmailDocument>(jasonData);
                if (emailDocument.id =="")
                {
                    emailDocument.createManId = userid;
                    Utility.Database.Insert<B_EmailDocument>(emailDocument, tran);
                }//添加
                else
                {
                    emailDocument.Condition.Add("id=" + emailDocument.id);
                    Utility.Database.Update<B_EmailDocument>(emailDocument, tran);
                }//修改
                Utility.Database.Commit(tran);//提交事务
                return Utility.JsonResult(true, "保存成功", UpdateData(userid));//将对象转为json字符串并返回到客户端
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "保存数据失败！异常信息: " + e.Message);//将对象转为json字符串并返回到客户端
            }
        }

        /// <summary>
        /// 删除数据
        /// </summary>
        /// <param name="id">主键</param>
        /// <returns></returns>
        [DataAction("DeleteData", "id", "userid")]
        public string DeleteData(string id,string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_EmailDocument b_EmailDocument = new B_EmailDocument();
                b_EmailDocument.Condition.Add("id = " + id);//设置查询条件,条件为当前用户ID
                Utility.Database.Delete(b_EmailDocument, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除成功！", UpdateData(userid));
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex);//写日专到本地文件
                return Utility.JsonResult(false, "删除失败:" + ex.Message);
            }
        }

        /// <summary>
        /// 获取数据模型
        /// </summary>
        public class GetDataModel
        {
            public DataTable dataList;
            public B_EmailDocument databaseInform;
        }

        /// <summary>
        /// 保存数据模型
        /// </summary>
        public class SaveDataModel
        {
            public DataTable dataList;
            public B_EmailDocument databaseInform;
        }

        public override string Key
        {
            get
            {
                return "B_EmailDocumentSvc";
            }
        }
    }
}
