import { AudioAnalyzer } from "@/components/AudioAnalyzer";
import { SpywareInfo } from "@/components/SpywareInfo";

export default function Home() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold">Audio Frequency Analyzer</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AudioAnalyzer />
        </div>
        <div>
          <SpywareInfo />
        </div>
      </div>
    </div>
  );
}
