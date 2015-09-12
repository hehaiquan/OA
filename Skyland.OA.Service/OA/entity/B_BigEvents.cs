using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace  IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_BigEvents", "")]
    public class B_BigEvents:QueryInfo
    {
       
        /// <summary>
        /// 主键
        /// </summary>
        [DataField("id", "B_BigEvents", false)]
        public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int _id;

        /// <summary>
        /// 录入日期
        /// </summary>
        [DataField("recordDate", "B_BigEvents")]
        public string recordDate
        {
            get { return _recordDate; }
            set { _recordDate = value; }
        }
        private string _recordDate;

        /// <summary>
        /// 录入人
        /// </summary>
        [DataField("recordMan", "B_BigEvents")]
        public string recordMan
        {
            get { return _recordMan; }
            set { _recordMan = value; }
        }
        private string _recordMan;

        /// <summary>
        /// 内容
        /// </summary>
        [DataField("substance", "B_BigEvents")]
        public string substance
        {
            get { return _substance; }
            set { _substance = value; }
        }
        private string _substance;

        /// <summary>
        /// 标题
        /// </summary>
        [DataField("title", "B_BigEvents")]
        public string title
        {
            get { return _title; }
            set { _title = value; }
        }
        private string _title;
    }
}
