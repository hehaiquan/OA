using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    //B_OA_MeetingRoom（会议室）
    [Serializable]
    [DataTableInfo("B_OA_MeetingRoom", "")]
    public class B_OA_MeetingRoom:QueryInfo
    {
        [DataField("MeetingRoomID", "B_OA_MeetingRoom", false)]
        public int MeetingRoomID { get; set; }

        [DataField("Layer", "B_OA_MeetingRoom")]
        public int Layer { get; set; }

        [DataField("MeetingRoomName", "B_OA_MeetingRoom")]
        public string MeetingRoomName { get; set; }

        [DataField("Number", "B_OA_MeetingRoom")]
        public int Number { get; set; }

        [DataField("Status", "B_OA_MeetingRoom")]
        public int Status { get; set; }

        [DataField("Remark", "B_OA_MeetingRoom")]
        public string Remark { get; set; }

        public bool isCheck { get; set; }
        public string StatusText { get; set; }
        public string Device { get; set; }
    }
}
