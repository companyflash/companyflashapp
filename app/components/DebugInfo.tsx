// app/components/DebugInfo.tsx

interface DebugInfoProps {
  data: unknown;
  label?: string;
}

export default function DebugInfo({ data, label = "Debug Data" }: DebugInfoProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-700 mb-2">{label}</h3>
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded overflow-auto max-h-64">
        <pre className="text-sm text-gray-800">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}
