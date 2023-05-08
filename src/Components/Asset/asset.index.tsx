import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import InputIndex from "../Input/input.index";
import "./asset.index.css";
import {
  faChevronDown,
  faPlus,
  faSearch,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Table from "../Table/table.index";
import axios from "axios";
import NavbarIndex from "../Navbar/navbar.index";
import HeaderbarIndex from "../HeaderBar/headerbar.index";
import ModalIndex from "../Modal/modal.index";
import TextareaIndex from "../Input/textarea.index";
import ButtonIndex from "../Button/button.index";
import AlertIndex from "../Alert/alert.index";
import { Action, host, port, validateAndReturn } from "../../utilities";
import AuthIndex from "../Auth/auth.index";
import ChannelIndex from "../Channel/channel.index";
import { TagService } from "../../services/tags";
import { KeyValue, Response, Tag } from "../../typedef";
import { useNavigate } from "react-router-dom";
import useChannel from "../../hooks/useChannel";
import useVerified from "../../hooks/useVerified";


const NewAsset = ({
  handleClose,
  assetId,
  action,
  channelId
}: {
  handleClose: any;
  assetId: string;
  action: string;
  channelId: string
}) => {
  const [assetName, setAssetName] = useState("");
  const [description, setDescription] = useState("");
  const [inSubmission, setIsSubmission] = useState(false);
  const [tags, setTags] = useState<KeyValue[]>([]);
  const [selectedTags, setSelectedTags] = useState<KeyValue[]>([]);

  const api = axios.create({ baseURL: `${host}:${port}` });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmission(true)
    if (action === "update") {
      const { data } = await api.post("/chaincode", {
        asset_id: assetId,
        asset_name: assetName,
        asset_description: description,
        channelId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (data.message === "Asset updated!") {
        setAssetName("");
        setDescription("");
        handleClose('returned');
        setIsSubmission(false);
        setSelectedTags([]);
      }
    } else {
      const { data } = await api.post(
        "/chaincode",
        {
          action: Action.CREATE,
          args: {
            asset_name: assetName,
            tags: selectedTags,
            asset_description: description,
            channelId
          }
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (data.message === "Done" && data.details.message === 'Done') {
        setAssetName("");
        setDescription("");
        handleClose();
        setIsSubmission(false);
        setSelectedTags([])
      }
    }
  };

  const handleTags = async () => {
    try {
      const data: Response<Tag[]> = await TagService.getTags();

      if (data.message === "Done") {
        setTags(data.details.map((_) => {
          return {
            key: _.tag_key,
            values: _.tag_options,
            default: _.tag_default_value,
            type: _.tag_type
          }
        }))
      }

    } catch (err: any) {
      console.log(err)
    }
  }

  const handleTagsAdd = () => {
    setSelectedTags([...selectedTags, { key: tags[0].key, value: tags[0].default }])
  }

  const handleTagDefault = (key: string) => {
    let filteredTags = tags.filter(tag => tag.key === key);
    if (filteredTags.length) return filteredTags[0].default;
    else return '';
  }

  const handleTagOptions = (key: string): string[] => {
    let filteredTags = tags.filter(tag => tag.key === key);
    if (filteredTags.length) return filteredTags[0].values as string[];
    else return [];
  }

  const handleTagType = (key: string): string => {
    let filteredTags = tags.filter(tag => tag.key === key);
    if (filteredTags.length) return filteredTags[0].type as string;
    else return 'TEXT';
  }

  const handleSelectedTagKey = (key: string, index: number) => {
    setSelectedTags(prevState => {
      let _selectedTags = prevState;
      _selectedTags[index].key = key;
      _selectedTags[index].value = handleTagDefault(key);
      return [..._selectedTags]
    });
  }

  const handleSelectedTagValue = (value: string, index: number) => {
    setSelectedTags(prevState => {
      let _selectedTags = prevState;
      _selectedTags[index].value = value;
      return [..._selectedTags]
    })
  }

  const handleSelectedTagDelete = (index: number) => {
    setSelectedTags(prevState => {
      let _selectedTags = prevState;
      _selectedTags.splice(index, 1);
      return [..._selectedTags]
    })
  }

  useEffect(() => {
    handleTags();
    (async () => {
      if (assetId) {
        const { data } = await api.get(`/asset/${assetId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        setAssetName(data.asset_name);
        setDescription(data.asset_description);


        let { data: dataTag } = await api.post("/chaincode", {
          action: Action.READ,
          args: {
            assetId: data.asset_uuid,
            channelId
          }
        },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })

        setSelectedTags(JSON.parse(dataTag.details.details.details.tags))

      } else {
        setAssetName("");
        setDescription("");
      }


    })();
  }, []);

  return (<>
    <form onSubmit={handleSubmit}>
      <InputIndex
        disabled={action === "view" ? true : false}
        label="Asset Name"
        value={assetName}
        placeholder="Package 1"
        type="text"
        handler={(e: any) => {
          setAssetName(e.target.value);
        }}
      />
      {
        action !== "view" ?
          <h1 className="text-sm mb-2">Details</h1> : null
      }
      {
        selectedTags.map((selectedTag, index) => {
          return <div key={`${selectedTag.type}-${index}`}>
            <section className="grid grid-cols-2 pr-2">
              {
                action === "view"
                  ? <label className="text-xs block mb-2">{selectedTag.key}</label>
                  : <>
                    <select required key={`${selectedTag.key}-${index}`} onChange={(e) => handleSelectedTagKey(e.target.value, index)} value={selectedTag.key} className="outline-none text-xs bg-white">
                      {
                        tags.map((tag: KeyValue, index: number) => {
                          return <option key={`${selectedTag.key}-${index}`} value={tag.key}>{tag.key}</option>
                        })
                      }
                    </select>
                    <a href="#" className="justify-self-end" onClick={() => handleSelectedTagDelete(index)}>
                      <FontAwesomeIcon icon={faTrash} size="xs" className="text-red-300" />
                    </a>
                  </>
              }
            </section>
            {
              handleTagType(selectedTag.key) === "OPTIONS" ?
                <select disabled={action === "view" ? true : false} required onChange={(e) => handleSelectedTagValue(e.target.value, index)} value={selectedTag.value ? selectedTag.value : handleTagDefault(selectedTag.key)} className="outline-none block w-full border font-thin text-sm px-3 py-2 bg-white mb-2">
                  {
                    handleTagOptions(selectedTag.key).map((value: string) => {
                      return <option key={`${selectedTag.key}-${index}-${value}`} value={value}>{value}</option>
                    })
                  }
                </select>
                : null
            }
            {
              handleTagType(selectedTag.key) === "MULTITEXT" ?
                <textarea disabled={action === "view" ? true : false} required rows={5} onChange={(e) => handleSelectedTagValue(e.target.value, index)} value={selectedTag.value ? selectedTag.value : ''} className="outline-none block w-full border font-thin text-sm px-3 py-2 mb-2" ></textarea> : null
            }
            {
              ["PESO", "NUMBER", "TEXT", "QUANTITY", "DATE"].includes(handleTagType(selectedTag.key)) ?
                <input disabled={action === "view" ? true : false} required type={handleTagType(selectedTag.key) === "DATE" ? "date" : "text"} onChange={(e) => handleSelectedTagValue(e.target.value, index)} value={selectedTag.value ? selectedTag.value : ''} className="outline-none block w-full border font-thin text-sm px-3 py-2 mb-2" /> : null
            }
          </div>
        })
      }
      {
        action !== "view" ?
          <>
            <span onClick={handleTagsAdd} className="block border-dashed border-slate-300 border rounded text-xs text-center py-3 text-slate-300 mb-4 mt-4" ><FontAwesomeIcon icon={faPlus} size="xs" /> Add Metadata</span>
            {action !== "view" ? (
              <ButtonIndex label={inSubmission ? '' : action === "update" ? "Update" : "Save"} Icon={inSubmission ? <FontAwesomeIcon className="animate-spin" icon={faSpinner} /> : undefined} />
            ) : null}
          </>
          : null
      }
    </form >
  </>
  );
};

const Asset = () => {
  const [searchText, setSearchText] = useState("");
  const [assets, setAssets] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [action, setAction] = useState("");
  const [toDelete, setToDelete] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [orgType, setOrgType] = useState("");
  const [channel, setChannel] = useState('');
  const navigate = useNavigate();
  const channels = useChannel();
  const [emailVerified, reloadVar, reloader] = useVerified();

  const api = axios.create({ baseURL: `${host}:${port}` });

  const handleUpdate = (assetId: string) => {
    setSelectedAssetId(assetId);
    setAction("update");
    setIsModal(true);
  };

  const handleView = (assetId: string) => {
    setSelectedAssetId(assetId);
    setAction("view");
    setIsModal(true);
  };

  const handleSearch = async (e: any) => {
    const value = e.target.value;
    // const { data } = await api.get(`/search/asset/${value ? value : "all"}`, {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`
    //   }
    // });
    // setAssets(data.asset);
    setSearchText(value);
  };

  const handleRedirectConnection = () => {
    navigate("/connections")
  }


  useEffect(() => {
    if (channel.trim()) {
      api.post('/chaincode', {
        'action': Action.ASSETS,
        'args': {
          'channelId': channel
        }
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }).then(({ data }) => {
        if (data.message === 'Done') setAssets(data.details.details)
      }).catch(console.error);
    }
  }, [channel, isModal]);

  useEffect(() => {
    api.get("/account", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then(({ data }) => {
      setOrgType(data.organization_type_id.organization_type_name)
    })

  }, [isModal, isAlert]);

  return (
    <>
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
      <main className="grid grid-cols-5 h-full">
        <NavbarIndex />
        <div className="col-span-5 sm:col-span-5 md:col-span-4">
          <HeaderbarIndex />
          <section className="px-10 lg:px-28 md:px-20 sm:px-10 xl:px-24 pt-20">

            {
              channels.length && channels[0].trim()
                ?
                <>
                  <h1 className="text-2xl mb-5">Manage Assets</h1>
                  <section className="grid grid-cols-4 items-end gap-x-4">
                    <InputIndex
                      icon={<FontAwesomeIcon icon={faSearch} />}
                      label="Search Asset"
                      placeholder=""
                      type="text"
                      value={searchText}
                      handler={handleSearch}
                    />
                    <section className="col-span-2">
                      <label className="text-sm mb-2 block">Channels</label>
                      <ChannelIndex handleValue={(value) => setChannel(value)} />
                    </section>
                    <button
                      className="border rounded py-2 px-3.5 hover:bg-gray-100 text-xs mb-4"
                      onClick={() => {
                        setAction("");
                        setIsModal(true);
                      }}
                    >
                      <span>Create New Asset</span> <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </section>
                  <Table
                    rows={assets}
                    handleUpdate={handleUpdate}
                    handleView={handleView}
                  />
                </>
                :
                <div className="text-center grid ">
                  <h1>You don't have any connections to other organizations.</h1>
                  <small className="font-light block mb-3">Please connect to atleast 1 organization to show this page.</small>
                  <button className="border rounded text-xs p-2 px-4 justify-self-center hover:bg-slate-100" onClick={handleRedirectConnection}>Create connection</button>
                </div>
            }


          </section>
        </div>
        {
          isAlert ? <AlertIndex content="Asset created" title="Success" type="success" handleClose={() => setIsAlert(false)} /> : null
        }
        {isModal ? (
          <ModalIndex
            assetId={selectedAssetId}
            action={action}
            channelId={channel}
            Component={NewAsset}
            handleClose={(response: string) => {
              setSelectedAssetId("");
              setIsModal(false);
              setIsAlert(response === 'returned' ? true : false);
            }}
          />
        ) : null}
      </main>
    </>
  );
};

export default () => <AuthIndex Component={Asset} />