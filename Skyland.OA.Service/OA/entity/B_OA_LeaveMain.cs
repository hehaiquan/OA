using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{

    [Serializable]
    [DataTableInfo("B_OA_LeaveMain", "leaveid")]
    public class B_OA_LeaveMain : QueryInfo
    {
        #region Model
        private int _leaveid;
        private string _leaver;
        private DateTime? _leavestarttime;
        private DateTime? _leaveendtime;
        private DateTime? _leaveDate;
        private decimal? _totaldays;
        private string _reason;
        private string _remark;
        /// <summary>
        /// 
        /// </summary>
        /// 
         [DataField("leaveId", "B_OA_LeaveMain", false)]
        public int leaveId
        {
            set { _leaveid = value; }
            get { return _leaveid; }
        }

        
        /// <summary>
        /// 备注
        /// </summary>
        /// 
        [DataField("caseId", "B_OA_LeaveMain")]
         public string caseId
        {
            set { _caseId = value; }
            get { return _caseId; }
        }
        private string _caseId;


        /// <summary>
        /// 请假人
        /// </summary>
        /// 
        [DataField("leaver", "B_OA_LeaveMain")]
        public string leaver
        {
            set { _leaver = value; }
            get { return _leaver; }
        }


        /// <summary>
        /// 请假日期
        /// </summary>
        /// 
        [DataField("leaveDate", "B_OA_LeaveMain")]
        public DateTime? leaveDate
        {
            set { _leaveDate = value; }
            get { return _leaveDate; }
        }

        /// <summary>
        /// 请假总天数
        /// </summary>
        /// 
        [DataField("totalDays", "B_OA_LeaveMain")]
        public decimal? totalDays
        {
            set { _totaldays = value; }
            get { return _totaldays; }
        }
        /// <summary>
        /// 
        /// </summary>
        /// 
        [DataField("reason", "B_OA_LeaveMain")]
        public string reason
        {
            set { _reason = value; }
            get { return _reason; }
        }
        /// <summary>
        /// 备注
        /// </summary>
        /// 
        [DataField("remark", "B_OA_LeaveMain")]
        public string remark
        {
            set { _remark = value; }
            get { return _remark; }
        }
        #endregion Model
    }
}
