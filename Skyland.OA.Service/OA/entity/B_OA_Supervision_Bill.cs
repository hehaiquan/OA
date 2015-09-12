using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;


namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_Supervision_Bill", "")]
    public class B_OA_Supervision_Bill : QueryInfo
    {
        /// <summary>
        /// 主键
        /// </summary>
        [DataField("id", "B_OA_Supervision_Bill", false)]
        public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int _id;


        [DataField("year", "B_OA_Supervision_Bill")]
        public string year
        {
            get { return _year; }
            set { _year = value; }
        }
        private string _year;

        [DataField("code", "B_OA_Supervision_Bill")]
        public string code
        {
            get { return _code; }
            set { _code = value; }
        }
        private string _code;

        [DataField("assistManName", "B_OA_Supervision_Bill")]
        public string assistManName
        {
            get { return _assistManName; }
            set { _assistManName = value; }
        }
        private string _assistManName;


        [DataField("assistManId", "B_OA_Supervision_Bill")]
        public string assistManId
        {
            get { return _assistManId; }
            set { _assistManId = value; }
        }
        private string _assistManId;

        [DataField("caseid", "B_OA_Supervision_Bill")]
        public string caseid
        {
            get { return _caseid; }
            set { _caseid = value; }
        }
        private string _caseid;


        [DataField("type", "B_OA_Supervision_Bill")]
        public int type
        {
            get { return _type; }
            set { _type = value; }  
        }
        private int _type;


        [DataField("content", "B_OA_Supervision_Bill")]
        public string content
        {
            get { return _contente; }
            set { _contente = value; }
        }
        private string _contente;

        [DataField("createDate", "B_OA_Supervision_Bill")]
        public string createDate
        {
            get { return _createDate; }
            set { _createDate = value; }
        }
        private string _createDate;

        [DataField("issuerManId", "B_OA_Supervision_Bill")]
        public string issuerManId
        {
            get { return _issuerManId; }
            set { _issuerManId = value; }
        }
        private string _issuerManId;

        [DataField("issuerManName", "B_OA_Supervision_Bill")]
        public string issuerManName
        {
            get { return _issuerManName; }
            set { _issuerManName = value; }
        }
        private string _issuerManName;
    }
}
