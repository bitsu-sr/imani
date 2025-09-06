import { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type Loan = { id: string };

export default function Reports() {
	const [loans, setLoans] = useState<Loan[]>([]);
	const [data, setData] = useState<{ date: string; interest: number }[]>([]);

	useEffect(() => {
		(async () => {
			const ls: Loan[] = await fetch('/api/loans').then(r => r.json());
			setLoans(ls);
			let map = new Map<string, number>();
			for (const l of ls) {
				const res = await fetch(`/api/interest?loan_id=${l.id}`).then(r => r.json());
				for (const e of res.timeline as any[]) {
					map.set(e.date, (map.get(e.date) || 0) + Number(e.interestAccrued));
				}
			}
			const arr = Array.from(map.entries()).sort(([a],[b]) => a.localeCompare(b)).map(([date, interest]) => ({ date, interest }));
			setData(arr);
		})();
	}, []);

	return (
		<div>
			<h2>Reports</h2>
			<div style={{ height: 320 }}>
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={data}>
						<CartesianGrid stroke="#eee" strokeDasharray="5 5" />
						<XAxis dataKey="date" />
						<YAxis />
						<Tooltip />
						<Line type="monotone" dataKey="interest" stroke="#8884d8" />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}


