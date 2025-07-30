'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MessageCircle, Plus, Edit, Trash2, MoreVertical, Users } from 'lucide-react';

const telegramChannels = [
  {
    id: 1,
    name: 'Premium Trading Signals',
    description: 'Daily trading signals and market analysis',
    price: '$29/month',
    subscribers: 1250,
    status: 'Active',
    link: 'https://t.me/tradingsignals'
  },
  {
    id: 2,
    name: 'VIP AlgoBot Updates',
    description: 'Exclusive updates and new bot releases',
    price: '$49/month',
    subscribers: 890,
    status: 'Active',
    link: 'https://t.me/algobotVIP'
  },
  {
    id: 3,
    name: 'Free Trading Tips',
    description: 'Basic trading tips and educational content',
    price: 'Free',
    subscribers: 3450,
    status: 'Active',
    link: 'https://t.me/freetradingx'
  }
];

export default function TelegramManagement() {
  const [channels, setChannels] = useState(telegramChannels);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newChannel, setNewChannel] = useState({
    name: '',
    description: '',
    price: '',
    link: ''
  });

  const handleCreateChannel = () => {
    const channel = {
      id: channels.length + 1,
      ...newChannel,
      subscribers: 0,
      status: 'Active'
    };
    setChannels([...channels, channel]);
    setNewChannel({ name: '', description: '', price: '', link: '' });
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Telegram Channel Management</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Channel
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel) => (
          <Card key={channel.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{channel.name}</CardTitle>
                    <p className="text-sm text-gray-500">{channel.description}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">{channel.price}</span>
                  <Badge variant={channel.status === 'Active' ? 'default' : 'secondary'}>
                    {channel.status}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{channel.subscribers.toLocaleString()} subscribers</span>
                </div>
                
                <div className="text-sm text-gray-500 break-all">
                  {channel.link}
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Stats
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Channel Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New Telegram Channel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="channelName">Channel Name</Label>
                <Input
                  id="channelName"
                  value={newChannel.name}
                  onChange={(e) => setNewChannel({...newChannel, name: e.target.value})}
                  placeholder="Premium Trading Signals"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="channelDescription">Description</Label>
                <Textarea
                  id="channelDescription"
                  value={newChannel.description}
                  onChange={(e) => setNewChannel({...newChannel, description: e.target.value})}
                  placeholder="Channel description..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="channelPrice">Price</Label>
                <Input
                  id="channelPrice"
                  value={newChannel.price}
                  onChange={(e) => setNewChannel({...newChannel, price: e.target.value})}
                  placeholder="$29/month or Free"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="channelLink">Telegram Link</Label>
                <Input
                  id="channelLink"
                  value={newChannel.link}
                  onChange={(e) => setNewChannel({...newChannel, link: e.target.value})}
                  placeholder="https://t.me/yourchannel"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleCreateChannel}
                  className="flex-1"
                  disabled={!newChannel.name || !newChannel.description}
                >
                  Create Channel
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}