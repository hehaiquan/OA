using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;
using IWorkFlow.Host;
namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_SendDoc_Inner_QuZhan", "id")]
    public class B_OA_SendDoc_Inner_QuZhan : QueryInfo
    {

        [DataField("id", "B_OA_SendDoc_Inner_QuZhan", false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }
        private int _id;


        [DataField("underTakeDepId", "B_OA_SendDoc_Inner_QuZhan")]
        public string underTakeDepId
        {
            set { _underTakeDepId = value; }
            get { return _underTakeDepId; }
        }
        private string _underTakeDepId;

        [DataField("underTakeDep", "B_OA_SendDoc_Inner_QuZhan")]
        public string underTakeDep
        {
            set { _underTakeDep = value; }
            get { return _underTakeDep; }
        }
        private string _underTakeDep;

        [DataField("title", "B_OA_SendDoc_Inner_QuZhan")]
        public string title
        {
            set { _title = value; }
            get { return _title; }
        }
        private string _title;

        [DataField("content", "B_OA_SendDoc_Inner_QuZhan")]
        public string content
        {
            set { _content = value; }
            get { return _content; }
        }
        private string _content;

        [DataField("remark", "B_OA_SendDoc_Inner_QuZhan")]
        public string remark
        {
            set { _remark = value; }
            get { return _remark; }
        }
        private string _remark;


        [DataField("undertakeMan", "B_OA_SendDoc_Inner_QuZhan")]
        public string undertakeMan
        {
            set { _undertakeMan = value; }
            get { return _undertakeMan; }
        }
        private string _undertakeMan;

        [DataField("underTakeManId", "B_OA_SendDoc_Inner_QuZhan")]
        public string underTakeManId
        {
            set { _underTakeManId = value; }
            get { return _underTakeManId; }
        }
        private string _underTakeManId;

        [DataField("code", "B_OA_SendDoc_Inner_QuZhan")]
        public string code
        {
            set { _code = value; }
            get { return _code; }
        }
        private string _code;

        [DataField("createDate", "B_OA_SendDoc_Inner_QuZhan")]
        public DateTime? createDate
        {
            set { _createDate = value; }
            get { return _createDate; }
        }
        private DateTime? _createDate;

        [DataField("caseId", "B_OA_SendDoc_Inner_QuZhan")]
        public string caseId
        {
            set { _caseId = value; }
            get { return _caseId; }
        }
        private string _caseId;

        [DataField("fileTypeId", "B_OA_SendDoc_Inner_QuZhan")]
        public string fileTypeId
        {
            set { _fileTypeId = value; }
            get { return _fileTypeId; }
        }
        private string _fileTypeId;
    }
}
