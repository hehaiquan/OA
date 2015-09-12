using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_Notice_ReadRecord", "id")]
    public class B_OA_Notice_ReadRecord : QueryInfo
    {
        /// <summary>
        /// 主键
        /// </summary>
        [DataField("id", "B_OA_Notice_Addvice", false)]
        public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int _id;

        /// <summary>
        /// 阅读人id
        /// </summary>
        [DataField("readId", "B_OA_Notice_Addvice")]
        public string readId
        {
            get { return _readId; }
            set { _readId = value; }
        }
        private string _readId;

        /// <summary>
        /// 阅读人名字
        /// </summary>
        [DataField("readName", "B_OA_Notice_Addvice")]
        public string readName
        {
            get { return _readName; }
            set { _readName = value; }
        }
        private string _readName;

        /// <summary>
        /// 阅读日期
        /// </summary>
        [DataField("readDate", "B_OA_Notice_Addvice")]
        public string readDate
        {
            get { return _readDate; }
            set { _readDate = value; }
        }
        private string _readDate;


        /// <summary>
        /// 文章id 外键
        /// </summary>
        [DataField("noticeId", "B_OA_Notice_Addvice")]
        public string noticeId
        {
            get { return _noticeId; }
            set { _noticeId = value; }
        }
        private string _noticeId;

        /// <summary>
        ///部门名称
        /// </summary>
        public string DPName
        {
            get { return _DPName; }
            set { _DPName = value; }
        }
        private string _DPName;

    }
}
