import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiPlusCircle, FiList, FiEye, FiRadio, FiFileText } from 'react-icons/fi';

const Sidebar = () => {
	const linkClasses =
		'flex items-center px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors duration-200';
	const activeLinkClasses = 'bg-gray-700';

	return (
		<div className='w-64 h-screen bg-gray-800 text-white flex flex-col p-4'>
			<div className='text-2xl font-bold mb-10'>Telegram SaaS</div>
			<nav className='flex flex-col space-y-2'>
				<NavLink
					to='/'
					className={({ isActive }) =>
						`${linkClasses} ${isActive ? activeLinkClasses : ''}`
					}
					end
				>
					<FiHome className="mr-3" />
					<span>Dashboard</span>
				</NavLink>
				<NavLink
					to='/automations'
					className={({ isActive }) =>
						`${linkClasses} ${isActive ? activeLinkClasses : ''}`
					}
				>
					<FiRadio className="mr-3" />
					<span>Automações</span>
				</NavLink>
				<NavLink
					to='/sessions'
					className={({ isActive }) =>
						`${linkClasses} ${isActive ? activeLinkClasses : ''}`
					}
				>
					<FiPlusCircle className="mr-3" />
					<span>Sessões</span>
				</NavLink>
				<NavLink
					to='/listchannels'
					className={({ isActive }) =>
						`${linkClasses} ${isActive ? activeLinkClasses : ''}`
					}
				>
					<FiList className="mr-3" />
					<span>Listar Canais</span>
				</NavLink>
				<NavLink
					to='/logs'
					className={({ isActive }) =>
						`${linkClasses} ${isActive ? activeLinkClasses : ''}`
					}
				>
					<FiFileText className="mr-3" />
					<span>Logs do Sistema</span>
				</NavLink>
			</nav>
		</div>
	);
};

export default Sidebar;
