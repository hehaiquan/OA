using System;
using System.Collections.Generic;
using System.Linq;

namespace BizService.Common
{
    public class AtmoDispersion
    {
        public double L0 = 108.366067222222;
        double m_maxc = 0;
        string pArray, pArray1, pArray2, pArray3, pArray4 = "";
        List<PointClass> lstPs, lstPe, lstArray;
        private IEnumerable<PointLeaflet> lstLeafPoint;
        clsCoordinateTran coordinateTran = new clsCoordinateTran();
        private PointClass[] array;

        public GaussResult ComputeYuanQiang(double Nongdu, double Speed, double distance, int FSTime1, int FSTime2, int Direction, string strWDD, PointClass pt, string strSSND,
            string strWXND, string strJJND, string strPFXZ)//q为源强，u为平均风速,level为将其扩散结果分层。
        {
            double ay = 0;
            double az = 0;
            double yuanqiang = 0;
            double z = 1;
            double tx = 0, ty = 0;
            tx = pt.X;
            ty = pt.Y;

            if (Speed <= 0 || Nongdu <= 0)
                return null;
            double x, y;
            x = y = distance;
            ay = this.GetAY(x, strWDD);
            az = this.GetAZ(x, strWDD);
            double temp = Math.Exp(-0.5 * (((y * y) / (ay * ay)) + ((z * z) / (az * az))));
            yuanqiang = Nongdu / 1000 * (3.14 * Speed * ay * az) / (temp);
            return DrawModel(yuanqiang, Speed, FSTime1, FSTime2, Direction, strWDD, pt, strSSND, strWXND, strJJND, strPFXZ);
        }

