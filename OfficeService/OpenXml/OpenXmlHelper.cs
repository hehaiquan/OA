using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.InkML;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.Office.Interop.Word;
using Table = DocumentFormat.OpenXml.Wordprocessing.Table;
using Paragraph = DocumentFormat.OpenXml.Wordprocessing.Paragraph;
using Document = DocumentFormat.OpenXml.Wordprocessing.Document;
using Comment = DocumentFormat.OpenXml.Wordprocessing.Comment;
using Comments = DocumentFormat.OpenXml.Wordprocessing.Comments;

namespace IWorkFlow.OfficeService.OpenXml
{
    public class OpenXmlHelper
    {
        public readonly static Dictionary<System.Drawing.Imaging.ImageFormat, ImagePartType> ImageDict = new Dictionary<System.Drawing.Imaging.ImageFormat, ImagePartType>
        {
             {System.Drawing.Imaging.ImageFormat.Jpeg,ImagePartType.Jpeg},
             {System.Drawing.Imaging.ImageFormat.Bmp,ImagePartType.Bmp},
             {System.Drawing.Imaging.ImageFormat.Gif,ImagePartType.Gif},
             {System.Drawing.Imaging.ImageFormat.Emf,ImagePartType.Emf},
             {System.Drawing.Imaging.ImageFormat.Wmf,ImagePartType.Wmf},
             {System.Drawing.Imaging.ImageFormat.Icon,ImagePartType.Icon},
             {System.Drawing.Imaging.ImageFormat.Png,ImagePartType.Png},
             {System.Drawing.Imaging.ImageFormat.Tiff,ImagePartType.Tiff}
        };

