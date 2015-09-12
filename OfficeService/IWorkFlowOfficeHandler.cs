using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IWorkFlow.OfficeService.ComApplication;
using IWorkFlow.OfficeService.OpenXml;

namespace IWorkFlow.OfficeService
{
    public class IWorkFlowOfficeHandler
    {
        static Dictionary<string, Object> dict = new Dictionary<string, Object>();

        public enum ReplaceMode
        {
            comment = 0,
            bookmark = 1
        }

        //
        public static void ProduceWord2003(string TmplPath, string targetPath, Dictionary<string, Object> marks)
        {
            string tempPath = Path.GetTempFileName();
            try
            {
                if (!dict.ContainsKey(TmplPath)) dict.Add(TmplPath, new Object());
            }
            catch (Exception)
            {


            }
            object lockobj = dict[TmplPath];
            if (lockobj != null)
            {
                lock (lockobj)
                {
                    #region 产生Word
                    ProduceWord(TmplPath, targetPath, tempPath, marks, true);
                    #endregion
                }
            }
        }

        public static void ProduceWord2007UP(string TmplPath, string targetPath, Dictionary<string, Object> marks, ReplaceMode mode)
        {
            string tempPath = Path.GetTempFileName();
            try
            {
                if (!dict.ContainsKey(TmplPath)) dict.Add(TmplPath, new Object());
            }
            catch (Exception)
            {


            }
            object lockobj = dict[TmplPath];
            if (lockobj != null)
            {
                lock (lockobj)
                {
                    #region 产生Word
                    ProduceWord(TmplPath, targetPath, tempPath, marks, false, mode);
                    #endregion
                }
            }
        }

        public static void ProduceWord2007UP(string TmplPath, string targetPath, Dictionary<string, Object> marks) {
            ProduceWord2007UP(TmplPath, targetPath, marks, ReplaceMode.comment);
        }
        //私有方法
        private static void ProduceWord(string TmplPath, string targetPath, string tempPath, Dictionary<string, object> Marks, bool IsNeedToDoc)
        {
            ProduceWord(TmplPath, targetPath, tempPath, Marks, IsNeedToDoc, ReplaceMode.comment);
        }

        private static void ProduceWord(string TmplPath, string targetPath, string tempPath, Dictionary<string, object> Marks, bool IsNeedToDoc, ReplaceMode mode)
        {
            try
            {
                //其实等效于把模板经行一个拷贝
                using (FileStream fsSource = new FileStream(TmplPath, FileMode.Open, FileAccess.Read)) // 先读取源文件
                {
                    using (FileStream fsDes = new FileStream(tempPath, FileMode.Create, FileAccess.Write)) //避免存在不能创建的问题，直接覆盖
                    {
                        fsSource.CopyTo(fsDes);
                        fsSource.Flush();
                        fsDes.Close();
                        fsSource.Close();
                    }
                }
                //把新产生的文件按批注替换
                switch (mode)
                {
                    case ReplaceMode.comment:
                        OpenXmlHelper.ReplaceComments(tempPath, Marks);
                        break;
                    case ReplaceMode.bookmark:
                        OpenXmlHelper.ReplaceBookMarks(tempPath, Marks);
                        break;
                    default:
                        throw new Exception("未使用正确模板替换模式");
                        break;
                }


                //
                if (IsNeedToDoc) OfficeCOM.DocxToDoc(tempPath, targetPath);
                else
                {
                    File.Copy(tempPath, targetPath, true);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                File.Delete(tempPath);
            }
        }
    }
}
