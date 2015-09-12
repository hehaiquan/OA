using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace IWorkFlow.ORM
{

    [Serializable]
    [DataTableInfo("B_GoodsStatusRecord", "id")]
    public class B_GoodsStatusRecord : QueryInfo
    {
        #region Model
        private int _id;
        /// <summary>
        /// 主键
        /// </summary>
        [DataField("id", "B_GoodsStatusRecord", false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }

        private string _recordDate;
        /// <summary>
        /// 录入日期
        /// </summary>
        [DataField("recordDate", "B_GoodsStatusRecord")]
        public string recordDate
        {
            set { _recordDate = value; }
            get { return _recordDate; }
        }

        private string _statusRemark;
        /// <summary>
        /// 备注
        /// </summary>
        [DataField("statusRemark", "B_GoodsStatusRecord")]
        public string statusRemark
        {
            set { _statusRemark = value; }
            get { return _statusRemark; }
        }

        private string _recordManId;
        /// <summary>
        /// 录入人ID
        /// </summary>
        [DataField("recordManId", "B_GoodsStatusRecord")]
        public string recordManId
        {
            set { _recordManId = value; }
            get { return _recordManId; }
        }

        private int _goodsId;
        /// <summary>
        /// 物品ID
        /// </summary>
        [DataField("goodsId", "B_GoodsStatusRecord")]
        public int goodsId
        {
            set { _goodsId = value; }
            get { return _goodsId; }
        }

        private int _isDelete;
        /// <summary>
        /// 是否删除0未删除1删除
        /// </summary>
        [DataField("isDelete", "B_GoodsStatusRecord")]
        public int isDelete
        {
            set { _isDelete = value; }
            get { return _isDelete; }
        }

        private string _deleteDate;
        /// <summary>
        /// 删除日期
        /// </summary>
        [DataField("deleteDate", "B_GoodsStatusRecord")]
        public string deleteDate
        {
            set { _deleteDate = value; }
            get { return _deleteDate; }
        }

        private string _deleteMan;
        /// <summary>
        /// 删除人
        /// </summary>
        [DataField("deleteMan", "B_GoodsStatusRecord")]
        public string deleteMan
        {
            set { _deleteMan = value; }
            get { return _deleteMan; }
        }

        private string _recordMan;
        /// <summary>
        /// 录入人Id
        /// </summary>
        [DataField("recordMan", "B_GoodsStatusRecord")]
        public string recordMan
        {
            set { _recordMan = value; }
            get { return _recordMan; }
        }

        private string _goodsStatus;
        /// <summary>
        /// 录入人Id
        /// </summary>
        [DataField("goodsStatus", "B_GoodsStatusRecord")]
        public string goodsStatus
        {
            set { _goodsStatus = value; }
            get { return _goodsStatus; }
        }

        private string _originalGoodsStatus;
        /// <summary>
        /// 原来物品状态
        /// </summary>
        [DataField("originalGoodsStatus", "B_GoodsStatusRecord")]
        public string originalGoodsStatus
        {
            set { _originalGoodsStatus = value; }
            get { return _originalGoodsStatus; }
        }

        private string _originalUseDepartment;
        /// <summary>
        /// 原来使用部门
        /// </summary>
        [DataField("originalUseDepartment", "B_GoodsStatusRecord")]
        public string originalUseDepartment
        {
            set { _originalUseDepartment = value; }
            get { return _originalUseDepartment; }
        }

        private string _originalProtectMan;
        /// <summary>
        /// 原来保管人员
        /// </summary>
        [DataField("originalProtectMan", "B_GoodsStatusRecord")]
        public string originalProtectMan
        {
            set { _originalProtectMan = value; }
            get { return _originalProtectMan; }
        }


        private string _useDepartment;
        /// <summary>
        /// 使用部门
        /// </summary>
        [DataField("useDepartment", "B_GoodsStatusRecord")]
        public string useDepartment
        {
            set { _useDepartment = value; }
            get { return _useDepartment; }
        }

        private string _protectMan;
        /// <summary>
        /// 保管人员
        /// </summary>
        [DataField("protectMan", "B_GoodsStatusRecord")]
        public string protectMan
        {
            set { _protectMan = value; }
            get { return _protectMan; }
        }

        private string _quitMethod;
        /// <summary>
        ///退出方式
        /// </summary>
        [DataField("quitMethod", "B_GoodsStatusRecord")]
        public string quitMethod
        {
            set { _quitMethod = value; }
            get { return _quitMethod; }
        }
        

        private string _protectManName;
        /// <summary>
        /// 保管人员姓名
        /// </summary>
        public string protectManName {
            set { _protectManName = value; }
            get { return _protectManName; }
        }

        private string _useDepartmentName;
        /// <summary>
        /// 使用部门名称
        /// </summary>
        public string useDepartmentName
        {
            set { _useDepartmentName = value; }
            get { return _useDepartmentName; }
        }

        private string _goodsStatusName;
        /// <summary>
        /// 物品状态名称
        /// </summary>
        public string goodsStatusName
        {
            set { _goodsStatusName = value; }
            get { return _goodsStatusName; }
        }

        private string _recordManName;
        /// <summary>
        /// 录入人名称
        /// </summary>
        public string recordManName
        {
            set { _recordManName = value; }
            get { return _recordManName; }
        }

        private string _originalGoodsStatusName;
        /// <summary>
        /// 物品原始状态名称
        /// </summary>
        public string originalGoodsStatusName
        {
            set { _originalGoodsStatusName = value; }
            get { return _originalGoodsStatusName; }
        }

        private string _originalUseDepartmentName;
        /// <summary>
        /// 物品原始状态名称
        /// </summary>
        public string originalUseDepartmentName
        {
            set { _originalUseDepartmentName = value; }
            get { return _originalUseDepartmentName; }
        }

        private string _originalProtectManName;
        /// <summary>
        /// 物品原始状态名称
        /// </summary>
        public string originalProtectManName
        {
            set { _originalProtectManName = value; }
            get { return _originalProtectManName; }
        }
         
        #endregion
    }
}
