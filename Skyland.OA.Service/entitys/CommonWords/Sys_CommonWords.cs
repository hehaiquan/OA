using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    //Sys_CommonWords
    [Serializable]
    [DataTableInfo("Sys_CommonWords", "")]
    public class Sys_CommonWords : QueryInfo
    {
        /// <summary>
        /// 自动增长ID
        /// </summary>		
        [DataField("ID", "Sys_CommonWords")]
        public int? ID
        {
            get { return _id; }
            set { _id = value; }
        }
        private int? _id;
        /// <summary>
        /// 常用语
        /// </summary>		
        [DataField("WordsItem", "Sys_CommonWords")]
        public string WordsItem
        {
            get { return _wordsitem; }
            set { _wordsitem = value; }
        }
        private string _wordsitem;
        /// <summary>
        /// 用户UID
        /// </summary>		
        [DataField("UserID", "Sys_CommonWords")]
        public string UserID
        {
            get { return _userid; }
            set { _userid = value; }
        }
        private string _userid;
        /// <summary>
        /// 录入控件的全局路径标识
        /// </summary>		
        [DataField("ControlUrl", "Sys_CommonWords")]
        public string ControlUrl
        {
            get { return _controlurl; }
            set { _controlurl = value; }
        }
        private string _controlurl;
    }
}