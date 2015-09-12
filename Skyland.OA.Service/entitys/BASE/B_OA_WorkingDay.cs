using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_WorkingDay", "")]
    public class B_OA_WorkingDay:QueryInfo
    {
        [DataField("WorkingDayID", "B_OA_WorkingDay", false)]
        public int WorkingDayID { get; set; }

        //班次名称
        [DataField("WorkingDayName", "B_OA_WorkingDay")]
        public string WorkingDayName { get; set; }

        //开始执行日期
        [DataField("BeginExecuteDay", "B_OA_WorkingDay")]
        public string BeginExecuteDay { get; set; }

        [DataField("Monday", "B_OA_WorkingDay")]
        public bool Monday { get; set; }

        [DataField("Tuesday", "B_OA_WorkingDay")]
        public bool Tuesday { get; set; }

        [DataField("Wednesday", "B_OA_WorkingDay")]
        public bool Wednesday { get; set; }

        [DataField("Thursday", "B_OA_WorkingDay")]
        public bool Thursday { get; set; }

        [DataField("Friday", "B_OA_WorkingDay")]
        public bool Friday { get; set; }

        [DataField("Saturday", "B_OA_WorkingDay")]
        public bool Saturday { get; set; }

        [DataField("Sunday", "B_OA_WorkingDay")]
        public bool Sunday { get; set; }

        public string WorkingDay { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string WorkingTime { get; set; }

       
    }
}
