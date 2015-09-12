using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_Notice_Addvice", "id")]
    public class B_OA_Notice_Addvice : QueryInfo
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
        /// 意见内容
        /// </summary>
        [DataField("addviceContent", "B_OA_Notice_Addvice")]
        public string addviceContent
        {
            get { return _addviceContent; }
            set { _addviceContent = value; }
        }
        private string _addviceContent;

        /// <summary>
        /// 审核人
        /// </summary>
        [DataField("chkId", "B_OA_Notice_Addvice")]
        public string chkId
        {
            get { return _chkId; }
            set { _chkId = value; }
        }
        private string _chkId;


        /// <summary>
        /// 审核人名字
        /// </summary>
        [DataField("chkName", "B_OA_Notice_Addvice")]
        public string chkName
        {
            get { return _chkName; }
            set { _chkName = value; }
        }
        private string _chkName;

        /// <summary>
        /// 文章关联外键
        /// </summary>
        [DataField("noticeId", "B_OA_Notice_Addvice")]
        public string noticeId
        {
            get { return _noticeId; }
            set { _noticeId = value; }
        }
        private string _noticeId;

        /// <summary>
        /// 审核代号（checkThrough,checkUnthrough,waitCheck）
        /// </summary>
        [DataField("statuType", "B_OA_Notice_Addvice")]
        public string statuType
        {
            get { return _statuType; }
            set { _statuType = value; }
        }
        private string _statuType;

        /// <summary>
        /// 审核名称：待审核 通过 未通过
        /// </summary>
        [DataField("statusName", "B_OA_Notice_Addvice")]
        public string statusName
        {
            get { return _statusName; }
            set { _statusName = value; }
        }
        private string _statusName;

        /// <summary>
        /// 审核时间
        /// </summary>
        [DataField("checkDate", "B_OA_Notice_Addvice")]
        public string checkDate
        {
            get { return _checkDate; }
            set { _checkDate = value; }
        }
        private string _checkDate;


    }
}
