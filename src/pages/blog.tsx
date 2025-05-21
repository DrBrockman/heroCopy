import DefaultLayout from "@/layouts/default";
import DataDisplay from "@/components/dataDisplay";
import { usePatient } from "@/PatientContext";
export default function DocsPage() {
  const { patients } = usePatient();
  const patientCount = Object.keys(patients).length;
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center  gap-4 py-8 md:py-10">
      <h1 className="text-l w-11/12 text-center font-bold">
          You have <span className="text-blue-500">{patientCount}</span> patients to document on
        </h1>
      <div className="inline-block w-11/12 text-center justify-center lg:w-9/12">
          
          <DataDisplay></DataDisplay>
        </div>
        
      </section>
    </DefaultLayout>
  );
}
