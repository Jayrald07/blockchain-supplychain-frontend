import React, { FormEventHandler, KeyboardEventHandler, ReactNode, useContext, useEffect, useState } from "react"
import HeaderbarIndex from "../HeaderBar/headerbar.index"
import NavbarIndex from "../Navbar/navbar.index"
import axios from "axios"
import { host, port } from "../../utilities";
import ButtonIndex from "../Button/button.index";
import { faLock, faPesoSign, faPlus, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RmodalIndex from "../RModal/rmodal.index";
import AlertIndex from "../Alert/alert.index";
import SettingsContextIndex from "./settings.context.index";
import PromptIndex from "../Prompt/prompt.index";
import useVerified from "../../hooks/useVerified";
import { useNavigate } from "react-router-dom";

const api = axios.create({ baseURL: `${host}:${port}` });

const TagForm = ({ handleResponse, data }: { handleResponse: (responseType: any) => void, data: any }) => {

  const [key, setKey] = useState("");
  const [type, setType] = useState("NUMBER");
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const [defaultValue, setDefaultValue] = useState("");
  const [tagId, setTagId] = useState("");
  const refreshTagsContext = useContext(SettingsContextIndex);


  const handleReset = () => {
    setKey("");
    setType("NUMBER");
    setOptions([]);
    setDefaultValue("");
  }

  const handleOptions = (value: string, index: number) => {
    let _opt = [...options];

    _opt[index].value = value;

    setOptions(_opt);
  }

  const handleOptionsPush = () => {
    const _opt = [...options, { value: "" }];

    setOptions(_opt);
  }

  const handleOptionsDelete = (index: number) => {
    const _opt = [...options];

    _opt.splice(index, 1);

    setOptions(_opt);

  }

  const handleTagSave = async (e: any) => {
    let tag_options = options.map((item) => item.value)
    e.preventDefault();
    try {
      const { data } = await api.post("/tag", {
        tags: [
          {
            tag_key: key,
            tag_type: type.trim() ? type : "NUMBER",
            tag_default_value: type === "OPTIONS" ? defaultValue.trim() ? defaultValue : tag_options[0] : defaultValue,
            tag_options,
            tagId,
          }
        ]
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
      )

      handleResponse({ message: data.message, details: data.details })
      handleReset();
    } catch (error: any) {
      handleResponse({ message: "Error", details: error.message })
    }

    refreshTagsContext();
  }

  useEffect(() => {
    if (data) {
      const { tag_key, tag_default_value, tag_type, tag_options, _id } = data;
      setType(tag_type);
      setKey(tag_key);
      setDefaultValue(tag_default_value);
      setOptions(tag_options.map((option: string) => ({ value: option })));
      setTagId(_id);
    } else handleReset();
  }, []);

  return <div className="text-sm rounded-sm mb-2">
    <form onSubmit={handleTagSave}>
      <div className="py-4">
        <div className="flex flex-col mb-3">
          <label className="mb-2">Key</label>
          <input required type="text" placeholder="" value={key} onChange={(e) => setKey(e.target.value)} className="outline-none border py-2 px-3 font-light" />
        </div>
        <div className="flex flex-col mb-3">
          <label className="mb-2">Type</label>
          <select required value={type} className="border py-2 px-3 outline-none bg-white" onChange={(e) => {
            setType(e.target.value)
            setDefaultValue("")
          }}>
            <option value="NUMBER">NUMBER</option>
            <option value="PESO">PESO</option>
            <option value="TEXT">TEXT</option>
            <option value="DATE">DATE</option>
            <option value="MULTITEXT">MULTITEXT</option>
            <option value="QUANTITY">QUANTITY</option>
            <option value="OPTIONS">OPTIONS</option>
          </select>
        </div>
        {
          type === "OPTIONS" ?
            <div className="flex flex-col mb-3">
              <label className="mb-2">Options</label>
              {
                options.map((option, index) => {
                  return <div key={`index-${index}`} className="flex items-center border mb-2"><input type="text" required className="outline-none py-2 px-3 font-light w-full" placeholder={`Option ${index + 1}`} value={option.value} onChange={(e) => handleOptions(e.target.value, index)} /><span className="px-3 py-1 text-red-300 cursor-pointer" onClick={() => handleOptionsDelete(index)}><FontAwesomeIcon icon={faTrash} size="xs" /></span></div>
                })
              }
              <span onClick={handleOptionsPush} className="text-center p-2 border border-dashed text-xs text-slate-300 cursor-default mt-3"><FontAwesomeIcon icon={faPlus} size="xs" /> Add option</span>
            </div>
            : null
        }
        <div className="flex flex-col">
          <label className="mb-2">Default Value</label>
          {
            type === "OPTIONS" ? <select className="border py-2 px-3 outline-none bg-white" onChange={(e) => setDefaultValue(e.target.value)} value={defaultValue}>
              {
                options.map(option => {
                  return option.value.trim() ? <option value={option.value} key={option.value}>{option.value}</option> : null
                })
              }
            </select> : null
          }
          {
            type === "QUANTITY" ? <input type="text" placeholder="" value={defaultValue} className="outline-none border py-2 px-3 font-light" onChange={(e) => {
              if (e.target.value.length === 0) setDefaultValue("")
              if (/^[0-9]+$/.test(e.target.value)) setDefaultValue(parseInt(e.target.value.trim()).toString())
            }} /> : null
          }
          {
            type === "PESO" ? <div className="flex items-center border"><span className="pl-3 pr-1"><FontAwesomeIcon icon={faPesoSign} size="sm" /></span><input type="text" placeholder="" value={defaultValue} className="outline-none py-2 px-3 font-light w-full" onChange={(e) => {
              let formatted = parseFloat(e.target.value.replace(/,/g, '')).toLocaleString('en-US')
              if (e.target.value.includes(".")) {
                setDefaultValue(e.target.value);
              }
              setDefaultValue(formatted);

            }} /> </div> : null
          }
          {
            type === "TEXT" ? <input type="text" placeholder="" value={defaultValue} className="outline-none border py-2 px-3 font-light" onChange={(e) => setDefaultValue(e.target.value)} /> : null
          }
          {
            type === "NUMBER" ? <input type="text" placeholder="" value={defaultValue} className="outline-none border py-2 px-3 font-light" onChange={(e) => {
              if (e.target.value.length === 0) setDefaultValue("")
              if (/^[0-9]+$/.test(e.target.value)) setDefaultValue(parseInt(e.target.value.trim()).toString())
            }} /> : null
          }
          {
            type === "DATE" ? <input type="date" placeholder="" value={defaultValue} className="outline-none border py-2 px-3 font-light" onChange={(e) => setDefaultValue(e.target.value)} /> : null
          }
          {
            type === "MULTITEXT" ? <textarea value={defaultValue} className="outline-none border rounded-sm py-2 px-3 font-light" rows={5} onChange={(e) => setDefaultValue(e.target.value)}></textarea> : null
          }
        </div>
      </div>
      <ButtonIndex handleClick={() => { }} label="Save" />

    </form>

  </div>
}

const TagMaker = ({ data }: { data: any }) => {
  const [isAlert, setIsAlert] = useState(false);
  const [alertType, setAlertType] = useState({ message: "Done", details: "" });

  const handleAlert = (responseType: any) => {
    setIsAlert(!isAlert);
    setAlertType(responseType)
  }

  return <section>
    {
      isAlert ?
        <AlertIndex type={alertType.message !== "Done" ? "error" : "success"} title={alertType.details} content={alertType.details} handleClose={handleAlert} />
        : null
    }
    <TagForm handleResponse={handleAlert} data={data} />
  </section>
}

export default () => {
  const [tags, setTags] = useState([]);
  const [tagModal, setTagModal] = useState(false);
  const [isPrompt, setIsPrompt] = useState(false);
  const [toDelete, setToDelete] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [alertResponse, setAlertResponse] = useState("Done");
  const [forUpdate, setForUpdate] = useState(-1);
  const [emailVerified, reloadVar, reloader] = useVerified();
  const navigate = useNavigate();

  const handleTags = () => {
    api.get('/tag', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(({ data }) => {
      if (data.message === "Done") setTags(data.details)
    }).catch(console.error);
  }

  const handlePromptResponse = async (response: string) => {

    try {
      if (response === "OK") {
        let { data } = await api.delete(`/tag/${toDelete}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (data.message === "Done") handleTags();
        setIsAlert(true);
        setAlertResponse(data.message);
      }
    } catch (error: any) {
      setIsAlert(true);
      setAlertResponse(error.message);
    } finally {
      setIsPrompt(!isPrompt)
    }

  }

  const handleTagDelete = (tagId: string) => {
    setToDelete(tagId);
    setIsPrompt(!isPrompt);
  }

  const handleTagUpdate = (tagIndex: number) => {
    setForUpdate(tagIndex);
    setTagModal(!tagModal);
  }

  useEffect(() => {
    handleTags();
  }, []);

  return <>
    {
      emailVerified === 'NOT VERIFIED'
        ? <div className="bg-red-500 text-center py-2">
          <small>Looks like your email is not verified yet. Go to your <a href="#"
            onClick={() => {
              navigate("/account");
            }}
            className="underline"
          >account</a> to verify</small>
        </div>
        : null
    }
    <div className="grid grid-cols-5 h-full text-slate-800">
      {
        isAlert ? <AlertIndex type={alertResponse === "Done" ? "success" : "error"} title={alertResponse === "Done" ? "Success!" : "Error!"} content={alertResponse === "Done" ? "Tag deleted successfully" : "Tag deletion failure"} handleClose={() => setIsAlert(!isAlert)} /> : null
      }
      {
        tagModal ?
          <SettingsContextIndex.Provider value={handleTags}>
            <RmodalIndex title="Add Metadata" Component={<TagMaker data={forUpdate >= 0 ? tags[forUpdate] : null} />} onClose={() => {
              setTagModal(!tagModal)
              setForUpdate(-1)
            }} />
          </SettingsContextIndex.Provider>
          : null
      }
      <NavbarIndex />
      <div className="col-span-5 sm:col-span-5 md:col-span-4">
        <HeaderbarIndex />
        {
          isPrompt ?
            <PromptIndex question="Are you sure to delete this tag?" description="This cannot be undone" buttons={["OK"]} onClose={() => setIsPrompt(!isPrompt)} handleClick={handlePromptResponse} /> : null
        }
        <div className="px-10 lg:px-44 md:px-20 sm:px-10 xl:px-56 py-20">
          <h1 className="text-2xl mb-5">Settings</h1>

          {
            emailVerified === 'LOADING'
              ? <div className="flex justify-center">
                <FontAwesomeIcon icon={faSpinner} size="xs" className="animate-spin" />
              </div>
              : emailVerified === 'VERIFIED'
                ? <>
                  <div className="flex items-center mb-2">
                    <h2 className="w-full">Metadata</h2>
                    <ButtonIndex handleClick={() => setTagModal(!tagModal)} Icon={<FontAwesomeIcon icon={faPlus} size="xs" />} />

                  </div>
                  <div className="overflow-x-auto">


                    <table className="w-full whitespace-nowrap border border-slate-100">
                      <thead className="bg-slate-100 text-sm text-slate-600 text-left">
                        <tr>
                          <th className="p-2">Key</th>
                          <th>Type</th>
                          <th>Default</th>
                          <th>Options</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm font-thin">
                        {
                          !tags.length
                            ? <tr className="hover:bg-slate-50 border-b border-b-slate-100">
                              <td className="p-2 text-center" colSpan={5}>No Metadata</td>
                            </tr> : null
                        }
                        {
                          tags.map((tag: any, index: number) => {
                            return <tr key={tag.tag_key} className={`${tag.organization_id === "SYSTEM" ? "bg-slate-50" : ''} hover:bg-slate-50 border-b border-b-slate-100`}>
                              <td className="py-2 px-2">{tag.tag_key}</td>
                              <td>{tag.tag_type}</td>
                              <td>{tag.tag_default_value ? tag.tag_default_value : "NONE"}</td>
                              <td>
                                {
                                  tag.tag_options.length ?
                                    <select required className="py-2 px-3 text-sm w-full bg-transparent  outline-none font-thin"> {
                                      tag.tag_options.map((tag_option: any) => {
                                        return <option key={tag_option} value={tag_option}>{tag_option}</option>
                                      })
                                    }
                                    </select>
                                    : "NONE"
                                }
                              </td>
                              <td className="text-center">
                                {
                                  tag.organization_id !== "SYSTEM" ?
                                    <>
                                      <a href="#" className="border rounded-sm py-1 px-2 hover:bg-slate-100 mr-2" onClick={() => handleTagUpdate(index)}>Update</a>
                                      <a href="#" className="border rounded-sm py-1 px-2 hover:bg-slate-100" onClick={() => handleTagDelete(tag._id)}>Delete</a>
                                    </>
                                    : <span className="text-slate-500"><FontAwesomeIcon icon={faLock} size="xs" /></span>
                                }
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
      </div>
    </div ></>
}