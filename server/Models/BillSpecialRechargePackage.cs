using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class BillSpecialRechargePackage
    {
        public int BillId { get; set; }
        public Bill Bill { get; set; }

        public int SpecialRechargeId { get; set; }
        public SpecialRechargePackage SpecialRechargePackage { get; set; }
    }
}
