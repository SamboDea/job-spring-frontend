import HiringTrendChart from "@/src/components/dashboard/HiringTrendChart";
import StateCardGrid from "@/src/components/dashboard/StatCardGrid";

export default function DashboardPage() {
    return (
        <>
            <StateCardGrid />
            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                <HiringTrendChart />
                <HiringTrendChart />
            </div>
        </>
    );
}