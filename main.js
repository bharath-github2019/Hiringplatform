<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard for the CEO</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6; /* Light gray background */
        }
        /* Custom scrollbar for modals */
        .modal-content::-webkit-scrollbar { width: 6px; }
        .modal-content::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .modal-content::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; }
        .modal-content::-webkit-scrollbar-thumb:hover { background: #555; }
        /* Simple transition for modals */
        .modal { transition: opacity 0.3s ease, visibility 0.3s ease; }
        .modal-hidden { opacity: 0; visibility: hidden; }
        .modal-visible { opacity: 1; visibility: visible; }
        /* Style for clickable metrics */
        .metric-card.clickable { cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .metric-card.clickable:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
        /* Table styling */
        th, td { padding: 10px 15px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background-color: #f9fafb; font-weight: 600; color: #374151; }
        tr:last-child td { border-bottom: none; }
        tr:hover { background-color: #f9fafb; }

        /* Compact Filter Styling */
        .filter-container {
            background-color: #ffffff; border: 1px solid #e5e7eb;
            padding: 0.75rem 1rem; border-radius: 0.5rem;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            display: flex; flex-wrap: wrap; align-items: flex-end; gap: 1rem;
        }
        .filter-item { flex: 1 1 150px; min-width: 130px; }
        .filter-item label { color: #4b5563; font-size: 0.75rem; font-weight: 500; margin-bottom: 0.125rem; display: block; }
        .filter-item select {
            width: 100%; border-color: #d1d5db; border-radius: 0.375rem;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); padding: 0.375rem 0.75rem;
            font-size: 0.875rem; line-height: 1.25rem;
        }
        .filter-item select:focus {
             border-color: #4f46e5; outline: 2px solid transparent; outline-offset: 2px;
             --tw-ring-color: #6366f1;
             --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
             --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
             box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
        }
        .action-button { /* Base style for action buttons */
             font-size: 0.75rem; font-weight: 600;
             box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
             white-space: nowrap; height: fit-content;
             border-radius: 0.375rem; transition: background-color 0.15s ease-in-out;
             display: inline-flex;
             align-items: center;
             justify-content: center;
             line-height: 1.25rem; /* Match select line height */
        }
        #filter-button { /* Specific padding for text button */
             padding: 0.375rem 0.75rem;
        }
        #download-button { /* Specific padding for icon button */
            padding: 0.375rem; /* Equal padding for square-ish look */
            line-height: 1; /* Adjust line height for icon centering */
        }


        /* Responsive adjustments for filters */
        @media (max-width: 900px) {
            .filter-container { flex-direction: column; align-items: stretch; gap: 0.75rem; }
            .filter-item { flex-basis: auto; width: 100%; }
            .button-container { width: 100%; display: flex; gap: 0.5rem; }
            #filter-button { flex-grow: 1; } /* Allow filter button to grow */
            #download-button { flex-grow: 0; } /* Prevent icon button from growing */
        }
         @media (max-width: 768px) {
            .metric-grid { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
        }
         @media (max-width: 640px) {
             .modal-box { width: 95%; max-width: 95%; }
             .metric-grid { grid-template-columns: 1fr; }
         }
    </style>
</head>
<body class="p-4 md:p-8">

    <div class="max-w-7xl mx-auto">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Dashboard for the CEO</h1>

        <div class="filter-container">
            <div class="filter-item">
                <label for="timeframe">Timeframe:</label>
                <select id="timeframe">
                    <option value="last_3_months" selected>Last 3 Months</option>
                    <option value="last_1_month">Last 1 Month</option>
                    <option value="last_6_months">Last 6 Months</option>
                    <option value="ytd">Year to Date</option>
                </select>
            </div>
            <div class="filter-item">
                <label for="location">Location:</label>
                <select id="location">
                    <option value="all" selected>All Locations</option>
                    </select>
            </div>
            <div class="filter-item">
                <label for="department">Department/Role:</label>
                <select id="department">
                    <option value="all" selected>All Departments</option>
                    </select>
            </div>
             <div class="flex gap-2 flex-wrap button-container">
                 <button id="filter-button" class="action-button bg-indigo-600 hover:bg-indigo-700 text-white">Apply Filters</button>
                 <button id="download-button" class="action-button bg-gray-200 hover:bg-gray-300 text-gray-700" title="Download Report (CSV)">}
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> {/* Icon size remains h-4 w-4 */}
                       <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                     </svg>
                 </button>
             </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 my-6 metric-grid">
            <div class="bg-white p-4 rounded-lg shadow-sm metric-card">
                <h2 class="text-sm font-medium text-gray-500 mb-1">Total Applicants</h2>
                <p id="metric-applicants" class="text-2xl md:text-3xl font-semibold text-gray-800">--</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm metric-card">
                <h2 class="text-sm font-medium text-gray-500 mb-1">Hire Percentage</h2>
                <p id="metric-hire-percentage" class="text-2xl md:text-3xl font-semibold text-gray-800">--%</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm metric-card">
                <h2 class="text-sm font-medium text-gray-500 mb-1">Offer Acceptance Rate</h2>
                <p id="metric-acceptance-rate" class="text-2xl md:text-3xl font-semibold text-gray-800">--%</p>
            </div>
            <div id="clickable-headcount" class="bg-white p-4 rounded-lg shadow-sm metric-card clickable">
                <h2 class="text-sm font-medium text-gray-500 mb-1">Headcount Change <span class="text-xs text-indigo-600">(Click)</span></h2>
                <p id="metric-headcount-change" class="text-2xl md:text-3xl font-semibold text-gray-800">--</p>
                <p id="metric-headcount-change-perc" class="text-sm text-gray-600">--%</p>
            </div>
             <div id="clickable-hires-exits" class="bg-white p-4 rounded-lg shadow-sm metric-card clickable">
                <h2 class="text-sm font-medium text-gray-500 mb-1">New Hires / Exits <span class="text-xs text-indigo-600">(Click)</span></h2>
                <div class="flex justify-between items-center">
                    <div>
                        <p id="metric-new-hires" class="text-xl font-semibold text-green-600">--</p>
                        <p class="text-xs text-gray-500">Hires</p>
                    </div>
                     <div>
                        <p id="metric-exits" class="text-xl font-semibold text-red-600">--</p>
                        <p class="text-xs text-gray-500">Exits</p>
                    </div>
                </div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm metric-card">
                <h2 class="text-sm font-medium text-gray-500 mb-1">Avg. Time to Hire (Days)</h2>
                <p id="metric-time-to-hire" class="text-2xl md:text-3xl font-semibold text-gray-800">--</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm metric-card">
                <h2 class="text-sm font-medium text-gray-500 mb-1">Avg. Cost per Hire (INR)</h2>
                <p id="metric-cost-per-hire" class="text-2xl md:text-3xl font-semibold text-gray-800">₹--</p>
            </div>
        </div>

        <div class="bg-white p-4 md:p-6 rounded-lg shadow-sm">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Recruitment Pipeline</h2>
            <div class="flex space-x-4 mb-4 border-b border-gray-200">
                 <button id="open-roles-tab" class="py-2 px-4 text-sm font-medium text-center text-indigo-600 bg-indigo-100 rounded-t-lg active" aria-current="page">Open Roles</button>
                 <button id="closed-roles-tab" class="py-2 px-4 text-sm font-medium text-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-t-lg">Recently Closed Roles</button>
            </div>
            <div id="open-roles-content">
                <p class="text-sm text-gray-600 mb-3">Currently active job requisitions.</p>
                <div id="open-roles-list" class="space-y-3">
                    <p class="text-gray-500 p-3">No open roles found for the selected criteria.</p>
                </div>
            </div>
             <div id="closed-roles-content" class="hidden">
                 <p class="text-sm text-gray-600 mb-3">Roles closed within the selected timeframe.</p>
                <div id="closed-roles-list" class="space-y-3">
                    <p class="text-gray-500 p-3">No recently closed roles found for the selected criteria.</p>
                </div>
            </div>
        </div>
    </div>

    <div id="headcount-modal" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50 modal modal-hidden">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] modal-box">
            <div class="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-800">Headcount Change Details</h3>
                <button id="close-headcount-modal" class="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
            </div>
            <div class="p-4 overflow-y-auto modal-content max-h-[calc(80vh-120px)]">
                 <h4 class="text-md font-semibold text-gray-700 mb-2">Department Growth/Decline</h4>
                 <div class="overflow-x-auto mb-4">
                     <table class="min-w-full bg-white">
                         <thead>
                             <tr>
                                 <th>Department</th>
                                 <th>Start Count</th>
                                 <th>End Count</th>
                                 <th>Net Change</th>
                                 <th>Change (%)</th>
                             </tr>
                         </thead>
                         <tbody id="department-change-table"></tbody>
                     </table>
                 </div>
                 <h4 class="text-md font-semibold text-gray-700 mb-2">Estimated Monthly Salary Payout (INR)</h4>
                  <div class="overflow-x-auto">
                     <table class="min-w-full bg-white">
                         <thead>
                             <tr>
                                 <th>Department</th>
                                 <th>Estimated Monthly Salary</th>
                             </tr>
                         </thead>
                         <tbody id="department-salary-table"></tbody>
                     </table>
                 </div>
            </div>
             <div class="p-4 border-t border-gray-200 text-right">
                <button id="close-headcount-modal-footer" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out">Close</button>
            </div>
        </div>
    </div>
    <div id="hires-exits-modal" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50 modal modal-hidden">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] modal-box">
             <div class="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-800">Hires vs. Exits Details</h3>
                <button id="close-hires-exits-modal" class="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
            </div>
            <div class="p-4 overflow-y-auto modal-content max-h-[calc(80vh-120px)]">
                 <h4 class="text-md font-semibold text-gray-700 mb-3">Exit Reasons Breakdown</h4>
                 <div id="exit-reasons-list" class="space-y-2">
                     <p class="text-gray-500">No exit data available.</p>
                 </div>
            </div>
             <div class="p-4 border-t border-gray-200 text-right">
                <button id="close-hires-exits-modal-footer" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out">Close</button>
            </div>
        </div>
    </div>
    <div id="role-details-modal" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50 modal modal-hidden">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[80vh] modal-box">
             <div class="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 id="role-modal-title" class="text-lg font-semibold text-gray-800">Role Details</h3>
                <button id="close-role-modal" class="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
            </div>
            <div class="p-4 overflow-y-auto modal-content max-h-[calc(80vh-120px)]">
                <div class="space-y-3">
                    <p><span class="font-semibold">Status:</span> <span id="role-modal-status">--</span></p>
                    <p><span class="font-semibold">Time Open:</span> <span id="role-modal-time-open">--</span> days</p>
                    <p><span class="font-semibold">Total Applicants:</span> <span id="role-modal-applicants">--</span></p>
                    <div>
                        <h4 class="text-md font-semibold text-gray-700 mb-2">Candidate Funnel</h4>
                        <ul id="role-modal-funnel" class="list-disc list-inside space-y-1 text-sm text-gray-600"></ul>
                    </div>
                     <div id="role-modal-hired-candidate" class="hidden">
                        <h4 class="text-md font-semibold text-gray-700 mb-1">Hired Candidate(s)</h4>
                        <p id="role-modal-hired-name" class="text-sm text-gray-600"></p>
                    </div>
                </div>
            </div>
             <div class="p-4 border-t border-gray-200 text-right">
                <button id="close-role-modal-footer" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out">Close</button>
            </div>
        </div>
    </div>

    <script>
        // --- DATA SIMULATION ---
        const today = new Date();
        const getDate = (monthsAgo = 0, daysAgo = 0) => { const date = new Date(); date.setMonth(date.getMonth() - monthsAgo); date.setDate(date.getDate() - daysAgo); return date.toISOString().split('T')[0]; };
        const locations = [ { id: 'loc1', name: 'New York HQ' }, { id: 'loc2', name: 'London Office' }, { id: 'loc3', name: 'Bengaluru Dev Center' }, ];
        const departments = [ { id: 'dept1', name: 'Engineering', startingHeadcount: 50, avgSalary: 7500000 }, { id: 'dept2', name: 'Sales', startingHeadcount: 30, avgSalary: 6000000 }, { id: 'dept3', name: 'Marketing', startingHeadcount: 20, avgSalary: 5500000 }, { id: 'dept4', name: 'HR', startingHeadcount: 10, avgSalary: 5000000 }, ];
        const roles = [ { id: 'role1', title: 'Senior Software Engineer', departmentId: 'dept1', locationId: 'loc1', status: 'open', dateOpened: getDate(1, 10), dateClosed: null, applicants: 75, screened: 30, interviewed: 15, offered: 3, joined: 0 }, { id: 'role2', title: 'Sales Development Representative', departmentId: 'dept2', locationId: 'loc2', status: 'open', dateOpened: getDate(0, 20), dateClosed: null, applicants: 120, screened: 50, interviewed: 20, offered: 5, joined: 0 }, { id: 'role3', title: 'Product Marketing Manager', departmentId: 'dept3', locationId: 'loc1', status: 'open', dateOpened: getDate(2, 0), dateClosed: null, applicants: 40, screened: 15, interviewed: 8, offered: 2, joined: 0 }, { id: 'role4', title: 'Frontend Developer', departmentId: 'dept1', locationId: 'loc3', status: 'open', dateOpened: getDate(0, 5), dateClosed: null, applicants: 90, screened: 40, interviewed: 18, offered: 4, joined: 0 }, { id: 'role5', title: 'HR Business Partner', departmentId: 'dept4', locationId: 'loc1', status: 'closed', dateOpened: getDate(4, 0), dateClosed: getDate(2, 5), applicants: 35, screened: 12, interviewed: 5, offered: 1, joined: 1 }, { id: 'role6', title: 'Backend Engineer', departmentId: 'dept1', locationId: 'loc3', status: 'closed', dateOpened: getDate(5, 10), dateClosed: getDate(3, 15), applicants: 110, screened: 45, interviewed: 22, offered: 3, joined: 3 }, { id: 'role7', title: 'Account Executive', departmentId: 'dept2', locationId: 'loc2', status: 'closed', dateOpened: getDate(3, 5), dateClosed: getDate(1, 2), applicants: 80, screened: 30, interviewed: 12, offered: 2, joined: 2 }, ];
        const hires = [ { id: 'h1', candidateName: 'Priya Sharma', roleId: 'role5', departmentId: 'dept4', locationId: 'loc1', hireDate: getDate(2, 5), offerAcceptedDate: getDate(2, 6), salary: 5200000 }, { id: 'h2', candidateName: 'Arjun Kumar', roleId: 'role6', departmentId: 'dept1', locationId: 'loc3', hireDate: getDate(3, 15), offerAcceptedDate: getDate(3, 16), salary: 8000000 }, { id: 'h3', candidateName: 'Sneha Reddy', roleId: 'role6', departmentId: 'dept1', locationId: 'loc3', hireDate: getDate(3, 15), offerAcceptedDate: getDate(3, 17), salary: 7800000 }, { id: 'h4', candidateName: 'Vikram Singh', roleId: 'role6', departmentId: 'dept1', locationId: 'loc3', hireDate: getDate(3, 15), offerAcceptedDate: getDate(3, 18), salary: 7900000 }, { id: 'h5', candidateName: 'Ananya Gupta', roleId: 'role7', departmentId: 'dept2', locationId: 'loc2', hireDate: getDate(1, 2), offerAcceptedDate: getDate(1, 3), salary: 6500000 }, { id: 'h6', candidateName: 'Rohan Mehta', roleId: 'role7', departmentId: 'dept2', locationId: 'loc2', hireDate: getDate(1, 2), offerAcceptedDate: getDate(1, 4), salary: 6300000 }, { id: 'h7', candidateName: 'Diya Chatterjee', roleId: 'role_generic_eng', departmentId: 'dept1', locationId: 'loc1', hireDate: getDate(0, 15), offerAcceptedDate: getDate(0, 16), salary: 8500000 }, { id: 'h8', candidateName: 'Aditya Joshi', roleId: 'role_generic_sales', departmentId: 'dept2', locationId: 'loc2', hireDate: getDate(0, 25), offerAcceptedDate: getDate(0, 26), salary: 6100000 }, ];
        const exits = [ { id: 'e1', departmentId: 'dept1', locationId: 'loc1', exitDate: getDate(1, 5), reason: 'Better Opportunity' }, { id: 'e2', departmentId: 'dept2', locationId: 'loc2', exitDate: getDate(2, 10), reason: 'Compensation' }, { id: 'e3', departmentId: 'dept3', locationId: 'loc1', exitDate: getDate(0, 20), reason: 'Relocation' }, { id: 'e4', departmentId: 'dept1', locationId: 'loc3', exitDate: getDate(4, 1), reason: 'Better Opportunity' }, { id: 'e5', departmentId: 'dept1', locationId: 'loc1', exitDate: getDate(5, 15), reason: 'Management' }, { id: 'e6', departmentId: 'dept2', locationId: 'loc2', exitDate: getDate(0, 5), reason: 'Compensation' }, ];
        const applicants = [ ...Array.from({ length: 75 }, (_, i) => ({ id: `app1_${i}`, roleId: 'role1', locationId: 'loc1', applyDate: getDate(Math.random() * 1.3, Math.random() * 30) })), ...Array.from({ length: 120 }, (_, i) => ({ id: `app2_${i}`, roleId: 'role2', locationId: 'loc2', applyDate: getDate(Math.random() * 0.6, Math.random() * 30) })), ...Array.from({ length: 40 }, (_, i) => ({ id: `app3_${i}`, roleId: 'role3', locationId: 'loc1', applyDate: getDate(Math.random() * 2, Math.random() * 30) })), ...Array.from({ length: 90 }, (_, i) => ({ id: `app4_${i}`, roleId: 'role4', locationId: 'loc3', applyDate: getDate(Math.random() * 0.15, Math.random() * 30) })), ...Array.from({ length: 35 }, (_, i) => ({ id: `app5_${i}`, roleId: 'role5', locationId: 'loc1', applyDate: getDate(Math.random() * 4, Math.random() * 30) })), ...Array.from({ length: 110 }, (_, i) => ({ id: `app6_${i}`, roleId: 'role6', locationId: 'loc3', applyDate: getDate(Math.random() * 5, Math.random() * 30) })), ...Array.from({ length: 80 }, (_, i) => ({ id: `app7_${i}`, roleId: 'role7', locationId: 'loc2', applyDate: getDate(Math.random() * 3, Math.random() * 30) })), ...Array.from({ length: 50 }, (_, i) => ({ id: `app8_${i}`, roleId: 'role_generic_eng', locationId: 'loc1', applyDate: getDate(Math.random() * 0.5, Math.random() * 30) })), ...Array.from({ length: 60 }, (_, i) => ({ id: `app9_${i}`, roleId: 'role_generic_sales', locationId: 'loc2', applyDate: getDate(Math.random() * 0.8, Math.random() * 30) })), ];

        // --- Global variable to store current filtered roles for download ---
        let currentFilteredRoles = [];
        let currentMetrics = {};

        // --- DOM Elements ---
        const timeframeSelect = document.getElementById('timeframe');
        const locationSelect = document.getElementById('location');
        const departmentSelect = document.getElementById('department');
        const filterButton = document.getElementById('filter-button');
        const downloadButton = document.getElementById('download-button');
        const metricApplicants = document.getElementById('metric-applicants');
        const metricHirePercentage = document.getElementById('metric-hire-percentage');
        const metricAcceptanceRate = document.getElementById('metric-acceptance-rate');
        const metricHeadcountChange = document.getElementById('metric-headcount-change');
        const metricHeadcountChangePerc = document.getElementById('metric-headcount-change-perc');
        const metricNewHires = document.getElementById('metric-new-hires');
        const metricExits = document.getElementById('metric-exits');
        const metricTimeToHire = document.getElementById('metric-time-to-hire');
        const metricCostPerHire = document.getElementById('metric-cost-per-hire');
        const clickableHeadcount = document.getElementById('clickable-headcount');
        const clickableHiresExits = document.getElementById('clickable-hires-exits');
        const openRolesTab = document.getElementById('open-roles-tab');
        const closedRolesTab = document.getElementById('closed-roles-tab');
        const openRolesContent = document.getElementById('open-roles-content');
        const closedRolesContent = document.getElementById('closed-roles-content');
        const openRolesList = document.getElementById('open-roles-list');
        const closedRolesList = document.getElementById('closed-roles-list');
        const headcountModal = document.getElementById('headcount-modal');
        const hiresExitsModal = document.getElementById('hires-exits-modal');
        const roleDetailsModal = document.getElementById('role-details-modal');
        const closeHeadcountModal = document.getElementById('close-headcount-modal');
        const closeHeadcountModalFooter = document.getElementById('close-headcount-modal-footer');
        const closeHiresExitsModal = document.getElementById('close-hires-exits-modal');
        const closeHiresExitsModalFooter = document.getElementById('close-hires-exits-modal-footer');
        const closeRoleModal = document.getElementById('close-role-modal');
        const closeRoleModalFooter = document.getElementById('close-role-modal-footer');
        const departmentChangeTable = document.getElementById('department-change-table');
        const departmentSalaryTable = document.getElementById('department-salary-table');
        const exitReasonsList = document.getElementById('exit-reasons-list');
        const roleModalTitle = document.getElementById('role-modal-title');
        const roleModalStatus = document.getElementById('role-modal-status');
        const roleModalTimeOpen = document.getElementById('role-modal-time-open');
        const roleModalApplicants = document.getElementById('role-modal-applicants');
        const roleModalFunnel = document.getElementById('role-modal-funnel');
        const roleModalHiredCandidateDiv = document.getElementById('role-modal-hired-candidate');
        const roleModalHiredName = document.getElementById('role-modal-hired-name');

        // --- Helper Functions ---
        const getStartDate = (timeframe) => { const start = new Date(); switch (timeframe) { case 'last_1_month': start.setMonth(start.getMonth() - 1); break; case 'last_3_months': start.setMonth(start.getMonth() - 3); break; case 'last_6_months': start.setMonth(start.getMonth() - 6); break; case 'ytd': start.setMonth(0); start.setDate(1); break; default: start.setMonth(start.getMonth() - 3); } start.setHours(0, 0, 0, 0); return start; };
        const filterData = (startDate, selectedLocation, selectedDepartment) => { const endDate = new Date(); const filteredApplicants = applicants.filter(app => { const applyDate = new Date(app.applyDate); const locationMatch = selectedLocation === 'all' || app.locationId === selectedLocation; const role = roles.find(r => r.id === app.roleId); const departmentMatch = selectedDepartment === 'all' || (role && role.departmentId === selectedDepartment); return applyDate >= startDate && applyDate <= endDate && locationMatch && departmentMatch; }); const filteredHires = hires.filter(hire => { const hireDate = new Date(hire.hireDate); const locationMatch = selectedLocation === 'all' || hire.locationId === selectedLocation; const departmentMatch = selectedDepartment === 'all' || hire.departmentId === selectedDepartment; return hireDate >= startDate && hireDate <= endDate && locationMatch && departmentMatch; }); const filteredExits = exits.filter(exit => { const exitDate = new Date(exit.exitDate); const locationMatch = selectedLocation === 'all' || exit.locationId === selectedLocation; const departmentMatch = selectedDepartment === 'all' || exit.departmentId === selectedDepartment; return exitDate >= startDate && exitDate <= endDate && locationMatch && departmentMatch; }); const filteredRoles = roles.filter(role => { const locationMatch = selectedLocation === 'all' || role.locationId === selectedLocation; const departmentMatch = selectedDepartment === 'all' || role.departmentId === selectedDepartment; const dateOpened = new Date(role.dateOpened); const dateClosed = role.dateClosed ? new Date(role.dateClosed) : null; const openedWithin = dateOpened >= startDate && dateOpened <= endDate; const closedWithin = dateClosed && dateClosed >= startDate && dateClosed <= endDate; const activeDuring = role.status === 'open' && dateOpened <= endDate; return locationMatch && departmentMatch && (openedWithin || closedWithin || activeDuring); }); return { filteredApplicants, filteredHires, filteredExits, filteredRoles, allHires: hires }; };
        const formatCurrency = (amount) => { if (amount === '--' || typeof amount !== 'number') return '₹--'; return '₹' + amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","); };
        const calculateDaysBetween = (dateStr1, dateStr2) => { if (!dateStr1 || !dateStr2) return 0; const date1 = new Date(dateStr1); const date2 = new Date(dateStr2); const diffTime = Math.abs(date2 - date1); return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); };

        // --- Update UI Functions ---
        const populateFilters = () => { locationSelect.innerHTML = '<option value="all" selected>All Locations</option>'; locations.forEach(loc => { const option = document.createElement('option'); option.value = loc.id; option.textContent = loc.name; locationSelect.appendChild(option); }); departmentSelect.innerHTML = '<option value="all" selected>All Departments</option>'; departments.forEach(dept => { const option = document.createElement('option'); option.value = dept.id; option.textContent = dept.name; departmentSelect.appendChild(option); }); };
        const updateDashboard = () => { const selectedTimeframe = timeframeSelect.value; const selectedLocation = locationSelect.value; const selectedDepartment = departmentSelect.value; const startDate = getStartDate(selectedTimeframe); const { filteredApplicants, filteredHires, filteredExits, filteredRoles, allHires } = filterData(startDate, selectedLocation, selectedDepartment); currentFilteredRoles = filteredRoles; const numApplicants = filteredApplicants.length; const numHires = filteredHires.length; const numExits = filteredExits.length; const hirePercentage = numApplicants > 0 ? ((numHires / numApplicants) * 100).toFixed(1) : 0; const acceptanceRate = numHires > 0 ? 100 : 0; let totalStartHeadcount = 0; let currentHeadcount = 0; const departmentDetails = {}; departments.forEach(dept => { const deptHires = selectedDepartment === 'all' || selectedDepartment === dept.id ? filteredHires.filter(h => h.departmentId === dept.id) : []; const deptExits = selectedDepartment === 'all' || selectedDepartment === dept.id ? filteredExits.filter(e => e.departmentId === dept.id) : []; if (selectedDepartment === 'all' || selectedDepartment === dept.id) { const startCount = dept.startingHeadcount; const hiresInDept = deptHires.length; const exitsInDept = deptExits.length; const endCount = startCount + hiresInDept - exitsInDept; departmentDetails[dept.id] = { name: dept.name, start: startCount, hires: hiresInDept, exits: exitsInDept, current: endCount, salary: endCount * (dept.avgSalary / 12) }; totalStartHeadcount += startCount; currentHeadcount += endCount; } }); const netHeadcountChange = currentHeadcount - totalStartHeadcount; const headcountChangePerc = totalStartHeadcount > 0 ? ((netHeadcountChange / totalStartHeadcount) * 100).toFixed(1) : 0; let totalTimeToHire = 0; let hiresWithDates = 0; filteredHires.forEach(hire => { const role = roles.find(r => r.id === hire.roleId); if (role && role.dateOpened && hire.offerAcceptedDate) { totalTimeToHire += calculateDaysBetween(role.dateOpened, hire.offerAcceptedDate); hiresWithDates++; } }); const avgTimeToHire = hiresWithDates > 0 ? (totalTimeToHire / hiresWithDates).toFixed(0) : '--'; const avgCostPerHire = numHires > 0 ? (400000 + Math.random() * 150000) : '--'; currentMetrics = { "Total Applicants": numApplicants, "Hire Percentage (%)": hirePercentage, "Offer Acceptance Rate (%)": acceptanceRate.toFixed(0), "Headcount Change (Net)": netHeadcountChange, "Headcount Change (%)": headcountChangePerc, "New Hires": numHires, "Exits": numExits, "Avg Time to Hire (Days)": avgTimeToHire, "Avg Cost per Hire (INR)": avgCostPerHire === '--' ? '--' : avgCostPerHire.toFixed(0) }; metricApplicants.textContent = currentMetrics["Total Applicants"]; metricHirePercentage.textContent = `${currentMetrics["Hire Percentage (%)"]}%`; metricAcceptanceRate.textContent = `${currentMetrics["Offer Acceptance Rate (%)"]}%`; metricHeadcountChange.textContent = `${currentMetrics["Headcount Change (Net)"] >= 0 ? '+' : ''}${currentMetrics["Headcount Change (Net)"]}`; metricHeadcountChangePerc.textContent = `(${currentMetrics["Headcount Change (%)"]}% )`; metricHeadcountChange.className = `text-2xl md:text-3xl font-semibold ${currentMetrics["Headcount Change (Net)"] >= 0 ? 'text-green-600' : 'text-red-600'}`; metricNewHires.textContent = currentMetrics["New Hires"]; metricExits.textContent = currentMetrics["Exits"]; metricTimeToHire.textContent = currentMetrics["Avg Time to Hire (Days)"]; metricCostPerHire.textContent = formatCurrency(currentMetrics["Avg Cost per Hire (INR)"]); updateRoleLists(filteredRoles, allHires); clickableHeadcount.dataset.details = JSON.stringify(departmentDetails); clickableHiresExits.dataset.exits = JSON.stringify(filteredExits); };
        const updateRoleLists = (filteredRoles, allHires) => { openRolesList.innerHTML = ''; closedRolesList.innerHTML = ''; const openRoles = filteredRoles.filter(r => r.status === 'open'); const closedRoles = filteredRoles.filter(r => r.status === 'closed'); if (openRoles.length === 0) { openRolesList.innerHTML = '<p class="text-gray-500 p-3">No open roles found.</p>'; } else { openRoles.forEach(role => openRolesList.appendChild(createRoleCard(role, null))); } if (closedRoles.length === 0) { closedRolesList.innerHTML = '<p class="text-gray-500 p-3">No closed roles found.</p>'; } else { closedRoles.forEach(role => closedRolesList.appendChild(createRoleCard(role, allHires))); } document.querySelectorAll('.role-card').forEach(card => { card.addEventListener('click', () => showRoleDetailsModal(card.dataset.roleId)); }); };
        const createRoleCard = (role, allHires) => { const div = document.createElement('div'); div.className = 'p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer role-card'; div.dataset.roleId = role.id; const roleDept = departments.find(d => d.id === role.departmentId)?.name || 'N/A'; const roleLoc = locations.find(l => l.id === role.locationId)?.name || 'N/A'; const timeOpen = calculateDaysBetween(role.dateOpened, role.dateClosed || new Date().toISOString().split('T')[0]); let hiredCandidatesHtml = ''; if (role.status === 'closed' && allHires) { const candidates = allHires.filter(hire => hire.roleId === role.id).map(hire => hire.candidateName).join(', '); if (candidates) { hiredCandidatesHtml = `<p class="text-xs text-green-700 mt-1">Hired: <span class="font-medium">${candidates}</span></p>`; } } div.innerHTML = ` <div class="flex justify-between items-start gap-2"> <h4 class="font-semibold text-indigo-700 flex-1">${role.title}</h4> <span class="text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap ${role.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">${role.status === 'open' ? 'Open' : 'Closed'}</span> </div> <p class="text-sm text-gray-600 mt-0.5">${roleDept} - ${roleLoc}</p> <div class="text-xs text-gray-500 mt-1.5 flex flex-wrap gap-x-2 gap-y-1"> <span>Opened: ${role.dateOpened}</span> ${role.status === 'closed' ? `<span>| Closed: ${role.dateClosed}</span>` : ''} <span>| Applicants: ${role.applicants}</span> <span>| <span class="font-medium">${timeOpen} days ${role.status === 'open' ? 'open' : 'to fill'}</span></span> </div> ${hiredCandidatesHtml} `; return div; };

        // --- Modal Functions ---
        const showModal = (modalElement) => { modalElement.classList.remove('modal-hidden'); modalElement.classList.add('modal-visible'); };
        const hideModal = (modalElement) => { modalElement.classList.add('modal-hidden'); modalElement.classList.remove('modal-visible'); };
        const showHeadcountModal = () => { const details = JSON.parse(clickableHeadcount.dataset.details || '{}'); departmentChangeTable.innerHTML = ''; departmentSalaryTable.innerHTML = ''; if (Object.keys(details).length === 0) { departmentChangeTable.innerHTML = '<tr><td colspan="5" class="text-center text-gray-500 py-4">No data.</td></tr>'; departmentSalaryTable.innerHTML = '<tr><td colspan="2" class="text-center text-gray-500 py-4">No data.</td></tr>'; } else { Object.values(details).forEach(dept => { const netChange = dept.current - dept.start; const changePerc = dept.start > 0 ? ((netChange / dept.start) * 100).toFixed(1) : 0; const changeClass = netChange > 0 ? 'text-green-600' : (netChange < 0 ? 'text-red-600' : 'text-gray-600'); const changeRow = document.createElement('tr'); changeRow.innerHTML = `<td class="font-medium text-gray-800">${dept.name}</td><td>${dept.start}</td><td>${dept.current}</td><td class="${changeClass} font-medium">${netChange >= 0 ? '+' : ''}${netChange}</td><td class="${changeClass}">${changePerc}%</td>`; departmentChangeTable.appendChild(changeRow); const salaryRow = document.createElement('tr'); salaryRow.innerHTML = `<td class="font-medium text-gray-800">${dept.name}</td><td>${formatCurrency(dept.salary)}</td>`; departmentSalaryTable.appendChild(salaryRow); }); } showModal(headcountModal); };
        const showHiresExitsModal = () => { const exitData = JSON.parse(clickableHiresExits.dataset.exits || '[]'); exitReasonsList.innerHTML = ''; if (exitData.length === 0) { exitReasonsList.innerHTML = '<p class="text-gray-500">No exit data available.</p>'; showModal(hiresExitsModal); return; } const reasonCounts = exitData.reduce((acc, exit) => { acc[exit.reason] = (acc[exit.reason] || 0) + 1; return acc; }, {}); const totalExits = exitData.length; Object.entries(reasonCounts).sort(([, countA], [, countB]) => countB - countA).forEach(([reason, count]) => { const percentage = ((count / totalExits) * 100).toFixed(1); const reasonDiv = document.createElement('div'); reasonDiv.className = 'flex justify-between items-center text-sm'; reasonDiv.innerHTML = `<span class="text-gray-700">${reason}</span><span class="font-medium text-gray-900">${count} (${percentage}%)</span>`; const progressBarContainer = document.createElement('div'); progressBarContainer.className = 'w-full bg-gray-200 rounded-full h-1.5 mt-1 mb-2'; progressBarContainer.innerHTML = `<div class="bg-indigo-500 h-1.5 rounded-full" style="width: ${percentage}%"></div>`; exitReasonsList.appendChild(reasonDiv); exitReasonsList.appendChild(progressBarContainer); }); showModal(hiresExitsModal); };
        const showRoleDetailsModal = (roleId) => { const role = roles.find(r => r.id === roleId); if (!role) return; const timeOpen = calculateDaysBetween(role.dateOpened, role.dateClosed || new Date().toISOString().split('T')[0]); roleModalTitle.textContent = `Role Details: ${role.title}`; roleModalStatus.textContent = role.status === 'open' ? 'Open' : 'Closed'; roleModalStatus.className = `font-medium ${role.status === 'open' ? 'text-green-600' : 'text-gray-700'}`; roleModalTimeOpen.textContent = `${timeOpen} days`; roleModalApplicants.textContent = role.applicants; roleModalFunnel.innerHTML = `<li>Applied: ${role.applicants}</li><li>Screening Passed: ${role.screened}</li><li>Interviewed: ${role.interviewed}</li><li>Offers Extended: ${role.offered}</li><li>Joined: ${role.joined}</li>`; if (role.status === 'closed') { const candidates = hires.filter(hire => hire.roleId === role.id).map(hire => hire.candidateName).join(', '); if (candidates) { roleModalHiredName.textContent = candidates; roleModalHiredCandidateDiv.classList.remove('hidden'); } else { roleModalHiredCandidateDiv.classList.add('hidden'); } } else { roleModalHiredCandidateDiv.classList.add('hidden'); } showModal(roleDetailsModal); };

        // --- Download Report Function ---
        const downloadReport = () => { let csvContent = "Metric,Value\n"; for (const [key, value] of Object.entries(currentMetrics)) { const formattedValue = typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value; csvContent += `"${key}",${formattedValue}\n`; } csvContent += "\n"; const includeOpenRoles = openRolesTab.classList.contains('active'); const rolesToInclude = includeOpenRoles ? currentFilteredRoles.filter(r => r.status === 'open') : currentFilteredRoles.filter(r => r.status === 'closed'); const roleSectionTitle = includeOpenRoles ? "Open Roles" : "Closed Roles"; if (rolesToInclude.length > 0) { csvContent += `${roleSectionTitle}\n`; const roleHeaders = ["Title", "Department", "Location", "Status", "Date Opened", "Date Closed", "Applicants", "Screened", "Interviewed", "Offered", "Joined", "Time Open (Days)", "Hired Candidate(s)"]; csvContent += roleHeaders.map(h => `"${h}"`).join(",") + "\n"; rolesToInclude.forEach(role => { const roleDept = departments.find(d => d.id === role.departmentId)?.name || 'N/A'; const roleLoc = locations.find(l => l.id === role.locationId)?.name || 'N/A'; const timeOpen = calculateDaysBetween(role.dateOpened, role.dateClosed || new Date().toISOString().split('T')[0]); let hiredCandidates = ""; if (role.status === 'closed') { hiredCandidates = hires.filter(hire => hire.roleId === role.id).map(hire => hire.candidateName).join('; '); } const rowData = [ role.title, roleDept, roleLoc, role.status, role.dateOpened, role.dateClosed || 'N/A', role.applicants, role.screened, role.interviewed, role.offered, role.joined, timeOpen, hiredCandidates ]; csvContent += rowData.map(cell => { const cellStr = String(cell); return `"${cellStr.replace(/"/g, '""')}"`; }).join(",") + "\n"; }); } else { csvContent += `${roleSectionTitle}\nNo roles found for current filters.\n`; } const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); const link = document.createElement("a"); if (link.download !== undefined) { const url = URL.createObjectURL(blob); link.setAttribute("href", url); link.setAttribute("download", "hr_dashboard_report.csv"); link.style.visibility = 'hidden'; document.body.appendChild(link); link.click(); document.body.removeChild(link); } else { alert("CSV download not supported by your browser."); } };

        // --- Event Listeners ---
        filterButton.addEventListener('click', updateDashboard);
        downloadButton.addEventListener('click', downloadReport);
        clickableHeadcount.addEventListener('click', showHeadcountModal);
        clickableHiresExits.addEventListener('click', showHiresExitsModal);
        closeHeadcountModal.addEventListener('click', () => hideModal(headcountModal));
        closeHeadcountModalFooter.addEventListener('click', () => hideModal(headcountModal));
        closeHiresExitsModal.addEventListener('click', () => hideModal(hiresExitsModal));
        closeHiresExitsModalFooter.addEventListener('click', () => hideModal(hiresExitsModal));
        closeRoleModal.addEventListener('click', () => hideModal(roleDetailsModal));
        closeRoleModalFooter.addEventListener('click', () => hideModal(roleDetailsModal));
        [headcountModal, hiresExitsModal, roleDetailsModal].forEach(modal => { modal.addEventListener('click', (event) => { if (event.target === modal) { hideModal(modal); } }); });
        openRolesTab.addEventListener('click', () => { openRolesTab.classList.add('text-indigo-600', 'bg-indigo-100', 'active'); openRolesTab.classList.remove('text-gray-500', 'hover:text-gray-700', 'hover:bg-gray-100'); closedRolesTab.classList.add('text-gray-500', 'hover:text-gray-700', 'hover:bg-gray-100'); closedRolesTab.classList.remove('text-indigo-600', 'bg-indigo-100', 'active'); openRolesContent.classList.remove('hidden'); closedRolesContent.classList.add('hidden'); });
        closedRolesTab.addEventListener('click', () => { closedRolesTab.classList.add('text-indigo-600', 'bg-indigo-100', 'active'); closedRolesTab.classList.remove('text-gray-500', 'hover:text-gray-700', 'hover:bg-gray-100'); openRolesTab.classList.add('text-gray-500', 'hover:text-gray-700', 'hover:bg-gray-100'); openRolesTab.classList.remove('text-indigo-600', 'bg-indigo-100', 'active'); closedRolesContent.classList.remove('hidden'); openRolesContent.classList.add('hidden'); });

        // --- Initial Load ---
        populateFilters();
        updateDashboard();

    </script>

</body>
</html>
