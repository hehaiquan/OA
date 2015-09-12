using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_Schedule", "id")]
    class B_OA_Schedule : QueryInfo
    {
        #region Model
        private long _scheduleid;
        private string _schedulename;
        private DateTime? _scheduletime;
        private string _schedulecontent;
        private string _scheduletype;
        private string _leader;
        private string _accompany;
        private string _place;
        private string _remark;
        /// <summary>
        /// 日程ID
        /// </summary>
        /// 
        [DataField("ScheduleId", "B_OA_Schedule", false)]
        public long ScheduleId
        {
            set { _scheduleid = value; }
            get { return _scheduleid; }
        }
        /// <summary>
        /// 日程名称
        /// </summary>
        /// 
         [DataField("ScheduleName", "B_OA_Schedule")]
        public string ScheduleName
        {
            set { _schedulename = value; }
            get { return _schedulename; }
        }
        /// <summary>
        /// 日程时间
        /// </summary>
        /// 
        [DataField("ScheduleTime", "B_OA_Schedule")]
        public DateTime? ScheduleTime
        {
            set { _scheduletime = value; }
            get { return _scheduletime; }
        }
        /// <summary>
        /// 日程内容
        /// </summary>
        /// 
        [DataField("ScheduleContent", "B_OA_Schedule")]
        public string ScheduleContent
        {
            set { _schedulecontent = value; }
            get { return _schedulecontent; }
        }
        /// <summary>
        /// 日程类型，个人、领导
        /// </summary>
        /// 
        [DataField("ScheduleType", "B_OA_Schedule")]
        public string ScheduleType
        {
            set { _scheduletype = value; }
            get { return _scheduletype; }
        }
        /// <summary>
        /// 领导
        /// </summary>
        /// 
        [DataField("Leader", "B_OA_Schedule")]
        public string Leader
        {
            set { _leader = value; }
            get { return _leader; }
        }
        /// <summary>
        /// 陪同人员
        /// </summary>
        /// 
        [DataField("Accompany", "B_OA_Schedule")]
        public string Accompany
        {
            set { _accompany = value; }
            get { return _accompany; }
        }
        /// <summary>
        /// 地点
        /// </summary>
        /// 
        [DataField("Place", "B_OA_Schedule")]
        public string Place
        {
            set { _place = value; }
            get { return _place; }
        }
        /// <summary>
        /// 备注
        /// </summary>
        /// 
        [DataField("Remark", "B_OA_Schedule")]
        public string Remark
        {
            set { _remark = value; }
            get { return _remark; }
        }
        #endregion Model
    }
}
