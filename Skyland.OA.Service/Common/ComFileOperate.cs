using IWorkFlow.Host;
using IWorkFlow.ORM;
using Microsoft.Win32;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BizService.Common
{
    public class ComFileOperate
    {
        /// <summary>
        /// 创建文件夹
        /// </summary>
        /// <param name="folderPath">文件夹路径</param>
        /// <returns></returns>
        public static void CreateDirectory(string folderPath)
        {
            try
            {
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        /// <summary>
        /// 根据模板生成word文件
        /// </summary>
        /// <param name="templatePath">模板路径</param>
        /// <param name="folderPath">新word文件保存的文件夹路径</param>
        /// <param name="fileName">新word文件名</param>
        /// <param name="fileData">新word文件数据</param>
        /// <returns>返回新生成word文件完整路径</returns>
        public static string CreateWrodDocByTemplate(string templatePath, string folderPath, string fileName, Dictionary<string, Object> fileData)
        {
            CreateDirectory(folderPath);//判断要保存的文件夹是否存在，不存在则创建文件夹

            string savePath = folderPath.EndsWith("\\") ? folderPath + fileName : folderPath + "\\" + fileName;
            savePath = savePath.Replace("\\", "/");
            IWorkFlow.OfficeService.IWorkFlowOfficeHandler.ProduceWord2007UP(templatePath, savePath, fileData);
            return savePath;
        }

        /// <summary>
        /// 删除附件文件夹中的文件
        /// </summary>
        /// <param name="type">附件文件夹的类别</param>
        /// <param name="fileName">文件名称</param>
        /// <returns></returns>
        public static void DeleteAttachment(string filePath)
        {
            string rootPath = HttpContext.Current.Server.MapPath("/");
            rootPath = rootPath.Replace("\\", "/");
            filePath = filePath.Replace("\\","/");
            string path = rootPath + filePath;
            if (File.Exists(path))
            {
                File.Delete(path);
            }
        }

        /// <summary>
        /// 删除附件文件夹中的文件
        /// </summary>
        /// <param name="type">附件文件夹的类别</param>
        /// <param name="fileName">文件名称</param>
        /// <returns></returns>
        public static void DeleteAttachmentByPath(string filePath)
        {
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }

        /// <summary>
        /// 删除业务文件和业务数据
        /// </summary>
        /// <param name="caseid">业务ID</param>
        /// <param name="type">类别（表名）</param>
        /// <param name="docType">文件类别</param>
        /// <returns></returns>
        public static void isExistCreateRecordAndDeleteDoc(string caseid, string type, string docType, IDbTransaction tran)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.AppendFormat("select * from B_Common_CreateDoc where caseid='{0}' and type='{1}'",caseid,type);
            if (docType != "")
            {
                strSql.AppendFormat("and docType='{0}'", docType);
            }
           DataSet ds = Utility.Database.ExcuteDataSet(strSql.ToString(), tran);
           DataTable dt = ds.Tables[0];
           string jsonData = JsonConvert.SerializeObject(ds.Tables[0]);
           List < B_Common_CreateDoc> list = (List<B_Common_CreateDoc>)JsonConvert.DeserializeObject(jsonData, typeof(List<B_Common_CreateDoc>));
           for (int i = 0; i < list.Count; i++)
            {
                //删除对应文件
                string filePath = list[i].filename.Replace("#", "\\");
                ComFileOperate.DeleteAttachment(filePath);
                B_Common_CreateDoc dl = new B_Common_CreateDoc();
                dl.Condition.Add("id = " + list[i].id);
                Utility.Database.Delete(dl, tran);
            }
        }

        /// <summary>
        /// 注册控件
        /// </summary>
        /// <param name="CLSID">控件ID</param>
        /// <returns></returns>
        public static string RegisterControl(String CLSID,string filePath)
        {
            string result = "";
            try
            {
                if (File.Exists(filePath))
                {
                    RegistryKey key = Registry.ClassesRoot.OpenSubKey("CLSID\\{" + CLSID + "}\\");

                    if (key == null)
                    {
                        Process p = new Process();
                        p.StartInfo.FileName = "Regsvr32.exe";
                        p.StartInfo.Arguments = @"/s " + filePath;//路径中不能有空格
                        p.Start();
                    }
                }
                else
                    return "手写签批文件不存在";
            }
            catch (Exception e)
            {
                result = "注册手写签批控件失败，" + e.ToString();
            }

            return result;
        }
    }
}
