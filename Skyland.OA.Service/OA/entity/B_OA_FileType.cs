using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_FileType", "FileTypeId")]
    public class B_OA_FileType : QueryInfo
    {
        #region Model

        private string _fileTypeId;

        [DataField("FileTypeId", "B_OA_FileType")]
        public string FileTypeId
        {
            set { _fileTypeId = value; }
            get { return _fileTypeId; }
        }

        private string _fileTypeName;

        [DataField("FileTypeName", "B_OA_FileType")]
        public string FileTypeName
        {
            set { _fileTypeName = value; }
            get { return _fileTypeName; }
        }


        private string _parentId;

        [DataField("ParentId", "B_OA_FileType")]
        public string ParentId
        {
            set { _parentId = value; }
            get { return _parentId; }
        }

        private int _orderBy;

        [DataField("OrderBy", "B_OA_FileType")]
        public int OrderBy
        {
            set { _orderBy = value; }
            get { return _orderBy; }
        }

        private string _codePath;

        [DataField("CodePath", "B_OA_FileType")]
        public string CodePath
        {
            set { _codePath = value; }
            get { return _codePath; }
        }

        /// <summary>
        /// 创建时间
        /// </summary>
        private string _createDate;

        [DataField("CreateDate", "B_OA_FileType")]
        public string CreateDate
        {
            set { _createDate = value; }
            get { return _createDate; }
        }

        /// <summary>
        /// 是否有子级
        /// </summary>s
        private bool _isParent;

        [DataField("isParent", "B_OA_FileType")]
        public bool isParent
        {
            set { _isParent = value; }
            get { return _isParent; }
        }

        /// <summary>
        /// 标签（用于区分收发文文档）
        /// </summary>
        [DataField("flagType", "B_OA_FileType")]
        public string flagType
        {
            set { _flagType = value; }
            get { return _flagType; }
        }

        private string _flagType;

        /// <summary>
        ///是否可删除
        /// </summary>
        [DataField("canDelete", "B_OA_FileType")]
        public bool canDelete
        {
            set { _canDelete = value; }
            get { return _canDelete; }
        }

        private bool _canDelete;

        /// <summary>
        ///是否有效
        /// </summary>
        [DataField("isEffective", "B_OA_FileType")]
        public string isEffective
        {
            set { _isEffective = value; }
            get { return _isEffective; }
        }

        private string _isEffective;

        /// <summary>
        ///业务类型
        /// </summary>
        [DataField("sourceType", "B_OA_FileType")]
        public string sourceType
        {
            set { _sourceType = value; }
            get { return _sourceType; }
        }

        private string _sourceType;

        /// <summary>
        ///程序定义表ID外键
        /// </summary>
        [DataField("linkId", "B_OA_FileType")]
        public string linkId
        {
            set { _linkId = value; }
            get { return _linkId; }
        }

        private string _linkId;

        /// <summary>
        ///描述
        /// </summary>
        [DataField("remark", "B_OA_FileType")]
        public string remark
        {
            set { _remark = value; }
            get { return _remark; }
        }

        private string _remark;

        /// <summary>
        ///程序定义名称
        /// </summary>
        public string linkName
        {
            set { _linkName = value; }
            get { return _linkName; }
        }

        private string _linkName;

        /// <summary>
        ///程序定义Url
        /// </summary>
        public string linkUrl
        {
            set { _linkUrl = value; }
            get { return _linkUrl; }
        }

        private string _linkUrl;

        private string _name;
        public string name
        {
            set { _name = value; }
            get { return _name; }
        }

        private bool _visible = true;
        public bool visible
        {
            set { _visible = value; }
            get { return _visible; }
        }

        #endregion
    }
}
