import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

const NoticeForm = ({ onSubmit, isLoading, isupdate=false, notice={} }) => {
  const [title, setTitle] = useState(notice?.title);
  const [club, setClub] = useState(notice?.club);
  const [position, setPosition] = useState(notice?.position);
  const [description, setDescription] = useState(notice?.description);
  const [deadline, setDeadline] = useState(format(notice?.deadline.toDate(), "yyyy-MM-dd") || null);
  const [category, setCategory] = useState(notice?.category || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, club, position, description, deadline, category });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="club">Club</Label>
        <Input type="text" id="club" value={club} onChange={(e) => setClub(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="position">Position</Label>
        <Input type="text" id="position" value={position} onChange={(e) => setPosition(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="deadline">Deadline</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"outline"} className="w-[280px] justify-start text-left font-normal">
              {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={deadline}
              onSelect={setDeadline}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          required
        >
          <option value="">Select a category</option>
          <option value="Academic">Academic</option>
          <option value="Club">Club</option>
          <option value="Sports">Sports</option>
          <option value="Deadline">Deadline</option>
          <option value="General">General</option>
        </select>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading  ? "Creating..." : !isupdate ? "Create Notice" : "Update Notice"}
      </Button>
    </form>
  );
};

export default NoticeForm;