import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { EducationResources } from "@/components/education-resources";

export default function Education() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <BookOpen className="h-12 w-12 mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold">Educational Resources</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Learn about audio-based harassment and how to protect yourself
          </p>
        </div>

        <EducationResources />
      </div>
    </div>
  );
}
