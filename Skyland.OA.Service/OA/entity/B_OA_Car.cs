using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_Car", "workflowcaseid")]
    public class B_OA_Car : QueryInfo
    {
        #region Model
        /// <summary>
        /// 业务ID
        /// </summary>
        /// 
        [DataField("workflowcaseid", "B_OA_Car")]
        public string workflowcaseid
        {
            set { _workflowcaseid = value; }
            get { return _workflowcaseid; }
        }
        private string _workflowcaseid;

        [DataField("applyDepartment", "B_OA_Car")]
        public string applyDepartment
        {
            set { _applyDepartment = value; }
            get { return _applyDepartment; }
        }
        private string _applyDepartment;

        [DataField("applyDepartmentId", "B_OA_Car")]
        public string applyDepartmentId
        {
            set { _applyDepartmentId = value; }
            get { return _applyDepartmentId; }
        }
        private string _applyDepartmentId;

        [DataField("strartTime", "B_OA_Car")]
        public string strartTime
        {
            set { _strartTime = value; }
            get { return _strartTime; }
        }
        private string _strartTime;

        [DataField("endTime", "B_OA_Car")]
        public string endTime
        {
            set { _endTime = value; }
            get { return _endTime; }
        }
        private string _endTime;

        [DataField("strarDestination", "B_OA_Car")]
        public string strarDestination
        {
            set { _strarDestination = value; }
            get { return _strarDestination; }
        }
        private string _strarDestination;

        [DataField("endDestination", "B_OA_Car")]
        public string endDestination
        {
            set { _endDestination = value; }
            get { return _endDestination; }
        }
        private string _endDestination;

        [DataField("travelReson", "B_OA_Car")]
        public string travelReson
        {
            set { _travelReson = value; }
            get { return _travelReson; }
        }
        private string _travelReson;


        [DataField("personList", "B_OA_Car")]
        public string personList
        {
            set { _personList = value; }
            get { return _personList; }
        }
        private string _personList;


        [DataField("personListId", "B_OA_Car")]
        public string personListId
        {
            set { _personListId = value; }
            get { return _personListId; }
        }
        private string _personListId;


        [DataField("useMan", "B_OA_Car")]
        public string useMan
        {
            set { _useMan = value; }
            get { return _useMan; }
        }
        private string _useMan;

        [DataField("useManId", "B_OA_Car")]
        public string useManId
        {
            set { _useManId = value; }
            get { return _useManId; }
        }
        private string _useManId;

        [DataField("useManPhone", "B_OA_Car")]
        public string useManPhone
        {
            set { _useManPhone = value; }
            get { return _useManPhone; }
        }
        private string _useManPhone;


        [DataField("diverMan", "B_OA_Car")]
        public string diverMan
        {
            set { _diverMan = value; }
            get { return _diverMan; }
        }
        private string _diverMan;


        [DataField("carName", "B_OA_Car")]
        public string carName
        {
            set { _carName = value; }
            get { return _carName; }
        }
        private string _carName;

        [DataField("useDepSign", "B_OA_Car")]
        public string useDepSign
        {
            set { _useDepSign = value; }
            get { return _useDepSign; }
        }
        private string _useDepSign;

        [DataField("remark", "B_OA_Car")]
        public string remark
        {
            set { _remark = value; }
            get { return _remark; }
        }
        private string _remark;

        [DataField("CreatTime", "B_OA_Car")]
        public DateTime? CreatTime
        {
            set { _CreatTime = value; }
            get { return _CreatTime; }
        }
        private DateTime? _CreatTime;

        [DataField("diverManId", "B_OA_Car")]
        public string diverManId
        {
            set { _diverManId = value; }
            get { return _diverManId; }
        }
        private string _diverManId;

        [DataField("carId", "B_OA_Car")]
        public string carId
        {
            set { _carId = value; }
            get { return _carId; }
        }
        private string _carId;


        #endregion Model
    }
}
