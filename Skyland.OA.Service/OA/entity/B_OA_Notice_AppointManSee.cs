using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_Notice_AppointManSee", "id")]
    public class B_OA_Notice_AppointManSee : QueryInfo
    {

        /// <summary>
        /// 主键
        /// </summary>
        [DataField("id", "B_OA_Notice_AppointManSee", false)]
        public int id
        {
            get { return _id; }
            set { _id = value; }
        }
        private int _id;

        /// <summary>
        /// 用户id
        /// </summary>
        [DataField("userid", "B_OA_Notice_AppointManSee")]
        public string userid
        {
            get { return _userid; }
            set { _userid = value; }
        }
        private string _userid;

        /// <summary>
        /// 文章id
        /// </summary>
        [DataField("noticeid", "B_OA_Notice_AppointManSee")]
        public string noticeid
        {
            get { return _noticeid; }
            set { _noticeid = value; }
        }
        private string _noticeid;
    }
}
