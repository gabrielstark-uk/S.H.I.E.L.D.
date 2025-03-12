import { AudioAnalyzer } from "@/components/AudioAnalyzer";
import { RFDetector } from "@/components/RFDetector";
import { SpywareInfo } from "@/components/SpywareInfo";

export default function Home() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold">Privacy Protection Suite</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AudioAnalyzer />
          <RFDetector />
        </div>
        <div>
          <SpywareInfo />
        </div>
      </div>
    </div>
  );
}