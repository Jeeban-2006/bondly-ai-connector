import { Users, Cake, HeartHandshake, AlertCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '@/components/dashboard/StatsCard';
import ContactCheckInCard from '@/components/dashboard/ContactCheckInCard';
import { mockContacts } from '@/lib/mockData';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const navigate = useNavigate();
  const needsAttention = mockContacts.filter(c => c.healthStatus !== 'strong');
  const strongConnections = mockContacts.filter(c => c.healthStatus === 'strong');
  const upcomingBirthdays = 2;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="animate-in">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Good to see you, Alex 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          You have <span className="text-accent font-semibold">{needsAttention.length} relationships</span> needing attention 💛
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Users}
          label="Total Contacts"
          value={mockContacts.length}
          variant="primary"
          animationDelay="0.1s"
        />
        <StatsCard
          icon={Cake}
          label="Upcoming Birthdays"
          value={upcomingBirthdays}
          variant="accent"
          animationDelay="0.15s"
        />
        <StatsCard
          icon={HeartHandshake}
          label="Strong Connections"
          value={strongConnections.length}
          variant="success"
          animationDelay="0.2s"
        />
        <StatsCard
          icon={AlertCircle}
          label="Needs Attention"
          value={needsAttention.length}
          variant="warning"
          animationDelay="0.25s"
        />
      </div>

      {/* People to Check In With */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">People to Check In With</h2>
            <p className="text-sm text-muted-foreground">It's been a while — maybe send some love?</p>
          </div>
        </div>
        <div className="space-y-3">
          {mockContacts.map((contact, i) => (
            <ContactCheckInCard
              key={contact.id}
              contact={contact}
              animationDelay={`${0.3 + i * 0.05}s`}
            />
          ))}
        </div>
      </div>

      {/* Floating Add Button */}
      <Button
        onClick={() => navigate('/add-contact')}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-2xl btn-primary-glow border-0 shadow-2xl z-40"
        size="icon"
      >
        <Plus className="h-6 w-6 text-primary-foreground" />
      </Button>
    </div>
  );
};

export default Dashboard;
