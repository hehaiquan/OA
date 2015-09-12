using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Reflection;
using System.Collections;
using Newtonsoft.Json;
using System.Web;
using System.Text.RegularExpressions;


namespace alert_xml
{
    public sealed class AlertXmlHelper
    {
        private static string _imgs = @"\imgs";//接警附件文件子目录
        private static string _files = @"\files";//接警附件图片子目录
        private static string _saveDir = @"\officeFile\AlertData";
        private static string _jcdFileName = "jcd.json";//监测点的配置信息
        private static string _reportsFileName=@"\report.json";//监测数据报

        static AlertXmlHelper()
        {
            _saveDir = AppDomain.CurrentDomain.BaseDirectory + _saveDir;
            if (!Directory.Exists(_saveDir))
            {
                Directory.CreateDirectory(_saveDir);
            }
        }

        /// <summary>
        /// 新创建一个接警文件
        /// </summary>
        /// <param name="type"></param>
        /// <param name="fileNameWithoutExtension"></param>
        /// <param name="fileName">文件名称，默认为guid</param>
        /// <returns></returns>
        public string NewAlert(Type type, string guid, string fileName = null)
        {
            //这里文件夹名可以随便取
            var dir = Path.Combine(_saveDir, guid);
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }
            if (fileName == null) fileName = guid;
            if (fileName.Length > 255) fileName = fileName.Substring(0, 255);//文件名最长为255个字节
            string file = Path.Combine(dir, fileName + ".xml");
            using (MemoryStream fs = new MemoryStream())
            {
                XmlWriterSettings settings = new XmlWriterSettings();
                settings.Indent = true;
                settings.Encoding = new UTF8Encoding(false);
                settings.NewLineChars = Environment.NewLine;
                using (XmlWriter xml_w = XmlWriter.Create(fs, settings))
                {
                    xml_w.WriteStartDocument();
                    xml_w.WriteStartElement(type.Name + "s");
                    xml_w.WriteStartElement(type.Name);
                    //反射所有字段
                    PropertyInfo[] fields = type.GetProperties();
                    foreach (var field in fields)
                    {
                        var attr = field.GetCustomAttribute(typeof(NotIncludeAttribute));
                        if (attr != null) continue;

                        var localName = field.Name;
                        attr = field.GetCustomAttribute(typeof(DisplayNameAttribute));
                        if (attr != null)
                        {
                            localName = (attr as DisplayNameAttribute).DisplayName;
                        }
                        xml_w.WriteStartElement(localName);
                        if (localName == "id")
                        {
                            xml_w.WriteString(guid);
                        }
                        xml_w.WriteEndElement();
                    }
                    xml_w.WriteEndElement();
                    xml_w.WriteEndElement();
                    xml_w.WriteEndDocument();
                }
                using (FileStream ms = new FileStream(file, FileMode.Create))
                {
                    fs.WriteTo(ms);
                    fs.Flush();
                    fs.Close();
                }
            }
            return guid;
        }

        /// <summary>
        /// 保存一个接警文件，可以兼容新的结构数据，没有这个结构就创建
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public bool SaveAlert(AlertModel model)
        {
            string file = null;
            try
            {
                file = GetFilePath(model.id);
            }
            catch (Exception)
            {
                string _file_name = model.sjmc + "_" + model.fssj;
                _file_name = _file_name.Replace('/', '-').Replace(':', '-');
                _file_name = Regex.Replace(_file_name, @"[\\/:\*\?\<\>|]*", "");
                NewAlert(typeof(AlertModel), model.id, _file_name);
                file = GetFilePath(model.id);
            }
            if (!File.Exists(file))
                throw new Exception("文件获取失败，可能已被删，可能创建失败!");

            XmlDocument xml = new XmlDocument();
            xml.Load(file);
            string rootName = "//" + typeof(AlertModel).Name;
            XmlNode rootNode = xml.SelectSingleNode(rootName);
            if (rootNode == null) return false;
            PropertyInfo[] fields = typeof(AlertModel).GetProperties();
            foreach (var field in fields)
            {
                var localName = field.Name;
                var attr = field.GetCustomAttribute(typeof(DisplayNameAttribute));
                if (attr != null)
                    localName = (attr as DisplayNameAttribute).DisplayName;
                if (localName == "id") 
                    continue;
                XmlNode tp_node = rootNode.SelectSingleNode(localName);
                
                //先判断这个字段存不存在，不存在则创建，notInclude字段除外，为了兼容之前的数据
                if (tp_node == null) {
                    attr = field.GetCustomAttribute(typeof(NotIncludeAttribute));
                    if (attr != null) continue;
                    //创建这个字段
                    tp_node = xml.CreateElement(localName);
                    rootNode.AppendChild(tp_node);
                }

                if (field.PropertyType == typeof(string) || field.PropertyType.IsValueType)
                    tp_node.InnerText = field.GetValue(model) == null ? "" : field.GetValue(model).ToString();
            }
            xml.Save(file);
            return true;
        }

