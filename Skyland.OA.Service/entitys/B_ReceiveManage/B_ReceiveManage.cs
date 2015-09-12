using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_ReceiveManage", "id")]
    public class B_ReceiveManage:QueryInfo
    {
        #region Model
        private int _id;
        /// <summary>
        /// 主键
        /// </summary>
        [DataField("id", "B_ReceiveManage", false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }

        private string _receiveTime;
        /// <summary>
        /// 接待时间
        /// </summary>
        [DataField("receiveTime", "B_ReceiveManage")]
        public string receiveTime
        {
            set { _receiveTime = value; }
            get { return _receiveTime; }
        }

        private string _receivePersonName;
        /// <summary>
        /// 被接待人姓名
        /// </summary>
        [DataField("receivePersonName", "B_ReceiveManage")]
        public string receivePersonName
        {
            set { _receivePersonName = value; }
            get { return _receivePersonName; }
        }



        private string _organization;
        /// <summary>
        /// 被接待人姓名
        /// </summary>
        [DataField("organization", "B_ReceiveManage")]
        public string organization
        {
            set { _organization = value; }
            get { return _organization; }
        }

        private string _telephone;
        /// <summary>
        /// 接待人电话
        /// </summary>
        [DataField("telephone", "B_ReceiveManage")]
        public string telephone
        {
            set { _telephone = value; }
            get { return _telephone; }
        }

        private string _receiveAddress;
        /// <summary>
        /// 接待地点
        /// </summary>
        [DataField("receiveAddress", "B_ReceiveManage")]
        public string receiveAddress
        {
            set { _receiveAddress = value; }
            get { return _receiveAddress; }
        }

        private string _recordManId;
        /// <summary>
        /// 录入人ID
        /// </summary>
        [DataField("recordManId", "B_ReceiveManage")]
        public string recordManId
        {
            set { _recordManId = value; }
            get { return _recordManId; }
        }

        private string _recordDatetime;
        /// <summary>
        /// 录入日期
        /// </summary>
        [DataField("recordDatetime", "B_ReceiveManage")]
        public string recordDatetime
        {
            set { _recordDatetime = value; }
            get { return _recordDatetime; }
        }
        #endregion
    }
}
