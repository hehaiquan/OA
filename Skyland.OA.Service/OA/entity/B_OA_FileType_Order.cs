using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_FileType_Order", "id")]
    public class B_OA_FileType_Order : QueryInfo
    {
        /// <summary>
        /// id
        /// </summary>		
        [DataField("id", "B_OA_FileType_Order", false)]
        public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int _id;

        
        /// <summary>
        /// orderDocumentName
        /// </summary>		
        [DataField("orderDocumentName", "B_OA_FileType_Order")]
        public string orderDocumentName
        {
            get { return _orderDocumentName; }
            set { _orderDocumentName = value; }
        }
        private string _orderDocumentName;

        /// <summary>
        /// orderDocumentId
        /// </summary>		
        [DataField("orderDocumentId", "B_OA_FileType_Order")]
        public string orderDocumentId
        {
            get { return _orderDocumentId; }
            set { _orderDocumentId = value; }
        }
        private string _orderDocumentId;

        /// <summary>
        /// userName
        /// </summary>		
        [DataField("userName", "B_OA_FileType_Order")]
        public string userName
        {
            get { return _userName; }
            set { _userName = value; }
        }
        private string _userName;


        /// <summary>
        /// userId
        /// </summary>		
        [DataField("userId", "B_OA_FileType_Order")]
        public string userId
        {
            get { return _userId; }
            set { _userId = value; }
        }
        private string _userId;


        /// <summary>
        /// 文章总数
        /// </summary>		
        public string totalCount
        {
            get { return _totalCount; }
            set { _totalCount = value; }
        }
        private string _totalCount;


        /// <summary>
        /// 跟新时间
        /// </summary>		
        public string updateTime
        {
            get { return _updateTime; }
            set { _updateTime = value; }
        }
        private string _updateTime;
    }
}
