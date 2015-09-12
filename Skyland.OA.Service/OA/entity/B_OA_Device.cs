using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    //B_OA_Device（设备表）
    [Serializable]
    [DataTableInfo("B_OA_Device", "")]
    public class B_OA_Device:QueryInfo
    {
        [DataField("DeviceID", "B_OA_Device", false)]
        public int DeviceID { get; set; }

        [DataField("MeetingRoomID", "B_OA_Device")]
        public int MeetingRoomID { get; set; }

        public B_OA_MeetingRoom MeetingRoom { get; set; }

        [DataField("DeviceName", "B_OA_Device")]
        public String DeviceName { get; set; }

        [DataField("Status", "B_OA_Device")]
        public int Status { get; set; }

        [DataField("Remark", "B_OA_Device")]
        public String Remark { get; set; }

        //用于列表界面显示
        public bool isCheck { get; set; }
        public string MeetingRoomName { get; set; }
        public string StatusText { get; set; }
        
    }
}