        public GaussResult DrawModel(double YuanQiang, double Speed, int FSTime1, int FSTime2, int Direction, string strWDD, PointClass pt, string strSSND,
            string strWXND, string strJJND, string strPFXZ)//q为源强，u为平均风速,level为将其扩散结果分层。
        {
            GaussList[] results = new GaussList[4];
            List<DrawPolygonList> draw = new List<DrawPolygonList>();
            lstPe = new List<PointClass>();
            lstPs = new List<PointClass>();

            Direction = Direction + 90;
            if (Direction >= 360)
            {
                Direction = Direction - 360;
            }
            double a = Direction * 3.1415926 / 180;
            PointClass point = new PointClass();
            PointClass p0 = new PointClass();
            double x0 = 0;
            double y0 = 0;
            double x1 = 0;
            double y1 = 0;
            double ay = 0;
            double az = 0;
            double c = 0;
            double z = 1;
            double tx = 0, ty = 0;
            tx = pt.X;
            ty = pt.Y;
            bool bl1 = false;
            bool bl2 = false;
            bool bl3 = false;
            bool bl4 = false;
            PointClass p1 = new PointClass();
            PointClass p2 = new PointClass();
            PointClass p3 = new PointClass();
            PointClass p4 = new PointClass();

            if (Speed <= 0 || YuanQiang <= 0)
                return null;
            int pre, cur;
            PointClass pPre = new PointClass();
            PointClass pPreFar = new PointClass();

            pPre.X = pPre.Y = pPreFar.X = pPreFar.Y = 0;
            double prec = 0.0;

            int index = 0;

            pre = cur = -2;
            int k = 1;
            for (int x = -1; x < FSTime1; x += 8)
            {
                if (x > 304)
                { }
                pre = cur = -2;
                for (int y = -FSTime2; y < FSTime2; y += k)
                {
                    ay = this.GetAY(x, strWDD);
                    az = this.GetAZ(x, strWDD);
                    if (ay == 0 || az == 0)
                        continue;
                    double temp = Math.Exp(-0.5 * (((y * y) / (ay * ay)) + ((z * z) / (az * az))));
                    temp = Math.Exp(-0.5 * (y * y) / (ay * ay)) * Math.Exp(-0.5 * (z * z) / (az * az));
                    c = YuanQiang * (temp) / (2 * 3.14 * Speed * ay * az);

                    if (c <= Convert.ToDouble(strPFXZ) / 1000)
                        cur = 0;
                    if (c >= Convert.ToDouble(strPFXZ) / 10000 && c <= Convert.ToDouble(strJJND) / 1000)
                        cur = 1;
                    else if (c >= Convert.ToDouble(strJJND) / 1000 && c < Convert.ToDouble(strWXND) / 1000)
                        cur = 2;
                    else if (c >= Convert.ToDouble(strWXND) / 1000 && c < Convert.ToDouble(strSSND) / 1000)
                        cur = 3;
                    else if (c >= Convert.ToDouble(strSSND) / 1000)
                        cur = 4;
                    if (c > m_maxc)
                        m_maxc = c;

                    point = new PointClass();
                    point.X = Convert.ToInt32(tx);
                    point.Y = Convert.ToInt32(ty);
                    x0 = x * Math.Cos(a) - y * Math.Sin(a);
                    y0 = x * Math.Sin(a) + y * Math.Cos(a);
                    x1 = x * Math.Cos(a) + y * Math.Sin(a);
                    y1 = x * Math.Sin(a) - y * Math.Cos(a);
                    point.X += x0;
                    point.Y += y0;

                    if ((cur > 0 && pre != cur))//&&pre!=cur c>0.0001  ||index == 1
                    {
                        point.Z = cur;
                        index++;

                        if (pPre.X != 0 && pPreFar.X != 0 && index >= 1)
                        {
                            PointClass p = new PointClass();
                            p.X = pPre.X;
                            p.Y = pPre.Y;
                            lstPs.Add(p);
                            lstPe.Add(pPreFar);
                            //DrawPolygon(pPreFar, pPre, (int)pPre.Z);
                            lstArray = new List<PointClass>();
                            lstArray.Add(new PointClass() { X = pPreFar.X, Y = pPreFar.Y });
                            lstArray.Add(new PointClass() { X = pPre.X, Y = pPre.Y });
                            lstArray.Add(new PointClass() { X = pPreFar.X, Y = pPreFar.Y });
                            //pArray = pPreFar.X.ToString() + "," + pPreFar.Y.ToString() + " ";
                            //pArray += pPre.X.ToString() + "," + pPre.Y.ToString() + " ";
                            //pArray += pPreFar.X.ToString() + "," + pPreFar.Y.ToString() + " ";

                            array = TransformPoints(lstArray.ToArray());
                            //var list = pArray.Split(new string[] { " " }, StringSplitOptions.RemoveEmptyEntries).Select(i => string.Format("[{0}]", i));
                            lstLeafPoint = array.Select(i => new PointLeaflet() { lat = i.Y, lng = i.X });
                            draw.Add(new DrawPolygonList() { points = lstLeafPoint.ToArray(), colornumber = (int)pPre.Z });

                            if ((int)(pPre.Z) == 1)
                            {
                                if (bl1 == false)
                                {
                                    bl1 = true;
                                    p1.Y = pPre.Y;
                                }
                                if (pPre.Y > p1.Y)
                                {
                                    p1.X = pPre.X;
                                    p1.Y = pPre.Y;
                                }
                            }

                            else if ((int)(pPre.Z) == 2)
                            {
                                if (bl2 == false)
                                {
                                    bl2 = true;
                                    p2.Y = pPre.Y;
                                }
                                if (pPre.Y > p2.Y)
                                {
                                    p2.X = pPre.X;
                                    p2.Y = pPre.Y;
                                }
                            }

                            else if ((int)(pPre.Z) == 3)
                            {
                                if (bl3 == false)
                                {
                                    bl3 = true;
                                    p3.Y = pPre.Y;
                                }
                                if (pPre.Y > p3.Y)
                                {
                                    p3.X = pPre.X;
                                    p3.Y = pPre.Y;
                                }
                            }
                            else if ((int)(pPre.Z) == 4)
                            {
                                if (bl4 == false)
                                {
                                    bl4 = true;
                                    p4.Y = pPre.Y;
                                }
                                if (pPre.Y > p4.Y)
                                {
                                    p4.X = pPre.X;
                                    p4.Y = pPre.Y;
                                }
                            }
                        }

                        pPreFar = new PointClass();
                        pPreFar.X = point.X;
                        pPreFar.Y = point.Y;

                        k = 1;


                    }
                    else if (cur > 0)
                        k = 2;

                    if (cur > 0)
                    {

                        pPre.X = point.X;
                        pPre.Y = point.Y;
                        pPre.Z = pre;

                        pre = cur;
                        prec = c;

                    }
                }
            }

            //string points = p1.X.ToString() + "," + p1.Y.ToString() + " " + (p1.X + 100).ToString() + "," + (p1.Y + 100).ToString() + " " + (p1.X + 100).ToString() + "," + (p1.Y + 100).ToString();
            //pArray = TransformPoints(points);
            lstArray = new List<PointClass>();
            lstArray.Add(new PointClass() { X = p1.X, Y = p1.Y });
            lstArray.Add(new PointClass() { X = p1.X + 100, Y = p1.Y + 100 });
            lstArray.Add(new PointClass() { X = p1.X + 100, Y = p1.Y + 100 });
            array = TransformPoints(lstArray.ToArray());
            lstLeafPoint = array.Select(i => new PointLeaflet() { lat = i.Y, lng = i.X });
            string color = "gray";
            string xaml = @"<Canvas xmlns=""http://schemas.microsoft.com/client/2007"">
                        <TextBlock Text=""" + Convert.ToDouble(strPFXZ) / 10 + @"""/>
                        </Canvas>";
            double lon;
            double lat;
            coordinateTran.mapToLon(L0, p1.X + 100, p1.Y + 100, out lon, out lat);

            //var liststr = pArray.Split(new string[] { " " }, StringSplitOptions.RemoveEmptyEntries).Select(i => string.Format("[{0}]", i));
            results[0] = new GaussList()
            {
                id = "label1",
                points = lstLeafPoint.ToArray(),
                show = (Convert.ToDouble(strPFXZ) / 10).ToString(),
                color = color,
                point = new PointClass() { X = lon, Y = lat }
            };


            //points = p2.X.ToString() + "," + p2.Y.ToString() + " " + (p2.X + 100).ToString() + "," + (p2.Y + 100).ToString() + " " + (p2.X + 100).ToString() + "," + (p2.Y + 100).ToString();
            //pArray = TransformPoints(points);
            lstArray = new List<PointClass>();
            lstArray.Add(new PointClass() { X = p2.X, Y = p2.Y });
            lstArray.Add(new PointClass() { X = p2.X + 100, Y = p2.Y + 100 });
            lstArray.Add(new PointClass() { X = p2.X + 100, Y = p2.Y + 100 });
            array = TransformPoints(lstArray.ToArray());
            lstLeafPoint = array.Select(i => new PointLeaflet() { lat = i.Y, lng = i.X });
            color = "gray";
            xaml = @"<Canvas xmlns=""http://schemas.microsoft.com/client/2007"">
                        <TextBlock Text=""" + Convert.ToDouble(strJJND) + @""" FontSize=""13""/>
                        </Canvas>";
            coordinateTran.mapToLon(L0, p2.X + 100, p2.Y + 100, out lon, out lat);

            //liststr = pArray.Split(new string[] { " " }, StringSplitOptions.RemoveEmptyEntries).Select(i => string.Format("[{0}]", i));
            results[1] = new GaussList()
            {
                id = "label2",
                points = lstLeafPoint.ToArray(),
                show = Convert.ToDouble(strJJND).ToString(),
                color = color,
                point = new PointClass() { X = lon, Y = lat }
            };

            //points = p3.X.ToString() + "," + p3.Y.ToString() + " " + (p3.X + 100).ToString() + "," + (p3.Y + 100).ToString() + " " + (p3.X + 100).ToString() + "," + (p3.Y + 100).ToString();
            //pArray = TransformPoints(points);
            lstArray = new List<PointClass>();
            lstArray.Add(new PointClass() { X = p3.X, Y = p3.Y });
            lstArray.Add(new PointClass() { X = p3.X + 100, Y = p3.Y + 100 });
            lstArray.Add(new PointClass() { X = p3.X + 100, Y = p3.Y + 100 });
            array = TransformPoints(lstArray.ToArray());
            lstLeafPoint = array.Select(i => new PointLeaflet() { lat = i.Y, lng = i.X });
            color = "gray";
            xaml = @"<Canvas xmlns=""http://schemas.microsoft.com/client/2007"">
                        <TextBlock Text=""" + Convert.ToDouble(strWXND) + @"""/>
                        </Canvas>";
            coordinateTran.mapToLon(L0, p3.X + 100, p3.Y + 100, out lon, out lat);

            //liststr = pArray.Split(new string[] { " " }, StringSplitOptions.RemoveEmptyEntries).Select(i => string.Format("[{0}]", i));
            results[2] = new GaussList()
            {
                id = "label3",
                points = lstLeafPoint.ToArray(),
                show = Convert.ToDouble(strWXND).ToString(),
                color = color,
                point = new PointClass() { X = lon, Y = lat }
            };

            //points = p4.X.ToString() + "," + p4.Y.ToString() + " " + (p4.X + 100).ToString() + "," + (p4.Y + 100).ToString() + " " + (p4.X + 100).ToString() + "," + (p4.Y + 100).ToString();
            //pArray = TransformPoints(points);
            lstArray = new List<PointClass>();
            lstArray.Add(new PointClass() { X = p4.X, Y = p4.Y });
            lstArray.Add(new PointClass() { X = p4.X + 100, Y = p4.Y + 100 });
            lstArray.Add(new PointClass() { X = p4.X + 100, Y = p4.Y + 100 });
            array = TransformPoints(lstArray.ToArray());
            lstLeafPoint = array.Select(i => new PointLeaflet() { lat = i.Y, lng = i.X });
            color = "gray";
            xaml = @"<Canvas xmlns=""http://schemas.microsoft.com/client/2007"">
                        <TextBlock Text=""" + Convert.ToDouble(strSSND) + @"""/>
                        </Canvas>";
            coordinateTran.mapToLon(L0, p4.X + 100, p4.Y + 100, out lon, out lat);

            //liststr = pArray.Split(new string[] { " " }, StringSplitOptions.RemoveEmptyEntries).Select(i => string.Format("[{0}]", i));
            results[3] = new GaussList()
            {
                id = "label4",
                points = lstLeafPoint.ToArray(),
                show = Convert.ToDouble(strSSND).ToString(),
                color = color,
                point = new PointClass() { X = lon, Y = lat }
            };

            return new GaussResult()
                {
                    GaussLists = results,
                    DrawPolygonLists = draw.ToArray()
                };
        }