        public static void ReplaceComments(string filePath, Dictionary<string, Object> dictmark)
        {
            if (dictmark == null) dictmark = new Dictionary<string, Object>();

            FileStream fs = new FileStream(filePath, FileMode.Open);

            WordprocessingDocument WORD = WordprocessingDocument.Open(fs, true);

            #region 生成Word
            try
            {
                Document doc = WORD.MainDocumentPart.Document;//找到正文处顶级
                MainDocumentPart MainPart = WORD.MainDocumentPart;
                IEnumerable<Comment> comments = WORD.MainDocumentPart.WordprocessingCommentsPart.Comments.Descendants<Comment>();//找到所有批注

                var CommentRangeStarts = doc.Descendants<CommentRangeStart>();
                var CommentRangeEnds = doc.Descendants<CommentRangeEnd>();
                var CommentReferences = doc.Descendants<CommentReference>();

                foreach (Comment comment in comments)
                {
                    string id = comment.Id;
                    string key = comment.InnerText.Trim();
                    var Startnode = CommentRangeStarts.First(p => p.Id == id);
                    var Startnode_a = CommentRangeStarts.First(p => p.Id == id);
                    var Endnode = CommentRangeEnds.First(p => p.Id == id);
                    var Refernode = CommentReferences.First(p => p.Id == id);
                    if (dictmark.ContainsKey(key))
                    {
                        Object value = dictmark[key];
                        if (value is String)
                        {
                            var str = value as string;
                            if (str.Contains("\r\n") || str.Contains("\n"))
                            {
                                var strArray = str.Split(new string[] { "\r\n", "\n" }, StringSplitOptions.RemoveEmptyEntries);
                                value = strArray;
                            }
                            else
                            {
                                Run run = Startnode.NextSibling<Run>();
                                run.ReplaceChild<Text>(new Text(value.ToString()), run.GetFirstChild<Text>());
                                OpenXmlElement nextNode = null;
                                while ((nextNode = run.NextSibling()) is Run) nextNode.Remove();
                            }
                        }
                        if (value is System.Drawing.Image)
                        {
                            //
                            System.Drawing.Image img = value as System.Drawing.Image;

                            ImagePart imagePart = MainPart.AddImagePart(ImageDict[img.RawFormat]);
                            using (MemoryStream ms = new MemoryStream())
                            {
                                img.Save(ms, img.RawFormat);
                                ms.Position = 0;
                                imagePart.FeedData(ms);
                            }
                            Run imagerun = CreateImageRun.GenerateRun(MainPart.GetIdOfPart(imagePart), img);
                            //
                            OpenXmlElement nextNode = null;
                            while ((nextNode = Startnode.NextSibling()) is Run) nextNode.Remove();
                            Startnode.InsertAfterSelf<Run>(imagerun);
                        }
                        if (value is ImageTextArray[])
                        {
                            OpenXmlElement nextNode = null;
                            RunProperties TempStyle = new RunProperties();//= run.RunProperties.Clone() as RunProperties;
                            //
                            OpenXmlElement replacenode = Startnode.Parent;

                            while ((nextNode = Startnode.NextSibling()) is Run)
                            {
                                nextNode.Remove();
                            }
                            ImageTextArray[] imgArray = value as ImageTextArray[];
                            //imgArray = imgArray.OrderByDescending(i=>i).ToArray();
                            //图片
                            for (int i = imgArray.Length - 1; i >= 0; i--)
                            {
                                var img = imgArray[i].Images;
                                var str = imgArray[i].Foots;
                                var text = imgArray[i].Text;

                                //判断是否是手签图片，若不是则将文字套入
                                if (img != null)
                                {
                                    #region insert img
                                    ImagePart imagePart = MainPart.AddImagePart(ImageDict[img.RawFormat]);
                                    using (MemoryStream ms = new MemoryStream())
                                    {
                                        img.Save(ms, img.RawFormat);
                                        ms.Position = 0;
                                        imagePart.FeedData(ms);
                                        ms.Close();
                                    }
                                    Run imagerun = CreateImageRun.GenerateRun(MainPart.GetIdOfPart(imagePart), img);
                                    //
                                    //if (i == 0)
                                    //{
                                    //    Startnode.InsertAfterSelf<Run>(imagerun);
                                    //}
                                    //else
                                    //{
                                    Paragraph imgPgf = new Paragraph(imagerun);

                                    // 进入该段落的ParagraphProperties部分，如果没有，创建新的。  
                                    if (!imgPgf.Elements<ParagraphProperties>().Any())
                                    {
                                        imgPgf.PrependChild<ParagraphProperties>(new ParagraphProperties());
                                    }
                                    ParagraphProperties imgpPr = imgPgf.ParagraphProperties;
                                    if (!imgpPr.Elements<Justification>().Any())
                                    {
                                        imgpPr.PrependChild<Justification>(new Justification());
                                    }
                                    imgpPr.Justification.Val = imgArray[i].ImageAlign;

                                    replacenode.InsertBeforeSelf<Paragraph>(imgPgf);
                                    //} 
                                    #endregion
                                }
                                else
                                {
                                    //文字内容
                                    RunProperties styles_T = new RunProperties(TempStyle.OuterXml);
                                    styles_T.Append(new FontSize() { Val = "24" });
                                    styles_T.Append(new RunFonts() { Ascii = "仿宋", HighAnsi = "仿宋", EastAsia = "仿宋" });
                                    Paragraph pgf_T = new Paragraph(new Run(styles_T, new Text(text)));
                                    if (!pgf_T.Elements<ParagraphProperties>().Any())
                                    {
                                        pgf_T.PrependChild<ParagraphProperties>(new ParagraphProperties());
                                    }
                                    ParagraphProperties pPr_T = pgf_T.ParagraphProperties;
                                    replacenode.InsertBeforeSelf<Paragraph>(pgf_T);
                                }


                                #region 插入用户名与日期
                                RunProperties styles = new RunProperties(TempStyle.OuterXml);
                                styles.Append(new RunFonts() { Ascii = "仿宋", HighAnsi = "仿宋", EastAsia = "仿宋" });
                                styles.Append(new FontSize() { Val = "24" }, new Bold());
                                Paragraph pgf = new Paragraph(new Run(styles, new Text(str)));

                                // 进入该段落的ParagraphProperties部分，如果没有，创建新的。  
                                if (!pgf.Elements<ParagraphProperties>().Any())
                                {
                                    pgf.PrependChild<ParagraphProperties>(new ParagraphProperties());
                                }
                                ParagraphProperties pPr = pgf.ParagraphProperties;
                                if (!pPr.Elements<Justification>().Any())
                                {
                                    pPr.PrependChild<Justification>(new Justification());
                                }
                                pPr.Justification.Val = imgArray[i].FootAlign;

                                replacenode.InsertBeforeSelf<Paragraph>(pgf);
                                #endregion

                                if (img != null)
                                {
                                    img.Dispose();
                                }
                            }
                            //RunProperties stylesLast = new RunProperties(TempStyle.OuterXml);

                            //Paragraph pgfLast = new Paragraph(new Run(stylesLast, new Break()));

                            //// 进入该段落的ParagraphProperties部分，如果没有，创建新的。  
                            //if (!pgfLast.Elements<ParagraphProperties>().Any())
                            //{
                            //    pgfLast.PrependChild<ParagraphProperties>(new ParagraphProperties());
                            //}

                            //replacenode.InsertAfterSelf<Paragraph>(pgfLast);

                        }
                        if (value is System.Data.DataTable)
                        {
                            System.Data.DataTable table = value as System.Data.DataTable;
                            Table tb = CreateTable.GenerateTable(doc, table.Copy());
                            OpenXmlElement nextNode = null;
                            while ((nextNode = Startnode.NextSibling()) is Run) nextNode.Remove();
                            Startnode.Parent.InsertAfterSelf<Table>(tb);
                            Startnode.Parent.Remove();
                        }
                        if (value is IEnumerable<string>)
                        {
                            IEnumerable<string> lst = value as IEnumerable<string>;
                            //
                            Run run = Startnode.NextSibling<Run>();
                            run.ReplaceChild<Text>(new Text(lst.First().ToString()), run.GetFirstChild<Text>());
                            //
                            OpenXmlElement nextNode = null;
                            while ((nextNode = run.NextSibling()) is Run) nextNode.Remove();
                            //
                            RunProperties TempStyle = run.RunProperties.Clone() as RunProperties;
                            TempStyle.Append(new FontSize() { Val = "24" });
                            TempStyle.Append(new RunFonts() { Ascii = "仿宋", HighAnsi = "仿宋", EastAsia = "仿宋" });
                            //
                            OpenXmlElement replacenode = Startnode.Parent;
                            //
                            IEnumerable<string> Afterlst = lst.Reverse();


                            // 方正仿宋_GBK
                            //
                            int sum = 0;
                            foreach (string str in Afterlst)
                            {
                                if (sum == Afterlst.Count() - 1) break;
                                //RunProperties styles = new RunProperties(TempStyle.OuterXml);
                                RunProperties TempStyle2 = run.RunProperties.Clone() as RunProperties;
                                TempStyle2.Append(new FontSize() { Val = "32" });
                                TempStyle2.Append(new RunFonts() { Ascii = "方正仿宋_GBK", HighAnsi = "方正仿宋_GBK", EastAsia = "方正仿宋_GBK" });
                                TempStyle2.Append(new SpacingBetweenLines() { Line = "10000", LineRule = LineSpacingRuleValues.Exact });
                                Paragraph pgf = new Paragraph(new Run(TempStyle2, new Text(str)));
                                replacenode.InsertAfterSelf(pgf);
                                //replacenode.AppendChild(pgf as OpenXmlElement);
                                sum++;
                            }
                            //

                        }
                    }
                    Startnode.Remove();
                    Endnode.Remove();
                    Refernode.Parent.Remove();
                }
                WORD.MainDocumentPart.RemoveAnnotations<Comments>();
                doc.Save();
            }
            finally
            {
                WORD.Close();
                fs.Close();
            }
            #endregion
        }


