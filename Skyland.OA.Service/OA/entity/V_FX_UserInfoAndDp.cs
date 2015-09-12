using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{
    [DataTableInfo("V_FX_UserInfoAndDp", "UserID")]
    public class V_FX_UserInfoAndDp : QueryInfo
    {
        [DataField("UserID", "V_FX_UserInfoAndDp")]
        public string UserID
        {
            set { _UserID = value; }
            get { return _UserID; }
        }
        private string _UserID;

        [DataField("CnName", "V_FX_UserInfoAndDp")]
        public string CnName
        {
            set { _CnName = value; }
            get { return _CnName; }
        }
        private string _CnName;

        [DataField("DPName", "V_FX_UserInfoAndDp")]
        public string DPName
        {
            set { _DPName = value; }
            get { return _DPName; }
        }
        private string _DPName;
    }
}
