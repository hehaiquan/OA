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
    [DataTableInfo("B_BBSSection", "sid")]
    public class B_BBSSection : QueryInfo
    {
        #region Model

        private int _sid;

        [DataField("sid", "B_BBSSection", false)]
        public int sid
        {
            set { _sid = value; }
            get { return _sid; }
        }

        private string _sName;

        [DataField("sName", "B_BBSSection")]
        public string sName
        {
            set { _sName = value; }
            get { return _sName; }
        }

        private string _sCreateManId;

        [DataField("sCreateManId", "B_BBSSection")]
        public string sCreateManId
        {
            set { _sCreateManId = value; }
            get { return _sCreateManId; }
        }

        private string _sCreateManName;

        [DataField("sCreateManName", "B_BBSSection")]
        public string sCreateManName
        {
            set { _sCreateManName = value; }
            get { return _sCreateManName; }
        }

        private string _sRemark;

        [DataField("sRemark", "B_BBSSection")]
        public string sRemark
        {
            set { _sRemark = value; }
            get { return _sRemark; }
        }

        private int _sClickCount;

        [DataField("sClickCount", "B_BBSSection")]
        public int sClickCount
        {
            set { _sClickCount = value; }
            get { return _sClickCount; }
        }

        private int _sTopicCount;

        [DataField("sTopicCount", "B_BBSSection")]
        public int sTopicCount
        {
            set { _sTopicCount = value; }
            get { return _sTopicCount; }
        }


        #endregion
    }
}
