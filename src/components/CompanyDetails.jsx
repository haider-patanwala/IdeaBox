/* eslint-disable camelcase */
// import { BiSolidMap } from 'react-icons/bi';

import { useEffect, useState } from "react";
import { IoTrashBinOutline } from "react-icons/io5";
import { TiThumbsUp, TiThumbsDown } from "react-icons/ti";
import { MdPendingActions } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import ProjectDeleteConfirmationDialog from "./modals/ProjectDeleteConfirmationDialog";

function CompanyDetails({
  org_data, update, edit, fetchOrg,
}) {
  const [orgProposals, setOrgProposals] = useState([]);
  const [deleteBtn, setDeleteBtn] = useState(false);
  const [selectedUID, setSelectedUID] = useState([]);

  // it will get empty object for `/profile` page.
  // but it will get {uid : xxx} object for `/companies/:uid` page
  const profile = useParams();

  const fetchProposals = () => {
    const orgId = localStorage.getItem("isOrg");
    fetch(
      `https://projekto-backend.onrender.com/proposals?organization=${orgId}`,
      {
        headers: {
          authorization: localStorage.getItem("authToken"),
        },
      },
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log("proposals : ", data);
        setOrgProposals(data.data);
      });
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const deleteProject = (uid) => {
    setSelectedUID(uid);
    setDeleteBtn(!deleteBtn);
  };

  // Callback function to be passed to the ConfirmationDialog
  const handleDeleteSuccess = () => {
    // Fetch the updated proposals from the server
    fetchOrg();
  };

  const patchProposal = async (uid, body) => {
    const response = await fetch(`https://projekto-backend.onrender.com/proposals/${uid}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        authorization: localStorage.getItem('authToken'),
      },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    if (result.error) {
      alert(`${result.error}`);
    }
    alert(`${result.message}`);
    // console.log("PATCHED ? ", result);
    fetchProposals();
  };

  const handleProposal = (action, uid) => {
    // console.log("Proposal action : ", action);
    // console.log("Proposal uid : ", uid);

    let body;
    if (action === "accept") {
      body = {
        accepted: true,
        pending: false,
        rejected: false,
      };
    } else if (action === "reject") {
      body = {
        rejected: true,
        pending: false,
        accepted: false,
      };
    } else if (action === "pending") {
      body = {
        rejected: false,
        pending: true,
        accepted: false,
      };
    }
    patchProposal(uid, body);
  };

  const getStatusText = (proposal) => {
    if (proposal.pending) {
      return "Pending";
    } if (proposal.accepted) {
      return "Accepted";
    }
    return "Rejected";
  };

  return (
    <div className="flex flex-col max-w-screen-sm md:max-w-none lg:max-w-none items-center justify-center mx-3">
      <div
        className="flex w-full lg:w-3/5 md:w-4/5 flex-col justify-center
            items-center border z-10 relative
           border-slate-300  bg-white/50 rounded-2xl my-6 mb-10"
      >
        {/* ------------------Company Banner */}
        <div className="flex justify-start w-full mt-6 items-start place-content-start gap-[5%] border-b border-slate-300 px-5 py-7 relative">
          <div className="flex items-center relative justify-center h-24 p-0 m-0">
            <img
              alt="banner"
              src={org_data.banner_img}
              className="inline-block object-cover aspect-video h-full p-0 shadow rounded-xl"
            />
          </div>
          {/* <LuEdit className='absolute right-8 top-9 text-2xl text-accent hover:bg-accent/10' /> */}
          <div className={` absolute right-0 top-0 ${edit}`}>
            {update}
            {' '}
          </div>
          <div className="flex flex-col justify-between items-start gap-3">
            {/* --------Company Name------------------- */}
            <h1 className="text-3xl font-medium text-slate-900">
              {org_data.name}
            </h1>
            <div className="flex place-content-start items-center w-full text-slate-600 gap-1">
              {/* <BiSolidMap /> */}
              {/* ------------------------ Company Location-------------------------- */}
              {/* <p>India</p> */}
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row justify-start w-full items-start place-content-start">
          {/* ----------Col-1----------------*/}
          <div className="flex flex-col gap-6 px-5 py-7  mr-2  md:w-1/3 relative">
            <div className="flex flex-col gap-2  ">
              <h1 className="text-lg text-slate-900 font-medium">Industry</h1>
              <p className="description break-words">{org_data.domain}</p>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-lg text-slate-900 font-medium">Founded in</h1>
              <p className="description">1968</p>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-lg text-slate-900 font-medium">
                Company Website
              </h1>
              <p className="description break-words">{org_data.website}</p>
            </div>
          </div>
          {/* ----------Col-2----------------*/}
          <div className="flex flex-col border-b md:border-b-0 md:border-l md:pl-2 border-slate-300 md:gap-6 md:w-2/3 pb-10">
            <div className="flex flex-col gap-2 px-5 py-7">
              {/* ---------Company Name------------ */}
              <h1 className="text-2xl font-semibold mb-3">
                About
                {' '}
                {org_data.name}
              </h1>
              <p className="description">{org_data.about}</p>
            </div>
            <div className="flex flex-col gap-2 px-5">
              <h1 className="text-lg font-semibold mb-3">Domain</h1>
              <div className="flex flex-wrap">
                <ul className="flex flex-wrap  gap-2 capitalize text-accent">
                  <li
                    key={org_data.uid}
                    className="border border-slate-300 px-2 py-1 bg-accent/5 text-sm rounded-2xl"
                  >
                    {org_data.domain}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* keep thiss dialog component ouotside here so that it doesnt overlap with other components */}
      {/* render ConfirmationDialog only if selectedUID && deleteBtn are available */}
      {selectedUID && deleteBtn && (
      <ProjectDeleteConfirmationDialog
        cancel={() => setDeleteBtn(!deleteBtn)}
        deleteBtn={deleteBtn}
        setDeleteBtn={setDeleteBtn}
        propUid={selectedUID}
        onDeleteSuccess={handleDeleteSuccess}
      />
      )}

      <div
        className="flex w-full lg:w-3/5 md:w-4/5 flex-col justify-center
            items-center border z-10 relative
           border-slate-300  bg-white/50 rounded-2xl my-6 mb-10"
      >
        <div className="flex w-full flex-col">
          <h1 className="text-2xl font-semibold px-5 pt-7 mb-3">Company Projects</h1>
          {/* ---------TODO: Comapny Projects------------ */}
          <div className=" py-5  ">
            {org_data.org_projects && org_data.org_projects.map((project) => (
              <div className="flex w-full justify-between items-center py-5 relative border-t px-5 gap-5 border-slate-300" key={project.uid}>
                <div className="flex flex-col md:flex-row gap-6 md:gap-0">
                  <div className="flex items-start justify-start">
                    <img
                      src={project.thumbnail}
                      alt=""
                      className="w-[30vw]  md:w-40 rounded-lg  object-cover aspect-video mr-8"
                    />
                    <div className="flex flex-col md:hidden">
                      <Link to={`/projects/${project.uid}`} className=" text-xl font-semibold  hover:text-accent">{project.title}</Link>
                      <p>{project.uid}</p>
                    </div>
                  </div>
                  <div className="lg:w-[60%] md:pl-6">
                    <Link to={`/projects/${project.uid}`} className="hidden md:flex text-xl font-semibold  hover:text-accent">{project.title}</Link>
                    <div className="hidden md:flex place-content-start items-center w-full text-slate-600 gap-1">
                      {/* ------------------------ Project Description-------------------------- */}
                      <p>{project.uid}</p>
                    </div>
                    <p className="description mb-4  w-full md:w-[90%]">
                      {project.description}
                    </p>
                  </div>
                </div>
                {/* -------Delete Button------- */}

                <div className="absolute top-6 right-3 md:flex">
                  <button
                    type="button"
                    onClick={() => deleteProject(project.uid)}
                    className="text-red-500 text-xl lg:text-2xl bg-red-50 hover:bg-red-500 hover:text-white p-3 rounded-xl"
                  >
                    <IoTrashBinOutline />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
      {/* only render if the url param has {} object due to no :uid in url */}
      {!profile.uid === true
        ? (
          <div
            className="flex w-full lg:w-3/5 md:w-4/5 flex-col justify-center
            items-start border z-10 relative
           border-slate-300  bg-white/50  rounded-2xl my-6 mb-10"
          >
            <div className="flex flex-col   w-full ">
              <h1 className="text-2xl px-5 font-semibold my-7">Company&apos;s Projects Proposals</h1>
              {/* ---------TODO: Comapny Projects------------ */}
              <div className="border-t px-5 py-5 border-slate-300 justify-start md:justify-between gap-2 md:gap-5 relative">
                {orgProposals && orgProposals.map((proposal) => (
                  <div className="flex items-start justify-start md:items-start md:justify-start my-5 relative" key={proposal.uid}>
                    {/* -----------Thumbnail------------ */}
                    <div className="flex order-1 w-[25%] m-0 md:w-1/6 relative">
                      <img
                        src={proposal.project.thumbnail}
                        alt=""
                        className="absolute w-[50%] md:w-[75%] h-fit left-0 z-20 rounded-full  object-cover aspect-square"
                      />
                      <Link to={`/developers/${proposal.developer.uid}`}>
                        <img
                          src={proposal.developer.profile_pic}
                          alt=""
                          className="absolute w-[50%] md:w-[75%] h-fit left-6 z-30 rounded-full  object-cover aspect-square"
                        />
                      </Link>
                    </div>
                    <div className="flex order-2 md:w-1/2 md:pl-6 flex-col items-start">
                      {/* badge for proposal status */}
                      <p
                    // eslint-disable-next-line no-nested-ternary
                        className={`border py-0.5 px-1 md:px-2 md:py-1 bg-accent/5 text-xs md:text-sm rounded-2xl text-accent ${proposal.pending ? "bg-yellow-100/50 text-orange-600 border-orange-300" : proposal.accepted ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}`}
                      >
                        {getStatusText(proposal)}
                      </p>

                      <Link to={`/projects/${proposal.project.uid}`} className="text-lg md:text-xl font-semibold md:mt-3 hover:text-accent">{proposal.project.title}</Link>
                      <div className="flex place-content-start items-center w-full text-slate-600 gap-1">
                        {/* ------------------------ Developer City-------------------------- */}
                        <p className="text-xs md:text-sm">{proposal.project.uid}</p>
                      </div>
                      <p className="description mb-4 text-xs md:text-sm">
                        Proposal :
                        {' '}
                        {proposal.uid}
                        {' '}
                        by
                        {' '}
                        {proposal.developer.fname}
                        {" "}
                        {proposal.developer.lname}
                      </p>
                    </div>

                    <div className="absolute top-0 right-0 md:flex">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleProposal("accept", proposal.uid)}
                          disabled={proposal.accepted}
                          type="button"
                          className={`flex items-center text-green-500 text-xl lg:text-2xl bg-green-50 hover:bg-green-500
                           hover:text-white p-3 rounded-xl ${proposal.accepted ? 'hidden' : ''}`}
                        >
                          <p className="text-sm md:text-base pr-1 md:px-2">Accept</p>
                          <TiThumbsUp />
                        </button>
                        <button
                          disabled={proposal.rejected}
                          onClick={() => handleProposal("reject", proposal.uid)}
                          type="button"
                          className={`flex items-center text-red-500 text-xl lg:text-2xl bg-red-50 hover:bg-red-500
                           hover:text-white p-3 rounded-xl  ${proposal.rejected ? 'hidden' : ''}`}
                        >
                          <p className="text-sm md:text-base pr-1 md:px-2">Reject</p>
                          <TiThumbsDown />
                        </button>
                        <button
                          onClick={() => handleProposal("pending", proposal.uid)}
                          disabled={proposal.pending}
                          type="button"
                          className={`flex items-center text-orange-500 text-xl lg:text-2xl bg-yellow-50 hover:bg-yellow-500
                           hover:text-white p-3 rounded-xl  ${proposal.pending ? 'hidden' : ''}`}
                        >
                          <p className="text-sm md:text-base pr-1 md:px-2">Pending</p>
                          <MdPendingActions />
                        </button>
                      </div>
                    </div>
                  </div>

                ))}
              </div>
            </div>
          </div>
        )
        : null }

    </div>
  );
}

export default CompanyDetails;
