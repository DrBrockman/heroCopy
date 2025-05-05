import DefaultLayout from "@/layouts/default";
import DataDisplay from "@/components/dataDisplay";

export default function DocsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center  gap-4 py-8 md:py-10">
      <div className="inline-block w-11/12 text-center justify-center lg:w-9/12">
          
          <DataDisplay></DataDisplay>
        </div>
        
      </section>
    </DefaultLayout>
  );
}
