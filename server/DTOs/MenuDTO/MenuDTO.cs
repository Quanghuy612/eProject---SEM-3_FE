namespace server.DTOs.MenuDTO
{
    public class MenuDTO
    {
        public int MenuId { get; set; }
        public string Name { get; set; } = null!;
        public string Url { get; set; } = null!;
        public List<MenuDTO> ChildMenus { get; set; } = new();
    }
}