        /// <summary>
        /// 删除一个接警信息
        /// </summary>
        /// <param name="guid"></param>
        /// <returns></returns>
        public bool DeleteAlert(string guid)
        {
            string dir = Path.Combine(_saveDir, guid);
            if (Directory.Exists(dir))
            {
                try
                {
                    Directory.Delete(dir, true);
                    return true;
                }
                catch (Exception)
                {
                    throw;
                }
            }
            return true;
        }

        /// <summary>
        /// 根据id获取接警详细信息
        /// </summary>
        /// <param name="guid"></param>
        /// <returns></returns>
        public AlertModel GetAlert(string guid)
        {
            var file = GetFilePath(guid);
            var file_dir = Path.GetDirectoryName(file);

            AlertModel model = new AlertModel();
            model.id = guid;

            XmlDocument xml = new XmlDocument();
            xml.Load(file);
            string rootName = "//" + typeof(AlertModel).Name;
            XmlNode rootNode = xml.SelectSingleNode(rootName);
            if (rootNode == null)
                return model;

            PropertyInfo[] fields = typeof(AlertModel).GetProperties();
            foreach (var field in fields)
            {
                var localName = field.Name;
                var attr = field.GetCustomAttribute(typeof(DisplayNameAttribute));
                if (attr != null)
                    localName = (attr as DisplayNameAttribute).DisplayName;
                if (localName == "id") continue;

                XmlNode tp_node = rootNode.SelectSingleNode(localName);
                if (field.PropertyType == typeof(string) || field.PropertyType.IsValueType)
                {
                    if (tp_node != null)
                        field.SetValue(model, tp_node.InnerText.Trim());
                    else
                        field.SetValue(model, "");//为了兼容之前的数据
                }
                else
                {
                    if (!typeof(IEnumerable).IsAssignableFrom(field.PropertyType)) continue;
                    var lst = field.PropertyType.GetConstructor(Type.EmptyTypes).Invoke(null) as IList;
                    field.SetValue(model, lst);

                    //加载图片，附件信息
                    var attr_tp = field.GetCustomAttribute(typeof(NotIncludeAttribute));
                    if (attr_tp != null)
                    {
                        string dir = string.Empty;
                        string[] includes = { ".png", ".jpg", ".bmp", ".gif", "jpeg" };
                        var baseDir = AppDomain.CurrentDomain.BaseDirectory;
                        if (localName == "tps")
                            dir = file_dir + _imgs;
                        else if (localName == "fjs")
                            dir = file_dir + _files;
                        if (!Directory.Exists(dir)) continue;
                        var dInfo = new DirectoryInfo(dir);

                        foreach (var tp in dInfo.GetFiles())
                        {
                            if (localName == "tps")
                            {
                                if (!includes.Contains(tp.Extension)) continue;
                            }
                            var http_path = tp.FullName.Replace(baseDir, "").Replace(@"\", "/");
                            lst.Add(http_path);
                        }
                        continue;
                    }

                    if (tp_node == null) continue;//为了兼容之前的数据

                    //加载除图片，附件之外的其他信息
                    attr_tp = field.GetCustomAttribute(typeof(DescriptionAttribute));
                    localName = (attr_tp as DescriptionAttribute).Description;

                    var nodeList = tp_node.SelectNodes(localName);
                    if (nodeList == null || nodeList.Count == 0) continue;

                    if (field.PropertyType.GetGenericArguments()[0] == typeof(string))
                    {
                        foreach (XmlNode node in nodeList)
                        {
                            lst.Add(node.InnerText.Trim());
                        }
                    }
                    else
                    {
                        //这里存在一个局限，就是不适用字典时，只能支持name,id，相当于写死了
                        foreach (XmlNode node in nodeList)
                        {
                            var name = node.SelectSingleNode("name").InnerText.Trim();
                            var id = node.SelectSingleNode("id").InnerText.Trim();
                            var extValues = "";
                            if(node.SelectSingleNode("extendValues")!=null)
                                extValues = node.SelectSingleNode("extendValues").InnerText.Trim();
                            lst.Add(new Item { name = name, id = id,extendValues=extValues });
                        }
                    }
                }
            }
            return model;
        }

        /// <summary>
        /// 获取所有的接警信息
        /// </summary>
        /// <returns></returns>
        public List<AlertModelSimple> GetAlertList()
        {
            List<AlertModelSimple> lst = new List<AlertModelSimple>();
            DirectoryInfo dirInfo = new DirectoryInfo(_saveDir);
            AlertModelSimple ams = null;
            XmlNode rootNode = null;
            XmlDocument doc = null;
            string file = null;
            var xPath = "//" + typeof(AlertModel).Name;
            var props = typeof(AlertModelSimple).GetProperties();
            foreach (var dir in dirInfo.GetDirectories())
            {
                try
                {
                    file = GetFilePath(dir.Name);
                }
                catch (Exception)
                {
                    continue;
                }
                doc = new XmlDocument();
                doc.Load(file);
                rootNode = doc.SelectSingleNode(xPath);
                if (rootNode == null) continue;

                ams = new AlertModelSimple();
                foreach (var prop in props)
                {
                    var localName = prop.Name;
                    var attr = prop.GetCustomAttribute(typeof(DisplayNameAttribute));
                    if (attr != null)
                        localName = (attr as DisplayNameAttribute).DisplayName;
                    prop.SetValue(ams, rootNode.SelectSingleNode(localName).InnerText.Trim());
                }
                lst.Add(ams);
            }
            return lst;
        }

        /// <summary>
        /// 更新单个节点值
        /// </summary>
        /// <param name="guid"></param>
        /// <param name="dataTokens"></param>
        /// <returns></returns>
        public object UpdateSpecialItem(string guid, Dictionary<string, object> dataTokens)
        {
            string file = GetFilePath(guid);
            XmlDocument xml = new XmlDocument();
            xml.Load(file);
            string rootName = "//" + typeof(AlertModel).Name;
            XmlNode rootNode = xml.SelectSingleNode(rootName);
            if (rootNode == null)
                return false;
            string localName = null;
            Type type = typeof(AlertModel);
            foreach (var item in dataTokens)
            {
                localName = item.Key;
                var propInfo = type.GetProperty(localName);
                var attr = propInfo.GetCustomAttribute(typeof(DisplayNameAttribute));
                if (attr != null)
                    localName = (attr as DisplayNameAttribute).DisplayName;
                XmlNode node = rootNode.SelectSingleNode(localName);

                //开始设置值，分string,List<string>,HttpPostFiles
                if (propInfo.PropertyType == typeof(string) || propInfo.PropertyType.IsValueType)
                {
                    if (node == null) continue;
                    node.InnerText = item.Value.ToString();
                }
                else//复合结构
                {
                    if (item.Value is HttpFileCollection)//添加文件
                    {
                        var dir = string.Empty;
                        List<string> rnFiles = new List<string>();//返回路径
                        if (localName == "tps")
                            dir = Path.GetDirectoryName(file) + _imgs;
                        else
                            dir = Path.GetDirectoryName(file) + _files;
                        if (!Directory.Exists(dir))
                            Directory.CreateDirectory(dir);
                        var files = item.Value as HttpFileCollection;
                        string[] includes = { ".png", ".jpg", ".bmp", ".gif", "jpeg"};
                        foreach (HttpPostedFile tp in files.GetMultiple(files.AllKeys[0]))
                        {
                            string fileName = Path.GetFileName(tp.FileName);
                            if (localName == "tps" && !includes.Contains(Path.GetExtension(fileName))) continue;
                            string savePath = dir + "\\" + fileName;
                            tp.SaveAs(savePath);
                            var http_path = savePath.Replace(AppDomain.CurrentDomain.BaseDirectory, "").Replace(@"\", "/");
                            rnFiles.Add(http_path);
                        }
                        return rnFiles;
                    }
                    if (item.Value is String) //删除文件
                    {
                        string rel_path = item.Value.ToString().Replace("/", "\\");
                        if (File.Exists(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, rel_path)))
                            File.Delete(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, rel_path));
                        continue;
                    }

                    if (node == null) continue;
                    node.RemoveAll();//预案信息，涉事企业信息
                    attr = propInfo.GetCustomAttribute(typeof(DescriptionAttribute));
                    localName = (attr as DescriptionAttribute).Description;

                    var lst = item.Value as IEnumerable;
                    foreach (var tp_item in lst)
                    {
                        XmlElement ele = xml.CreateElement(localName);
                        Type itemType = tp_item.GetType();
                        if (itemType == typeof(string) || itemType.IsValueType)
                        {
                            ele.InnerText = tp_item.ToString();
                        }
                        else
                        {
                            var tp_Props = itemType.GetProperties();
                            foreach (var prop in tp_Props)
                            {
                                XmlElement inner_ele = xml.CreateElement(prop.Name);
                                inner_ele.InnerText = (prop.GetValue(tp_item)!=null)?prop.GetValue(tp_item).ToString():"";
                                ele.AppendChild(inner_ele);
                            }
                        }
                        node.AppendChild(ele);
                    }

                }
            }
            xml.Save(file);
            return true;
        }

