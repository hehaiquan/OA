using BizService.Common;
using DocumentFormat.OpenXml.Wordprocessing;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IWorkFlow.ORM
{
    public class B_OA_PrintParagragh : QueryInfo
    {
        private string _Foots;

        public string Foots
        {
            set { _Foots = value; }
            get { return _Foots; }
        }

        private string _Text;

        public string Text
        {
            set { _Text = value; }
            get { return _Text; }
        }
        private Image _Image;

        public Image Image
        {
            set { _Image = value; }
            get { return _Image; }
        }

        public JustificationValues FootAlign
        {
            set { _FootAlign = value; }
            get { return _FootAlign; }
        }
        private JustificationValues _FootAlign;

        public string ActID
        {
            set { _ActID = value; }
            get { return _ActID; }
        }
        private string _ActID;

        public string UserName
        {
            set { _UserName = value; }
            get { return _UserName; }
        }
        private string _UserName;

    }
}
