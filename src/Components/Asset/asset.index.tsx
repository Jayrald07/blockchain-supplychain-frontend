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

const NewAsset = ({
  handleClose,
  assetId,
  action,
}: {
  handleClose: any;
  assetId: string;
  action: string;
}) => {
  const [assetName, setAssetName] = useState("");
  const [description, setDescription] = useState("");

  const api = axios.create({ baseURL: "http://localhost:8081" });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (action === "update") {
      const { data } = await api.put("/asset", {
        asset_id: assetId,
        asset_name: assetName,
        asset_description: description,
      });

      if (data.message === "Asset updated!") {
        setAssetName("");
        setDescription("");
        handleClose();
      }
    } else {
      const { data } = await api.post(
        "/asset",
        {
          asset_name: assetName,
          tags: [],
          asset_description: description,
        },
        {
          headers: {
            Authorization: `Basic ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.message === "asset created") {
        setAssetName("");
        setDescription("");
        handleClose();
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (assetId) {
        const { data } = await api.get(`/asset/${assetId}`);
        setAssetName(data.asset_name);
        setDescription(data.asset_description);
      } else {
        setAssetName("");
        setDescription("");
      }
    })();
  }, []);

  return (
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
  );
};

export default () => {
  const [searchText, setSearchText] = useState("");
  const [assets, setAssets] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [action, setAction] = useState("");
  const [toDelete, setToDelete] = useState("");
  const [isAlert, setIsAlert] = useState(false);

  const api = axios.create({ baseURL: "http://localhost:8081" });

  const handleUpdate = (assetId: string) => {
    setSelectedAssetId(assetId);
    setAction("update");
    setIsModal(true);
  };

  const handleRemove = (assetId: string) => {
    console.log(assetId);
    setToDelete(assetId);
    setIsAlert(true);
  };

  const handleRemoveAsset = async () => {
    const { data } = await api.delete(`/asset/${toDelete}`);

    if (data.message === "Asset deleted!") {
      setIsAlert(false);
      setToDelete("");
    }
  };

  const handleView = (assetId: string) => {
    setSelectedAssetId(assetId);
    setAction("view");
    setIsModal(true);
  };

  const handleSearch = async (e: any) => {
    const value = e.target.value;
    const { data } = await api.get(`/search/asset/${value ? value : "all"}`);
    setAssets(data.asset);
    setSearchText(value);
  };

  useEffect(() => {
    api.get(`/assets?page=1`).then(({ data }) => {
      setAssets(data.assets);
    });
  }, [isModal, isAlert]);

  return (
    <main className="bsc-asset">
      <NavbarIndex />
      <div>
        <HeaderbarIndex />
        <section>
          <h1>Manage Assets</h1>
          <section>
            <InputIndex
              icon={<FontAwesomeIcon icon={faSearch} />}
              label="Search Asset"
              placeholder=""
              type="text"
              value={searchText}
              handler={handleSearch}
            />
            <span></span>
            <span></span>
            <button
              className="asset-create"
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
            handleRemove={handleRemove}
            handleView={handleView}
          />
        </section>
      </div>
      {isAlert ? (
        <AlertIndex
          content="Are you sure to remove?"
          handleOk={handleRemoveAsset}
          handleCancel={() => {
            setToDelete("");
            setIsAlert(false);
          }}
        />
      ) : null}
      {isModal ? (
        <ModalIndex
          assetId={selectedAssetId}
          action={action}
          Component={NewAsset}
          handleClose={() => {
            setSelectedAssetId("");
            setIsModal(false);
          }}
        />
      ) : null}
    </main>
  );
};
