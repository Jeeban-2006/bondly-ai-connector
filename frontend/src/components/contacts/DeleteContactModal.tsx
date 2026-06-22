import { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DeleteContactModalProps {
  contactId: string;
  contactName: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteContactModal = ({
  contactId,
  contactName,
  open,
  onClose,
  onSuccess,
}: DeleteContactModalProps) => {
  const [deleting, setDeleting] = useState(false);

  if (!open) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      // Delete related interactions first (RLS-compliant cascade)
      const { error: interactionsError } = await supabase
        .from('interactions')
        .delete()
        .eq('contact_id', contactId);

      if (interactionsError) throw interactionsError;

      // Delete the contact itself
      const { error: contactError } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

      if (contactError) throw contactError;

      toast({
        title: '🗑️ Contact removed',
        description: `${contactName} has been permanently deleted.`,
      });
      onSuccess();
    } catch (error) {
      toast({
        title: 'Failed to delete contact',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="glass-card-static w-full max-w-sm p-6 space-y-5 animate-in">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Delete Contact</h2>
                <p className="text-xs text-muted-foreground mt-0.5">This action cannot be undone</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-xl -mt-1 -mr-1" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Warning message */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
            <p className="text-sm text-foreground leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-foreground">{contactName}</span>?
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              All interaction history and relationship data for this contact will be permanently removed.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-xl border-border"
              onClick={onClose}
              disabled={deleting}
            >
              Keep Contact
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground border-0 font-semibold"
            >
              {deleting ? (
                'Deleting...'
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteContactModal;
