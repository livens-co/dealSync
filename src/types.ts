export interface Product {
  id: string;
  naziv: string;
  dobavljac: string;
  status: string;
}

export interface Contract {
  id: string;
  kupac: string;
  broj_ugovora: string;
  datum_akontacije: string;
  rok_isporuke: string;
  status: string;
  proizvodi: Product[];
}
