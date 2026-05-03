import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

// Mock data for initial UI development
const pendingMandats = [
  { id: 'mandat_1', store_name: 'Tech Store TN', order_amount: '150.00 TND', order_id: 'ord_123', submitted_at: '2026-05-02T11:00:00Z', status: 'pending', proof_url: '/mandat-proofs/123.jpg' },
  { id: 'mandat_2', store_name: 'Mode Fashion', order_amount: '45.00 TND', order_id: 'ord_456', submitted_at: '2026-05-01T09:30:00Z', status: 'pending', proof_url: '/mandat-proofs/456.jpg' },
];

export default function MandatsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Validation Mandat Minute</h2>
        <Badge variant="warning">{pendingMandats.length} En attente</Badge>
      </div>

      <div className="grid gap-4">
        {pendingMandats.map((m) => (
          <Card key={m.id} className="p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{m.store_name}</h3>
              <p className="text-sm text-gray-500">Commande: {m.order_id} - <span className="font-medium text-gray-700">{m.order_amount}</span></p>
              <p className="text-sm text-gray-500">Soumis le: {new Date(m.submitted_at).toLocaleDateString('fr-FR')} à {new Date(m.submitted_at).toLocaleTimeString('fr-FR')}</p>
            </div>
            
            <div className="flex space-x-3 items-center">
              <a href={m.proof_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium mr-4">
                Voir la preuve
              </a>
              <Button variant="primary" className="bg-green-600 hover:bg-green-700">Approuver</Button>
              <Button variant="danger">Rejeter</Button>
            </div>
          </Card>
        ))}

        {pendingMandats.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">Aucun mandat en attente de validation.</p>
          </div>
        )}
      </div>
    </div>
  );
}
