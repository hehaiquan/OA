using BizService;
using IWorkFlow.Host;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace BizServices.Services.DailyReceiveDocumentSvc
{
    class DailyReceiveDocumentSvc : BaseDataHandler
    {
        [DataAction("QueryMyCase", "userid", "caseid", "baid")]
        public string QueryMyCase(string userid, string caseid, string baid)
        {
            try
            {
                StringBuilder sb = new StringBuilder();
                sb.AppendFormat("select * from FX_WorkFlowCase where FlowID = 'W000058' AND convert(VARCHAR(20),CreateDate, 111) = convert(VARCHAR(20), getdate(),111)");
                DataTable dt = Utility.Database.ExcuteDataSet(sb.ToString()).Tables[0];
                return Utility.JsonResult(true, null, dt);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex.Message);
                return "";
            }
        }

        public override string Key
        {
            get
            {
                return "DailyReceiveDocumentSvc";
            }
        }

    }// class
}
