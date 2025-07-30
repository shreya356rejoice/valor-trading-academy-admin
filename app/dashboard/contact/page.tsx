'use client';

import { getContact } from '@/components/api/contact';
import { Badge } from '@/components/ui/badge';
import { Calendar, Mail, Phone, MessageSquare, MapPin, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';


type Contact = {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    description: string;
    createdAt: string;
    isActive: boolean;
}

export default function ContactPage() {
    const [contactData, setContactData] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const getContactData = async () => {
            try {
                setIsLoading(true);
                const data = await getContact();
                setContactData(data.payload.data);
            } catch (error) {
                console.error('Error fetching contacts:', error);
            } finally {
                setIsLoading(false);
            }
        };
        getContactData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-foreground">Contact Submissions</h1>
            </div>

            <div className="space-y-4">
                {contactData.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-lg border">
                        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium text-foreground">No contact submissions</h3>
                        <p className="mt-1 text-sm text-muted-foreground">No one has submitted the contact form yet.</p>
                    </div>
                ) : (
                    contactData.map((submission, index) => (
                        <div key={submission.id || index} className="bg-background text-foreground rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
                            {/* Header */}
                            <div className="bg-background px-6 py-3 border-b">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <h3 className="font-medium text-base text-foreground">{submission.name}</h3>
                                        <Badge 
                                            variant={submission.isActive ? 'default' : 'secondary'}
                                            className="text-xs font-medium"
                                        >
                                            {submission.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4 mr-1.5" />
                                        {new Date(submission.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="px-6 py-4">
                                <div className="flex flex-wrap items-center gap-4 mb-4">
                                    <div className="flex items-center space-x-2">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-foreground">{submission.email}</span>
                                    </div>

                                    {submission.phone && (
                                        <div className="flex items-center space-x-2">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm text-foreground">{submission.phone}</span>
                                        </div>
                                    )}

                                    {submission.location && (
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm text-foreground">{submission.location}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Message */}
                                {submission.description && (
                                    <div className="mt-4">
                                        <div className="flex items-start space-x-3">
                                            <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2 mt-0.5">Message</p>
                                        </div>
                                        <div className="flex-1 mt-2">
                                            <div className="bg-card rounded-md p-3">
                                                <p className="text-sm text-foreground leading-relaxed">{submission.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