        /// <summary>
        /// 将本地坐标点集转化成为经纬度点集合
        /// </summary>
        /// <param name="points"></param>
        /// <returns></returns>
        public string TransformPoints(string points)
        {
            string pointsAfterTran = string.Empty;
            string[] PointsArray = points.Split(' ');
            for (int i = 0; i < PointsArray.Length; i++)
            {
                string[] point = PointsArray[i].Split(',');
                if (point.Length <= 1)
                    continue;
                double pointX = double.Parse(point[0]);
                double pointY = double.Parse(point[1]);
                double lon;
                double lat;
                coordinateTran.mapToLon(L0, pointX, pointY, out lon, out lat);
                pointsAfterTran += lon.ToString() + "," + lat.ToString() + " ";
            }

            return pointsAfterTran;
        }

        /// <summary>
        /// 将本地坐标点集转化成为经纬度点集合
        /// </summary>
        /// <param name="points"></param>
        /// <returns></returns>
        public PointClass[] TransformPoints(PointClass[] points)
        {
            var pointsAfterTran = new PointClass[points.Length];
            var PointsArray = points;
            for (int i = 0; i < PointsArray.Length; i++)
            {
                PointClass point = PointsArray[i];
                //if (point.Length <= 1)
                //    continue;
                double pointX = point.X;
                double pointY = point.Y;
                double lon;
                double lat;
                coordinateTran.mapToLon(L0, pointX, pointY, out lon, out lat);
                pointsAfterTran[i] = new PointClass();
                pointsAfterTran[i].X = lon;
                pointsAfterTran[i].Y = lat;
            }

            return pointsAfterTran;
        }

