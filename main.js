import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    ArrowUpRight,
    ArrowDownRight,
    Users,
    Briefcase,
    TrendingUp,
    TrendingDown,
    Calendar,
    Clock,
    Coins,
    BarChart,
    PieChart,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from "@/components/ui/separator"

// Mock Data (Replace with actual data fetching)
const generateMockData = (timeRange: string) => {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
        case 'Last Month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            break;
        case 'Last 3 Months':
            startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
            break;
        case 'Last 6 Months':
            startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
            break;
        case 'Year to Date':
            startDate = new Date(now.getFullYear(), 0, 1); // Start of the year
            break;
        default:
            startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    }

    const numberOfDays = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    const applicants = Math.floor(Math.random() * 500) + 100;
    const hires = Math.floor(Math.random() * 50) + 10;
    const offersExtended = Math.floor(hires * (Math.random() * 0.2 + 1)); // Assume some offers are declined
    const offersAccepted = Math.floor(offersExtended * (0.8 + Math.random() * 0.2)); // Assume 80-100% acceptance

    const generateHeadcountData = () => {
        const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Product'];
        const headcount: { [key: string]: number } = {};
        const monthlySalary: { [key: string]: number } = {};
        const changes: { [key: string]: number } = {};

        departments.forEach(dept => {
            headcount[dept] = Math.floor(Math.random() * 50) + 20; // Random headcount between 20 and 70
            monthlySalary[dept] = headcount[dept] * (Math.floor(Math.random() * 8000) + 5000); // Random salary between 5k and 13k
            changes[dept] = Math.floor(Math.random() * 21) - 10; // Change between -10 and +10
        });

        return { headcount, monthlySalary, changes };
    };

    const { headcount, monthlySalary, changes } = generateHeadcountData();

    const newHires = Math.floor(Math.random() * 30) + 5;
    const exits = Math.floor(Math.random() * 20) + 5;

    const exitReasons = [
        { reason: 'Better Opportunity', count: Math.floor(exits * (0.4 + Math.random() * 0.3)) }, // 40-70%
        { reason: 'Relocation', count: Math.floor(exits * (0.1 + Math.random() * 0.2)) },       // 10-30%
        { reason: 'Personal Reasons', count: Math.floor(exits * (0.1 + Math.random() * 0.2)) }, // 10-30%
        { reason: 'Termination', count: exits - (Math.floor(exits * (0.4 + Math.random() * 0.3)) + Math.floor(exits * (0.1 + Math.random() * 0.2)) + Math.floor(exits * (0.1 + Math.random() * 0.2))) }, // Remaining
    ];

    const timeToHire = Math.floor(Math.random() * 30) + 15; // Between 15 and 45 days
    const costToHire = Math.floor(Math.random() * 5000) + 2000; // Between 2000 and 7000

    return {
        applicants,
        hirePercentage: applicants > 0 ? ((hires / applicants) * 100).toFixed(2) : '0',
        offerAcceptanceRate: offersExtended > 0 ? ((offersAccepted / offersExtended) * 100).toFixed(2) : '0',
        headcount,
        monthlySalary,
        headcountChanges: changes,
        newHires,
        exits,
        exitReasons,
        timeToHire,
        costToHire,
        startDate,
        endDate: now,
    };
};

