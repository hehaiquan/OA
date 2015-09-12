using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IWorkFlow.DataBase;

namespace BizService
{
    [DataTableInfo("FX_WorkFlowCase", "ID")]
    public class FX_WorkFlowCase : QueryInfo
    {
        [DataField("ID", "FX_WorkFlowCase")]
        public string ID
        {
            get { return this._ID; }
            set { this._ID = value; }
        }
        string _ID;

        [DataField("Name", "FX_WorkFlowCase")]
        public string Name
        {
            get { return this._Name; }
            set { this._Name = value; }
        }
        string _Name;

        [DataField("FlowID", "FX_WorkFlowCase")]
        public string FlowID
        {
            get { return this._FlowID; }
            set { this._FlowID = value; }
        }
        string _FlowID;

        [DataField("FlowName", "FX_WorkFlowCase")]
        public string FlowName
        {
            get { return this._FlowName; }
            set { this._FlowName = value; }
        }
        string _FlowName;

        [DataField("CreateDate", "FX_WorkFlowCase")]
        public DateTime CreateDate
        {
            get { return this._CreateDate; }
            set { this._CreateDate = value; }
        }
        DateTime _CreateDate;

        [DataField("Creater", "FX_WorkFlowCase")]
        public string Creater
        {
            get { return this._Creater; }
            set { this._Creater = value; }
        }
        string _Creater;

        [DataField("CreaterCnName", "FX_WorkFlowCase")]
        public string CreaterCnName
        {
            get { return this._CreaterCnName; }
            set { this._CreaterCnName = value; }
        }
        string _CreaterCnName;

        [DataField("IsEnd", "FX_WorkFlowCase")]
        public int IsEnd
        {
            get { return this._IsEnd; }
            set { this._IsEnd = value; }
        }
        int _IsEnd;

        [DataField("LimitDays", "FX_WorkFlowCase")]
        public int LimitDays
        {
            get { return this._LimitDays; }
            set { this._LimitDays = value; }
        }
        int _LimitDays;

        [DataField("Content", "FX_WorkFlowCase")]
        public string Content
        {
            get { return this._Content; }
            set { this._Content = value; }
        }
        string _Content;

        /// <summary>
        /// 此业务当前位置 用于督办业务中查询某事件相关的业务
        /// </summary>
        public string ActName
        {
            get { return this._ActName; }
            set { this._ActName = value; }
        }
        string _ActName;

        //业务当前位置的执行时间 用于督办业务中查询某事件相关的业务
        public string ReceDate
        {
            get { return this._ReceDate; }
            set { this._ReceDate = value; }
        }
        string _ReceDate;
        
    }
}
