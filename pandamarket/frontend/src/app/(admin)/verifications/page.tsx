import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

// Mock data for initial UI development
const pendingVerifications = [
  { id: 'store_1', name: 'Tech Store TN', document_type: 'Registre de Commerce', submitted_at: '2026-05-02T10:00:00Z', status: 'pending' },
  { id: 'store_2', name: 'Mode Fashion', document_type: 'Patente', submitted_at: '2026-05-01T15:30:00Z', status: 'pending' },
];

export default function VerificationsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Vérifications KYC</h2>
        <Badge variant="warning">{pendingVerifications.length} En attente</Badge>
      </div>

      <div className="grid gap-4">
        {pendingVerifications.map((v) => (
          <Card key={v.id} className="p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{v.name}</h3>
              <p className="text-sm text-gray-500">Document: {v.document_type}</p>
              <p className="text-sm text-gray-500">Soumis le: {new Date(v.submitted_at).toLocaleDateString('fr-FR')}</p>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline">Voir le Document</Button>
              <Button variant="primary" className="bg-green-600 hover:bg-green-700">Approuver</Button>
              <Button variant="danger">Rejeter</Button>
            </div>
          </Card>
        ))}

        {pendingVerifications.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">Aucune vérification en attente.</p>
          </div>
        )}
      </div>
    </div>
  );
}
