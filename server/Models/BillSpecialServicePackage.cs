using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class BillSpecialServicePackage
    {
        public int BillId { get; set; }
        public Bill Bill { get; set; }

        public int SpecialServiceId { get; set; }
        public SpecialServicePackage SpecialServicePackage { get; set; }
    }
}
