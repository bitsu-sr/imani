import { Link, NavLink } from 'react-router-dom';
import { HandCoins, Users, Wallet, ReceiptText, BarChart3, Settings } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
	return (
		<nav className="navbar">
			<div className="nav-left">
				<Link to="/" className="brand">
					<HandCoins size={20} />
					<span>Imani Loans</span>
				</Link>
			</div>
			<ul className="nav-links">
				<li><NavLink to="/" end>Dashboard</NavLink></li>
				<li><NavLink to="/borrowers"><Users size={16}/> Borrowers</NavLink></li>
				<li><NavLink to="/loans"><Wallet size={16}/> Loans</NavLink></li>
				<li><NavLink to="/transactions"><ReceiptText size={16}/> Transactions</NavLink></li>
				<li><NavLink to="/reports"><BarChart3 size={16}/> Reports</NavLink></li>
				<li><NavLink to="/settings"><Settings size={16}/> Settings</NavLink></li>
			</ul>
		</nav>
	);
}


