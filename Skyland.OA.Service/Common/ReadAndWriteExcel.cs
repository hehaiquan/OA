using System;
using System.Data;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;
//using Excel;
using System.Reflection;
using System.IO;
using System.Collections;
using System.Data.OleDb;

namespace BizService.Common
{
    public class ReadAndWriteExcel
    {

        //public Excel.Worksheet xSheet;
        //public Excel.Application xApp;
        //public Excel.Workbook xBook;

        //public ReadAndWriteExcel() { }

        //public ReadAndWriteExcel(String ExcelPath, int sheet)
        //{

        //    //创建Application对象 
        //    xApp = new Excel.ApplicationClass();
        //    //xApp.Visible = true;如果值设为真则会打开Excel,假则不会打开

        //    //得到WorkBook对象, 可以用两种方式之一: 下面的是打开已有的文件 
        //    xBook = xApp.Workbooks._Open(ExcelPath,
        //    Missing.Value, Missing.Value, Missing.Value, Missing.Value
        //    , Missing.Value, Missing.Value, Missing.Value, Missing.Value
        //    , Missing.Value, Missing.Value, Missing.Value, Missing.Value);

        //    //指定要操作的Sheet，两种方式：
        //    xSheet = (Excel.Worksheet)xBook.Sheets[sheet];
        //    //Excel.Worksheet xSheet=(Excel.Worksheet)xApp.ActiveSheet;

        //}

        //public ReadAndWriteExcel(int sheet)
        //{

        //    //创建Application对象 
        //    xApp = new Excel.ApplicationClass();
        //    //xApp.Visible = true;如果值设为真则会打开Excel,假则不会打开

        //    //得到WorkBook对象, 可以用两种方式之一: 下面新建文件 

        //    xBook = xApp.Workbooks.Add(Missing.Value);//新建文件的代码 

        //    //指定要操作的Sheet，两种方式：
        //    xSheet = (Excel.Worksheet)xBook.Sheets[sheet];
        //    //Excel.Worksheet xSheet=(Excel.Worksheet)xApp.ActiveSheet;

        //}

        ////读取Excel中指定单元格的数据,通过Range对象
        //public String ReadExcel(String tableId)
        //{

        //    //读取数据，通过Range对象 
        //    //Excel.Range rng1 = xSheet.get_Range("A1", Type.Missing);
        //    Excel.Range rng1 = xSheet.get_Range(tableId, Type.Missing);
        //    String ExcelResult = rng1.Value2.ToString();
        //    Console.WriteLine(rng1.Value2);

        //    //读取，通过Range对象，但使用不同的接口得到Range 
        //    //Excel.Range rng2 = (Excel.Range)xSheet.Cells[3, 1];
        //    //Console.WriteLine(rng2.Value2);
        //    xApp.Quit(); //这一句是非常重要的，否则Excel对象不能从内存中退出 
        //    xApp = null;

        //    return ExcelResult;
        //}






        ///// <summary>
        ///// 写入数据到Excel
        ///// </summary>
        //public String writeExcel(string filePath, ArrayList li, String dateT, String factoryName, String checkPerson)
        //{
        //    String title = factoryName + dateT + "  " + checkPerson + "验货结果通报";
        //    String result = "写入数据成功";
        //    try
        //    {
        //        //Excel.Range rng3 = xSheet.get_Range("C6", Missing.Value);
        //        Excel.Range rng;
        //        rng = (Excel.Range)xSheet.Cells[1, 1];
        //        rng.Value2 = title;
        //        rng = (Excel.Range)xSheet.Cells[2, 1];
        //        rng.Value2 = dateT;
        //        ArrayList l = (ArrayList)li[(li.Count - 1)];
        //        int x = 0;
        //        while (x < l.Count)
        //        {
        //            rng = (Excel.Range)xSheet.Cells[3, x + 1 + 27];//加列要在这修改,输出不良名称
        //            rng.Value2 = (String)l[x];
        //            x++;
        //        }
        //        for (int i = 0; i < li.Count - 1; i++)
        //        {
        //            ArrayList lis = (ArrayList)li[i];
        //            for (int e = 0; e < lis.Count; e++)
        //            {
        //                if (e + 1 == lis.Count)
        //                {
        //                    ArrayList list = (ArrayList)lis[e];
        //                    for (int n = 0; n < list.Count; n += 2)
        //                    {

        //                        for (int w = 1; w <= l.Count; w++)
        //                        {
        //                            rng = (Excel.Range)xSheet.Cells[3, w + 27];//加列要在这修改
        //                            if (rng.Value2.Equals((String)list[n]))
        //                            {
        //                                rng = (Excel.Range)xSheet.Cells[i + 6, w + 27];//加列要在这修改
        //                                rng.Value2 = (String)list[n + 1];
        //                                break;
        //                            }
        //                        }
        //                    }

        //                }
        //                else
        //                {
        //                    rng = (Excel.Range)xSheet.Cells[i + 6, e + 2];
        //                    rng.Value2 = (String)lis[e];
        //                }
        //            }
        //        }
        //        //rng3.Interior.ColorIndex = 6; //设置Range的背景色

        //        FileInfo fi = new FileInfo(@filePath);
        //        if (fi.Exists)
        //        {
        //            fi.Delete();//册除文件
        //        }
        //        //File.Copy("c:\\sourceTable.xls", @filePath, true);
        //        saveData(2, filePath);//保存文件
        //        xBook.Close(false, Missing.Value, Missing.Value);//这一句是非常重要的，否则xBook对象不能从内存中退出
        //        //this.Application.ActiveWorkbook.Close(false, missing, missing);

        //        xApp = null;
        //        xApp.Quit();//这一句是非常重要的，否则Excel对象不能从内存中退出 
        //        System.Runtime.InteropServices.Marshal.ReleaseComObject(xSheet);
        //        System.Runtime.InteropServices.Marshal.ReleaseComObject(xBook);
        //        System.Runtime.InteropServices.Marshal.ReleaseComObject(xApp);
        //        System.Runtime.InteropServices.Marshal.ReleaseComObject("Excel");
        //        return result;
        //    }
        //    catch (Exception ex)
        //    {
        //        result += "写入数据失败<br>" + ex.ToString();
        //        return result;

        //    }


        //}


    }
}
