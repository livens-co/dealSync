import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { RootState, AppDispatch } from "../../store";
import { Contract, Product } from "../../types";
import {
  updateContract,
  updateProductStatus,
  addProductToContract,
} from "../../store/contractsSlice";
import { v4 as uuidv4 } from "uuid";
import "./style.scss";

const EditContractPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const contracts = useSelector(
    (state: RootState) => state.contracts.contracts
  );
  const [contract, setContract] = useState<Contract | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [productStatus, setProductStatus] = useState<{ [key: string]: string }>(
    {}
  );
  const [newProductName, setNewProductName] = useState<string>("");
  const [newProductSupplier, setNewProductSupplier] = useState<string>("");

  useEffect(() => {
    const foundContract = contracts.find((c) => c.id === id);
    if (foundContract) {
      setContract(foundContract);
      setDeliveryDate(foundContract.rok_isporuke);
      setStatus(foundContract.status);
      const initialProductStatus = foundContract.proizvodi.reduce(
        (acc, product) => {
          acc[product.id] = product.status;
          return acc;
        },
        {} as { [key: string]: string }
      );
      setProductStatus(initialProductStatus);
    }
  }, [id, contracts]);

  const handleProductStatusChange = (productId: string, newStatus: string) => {
    setProductStatus((prevStatus) => ({
      ...prevStatus,
      [productId]: newStatus,
    }));
  };

  const handleAddProduct = () => {
    if (newProductName && newProductSupplier) {
      const newProduct: Product = {
        id: uuidv4(),
        naziv: newProductName,
        dobavljac: newProductSupplier,
        status: "KREIRANO",
      };
      dispatch(
        addProductToContract({ contractId: contract!.id, product: newProduct })
      );
      setProductStatus((prevStatus) => ({
        ...prevStatus,
        [newProduct.id]: "KREIRANO",
      }));
      setNewProductName("");
      setNewProductSupplier("");
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (status === "ISPORUČENO") {
      const allProductsShipped = contract!.proizvodi.every(
        (product) => productStatus[product.id] === "ISPORUČENO"
      );
      if (!allProductsShipped) {
        alert(
          "Status se ne može promijeniti u ISPORUČENO ako svi proizvodi nisu isporučeni."
        );
        return;
      }
    }

    const updates: Partial<Contract> = {};
    if (contract!.rok_isporuke !== deliveryDate) {
      updates.rok_isporuke = deliveryDate;
    }
    if (contract!.status !== status) {
      updates.status = status;
    }

    if (Object.keys(updates).length > 0) {
      dispatch(updateContract({ id: contract!.id, updates }));
    }

    Object.keys(productStatus).forEach((productId) => {
      if (
        contract!.proizvodi.find((p) => p.id === productId)!.status !==
        productStatus[productId]
      ) {
        dispatch(
          updateProductStatus({
            contractId: contract!.id,
            productId,
            status: productStatus[productId],
          })
        );
      }
    });

    navigate("/");
  };

  if (!contract) {
    return <div>Ugovor nije pronađen</div>;
  }

  return (
    <div className="editContractPage">
      <header>
        <h2>Uredi ugovor - {contract.broj_ugovora}</h2>
        <Link to={`/contracts/${id}`}>Natrag</Link>
      </header>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="inputField">
          <label htmlFor="rok_isporuke">Rok isporuke:</label>
          <input
            type="date"
            id="rok_isporuke"
            value={deliveryDate}
            onChange={(e) => {
              setDeliveryDate(e.target.value);
            }}
            disabled={contract.status === "ISPORUČENO"}
          />
        </div>
        <div className="inputField">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
            }}
          >
            <option value="KREIRANO" disabled={contract.status !== "KREIRANO"}>
              Kreirano
            </option>
            <option
              value="NARUČENO"
              disabled={contract.status === "ISPORUČENO"}
            >
              Naručeno
            </option>
            <option
              value="ISPORUČENO"
              disabled={contract.status !== "NARUČENO"}
            >
              Isporučeno
            </option>
          </select>
        </div>
        <hr />
        <div className="productTable">
          <h3>Proizvodi</h3>

          <table>
            <thead>
              <tr>
                <th>Naziv</th>
                <th>Dobavljač</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {contract.proizvodi.map((product) => (
                <tr key={product.id}>
                  <td>{product.naziv}</td>
                  <td>{product.dobavljac}</td>
                  <td>
                    <select
                      value={productStatus[product.id]}
                      onChange={(e) =>
                        handleProductStatusChange(product.id, e.target.value)
                      }
                    >
                      <option
                        value="KREIRANO"
                        disabled={product.status !== "KREIRANO"}
                      >
                        Kreirano
                      </option>
                      <option
                        value="NARUČENO"
                        disabled={product.status === "ISPORUČENO"}
                      >
                        Naručeno
                      </option>
                      <option
                        value="ISPORUČENO"
                        disabled={product.status !== "NARUČENO"}
                      >
                        Isporučeno
                      </option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {contract.status !== "ISPORUČENO" && (
          <div className="addProduct">
            <h4>Dodaj proizvod</h4>
            <div className="row">
              <input
                type="text"
                placeholder="Naziv proizvoda"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Dobavljač"
                value={newProductSupplier}
                onChange={(e) => setNewProductSupplier(e.target.value)}
              />
              <button type="button" onClick={handleAddProduct}>
                Dodaj proizvod
              </button>
            </div>
          </div>
        )}
        {contract.status !== "ISPORUČENO" && (
          <button type="submit">Spremi promjene</button>
        )}
      </form>
    </div>
  );
};

export default EditContractPage;
