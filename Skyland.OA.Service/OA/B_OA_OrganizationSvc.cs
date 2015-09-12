using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;

namespace BizService.B_OA_OrganizationSvc
{
    public class B_OA_OrganizationSvc : BaseDataHandler
    {
        /// <summary>
        ///  查找组织机构
        /// </summary>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetOrganization", "userid")]
        public object GetOrganization(string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                string sql = @"select * from B_OA_Organization";
                DataSet ds = Utility.Database.ExcuteDataSet(sql, tran);
                DataTable dataTable = ds.Tables[0];
                string jsonData = JsonConvert.SerializeObject(dataTable);
                List<B_OA_Organization> list_Organization = (List<B_OA_Organization>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_Organization>));
                Utility.Database.Commit(tran);
                B_OA_Organization organization = new B_OA_Organization();
                return new
                {
                    list_Organization = list_Organization,
                    organization = organization

                };
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, ex.Message);
            }
        }

        [DataAction("SaveData", "content", "userid")]
        public object SaveData(string content, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_Organization organization = JsonConvert.DeserializeObject<B_OA_Organization>(content);
                if (organization.id <= 0)
                {
                    Utility.Database.Insert(organization, tran);
                }
                else
                {
                    organization.Condition.Add("id =" + organization.id);
                    Utility.Database.Update(organization, tran);
                }
                Utility.Database.Commit(tran);
                return new
                {

                };
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("保存数据失败！", ex));
            }
        }
        [DataAction("DeleteData", "id")]
        public object DeleteData(string id)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_Organization org = new B_OA_Organization();
                org.Condition.Add("id =" + id);
                Utility.Database.Delete(org, tran);
                Utility.Database.Commit(tran);
                return new
                {
                };
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                throw (new Exception("保存数据失败！", ex));
            }
        }

        public override string Key
        {
            get
            {
                return "B_OA_OrganizationSvc";
            }
        }
    }
}
