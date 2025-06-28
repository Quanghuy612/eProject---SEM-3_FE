using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace server.ChatHub
{
    public class ChatHub : Hub
    {
        // Mapping guestId to connectionId
        private static readonly ConcurrentDictionary<string, string> GuestConnections = new();
        private static readonly ConcurrentDictionary<string, List<(string Sender, string Message)>> GuestMessages = new();

        public class ChatMessage
        {
            public string Sender { get; set; }
            public string Message { get; set; }
        }

        // Called by guest on connection
        public Task RegisterGuest(string guestId)
        {
            GuestConnections[guestId] = Context.ConnectionId;
            Console.WriteLine($"✅ Guest registered: {guestId} -> {Context.ConnectionId}");

            // 👇 Broadcast guest list to all admins
            var guestIds = GuestConnections.Keys.ToList();
            Clients.Group("Admins").SendAsync("UpdateGuestList", guestIds);

            return Task.CompletedTask;
        }

        // Called by guest to send message to admin
        public async Task SendMessageToAdmin(string guestId, string message)
        {
            Console.WriteLine($"📩 Message from guest {guestId}: {message}");

            // Save message in chat history
            if (!GuestMessages.ContainsKey(guestId))
                GuestMessages[guestId] = new List<(string, string)>();

            GuestMessages[guestId].Add(("Guest", message));

            // Forward to all admins
            await Clients.Group("Admins").SendAsync("ReceiveGuestMessage", guestId, message);
        }

        // Called by admin to join admin group
        public async Task RegisterAdmin()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
            Console.WriteLine($"👩‍💼 Admin connected: {Context.ConnectionId}");

            // ✅ Send current guest list immediately upon admin registration
            var guestIds = GuestConnections.Keys.ToList();
            await Clients.Client(Context.ConnectionId).SendAsync("UpdateGuestList", guestIds);
        }

        public Task<List<ChatMessage>> GetGuestChat(string guestId)
        {
            if (GuestMessages.TryGetValue(guestId, out var history))
            {
                var chatMessages = history.Select(h => new ChatMessage
                {
                    Sender = h.Sender,
                    Message = h.Message
                }).ToList();

                return Task.FromResult(chatMessages);
            }

            return Task.FromResult(new List<ChatMessage>());
        }

        // Optional: admin replies to guest
        public async Task SendMessageToGuest(string guestId, string message)
        {
            if (GuestConnections.TryGetValue(guestId, out var connectionId))
            {
                await Clients.Client(connectionId).SendAsync("ReceiveMessage", "Admin", message);

                // Save admin message to guest's chat history
                if (!GuestMessages.ContainsKey(guestId))
                    GuestMessages[guestId] = new List<(string, string)>();

                GuestMessages[guestId].Add(("Admin", message));
            }
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var disconnectedGuest = GuestConnections.FirstOrDefault(kvp => kvp.Value == Context.ConnectionId);
            if (!string.IsNullOrEmpty(disconnectedGuest.Key))
            {
                var guestId = disconnectedGuest.Key;

                // Remove guest connection
                GuestConnections.TryRemove(guestId, out _);
                Console.WriteLine($"❌ Guest disconnected: {guestId}");

                // Remove guest chat history if you want to clear memory fully
                GuestMessages.TryRemove(guestId, out _);

                // Update admin guest list
                var guestIds = GuestConnections.Keys.ToList();
                Clients.Group("Admins").SendAsync("UpdateGuestList", guestIds);
            }

            return base.OnDisconnectedAsync(exception);
        }
    }
}
