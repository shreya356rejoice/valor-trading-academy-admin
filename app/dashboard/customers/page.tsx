'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Plus, MoreHorizontal, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { getCustomers, updateCustomer, deleteCustomer, setCustomerStatus, createCustomer } from '@/components/api/customer';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { DataTablePagination } from "@/components/ui/DataTablePagination";

const classNames = {
  dropdown_root: cn(
    "relative rounded-md border border-border bg-muted text-foreground px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
  ),
  dropdown: "absolute inset-0 opacity-0 appearance-none",
  // other class overrides...
};

interface Customer {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  phone: string;
  location: string;
  birthday: string;
  gender: string;
  createdAt: string;
  roleId: {
    _id: string;
    name: string;
  };
}

interface CustomerApiResponse {
  success: boolean;
  payload: {
    data: Customer[];
    count: number;
  };
}

const scrollbarStyles = `
  .thin-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .thin-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  .thin-scrollbar::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
  .thin-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #666;
  }
`;

const customerFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .regex(/^[a-zA-Z\s-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
    
  email: z.string()
    .email('Invalid email address')
    .max(100, 'Email must be at most 100 characters')
    .refine(email => {
      const domain = email.split('@')[1];
      return domain && domain.length >= 3 && domain.includes('.');
    }, 'Invalid email domain'),
    
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be at most 15 digits')
    .regex(/^[0-9+()\s-]+$/, 'Invalid phone number format'),
    
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Please select a valid gender' })
  }),
  
  birthday: z.date({
    required_error: 'A date of birth is required.',
    invalid_type_error: 'Please enter a valid date',
  })
  .max(new Date(new Date().setFullYear(new Date().getFullYear() - 13)), 'You must be at least 13 years old')
  .min(new Date('1900-01-01'), 'Birth date cannot be before 1900'),
  
  location: z.string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be at most 100 characters')
    .regex(/^[a-zA-Z\s,-]+$/, 'Location can only contain letters, spaces, commas, and hyphens'),
    
  roleId: z.string().min(1, 'Please select a role'),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

