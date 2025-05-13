"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/tabs";
import InvoiceDetailsView from "./_InvoiceDetails";
import CompanyInfo from "./_CompanyInfo";
import VerificationStatus from "./_VerificationStatus";
import AiAssistant from "./_AiAssistant";
import type { Invoice } from "@/app/lib/db";

type PropsTabs = { invoice: Invoice };

export default function InvoiceTabs({ invoice }: PropsTabs) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Invoice Details</TabsTrigger>
          <TabsTrigger value="company">Company Info</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <InvoiceDetailsView invoice={invoice} />
        </TabsContent>

        <TabsContent value="company">
          <CompanyInfo invoice={invoice} />
        </TabsContent>

        <TabsContent value="verification">
          <VerificationStatus invoice={invoice} />
        </TabsContent>
      </Tabs>

      {/* AI assistant is available across all tabs */}
      <div className="mt-8">
        <AiAssistant invoice={invoice} />
      </div>
    </div>
  );
}