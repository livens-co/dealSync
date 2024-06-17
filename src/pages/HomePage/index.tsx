// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { IoSearchOutline } from "react-icons/io5";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "../../store";
// import { setContracts } from "../../store/contractsSlice";
// import { fetchContracts } from "../../services/apiservice";
// import { Contract } from "../../types";
// import Table from "../../components/Table";
// import "./style.scss";

// type Stringify<T> = {
//   [K in keyof T]: T[K] extends object ? string : T[K];
// };

// const HomePage: React.FC = () => {
//   const dispatch: AppDispatch = useDispatch();
//   const contracts = useSelector(
//     (state: RootState) => state.contracts.contracts
//   );
//   const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
//   const [nameFilter, setNameFilter] = useState<string>("");
//   const [statusFilter, setStatusFilter] = useState<string>("");
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const contractsPerPage = 10;
//   const navigate = useNavigate();

//   useEffect(() => {
//     const getContracts = async () => {
//       try {
//         const data = await fetchContracts();
//         dispatch(setContracts(data));
//       } catch (error) {
//         console.error("Failed to fetch contracts", error);
//       }
//     };

//     if (contracts.length === 0) {
//       getContracts();
//     } else {
//       setFilteredContracts(contracts);
//     }
//   }, [dispatch, contracts.length, contracts]);

//   useEffect(() => {
//     filterContracts();
//   }, [nameFilter, statusFilter, contracts]);

//   const filterContracts = () => {
//     let filtered = contracts;

//     if (nameFilter) {
//       filtered = filtered.filter((contract) =>
//         contract.kupac.toLowerCase().includes(nameFilter.toLowerCase())
//       );
//     }

//     if (statusFilter) {
//       if (statusFilter === "ACTIVE") {
//         filtered = filtered.filter(
//           (contract) =>
//             contract.status === "KREIRANO" || contract.status === "NARUČENO"
//         );
//       } else if (statusFilter === "INACTIVE") {
//         filtered = filtered.filter(
//           (contract) => contract.status === "ISPORUČENO"
//         );
//       }
//     }

//     setFilteredContracts(filtered);

//     // Reset to first page if filtered results are fewer than the items per page
//     if (filtered.length <= contractsPerPage) {
//       setCurrentPage(1);
//     }
//   };

//   const handleRowClick = (id: string) => {
//     navigate(`/contracts/${id}`);
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   // Pagination
//   const indexOfLastContract = currentPage * contractsPerPage;
//   const indexOfFirstContract = indexOfLastContract - contractsPerPage;
//   const currentContracts = filteredContracts.slice(
//     indexOfFirstContract,
//     indexOfLastContract
//   );
//   const totalPages = Math.ceil(filteredContracts.length / contractsPerPage);

//   const columns = [
//     { header: "Kupac", accessor: "kupac" as keyof Contract },
//     { header: "Broj ugovora", accessor: "broj_ugovora" as keyof Contract },
//     { header: "Rok isporuke", accessor: "rok_isporuke" as keyof Contract },
//     { header: "Status", accessor: "status" as keyof Contract },
//   ];

//   return (
//     <div className="homePage">
//       <header>
//         <h2>Ugovori</h2>
//         <Link to="/contracts/new">Novi ugovor</Link>
//       </header>
//       <div className="filterBar">
//         <div className="searchBar">
//           <IoSearchOutline />
//           <input
//             type="text"
//             placeholder="Pretraži..."
//             value={nameFilter}
//             onChange={(e) => setNameFilter(e.target.value)}
//           />
//         </div>
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//         >
//           <option value="">Svi statusi</option>
//           <option value="ACTIVE">Aktivni</option>
//           <option value="INACTIVE">Neaktivni</option>
//         </select>
//       </div>
//       <Table
//         data={
//           currentContracts.map((contract) => ({
//             ...contract,
//             proizvodi: JSON.stringify(contract.proizvodi),
//           })) as Stringify<Contract>[]
//         }
//         columns={columns}
//         onRowClick={(contract) => handleRowClick(contract.id as string)}
//       />
//       {totalPages > 1 && (
//         <div className="pagination">
//           {Array.from({ length: totalPages }, (_, i) => (
//             <button
//               key={i + 1}
//               onClick={() => handlePageChange(i + 1)}
//               className={i + 1 === currentPage ? "active" : ""}
//             >
//               {i + 1}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default HomePage;

import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { setContracts } from "../../store/contractsSlice";
import { fetchContracts } from "../../services/apiservice";
import { Contract } from "../../types";
import Table from "../../components/Table";
import "./style.scss";

type Stringify<T> = {
  [K in keyof T]: T[K] extends object ? string : T[K];
};

const HomePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const contracts = useSelector((state: RootState) => state.contracts.contracts);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const contractsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const getContracts = async () => {
      try {
        const data = await fetchContracts();
        dispatch(setContracts(data));
      } catch (error) {
        console.error("Failed to fetch contracts", error);
      }
    };

    if (contracts.length === 0) {
      getContracts();
    } else {
      setFilteredContracts(contracts);
    }
  }, [dispatch, contracts.length, contracts]);

  const filterContracts = useCallback(() => {
    let filtered = contracts;

    if (nameFilter) {
      filtered = filtered.filter((contract) =>
        contract.kupac.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (statusFilter) {
      if (statusFilter === "ACTIVE") {
        filtered = filtered.filter(
          (contract) =>
            contract.status === "KREIRANO" || contract.status === "NARUČENO"
        );
      } else if (statusFilter === "INACTIVE") {
        filtered = filtered.filter(
          (contract) => contract.status === "ISPORUČENO"
        );
      }
    }

    setFilteredContracts(filtered);

    // Reset to first page if filtered results are fewer than the items per page
    if (filtered.length <= contractsPerPage) {
      setCurrentPage(1);
    }
  }, [contracts, nameFilter, statusFilter]);

  useEffect(() => {
    filterContracts();
  }, [nameFilter, statusFilter, contracts, filterContracts]);

  const handleRowClick = (id: string) => {
    navigate(`/contracts/${id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Pagination
  const indexOfLastContract = currentPage * contractsPerPage;
  const indexOfFirstContract = indexOfLastContract - contractsPerPage;
  const currentContracts = filteredContracts.slice(
    indexOfFirstContract,
    indexOfLastContract
  );
  const totalPages = Math.ceil(filteredContracts.length / contractsPerPage);

  const columns = [
    { header: "Kupac", accessor: "kupac" as keyof Contract },
    { header: "Broj ugovora", accessor: "broj_ugovora" as keyof Contract },
    { header: "Rok isporuke", accessor: "rok_isporuke" as keyof Contract },
    { header: "Status", accessor: "status" as keyof Contract },
  ];

  return (
    <div className="homePage">
      <header>
        <h2>Ugovori</h2>
        <Link to="/contracts/new">Novi ugovor</Link>
      </header>
      <div className="filterBar">
        <div className="searchBar">
          <IoSearchOutline />
          <input
            type="text"
            placeholder="Pretraži..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Svi statusi</option>
          <option value="ACTIVE">Aktivni</option>
          <option value="INACTIVE">Neaktivni</option>
        </select>
      </div>
      <Table
        data={
          currentContracts.map((contract) => ({
            ...contract,
            proizvodi: JSON.stringify(contract.proizvodi),
          })) as Stringify<Contract>[]
        }
        columns={columns}
        onRowClick={(contract) => handleRowClick(contract.id as string)}
      />
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={i + 1 === currentPage ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
