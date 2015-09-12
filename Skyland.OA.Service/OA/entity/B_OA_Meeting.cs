using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    //B_OA_Meeting（会议表）
    [Serializable]
    [DataTableInfo("B_OA_Meeting", "")]
    public class B_OA_Meeting : QueryInfo
    {
        [DataField("MeetingID", "B_OA_Meeting", false)]
        public int MeetingID { get; set; }

        [DataField("MeetingRoomID", "B_OA_Meeting")]
        public int MeetingRoomID { get; set; }

        [DataField("OrganizID", "B_OA_Meeting")]
        public string OrganizID { get; set; }

        [DataField("Phone", "B_OA_Meeting")]
        public string Phone { get; set; }

        [DataField("MeetingName", "B_OA_Meeting")]
        public string MeetingName { get; set; }

        [DataField("Presenter", "B_OA_Meeting")]
        public string Presenter { get; set; }

        [DataField("MeetingDate", "B_OA_Meeting")]
        public string MeetingDate { get; set; }

        [DataField("StartTime", "B_OA_Meeting")]
        public string StartTime { get; set; }

        [DataField("EndTime", "B_OA_Meeting")]
        public string EndTime { get; set; }

        [DataField("Number", "B_OA_Meeting")]
        public int Number { get; set; }

        [DataField("Status", "B_OA_Meeting")]
        public int Status { get; set; }

        [DataField("Remark", "B_OA_Meeting")]
        public string Remark { get; set; }

        [DataField("Applicant", "B_OA_Meeting")]
        public string Applicant { get; set; }

        [DataField("CreatTime", "B_OA_Meeting")]
        public string CreatTime { get; set; }

        [DataField("Approver", "B_OA_Meeting")]
        public string Approver { get; set; }

        [DataField("ApprovalTime", "B_OA_Meeting")]
        public string ApprovalTime { get; set; }

        [DataField("ParticipantName", "B_OA_Meeting")]
        public string ParticipantName { get; set; }

        [DataField("CaseID", "B_OA_Meeting")]
        public string CaseID { get; set; }

        [DataField("DpnameID", "B_OA_Meeting")]
        public string DpnameID { get; set; }

        [DataField("NeedDevice", "B_OA_Meeting")]
        public string NeedDevice { get; set; }

        [DataField("Purpose", "B_OA_Meeting")]
        public string Purpose { get; set; }

        //用于列表界面显示
        public string MeetingRoomName { get; set; }
        public string Device { get; set; }
        public bool isCheck { get; set; }
        public string sStartTime { get; set; }
        public string sEndTime { get; set; }
        public string StatusText { get; set; }
        public string MaxNumber { get; set; }
        public string OrganizerName { get; set; }
        public string Dpname { get; set; }
        public string ParticipantNames { get; set; }
        public string ParticipantNameid { get; set; }
    }
}
