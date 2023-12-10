import MyAttestations from "@/components/MyAttestations";
import MySchemas from "@/components/MySchemas";

export const dynamic = 'force-dynamic'

const HistoryPage = () => {
  return (
    <div className="flex flex-col my-12">
      <h1 className="text-3xl font-bold">Schemas</h1>
      <MySchemas />

      <h1 className="text-3xl font-bold mt-16">Attestations</h1>
      <MyAttestations />
    </div>
  )
}

export default HistoryPage;