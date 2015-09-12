using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    //FX_Department
    [Serializable]
    [DataTableInfo("FX_Department", "")]
    public class FX_Department : QueryInfo
    {
        /// <summary>
        /// DPID
        /// </summary>		
        [DataField("DPID", "FX_Department")]
        public string DPID
        {
            get { return _dpid; }
            set { _dpid = value; }
        }
        private string _dpid;
        /// <summary>
        /// PDPID
        /// </summary>		
        [DataField("PDPID", "FX_Department")]
        public string PDPID
        {
            get { return _pdpid; }
            set { _pdpid = value; }
        }
        private string _pdpid;
        /// <summary>
        /// DPName
        /// </summary>		
        [DataField("DPName", "FX_Department")]
        public string DPName
        {
            get { return _dpname; }
            set { _dpname = value; }
        }
        private string _dpname;
        /// <summary>
        /// FullName
        /// </summary>		
        [DataField("FullName", "FX_Department")]
        public string FullName
        {
            get { return _fullname; }
            set { _fullname = value; }
        }
        private string _fullname;
        /// <summary>
        /// RankID
        /// </summary>		
        [DataField("RankID", "FX_Department")]
        public string RankID
        {
            get { return _rankid; }
            set { _rankid = value; }
        }
        private string _rankid;

        /// <summary>
        /// RankID
        /// </summary>		
        [DataField("createDate", "FX_Department")]
        public string createDate
        {
            get { return _createDate; }
            set { _createDate = value; }
        }
        private string _createDate;
    }
}