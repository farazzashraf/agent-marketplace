import { Bell, Heart, MessageSquare, Star, UserPlus } from 'lucide-react';

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      type: 'like',
      user: 'Alice Chen',
      avatar: 'https://picsum.photos/seed/alice/100/100',
      content: 'liked your post in the community.',
      time: '10 minutes ago',
      read: false,
      icon: <Heart size={16} className="text-rose-500 fill-current" />
    },
    {
      id: 2,
      type: 'review',
      user: 'Marcus Johnson',
      avatar: 'https://picsum.photos/seed/marcus/100/100',
      content: 'left a 5-star review on your agent DataScribe.',
      time: '2 hours ago',
      read: false,
      icon: <Star size={16} className="text-amber-500 fill-current" />
    },
    {
      id: 3,
      type: 'comment',
      user: 'Sarah Lee',
      avatar: 'https://picsum.photos/seed/sarah/100/100',
      content: 'commented on your post: "This looks amazing, would love to beta test!"',
      time: '5 hours ago',
      read: true,
      icon: <MessageSquare size={16} className="text-blue-500" />
    },
    {
      id: 4,
      type: 'follow',
      user: 'David Kim',
      avatar: 'https://picsum.photos/seed/david/100/100',
      content: 'started following you.',
      time: '1 day ago',
      read: true,
      icon: <UserPlus size={16} className="text-emerald-500" />
    }
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="mt-1 text-sm text-gray-500">Stay updated with your community interactions.</p>
        </div>
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 self-start sm:self-auto">
          Mark all as read
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="divide-y divide-gray-100">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`flex items-start gap-4 p-5 transition-colors hover:bg-gray-50 ${!notif.read ? 'bg-indigo-50/30' : ''}`}
            >
              <div className="relative shrink-0">
                <img src={notif.avatar} alt={notif.user} className="h-12 w-12 rounded-full border border-gray-200 object-cover" referrerPolicy="no-referrer" />
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-white shadow-sm">
                  {notif.icon}
                </div>
              </div>
              
              <div className="flex-1 min-w-0 pt-1">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{notif.user}</span> {notif.content}
                </p>
                <p className="mt-1 text-xs text-gray-500">{notif.time}</p>
              </div>

              {!notif.read && (
                <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600 mt-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
