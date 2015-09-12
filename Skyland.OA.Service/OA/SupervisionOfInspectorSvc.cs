using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;


namespace BizService.Services.SuperviseAtTheSameTimeSvc
{
    class SupervisionOfInspectorSvc : BaseDataHandler
    {
        [DataAction("GetDataById", "userid", "id")]
        public string GetDataById(string userid, string id)
        {
            GetDataModel dataModel = new GetDataModel();
            try
            {
                dataModel.supervision = new B_OA_Supervision();
                if (String.IsNullOrEmpty(id))
                {

                    dataModel.supervision.createDate = DateTime.Now.ToString();
                    dataModel.supervision.supervisionManId = userid;
                    dataModel.supervision.status = "1";//未读取的督办
                    dataModel.supervision.supervisionManName = ComClass.GetUserInfo(userid).CnName;

                }
                return Utility.JsonResult(true, null, dataModel);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, ex.Message);
            }
        }

        [DataAction("SaveData", "content", "userid")]
        public string SaveData(string content, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();

            try
            {
                B_OA_Supervision supervision = JsonConvert.DeserializeObject<B_OA_Supervision>(content);
                if (supervision.id <= 0)
                {
                    Utility.Database.Insert(supervision, tran);
                }
                else {
                    Utility.Database.Update(supervision, tran);
                }
                return "";
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, ex.Message);
            }
        }

        public class GetDataModel
        {
            public B_OA_Supervision supervision;
        }

        public override string Key
        {
            get
            {
                return "SupervisionOfInspectorSvc";
            }
        }

    }
}
