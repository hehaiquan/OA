using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    //Para_ConferenceRoom
    [Serializable]
    [DataTableInfo("Para_ConferenceRoom", "")]
    public class Para_ConferenceRoom : QueryInfo
    {
        /// <summary>
        /// 会议室编号
        /// </summary>		
        [DataField("ConferenceRoomID", "Para_ConferenceRoom")]
        public string ConferenceRoomID
        {
            get { return _conferenceroomid; }
            set { _conferenceroomid = value; }
        }
        private string _conferenceroomid;
        /// <summary>
        /// 会议室名称
        /// </summary>		
        [DataField("ConferenceRoomName", "Para_ConferenceRoom")]
        public string ConferenceRoomName
        {
            get { return _conferenceroomname; }
            set { _conferenceroomname = value; }
        }
        private string _conferenceroomname;
        /// <summary>
        /// 会议室状态：0-未被占用, 1-被占用
        /// </summary>		
        [DataField("ConferenceRoomState", "Para_ConferenceRoom")]
        public int ConferenceRoomState
        {
            get { return _conferenceroomstate; }
            set { _conferenceroomstate = value; }
        }
        private int _conferenceroomstate;
        /// <summary>
        /// 备注
        /// </summary>		
        [DataField("Remark", "Para_ConferenceRoom")]
        public string Remark
        {
            get { return _remark; }
            set { _remark = value; }
        }
        private string _remark;
    }
}