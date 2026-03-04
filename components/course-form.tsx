"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const formSchema = z.object({
  topic: z.string().min(2, {
    message: "Topic must be at least 2 characters.",
  }),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  hasAdditionalDetails: z.boolean().default(false),
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
      hasAdditionalDetails: false,
      details: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      const response = await fetch("/api/courses/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to generate course")
      }

      const response_data = await response.json()
      const data = response_data?.data ?? response_data
      toast.success("Course generated successfully! Redirecting...")
      router.push(`/courses/${data.id}`)
      router.refresh()
    } catch (error) {
      console.error("Error generating course:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-sm">
      <CardContent className="pt-4 pb-4">
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
                        <Input id="topic" placeholder="e.g., Algebra, JavaScript, Photography" {...field} />
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
                          <ToggleGroupItem value="Beginner" className="px-5 py-2 rounded-md">
                            Beginner
                          </ToggleGroupItem>
                          <ToggleGroupItem value="Intermediate" className="px-5 py-2 rounded-md">
                            Intermediate
                          </ToggleGroupItem>
                          <ToggleGroupItem value="Advanced" className="px-5 py-2 rounded-md">
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
                  name="hasAdditionalDetails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <Label htmlFor="hasAdditionalDetails">Tell us more to tailor the course (optional)</Label>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">recommended</span>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {form.watch("hasAdditionalDetails") && (
                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="e.g., I'm a beginner looking to build a portfolio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <Button
              type="submit"
              className="w-full py-4 text-sm font-medium bg-slate-500 hover:bg-slate-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Course...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Course
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
