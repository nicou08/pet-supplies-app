import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function AccordionInfo() {
  return (
    <div>
      <div className="flex justify-center text-3xl font-bold py-6 mb-6">
        Frequently Asked Questions
      </div>
      <Accordion type="single" collapsible className="w-[700px] mx-auto">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xl font-semibold">
            What is your return policy?
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-base">
              Our return policy allows for returns within 30 days of purchase.
              Items must be unused and in their original packaging.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-xl font-semibold">
            What payment methods do you accept?
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-base">
              We accept all major credit cards, PayPal, and Apple Pay.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-xl font-semibold">
            Do you offer international shipping?
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-base">
              Yes, we ship to most countries worldwide. Shipping fees and times
              vary by location.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
