using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using IWorkFlow.DataBase;
using System.Data;
using IWorkFlow.Host;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_Notice", "NewsId")]
    public class B_OA_Notice : QueryInfo
    {
        #region Model

        /// <summary>
        /// id
        /// </summary>
        /// 
        [DataField("NewsId", "B_OA_Notice")]
        public string NewsId
        {
            set { _NewsId = value; }
            get { return _NewsId; }
        }
        private string _NewsId;

        /// <summary>
        /// 标题
        /// </summary>
        /// 
        [DataField("NewsTitle", "B_OA_Notice")]
        public string NewsTitle
        {
            set { _NewsTitle = value; }
            get { return _NewsTitle; }
        }
        private string _NewsTitle;
        /// <summary>
        /// 类型id
        /// </summary>
        /// 
        [DataField("NewsTypeId", "B_OA_Notice")]
        public string NewsTypeId
        {
            set { _NewsTypeId = value; }
            get { return _NewsTypeId; }
        }
        private string _NewsTypeId;

        /// <summary>
        /// 部门id
        /// </summary>
        /// 
        [DataField("NewsFromDept", "B_OA_Notice")]
        public string NewsFromDept
        {
            set { _NewsFromDept = value; }
            get { return _NewsFromDept; }
        }
        private string _NewsFromDept;

        /// <summary>
        /// 部门名称
        /// </summary>
        /// 
        [DataField("NewsFromDeptName", "B_OA_Notice")]
        public string NewsFromDeptName
        {
            set { _NewsFromDeptName = value; }
            get { return _NewsFromDeptName; }
        }
        private string _NewsFromDeptName;


        /// <summary>
        /// 内容
        /// </summary>
        /// 
        [DataField("NewsText", "B_OA_Notice")]
        public string NewsText
        {
            set { _NewsText = value; }
            get { return _NewsText; }
        }
        private string _NewsText;

        /// <summary>
        /// 新闻图片路径
        /// </summary>
        /// 
        [DataField("NewsImageUrl", "B_OA_Notice")]
        public string NewsImageUrl
        {
            set { _NewsImageUrl = value; }
            get { return _NewsImageUrl; }
        }
        private string _NewsImageUrl;


        /// <summary>
        /// 附件名称
        /// </summary>
        /// 
        [DataField("AttachmentName", "B_OA_Notice")]
        public string AttachmentName
        {
            set { _AttachmentName = value; }
            get { return _AttachmentName; }
        }
        private string _AttachmentName;

        /// <summary>
        /// 文件是否共享
        /// </summary>
        /// 
        [DataField("ShareAttachment", "B_OA_Notice")]
        public string ShareAttachment
        {
            set { _ShareAttachment = value; }
            get { return _ShareAttachment; }
        }
        private string _ShareAttachment;



        /// <summary>
        /// 创建人ID
        /// </summary>
        /// 
        [DataField("CreaterId", "B_OA_Notice")]
        public string CreaterId
        {
            set { _CreaterId = value; }
            get { return _CreaterId; }
        }
        private string _CreaterId;

        /// <summary>
        /// 创建人姓名
        /// </summary>
        /// 
        [DataField("CreateMan", "B_OA_Notice")]
        public string CreateMan
        {
            set { _CreateMan = value; }
            get { return _CreateMan; }
        }
        private string _CreateMan;


        /// <summary>
        /// 创建时间
        /// </summary>
        [DataField("CreateTime", "B_OA_Notice")]
        public string CreateTime
        {
            set { _CreateTime = value; }
            get { return _CreateTime; }

        }
        private string _CreateTime;

        /// <summary>
        /// 审核
        /// </summary>
        /// 
        [DataField("Chk", "B_OA_Notice")]
        public string Chk
        {
            set { _Chk = value; }
            get { return _Chk; }
        }
        private string _Chk = "0";

        /// <summary>
        /// 审核人
        /// </summary>
        /// 
        [DataField("ChkM", "B_OA_Notice")]
        public string ChkM
        {
            set { _ChkM = value; }
            get { return _ChkM; }
        }
        private string _ChkM;

        /// <summary>
        /// 审核人
        /// </summary>
        /// 
        [DataField("ChkMId", "B_OA_Notice")]
        public string ChkMId
        {
            set { _ChkMId = value; }
            get { return _ChkMId; }
        }
        private string _ChkMId;


        /// <summary>
        /// 审核时间
        /// </summary>
        [DataField("Chkdate", "B_OA_Notice")]
        public string Chkdate
        {
            set { _Chkdate = value; }
            get { return _Chkdate; }

        }
        private string _Chkdate;

        //附件路径
        [DataField("AttachmentUrl", "B_OA_Notice")]
        public string AttachmentUrl
        {
            set { _AttachmentUrl = value; }
            get { return _AttachmentUrl; }
        }
        private string _AttachmentUrl;


        //外键相关表OA_FileType，文档中心的目录类型的区分，此字段用来存储ID
        [DataField("documentTypeId", "B_OA_Notice")]
        public string documentTypeId
        {
            set { _documentTypeId = value; }
            get { return _documentTypeId; }
        }
        private string _documentTypeId;

        //外键相关表OA_FileType，文档中心的目录类型的区分，此字段用来存储名称
        [DataField("documentTypeName", "B_OA_Notice")]
        public string documentTypeName
        {
            set { _documentTypeName = value; }
            get { return _documentTypeName; }
        }
        private string _documentTypeName;


        //发布范围 0所有人员查看1指定人员查看
        [DataField("publicRange", "B_OA_Notice")]
        public int publicRange
        {
            set { _publicRange = value; }
            get { return _publicRange; }
        }
        private int _publicRange;



        //指定人员查看用来存储 id
        [DataField("rangeCheckManId", "B_OA_Notice")]
        public string rangeCheckManId
        {
            set { _rangeCheckManId = value; }
            get { return _rangeCheckManId; }
        }
        private string _rangeCheckManId;

        //指定人员查看名字
        [DataField("rangeCheckManName", "B_OA_Notice")]
        public string rangeCheckManName
        {
            set { _rangeCheckManName = value; }
            get { return _rangeCheckManName; }
        }
        private string _rangeCheckManName;

        //是否发布到外网
        [DataField("isPublicToOutLine", "B_OA_Notice")]
        public bool isPublicToOutLine
        {
            set { _isPublicToOutLine = value; }
            get { return _isPublicToOutLine; }
        }
        private bool _isPublicToOutLine;

        //首页弹出通知
        [DataField("isHomeDisplay", "B_OA_Notice")]
        public bool isHomeDisplay
        {
            set { _isHomeDisplay = value; }
            get { return _isHomeDisplay; }
        }
        private bool _isHomeDisplay;


        //会议通知
        [DataField("isConferenceInform", "B_OA_Notice")]
        public bool isConferenceInform
        {
            set { _isConferenceInform = value; }
            get { return _isConferenceInform; }
        }
        private bool _isConferenceInform;

        //阅读记录
        [DataField("isReadRecord", "B_OA_Notice")]
        public bool isReadRecord
        {
            set { _isReadRecord = value; }
            get { return _isReadRecord; }
        }
        private bool _isReadRecord;

        //可对本文发表意见
        [DataField("isTextSuggetion", "B_OA_Notice")]
        public bool isTextSuggetion
        {
            set { _isTextSuggetion = value; }
            get { return _isTextSuggetion; }
        }
        private bool _isTextSuggetion;

        //邮件送达
        [DataField("isSendEmail", "B_OA_Notice")]
        public bool isSendEmail
        {
            set { _isSendEmail = value; }
            get { return _isSendEmail; }
        }
        private bool _isSendEmail;

        //邮件送达人名
        [DataField("sendEmailToManName", "B_OA_Notice")]
        public string sendEmailToManName
        {
            set { _sendEmailToManName = value; }
            get { return _sendEmailToManName; }
        }
        private string _sendEmailToManName;

        //邮件送达人ID
        [DataField("sendEmailToManId", "B_OA_Notice")]
        public string sendEmailToManId
        {
            set { _sendEmailToManId = value; }
            get { return _sendEmailToManId; }
        }
        private string _sendEmailToManId;

        //会议通知截止时间
        [DataField("conferenceEndDate", "B_OA_Notice")]
        public string conferenceEndDate
        {
            set { _conferenceEndDate = value; }
            get { return _conferenceEndDate; }
        }
        private string _conferenceEndDate;



        //会议通知截止时间
        [DataField("status", "B_OA_Notice")]
        public string status
        {
            set { _status = value; }
            get { return _status; }
        }
        private string _status;


        /// <summary>
        ///是否在门户中显示
        /// </summary>
        [DataField("isSeeInDoor", "B_OA_Notice_Addvice")]
        public bool isSeeInDoor
        {
            get { return _isSeeInDoor; }
            set { _isSeeInDoor = value; }
        }
        private bool _isSeeInDoor;

        /// <summary>
        /// 用于收发文或者业务流归档时，通过caseid可查找到审核流程等相关信息
        /// </summary>
        [DataField("caseid", "B_OA_Notice_Addvice")]
        public string caseid
        {
            get { return _caseid; }
            set { _caseid = value; }
        }
        private string _caseid;

        //是否紧急 
        [DataField("isUrgent", "B_OA_Notice")]
        public bool isUrgent
        {
            set { _isUrgent = value; }
            get { return _isUrgent; }
        }
        private bool _isUrgent;


        //审核通过 审核不通过
        public string ChkResultName
        {
            set { _ChkResultName = value; }
            get { return _ChkResultName; }
        }
        private string _ChkResultName;

        //选择
        public bool isSelected
        {
            set { _isSelected = value; }
            get { return _isSelected; }
        }
        private bool _isSelected;



        /// <summary>
        /// 查找文字
        /// </summary>
        private string _sText;
        public string sText
        {
            set { _sText = value; }
            get { return _sText; }
        }

        /// <summary>
        /// check标题
        /// </summary>
        private bool _sCheckTittle;
        public bool sCheckTittle
        {
            set { _sCheckTittle = value; }
            get { return _sCheckTittle; }
        }


        /// <summary>
        /// check正文
        /// </summary>
        private bool _sCheckText;
        public bool sCheckText
        {
            set { _sCheckText = value; }
            get { return _sCheckText; }
        }

        /// <summary>
        /// 开始时间
        /// </summary>
        private string _sDate;
        public string sDate
        {
            set { _sDate = value; }
            get { return _sDate; }
        }

        /// <summary>
        /// 结束时间
        /// </summary>
        private string _sEndDate;
        public string sEndDate
        {
            set { _sEndDate = value; }
            get { return _sEndDate; }
        }

        /// <summary>
        /// 部门名称
        /// </summary>
        public string DPName
        {
            set { _DPName = value; }
            get { return _DPName; }
        }
        private string _DPName;


        #endregion Model

    }
}
