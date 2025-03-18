import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
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
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Eye } from 'lucide-react';

interface Report {
  id: number;
  userId: number | null;
  frequency: string;
  type: string;
  description: string | null;
  timestamp: string;
  location: any | null;
  severity: string | null;
  countermeasureActivated: boolean | null;
  deviceInfo: any | null;
  status: string;
}

export function ReportManagement() {
  const { token } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isViewReportOpen, setIsViewReportOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [token]);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/reports', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      
      const data = await response.json();
      setReports(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const viewReport = (report: Report) => {
    setSelectedReport(report);
    setIsViewReportOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Report Management</h2>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.id}</TableCell>
                <TableCell>{report.userId || 'Anonymous'}</TableCell>
                <TableCell>{report.type}</TableCell>
                <TableCell>{report.frequency}</TableCell>
                <TableCell>{formatDate(report.timestamp)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    report.severity === 'HIGH' 
                      ? 'bg-red-100 text-red-800' 
                      : report.severity === 'MEDIUM' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-blue-100 text-blue-800'
                  }`}>
                    {report.severity || 'LOW'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    report.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : report.status === 'investigating' 
                        ? 'bg-blue-100 text-blue-800' 
                        : report.status === 'resolved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                  }`}>
                    {report.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => viewReport(report)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            
            {reports.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No reports found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* View Report Dialog */}
      <Dialog open={isViewReportOpen} onOpenChange={setIsViewReportOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected report.
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Basic Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID:</span>
                      <span>{selectedReport.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User ID:</span>
                      <span>{selectedReport.userId || 'Anonymous'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{selectedReport.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frequency:</span>
                      <span>{selectedReport.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Timestamp:</span>
                      <span>{formatDate(selectedReport.timestamp)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Severity:</span>
                      <span>{selectedReport.severity || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span>{selectedReport.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Countermeasure:</span>
                      <span>{selectedReport.countermeasureActivated ? 'Activated' : 'Not activated'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Additional Information</h3>
                  
                  {selectedReport.description && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-muted-foreground">Description:</h4>
                      <p className="mt-1">{selectedReport.description}</p>
                    </div>
                  )}
                  
                  {selectedReport.location && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-muted-foreground">Location:</h4>
                      <div className="mt-1 text-sm">
                        <div>Latitude: {selectedReport.location.latitude}</div>
                        <div>Longitude: {selectedReport.location.longitude}</div>
                        <div>Accuracy: {selectedReport.location.accuracy}m</div>
                      </div>
                    </div>
                  )}
                  
                  {selectedReport.deviceInfo && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Device Info:</h4>
                      <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                        {JSON.stringify(selectedReport.deviceInfo, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Update Status</h3>
                <div className="flex space-x-2">
                  <Select defaultValue={selectedReport.status}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="dismissed">Dismissed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>Update Status</Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsViewReportOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}