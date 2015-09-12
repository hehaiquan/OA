using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("FX_UserInfo_Add", "")]
    public class FX_UserInfo_Add : QueryInfo
    {
      
        private string _uid;
        [DataField("UID", "FX_UserInfo_Add")]
        public string UID
        {
            set { _uid = value; }
            get { return _uid; }
        }

        private DateTime? _inJobDate;
        [DataField("inJobDate", "FX_UserInfo_Add")]
        public DateTime? inJobDate
        {
            set { _inJobDate = value; }
            get { return _inJobDate; }
        }

        private string _VDay;
        [DataField("VDay", "FX_UserInfo_Add")]
        public string VDay
        {
            set { _VDay = value; }
            get { return _VDay; }
        }


        private string _WYear;
        [DataField("WYear", "FX_UserInfo_Add")]
        public string WYear
        {
            set { _WYear = value; }
            get { return _WYear; }
        }

        private string _UserID;
        public string UserID
        {
            set { _UserID = value; }
            get { return _UserID; }
        }

        private string _EnName;
        public string EnName
        {
            set { _EnName = value; }
            get { return _EnName; }
        }

        private string _CnName;
        public string CnName
        {
            set { _CnName = value; }
            get { return _CnName; }
        }

        private string _PWD;
        public string PWD
        {
            set { _PWD = value; }
            get { return _PWD; }
        }

        private string _Phone;
        public string Phone
        {
            set { _Phone = value; }
            get { return _Phone; }
        }

        private string _DPID;
        public string DPID
        {
            set { _DPID = value; }
            get { return _DPID; }
        }

        private string _RankID;
        public string RankID
        {
            set { _RankID = value; }
            get { return _RankID; }
        }
    }
}
