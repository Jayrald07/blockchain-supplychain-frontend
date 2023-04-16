import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import InputIndex from "../Input/input.index";
import "./asset.index.css";
import {
  faChevronDown,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Table from "../Table/table.index";
import axios from "axios";
import NavbarIndex from "../Navbar/navbar.index";
import HeaderbarIndex from "../HeaderBar/headerbar.index";
import ModalIndex from "../Modal/modal.index";
import TextareaIndex from "../Input/textarea.index";
import ButtonIndex from "../Button/button.index";
import AlertIndex from "../Alert/alert.index";
import { Action, host, port } from "../../utilities";
import AuthIndex from "../Auth/auth.index";
import ChannelIndex from "../Channel/channel.index";


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

  const api = axios.create({ baseURL: `${host}:${port}` });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

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

      console.log(data)

      if (data.message === "Asset updated!") {
        setAssetName("");
        setDescription("");
        handleClose();
      }
    } else {
      const { data } = await api.post(
        "/chaincode",
        {
          action: Action.CREATE,
          args: {
            asset_name: assetName,
            tags: [],
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
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (assetId) {
        const { data } = await api.get(`/asset/${assetId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setAssetName(data.asset_name);
        setDescription(data.asset_description);
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
      <TextareaIndex
        disabled={action === "view" ? true : false}
        value={description}
        label="Description (Optional)"
        handler={(e: any) => {
          setDescription(e.target.value);
        }}
      />
      {action !== "view" ? (
        <ButtonIndex label={action === "update" ? "Update" : "Save"} />
      ) : null}
    </form>
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
    const { data } = await api.get(`/search/asset/${value ? value : "all"}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    setAssets(data.asset);
    setSearchText(value);
  };


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
    <main className="grid grid-cols-5 h-full">
      <NavbarIndex />
      <div className="col-span-4">
        <HeaderbarIndex />
        <section className="px-32 pt-20">
          <h1 className="text-2xl mb-5">Manage Assets</h1>
          <section className="grid grid-cols-4 items-center gap-x-4">
            <InputIndex
              icon={<FontAwesomeIcon icon={faSearch} />}
              label="Search Asset"
              placeholder=""
              type="text"
              value={searchText}
              handler={handleSearch}
            />
            <ChannelIndex handleValue={(value) => setChannel(value)} />
            <span></span>
            <button
              className="border rounded py-2 px-3.5 hover:bg-gray-100 text-xs"
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
        </section>
      </div>
      {
        isAlert ? <AlertIndex content="Asset created" title="Success" type="success" handleClose={() => setIsAlert(false)} /> : null
      }

      {/* {isAlert ? (
          <AlertIndex

            content="Are you sure to remove?"
            handleClose={() => {
              setToDelete("");
              setIsAlert(false);
            }}
          />
        ) : null} */}
      {isModal ? (
        <ModalIndex
          assetId={selectedAssetId}
          action={action}
          channelId={channel}
          Component={NewAsset}
          handleClose={() => {
            setSelectedAssetId("");
            setIsModal(false);
            setIsAlert(true)
          }}
        />
      ) : null}
    </main>
  );
};

export default () => <AuthIndex Component={Asset} />