using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using IWorkFlow.DataBase;

namespace BizService
{
    [Serializable]
    [DataTableInfo("FX_WorkFlowBusAct", "")]
    public class FX_WorkFlowBusAct : QueryInfo
    {
        [DataField("CaseID", "FX_WorkFlowBusAct")]
        public string CaseID
        {
            get { return this._CaseID; }
            set { this._CaseID = value; }
        }
        string _CaseID;

        [DataField("BAID", "FX_WorkFlowBusAct")]
        public string BAID
        {
            get { return this._BAID; }
            set { this._BAID = value; }
        }
        string _BAID;

        [DataField("ActID", "FX_WorkFlowBusAct")]
        public string ActID
        {
            get { return this._ActID; }
            set { this._ActID = value; }
        }
        string _ActID;

        [DataField("ActName", "FX_WorkFlowBusAct")]
        public string ActName
        {
            get { return this._ActName; }
            set { this._ActName = value; }
        }
        string _ActName;

        [DataField("SendActID", "FX_WorkFlowBusAct")]
        public string SendActID
        {
            get { return this._SendActID; }
            set { this._SendActID = value; }
        }
        string _SendActID;

        [DataField("SendActName", "FX_WorkFlowBusAct")]
        public string SendActName
        {
            get { return this._SendActName; }
            set { this._SendActName = value; }
        }
        string _SendActName;

        [DataField("Sender", "FX_WorkFlowBusAct")]
        public string Sender
        {
            get { return this._Sender; }
            set { this._Sender = value; }
        }
        string _Sender;

        [DataField("SenderName", "FX_WorkFlowBusAct")]
        public string SenderName
        {
            get { return this._SenderName; }
            set { this._SenderName = value; }
        }
        string _SenderName;

        [DataField("UserID", "FX_WorkFlowBusAct")]
        public string UserID
        {
            get { return this._UserID; }
            set { this._UserID = value; }
        }
        string _UserID;

        [DataField("UserName", "FX_WorkFlowBusAct")]
        public string UserName
        {
            get { return this._UserName; }
            set { this._UserName = value; }
        }
        string _UserName;

        [DataField("ReceDate", "FX_WorkFlowBusAct")]
        public DateTime ReceDate
        {
            get { return this._ReceDate; }
            set { this._ReceDate = value; }
        }
        DateTime _ReceDate;

        [DataField("ReceState", "FX_WorkFlowBusAct")]
        public int ReceState
        {
            get { return this._ReceState; }
            set { this._ReceState = value; }
        }
        int _ReceState;

        [DataField("State", "FX_WorkFlowBusAct")]
        public int State
        {
            get { return this._State; }
            set { this._State = value; }
        }
        int _State;

        [DataField("Remark", "FX_WorkFlowBusAct")]
        public string Remark
        {
            get
            {
                return this._Remark;
            }
            set { this._Remark = value; }
        }
        string _Remark;

        [DataField("IsReaded", "FX_WorkFlowBusAct")]
        public int IsReaded
        {
            get { return this._IsReaded; }
            set { this._IsReaded = value; }
        }
        int _IsReaded;

        [DataField("ExpireDate", "FX_WorkFlowBusAct")]
        public DateTime ExpireDate
        {
            get { return this._ExpireDate; }
            set { this._ExpireDate = value; }
        }
        DateTime _ExpireDate;

        #region 计算属性
        /// <summary>
        /// 发送时间（使用场景：审批意见、审批时间)
        /// </summary>	
        public DateTime? SENDDATE
        {
            get { return _senddate; }
            set { _senddate = value; }
        }
        DateTime? _senddate;

        /// <summary>
        /// 发送时间-文本格式
        /// </summary>	
        public string SENDDATE_TEXT
        {
            get { return SENDDATE == null ? string.Empty : SENDDATE.Value.ToString("yyyy-MM-dd HH:mm:ss"); }
        }
        #endregion

    }
}
