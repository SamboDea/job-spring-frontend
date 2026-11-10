import { Briefcase, Users, CalendarDays, UserCheck } from "lucide-react";
import StatCard from "./StatCard";

export default function StatCardGrid() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
                icon={Briefcase}
                label="Open Vacancies"
                value={24}
                caption="Jobs currently recruiting"
                variant="cyan"
            />
            <StatCard
                icon={Users}
                label="Total Applicants"
                value={182}
                caption="Applications received"
                variant="green"
            />
            <StatCard
                icon={CalendarDays}
                label="Interviews Scheduled"
                value={18}
                caption="Upcoming interviews"
                variant="red"
            />
            <StatCard
                icon={UserCheck}
                label="Hired This Month"
                value={18}
                caption="Successful hires"
                variant="yellow"
            />
        </div>
    );
}