        //根据guid获取接警信息
        public string GetFilePath(string guid)
        {
            var dirs = Directory.GetDirectories(_saveDir, guid);
            if (dirs.Length == 0)
            {
                throw new FileNotFoundException("接警信息已被删除!");
            }
            var files = Directory.GetFiles(dirs[0],"*.xml");
            if (files.Length == 0)
            {
                throw new FileNotFoundException("接警信息已被删除!");
            }
            return files[0];
        }

        /// <summary>
        /// 监测点配置的保存
        /// </summary>
        /// <param name="guid"></param>
        /// <returns></returns>
        public string GetJCDFilePath(string guid)
        {
            string dir= _saveDir + "\\" + guid + "\\" + _jcdFileName;
            if (Directory.Exists(dir))
                Directory.CreateDirectory(dir);
            return dir;
        }

        /// <summary>
        /// 监测数据报
        /// </summary>
        /// <param name="guid"></param>
        /// <returns></returns>
        public string GetReportPath(string guid) {
            return _saveDir + "\\" + guid + "\\" + _reportsFileName;
        }


    }
    [Serializable]
    public class AlertModel
    {

        public string id
        {
            get;
            set;
        }
        //事件guid

        public string status
        {
            get;
            set;
        }
        //事故状态

        /*基本信息*/
        public string sjmc
        {
            get;
            set;
        }
        //事件名称

        public string fssj
        {
            get;
            set;
        }
        //发生时间

        public string sjdd
        {
            get;
            set;
        }
        //事件地点

        public string sjqy
        {
            get;
            set;
        }
        //事件起因

        public string sjxz
        {
            get;
            set;
        }
        //事件性质

        public string jbgc
        {
            get;
            set;
        }
        //基本过程

        public string zywrw
        {
            get;
            set;
        }
        //主要污染源

        public string wrwsl
        {
            get;
            set;
        }
        //污染源数量

        public string ryshqk
        {
            get;
            set;
        }
        //人员受害情况

        public string mgdsyxqk
        {
            get;
            set;
        }
        //敏感点受影响情况

        public string sjfzqs
        {
            get;
            set;
        }
        //事件发展趋势

        public string czqk
        {
            get;
            set;
        }
        //处置情况

        public string ncqcs
        {
            get;
            set;
        }
        //拟采取的措施

        public string xybgzjy
        {
            get;
            set;
        }
        //下一步工作建议

        public string bjly
        {
            get;
            set;
        }
        //报警来源

        public string jjsj
        {

            get;
            set;
        }
        //接警时间

        public string lxr
        {
            get;
            set;
        }
        //联系人

        public string lxrdh
        {
            get;
            set;
        }
        //联系人电话

        /*核实信息*/
        public string hsr
        {
            get;
            set;
        }
        //核实人

        public string hssj
        {
            get;
            set;
        }
        //核实时间

        public string hsfs
        {
            get;
            set;
        }
        //核实方式

        public string hsqk
        {
            get;
            set;
        }
        //核实情况

        public string sjjb
        {
            get;
            set;
        }
        //事件级别


        /*预警信息*/
        public string nbyjxx
        {
            get;
            set;
        }
        //内部预警信息

        [Description("ent")]
        public List<Item> ents
        {
            get;
            set;
        }
        //涉事企业

        [Description("plan")]
        public List<Item> plans
        {
            get;
            set;
        }
        //涉事企业

        [Description("yjReport")]
        public List<Item> yjReports
        {
            get;
            set;
        }
        //应急监测快报

        /*处理结果*/
        public string jarq
        {
            get;
            set;
        }
        //结案日期 

        public string cljg
        {
            get;
            set;
        }
        //处理结果

        public string zyylwt
        {
            get;
            set;
        }
        //主要遗留问题


        /*地理位置信息，报告信息、图片信息*/
        public string jd
        {
            get;
            set;
        }
        //经度

        public string wd
        {
            get;
            set;
        }
        //纬度

        [NotInclude]
        public List<string> tps
        {
            get;
            set;
        }
        //图片

        [NotInclude]
        public List<string> fjs
        {
            get;
            set;
        }
        //附件
    }

    public class AlertModelSimple
    {
        public string id
        {
            get;
            set;
        }
        //事件guid

        public string sjmc
        {
            get;
            set;
        }
        //事件名称

        public string fssj
        {
            get;
            set;
        }
        //发生时间

        public string jbgc
        {
            get;
            set;
        }
        //基本过程

        public string status
        {
            get;
            set;
        }
        //事故状态
    }

    public class Item
    {
        public string name
        {
            get;
            set;
        }
        public string id
        {
            get;
            set;
        }
        //额外数据
        public string extendValues{get;set;}
    }


    /// <summary>
    /// 剔除这些属性，方便维护
    /// </summary>
    [AttributeUsage(AttributeTargets.Field | AttributeTargets.Property)]
    public class NotIncludeAttribute : Attribute { }
}
