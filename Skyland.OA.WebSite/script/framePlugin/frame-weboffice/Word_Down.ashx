<%@ WebHandler Language="C#" Class="Word_Down" %>

using System;
using System.Web;

public class Word_Down : IHttpHandler
{
    private string ServerRoot = System.AppDomain.CurrentDomain.SetupInformation.ApplicationBase;
    public void ProcessRequest(HttpContext context)
    {

        string relativePath = string.IsNullOrEmpty(context.Request["relativeRootPath"]) ? null : context.Request["relativeRootPath"];
        //直接文件路径
        string severFilePath = string.IsNullOrEmpty(context.Request["severFilePath"]) ? null : context.Request["severFilePath"];

        string Open_fullPath = "";
        //一下是逻辑处理Open_fullPath和Save_fullPath 
        if (!String.IsNullOrEmpty(severFilePath))
        {
            Open_fullPath = severFilePath;
        }
        else if (!String.IsNullOrEmpty(relativePath))
        {
            Open_fullPath = System.IO.Path.Combine(ServerRoot, relativePath);
        }
        else
        {

        }

        System.IO.FileInfo fi = new System.IO.FileInfo(Open_fullPath);
        context.Response.Clear();
        context.Response.Charset = "GB2312";
        context.Response.AddHeader("Content-Disposition", "attachment; filename=" + HttpUtility.UrlEncode(fi.Name));
        context.Response.AddHeader("Content-Length", fi.Length.ToString());
        context.Response.ContentType = "application/octet-stream";
        context.Response.WriteFile(Open_fullPath);
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}