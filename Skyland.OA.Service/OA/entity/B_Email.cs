using IWorkFlow.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_Email", "ID")]
    public class B_Email : QueryInfo
    {
        #region Model
        private string _id;
        private string _mail_id;
        private string _mail_title;
        private string _mail_sendtext;
        private string _mail_sendpersonid;
        private string _mail_sendpersonname;
        private string _mail_senddate;
        private string _mail_receivepersonid;
        private string _mail_receivepersonname;
        private string _mail_sendattachment;
        private string _mail_deleted = "0";
        private string _mail_deletedperson;
        private string _mail_type = "0";
        private string _mail_createdata;
        private string _mail_issee = "0";
        private bool _del;
        private bool _isSelected;
        private string _MailDocumentType;
        private string _isSeeName;
        /// <summary>
        /// 
        /// </summary>
        /// 
        [DataField("ID", "B_Email")]
        public string ID
        {
            set { _id = value; }
            get { return _id; }
        }
        /// <summary>
        /// 邮件ID
        /// </summary>
        /// 
        [DataField("Mail_ID", "B_Email")]
        public string Mail_ID
        {
            set { _mail_id = value; }
            get { return _mail_id; }
        }

        /// <summary>
        /// 邮件标题
        /// </summary>
        /// 
        [DataField("Mail_Title", "B_Email")]
        public string Mail_Title
        {
            set { _mail_title = value; }
            get { return _mail_title; }
        }
        /// <summary>
        /// 发送内容
        /// </summary>
        /// 
        [DataField("Mail_SendText", "B_Email")]
        public string Mail_SendText
        {
            set { _mail_sendtext = value; }
            get { return _mail_sendtext; }
        }
        /// <summary>
        /// 发送人ID
        /// </summary>
        /// 
        [DataField("Mail_SendPersonId", "B_Email")]
        public string Mail_SendPersonId
        {
            set { _mail_sendpersonid = value; }
            get { return _mail_sendpersonid; }
        }
        /// <summary>
        /// 发送人名
        /// </summary>
        /// 
        [DataField("Mail_SendPersonName", "B_Email")]
        public string Mail_SendPersonName
        {
            set { _mail_sendpersonname = value; }
            get { return _mail_sendpersonname; }
        }
        /// <summary>
        /// 发送时间
        /// </summary>
        /// 
        [DataField("Mail_SendDate", "B_Email")]
        public string Mail_SendDate
        {
            set { _mail_senddate = value; }
            get { return _mail_senddate; }
        }
        /// <summary>
        /// 接收人ID
        /// </summary>
        /// 
        [DataField("Mail_ReceivePersonId", "B_Email")]
        public string Mail_ReceivePersonId
        {
            set { _mail_receivepersonid = value; }
            get { return _mail_receivepersonid; }
        }
        /// <summary>
        /// 接收人名
        /// </summary>
        /// 
        [DataField("Mail_ReceivePersonName", "B_Email")]
        public string Mail_ReceivePersonName
        {
            set { _mail_receivepersonname = value; }
            get { return _mail_receivepersonname; }
        }
        /// <summary>
        /// 邮件附件
        /// </summary>
        /// 
        [DataField("Mail_SendAttachment", "B_Email")]
        public string Mail_SendAttachment
        {
            set { _mail_sendattachment = value; }
            get { return _mail_sendattachment; }
        }

        /// <summary>
        /// 是否被册除, 0未册除,1已删除
        /// </summary>
        /// 
        [DataField("Mail_Deleted", "B_Email")]
        public string Mail_Deleted
        {
            set { _mail_deleted = value; }
            get { return _mail_deleted; }
        }
        /// <summary>
        /// 册除人
        /// </summary>
        /// 
        [DataField("Mail_deletedPerson", "B_Email")]
        public string Mail_deletedPerson
        {
            set { _mail_deletedperson = value; }
            get { return _mail_deletedperson; }
        }
        /// <summary>
        /// 邮件类型,0 未发送,草稿,1已发送
        /// </summary>
        /// 
        [DataField("Mail_Type", "B_Email")]
        public string Mail_Type
        {
            set { _mail_type = value; }
            get { return _mail_type; }
        }
        /// <summary>
        /// 发送时间
        /// </summary>
        /// 
        [DataField("Mail_CreateData", "B_Email")]
        public string Mail_CreateData
        {
            set { _mail_createdata = value; }
            get { return _mail_createdata; }
        }
        /// <summary>
        /// 是否已查看
        /// </summary>
        /// 
        [DataField("Mail_IsSee", "B_Email")]
        public string Mail_IsSee
        {
            set { _mail_issee = value; }
            get { return _mail_issee; }
        }

        /// <summary>
        /// 电子邮件邮箱类型0为收件类型，其他在B_EmailDocument表中
        /// </summary>
        /// 
        [DataField("MailDocumentType", "B_Email")]
        public string MailDocumentType
        {
            set { _MailDocumentType = value; }
            get { return _MailDocumentType; }
        }

        /// <summary>
        /// 是否保存到发件箱
        /// </summary>
        /// 
        private string _CCId;
        [DataField("CCId", "B_Email")]
        public string CCId
        {
            set { _CCId = value; }
            get { return _CCId; }
        }

        /// <summary>
        /// 抄送人名字
        /// </summary>
        /// 
        private string _CCName;
        [DataField("CCName", "B_Email")]
        public string CCName
        {
            set { _CCName = value; }
            get { return _CCName; }
        }


        /// <summary>
        ///密送人ID
        /// </summary>
        /// 
        private string _CCSecretId;
        [DataField("CCSecretId", "B_Email")]
        public string CCSecretId
        {
            set { _CCSecretId = value; }
            get { return _CCSecretId; }
        }

        /// <summary>
        ///密送人名
        /// </summary>
        /// 
        private string _CCSecretIdName;
        [DataField("CCSecretIdName", "B_Email")]
        public string CCSecretIdName
        {
            set { _CCSecretIdName = value; }
            get { return _CCSecretIdName; }
        }

        /// <summary>
        /// 是否保存到发件箱
        /// </summary>
        /// 
        private bool _isSaveSendBox;
        [DataField("isSaveSendBox", "B_Email")]
        public bool isSaveSendBox
        {
            set { _isSaveSendBox = value; }
            get { return _isSaveSendBox; }
        }

        /// <summary>
        /// 是否为重要邮件
        /// </summary>
        /// 
        private bool _isImportant;
        [DataField("isImportant", "B_Email")]
        public bool isImportant
        {
            set { _isImportant = value; }
            get { return _isImportant; }
        }

        /// <summary>
        /// 已读需要回执
        /// </summary>
        /// 
        private bool _isReadReceipt;
        [DataField("isReadReceipt", "B_Email")]
        public bool isReadReceipt
        {
            set { _isReadReceipt = value; }
            get { return _isReadReceipt; }
        }

        /// <summary>
        /// 是否有附件
        /// </summary>
        /// 
        private bool _haveAttachment;
        [DataField("haveAttachment", "B_Email")]
        public bool haveAttachment
        {
            set { _haveAttachment = value; }
            get { return _haveAttachment; }
        }

        /// <summary>
        /// 是否有抄送
        /// </summary>
        /// 
        private bool _isHaveCC;
        [DataField("isHaveCC", "B_Email")]
        public bool isHaveCC
        {
            set { _isHaveCC = value; }
            get { return _isHaveCC; }
        }

        /// <summary>
        /// 是否有密送
        /// </summary>
        /// 
        private bool _isHaveSecretCC;
        [DataField("isHaveSecretCC", "B_Email")]
        public bool isHaveSecretCC
        {
            set { _isHaveSecretCC = value; }
            get { return _isHaveSecretCC; }
        }


        /// <summary>
        /// 收件时间
        /// </summary>
        /// 
        private string _emailRecieveDate;
        [DataField("emailRecieveDate", "B_Email")]
        public string emailRecieveDate
        {
            set { _emailRecieveDate = value; }
            get { return _emailRecieveDate; }
        }

        /// <summary>
        /// 是否收藏
        /// </summary>
        /// 
        private bool _isCollection;
        [DataField("isCollection", "B_Email")]
        public bool isCollection
        {
            set { _isCollection = value; }
            get { return _isCollection; }
        }

        /// <summary>
        /// 是否已回复
        /// </summary>
        /// 
        private bool _haveReply;
        [DataField("haveReply", "B_Email")]
        public bool haveReply
        {
            set { _haveReply = value; }
            get { return _haveReply; }
        }

        /// <summary>
        /// 删除日期
        /// </summary>
        /// 
        private string _mailDeleteDate;
        [DataField("mailDeleteDate", "B_Email")]
        public string mailDeleteDate
        {
            set { _mailDeleteDate = value; }
            get { return _mailDeleteDate; }
        }

        /// <summary>
        /// 标签名称
        /// </summary>
        /// 
        private string _markName;
        [DataField("markName", "B_Email")]
        public string markName
        {
            set { _markName = value; }
            get { return _markName; }
        }

        /// <summary>
        /// 标签ID
        /// </summary>
        /// 
        private string _markId;
        [DataField("markId", "B_Email")]
        public string markId
        {
            set { _markId = value; }
            get { return _markId; }
        }

        /// <summary>
        /// 标签的颜色
        /// </summary>
        /// 
        private string _markColor;
        [DataField("markColor", "B_Email")]
        public string markColor
        {
            set { _markColor = value; }
            get { return _markColor; }
        }


        /// <summary>
        /// 已经转发
        /// </summary>
        /// 
        private bool _hasChangeEmail;
        [DataField("hasChangeEmail", "B_Email")]
        public bool hasChangeEmail
        {
            set { _hasChangeEmail = value; }
            get { return _hasChangeEmail; }
        }

        /// <summary>
        /// 属于谁的Email（因为收发邮件可以相互调换位置，所以此字段用于区别此邮件属于谁的邮件）
        /// </summary>
        /// 
        private string _whosEmailId;
        [DataField("whosEmailId", "B_Email")]
        public string whosEmailId
        {
            set { _whosEmailId = value; }
            get { return _whosEmailId; }
        }

        /// <summary>
        /// 属于谁的Email（因为收发邮件可以相互调换位置，所以此字段用于区别此邮件属于谁的邮件）
        /// </summary>
        /// 
        private string _doucmentName;
        public string doucmentName
        {
            set { _doucmentName = value; }
            get { return _doucmentName; }
        }


        /// <summary>
        /// 已读未读
        /// </summary>
        /// 
        public string isSeeName
        {
            set { _isSeeName = value; }
            get { return _isSeeName; }
        }

        public bool del
        {
            set { _del = value; }
            get { return _del; }
        }

        public bool isSelected
        {
            set { _isSelected = value; }
            get { return _isSelected; }
        }

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


        #endregion Model
    }
}
