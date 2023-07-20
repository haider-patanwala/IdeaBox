import { useEffect, useState } from 'react';
import DeveloperList from '../components/DeveloperList';
import { FilterButton } from '../components/navbar/FilterButton';
import loading from '/SVG/loading.svg';

const filters = [
	{
		label: 'featured',
		property: '#featured',
	},
	{
		label: 'open for work',
		property: '#open_to_work',
	},
	{
		label: 'best rating',
		property: '#best_rating',
	},
];

const DevelopersListing = () => {
	const [developers, setDevelopers] = useState([]);
	useEffect(() => {
		const fetchDevelopers = async () => {
			const response = await fetch(
				'https://projekto-backend.onrender.com/developers',
				{ mode: 'cors' }
			);
			const fetchedDevelopers = await response.json();
			setDevelopers(fetchedDevelopers.data);
			console.log('fetch Developers------------', fetchedDevelopers.data);
			// console.log('fetch Developers------------', developers);
		};
		fetchDevelopers();
	}, []);
	return (
		<>
			<div className='flex flex-col justify-center w-full'>
				{/*------------- Background Gradient ------------ */}
				<div className='gradient z-0'></div>

				{/*------------- Headings ------------ */}

				<div className='gap-0 z-[1] mt-5'>
					<h1
						className=' text-gray-900 text-center text-3xl md:text-4xl
			 font-semibold'
					>
						Discover Best People to Hire!
					</h1>
					<h1
						className=' blue-gradient text-center text-3xl md:text-4xl
			 font-semibold'
					>
						Developer reviews. Rates. Interviews.
					</h1>
				</div>
				<div className='flex justify-center my-6 relative mx-3'>
					<div className='flex lg:w-3/5 flex-col justify-center w-full md:w-4/5 items-start border z-10 border-slate-300  bg-white/50 rounded-2xl py-5'>
						<div className='flex mt-6 w-full justify-between border-b '>
							<h1 className='text-2xl text-start font-medium text-slate-800 px-5 my-2'>
								List of Developers
							</h1>
							{/* <div className='tabs'>
							<a className='tab tab-bordered tab-active '>Best Matches</a>
							<a className='tab'>Saved Jobs</a>
						</div> */}

							{/*--------sort button--------- */}
							<FilterButton filters={filters} />

							{/*--------sort button END--------- */}
						</div>
						{/*---------------- Developer List--------------- */}
						{developers.length > 0 ? (
							<DeveloperList developers_prop={developers} />
						) : (
							<div className='flex w-full py-10 justify-center text-slate-500'>
								<img src={loading} />
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default DevelopersListing;
