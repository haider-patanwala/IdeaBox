import { useEffect, useState } from 'react';
import { BiSolidMap } from 'react-icons/bi';
// import { LuEdit } from 'react-icons/lu';
// import { BsPersonFillCheck } from 'react-icons/bs';
// import { useParams } from 'react-router-dom';
import UpdateModal from './UpdateModal';
import CompanyDetails from '../CompanyDetails';
import CompanyUpdateModal from './CompanyUpdateModal';

function DevProfile() {
	const [developer, setDeveloper] = useState([]);
	const [organization, setOrganization] = useState([]);

	useEffect(() => {
		let id;
		let url;
		if (localStorage.getItem('isDev')) {
			id = localStorage.getItem('isDev');
			url = `developers?_id=${id}`;
		} else if (localStorage.getItem('isOrg')) {
			id = localStorage.getItem('isOrg');
			url = `organizations?_id=${id}`;
		}
		const fetchProfile = async () => {
			const response = await fetch(
				// ! change link, This link should send data of logged in user
				`https://projekto-backend.onrender.com/${url}`,
				{ mode: 'cors' }
			);
			const fetched = await response.json();
			if (localStorage.getItem('isDev')) {
				setDeveloper(fetched.data[0]);
			} else if (localStorage.getItem('isOrg')) {
				setOrganization(fetched.data[0]);
			}
			// console.log('fetched info------------', fetched.data[0]);
		};
		fetchProfile();
	}, []);

	const skills = developer?.skills;
	if (
		!Object.keys(developer).length > 0 &&
		!Object.keys(organization).length > 0
	) {
		return (
			<div className='flex w-full justify-center text-slate-500'>
				Loading.....
			</div>
		);
	}
	if (localStorage.getItem('isDev')) {
		return (
			<div className='flex flex-col max-w-screen-sm md:max-w-none lg:max-w-none items-center justify-center mx-3'>
				<div
					className='flex w-full lg:w-3/5 md:w-4/5 flex-col justify-center
            items-center border z-10 relative
           border-slate-300  bg-white/50 rounded-2xl my-6 mb-10'
				>
					<div className='flex justify-start lg:items-center w-full mt-6 items-start  place-content-start gap-[5%] border-b border-slate-300 px-5 py-7 relative'>
						<div className='flex items-center relative justify-center h-24 lg:h-80 p-0 m-0'>
							<img
								alt='profile'
								src={developer?.profile_pic}
								className='inline-block object-cover aspect-square  h-full p-0 shadow shadow-accent rounded-full'
							/>
						</div>
						<UpdateModal
							developer={developer}
							setDeveloper={setDeveloper}
						/>

						{/* {isOpen ? (
              <BsPersonFillCheck
                onClick={() => setIsOpen(!isOpen)}
                className="absolute right-8 top-9 text-2xl text-accent hover:bg-accent/10 "
              />
            ) : (
              <LuEdit
                onClick={() => setIsOpen(!isOpen)}
                className="absolute right-8 top-9 text-2xl text-accent hover:bg-accent/10 "
              />
            )} */}

						<div className='flex flex-col justify-between lg:pb-16 h-full  gap-3'>
							{/* --------Developer Name------------------- */}
							<h1 className='text-3xl lg:text-5xl font-medium text-slate-900'>
								{developer?.fname} {developer?.lname}
							</h1>
							<div className='flex place-content-start items-center w-full text-slate-600 gap-1'>
								<BiSolidMap />
								{/* ------------------------ Developer City-------------------------- */}
								<p>{developer?.city}, India</p>
							</div>
						</div>
					</div>
					<div className='flex justify-start w-full items-start place-content-start'>
						{/* ----------Col-1----------------*/}
						<div className='flex flex-col gap-6 px-5 py-7  mr-2  w-1/3'>
							<div className='flex flex-col gap-2  '>
								<h1 className='text-lg text-slate-900 font-medium'>
									Experience
								</h1>
								<p className='description'>3+ Years Expert</p>
							</div>
							<div className='flex flex-col gap-2'>
								<h1 className='text-lg text-slate-900 font-medium'>
									Languages
								</h1>
								<p className='description'>English | Hindi | Marathi</p>
							</div>
							<div className='flex flex-col gap-2'>
								<h1 className='text-lg text-slate-900 font-medium'>
									Education
								</h1>
								<h1 className='text-base text-slate-900 font-medium'>
									VIVA Institute of Technology
								</h1>
								<p className='description'>{developer?.qualification}</p>
							</div>
						</div>
						{/* ----------Col-2----------------*/}
						<div className='flex flex-col border-l pl-2 border-slate-300 gap-6 w-2/3 pb-10'>
							<div className='flex flex-col gap-2 px-5 py-7'>
								{/* ---------Domain------------ */}
								<h1 className='text-2xl font-semibold mb-3'>
									{developer?.technical_role}
								</h1>
								<p className='description'>
									Hello!, I&apos;m {developer?.technical_role} seeking side
									projects, My skill set extends beyond technical proficiency. I
									have a keen eye for design, allowing me to effectively
									transform wireframes and mockups into visually appealing
									product. I understand the importance of creating intuitive
									user experiences that engage and captivate visitors,
									ultimately leading to increased conversion rates and customer
									satisfaction.
								</p>
							</div>
							<div className='flex flex-col gap-2 px-5'>
								<h1 className='text-lg font-semibold mb-3'>Skills</h1>
								<div className='flex flex-wrap'>
									<ul className='flex flex-wrap  gap-2 capitalize text-accent'>
										{skills.map((skill) => (
											<li className='border border-slate-300 px-2 py-1 bg-accent/5 text-sm rounded-2xl'>
												{skill}
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div
					className='flex w-full lg:w-3/5 md:w-4/5 flex-col justify-center
            items-center border z-10 relative
           border-slate-300  bg-white/50 rounded-2xl my-6 mb-10'
				>
					<div className='flex flex-col px-5 py-7'>
						<h1 className='text-2xl font-semibold mb-3'>Project History</h1>
						{/* ---------TODO: Project History------------ */}
						<div className='border-b py-5 border-slate-300 '>
							<h2 className='text-xl font-semibold mb-3'>
								Web Developer | Freelance
							</h2>
							<div className='flex place-content-start items-center w-full text-slate-600 gap-1'>
								{/* ------------------------ Developer City-------------------------- */}
								<p>January 2020 - December 2022</p>
							</div>
							<p className='description'>
								Key Responsibilities: <br />
								Hello!, I&apos;m full stack developer seeking side projects, My
								skill set extends beyond technical proficiency. I have a keen
								eye for design, allowing me to effectively transform wireframes
								and mockups into visually appealing interfaces. I understand the
								importance of creating intuitive user experiences that engage
								and captivate visitors, ultimately leading to increased
								conversion rates and customer satisfaction.
							</p>
						</div>
						<div className='border-b py-5 border-slate-300'>
							<h2 className='text-xl font-semibold mb-3'>
								Web Developer | Freelance
							</h2>
							<div className='flex place-content-start items-center w-full text-slate-600 gap-1'>
								{/* ------------------------ Developer City-------------------------- */}
								<p>January 2020 - December 2022</p>
							</div>
							<p className='description'>
								Key Responsibilities: <br />
								Hello!, I&apos;m full stack developer seeking side projects, My
								skill set extends beyond technical proficiency. I have a keen
								eye for design, allowing me to effectively transform wireframes
								and mockups into visually appealing interfaces. I understand the
								importance of creating intuitive user experiences that engage
								and captivate visitors, ultimately leading to increased
								conversion rates and customer satisfaction.kkkk
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<CompanyDetails
			org_data={organization}
			edit=''
			update={
				<CompanyUpdateModal
				// developer={developer} setDeveloper={setDeveloper}
				/>
			}
		/>
	);
}

export default DevProfile;
