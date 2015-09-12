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
    [DataTableInfo("B_BBSTopic", "tid")]
    public class B_BBSTopic : QueryInfo
    {
        #region Model
        private int _tid;

        [DataField("tid", "B_BBSTopic", false)]
        public int tid
        {
            set { _tid = value; }
            get { return _tid; }
        }

        /// <summary>
        /// 主贴标号
        /// </summary>
        private string _tNumber;
        [DataField("tNumber", "B_BBSTopic")]
        public string tNumber
        {
            set { _tNumber = value; }
            get { return _tNumber; }
        }

        /// <summary>
        /// 模块ID
        /// </summary>
        private int _tsid;
        [DataField("tsid", "B_BBSTopic")]
        public int tsid
        {
            set { _tsid = value; }
            get { return _tsid; }
        }

        /// <summary>
        /// 创建人名称
        /// </summary>
        private string _tCreateUserName;
        [DataField("tCreateUserName", "B_BBSTopic")]
        public string tCreateUserName
        {
            set { _tCreateUserName = value; }
            get { return _tCreateUserName; }
        }


        /// <summary>
        /// 创建人ID
        /// </summary>
        private string _tCreateUserId;
        [DataField("tCreateUserId", "B_BBSTopic")]
        public string tCreateUserId
        {
            set { _tCreateUserId = value; }
            get { return _tCreateUserId; }
        }

        /// <summary>
        /// 主贴标题
        /// </summary>
        private string _tTopic;
        [DataField("tTopic", "B_BBSTopic")]
        public string tTopic
        {
            set { _tTopic = value; }
            get { return _tTopic; }
        }


        /// <summary>
        /// 主贴正文
        /// </summary>
        private string _tContents;
        [DataField("tContents", "B_BBSTopic")]
        public string tContents
        {
            set { _tContents = value; }
            get { return _tContents; }
        }


        /// <summary>
        /// 发帖时间
        /// </summary>
        private string _tCreateTime;
        [DataField("tCreateTime", "B_BBSTopic")]
        public string tCreateTime
        {
            set { _tCreateTime = value; }
            get { return _tCreateTime; }
        }

        /// <summary>
        /// 点击次数
        /// </summary>
        private int _tClickCount;
        [DataField("tClickCount", "B_BBSTopic")]
        public int tClickCount
        {
            set { _tClickCount = value; }
            get { return _tClickCount; }
        }

        /// <summary>
        /// 回帖数量
        /// </summary>
        private int _replyCount;
        public int replyCount {
            set { _replyCount = value; }
            get { return _replyCount; }
        }

        #endregion
    }
}