export default function Customers() {
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: string;
    name: string;
    currentStatus: boolean;
  } | null>(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      gender: 'male',
      birthday: undefined,
      location: '',
      roleId: '',
    },
  });

  const fetchCustomersData = async () => {
    try {
      setIsSearching(true);
      const response: CustomerApiResponse = await getCustomers({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm
      });
      
      if (response.success) {
        const { data, count } = response.payload;
        setCustomers(data);
        setTotalItems(count);
        setTotalPages(Math.ceil(count / itemsPerPage));
        setError(null);
      } else {
        setError('Failed to fetch customers');
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('An error occurred while fetching customers');
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchCustomersData();
  }, [currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = scrollbarStyles;
    document.head.appendChild(style);
    document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1); // Reset to first page on new search
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    form.reset({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      gender: customer.gender as 'male' | 'female' | 'other',
      birthday: new Date(customer.birthday),
      location: customer.location,
      roleId: customer.roleId._id,
    });
    setIsEditMode(true);
    setIsAddCustomerOpen(true);
  };

  const handleDeleteClick = (customer: Customer) => {
    setSelectedCustomer({
      id: customer._id,
      name: customer.name,
      currentStatus: customer.isActive
    });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCustomer) return;

    try {
      await deleteCustomer(selectedCustomer.id);
      await fetchCustomersData();
      setDeleteDialogOpen(false);

      toast.success(`Customer "${selectedCustomer.name}" has been deleted.`);
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error("Failed to delete customer. Please try again.");
    }
  };

  const handleStatusToggleClick = (customer: Customer) => {
    setSelectedCustomer({
      id: customer._id,
      name: customer.name,
      currentStatus: customer.isActive
    });
    setStatusDialogOpen(true);
  };

  const confirmStatusToggle = async () => {
    if (!selectedCustomer) return;

    try {
      const newStatus = !selectedCustomer.currentStatus;

      await setCustomerStatus(selectedCustomer.id, newStatus);

      setCustomers(customers.map(customer =>
        customer._id === selectedCustomer.id
          ? { ...customer, isActive: newStatus }
          : customer
      ));

      setStatusDialogOpen(false);
      toast.success(`Customer "${selectedCustomer.name}" has been ${newStatus ? 'activated' : 'deactivated'}.`);
    } catch (error) {
      console.error('Error updating customer status:', error);
      toast.error("Failed to update customer status. Please try again.");
    }
  };

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      if (isEditMode && editingCustomer) {
        await updateCustomer(editingCustomer._id, data);
        await fetchCustomersData();
        form.reset();
        setIsAddCustomerOpen(false);
        setIsEditMode(false);
        setEditingCustomer(null);

        toast.success(`Customer "${data.name}" has been updated.`);
      } else {
        const customerData = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          gender: data.gender,
          birthday: data.birthday.toISOString(),
          location: data.location,
          roleId: data.roleId,
          password: 'defaultPassword123!',
          confirmPassword: 'defaultPassword123!',
        };

        await createCustomer(customerData);
        await fetchCustomersData();

        form.reset();
        setIsAddCustomerOpen(false);

        toast.success(`New customer "${data.name}" has been added.`);
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'add'} customer. Please try again.`);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) 
 
  );

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] items-center">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="space-t-6 max-h-[90vh]">
     

      <Card className='border-none shadow-none'>
        <CardHeader>
          <div className="flex items-center justify-between">
            {/* <CardTitle>All Customers</CardTitle> */}
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchInput}
                onChange={handleSearchInputChange}
                className="pl-10"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                </div>
              )}  
            </div>

        <Button onClick={() => setIsAddCustomerOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>

          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden min-h-[71vh]">
            <div className="overflow-y-auto thin-scrollbar">
              <Table>
                <TableHeader className="bg-background">
                  <TableRow>
                    <TableHead className="w-[250px]">Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Birthday</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback>
                                {customer.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-xs text-muted-foreground">{customer.location}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{customer.email}</div>
                          <div className="text-xs text-muted-foreground">{customer.phone || 'N/A'}</div>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">{customer.gender?.toLowerCase() || 'N/A'}</span>
                        </TableCell>
                        <TableCell>
                          {customer.birthday ? new Date(customer.birthday).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {customer.roleId.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={customer.isActive ? 'default' : 'secondary'}>
                            {customer.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(customer.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(customer)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusToggleClick(customer);
                                }}
                                className={customer.isActive ? 'text-red-600' : 'text-foreground'}
                              >
                                {customer.isActive ? (
                                  <>
                                    <UserX className="mr-2 h-4 w-4" />
                                    <span>Deactivate</span>
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    <span>Activate</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(customer);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center py-8">
                          <div className="text-gray-400 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900">No customers found</h3>
                          <p className="text-sm text-gray-500">
                            {searchTerm ?
                              'Try adjusting your search or filter to find what you\'re looking for.' :
                              'Get started by adding a new customer.'}
                          </p>
                          {!searchTerm && (
                            <Button className="mt-4">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Customer
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pagination controls */}
      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
        itemsPerPageOptions={[8, 10, 20, 30, 40, 50]}
      />

      {/* Status Change Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCustomer?.currentStatus ? 'Deactivate Customer' : 'Activate Customer'}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {selectedCustomer?.currentStatus ? 'deactivate' : 'activate'}
              <span className="font-semibold"> {selectedCustomer?.name}</span>?
              {selectedCustomer?.currentStatus
                ? ' They will no longer be able to access their account.'
                : ' They will regain access to their account.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={selectedCustomer?.currentStatus ? 'destructive' : 'default'}
              onClick={confirmStatusToggle}
            >
              {selectedCustomer?.currentStatus ? 'Deactivate' : 'Activate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete
              <span className="font-semibold"> {selectedCustomer?.name}</span>?
              This action cannot be undone and all associated data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Customer Dialog */}
      <Dialog open={isAddCustomerOpen} onOpenChange={(open) => {
        if (!open) {
          form.reset({
            name: '',
            email: '',
            phone: '',
            gender: 'male',
            birthday: undefined,
            location: '',
            roleId: ''
          });
          setEditingCustomer(null);
          setIsEditMode(false);
        }
        setIsAddCustomerOpen(open);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
            <DialogDescription>
              Fill in the details below to {isEditMode ? 'edit' : 'add'} a new customer.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birthday"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              captionLayout="dropdown"
                              defaultMonth={field.value}
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              fromYear={1900}
                              toYear={new Date().getFullYear()}
                              classNames={classNames}
                            />

                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="New York, USA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="roleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsAddCustomerOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditMode ? (
                    <Edit className="h-4 w-4 mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {isEditMode ? 'Save Changes' : 'Add Customer'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}