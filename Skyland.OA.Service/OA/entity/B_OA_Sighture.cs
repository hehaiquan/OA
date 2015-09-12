using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_Sighture", "id")]
    public class B_OA_Sighture : QueryInfo
    {
        [DataField("id", "B_OA_Sighture", false)]
        public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int _id;

        [DataField("caseid", "B_OA_Sighture")]
        public string caseid
        {
            get { return _caseid; }
            set { _caseid = value; }
        }
        private string _caseid;

        [DataField("path", "B_OA_Sighture")]
        public string path
        {
            get { return _path; }
            set { _path = value; }
        }
        private string _path;

        [DataField("tableName", "B_OA_Sighture")]
        public string tableName
        {
            get { return _tableName; }
            set { _tableName = value; }
        }
        private string _tableName;

        [DataField("columnName", "B_OA_Sighture")]
        public string columnName
        {
            get { return _columnName; }
            set { _columnName = value; }
        }
        private string _columnName;

        [DataField("type", "B_OA_Sighture")]
        public string type
        {
            get { return _type; }
            set { _type = value; }
        }
        private string _type;


        [DataField("userid", "B_OA_Sighture")]
        public string userid
        {
            get { return _userid; }
            set { _userid = value; }
        }
        private string _userid;

        /// <summary>
        /// 生成时间
        /// </summary>
        [DataField("createtime", "B_OA_Sighture")]
        public string createtime
        {
            get { return _createtime; }
            set { _createtime = value; }
        }
        private string _createtime;

        /// <summary>
        /// 存入二进制图(只有非转换的图片会有此内容，用于加载数据的时候放入手写控件中）
        /// </summary>
        [DataField("fieldValue", "B_OA_Sighture")]
        public string fieldValue
        {
            get { return _fieldValue; }
            set { _fieldValue = value; }
        }
        private string _fieldValue;

        [DataField("ActID", "B_OA_Sighture")]
        public string ActID { get; set; }
        /// <summary>
        /// 存入二进制图(只有非转换的图片会有此内容，用于加载数据的时候放入手写控件中）
        /// </summary>
        public string CnName
        {
            get { return _CnName; }
            set { _CnName = value; }
        }
        private string _CnName;

        public string ActName { get; set; }//步骤名称
        public string ReceDate { get; set; }//签名时间
    }
}
