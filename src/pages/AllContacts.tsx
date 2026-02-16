import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SortAsc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import HealthIndicator from '@/components/contacts/HealthIndicator';
import { mockContacts, getInitials, getAvatarColor, RelationshipType } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const relationshipBadgeColors: Record<string, string> = {
  Family: 'bg-accent/10 text-accent',
  Friend: 'bg-primary/10 text-primary',
  Colleague: 'bg-warning/10 text-warning',
  Partner: 'bg-success/10 text-success',
  Acquaintance: 'bg-secondary text-muted-foreground',
};

const AllContacts = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  const filtered = mockContacts
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    .filter(c => filterType === 'all' || c.relationshipType === filterType)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'health-asc') return a.healthScore - b.healthScore;
      if (sortBy === 'health-desc') return b.healthScore - a.healthScore;
      if (sortBy === 'importance') return b.importance - a.importance;
      return 0;
    });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="animate-in">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">All Contacts</h1>
        <p className="text-muted-foreground mt-1">{mockContacts.length} people in your network</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 animate-in animate-in-delay-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl h-11 bg-card border-border"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[160px] rounded-xl h-11 bg-card border-border">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Family">Family</SelectItem>
            <SelectItem value="Friend">Friend</SelectItem>
            <SelectItem value="Colleague">Colleague</SelectItem>
            <SelectItem value="Partner">Partner</SelectItem>
            <SelectItem value="Acquaintance">Acquaintance</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px] rounded-xl h-11 bg-card border-border">
            <SortAsc className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="name">Name A–Z</SelectItem>
            <SelectItem value="health-desc">Health ↓</SelectItem>
            <SelectItem value="health-asc">Health ↑</SelectItem>
            <SelectItem value="importance">Importance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contact Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 animate-in">
          <p className="text-5xl mb-3">🔍</p>
          <p className="text-lg font-semibold text-foreground">No contacts found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((contact, i) => (
            <div
              key={contact.id}
              className="glass-card p-5 cursor-pointer animate-in"
              style={{ animationDelay: `${0.1 + i * 0.05}s` }}
              onClick={() => navigate(`/contact/${contact.id}`)}
            >
              <div className="flex items-start gap-4">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-base font-bold text-primary-foreground shrink-0", getAvatarColor(contact.name))}>
                  {getInitials(contact.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground truncate">{contact.name}</h3>
                    <HealthIndicator score={contact.healthScore} status={contact.healthStatus} size="sm" />
                  </div>
                  <span className={cn("inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mt-1", relationshipBadgeColors[contact.relationshipType])}>
                    {contact.relationshipType}
                  </span>
                  <p className="text-xs text-muted-foreground mt-2">Last contacted {contact.lastContacted}</p>
                  <div className="mt-2 flex gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <div
                        key={idx}
                        className={cn("w-2 h-2 rounded-full", idx < contact.importance ? "bg-primary" : "bg-secondary")}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllContacts;
