using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;


namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_Notice_FileType_R", "id")]
    public class B_OA_Notice_FileType_R : QueryInfo
    {
        /// <summary>
        /// 主键
        /// </summary>
        [DataField("id", "B_OA_Notice_FileType_R", false)]
        public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int _id;

        /// <summary>
        /// 文章ID
        /// </summary>
        [DataField("noticeId", "B_OA_Notice_FileType_R")]
        public string noticeId
        {
            get { return _noticeId; }
            set { _noticeId = value; }
        }
        private string _noticeId;

        /// <summary>
        /// 文件夹ID
        /// </summary>
        [DataField("fileTypeId", "B_OA_Notice_FileType_R")]
        public string fileTypeId
        {
            get { return _fileTypeId; }
            set { _fileTypeId = value; }
        }
        private string _fileTypeId;

    }
}
