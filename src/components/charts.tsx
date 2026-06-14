"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

const palette = ["#2563EB", "#F97316", "#10B981", "#F59E0B", "#EF4444", "#64748B"];

function MountedChart({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-full w-full rounded-card bg-neutral-100" />;
  }

  return <>{children}</>;
}

export function ChartPanel({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-72">{children}</CardContent>
    </Card>
  );
}

export function ParticipationTrend({ data }: { data: { month: string; appeared: number; assigned: number }[] }) {
  return (
    <MountedChart>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="appeared" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="month" stroke="#64748B" />
          <YAxis stroke="#64748B" />
          <Tooltip />
          <Area type="monotone" dataKey="assigned" stroke="#94A3B8" fill="transparent" />
          <Area type="monotone" dataKey="appeared" stroke="#2563EB" fill="url(#appeared)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </MountedChart>
  );
}

export function PassFailChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <MountedChart>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} innerRadius={58} outerRadius={90} paddingAngle={3} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={palette[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </MountedChart>
  );
}

export function BatchPerformanceChart({ data }: { data: { name: string; average: number }[] }) {
  return (
    <MountedChart>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 11 }} />
          <YAxis stroke="#64748B" />
          <Tooltip />
          <Bar dataKey="average" fill="#10B981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </MountedChart>
  );
}

export function DistributionChart({ data }: { data: { range: string; students: number }[] }) {
  return (
    <MountedChart>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="range" stroke="#64748B" />
          <YAxis stroke="#64748B" />
          <Tooltip />
          <Bar dataKey="students" fill="#2563EB" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </MountedChart>
  );
}

export function SubjectPerformanceChart({
  data
}: {
  data: { subject: string; score: number; average: number }[];
}) {
  return (
    <MountedChart>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#CBD5E1" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
          <Radar name="Score" dataKey="score" stroke="#2563EB" fill="#2563EB" fillOpacity={0.25} />
          <Radar name="Average" dataKey="average" stroke="#F97316" fill="#F97316" fillOpacity={0.14} />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </MountedChart>
  );
}

export function MiniLineChart({ data }: { data: { month: string; appeared: number }[] }) {
  return (
    <MountedChart>
      <ResponsiveContainer width="100%" height={70}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="appeared" stroke="#2563EB" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </MountedChart>
  );
}
