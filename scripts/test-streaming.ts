import { streamCourseContent } from "@/lib/ai-router";

async function testStreaming() {
  console.log("Starting streaming test...");
  try {
    const result = await streamCourseContent("Quantum Computing", "Beginner");
    console.log("Result obtained, reading stream...");

    // In a server environment, we can iterate over the stream
    for await (const partialObject of result.partialObjectStream) {
      console.clear();
      console.log("Course Title:", partialObject.title);
      console.log("Modules Generated:", partialObject.modules?.length || 0);
      if (partialObject.modules && partialObject.modules.length > 0) {
        const lastModule = partialObject.modules[partialObject.modules.length - 1];
        if (lastModule) {
          console.log("Last Module:", lastModule.title);
          console.log("Lessons in Last Module:", lastModule.lessons?.length || 0);
        }
      }
    }
    console.log("\nStreaming complete!");
  } catch (error) {
    console.error("Streaming test failed:", error);
  }
}

testStreaming();
