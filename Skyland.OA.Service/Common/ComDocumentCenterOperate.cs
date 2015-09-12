using IWorkFlow.Host;
using IWorkFlow.ORM;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BizService.Common
{
    public class ComDocumentCenterOperate
    {
        public static string fileTypeName = "";
        //通过文章类别ID查找文章类别的根节点，并组成字符串拼接起来
        public static string getFileTypeNameByFileTypeId(string fileTypeId, IDbTransaction tran)
        {
            B_OA_FileType fileType = new B_OA_FileType();
            fileType.Condition.Add("FileTypeId = " + fileTypeId);
            fileType = Utility.Database.QueryObject<B_OA_FileType>(fileType);
            fileTypeName = fileType.FileTypeName + ";" + fileTypeName;
            if (fileType.ParentId == "0")
            {
                return fileTypeName;
            }
            else
            {
                return getFileTypeNameByFileTypeId(fileType.ParentId, tran);
            }
        }

        //通过文章类别ID查找文章类别的根节点，并组成字符串拼接起来
        public static B_OA_FileType GetFileTypeByFlayType(string flagType, IDbTransaction tran)
        {
            B_OA_FileType fileType = new B_OA_FileType();
            fileType.Condition.Add("flagType = " + flagType);
            fileType = Utility.Database.QueryObject<B_OA_FileType>(fileType);
            return fileType;
        }
    }
}
