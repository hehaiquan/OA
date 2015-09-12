using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{

    [Serializable]
    [DataTableInfo("B_OA_TravelMain", "travelId")]
    public class B_OA_TravelMain : QueryInfo
    {
        #region Model
        private int _travelid;
        private string _caseid;
        private string _traveler;
        private DateTime? _traveldate;
        private decimal? _totaldays;
        private string _reason;
        private string _remark;
        /// <summary>
        /// 
        /// </summary>
        /// 
        [DataField("travelId", "B_OA_TravelMain", false)]
        public int travelId
        {
            set { _travelid = value; }
            get { return _travelid; }
        }
        /// <summary>
        /// 
        /// </summary>
        /// 
        [DataField("caseId", "B_OA_TravelMain")]
        public string caseId
        {
            set { _caseid = value; }
            get { return _caseid; }
        }
        /// <summary>
        /// 出差人
        /// </summary>
        /// 
        [DataField("traveler", "B_OA_TravelMain")]
        public string traveler
        {
            set { _traveler = value; }
            get { return _traveler; }
        }
        /// <summary>
        /// 申请日期
        /// </summary>
        /// 
        [DataField("travelDate", "B_OA_TravelMain")]
        public DateTime? travelDate
        {
            set { _traveldate = value; }
            get { return _traveldate; }
        }
        /// <summary>
        /// 出差总天数
        /// </summary>
        /// 
        [DataField("totalDays", "B_OA_TravelMain")]
        public decimal? totalDays
        {
            set { _totaldays = value; }
            get { return _totaldays; }
        }
        /// <summary>
        /// 
        /// </summary>
        /// 
        [DataField("reason", "B_OA_TravelMain")]
        public string reason
        {
            set { _reason = value; }
            get { return _reason; }
        }
        /// <summary>
        /// 备注
        /// </summary>
        /// 
        [DataField("remark", "B_OA_TravelMain")]
        public string remark
        {
            set { _remark = value; }
            get { return _remark; }
        }
        #endregion Model
    }
}
