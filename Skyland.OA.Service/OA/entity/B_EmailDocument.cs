using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace IWorkFlow.ORM
{
    //发文
    [Serializable]
    [DataTableInfo("B_EmailDocument", "id")]
    public class B_EmailDocument : QueryInfo
    {
        #region Model

        private string _id;//主键
        [DataField("id", "B_EmailDocument")]
        public string id
        {
            set { _id = value; }
            get { return _id; }
        }

        private string _documentName;//文件夹名称
        [DataField("documentName", "B_EmailDocument")]
        public string documentName
        {
            set { _documentName = value; }
            get { return _documentName; }
        }

        private string _illustration;//文件夹备注
        [DataField("illustration", "B_EmailDocument")]
        public string illustration
        {
            set { _illustration = value; }
            get { return _illustration; }
        }

        private string _createManId;//创建人主键
        [DataField("createManId", "B_EmailDocument")]
        public string createManId
        {
            set { _createManId = value; }
            get { return _createManId; }
        }

        private int _unsee;//为查看
        public int unsee
        {
            set { _unsee = value; }
            get { return _unsee; }
        }

        private int _hassee;//已查看
        public int hassee
        {
            set { _hassee = value; }
            get { return _hassee; }
        }

        private int _total;//总数
        public int total
        {
            set { _total = value; }
            get { return _total; }
        }

        //是否同时删除邮件
        private bool _isDeleteDocument;
        public bool isDeleteDocument
        {
            set { _isDeleteDocument = value; }
            get { return _isDeleteDocument; }
        }

        #endregion
    }
}
