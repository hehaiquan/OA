using DocumentFormat.OpenXml.Wordprocessing;
using DocumentFormat.OpenXml;
using System.Collections.Generic;
using System;
using System.Linq;

namespace IWorkFlow.OfficeService.OpenXml
{
    public class CreateTable
    {
        // Creates an Table instance and adds its children.
        public static Table GenerateTable(Document doc, System.Data.DataTable datetable)
        {
            Table table = new Table();
            //
            PageSize pagesize = doc.Body.Descendants<PageSize>().First();
            PageMargin pagemargin = doc.Body.Descendants<PageMargin>().First();
            //
            Int32Value AvailableSumWidth = (int)(pagesize.Width - pagemargin.Right - pagemargin.Left);

            TableBorders tborder = new Func<TableBorders>(delegate()
            {
                TableBorders tableBorders1 = new TableBorders();
                TopBorder topBorder1 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
                LeftBorder leftBorder1 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
                BottomBorder bottomBorder1 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
                RightBorder rightBorder1 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
                InsideHorizontalBorder insideHorizontalBorder1 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
                InsideVerticalBorder insideVerticalBorder1 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

                tableBorders1.Append(topBorder1);
                tableBorders1.Append(leftBorder1);
                tableBorders1.Append(bottomBorder1);
                tableBorders1.Append(rightBorder1);
                tableBorders1.Append(insideHorizontalBorder1);
                tableBorders1.Append(insideVerticalBorder1);
                return tableBorders1;
            })();


            table.AppendChild<TableProperties>(new TableProperties(
               new TableStyle() { Val = "a7" },
               tborder,
               new TableWidth() { Width = "0", Type = TableWidthUnitValues.Auto },
               new TableLook() { Val = "04A0", FirstRow = true, LastRow = false, FirstColumn = true, LastColumn = false, NoHorizontalBand = false, NoVerticalBand = true }
            ));

            int sumColumn = datetable.Columns.Count;


            int averwidth = AvailableSumWidth / sumColumn;

            Double set_colSumW = 0;
            int remainSumW = 0;
            foreach (System.Data.DataColumn item in datetable.Columns)
            {
                Object col_w = item.ExtendedProperties["width"];
                if (col_w != null) { set_colSumW += Convert.ToDouble(col_w); remainSumW += averwidth; }
            }

            foreach (System.Data.DataColumn item in datetable.Columns)
            {
                Object col_w = item.ExtendedProperties["width"];
                if (col_w != null) item.ExtendedProperties.Add("WordWidth", Math.Floor((remainSumW * Convert.ToDouble(col_w) / set_colSumW)));
                else item.ExtendedProperties.Add("WordWidth", averwidth);
            }


            for (int i = 0; i < sumColumn; i++)
            {
                int col_w = Convert.ToInt32(datetable.Columns[i].ExtendedProperties["WordWidth"]);
                table.AppendChild<GridColumn>(new GridColumn() { Width = col_w.ToString() });
            }
            List<System.Data.DataRow> lstCol = new List<System.Data.DataRow>();
            System.Data.DataRow dr = datetable.NewRow();
            List<object> lstObj = new List<object>();



            foreach (System.Data.DataColumn item in datetable.Columns)
            {
                lstObj.Add(item.ColumnName);
            }



            dr.ItemArray = lstObj.ToArray();
            datetable.Rows.InsertAt(dr, 0);

            foreach (System.Data.DataRow item in datetable.Rows)
            {
                TableRow tableRow = new TableRow() { RsidTableRowAddition = "00D24D12", RsidTableRowProperties = "00D24D12" };
                for (int i = 0; i < sumColumn; i++)
                {
                    int col_w = Convert.ToInt32(datetable.Columns[i].ExtendedProperties["WordWidth"]);

                    string cellValue = item[i].ToString();
                    TableCell tableCell1 = new TableCell();

                    TableCellProperties tableCellProperties1 = new TableCellProperties();
                    TableCellWidth tableCellWidth1 = new TableCellWidth() { Width = col_w.ToString(), Type = TableWidthUnitValues.Dxa };

                    tableCellProperties1.Append(tableCellWidth1);

                    Paragraph paragraph1 = new Paragraph() { RsidParagraphAddition = "00D24D12", RsidParagraphProperties = "003246FB", RsidRunAdditionDefault = "00D24D12" };

                    Run run1 = new Run();

                    RunProperties runProperties1 = new RunProperties();
                    RunFonts runFonts1 = new RunFonts() { Hint = FontTypeHintValues.EastAsia };

                    runProperties1.Append(runFonts1);
                    Text text1 = new Text();
                    text1.Text = cellValue;

                    run1.Append(runProperties1);
                    run1.Append(text1);
                    BookmarkStart bookmarkStart1 = new BookmarkStart();
                    BookmarkEnd bookmarkEnd1 = new BookmarkEnd();

                    paragraph1.Append(run1);
                    paragraph1.Append(bookmarkStart1);
                    paragraph1.Append(bookmarkEnd1);

                    tableCell1.Append(tableCellProperties1);
                    tableCell1.Append(paragraph1);

                    tableRow.Append(tableCell1);
                }
                table.Append(tableRow);
            }
            return table;
        }
    }
}
