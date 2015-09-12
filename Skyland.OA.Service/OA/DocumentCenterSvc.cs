using BizService.Common;
using IWorkFlow.BaseService;
using IWorkFlow.DataBase;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Web;
namespace BizService.Services
{
    public class DocumentCenterSvc : BaseDataHandler
    {
        /// <summary>
        /// 查找所有树状图
        /// </summary>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetData", "userid")]
        public string GetData(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            DataSet dataSet = null;
            try
            {
                string sql =
                    @"select DPID as FileTypeId,DPName as FileTypeName,'0' as ParentId,('0/'+DPID) as CodePath  from FX_Department 
                          union all
                          select FileTypeId,FileTypeName,ParentId,CodePath from B_OA_FileType";
                dataSet = Utility.Database.ExcuteDataSet(sql, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, null, dataSet.Tables[0]); //将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                throw (new Exception("获取数据失败！", ex));
            }
        }


        /// <summary>
        /// 通过类别ID目录查找文章
        /// </summary>
        /// <param name="fileTypeId">类别ID</param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetArtistByFileTypeId", "fileTypeId", "userid")]
        public string GetArtistByFileTypeId(string fileTypeId, string userid)
        {

            var tran = Utility.Database.BeginDbTransaction();
            DataSet dataSet = null;
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat("select * from B_OA_Notice where documentTypeId='{0}'", fileTypeId);
                dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, null, dataSet.Tables[0]); //将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                throw (new Exception("获取数据失败！", ex));
            }
        }

        /// <summary>
        /// 添加和修改
        /// </summary>
        /// <param name="JsonData"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        [DataAction("SaveData", "JsonData", "userid")]
        public string SaveData(string JsonData, string userId)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_FileType fileType = JsonConvert.DeserializeObject<B_OA_FileType>(JsonData);
                if (fileType.FileTypeId == null || fileType.FileTypeId == "") //增加
                {
                    fileType.FileTypeId = ComClass.GetGuid();
                    //fileType.CodePath = fileType.CodePath + "/" + fileType.FileTypeId;
                    Utility.Database.Insert<B_OA_FileType>(fileType, tran);
                    Utility.Database.Commit(tran);
                    return Utility.JsonResult(true, "保存成功");
                }
                else
                {
                    //修改
                    fileType.Condition.Add("FileTypeId=" + fileType.FileTypeId);
                    Utility.Database.Update<B_OA_FileType>(fileType, tran);
                    Utility.Database.Commit(tran);
                    return Utility.JsonResult(true, "保存成功");
                }
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                throw (new Exception("获取数据失败！", ex));
            }
        }

        /// <summary>
        /// 通过部门查找未审核的文档
        /// </summary>
        /// <param name="JsonData"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        [DataAction("GetDocumentByDept", "JsonData", "userid")]
        public string GetDocumentByDept(string JsonData, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                var userInfo = ComClass.GetUserInfo(userid);
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat("select * from B_OA_Notice where NewsTypeId = 'wdwj' and NewsFormDept='{0}'",
                    userInfo.DPID);
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, null, dataSet.Tables[0]); //将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                throw (new Exception("获取数据失败！", ex));
            }
        }

        //删除归类
        [DataAction("DeleteData", "id", "userid")]
        public string DeleteData(string id, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_FileType fileType = new B_OA_FileType();
                if (string.IsNullOrEmpty(id))
                {
                    fileType.Condition.Add("FileTypeId=" + id);
                    Utility.Database.Delete(fileType, tran);
                }
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除除数据成功");
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                throw (new Exception("获取数据失败！", e));
            }
        }

        /// <summary>
        /// 保存用户订阅表
        /// </summary>
        /// <param name="fileTypeId">文件夹ID</param>
        /// <param name="userid">用户ID</param>
        /// <returns></returns>
        [DataAction("SaveDocumentRelation", "fileTypeId", "userid")]
        public string SaveDocumentRelation(string fileTypeId, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            try
            {
                strSql.AppendFormat("insert into B_OA_DocumentOrderRelation(userId,fileTypeId) VALUES('{0}','{1}')",
                    userid, fileTypeId);
                int i = Utility.Database.ExecuteNonQuery(strSql.ToString(), tran);
                Utility.Database.Commit(tran);
                if (i > 0)
                {
                    return Utility.JsonResult(true, "添加成功");
                }
                else
                {
                    return Utility.JsonResult(true, "添加失败");
                }
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                throw (new Exception("获取数据失败！", ex));
            }
        }

        //通过用户查找订阅的文档
        [DataAction("GetDocumentOrderMenuByUserId", "userid")]
        public string GetDocumentOrderMenuByUserId(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            try
            {
                strSql.AppendFormat(@"SELECT a.*,b.FileTypeName FROM B_OA_DocumentOrderRelation as a 
                LEFT JOIN (select * from B_OA_FileType) as b on a.FileTypeId = b.fileTypeId where userid = '{0}'
                ", userid);
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "查询成功", ds.Tables[0]);
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                return Utility.JsonResult(false, "查询失败 " + e.Message);
                ; //将对象转为json字符串并返回到客户端
            }
        }

        /// <summary>
        /// 删除用户订阅表
        /// </summary>
        /// <param name="fileTypeId">文件夹ID</param>
        /// <returns></returns>
        [DataAction("DeleteDocumentRelation", "id", "userid")]
        public string DeleteDocumentRelation(string id, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            try
            {
                strSql.AppendFormat(@"delete B_OA_DocumentOrderRelation where id ={0}", id);
                int i = Utility.Database.ExecuteNonQuery(strSql.ToString());
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除成功");
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                throw (new Exception("获取数据失败！", ex));
            }
        }


        //----------------20150120-----------------------
        /// <summary>
        /// 文档订阅业务，通过文档表ID查找各个科室公开的并审核通过的文档
        /// </summary>
        /// <param name="fileTypeId"></param>
        /// <returns></returns>
        [DataAction("GetOrderDocumentDataByFileTypeId", "fileTypeId", "userid")]
        public string GetOrderDocumentDataByFileTypeId(string fileTypeId, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            try
            {
                strSql.AppendFormat(
                    "select * from B_OA_Notice where documentTypeId='{0}' and ShareAttachment=1 and Chk=1", fileTypeId);
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "加载成功", dataSet.Tables[0]); //将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                throw (new Exception("获取数据失败！", ex));
            }
        }

        /// <summary>
        /// 通过主键查找文件夹子类
        /// </summary>
        /// <param name="parentId"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetAllFileType", "id", "type", "userid")]
        public string GetAllFileType(string id, string type, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            try
            {

                if (type == "union")
                {
                    strSql.AppendFormat(@"
select '0' as FileTypeId,'全部分类' as name,'1' as ParentId,'全部分类' as FileTypeName,'0/1' as CodePath,
			null as sourceType ,'' as linkUrl,'1' as isParent,'1900-01-01' as CreateDate,'未知' as isEffectiveName
,'A' as flagType
UNION 
");
                }
                strSql.AppendFormat(@"

SELECT FileTypeId,FileTypeName as name ,ParentId,FileTypeName,CodePath,sourceType,b.linkName as linkUrl,isParent,CreateDate,
 CASE
WHEN a.isEffective = '1' THEN
	'有效'
WHEN a.isEffective = '0' THEN
	'无效'
ELSE
	'未知' END AS isEffectiveName
,a.flagType
FROM
	B_OA_FileType AS a
LEFT JOIN B_OA_FileType_DefineLink AS b ON a.linkId = b.id

");
                //strSql.AppendFormat("select CONVERT(VARCHAR(20),CreateDate,120) as CreateDate ,* from B_OA_FileType");            
                if (id != "" && id != null)
                {
                    strSql.AppendFormat(" where parentId ='{0}'", id);
                }
                GetDataModel dataModel = new GetDataModel();
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                dataModel.listFileTypeModel = dataSet.Tables[0];
                //用于新增文件夹分类model
                dataModel.fileTypeModel = new B_OA_FileType();
                var userInfo = ComClass.GetUserInfo(userid);
                //订阅初始化
                dataModel.orderModel = new B_OA_FileType_Order();
                dataModel.orderModel.userId = userid;
                dataModel.orderModel.userName = userInfo.CnName;
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "加载成功", dataModel); //将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                throw (new Exception("获取数据失败！", ex));
            }
        }


        [DataAction("SaveFileType", "JsonData", "Parent", "userid")]
        public object SaveFileType(string JsonData, string Parent, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_FileType fileType = JsonConvert.DeserializeObject<B_OA_FileType>(JsonData);
                if (fileType.FileTypeName == "")
                {
                    return Utility.JsonResult(false, "文件名不能为空！");
                }
                if (fileType.FileTypeId == null || fileType.FileTypeId == "")
                {
                    fileType.FileTypeId = ComClass.GetGuid();
                    fileType.CreateDate = DateTime.Now.ToString();
                    fileType.isParent = false;
                    //fileType.CodePath = fileType.CodePath + "/" + fileType.FileTypeId;
                    Utility.Database.Insert(fileType, tran);


                    //修改父类节点中的某个字段 用来判断是否有子节点的
                    B_OA_FileType p_FileType = new B_OA_FileType();
                    p_FileType.Condition.Add("FileTypeId =" + fileType.ParentId);
                    B_OA_FileType paren = Utility.Database.QueryObject<B_OA_FileType>(p_FileType);
                    if (paren != null)
                    {
                        paren.isParent = true;
                        paren.Condition.Add("FileTypeId=" + paren.FileTypeId);
                        Utility.Database.Update(paren, tran);
                    }

                }
                else
                {
                    fileType.Condition.Add("FileTypeId = " + fileType.FileTypeId);
                    Utility.Database.Update(fileType);
                }
                //返回目录表
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat(@"
SELECT
	a.*, CASE
WHEN a.isEffective = '1' THEN
	'有效'
WHEN a.isEffective = '0' THEN
	'无效'
ELSE
	'未知'
END AS isEffectiveName,
 FileTypeName AS name,
 b.name AS linkName,
 b.linkName AS linkUrl
FROM
	B_OA_FileType AS a
LEFT JOIN B_OA_FileType_DefineLink AS b ON a.linkId = b.id
where FileTypeId = '{0}'", fileType.FileTypeId);
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                DataTable dataTable = dataSet.Tables[0];
                Utility.Database.Commit(tran);
                return new
                {
                    dataTable = dataTable
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                throw (new Exception("获取数据失败！", ex));
            }

        }

        /// <summary>
        /// 删除目录分类
        /// </summary>
        /// <param name="JsonData"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("DeleteFileType", "JsonData", "userid")]
        public string DeleteFileType(string JsonData, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            try
            {
                //删除文档分类目录，包括它所有的下级菜单
                B_OA_FileType fileType = JsonConvert.DeserializeObject<B_OA_FileType>(JsonData);
                if (!string.IsNullOrEmpty(fileType.flagType))
                {
                    throw (new Exception("删除失败：不可删除此字段，删除后会影响系统正常运行！"));
                }
                //查找子类
                listSon = new List<B_OA_FileType>();
                listSon.Add(fileType);
                GetFileSonList(fileType, tran);
                string d = "";
                for (var i = 0; i < listSon.Count; i++)
                {
                    if (i == (listSon.Count - 1))
                    {
                        d = d + "'" + listSon[i].FileTypeId + "'";
                    }
                    else
                    {
                        d = d + "'" + listSon[i].FileTypeId + "'" + ",";
                    }
                }
                strSql.AppendFormat("delete B_OA_FileType where 1=1 and FileTypeId in ({0})", d);
                Utility.Database.ExecuteNonQuery(strSql.ToString(), tran);

                strSql.Clear();
                strSql.AppendFormat("select Count(*)  from B_OA_FileType  where ParentId = '{0}'", fileType.ParentId);
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                int count = int.Parse(dataSet.Tables[0].Rows[0][0].ToString());
                if (count == 0)
                {
                    DataRowMap rm = new DataRowMap();
                    rm.TableName = "B_OA_FileType";
                    rm.Condition.Add("FileTypeId=" + fileType.ParentId);
                    rm.Fields.Add(new FieldInfo("isParent", false));
                    Utility.Database.Update(rm, tran);
                }
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除成功 ");
                ; //将对象转为json字符串并返回到客户端
            }
            catch (Exception e)
            {
                Utility.Database.Rollback(tran);
                throw (new Exception("删除失败：" + e.Message));
                ; //将对象转为json字符串并返回到客户端
            }
        }


        /// <summary>
        /// 通过文档分类ID查找文章
        /// </summary>
        /// <param name="NewsTypeId">文档分类ID</param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetAticleByFileTypeId", "FileTypeId", "userid")]
        public string GetAticleByFileTypeId(string FileTypeId, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            try
            {
                var user = ComClass.GetUserInfo(userid); //获取当前用户信息           
                GetDataModel data = new GetDataModel(); //获取数据模型
                data.notice = new B_OA_Notice();
                data.notice.NewsFromDept = user.DPID;
                strSql.AppendFormat(
                    "SELECT CONVERT(VARCHAR(20),CreateTime,120) as CreateTime,* from B_OA_Notice as a WHERE documentTypeId like '%{0}%' order by a.CreateTime desc",
                    FileTypeId);
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
                data.listNotice =
                    (List<B_OA_Notice>) JsonConvert.DeserializeObject(jsonData, typeof (List<B_OA_Notice>));
                //订阅初始化
                data.orderModel = new B_OA_FileType_Order();
                data.orderModel.userId = userid;
                data.orderModel.userName = user.CnName;
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "加载成功", data); //将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message); //将对象转为json字符串并返回到客户端
            }
        }

        /// <summary>
        /// 保存和修改文章
        /// </summary>
        /// <param name="JsonData">保存的数据</param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("SaveAricle", "JsonData", "userid")]
        public string SaveAricle(string JsonData, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();

            try
            {
                B_OA_Notice notice = JsonConvert.DeserializeObject<B_OA_Notice>(JsonData);

                //会议通知
                if (notice.isConferenceInform == false)
                {
                    notice.conferenceEndDate = null;
                }
                else
                {
                    if (notice.conferenceEndDate == "" || notice.conferenceEndDate == null)
                    {
                        strSql.Append("\n请输入会议时间");
                    }
                }
                //邮件送达
                if (notice.isSendEmail == false)
                {
                    notice.sendEmailToManId = "";
                    notice.sendEmailToManName = "";
                }
                else
                {
                    if (notice.sendEmailToManId == "" || notice.sendEmailToManId == null)
                    {
                        strSql.Append("\n请选择发件人");
                    }
                }
                //指定发布范围
                if (notice.publicRange == 0)
                {
                    notice.rangeCheckManId = "";
                    notice.rangeCheckManName = "";
                }
                else
                {
                    if (notice.rangeCheckManId == "" || notice.rangeCheckManId == null)
                    {
                        strSql.Append("\n请选择指定人员");
                    }
                }


                if (strSql.ToString().Length != 0)
                {
                    return Utility.JsonResult(false, strSql.ToString()); //将对象转为json字符串并返回到客户端
                }

                if (notice.NewsId == null || notice.NewsId == "")
                {
                    notice.NewsId = ComClass.GetGuid();
                    notice.CreateTime = DateTime.Now.ToString();
                    notice.isSeeInDoor = false; //设置为已发布进入审核流程
                    Utility.Database.Insert(notice, tran);
                }
                else
                {
                    notice.Condition.Add("NewsId =" + notice.NewsId);
                    Utility.Database.Update(notice, tran);
                }

                var userInfor = ComClass.GetUserInfo(userid);

                //删除文章与目录关系表
                B_OA_Notice_FileType_R del_nf_R = new B_OA_Notice_FileType_R();
                del_nf_R.Condition.Add("noticeId = " + notice.NewsId);
                Utility.Database.Delete(del_nf_R, tran);
                //保存关系表
                string[] documenTypeArray = notice.documentTypeId.Split('/');
                for (int k = 0; k < documenTypeArray.Length; k++)
                {
                    B_OA_Notice_FileType_R nf_R = new B_OA_Notice_FileType_R();
                    nf_R.noticeId = notice.NewsId;
                    nf_R.fileTypeId = documenTypeArray[k];

                    Utility.Database.Insert(nf_R, tran);
                }

                //邮件送达
                if (notice.isSendEmail == true)
                {
                    string Mail_Id = ComClass.GetGuid();
                    //保存已发送
                    B_Email email = new B_Email();
                    email.Mail_ID = Mail_Id;
                    email.Mail_CreateData = DateTime.Now.ToString(); //发送时间   
                    email.ID = Mail_Id; // +"_" + DateTime.Now.ToLocalTime().ToString();/ID主键
                    email.Mail_SendPersonId = userid; //发件人ID
                    email.Mail_SendPersonName = userInfor.CnName; //发件人姓名
                    email.Mail_Deleted = "0"; //是否已删除
                    email.Mail_deletedPerson = ""; //删除人
                    email.Mail_Type = "1"; //类型,0 未发送,草稿,1已发送
                    email.MailDocumentType = "fajian"; //的文件夹分类 默认是0收件箱
                    email.Mail_IsSee = "0"; //是否已被查看
                    email.markId = ""; //标签id
                    email.markName = ""; //标签名称
                    email.markColor = ""; //标签颜色
                    email.whosEmailId = userid; //邮件拥有者
                    email.Mail_SendDate = DateTime.Now.ToString(); //发送时间
                    email.emailRecieveDate = DateTime.Now.ToString(); //接收事件
                    email.isSaveSendBox = true; //保存发件
                    email.Mail_ReceivePersonId = notice.sendEmailToManId; //接收人ID
                    email.Mail_ReceivePersonName = notice.sendEmailToManName; //接收人名称
                    email.isImportant = true; //重要邮件
                    email.Mail_Title = "(来自文档中心)" + notice.NewsTitle; //标题
                    email.Mail_SendAttachment = notice.ShareAttachment; //附件
                    email.Mail_SendText = notice.NewsText; //内容
                    Utility.Database.Insert<B_Email>(email, tran);
                    //保存给发送方
                    string[] sendIdArray = email.Mail_ReceivePersonId.Split(';');
                    for (int i = 0; i < sendIdArray.Length - 1; i++)
                    {
                        B_Email sendEmail = new B_Email();
                        sendEmail.ID = email.ID + sendIdArray[i]; //主键
                        sendEmail.Mail_ID = email.Mail_ID; //关联ID
                        sendEmail.Mail_Title = email.Mail_Title; //主题
                        sendEmail.Mail_SendText = email.Mail_SendText; //发送内容
                        sendEmail.Mail_SendPersonId = email.Mail_SendPersonId; //发件人ID
                        var sendUserInfor = ComClass.GetUserInfo(sendEmail.Mail_SendPersonId);
                        sendEmail.Mail_SendPersonName = sendUserInfor.CnName; //发件人姓名
                        sendEmail.Mail_SendDate = email.Mail_SendDate; //发送时间
                        sendEmail.Mail_ReceivePersonId = sendIdArray[i]; //接收人ID
                        sendEmail.Mail_ReceivePersonName = email.Mail_ReceivePersonName;
                        sendEmail.Mail_SendAttachment = email.Mail_SendAttachment; //附件
                        sendEmail.Mail_Deleted = "0"; //是否删除0为未删除
                        sendEmail.Mail_Type = "1"; //邮件类别（1已发送0草稿）
                        sendEmail.Mail_CreateData = DateTime.Now.ToString(); //创建时间
                        sendEmail.Mail_IsSee = "0"; //是否已读0未读1已读
                        sendEmail.MailDocumentType = "shoujian"; //电子邮件文件夹类型
                        // sendEmail.isSaveSendBox = email.isSaveSendBox;//是否保存到发件箱
                        sendEmail.isImportant = email.isImportant; //是否是重要的邮件
                        sendEmail.isReadReceipt = email.isReadReceipt; //是否发送查看回执1发送回执0不回执
                        sendEmail.haveAttachment = email.haveAttachment; //是否有附件
                        sendEmail.CCId = email.CCId; //抄送人
                        sendEmail.CCName = email.CCName; //抄送人姓名
                        sendEmail.emailRecieveDate = DateTime.Now.ToString(); //收件时间
                        sendEmail.markId = ""; //标记ID
                        sendEmail.markName = ""; //标记名称
                        sendEmail.markColor = ""; //标记颜色
                        sendEmail.whosEmailId = sendIdArray[i]; //邮件拥有者
                        Utility.Database.Insert<B_Email>(sendEmail, tran);
                    }
                }

                //将指定人员查看存入关系表中
                if (notice.publicRange == 1)
                {
                    string rangeCheckManId = notice.rangeCheckManId;
                    string[] manIdArray = rangeCheckManId.Split(';');
                    //删除原数据
                    B_OA_Notice_AppointManSee manSee_Delete = new B_OA_Notice_AppointManSee();
                    manSee_Delete.Condition.Add("noticeid =" + notice.NewsId);
                    Utility.Database.Delete(manSee_Delete, tran);

                    for (var range = 0; range < manIdArray.Length - 1; range++)
                    {
                        B_OA_Notice_AppointManSee manSee = new B_OA_Notice_AppointManSee();
                        manSee.noticeid = notice.NewsId;
                        manSee.userid = manIdArray[range];
                        Utility.Database.Insert(manSee, tran);
                    }
                }

                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存成功！"); //将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message); //将对象转为json字符串并返回到客户端
            }
        }

        //修改文章
        [DataAction("UpdateAticle", "JsonData")]
        public object UpdateAticle(string JsonData)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_Notice notice = JsonConvert.DeserializeObject<B_OA_Notice>(JsonData);
                if (notice.NewsId == null || notice.NewsId == "")
                {
                    notice.NewsId = ComClass.GetGuid();
                    notice.CreateTime = DateTime.Now.ToString();
                    notice.isSeeInDoor = false; //设置为已发布进入审核流程
                    Utility.Database.Insert(notice, tran);
                }
                else
                {
                    notice.Condition.Add("NewsId =" + notice.NewsId);
                    Utility.Database.Update(notice, tran);
                }
                Utility.Database.Commit(tran);
                return new
                {
                    notice = notice
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message); //将对象转为json字符串并返回到客户端
            }
        }


        [DataAction("DeleteAticle", "NewsId", "userid")]
        public string DeleteAticle(string NewsId, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            try
            {
                B_OA_Notice notice = new B_OA_Notice();
                notice.Condition.Add("NewsId=" + NewsId);
                notice = Utility.Database.QueryObject<B_OA_Notice>(notice, tran);

                strSql.AppendFormat("delete B_OA_Notice where NewsId in('{0}')", NewsId);
                Utility.Database.ExecuteNonQuery(strSql.ToString(), tran);
                if (string.IsNullOrEmpty(notice.caseid))
                {
                    engineAPI.Delete(notice.caseid, userid, tran);
                }
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除数据成功");
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message); //将对象转为json字符串并返回到客户端
            }
        }

        /// <summary>
        /// 通过文章id查找文章
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetNoticeById", "id", "userid")]
        public string GetNoticeById(string id, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            GetDataModel dataModel = new GetDataModel();
            try
            {
                var userInfor = ComClass.GetUserInfo(userid);
                //获取所有文章信息
                dataModel.notice = GetNoticeByNewId(id, tran, userid);
                //阅读记录
                dataModel.listRecord = GetHaveSeeMan(id, tran, userid);
                //未读人员记录
                dataModel.dataTable_unreadMan = GetHaveUnSeeMan(id, tran, userid, dataModel.listRecord);
                //评论
                dataModel.listComments = GetCommentsById(id, tran);
                //附件
                List<FX_AttachMent> listAttachment = GetAttachmentByNoticeId(id, tran);
                string server = HttpContext.Current.Request.ServerVariables["HTTP_HOST"];
                for (int i = 0; i < listAttachment.Count; i++)
                {

                    listAttachment[i].FilePath = "http://" + server + "//附件目录//" + listAttachment[i].FilePath;
                }
                dataModel.listAttachment = listAttachment;
                //审核意见
                dataModel.checkSuggestTable = GetCheckSuggestByNoticeId(id, tran);

                //实例化评论，用于评论信息
                dataModel.commentsModel = new B_OA_Notice_Comments();
                dataModel.commentsModel.noticeId = id;
                dataModel.commentsModel.userid = userid;
                dataModel.commentsModel.userName = userInfor.CnName;

                //录入阅读记录
                SaveReadRecord(userid, id, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "加载成功！", dataModel); //将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message); //将对象转为json字符串并返回到客户端
            }
        }

        /// <summary>
        /// 查找审核信息
        /// </summary>
        /// <param name="id"></param>
        /// <param name="tran"></param>
        /// <returns></returns>
        public DataTable GetCheckSuggestByNoticeId(string id, IDbTransaction tran)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.AppendFormat(@"
            select 
            SenderName,Remark,CONVERT(VARCHAR(20),ReceDate,120) as ReceDate
            from FX_WorkFlowBusAct where caseid=(
                   select
                   caseid 
                   from B_OA_Notice as a  
                   where a.NewsId = '{0}')
            and SendActID = 'A001'", id);
            DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
            return dataSet.Tables[0];
        }

        public List<FX_AttachMent> GetAttachmentByNoticeId(string id, IDbTransaction tran)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.AppendFormat(@"select * from FX_AttachMent WHERE caseid = (select caseid from 
                            B_OA_Notice as a  where a.NewsId = '{0}')", id);
            DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
            string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
            List<FX_AttachMent> listCommets =
                (List<FX_AttachMent>) JsonConvert.DeserializeObject(jsonData, typeof (List<FX_AttachMent>));
            return listCommets;
        }

        /// <summary>
        /// 保存阅读记录
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="id"></param>
        /// <param name="tran"></param>
        public void SaveReadRecord(string userid, string id, IDbTransaction tran)
        {
            //录入阅读记录
            B_OA_Notice_ReadRecord readRcord = new B_OA_Notice_ReadRecord();
            readRcord.Condition.Add("readId = " + userid);
            readRcord.Condition.Add("noticeId = " + id);
            List<B_OA_Notice_ReadRecord> manRecordList = Utility.Database.QueryList(readRcord, tran);
            if (manRecordList.Count > 0)
            {
                B_OA_Notice_ReadRecord editRecord = manRecordList[0];
                editRecord.Condition.Add("id =" + editRecord.id);
                editRecord.readDate = DateTime.Now.ToString();
                Utility.Database.Update(editRecord, tran);
            }
            else
            {
                B_OA_Notice_ReadRecord addRecord = new B_OA_Notice_ReadRecord();
                addRecord.readDate = DateTime.Now.ToString();
                addRecord.noticeId = id;
                addRecord.readId = userid;
                var userInfor = ComClass.GetUserInfo(userid);
                addRecord.readName = userInfor.CnName;
                Utility.Database.Insert(addRecord, tran);
            }
        }

        //查找评阅意见
        public List<B_OA_Notice_Comments> GetCommentsById(string id, IDbTransaction tran)
        {
            //查找评论记录
            StringBuilder strSql = new StringBuilder();
            strSql.AppendFormat(@"select CONVERT(VARCHAR(20),commentDate,120) as commentDate,a.userName,a.content,c.DPName 
	                                	from B_OA_Notice_Comments as a 
	                                	LEFT JOIN FX_UserInfo as b on a.userid = b.UserID
	                                	LEFT JOIN FX_Department as c on c.DPID = b.DPID
                                where noticeId = '{0}' order by a.commentDate desc", id);
            DataSet dataSet_Comments = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
            string jsonData_Comments = JsonConvert.SerializeObject(dataSet_Comments.Tables[0]);
            List<B_OA_Notice_Comments> listCommets =
                (List<B_OA_Notice_Comments>)
                    JsonConvert.DeserializeObject(jsonData_Comments, typeof (List<B_OA_Notice_Comments>));
            return listCommets;
        }

        /// <summary>
        /// 查找未查看人员
        /// </summary>
        /// <param name="id"></param>
        /// <param name="tran"></param>
        /// <param name="userid"></param>
        /// <param name="listRecord">已查看人员</param>
        /// <returns></returns>
        public DataTable GetHaveUnSeeMan(string id, IDbTransaction tran, string userid,
            List<B_OA_Notice_ReadRecord> listRecord)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Clear();
            B_OA_Notice notice = new B_OA_Notice();
            notice.Condition.Add("NewsId =" + id);
            notice = Utility.Database.QueryObject<B_OA_Notice>(notice, tran);
            DataSet dataSet_UnRead;
            //判断文章的公开类型
            if (notice.publicRange == 1)
            {
                //指定人员查看时，未读部分应该查找指定人员查看表
                strSql.AppendFormat(@"select b.CnName,b.DPID,c.DPName from B_OA_Notice_AppointManSee AS a 
								            LEFT JOIN FX_UserInfo as b ON b.UserID = a.userid 
                                            LEFT JOIN FX_Department AS c on b.DPID = c.DPID
                                               where 
                                                  a.noticeid = '{0}'", id);
                for (var recordCount = 0; recordCount < listRecord.Count; recordCount++)
                {
                    string uid = listRecord[recordCount].readId;
                    strSql.AppendFormat(@" and a.userid !='{0}'", uid);
                }
                dataSet_UnRead = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
            }
            else
            {
                strSql.AppendFormat(@"select  a.CnName,b.DPName  from FX_UserInfo as a
                                            LEFT JOIN FX_Department AS b on a.DPID = b.DPID                                    
                                            where 1=1");
                for (var recordCount = 0; recordCount < listRecord.Count; recordCount++)
                {
                    string uid = listRecord[recordCount].readId;
                    strSql.AppendFormat(@" and a.userid !='{0}'", uid);
                }
                dataSet_UnRead = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
            }
            return dataSet_UnRead.Tables[0];
        }

        //查找已查阅人员
        public List<B_OA_Notice_ReadRecord> GetHaveSeeMan(string id, IDbTransaction tran, string userid)
        {
            //查找已读表
            StringBuilder strSql = new StringBuilder();
            strSql.AppendFormat(@"select CONVERT(VARCHAR(20),readDate,120) as readDate,a.readName,a.noticeId,c.DPName 
	        	                    from B_OA_Notice_ReadRecord as a
	                            	LEFT JOIN FX_UserInfo as b on a.readId = b.UserID
		                            LEFT JOIN FX_Department as c on c.DPID = b.DPID
                                    where a.noticeId ='{0}' order by a.readDate desc", id);
            DataSet dataSet_Record = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
            string jsonData_Record = JsonConvert.SerializeObject(dataSet_Record.Tables[0]);
            List<B_OA_Notice_ReadRecord> listRecord =
                (List<B_OA_Notice_ReadRecord>)
                    JsonConvert.DeserializeObject(jsonData_Record, typeof (List<B_OA_Notice_ReadRecord>));
            return listRecord;
        }


        //查找文章内容
        public B_OA_Notice GetNoticeByNewId(string id, IDbTransaction tran, string userid)
        {
            var userInfor = ComClass.GetUserInfo(userid);
            StringBuilder strSql = new StringBuilder();
            strSql.AppendFormat(@"select 
                                     CONVERT(VARCHAR(20),CreateTime,23) as CreateTime,a.*,c.DPName 
                                     from B_OA_Notice as a  
		                             LEFT JOIN FX_UserInfo as b on a.CreaterId = b.UserID
		                             LEFT JOIN FX_Department as c on c.DPID = b.DPID
                                     where a.NewsId = '{0}'", id);
            DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
            string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
            List<B_OA_Notice> listNotice =
                (List<B_OA_Notice>) JsonConvert.DeserializeObject(jsonData, typeof (List<B_OA_Notice>));
            return listNotice[0];
        }

        /// <summary>
        /// 通过文章id查找文章审核
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetCheckNoticeById", "id", "userid")]
        public string GetCheckNoticeById(string id, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            GetDataModel datamodel = new GetDataModel();
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat("select * from B_OA_Notice where NewsId = '{0}'", id);
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
                List<B_OA_Notice> listNotice =
                    (List<B_OA_Notice>) JsonConvert.DeserializeObject(jsonData, typeof (List<B_OA_Notice>));
                datamodel.notice = listNotice[0];

                StringBuilder strSql_two = new StringBuilder();
                strSql_two.AppendFormat(
                    "select  CONVERT(VARCHAR(20),checkDate,120) as checkDate,* from B_OA_Notice_Addvice as a where noticeId ='{0}' order by a.checkDate desc",
                    listNotice[0].NewsId);
                DataSet dataSet_Addvice = Utility.Database.ExcuteDataSet(strSql_two.ToString(), tran);
                string jsonData_Addvice = JsonConvert.SerializeObject(dataSet_Addvice.Tables[0]);
                List<B_OA_Notice_Addvice> list_Addvice =
                    (List<B_OA_Notice_Addvice>)
                        JsonConvert.DeserializeObject(jsonData_Addvice, typeof (List<B_OA_Notice_Addvice>));
                datamodel.listAddvice = list_Addvice;
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "加载成功！", datamodel); //将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message); //将对象转为json字符串并返回到客户端
            }
        }

        //返回文章模版
        [DataAction("GetAddNoticeModel", "userid")]
        public string GetAddNoticeModel(string userid)
        {
            B_OA_Notice notice = new B_OA_Notice();
            notice.CreaterId = userid;
            var userInfo = ComClass.GetUserInfo(userid);
            notice.CreateMan = userInfo.CnName;
            return Utility.JsonResult(true, "加载成功！", notice); //将对象转为json字符串并返回到客户端
        }

        /// <summary>
        /// 查找我的文档
        /// </summary>
        /// <returns></returns>
        [DataAction("GetAticleByUserId", "userid")]
        public string GetAticleByUserId(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            GetDataModel dataModel = new GetDataModel();
            StringBuilder strSql = new StringBuilder();
            dataModel.listObj = new List<object>();
            try
            {

                //查找全部信息
                strSql.AppendFormat(@"
SELECT
	a.NewsId,
	a.NewsTitle,
	a.CreateTime,
	a.CreateMan,
	CASE
WHEN a.status = '1' THEN
	'已通过'
ELSE
	'未通过'
END AS status
FROM
	B_OA_Notice AS a
WHERE
	a.CreaterId = '{0}'
ORDER BY
	a.CreateTime DESC              
", userid);
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                dataModel.listObj.Add(dataSet.Tables[0]);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "加载成功！", dataModel); //将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message); //将对象转为json字符串并返回到客户端
            }
        }

        /// <summary>
        /// 保存订阅
        /// </summary>
        /// <param name="JsonData"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("SaveDocumentOrder", "JsonData", "userid")]
        public string SaveDocumentOrder(string JsonData, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_FileType_Order order = JsonConvert.DeserializeObject<B_OA_FileType_Order>(JsonData);
                Utility.Database.Insert(order, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存成功！"); //将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message); //将对象转为json字符串并返回到客户端
            }
        }

        /// <summary>
        /// 查找订阅表
        /// </summary>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetDocumentOrderByUserId", "userid")]
        public object GetDocumentOrderByUserId(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            try
            {
                //找出所有订阅的文档
                strSql.AppendFormat("select * from B_OA_FileType_Order where userid ='{0}'", userid);
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                DataSet dataSet_Count = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                DataTable dt = dataSet_Count.Tables[0];
                //string updateTime = dt.Rows[0][0].ToString();
                //string count = dt.Rows[0][1].ToString();
                Utility.Database.Commit(tran);

                return new
                {
                    dt = dt
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message); //将对象转为json字符串并返回到客户端
            }
        }

        /// <summary>
        /// 通过文档类别查用户能看到的文章
        /// </summary>
        /// <returns></returns>
        [DataAction("GetArticleByFileTypeId", "fileTypeId", "userid")]
        public object GetArticleByFileTypeId(string fileTypeId, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            GetDataModel dataModel = new GetDataModel();
            dataModel.listObj = new List<object>();
            try
            {
                DataTable dataTable = GetArtistByFileTypeId(fileTypeId, "", tran);
                Utility.Database.Commit(tran);
                return new
                {
                    dataTable = dataTable
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message); //将对象转为json字符串并返回到客户端
            }

        }

        /// <summary>
        /// 通过文章类别查找文章
        /// </summary>
        /// <param name="fileTypeId"></param>
        /// <param name="userid"></param>
        /// <returns></returns>

        [DataAction("GetAllArticleByFileTypeId", "fileTypeId", "userid")]
        public string GetAllArticleByFileTypeId(string fileTypeId, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            GetDataModel dataModel = new GetDataModel();
            dataModel.listObj = new List<object>();
            try
            {
                strSql.AppendFormat(@"
select c.NewsId,c.NewsTitle,c.CreateTime,d.CnName as CreateMan,c.documentTypeName,c.documentTypeId,case when c.status='1' then '已通过' else '未通过' end as status from B_OA_FileType as a 
LEFT JOIN B_OA_Notice_FileType_R as b on a.fileTypeId =b.FileTypeID
left JOIN B_OA_Notice as c on c.NewsId = b.noticeId
LEFT JOIN FX_UserInfo as d on d.UserID = c.CreaterId
WHERE a.CodePath like '%{0}%'
and c.NewsId is not null 
GROUP BY c.NewsId,c.NewsTitle,c.CreateTime,c.status,d.CnName,c.documentTypeName,c.documentTypeId ORDER BY c.CreateTime desc
", fileTypeId);
                DataSet dataSet_unRead = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                dataModel.listObj.Add(dataSet_unRead.Tables[0]);

                dataModel.notice = new B_OA_Notice();
                dataModel.notice.CreaterId = userid;
                var userInfo = ComClass.GetUserInfo(userid);
                dataModel.notice.CreateMan = userInfo.CnName;
                //订阅初始化
                dataModel.orderModel = new B_OA_FileType_Order();
                dataModel.orderModel.userId = userid;
                dataModel.orderModel.userName = userInfo.CnName;
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "加载成功！", dataModel); //将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message); //将对象转为json字符串并返回到客户端
            }
        }

        /// <summary>
        /// 删除订阅
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("DeleteOrder", "id", "userid")]
        public string DeleteOrder(string id, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();

            try
            {
                B_OA_FileType_Order order = new B_OA_FileType_Order();
                order.Condition.Add("id =" + id);
                Utility.Database.Delete(order, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "取消成功！"); //将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message); //将对象转为json字符串并返回到客户端
            }
        }

        ///// <summary>
        ///// 
        ///// </summary>
        ///// <param name="type"></param>
        ///// <param name="userid"></param>
        ///// <returns></returns>
        //[DataAction("GetCheckOrder", "type", "userid")]
        //public string GetCheckOrder(string type, string userid)
        //{
        //    var tran = Utility.Database.BeginDbTransaction();
        //    StringBuilder strSql = new StringBuilder();
        //    try
        //    {

        //        strSql.AppendFormat("select CONVERT(VARCHAR(20),CreateTime,120) as CreateTime,* from B_OA_Notice where ChkMId like '%{0}%' and Chk ={1}", userid, type);
        //        DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
        //        string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
        //        List<B_OA_Notice> notice = (List<B_OA_Notice>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_OA_Notice>));
        //        Utility.Database.Commit(tran);
        //        return Utility.JsonResult(true, "加载成功！", notice);//将对象转为json字符串并返回到客户端
        //    }
        //    catch (Exception ex)
        //    {
        //        Utility.Database.Rollback(tran);
        //        ComBase.Logger(ex);//写异常日志到本地文件夹
        //        return Utility.JsonResult(false, ex.Message);//将对象转为json字符串并返回到客户端
        //    }
        //}

        /// <summary>
        /// 批量修改文章信息
        /// </summary>
        /// <returns></returns>
        [DataAction("UpdateArticleList", "JsonData", "userid")]
        public string UpdateArticleList(string JsonData, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                List<B_OA_Notice> listNotice =
                    (List<B_OA_Notice>) JsonConvert.DeserializeObject(JsonData, typeof (List<B_OA_Notice>));
                foreach (B_OA_Notice singleNotice in listNotice)
                {
                    singleNotice.Condition.Add("NewsId =" + singleNotice.NewsId);
                    Utility.Database.Update(singleNotice, tran);
                }
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "修改成功！"); //将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message); //将对象转为json字符串并返回到客户端
            }
        }

        /// <summary>
        /// 大事记 信息发布模版
        /// </summary>
        /// <param name="getTypeName"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetPubliceModel", "getTypeName", "userid")]
        public string GetPubliceModel(string getTypeName, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            B_OA_Notice noticeModel = new B_OA_Notice();
            noticeModel.CreaterId = userid;
            var userInfo = ComClass.GetUserInfo(userid);
            noticeModel.CreateMan = userInfo.CnName;
            string strSql = "";
            try
            {
                if (getTypeName == "publishNotice")
                {
                    noticeModel.documentTypeName = "全局信息;通知公告;";
                    strSql = "select FileTypeId from B_OA_FileType where FileTypeName='通知公告'";

                }
                else if (getTypeName == "addpublish")
                {
                    noticeModel.documentTypeName = "全局信息;信息发布;";
                    strSql = "select FileTypeId from B_OA_FileType where FileTypeName='信息发布'";
                }
                else if (getTypeName == "bigEvents")
                {
                    noticeModel.documentTypeName = "全局信息;环保大事记;";
                    strSql = "select FileTypeId from B_OA_FileType where FileTypeName='环保大事记'";
                }
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql, tran);
                DataTable dataTable = dataSet.Tables[0];
                noticeModel.documentTypeId = dataTable.Rows[0][0].ToString();
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "加载成功", noticeModel);
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message); //将对象转为json字符串并返回到客户端
            }
        }

        /// <summary>
        /// 通过文档的类型查找文档 用于信息发布 大事记功能
        /// </summary>
        /// <param name="getTypeName">类别名</param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetNoticeByDocumentType", "getTypeName", "userid")]
        public string GetNoticeByDocumentType(string getTypeName, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            GetDataModel dataModel = new GetDataModel();
            dataModel.listObj = new List<object>();
            string typeName = "";
            try
            {
                if (getTypeName == "tongzhigonggao")
                {
                    typeName = "通知公告";
                }
                else if (getTypeName == "xinxifabu")
                {
                    typeName = "信息发布";

                }
                else if (getTypeName == "bigEvents")
                {
                    typeName = "大事记";
                }
                //查找未读的通知公告
                strSql.AppendFormat(@"select * from B_OA_Notice as a LEFT JOIN B_OA_Notice_ReadRecord as b  on a.NewsId = b.noticeId
                     where a.documentTypeName like
                    '%{0}%' and a.status = 'checkThrough' and (b.readId <> '{1}' or  b.readId is null)", typeName,
                    userid);
                DataSet dataSet_Unread = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(dataSet_Unread.Tables[0]);
                List<B_OA_Notice> listNotice_UnRead =
                    (List<B_OA_Notice>) JsonConvert.DeserializeObject(jsonData, typeof (List<B_OA_Notice>));
                dataModel.listObj.Add(listNotice_UnRead);

                strSql.Clear();
                strSql.AppendFormat(@"select * from B_OA_Notice as a LEFT JOIN B_OA_Notice_ReadRecord as b  on a.NewsId = b.noticeId
                    where a.documentTypeName like
                    '%{0}%' and a.status = 'checkThrough' and b.readId = '{1}'", typeName, userid);
                DataSet DataSet_HaveRead = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData_HaveRead = JsonConvert.SerializeObject(DataSet_HaveRead.Tables[0]);
                List<B_OA_Notice> listNotice_HaveRead =
                    (List<B_OA_Notice>) JsonConvert.DeserializeObject(jsonData_HaveRead, typeof (List<B_OA_Notice>));
                dataModel.listObj.Add(listNotice_HaveRead);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "加载成功", dataModel);
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message); //将对象转为json字符串并返回到客户端
            }
        }


        /// <summary>
        /// 通过文档的类型查找审核文档 用于信息发布 大事记功能
        /// </summary>
        /// <param name="getTypeName">类别名</param>
        /// <param name="userid">文章状态</param>
        /// <param name="userid">审核人</param>
        /// <returns></returns>
        [DataAction("GetCheckNoticeByDocumentTypeAndUser", "getTypeName", "status", "userid")]
        public string GetCheckNoticeByDocumentTypeAndUser(string getTypeName, string status, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            GetDataModel dataModel = new GetDataModel();
            try
            {
                if (getTypeName == "tongzhigonggao")
                {
                    strSql.AppendFormat(
                        " select * from B_OA_Notice where documentTypeName like '%{0}%' and ChkMId like '%{1}%' and status='{2}'",
                        "通知公告", userid, status);
                }
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                DataTable dataTable = dataSet.Tables[0];
                string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
                List<B_OA_Notice> listNotice =
                    (List<B_OA_Notice>) JsonConvert.DeserializeObject(jsonData, typeof (List<B_OA_Notice>));
                dataModel.listNotice = listNotice;
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "加载成功", dataModel);
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message); //将对象转为json字符串并返回到客户端
            }
        }

        /// <summary>
        /// 通知公告审核查询 找出审核 未审核 已审核 用于大事记 通知公告发布
        /// </summary>
        /// <returns></returns>
        [DataAction("GetCheckNoticeList", "getTypeName", "userid")]
        public string GetCheckNoticeList(string getTypeName, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            GetDataModel dataModel = new GetDataModel();
            List<object> list = new List<object>();
            try
            {
                string typeName = "";
                if (getTypeName == "tongzhigonggao")
                {
                    typeName = "通知公告";
                }
                else if (getTypeName == "xinxifabu")
                {
                    typeName = "信息发布";
                }
                else if (getTypeName == "bigEvents")
                {
                    typeName = "大事记";
                }
                else if (getTypeName == "getAllCheck")
                {
                    typeName = "getAllCheck";
                }
                list.Add(GetCheckNoticeByDocumentTypeAndUser(typeName, "waitCheck", userid, tran));
                list.Add(GetCheckNoticeByDocumentTypeAndUser(typeName, "checkThrough", userid, tran));
                list.Add(GetCheckNoticeByDocumentTypeAndUser(typeName, "checkUnthrough", userid, tran));
                list.Add(GetCheckNoticeByDocumentTypeAndUser(typeName, "countersign", userid, tran));

                dataModel.listObj = list;
                dataModel.addvice = new B_OA_Notice_Addvice();
                dataModel.addvice.chkId = userid;
                var userInforn = ComClass.GetUserInfo(userid);
                dataModel.addvice.chkName = userInforn.CnName;
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "加载成功", dataModel);

            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message); //将对象转为json字符串并返回到客户端
            }
        }

        public List<B_OA_Notice> GetCheckNoticeByDocumentTypeAndUser(string typeName, string status, string userid,
            IDbTransaction tran)
        {
            StringBuilder strSql = new StringBuilder();
            //获取所有审核
            if (typeName == "getAllCheck")
            {
                if (status == "countersign")
                {
                    strSql.AppendFormat(
                        "select CONVERT(VARCHAR(20),CreateTime,120) as CreateTime,* from B_OA_Notice where  ChkMId like '%{0}%' and status='countersign'",
                        userid);

                }
                else
                {
                    strSql.AppendFormat(@"select CONVERT(VARCHAR(20),CreateTime,120) as CreateTime,* from B_OA_Notice_Addvice as a  LEFT JOIN B_OA_Notice as b  on a.noticeId = b.NewsId 
                    where a.chkId = '{0}' and a.statuType='{1}'", userid, status);
                }
            }
                //根据typeName获取审核表
            else
            {
                if (status == "countersign")
                {
                    strSql.AppendFormat(
                        "select CONVERT(VARCHAR(20),CreateTime,120) as CreateTime,* from B_OA_Notice where documentTypeName like '%{0}%' and ChkMId like '%{1}%' and status='countersign'",
                        typeName, userid);

                }
                else
                {
                    strSql.AppendFormat(@"select CONVERT(VARCHAR(20),CreateTime,120) as CreateTime,* from B_OA_Notice_Addvice as a  LEFT JOIN B_OA_Notice as b  on a.noticeId = b.NewsId 
                    where a.chkId = '{0}' and a.statuType='{1}' and b.documentTypeName like '%{2}%'", userid, status,
                        typeName);
                }
            }

            DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
            DataTable dataTable = dataSet.Tables[0];
            string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
            List<B_OA_Notice> listNotice =
                (List<B_OA_Notice>) JsonConvert.DeserializeObject(jsonData, typeof (List<B_OA_Notice>));
            return listNotice;
        }



        //通过文档类别查找我发布的文档
        [DataAction("GetMyNoticeByDocumentType", "getTypeName", "userid")]
        public string GetMyNoticeByDocumentType(string getTypeName, string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            GetDataModel dataModel = new GetDataModel();
            dataModel.listObj = new List<object>();
            string searchConditon = "";
            try
            {
                //取出通知公告的条件
                if (getTypeName == "tongzhigonggao")
                {
                    searchConditon = "documentTypeName like '%通知公告%'";
                }
                //取出大事记的条件
                if (getTypeName == "bigEvents")
                {
                    searchConditon = "documentTypeName like '%大事记%'";

                }

                //取出所有信息
                if (getTypeName == "getAll")
                {
                    searchConditon =
                        "documentTypeName like '%通知公告%' or documentTypeName like '%大事记%' or documentTypeName like '%信息发布%'";

                }
                //查找全部信息
                //                    strSql.AppendFormat(@"  select (case when status ='checkThrough' then '通过' when status='checkUnthrough' then
                //                    '未通过' when status ='countersign' then '会签' else '待审核' end) as status,CONVERT(VARCHAR(20),createTime,120) as createTime,* from B_OA_Notice as a where (documentTypeName like
                //                    '%通知公告%' or documentTypeName like '%大事记%' or documentTypeName like '%信息发布%') and CreaterId ='{0}' ORDER BY a.createTime desc", userid);

                strSql.AppendFormat(@"  select (case when status ='checkThrough' then '通过' when status='checkUnthrough' then
                                    '未通过' when status ='countersign' then '会签' else '待审核' end) as status,CONVERT(VARCHAR(20),createTime,120) as createTime,* from B_OA_Notice as a where ({1}) 
                                    and CreaterId ='{0}' ORDER BY a.createTime desc", userid, searchConditon);
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
                List<B_OA_Notice> listNotice =
                    (List<B_OA_Notice>) JsonConvert.DeserializeObject(jsonData, typeof (List<B_OA_Notice>));
                dataModel.listObj.Add(listNotice);
                //查找已审核通过信息
                strSql.Clear();
                //                strSql.AppendFormat(@"select (case when status ='checkThrough' then '通过' when status='checkUnthrough' then
                //                    '未通过' when status ='countersign' then '会签' else '待审核' end) as status,CONVERT(VARCHAR(20),createTime,120) as createTime,* from B_OA_Notice as a where (documentTypeName like
                //                    '%通知公告%' or documentTypeName like '%大事记%' 
                //                  	or documentTypeName like '%信息发布%' ) and CreaterId ='{0}' AND status = 'checkThrough' ORDER BY a.createTime desc", userid);
                strSql.AppendFormat(@"select (case when status ='checkThrough' then '通过' when status='checkUnthrough' then
                                    '未通过' when status ='countersign' then '会签' else '待审核' end) as status,CONVERT(VARCHAR(20),createTime,120) as createTime,* from B_OA_Notice as a where ({1}) 
                and CreaterId ='{0}' AND status = 'checkThrough' ORDER BY a.createTime desc", userid, searchConditon);
                DataSet dataSet_through = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData_through = JsonConvert.SerializeObject(dataSet_through.Tables[0]);
                List<B_OA_Notice> listNotice_through =
                    (List<B_OA_Notice>) JsonConvert.DeserializeObject(jsonData_through, typeof (List<B_OA_Notice>));
                dataModel.listObj.Add(listNotice_through);
                //查找未审核通过信息
                strSql.Clear();
                //                strSql.AppendFormat(@"select (case when status ='checkThrough' then '通过' when status='checkUnthrough' then
                //                    '未通过' when status ='countersign' then '会签' else '待审核' end) as status,CONVERT(VARCHAR(20),createTime,120) as createTime,* from B_OA_Notice as a where (documentTypeName like
                //                    '%通知公告%' or documentTypeName like '%大事记%' or documentTypeName like '%信息发布%' ) and CreaterId ='{0}' AND status = 'checkUnthrough'
                //                    ORDER BY a.createTime desc", userid);
                strSql.AppendFormat(@"select (case when status ='checkThrough' then '通过' when status='checkUnthrough' then
                    '未通过' when status ='countersign' then '会签' else '待审核' end) as status,CONVERT(VARCHAR(20),createTime,120) as createTime,* from B_OA_Notice as a where ({1}) and CreaterId ='{0}' AND status = 'checkUnthrough'
                    ORDER BY a.createTime desc", userid, searchConditon);
                DataSet dataSet_unThrough = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData_unThrough = JsonConvert.SerializeObject(dataSet_unThrough.Tables[0]);
                List<B_OA_Notice> listNotice_unThrough =
                    (List<B_OA_Notice>) JsonConvert.DeserializeObject(jsonData_unThrough, typeof (List<B_OA_Notice>));
                dataModel.listObj.Add(listNotice_unThrough);
                //查找未审核通过信息
                strSql.Clear();
                strSql.AppendFormat(@"select (case when status ='checkThrough' then '通过' when status='checkUnthrough' then
                    '未通过' when status ='countersign' then '会签' else '待审核' end) as status,CONVERT(VARCHAR(20),createTime,120) as createTime,* from B_OA_Notice as a where ({1}) and CreaterId ='{0}' AND status = 'waitCheck'
                ORDER BY a.createTime desc", userid, searchConditon);
                DataSet dataSet_waitCheck = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData_waitCheck = JsonConvert.SerializeObject(dataSet_waitCheck.Tables[0]);
                List<B_OA_Notice> listNotice_waitCheck =
                    (List<B_OA_Notice>) JsonConvert.DeserializeObject(jsonData_waitCheck, typeof (List<B_OA_Notice>));
                dataModel.listObj.Add(listNotice_waitCheck);
                //查找会签的信息
                strSql.Clear();
                strSql.AppendFormat(@"select (case when status ='checkThrough' then '通过' when status='checkUnthrough' then
                    '未通过' when status ='countersign' then '会签' else '待审核' end) as status,CONVERT(VARCHAR(20),createTime,120) as createTime,* from B_OA_Notice as a where ({1}) and CreaterId ='{0}' AND status = 'countersign' 
                ORDER BY a.createTime desc", userid, searchConditon);
                DataSet dataSet_Countersign = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData_Countersign = JsonConvert.SerializeObject(dataSet_Countersign.Tables[0]);
                List<B_OA_Notice> listNotice_Countersign =
                    (List<B_OA_Notice>) JsonConvert.DeserializeObject(jsonData_Countersign, typeof (List<B_OA_Notice>));
                dataModel.listObj.Add(listNotice_Countersign);


                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "加载成功", dataModel);
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message); //将对象转为json字符串并返回到客户端
            }
        }

        //保存评论
        [DataAction("SaveComments", "JsonData", "userid")]
        public string SaveComments(string JsonData, string userid)
        {
            StringBuilder strSql = new StringBuilder();
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_Notice_Comments comments =
                    (B_OA_Notice_Comments) JsonConvert.DeserializeObject(JsonData, typeof (B_OA_Notice_Comments));
                if (comments.id == 0)
                {
                    comments.commentDate = DateTime.Now.ToString();
                    Utility.Database.Insert(comments, tran);
                }
                else
                {
                    comments.Condition.Add("id =" + comments.id);
                    Utility.Database.Update(comments, tran);
                }

                strSql.AppendFormat(@"select CONVERT(VARCHAR(20),commentDate,120) as commentDate,a.userName,a.content,c.DPName 
	                                	from B_OA_Notice_Comments as a 
	                                	LEFT JOIN FX_UserInfo as b on a.userid = b.UserID
	                                	LEFT JOIN FX_Department as c on c.DPID = b.DPID
                                where noticeId = '{0}' order by a.commentDate desc", comments.noticeId);
                DataSet dataSet_Comments = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData_Comments = JsonConvert.SerializeObject(dataSet_Comments.Tables[0]);
                List<B_OA_Notice_Comments> listCommets =
                    (List<B_OA_Notice_Comments>)
                        JsonConvert.DeserializeObject(jsonData_Comments, typeof (List<B_OA_Notice_Comments>));

                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "加载成功", listCommets);
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message); //将对象转为json字符串并返回到客户端
            }
        }


        /// <summary>
        /// 通过文章类型，查找门户显示
        /// </summary>
        /// <param name="documentType"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        [DataAction("GetUserGateForType", "top", "documentType", "userid")]
        public string GetUserGateForType(string top, string documentType, string userId)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            DataSet dataSet = new DataSet();
            string documentTypeName = "";
            B_OA_FileType fileType = new B_OA_FileType();
            GetDataModel dataModel = new GetDataModel();
            dataModel.fileTypeModel = new B_OA_FileType();
            try
            {
                //if (documentType == "tongzhigonggao")
                //{
                //    documentTypeName = "通知公告";
                //}
                //else if (documentType == "dashiji")
                //{
                //    documentTypeName = "环保大事记";
                //}
                //else if (documentType == "xinxifabu")
                //{
                //    documentTypeName = "信息发布";
                //}
                //else if (documentType == "zhengqiuyijian")
                //{
                //    documentTypeName = "征求意见";
                //}
                fileType.Condition.Add("FileTypeName = " + documentType);
                dataModel.fileTypeModel = Utility.Database.QueryObject<B_OA_FileType>(fileType, tran);
                strSql.AppendFormat(@"select top {0} NewsId,NewsTitle,convert(varchar(20),CreateTime,23) as CreateTime 
                 from B_OA_Notice where isSeeInDoor = 1 and status='checkThrough' and documentTypeName like '%{1}%' order by CreateTime desc",
                    top, documentType);
                dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                dataModel.dataTable = dataSet.Tables[0];
                Utility.Database.Commit(tran); //提交事务
                return Utility.JsonResult(true, null, dataModel); //将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message); //将对象转为json字符串并返回到客户端
            }

        }

        /// <summary>
        /// 通过文件名称查找文件表对象
        /// </summary>
        /// <param name="documentType"></param>
        /// <returns></returns>
        [DataAction("GetFiletypeByFileTypeName", "documentType")]
        public string GetFiletypeByFileTypeName(string documentType)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                GetDataModel dataModel = new GetDataModel();
                dataModel.fileTypeModel = new B_OA_FileType();
                B_OA_FileType fileType = new B_OA_FileType();
                fileType.Condition.Add("FileTypeName = " + documentType);
                dataModel.fileTypeModel = Utility.Database.QueryObject<B_OA_FileType>(fileType, tran);
                Utility.Database.Commit(tran); //提交事务
                return Utility.JsonResult(true, null, dataModel); //将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                return Utility.JsonResult(false, ex.Message); //将对象转为json字符串并返回到客户端
            }
        }

        /// <summary>
        /// 通过文章类别Id查找文档中心内容（有父类）
        /// </summary>
        /// <param name="NoticeId">文章类别ID</param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetDocumentCenterByFileTypeId", "fileTypeId", "userid")]
        public string GetDocumentCenterByFileTypeId(string fileTypeId, string userid)
        {
            GetDataModel dataModel = new GetDataModel();
            dataModel.listObj = new List<object>();
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            List<B_OA_FileType> listFileType = new List<B_OA_FileType>();
            try
            {
                B_OA_FileType fileType = new B_OA_FileType();
                fileType.Condition.Add("FileTypeId =" + fileTypeId);
                B_OA_FileType file = Utility.Database.QueryObject<B_OA_FileType>(fileType, tran);
                //便利所有导航
                dataModel.listBread = new List<B_OA_FileType>();
                //导航栏
                B_OA_FileType firstBread = new B_OA_FileType();
                //第一个字段的导航默认为全区信息
                firstBread.FileTypeId = "0";
                firstBread.FileTypeName = "文档分类";
                dataModel.listBread.Add(firstBread);
                if (fileTypeId != "0")
                {
                    listFather = new List<B_OA_FileType>();
                    GetFileFatherList(file, tran);
                    if (listFather.Count > 0)
                    {
                        for (int i = listFather.Count - 1; i >= 0; i--)
                        {
                            dataModel.listBread.Add(listFather[i]);
                        }
                    }
                    dataModel.listBread.Add(file);

                }
                //查找旗下的子类目录
                strSql.AppendFormat("select * from B_OA_FileType where ParentId = '{0}'", fileTypeId);
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
                string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
                listFileType =
                    (List<B_OA_FileType>) JsonConvert.DeserializeObject(jsonData, typeof (List<B_OA_FileType>));
                //遍历出所有子类包含有的文章
                for (int i = 0; i < listFileType.Count; i++)
                {
                    string jsonData_Notice =
                        JsonConvert.SerializeObject(GetArtistByFileTypeId(listFileType[i].FileTypeId, "Top 5", tran));
                    List<B_OA_Notice> listNotice = new List<B_OA_Notice>();
                    listNotice =
                        (List<B_OA_Notice>) JsonConvert.DeserializeObject(jsonData_Notice, typeof (List<B_OA_Notice>));
                    B_OA_DocumentCenter documentCenter = new B_OA_DocumentCenter();
                    documentCenter.fileType = listFileType[i];
                    documentCenter.listNotice = listNotice;
                    dataModel.listObj.Add(documentCenter);
                }
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "", dataModel); //将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                throw (new Exception("获取数据失败！", ex));
            }
        }

        ////        /// <summary>
        ////        /// 通过文章类别Id查找文档中心内容（没有父类）
        ////        /// </summary>
        ////        /// <param name="NoticeId">文章类别ID</param>
        ////        /// <param name="userid"></param>
        ////        /// <returns></returns>
        ////        [DataAction("GetDocumentCenterByFileTypeId_Single", "fileTypeId", "userid")]
        ////        public string GetDocumentCenterByFileTypeId_Single(string fileTypeId, string userid)
        ////        {
        ////            GetDataModel dataModel = new GetDataModel();
        ////            dataModel.listObj = new List<object>();
        ////            var tran = Utility.Database.BeginDbTransaction();
        ////            StringBuilder strSql = new StringBuilder();
        ////            try
        ////            {
        ////                dataModel.listBread = new List<B_OA_FileType>();
        ////                B_OA_FileType fileType = new B_OA_FileType();
        ////                //导航栏
        ////                B_OA_FileType firstBread = new B_OA_FileType();
        ////                //第一个字段的导航默认为全区信息
        ////                firstBread.FileTypeId = "0";
        ////                firstBread.FileTypeName = "文档分类";
        ////                dataModel.listBread.Add(firstBread);
        ////                if (fileTypeId != "0")
        ////                {
        ////                    //便利所有导航

        ////                    fileType.Condition.Add("FileTypeId =" + fileTypeId);
        ////                    fileType = Utility.Database.QueryObject<B_OA_FileType>(fileType, tran);
        ////                    string codePath = fileType.CodePath;
        ////                    string[] codePathArray = codePath.Split('/');
        ////                    for (int k = 1; k < codePathArray.Length; k++)
        ////                    {
        ////                        B_OA_FileType bread = new B_OA_FileType();
        ////                        bread.Condition.Add("FileTypeId =" + codePathArray[k]);
        ////                        bread = Utility.Database.QueryObject<B_OA_FileType>(bread, tran);
        ////                        dataModel.listBread.Add(bread);
        ////                    }
        ////                }

        ////                strSql.AppendFormat(@"select NewsId,NewsTitle,CONVERT(VARCHAR(20),CreateTime,120) as CreateTime from B_OA_Notice 
        ////                    where documentTypeId 
        ////                    LIKE '%{0}%'
        ////                    and NewsId is not null and isSeeInDoor = 1 and status='checkThrough'
        ////                    GROUP BY NewsId,NewsTitle,CreateTime ORDER BY CreateTime desc", fileTypeId);
        ////                DataSet dataSet_Notice = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
        ////                string jsonData_Notice = JsonConvert.SerializeObject(dataSet_Notice.Tables[0]);
        ////                List<B_OA_Notice> listNotice = new List<B_OA_Notice>();
        ////                listNotice = (List<B_OA_Notice>)JsonConvert.DeserializeObject(jsonData_Notice, typeof(List<B_OA_Notice>));

        ////                B_OA_DocumentCenter documentCenter = new B_OA_DocumentCenter();
        ////                documentCenter.fileType = fileType;
        ////                documentCenter.listNotice = listNotice;
        ////                dataModel.listObj.Add(documentCenter);
        ////                Utility.Database.Commit(tran);
        ////                return Utility.JsonResult(true, "加载成功", dataModel);//将对象转为json字符串并返回到客户端
        ////            }
        ////            catch (Exception ex)
        ////            {
        ////                Utility.Database.Rollback(tran);
        ////                ComBase.Logger(ex);//写异常日志到本地文件夹
        ////                throw (new Exception("获取数据失败！", ex));
        ////            }
        ////        }

        [DataAction("GetNoticeByNoticeId", "noticeId")]
        public object GetNoticeByNoticeId(string noticeId)
        {
            var tran = Utility.Database.BeginDbTransaction();
            B_OA_Notice notice = new B_OA_Notice();
            try
            {
                notice.Condition.Add("NewsId =" + noticeId);
                notice = Utility.Database.QueryObject<B_OA_Notice>(notice, tran);
                Utility.Database.Commit(tran);
                return new
                {
                    notice = notice
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                throw (new Exception("获取数据失败！", ex));
            }
        }

        /// <summary>
        /// 加载程序定义表
        /// </summary>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetDocDefinition", "userid")]
        public object GetDocDefinition(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            StringBuilder strSql = new StringBuilder();
            try
            {
                strSql.AppendFormat(@"
SELECT
	CASE
WHEN isEffective = '1' THEN
	'有效'
WHEN isEffective = '0' THEN
	'无效'
ELSE
	'未知'
END AS isEffectiveName ,*
FROM
	B_OA_FileType_DefineLink
ORDER BY
	sort DESC     
                  ");
                DataTable dt = Utility.Database.ExcuteDataSet(strSql.ToString()).Tables[0];
                B_OA_FileType_DefineLink defindLink = new B_OA_FileType_DefineLink();
                return new
                {
                    dt = dt,
                    defindLink = defindLink
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                throw (new Exception("获取数据失败！", ex));
            }
        }

        /// <summary>
        /// 保存数据定义
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
        [DataAction("SaveDefindLink", "content")]
        public object SaveDefindLink(string content)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_FileType_DefineLink fileType = JsonConvert.DeserializeObject<B_OA_FileType_DefineLink>(content);
                if (fileType.id <= 0) //增加
                {
                    Utility.Database.Insert<B_OA_FileType_DefineLink>(fileType, tran);
                }
                else
                {
                    //修改
                    fileType.Condition.Add("id=" + fileType.id);
                    Utility.Database.Update<B_OA_FileType_DefineLink>(fileType, tran);
                }
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "保存成功");
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                throw (new Exception("获取数据失败！", ex));
            }
        }

        /// <summary>
        /// 删除数据定义
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [DataAction("DeleteDefinfLink", "id")]
        public object DeleteDefinfLink(string id)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                B_OA_FileType_DefineLink fileType = new B_OA_FileType_DefineLink();
                fileType.Condition.Add("id = " + id);
                Utility.Database.Delete(fileType, tran);
                Utility.Database.Commit(tran);
                return Utility.JsonResult(true, "删除成功");

            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                throw (new Exception("删除失败！", ex));
            }
        }

        [DataAction("GetDefinitionData", "userid")]
        public object GetDefinitionData(string userid)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append(
                    @"select id,name,remark,linkName from B_OA_FileType_DefineLink where isEffective='1' ORDER BY sort desc");
                DataTable dataTable = Utility.Database.ExcuteDataSet(strSql.ToString(), tran).Tables[0];
                Utility.Database.Commit(tran);
                return new
                {
                    dataTable = dataTable
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                throw (new Exception("删除失败！", ex));
            }
        }

        [DataAction("GetFileTypeByFileTypeId", "fileTypeId")]
        public object GetFileTypeByFileTypeId(string fileTypeId)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat(@"
select a.*,b.linkName as linkUrl,b.name as linkName,
 CASE
WHEN a.isEffective = '1' THEN
	'有效'
WHEN a.isEffective = '0' THEN
	'无效'
ELSE
	'未知' END AS isEffectiveName
from B_OA_FileType as a 
LEFT JOIN 
B_OA_FileType_DefineLink as b on a.linkId = b.id
where a.FileTypeId = '{0}'
;
", fileTypeId);
                DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString());
                string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
                List<B_OA_FileType> fileTypeList =
                    (List<B_OA_FileType>) JsonConvert.DeserializeObject(jsonData, typeof (List<B_OA_FileType>));
                B_OA_FileType fileType = fileTypeList[0];
                return new
                {
                    fileType = fileType
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                ComBase.Logger(ex); //写异常日志到本地文件夹
                throw (new Exception("读取数据错误！", ex));
            }
        }


        [DataAction("EdtiParent", "id", "parentId")]
        public object EdtiParent(string id, string parentId)
        {
            var tran = Utility.Database.BeginDbTransaction();
            try
            {
                DataRowMap rm = new DataRowMap();
                rm.TableName = "B_OA_FileType";
                rm.Condition.Add("FileTypeId=" + id);
                rm.Fields.Add(new FieldInfo("ParentId", parentId));
                Utility.Database.Update(rm);
                return new {};
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                throw (new Exception("保存数据失败！错误：" + ex.Message, ex));
            }
        }

        private List<B_OA_FileType> listSon;

        public void GetFileSonList(B_OA_FileType file, IDbTransaction tran)
        {
            if (file.isParent == true)
            {
                List<B_OA_FileType> listArray = new List<B_OA_FileType>();
                file.Condition.Add("ParentId = " + file.FileTypeId);
                listArray = Utility.Database.QueryList<B_OA_FileType>(file, tran);
                for (int i = 0; i < listArray.Count; i++)
                {
                    listSon.Add(listArray[i]);
                    GetFileSonList(listArray[i], tran);
                }
            }
        }

        private List<B_OA_FileType> listFather;

        private void GetFileFatherList(B_OA_FileType file, IDbTransaction tran)
        {
            if (file.ParentId != "0")
            {
                B_OA_FileType fileType = new B_OA_FileType();
                fileType.Condition.Add("FileTypeId = " + file.ParentId);
                fileType = Utility.Database.QueryObject<B_OA_FileType>(fileType, tran);
                listFather.Add(fileType);
                GetFileFatherList(fileType, tran);
            }
        }

        /// <summary>
        /// 通过分类ID查找文章
        /// </summary>
        /// <param name="fileTypeId"></param>
        /// <param name="tran"></param>
        /// <returns></returns>
        public DataTable GetArtistByFileTypeId(string fileTypeId, string top, IDbTransaction tran)
        {
            StringBuilder strSql = new StringBuilder();
            string d = "";
            if (fileTypeId != "0")
            {
                B_OA_FileType fileType = new B_OA_FileType();
                fileType.Condition.Add("FileTypeId =" + fileTypeId);
                fileType = Utility.Database.QueryObject<B_OA_FileType>(fileType, tran);
                listSon = new List<B_OA_FileType>();
                if (fileType.isParent == false)
                {
                    listSon.Add(fileType);
                }
                else
                {
                    GetFileSonList(fileType, tran);
                }
                strSql.Clear();

                for (var j = 0; j < listSon.Count; j++)
                {
                    if (j == (listSon.Count - 1))
                    {
                        d = d + "'" + listSon[j].FileTypeId + "'";
                    }
                    else
                    {
                        d = d + "'" + listSon[j].FileTypeId + "'" + ",";
                    }
                }
            }

            strSql.AppendFormat(@"
select  {0} c.NewsId,c.NewsTitle,CreateTime,b.fileTypeId,d.CnName as CreateMan,c.documentTypeName,c.documentTypeId ,
case when c.status='1' then '已通过' else '未通过' end as status
from B_OA_FileType as a
LEFT JOIN B_OA_Notice_FileType_R as b on a.FileTypeId = b.fileTypeId
LEFT JOIN B_OA_Notice as c on b.noticeId = c.NewsId
LEFT JOIN FX_UserInfo as d on d.UserID = c.CreaterId
where 1=1 and c.NewsId is not null 
", top);
            if (d.Length > 0)
            {
                strSql.AppendFormat(@" and b.fileTypeId in ({0})", d);
            }
            strSql.Append(@" ORDER BY CreateTime desc");
            DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
            return dataSet.Tables[0];
        }


        /// <summary>
        /// 通过标记查找分类
        /// </summary>
        /// <param name="flagType"></param>
        /// <param name="userid"></param>
        /// <returns></returns>
        [DataAction("GetFileTypeByFlayType", "flagType", "userid")]
        public object GetFileTypeByFlayType(string flagType, string userid)
        {
             var tran = Utility.Database.BeginDbTransaction();
            try
            {
                 B_OA_FileType fileType = ComDocumentCenterOperate.GetFileTypeByFlayType(flagType, tran);
                return new
                {
                    fileType = fileType
                };
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);
                throw (new Exception("读取数据失败：" + ex.Message, ex));
            }
        }


        public override string Key
        {
            get
            {
                return "DocumentCenterSvc";
            }
        }

        public class GetDataModel
        {
            public DataTable dataTable;//可用于任何表中
            public B_OA_FileType fileTypeModel;//文章实体
            public DataTable listFileTypeModel;//文章类型表
            public B_OA_Notice notice;//文章实体
            public List<B_OA_Notice> listNotice;//文章表
            public B_OA_FileType_Order orderModel;//订阅实体
            public List<B_OA_FileType_Order> listOrderModel;//订阅表
            public B_OA_Notice_Addvice addvice;//意见实体
            public List<B_OA_Notice_Addvice> listAddvice;//意见表
            public List<object> listObj;
            public B_OA_Notice_ReadRecord recordModel;//阅读记录实体
            public List<B_OA_Notice_ReadRecord> listRecord;//阅读记录表
            public B_OA_Notice_Comments commentsModel;//评论实体
            public List<B_OA_Notice_Comments> listComments;//评论表
            public List<B_OA_FileType> listBread;//面包屑导航
            public DataTable dataTable_unreadMan;//未查看人员
            public List<FX_AttachMent> listAttachment;//附件表
            public DataTable checkSuggestTable;//审核意见表
        }
    }
}
