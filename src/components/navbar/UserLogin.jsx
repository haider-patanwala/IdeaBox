import React from 'react';
import { Link } from 'react-router-dom';
import { IoMdLogIn } from 'react-icons/io';
import { RxAvatar } from 'react-icons/rx';

function UserLogin() {
	const token = localStorage.getItem('authToken');
	const logOut = () => {
		console.log('yoooooo');
		localStorage.removeItem('authToken');
		token = null;
	};
	console.log('token is -----', token);
	return (
		<div className=' hover:text-accent text-base text-slate-800 dropdown dropdown-end '>
			<label
				tabIndex={0}
				className='btn text-4xl btn-ghost rounded-btn'
			>
				<RxAvatar />
			</label>
			{/* ----------for Logged Out Users------------------- */}

			{!token && (
				<ul className='menu dropdown-content z-[15] p-2 shadow bg-base-100 rounded-box w-52 mt-4'>
					<li>
						<Link
							to={'login'}
							className='w-full text-accent  focus:bg-accent hover:bg-slate-100  focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center'
						>
							Login
						</Link>
					</li>
					<li>
						<Link
							to={'/register'}
							className='w-full text-accent hover:text-accent bg-white  font-medium hover:bg-slate-100 rounded-lg text-sm px-5 py-2.5 text-center'
						>
							Register
						</Link>
					</li>
				</ul>
			)}

			{/* ----------for Logged In Users------------------- */}
			{token && (
				<ul className='menu dropdown-content z-[15] p-2 shadow bg-base-100 rounded-box w-52 mt-4'>
					<li>
						<Link
							to={'/'}
							className='w-full text-accent  focus:bg-accent hover:bg-slate-100  focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center'
							onClick={() => logOut()}
						>
							Logout
						</Link>
					</li>
				</ul>
			)}
		</div>
	);
}

export default UserLogin;
