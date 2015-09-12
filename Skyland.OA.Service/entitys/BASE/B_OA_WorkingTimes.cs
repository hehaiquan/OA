using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_WorkingTimes", "")]
    public class B_OA_WorkingTimes:QueryInfo
    {
        [DataField("WorkingTimesID", "B_OA_WorkingTimes", false)]
        public int WorkingTimesID { get; set; }

        [DataField("WorkingDayID", "B_OA_WorkingTimes")]
        public int WorkingDayID { get; set; }

        [DataField("StartTime", "B_OA_WorkingTimes")]
        public string StartTime { get; set; }

        [DataField("EndTime", "B_OA_WorkingTimes")]
        public string EndTime { get; set; }

        [DataField("DeleteFlag", "B_OA_WorkingTimes")]
        public int DeleteFlag { get; set; }
    }
}
