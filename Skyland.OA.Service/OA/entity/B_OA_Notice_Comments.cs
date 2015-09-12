using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;


namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_Notice_Comments", "id")]
    public class B_OA_Notice_Comments:QueryInfo
    {
        /// <summary>
        /// 主键
        /// </summary>
        [DataField("id", "B_OA_Notice_Comments", false)]
        public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int _id;

        /// <summary>
        /// 评论内容
        /// </summary>
        [DataField("content", "B_OA_Notice_Comments")]
        public string content
        {
            get { return _content; }
            set { _content = value; }
        }
        private string _content;


        /// <summary>
        /// 文章ID
        /// </summary>
        [DataField("noticeId", "B_OA_Notice_Comments")]
        public string noticeId
        {
            get { return _noticeId; }
            set { _noticeId = value; }
        }
        private string _noticeId;

        /// <summary>
        /// 评论人ID
        /// </summary>
        [DataField("userid", "B_OA_Notice_Comments")]
        public string userid
        {
            get { return _userid; }
            set { _userid = value; }
        }
        private string _userid;


        /// <summary>
        /// 评论人姓名
        /// </summary>
        [DataField("userName", "B_OA_Notice_Comments")]
        public string userName
        {
            get { return _userName; }
            set { _userName = value; }
        }
        private string _userName;
        
        /// <summary>
        /// 评论时间
        /// </summary>
        [DataField("commentDate", "B_OA_Notice_Comments")]
        public string commentDate
        {
            get { return _commentDate; }
            set { _commentDate = value; }
        }
        private string _commentDate;

        /// <summary>
        /// 点赞
        /// </summary>
        [DataField("support", "B_OA_Notice_Comments")]
        public int support
        {
            get { return _support; }
            set { _support = value; }
        }
        private int _support;

        public string DPName
        {
            get { return _DPName; }
            set { _DPName = value; }
        }
        private string _DPName;
        
    }
}