        public double GetAY(double x, string strWDD)
        {
            double ay = 0.0;
            switch (strWDD)
            {
                case "A":
                    //if (x <= 1000 && x > 0)
                    //    ay = 0.425890 * Math.Pow(x, 0.9011074);
                    //else if (x > 1000)
                    //    ay = 0.602052 * Math.Pow(x, 0.850934);
                    ay = 0.4147 * Math.Pow(x, 0.9041);
                    break;
                case "B":
                    if (x <= 1000 && x > 0)
                        ay = 0.281846 * Math.Pow(x, 0.914370);
                    else if (x > 1000)
                        ay = 0.396353 * Math.Pow(x, 0.865014);
                    break;
                case "B-C":
                    if (x <= 1000 && x > 0)
                        ay = 0.229500 * Math.Pow(x, 0.919325);
                    else if (x > 1000)
                        ay = 0.314238 * Math.Pow(x, 0.875068);
                    break;
                case "C":
                    if (x <= 1000 && x > 0)
                        ay = 0.177154 * Math.Pow(x, 0.924279);
                    else if (x > 1000)
                        ay = 0.232123 * Math.Pow(x, 0.885157);
                    break;
                case "C-D":
                    if (x <= 1000 && x > 0)
                        ay = 0.143940 * Math.Pow(x, 0.926849);
                    else if (x > 1000)
                        ay = 0.189396 * Math.Pow(x, 0.886940);
                    break;
                case "D":
                    if (x <= 1000 && x > 0)
                        ay = 0.110726 * Math.Pow(x, 0.929418);
                    else if (x > 1000)
                        ay = 0.146669 * Math.Pow(x, 0.888723);
                    break;
                case "D-E":
                    if (x <= 1000 && x > 0)
                        ay = 0.0985631 * Math.Pow(x, 0.925118);
                    else if (x > 1000)
                        ay = 0.124308 * Math.Pow(x, 0.892794);
                    break;
                case "E":
                    if (x <= 1000 && x > 0)
                        ay = 0.0864001 * Math.Pow(x, 0.920818);
                    else if (x > 1000)
                        ay = 0.101947 * Math.Pow(x, 0.896864);
                    break;
                case "F":
                    if (x <= 1000 && x > 0)
                        ay = 0.0553634 * Math.Pow(x, 0.929418);
                    else if (x > 1000)
                        ay = 0.0733348 * Math.Pow(x, 0.888723);
                    break;
            }
            return ay;
        }
        public double GetAZ(double x, string strWDD)
        {
            double az = 0.0;
            switch (strWDD)
            {
                case "A":
                    if (x <= 700 && x > 0)
                        az = 0.0799904 * Math.Pow(x, 1.12154);
                    //else if (x <= 500 && x > 300)
                    //az = 0.00854771 * Math.Pow(x, 1.151360);
                    else if (x > 700)
                        az = 0.000211545 * Math.Pow(x, 2.10881);
                    //if (x <= 400)
                    //{
                    //    az = -3 + 0.184 * x;
                    //}
                    //else if (x >= 700)
                    //{
                    //    az = 30.8 - 0.112 * x + 5.36 * 0.0001 * x * x;
                    //}
                    break;
                case "B":
                    if (x <= 500 && x > 0)
                        az = 0.127190 * Math.Pow(x, 0.964435);
                    else if (x > 500)
                        az = 0.057025 * Math.Pow(x, 1.09356);
                    break;
                case "B-C":
                    if (x <= 500 && x > 0)
                        az = 0.114682 * Math.Pow(x, 0.941015);
                    else if (x > 500)
                        az = 0.0757182 * Math.Pow(x, 1.00770);
                    break;
                case "C":
                    if (x > 0)
                        az = 0.106803 * Math.Pow(x, 0.917595);
                    break;
                case "C-D":
                    if (x <= 2000 && x > 0)
                        az = 0.126152 * Math.Pow(x, 0.838628);
                    else if (x <= 10000 && x > 2000)
                        az = 0.235667 * Math.Pow(x, 0.756410);
                    else if (x > 10000)
                        az = 0.136659 * Math.Pow(x, 0.815575);
                    break;
                case "D":
                    if (x <= 1000 && x > 0)
                        az = 0.104634 * Math.Pow(x, 0.826212);
                    else if (x <= 10000 && x > 1000)
                        az = 0.400167 * Math.Pow(x, 0.632023);
                    else if (x > 10000)
                        az = 0.810763 * Math.Pow(x, 0.55536);
                    break;
                case "D-E":
                    if (x <= 2000 && x > 0)
                        az = 0.111771 * Math.Pow(x, 0.776864);
                    else if (x <= 10000 && x > 2000)
                        az = 0.5289922 * Math.Pow(x, 0.572347);
                    else if (x > 10000)
                        az = 1.03810 * Math.Pow(x, 0.499149);
                    break;
                case "E":
                    if (x <= 1000 && x > 0)
                        az = 0.0927529 * Math.Pow(x, 0.788370);
                    else if (x <= 10000 && x > 1000)
                        az = 0.433384 * Math.Pow(x, 0.565188);
                    else if (x > 10000)
                        az = 1.73421 * Math.Pow(x, 0.414743);
                    break;
                case "F":
                    if (x <= 1000 && x > 0)
                        az = 0.0620765 * Math.Pow(x, 0.784400);
                    else if (x <= 10000 && x > 1000)
                        az = 0.370015 * Math.Pow(x, 0.525969);
                    else if (x > 10000)
                        az = 2.40691 * Math.Pow(x, 0.322659);
                    break;
            }
            return az;
        }
    }

    public class PointClass
    {
        private double x;

        public double X
        {
            get { return x; }
            set { x = value; }
        }

        private double y;

        public double Y
        {
            get { return y; }
            set { y = value; }
        }

        private double z;

        public double Z
        {
            get { return z; }
            set { z = value; }
        }
    }

    public class PointLeaflet
    {
        public double lng;

        public double lat;
    }

    public class GaussList
    {
        public string id;

        public PointLeaflet[] points;

        public string show;

        public PointClass point;

        public string color;
    }

    public class DrawPolygonList
    {
        public PointLeaflet[] points;
        public int colornumber;
    }

    public class GaussResult
    {
        public GaussList[] GaussLists;

        public DrawPolygonList[] DrawPolygonLists;
    }
}
