'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, User, Calendar, Clock, CheckCircle, XCircle, Info, X, Phone, MapPin, Cake } from 'lucide-react';
import { getNewsLetter } from '@/components/api/newsletter';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

type Subscriber = {
  _id: string;
  email: string;
  description: string;
  uid: {
    _id: string;
    email: string;
    name: string;
    roleId: string;
    isActive: boolean;
    gender: string;
    birthday: string;
    phone: string;
    location: string;
    createdAt: string;
    updatedAt: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchNewsLetter = async () => {
      try {
        const response = await getNewsLetter();
        setSubscribers(response.payload.data);
      } catch (error) {
        console.error('Error fetching newsletter:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNewsLetter();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PP');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleViewDetails = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] items-center">
      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
    </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Newsletter Subscribers</h1>
          <p className="text-muted-foreground">
            Manage and view all newsletter subscribers
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="px-3 py-1">
            {subscribers.length} {subscribers.length === 1 ? 'Subscriber' : 'Subscribers'}
          </Badge>
        </div>
      </div>

      {subscribers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No subscribers yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              When you have newsletter subscribers, they'll appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="max-w-[150px]">Subscriber</TableHead>
                <TableHead className="max-w-[200px]">Subscription Email</TableHead>
                <TableHead className="max-w-[150px]">User Email</TableHead>
                <TableHead className="min-w-[120px]">Status</TableHead>
                <TableHead className="min-w-[150px]">Subscribed</TableHead>
                <TableHead className="min-w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((subscriber) => (
                <TableRow key={subscriber._id} className="hover:bg-muted/50">
                  <TableCell className="py-3 min-w-[150px]">
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 rounded-full bg-primary/20 dark:bg-muted">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{subscriber.uid?.name || 'No Name'}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {subscriber.uid?._id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="text-sm truncate">{subscriber.email}</div>
                    {subscriber.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {subscriber.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-3 min-w-[150px]">
                    <div className="text-sm truncate">{subscriber.uid?.email || 'N/A'}</div>
                  </TableCell>
                  <TableCell className="py-3 min-w-[150px]">
                    <Badge 
                      variant={subscriber.isActive ? 'default' : 'secondary'}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium"
                    >
                      {subscriber.isActive ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      <span>{subscriber.isActive ? 'Active' : 'Inactive'}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="text-sm">{formatDate(subscriber.createdAt)}</div>
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewDetails(subscriber)}
                      className="text-primary hover:bg-primary/10 h-8 px-2"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Subscriber Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {selectedSubscriber && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle>Subscriber Details</DialogTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsDialogOpen(false)}
                    className="h-8 w-8"
                  >
                    
                  </Button>
                </div>
                <DialogDescription>
                  Detailed information about the subscriber
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <User className="mr-2 h-4 w-4" />
                        <span>Full Name</span>
                      </div>
                      <div className="text-sm font-medium">
                        {selectedSubscriber.uid?.name || 'Not provided'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <Mail className="mr-2 h-4 w-4" />
                        <span>Subscription Email</span>
                      </div>
                      <div className="text-sm font-medium">
                        {selectedSubscriber.email}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <Mail className="mr-2 h-4 w-4" />
                        <span>Account Email</span>
                      </div>
                      <div className="text-sm font-medium">
                        {selectedSubscriber.uid?.email || 'N/A'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <Phone className="mr-2 h-4 w-4" />
                        <span>Phone</span>
                      </div>
                      <div className="text-sm font-medium">
                        {selectedSubscriber.uid?.phone || 'Not provided'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>Location</span>
                      </div>
                      <div className="text-sm font-medium">
                        {selectedSubscriber.uid?.location || 'Not provided'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <Cake className="mr-2 h-4 w-4" />
                        <span>Birthday</span>
                      </div>
                      <div className="text-sm font-medium">
                        {selectedSubscriber.uid?.birthday ? 
                          formatDate(selectedSubscriber.uid.birthday) : 'Not provided'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Subscription Details */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Subscription Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Subscribed On</span>
                      </div>
                      <div className="text-sm font-medium">
                        {formatDate(selectedSubscriber.createdAt)}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Last Updated</span>
                      </div>
                      <div className="text-sm font-medium">
                        {formatDate(selectedSubscriber.updatedAt)}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <Info className="mr-2 h-4 w-4" />
                        <span>Status</span>
                      </div>
                      <Badge 
                        variant={selectedSubscriber.isActive ? 'default' : 'secondary'}
                        className="flex items-center space-x-1 w-fit"
                      >
                        {selectedSubscriber.isActive ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        <span>{selectedSubscriber.isActive ? 'Active' : 'Inactive'}</span>
                      </Badge>
                    </div>
                  </div>
                  
                  {selectedSubscriber.description && (
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center text-muted-foreground">
                        <Info className="mr-2 h-4 w-4" />
                        <span>Description</span>
                      </div>
                      <div className="text-sm bg-muted/50 p-3 rounded-md">
                        {selectedSubscriber.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
