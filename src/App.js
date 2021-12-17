import React, { useEffect, useState } from "react";
import moment from "moment";
import api from "./services/api";
import "./App.css";

export default function App() {
  var getOneDay;
  const [day, setDay] = useState();
  const [period, setPeriod] = useState();
  const [formatFirstDay, setFormatFirstDay] = useState();
  const [formatOneDay, setFormatOneDay] = useState();
  const [selectValue, setSelectValue] = useState();
  const list = [
    {
      id: 0,
      name: "7 dias",
      value: moment(formatFirstDay).add(7, "days")._d.toLocaleDateString(),
    },
    {
      id: 1,
      name: "14 dias",
      value: moment(formatFirstDay).add(14, "days")._d.toLocaleDateString(),
    },
    {
      id: 2,
      name: "21 dias",
      value: moment(formatFirstDay).add(21, "days")._d.toLocaleDateString(),
    },
  ];

  function getDate(e) {
    getOneDay = e.target.value;
    setFormatOneDay(moment(`${getOneDay}`, "YYYY-MM-DD").format("MM-DD-YYYY"));
  }

  function getInitialDate(e) {
    const getFirstDay = e.target.value;
    setFormatFirstDay(
      moment(`${getFirstDay}`, "YYYY-MM-DD").format("MM-DD-YYYY")
    );
  }
  function getFinalDate(e) {
    setSelectValue(
      moment(`${e.target.value}`, "DD/MM/YYYY").format("MM-DD-YYYY")
    );
    console.log(list);
  }
  //cotação por dia
  useEffect(() => {
    api
      .get(
        `/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${formatOneDay}'&$top=100&$format=json`
      )
      .then((response) => setDay(response.data))
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }, [formatOneDay]);

  //cotação por período
  useEffect(() => {
    api
      .get(
        `/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='${formatFirstDay}'&@dataFinalCotacao='${selectValue}'&$top=100&$format=json`
      )
      .then((response) => setPeriod(response.data))
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }, [formatFirstDay, selectValue]);

  return (
    <div className="container">
      <h1>COTAÇÃO DO DÓLAR</h1>
      <div>
        <h3>Pesquisa por data</h3>
        <form>
          <input type={"date"} onChange={(e) => getDate(e)}></input>
        </form>

        {day?.value.map((item) => {
          return (
            <div key={item.dataHoraCotacao}>
              <p>{moment(item?.dataHoraCotacao).format("DD/MM/YYYY")}</p>
              <p>
                Compra: R$ {item?.cotacaoCompra.toLocaleString()} / Venda: R${" "}
                {item?.cotacaoVenda.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      <div>
        <h3>Pesquisa por período</h3>
        <form>
          <input type={"date"} onChange={(e) => getInitialDate(e)}></input>
          <select onChange={(e) => getFinalDate(e)}>
            <option selected>Pesquisar</option>
            {list.map((item) => (
              <option value={item.value}>{item.name}</option>
            ))}
          </select>
        </form>

        <div className="table">
          {period?.value.map((item) => {
            return (
              <div key={item.dataHoraCotacao} className="item">
                <tr>
                  <th className="tableTitle">Data</th>
                  <th className="tableTitle">Compra</th>
                  <th className="tableTitle">Venda</th>
                </tr>
                <tr>
                  <th className="date">
                    {moment(item?.dataHoraCotacao).format("DD/MM/YYYY")}
                  </th>
                  <th>R$ {item?.cotacaoCompra.toLocaleString()}</th>
                  <th>R$ {item?.cotacaoVenda.toLocaleString()}</th>
                </tr>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
