using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace BizService.Common
{
    class ComDataDict
    {
        //服务器根目录
        private string ServerRoot = System.AppDomain.CurrentDomain.SetupInformation.ApplicationBase;//根路径
        private string FilePath = System.Configuration.ConfigurationManager.AppSettings["DataDictConfigFile"];//指定文件路径
        private string defFilePath = "config/DataDictConfig.xml";//默认文件路径
        private XmlDocument myXmlDoc;//当前加载的xml

        /// <summary>
        /// 默认构造函数
        /// </summary>
        public ComDataDict()
        {
            string configPath = ServerRoot + (string.IsNullOrWhiteSpace(FilePath) ? defFilePath : FilePath);
            myXmlDoc = new XmlDocument();
            myXmlDoc.Load(configPath);
        }
        /// <summary>
        /// 获取type获取数据字典xml配置
        /// </summary>
        public DataDictConfig GetDataDictConfig(string type)
        {
            try
            {
                var node = myXmlDoc.SelectSingleNode("/root/DataDictConfig/Type[text()='" + type + "']");
                if (node != null)
                {
                    string nodeText = node.ParentNode.OuterXml;
                    return ConvertHelper<DataDictConfig>.XmlDeserialize(nodeText);
                }
                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

    }



    /// <summary>
    /// 数据字典配置类
    /// </summary>
    public class DataDictConfig
    {
        public string Type;
        public string Name;
        public List<DataDictItem> DataDictItems;
    }
    /// <summary>
    /// 数据字典项类
    /// </summary>
    public class DataDictItem
    {
        public string Value;
        public string Name;
        public bool? IsEnabled;
    }

}
