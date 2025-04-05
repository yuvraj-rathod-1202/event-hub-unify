import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Users, Upload, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { getAllUsers } from '../../services/userService';

// Club form validation schema
const clubFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }).max(50),
  category: z.string().min(1, { message: "Please select a category" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }).max(500),
  contactEmail: z.string().email({ message: "Please enter a valid email address" }),
  meetingLocation: z.string().min(3, { message: "Meeting location is required" }),
  socialLinks: z.string().optional(),
  coordinatorId: z.string().optional(), // Add coordinatorId to schema
});

const categories = [
  { id: 'academic', name: 'Academic' },
  { id: 'cultural', name: 'Cultural' },
  { id: 'sports', name: 'Sports' },
  { id: 'technical', name: 'Technical' },
  { id: 'sports', name: 'Sports' },
];

const ClubForm = ({ onSubmit, isLoading, club, isupdate=false }) => {
  const { currentUser } = useAuth(); // Get currentUser
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(club?.logoUrl || null);
  const [users, setUsers] = useState([]); // Add users state

  // Initialize form with default values or existing club data
  const form = useForm({
    resolver: zodResolver(clubFormSchema),
    defaultValues: {
      name: club?.name || '',
      category: club?.category || '',
      description: club?.description || '',
      contactEmail: club?.contactEmail || '',
      meetingLocation: club?.meetingLocation || '',
      socialLinks: club?.socialLinks || '',
      coordinatorId: club?.coordinatorId || '', // Initialize coordinatorId
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        console.log('Fetched users:', usersData); // Log fetched users
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setLogoFile(file);

      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleFormSubmit = (data) => {
    onSubmit(data, logoFile);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Logo Upload */}
            <div className="mb-6">
              <FormLabel>Club Logo</FormLabel>
              <div className="mt-2">
                {logoPreview ? (
                  <div className="relative w-40 h-40 rounded-lg overflow-hidden">
                    <img
                      src={logoPreview}
                      alt="Club Logo Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute top-2 right-2 bg-gray-900/70 text-white p-1 rounded-full hover:bg-gray-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-40 h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => document.getElementById('logo-upload').click()}>
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="text-sm text-gray-600">
                        <label htmlFor="logo-upload" className="relative cursor-pointer text-primary hover:underline">
                          <span>Upload a logo</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </div>
                )}
                <input
                  id="logo-upload"
                  name="logo"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleLogoChange}
                />
              </div>
            </div>

            {/* Club Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Club Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter club name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter club description"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe what your club is about, its mission, and activities.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Email */}
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input placeholder="club@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Meeting Location */}
            <FormField
              control={form.control}
              name="meetingLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Where does the club meet?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Social Links */}
            <FormField
              control={form.control}
              name="socialLinks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Media Links (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Instagram, Twitter, Facebook, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add one link per line (Instagram, Twitter, Facebook, etc.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Club Coordinator */}
            <FormField
              control={form.control}
              name="coordinatorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Club Coordinator</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a coordinator" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.uid} value={user.displayName}>
                          {user.email} ({user.displayName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="flex gap-2">
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    Update
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ClubForm;