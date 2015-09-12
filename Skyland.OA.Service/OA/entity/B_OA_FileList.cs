using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using IWorkFlow.DataBase;

namespace IWorkFlow.ORM
{
    [Serializable]
    [DataTableInfo("B_OA_FileList", "id")]
    public class B_OA_FileList : QueryInfo
    {
        #region Model
       
        /// <summary>
        /// id
        /// </summary>
        /// 
        [DataField("id", "B_OA_FileList",false)]
        public int id
        {
            set { _id = value; }
            get { return _id; }
        }
        private int _id;

        /// <summary>
        /// 新闻ID
        /// </summary>
        /// 
         [DataField("NewsId", "B_OA_FileList")]
        public string NewsId
        {
            set { _NewsId = value; }
            get { return _NewsId; }
        }
         private string _NewsId;
        /// <summary>
         /// 文件名
        /// </summary>
        /// 
        [DataField("FileName", "B_OA_FileList")]
         public string FileName
        {
            set { _FileName = value; }
            get { return _FileName; }
        }
        private string _FileName;

        /// <summary>
        /// 文件相对路径
        /// </summary>
        /// 
        [DataField("RelativePath", "B_OA_FileList")]
        public string RelativePath
        {
            set { _RelativePath = value; }
            get { return _RelativePath; }
        }
        private string _RelativePath;

        /// <summary>
        /// 文件绝对路径
        /// </summary>
        /// 
        [DataField("AbsolutePath", "B_OA_FileList")]
        public string AbsolutePath
        {
            set { _AbsolutePath = value; }
            get { return _AbsolutePath; }
        }
        private string _AbsolutePath;

        
        /// <summary>
        /// 扩展名
        /// </summary>
        /// 
        [DataField("Extension", "B_OA_FileList")]
        public string Extension
        {
            set { _Extension = value; }
            get { return _Extension; }
        }
        private string _Extension;

        /// <summary>
        ///文件大小(KB)
        /// </summary>
        /// 
        [DataField("FileSize", "B_OA_FileList")]
        public int FileSize
        {
            set { _FileSize = value; }
            get { return _FileSize; }
        }
        private int _FileSize;
        
        /// <summary>
        /// 上传前文件名
        /// </summary>
        /// 
        [DataField("BeforeFileName", "B_OA_FileList")]
        public string BeforeFileName
        {
            set { _BeforeFileName = value; }
            get { return _BeforeFileName; }
        }
        private string _BeforeFileName;

        /// <summary>
        /// 部门
        /// </summary>
        /// 
        [DataField("Dept", "B_OA_FileList")]
        public string Dept
        {
            set { _Dept = value; }
            get { return _Dept; }
        }
        private string _Dept;


        #endregion Model
        
    }
}
