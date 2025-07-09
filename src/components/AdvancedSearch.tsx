"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Search as SearchIcon,
  Filter,
  Calendar,
  User,
  Flag,
  X,
  Loader2,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { searchTasks, getSearchOptions, SearchFilters, SearchResult } from "@/actions/search";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SearchOptions {
  projects: { id: string; name: string }[];
  states: { id: string; label: string; projectId: string }[];
  participants: { id: string; name: string | null; image: string | null }[];
}

export function AdvancedSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Partial<SearchFilters>>({});
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    projects: [],
    states: [],
    participants: [],
  });
  const [showFilters, setShowFilters] = useState(false);

  // Load search options
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const options = await getSearchOptions();
        setSearchOptions(options);
      } catch (error) {
        toast.error("Failed to load search options");
      }
    };

    loadOptions();
  }, []);

  // Filter states based on selected project
  const availableStates = filters.projectId
    ? searchOptions.states.filter((state) => state.projectId === filters.projectId)
    : searchOptions.states;

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = await searchTasks({
        query: query.trim(),
        ...filters,
      });
      setResults(searchResults);
    } catch (error) {
      toast.error("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const clearFilters = () => {
    setFilters({});
    setQuery("");
    setResults([]);
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Clear state filter if project changes
    if (key === "projectId") {
      setFilters((prev) => ({
        ...prev,
        projectId: value,
        stateId: undefined,
      }));
    }
  };

  const removeFilter = (key: keyof SearchFilters) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "LOW":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter((key) => filters[key as keyof SearchFilters] !== undefined).length;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SearchIcon className="h-4 w-4" />
          Search Tasks
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SearchIcon className="h-5 w-5" />
            Advanced Search
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Search tasks by title or description..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pr-10"
              />
              <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button onClick={handleSearch} disabled={isSearching || !query.trim()}>
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SearchIcon className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Filters Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
            {getActiveFiltersCount() > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>

          {/* Active Filters */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.projectId && (
                <Badge variant="secondary" className="gap-1">
                  Project: {searchOptions.projects.find((p) => p.id === filters.projectId)?.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFilter("projectId")}
                  />
                </Badge>
              )}
              {filters.priority && (
                <Badge variant="secondary" className="gap-1">
                  Priority: {filters.priority}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFilter("priority")}
                  />
                </Badge>
              )}
              {filters.stateId && (
                <Badge variant="secondary" className="gap-1">
                  Status: {searchOptions.states.find((s) => s.id === filters.stateId)?.label}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFilter("stateId")}
                  />
                </Badge>
              )}
              {filters.assigneeId && (
                <Badge variant="secondary" className="gap-1">
                  Assignee: {searchOptions.participants.find((p) => p.id === filters.assigneeId)?.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFilter("assigneeId")}
                  />
                </Badge>
              )}
            </div>
          )}

          {/* Filters Panel */}
          {showFilters && (
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Project Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Project</label>
                    <Select
                      value={filters.projectId || ""}
                      onValueChange={(value) => updateFilter("projectId", value || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any project</SelectItem>
                        {searchOptions.projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Priority</label>
                    <Select
                      value={filters.priority || ""}
                      onValueChange={(value) => updateFilter("priority", value || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any priority</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="LOW">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select
                      value={filters.stateId || ""}
                      onValueChange={(value) => updateFilter("stateId", value || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any status</SelectItem>
                        {availableStates.map((state) => (
                          <SelectItem key={state.id} value={state.id}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Assignee Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Assignee</label>
                    <Select
                      value={filters.assigneeId || ""}
                      onValueChange={(value) => updateFilter("assigneeId", value || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any assignee</SelectItem>
                        {searchOptions.participants.map((participant) => (
                          <SelectItem key={participant.id} value={participant.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={participant.image || ""} />
                                <AvatarFallback className="text-xs">
                                  {participant.name?.charAt(0) || "?"}
                                </AvatarFallback>
                              </Avatar>
                              {participant.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Range Filters */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Due Date From</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="h-4 w-4 mr-2" />
                          {filters.dueDateFrom
                            ? format(filters.dueDateFrom, "MMM d, yyyy")
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={filters.dueDateFrom}
                          onSelect={(date) => updateFilter("dueDateFrom", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Due Date To</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="h-4 w-4 mr-2" />
                          {filters.dueDateTo
                            ? format(filters.dueDateTo, "MMM d, yyyy")
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={filters.dueDateTo}
                          onSelect={(date) => updateFilter("dueDateTo", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          <div className="flex-1 overflow-y-auto">
            {results.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">
                  Search Results ({results.length} task{results.length !== 1 ? "s" : ""})
                </h3>
                <div className="space-y-3">
                  {results.map((task) => (
                    <Card key={task.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium truncate">{task.title}</h4>
                            <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {task.state.project.name} • {task.state.label}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Due {format(new Date(task.dueDate), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Assignees */}
                          <div className="flex -space-x-1">
                            {task.taskAssignements.slice(0, 3).map((assignment, index) => (
                              <Avatar key={index} className="h-6 w-6 border-2 border-background">
                                <AvatarImage src={assignment.participant.user.image || ""} />
                                <AvatarFallback className="text-xs">
                                  {assignment.participant.user.name?.charAt(0) || "?"}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {task.taskAssignements.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                <span className="text-xs font-medium">
                                  +{task.taskAssignements.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={`/dashboard/projects/${task.state.project.id}/view`}>
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {results.length === 0 && query && !isSearching && (
              <div className="text-center py-12 text-muted-foreground">
                <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tasks found matching your search criteria.</p>
                <p className="text-sm mt-1">Try adjusting your search query or filters.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}