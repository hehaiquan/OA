using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    // CreateDoc
    [Serializable]
    [DataTableInfo("B_Common_CreateDoc", "")]
    public class B_Common_CreateDoc : QueryInfo
    {
        /// <summary>
        /// 编号
        /// </summary>
        [DataField("id", "B_Common_CreateDoc", false)]
        public int? id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int? _id;

        /// <summary>
        /// caseid（记录业务的caseid）
        /// </summary>
        [DataField("caseid", "B_Common_CreateDoc")]
        public string caseid
        {
            get { return _caseid; }
            set { _caseid = value; }
        }
        private string _caseid;

        /// <summary>
        /// 文件类型（如现场监察、行政处罚等，用英文）
        /// </summary>
        [DataField("type", "B_Common_CreateDoc")]
        public string type
        {
            get { return _type; }
            set { _type = value; }
        }
        private string _type;

        /// <summary>
        /// 文件名（caseid+type+年月日时分秒.doc）
        /// </summary>
        [DataField("filename", "B_Common_CreateDoc")]
        public string filename
        {
            get { return _filename; }
            set { _filename = value; }
        }
        private string _filename;

        /// <summary>
        /// 创建人
        /// </summary>
        [DataField("createman", "B_Common_CreateDoc")]
        public string createman
        {
            get { return _createman; }
            set { _createman = value; }
        }
        private string _createman;

        /// <summary>
        /// 创建时间
        /// </summary>
        [DataField("createdate", "B_Common_CreateDoc")]
        public DateTime? createdate
        {
            get { return _createdate; }
            set { _createdate = value; }
        }
        private DateTime? _createdate;

        /// <summary>
        /// 文档类别
        /// </summary>
        [DataField("docType", "B_Common_CreateDoc")]
        public string docType
        {
            get { return _docType; }
            set { _docType = value; }
        }
        private string _docType;

    }// class
}
