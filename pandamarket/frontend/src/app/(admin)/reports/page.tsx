import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

// Mock data for initial UI development
const pendingReports = [
  { id: 'rep_1', reporter: 'cus_123', target_type: 'Store', target_id: 'store_99', reason: 'Fraude suspectée', description: 'Le vendeur demande un paiement en dehors de la plateforme.', submitted_at: '2026-05-02T14:20:00Z', status: 'pending' },
  { id: 'rep_2', reporter: 'cus_456', target_type: 'Product', target_id: 'prod_88', reason: 'Contenu inapproprié', description: 'L\'image du produit ne respecte pas les conditions générales.', submitted_at: '2026-05-01T11:15:00Z', status: 'pending' },
];

export default function ReportsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Modération & Signalements</h2>
        <Badge variant="warning">{pendingReports.length} En attente</Badge>
      </div>

      <div className="grid gap-4">
        {pendingReports.map((r) => (
          <Card key={r.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={r.target_type === 'Store' ? 'danger' : 'neutral'}>{r.target_type}</Badge>
                  <span className="text-sm text-gray-500">ID: {r.target_id}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{r.reason}</h3>
              </div>
              <span className="text-sm text-gray-400">{new Date(r.submitted_at).toLocaleDateString('fr-FR')}</span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100 mb-4">
              <p className="text-sm text-gray-700 italic">"{r.description}"</p>
              <p className="text-xs text-gray-400 mt-2">Signalé par: {r.reporter}</p>
            </div>

            <div className="flex space-x-3">
              <Button variant="danger" className="bg-red-600 hover:bg-red-700 text-white">
                {r.target_type === 'Store' ? 'Suspendre la Boutique' : 'Supprimer le Produit'}
              </Button>
              <Button variant="outline">Avertir le Vendeur</Button>
              <Button variant="secondary" className="text-gray-600">Ignorer</Button>
            </div>
          </Card>
        ))}

        {pendingReports.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">Aucun signalement en attente de modération.</p>
          </div>
        )}
      </div>
    </div>
  );
}