        public static void ReplaceBookMarks(string filePath, Dictionary<string, Object> dictmark)
        {
            if (dictmark == null) dictmark = new Dictionary<string, Object>();

            FileStream fs = new FileStream(filePath, FileMode.Open);

            WordprocessingDocument WORD = WordprocessingDocument.Open(fs, true);

            try
            {
                Document doc = WORD.MainDocumentPart.Document;//找到正文处顶级

                IEnumerable<BookmarkStart> lstbookStarts = doc.Descendants<BookmarkStart>();
                IEnumerable<BookmarkEnd> lstbookEnds = doc.Descendants<BookmarkEnd>();

                foreach (var Bookmark in lstbookStarts)
                {
                    string id = Bookmark.Id;
                    string key = Bookmark.Name;
                    //
                    var Startnode = lstbookStarts.First(p => p.Id == id);
                    var Endnode = lstbookEnds.First(p => p.Id == id);
                    //
                    if (dictmark.ContainsKey(key))
                    {
                        Object value = dictmark[key];
                        if (value is String)
                        {
                            Run run = Startnode.NextSibling<Run>();
                            run.ReplaceChild<Text>(new Text(value.ToString()), run.GetFirstChild<Text>());
                            OpenXmlElement nextNode = null;
                            while ((nextNode = run.NextSibling()) is Run) nextNode.Remove();
                        }
                        //Startnode.Remove();
                        //Endnode.Remove();
                    }
                }
                doc.Save();
            }
            finally
            {
                WORD.Close();
                fs.Close();
            }

        }

        public class ImageTextArray
        {
            private System.Drawing.Image _images;
            private string _text;
            /// <summary>
            /// 图片对象
            /// </summary>
            public Image Images
            {
                get { return _images; }
                set { _images = value; }
            }

            public string Foots
            {
                get { return _foots; }
                set { _foots = value; }
            }

            public string Text
            {
                get { return _text; }
                set
                {
                    _text = value;
                }
            }
            //图片脚注
            private string _foots;

            public JustificationValues ImageAlign = JustificationValues.Both;

            public JustificationValues FootAlign = JustificationValues.Right;

            public JustificationValues TextAlign = JustificationValues.Left;
        }
    }
}
