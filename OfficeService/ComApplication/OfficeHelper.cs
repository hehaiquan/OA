using System;

namespace IWorkFlow.OfficeService.ComApplication
{
    public class OfficeCOM
    {
        public static string DocxToDoc(object sourceFileName, object targetFileName)
        {
            object saveOption = Microsoft.Office.Interop.Word.WdSaveOptions.wdDoNotSaveChanges;
            Microsoft.Office.Interop.Word.Application wordApp = new Microsoft.Office.Interop.Word.Application();
            object missingValue = Type.Missing;
            try
            {

                //sourceFileName = "‪D:\\lyq\\Documents\\“智慧监测”信息平台简介.docx";

                //targetFileName = "‪D:\\lyq\\Documents\\“智慧监测”信息平台简介.doc";
                //此种方式会造成文档的格式在转换过程中丢失
                //var doc = new Document(sourceFileName.ToString()); 
                //doc.Save(targetFileName.ToString(), SaveFormat.Doc); 

                // 此种方式在服务器上调用自动化组件容易报错

                wordApp.Visible = false;
                Microsoft.Office.Interop.Word.Document doc = wordApp.Documents.Open(
                    ref sourceFileName,
                    ref missingValue, ref missingValue, ref missingValue, ref missingValue,
                    ref missingValue, ref missingValue, ref missingValue, ref missingValue,
                    ref missingValue, ref missingValue, ref missingValue, ref missingValue,
                    ref missingValue, ref missingValue, ref missingValue);

                if (doc == null)
                {
                    wordApp.Application.Quit(ref saveOption, ref missingValue, ref missingValue);

                    return "初始化word文件错误" + sourceFileName;
                }

                object fileFormat = Microsoft.Office.Interop.Word.WdSaveFormat.wdFormatDocument;
                object lockComments = false;
                object password = missingValue;
                object addToRecentFiles = false;
                object writePassword = missingValue;
                object readOnlyRecommended = false;
                object embedTrueTypeFonts = true;
                object saveNativePictureFormat = missingValue;
                object saveFormsData = missingValue;
                object saveAsAOCELetter = missingValue;
                object encoding = missingValue;
                object insertLineBreaks = missingValue;
                object allowSubstitutions = missingValue;
                object lineEnding = missingValue;
                object addBiDiMarks = missingValue;


                doc.SaveAs(ref targetFileName, ref fileFormat,
                    ref lockComments, ref password, ref addToRecentFiles, ref writePassword,
                    ref readOnlyRecommended, ref embedTrueTypeFonts, ref saveNativePictureFormat, ref saveFormsData,
                    ref saveAsAOCELetter, ref encoding, ref insertLineBreaks, ref allowSubstitutions,
                    ref lineEnding, ref addBiDiMarks);


                wordApp.Documents.Close(ref missingValue, ref missingValue, ref missingValue);

                //关闭进程
                wordApp.Application.Quit(ref saveOption, ref missingValue, ref missingValue);

                return "";
            }
            catch (Exception e)
            {
                wordApp.Application.Quit(ref saveOption, ref missingValue, ref missingValue);

                return e.Message + e.StackTrace + targetFileName;
            }
        }
    }
}
