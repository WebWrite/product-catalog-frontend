import { Button, Tag } from "antd";
import { 
  MdOutlineInventory, 
  MdOutlinePendingActions, 
  MdAttachMoney, 
  MdWarningAmber,
} from "react-icons/md";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from "../components/statCard";
import PriorityQueueTable from "../components/priorityQueueTable";
import InventoryDonut from "../components/inventoryDonut";

const chartData = [
  { name: 'Oct 10', uv: 4000 },
  { name: 'Oct 16', uv: 3000 },
  { name: 'Oct 22', uv: 2000 },
  { name: 'Oct 28', uv: 2780 },
  { name: 'Nov 04', uv: 1890 },
  { name: 'Nov 09', uv: 2390 },
  { name: 'Nov 12', uv: 3490 },
];

function SellerDashboard() {
  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full min-w-0 max-w-[1600px] mx-auto">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
        <div className="w-full md:w-auto min-w-0">
          <h1 className="text-[20px] sm:text-[22px] md:text-[24px] lg:text-[28px] xl:text-[32px] font-bold text-slate-100 m-0 tracking-tight">
            Welcome back, Seller
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed font-medium">
            Studio Kanso Kiln + Autumn Reduction Firing cycle is complete. All 24 escrow tranches are locked and 7 priority dispatches await verification.
          </p>
        </div>
        <div className="flex gap-2 md:gap-3 w-full md:w-auto shrink-0">
           <Button className="border-slate-700 text-slate-300 font-semibold h-10 px-3 md:px-5 rounded-xl shadow-sm bg-slate-800 hover:bg-slate-700 flex-1 md:flex-none text-xs md:text-sm">
             Monthly Ledger
           </Button>
           <Button type="primary" className="bg-indigo-600 hover:bg-indigo-700 h-10 px-3 md:px-5 rounded-xl font-semibold shadow-sm flex-1 md:flex-none text-xs md:text-sm">
             + Add Product
           </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 md:gap-4 w-full min-w-0">
        <StatCard 
           title="Total Cataloged" value="42" subtext="Wares" 
           icon={<MdOutlineInventory size={20}/>}
           tag={<div className="flex gap-1 md:gap-2 items-center flex-wrap"><Tag className="border-0 bg-blue-900/30 text-blue-400 text-[10px] md:text-[11px] font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-md m-0">+3 this month</Tag> <Tag className="border-0 bg-slate-800 text-slate-400 text-[10px] md:text-[11px] font-semibold px-2 py-0.5 md:px-2.5 md:py-1 rounded-md m-0">100% Verified</Tag></div>}
        />
        <StatCard 
           title="Escrow Orders" value="24" subtext="Active" 
           icon={<MdOutlinePendingActions size={20}/>}
           tag={<div className="flex gap-2 md:gap-3 items-center flex-wrap"><span className="font-bold text-xs md:text-sm text-slate-300">$4,820.00</span> <Tag color="red" className="border-0 bg-red-900/30 text-red-400 text-[10px] md:text-[11px] font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-md m-0 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> 7 due &lt; 24h</Tag></div>}
        />
        <StatCard 
           title="Settled Sales (30D)" value="$28,450" subtext=".00" 
           icon={<MdAttachMoney size={20}/>}
           tag={<div className="flex gap-2"><Tag className="border-0 bg-purple-900/30 text-purple-400 text-[10px] md:text-[11px] font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-md m-0">+ 14.2% MoM</Tag></div>}
        />
        <StatCard 
           title="Low Stock Critical" value="3" subtext="Items" isAlert={true}
           icon={<MdWarningAmber size={20}/>}
           tag={<div className="flex justify-between w-full items-center mt-1 flex-wrap gap-1"><span className="text-[10px] md:text-[11px] text-slate-400 font-semibold">1 Sold Out (18 Waitlist)</span> <span className="text-[10px] md:text-[11px] font-bold text-indigo-400 cursor-pointer hover:underline flex items-center gap-1">Triage & Restock →</span></div>}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-5 w-full min-w-0">
         <div className="p-3 md:p-4 lg:p-6 rounded-2xl border border-slate-800 flex-[2] shadow-sm min-w-0" style={{ background: '#1E293B' }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
               <div className="min-w-0">
                  <h3 className="text-base md:text-lg font-bold m-0 text-slate-100 tracking-tight">Sales Velocity & Escrow Volume</h3>
                  <p className="text-[11px] md:text-xs text-slate-400 m-0 mt-1 font-medium">Daily gross artisan sales paired with batch kiln release spikes</p>
               </div>
               <div className="flex gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 shrink-0">
                  <Button size="small" type="text" className="bg-slate-700 shadow-sm text-[11px] md:text-xs font-bold text-slate-200 rounded-lg border border-slate-600 px-2 md:px-3">Last 30D</Button>
                  <Button size="small" type="text" className="text-[11px] md:text-xs font-semibold text-slate-500 hover:text-slate-300 px-2 md:px-3">Last 90D</Button>
               </div>
            </div>
            
            <div className="flex flex-wrap gap-3 md:gap-6 mb-4 md:mb-8 bg-slate-800 p-3 md:p-4 lg:p-5 rounded-xl border border-slate-700">
               <div className="min-w-0">
                  <p className="text-[10px] md:text-[11px] text-slate-500 uppercase m-0 font-bold tracking-wider">Peak Day</p>
                  <p className="text-xs md:text-sm lg:text-[15px] font-bold m-0 text-slate-200 mt-1">$1,850.00 <span className="text-[10px] md:text-xs font-semibold text-slate-500 ml-1">(Kiln #18)</span></p>
               </div>
               <div className="min-w-0">
                  <p className="text-[10px] md:text-[11px] text-slate-500 uppercase m-0 font-bold tracking-wider">Avg Order Value</p>
                  <p className="text-xs md:text-sm lg:text-[15px] font-bold m-0 text-slate-200 mt-1">$198.40</p>
               </div>
               <div className="min-w-0">
                  <p className="text-[10px] md:text-[11px] text-slate-500 uppercase m-0 font-bold tracking-wider">Repeat Collectors</p>
                  <p className="text-xs md:text-sm lg:text-[15px] font-bold m-0 text-slate-200 mt-1">41.8%</p>
               </div>
            </div>

            <div style={{ width: '100%', height: 220 }}>
               <ResponsiveContainer>
                  <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                     <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#818CF8" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94A3B8', fontWeight: 600}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94A3B8', fontWeight: 600}} />
                     <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', background: '#1E293B', color: '#F1F5F9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)' }} />
                     <Area type="monotone" dataKey="uv" stroke="#818CF8" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
         
         <InventoryDonut />
      </div>

      <PriorityQueueTable />

    </div>
  );
}

export default SellerDashboard;