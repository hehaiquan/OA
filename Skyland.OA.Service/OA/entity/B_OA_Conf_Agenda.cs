using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    //B_OA_Conf_Agenda
    [Serializable]
    [DataTableInfo("B_OA_Conf_Agenda", "id")]
    public class B_OA_Conf_Agenda : QueryInfo
    {
        /// <summary>
        /// id
        /// </summary>		
        [DataField("id", "B_OA_Conf_Agenda",false)]
        public int? id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int? _id;
        /// <summary>
        /// workflowcaseid
        /// </summary>		
        [DataField("workflowcaseid", "B_OA_Conf_Agenda")]
        public string workflowcaseid
        {
            get { return _workflowcaseid; }
            set { _workflowcaseid = value; }
        }
        private string _workflowcaseid;
        /// <summary>
        /// 议程开始时间
        /// </summary>		
        [DataField("kssj", "B_OA_Conf_Agenda")]
        public DateTime? kssj
        {
            get { return _kssj; }
            set { _kssj = value; }
        }
        private DateTime? _kssj;
        /// <summary>
        /// 议程结束时间
        /// </summary>		
        [DataField("jssj", "B_OA_Conf_Agenda")]
        public DateTime? jssj
        {
            get { return _jssj; }
            set { _jssj = value; }
        }
        private DateTime? _jssj;
        /// <summary>
        /// 发言人
        /// </summary>		
        [DataField("fyr", "B_OA_Conf_Agenda")]
        public string fyr
        {
            get { return _fyr; }
            set { _fyr = value; }
        }
        private string _fyr;
        /// <summary>
        /// 议程内容
        /// </summary>		
        [DataField("ycnr", "B_OA_Conf_Agenda")]
        public string ycnr
        {
            get { return _ycnr; }
            set { _ycnr = value; }
        }
        private string _ycnr;
    }
}