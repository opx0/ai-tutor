"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { LoaderCircle, Sparkles, BookOpen, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import type { CourseData } from "@/lib/ai-providers"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"

const formSchema = z.object({
  topic: z.string().min(2, "Topic must be at least 2 characters."),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  additionalDetails: z.boolean(),
  details: z.string().optional(),
})

export default function CourseForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      difficulty: "Beginner",
      additionalDetails: false,
      details: "",
    },
  })

  const [streamedData, setStreamedData] = useState<Partial<CourseData> | null>(null)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      setStreamedData(null)
      let latestStreamedData: Partial<CourseData> | null = null

      const response = await fetch("/api/courses/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error("Failed to generate course")

      if (response.body) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let accumulated = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          accumulated += decoder.decode(value, { stream: true })
          
          try {
            // Vercel AI SDK streams partial objects as JSON strings
            // We need to parse the latest full object from the stream
            const lines = accumulated.split('\n').filter(line => line.trim() !== '')
            const lastLine = lines[lines.length - 1]
            if (lastLine && lastLine.startsWith('0:')) {
               const jsonStr = lastLine.substring(2)
               const parsed = JSON.parse(jsonStr)
               latestStreamedData = parsed
               setStreamedData(parsed)
            }
          } catch {
            // Ignore parse errors for incomplete JSON
          }
        }
      }

      if (!latestStreamedData) {
        throw new Error("Generated course stream was empty")
      }

      const saveResponse = await fetch("/api/courses/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...latestStreamedData,
          difficulty: values.difficulty,
          topic: values.topic,
        }),
      })

      if (!saveResponse.ok) {
        throw new Error("Failed to save generated course")
      }

      const saved = await saveResponse.json()
      toast.success("Course finalized and saved!")
      router.push(`/courses/${saved.id}`)
      
    } catch (error) {
      console.error("Error generating course:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-card/40 backdrop-blur-xl border-border/40 rounded-3xl overflow-hidden relative">
       {/* Decorative glow inside card */}
       <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[50px] rounded-full pointer-events-none" />
       
      <CardContent className="pt-8 pb-8 relative z-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
              <div>
                <Label htmlFor="topic">Course Topic</Label>
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input id="topic" className="bg-background/50 border-border/50 focus-visible:ring-primary h-12 text-base rounded-xl" placeholder="e.g., Algebra, JavaScript, Photography" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Label id="difficulty-label">Difficulty Level</Label>
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ToggleGroup
                          type="single"
                          value={field.value}
                          onValueChange={(value) => {
                            if (value) field.onChange(value)
                          }}
                          className="justify-start mt-2 gap-2"
                          aria-labelledby="difficulty-label"
                        >
                          <ToggleGroupItem value="Beginner" className="px-5 py-2.5 rounded-xl border border-transparent data-[state=on]:bg-chart-2/10 data-[state=on]:text-chart-2 data-[state=on]:border-chart-2/30 transition-all">
                            Beginner
                          </ToggleGroupItem>
                          <ToggleGroupItem value="Intermediate" className="px-5 py-2.5 rounded-xl border border-transparent data-[state=on]:bg-primary/10 data-[state=on]:text-primary data-[state=on]:border-primary/30 transition-all">
                            Intermediate
                          </ToggleGroupItem>
                          <ToggleGroupItem value="Advanced" className="px-5 py-2.5 rounded-xl border border-transparent data-[state=on]:bg-blue-500/10 data-[state=on]:text-blue-500 data-[state=on]:border-blue-500/30 transition-all">
                            Advanced
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="additionalDetails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <Label htmlFor="additionalDetails">Tell us more to tailor the course (optional)</Label>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">recommended</span>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {form.watch("additionalDetails") && (
                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="e.g., I'm a beginner looking to build a portfolio" className="bg-background/50 border-border/50 focus-visible:ring-primary h-12 rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <AnimatePresence>
              {isLoading && streamedData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 pt-6 border-t"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                        AI is crafting your course...
                      </span>
                      <span>{streamedData.modules?.length || 0} Modules</span>
                    </div>
                    <Progress value={(streamedData.modules?.length || 0) * 15} className="h-2" />
                  </div>

                  <div className="grid gap-3">
                    {streamedData.modules?.map((module: any, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10 shadow-sm"
                      >
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate uppercase tracking-tight">{module.title || "Generating..."}</p>
                          <p className="text-xs text-muted-foreground truncate">{module.description || "Writing content..."}</p>
                        </div>
                        {module.lessons?.length > 0 && (
                           <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              className="w-full py-6 text-base font-extrabold bg-chart-2 text-background hover:bg-chart-2/90 rounded-2xl shadow-md hover:shadow-md transition-all active:scale-[0.98] border border-chart-2/50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                  Generating Masterpiece...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Course with AI
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
