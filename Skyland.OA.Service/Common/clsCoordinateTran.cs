using System;

namespace BizService.Common
{
    public class clsCoordinateTran
    {
        private double afa = 6378245;
        private double K0 = 0.157046064172 / 1000000;
        private double K1 = 0.005051773759;
        private double K2 = 0.000029837302;
        private double K3 = 0.000000238189;
        private double C0 = 6367558.49686;
        private double C1 = 32005.79642;
        private double C2 = 133.06115;
        private double C3 = 0.7031;
        private double e3 = 0.00673852541468;
        private double e2 = 0.00669342162297;
        private double pai = 3.1415926;

        public double projectConvertX(double L0, double pb, double pl)
        {
            double n2;
            double t;
            double n;
            double b;
            double xb0;
            double m0;
            double l1;
            double c0b;
            double PX;
            l1 = (pl - L0) * pai / 180;
            b = pb * pai / 180;
            c0b = C0 * b;
            xb0 = c0b - Math.Cos(b) * (Math.Sin(b) * C1 + Multiplication(Math.Sin(b), 3) * C2 + Multiplication(Math.Sin(b), 5) * C3);
            t = Math.Tan(b);
            n2 = e3 * Math.Cos(b) * Math.Cos(b);
            n = afa / Math.Sqrt(1 - e2 * Math.Sin(b) * Math.Sin(b));
            m0 = Math.Cos(b) * l1;
            PX = xb0 + 0.5 * n * t * m0 * m0 + (1 / 24) * (5 - t * t + 9 * n2 + 4 * n2 * n2) * n * t * Multiplication(m0, 4) + (1 / 720) * (61 - 58 * t * t + t * t * t * t) * n * t * Multiplication(m0, 6);
            return PX;
        }

        public double projectConvertY(double L0, double pb, double pl)
        {
            double n2;
            double t;
            double n;
            double b;
            double xb0;
            double m0;
            double l1;
            double c0b;
            double PY;
            l1 = (pl - L0) * pai / 180;
            b = pb * pai / 180;
            c0b = C0 * b;
            xb0 = c0b - Math.Cos(b) * (Math.Sin(b) * C1 + Multiplication(Math.Sin(b), 3) * C2 + Multiplication(Math.Sin(b), 5) * C3);
            t = Math.Tan(b);
            n2 = e3 * Math.Cos(b) * Math.Cos(b);
            n = afa / Math.Sqrt(1 - e2 * Math.Sin(b) * Math.Sin(b));
            m0 = Math.Cos(b) * l1;
            PY = n * m0 + (1 / 6) * (1 - t * t + n2) * n * Multiplication(m0, 3) + (1 / 120) * (5 - 18 * t * t + Multiplication(t, 4) + 14 * n2 - 58 * n2 * t * t) * n * Multiplication(m0, 5);
            return PY;
        }

        //E Cord to XY
        #region //度分秒转换为米
        public void getPoint(double lon, double lat, out double x, out double y)
        {
            //度分秒转换为米
            //y = projectConvertX(113.295067222222, lon, lat) - 2529679.997;
            //x = projectConvertY(113.295067222222, lon, lat) + 41240;
            y = projectConvertX(108.366067222222, lon, lat) - 2529679.997;
            x = projectConvertY(108.366067222222, lon, lat) + 41240;
        }
        #endregion

        //XY to Ez
        #region //米转换为度分秒
        public void mapToLon(double L0, double PX, double PY, out double lon, out double lat)
        {
            //米转换为度分秒
            //L0 = 113.295067222222;
            //L0 = 108.366067222222;
            
            double temp = PX;
            PX = PY + 2529679.997;
            PY = temp - 41240;
            double bf0;
            double bf;
            double n2;
            double V2;
            double t;
            double n;
            double b;
            double ll;
            double l;
            bf0 = PX * K0;
            bf = bf0 + Math.Cos(bf0) * (K1 * Math.Sin(bf0) - K2 * Multiplication(Math.Sin(bf0), 3) + K3 * Multiplication(Math.Sin(bf0), 5));
            n2 = e3 * Multiplication(Math.Cos(bf), 2);
            V2 = 1 + n2;
            t = Math.Tan(bf);
            n = afa / Math.Sqrt(1 - e2 * Multiplication(Math.Sin(bf), 2));
            b = bf - 0.5 * V2 * t * Multiplication((PY / n), 2) + (1 / 24) * (5 + 3 * Multiplication(t, 2) + n2 - 9 * n2 * Multiplication(t, 2)) * V2 * t * Multiplication((PY / n), 4) - (1 / 720) * (61 + 90 * t * t + 45 * t * t * t * t) * V2 * t * Multiplication((PY / n), 6);
            ll = (1 / Math.Cos(bf)) * (PY / n) - (1 / 6) * (1 + 2 * t * t + n2) * (1 / Math.Cos(bf)) * Multiplication((PY / n), 3) + (1 / 120) * (5 + 28 * t * t + 24 * Multiplication(t, 4) + 6 * n2 + 8 * n2 * t * t) * (1 / Math.Cos(bf)) * Multiplication((PY / n), 5);
            l = L0 + ll * 180 / pai;
            lon = l;
            lat = b * 180 / pai;
        }
        #endregion

        public double Multiplication(double x, int n)
        {
            double temp = x;
            for (int i = 0; i <= n - 2; i++)
            {
                temp = temp * x;
            }
            return temp;
        }
    }
}

