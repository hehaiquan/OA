using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Management;
using System.Text.RegularExpressions;
using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
using System.Runtime.InteropServices;

namespace BizService.Common
{
    /// <summary>
    /// 获取客户端硬件信息
    /// </summary>
    public class HardwareInfo
    {

        ///// <summary>
        ///// 获取CPU序列号代码 
        ///// </summary>
        ///// <returns></returns>
        //public static string GetCpuID()
        //{
        //    try
        //    {
        //        string cpuInfo = "";//cpu序列号 
        //        ManagementClass mc = new ManagementClass("Win32_Processor");
        //        ManagementObjectCollection moc = mc.GetInstances();
        //        foreach (ManagementObject mo in moc)
        //        {
        //            cpuInfo = mo.Properties["ProcessorId"].Value.ToString();
        //        }
        //        moc = null;
        //        mc = null;
        //        return cpuInfo;
        //    }
        //    catch
        //    {
        //        return "unknow";
        //    }
        //    finally
        //    {

        //    }
        //}
        /// <summary>
        /// 获取网卡硬件地址
        /// </summary>
        /// <returns></returns>
        public static string GetMacAddress()
        {
            try
            {
                string IP = GetIPAddress();
                string dirResults = "";
                ProcessStartInfo psi = new ProcessStartInfo();
                Process proc = new Process();
                psi.FileName = "nbtstat";
                psi.RedirectStandardInput = false;
                psi.RedirectStandardOutput = true;
                psi.Arguments = "-A " + IP;
                psi.UseShellExecute = false;
                proc = Process.Start(psi);
                dirResults = proc.StandardOutput.ReadToEnd();
                proc.WaitForExit();
                dirResults = dirResults.Replace("\r", "").Replace("\n", "").Replace("\t", "");

                Regex reg = new Regex("Mac[ ]{0,}Address[ ]{0,}=[ ]{0,}(?<key>((.)*?)) __MAC", RegexOptions.IgnoreCase | RegexOptions.Compiled);
                Match mc = reg.Match(dirResults + " __MAC");


                if (mc.Success)
                {

                    return mc.Groups["key"].Value.Substring(0, 17);    //  如果有虚拟机，就取第一个MAC值。因为虚拟机的MAC值与PC机本地连接的MAC值一样。 
                }
                else
                {
                    reg = new Regex("Host not found", RegexOptions.IgnoreCase | RegexOptions.Compiled);
                    mc = reg.Match(dirResults);
                    if (mc.Success)
                    {
                        return "Host not found!";
                    }
                    else
                    {
                        return "";
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public static string GetCustomerMac()
        {
            string IP = GetIPAddress();
            string dirResults = "";
            ProcessStartInfo psi = new ProcessStartInfo();
            Process proc = new Process();
            psi.FileName = "nbtstat";
            psi.RedirectStandardInput = false;
            psi.RedirectStandardOutput = true;
            psi.Arguments = "-A " + IP;
            psi.UseShellExecute = false;
            proc = Process.Start(psi);
            dirResults = proc.StandardOutput.ReadToEnd();
            proc.WaitForExit();
            dirResults = dirResults.Replace("\r", "").Replace("\n", "").Replace("\t", "");

            Regex reg = new Regex("Mac[ ]{0,}Address[ ]{0,}=[ ]{0,}(?<key>((.)*?)) __MAC", RegexOptions.IgnoreCase | RegexOptions.Compiled);
            Match mc = reg.Match(dirResults + "__MAC");


            if (mc.Success)
            {
                return mc.Groups["key"].Value;
            }
            else
            {
                reg = new Regex("Host not found", RegexOptions.IgnoreCase | RegexOptions.Compiled);
                mc = reg.Match(dirResults);
                if (mc.Success)
                {
                    return "Host not found!";
                }
                else
                {
                    return "";
                }
            }
        }

        ///// <summary>
        ///// 获取硬盘ID 
        ///// </summary>
        ///// <returns></returns>
        //public static string GetDiskID()
        //{
        //    try
        //    {
        //        String HDid = "";
        //        ManagementClass mc = new ManagementClass("Win32_DiskDrive");
        //        ManagementObjectCollection moc = mc.GetInstances();
        //        foreach (ManagementObject mo in moc)
        //        {
        //            HDid = (string)mo.Properties["Model"].Value;
        //        }
        //        moc = null;
        //        mc = null;
        //        return HDid;
        //    }
        //    catch
        //    {
        //        return "unknow";
        //    }
        //    finally
        //    {
        //    }
        //}

        /// <summary>
        /// 获取IP地址
        /// </summary>
        /// <returns></returns>

        public static string GetIPAddress()
        {
            try
            {
                string result = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
                if (null == result || result == String.Empty)
                {
                    result = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
                }

                if (null == result || result == String.Empty)
                {
                    result = HttpContext.Current.Request.UserHostAddress;
                }
                // Add by liushuyi    2009-04-07  start
                if (result == "127.0.0.1" || result == "::1")    //如果是程序服务器本机登录，则取DHCP分配的IP地址。否则用127.0.0.1不能取到网卡地址。
                {
                    System.Net.IPHostEntry ipEntry = System.Net.Dns.GetHostEntry(GetComputerName());
                    foreach (IPAddress ip in ipEntry.AddressList)
                    {
                        if (ip.AddressFamily != AddressFamily.InterNetwork)
                        {
                            continue;
                        }
                        else
                        {
                            result = ip.ToString();
                        }
                    }

                }
                return result;
            }
            catch
            {
                return "unknow";
            }
            finally
            {

            }

        }
        /// <summary>
        /// 获取计算机名
        /// </summary>
        /// <returns></returns>
        public static string GetComputerName()
        {
            try
            {
                return System.Environment.MachineName;
            }
            catch
            {
                return "unknow";
            }
            finally
            {
            }
        }


        //private string GetClientIP()
        //{
        //    string result = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
        //    if (null == result || result == String.Empty)
        //    {
        //        result = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
        //    }

        //    if (null == result || result == String.Empty)
        //    {
        //        result = HttpContext.Current.Request.UserHostAddress;
        //    }
        //    return result;
        //}

        /// <summary>
        /// 获取IP地址
        /// </summary>
        /// <returns></returns>
        [DllImport("Iphlpapi.dll")]
        private static extern int SendARP(Int32 dest, Int32 host, ref Int64 mac, ref Int32 length);
        [DllImport("Ws2_32.dll")]
        private static extern Int32 inet_addr(string ip);
        public static string GetMac()
        {
            string userip = HttpContext.Current.Request.UserHostAddress;
            string strClientIP = HttpContext.Current.Request.UserHostAddress.ToString().Trim();
            Int32 ldest = inet_addr(strClientIP); //目的地的ip 
            Int32 lhost = inet_addr("");   //本地服务器的ip 
            Int64 macinfo = new Int64();
            Int32 len = 6;
            int res = SendARP(ldest, 0, ref macinfo, ref len);
            string mac_src = macinfo.ToString("X");
            //if (mac_src == "0")
            //{
            //    if (userip == "127.0.0.1")
            //        Response.Write("正在访问Localhost!");
            //    else
            //        Response.Write("来自IP为" + userip + "！" + "<br>");
            //    return;
            //}

            while (mac_src.Length < 12)
            {
                mac_src = mac_src.Insert(0, "0");
            }
            string mac_dest = "";
            for (int i = 0; i < 11; i++)
            {
                if (0 == (i % 2))
                {
                    if (i == 10)
                    {
                        mac_dest = mac_dest.Insert(0, mac_src.Substring(i, 2));
                    }
                    else
                    {
                        mac_dest = "-" + mac_dest.Insert(0, mac_src.Substring(i, 2));
                    }
                }
            }
            return mac_dest;

        }



        ///// <summary>
        ///// PC类型
        ///// </summary>
        ///// <returns></returns>
        //public static string GetSystemType()
        //{
        //    try
        //    {
        //        string st = "";
        //        ManagementClass mc = new ManagementClass("Win32_ComputerSystem");
        //        ManagementObjectCollection moc = mc.GetInstances();
        //        foreach (ManagementObject mo in moc)
        //        {

        //            st = mo["SystemType"].ToString();

        //        }
        //        moc = null;
        //        mc = null;
        //        return st;
        //    }
        //    catch
        //    {
        //        return "unknow";
        //    }
        //    finally
        //    {

        //    }
        //}
        ///// <summary>
        ///// 物理内存
        ///// </summary>
        ///// <returns></returns>
        //public static string GetTotalPhysicalMemory()
        //{
        //    try
        //    {

        //        string st = "";
        //        ManagementClass mc = new ManagementClass("Win32_ComputerSystem");
        //        ManagementObjectCollection moc = mc.GetInstances();
        //        foreach (ManagementObject mo in moc)
        //        {

        //            st = mo["TotalPhysicalMemory"].ToString();

        //        }
        //        moc = null;
        //        mc = null;
        //        return st;
        //    }
        //    catch
        //    {
        //        return "unknow";
        //    }
        //    finally
        //    {

        //    }
        //}



    }
}