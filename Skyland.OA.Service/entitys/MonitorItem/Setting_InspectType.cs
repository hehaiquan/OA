using System;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("Setting_InspectType", "")]
    public class Setting_InspectType : QueryInfo
    {
        [DataField("InspectTypeID", "Setting_InspectType")]
        public int InspectTypeID
        {
            get { return this._InspectTypeID; }
            set { this._InspectTypeID = value; }
        }
        int _InspectTypeID;

        [DataField("SHORTCODE", "Setting_InspectType")]
        public string SHORTCODE
        {
            get { return this._SHORTCODE; }
            set { this._SHORTCODE = value; }
        }
        string _SHORTCODE;

        [DataField("InspectType", "Setting_InspectType")]
        public string InspectType
        {
            get { return this._InspectType; }
            set { this._InspectType = value; }
        }
        string _InspectType;

        [DataField("SAMPLECODEPATTERN", "Setting_InspectType")]
        public string SAMPLECODEPATTERN
        {
            get { return this._SAMPLECODEPATTERN; }
            set { this._SAMPLECODEPATTERN = value; }
        }
        string _SAMPLECODEPATTERN;

        [DataField("MainKind", "Setting_InspectType")]
        public string MainKind
        {
            get { return this._MainKind; }
            set { this._MainKind = value; }
        }
        string _MainKind;

        [DataField("SecondKind", "Setting_InspectType")]
        public string SecondKind
        {
            get { return this._SecondKind; }
            set { this._SecondKind = value; }
        }
        string _SecondKind;

        [DataField("Mapping", "Setting_InspectType")]
        public string Mapping
        {
            get { return this._Mapping; }
            set { this._Mapping = value; }
        }
        string _Mapping;
    }
}
