using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IWorkFlow.DataBase;


namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_SendDoc_R", "id")]
    public class B_OA_SendDoc_R : QueryInfo
    {

        private int _id;
        [DataField("id", "B_OA_SendDoc_R", false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }

        private string _caseId;
        [DataField("caseId", "B_OA_SendDoc_R")]
        public string caseId
        {
            set { _caseId = value; }
            get { return _caseId; }
        }

        private string _wId;
        [DataField("wId", "B_OA_SendDoc_R")]
        public string wId
        {
            set { _wId = value; }
            get { return _wId; }
        }

        private string _actId;
        [DataField("actId", "B_OA_SendDoc_R")]
        public string actId
        {
            set { _actId = value; }
            get { return _actId; }
        }
        

        private string _filePath;
        [DataField("filePath", "B_OA_SendDoc_R")]
        public string filePath
        {
            set { _filePath = value; }
            get { return _filePath; }
        }

        private string _triggerActId;
        [DataField("triggerActId", "B_OA_SendDoc_R")]
        public string triggerActId
        {
            set { _triggerActId = value; }
            get { return _triggerActId; }
        }

        private string _relationCaseId;
        [DataField("relationCaseId", "B_OA_SendDoc_R")]
        public string relationCaseId
        {
            set { _relationCaseId = value; }
            get { return _relationCaseId; }
        }
        
    }
}
