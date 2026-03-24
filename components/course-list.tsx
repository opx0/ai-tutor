"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, CodeXml } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
// CourseButton import removed
import useSWR from "swr";
import type { Course } from "@prisma/client";

type CourseWithLessonCount = Course & {
  _count: {
    lessons: number;
  };
  progress: number | null;
};

export default function CourseList() {
  const { data: courses, error: fetchError, isLoading } = useSWR<CourseWithLessonCount[]>("/api/courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<CourseWithLessonCount[]>([]);

  useEffect(() => {
    if (courses) {
      if (searchQuery.trim() === "") {
        setFilteredCourses(courses);
      } else {
        const filtered = courses.filter(
          (course) =>
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.topic.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCourses(filtered);
      }
    }
  }, [searchQuery, courses]);

  // Filter logic effect remains the same
  useEffect(() => {
    if (!isLoading && !fetchError) {
      // Only filter if not loading and no error
      if (searchQuery.trim() === "") {
        setFilteredCourses(courses || []);
      } else {
        const filtered = (courses || []).filter(
          (course) =>
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.topic.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCourses(filtered);
      }
    }
  }, [searchQuery, courses, isLoading, fetchError]); // Add isLoading and fetchError dependencies

  // --- Render Loading State ---
  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Courses</h2>
          <div className="relative w-64">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-16 mb-2" /> {/* Adjusted size */}
                <Skeleton className="h-6 w-3/4 mb-3" /> {/* Adjusted size */}
                <Skeleton className="h-4 w-20 mb-4" /> {/* Adjusted size */}
                <Skeleton className="h-2 w-full mb-2" />
                <Skeleton className="h-3 w-16 ml-auto" /> {/* Adjusted size */}
              </CardContent>
              <CardFooter className="bg-muted/50 px-6 py-4">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // --- Render Error State ---
  if (fetchError) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Failed to load courses: {fetchError.message || "Unknown error"}</p>
      </div>
    );
  }

  // --- Render Content ---
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-5">
        <h2 className="text-2xl font-bold">Your Courses</h2>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your courses..."
            className="pl-9 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          {searchQuery ? (
            <p className="text-muted-foreground">
              No courses found matching your search.
            </p>
          )           : (
            <>
              <p className="text-muted-foreground mb-4">
                You haven't created any courses yet.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href="/courses?tab=create">Create a Course</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/courses/dsa-mastery" className="flex items-center gap-2">
                    <CodeXml className="h-4 w-4" />
                    Try DSA Mastery Course
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden flex flex-col group hover:-translate-y-1 shadow-sm hover:shadow-md transition-all bg-card/40 backdrop-blur-xl border border-border/40 rounded-3xl relative">
              <div className="absolute inset-0 bg-gradient-to-br from-chart-2/0 via-transparent to-chart-2/0 group-hover:from-chart-2/5 transition-colors pointer-events-none" />
              <CardContent className="p-5 flex-grow relative z-10">
                <Badge variant="outline" className="mb-2 px-2 py-0.5 text-xs">
                  {course.difficulty}
                </Badge>
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <span>{course._count.lessons} lessons</span>
                </div>
                <Progress value={course.progress || 0} className="h-1.5 mb-1.5" />
                <div className="text-right text-xs text-muted-foreground">
                  {course.progress || 0}% complete
                </div>
              </CardContent>
              <CardFooter className="bg-muted/20 px-5 py-4 border-t border-border/30 relative z-10">
                <Button
                  className="w-full py-2 text-sm h-auto rounded-xl font-bold bg-background hover:bg-muted border border-border/50 text-foreground group-hover:border-chart-2/40 group-hover:text-chart-2 transition-colors"
                  asChild
                >
                  <Link href={`/courses/${course.id}`}>
                    View Course
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
