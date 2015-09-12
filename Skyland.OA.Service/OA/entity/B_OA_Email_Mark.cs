using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_Email_Mark", "id")]
    public class B_OA_Email_Mark : QueryInfo
    {
        #region Model

        private int _id;
        [DataField("id", "B_OA_Email_Mark",false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }

        private string _markName;
        [DataField("markName", "B_OA_Email_Mark")]
        public string markName
        {
            set { _markName = value; }
            get { return _markName; }
        }

        private string _userid;
        [DataField("userid", "B_OA_Email_Mark")]
        public string userid
        {
            set { _userid = value; }
            get { return _userid; }
        }

        #endregion
    }
}
