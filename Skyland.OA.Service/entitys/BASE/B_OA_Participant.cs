using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_Participant", "")]
    public class B_OA_Participant : QueryInfo
    {
        [DataField("ParticipantID", "B_OA_Participant", false)]
        public int ParticipantID { get; set; }

        [DataField("MeetingID", "B_OA_Meeting")]
        public int MeetingID { get; set; }

        [DataField("UserID", "B_OA_Meeting")]
        public string UserID { get; set; }

        [DataField("Status", "B_OA_Meeting")]
        public int Status { get; set; }

        [DataField("Remark", "B_OA_Meeting")]
        public string Remark { get; set; }
    }
}
