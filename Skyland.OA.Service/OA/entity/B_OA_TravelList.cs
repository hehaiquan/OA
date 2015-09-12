using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{

    [Serializable]
    [DataTableInfo("B_OA_TravelList", "id")]
    public class B_OA_TravelList : QueryInfo
    {
        #region Model
        private int _id;
        private string _caseid;
        private DateTime? _travelstarttime;
        private DateTime? _travelendtime;
        private decimal _totaldays;
        private string _travelstarttime1_sj;
        private string _travelendtime1_sj;
        private decimal _totaldays1_sj;
        /// <summary>
        /// 
        /// </summary>
        /// 
        [DataField("id", "B_OA_TravelList", false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }

        [DataField("carStatus", "B_OA_TravelList")]
        public string carStatus
        {
            set { _carStatus = value; }
            get { return _carStatus; }
        }
        private string _carStatus;
        /// <summary>
        /// 
        /// </summary>
        /// 
        [DataField("caseId", "B_OA_TravelList")]
        public string caseId
        {
            set { _caseid = value; }
            get { return _caseid; }
        }
        /// <summary>
        /// 出差开始日期
        /// </summary>
        /// 
        [DataField("travelStartTime", "B_OA_TravelList")]
        public DateTime? travelStartTime
        {
            set { _travelstarttime = value; }
            get { return _travelstarttime; }
        }
        /// <summary>
        /// 出差结束日期
        /// </summary>
        /// 
        [DataField("travelEndTime", "B_OA_TravelList")]
        public DateTime? travelEndTime
        {
            set { _travelendtime = value; }
            get { return _travelendtime; }
        }
        /// <summary>
        /// 出差总天数
        /// </summary>
        /// 
        [DataField("totalDays", "B_OA_TravelList")]
        public decimal totalDays
        {
            set { _totaldays = value; }
            get { return _totaldays; }
        }
        /// <summary>
        /// 实际出差开始日期
        /// </summary>
        /// 
        [DataField("travelStartTime1_sj", "B_OA_TravelList")]
        public string travelStartTime1_sj
        {
            set { _travelstarttime1_sj = value; }
            get { return _travelstarttime1_sj; }
        }
        /// <summary>
        /// 实际出差结束日期
        /// </summary>
        /// 
        [DataField("travelEndTime1_sj", "B_OA_TravelList")]
        public string travelEndTime1_sj
        {
            set { _travelendtime1_sj = value; }
            get { return _travelendtime1_sj; }
        }
        /// <summary>
        /// 实际出差总天数
        /// </summary>
        /// 
        [DataField("totalDays1_sj", "B_OA_TravelList")]
        public decimal totalDays1_sj
        {
            set { _totaldays1_sj = value; }
            get { return _totaldays1_sj; }
        }

        [DataField("traveler", "B_OA_TravelList")]
        public string traveler { get; set; }

        [DataField("travelAddress", "B_OA_TravelList")]
        public string travelAddress { get; set; }

        [DataField("travelFee", "B_OA_TravelList")]
        public decimal travelFee { get; set; }

        [DataField("remark", "B_OA_TravelList")]
        public string remark { get; set; }

        [DataField("travelReason", "B_OA_TravelList")]
        public string travelReason { get; set; }

        public string travelerName { get; set; }

        //部门
        public string dpname { get; set; }
        //状态
        [DataField("travelStatus", "B_OA_TravelList")]
        public string travelStatus { get; set; }

        public string StatusText { get; set; }
        
        #endregion Model
    }
}
