import { Download, ChartBar as FileBarChart } from "lucide-react";
import {
  BatchPerformanceChart,
  ChartPanel,
  DistributionChart
} from "@/components/charts";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { StatsCard } from "@/components/stats-card";
import { Badge, Button, SearchBar, Select } from "@/components/ui";
import {
  getResults,
  getAdminMetrics,
  getBatchPerformance,
  performanceDistribution
} from "@/lib/data";

export default async function ResultsDashboardPage() {
  const [results, adminMetrics, batchPerformance] = await Promise.all([
    getResults(),
    getAdminMetrics(),
    getBatchPerformance()
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Results Dashboard"
        description="Analyze score distribution, batch comparison, student ranks, pass rate, and export reports."
        icon={FileBarChart}
        actions={
          <>
            <Button variant="outline">
              <Download className="h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4" />
              Excel
            </Button>
          </>
        }
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Average Score" value={`${adminMetrics.averageScore}%`} helper="Across selected exams" icon={FileBarChart} />
        <StatsCard label="Highest Score" value={`${adminMetrics.highestScore}%`} helper="Rank 1 this cycle" icon={FileBarChart} tone="success" />
        <StatsCard label="Lowest Score" value={`${adminMetrics.lowestScore}%`} helper="Needs intervention" icon={FileBarChart} tone="warning" />
        <StatsCard label="Pass Rate" value={`${adminMetrics.passRate}%`} helper="+6% from May" icon={FileBarChart} tone="secondary" />
      </section>
      <div className="grid gap-3 lg:grid-cols-[1fr_200px_200px_200px]">
        <SearchBar placeholder="Search student results" />
        <Select aria-label="Batch" options={[{ label: "All Batches", value: "all" }]} />
        <Select aria-label="Exam" options={[{ label: "All Exams", value: "all" }]} />
        <Select aria-label="Date Range" options={[{ label: "Last 30 days", value: "30" }]} />
      </div>
      <section className="grid gap-5 xl:grid-cols-2">
        <ChartPanel title="Performance Distribution">
          <DistributionChart data={performanceDistribution} />
        </ChartPanel>
        <ChartPanel title="Batch Comparison">
          <BatchPerformanceChart data={batchPerformance} />
        </ChartPanel>
      </section>
      <DataTable
        rows={results.slice(0, 12)}
        columns={[
          { key: "student_name", header: "Student Name" },
          { key: "score", header: "Score" },
          { key: "percentage", header: "Percentage", render: (row) => `${row.percentage}%` },
          { key: "rank", header: "Rank", render: (row) => `#${row.rank}` },
          { key: "result", header: "Result", render: (row) => <Badge>{row.result}</Badge> }
        ]}
      />
    </div>
  );
}
