using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    // FX_RYLXInfo
    [Serializable]
    [DataTableInfo("FX_RYLXInfo", "ryid")]
    public class FX_RYLXInfo : QueryInfo
    {
        [DataField("ryid","FX_RYLXInfo",false)]
        public int? ryid 
        { 
            get { return _ryid; }
            set { _ryid = value; }
        }
        private int? _ryid;

        [DataField("UserID", "FX_RYLXInfo")]
        public string UserID{get;set;}

        [DataField("UserType", "FX_RYLXInfo")]
        public int UserType { get; set; }

        [DataField("UserNumber", "FX_RYLXInfo")]
        public string UserNumber { get; set; }

        public string UserName { get; set; }
        public string DepartmentName { get; set; }
        public string UserTypeText { get; set; }
    }
}
