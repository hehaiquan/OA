using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{
    //此类用于文档中心查看
    public class B_OA_DocumentCenter
    {
        private B_OA_FileType _fileType;
        private List<B_OA_Notice> _listNotice;
        private List<B_OA_FileType> _listBread;

        /// <summary>
        /// 文章类别表实体
        /// </summary>
        public B_OA_FileType fileType
        {
            set { _fileType = value; }
            get { return _fileType; }
        }

        /// <summary>
        /// 文章表
        /// </summary>
        public List<B_OA_Notice> listNotice
        {
            set { _listNotice = value; }
            get { return _listNotice; }
        }

        /// <summary>
        /// 面包屑导航
        /// </summary>
        public List<B_OA_FileType> listBread
        {
            set { _listBread = value; }
            get { return _listBread; }
        }
    }
}
