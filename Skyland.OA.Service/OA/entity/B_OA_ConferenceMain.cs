using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    //B_OA_ConferenceMain
    [Serializable]
    [DataTableInfo("B_OA_ConferenceMain", "")]
    public class B_OA_ConferenceMain : QueryInfo
    {
        /// <summary>
        /// workflowcaseid
        /// </summary>		
        [DataField("workflowcaseid", "B_OA_ConferenceMain")]
        public string workflowcaseid
        {
            get { return _workflowcaseid; }
            set { _workflowcaseid = value; }
        }
        private string _workflowcaseid;
        /// <summary>
        /// 申请人
        /// </summary>		
        [DataField("sqr", "B_OA_ConferenceMain")]
        public string sqr
        {
            get { return _sqr; }
            set { _sqr = value; }
        }
        private string _sqr;
        /// <summary>
        /// 申请人ID
        /// </summary>		
        [DataField("sqrid", "B_OA_ConferenceMain")]
        public string sqrid
        {
            get { return _sqrid; }
            set { _sqrid = value; }
        }
        private string _sqrid;
        /// <summary>
        /// 申请科室
        /// </summary>		
        [DataField("sqks", "B_OA_ConferenceMain")]
        public string sqks
        {
            get { return _sqks; }
            set { _sqks = value; }
        }
        private string _sqks;
        /// <summary>
        /// 申请科室ID
        /// </summary>		
        [DataField("sqksid", "B_OA_ConferenceMain")]
        public string sqksid
        {
            get { return _sqksid; }
            set { _sqksid = value; }
        }
        private string _sqksid;
        /// <summary>
        /// 会议室ID，关联表Para_BizTypeItem
        /// </summary>		
        [DataField("hysid", "B_OA_ConferenceMain")]
        public string hysid
        {
            get { return _hysid; }
            set { _hysid = value; }
        }
        private string _hysid;
        /// <summary>
        /// 申请日期
        /// </summary>		
        [DataField("sqrq", "B_OA_ConferenceMain")]
        public DateTime? sqrq
        {
            get { return _sqrq; }
            set { _sqrq = value; }
        }
        private DateTime? _sqrq;
        /// <summary>
        /// 需使用的设备
        /// </summary>		
        [DataField("xsysb", "B_OA_ConferenceMain")]
        public string xsysb
        {
            get { return _xsysb; }
            set { _xsysb = value; }
        }
        private string _xsysb;
        /// <summary>
        /// 会议召开时间
        /// </summary>		
        [DataField("zksj", "B_OA_ConferenceMain")]
        public DateTime? zksj
        {
            get { return _zksj; }
            set { _zksj = value; }
        }
        private DateTime? _zksj;
        /// <summary>
        /// 主持人
        /// </summary>		
        [DataField("zcr", "B_OA_ConferenceMain")]
        public string zcr
        {
            get { return _zcr; }
            set { _zcr = value; }
        }
        private string _zcr;
        /// <summary>
        /// 参与人员
        /// </summary>		
        [DataField("cyry", "B_OA_ConferenceMain")]
        public string cyry
        {
            get { return _cyry; }
            set { _cyry = value; }
        }
        private string _cyry;
        /// <summary>
        /// 会议主题
        /// </summary>		
        [DataField("hyzt", "B_OA_ConferenceMain")]
        public string hyzt
        {
            get { return _hyzt; }
            set { _hyzt = value; }
        }
        private string _hyzt;
    }
}