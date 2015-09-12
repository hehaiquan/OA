using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_Punch", "PunchID")]
    public class B_OA_Punch : QueryInfo
    {
        [DataField("PunchID", "B_OA_Punch", false)]
        public int PunchID { get; set; }

        [DataField("WorkingDayID", "B_OA_Punch")]
        public string WorkingDayID { get; set; }

        [DataField("UserID", "B_OA_Punch")]
        public string UserID { get; set; }

        [DataField("PunchDate", "B_OA_Punch")]
        public string PunchDate { get; set; }

        [DataField("ToWorkTime", "B_OA_Punch")]
        public string ToWorkTime { get; set; }

        [DataField("DownWorkTime", "B_OA_Punch")]
        public string DownWorkTime { get; set; }

        [DataField("Remark", "B_OA_Punch")]
        public string Remark { get; set; }

        public string StartTime { get; set; }
        public string EndTime { get; set; }

        public string StartTimeText { get; set; }
        public string EndTimeText { get; set; }

        //用于查询统计
        public string dpname { get; set; }
        public string userName { get; set; }
        public string countType { get; set; }
        public string yearAttendance { get; set; }
        public string monthAttendance { get; set; }
        public string late { get; set; }
        public string leaveEarly { get; set; }
        public string missing { get; set; }
    }
}
