using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{

    [Serializable]
    [DataTableInfo("B_OA_LeaveList", "id")]
    public class B_OA_LeaveList : QueryInfo
    {
        #region Model
        private int _id;
        private DateTime? _leaveStartTime;
        private DateTime? _leaveEndTime;
        private decimal _totalDays;
        /// <summary>
        /// 
        /// </summary>
        /// 
        [DataField("id", "B_OA_LeaveList", false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }

        [DataField("caseId", "B_OA_LeaveList")]
        public string caseId
        {
            set { _caseId = value; }
            get { return _caseId; }
        }
        private string _caseId;


        /// <summ;ary>
        /// 请假开始日期
        /// </summary>
        /// 
        [DataField("leaveStartTime", "B_OA_LeaveList")]
        public DateTime? leaveStartTime
        {
            set { _leaveStartTime = value; }
            get { return _leaveStartTime; }
        }
        /// <summary>
        /// 请假结束日期
        /// </summary>
        /// 
        [DataField("leaveEndTime", "B_OA_LeaveList")]
        public DateTime? leaveEndTime
        {
            set { _leaveEndTime = value; }
            get { return _leaveEndTime; }
        }

        /// <summary>
        /// 
        /// </summary>
        /// 
        [DataField("totalDays", "B_OA_LeaveList")]
        public decimal totalDays
        {
            set { _totalDays = value; }
            get { return _totalDays; }
        }

        [DataField("leaveer", "B_OA_LeaveList")]
        public string leaveer { get; set; }

        [DataField("leaveType", "B_OA_LeaveList")]
        public string leaveType { get; set; }

        [DataField("leaveReason", "B_OA_LeaveList")]
        public string leaveReason { get; set; }

        [DataField("remark", "B_OA_LeaveList")]
        public string remark { get; set; }

        [DataField("actualDays", "B_OA_LeaveList")]
        public decimal actualDays { get; set; }

        [DataField("createDate", "B_OA_LeaveList")]
        public DateTime? createDate { get; set; }

        public string leaveName { get; set; }
        public string leaveTypeText { get; set; }
        public string dpname { get; set; }

        //电子签名
        public string handWriteHtml { get; set; }
        public string handWriteUrl { get; set; }

        #endregion Model
    }
}
