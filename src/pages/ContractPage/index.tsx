import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { RootState } from "../../store";
import { Contract, Product } from "../../types";
import Table from "../../components/Table";
import "./style.scss";

const ContractPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [contract, setContract] = useState<Contract | null>(null);
  const contracts = useSelector(
    (state: RootState) => state.contracts.contracts
  );

  useEffect(() => {
    const foundContract = contracts.find((c) => c.id === id);
    if (foundContract) {
      setContract(foundContract);
    }
  }, [id, contracts]);

  if (!contract) {
    return <div>Ugovor nije pronađen</div>;
  }

  const columns = [
    { header: "Proizvod", accessor: "naziv" as keyof Product },
    { header: "Dobavljač", accessor: "dobavljac" as keyof Product },
    { header: "Status", accessor: "status" as keyof Product },
  ];

  return (
    <div className="contractPage">
      <header>
        <h2>Ugovor - {contract.broj_ugovora}</h2>
        <Link to={`/contracts/${id}/edit`}>Uredi</Link>
      </header>
      <hr />
      <div className="contractData">
        <p>
          <strong>Kupac:</strong> {contract.kupac}
        </p>
        <p>
          <strong>Broj ugovora:</strong> {contract.broj_ugovora}
        </p>
        <p>
          <strong>Datum akontacije:</strong>{" "}
          {format(new Date(contract.datum_akontacije), "dd.MM.yyyy.")}
        </p>
        <p>
          <strong>Rok isporuke:</strong>{" "}
          {format(new Date(contract.rok_isporuke), "dd.MM.yyyy.")}
        </p>
        <p>
          <strong>Status:</strong> {contract.status}
        </p>
      </div>
      <hr />
      <div className="productTable">
        <h4>Proizvodi:</h4>
        <Table<Product> data={contract.proizvodi} columns={columns} />
      </div>
    </div>
  );
};

export default ContractPage;
