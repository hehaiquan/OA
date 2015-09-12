using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_Supervision_Complete", "id")]
    public class B_OA_Supervision_Complete : QueryInfo
    {
        #region Model
        private int _id;

        [DataField("id", "B_OA_Supervision_Complete", false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }

        [DataField("completeDate", "B_OA_Supervision_Complete")]
        public DateTime completeDate
        {
            set { _completeDate = value; }
            get { return _completeDate; }
        }
        private DateTime _completeDate;


        [DataField("completeStatus", "B_OA_Supervision_Complete")]
        public string completeStatus
        {
            set { _completeStatus = value; }
            get { return _completeStatus; }
        }
        private string _completeStatus;


        [DataField("relationcaseid", "B_OA_Supervision_Complete")]
        public string relationcaseid
        {
            set { _relationcaseid = value; }
            get { return _relationcaseid; }
        }
        private string _relationcaseid;
        #endregion Model
    }
}
