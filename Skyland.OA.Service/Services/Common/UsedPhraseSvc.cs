using BizService.Common;
using IWorkFlow.BaseService;
using IWorkFlow.Host;
using IWorkFlow.ORM;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BizService.Services.Common
{
    class UsedPhraseSvc : BaseDataHandler
    {
        #region 户常用语控件
        /// <summary>
        /// 获取用户常用语数据
        /// </summary>
        /// <param name="userid">当前用户ID</param>
        /// <param name="lx">常用语类型</param>
        /// <returns>返回json数据结果</returns>
        [DataAction("GetUsedPhrase", "userid", "lx")]
        public string GetUsedPhrase(string userid, string lx)
        {
            DataSet dataSet = null;
            IDbTransaction tran = Utility.Database.BeginDbTransaction();//开始事务并返回一个事务对象
            SkyLandDeveloper developer = new SkyLandDeveloper("{}", userid, tran);//获取业务流相关参数
            try
            {
                GetUsedPhraseDataModel data = new GetUsedPhraseDataModel();

                //Para_UsedPhrase list = new Para_UsedPhrase();
                //list.Condition.Add("cjrid = " + userid);//设置查询条件,条件为当前用户ID
                //list.Condition.Add("lx = " + lx);//设置查询条件,条件为常用语类型   
                //data.usedPhraseList = Utility.Database.QueryList(list);
                dataSet = Utility.Database.ExcuteDataSet("select * from Para_UsedPhrase where cjrid='" + userid + "' and lx='" + lx + "' order by sypl desc", tran);
                if (dataSet != null && dataSet.Tables.Count > 0 && dataSet.Tables[0] != null)
                {
                    string jsonData = JsonConvert.SerializeObject(dataSet.Tables[0]);
                    data.usedPhraseList = (List<Para_UsedPhrase>)JsonConvert.DeserializeObject(jsonData, typeof(List<Para_UsedPhrase>));
                }
                else
                {
                    data.usedPhraseList = new List<Para_UsedPhrase>();
                }
                developer.Commit();//提交事务
                return Utility.JsonResult(true, null, data);
            }
            catch (Exception ex)
            {
                developer.RollBack();//回滚事务
                ComBase.Logger(ex);//写日专到本地文件
                return Utility.JsonResult(false, ex.Message);
            }
            finally
            {
                if (dataSet != null) dataSet.Dispose();
                tran.Dispose();
            }
        }

        /// <summary>
        /// 删除数据
        /// </summary>
        /// <param name="userid">当前用户ID</param>
        /// <param name="id">主键ID</param>
        /// <returns>返回结果数据集</returns>
        [DataAction("DeleteData", "userid", "id")]
        public string DeleteData(string userid, string id)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();//开始事务并返回一个事务对象
            SkyLandDeveloper developer = new SkyLandDeveloper("{}", userid, tran);//获取业务流相关参数
            try
            {

                Para_UsedPhrase usedPhrase = new Para_UsedPhrase();
                usedPhrase.Condition.Add("id = " + id);//设置查询条件,条件为当前用户ID
                Utility.Database.Delete(usedPhrase, tran);
                developer.Commit();//提交事务
                //return Utility.JsonResult(true, "保存成功！", retContent);
                return Utility.JsonResult(true, "删除成功！");
            }
            catch (Exception ex)
            {
                developer.RollBack();//回滚事务
                ComBase.Logger(ex);//写日专到本地文件
                return Utility.JsonResult(false, "删除失败:" + ex.Message);
                //return Utility.JsonResult(false, "删除失败:" + ex.Message);
            }
        }

        /// <summary>
        /// 保存数据
        /// </summary>
        /// <param name="userid">当前用户ID</param>
        /// <param name="nr">常用语内容</param>
        /// <returns></returns>
        [DataAction("SaveData", "userid", "nr", "lx")]
        public string SaveData(string userid, string nr, string lx)
        {
            if (nr == null || nr.ToString() == "") return Utility.JsonResult(true, "数据不能空");
            //UTF8Encoding utf = new UTF8Encoding();
            //lx = utf.GetString(Encoding.Unicode.GetBytes(lx)).Trim();
            //byte[] utf8Bytes = Encoding.UTF8.GetBytes(lx);
            //lx = Encoding.GetEncoding("UTF-8").GetString(utf8Bytes);

            nr = nr.Trim();
            IDbTransaction tran = Utility.Database.BeginDbTransaction();//开始事务并返回一个事务对象
            SkyLandDeveloper developer = new SkyLandDeveloper("{}", userid, tran);//获取业务流相关参数
            try
            {
                Para_UsedPhrase usedPhrase = new Para_UsedPhrase();
                usedPhrase.nr = nr;
                usedPhrase.cjrid = userid;
                usedPhrase.lx = lx;
                usedPhrase.Condition.Add("cjrid=" + userid);
                usedPhrase.Condition.Add("lx=" + lx);
                usedPhrase.Condition.Add("nr=" + nr);
                List<Para_UsedPhrase> list = Utility.Database.QueryList(usedPhrase);
                DataSet ds = Utility.Database.ExcuteDataSet("select isnull(MAX(sypl),0) as sypl from Para_UsedPhrase where cjrid='" + userid + "' and lx='" + lx + "'");
                usedPhrase.sypl = (int)ds.Tables[0].Rows[0]["sypl"] + 1;
                if (list == null || list.Count < 1)
                {
                    usedPhrase.cjsj = DateTime.Now;
                    Utility.Database.Insert(usedPhrase, tran);
                }
                else
                {
                    Utility.Database.Update(usedPhrase, tran);
                }

                developer.Commit();//提交事务
                //return Utility.JsonResult(true, "保存成功！", retContent);
                return Utility.JsonResult(true, "保存成功！");
            }
            catch (Exception ex)
            {
                developer.RollBack();//回滚事务
                ComBase.Logger(ex);//写日专到本地文件
                return Utility.JsonResult(false, "保存失败:" + ex.Message);
                //return Utility.JsonResult(false, "删除失败:" + ex.Message);
            }
        }

        /// <summary>
        /// 获取用户常用语数据模型
        /// </summary>
        public class GetUsedPhraseDataModel
        {
            public List<Para_UsedPhrase> usedPhraseList;
        }
        #endregion

        #region 环评单位控件
        /// 获取环评单位数据
        [DataAction("GetHpdwSelect", "userid")]
        public string GetHpdwSelect(string userid)
        {
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append(@"SELECT   
	id, jgmc, frdb, zsbh,CONVERT(VARCHAR(10),yxq,120) AS yxq, pjfw, hbzzry, lxr, lxdh, cz, txdz, jgbh, yzbm, frsj, frzj
 FROM Para_CP_EIACompany");
                DataTable dt = Utility.Database.ExcuteDataSet(strSql.ToString()).Tables[0];

                GetHpdwDataModel data = new GetHpdwDataModel();
                string jsonData = JsonConvert.SerializeObject(dt);
                data.dataList = (List<Para_CP_EIACompany>)JsonConvert.DeserializeObject(jsonData, typeof(List<Para_CP_EIACompany>));
                return Utility.JsonResult(true, null, data);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);//写日专到本地文件
                return Utility.JsonResult(false, ex.Message);
            }
        }
        public class GetHpdwDataModel
        {
            public List<Para_CP_EIACompany> dataList;
        }

        #endregion

        #region 建设项目控件
        /// <summary>
        /// 获取建设项目
        /// </summary>
        /// <param name="qydm">企业代码</param>
        /// <param name="userid">用户ID</param>
        /// <returns></returns>
        [DataAction("GetJsxmSelect", "qydm", "userid")]
        public string GetJsxmSelect(string qydm, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();//开始事务并返回一个事务对象
            SkyLandDeveloper developer = new SkyLandDeveloper("{}", userid, tran);
            DataSet dataSet = null;
            try
            {
                StringBuilder sql = new StringBuilder();
                //sql.Append("select a.*,jsxmbh,xmmc,jsdd,jsnr,jsxz,ztz,bgspzwh,lxbm,bgsspbm from (select * from Base_Unitinfo where qydm='{0}') as a ");
                //sql.Append("left join B_CP_ExamApprovalMain as b on a.qydm=b.jsdw_dm; ");
                //string sqlString = string.Format(sql.ToString(), qydm);
                sql.Append("select * from B_CP_ExamApprovalMain ");
                string sqlString = sql.ToString();
                dataSet = Utility.Database.ExcuteDataSet(sqlString, tran);
                developer.Commit();//提交事务
                string data = JsonConvert.SerializeObject(dataSet.Tables[0]);
                return Utility.JsonResult(true, null, data);
            }
            catch (Exception ex)
            {
                developer.RollBack();//回滚事务
                ComBase.Logger(ex);//写日专到本地文件
                return Utility.JsonResult(false, ex.Message);
            }
            finally
            {
                tran.Dispose();
            }
        }

        #endregion

        #region 政府单位控件

        /// <summary>
        /// 保存政府单位数据
        /// </summary>
        /// <param name="userid">当前用户ID</param>
        /// <param name="nr">常用语内容</param>
        /// <returns></returns>
        [DataAction("SaveZfUnitiData", "jsonData", "userid")]
        public string SaveZfUnitiData(string jsonData, string userid)
        {
            //UTF8Encoding utf = new UTF8Encoding();
            //nr= utf.GetString(Encoding.Unicode.GetBytes(nr)).Trim();
            IDbTransaction tran = Utility.Database.BeginDbTransaction();//开始事务并返回一个事务对象
            try
            {
                Para_ZfUniti data = JsonConvert.DeserializeObject<Para_ZfUniti>(jsonData);
                data.Condition.Add("dwmc=" + data.dwmc.Trim());
                //更新或插入信息
                if (Utility.Database.Update<Para_ZfUniti>(data, tran) < 1)
                {
                    Utility.Database.Insert<Para_ZfUniti>(data, tran);
                }
                Utility.Database.Commit(tran);//提交事务
                return Utility.JsonResult(true, "保存成功！");
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);//回滚事务
                ComBase.Logger(ex);//写日专到本地文件
                return Utility.JsonResult(false, "保存失败:" + ex.Message);
            }
        }

        /// <summary>
        /// 删除数据
        /// </summary>
        /// <param name="userid">当前用户ID</param>
        /// <param name="id">主键ID</param>
        /// <returns>返回结果数据集</returns>
        [DataAction("DeleteZfUnitiData", "userid", "id")]
        public string DeleteZfUnitiData(string userid, string id)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();//开始事务并返回一个事务对象
            SkyLandDeveloper developer = new SkyLandDeveloper("{}", userid, tran);//获取业务流相关参数
            try
            {
                Para_ZfUniti data = new Para_ZfUniti();
                data.Condition.Add("id = " + id);//设置查询条件,条件为当前用户ID
                Utility.Database.Delete(data, tran);
                developer.Commit();//提交事务
                return Utility.JsonResult(true, "删除成功！");
            }
            catch (Exception ex)
            {
                developer.RollBack();//回滚事务
                ComBase.Logger(ex);//写日专到本地文件
                return Utility.JsonResult(false, "删除失败:" + ex.Message);
            }
        }

        #endregion



        #region 通用查询数据库方法
        /// <summary>
        /// 通用查询数据库方法
        /// </summary>
        /// <param name="showfield">字段</param>
        /// <param name="tablename">表名</param>
        /// <param name="where">条件</param>
        /// <param name="userid">用户ID</param>
        /// <returns></returns>
        [DataAction("GetData", "showfield", "tablename", "where", "order", "userid")]
        public string GetData(string showfield, string tablename, string where, string order, string userid)
        {
            IDbTransaction tran = Utility.Database.BeginDbTransaction();//开始事务并返回一个事务对象
            DataSet dataSet = null;
            try
            {
                if (string.IsNullOrEmpty(showfield)) showfield = "*";
                if (!string.IsNullOrEmpty(where)) { where = " where " + where; } else { where = ""; }
                if (!string.IsNullOrEmpty(order)) order = " order by " + order; else order = "";
                string sqlStr = "select " + showfield + " from " + tablename + where + order;
                dataSet = Utility.Database.ExcuteDataSet(sqlStr, tran);//执行查询并将查询结果放到DataSet里  
                Utility.Database.Commit(tran);//提交事务
                string data = JsonConvert.SerializeObject(dataSet.Tables[0]);
                return Utility.JsonResult(true, null, data);//将对象转为json字符串并返回到客户端
            }
            catch (Exception ex)
            {
                Utility.Database.Rollback(tran);//回滚事务
                ComBase.Logger(ex);//写日专到本地文件
                return Utility.JsonResult(false, ex.Message);
            }
            finally
            {
                tran.Dispose();
                if (dataSet != null) dataSet.Dispose();
            }
        }

        #endregion

        #region
        [DataAction("GetAssessData", "userid")]
        public string GetAssessData(string userid)
        {
            try
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("SELECT workflowcaseid,workflowcaseid AS jsxmbh, xmmc,sqdw_jsdd AS jsdd,xmfzr AS jsdw_lxr,sqdw_dh AS pjdw_lxdh FROM B_EIA_DocumentEvaluationMain");
                DataSet dataSet = Utility.Database.ExcuteDataSet(strSql.ToString());
                string data = JsonConvert.SerializeObject(dataSet.Tables[0]);
                return Utility.JsonResult(true, null, data);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);//写日专到本地文件
                return Utility.JsonResult(false, ex.Message);
            }
        }

        #endregion



        /// <summary>
        /// 通用上传文件控件
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        [DataAction("UploadlFile")]
        public string UploadlFile(HttpContext context)
        {
            //string filesid = context.Request.QueryString["filesid"];//文件域
            string saveFolderPath = context.Request.QueryString["saveFolderPath"];//保存的文件夹路径
            string extension = context.Request.QueryString["extension"];//扩展名
            string fileSize = context.Request.QueryString["fileSize"];//文件长度
            //string [] extensionArry = extension.Split(',');// 将接收到的字符串转换为json格式
            //string saveFileName = context.Request.QueryString["saveFileName"];//保存的文件名
            //var developer = new SkyLandDeveloper();
            string rootPath = HttpContext.Current.Server.MapPath("/");
            rootPath = rootPath.Replace("\\", "/");
            try
            {
                int size = context.Request.Files.Count;
                //HttpPostedFile file = context.Request.Files[filesid];//获得指定表单文件域的上传文件

                if (string.IsNullOrEmpty(saveFolderPath))
                {
                    saveFolderPath = "attachment";
                    //if (File.Exists(rootPath+saveFolderPath))//判断文件是否存在
                    //{
                    //   Directory.CreateDirectory(rootPath+saveFolderPath);
                    //}                
                }

                rootPath += saveFolderPath;
                string res = "";
                if (!Directory.Exists(rootPath))//判断文件夹是否存在
                {
                    Directory.CreateDirectory(rootPath);
                }
                for (int i = 0; i < size; i++)
                {
                    HttpPostedFile file = context.Request.Files[i];//获得指定表单文件域的上传文件
                    if (file != null)
                    {
                        string fileName = file.FileName;//获得上传上文件的名称,完整名称,如: aa.txt
                        fileName = fileName.Replace("\\", "/");
                        int index = fileName.LastIndexOf("/");
                        fileName = fileName.Substring(index + 1, fileName.Length - (index + 1));
                        index = fileName.LastIndexOf(".");
                        string extensionString = fileName.Substring(index, fileName.Length - (index));
                        //限制文件格式
                        if (extension.IndexOf(".*") < 0)
                        {
                            if (extension.IndexOf(extensionString) < 0)
                                return Utility.JsonResult(false, "不允许上传:" + extensionString + "文件");
                        }
                        //限制文件大小
                        if (file.ContentLength > 50000000)
                            return Utility.JsonResult(false, fileName + "文件超过:50MB,不能上传");
                        //if ((file.ContentLength / 1024)>52)
                        //{
                        //    return Utility.JsonResult(false, fileName + "文件超过:52MB,不能上传！");
                        //}

                        DateTime dateTime = DateTime.Now;
                        string afterFileName = dateTime.ToLongDateString() + dateTime.Hour + "时" + dateTime.Minute + "分" + dateTime.Second + "秒_" + fileName;
                        string savePath = rootPath + "/" + afterFileName;
                        file.SaveAs(savePath);
                        FileInfo fi = new FileInfo(savePath);
                        res += "{fileName:'" + fileName + "',saveFileName:'" + afterFileName + "',absolutePath:'" + savePath + "',relativePath:'" + saveFolderPath + "/" + afterFileName + "',fileSize:" + fi.Length.ToString() + ",extension:'" + fi.Extension + "'},";

                    }
                }
                res = "[" + res.TrimEnd(',') + "]";
                return Utility.JsonResult(true, "上传文件成功", res);
            }
            catch (Exception ex)
            {
                ComBase.Logger(ex);
                return Utility.JsonResult(false, "上传文件失败:" + ex.Message.Replace(":", " "));
            }
        }




        public override string Key
        {
            get
            {
                return "UsedPhraseSvc";
            }
        }
    }
}
