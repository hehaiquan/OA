using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{
    //BBS模块表
    [Serializable]
    [DataTableInfo("B_BBSReply", "rid")]
    public class B_BBSReply : QueryInfo
    {
        #region Model
        private int _rid;

        [DataField("rid", "B_BBSReply", false)]
        public int rid
        {
            set { _rid = value; }
            get { return _rid; }
        }



        private int _RTID;
        [DataField("RTID", "B_BBSReply")]
        public int RTID
        {
            set { _RTID = value; }
            get { return _RTID; }
        }


        private int _RSID;
        [DataField("RSID", "B_BBSReply")]
        public int RSID
        {
            set { _RSID = value; }
            get { return _RSID; }
        }

        private string _RContent;
        [DataField("RContent", "B_BBSReply")]
        public string RContent
        {
            set { _RContent = value; }
            get { return _RContent; }
        }


        private string _RTime;
        [DataField("RTime", "B_BBSReply")]
        public string RTime
        {
            set { _RTime = value; }
            get { return _RTime; }
        }


        private string _RTUID;
        [DataField("RTUID", "B_BBSReply")]
        public string RTUID
        {
            set { _RTUID = value; }
            get { return _RTUID; }
        }


        private string _RTUIDName;
        [DataField("RTUIDName", "B_BBSReply")]
        public string RTUIDName
        {
            set { _RTUIDName = value; }
            get { return _RTUIDName; }
        }

        #endregion
    }
}
