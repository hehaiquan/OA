using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_FileType_DefineLink", "id")]
    public class B_OA_FileType_DefineLink:QueryInfo
    {
        private int _id;

        [DataField("id", "B_OA_FileType_DefineLink", false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }

        private string _name;
        [DataField("name", "B_OA_FileType_DefineLink")]
        public string name
        {
            set { _name = value; }
            get { return _name; }
        }

        private string _linkName;
        [DataField("linkName", "B_OA_FileType_DefineLink")]
        public string linkName
        {
            set { _linkName = value; }
            get { return _linkName; }
        }


        private string _sort;
        [DataField("sort", "B_OA_FileType_DefineLink")]
        public string sort
        {
            set { _sort = value; }
            get { return _sort; }
        }

        private string _isEffective;
        [DataField("isEffective", "B_OA_FileType_DefineLink")]
        public string isEffective
        {
            set { _isEffective = value; }
            get { return _isEffective; }
        }

        private string _remark;
        [DataField("remark", "B_OA_FileType_DefineLink")]
        public string remark
        {
            set { _remark = value; }
            get { return _remark; }
        }
    }
}
