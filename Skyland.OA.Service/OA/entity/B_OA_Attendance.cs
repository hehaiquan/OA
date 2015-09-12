using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;


namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_Attendance", "id")]
    public class B_OA_Attendance
    {
        [DataField("id", "B_OA_Attendance", false)]
        public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int _id;

        [DataField("employeeId", "B_OA_Attendance")]
        public string employeeId
        {
            get { return _employeeId; }
            set { _employeeId = value; }
        }
        private string _employeeId;

        [DataField("cardId", "B_OA_Attendance")]
        public string cardId
        {
            get { return _cardId; }
            set { _cardId = value; }
        }
        private string _cardId;

        [DataField("WorkDate", "B_OA_Attendance")]
        public string WorkDate
        {
            get { return _WorkDate; }
            set { _WorkDate = value; }
        }
        private string _WorkDate;

        [DataField("name", "B_OA_Attendance")]
        public string name
        {
            get { return _name; }
            set { _name = value; }
        }
        private string _name;

        [DataField("startWorktime1", "B_OA_Attendance")]
        public string startWorktime1
        {
            get { return _startWorktime1; }
            set { _startWorktime1 = value; }
        }
        private string _startWorktime1;

        [DataField("state1_s", "B_OA_Attendance")]
        public string state1_s
        {
            get { return _state1_s; }
            set { _state1_s = value; }
        }
        private string _state1_s;


        [DataField("endWorktime1", "B_OA_Attendance")]
        public string endWorktime1
        {
            get { return _endWorktime1; }
            set { _endWorktime1 = value; }
        }
        private string _endWorktime1;

        [DataField("state1_e", "B_OA_Attendance")]
        public string state1_e
        {
            get { return _state1_e; }
            set { _state1_e = value; }
        }
        private string _state1_e;

        [DataField("startWorktime2", "B_OA_Attendance")]
        public string startWorktime2
        {
            get { return _startWorktime2; }
            set { _startWorktime2 = value; }
        }
        private string _startWorktime2;

        [DataField("state2_s", "B_OA_Attendance")]
        public string state2_s
        {
            get { return _state2_s; }
            set { _state2_s = value; }
        }
        private string _state2_s;

        [DataField("endWorktime2", "B_OA_Attendance")]
        public string endWorktime2
        {
            get { return _endWorktime2; }
            set { _endWorktime2 = value; }
        }
        private string _endWorktime2;

        [DataField("state2_e", "B_OA_Attendance")]
        public string state2_e
        {
            get { return _state2_e; }
            set { _state2_e = value; }
        }
        private string _state2_e;
    }
}
