import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Users, CalendarDays, CircleDollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const stats = [
  { title: "Members", value: 2977, icon: Users },
  { title: "Hires Today", value: 5, icon: CalendarDays },
  { title: "Hires This Week", value: 66, icon: CalendarDays },
  { title: "Hires This Month", value: 453, icon: CalendarDays },
  { title: "Collections Today", value: 15579.04, icon: CircleDollarSign },
  { title: "Collections This Week", value: 339822.64, icon: CircleDollarSign },
  {
    title: "Collections This Month",
    value: 2831398.69,
    icon: CircleDollarSign,
  },
];


const hireTypeData = [
  { name: "onTheMeter", value: 80, fill: "var(--color-onTheMeter)" },
  { name: "specialPackage", value: 10, fill: "var(--color-specialPackage)" },
  { name: "kiaDrop", value: 6, fill: "var(--color-kiaDrop)" },
  { name: "kiaPickup", value: 4, fill: "var(--color-kiaPickup)" },
];

const hireTypeChartConfig = {
  hireType: {
    label: "Hire Type",
  },
  onTheMeter: {
    label: "On The Meter",
    color: "#6330B8",
  },
  specialPackage: {
    label: "Special Package",
    color: "#8552E0",
  },
  kiaDrop: {
    label: "KIA Drop",
    color: "#A678FF",
  },
  kiaPickup: {
    label: "KIA Pickup",
    color: "#FFA4FF",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

const collectionsData = [
  { date: "Monday", income: 150000 },
  { date: "Tuesday", income: 120000 },
  { date: "Wednesday", income: 40000 },
  { date: "Thursday", income: 0 },
  { date: "Friday", income: 450000 },
  { date: "Saturday", income: 300000 },
  { date: "Sunday", income: 50000 },
];

const collectionsChartConfig = {
  income: {
    label: "Income",
    color: "#6330B8",
  },

}

const totalHiresData = [
  { date: "Monday", count: 15 },
  { date: "Tuesday", count: 18 },
  { date: "Wednesday", count: 8 },
  { date: "Thursday", count: 0 },
  { date: "Friday", count: 58 },
  { date: "Saturday", count: 33 },
  { date: "Sunday", count: 17 },
];

const totalHiresChartConfig = {
  count: {
    label: "Hire Count",
    color: "#6330B8",
  },
}

const topDriversData = [
  { name: "Mayuran", count: 24 },
  { name: "Neel", count: 20 },
  { name: "Munadeen", count: 14 },
  { name: "Chanaka", count: 12 },
  { name: "Upul", count: 11 },
  { name: "Ananda", count: 10 },
  { name: "Tharanga", count: 8 },
  { name: "Shehan", count: 6 },
];

const topDriversChartConfig = {
  count: {
    label: " Hire Count",
    color: " #6330B8"
  }
}

const vehicleCategoriesData = [
  { name: "BUS", count: 150 },
  { name: "LUXURY", count: 1000 },
  { name: "BUDGET", count: 1400 },
  { name: "TUK", count: 600 },
  { name: "VAN", count: 450 },
  { name: "MINI VAN", count: 900 },
  { name: "STANDARD", count: 800 },
  { name: "ECONOMY", count: 100 },
];

const vehicleCategoriesChartConfig = {
  count: {
    label: "Vehicle Count",
    color: "#6330B8",
  },
}

const agentData = [
  { name: "Nirash Lakman", count: 21, income: 261483.3 },
  { name: "Erandi Dilrukshi", count: 10, income: 211236.14 },
  { name: "Pasindu Dinuranga", count: 37, income: 151233.6 },
  { name: "Hethma Nawodya", count: 35, income: 141023.04 },
  { name: "Mohamed Haroon", count: 23, income: 121488.2 },
  { name: "Ridma Gunasekara", count: 16, income: 51622.5 },
];

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<string>("today");

  return (
    <div className="p-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#6330B8]">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of all system statistics and performance metrics
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <stat.icon className="text-[#6330B8]" />
                <div className="text-right">
                  <p className="text-xl font-semibold text-primary">
                    {typeof stat.value === "number"
                      ? stat.value.toLocaleString()
                      : stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dashboard Summary Header with Date Range Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-2xl font-medium">Dashboard Statistics Summary</div>
        <div className="flex items-center gap-2">
          <span className="text-xl text-foreground text-bold">Period:</span>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
              <SelectItem value="thismonth">This Month</SelectItem>
              <SelectItem value="lastmonth">Last Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Hires by Type */}
        <Card className="">
          <CardHeader>
            <CardTitle>Hires by hire type</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={hireTypeChartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <Pie data={hireTypeData} dataKey="value" nameKey="name"></Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="name" />}
                  className="-translate-y-2 flex-nowrap gap-2 *:basis-1/4 *:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Collections for Period */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Collections for Selected Period</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={collectionsChartConfig}>
              <BarChart accessibilityLayer data={collectionsData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />

                <ChartTooltip
                  cursor={false}
                  accessibilityLayer={true}
                  content={<ChartTooltipContent className="min-w-[10rem]" hideLabel />}
                />
                <Bar dataKey="income" fill="var(--color-income)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Total Hires */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Total Hires</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={totalHiresChartConfig} >
              <BarChart accessibilityLayer data={totalHiresData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />

                <ChartTooltip
                  cursor={false}
                  accessibilityLayer={true}
                  content={<ChartTooltipContent className="min-w-[10rem]" hideLabel />}
                />
                <Bar dataKey="count" fill="var(--color-count)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Drivers */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top Performed Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={topDriversChartConfig}>
              <BarChart
                accessibilityLayer
                data={topDriversData}
                layout="vertical"
                margin={{
                  left: 30,
                }}
              >
                <XAxis type="number" dataKey="count" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" fill="var(--color-count)" radius={5} />
              </BarChart>
            </ChartContainer>

          </CardContent>
        </Card>

        {/* Vehicle Categories */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Vehicles by Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={vehicleCategoriesChartConfig}>
              <BarChart accessibilityLayer data={vehicleCategoriesData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />

                <ChartTooltip
                  cursor={false}
                  accessibilityLayer={true}
                  content={<ChartTooltipContent className="min-w-[10rem]" hideLabel />}
                />
                <Bar dataKey="count" fill="var(--color-count)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Hires by Agents */}

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Hires by Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-black">Agent</TableHead>
                  <TableHead className="font-bold text-black">Count</TableHead>
                  <TableHead className="font-bold text-black">Total Income</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agentData.map((agent) => (
                  <TableRow key={agent.name}>
                    <TableCell>{agent.name}</TableCell>
                    <TableCell>{agent.count}</TableCell>
                    <TableCell>{agent.income.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
