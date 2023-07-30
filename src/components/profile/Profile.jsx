import { useEffect, useRef, useState } from 'react';
import { BiSolidMap } from 'react-icons/bi';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import { BsGithub, BsLinkedin } from 'react-icons/bs';
import { IoTrashBinOutline } from 'react-icons/io5';
// import { LuEdit } from 'react-icons/lu';
// import { BsPersonFillCheck } from 'react-icons/bs';
// import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import UpdateModal from './UpdateModal';
import CompanyDetails from '../CompanyDetails';
import CompanyUpdateModal from './CompanyUpdateModal';
import ConfirmationDialog from '../modals/ConfirmationDialog';
import ProjectHistoryUpdate from '../modals/ProjectHistoryUpdate';

export default function DevProfile() {
  const [developer, setDeveloper] = useState([]);
  const [organization, setOrganization] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [projectHistory, setProjectHistory] = useState([]);
  const [deleteBtn, setDeleteBtn] = useState(false);
  // need this state variable to keep track of the uid got from delete button click
  const [selectedUID, setSelectedUID] = useState([]);

  // --------------!Can avoid this useRef part as it is was later on not needed.
  // using useRef hook create a reference to the developer state variable and access its updated value immediately after it is updated by setDeveloper.
  // useRef allows you to store a mutable value that persists across renders without causing a re-render when the value changes.
  const developerRef = useRef(developer);
  const proposalsRef = useRef(proposals);

  useEffect(() => {
    developerRef.current = developer;
    proposalsRef.current = proposals;
  }, [developer, proposals]);

  const fetchProposals = async () => {
    // The developerRef.current will always have the most recent value of developer without triggering a re-render.
    // console.log("current is ------", developerRef.current._id);
    // const url = `?developer=${developerRef.current._id}`;
    const url = `?developer=${localStorage.getItem('isDev')}`;
    const response = await fetch(
      `https://projekto-backend.onrender.com/proposals${url}`,
      // `https://projekto-backend.onrender.com/proposals`,
      {
        mode: 'cors',
        headers: { authorization: localStorage.getItem('authToken') },
      },
    );
    const fetched = await response.json();
    // console.log('fetched ------------>', fetched.data);
    // console.log('fetched 1 for ------------', fetched.data[0].developer.fname);
    // console.log('fetched 2 for ------------', fetched.data[1].developer.fname);
    setProposals(fetched.data);
    // console.log('proposals>>>>>>>>>', proposalsRef.current);
  };

  const fetchProfile = async () => {
    let id;
    let url;
    if (localStorage.getItem('isDev')) {
      id = localStorage.getItem('isDev');
      url = `developers?_id=${id}`;
    } else if (localStorage.getItem('isOrg')) {
      id = localStorage.getItem('isOrg');
      url = `organizations?_id=${id}`;
    }

    const response = await fetch(
      `https://projekto-backend.onrender.com/${url}`,
      { mode: 'cors' },
    );
    const fetched = await response.json();
    if (localStorage.getItem('isDev')) {
      await setDeveloper(fetched.data[0]);
      fetchProposals();
    } else if (localStorage.getItem('isOrg')) {
      setOrganization(fetched.data[0]);
    }
    // console.log('fetched info------------', fetched.data[0]);
  };
  const fetchHistory = async () => {
    let id;
    let url;
    if (localStorage.getItem('isDev')) {
      id = localStorage.getItem('isDev');
      url = `?developer=${id}`;
    } else {
      url = ``;
    }

    const response = await fetch(
      `https://projekto-backend.onrender.com/project-histories${url}`,
      { mode: 'cors' },
    );
    const fetched = await response.json();
    if (localStorage.getItem('isDev')) {
      await setProjectHistory(fetched.data);
    }
    // console.log('fetched info------------', fetched.data);
  };

  useEffect(() => {
    fetchProfile();
    fetchHistory();
  }, []);

  const deleteProposal = (uid) => {
    setDeleteBtn(!deleteBtn);
    setSelectedUID(uid);
  };

  // Callback function to be passed to the ConfirmationDialog
  const handleDeleteSuccess = () => {
    // Fetch the updated proposals from the server
    fetchProposals();
  };

  const getStatusText = (proposal) => {
    if (proposal.pending) {
      return "Pending";
    } if (proposal.accepted) {
      return "Accepted";
    }
    return "Rejected";
  };

  const skills = developer?.skills;
  if (
    !Object.keys(developer).length > 0 && !Object.keys(organization).length > 0
  ) {
    return (
      <div className="flex w-full justify-center text-slate-500">
        Loading.....
      </div>
    );
  }
  if (localStorage.getItem('isDev')) {
    return (
      <div className="flex flex-col max-w-screen-sm md:max-w-none lg:max-w-none items-center justify-center mx-3">
        <div
          className="flex w-full lg:w-3/5 md:w-4/5 flex-col justify-center
            items-center border z-10 relative
           border-slate-300  bg-white/50 rounded-2xl my-6 mb-10"
        >
          <div className="flex justify-start lg:items-center w-full mt-6 items-start  place-content-start md:gap-[5%] border-b border-slate-300 px-5 py-7 relative">
            <div className="flex items-center relative justify-center h-24 lg:h-80 p-0 m-0">
              <img
                alt="profile"
                src={developer?.profile_pic}
                className="inline-block object-cover aspect-square  h-full p-0 shadow shadow-accent rounded-full"
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

            <div className="flex flex-col justify-between lg:pb-16 h-full  gap-3">
              {/* --------Developer Name------------------- */}
              <h1 className="text-3xl lg:text-5xl font-medium text-slate-900">
                {developer?.fname}
                {' '}
                {developer?.lname}
              </h1>
              <div className="flex place-content-start items-center w-full text-slate-600 gap-1">
                <BiSolidMap />
                {/* ------------------------ Developer City-------------------------- */}
                <p>
                  {developer?.city}
                  , India
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse md:flex-row justify-start w-full items-start place-content-start">
            {/* ----------Col-1----------------*/}
            <div className="flex flex-col gap-6 px-5 py-7  mr-2  md:w-1/3">
              <div className="flex flex-col gap-2  ">
                <h1 className="text-lg text-slate-900 font-medium">Role</h1>
                <p className="description">{developer?.technical_role}</p>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-lg text-slate-900 font-medium">
                  Education
                </h1>
                <p className="description">{developer?.qualification}</p>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-lg text-slate-900 font-medium">Contact</h1>
                <Link
                  to={`mailto:${developer?.email}`}
                  className="contact-dev"
                >
                  <FaEnvelope />
                  {developer?.email}
                </Link>
                <Link
                  to={`tel:${developer?.phone}`}
                  className="contact-dev"
                >
                  <FaPhone />
                  {developer?.phone}
                </Link>
                <Link
                  to={developer?.linkedin}
                  target="_blank"
                  className="contact-dev"
                >
                  <BsLinkedin />
                  {developer?.linkedin}
                </Link>
                <Link
                  to={developer?.github}
                  target="_blank"
                  className="contact-dev"
                >
                  <BsGithub />
                  {developer?.github}
                </Link>
              </div>
            </div>
            {/* ----------Col-2----------------*/}
            <div className="flex flex-col border-b md:border-b-0 md:border-l md:pl-2 border-slate-300 gap-6 md:w-2/3 pb-10">
              <div className="flex flex-col gap-2 px-5 py-7">
                {/* ---------Domain------------ */}
                <h1 className="text-2xl font-semibold mb-3">
                  {developer?.technical_role}
                </h1>
                <p className="description">
                  Hello!, I&apos;m
                  {' '}
                  {developer?.technical_role}
                  {' '}
                  seeking side
                  projects, My skill set extends beyond technical proficiency. I
                  have a keen eye for design, allowing me to effectively
                  transform wireframes and mockups into visually appealing
                  product. I understand the importance of creating intuitive
                  user experiences that engage and captivate visitors,
                  ultimately leading to increased conversion rates and customer
                  satisfaction.
                </p>
              </div>
              <div className="flex flex-col gap-2 px-5">
                <h1 className="text-lg font-semibold mb-3">Skills</h1>
                <div className="flex flex-wrap">
                  <ul className="flex flex-wrap  gap-2 capitalize text-accent">
                    {skills.map((skill, i) => (
                      <li
                        key={i}
                        className="border border-slate-300 px-2 py-1 bg-accent/5 text-sm rounded-2xl"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ---------------Proposals---------------- */}
        {/* ---------!Make this div Visible only if dev has applied for proposals-------------- */}
        <div
          className="flex w-full lg:w-3/5 md:w-4/5 flex-col justify-center
            items-center border z-10 relative
           border-slate-300 bg-white/50 rounded-2xl my-6 mb-10"
        >
          <h1 className="flex w-full pl-5 pt-6 capitalize justify-start text-2xl  font-semibold mb-5">
            Your Project Proposals
          </h1>
          <div className="flex w-full flex-col pt-2">
            {/* <div className="w-full border -mb-[1px] border-b border-white z-10" /> */}
            {proposals.length === 0 && (
            <h3 className="text-lg lg:text-xl ms-5 font-semibold mb-3 text-slate-800">
              No proposals found.
            </h3>
            )}
            {proposals.map((proposal, i) => (
              <div
                key={i}
                className="flex items-start justify-start border-t px-5 py-5 border-slate-300 "
              >
                <img
                  alt="thumbnail"
                  src={proposal.project.thumbnail}
                  className="aspect-video w-1/3 lg:w-1/4 rounded-xl"
                />

                <div className="flex flex-col items-start pl-7  justify-start w-full text-slate-600">
                  {/* ------------------------ Proposal title-------------------------- */}
                  <h2 className="text-lg lg:text-2xl font-semibold mb-3 text-slate-800">
                    {proposal.project.title}
                  </h2>
                  <p className="text-sm lg:text-lg font-normal text-slate-600 mb-2">
                    {proposal.project.uid}
                  </p>
                  {/* badge for proposal status */}
                  <span
                    // eslint-disable-next-line no-nested-ternary
                    className={`border  px-2 py-1 bg-accent/5 text-sm rounded-2xl text-accent ${proposal.pending ? "bg-yellow-100 text-orange-600 border-orange-300" : proposal.accepted ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}`}
                  >
                    {/* {proposal.pending ? "Pending" : "Accepted"} */}
                    {getStatusText(proposal)}
                  </span>

                </div>
                {/* -------Delete Button------- */}
                {/* render ConfirmationDialog only if selectedUID && deleteBtn are available */}
                {selectedUID && deleteBtn && (
                <ConfirmationDialog
                  cancel={() => setDeleteBtn(!deleteBtn)}
                  deleteBtn={deleteBtn}
                  setDeleteBtn={setDeleteBtn}
                  propUid={selectedUID}
                  onDeleteSuccess={handleDeleteSuccess}
                />
                )}
                <button
                  type="button"
                  onClick={() => deleteProposal(proposal.uid)}
                  className="text-red-500 text-2xl bg-red-50 hover:bg-red-500 hover:text-white p-3 rounded-xl"
                >
                  <IoTrashBinOutline />
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* ----------Project History----------- */}
        <div
          className="flex w-full lg:w-3/5 md:w-4/5 flex-col justify-center
            items-center border z-10 relative
           border-slate-300  bg-white/50 rounded-2xl my-6 mb-10"
        >
          <div className="flex flex-col px-5 py-7 relative w-full">
            <h1 className="text-2xl font-semibold mb-3">Project History</h1>
            <div className={` absolute -top-12 -right-5 md:right-0  md:top-0 `}>
              <ProjectHistoryUpdate fetchHistory={fetchHistory} />
            </div>

            {/* ---------TODO: Project History------------ */}
            {projectHistory && projectHistory.map((project) => (
              <div key={project.uid} className="flex flex-row justify-between border-b py-5 border-slate-300 ">
                <div>

                  {/* ------------------------ Project title-------------------------- */}
                  <h2 className="text-xl font-semibold">
                    {project.title}
                  </h2>
                  {/* ------------------------ Project timeline-------------------------- */}
                  <div className="flex place-content-start items-center w-full text-slate-600 gap-1 mb-2">
                    <p>
                      {project.startDate}
                    &nbsp;to&nbsp;
                      {project.endDate}
                    </p>
                  </div>
                  <Link
                    to={project?.link}
                    target="_blank"
                    className="contact-dev"
                  >
                    {project?.link}
                  </Link>
                  <p className="description">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  return (
    <CompanyDetails
      org_data={organization}
      fetchOrg={fetchProfile}
      edit=""
      update={(
        <CompanyUpdateModal
          organization={organization}
          setOrganization={setOrganization}
        />
  )}
    />
  );
}
