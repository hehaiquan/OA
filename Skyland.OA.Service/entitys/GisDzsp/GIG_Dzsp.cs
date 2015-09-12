using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("GIG_Dzsp", "id")]
    public class GIG_Dzsp : QueryInfo
    {

        [DataField("id", "GIG_Dzsp", false)]
        public int id
        {
            get { return this._id; }
            set { this._id = value; }
        }
        int _id;

        [DataField("createTime", "GIG_Dzsp")]
        public string createTime
        {

            set { this._createTime = value; }
            get
            {
                if (_createTime != null && _createTime != "")
                {
                    return Convert.ToDateTime(_createTime).ToShortDateString().Replace("/", "-");
                }
                else
                {
                    return null;
                }
            }
        }
        string _createTime;



        [DataField("jsonData", "GIG_Dzsp")]
        public string jsonData
        {
            get { return this._jsonData; }
            set { this._jsonData = value; }
        }
        string _jsonData;

        [DataField("name", "GIG_Dzsp")]
        public string name
        {
            get { return this._name; }
            set { this._name = value; }
        }
        string _name;



        [DataField("creater", "GIG_Dzsp")]
        public string creater
        {
            get { return this._creater; }
            set { this._creater = value; }
        }
        string _creater;

    }
}
