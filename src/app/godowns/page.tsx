import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Building2, MapPin, Phone } from "lucide-react";

const godowns = [
  { id: 1, name: "Godown A - Mumbai", manager: "Rahul Sharma", phone: "+91 98765 43210", status: "Active" },
  { id: 2, name: "Godown B - Delhi", manager: "Amit Singh", phone: "+91 98765 43211", status: "Active" },
  { id: 3, name: "Godown C - Bangalore", manager: "Priya Patel", phone: "+91 98765 43212", status: "Active" },
  { id: 4, name: "Godown D - Chennai", manager: "Karthik N", phone: "+91 98765 43213", status: "Active" },
];

export default function GodownsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Godown Directory</h1>
        <p className="text-muted-foreground mt-2">Manage and view all active godown locations.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {godowns.map((godown) => (
          <Card key={godown.id} className="hover:border-primary transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg">{godown.name}</CardTitle>
                <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                  {godown.status}
                </span>
              </div>
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  Manager: {godown.manager}
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  {godown.phone}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
