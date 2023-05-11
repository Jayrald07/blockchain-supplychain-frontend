import axios from "axios";
import { useEffect, useState } from "react";
import ButtonIndex from "../Button/button.index";
import HeaderbarIndex from "../HeaderBar/headerbar.index";
import InputIndex from "../Input/input.index";
import NavbarIndex from "../Navbar/navbar.index";
import "./account.index.css";
import AuthIndex from "../Auth/auth.index";
import { host, port } from "../../utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "../Modalv2/modal.index";
import AlertIndex from "../Alert/alert.index";
import PromptIndex from "../Prompt/prompt.index";
import { Socket } from "socket.io-client";
import useSocket from "../../hooks/useSocket";
import useVerified from "../../hooks/useVerified";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [inviteUsername, setInviteUsername] = useState("");
  const [alertContent, setAlertContent] = useState<{ type?: string, content?: string, title?: string }>();
  const [isModal, setIsModal] = useState(false);
  const [confirmedOu, setConfirmedOu] = useState([]);
  const [pendingOut, setPendingOu] = useState([]);
  const [receivedOu, setReceivedOu] = useState([]);
  const [promptContent, setPromptContent] = useState<{ question?: string, description?: string, buttons?: string[] }>();
  const [toHandle, setToHandle] = useState("");
  const [selectedInviteId, setSelectedInviteId] = useState("")
  const socket: Socket | null = useSocket(`${host}:${port}`);
  const [isSideOpen, setIsSideOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailStatus, setEmailStatus] = useState('LOADING');
  const [emailRefer, setEmailRefer] = useState("");
  const [emailVerified, reloadVar, reloader] = useVerified();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");

  const api = axios.create({ baseURL: `${host}:${port}` });

  const handleUpdate = async () => {
    const { data } = await api.put(
      "/account",
      {
        organization_address: address,
        organization_phone: phone,
        organization_display_name: displayName
      },
      {
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
        },
      }
    );

    if (data.message === 'Done') setAlertContent({
      title: 'Account updated',
      content: data.details,
      type: 'success'
    })
    else setAlertContent({
      title: 'Error account update',
      content: data.details,
      type: 'error'
    })


    await handleAccountProfile();

  };

  const handleInvite = async (e: any) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/inviteOu", {
        username: inviteUsername
      }, {
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
        },
      })
      if (data.message === 'Error') {
        setAlertContent({
          type: 'error',
          title: 'Invite Error',
          content: data.details
        })
      } else {
        setAlertContent({
          type: 'success',
          title: 'Invite Success',
          content: data.details
        })
        setIsModal(false);

      }

      await handlePendings(false);

      await handlePendings(true);

      await handleGetInviteOut();


    } catch (error: any) {
      setAlertContent({
        type: 'error',
        title: 'Encountered Problem',
        content: error.message
      })
    }

  }

  const handleInviteClose = () => {
    setAlertContent({});
  }

  const handlePromptResponse = async (response: string) => {
    switch (toHandle) {
      case 'ACCEPT':
        await handleAccept(response);
        break;
      case 'REMOVE':
        await handleRemove(response);
        break;
      case 'CANCEL':
        await handleCancel(response);
        break;
      case 'REJECT':
        await handleReject(response);
        break;
      case 'SWITCH':
        await handleSwitch(response);
        break;

      default:
        break;
    }
  }

  const handleAccept = async (response: string) => {
    if (response === 'Yes') {
      const { data } = await api.post("/acceptInviteOu", {
        inviteOuId: selectedInviteId
      }, {
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
        }
      })
      if (data.message === "Done") setAlertContent({
        type: 'success',
        title: 'Invite Accepted',
        content: 'New OU added'
      })
      else setAlertContent({
        type: 'error',
        title: 'Error Invite',
        content: 'Cannot accept OU'
      })
    }
    await handlePendings(false);

    await handlePendings(true);

    await handleGetInviteOut()
    handleClosePrompt();
  }

  const handleRemove = async (response: string) => {
    if (response === 'Yes') {
      const { data } = await api.post("/rejectCancelInviteOu", {
        inviteOuId: selectedInviteId
      }, {
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
        }
      })
      if (data.message === "Done") setAlertContent({
        type: 'success',
        title: 'Organization unit removed',
        content: data.details
      })
      else setAlertContent({
        type: 'error',
        title: 'Error Removing',
        content: 'Cannot remove OU'
      })
    }
    handleClosePrompt();
    await handleGetInviteOut();
    await handlePendings(true);
    await handlePendings(false);
  }

  const handleCancel = async (response: string) => {
    if (response === 'Yes') {
      const { data } = await api.post("/cancelInviteOu", {
        inviteOuId: selectedInviteId
      }, {
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
        }
      })
      if (data.message === "Done") setAlertContent({
        type: 'success',
        title: 'Organization unit canceled',
        content: data.details
      })
      else setAlertContent({
        type: 'error',
        title: 'Cancel Error',
        content: 'Cannot cancel OU'
      })
    }
    handleClosePrompt();
    await handleGetInviteOut();
    await handlePendings(true);
    await handlePendings(false);
  }

  const handleReject = async (response: string) => {
    if (response === 'Yes') {
      const { data } = await api.post("/rejectInviteOu", {
        inviteOuId: selectedInviteId
      }, {
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
        }
      })
      if (data.message === "Done") setAlertContent({
        type: 'success',
        title: 'Organization unit rejected',
        content: data.details
      })
      else setAlertContent({
        type: 'error',
        title: 'Reject Error',
        content: 'Cannot reject OU'
      })
    }
    handleClosePrompt();
    await handleGetInviteOut();
    await handlePendings(true);
    await handlePendings(false);
  }

  const handleGetInviteOut = async () => {
    const { data: invited } = await api.post("/getInviteOu", {
      status: 'INVITED'
    }, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("token")}`,
      }
    })
    if (invited.message === "Done") setConfirmedOu(invited.details);
    else setAlertContent({
      type: 'error',
      title: 'Error Fetching',
      content: 'Cannot fetch received invites'
    })
  }

  const handlePendings = async (_received: boolean) => {
    const { data: received } = await api.post("/getInviteOu", {
      status: 'PENDING',
      received: _received
    }, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("token")}`,
      }
    })
    if (received.message === "Done") {
      if (_received) setReceivedOu(received.details);
      else setPendingOu(received.details)
    } else setAlertContent({
      type: 'error',
      title: 'Error Fetching',
      content: 'Cannot fetch received invites'
    })
  }

  const handleClosePrompt = () => {
    setPromptContent({});
  }

  const handleSwitch = async (response: string) => {

    if (response === 'Yes') {
      const { data } = await api.post("/switchToOu", {
        inviteOuId: selectedInviteId
      }, {
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
        }
      })

      console.log({ data });
    }

  }

  const handleEmailVerify = async (e: any) => {
    e.preventDefault();

    const { data } = await api.post("/sendEmailVerification", {
      email
    }, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("token")}`,
      },
    });

    if (data.message === "Error") setAlertContent({
      title: 'Error sending email verification',
      content: data.details,
      type: 'error'
    })
    else setAlertContent({
      title: 'Success sending email verification',
      content: 'Please see it in your inbox',
      type: 'success'
    })

    await handleAccountProfile();

  }

  const handleAccountProfile = async () => {
    const { data } = await api.get("/account", {
      headers: {
        Authorization: `Basic ${localStorage.getItem("token")}`,
      },
    });
    if (data) {
      setUsername(data.username);
      setAddress(data.organization_address);
      setPhone(data.organization_phone);
      setType(data.organization_type_id.organization_type_name);
      setOrganizationName(data.organization_name);
      setEmail(data.organization_email)
      setIsEmailVerified(data.organization_email_is_verified);
      setEmailStatus(data.emailStatus || 'NONE')
      setEmailRefer(data.organization_email)
      setDisplayName(data.organization_display_name)
    }
  }

  useEffect(() => {
    (async () => {
      await handleAccountProfile();

      await handlePendings(false);

      await handlePendings(true);

      await handleGetInviteOut()

    })();

  }, []);

  useEffect(() => {
    if (socket) {
      socket
        .on("account", async (data) => {
          if (data.action === "refetch") {
            handleGetInviteOut();
            handlePendings(true);
            handlePendings(false)
            handleAccountProfile();
            reloader(!reloadVar);
          }
        });
    }
  }, [socket]);

  return (
    <>
      {
        emailVerified === 'NOT VERIFIED'
          ? <div className="bg-red-500 text-center py-2">
            <small className="text-white">Looks like your email is not verified yet. Go to your <a href="#"
              onClick={() => {
                navigate("/account");
              }}
              className="underline"
            >account</a> to verify</small>
          </div>
          : null
      }

      <div className="grid grid-cols-5 h-full">
        {
          promptContent && Object.keys(promptContent).length ?
            <PromptIndex question={promptContent.question as string} description={promptContent.description as string} buttons={promptContent.buttons as string[]} onClose={handleClosePrompt} handleClick={handlePromptResponse} />
            : null
        }

        {
          isModal ?
            <Modal size="sm" title="Invite Organization" toggleModal={() => setIsModal(false)}>
              <form onSubmit={handleInvite}>
                <InputIndex type="text" label="Input Organization Username" value={inviteUsername} handler={(e: any) => setInviteUsername(e.target.value)} />
                <button className="w-full p-1 border rounded text-sm">Invite</button>
              </form>
            </Modal> : null
        }
        {
          alertContent && Object.keys(alertContent).length
            ?
            <AlertIndex title={alertContent.title as string} content={alertContent.content as string} type={alertContent.type as string} handleClose={handleInviteClose} />
            : null
        }
        <NavbarIndex />
        <section className={`col-span-5 sm:col-span-5 md:col-span-4`}>
          <HeaderbarIndex />
          <div className="px-10 lg:px-28 md:px-20 sm:px-10 xl:px-24 pt-20 mb-10">
            <h1>
              Account / {organizationName} <small className="p-1 px-2 font-light text-xs bg-slate-100 rounded">{type}</small>
            </h1>
            <section className="py-3">
              <h4>Contact Information</h4>
            </section>
            <section className="mb-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3">
              <div>
                <InputIndex
                  label="Display Name"
                  type="text"
                  value={displayName}
                  handler={(e: any) => setDisplayName(e.target.value)}
                  description={`This will be displayed on the scanned QR. Otherwise, it will display ${organizationName}`}
                />
                <InputIndex
                  label="Address"
                  type="text"
                  value={address}
                  handler={(e: any) => setAddress(e.target.value)}
                />
                <InputIndex
                  label="Contact Number"
                  type="text"
                  value={phone}
                  handler={(e: any) => setPhone(e.target.value)}
                />
                <InputIndex
                  label="Username"
                  type="text"
                  value={username}
                  handler={(e: any) => setUsername(e.target.value)}
                />
                <div>
                  <form onSubmit={handleEmailVerify}>
                    <InputIndex
                      label="Email"
                      type="email"
                      value={email}
                      handler={(e: any) => setEmail(e.target.value)}
                    />
                    {
                      !isEmailVerified
                        ? emailStatus === 'PENDING'
                          ? <small className="bg-orange-600 rounded-md p-1 text-center text-white text-xs">Pending</small>
                          : emailStatus === 'LOADING'
                            ? null
                            : <button className="border text-xs rounded bg-white p-1 px-3">Verify Email</button>
                        : email === emailRefer
                          ? <small className="bg-green-600 rounded-md p-1 text-center text-white text-xs">Verified</small>
                          : <button className="border text-xs rounded bg-white p-1 px-3">Verify Email</button>
                    }
                  </form>
                </div>
                <ButtonIndex label="Save" handleClick={handleUpdate} />
              </div>
            </section>

            {
              emailVerified === 'LOADING'
                ? <div className="flex justify-center">
                  <FontAwesomeIcon icon={faSpinner} size="xs" className="animate-spin" />
                </div>
                : emailVerified === 'VERIFIED'
                  ? <>
                    <div className="grid grid-cols-2 mb-3">
                      <h1 className="m-0">Organization Units</h1>
                      <div className="justify-self-end">
                        <button className="border p-1 px-2 rounded text-sm font-light justify-self-end" onClick={() => setIsModal(true)}><FontAwesomeIcon icon={faPlus} size="sm" /> Add</button>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full whitespace-nowrap border border-slate-100 mb-4">
                        <thead className="bg-slate-100 text-sm text-slate-600 text-left">
                          <tr>
                            <th className="p-2">Organization Name</th>
                            <th className="pr-2">Organization Type</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm font-thin">
                          {
                            !confirmedOu.length
                              ? <tr className="hover:bg-slate-50 border-b-slate-100">
                                <td colSpan={3} className="text-center p-2">No Organization Units</td>
                              </tr> : null
                          }
                          {
                            confirmedOu.map((item: any) => {
                              return <tr key={item._id} className="hover:bg-slate-50 border-b-slate-100">
                                <td className="p-2">{item.organization_details_id.organization_name}</td>
                                <td>{item.organization_details_id.organization_type_id.organization_type_name}</td>
                                <td>
                                  <button className="p-1 px-2 text-xs rounded border mr-2" onClick={() => {
                                    setPromptContent({
                                      question: 'Are you sure to switch?',
                                      description: 'This will transfer you to another account',
                                      buttons: ['Yes', 'No']
                                    })
                                    setToHandle('SWITCH')
                                    setSelectedInviteId(item._id)
                                  }}>Switch</button>
                                  <button className="p-1 px-2 text-xs rounded border" onClick={() => {
                                    setPromptContent({
                                      question: 'Are you sure to remove?',
                                      description: 'This will remove you from accessing it',
                                      buttons: ['Yes', 'No']
                                    })
                                    setToHandle('REMOVE')
                                    setSelectedInviteId(item._id)
                                  }}>Remove</button>
                                </td>
                              </tr>
                            })
                          }
                        </tbody>
                      </table>
                    </div>

                    <div className="grid grid-cols-2 mb-3">
                      <h1 className="m-0">Sent Invites</h1>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full whitespace-nowrap border border-slate-100 mb-4">
                        <thead className="bg-slate-100 text-sm text-slate-600 text-left">
                          <tr>
                            <th className="p-2">Organization Name</th>
                            <th>Organization Type</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm font-thin">
                          {
                            !pendingOut.length
                              ? <tr className="hover:bg-slate-50 border-b-slate-100">
                                <td colSpan={3} className="text-center p-2">No Sent Invites</td>
                              </tr> : null
                          }
                          {
                            pendingOut.map((item: any) => {
                              return <tr key={item._id} className="hover:bg-slate-50 border-b-slate-100">
                                <td className="p-2">{item.organization_details_id.organization_name}</td>
                                <td>{item.organization_details_id.organization_type_id.organization_type_name}</td>
                                <td>
                                  <button className="p-1 px-2 text-xs rounded border mr-2" onClick={() => {
                                    setPromptContent({
                                      question: 'Are you sure to cancel?',
                                      description: 'This will return back your invite',
                                      buttons: ['Yes', 'No']
                                    })
                                    setToHandle('CANCEL')
                                    setSelectedInviteId(item._id)
                                  }}>Cancel</button>
                                </td>
                              </tr>
                            })
                          }
                        </tbody>
                      </table>
                    </div>

                    <div className="grid grid-cols-2 mb-3">
                      <h1 className="m-0">Received Invites</h1>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full border whitespace-nowrap border-slate-100">
                        <thead className="bg-slate-100 text-sm text-slate-600 text-left">
                          <tr>
                            <th className="p-2">Organization Name</th>
                            <th className="pr-2">Organization Type</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm font-thin">
                          {
                            !receivedOu.length
                              ? <tr className="hover:bg-slate-50 border-b-slate-100">
                                <td colSpan={3} className="text-center p-2">No Received Units</td>
                              </tr> : null
                          }
                          {
                            receivedOu.map((item: any) => {
                              return <tr key={item._id} className="hover:bg-slate-50 border-b-slate-100">
                                <td className="p-2">{item.organization_id.organization_name}</td>
                                <td>{item.organization_id.organization_type_id.organization_type_name}</td>
                                <td>
                                  <button className="p-1 px-2 text-xs rounded border mr-2" onClick={() => {
                                    setPromptContent({
                                      question: 'Are you sure to accept?',
                                      description: 'This will able to access your account',
                                      buttons: ['Yes', 'No']
                                    })
                                    setToHandle('ACCEPT')
                                    setSelectedInviteId(item._id)
                                  }}>Accept</button>
                                  <button className="p-1 px-2 text-xs rounded border mr-2" onClick={() => {
                                    setPromptContent({
                                      question: 'Are you sure to reject?',
                                      description: 'This will prevent the organization from accessing your account',
                                      buttons: ['Yes', 'No']
                                    })
                                    setToHandle('REJECT')
                                    setSelectedInviteId(item._id)
                                  }}>Reject</button>
                                </td>
                              </tr>
                            })
                          }
                        </tbody>
                      </table>
                    </div>
                  </> : <div className="flex justify-center py-10">
                    <small>Your email is not verified yet. Please verify it first to use this feature.</small>
                  </div>
            }

          </div>
        </section>
      </div>
    </>
  );
};

export default () => <AuthIndex Component={Account} />