const Dashboard = () => {
    const [timeRange, setTimeRange] = useState('Last 3 Months');
    const [data, setData] = useState(generateMockData(timeRange));
    const [showHeadcountDetails, setShowHeadcountDetails] = useState(false);
    const [showNewHireExitDetails, setShowNewHireExitDetails] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(() => {
        setLoading(true);
        // Simulate API call delay
        setTimeout(() => {
            setData(generateMockData(timeRange));
            setLoading(false);
        }, 500); // Reduced delay to prevent timeout
    }, [timeRange]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const totalHeadcountChange = Object.values(data.headcountChanges).reduce((sum, change) => sum + change, 0);

    return (
        <div className="p-6 bg-background min-h-screen">
            <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard for the CEO</h1>

            <div className="flex justify-end mb-4">
                <Select onValueChange={setTimeRange} value={timeRange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Time Range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Last Month">Last Month</SelectItem>
                        <SelectItem value="Last 3 Months">Last 3 Months</SelectItem>
                        <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
                        <SelectItem value="Year to Date">Year to Date</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="animate-spin text-4xl text-muted-foreground" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-muted-foreground" />
                                    Applicants
                                </CardTitle>
                                <CardDescription>Total Number of Applicants</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-foreground">{data.applicants}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                                    Hire Percentage
                                </CardTitle>
                                <CardDescription>Percentage of Applicants Hired</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-foreground">{data.hirePercentage}%</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-muted-foreground" />
                                    Offer Acceptance Rate
                                </CardTitle>
                                <CardDescription>Percentage of Offers Accepted</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-foreground">{data.offerAcceptanceRate}%</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-muted-foreground" />
                                    Headcount Change (3 Months)
                                </CardTitle>
                                <CardDescription>Total Headcount Increase/Decrease</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <p className={cn("text-2xl font-bold", totalHeadcountChange >= 0 ? "text-green-500" : "text-red-500")}>
                                        {totalHeadcountChange}
                                    </p>
                                    {totalHeadcountChange >= 0 ? (
                                        <ArrowUpRight className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <ArrowDownRight className="w-5 h-5 text-red-500" />
                                    )}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowHeadcountDetails(true)}
                                    className="mt-4"
                                >
                                    Headcount Details
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-muted-foreground" />
                                    New Hires vs. Exits
                                </CardTitle>
                                <CardDescription>Number of New Hires and Employee Exits</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-lg font-semibold text-foreground">New Hires</p>
                                        <p className="text-2xl font-bold text-green-500">{data.newHires}</p>
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-foreground">Exits</p>
                                        <p className="text-2xl font-bold text-red-500">{data.exits}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowNewHireExitDetails(true)}
                                    className="mt-4 w-full"
                                >
                                    New Hire/Exit Details
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-muted-foreground" />
                                    Time to Hire
                                </CardTitle>
                                <CardDescription>Average Time to Fill a Position</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-foreground">{data.timeToHire} days</p>
                            </CardContent>
                        </Card>

                        <Card className="col-span-1 md:col-span-1">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Coins className="w-5 h-5 text-muted-foreground" />
                                    Cost to Hire
                                </CardTitle>
                                <CardDescription>Average Cost to Hire per Role</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-foreground">${data.costToHire}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Headcount Details Modal/Section */}
                    {showHeadcountDetails && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                                <CardHeader>
                                    <CardTitle>Headcount Details</CardTitle>
                                    <CardDescription>
                                        Departmental headcount changes and monthly salary payouts.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Department</TableHead>
                                                <TableHead>Headcount</TableHead>
                                                <TableHead>Change (Last 3 Months)</TableHead>
                                                <TableHead>Monthly Salary Payout</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {Object.keys(data.headcount).map(dept => (
                                                <TableRow key={dept}>
                                                    <TableCell>{dept}</TableCell>
                                                    <TableCell>{data.headcount[dept]}</TableCell>
                                                    <TableCell className={cn(
                                                        "font-medium",
                                                        data.headcountChanges[dept] >= 0 ? "text-green-500" : "text-red-500"
                                                    )}>
                                                        {data.headcountChanges[dept] >= 0 && '+'}
                                                        {data.headcountChanges[dept]}
                                                    </TableCell>
                                                    <TableCell>${data.monthlySalary[dept]}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <div className="mt-4 flex justify-end">
                                        <Button onClick={() => setShowHeadcountDetails(false)}>Close</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* New Hire/Exit Details Modal/Section */}
                    {showNewHireExitDetails && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                                <CardHeader>
                                    <CardTitle>New Hire and Exit Details</CardTitle>
                                    <CardDescription>
                                        Details on new hires and reasons for employee exits.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-2">Reasons for Exit</h3>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Reason</TableHead>
                                                    <TableHead>Percentage</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {data.exitReasons.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{item.reason}</TableCell>
                                                        <TableCell>
                                                            {data.exits > 0 ? ((item.count / data.exits) * 100).toFixed(2) : '0'}%
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <Button onClick={() => setShowNewHireExitDetails(false)}>Close</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Dashboard;
